// Preço compartilhado (lib/barolo-prices.js) e o getLivePrice do pools, que hoje só delega a ele.
//
// 1) Equivalência com a versão ANTIGA do getLivePrice (tests/fixtures/legacy-chain.js →
//    poolsPrice, com o fallback morto do price.jup.ag): caminho feliz com o MESMO PREÇO; na
//    falha, a antiga disparava uma requisição morta por token e devolvia nada.
//    ⚠️ A requisição deixou de ser a mesma em 29/09/2026: o CoinGecko passou a responder 403
//    sem chave e o preço virou cascata (Coinbase /products/stats → CoinPaprika → CoinGecko).
//    O que se compara agora é o preço entregue, não a URL.
// 2) O que a Fase 4 (15/09/2026) acrescentou: cache entre páginas, busca só do que está velho,
//    pedidos simultâneos juntos, pausa depois de falha, e o polling que para com a aba oculta.
// Não usa `git show`: o checkout do GitHub Actions só baixa o último commit.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('vm');
const H = require('./helpers/extract');
const LEG = require('./fixtures/legacy-chain.js');

const LIB = H.read('lib/barolo-prices.js');
const PAGES = ['index.html', 'portfolio_analytics.html', 'pools.html', 'ferramentas.html', 'relatorio.html'];
const NEW_JS = H.inlineScripts(H.read('pools.html')).join('\n;\n');
const OLD_SRC = 'var _priceCache = {};\nvar LAST_PRICES_KEY = "bc-pools-last-prices";\n' + LEG.poolsPrice;
const NEW_SRC = LIB + '\n' + H.extractFunction(NEW_JS, 'getLivePrice');

const IDS = ['ethereum', 'solana', 'cardano', 'radiant-capital', 'eigenlayer', 'polygon-ecosystem-token', 'zksync', 'xai-blockchain', 'zetachain'];
const CG = { ethereum: { usd: 2539.37, usd_24h_change: 1.5 }, solana: { usd: 102.65, usd_24h_change: -2 }, cardano: { usd: 0.71 },
  'radiant-capital': { usd: 0.0061 }, eigenlayer: { usd: 1.12 }, 'polygon-ecosystem-token': { usd: 0.23 }, zksync: { usd: 0.051 },
  'xai-blockchain': { usd: 0.031 }, zetachain: { usd: 0.19 }, bitcoin: { usd: 77378, usd_24h_change: 0.4 } };

// Como cada fonte enxerga os mesmos ativos do CG acima.
const TICKER = { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL', cardano: 'ADA', eigenlayer: 'EIGEN',
  'polygon-ecosystem-token': 'POL', zksync: 'ZK', zetachain: 'ZETA', usds: 'USDS' };
// A cauda que a Coinbase não lista (é por isso que a CoinPaprika entra na cascata).
const PAP = { 'radiant-capital': { id: 'rdnt-radiant-capital', name: 'Radiant Capital', sym: 'RDNT' },
  'xai-blockchain': { id: 'xai-xai-games', name: 'Xai Games', sym: 'XAI' },
  scroll: { id: 'scr-scroll', name: 'Scroll', sym: 'SCR' } };
const CB_URL = 'https://api.exchange.coinbase.com/products/stats';
const CG_URL = 'https://api.coingecko.com/api/v3/simple/price';

// `net: 'down'` derruba TODAS as fontes (a opção antiga era por CoinGecko, de quando só havia uma).
function makeCtx(src, { net = 'ok', storage = {}, doc = null, slow = false } = {}) {
  const calls = [], urls = [], intervals = [];
  const store = Object.assign({}, storage);
  let release;
  const gate = slow ? new Promise(r => { release = r; }) : null;
  const ctx = vm.createContext({
    console: { log() {}, warn() {}, error() {}, debug() {} },
    setTimeout: () => 0, // os timeouts nunca disparam no teste
    setInterval: (fn, ms) => { intervals.push({ fn, ms }); return intervals.length; },
    clearInterval: () => {},
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    fetch: async url => {
      calls.push(url.replace(/\?.*/, ''));
      urls.push(url);
      if (gate) await gate;
      if (url.includes('jup.ag')) throw new TypeError('Failed to fetch'); // DNS não resolve mais
      const down = { ok: false, status: 429, json: async () => ({}) };
      if (net !== 'ok') return down;

      // Coinbase: um objeto com TODOS os pares. `open` é derivado da variação para
      // que o preço e o 24h saiam iguais aos do CoinGecko (base da equivalência).
      if (url.startsWith(CB_URL)) {
        const body = {};
        Object.keys(CG).forEach(id => {
          if (!TICKER[id]) return;
          const chg = CG[id].usd_24h_change || 0;
          body[TICKER[id] + '-USD'] = { stats_24hour: { last: String(CG[id].usd), open: String(CG[id].usd / (1 + chg / 100)) } };
        });
        return { ok: true, status: 200, json: async () => body };
      }
      if (url.includes('coinpaprika.com')) {
        const pid = url.split('/tickers/')[1];
        const id = Object.keys(PAP).find(k => PAP[k].id === pid);
        if (!id || !CG[id]) return { ok: false, status: 404, json: async () => ({}) };
        return { ok: true, status: 200, json: async () => ({ name: PAP[id].name, symbol: PAP[id].sym,
          quotes: { USD: { price: CG[id].usd, percent_change_24h: CG[id].usd_24h_change || 0 } } }) };
      }
      const want = new URL(url).searchParams.get('ids').split(',');
      const body = Object.fromEntries(want.filter(id => CG[id]).map(id => [id, CG[id]]));
      return { ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(body)) };
    }
  });
  if (doc) ctx.document = doc;
  ctx.window = ctx;
  vm.runInContext(src, ctx);
  return { ctx, calls, urls, store, intervals, release: () => release && release() };
}
const plain = o => JSON.parse(JSON.stringify(o));
const usdOnly = o => Object.fromEntries(Object.entries(plain(o)).map(([k, v]) => [k, { usd: v.usd }]));
const idsOf = url => new URL(url).searchParams.get('ids').split(',').sort();

