#!/usr/bin/env node
/* Dados diários da Mesa DeFi (mesa.html) — Barolo Capital.
 * Grava dois arquivos estáticos que a página lê (mesmo padrão do btc-onchain.json):
 *   mesa-dados.json  — saída do scripts/quant-report.js --json (vol, correlação, beta, VaR/CVaR,
 *                 contribuição de risco, tendência, macro FRED, on-chain) + generatedAt.
 *   yields.json — recorte do DefiLlama Yields (10 MB → ~50 KB): onde o colateral rende,
 *                 onde a dívida custa menos e as pools "chatas" (par com stable ou blue-chip).
 *   mesa-dados.json.ta — RSI 14 diário/semanal, retornos 7/30d, MM50/MM200, vol de BTC/ETH/SOL/HYPE (motor de sugestões).
 * Sem chave: Coinbase, FRED, yields.llama.fi. Uso: node scripts/fetch-mesa.js
 * O recorte segue a regra da casa (KB §3.4 e §12): só protocolos grandes, só pares chatos —
 * 22 vitórias e zero derrotas nas chatas; narrativa foi 1 de 7. Memecoin nem entra na lista. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const UA = { 'User-Agent': 'Mozilla/5.0 (barolo-mesa)' };

// família de cada token (para agrupar "WETH-USDC" e "ETH-USDC" no mesmo par)
const FAM = {
  ETH:  ['ETH', 'WETH'],
  LST:  ['WSTETH', 'STETH', 'WEETH', 'CBETH', 'RETH', 'EZETH', 'RSETH'],
  SOL:  ['SOL', 'WSOL'],
  LSOL: ['JITOSOL', 'MSOL', 'JUPSOL', 'BSOL', 'INF', 'DSOL', 'HSOL', 'BNSOL'],
  BTC:  ['WBTC', 'CBBTC', 'TBTC', 'LBTC', 'BTC'],
  USD:  ['USDC', 'USDT', 'GHO', 'USDS', 'SUSDS', 'DAI', 'SDAI', 'PYUSD', 'USDC.E', 'USDE', 'USDG', 'RLUSD', 'FDUSD'],
};
const famOf = s => { s = String(s || '').toUpperCase(); for (const f in FAM) if (FAM[f].includes(s)) return f; return null; };
const LEND = new Set(['aave-v3', 'aave-v4', 'kamino-lend', 'morpho-blue', 'sparklend', 'spark-savings', 'sky-lending',
  'compound-v3', 'fluid-lending', 'euler-v2', 'jupiter-lend']);
const STAKE = new Set(['lido', 'jito-liquid-staking', 'jupiter-staked-sol', 'rocket-pool', 'marinade-liquid-staking', 'binance-staked-sol']);
const DEX = new Set(['uniswap-v3', 'uniswap-v4', 'orca-dex', 'raydium-amm', 'aerodrome-slipstream', 'fluid-dex', 'meteora-dlmm']);
const CHAINS = new Set(['Ethereum', 'Arbitrum', 'Base', 'Solana', 'Optimism']);

async function getJSON(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (r.ok) return await r.json();
      if (r.status >= 400 && r.status < 500) throw new Error('HTTP ' + r.status);
    } catch (e) { if (i === tries - 1) throw e; }
    await new Promise(res => setTimeout(res, 5000 * (i + 1)));
  }
}
const r2 = x => (x == null || !isFinite(x)) ? null : Math.round(x * 100) / 100;

async function yields() {
  const [pools, lb] = await Promise.all([getJSON('https://yields.llama.fi/pools'), getJSON('https://yields.llama.fi/lendBorrow')]);
  const P = pools.data || [];
  if (P.length < 1000) throw new Error('DefiLlama devolveu só ' + P.length + ' pools');
  const byId = new Map(P.map(p => [p.pool, p]));
  const row = p => ({ id: p.pool, project: p.project, chain: p.chain, symbol: p.symbol, meta: p.poolMeta || null,
    apy: r2(p.apy), base: r2(p.apyBase), reward: r2(p.apyReward), mean30: r2(p.apyMean30d), tvl: Math.round(p.tvlUsd) });

  // 1) onde o colateral rende (supply / staking, um token só)
  const supply = P.filter(p => CHAINS.has(p.chain) && (LEND.has(p.project) || STAKE.has(p.project)) &&
      p.exposure === 'single' && !p.outlier && p.tvlUsd >= 20e6 && famOf(p.symbol) && p.apy > 0 && p.apy < 40)
    .map(p => Object.assign(row(p), { fam: famOf(p.symbol), kind: STAKE.has(p.project) ? 'stake' : 'lend' }))
    .sort((a, b) => (b.mean30 ?? b.apy) - (a.mean30 ?? a.apy));
  const topSupply = {};
  for (const r of supply) { (topSupply[r.fam] = topSupply[r.fam] || []); if (topSupply[r.fam].length < 8) topSupply[r.fam].push(r); }

  // 2) onde a dívida custa menos (stables), juntando lendBorrow ao pool pelo id
  const borrow = (Array.isArray(lb) ? lb : []).map(b => {
    const p = byId.get(b.pool); if (!p) return null;
    if (!CHAINS.has(p.chain) || !LEND.has(p.project) || famOf(p.symbol) !== 'USD' || !b.borrowable) return null;
    if (!(b.totalSupplyUsd >= 20e6) || b.apyBaseBorrow == null) return null;
    const net = b.apyBaseBorrow - (b.apyRewardBorrow || 0);
    if (!(net > 0 && net < 40)) return null;
    return Object.assign(row(p), { borrowBase: r2(b.apyBaseBorrow), borrowReward: r2(b.apyRewardBorrow), borrowNet: r2(net),
      totalBorrow: Math.round(b.totalBorrowUsd || 0), util: b.totalSupplyUsd ? r2(b.totalBorrowUsd / b.totalSupplyUsd * 100) : null });
  }).filter(Boolean).sort((a, b) => a.borrowNet - b.borrowNet).slice(0, 25);

  // 3) pools chatas: os dois lados ETH/BTC/SOL/stable (ou LST desses), TVL >= 1M
  const lp = P.filter(p => CHAINS.has(p.chain) && DEX.has(p.project) && p.exposure === 'multi' && !p.outlier && p.tvlUsd >= 1e6)
    .map(p => {
      const parts = String(p.symbol).split('-'); if (parts.length !== 2) return null;
      const f = parts.map(famOf); if (f.some(x => !x)) return null;
      const norm = x => ({ LST: 'ETH', LSOL: 'SOL' })[x] || x;
      const RANK = { SOL: 0, ETH: 1, BTC: 2, USD: 3 };   // ETH/BTC, SOL/USD… (ordem fixa: sem par duplicado)
      const key = f.map(norm).sort((a, b) => RANK[a] - RANK[b]).join('/');
      if (key === 'USD/USD') return null;   // stable/stable não é a estratégia
      const v1 = p.volumeUsd1d || null;
      return Object.assign(row(p), { pair: key, base7: r2(p.apyBase7d), vol1d: v1 && Math.round(v1),
        volTvl: v1 ? r2(v1 / p.tvlUsd) : null, il7: r2(p.il7d) });
    }).filter(r => r && r.base != null && r.base > 0 && r.base < 400)
    .sort((a, b) => (b.mean30 ?? b.base) - (a.mean30 ?? a.base));
  const perPair = {}, lpTop = [];
  for (const r of lp) { perPair[r.pair] = (perPair[r.pair] || 0) + 1; if (perPair[r.pair] <= 12) lpTop.push(r); }

  return { generatedAt: new Date().toISOString(), source: 'DefiLlama yields.llama.fi (pools + lendBorrow)',
    filters: { chains: [...CHAINS], lend: [...LEND], stake: [...STAKE], dex: [...DEX], minTvlLend: 20e6, minTvlLp: 1e6 },
    supply: topSupply, borrow, lp: lpTop };
}

// Análise técnica curta para o motor de sugestões da Mesa (RSI, retornos, médias, vol).
// Coinbase Exchange: 300 candles diários por chamada, responde no runner (a Binance dá 451).
async function candles(prod) {
  const end = Date.now(), start = end - 299 * 864e5;
  const u = 'https://api.exchange.coinbase.com/products/' + prod + '/candles?granularity=86400&start=' +
    new Date(start).toISOString() + '&end=' + new Date(end).toISOString();
  const j = await getJSON(u);
  if (!Array.isArray(j) || j.length < 60) throw new Error(prod + ': poucos candles');
  return j.map(c => [c[0], c[4]]).sort((a, b) => a[0] - b[0]).map(c => c[1]);
}
function rsi(cl, n = 14) {
  if (cl.length < n + 1) return null;
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) { const d = cl[i] - cl[i - 1]; if (d > 0) g += d; else l -= d; }
  g /= n; l /= n;
  for (let i = n + 1; i < cl.length; i++) { const d = cl[i] - cl[i - 1]; g = (g * (n - 1) + Math.max(d, 0)) / n; l = (l * (n - 1) + Math.max(-d, 0)) / n; }
  return l === 0 ? 100 : 100 - 100 / (1 + g / l);
}
async function technicals() {
  const out = {};
  for (const k of ['BTC', 'ETH', 'SOL', 'HYPE']) {
    try {
      const cl = await candles(k + '-USD'), p = cl[cl.length - 1];
      const ma = n => cl.length >= n ? cl.slice(-n).reduce((a, x) => a + x, 0) / n : null;
      const lr = cl.slice(1).map((v, i) => Math.log(v / cl[i]));
      const sd = a => { const m = a.reduce((s, x) => s + x, 0) / a.length; return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
      const wk = []; for (let i = cl.length - 1; i >= 0; i -= 7) wk.unshift(cl[i]);
      const hi = Math.max(...cl.slice(-90)), lo = Math.min(...cl.slice(-90));
      out[k] = { price: p, days: cl.length, rsi14d: rsi(cl), rsi14w: rsi(wk),
        ret7: p / cl[cl.length - 8] - 1, ret30: p / cl[cl.length - 31] - 1,
        ma50: ma(50), ma200: ma(200), vsMa50: ma(50) ? p / ma(50) - 1 : null, vsMa200: ma(200) ? p / ma(200) - 1 : null,
        vol30: sd(lr.slice(-30)) * Math.sqrt(365), vol90: sd(lr.slice(-90)) * Math.sqrt(365),
        hi90: hi, lo90: lo, pos90: (p - lo) / (hi - lo || 1), ddHi: p / Math.max(...cl) - 1 };
    } catch (e) { console.warn('TA ' + k + ': ' + e.message); }
  }
  return out;
}

// Liquidez americana → piso do HF do looping (regra do Lucas, 26/11/2026; números aprovados por ele no mesmo dia).
// Liquidez líquida do Fed = balanço (WALCL) − reverse repo (RRPONTSYD) − conta do Tesouro (WTREGEN), em US$ bi.
// 5 sinais; a favor ≥ 3 → EXPANSÃO (HF 2,5 / 1,5σ) · 2 → NEUTRA (HF 3 / 2σ) · ≤ 1 → APERTO (HF 4 / 2,5σ).
// Piso absoluto HF 2,0. Dados semanais: a faixa só muda com dado novo. ⚠️ No PC do Lucas o curl trava no FRED; o fetch funciona.
async function fredSeries(id) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 30000);
  try {
    const r = await fetch('https://fred.stlouisfed.org/graph/fredgraph.csv?id=' + id, { headers: UA, signal: c.signal });
    const txt = await r.text();
    return txt.trim().split(String.fromCharCode(10)).slice(1).map(l => l.trim().split(',')).filter(a => a[1] && a[1] !== '.').map(a => [a[0], +a[1]]);
  } finally { clearTimeout(t); }
}
async function liquidity(q) {
  const S = {};
  for (const id of ['WALCL', 'RRPONTSYD', 'WTREGEN', 'NFCI', 'DFII10']) S[id] = await fredSeries(id);
  const at = (s, d) => { let v = null; for (const x of s) { if (x[0] <= d) v = x[1]; else break; } return v; };
  const ago = (d, n) => { const x = new Date(d); x.setDate(x.getDate() - n); return x.toISOString().slice(0, 10); };
  const net = d => at(S.WALCL, d) / 1e3 - at(S.RRPONTSYD, d) - at(S.WTREGEN, d) / 1e3;
  const L = S.WALCL.at(-1)[0], N = S.NFCI.at(-1), R = S.DFII10.at(-1);
  const netNow = net(L), d4 = netNow - net(ago(L, 28)), d13 = netNow - net(ago(L, 91));
  const nfci13 = at(S.NFCI, ago(N[0], 91)), real3m = at(S.DFII10, ago(R[0], 91));
  const m = (q && q.macro) || {};
  const sig = [
    { k: 'Liquidez líquida do Fed (13 sem)', ok: d13 > 0, val: (d13 >= 0 ? '+' : '') + Math.round(d13) + ' bi' },
    { k: 'Condições financeiras (NFCI) frouxas e não apertando', ok: N[1] < 0 && N[1] - nfci13 <= 0.05, val: N[1].toFixed(3) + ' (era ' + nfci13.toFixed(3) + ')' },
    { k: 'Juro real 10a caindo (3m)', ok: R[1] < real3m, val: R[1].toFixed(2) + '% (era ' + real3m.toFixed(2) + '%)' },
    { k: 'Dólar caindo (3m)', ok: m.dxy3m != null && m.dxy3m < 0, val: m.dxy3m != null ? (m.dxy3m * 100).toFixed(1) + '%' : '—' },
    { k: 'M2 crescendo acima de 4% a.a.', ok: m.m2yoy != null && m.m2yoy > 0.04, val: m.m2yoy != null ? (m.m2yoy * 100).toFixed(1) + '%' : '—' }
  ];
  const favor = sig.filter(x => x.ok).length;
  const band = favor >= 3 ? 'expansao' : favor === 2 ? 'neutra' : 'aperto';
  const floor = { expansao: { hf: 2.5, sigma: 1.5 }, neutra: { hf: 3, sigma: 2 }, aperto: { hf: 4, sigma: 2.5 } }[band];
  if (!(netNow > 1000 && netNow < 20000)) throw new Error('liquidez líquida fora da faixa plausível: ' + netNow);
  return { date: L, netLiq: Math.round(netNow), d4w: Math.round(d4), d13w: Math.round(d13), rrp: S.RRPONTSYD.at(-1)[1],
    nfci: N[1], nfci13, real10: R[1], real10_3m: real3m, signals: sig, favor, band, floor, hfMin: 2.0 };
}

(async () => {
  // quant: reaproveita o relatório existente (fonte única das contas)
  const raw = execFileSync(process.execPath, [path.join(__dirname, 'quant-report.js'), '--json'],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 20e6, timeout: 240000 });
  const q = JSON.parse(raw);
  if (!q.vol || !q.vol.ETH || !q.port || !q.macro) throw new Error('quant-report sem os campos esperados');
  q.ta = await technicals();
  try { q.liquidity = await liquidity(q); } catch (e) { console.warn('Liquidez: ' + e.message + ' (a Mesa usa o piso neutro HF 3 / 2σ)'); }
  // historico dos vereditos (gravado pelo mesa-report.js --history): preservar entre execucoes
  try { const old = JSON.parse(fs.readFileSync(path.join(ROOT, 'mesa-dados.json'), 'utf8')); if (Array.isArray(old.verdictHistory)) q.verdictHistory = old.verdictHistory; } catch (e) {}
  q.generatedAt = new Date().toISOString();
  fs.writeFileSync(path.join(ROOT, 'mesa-dados.json'), JSON.stringify(q) + '\n');
  console.log('mesa-dados.json OK · ETH vol30 ' + (q.vol.ETH.d30 * 100).toFixed(1) + '% · VaR95 1d ' + (q.port.VaR95_1d * 100).toFixed(1) + '%' +
    (q.liquidity ? ' · liquidez ' + q.liquidity.band + ' (' + q.liquidity.favor + '/5) → piso HF ' + q.liquidity.floor.hf : ''));

  const y = await yields();
  fs.writeFileSync(path.join(ROOT, 'yields.json'), JSON.stringify(y) + '\n');
  console.log('yields.json OK · supply ' + Object.values(y.supply).flat().length + ' · borrow ' + y.borrow.length + ' · lp ' + y.lp.length);
})().catch(e => { console.error('ERRO', e.message); process.exit(1); });
