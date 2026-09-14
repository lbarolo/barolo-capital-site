// Equivalência da Fase 2: os blocos on-chain NOVOS das páginas (que usam lib/barolo-chain.js)
// contra os ANTIGOS (tests/fixtures/legacy-chain.js, literal do commit f4587b5), rodando os dois
// no mesmo navegador falso, com as mesmas respostas reais gravadas e os mesmos cenários de falha.
// Compara o que a página enxerga depois: os globais que ela lê, o que foi escrito no DOM e as
// requisições feitas. As únicas diferenças permitidas estão escritas aqui, uma a uma.
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('./helpers/sandbox');
const H = require('./helpers/extract');
const LEG = require('./fixtures/legacy-chain.js');

const D = H.loadData();
const pageJs = page => H.inlineScripts(H.read(page)).join('\n;\n');
const NEW = {
  portfolioWallet: H.extractIIFE(pageJs('portfolio_analytics.html'), 'initWalletFetch'),
  poolsWallet: H.extractIIFE(pageJs('pools.html'), 'initWalletFetch'),
  portfolioCardano: H.extractIIFE(pageJs('portfolio_analytics.html'), 'initCardanoFetch')
};

// Globais que cada página de fato LÊ (levantado por varredura em 14/09/2026).
const PORTFOLIO_READS = ['_liveAaveDebt', '_liveAaveCollateral', '_liveAaveHF', '_liveAaveUsdtApy', '_liveAaveBorrowApy',
  '_liveKaminoDebt', '_liveKaminoSolApy', '_liveKaminoUsdsApy', '_liveKaminoBorrowApy'];
const POOLS_READS = ['_liveAaveDebt', '_liveAaveCollateral', '_liveAaveHF', '_liveKaminoDebt'];

const pick = (ctx, keys) => Object.fromEntries(keys.map(k => [k, ctx[k]]));
const tally = calls => calls.reduce((o, k) => (o[k] = (o[k] || 0) + 1, o), {});
const lowDeposit = () => {
  const R = JSON.parse(JSON.stringify(S.RESPONSES));
  R.kamino.loan.loanInfo.collateral.deposits.forEach(d => { d.tokenValue = '10'; });
  return R;
};

const SCENARIOS = {
  'tudo respondendo': {},
  'bluechip da AAVE com erro': { fail: { 'alchemy:eth_call:bluechip': 'rpc-error' } },
  'Alchemy fora do ar': { fail: { alchemy: 'network' } },
  'AAVE devolve vazio (0x)': { fail: { 'alchemy:eth_call:main': 'empty' } },
  'APY da AAVE com erro': { fail: { 'alchemy:eth_call:reserve-usdt': 'rpc-error', 'alchemy:eth_call:reserve-usdc': 'network' } },
  'Kamino: obligations fora do ar': { fail: { 'kamino:obligations': 'network' }, kaminoFails: true },
  'Kamino: obligations 500': { fail: { 'kamino:obligations': 'http500' }, kaminoFails: true },
  'Kamino: loan 500': { fail: { 'kamino:loan': 'http500' }, kaminoFails: true },
  'Kamino: reservas 500': { fail: { 'kamino:reserves': 'http500' } },
  'Kamino: depósito abaixo de US$ 100': { responses: lowDeposit() },
  'tudo fora do ar': { fail: { alchemy: 'network', kamino: 'network', base: 'network', helius: 'network' }, kaminoFails: true }
};

