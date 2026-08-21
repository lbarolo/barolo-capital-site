#!/usr/bin/env node
/**
 * fetch-benchmark.js — preços reais BTC/ETH + CDI → benchmark-data.js
 *
 * Alimenta o "Benchmark de aporte equivalente" em portfolio_analytics.html
 * (buildBenchmarkChart / simulateDcaEquivalent / simulateCdiEquivalent) e o
 * cálculo de alpha em calculatePerformanceMetrics().
 *
 * Fontes (sem chave), em CASCATA — usa a primeira que responder:
 *   1. Coinbase Exchange (api.exchange.coinbase.com) — candles diários agregados
 *      em fechamento mensal. Fonte primária: é americana, não geo-bloqueia o
 *      runner do GitHub Actions.
 *   2. Yahoo Finance (query1.finance.yahoo.com) — candles mensais direto.
 *   3. Binance klines (interval=1M) — ⚠️ responde HTTP 451 para IPs dos EUA,
 *      então NÃO funciona no GitHub Actions; fica só como fallback local.
 *   - CDI: BCB SGS série 4391 (% a.m.) desde Jan/2022.
 *
 * ⚠️ LIÇÃO (20/08/2026): a versão original usava só a Binance e passou no teste
 * local (sandbox sai por proxy fora dos EUA) mas quebrou na primeira execução
 * agendada com HTTP 451 — os runners do GitHub ficam na Azure US. Ao escolher
 * uma API para rodar em Action, conferir geo-bloqueio, não só se responde aqui.
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
    // 451 (geo-bloqueio) e 4xx em geral são permanentes: não adianta reesperar.
    if ((r.status === 429 || r.status >= 500) && i < tries - 1) {
      const wait = 15000 * (i + 1);
      console.log(`HTTP ${r.status} em ${url} — aguardando ${wait / 1000}s (tentativa ${i + 2}/${tries})…`);
      await new Promise(res => setTimeout(res, wait));
      continue;
    }
    throw new Error(`HTTP ${r.status} — ${url}`);
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const monthKey = ms => {
  const d = new Date(ms);
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0');
};

// Reduz uma série de pontos {ms, close} ao fechamento de cada mês (o ponto mais
// recente dentro do mês). Serve para diário→mensal e é idempotente para mensal.
function toMonthlyCloses(points) {
  const best = {}, map = {};
  points.forEach(({ ms, close }) => {
    if (!(close > 0)) return;
    const k = monthKey(ms);
    if (best[k] == null || ms > best[k]) { best[k] = ms; map[k] = close; }
  });
  return map;
}

// ── Fonte 1: Coinbase Exchange (candles diários, 300 por request) ───────────
async function fromCoinbase(product) {
  const points = [];
  const DAY = 86400000, WINDOW = 290 * DAY; // < 300 candles por request
  for (let from = START; from < Date.now(); from += WINDOW) {
    const to = Math.min(from + WINDOW, Date.now());
    const url = `https://api.exchange.coinbase.com/products/${product}/candles`
      + `?granularity=86400&start=${new Date(from).toISOString()}&end=${new Date(to).toISOString()}`;
    const rows = await fetchWithRetry(url);
    if (!Array.isArray(rows)) throw new Error('Coinbase: resposta inesperada para ' + product);
    // [ time(s), low, high, open, close, volume ]
    rows.forEach(r => points.push({ ms: Number(r[0]) * 1000, close: parseFloat(r[4]) }));
    await sleep(300); // rate limit público ~10 req/s
  }
  if (!points.length) throw new Error('Coinbase: nenhum candle para ' + product);
  return toMonthlyCloses(points);
}

// ── Fonte 2: Yahoo Finance (candles mensais direto) ─────────────────────────
async function fromYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
    + `?interval=1mo&period1=${Math.floor(START / 1000)}&period2=${Math.floor(Date.now() / 1000)}`;
  const j = await fetchWithRetry(url);
  const res = j && j.chart && j.chart.result && j.chart.result[0];
  const ts = res && res.timestamp;
  const closes = res && res.indicators && res.indicators.quote && res.indicators.quote[0]
    && res.indicators.quote[0].close;
  if (!ts || !closes || ts.length !== closes.length) throw new Error('Yahoo: resposta inesperada para ' + symbol);
  return toMonthlyCloses(ts.map((t, i) => ({ ms: t * 1000, close: closes[i] })));
}

// ── Fonte 3: Binance (só funciona fora dos EUA — 451 no GitHub Actions) ─────
async function fromBinance(symbol) {
  const rows = await fetchWithRetry(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1M&startTime=${START}&limit=1000`);
  if (!Array.isArray(rows)) throw new Error('Binance: resposta inesperada para ' + symbol);
  return toMonthlyCloses(rows.map(k => ({ ms: Number(k[0]), close: parseFloat(k[4]) })));
}

// Tenta as fontes em ordem; devolve o mapa mensal da primeira que funcionar.
async function monthlyCloses(asset) {
  const chain = [
    ['Coinbase Exchange', () => fromCoinbase(asset.coinbase)],
    ['Yahoo Finance',     () => fromYahoo(asset.yahoo)],
    ['Binance',           () => fromBinance(asset.binance)],
  ];
  const erros = [];
  for (const [nome, fn] of chain) {
    try {
      const map = await fn();
      const n = Object.keys(map).length;
      if (n < 12) throw new Error(`só ${n} meses retornados`);
      console.log(`${asset.label}: ${n} meses via ${nome}`);
      return { map, fonte: nome };
    } catch (e) {
      console.log(`${asset.label}: ${nome} falhou — ${e.message}`);
      erros.push(`${nome}: ${e.message}`);
    }
  }
  throw new Error(`${asset.label} — todas as fontes falharam (${erros.join(' | ')})`);
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

  // Sequencial de propósito: a cascata já é tolerante a falha, e serializar
  // evita estourar rate limit das fontes públicas.
  const btc = await monthlyCloses({ label: 'BTC', coinbase: 'BTC-USD', yahoo: 'BTC-USD', binance: 'BTCUSDT' });
  const eth = await monthlyCloses({ label: 'ETH', coinbase: 'ETH-USD', yahoo: 'ETH-USD', binance: 'ETHUSDT' });
  const cdiRaw = await fetchWithRetry(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json&dataInicial=01/01/2022&dataFinal=${new Date(now).toLocaleDateString('pt-BR')}`);

  const btcMap = btc.map;
  const ethMap = eth.map;
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
    source: `BTC via ${btc.fonte} · ETH via ${eth.fonte} (fechamento mensal em USD) + BCB SGS série 4391 (CDI % a.m.)`,
    fetchedAt: new Date().toISOString(),
    methodology: 'btcUsd/ethUsd = preço de fechamento do candle mensal em USD (fonte em cascata: Coinbase Exchange → Yahoo Finance → Binance); mês corrente usa o candle parcial mais recente. cdiMonthlyPct = taxa CDI acumulada no mês (% a.m., BCB SGS 4391) — null no mês ainda em curso (só fecha no fim do mês). Alinhado mês a mês com WEEKLY_UPDATE.wealthCurve.labels. Usado para simular "o mesmo aporte, no mesmo mês, comprando 100% deste ativo" (ver simulateDcaEquivalent/simulateCdiEquivalent em portfolio_analytics.html).',
  };

  const jsContent = 'window.BENCHMARK_DATA = ' + JSON.stringify(output, null, 1) + ';\n';
  fs.writeFileSync(OUT, jsContent);
  console.log(`OK ${labels[labels.length - 1]}: BTC $${lastBtc} · ETH $${lastEth} · ${labels.length} meses (Jan/22 → ${labels[labels.length - 1]})`);
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
