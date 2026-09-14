// Testes unitários de lib/barolo-chain.js sobre respostas REAIS gravadas
// (tests/fixtures/chain/responses.json) e sobre respostas montadas para cada regra de sanidade.
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('./helpers/sandbox');
const H = require('./helpers/extract');

const D = H.loadData();
const chain = async (opts) => (await S.runBlock('', Object.assign({ withChain: true }, opts)));

// Struct V4 de getUserAccountData com os campos que importam ([2]=HF, [3]=colateral, [4]=dívida).
const word = n => BigInt(n).toString(16).padStart(64, '0');
const struct = ({ hf, coll, debt }) => '0x' + [0n, 0n, hf, coll, debt, 0n, 0n].map(word).join('');
const E18 = 10n ** 18n, E26 = 10n ** 26n, E53 = 10n ** 53n;

test('AAVE: resposta real → HF, colateral e dívida críveis e coerentes com o data.js', async () => {
  const { ctx } = await chain();
  const r = await ctx.BaroloChain.fetchAave();
  assert.ok(r, 'fetchAave devolveu null');
  assert.ok(r.hf > 1 && r.hf < 100, 'HF ' + r.hf);
  assert.ok(r.collateral > r.debt);
  assert.ok(Math.abs(r.debt - D.debt.aave) / D.debt.aave < 0.02, `dívida ${r.debt} vs data.js ${D.debt.aave}`);
});

test('AAVE: decodifica o struct V4 nas escalas certas', async () => {
  const { ctx } = await chain();
  const r = ctx.BaroloChain.parseAaveV4(struct({ hf: 8n * E18, coll: 7600n * E26, debt: 763n * E53 }), null);
  // Tolerância relativa: dividir por Math.pow(10, 26) em ponto flutuante dá 7599.999999999999
  // (mesma expressão do código original). O que o teste verifica é a ESCALA de cada campo.
  const near = (a, b) => Math.abs(a - b) / b < 1e-12;
  assert.ok(near(r.collateral, 7600) && near(r.debt, 763) && near(r.hf, 8), JSON.stringify(r));
});

test('AAVE: regras de sanidade descartam resposta impossível em vez de zerar a tela', async () => {
  const { ctx } = await chain();
  const parse = ctx.BaroloChain.parseAaveV4;
  assert.strictEqual(parse(struct({ hf: 5n * E18, coll: 50n * E26, debt: 10n * E53 }), null), null, 'colateral < $100');
  assert.strictEqual(parse(struct({ hf: 2n ** 255n, coll: 5000n * E26, debt: 0n }), null), null, 'dívida zero → HF = uint256.max');
  assert.strictEqual(parse(struct({ hf: 2n * E18, coll: 1000n * E26, debt: 5000n * E53 }), null), null, 'dívida > colateral');
});

test('AAVE: RPC vazio ("0x") ou fora do ar → null', async () => {
  for (const fail of [{ 'alchemy:eth_call:main': 'empty' }, { alchemy: 'network' }, { 'alchemy:eth_call:main': 'rpc-error' }]) {
    const { ctx } = await chain({ fail });
    assert.strictEqual(await ctx.BaroloChain.fetchAave(), null, JSON.stringify(fail));
  }
});

test('AAVE: bluechip com erro não derruba a leitura', async () => {
  const { ctx } = await chain({ fail: { 'alchemy:eth_call:bluechip': 'rpc-error' } });
  assert.ok(await ctx.BaroloChain.fetchAave());
});

test('AAVE: APYs reais entre 0% e 50%', async () => {
  const { ctx } = await chain();
  const r = await ctx.BaroloChain.fetchAaveApys();
  assert.ok(r.usdtSupplyApy > 0 && r.usdtSupplyApy < 50);
  assert.ok(r.usdcBorrowApy > 0 && r.usdcBorrowApy < 50);
});

test('Kamino: resposta real → SOL depositado bate com o data.js e LTV abaixo da liquidação', async () => {
  const { ctx } = await chain();
  const r = await ctx.BaroloChain.fetchKamino({ withApys: true });
  assert.ok(!r.failed && r.position);
  const sol = D.defi.kamino.supply.SOL.qty;
  assert.ok(Math.abs(r.position.solQty - sol) / sol < 0.01, `SOL ${r.position.solQty} vs data.js ${sol}`);
  assert.ok(r.position.ltv > 0.05 && r.position.ltv < D.defi.kamino.liqLtv);
  for (const k of ['sol', 'usds', 'borrow']) assert.ok(r.apys[k] > 0 && r.apys[k] < 50, 'APY ' + k);
});

test('Kamino: sem withApys não pede as reservas', async () => {
  const { ctx, calls } = await chain();
  await ctx.BaroloChain.fetchKamino();
  assert.deepStrictEqual(calls, ['kamino:obligations', 'kamino:loan']);
});

test('Kamino: falha usa a última dívida conhecida e, sem ela, a do data.js (nunca número fixo)', async () => {
  const { ctx } = await chain({ fail: { 'kamino:loan': 'http500' } });
  const r = await ctx.BaroloChain.fetchKamino();
  assert.strictEqual(r.failed, true);
  const win = { BAROLO_DATA: D };
  ctx.BaroloChain.applyKamino(r, win);
  assert.strictEqual(win._liveKaminoDebt, D.debt.kamino);
  const seen = { BAROLO_DATA: D, _liveKaminoDebt: 700 };
  ctx.BaroloChain.applyKamino(r, seen);
  assert.strictEqual(seen._liveKaminoDebt, 700);
});

test('Kamino: depósito abaixo de US$ 100 é descartado sem acionar o fallback', async () => {
  const R = JSON.parse(JSON.stringify(S.RESPONSES));
  R.kamino.loan.loanInfo.collateral.deposits.forEach(d => { d.tokenValue = '10'; });
  const { ctx } = await chain({ responses: R });
  const r = await ctx.BaroloChain.fetchKamino();
  assert.strictEqual(r.position, null);
  assert.strictEqual(r.failed, false);
});

test('Cardano: resposta real → stake e pool; 5 chamadas ao Blockfrost', async () => {
  const { ctx, calls } = await chain();
  const r = await ctx.BaroloChain.fetchCardano();
  assert.ok(r.stakedAda > 0);
  assert.strictEqual(typeof r.poolTicker, 'string');
  assert.strictEqual(calls.filter(c => c.startsWith('blockfrost:')).length, 5);
});

test('Cardano: endereço fora do ar → null', async () => {
  const { ctx } = await chain({ fail: { 'blockfrost:address': 'http500' } });
  assert.strictEqual(await ctx.BaroloChain.fetchCardano(), null);
});
