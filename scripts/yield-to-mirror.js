#!/usr/bin/env node
/**
 * yield-to-mirror.js — quanto falta lancar no CoinGecko.
 *
 * Combinado com o Lucas em 05/09/2026: TODO FECHAMENTO DE MES passar a soma do
 * yield de lending que precisa ser alterado no CoinGecko.
 *
 * Por que existe: `holdings`/`stables` do data.js acompanham o SUPPLY dos
 * protocolos — quando AAVE/Kamino pagam juros, a qty sobe aqui na hora (custo
 * zero). O CoinGecko nao acompanha isso sozinho; o Lucas lanca manualmente como
 * "transferencia de entrada" com custo 0. `cgMirror` guarda a qty como esta la,
 * entao a diferenca e exatamente o que falta lancar.
 *
 * Uso:  node scripts/yield-to-mirror.js
 *       node scripts/yield-to-mirror.js --json
 *
 * Precos: CoinGecko (so para mostrar o valor em USD). Se a rede falhar, o
 * relatorio sai mesmo assim, sem a coluna de USD.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_OUT = process.argv.includes('--json');

const sandbox = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'))(sandbox);
const B = sandbox.BAROLO_DATA;
if (!B) { console.error('ERRO: BAROLO_DATA nao carregou'); process.exit(1); }

const all = (B.holdings || []).concat(B.stables || []);
const mirror = B.cgMirror || {};

// Tolerancia: diferencas abaixo disto sao ruido de arredondamento, nao yield.
const EPS = 1e-8;

const pend = [];
for (const h of all) {
  if (!(mirror[h.ticker] > 0)) continue;          // sem espelho -> assume igual
  const delta = h.qty - mirror[h.ticker];
  if (delta > EPS) pend.push({ ticker: h.ticker, cgId: h.cgId, cg: mirror[h.ticker], site: h.qty, delta: delta });
  else if (delta < -EPS) pend.push({ ticker: h.ticker, cgId: h.cgId, cg: mirror[h.ticker], site: h.qty, delta: delta, aviso: 'NEGATIVO — o CoinGecko tem MAIS que o site; conferir antes de lancar' });
}

(async () => {
  let prices = {};
  if (pend.length) {
    try {
      const ids = [...new Set(pend.map(p => p.cgId))].join(',');
      const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
        { signal: AbortSignal.timeout(10000) });
      if (r.ok) prices = await r.json();
    } catch (e) { /* segue sem USD */ }
  }
  const usdOf = p => (prices[p.cgId] && prices[p.cgId].usd) ? p.delta * prices[p.cgId].usd : null;
  const totalUsd = pend.reduce((s, p) => s + (usdOf(p) || 0), 0);

  if (JSON_OUT) {
    console.log(JSON.stringify({ asOf: B.asOf, pendencias: pend.map(p => ({ ...p, usd: usdOf(p) })), totalUsd }, null, 2));
    return;
  }

  console.log('\n═══ YIELD A LANCAR NO COINGECKO ═══');
  console.log(`base do data.js: ${B.asOf}\n`);
  if (!pend.length) {
    console.log('Nada pendente — o CoinGecko esta em dia com o site.\n');
    return;
  }
  for (const p of pend) {
    const usd = usdOf(p);
    console.log(`  ${p.ticker.padEnd(5)} lancar +${p.delta.toFixed(6)}` +
      (usd !== null ? `  (~US$ ${usd.toFixed(2)})` : '') +
      `\n        CoinGecko ${p.cg}  ->  ${p.site}` +
      (p.aviso ? `\n        ⚠ ${p.aviso}` : ''));
  }
  if (totalUsd > 0) console.log(`\n  TOTAL: ~US$ ${totalUsd.toFixed(2)} a lancar como transferencia de entrada (custo ZERO).`);
  console.log('\nDepois de lancar: atualizar `cgMirror` no data.js igualando as qty do holding.\n');
})();
