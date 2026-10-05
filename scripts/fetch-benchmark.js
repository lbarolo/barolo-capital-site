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
 *   - CDI (% a.m. desde Jan/2022), também em CASCATA:
 *       1. BCB SGS 4391 (api.bcb.gov.br) — a fonte oficial.
 *       2. IPEAData (www.ipeadata.gov.br, BM12_TJCDI12) — espelho exato do SGS.
 *       3. A série que já está no benchmark-data.js (histórica, não muda) +
 *          BrasilAPI para os meses que faltarem (ver cdiAnualBrasilApi).
 *     ⚠️ Em 04-05/10/2026 os DOIS hosts gov.br pararam de responder ao runner do
 *     GitHub (respondem normalmente de uma máquina no Brasil) — provavelmente o
 *     mesmo geo-bloqueio da Binance. Sem o nível 3 o CDI congelaria no acumulado
 *     parcial de outubro (0,05) e a linha "estou batendo a renda fixa?" iria
 *     apodrecendo mês a mês. A BrasilAPI roda em CDN global e cobre esse buraco.
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
    let r;
    try {
      r = await fetch(url, { headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
      }});
    } catch (e) {
      // fetch REJEITA (não devolve status) em falha de DNS/TLS/socket — era o
      // buraco que derrubava a Action inteira num blip de rede. Isso é
      // transitório por definição, então entra no mesmo backoff dos 5xx.
      if (i < tries - 1) {
        const wait = 15000 * (i + 1);
        console.log(`Falha de rede em ${url} (${e.message}) — aguardando ${wait / 1000}s (tentativa ${i + 2}/${tries})…`);
        await new Promise(res => setTimeout(res, wait));
        continue;
      }
      throw new Error(`rede: ${e.message} — ${url}`);
    }
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

// Lê o benchmark-data.js que já está no repo. Serve de rede de segurança: a
// série do CDI é histórica e NÃO muda retroativamente, então um apagão do BCB
// não deve derrubar a atualização de preços — reaproveita o que já temos.
function lerArquivoAtual() {
  try {
    const src = fs.readFileSync(OUT, 'utf8');
    const win = {};
    new Function('window', src)(win);
    return win.BENCHMARK_DATA || null;
  } catch (e) {
    console.log('Não consegui ler o benchmark-data.js atual — ' + e.message);
    return null;
  }
}

function anotar(tipo, titulo, msg) {
  if (!process.env.GITHUB_ACTIONS) return;
  const esc = String(msg).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  console.log(`::${tipo} title=${titulo}::${esc}`);
}

// ── CDI, fonte 1: BCB SGS 4391 direto (api.bcb.gov.br) ─────────────────────
async function cdiDoBcb(now) {
  const raw = await fetchWithRetry('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json'
    + `&dataInicial=01/01/2022&dataFinal=${new Date(now).toLocaleDateString('pt-BR')}`, 2);
  if (!Array.isArray(raw) || !raw.length) throw new Error('resposta vazia/inesperada');
  const map = {};
  raw.forEach(r => {
    const [, mm, yyyy] = r.data.split('/');          // dd/mm/aaaa
    map[yyyy + '-' + mm] = parseFloat(r.valor);
  });
  return map;
}

// ── CDI, fonte 2: IPEAData (www.ipeadata.gov.br) ───────────────────────────
// Espelha a MESMA série SGS 4391 sob o código BM12_TJCDI12, em outro host — o
// que importa, porque o modo de falha observado é o host do BCB sumir inteiro.
// Conferido em 03/10/2026: 08/26 1.09 · 09/26 1.08 · 10/26 0.05, idênticos ao
// que o BCB vinha devolvendo.
async function cdiDoIpea() {
  const j = await fetchWithRetry(
    "https://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='BM12_TJCDI12')", 2);
  const v = j && j.value;
  if (!Array.isArray(v) || !v.length) throw new Error('resposta vazia/inesperada');
  const map = {};
  v.forEach(r => {
    const d = String(r.VALDATA || '');               // 2026-10-01T00:00:00-03:00
    const k = d.slice(0, 7);                         // aaaa-mm
    if (!/^\d{4}-\d{2}$/.test(k) || k < '2022-01') return;
    if (r.VALVALOR == null) return;
    map[k] = Number(r.VALVALOR);
  });
  if (!Object.keys(map).length) throw new Error('nenhum mês a partir de 2022-01');
  return map;
}