// ── 1) Equivalência com a versão antiga ─────────────────────────────────────
test('fontes no ar: mesmo preço que a versão antiga entregava pelo CoinGecko', async () => {
  for (const ids of [['ethereum'], ['solana'], ['ethereum', 'solana', 'tether', 'usds'], IDS]) {
    const o = makeCtx(OLD_SRC), n = makeCtx(NEW_SRC);
    assert.deepStrictEqual(usdOnly(await n.ctx.getLivePrice(ids)), usdOnly(await o.ctx.getLivePrice(ids)));
  }
});

test('cascata: 1 requisição em lote na Coinbase + 1 por token da cauda, sem chegar ao CoinGecko', async () => {
  const n = makeCtx(NEW_SRC);
  await n.ctx.getLivePrice(IDS);
  const cauda = IDS.filter(id => PAP[id]);                         // radiant-capital e xai-blockchain
  assert.ok(cauda.length >= 2, 'o cenário precisa ter tokens fora da Coinbase');
  assert.strictEqual(n.calls.filter(u => u === CB_URL).length, 1, 'a Coinbase é uma chamada só para todos os pares');
  assert.strictEqual(n.calls.filter(u => u.includes('coinpaprika')).length, cauda.length);
  assert.strictEqual(n.calls.filter(u => u.startsWith(CG_URL)).length, 0, 'com as duas primeiras fontes servindo, o CoinGecko nem é consultado');
});

test('todas as fontes fora, sem nada salvo: a antiga fazia 1 requisição morta por token; a nova tenta a cascata e devolve nada', async () => {
  const o = makeCtx(OLD_SRC, { net: 'down' }), n = makeCtx(NEW_SRC, { net: 'down' });
  assert.deepStrictEqual(plain(await o.ctx.getLivePrice(IDS)), {});
  assert.deepStrictEqual(plain(await n.ctx.getLivePrice(IDS)), {});
  assert.strictEqual(o.calls.filter(u => u.includes('jup.ag')).length, IDS.length);
  assert.strictEqual(n.calls[0], CB_URL, 'começa pela Coinbase');
  assert.ok(n.calls[n.calls.length - 1].startsWith(CG_URL), 'e só então tenta o CoinGecko');
});

test('fontes fora depois de uma resposta boa: devolve o último preço real, marcado _stale', async () => {
  const n = makeCtx(NEW_SRC);
  await n.ctx.getLivePrice(IDS);                                   // resposta boa → salva em bc-px
  const px = JSON.parse(n.store['bc-px']);
  for (const id of IDS) px[id].ts -= 10 * 60 * 1000;               // 10 min depois: velho
  const later = makeCtx(NEW_SRC, { net: 'down', storage: Object.assign({}, n.store, { 'bc-px': JSON.stringify(px) }) });
  const r = await later.ctx.getLivePrice(['ethereum', 'cardano']);
  assert.deepStrictEqual(usdOnly(r), { ethereum: { usd: CG.ethereum.usd }, cardano: { usd: CG.cardano.usd } });
  // a variação vem recalculada de last/open na Coinbase — mesma coisa, com ruído de float
  assert.ok(Math.abs(r.ethereum.usd_24h_change - CG.ethereum.usd_24h_change) < 1e-9);
  assert.strictEqual(r._stale, true);
  assert.ok(!Object.keys(r).includes('_stale'), '_stale não pode aparecer ao iterar o resultado');
  assert.strictEqual(later.calls[0], CB_URL);
});

