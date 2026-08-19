#!/usr/bin/env node
/**
 * fetch-benchmark.js — preços reais BTC/ETH + CDI → benchmark-data.js
 *
 * Alimenta o "Benchmark de aporte equivalente" em portfolio_analytics.html
 * (buildBenchmarkChart / simulateDcaEquivalent / simulateCdiEquivalent) e o
 * cálculo de alpha em calculatePerformanceMetrics().
 *
 * Fontes (sem chave):
 *   - BTC/ETH: Binance klines mensais (interval=1M, campo close) desde Jan/2022.
 *   - CDI: BCB SGS série 4391 (% a.m.) desde Jan/2022.
 *
 * O mês corrente é incluído com o candle/valor parcial mais recente — isso mantém
 * o benchmark do mês em andamento atualizado dia a dia até o mês fechar.
 *
 * Saída: benchmark-data.js na raiz — window.BENCHMARK_DATA = {...} (não .json:
 * mesmo padrão de data.js/diario.js, funciona em file:// e https://).
 * Uso:  node scripts/fetch-benchmark.js   (local ou GitHub Action benchmark.yml)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'benchmark-data.js');
const START = Date.UTC(2022, 0, 1); // Jan/2022 — mesmo início de WEEKLY_UPDATE.wealthCurve

async function fetchWithRetry(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
    }});
    if (r.ok) return r.json();
    if ((r.status === 429 || r.status >= 500) && i < tries - 1) {
      const wait = 15000 * (i + 1);
      console.log(`HTTP ${r.status} em ${url} — aguardando ${wait / 1000}s (tentativa ${i + 2}/${tries})…`);
      await new Promise(res => setTimeout(res, wait));
      continue;
    }
    throw new Error(`HTTP ${r.status} — ${url}`);
  }
}

function klinesToMonthMap(klines) {
  const map = {};
  klines.forEach(k => {
    const d = new Date(Number(k[0]));
    const key = d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0');
    map[key] = parseFloat(k[4]); // close
  });
  return map;
}

function monthLabels(fromMs, toMs) {
  const out = [];
  let d = new Date(fromMs);
  const end = new Date(toMs);
  while (d.getUTCFullYear() < end.getUTCFullYear() || (d.getUTCFullYear() === end.getUTCFullYear() && d.getUTCMonth() <= end.getUTCMonth())) {
    out.push(String(d.getUTCMonth() + 1).padStart(2, '0') + '/' + String(d.getUTCFullYear()).slice(2));
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  }
  return out;
}

(async () => {
  const now = Date.now();

  const [btcKlines, ethKlines, cdiRaw] = await Promise.all([
    fetchWithRetry(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1M&startTime=${START}&limit=1000`),
    fetchWithRetry(`https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1M&startTime=${START}&limit=1000`),
    fetchWithRetry(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json&dataInicial=01/01/2022&dataFinal=${new Date(now).toLocaleDateString('pt-BR')}`),
  ]);

  const btcMap = klinesToMonthMap(btcKlines);
  const ethMap = klinesToMonthMap(ethKlines);
  const cdiMap = {};
  cdiRaw.forEach(r => {
    const [dd, mm, yyyy] = r.data.split('/');
    cdiMap[yyyy + '-' + mm] = parseFloat(r.valor);
  });

  const labels = monthLabels(START, now);
  const btcUsd = [], ethUsd = [], cdiMonthlyPct = [];
  const missing = [];
  labels.forEach(lbl => {
    const [mm, yy] = lbl.split('/');
    const key = '20' + yy + '-' + mm;
    if (btcMap[key] == null) missing.push('btc:' + key);
    if (ethMap[key] == null) missing.push('eth:' + key);
    btcUsd.push(btcMap[key] ?? null);
    ethUsd.push(ethMap[key] ?? null);
    cdiMonthlyPct.push(cdiMap[key] ?? null); // CDI do mês corrente só sai no fechamento — null é esperado no mês em curso
  });

  // sanity: preços de BTC/ETH plausíveis (evita gravar lixo se a API mudar formato)
  const lastBtc = btcUsd.filter(v => v != null).slice(-1)[0];
  const lastEth = ethUsd.filter(v => v != null).slice(-1)[0];
  if (!lastBtc || lastBtc < 1000 || lastBtc > 1e7) throw new Error('Sanity: preço BTC fora da faixa plausível: ' + lastBtc);
  if (!lastEth || lastEth < 10 || lastEth > 1e6) throw new Error('Sanity: preço ETH fora da faixa plausível: ' + lastEth);
  if (missing.length > 2) throw new Error('Sanity: muitos meses sem preço BTC/ETH: ' + missing.join(','));

  const output = {
    labels,
    btcUsd,
    ethUsd,
    cdiMonthlyPct,
    source: 'Binance klines (BTCUSDT/ETHUSDT, interval=1M, campo close) + BCB SGS série 4391 (CDI % a.m.)',
    fetchedAt: new Date().toISOString(),
    methodology: 'btcUsd/ethUsd = preço de fechamento do candle mensal em USD (Binance); mês corrente usa o candle parcial mais recente. cdiMonthlyPct = taxa CDI acumulada no mês (% a.m., BCB SGS 4391) — null no mês ainda em curso (só fecha no fim do mês). Alinhado mês a mês com WEEKLY_UPDATE.wealthCurve.labels. Usado para simular "o mesmo aporte, no mesmo mês, comprando 100% deste ativo" (ver simulateDcaEquivalent/simulateCdiEquivalent em portfolio_analytics.html).',
  };

  const jsContent = 'window.BENCHMARK_DATA = ' + JSON.stringify(output, null, 1) + ';\n';
  fs.writeFileSync(OUT, jsContent);
  console.log(`OK ${labels[labels.length - 1]}: BTC $${lastBtc} · ETH $${lastEth} · ${labels.length} meses (Jan/22 → ${labels[labels.length - 1]})`);
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
