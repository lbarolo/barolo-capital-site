/* GERADO por tests/fixtures/build-legacy.js — NÃO EDITAR À MÃO.
   Código de cálculo LITERAL do commit 5ed73a1 (antes da refatoração de 14/09/2026),
   empacotado em funções para rodar isolado nos testes de equivalência. */

// ── portfolio_analytics.html ───────────────────────────────────────────────
function calculatePerformanceMetrics() {
 // Serie mensal + o mes CORRENTE ao vivo, pela MESMA funcao que a landing usa
 // (BAROLO_DATA.curveWithLive). Antes o dashboard ignorava o valor ao vivo e a
 // landing sobrescrevia o ultimo mes fechado — dois CAGR diferentes para o mesmo dado.
 const _live = (typeof _livePortfolioGross !== 'undefined' && _livePortfolioGross > 0) ? _livePortfolioGross : 0;
 const wc = (window.BAROLO_DATA && window.BAROLO_DATA.curveWithLive)
   ? window.BAROLO_DATA.curveWithLive(_live)
   : WEEKLY_UPDATE.wealthCurve;
 const labels = wc.labels;
 const values = wc.values;
 const invested = wc.invested;
 const bench = window.BENCHMARK_DATA || null;

 const metrics = {
  twr: 0,
  twrCumulative: 0,
  irr: 0,
  roic: 0,
  sharpe: 0,
  maxDD: 0,
  benchmarkReturn: 0,
  alpha: 0,
  volatility: 0,
 };

 if (!values || values.length < 2) return metrics;

 // ── TWR (Time-Weighted Return) ──
 // Modified Dietz: return = (EndValue - StartValue - NetAporte) / (StartValue + 0.5*NetAporte)
 // (assume aporte no meio do mês — mesma convenção usada em syncFromWealthCurve())
 const monthlyReturns = [];
 for (let i = 1; i < values.length; i++) {
  const startVal = values[i-1];
  const endVal = values[i];
  const netAporte = invested[i] - invested[i-1]; // aporte in this month
  const denom = startVal + 0.5 * netAporte;
  if (denom > 0) {
   const ret = (endVal - startVal - netAporte) / denom;
   monthlyReturns.push(ret);
  }
 }

 // Compound monthly returns geometrically
 let twrGross = 1;
 monthlyReturns.forEach(r => { twrGross *= (1 + r); });
 const totalMonths = monthlyReturns.length;
 const totalYears = totalMonths / 12;
 metrics.twrCumulative = (twrGross - 1) * 100; // retorno total composto, sem anualizar
 if (totalYears > 0) {
  metrics.twr = (Math.pow(twrGross, 1 / totalYears) - 1) * 100;
 }

 // ── Volatility (std dev of monthly returns, annualized) ──
 if (monthlyReturns.length > 0) {
  const avgRet = monthlyReturns.reduce((s, r) => s + r, 0) / monthlyReturns.length;
  const variance = monthlyReturns.reduce((s, r) => s + Math.pow(r - avgRet, 2), 0) / monthlyReturns.length;
  const monthlyVol = Math.sqrt(variance);
  metrics.volatility = monthlyVol * Math.sqrt(12) * 100; // annualize
 }

 // ── Sharpe Ratio (assuming 2% risk-free rate) ──
 const riskFreeRate = 0.02;
 if (metrics.volatility > 0) {
  metrics.sharpe = (metrics.twr / 100 - riskFreeRate) / (metrics.volatility / 100);
 }

 // ── Max Drawdown ──
 let maxPrice = values[0];
 let maxDD = 0;
 for (let i = 1; i < values.length; i++) {
  if (values[i] > maxPrice) maxPrice = values[i];
  const dd = (values[i] - maxPrice) / maxPrice;
  if (dd < maxDD) maxDD = dd;
 }
 metrics.maxDD = maxDD * 100;

 // ── ROIC (Return On Invested Capital) ──
 const finalValue = values[values.length - 1];
 const totalInvested = invested[invested.length - 1];
 const avgInvested = invested.reduce((s, v) => s + v, 0) / invested.length;
 if (avgInvested > 0) {
  metrics.roic = ((finalValue - totalInvested) / avgInvested) * 100;
 }

 // ── Benchmark (50% BTC + 50% ETH) — MESMOS APORTES, MESMAS DATAS ──
 // CORREÇÃO 20/08/2026: antes isto era o retorno de PREÇO do índice (buy-and-hold desde
 // Jan/22, sem aporte nenhum) comparado contra o IRR do portfólio, que credita o timing do
 // DCA. Maçã com laranja — e o alpha herdava o erro. Agora o benchmark é simulado com o
 // mesmo fluxo de caixa do portfólio (metade de cada aporte em BTC, metade em ETH) e medido
 // com o MESMO XIRR, então benchmark e IRR são diretamente comparáveis. Mesma metodologia
 // do gráfico "Benchmark de aporte equivalente" logo abaixo — os dois passam a concordar.
 if (bench && bench.btcUsd && bench.ethUsd && bench.btcUsd.length > 0 && bench.ethUsd.length > 0) {
  let unitsBtc = 0, unitsEth = 0;
  const bCf = [], bT = [];
  for (let i = 0; i < values.length; i++) {
   const contrib = i === 0 ? invested[0] : Math.max(0, invested[i] - invested[i-1]);
   if (bench.btcUsd[i] > 0) unitsBtc += (contrib * 0.5) / bench.btcUsd[i];
   if (bench.ethUsd[i] > 0) unitsEth += (contrib * 0.5) / bench.ethUsd[i];
   bCf.push(-contrib);
   bT.push(i / 12);
  }
  const lastI = values.length - 1;
  const benchFinal = unitsBtc * (bench.btcUsd[lastI] || 0) + unitsEth * (bench.ethUsd[lastI] || 0);
  if (benchFinal > 0) {
   bCf[bCf.length - 1] += benchFinal;
   const bRate = computeXIRR(bCf, bT);
   if (bRate !== null) metrics.benchmarkReturn = bRate * 100;
  }
 }

 // ── IRR real (Money-Weighted Return, XIRR) ──
 // Fluxo de caixa: cada aporte mensal é uma saída (negativo, dinheiro do investidor entrando
 // no portfólio); o valor final é uma entrada (positivo, o que se resgataria hoje). Resolve
 // r tal que Σ CF_i / (1+r)^t_i = 0 via bisseção (robusto — não precisa de derivada).
 const cfCashflows = [], cfTimes = [];
 for (let i = 0; i < values.length; i++) {
  const contrib = i === 0 ? invested[0] : (invested[i] - invested[i-1]);
  cfCashflows.push(-contrib);
  cfTimes.push(i / 12);
 }
 cfCashflows[cfCashflows.length - 1] += values[values.length - 1]; // resgate no valor atual
 const xirrRate = computeXIRR(cfCashflows, cfTimes);
 metrics.irr = xirrRate !== null ? xirrRate * 100 : metrics.twr; // fallback se a bisseção falhar

 // Alpha = IRR do portfólio − IRR do benchmark de aporte equivalente. Definido AQUI (e não
 // junto do benchmark) porque depende do IRR. Uma definição só: o card lê metrics.alpha.
 metrics.alpha = metrics.irr - metrics.benchmarkReturn;

 return metrics;
}