// ── CDI, fonte 3: BrasilAPI (taxa anual corrente) + fórmula oficial ────────
// Último recurso para os meses que o arquivo não cobre. A BrasilAPI roda em CDN
// global (responde do runner, ao contrário dos dois hosts gov.br) mas só dá a
// taxa ANUAL corrente — o mensal sai da fórmula oficial do CDI, que capitaliza
// em dias ÚTEIS sobre base 252: acumulado = (1+anual)^(du/252) − 1.
// Conferido em 05/10/2026: com 13,65% a.a. a fórmula devolve 0,0508% para 1 dia
// útil (o arquivo trazia 0,05 em 10/26) e 1,072% para 21 dias úteis (o CDI real
// de 09/26 foi 1,08). Erro na casa de 0,01 p.p. — bom o bastante para um
// benchmark, e some assim que uma fonte exata voltar a responder.
async function cdiAnualBrasilApi() {
  const j = await fetchWithRetry('https://brasilapi.com.br/api/taxas/v1/CDI');
  const v = j && Number(j.valor);
  if (!(v > 0) || v > 100) throw new Error('valor implausível: ' + JSON.stringify(j));
  return v;
}

// Dias úteis (seg–sex) do mês 'aaaa-mm' até 'ate'. Não desconta feriado
// nacional: cada feriado ignorado infla o mês em ~0,05 p.p.
function diasUteis(chave, ate) {
  const [y, m] = chave.split('-').map(Number);
  const fim = new Date(Date.UTC(y, m, 0));           // último dia do mês
  const limite = ate < fim ? ate : fim;
  let n = 0;
  for (let d = new Date(Date.UTC(y, m - 1, 1)); d <= limite; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) n++;
  }
  return n;
}

// ── CDI, fonte 4: a série que já está no benchmark-data.js ─────────────────
function cdiDoArquivo(atual) {
  const map = {};
  if (!atual || !Array.isArray(atual.labels) || !Array.isArray(atual.cdiMonthlyPct)) return map;
  atual.labels.forEach((lbl, i) => {
    const v = atual.cdiMonthlyPct[i];
    if (v == null) return;
    const [mm, yy] = lbl.split('/');
    map['20' + yy + '-' + mm] = v;
  });
  return map;
}

// Cascata do CDI. A série é histórica e não muda retroativamente, então o pior
// caso (reaproveitar o arquivo) perde no máximo o acumulado parcial do mês em
// curso — nunca vale derrubar o job de preços por causa disso.
async function cdiPorMes(now, atual, chavesDesejadas) {
  // 2 tentativas (não 4) nos dois hosts gov.br: o modo de falha observado é
  // geo-bloqueio do runner, que é permanente — insistir só queima minuto de CI.
  const chain = [
    ['BCB SGS 4391', () => cdiDoBcb(now)],
    ['IPEAData',     () => cdiDoIpea()],
  ];
  const erros = [];
  for (const [nome, fn] of chain) {
    try {
      const map = await fn();
      const n = Object.keys(map).length;
      if (n < 12) throw new Error(`só ${n} meses retornados`);
      console.log(`CDI: ${n} meses via ${nome}`);
      return { map, fonte: nome, estimados: [] };
    } catch (e) {
      console.log(`CDI: ${nome} falhou — ${e.message}`);
      erros.push(`${nome}: ${e.message}`);
    }
  }

  // Nenhuma fonte exata respondeu. Base = o que já está no arquivo (histórico,
  // não muda retroativamente) e a BrasilAPI cobre o que falta.
  const map = cdiDoArquivo(atual);
  const corrente = monthKey(now);
  // O mês corrente do arquivo é um acumulado PARCIAL de outro dia: recalcula.
  delete map[corrente];
  const faltam = chavesDesejadas.filter(k => map[k] == null);
  const estimados = [];
  if (faltam.length) {
    try {
      const anual = await cdiAnualBrasilApi();
      const fatorDia = Math.pow(1 + anual / 100, 1 / 252);
      const ontem = new Date(now - 86400000);        // o CDI do dia só publica no dia seguinte
      faltam.forEach(k => {
        const du = diasUteis(k, ontem);
        if (du <= 0) return;                         // mês ainda sem dia útil apurado
        map[k] = Number(((Math.pow(fatorDia, du) - 1) * 100).toFixed(2));
        estimados.push(k);
      });
      console.log(`CDI: ${estimados.length} mês(es) estimado(s) pela BrasilAPI `
        + `(${anual}% a.a.): ${estimados.join(', ') || '—'}`);
    } catch (e) {
      console.log('CDI: BrasilAPI falhou — ' + e.message);
      erros.push('BrasilAPI: ' + e.message);
    }
  }

  if (!Object.keys(map).length) {
    throw new Error('CDI indisponível em todas as fontes e sem série anterior no benchmark-data.js — ' + erros.join(' | '));
  }
  const fonte = estimados.length
    ? 'benchmark-data.js anterior + BrasilAPI (estimativa) nos meses ' + estimados.join(', ')
    : 'benchmark-data.js anterior';
  console.log(`CDI: ${Object.keys(map).length} meses — ${fonte}`);
  anotar('warning', 'fetch-benchmark',
    'Nenhuma fonte exata de CDI respondeu (' + erros.join(' | ') + '); usando ' + fonte + '.');
  return { map, fonte, estimados };
}

