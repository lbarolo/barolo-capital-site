// Invariantes do data.js — regras que o CLAUDE.md documenta e que já foram quebradas
// por edição manual. Rodam em segundos e avisam ANTES de o dado errado ir ao ar.
const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('./helpers/extract');

const D = H.loadData();
const qty = (list, t) => (list.find(a => a.ticker === t) || {}).qty;

test('wealthCurve: três arrays alinhados, meses consecutivos, valores positivos', () => {
  const { labels, values, invested } = D.wealthCurve;
  assert.strictEqual(values.length, labels.length);
  assert.strictEqual(invested.length, labels.length);
  for (let i = 1; i < labels.length; i++) {
    const [m0, y0] = labels[i - 1].split('/').map(Number), [m1, y1] = labels[i].split('/').map(Number);
    assert.strictEqual((y1 * 12 + m1) - (y0 * 12 + m0), 1, `buraco entre ${labels[i - 1]} e ${labels[i]}`);
  }
  values.forEach((v, i) => assert.ok(v > 0, `valor não positivo em ${labels[i]}`));
});

test('wealthCurve.invested nunca cai (aporte líquido acumulado)', () => {
  const inv = D.wealthCurve.invested;
  for (let i = 1; i < inv.length; i++) assert.ok(inv[i] >= inv[i - 1], `invested caiu em ${D.wealthCurve.labels[i]}`);
});

// Bug de 04/09/2026: SOL do holding abaixo do supply da Kamino. O holding INCLUI o colateral,
// então nunca pode ser menor que o que está depositado no protocolo.
test('holding ≥ supply do protocolo (o colateral está dentro do holding)', () => {
  const A = D.defi.aave.supply, K = D.defi.kamino.supply;
  assert.ok(qty(D.holdings, 'ETH') >= A.WETH.qty, 'ETH < WETH na AAVE');
  assert.ok(qty(D.holdings, 'SOL') >= K.SOL.qty, 'SOL < SOL na Kamino');
  assert.ok(qty(D.stables, 'USDT') >= A.USDT.qty, 'USDT < USDT na AAVE');
  assert.ok(qty(D.stables, 'USDS') >= K.USDS.qty, 'USDS < USDS na Kamino');
});

test('agregados derivados batem com as partes', () => {
  const sum = b => Object.values(b).reduce((s, x) => s + x.qty, 0);
  const r2 = n => Math.round(n * 100) / 100;
  assert.strictEqual(D.debt.aave, r2(sum(D.defi.aave.borrow)));
  assert.strictEqual(D.debt.kamino, r2(sum(D.defi.kamino.borrow)));
  assert.strictEqual(D.debt.total, r2(D.debt.aave + D.debt.kamino));
  assert.strictEqual(D.stablesTotalUSD, r2(D.stables.reduce((s, x) => s + x.qty, 0)));
});

// Regra de 14/08/2026: principal é custo base SEM juros. Supply abaixo do principal
// significa depósito não lançado ou principal desatualizado — o juro exibido fica negativo.
test('supply ≥ principal em cada posição de lending', () => {
  const P = D.principals;
  assert.ok(D.defi.aave.supply.WETH.qty >= P.aave.WETH);
  assert.ok(D.defi.aave.supply.USDT.qty >= P.aave.USDT);
  assert.ok(D.defi.kamino.supply.SOL.qty >= P.kamino.SOL);
  assert.ok(D.defi.kamino.supply.USDS.qty >= P.kamino.USDS);
});

// Histórico de pools — fonte única desde 15/09/2026 (antes pools.html e relatorio.html tinham
// listas próprias que divergiam). result = fees − il é a definição usada nos gráficos e no PDF.
test('poolHistory: resultado = fees − IL e datas DD/MM/AAAA', () => {
  const P = D.poolHistory;
  assert.ok(Array.isArray(P) && P.length > 0, 'poolHistory vazio');
  const dmy = /^\d{2}\/\d{2}\/\d{4}$/;
  P.forEach(p => {
    const tag = `${p.pair} ${p.net} ${p.open}`;
    assert.ok(Math.abs((p.fees - p.il) - p.result) < 0.005, `result ≠ fees − il em ${tag}`);
    assert.ok(dmy.test(p.open), `data de abertura inválida em ${tag}`);
    if (p.status === 'closed') assert.ok(dmy.test(p.close), `pool fechada sem data de fechamento em ${tag}`);
  });
});

// Compras pendentes de lançar no CoinGecko (desde 27/11/2026). O delta holding − cgMirror
// mistura compra (lança COM custo) e yield (lança a custo zero); `cgPendingBuys` é a parte
// que o site sabe ser compra. Se a compra passar do delta, ou ela já foi lançada e ficou
// esquecida aqui, ou o cgMirror está errado — e o card passaria a mostrar yield negativo.
test('cgPendingBuys: cada compra cabe no delta holding − cgMirror', () => {
  const list = D.cgPendingBuys;
  if (!list) return;                     // bloco opcional: sem compras pendentes, nada a checar
  assert.ok(Array.isArray(list), 'cgPendingBuys deve ser array');
  const all = (D.holdings || []).concat(D.stables || []);
  const porTicker = {};
  list.forEach(b => {
    assert.ok(b.ticker && b.qty > 0 && b.usd > 0, `entrada incompleta: ${JSON.stringify(b)}`);
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(b.date || ''), `data inválida em ${b.ticker} (use AAAA-MM-DD)`);
    porTicker[b.ticker] = (porTicker[b.ticker] || 0) + b.qty;
  });
  Object.keys(porTicker).forEach(tk => {
    const h = all.find(x => x.ticker === tk);
    assert.ok(h, `cgPendingBuys cita ${tk}, que não existe em holdings/stables`);
    const cg = (D.cgMirror || {})[tk];
    assert.ok(cg > 0, `cgPendingBuys cita ${tk}, mas não há cgMirror para ele`);
    const delta = h.qty - cg;
    // Passar um pouco do delta é normal: o CoinGecko conta a qty BRUTA das ordens e o site
    // conta a líquida, então a divergência estrutural acumulada come parte do delta. Passar
    // de 2% da posição já é outra coisa — compra lançada e não limpa, ou cgMirror errado.
    assert.ok((porTicker[tk] - delta) <= 0.02 * h.qty,
      `${tk}: compra pendente ${porTicker[tk]} passa do delta ${delta.toFixed(9)} em mais de 2% da posição — já foi lançada (limpar cgPendingBuys) ou o cgMirror está errado`);
  });
});
