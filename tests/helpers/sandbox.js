// Navegador falso para rodar os blocos on-chain das páginas no Node:
//   · fetch responde com as respostas REAIS gravadas em tests/fixtures/chain/responses.json
//     (ou falha do jeito que o cenário mandar) e registra toda chamada feita;
//   · document mínimo (getElementById / innerHTML) que registra o que foi escrito;
//   · timers capturados — nada roda sozinho; o teste dispara e espera.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const H = require('./extract');

const RESPONSES = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'chain', 'responses.json'), 'utf8'));
const CHAIN_SRC = H.read('lib/barolo-chain.js');
const PRICES_SRC = H.read('lib/barolo-prices.js');
const DATA_SRC = H.read('data.js');

const A = {
  main: '0x94e7a5dcbe816e498b89ab752661904e2f56c485',
  bluechip: '0x973a023a77420ba610f06b3858ad991df6d85a08',
  dataProvider: '0x7b4eb56e7cd4b454ba8ff71e4518426369a138a3',
  usdt: 'dac17f958d2ee523a2206206994597c13d831ec7'
};

// Classifica cada requisição numa chave estável (é o que os testes comparam).
function route(url, body) {
  if (url.includes('alchemy.com')) {
    if (body.method === 'eth_getBalance') return 'alchemy:eth_getBalance';
    const { to, data } = body.params[0];
    const t = String(to).toLowerCase(), d = String(data).toLowerCase();
    if (t === A.main) return 'alchemy:eth_call:main';
    if (t === A.bluechip) return 'alchemy:eth_call:bluechip';
    if (t === A.dataProvider) return d.includes(A.usdt) ? 'alchemy:eth_call:reserve-usdt' : 'alchemy:eth_call:reserve-usdc';
    if (d.startsWith('0x70a08231')) return 'alchemy:eth_call:erc20';
    return 'alchemy:other';
  }
  if (url.includes('base.org')) return 'base:' + body.method;
  if (url.includes('helius')) return 'helius:' + body.method;
  if (url.includes('kamino.finance')) {
    if (url.includes('/obligations')) return 'kamino:obligations';
    if (url.includes('/reserves/metrics')) return 'kamino:reserves';
    if (url.includes('/klend/loans/')) return 'kamino:loan';
    return 'kamino:other';
  }
  if (url.includes('blockfrost')) {
    if (url.includes('/addresses/')) return 'blockfrost:address';
    if (url.includes('/rewards')) return 'blockfrost:rewards';
    if (url.includes('/metadata')) return 'blockfrost:pool-metadata';
    if (url.includes('/history')) return 'blockfrost:pool-history';
    if (url.includes('/accounts/')) return 'blockfrost:account';
  }
  return 'other:' + url;
}

const rpcOk = result => ({ jsonrpc: '2.0', id: 1, result });
function payload(R, key) {
  switch (key) {
    case 'alchemy:eth_call:main': return rpcOk(R.aave.main);
    case 'alchemy:eth_call:bluechip':
      return typeof R.aave.bluechip === 'string' ? rpcOk(R.aave.bluechip) : { jsonrpc: '2.0', id: 1, error: { message: 'execution reverted' } };
    case 'alchemy:eth_call:reserve-usdt': return rpcOk(R.aave.reserveUsdt);
    case 'alchemy:eth_call:reserve-usdc': return rpcOk(R.aave.reserveUsdc);
    // Só o código antigo pedia estes; o valor não importa (o resultado nunca era lido).
    case 'alchemy:eth_call:erc20': return rpcOk('0x' + (1234567).toString(16).padStart(64, '0'));
    case 'alchemy:eth_getBalance': return rpcOk('0xde0b6b3a7640000');
    case 'base:eth_call': return rpcOk('0x' + '0'.repeat(64 * 12));
    case 'helius:getBalance': return rpcOk({ value: 1500000000 });
    case 'helius:getTokenAccountsByOwner': return rpcOk({ value: [] });
    case 'kamino:obligations': return R.kamino.obligations;
    case 'kamino:reserves': return R.kamino.reserves;
    case 'kamino:loan': return R.kamino.loan;
    case 'blockfrost:address': return R.cardano.address;
    case 'blockfrost:account': return R.cardano.account;
    case 'blockfrost:pool-metadata': return R.cardano.poolMetadata;
    case 'blockfrost:pool-history': return R.cardano.poolHistory;
    case 'blockfrost:rewards': return R.cardano.rewards;
  }
  throw new Error('requisição inesperada: ' + key);
}

const response = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => JSON.parse(JSON.stringify(data)) });

// fail: { '<chave>' | '<prefixo>': 'network' | 'http500' | 'rpc-error' | 'empty' }
function makeFetch(R, fail, calls) {
  return async function (url, init) {
    const body = init && init.body ? JSON.parse(init.body) : null;
    const key = route(url, body);
    calls.push(key);
    const mode = fail[key] || fail[key.split(':')[0]];
    if (mode === 'network') throw new TypeError('Failed to fetch');
    if (mode === 'http500') return response({}, 500);
    if (mode === 'rpc-error') return response({ jsonrpc: '2.0', id: 1, error: { message: 'execution reverted' } });
    if (mode === 'empty') return response(rpcOk('0x'));
    return response(payload(R, key));
  };
}

function makeDocument(ids) {
  const els = {};
  const touched = new Set();
  const make = id => {
    const el = { id, _text: '', _html: '', className: '', style: {}, querySelector: () => null };
    Object.defineProperty(el, 'textContent', { get() { return this._text; }, set(v) { touched.add(id); this._text = String(v); } });
    Object.defineProperty(el, 'innerHTML', {
      get() { return this._html; },
      set(v) {
        touched.add(id); this._html = String(v);
        for (const m of this._html.matchAll(/id="([^"]+)"/g)) if (!els[m[1]]) els[m[1]] = make(m[1]);
      }
    });
    return el;
  };
  (ids || []).forEach(id => { els[id] = make(id); });
  return {
    readyState: 'complete', addEventListener() {}, touched,
    getElementById: id => els[id] || null,
    querySelector: () => null, querySelectorAll: () => [],
    snapshot: () => Object.fromEntries(Object.entries(els).map(([k, e]) =>
      [k, { text: e._text, html: e._html, className: e.className, style: Object.assign({}, e.style) }]))
  };
}

// Roda um bloco de página (IIFE) como o browser rodaria, com o data.js carregado antes.
// withChain: carrega lib/barolo-chain.js e lib/barolo-prices.js antes do bloco (código novo).
async function runBlock(code, { responses = RESPONSES, fail = {}, ids = [], withChain = false } = {}) {
  const calls = [], timers = [], intervals = [];
  const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {}, debug() {} } });
  ctx.window = ctx;
  ctx.document = makeDocument(ids);
  ctx.fetch = makeFetch(responses, fail, calls);
  ctx.setTimeout = fn => { timers.push(fn); return timers.length; };
  ctx.setInterval = (fn, ms) => { intervals.push(ms); return intervals.length; };
  ctx.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  vm.runInContext(DATA_SRC, ctx);
  if (withChain) { vm.runInContext(CHAIN_SRC, ctx); vm.runInContext(PRICES_SRC, ctx); }
  vm.runInContext(code, ctx);
  while (timers.length) await timers.shift()();
  return { ctx, calls, intervals, doc: ctx.document };
}

module.exports = { RESPONSES, runBlock, route };
