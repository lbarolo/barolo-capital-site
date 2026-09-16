// Preço compartilhado (lib/barolo-prices.js) e o getLivePrice do pools, que hoje só delega a ele.
//
// 1) Equivalência com a versão ANTIGA do getLivePrice (tests/fixtures/legacy-chain.js →
//    poolsPrice, com o fallback morto do price.jup.ag): caminho feliz com o mesmo preço e a mesma
//    requisição; na falha, a antiga disparava uma requisição morta por token e devolvia nada.
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

function makeCtx(src, { coingecko = 'ok', storage = {}, doc = null, slow = false } = {}) {
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
      if (coingecko === 'ok') {
        const want = new URL(url).searchParams.get('ids').split(',');
        const body = Object.fromEntries(want.filter(id => CG[id]).map(id => [id, CG[id]]));
        return { ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(body)) };
      }
      return { ok: false, status: 429, json: async () => ({}) };
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
test('CoinGecko respondendo: mesmo preço e mesma requisição que a versão antiga', async () => {
  for (const ids of [['ethereum'], ['solana'], ['ethereum', 'solana', 'tether', 'usds'], IDS]) {
    const o = makeCtx(OLD_SRC), n = makeCtx(NEW_SRC);
    assert.deepStrictEqual(usdOnly(await n.ctx.getLivePrice(ids)), usdOnly(await o.ctx.getLivePrice(ids)));
    assert.deepStrictEqual(n.calls, o.calls);
  }
});

test('CoinGecko fora (429) sem nada salvo: a antiga fazia 1 requisição morta por token; a nova, nenhuma', async () => {
  const o = makeCtx(OLD_SRC, { coingecko: 429 }), n = makeCtx(NEW_SRC, { coingecko: 429 });
  assert.deepStrictEqual(plain(await o.ctx.getLivePrice(IDS)), {});
  assert.deepStrictEqual(plain(await n.ctx.getLivePrice(IDS)), {});
  assert.strictEqual(o.calls.filter(u => u.includes('jup.ag')).length, IDS.length);
  assert.deepStrictEqual(n.calls, ['https://api.coingecko.com/api/v3/simple/price']);
});

test('CoinGecko fora depois de uma resposta boa: devolve o último preço real, marcado _stale', async () => {
  const n = makeCtx(NEW_SRC);
  await n.ctx.getLivePrice(IDS);                                   // resposta boa → salva em bc-px
  const px = JSON.parse(n.store['bc-px']);
  for (const id of IDS) px[id].ts -= 10 * 60 * 1000;               // 10 min depois: velho
  const later = makeCtx(NEW_SRC, { coingecko: 429, storage: Object.assign({}, n.store, { 'bc-px': JSON.stringify(px) }) });
  const r = await later.ctx.getLivePrice(['ethereum', 'cardano']);
  assert.deepStrictEqual(plain(r), { ethereum: CG.ethereum, cardano: CG.cardano });
  assert.strictEqual(r._stale, true);
  assert.ok(!Object.keys(r).includes('_stale'), '_stale não pode aparecer ao iterar o resultado');
  assert.deepStrictEqual(later.calls, ['https://api.coingecko.com/api/v3/simple/price']);
});

test('fallback aproveita os caches do portfolio, da landing e o antigo do pools, e fica com o mais recente', async () => {
  const storage = {
    'bc-prices-cache': JSON.stringify({ ts: 2000, data: { ethereum: { usd: 2500, usd_24h_change: 1 }, solana: { usd: 100 } } }),
    'bc-index-prices-cache': JSON.stringify({ ts: 3000, data: { ethereum: 2600, ethereum_change: 2 } }),
    'bc-pools-last-prices': JSON.stringify({ solana: { usd: 90, ts: 1000 } })
  };
  const n = makeCtx(NEW_SRC, { coingecko: 429, storage });
  // ETH: landing (ts 3000) mais novo que o portfolio (2000). SOL: portfolio (2000) mais novo que o do pools (1000).
  assert.deepStrictEqual(plain(await n.ctx.getLivePrice(['ethereum', 'solana', 'zksync'])),
    { ethereum: { usd: 2600, usd_24h_change: 2 }, solana: { usd: 100 } });
});

test('localStorage corrompido ou bloqueado não quebra', async () => {
  const n = makeCtx(NEW_SRC, { coingecko: 429, storage: { 'bc-px': '[1,2', 'bc-prices-cache': '{lixo', 'bc-pools-last-prices': 'null' } });
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
  const storage = { 'bc-px': JSON.stringify({ ethereum: { usd: 2400, chg: 1, ts: t }, solana: { usd: 90, chg: 0, ts: t - 5 * 60 * 1000 } }) };
  const n = makeCtx(LIB, { storage });
  const r = await n.ctx.BaroloPrices.get(['ethereum', 'solana']);
  assert.deepStrictEqual(n.urls.map(idsOf), [['solana']]);
  assert.strictEqual(r.ethereum.usd, 2400);                        // fresco: não buscou
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
  assert.deepStrictEqual(n.urls.map(idsOf), [['ethereum', 'solana'], ['cardano']]);
  assert.strictEqual(a.solana.usd, CG.solana.usd);
  assert.strictEqual(b.ethereum.usd, CG.ethereum.usd);
  assert.strictEqual(c.cardano.usd, CG.cardano.usd);
});

test('depois de uma falha espera 30 s antes de bater de novo (sem rajada de 429)', async () => {
  const n = makeCtx(LIB, { coingecko: 429 });
  await n.ctx.BaroloPrices.get(['ethereum']);
  const again = await n.ctx.BaroloPrices.get(['ethereum', 'solana']);
  assert.strictEqual(n.calls.length, 1);
  assert.strictEqual(again._stale, true);
});

test('id que o CoinGecko não devolve não é pedido de novo a cada chamada', async () => {
  const n = makeCtx(LIB);
  await n.ctx.BaroloPrices.get(['ethereum', 'tether']);             // o mock não conhece tether
  await n.ctx.BaroloPrices.get(['ethereum', 'tether']);
  assert.strictEqual(n.calls.length, 1);
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
  // Exceções que ficam: portfolio (fallback do /coins/markets e o câmbio tether→BRL) e a aba Fiscal
  // do ferramentas (usd+brl). O resto usa BaroloPrices.get.
  const allowed = { 'index.html': 0, 'pools.html': 0, 'relatorio.html': 0, 'ferramentas.html': 1, 'portfolio_analytics.html': 2 };
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
