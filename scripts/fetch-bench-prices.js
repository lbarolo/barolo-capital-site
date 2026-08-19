#!/usr/bin/env node
/**
 * bench-prices.json — fechamento MENSAL real de BTC e ETH (USD), desde dez/2021.
 *
 * Para que serve: o gráfico "Aporte equivalente" em portfolio_analytics.html precisa saber
 * quanto custava 1 BTC / 1 ETH no fechamento de cada mês, para simular "e se todo aporte
 * tivesse ido para BTC/ETH". Antes disso o site usava um array aproximado escrito à mão.
 * Este script troca a estimativa por dado real e commitado no repo.
 *
 * Fonte: CoinGecko /coins/{id}/market_chart/range (público, sem key).
 * Saída:  bench-prices.json  ->  { updated, source, btc:{'MM/AA':px}, eth:{...} }
 *
 * Rodar local:  node scripts/fetch-bench-prices.js
 */
const fs = require('fs');
const path = require('path');

const OUT   = path.join(__dirname, '..', 'bench-prices.json');
const START = Date.UTC(2021, 11, 1) / 1000;          // dez/2021
const COINS = { btc: 'bitcoin', eth: 'ethereum' };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { Accept: 'application/json' } });
      if (r.ok) return await r.json();
      if (r.status === 429 && i < tries - 1) { await sleep(30000 * (i + 1)); continue; }
      throw new Error('HTTP ' + r.status);
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(5000 * (i + 1));
    }
  }
}

const monthKey = (ms) => {
  const d = new Date(ms);
  return String(d.getUTCMonth() + 1).padStart(2, '0') + '/' + String(d.getUTCFullYear()).slice(2);
};

/** Último preço observado em cada mês = fechamento do mês. */
function toMonthlyClose(prices) {
  const out = {};
  (prices || []).forEach(([ms, px]) => {
    if (typeof px === 'number' && isFinite(px) && px > 0) out[monthKey(ms)] = +px.toFixed(2);
  });
  return out;
}

(async () => {
  const to = Math.floor(Date.now() / 1000);
  const result = { updated: new Date().toISOString(), source: 'coingecko market_chart/range (fechamento mensal)' };

  for (const [key, id] of Object.entries(COINS)) {
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${START}&to=${to}`;
    const j = await getJSON(url);
    const monthly = toMonthlyClose(j && j.prices);
    const n = Object.keys(monthly).length;
    // Sanity: de dez/2021 até hoje são ~55+ meses. Menos que 40 = resposta truncada.
    if (n < 40) throw new Error(`${id}: só ${n} meses retornados — resposta suspeita, abortando`);
    result[key] = monthly;
    await sleep(15000); // free tier: espaça as chamadas
  }

  // Só regrava se mudou algo além do timestamp (evita commit vazio todo dia).
  if (fs.existsSync(OUT)) {
    try {
      const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
      if (JSON.stringify(prev.btc) === JSON.stringify(result.btc) &&
          JSON.stringify(prev.eth) === JSON.stringify(result.eth)) {
        console.log('Sem mudança nos fechamentos mensais — mantendo arquivo.');
        return;
      }
    } catch (e) { /* arquivo corrompido: regrava */ }
  }

  fs.writeFileSync(OUT, JSON.stringify(result, null, 1) + '\n');
  console.log(`OK: ${Object.keys(result.btc).length} meses BTC / ${Object.keys(result.eth).length} meses ETH -> bench-prices.json`);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
