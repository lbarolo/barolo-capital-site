#!/usr/bin/env node
/**
 * yield-to-mirror.js — o que falta lancar no CoinGecko.
 *
 * Combinado com o Lucas em 05/09/2026: TODO FECHAMENTO DE MES passar a soma do
 * que precisa ser alterado no CoinGecko.
 *
 * Por que existe: `holdings`/`stables` do data.js acompanham o SUPPLY dos
 * protocolos — quando AAVE/Kamino pagam juros, a qty sobe aqui na hora (custo
 * zero). O CoinGecko nao acompanha isso sozinho. `cgMirror` guarda a qty como
 * esta la, entao a diferenca e o que falta lancar.
 *
 * ⚡ DESDE 27/11/2026 O RELATORIO SEPARA DUAS NATUREZAS (pedido do Lucas), porque
 * elas se lancam de formas diferentes e misturar infla o lucro:
 *
 *   COMPRA -> lancamento de compra, COM o custo pago. Vem de `cgPendingBuys` no
 *             data.js, que lista o que o site SABE ser compra ainda nao lancada.
 *   YIELD  -> transferencia de entrada, CUSTO ZERO. E o resto do delta.
 *
 * Antes disto, uma compra de US$ 50 pendente aparecia como "US$ 50 a lancar como
 * transferencia de entrada (custo ZERO)" — e lancar assim criaria US$ 50 de lucro
 * fantasma no CoinGecko.
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

// Compras pendentes agrupadas por ticker (qty bruta da ordem + custo pago).
const buys = {};
for (const b of (B.cgPendingBuys || [])) {
  const k = b.ticker;
  if (!buys[k]) buys[k] = { qty: 0, usd: 0, dates: [] };
  buys[k].qty += b.qty;
  buys[k].usd += (b.usd || 0);
  if (b.date) buys[k].dates.push(b.date);
}

const pend = [];
for (const h of all) {
  if (!(mirror[h.ticker] > 0)) continue;          // sem espelho -> assume igual
  const delta = h.qty - mirror[h.ticker];
  const buy = buys[h.ticker] || null;
  if (Math.abs(delta) <= EPS && !buy) continue;
  const p = {
    ticker: h.ticker, cgId: h.cgId, cg: mirror[h.ticker], site: h.qty, delta: delta,
    buyQty: buy ? buy.qty : 0, buyUsd: buy ? buy.usd : 0,
    buyDates: buy ? buy.dates : [],
    yieldQty: delta - (buy ? buy.qty : 0)
  };
  if (delta < -EPS) p.aviso = 'NEGATIVO — o CoinGecko tem MAIS que o site. Investigar antes de lancar.';
  // A compra pendente nao pode passar do delta: ou ela ja foi lancada e ficou
  // esquecida em `cgPendingBuys`, ou o `cgMirror` do token esta errado.
  if (p.buyQty > EPS && p.buyQty > delta + EPS) p.aviso = 'COMPRA PENDENTE MAIOR QUE O DELTA — a compra ja foi lancada (limpar cgPendingBuys) ou o cgMirror esta errado.';
  pend.push(p);
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
  const px = p => (prices[p.cgId] && prices[p.cgId].usd) || null;
  const usdOf = (p, qty) => px(p) !== null ? qty * px(p) : null;

  // Diferenca NEGATIVA e pequena nao e pendencia: e a qty bruta vs liquida (o CoinGecko conta o
  // bruto da ordem, o site desconta gas e taxa) ou arredondamento de um lancamento antigo. Isso
  // nunca se lanca e aparecia como "⚠ NEGATIVO" todo mes, mascarando o que importa. Acima do
  // limiar continua alertando, porque ai pode ser lancamento duplicado - como o BTC em 21/11/2026.
  // Negativo: ate US$ 5 e estrutural (gas/taxa). Positivo: so ate US$ 0,50, porque ai pode ser
  // yield de verdade, mesmo que pequeno - acima disso vale lancar.
  const RUIDO_NEG = 5, RUIDO_POS = 0.50;
  const compras = [], rendas = [], ruido = [];
  for (const p of pend) {
    if (p.buyQty > EPS) compras.push(p);
    const y = p.yieldQty;
    if (Math.abs(y) <= EPS) continue;
    const usd = usdOf(p, y);
    // Sem preco (CoinGecko fora do ar ou rate limit) cai no relativo: diferenca abaixo de 0,5% da
    // posicao e ruido de arredondamento, nao yield.
    const lim = y < 0 ? RUIDO_NEG : RUIDO_POS;
    const eRuido = usd !== null ? Math.abs(usd) < lim : Math.abs(y) / p.site < 0.005;
    (eRuido ? ruido : rendas).push(p);
  }

  const totalCompraUsd = compras.reduce((s, p) => s + p.buyUsd, 0);
  // Total do yield = SO os positivos (decisao do Lucas, 31/10/2026). Delta negativo nao e
  // yield — e a qty bruta vs liquida das compras (taxa) ou lancamento faltando — e nunca
  // se lanca, entao somar no total daria um numero que ele nao pode usar como lista.
  const totalYieldUsd = rendas.reduce((s, p) => s + (p.yieldQty > 0 ? (usdOf(p, p.yieldQty) || 0) : 0), 0);

  if (JSON_OUT) {
    console.log(JSON.stringify({
      asOf: B.asOf,
      compras: compras.map(p => ({ ticker: p.ticker, qty: p.buyQty, usd: p.buyUsd, dates: p.buyDates })),
      yield: pend.filter(p => Math.abs(p.yieldQty) > EPS)
                 .map(p => ({ ticker: p.ticker, qty: p.yieldQty, usd: usdOf(p, p.yieldQty), cg: p.cg, site: p.site, aviso: p.aviso })),
      totalCompraUsd, totalYieldUsd
    }, null, 2));
    return;
  }

  const dec = v => { const a = Math.abs(v); return a >= 100 ? 2 : a >= 1 ? 3 : 6; };

  console.log('\n═══ A LANCAR NO COINGECKO ═══');
  console.log(`base do data.js: ${B.asOf}\n`);
  if (!compras.length && !rendas.length && !ruido.length) {
    console.log('Nada pendente — o CoinGecko esta em dia com o site.\n');
    return;
  }

  if (compras.length) {
    console.log('  COMPRAS — lancar COM o custo pago (nao e transferencia de entrada):');
    for (const p of compras) {
      console.log(`     ${p.ticker.padEnd(5)} +${p.buyQty.toFixed(dec(p.buyQty))}  por US$ ${p.buyUsd.toFixed(2)}` +
        (p.buyDates.length ? `   (${p.buyDates.join(', ')})` : ''));
    }
    console.log('');
  }

  if (rendas.length) {
    console.log('  YIELD — transferencia de entrada, CUSTO ZERO:');
    for (const p of rendas) {
      const usd = usdOf(p, p.yieldQty);
      console.log(`     ${p.ticker.padEnd(5)} ${p.yieldQty > 0 ? '+' : '−'}${Math.abs(p.yieldQty).toFixed(dec(p.yieldQty))}` +
        (usd !== null ? `  (~US$ ${usd.toFixed(2)})` : '') +
        `\n           CoinGecko ${p.cg}  ->  ${p.site}` +
        (p.aviso ? `\n           ⚠ ${p.aviso}` : ''));
    }
    console.log('');
  }

  if (ruido.length) {
    console.log('  — diferencas estruturais, NAO lancar (gas/taxa/arredondamento):');
    for (const p of ruido) {
      const usd = usdOf(p, p.yieldQty);
      console.log(`     ${p.ticker.padEnd(5)} ${p.yieldQty.toFixed(8)}` + (usd !== null ? `  (US$ ${usd.toFixed(2)})` : '') +
        (p.aviso ? `\n           ⚠ ${p.aviso}` : ''));
    }
    console.log('');
  }

  if (!compras.length && !rendas.length) console.log('  Nada a lancar.\n');

  if (totalCompraUsd > 0 || totalYieldUsd > 0) {
    const partes = [];
    if (totalCompraUsd > 0) partes.push(`compras US$ ${totalCompraUsd.toFixed(2)} (COM custo)`);
    if (totalYieldUsd > 0) partes.push(`yield US$ ${totalYieldUsd.toFixed(2)} (custo ZERO)`);
    console.log(`  TOTAL: ${partes.join('  +  ')}`);
  }
  console.log('\nDepois de lancar: igualar o `cgMirror` as qty do holding E apagar as');
  console.log('entradas de `cgPendingBuys` que ja foram lancadas.\n');
})();