test('fallback aproveita os caches do portfolio, da landing e o antigo do pools, e fica com o mais recente', async () => {
  const storage = {
    'bc-prices-cache': JSON.stringify({ ts: 2000, data: { ethereum: { usd: 2500, usd_24h_change: 1 }, solana: { usd: 100 } } }),
    'bc-index-prices-cache': JSON.stringify({ ts: 3000, data: { ethereum: 2600, ethereum_change: 2 } }),
    'bc-pools-last-prices': JSON.stringify({ solana: { usd: 90, ts: 1000 } })
  };
  const n = makeCtx(NEW_SRC, { net: 'down', storage });
  // ETH: landing (ts 3000) mais novo que o portfolio (2000). SOL: portfolio (2000) mais novo que o do pools (1000).
  assert.deepStrictEqual(plain(await n.ctx.getLivePrice(['ethereum', 'solana', 'zksync'])),
    { ethereum: { usd: 2600, usd_24h_change: 2 }, solana: { usd: 100 } });
});

test('localStorage corrompido ou bloqueado não quebra', async () => {
  const n = makeCtx(NEW_SRC, { net: 'down', storage: { 'bc-px': '[1,2', 'bc-prices-cache': '{lixo', 'bc-pools-last-prices': 'null' } });
  assert.deepStrictEqual(plain(await n.ctx.getLivePrice(['ethereum'])), {});
  const blocked = makeCtx(NEW_SRC);
  blocked.ctx.localStorage = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('SecurityError'); } };
  assert.deepStrictEqual(usdOnly(await blocked.ctx.getLivePrice(['ethereum'])), { ethereum: { usd: CG.ethereum.usd } });
});

// ── 2) Cache compartilhado e polling ────────────────────────────────────────
test('outra página dentro de 60 s: zero requisições (o preço vem do bc-px)', async () => {
  const a = makeCtx(LIB);
  await a.ctx.BaroloPrices.get(IDS);
  const b = makeCtx(LIB, { storage: a.store });                    // outra aba/página, mesma origem
  assert.deepStrictEqual(usdOnly(await b.ctx.BaroloPrices.get(['ethereum', 'zksync'])),
    { ethereum: { usd: CG.ethereum.usd }, zksync: { usd: CG.zksync.usd } });
  assert.deepStrictEqual(b.calls, []);
});

test('o cache do portfolio (bc-prices-cache) recente também serve, com a variação 24h', async () => {
  const storage = { 'bc-prices-cache': JSON.stringify({ ts: Date.now(), data: { bitcoin: { usd: 70000, usd_24h_change: 3 } } }) };
  const n = makeCtx(LIB, { storage });
  assert.deepStrictEqual(plain(await n.ctx.BaroloPrices.get(['bitcoin'])), { bitcoin: { usd: 70000, usd_24h_change: 3 } });
  assert.deepStrictEqual(n.calls, []);
});

test('só os ids velhos vão para a requisição', async () => {
  const t = Date.now();
  const storage = { 'bc-px': JSON.stringify({
    ethereum: { usd: 2400, chg: 1, ts: t },
    solana: { usd: 90, chg: 0, ts: t - 5 * 60 * 1000 },
    'radiant-capital': { usd: 0.005, chg: 0, ts: t }
  }) };
  const n = makeCtx(LIB, { storage });
  const r = await n.ctx.BaroloPrices.get(['ethereum', 'solana', 'radiant-capital']);
  // A Coinbase é em lote (a URL não leva ids), então o que se mede é: buscou uma vez só e
  // não foi à paprika atrás do RDNT, que estava fresco.
  assert.deepStrictEqual(n.calls, [CB_URL]);
  assert.strictEqual(r.ethereum.usd, 2400);                        // fresco: não buscou
  assert.strictEqual(r['radiant-capital'].usd, 0.005);             // fresco (e da cauda): não buscou
  assert.strictEqual(r.solana.usd, CG.solana.usd);                 // velho: buscou
  // maxAge maior aceita o velho sem buscar
  const m = makeCtx(LIB, { storage });
  await m.ctx.BaroloPrices.get(['ethereum', 'solana'], { maxAge: 30 * 60 * 1000 });
  assert.deepStrictEqual(m.calls, []);
});