function computeXIRR(cashflows, times) {
 function npv(r) {
  let sum = 0;
  for (let i = 0; i < cashflows.length; i++) sum += cashflows[i] / Math.pow(1 + r, times[i]);
  return sum;
 }
 let lo = -0.99, hi = 10;
 let nLo = npv(lo), nHi = npv(hi);
 if (!isFinite(nLo) || !isFinite(nHi) || nLo * nHi > 0) return null;
 for (let iter = 0; iter < 100; iter++) {
  const mid = (lo + hi) / 2;
  const nMid = npv(mid);
  if (Math.abs(nMid) < 1e-6) return mid;
  if ((nLo < 0) === (nMid < 0)) { lo = mid; nLo = nMid; } else { hi = mid; }
 }
 return (lo + hi) / 2;
}

function legacyPortfolioTable(W, MONTHLY_RETURNS_DATA) {
 W.wealthCurve.labels.forEach(function(lbl){
   var year = 2000 + parseInt(lbl.split('/')[1], 10);
   if (!MONTHLY_RETURNS_DATA[year]) MONTHLY_RETURNS_DATA[year] = new Array(12).fill(null);
 });
 // Sync monthly returns from wealthCurve — ensures heatmap and annual chart stay consistent
 // with the tracked portfolio values. Jan of each year requires previous Dec, so starts at index 1.
 (function syncFromWealthCurve() {
   var wc = W.wealthCurve;
   for (var i = 1; i < wc.labels.length; i++) {
     var parts = wc.labels[i].split('/');
     var month = parseInt(parts[0], 10) - 1;
     var year  = 2000 + parseInt(parts[1], 10);
     if (!MONTHLY_RETURNS_DATA[year]) continue;
     if (!wc.values[i-1] || wc.values[i-1] <= 0) continue;
     // Modified Dietz: subtrai inflow (delta de invested) do numerador e assume aporte no meio
     // do mês (peso 0,5) no denominador — neutraliza o timing do aporte dentro do período.
     var inflow = (wc.invested[i] || 0) - (wc.invested[i-1] || 0);
     var denom = wc.values[i-1] + 0.5 * inflow;
     MONTHLY_RETURNS_DATA[year][month] = denom > 0
       ? parseFloat(((wc.values[i] - inflow - wc.values[i-1]) / denom * 100).toFixed(1))
       : null;
   }
 })();
  return MONTHLY_RETURNS_DATA;
}