for (const [name, sc] of Object.entries(SCENARIOS)) {
  const opts = { fail: sc.fail || {}, responses: sc.responses || S.RESPONSES };

  test(`portfolio · ${name}`, async () => {
    const old = await S.runBlock(LEG.portfolioWallet, opts);
    const neu = await S.runBlock(NEW.portfolioWallet, { ...opts, withChain: true });

    const expected = pick(old.ctx, PORTFOLIO_READS);
    if (sc.kaminoFails) {
      // ÚNICA diferença nos valores: o código antigo do portfolio assumia a dívida da Kamino em
      // US$ 808,77 (número fixo de maio) quando a API falhava. Agora usa o data.js, igual ao pools.
      assert.strictEqual(expected._liveKaminoDebt, 808.77);
      expected._liveKaminoDebt = D.debt.kamino;
    }
    assert.deepStrictEqual(pick(neu.ctx, PORTFOLIO_READS), expected);

    // Rede: as mesmas chamadas, menos a leitura da LP da Base (posição fechada; resultado nunca lido).
    const o = tally(old.calls);
    assert.strictEqual(o['base:eth_call'], 1);
    delete o['base:eth_call'];
    assert.deepStrictEqual(tally(neu.calls), o);
  });

  test(`pools · ${name}`, async () => {
    const old = await S.runBlock(LEG.poolsWallet, opts);
    const neu = await S.runBlock(NEW.poolsWallet, { ...opts, withChain: true });

    // Valores: idênticos em todos os cenários (o fallback do pools já era o data.js).
    assert.deepStrictEqual(pick(neu.ctx, POOLS_READS), pick(old.ctx, POOLS_READS));

    // Rede: as mesmas chamadas, menos os saldos EVM/Solana que nunca eram lidos.
    const o = tally(old.calls);
    const removed = Object.keys(o).filter(k => /^(alchemy:eth_getBalance|alchemy:eth_call:erc20|helius:)/.test(k));
    assert.deepStrictEqual(removed.sort(), ['alchemy:eth_call:erc20', 'alchemy:eth_getBalance', 'helius:getBalance', 'helius:getTokenAccountsByOwner']);
    assert.strictEqual(o['alchemy:eth_getBalance'] + o['alchemy:eth_call:erc20'], 16);
    removed.forEach(k => delete o[k]);
    assert.deepStrictEqual(tally(neu.calls), o);

    // Continua atualizando a cada 5 minutos.
    assert.deepStrictEqual(neu.intervals, old.intervals);
    assert.deepStrictEqual(neu.intervals, [300000]);
  });
}

const CARDANO = {
  'tudo respondendo': {},
  'endereço 500': { 'blockfrost:address': 'http500' },
  'conta fora do ar': { 'blockfrost:account': 'network' },
  'metadata do pool 500': { 'blockfrost:pool-metadata': 'http500' },
  'histórico do pool 500': { 'blockfrost:pool-history': 'http500' },
  'rewards 500': { 'blockfrost:rewards': 'http500' }
};
for (const [name, fail] of Object.entries(CARDANO)) {
  test(`portfolio · card do stake ADA · ${name}: DOM e rede idênticos`, async () => {
    const ids = ['cardano-stake-target'];
    const old = await S.runBlock(LEG.portfolioCardano, { fail, ids });
    const neu = await S.runBlock(NEW.portfolioCardano, { fail, ids, withChain: true });
    assert.deepStrictEqual(neu.doc.snapshot(), old.doc.snapshot());
    assert.deepStrictEqual(tally(neu.calls), tally(old.calls));
  });
}

test('pools · o bloco Cardano removido não mostrava nada: 5 chamadas e nenhuma escrita na página', async () => {
  const old = await S.runBlock(LEG.poolsCardano, {});
  assert.strictEqual(old.calls.filter(c => c.startsWith('blockfrost:')).length, 5);
  assert.strictEqual(old.doc.touched.size, 0);
  const html = H.read('pools.html');
  assert.ok(!/id=["']cardano-stake-target["']/.test(html), 'pools.html ganhou onde mostrar o card — reavaliar');
  assert.ok(!html.includes('(function initCardanoFetch()'));
});

test('globais que deixaram de ser gravados não são lidos por nenhuma página', () => {
  const DROPPED = ['_liveUniActive', '_liveSolWallet', '_livePyusd', '_liveUsdcSol', '_liveKaminoDeposit',
    '_liveKaminoNetVal', '_liveKaminoSol', '_liveKaminoLtv', '_liveAdaStaked', '_liveAdaRewards', '_liveAdaPool',
    '_liveAdaRewardsHistory', '_liveAdaWallet'];
  for (const page of ['index.html', 'portfolio_analytics.html', 'pools.html', 'ferramentas.html', 'relatorio.html']) {
    const html = H.read(page);
    for (const g of DROPPED) assert.ok(!new RegExp('\\b' + g + '\\b').test(html), `${page} usa ${g}`);
  }
});
