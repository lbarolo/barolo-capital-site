#!/usr/bin/env node
/**
 * close-month.js — fechamento mensal AUTOMATICO da curva de patrimonio.
 *
 * Por que existe: ate 09/2026 o ponto mensal de `wealthCurve` era digitado a mao
 * a partir de um print. Duas coisas davam errado com isso:
 *   1. Esquecer de fazer -> a curva atrasava (o index chegou a ficar 3 meses para
 *      tras, e como ela alimenta CAGR/TIR do hero, a landing publica mentia).
 *   2. Cada sessao interpretava a definicao de um jeito -> 07/26 e 08/26 entraram
 *      como patrimonio LIQUIDO (depois da divida) enquanto todo o resto da serie
 *      e patrimonio BRUTO (antes da divida). Um degrau falso de ~US$ 1.525 no meio
 *      da serie contamina retorno mensal, anual, TWR, XIRR, drawdown e benchmark.
 *
 * A definicao agora e UMA so, e e a maquina que aplica:
 *   valor do mes = ultimo snapshot do mes em networth-history.json
 *                = gross (holdings x preco, ja inclui colateral DeFi)
 *                + stables + LP (pooled + fees nao coletadas)
 *                ANTES da divida
 *   aporte do mes = soma de BAROLO_DATA.contributions com data naquele mes
 *
 * Uso:
 *   node scripts/close-month.js            # aplica (escreve data.js)
 *   node scripts/close-month.js --dry-run  # so mostra o que faria
 *
 * Roda todo dia 1 pela Action .github/workflows/close-month.yml.
 * Idempotente: rodar duas vezes no mesmo mes nao muda nada.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data.js');
const HIST = path.join(ROOT, 'networth-history.json');
const DRY  = process.argv.includes('--dry-run');

// Um snapshot so vale como "fechamento" se for do dia 25 em diante — antes disso
// e meio de mes e nao representa o fechamento.
const MIN_DAY_FOR_CLOSE = 25;

const r0 = n => Math.round(n);
const label = ym => ym.slice(5, 7) + '/' + ym.slice(2, 4);

function fail(msg) { console.error('ERRO: ' + msg); process.exit(1); }

// ── 1. Carrega as duas fontes ────────────────────────────────────────────────
const src = fs.readFileSync(DATA, 'utf8');
const sandbox = {};
new Function('window', src)(sandbox);
const B = sandbox.BAROLO_DATA;
if (!B || !B.wealthCurve) fail('BAROLO_DATA.wealthCurve nao carregou do data.js');

const wc = B.wealthCurve;
if (wc.labels.length !== wc.values.length || wc.labels.length !== wc.invested.length) {
  fail(`arrays de wealthCurve com tamanhos diferentes (${wc.labels.length}/${wc.values.length}/${wc.invested.length})`);
}

let hist;
try { hist = JSON.parse(fs.readFileSync(HIST, 'utf8')).history || []; }
catch (e) { fail('nao consegui ler networth-history.json: ' + e.message); }
if (!hist.length) fail('networth-history.json vazio');

// ── 2. Ultimo snapshot de cada mes ───────────────────────────────────────────
const byMonth = new Map(); // 'YYYY-MM' -> snapshot mais recente do mes
for (const p of hist) {
  if (!p || !p.date) continue;
  const ym = p.date.slice(0, 7);
  const prev = byMonth.get(ym);
  if (!prev || p.date > prev.date) byMonth.set(ym, p);
}

const today = new Date();
const currentYm = today.toISOString().slice(0, 7);

const bruto = p => (Number(p.gross) || 0) + (Number(p.stables) || 0) + (Number(p.lp) || 0);

// ── 3. Aportes externos por mes (BAROLO_DATA.contributions) ──────────────────
const contribByMonth = {};
for (const c of (B.contributions || [])) {
  if (!c || !c.date || typeof c.usd !== 'number') continue;
  const ym = c.date.slice(0, 7);
  contribByMonth[ym] = (contribByMonth[ym] || 0) + c.usd;
}

// ── 4. Reconcilia meses ja existentes + acrescenta os que faltam ─────────────
const labels = wc.labels.slice();
const values = wc.values.slice();
const invested = wc.invested.slice();
const idxOf = {};
labels.forEach((l, i) => { idxOf[l] = i; });

const changes = [];
const months = [...byMonth.keys()].sort();

for (const ym of months) {
  if (ym === currentYm) continue;                       // mes corrente ainda nao fechou
  const snap = byMonth.get(ym);
  const day = Number(snap.date.slice(8, 10));
  if (day < MIN_DAY_FOR_CLOSE) continue;                // sem snapshot de fim de mes
  const v = r0(bruto(snap));
  if (!(v > 0)) continue;

  const l = label(ym);
  const i = idxOf[l];

  if (i === undefined) {
    // Mes novo: entra no fim. Aporte = acumulado anterior + aportes do mes.
    const prevInv = invested.length ? invested[invested.length - 1] : 0;
    const add = r0(contribByMonth[ym] || 0);
    labels.push(l); values.push(v); invested.push(prevInv + add);
    idxOf[l] = labels.length - 1;
    changes.push(`+ ${l}  valor ${v}  aporte ${prevInv + add}${add ? ` (+${add} no mes)` : ' (sem aporte novo)'}  [snapshot ${snap.date}]`);
  } else if (values[i] !== v) {
    // Mes ja existente que diverge da definicao unica: corrige o valor.
    // NAO mexe em `invested` — a serie de aportes e historica e manual.
    changes.push(`~ ${l}  valor ${values[i]} -> ${v}  (definicao unica: bruto antes da divida) [snapshot ${snap.date}]`);
    values[i] = v;
  }
}

if (!changes.length) {
  console.log('Nada a fazer — a curva ja esta fechada e consistente ate ' + labels[labels.length - 1] + '.');
  process.exit(0);
}

console.log('Fechamento mensal — mudancas:');
changes.forEach(c => console.log('  ' + c));

if (DRY) { console.log('\n--dry-run: nada foi escrito.'); process.exit(0); }

// ── 5. Reescreve os tres arrays dentro do bloco wealthCurve ──────────────────
function replaceArray(text, key, arr, quote) {
  const body = quote
    ? arr.map(x => `'${x}'`).join(',')
    : arr.join(',');
  // Casa a linha `    <key>: [...]` DENTRO do bloco wealthCurve (indentacao de 4).
  const re = new RegExp(`(\\n\\s*${key}:\\s*)\\[[^\\]]*\\]`);
  if (!re.test(text)) fail(`nao encontrei o array \`${key}\` no data.js`);
  return text.replace(re, `$1[${body}]`);
}

const wcStart = src.indexOf('wealthCurve: {');
if (wcStart < 0) fail('bloco wealthCurve nao encontrado no data.js');
const wcEnd = src.indexOf('},', wcStart);
if (wcEnd < 0) fail('fim do bloco wealthCurve nao encontrado');

let block = src.slice(wcStart, wcEnd);
block = replaceArray(block, 'labels', labels, true);
block = replaceArray(block, 'values', values, false);
block = replaceArray(block, 'invested', invested, false);

const out = src.slice(0, wcStart) + block + src.slice(wcEnd);

// Sanity: o arquivo tem que continuar carregando e com os 3 arrays alinhados.
const check = {};
try { new Function('window', out)(check); }
catch (e) { fail('o data.js reescrito nao carrega: ' + e.message); }
const w2 = check.BAROLO_DATA && check.BAROLO_DATA.wealthCurve;
if (!w2 || w2.labels.length !== labels.length || w2.values.length !== labels.length || w2.invested.length !== labels.length) {
  fail('o data.js reescrito ficou inconsistente — nada foi salvo');
}

fs.writeFileSync(DATA, out);
console.log(`\nOK: data.js atualizado — ${labels.length} pontos, ultimo ${labels[labels.length - 1]} = US$ ${values[values.length - 1]} (aporte acumulado US$ ${invested[invested.length - 1]}).`);
