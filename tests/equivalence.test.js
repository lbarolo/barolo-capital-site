// Equivalência: o código NOVO (páginas + lib/barolo-core.js) tem de dar o MESMO resultado
// que o código ANTIGO (tests/fixtures/legacy.js, cópia literal do commit 5ed73a1).
// Roda as duas versões lado a lado sobre os dados reais do data.js e sobre centenas de
// curvas sintéticas. Onde o resultado não é bit a bit idêntico, o teste diz por quê.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const Core = require('../lib/barolo-core.js');
const H = require('./helpers/extract');

const LEGACY = fs.readFileSync(path.join(__dirname, 'fixtures', 'legacy.js'), 'utf8');
const D = H.loadData();
const BENCH = H.loadBenchmark();
const js = page => H.inlineScripts(H.read(page)).join('\n;\n');
const PORTFOLIO = js('portfolio_analytics.html');
const INDEX = js('index.html');
const RELATORIO = js('relatorio.html');

// Objetos criados dentro do vm têm outro Object.prototype; clona para comparar só valores.
const plain = o => structuredClone(o);

// PRNG determinístico (mulberry32) — os casos sintéticos são sempre os mesmos.
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
// Curva sintética realista: aportes não-decrescentes, retornos mensais entre −40% e +40%,
// às vezes um mês com valor 0 (base nula) para exercitar os ramos de guarda.
function synthCurve(r, n, opts = {}) {
  const labels = [], values = [], invested = [];
  let v = 500 + r() * 2000, inv = v;
  for (let i = 0; i < n; i++) {
    labels.push(String(i % 12 + 1).padStart(2, '0') + '/' + String(22 + Math.floor(i / 12)).padStart(2, '0'));
    if (i > 0) {
      const aporte = r() < 0.6 ? Math.round(r() * 400) : 0;
      inv += aporte;
      v = Math.max(0, (v + aporte) * (1 + (r() - 0.5) * 0.8));
      if (opts.zeros && r() < 0.05) v = 0;
    }
    values.push(Math.round(v * 100) / 100);
    invested.push(Math.round(inv));
  }
  return { labels, values, invested };
}
const cases = [];
{ const r = rng(20260914); for (let k = 0; k < 300; k++) cases.push(synthCurve(r, 2 + Math.floor(r() * 70), { zeros: k % 3 === 0 })); }

// Data.js com uma curva trocada (para rodar curveWithLive e o resto sobre a curva sintética).
const withCurve = wc => Object.assign(Object.create(Object.getPrototypeOf(D)), D, { wealthCurve: wc });

// ── portfolio_analytics.html: calculatePerformanceMetrics ────────────────────
function oldMetrics(data, live, bench) {
  const ctx = H.run(LEGACY, {
    window: { BAROLO_DATA: data, BENCHMARK_DATA: bench },
    WEEKLY_UPDATE: { wealthCurve: data.wealthCurve }, _livePortfolioGross: live
  });
  return plain(ctx.calculatePerformanceMetrics());
}
function newMetrics(data, live, bench) {
  const src = H.extractFunction(PORTFOLIO, 'calculatePerformanceMetrics') + '\n' + H.extractFunction(PORTFOLIO, 'computeXIRR');
  const ctx = H.run(src, {
    BaroloCore: Core, window: { BAROLO_DATA: data, BENCHMARK_DATA: bench },
    WEEKLY_UPDATE: { wealthCurve: data.wealthCurve }, _livePortfolioGross: live
  });
  return plain(ctx.calculatePerformanceMetrics());
}

test('dashboard: métricas idênticas sobre o data.js real (com e sem valor ao vivo)', () => {
  for (const live of [0, 5000, 9691.4, 11240.67092744, 20000]) {
    for (const bench of [BENCH, undefined]) {
      assert.deepStrictEqual(newMetrics(D, live, bench), oldMetrics(D, live, bench), `live=${live} bench=${!!bench}`);
    }
  }
});

test('dashboard: métricas idênticas em 300 curvas sintéticas', () => {
  for (const wc of cases) {
    const data = withCurve(wc);
    assert.deepStrictEqual(newMetrics(data, 0, undefined), oldMetrics(data, 0, undefined));
  }
});

test('dashboard: computeXIRR idêntico em 500 fluxos de caixa aleatórios', () => {
  const ctx = H.run(LEGACY);
  const newCtx = H.run(H.extractFunction(PORTFOLIO, 'computeXIRR'), { BaroloCore: Core });
  const r = rng(7);
  for (let k = 0; k < 500; k++) {
    const n = 2 + Math.floor(r() * 60), cf = [], t = [];
    for (let i = 0; i < n; i++) { cf.push(-(r() * 500)); t.push(i / 12); }
    cf[n - 1] += r() * 500 * n * 1.5;
    assert.strictEqual(newCtx.computeXIRR(cf, t), ctx.computeXIRR(cf, t));
  }
});

// ── heatmap do dashboard e tabela do relatório ───────────────────────────────
test('heatmap (portfolio) e retornos mensais (relatório) idênticos — real + 300 sintéticas', () => {
  const relatorioIIFE = RELATORIO.slice(
    RELATORIO.indexOf('(function(){\n  var wc = window.BAROLO_DATA && window.BAROLO_DATA.wealthCurve;'),
    RELATORIO.indexOf('  MONTHLY_RETURNS = mr;\n})();') + '  MONTHLY_RETURNS = mr;\n})();'.length);
  assert.ok(relatorioIIFE.length > 100, 'IIFE do relatório não encontrada');
  const legacy = H.run(LEGACY);
  for (const wc of [D.wealthCurve, ...cases]) {
    // dashboard: tabela { ano: [12] }
    const oldT = plain(legacy.legacyPortfolioTable({ wealthCurve: wc }, {}));
    assert.deepStrictEqual(plain(Core.monthlyReturnsTable(wc.labels, wc.values, wc.invested)), oldT);
    // relatório: tabela { ano: { Jan..Dec } }, rodando o código que está na página hoje
    const newCtx = H.run(relatorioIIFE, { BaroloCore: Core, window: { BAROLO_DATA: { wealthCurve: wc } }, WEALTH_CURVE: null, MONTHLY_RETURNS: null });
    assert.deepStrictEqual(plain(newCtx.MONTHLY_RETURNS), plain(legacy.legacyRelatorioTable({ BAROLO_DATA: { wealthCurve: wc } })));
  }
});

