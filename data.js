/* ════════════════════════════════════════════════════════════════════
   data.js — FONTE ÚNICA DE DADOS DE POSIÇÃO (Barolo Capital)
   ════════════════════════════════════════════════════════════════════
   Editar SÓ AQUI na atualização mensal de posições. As páginas HTML leem
   de window.BAROLO_DATA e usam os valores hardcoded como fallback (se este
   arquivo falhar ao carregar, nada quebra).

   Carregado via <script src="data.js"></script> ANTES do script principal
   de cada página. Usa <script> (não fetch) de propósito: fetch de arquivo
   local é bloqueado por CORS em file://; <script> funciona em file:// e https.

   IMPORTANTE (metodologia): as quantidades de holdings JÁ INCLUEM o colateral
   depositado na AAVE/Kamino (Lucas não separa carteira vs DeFi no CoinGecko).
   Portanto Patrimônio = total holdings − dívida. O bloco `defi` abaixo é uma
   VIEW do lending (não posições aditivas) — NUNCA somar ao total de holdings.

   Baseline: 26/06/2026 (prints CoinGecko + AAVE V4 + Kamino)
   + compra BTC 01/07/2026 (0.00164555 BTC @ $58.272,31 = $95,89)
   + defi.aave/defi.kamino atualizados 03/07/2026 (prints AAVE + Kamino)
   + AAVE: +300 USDT supply de volta (deposit 04/07/2026, APY 3.21%)
   ════════════════════════════════════════════════════════════════════ */
window.BAROLO_DATA = {
  asOf: '2026-07-04',
  brlRate: 4.95,

  // Holdings (CoinGecko — já inclui colateral DeFi). qty + custo de aquisição (invested em USD).
  holdings: [
    { ticker:'BTC',   cgId:'bitcoin',                  qty:0.00434195, invested:270.47  },
    { ticker:'ETH',   cgId:'ethereum',                 qty:2.37632741, invested:4880.53 },
    { ticker:'SOL',   cgId:'solana',                   qty:23.31,      invested:2450.94 },
    { ticker:'ADA',   cgId:'cardano',                  qty:375.245,    invested:530.95  },
    { ticker:'EIGEN', cgId:'eigenlayer',               qty:153.363,    invested:45.87   },
    { ticker:'RDNT',  cgId:'radiant-capital',          qty:7290.46,    invested:0       },
    { ticker:'POL',   cgId:'polygon-ecosystem-token',  qty:218,        invested:143.88  },
    { ticker:'ZK',    cgId:'zksync',                   qty:876,        invested:0       },
    { ticker:'XAI',   cgId:'xai-blockchain',           qty:692.86,     invested:164.52  },
    { ticker:'ZETA',  cgId:'zetachain',                qty:51.1434,    invested:0       },
    { ticker:'SCR',   cgId:'scroll',                   qty:0.0018,     invested:0       }
  ],

  // Stablecoins (também já no total CoinGecko).
  stables: [
    { ticker:'USDT', cgId:'tether',           qty:1302.524, invested:1302.524 },
    { ticker:'USDS', cgId:'usds-stablecoin',  qty:300,      invested:300      }
  ],

  // View do lending (NÃO aditivo ao total de holdings).
  defi: {
    aave: {
      supply: { WETH:{ qty:2.16, apy:0.0142 }, USDT:{ qty:1600, apy:0.0321 } },
      borrow: { USDC:{ qty:756.06, apy:0.0358 } },
      healthFactor: 5.48   // estimado via CF (WETH 83% / USDT 78%) — AAVE não expôs o HF direto no print
    },
    kamino: {
      // ATENÇÃO: APY do SOL supply saltou de 4.28%→22.51% no print de 03/07 — provável
      // blend com incentivos/pontos KMNO (há reward KMNO $3.17 claimable no mesmo print),
      // não yield puro de lending. Mantido como está no dashboard; revisar se distorcer
      // o "Yield DeFi/Mês" do exec bar.
      supply: { SOL:{ qty:23.41, apy:0.2251 }, USDS:{ qty:302.63, apy:0.0414 } },
      borrow: { USDC:{ qty:818.06, apy:0.0638 } },
      ltv: 0.3668, liqLtv: 0.7704
    },
    uniswapV3: {
      pool:'WETH/USDC 0.3%', network:'Base', status:'active',
      capital:365, pooled:325, totalFees:21.11, uncollectedFees:18.62,
      il:-28.20, pnl:-9.58, apr:0.43, daysOpen:94
    }
  },

  // Agregados (derivados, mantidos explícitos para conveniência das páginas).
  debt:   { aave:756.06, kamino:818.06, total:1574.12 },
  stablesTotalUSD: 1602.52,   // USDT 1302.52 + USDS 300
  lpPooled: 365
};
