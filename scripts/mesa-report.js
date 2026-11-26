#!/usr/bin/env node
/* Leitura da Mesa DeFi fora do navegador — Barolo Capital (só LEITURA: não grava nada).
 * Roda o MESMO código da mesa.html (o <script> principal da página, num vm com DOM falso),
 * então regime, sugestões de ação e alertas saem idênticos aos da tela — sem cópia da lógica.
 * Usado pela rotina diária (agentes/mesa.md) e por quem quiser a leitura no terminal.
 *   node scripts/mesa-report.js           → texto
 *   node scripts/mesa-report.js --json    → objeto
 *   node scripts/mesa-report.js --history → ÚNICA escrita: 1 ponto/dia em quant.json → verdictHistory
 *     ({d, r, v:{nome: veredito}}, últimos 400 dias), só se preços, AAVE e Kamino vieram completos.
 *     A Mesa usa isso para mostrar "Excelente desde dd/mm".
 * Fontes ao vivo: preços em cascata (scripts/lib/spot-prices.js), AAVE V4 e Kamino on-chain
 * (lib/barolo-chain.js). Arquivos: data.js, quant.json, yields.json, briefing.json, networth-history.json. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'data.js'));
const D = global.window.BAROLO_DATA;
const Core = require(path.join(ROOT, 'lib/barolo-core.js'));
const Chain = require(path.join(ROOT, 'lib/barolo-chain.js'));
const { spotPrices } = require('./lib/spot-prices.js');
const readJSON = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };

function pageScript() {
  const html = fs.readFileSync(path.join(ROOT, 'mesa.html'), 'utf8');
  const s = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(x => x.includes('function buildActions'));
  if (!s) throw new Error('mesa.html sem o script principal (buildActions)');
  return s;
}
function fakeDocument() {
  const els = {}, vals = { labH: '30', labK: '1.5', labCap: '', sE: '0', sS: '0', sB: '0' };
  const mk = id => ({ id, innerHTML: '', textContent: '', value: vals[id] != null ? vals[id] : '', placeholder: '', style: {},
    children: [], firstChild: { appendChild() {} }, classList: { toggle() {}, add() {}, remove() {} },
    scrollIntoView() {}, appendChild() {}, querySelectorAll: () => [] });
  return { getElementById: id => (els[id] = els[id] || mk(id)), querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, createElement: () => mk('x'), documentElement: { getAttribute: () => 'dark' } };
}
const strip = h => String(h || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

async function main() {
  const ids = [...new Set(D.holdings.concat(D.stables).map(h => h.cgId))];
  const assets = D.holdings.concat(D.stables).map(h => ({ cgId: h.cgId, ticker: h.ticker }));
  const nwHist = readJSON('networth-history.json');
  const last = nwHist && nwHist.history && nwHist.history[nwHist.history.length - 1];
  const _log = console.log, _warn = console.warn; console.log = console.warn = () => {};   // as libs logam cada leitura
  const [sp, aave, kam] = await Promise.all([
    spotPrices(assets, { lastKnown: (last && last.prices) || {}, log: () => {} }).catch(() => null),
    Chain.fetchAave().catch(() => null),
    Chain.fetchKamino({ withApys: true }).catch(() => null)
  ]);
  console.log = _log; console.warn = _warn;
  const px = {};
  if (sp) for (const id of ids) if (sp.usd[id] != null) px[id] = { usd: sp.usd[id], usd_24h_change: sp.change24[id] };
  let hype = null;
  try { const r = await fetch('https://api.exchange.coinbase.com/products/HYPE-USD/stats', { headers: { 'User-Agent': 'Mozilla/5.0' } }); const h = await r.json(); if (+h.last > 0) hype = { usd: +h.last, chg: +h.open > 0 ? h.last / h.open - 1 : null }; } catch (e) {}

  const ctx = vm.createContext({
    console: { log() {}, warn() {}, error() {} }, Intl, Math, Date, JSON, Number, String, Object, Array, isFinite, parseInt, parseFloat, encodeURIComponent,
    fetch: async () => { throw new Error('sem rede no vm'); }, setTimeout() {}, setInterval() {},
    BAROLO_DATA: D, BaroloCore: Core, BaroloChain: Chain,
    BaroloPrices: { get: async () => ({}), poll() {} }, BaroloUI: { currentTheme: () => 'dark', toggleTheme() {} },
    document: fakeDocument()
  });
  ctx.window = ctx;
  vm.runInContext(pageScript(), ctx, { filename: 'mesa.html#main' });
  const S = ctx.S;
  S.px = px; S.pxAt = Date.now(); S.hype = hype;
  if (aave) { S.aave = aave; S.chainAt = Date.now(); }
  if (kam && kam.position) { S.kam = kam; S.chainAt = Date.now(); }
  S.q = readJSON('quant.json'); S.y = readJSON('yields.json'); S.b = readJSON('briefing.json'); S.nw = nwHist;

  const L = ctx.live(); S.L = L;
  const R = ctx.regime();
  const cards = ctx.buildActions(L).map(c => ({ frente: c.id, titulo: c.t,
    itens: c.rows.map(r => ({ nome: r.name, veredito: r.g.label, nota: Math.round(r.g.score * 100), veto: r.g.veto || r.g.cap || null,
      criterios: r.g.crit.map(k => ({ ok: k.ok, txt: strip(k.txt), val: strip(k.val) })) })) }));
  const alertas = ctx.buildAlerts(L).map(a => ({ nivel: a.lvl, tag: a.tag, titulo: strip(a.title), texto: strip(a.html) }));
  return {
    data: new Date().toISOString(), posicoes: D.asOf,
    fontes: { precos: Object.keys(px).length + '/' + ids.length, aave: !!aave, kamino: !!(kam && kam.position),
      quant: S.q && S.q.generatedAt, yields: S.y && S.y.generatedAt },
    precos: { BTC: L.P.BTC, ETH: L.P.ETH, SOL: L.P.SOL, HYPE: hype && hype.usd },
    regime: { nome: R.name, score: R.score, fng: R.fng, trend: R.trend },
    liquidez: S.q && S.q.liquidity ? { faixa: S.q.liquidity.band, aFavor: S.q.liquidity.favor, piso: S.q.liquidity.floor, data: S.q.liquidity.date } : null,
    posicao: { patrimonio: L.nw.netWorth, divida: L.aDebt + L.kDebt, hf: L.hf, kLtv: L.kLtv, liqSol: L.liqSol, liqEth: L.liqEth, carryMes: L.carryMo },
    sugestoes: cards, alertas
  };
}

function saveHistory(o) {
  const f = path.join(ROOT, 'quant.json'), q = readJSON('quant.json');
  const [a, b] = o.fontes.precos.split('/');
  if (!q || a !== b || !o.fontes.aave || !o.fontes.kamino) { console.log('histórico: fontes incompletas (' + o.fontes.precos + ', AAVE ' + o.fontes.aave + ', Kamino ' + o.fontes.kamino + ') — não gravado'); return; }
  const d = o.data.slice(0, 10), v = {};
  for (const c of o.sugestoes) for (const r of c.itens) v[r.nome] = r.veredito;
  const h = (Array.isArray(q.verdictHistory) ? q.verdictHistory : []).filter(x => x.d !== d);
  h.push({ d, r: o.regime.nome, v });
  h.sort((x, y) => x.d.localeCompare(y.d));
  q.verdictHistory = h.slice(-400);
  fs.writeFileSync(f, JSON.stringify(q) + String.fromCharCode(10));
  console.log('histórico: ' + d + ' gravado (' + Object.keys(v).length + ' vereditos, ' + q.verdictHistory.length + ' dias)');
}

main().then(o => {
  if (process.argv.includes('--history')) { saveHistory(o); return; }
  if (process.argv.includes('--json')) { console.log(JSON.stringify(o, null, 1)); return; }
  const us = x => x == null ? '—' : 'US$ ' + Math.round(x).toLocaleString('pt-BR');
  const L = [];
  L.push('MESA DeFi · ' + o.data.slice(0, 10) + ' · posições ' + o.posicoes + ' · fontes: preços ' + o.fontes.precos + ', AAVE ' + (o.fontes.aave ? 'on-chain' : 'data.js') + ', Kamino ' + (o.fontes.kamino ? 'on-chain' : 'data.js'));
  L.push('Regime: ' + o.regime.nome + ' (score ' + o.regime.score.toFixed(2) + ', F&G ' + o.regime.fng + ')');
  L.push('Liquidez americana: ' + (o.liquidez ? o.liquidez.faixa + ' (' + o.liquidez.aFavor + '/5 a favor, FRED ' + o.liquidez.data + ') -> piso do looping HF ' + o.liquidez.piso.hf + ' / ' + o.liquidez.piso.sigma + ' sigma' : 'sem leitura -> piso neutro HF 3 / 2 sigma'));
  L.push('Posição: patrimônio ' + us(o.posicao.patrimonio) + ' · dívida ' + us(o.posicao.divida) + ' · HF ' + (o.posicao.hf ? o.posicao.hf.toFixed(2) : '—') + ' · LTV Kamino ' + (o.posicao.kLtv * 100).toFixed(1) + '% · SOL liquida ' + us(o.posicao.liqSol) + ' · carry ' + us(o.posicao.carryMes) + '/mês', '');
  for (const c of o.sugestoes) {
    L.push(c.titulo.toUpperCase());
    for (const r of c.itens) L.push('  ' + r.veredito.padEnd(18) + ' ' + String(r.nota).padStart(3) + '  ' + r.nome + (r.veto ? '  [' + r.veto + ']' : ''));
  }
  L.push('', 'ALERTAS');
  for (const a of o.alertas) L.push('  [' + a.nivel + '] ' + a.tag + ': ' + a.titulo);
  console.log(L.join('\n'));
}).catch(e => { console.error('ERRO', e.message); process.exit(1); });
