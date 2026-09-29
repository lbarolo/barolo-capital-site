// Cascata de preço dos scripts de cron (scripts/lib/spot-prices.js), sem rede.
//
// O que precisa ser verdade:
//  1. A ordem é respeitada (Coinbase → CoinPaprika → Yahoo → CoinGecko) e cada
//     ativo só é buscado até a primeira fonte que responder.
//  2. Cotação com NOME que não bate é DESCARTADA. É a proteção que impede o
//     erro real observado em 29/09/2026: no Yahoo, XAI-USD é "SideShift Token"
//     e SCR-USD é "Scorum Coins" — não os tokens do Lucas. Preço errado seria
//     pior que preço faltando.
//  3. Sem nenhuma fonte, cai no último preço conhecido e marca como `stale`;
//     stablecoin sem nada vira paridade US$ 1.
//  4. Nada de silêncio: o que ficou sem preço sai em `missing`.
const test = require('node:test');
const assert = require('node:assert/strict');
const { spotPrices } = require('../scripts/lib/spot-prices.js');

const A = {
  ETH:  { cgId: 'ethereum',      ticker: 'ETH' },
  XAI:  { cgId: 'xai-blockchain', ticker: 'XAI' },
  SCR:  { cgId: 'scroll',        ticker: 'SCR' },
  USDS: { cgId: 'usds',          ticker: 'USDS' }
};

// Navegador falso: cada rota devolve o que o cenário mandar; `hits` registra
// quem foi chamado, para provar a ordem e o curto-circuito.
function fakeFetch(scn, hits) {
  return async (url) => {
    const u = String(url);
    const reply = body => ({ ok: true, status: 200, json: async () => body });
    const fail = status => ({ ok: false, status, json: async () => ({}), text: async () => '' });

    if (u.includes('api.exchange.coinbase.com/products') && u.endsWith('/products')) {
      hits.push('cb:products');
      if (scn.coinbaseDown) return fail(404); // 4xx é permanente: sem retry, teste rápido
      return reply((scn.coinbaseList || []).map(id => ({ id, status: 'online', trading_disabled: false })));
    }
    if (u.includes('api.exchange.coinbase.com')) {
      const t = u.split('/products/')[1].split('-USD')[0];
      hits.push('cb:' + t);
      return reply({ last: String(scn.coinbase[t]), open: String(scn.coinbase[t]) });
    }
    if (u.includes('coinpaprika.com')) {
      const id = u.split('/tickers/')[1];
      hits.push('paprika:' + id);
      const r = scn.paprika && scn.paprika[id];
      if (!r) return fail(404);
      return reply({ name: r.name, symbol: r.symbol, quotes: { USD: { price: r.price, percent_change_24h: 0 } } });
    }
    if (u.includes('finance.yahoo.com')) {
      const sym = u.split('/chart/')[1].split('?')[0];
      hits.push('yahoo:' + sym);
      const r = scn.yahoo && scn.yahoo[sym];
      if (!r) return fail(404);
      return reply({ chart: { result: [{ meta: { shortName: r.name, regularMarketPrice: r.price, chartPreviousClose: r.price } }] } });
    }
    if (u.includes('coingecko.com')) {
      hits.push('coingecko');
      if (!scn.coingecko) return fail(403); // o 403 de WAF que derrubou as Actions
      return reply(scn.coingecko);
    }
    throw new Error('url inesperada: ' + u);
  };
}

async function run(assets, scn, opts = {}) {
  const hits = [];
  const real = global.fetch;
  global.fetch = fakeFetch(scn, hits);
  try {
    const out = await spotPrices(assets, { log: () => {}, ...opts });
    return { out, hits };
  } finally { global.fetch = real; }
}

test('usa a Coinbase quando ela lista o par e nem consulta as outras fontes', async () => {
  const { out, hits } = await run([A.ETH],
    { coinbaseList: ['ETH-USD'], coinbase: { ETH: 2670 } });
  assert.equal(out.usd['ethereum'], 2670);
  assert.equal(out.source['ethereum'], 'coinbase');
  assert.equal(out.byTicker.ETH, 2670);
  assert.deepEqual(out.missing, []);
  assert.ok(!hits.some(h => h.startsWith('paprika') || h.startsWith('yahoo') || h === 'coingecko'),
    'não deveria consultar fonte seguinte: ' + hits.join(','));
});

