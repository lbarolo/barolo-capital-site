#!/usr/bin/env node
/**
 * fetch-pools.js — scan de pools de liquidez em Solana pelo método Genesis
 *                  → pooliana-pools.json
 *
 * Porta em Node do scanner da Pooliana (PROJETO POOLIANA/market/dex_scanner.py +
 * agent/autonomous.py::_select_best_pool). A ESPECIFICAÇÃO é o CONHECIMENTO-POOLIANA.md
 * §4 (filtros duros), §5.2 (penalidades) e §6 (fórmula de score) — se mudar lá, mude aqui.
 *
 * Por que uma porta em vez de rodar o Python: o agente roda LOCAL, com chave privada.
 * Este scan é a metade sem chave (aritmética sobre API pública), então pode rodar num
 * Action e alimentar o site. Nenhum segredo é necessário.
 *
 * Método:
 *   multiplicador = taxas_24h / TVL
 *   score = (taxa_efetiva × 365) × peso_rede × (1 − penalidade_risco)
 *   teto anti-spike: volume_24h > 5×TVL ⇒ taxa_efetiva limitada a 0,010/dia
 *
 * Fontes (públicas, sem chave, CORS aberto):
 *   - Raydium CLMM  https://api-v3.raydium.io/pools/info/list
 *   - Orca Whirlpool https://api.orca.so/v2/solana/pools
 *
 * Saída: pooliana-pools.json na raiz.
 * Uso:   node scripts/fetch-pools.js   (local ou GitHub Action pools.yml)
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(path.resolve(__dirname, '..'), 'pooliana-pools.json');

// ── Parâmetros do método (CONHECIMENTO-POOLIANA.md §4 e §5.2) ──────────────
// NOTA: a doutrina prega TVL mínimo de $500K; o scanner real da Pooliana usa
// $150K (dex_scanner.py:21 + autonomous.py:190) — ver §13.1. Seguimos o código,
// para o site e o agente concordarem.
const MIN_TVL_USD      = 150_000;
const MIN_VOLUME_24H   = 10_000;
const MIN_MULTIPLIER   = 0.0005;   // ≈18%/ano — abaixo disso descarta
const SPIKE_RATIO      = 5.0;      // volume > 5×TVL ⇒ evento único, não retorno sustentado
const SPIKE_CAP_DAILY  = 0.010;    // teto de 1%/dia = 365%/ano no scoring
const TOP_N            = 12;

const NETWORK_WEIGHT = { solana: 1.00, arbitrum: 0.85, base: 0.70, ethereum: 0.50 };

const STABLE   = new Set(['USDC','USDT','DAI','FRAX','BUSD','USDS','PYUSD','USDG']);
const BLUECHIP = new Set(['SOL','WSOL','ETH','WETH','BTC','WBTC','CBBTC','JUP','RAY','ORCA','JTO','PYTH']);
const MEMECOIN = new Set(['BONK','WIF','FARTCOIN','GRIFFAIN','POPCAT','TRUMP','MELANIA','BOME','SAMO']);
const ANCHORS  = new Set(['SOL','WSOL','USDC','USDT','WBTC','WETH','ETH']);
const BAD_FRAGMENTS = ['TEST','FAKE','SCAM','RUG','HONEYPOT'];

// ── HTTP com retry (mesmo padrão dos outros scripts) ───────────────────────
async function fetchWithRetry(url, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { Accept: 'application/json' } });
      if (r.ok) return await r.json();
      // 4xx é permanente — não adianta insistir
      if (r.status >= 400 && r.status < 500 && r.status !== 429) {
        throw new Error(`HTTP ${r.status}`);
      }
      lastErr = new Error(`HTTP ${r.status}`);
    } catch (e) { lastErr = e; }
    if (i < tries - 1) await new Promise(r => setTimeout(r, 1500 * (i + 1)));
  }
  throw lastErr;
}

const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

// ── Fontes ────────────────────────────────────────────────────────────────
async function scanRaydium() {
  const url = 'https://api-v3.raydium.io/pools/info/list'
            + '?poolType=concentrated&poolSortField=fee24h&sortType=desc&pageSize=100&page=1';
  const j = await fetchWithRetry(url);
  const rows = (j && j.data && j.data.data) || [];
  return rows.map(p => ({
    dex: 'Raydium',
    network: 'solana',
    address: p.id,
    symbolA: (p.mintA && p.mintA.symbol || '').toUpperCase(),
    symbolB: (p.mintB && p.mintB.symbol || '').toUpperCase(),
    tvl: num(p.tvl),
    fees24h: num(p.day && p.day.volumeFee),
    volume24h: num(p.day && p.day.volume),
    feeTierPct: num(p.feeRate) * 100
  }));
}

async function scanOrca() {
  // sortBy=fees24h — `feeApr` é rejeitado pela API (ver CONHECIMENTO-POOLIANA.md §13.3)
  const url = 'https://api.orca.so/v2/solana/pools?sortBy=fees24h&order=desc&limit=100';
  const j = await fetchWithRetry(url);
  const rows = (j && j.data) || [];
  return rows.map(p => {
    const s24 = (p.stats && p.stats['24h']) || {};
    return {
      dex: 'Orca',
      network: 'solana',
      address: p.address,
      symbolA: (p.tokenA && p.tokenA.symbol || '').toUpperCase(),
      symbolB: (p.tokenB && p.tokenB.symbol || '').toUpperCase(),
      tvl: num(p.tvlUsdc),
      fees24h: num(s24.fees),
      volume24h: num(s24.volume),
      feeTierPct: num(p.feeRate) / 10000   // feeRate em centésimos de bip
    };
  });
}

// ── Classificação e penalidade (§5.2) ─────────────────────────────────────
function riskPenalty(a, b) {
  const aS = STABLE.has(a),   bS = STABLE.has(b);
  const aB = BLUECHIP.has(a), bB = BLUECHIP.has(b);
  const aM = MEMECOIN.has(a), bM = MEMECOIN.has(b);

  if (aS && bS)                     return { p: 0.00, tier: 'estável/estável' };
  if ((aS || bS) && (aB || bB))     return { p: 0.05, tier: 'blue-chip/estável' };
  if (aB && bB)                     return { p: 0.15, tier: 'blue-chip/blue-chip' };
  if ((aB || bB) && (aM || bM))     return { p: 0.60, tier: 'blue-chip/memecoin' };
  if (aS || bS)                     return { p: 0.20, tier: 'desconhecido/estável' };
  if (aB || bB)                     return { p: 0.30, tier: 'desconhecido/blue-chip' };
  return { p: 0.50, tier: 'sem âncora' };
}

// ── Filtro + score (§4 e §6) ──────────────────────────────────────────────
function rank(pools) {
  const rejected = { tvl: 0, volume: 0, multiplicador: 0, memecoin_duplo: 0, sem_ancora: 0, nome_suspeito: 0, dados: 0 };
  const kept = [];

  for (const p of pools) {
    const a = p.symbolA, b = p.symbolB;
    if (!a || !b || p.tvl <= 0)                                   { rejected.dados++; continue; }
    if (BAD_FRAGMENTS.some(f => a.includes(f) || b.includes(f)))  { rejected.nome_suspeito++; continue; }
    if (p.tvl < MIN_TVL_USD)                                      { rejected.tvl++; continue; }
    if (p.volume24h < MIN_VOLUME_24H)                             { rejected.volume++; continue; }

    const mult = p.fees24h / p.tvl;
    if (mult < MIN_MULTIPLIER)                                    { rejected.multiplicador++; continue; }
    if (MEMECOIN.has(a) && MEMECOIN.has(b))                       { rejected.memecoin_duplo++; continue; }
    if (!ANCHORS.has(a) && !ANCHORS.has(b))                       { rejected.sem_ancora++; continue; }

    // Teto anti-spike: volume 24h > 5×TVL indica evento único
    const spikeRatio = p.volume24h / p.tvl;
    const spiked = spikeRatio > SPIKE_RATIO;
    const effMult = spiked ? Math.min(mult, SPIKE_CAP_DAILY) : mult;

    const { p: penalty, tier } = riskPenalty(a, b);
    const weight = NETWORK_WEIGHT[p.network] || 0.5;
    const score = (effMult * 365) * weight * (1 - penalty);

    kept.push({
      pair: `${a}/${b}`,
      dex: p.dex,
      network: p.network,
      tvlUsd: Math.round(p.tvl),
      fees24hUsd: Math.round(p.fees24h),
      volume24hUsd: Math.round(p.volume24h),
      feeTierPct: Number(p.feeTierPct.toFixed(4)),
      multiplierDaily: Number(mult.toFixed(6)),
      monthlyPct: Number((mult * 30 * 100).toFixed(2)),
      aprPct: Number((mult * 365 * 100).toFixed(1)),
      tier,
      riskPenalty: penalty,
      spike: spiked,
      spikeRatio: Number(spikeRatio.toFixed(1)),
      score: Number(score.toFixed(4)),
      interpretation: interpret(mult * 365)
    });
  }

  kept.sort((x, y) => y.score - x.score);
  return { kept, rejected };
}

// §3 — escala de interpretação (dex_scanner.py::_interpret_taxa_tvl)
function interpret(annual) {
  if (annual >= 2.0) return 'Excelente — acima de 200%/ano';
  if (annual >= 1.0) return 'Muito bom — 100%+/ano';
  if (annual >= 0.5) return 'Bom — 50%+/ano';
  if (annual >= 0.2) return 'Razoável — mínimo aceitável';
  return 'Abaixo do mínimo';
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  const sources = [];
  let all = [];

  for (const [name, fn] of [['Raydium', scanRaydium], ['Orca', scanOrca]]) {
    try {
      const rows = await fn();
      all = all.concat(rows);
      sources.push({ dex: name, ok: true, pools: rows.length });
      console.log(`${name}: ${rows.length} pools`);
    } catch (e) {
      sources.push({ dex: name, ok: false, error: e.message });
      console.warn(`${name}: FALHOU — ${e.message}`);
    }
  }

  if (!all.length) { console.error('ERRO: nenhuma fonte respondeu'); process.exit(1); }

  const { kept, rejected } = rank(all);
  if (!kept.length) { console.error('ERRO: nenhum pool passou nos filtros — suspeito, não sobrescrevendo'); process.exit(1); }

  const doc = {
    updated: new Date().toISOString(),
    methodology:
      'Método Genesis (Defiverso): multiplicador = taxas_24h/TVL; ' +
      'score = (taxa_efetiva × 365) × peso_rede × (1 − penalidade_risco); ' +
      'teto anti-spike de 0,010/dia quando volume_24h > 5×TVL. ' +
      'Especificação completa em CONHECIMENTO-POOLIANA.md §4, §5.2 e §6.',
    criteria: {
      minTvlUsd: MIN_TVL_USD,
      minVolume24hUsd: MIN_VOLUME_24H,
      minMultiplierDaily: MIN_MULTIPLIER,
      spikeRatio: SPIKE_RATIO,
      spikeCapDaily: SPIKE_CAP_DAILY,
      note: 'A doutrina prega TVL mínimo de $500K; o scanner real usa $150K (ver §13.1).'
    },
    sources,
    scanned: all.length,
    qualified: kept.length,
    rejected,
    pools: kept.slice(0, TOP_N)
  };

  fs.writeFileSync(OUT, JSON.stringify(doc, null, 1) + '\n');

  const top = doc.pools[0];
  console.log(
    `OK ${all.length} varridos · ${kept.length} qualificados · top ${TOP_N} gravados\n` +
    `   1º: ${top.pair} (${top.dex}) — ${top.aprPct}% a.a. · ${top.monthlyPct}%/mês · ` +
    `TVL $${top.tvlUsd.toLocaleString('en-US')} · ${top.tier}${top.spike ? ' · SPIKE limitado' : ''}`
  );
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
