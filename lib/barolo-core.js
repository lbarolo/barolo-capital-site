/* ════════════════════════════════════════════════════════════════════════════
   lib/barolo-core.js — matemática de performance e de patrimônio, UMA implementação
   ════════════════════════════════════════════════════════════════════════════
   Antes (até 14/09/2026) estas contas existiam em cópias separadas:
     · retorno mensal Modified Dietz → 4 cópias (portfolio ×2, index, relatorio)
     · TIR/XIRR                       → 2 implementações diferentes (portfolio, index)
     · patrimônio líquido             → 2 cópias (scripts/fetch-networth.js, fetch-briefing.js)
   Cada correção precisava ser repetida em todas — e já houve divergência real
   (landing e dashboard mostrando CAGR diferente para o mesmo dado, 04–05/09/2026).

   Regras deste arquivo:
     · PURO: sem DOM, sem fetch, sem estado global. Só entra dado, só sai número.
     · Carrega no browser (<script src="lib/barolo-core.js"> → window.BaroloCore)
       e no Node (require('./lib/barolo-core.js')) — é o que permite testar.
     · As expressões aritméticas foram copiadas das versões originais na MESMA
       ordem de operações, para o resultado ser idêntico bit a bit (ver tests/).
   ════════════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BaroloCore = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  // ── Retorno mensal por Modified Dietz ──────────────────────────────────────
  // r_i = (V_i − V_{i−1} − A_i) / (V_{i−1} + 0,5·A_i), com A_i = aporte do mês
  // (invested_i − invested_{i−1}) assumido no meio do período. Meses com
  // denominador ≤ 0 são PULADOS. Devolve decimais (0.05 = +5%).
  function dietzReturns(values, invested) {
    var out = [];
    for (var i = 1; i < values.length; i++) {
      var aporte = invested[i] - invested[i - 1];
      var denom = values[i - 1] + 0.5 * aporte;
      if (denom > 0) out.push((values[i] - values[i - 1] - aporte) / denom);
    }
    return out;
  }

  // Tabela { ano: [12 meses] } em %, arredondada a 1 casa — o formato do heatmap
  // do dashboard e dos retornos do relatório. Jan de cada ano usa Dez anterior;
  // o primeiro mês da série fica null. Mês com base ≤ 0 fica null.
  function monthlyReturnsTable(labels, values, invested) {
    var table = {};
    labels.forEach(function (lbl) {
      var y = 2000 + parseInt(lbl.split('/')[1], 10);
      if (!table[y]) table[y] = new Array(12).fill(null);
    });
    for (var i = 1; i < labels.length; i++) {
      var parts = labels[i].split('/');
      var month = parseInt(parts[0], 10) - 1;
      var year = 2000 + parseInt(parts[1], 10);
      if (!values[i - 1] || values[i - 1] <= 0) continue;
      var inflow = (invested[i] || 0) - (invested[i - 1] || 0);
      var denom = values[i - 1] + 0.5 * inflow;
      table[year][month] = denom > 0
        ? parseFloat(((values[i] - inflow - values[i - 1]) / denom * 100).toFixed(1))
        : null;
    }
    return table;
  }

  // Produto (1+r) de uma série de retornos decimais.
  function compound(returns) {
    var g = 1;
    for (var i = 0; i < returns.length; i++) g *= (1 + returns[i]);
    return g;
  }

  // ── XIRR por bisseção ──────────────────────────────────────────────────────
  // Resolve r em Σ cashflows[i] / (1+r)^times[i] = 0 (times em anos).
  // Devolve a taxa ANUAL em decimal, ou null se não há troca de sinal no NPV
  // entre −99% e +1000% a.a. (não dá para bissectar com segurança).
  function xirr(cashflows, times) {
    function npv(r) {
      var sum = 0;
      for (var i = 0; i < cashflows.length; i++) sum += cashflows[i] / Math.pow(1 + r, times[i]);
      return sum;
    }
    var lo = -0.99, hi = 10;
    var nLo = npv(lo), nHi = npv(hi);
    if (!isFinite(nLo) || !isFinite(nHi) || nLo * nHi > 0) return null;
    for (var iter = 0; iter < 100; iter++) {
      var mid = (lo + hi) / 2;
      var nMid = npv(mid);
      if (Math.abs(nMid) < 1e-6) return mid;
      if ((nLo < 0) === (nMid < 0)) { lo = mid; nLo = nMid; } else { hi = mid; }
    }
    return (lo + hi) / 2;
  }

  // Fluxo de caixa mensal de uma curva: cada aporte é saída (negativo) e o valor
  // final é o resgate no último mês. O 1º aporte é o capital inicial.
  function curveCashflows(values, invested) {
    var cf = [], t = [];
    for (var i = 0; i < values.length; i++) {
      cf.push(-(i === 0 ? invested[0] : (invested[i] - invested[i - 1])));
      t.push(i / 12);
    }
    cf[cf.length - 1] += values[values.length - 1];
    return { cashflows: cf, times: t };
  }

  // TIR anual de uma curva, em %, ou null se não houver raiz entre −99% e +1000% a.a.
  // Nota (14/09/2026): a landing tinha uma TIR própria que bissectava a taxa MENSAL (faixa
  // anual de ~−100% a +409.500%). Passou a usar esta, a mesma do dashboard. Dentro da faixa
  // o resultado é o mesmo (diferença < 1e-4 p.p., ver tests/equivalence.test.js); fora dela
  // — carteira praticamente zerada ou ganho > 10x ao ano — agora devolve null.
  function curveIRRPct(values, invested) {
    if (!values || values.length < 2 || !invested || invested.length < values.length) return null;
    var f = curveCashflows(values, invested.slice(0, values.length));
    var r = xirr(f.cashflows, f.times);
    return r === null ? null : r * 100;
  }

  // ── Métricas do dashboard (aba Métricas / hero) ────────────────────────────
  // curve = { values, invested } (já com o mês corrente ao vivo, se houver);
  // bench = window.BENCHMARK_DATA ({ btcUsd, ethUsd } alinhados à curva) ou null.
  // Todos os campos em % (sharpe é adimensional).
  function performanceMetrics(curve, bench) {
    var values = curve.values;
    var invested = curve.invested;
    var metrics = {
      twr: 0, twrCumulative: 0, irr: 0, roic: 0, sharpe: 0,
      maxDD: 0, benchmarkReturn: 0, alpha: 0, volatility: 0
    };
    if (!values || values.length < 2) return metrics;

    // TWR — Modified Dietz composto geometricamente
    var monthlyReturns = dietzReturns(values, invested);
    var twrGross = compound(monthlyReturns);
    var totalYears = monthlyReturns.length / 12;
    metrics.twrCumulative = (twrGross - 1) * 100;
    if (totalYears > 0) metrics.twr = (Math.pow(twrGross, 1 / totalYears) - 1) * 100;

    // Volatilidade (desvio-padrão populacional dos retornos mensais, anualizado)
    if (monthlyReturns.length > 0) {
      var avgRet = monthlyReturns.reduce(function (s, r) { return s + r; }, 0) / monthlyReturns.length;
      var variance = monthlyReturns.reduce(function (s, r) { return s + Math.pow(r - avgRet, 2); }, 0) / monthlyReturns.length;
      metrics.volatility = Math.sqrt(variance) * Math.sqrt(12) * 100;
    }

    // Sharpe com taxa livre de risco de 2% a.a.
    var riskFreeRate = 0.02;
    if (metrics.volatility > 0) metrics.sharpe = (metrics.twr / 100 - riskFreeRate) / (metrics.volatility / 100);

    // Max drawdown (negativo)
    var maxPrice = values[0], maxDD = 0;
    for (var i = 1; i < values.length; i++) {
      if (values[i] > maxPrice) maxPrice = values[i];
      var dd = (values[i] - maxPrice) / maxPrice;
      if (dd < maxDD) maxDD = dd;
    }
    metrics.maxDD = maxDD * 100;

    // ROIC sobre o capital médio aportado
    var finalValue = values[values.length - 1];
    var totalInvested = invested[invested.length - 1];
    var avgInvested = invested.reduce(function (s, v) { return s + v; }, 0) / invested.length;
    if (avgInvested > 0) metrics.roic = ((finalValue - totalInvested) / avgInvested) * 100;

    // Benchmark 50% BTC + 50% ETH com os MESMOS aportes nas MESMAS datas, medido por XIRR
    if (bench && bench.btcUsd && bench.ethUsd && bench.btcUsd.length > 0 && bench.ethUsd.length > 0) {
      var unitsBtc = 0, unitsEth = 0, bCf = [], bT = [];
      for (var j = 0; j < values.length; j++) {
        var contrib = j === 0 ? invested[0] : Math.max(0, invested[j] - invested[j - 1]);
        if (bench.btcUsd[j] > 0) unitsBtc += (contrib * 0.5) / bench.btcUsd[j];
        if (bench.ethUsd[j] > 0) unitsEth += (contrib * 0.5) / bench.ethUsd[j];
        bCf.push(-contrib);
        bT.push(j / 12);
      }
      var lastI = values.length - 1;
      var benchFinal = unitsBtc * (bench.btcUsd[lastI] || 0) + unitsEth * (bench.ethUsd[lastI] || 0);
      if (benchFinal > 0) {
        bCf[bCf.length - 1] += benchFinal;
        var bRate = xirr(bCf, bT);
        if (bRate !== null) metrics.benchmarkReturn = bRate * 100;
      }
    }

    // TIR (money-weighted). Sem raiz → cai no TWR.
    var f = curveCashflows(values, invested);
    var xirrRate = xirr(f.cashflows, f.times);
    metrics.irr = xirrRate !== null ? xirrRate * 100 : metrics.twr;

    metrics.alpha = metrics.irr - metrics.benchmarkReturn;
    return metrics;
  }

  // ── Patrimônio líquido a partir do data.js ─────────────────────────────────
  // Metodologia (CLAUDE.md §3.1): holdings JÁ incluem o colateral DeFi, então
  //   netWorth = Σ holdings×preço + Σ stables×preço + LP (pooled + fees) − dívida
  // priceOf(cgId) → preço em USD. Nunca somar o bloco `defi` por cima.
  function netWorth(D, priceOf) {
    var val = function (a) { return a.qty * priceOf(a.cgId); };
    var gross = D.holdings.reduce(function (s, a) { return s + val(a); }, 0);
    var stables = D.stables.reduce(function (s, a) { return s + val(a); }, 0);
    var uni = (D.defi && D.defi.uniswapV3) || {};
    var lp = (uni.pooled || 0) + (uni.uncollectedFees || 0);
    var debt = D.debt.total;
    return { gross: gross, stables: stables, lp: lp, debt: debt, netWorth: gross + stables + lp - debt };
  }

  return {
    dietzReturns: dietzReturns,
    monthlyReturnsTable: monthlyReturnsTable,
    compound: compound,
    xirr: xirr,
    curveCashflows: curveCashflows,
    curveIRRPct: curveIRRPct,
    performanceMetrics: performanceMetrics,
    netWorth: netWorth
  };
});
