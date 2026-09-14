// Testes unitários de lib/barolo-core.js com casos calculados à mão.
const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../lib/barolo-core.js');

const close = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

test('Dietz: sem aporte é a variação simples', () => {
  assert.deepStrictEqual(Core.dietzReturns([100, 110, 99], [100, 100, 100]), [0.1, -0.1]);
});

test('Dietz: aporte do mês não conta como retorno (entra no meio do mês)', () => {
  // 100 → 160 com 50 de aporte: ganho real 10 sobre base 100 + 0,5·50 = 125 → 8%
  close(Core.dietzReturns([100, 160], [100, 150])[0], 0.08);
});

test('Dietz: mês com base ≤ 0 é pulado', () => {
  assert.deepStrictEqual(Core.dietzReturns([0, 50], [0, 0]), []);
});

test('tabela mensal: 1º mês null, arredonda a 1 casa, Jan usa Dez anterior', () => {
  const t = Core.monthlyReturnsTable(['11/25', '12/25', '01/26'], [100, 103.333, 113.6663], [100, 100, 100]);
  assert.deepStrictEqual(Object.keys(t), ['2025', '2026']);
  assert.strictEqual(t[2025][10], null);   // nov/25 = primeiro ponto
  assert.strictEqual(t[2025][11], 3.3);    // dez/25
  assert.strictEqual(t[2026][0], 10);      // jan/26 (base dez/25)
  assert.strictEqual(t[2026][1], null);
});

test('XIRR: −100 hoje, +110 em 1 ano = 10% a.a.', () => {
  close(Core.xirr([-100, 110], [0, 1]), 0.10, 1e-6);
});

test('XIRR: sem troca de sinal devolve null', () => {
  assert.strictEqual(Core.xirr([100, 100], [0, 1]), null);
  assert.strictEqual(Core.curveIRRPct([100], [100]), null);
});

test('TIR da curva: 12 aportes de 100 que viram 1.200 = 0%', () => {
  const inv = Array.from({ length: 12 }, (_, i) => 100 * (i + 1));
  close(Core.curveIRRPct(inv.slice(), inv), 0, 1e-4);
});

test('métricas: curva sem variação dá zero em tudo, e drawdown é negativo', () => {
  const m = Core.performanceMetrics({ values: [100, 100, 100], invested: [100, 100, 100] }, null);
  close(m.twr, 0); close(m.volatility, 0); assert.strictEqual(m.sharpe, 0);
  const dd = Core.performanceMetrics({ values: [100, 50, 75], invested: [100, 100, 100] }, null);
  close(dd.maxDD, -50);
});

test('patrimônio: NÃO soma o bloco defi por cima dos holdings (colateral já está dentro)', () => {
  const D = {
    holdings: [{ cgId: 'ethereum', qty: 2 }], stables: [{ cgId: 'tether', qty: 100 }],
    defi: { aave: { supply: { WETH: { qty: 2 } } }, uniswapV3: { pooled: 50, uncollectedFees: 5 } },
    debt: { total: 300 }
  };
  const r = Core.netWorth(D, id => ({ ethereum: 1000, tether: 1 })[id]);
  assert.deepStrictEqual(r, { gross: 2000, stables: 100, lp: 55, debt: 300, netWorth: 1855 });
});
