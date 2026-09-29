/**
 * spot-prices.js — preço à vista em CASCATA para os scripts de cron (Node).
 *
 * Usado por fetch-networth.js e fetch-briefing.js. Uma implementação só: se a
 * fonte mudar, muda aqui.
 *
 * ⚠️ POR QUE EXISTE (29/09/2026): o CoinGecko passou a responder 403 (CloudFront
 * "Request blocked") nas rotas de dados sem chave — nos runners do GitHub E na
 * máquina do Lucas. As Actions networth/briefing morriam em ~9s porque o retry
 * antigo só tratava 429. Mesmo padrão do 451 da Binance em 20/08: a fonte some,
 * não o código.
 *
 * Ordem (a primeira que responder por ativo):
 *   1. Coinbase Exchange (api.exchange.coinbase.com) — americana, sem chave, com
 *      CORS aberto e sem geo-bloqueio no runner. /products/{T}-USD/stats devolve
 *      `last` (preço) e `open` (abertura de 24h ⇒ variação). Cobre hoje BTC, ETH,
 *      SOL, ADA, EIGEN, POL, ZK, ZETA, USDT e USDS.
 *   2. CoinPaprika — sem chave, cobre a cauda que a Coinbase não lista (XAI da
 *      Xai Games, SCR da Scroll, RDNT). Conferido contra a Coinbase em 29/09:
 *      BTC $83.052 vs $83.131, RDNT igual ao Yahoo.
 *   3. Yahoo Finance — redundância extra para os majors.
 *   4. CoinGecko — por último, porque é justamente o que está bloqueado.
 *   5. Último preço conhecido (ponto anterior do networth-history.json).
 *   6. Stablecoin sem nenhuma fonte: US$ 1,00 (marcado como `peg`).
 *
 * ⚠️ NUNCA adicionar um símbolo sem conferir o NOME que a fonte devolve. No
 * Yahoo, `XAI-USD` é "SideShift Token" e `SCR-USD` é "Scorum Coins" — ativos
 * DIFERENTES dos do Lucas (Xai Games e Scroll); na CoinPaprika existem 8 moedas
 * com símbolo XAI. Preço errado é pior que preço faltando: por isso o `expect` é
 * obrigatório nos dois mapas e a cotação é descartada se o nome não bater.
 */
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const CB = 'https://api.exchange.coinbase.com';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Símbolos do Yahoo já conferidos: `expect` é comparado (minúsculo) com o
// shortName da resposta; se não bater, a cotação é ignorada.
const YAHOO = {
  BTC:  { symbol: 'BTC-USD',  expect: 'bitcoin' },
  ETH:  { symbol: 'ETH-USD',  expect: 'ethereum' },
  SOL:  { symbol: 'SOL-USD',  expect: 'solana' },
  ADA:  { symbol: 'ADA-USD',  expect: 'cardano' },
  RDNT: { symbol: 'RDNT-USD', expect: 'radiant' },
  USDT: { symbol: 'USDT-USD', expect: 'tether' }
};

// Ids da CoinPaprika conferidos um a um em 29/09/2026 (nome + símbolo na resposta).
const PAPRIKA = {
  BTC:  { id: 'btc-bitcoin',                 expect: 'bitcoin' },
  ETH:  { id: 'eth-ethereum',                expect: 'ethereum' },
  SOL:  { id: 'sol-solana',                  expect: 'solana' },
  ADA:  { id: 'ada-cardano',                 expect: 'cardano' },
  EIGEN:{ id: 'eigen-eigenlayer',            expect: 'eigenlayer' },
  RDNT: { id: 'rdnt-radiant-capital',        expect: 'radiant' },
  POL:  { id: 'pol-polygon-ecosystem-token', expect: 'polygon' },
  ZK:   { id: 'zk-zksync',                   expect: 'zksync' },
  XAI:  { id: 'xai-xai-games',               expect: 'xai games' },
  ZETA: { id: 'zeta-zetachain',              expect: 'zetachain' },
  SCR:  { id: 'scr-scroll',                  expect: 'scroll' },
  USDT: { id: 'usdt-tether',                 expect: 'tether' },
  USDS: { id: 'usds-usds',                   expect: 'usds' }
};

const STABLE = new Set(['USDT', 'USDC', 'USDS', 'DAI', 'GHO', 'USDG', 'PYUSD']);

/** GET com retry curto. 4xx (403 de WAF, 404) é permanente — não reesperar. */
async function getJson(url, { tries = 3, timeout = 12000 } = {}) {
  for (let i = 1; ; i++) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeout);
    try {
      const r = await fetch(url, { signal: ctl.signal, headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
      clearTimeout(t);
      if (r.ok) return r.json();
      if ((r.status === 429 || r.status >= 500) && i < tries) { await sleep(4000 * i); continue; }
      throw new Error('HTTP ' + r.status);
    } catch (e) {
      clearTimeout(t);
      if (i >= tries) throw e;
      await sleep(2000 * i);
    }
  }
}

// ── Fonte 1: Coinbase Exchange ──────────────────────────────────────────────
async function coinbaseProducts() {
  const all = await getJson(CB + '/products');
  const ok = new Set();
  (Array.isArray(all) ? all : []).forEach(p => {
    if (p && p.id && p.status === 'online' && !p.trading_disabled) ok.add(p.id);
  });
  return ok;
}

async function coinbaseQuote(ticker) {
  const s = await getJson(`${CB}/products/${ticker}-USD/stats`);
  const last = parseFloat(s && s.last), open = parseFloat(s && s.open);
  if (!(last > 0)) throw new Error('sem last');
  return { usd: last, change24: open > 0 ? (last / open - 1) * 100 : 0 };
}