test('pedidos simultâneos da mesma página se juntam (cada id pedido uma vez só)', async () => {
  const n = makeCtx(LIB, { slow: true });
  const P = n.ctx.BaroloPrices;
  const all = Promise.all([P.get(['ethereum', 'solana']), P.get(['solana', 'ethereum']), P.get(['solana', 'cardano'])]);
  n.release();
  const [a, b, c] = await all;
  // 2 buscas: a 1ª junta ethereum+solana (os 2 primeiros pedidos), a 2ª só o cardano —
  // o 2º pedido não refez nada, porque os ids dele já estavam em voo.
  assert.deepStrictEqual(n.calls, [CB_URL, CB_URL]);
  assert.strictEqual(a.solana.usd, CG.solana.usd);
  assert.strictEqual(b.ethereum.usd, CG.ethereum.usd);
  assert.strictEqual(c.cardano.usd, CG.cardano.usd);
});

test('depois de uma falha espera 30 s antes de bater de novo (sem rajada de 429)', async () => {
  const n = makeCtx(LIB, { net: 'down' });
  await n.ctx.BaroloPrices.get(['ethereum']);
  const gastas = n.calls.length;                                    // a cascata inteira, uma vez
  const again = await n.ctx.BaroloPrices.get(['ethereum', 'solana']);
  assert.strictEqual(n.calls.length, gastas, 'na pausa não pode sair nenhuma requisição nova');
  assert.strictEqual(again._stale, true);
});

test('id que nenhuma fonte devolve não é pedido de novo a cada chamada', async () => {
  const n = makeCtx(LIB);
  await n.ctx.BaroloPrices.get(['ethereum', 'tether']);             // o mock não conhece tether
  const gastas = n.calls.length;
  await n.ctx.BaroloPrices.get(['ethereum', 'tether']);
  assert.strictEqual(n.calls.length, gastas);
});

test('poll: não roda com a aba oculta e, ao voltar, roda na hora se já passou o intervalo', async () => {
  let listener = null;
  const doc = { hidden: false, visibilityState: 'visible', addEventListener: (ev, fn) => { if (ev === 'visibilitychange') listener = fn; } };
  const n = makeCtx(LIB, { doc });
  let runs = 0;
  n.ctx.BaroloPrices.poll(() => { runs++; }, 5);
  assert.strictEqual(n.intervals.length, 1);
  assert.strictEqual(n.intervals[0].ms, 5);

  n.intervals[0].fn();                                             // visível: roda
  assert.strictEqual(runs, 1);

  doc.hidden = true; doc.visibilityState = 'hidden';
  n.intervals[0].fn(); n.intervals[0].fn();                        // oculta: não roda
  assert.strictEqual(runs, 1);

  await new Promise(r => setTimeout(r, 10));                        // passou o intervalo
  doc.hidden = false; doc.visibilityState = 'visible';
  listener();                                                      // voltou: roda na hora
  assert.strictEqual(runs, 2);
  listener();                                                      // logo em seguida: não repete
  assert.strictEqual(runs, 2);
});

// ── Regras para as páginas ──────────────────────────────────────────────────
test('nenhuma página chama mais o price.jup.ag', () => {
  // Procura a URL como string de código (entre aspas) — o comentário que explica a troca pode citá-la.
  for (const f of PAGES.concat(['lib/barolo-core.js', 'lib/barolo-chain.js', 'lib/barolo-prices.js'])) {
    assert.ok(!/['"`]https:\/\/price\.jup\.ag/.test(H.read(f)), f);
  }
});

test('preço em USD do CoinGecko só pelo módulo: /simple/price direto só onde a moeda é outra', () => {
  // Só sobrou a 2ª tentativa do portfolio (fallback do /coins/markets, antes da cascata).
  // O câmbio BRL do portfolio e da aba Fiscal passaram para BaroloPrices.usdBrl() em 29/09/2026.
  const allowed = { 'index.html': 0, 'pools.html': 0, 'relatorio.html': 0, 'ferramentas.html': 0, 'portfolio_analytics.html': 1 };
  for (const f of PAGES) {
    const js = H.inlineScripts(H.read(f)).join('\n');
    const n = (js.match(/api\.coingecko\.com\/api\/v3\/simple\/price/g) || []).length;
    assert.strictEqual(n, allowed[f], `${f}: ${n} chamadas diretas ao /simple/price`);
  }
});

test('nenhum setInterval de rede sobra nas páginas (tudo por BaroloPrices.poll)', () => {
  // Os que ficam são locais, sem rede: redesenho do dashboard da landing e os alertas do ferramentas.
  const allowed = { 'index.html': ['renderAll'], 'ferramentas.html': ['()=>checkAlerts(false)'] };
  for (const f of PAGES) {
    const js = H.inlineScripts(H.read(f)).join('\n');
    const found = [...js.matchAll(/setInterval\(\s*([^,]+),/g)].map(m => m[1].trim());
    assert.deepStrictEqual(found, allowed[f] || [], f);
  }
});

test('pools: a chamada morta à Etherscan V1 saiu', () => {
  assert.ok(!/api\.etherscan\.io/.test(H.inlineScripts(H.read('pools.html')).join('\n')));
});