// ── index.html: CAGR, Track Record (real) e TIR do hero ───────────────────────
function indexCtx(src, data) {
  return H.run(src, {
    BaroloCore: Core, window: { BAROLO_DATA: data },
    WEALTH_VALUES: data.wealthCurve.values, INVESTED: data.wealthCurve.invested
  });
}
const indexNewSrc = ['monthlyTWRSeries', 'calculateCAGR', 'calculateRealReturn', 'estimateIRR']
  .map(n => H.extractFunction(INDEX, n)).join('\n');

test('landing: série TWR, CAGR e Track Record idênticos (real + sintéticas)', () => {
  const datasets = [D, ...cases.filter(c => c.values.length >= 2).map(withCurve)];
  for (const data of datasets) {
    const o = indexCtx(LEGACY, data), n = indexCtx(indexNewSrc, data);
    for (const live of [0, 7000, 11240.67]) {
      assert.deepStrictEqual(plain(n.monthlyTWRSeries(live)), plain(o.monthlyTWRSeries(live)));
      assert.strictEqual(n.calculateCAGR(live), o.calculateCAGR(live));
      assert.strictEqual(n.calculateRealReturn(live), o.calculateRealReturn(live));
    }
  }
});

// A TIR da landing trocou de algoritmo: antes bissectava a taxa MENSAL (200 iterações) e
// anualizava; agora usa a mesma XIRR anual do dashboard (para de 1e-6 no NPV). É a mesma
// equação, então dentro da faixa de busca o resultado só difere no ruído numérico — este
// teste prova que a diferença fica abaixo de 0,0001 ponto percentual e que o número exibido
// (1 casa) não muda.
// ÚNICA MUDANÇA DE COMPORTAMENTO (intencional, documentada em lib/barolo-core.js): a faixa
// de busca agora é a do dashboard, −99% a +1000% a.a.; a antiga ia de ~−100% a +409.500%.
// TIR fora dessa faixa (carteira praticamente zerada, ou ganho de >10x ao ano) passa a
// aparecer como 0, igual ao que já acontecia quando a antiga não achava raiz.
test('landing: TIR do hero igual à antiga até 1e-4 p.p. e idêntica na tela', () => {
  const datasets = [D, ...cases.map(withCurve)];
  let compared = 0, outOfRange = 0;
  for (const data of datasets) {
    const o = indexCtx(LEGACY, data), n = indexCtx(indexNewSrc, data);
    const wc = data.wealthCurve;
    const oldIrr = o.estimateIRR(wc.values, wc.invested);
    const newIrr = n.estimateIRR(wc.values, wc.invested);
    if (oldIrr <= -99 || oldIrr >= 1000) {           // fora da faixa da XIRR → 0 (documentado)
      assert.strictEqual(newIrr, 0, `fora da faixa: antiga ${oldIrr}, nova ${newIrr}`);
      outOfRange++;
      continue;
    }
    assert.ok(Math.abs(newIrr - oldIrr) < 1e-4, `Δ=${newIrr - oldIrr} (antiga ${oldIrr}, nova ${newIrr})`);
    const show = x => (x >= 0 ? '+' : '') + x.toFixed(1) + '%';
    if (Math.abs(oldIrr * 10 - Math.round(oldIrr * 10)) > 0.5 - 1e-3) continue; // exatamente na fronteira do arredondamento
    assert.strictEqual(show(newIrr), show(oldIrr));
    compared++;
  }
  // Trava para o teste não virar vácuo: a maioria dos casos tem de cair na faixa comparável.
  // Os que caem fora vêm das curvas sintéticas com meses zerados (carteira quase dizimada).
  assert.ok(compared > 200, 'poucos casos comparados: ' + compared);
  assert.ok(outOfRange < datasets.length * 0.1, `fora da faixa: ${outOfRange} de ${datasets.length}`);
  // E o que importa na prática: a curva REAL está dentro da faixa, com o mesmo valor na tela.
  const realOld = indexCtx(LEGACY, D).estimateIRR(D.wealthCurve.values, D.wealthCurve.invested);
  const realNew = indexCtx(indexNewSrc, D).estimateIRR(D.wealthCurve.values, D.wealthCurve.invested);
  assert.ok(realOld > -99 && realOld < 1000);
  assert.strictEqual(realNew.toFixed(1), realOld.toFixed(1));
});

// ── scripts/fetch-networth.js e fetch-briefing.js: patrimônio líquido ──────────
test('patrimônio líquido idêntico ao do snapshot diário antigo (1000 conjuntos de preços)', () => {
  const legacy = H.run(LEGACY);
  const ids = [...new Set([...D.holdings, ...D.stables].map(a => a.cgId))];
  const r = rng(42);
  for (let k = 0; k < 1000; k++) {
    const prices = {};
    ids.forEach(id => { prices[id] = { usd: r() * (id === 'bitcoin' ? 150000 : id === 'ethereum' ? 6000 : 300) }; });
    assert.deepStrictEqual(plain(Core.netWorth(D, id => prices[id].usd)), plain(legacy.legacyNetWorth(D, prices)));
  }
});