// ── Fonte 2: CoinPaprika (allowlist + nome conferido) ───────────────────────
async function paprikaQuote(ticker) {
  const cfg = PAPRIKA[ticker];
  if (!cfg) throw new Error('fora da allowlist');
  const j = await getJson(`https://api.coinpaprika.com/v1/tickers/${cfg.id}`);
  if (!j || j.error) throw new Error((j && j.error) || 'resposta inesperada');
  const name = String(j.name || '').toLowerCase();
  if (!name.includes(cfg.expect)) throw new Error(`nome nao confere ("${j.name}" nao contem "${cfg.expect}")`);
  if (String(j.symbol || '').toUpperCase() !== ticker) throw new Error(`simbolo nao confere (${j.symbol})`);
  const q = j.quotes && j.quotes.USD;
  if (!q || !(q.price > 0)) throw new Error('sem preco');
  return { usd: q.price, change24: typeof q.percent_change_24h === 'number' ? q.percent_change_24h : 0 };
}

// ── Fonte 3: Yahoo Finance (allowlist + nome conferido) ─────────────────────
async function yahooQuote(ticker) {
  const cfg = YAHOO[ticker];
  if (!cfg) throw new Error('fora da allowlist');
  const j = await getJson(`https://query1.finance.yahoo.com/v8/finance/chart/${cfg.symbol}?interval=1d&range=5d`);
  const m = j && j.chart && j.chart.result && j.chart.result[0] && j.chart.result[0].meta;
  if (!m) throw new Error('resposta inesperada');
  const name = String(m.shortName || m.longName || '').toLowerCase();
  if (!name.includes(cfg.expect)) throw new Error(`nome nao confere ("${m.shortName}" nao contem "${cfg.expect}")`);
  const usd = m.regularMarketPrice, prev = m.chartPreviousClose;
  if (!(usd > 0)) throw new Error('sem preco');
  return { usd, change24: prev > 0 ? (usd / prev - 1) * 100 : 0 };
}

// ── Fonte 4: CoinGecko (último — é o que está bloqueado) ────────────────────
async function coingeckoAll(ids) {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=' + ids.join(',')
    + '&vs_currencies=usd&include_24hr_change=true';
  const j = await getJson(url, { tries: 2 });
  const out = {};
  ids.forEach(id => {
    const r = j && j[id];
    if (r && typeof r.usd === 'number') out[id] = { usd: r.usd, change24: typeof r.usd_24h_change === 'number' ? r.usd_24h_change : 0 };
  });
  return out;
}

/**
 * Cotação de todos os ativos.
 * @param assets [{ cgId, ticker }]
 * @param lastKnown { TICKER: preço } — do ponto anterior do histórico
 * @returns { usd:{cgId}, change24:{cgId}, source:{cgId}, byTicker:{TICKER}, missing:[cgId], stale:[TICKER] }
 */
async function spotPrices(assets, { lastKnown = {}, log = console.log } = {}) {
  const usd = {}, change24 = {}, source = {}, byTicker = {};
  const pend = () => assets.filter(a => usd[a.cgId] == null);
  const take = (a, q, src) => {
    usd[a.cgId] = q.usd; change24[a.cgId] = q.change24; source[a.cgId] = src; byTicker[a.ticker] = q.usd;
  };

  // 1. Coinbase
  try {
    const prods = await coinbaseProducts();
    for (const a of pend()) {
      if (!prods.has(a.ticker + '-USD')) continue;
      try { take(a, await coinbaseQuote(a.ticker), 'coinbase'); } catch (e) { log(`  Coinbase ${a.ticker}: ${e.message}`); }
      await sleep(120); // rate limit público
    }
  } catch (e) { log('Coinbase indisponível: ' + e.message); }

  // 2. CoinPaprika (allowlist) — cobre a cauda que a Coinbase não lista
  for (const a of pend()) {
    if (!PAPRIKA[a.ticker]) continue;
    try { take(a, await paprikaQuote(a.ticker), 'coinpaprika'); } catch (e) { log(`  CoinPaprika ${a.ticker}: ${e.message}`); }
    await sleep(120);
  }

  // 3. Yahoo (allowlist)
  for (const a of pend()) {
    if (!YAHOO[a.ticker]) continue;
    try { take(a, await yahooQuote(a.ticker), 'yahoo'); } catch (e) { log(`  Yahoo ${a.ticker}: ${e.message}`); }
  }

  // 4. CoinGecko
  if (pend().length) {
    try {
      const cg = await coingeckoAll(pend().map(a => a.cgId));
      for (const a of pend()) if (cg[a.cgId]) take(a, cg[a.cgId], 'coingecko');
    } catch (e) { log('CoinGecko indisponível: ' + e.message); }
  }

  // 5. Último preço conhecido · 6. paridade da stable
  const stale = [];
  for (const a of pend()) {
    if (typeof lastKnown[a.ticker] === 'number' && lastKnown[a.ticker] > 0) {
      take(a, { usd: lastKnown[a.ticker], change24: 0 }, 'ultimo-conhecido');
      stale.push(a.ticker);
    } else if (STABLE.has(a.ticker)) {
      take(a, { usd: 1, change24: 0 }, 'peg');
      stale.push(a.ticker);
    }
  }

  const missing = pend().map(a => a.cgId);
  const tally = {};
  Object.values(source).forEach(s => { tally[s] = (tally[s] || 0) + 1; });
  log('Preços: ' + Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(' · ')
    + (stale.length ? ` · sem cotação nova: ${stale.join(', ')}` : '')
    + (missing.length ? ` · SEM PREÇO: ${missing.join(', ')}` : ''));

  return { usd, change24, source, byTicker, missing, stale };
}

module.exports = { spotPrices, UA, YAHOO };