test('variação 24h vem de last/open da Coinbase', async () => {
  const real = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.endsWith('/products')) return { ok: true, status: 200, json: async () => [{ id: 'ETH-USD', status: 'online', trading_disabled: false }] };
    return { ok: true, status: 200, json: async () => ({ last: '110', open: '100' }) };
  };
  try {
    const out = await spotPrices([A.ETH], { log: () => {} });
    assert.ok(Math.abs(out.change24['ethereum'] - 10) < 1e-9, 'esperava +10%, veio ' + out.change24['ethereum']);
  } finally { global.fetch = real; }
});

test('cai para a CoinPaprika no que a Coinbase não lista', async () => {
  const { out, hits } = await run([A.ETH, A.XAI], {
    coinbaseList: ['ETH-USD'], coinbase: { ETH: 2670 },
    paprika: { 'xai-xai-games': { name: 'Xai Games', symbol: 'XAI', price: 0.0093 } }
  });
  assert.equal(out.source['ethereum'], 'coinbase');
  assert.equal(out.source['xai-blockchain'], 'coinpaprika');
  assert.equal(out.usd['xai-blockchain'], 0.0093);
  assert.ok(!hits.includes('paprika:eth-ethereum'), 'ETH já tinha preço, não deveria ir à paprika');
});

test('DESCARTA cotação cujo nome não bate (SideShift no lugar do Xai, Scorum no lugar do Scroll)', async () => {
  const { out } = await run([A.XAI, A.SCR], {
    coinbaseList: [], coinbase: {},
    paprika: { 'xai-xai-games': { name: 'SideShift Token', symbol: 'XAI', price: 0.068 },
               'scr-scroll':    { name: 'Scorum Coins',   symbol: 'SCR', price: 0.00043 } },
    yahoo:   { 'XAI-USD': { name: 'SideShift Token USD', price: 0.068 } }
  });
  assert.equal(out.usd['xai-blockchain'], undefined, 'não pode aceitar preço do ativo errado');
  assert.equal(out.usd['scroll'], undefined);
  assert.deepEqual(out.missing.sort(), ['scroll', 'xai-blockchain']);
});

test('símbolo diferente na resposta da paprika também é descartado', async () => {
  const { out } = await run([A.XAI], {
    coinbaseList: [], coinbase: {},
    paprika: { 'xai-xai-games': { name: 'Xai Games', symbol: 'GORK', price: 9 } }
  });
  assert.deepEqual(out.missing, ['xai-blockchain']);
});

test('sem fonte nenhuma: usa o último preço conhecido e marca como stale', async () => {
  const { out } = await run([A.XAI], { coinbaseList: [], coinbase: {} },
    { lastKnown: { XAI: 0.0091 } });
  assert.equal(out.usd['xai-blockchain'], 0.0091);
  assert.equal(out.source['xai-blockchain'], 'ultimo-conhecido');
  assert.deepEqual(out.stale, ['XAI']);
  assert.deepEqual(out.missing, []);
});

test('stablecoin sem fonte e sem histórico vira paridade US$ 1', async () => {
  const { out } = await run([A.USDS], { coinbaseList: [], coinbase: {} });
  assert.equal(out.usd['usds'], 1);
  assert.equal(out.source['usds'], 'peg');
  assert.deepEqual(out.stale, ['USDS']);
});

test('403 do CoinGecko não derruba nada — as outras fontes seguem', async () => {
  const { out, hits } = await run([A.ETH, A.SCR], {
    coinbaseDown: true,
    paprika: { 'eth-ethereum': { name: 'Ethereum', symbol: 'ETH', price: 2670 },
               'scr-scroll':   { name: 'Scroll',   symbol: 'SCR', price: 0.0234 } }
  });
  assert.equal(out.usd['ethereum'], 2670);
  assert.equal(out.usd['scroll'], 0.0234);
  assert.deepEqual(out.missing, []);
  assert.ok(!hits.includes('coingecko'), 'nem precisou chegar no CoinGecko');
});

test('CoinGecko ainda serve quando é a única fonte que responde', async () => {
  const { out } = await run([A.ETH], {
    coinbaseDown: true,
    coingecko: { ethereum: { usd: 2680, usd_24h_change: -1.5 } }
  });
  assert.equal(out.usd['ethereum'], 2680);
  assert.equal(out.change24['ethereum'], -1.5);
  assert.equal(out.source['ethereum'], 'coingecko');
});
