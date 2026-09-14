// getLivePrice (pools.html): o fallback do Jupiter (price.jup.ag, fora do ar) foi trocado pelo
// último preço salvo. Roda a versão ANTIGA (git f2b78d5) e a NOVA lado a lado, com fetch e
// localStorage falsos, e mostra: caminho feliz idêntico; na falha, a antiga disparava uma
// requisição morta por token e devolvia nada — a nova não faz requisição e devolve preço real.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('vm');
const { execSync } = require('child_process');
const H = require('./helpers/extract');

const OLD_HTML = execSync('git show f2b78d5:pools.html', { cwd: H.ROOT, encoding: 'utf8', maxBuffer: 64e6 });
const pick = (html, names) => {
  const js = H.inlineScripts(html).join('\n;\n');
  return 'var _priceCache = {};\nvar LAST_PRICES_KEY = "bc-pools-last-prices";\n' +
    names.filter(n => new RegExp('function\\s+' + n + '\\s*\\(').test(js)).map(n => H.extractFunction(js, n)).join('\n');
};
const NAMES = ['fetchTimeout', '_rememberPrices', '_lastKnownPrices', 'getLivePrice'];
const OLD_SRC = pick(OLD_HTML, NAMES);
const NEW_SRC = pick(H.read('pools.html'), NAMES);

const IDS = ['ethereum', 'solana', 'cardano', 'radiant-capital', 'eigenlayer', 'polygon-ecosystem-token', 'zksync', 'xai-blockchain', 'zetachain'];
const CG = { ethereum: { usd: 2539.37 }, solana: { usd: 102.65 }, cardano: { usd: 0.71 }, 'radiant-capital': { usd: 0.0061 },
  eigenlayer: { usd: 1.12 }, 'polygon-ecosystem-token': { usd: 0.23 }, zksync: { usd: 0.051 }, 'xai-blockchain': { usd: 0.031 }, zetachain: { usd: 0.19 } };

function makeCtx(src, { coingecko = 'ok', storage = {} } = {}) {
  const calls = [];
  const store = Object.assign({}, storage);
  const ctx = vm.createContext({
    console: { log() {}, warn() {}, error() {}, debug() {} },
    setTimeout: () => 0, // os timeouts do fetchTimeout nunca disparam no teste
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    fetch: async url => {
      calls.push(url.replace(/\?.*/, ''));
      if (url.includes('jup.ag')) throw new TypeError('Failed to fetch'); // DNS não resolve mais
      if (coingecko === 'ok') {
        const want = new URL(url).searchParams.get('ids').split(',');
        const body = Object.fromEntries(want.filter(id => CG[id]).map(id => [id, CG[id]]));
        return { ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(body)) };
      }
      return { ok: false, status: 429, json: async () => ({}) };
    }
  });
  vm.runInContext(src, ctx);
  return { ctx, calls, store };
}
const plain = o => JSON.parse(JSON.stringify(o));

test('CoinGecko respondendo: resultado e requisições idênticos à versão antiga', async () => {
  for (const ids of [['ethereum'], ['solana'], ['ethereum', 'solana', 'tether', 'usds'], IDS]) {
    const o = makeCtx(OLD_SRC), n = makeCtx(NEW_SRC);
    assert.deepStrictEqual(plain(await n.ctx.getLivePrice(ids)), plain(await o.ctx.getLivePrice(ids)));
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

test('CoinGecko fora depois de uma resposta boa: a nova devolve o último preço real', async () => {
  const n = makeCtx(NEW_SRC);
  await n.ctx.getLivePrice(IDS);                           // resposta boa → salva
  const later = makeCtx(NEW_SRC, { coingecko: 429, storage: n.store });  // nova visita, CoinGecko em 429
  assert.deepStrictEqual(plain(await later.ctx.getLivePrice(['ethereum', 'cardano'])), { ethereum: CG.ethereum, cardano: CG.cardano });
  assert.deepStrictEqual(later.calls, ['https://api.coingecko.com/api/v3/simple/price']);
});

test('fallback aproveita os caches do portfolio e da landing, e fica com o mais recente', async () => {
  const storage = {
    'bc-prices-cache': JSON.stringify({ ts: 2000, data: { ethereum: { usd: 2500, usd_24h_change: 1 }, solana: { usd: 100 } } }),
    'bc-index-prices-cache': JSON.stringify({ ts: 3000, data: { ethereum: 2600, ethereum_change: 2 } }),
    'bc-pools-last-prices': JSON.stringify({ solana: { usd: 90, ts: 1000 } })
  };
  const n = makeCtx(NEW_SRC, { coingecko: 429, storage });
  // ETH: landing (ts 3000) mais novo que o portfolio (2000). SOL: portfolio (2000) mais novo que o do pools (1000).
  assert.deepStrictEqual(plain(await n.ctx.getLivePrice(['ethereum', 'solana', 'zksync'])), { ethereum: { usd: 2600 }, solana: { usd: 100 } });
});

test('localStorage corrompido ou bloqueado não quebra o fallback', async () => {
  const n = makeCtx(NEW_SRC, { coingecko: 429, storage: { 'bc-prices-cache': '{lixo', 'bc-pools-last-prices': 'null' } });
  assert.deepStrictEqual(plain(await n.ctx.getLivePrice(['ethereum'])), {});
});

test('nenhuma página chama mais o price.jup.ag', () => {
  // Procura a URL como string de código (entre aspas) — o comentário que explica a troca pode citá-la.
  for (const f of ['index.html', 'portfolio_analytics.html', 'pools.html', 'ferramentas.html', 'relatorio.html', 'lib/barolo-core.js', 'lib/barolo-chain.js']) {
    assert.ok(!/['"`]https:\/\/price\.jup\.ag/.test(H.read(f)), f);
  }
});