// ── index.html (funções de dentro da IIFE do hero) ─────────────────────────
function monthlyTWRSeries(finalValue) {
    // Guard: com cache quente de precos, updateHeroReturn() pode rodar SINCRONAMENTE
    // antes de WEALTH_VALUES/INVESTED serem declaradas (estao depois desta IIFE).
    // Nesse caso devolve serie vazia; o proximo fetch recalcula com os dados prontos.
    if (typeof WEALTH_VALUES === 'undefined' || typeof INVESTED === 'undefined') return [];
    if (!WEALTH_VALUES.length || WEALTH_VALUES.length !== INVESTED.length) return [];
    // O mes corrente entra como ponto NOVO ao vivo (nao sobrescreve o ultimo mes
    // fechado, como fazia antes — isso apagava um mes inteiro da serie). A conta e
    // a mesma do dashboard: os dois chamam BAROLO_DATA.curveWithLive().
    var _c = (window.BAROLO_DATA && window.BAROLO_DATA.curveWithLive)
      ? window.BAROLO_DATA.curveWithLive(finalValue) : null;
    var values = _c ? _c.values.slice()   : WEALTH_VALUES.slice();
    var inv    = _c ? _c.invested.slice() : INVESTED.slice();
    if (!_c && typeof finalValue === 'number' && finalValue > 0) values[values.length - 1] = finalValue;
    var rets = [];
    for (var i = 1; i < values.length; i++) {
      var aporte = inv[i] - inv[i-1];
      var denom  = values[i-1] + 0.5 * aporte;
      if (denom > 0) rets.push((values[i] - values[i-1] - aporte) / denom);
    }
    return rets;
  }

function calculateCAGR(currentAssets) {
    var rets = monthlyTWRSeries(currentAssets);
    if (!rets.length) return null;                      // ainda sem dados: nao sobrescreve
    var growth = rets.reduce(function(acc, r){ return acc * (1 + r); }, 1);
    if (growth <= 0) return -100;
    return (Math.pow(growth, 12 / rets.length) - 1) * 100;
  }

