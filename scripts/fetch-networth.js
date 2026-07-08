#!/usr/bin/env node
/**
 * fetch-networth.js — snapshot diário do patrimônio líquido → networth-history.json
 *
 * Metodologia (CLAUDE.md / data.js):
 *   Patrimônio = Σ holdings×preço (JÁ inclui colateral DeFi) + Σ stables×preço
 *              + LP (pooled + fees não coletadas) − dívida total
 *
 * Fontes:
 *   - Quantidades/dívida/LP: data.js (fonte única de posições — sem chamadas
 *     a AAVE/Kamino aqui de propósito: cron não-assistido, menos pontos de falha;
 *     o data.js é refrescado com frequência e a deriva de juros no mês é ~$4).
 *   - Preços: CoinGecko /simple/price (free tier, sem key).
 *
 * Saída: networth-history.json na raiz — 1 ponto por dia (upsert do dia corrente).
 * Uso:  node scripts/fetch-networth.js   (local ou GitHub Action networth.yml)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'networth-history.json');

// ── 1. Carrega data.js (window.BAROLO_DATA) num sandbox ──
const sandbox = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'))(sandbox);
const B = sandbox.BAROLO_DATA;
if (!B) { console.error('ERRO: BAROLO_DATA não carregou do data.js'); process.exit(1); }

// ── 2. Preços ao vivo (CoinGecko) ──
async function fetchPrices(ids, tries = 4) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`;
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
    }});
    if (r.ok) return r.json();
    if (r.status === 429 && i < tries - 1) {
      const wait = 30000 * (i + 1); // 30s, 60s, 90s — free tier renova por minuto
      console.log(`CoinGecko 429 — aguardando ${wait / 1000}s (tentativa ${i + 2}/${tries})…`);
      await new Promise(res => setTimeout(res, wait));
      continue;
    }
    throw new Error(`CoinGecko HTTP ${r.status}`);
  }
}

(async () => {
  const assets = [...B.holdings, ...B.stables];
  const ids = [...new Set(assets.map(a => a.cgId))];
  const prices = await fetchPrices(ids);

  const missing = ids.filter(id => !prices[id] || typeof prices[id].usd !== 'number');
  if (missing.length) throw new Error('CoinGecko sem preço para: ' + missing.join(','));

  // ── 3. Cálculo ──
  const val = a => a.qty * prices[a.cgId].usd;
  const gross   = B.holdings.reduce((s, a) => s + val(a), 0);
  const stables = B.stables.reduce((s, a) => s + val(a), 0);
  const uni = (B.defi && B.defi.uniswapV3) || {};
  const lp  = (uni.pooled || 0) + (uni.uncollectedFees || 0);
  const debt = B.debt.total;
  const netWorth = gross + stables + lp - debt;

  // sanity: patrimônio plausível (evita gravar lixo se algum preço vier absurdo)
  if (!isFinite(netWorth) || netWorth < 1000 || netWorth > 1e6) {
    throw new Error('Sanity: netWorth fora da faixa plausível: ' + netWorth);
  }

  const point = {
    date: new Date().toISOString().slice(0, 10),
    netWorth: +netWorth.toFixed(2),
    gross:    +gross.toFixed(2),
    stables:  +stables.toFixed(2),
    lp:       +lp.toFixed(2),
    debt:     +debt.toFixed(2),
    dataAsOf: B.asOf,
    prices: {
      BTC: prices['bitcoin']  ? prices['bitcoin'].usd  : null,
      ETH: prices['ethereum'] ? prices['ethereum'].usd : null,
      SOL: prices['solana']   ? prices['solana'].usd   : null
    }
  };

  // ── 4. Upsert no histórico (1 ponto/dia, ordenado) ──
  let doc = { methodology: 'netWorth = holdings×preço (inclui colateral DeFi) + stables + LP(pooled+unc fees) − dívida · qty/dívida/LP do data.js · preços CoinGecko', history: [] };
  if (fs.existsSync(OUT)) {
    try { doc = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) { /* recomeça */ }
    if (!Array.isArray(doc.history)) doc.history = [];
  }
  doc.updated = new Date().toISOString();
  doc.history = doc.history.filter(p => p.date !== point.date);
  doc.history.push(point);
  doc.history.sort((a, b) => a.date < b.date ? -1 : 1);

  fs.writeFileSync(OUT, JSON.stringify(doc, null, 1) + '\n');
  console.log(`OK ${point.date}: netWorth $${point.netWorth} (gross $${point.gross} + stables $${point.stables} + lp $${point.lp} − debt $${point.debt}) · ${doc.history.length} ponto(s) no histórico`);
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