(async () => {
  const now = Date.now();
  const atual = lerArquivoAtual();

  // Sequencial de propósito: a cascata já é tolerante a falha, e serializar
  // evita estourar rate limit das fontes públicas.
  const btc = await monthlyCloses({ label: 'BTC', coinbase: 'BTC-USD', yahoo: 'BTC-USD', binance: 'BTCUSDT' });
  const eth = await monthlyCloses({ label: 'ETH', coinbase: 'ETH-USD', yahoo: 'ETH-USD', binance: 'ETHUSDT' });

  const labels = monthLabels(START, now);
  const chaves = labels.map(l => { const [mm, yy] = l.split('/'); return '20' + yy + '-' + mm; });
  const cdi = await cdiPorMes(now, atual, chaves);

  const btcMap = btc.map;
  const ethMap = eth.map;
  const cdiMap = cdi.map;
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
    source: `BTC via ${btc.fonte} · ETH via ${eth.fonte} (fechamento mensal em USD) + CDI % a.m. via ${cdi.fonte}`,
    cdiEstimados: cdi.estimados,
    fetchedAt: new Date().toISOString(),
    methodology: 'btcUsd/ethUsd = preço de fechamento do candle mensal em USD (cascata: Coinbase Exchange → Yahoo Finance → Binance); mês corrente usa o candle parcial mais recente. cdiMonthlyPct = taxa CDI acumulada no mês (% a.m.), cascata BCB SGS 4391 → IPEAData (BM12_TJCDI12, espelho do SGS) → série anterior deste arquivo + BrasilAPI para o que faltar. Os meses listados em cdiEstimados NÃO são o dado oficial: saem da taxa CDI anual corrente pela fórmula oficial (1+a)^(du/252)−1, com dias úteis seg–sex sem desconto de feriado — erro na casa de 0,01 p.p., e some assim que o BCB ou o IPEAData voltarem a responder. Alinhado mês a mês com WEEKLY_UPDATE.wealthCurve.labels. Usado para simular "o mesmo aporte, no mesmo mês, comprando 100% deste ativo" (ver simulateDcaEquivalent/simulateCdiEquivalent em portfolio_analytics.html).',
  };

  const jsContent = 'window.BENCHMARK_DATA = ' + JSON.stringify(output, null, 1) + ';\n';
  fs.writeFileSync(OUT, jsContent);
  console.log(`OK ${labels[labels.length - 1]}: BTC $${lastBtc} · ETH $${lastEth} · ${labels.length} meses (Jan/22 → ${labels[labels.length - 1]})`);
})().catch(e => {
  console.error('ERRO:', e.message);
  // Vira anotação no resumo do run e no e-mail de falha — sem precisar abrir o log.
  anotar('error', 'fetch-benchmark', e.message);
  process.exit(1);
});