function calculateRealReturn(currentAssets) {
    var rets = monthlyTWRSeries(currentAssets);
    if (!rets.length) return null;                      // ainda sem dados: nao sobrescreve
    var growth = rets.reduce(function(acc, r){ return acc * (1 + r); }, 1);
    // Inflacao ACUMULADA dos EUA no periodo. NAO derivar da tabela CPI_USA abaixo:
    // apesar do comentario dela dizer "accumulated since Jan/2022", os valores sao
    // interanuais (os 8,6 de 06/22 sao o pico YoY, nao acumulado) — usar de la daria
    // ~3% no lugar de ~20% e inflaria o retorno real em quase 20 pontos.
    // MANUTENCAO: atualizar no fechamento de cada ano (CPI-U, Jan/2022 -> hoje).
    var US_CPI_CUMULATIVE_PCT = 20.2;                   // Jan/2022 -> Mai/2026
    return (growth / (1 + US_CPI_CUMULATIVE_PCT / 100) - 1) * 100;
  }

function estimateIRR(values, invested) {
  var n = values.length;
  if (n < 2 || !invested || invested.length < n) return 0; // usa os primeiros n aportes
  // aporte incremental do mês t (o primeiro é o capital inicial)
  var contrib = [];
  for (var t = 0; t < n; t++) contrib.push(t === 0 ? invested[0] : invested[t] - invested[t - 1]);
  var terminal = values[n - 1];
  function npv(rm) {
    var s = 0;
    for (var t = 0; t < n; t++) s += -contrib[t] / Math.pow(1 + rm, t);
    return s + terminal / Math.pow(1 + rm, n - 1);
  }
  // npv decresce com a taxa → bisseção entre -99% e +100% ao mês
  var lo = -0.99, hi = 1.0;
  if (npv(lo) <= 0 || npv(hi) >= 0) return 0; // sem raiz no intervalo (ex: dados inconsistentes)
  for (var i = 0; i < 200; i++) {
    var mid = (lo + hi) / 2;
    if (npv(mid) > 0) lo = mid; else hi = mid;
  }
  var rm = (lo + hi) / 2;
  return (Math.pow(1 + rm, 12) - 1) * 100; // anualiza a taxa mensal
}

// ── relatorio.html ─────────────────────────────────────────────────────────
function legacyRelatorioTable(window) {
  var WEALTH_CURVE = null, MONTHLY_RETURNS = null;
(function(){
  var wc = window.BAROLO_DATA && window.BAROLO_DATA.wealthCurve;
  if (!wc || !wc.labels || wc.labels.length !== wc.values.length || wc.labels.length !== wc.invested.length) return;
  WEALTH_CURVE = { labels: wc.labels.slice(), values: wc.values.slice(), invested: wc.invested.slice() };
  var keys = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var mr = {};
  wc.labels.forEach(function(l){ var y = 2000 + parseInt(l.split('/')[1], 10); if (!mr[y]) { mr[y] = {}; keys.forEach(function(k){ mr[y][k] = null; }); } });
  for (var i = 1; i < wc.labels.length; i++) {
    var p = wc.labels[i].split('/'), m = parseInt(p[0], 10) - 1, y = 2000 + parseInt(p[1], 10);
    if (!(wc.values[i-1] > 0)) continue;
    var inflow = (wc.invested[i] || 0) - (wc.invested[i-1] || 0);
    var denom = wc.values[i-1] + 0.5 * inflow;
    mr[y][keys[m]] = denom > 0 ? +(((wc.values[i] - inflow - wc.values[i-1]) / denom) * 100).toFixed(1) : null;
  }
  MONTHLY_RETURNS = mr;
})();
  return MONTHLY_RETURNS;
}

// ── scripts/fetch-networth.js ──────────────────────────────────────────────
function legacyNetWorth(B, prices) {
  const val = a => a.qty * prices[a.cgId].usd;
  const gross   = B.holdings.reduce((s, a) => s + val(a), 0);
  const stables = B.stables.reduce((s, a) => s + val(a), 0);
  const uni = (B.defi && B.defi.uniswapV3) || {};
  const lp  = (uni.pooled || 0) + (uni.uncollectedFees || 0);
  const debt = B.debt.total;
  const netWorth = gross + stables + lp - debt;
  return { gross: gross, stables: stables, lp: lp, debt: debt, netWorth: netWorth };
}
