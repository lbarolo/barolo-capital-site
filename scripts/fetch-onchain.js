#!/usr/bin/env node
/**
 * fetch-onchain.js — gera btc-onchain.json para a página ciclo.html
 *
 * Fonte: Bitcoin Lab API (ResearchBitcoin.net) — mesma fonte do painel yldlab.xyz.
 * Token: lido de process.env.RB_TOKEN (NUNCA hardcodado / NUNCA commitado).
 *   Local:  RB_TOKEN=xxxx node scripts/fetch-onchain.js
 *   CI:     secret RB_TOKEN no GitHub Actions.
 *
 * Saída: btc-onchain.json na raiz do repo — só dados públicos de BTC (sem token).
 *
 * Indicadores (8): MVRV, STH MVRV, LTH MVRV, Mayer Multiple (calc preço/MM200),
 *   Realized Price, LTH SOPR, AVIV, CVDD (derivado de coinblock_value_cum_destroyed).
 */
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.RB_TOKEN;
if (!TOKEN) { console.error('ERRO: defina RB_TOKEN no ambiente.'); process.exit(1); }

const BASE = 'https://api.researchbitcoin.net/v2';
const GENESIS = Date.UTC(2009, 0, 3) / 1000; // 2009-01-03 em segundos
const CVDD_K = 6_000_000;      // constante empírica de Willy Woo (CVDD)
const BLOCKS_PER_DAY = 144;    // coinblocks → coindays

// dias de histórico (free tier user_tier=0 permite allowed_historical_days=365)
const DAYS = 360;
const now = new Date();
const from = new Date(now.getTime() - DAYS * 86400000);
const iso = d => d.toISOString().slice(0, 10);

// metric key → endpoint path. O campo na resposta = último segmento do path.
const METRICS = {
  price:        'price/price',
  mvrv:         'market_value_to_realized_value/mvrv',
  mvrv_sth:     'market_value_to_realized_value/mvrv_sth',
  mvrv_lth:     'market_value_to_realized_value/mvrv_lth',
  realized:     'realizedprice/realized_price',
  realized_sth: 'realizedprice/realized_price_sth',
  realized_lth: 'realizedprice/realized_price_lth',
  sopr_lth:     'spent_output_profit_ratio/sopr_lth',
  aviv:         'cointime_statistics/active_value_to_investor_value',
  cum_destroyed:'cointime_statistics/coinblock_value_cum_destroyed'
};

async function fetchMetric(pathSeg) {
  const field = pathSeg.split('/').pop();
  const url = `${BASE}/${pathSeg}?resolution=d1&output_format=json&from_time=${iso(from)}&to_time=${iso(now)}`;
  const r = await fetch(url, { headers: { 'X-API-Token': TOKEN, 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' } });
  if (!r.ok) throw new Error(`${pathSeg} → HTTP ${r.status}`);
  const j = await r.json();
  if (!j.data) throw new Error(`${pathSeg} → sem data (${j.message || 'erro'})`);
  const map = {};
  for (const row of j.data) {
    const day = row.time.slice(0, 10);
    map[day] = row[field];
  }
  return map;
}

(async () => {
  const maps = {};
  for (const [key, pathSeg] of Object.entries(METRICS)) {
    process.stdout.write(`· ${key} ... `);
    maps[key] = await fetchMetric(pathSeg);
    console.log(`${Object.keys(maps[key]).length} pts`);
  }

  // spine = datas que têm preço E mvrv (os essenciais)
  const days = Object.keys(maps.price).filter(d => maps.mvrv[d] != null).sort();
  const series = days.map(d => {
    const ageDays = (Date.UTC(+d.slice(0,4), +d.slice(5,7)-1, +d.slice(8,10)) / 1000 - GENESIS) / 86400;
    const cum = maps.cum_destroyed[d];
    const cvdd = (cum != null && ageDays > 0) ? (cum / BLOCKS_PER_DAY) / (ageDays * CVDD_K) : null;
    const num = v => (v == null ? null : +(+v).toFixed(v >= 1000 ? 2 : 6));
    return {
      t: d,
      price:    num(maps.price[d]),
      mvrv:     num(maps.mvrv[d]),
      mvrv_sth: num(maps.mvrv_sth[d]),
      mvrv_lth: num(maps.mvrv_lth[d]),
      realized: num(maps.realized[d]),
      realized_sth: num(maps.realized_sth[d]),
      realized_lth: num(maps.realized_lth[d]),
      sopr_lth: num(maps.sopr_lth[d]),
      aviv:     num(maps.aviv[d]),
      cvdd:     num(cvdd)
    };
  });

  const out = {
    updated: new Date().toISOString(),
    source: 'Bitcoin Lab API (researchbitcoin.net) · CVDD derivado · Mayer calculado client-side',
    count: series.length,
    series
  };
  const outPath = path.join(__dirname, '..', 'btc-onchain.json');
  fs.writeFileSync(outPath, JSON.stringify(out));
  const last = series[series.length - 1];
  console.log(`\nOK → btc-onchain.json (${series.length} pts). Último (${last.t}): ` +
    `MVRV ${last.mvrv} · STH ${last.mvrv_sth} · LTH ${last.mvrv_lth} · ` +
    `SOPR_LTH ${last.sopr_lth} · AVIV ${last.aviv} · Realized $${last.realized} · CVDD $${last.cvdd}`);
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
