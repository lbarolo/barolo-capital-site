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
 *   - Preços: cascata Coinbase → Yahoo → CoinGecko → último conhecido
 *     (scripts/lib/spot-prices.js). O CoinGecko sozinho parou de funcionar em
 *     29/09/2026 (403 de WAF sem chave, no runner e na máquina do Lucas).
 *
 * Saída: networth-history.json na raiz — 1 ponto por dia (upsert do dia corrente).
 * Uso:  node scripts/fetch-networth.js   (local ou GitHub Action networth.yml)
 */
const fs = require('fs');
const path = require('path');

const Core = require('../lib/barolo-core.js');
const { spotPrices } = require('./lib/spot-prices.js');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'networth-history.json');

// ── 1. Carrega data.js (window.BAROLO_DATA) num sandbox ──
const sandbox = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'))(sandbox);
const B = sandbox.BAROLO_DATA;
if (!B) { console.error('ERRO: BAROLO_DATA não carregou do data.js'); process.exit(1); }

// ── 2. Histórico atual (serve de fallback de preço para a cauda) ──
let doc = { methodology: 'netWorth = holdings×preço (inclui colateral DeFi) + stables + LP(pooled+unc fees) − dívida · qty/dívida/LP do data.js · preços em cascata Coinbase → Yahoo → CoinGecko → último conhecido', history: [] };
if (fs.existsSync(OUT)) {
  try { doc = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) { /* recomeça */ }
  if (!Array.isArray(doc.history)) doc.history = [];
}
doc.methodology = 'netWorth = holdings×preço (inclui colateral DeFi) + stables + LP(pooled+unc fees) − dívida · qty/dívida/LP do data.js · preços em cascata Coinbase → CoinPaprika → Yahoo → CoinGecko → último conhecido';
const prev = doc.history.length ? doc.history[doc.history.length - 1] : null;
const lastKnown = (prev && prev.prices) ? prev.prices : {};

(async () => {
  const assets = [...B.holdings, ...B.stables];
  const { usd, source, byTicker, missing, stale } = await spotPrices(assets, { lastKnown });

  // Sem preço nenhum e sem histórico: parar, para não gravar patrimônio truncado.
  if (missing.length) throw new Error('Sem preço (nenhuma fonte, sem histórico) para: ' + missing.join(','));

  // ── 3. Cálculo ──
  // Mesma conta do briefing (fetch-briefing.js) — uma implementação em lib/barolo-core.js
  const { gross, stables, lp, debt, netWorth } = Core.netWorth(B, id => usd[id]);

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
    // Por TICKER e com a cauda inteira (era só BTC/ETH/SOL): além de manter as três
    // chaves que o dashboard já lia, é daqui que a execução de amanhã tira o
    // "último preço conhecido" dos tokens que nenhuma fonte cobre (RDNT, XAI, SCR).
    prices: byTicker
  };
  // Só grava a exceção: tokens que ficaram com preço do dia anterior (ou paridade).
  if (stale.length) point.pricesStale = stale;

  // Snapshot do lending (colateral/divida por protocolo, HF, LTV e tokens acumulados) —
  // alimenta os graficos 'Colateral vs Divida' e 'Acumulacao de Tokens' do dashboard.
  // Mesma formula da pagina (data.js -> lendingSnapshot).
  if (typeof B.lendingSnapshot === 'function') {
    point.defi = B.lendingSnapshot({ ETH: point.prices.ETH, SOL: point.prices.SOL });
  }

  // ── 4. Upsert no histórico (1 ponto/dia, ordenado) — `doc` foi lido no passo 2 ──
  doc.updated = new Date().toISOString();
  doc.history = doc.history.filter(p => p.date !== point.date);
  doc.history.push(point);
  doc.history.sort((a, b) => a.date < b.date ? -1 : 1);

  fs.writeFileSync(OUT, JSON.stringify(doc, null, 1) + '\n');
  console.log(`OK ${point.date}: netWorth $${point.netWorth} (gross $${point.gross} + stables $${point.stables} + lp $${point.lp} − debt $${point.debt}) · ${doc.history.length} ponto(s) no histórico`);
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
