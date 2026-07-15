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
   + Kamino: +0.66 SOL supply (compra da semana anterior, deposit 04/07/2026
     12:02 · $53,92) + AAVE/Kamino refresh completo via print 04/07/2026
   + Kamino: +0.236808947 SOL supply (deposit 15/07/2026 00:17 UTC · $18,38)
   + SOL reconciliado com o CoinGecko em 15/07/2026: +0.84026 SOL lançados como
     transferência de entrada (custo $0) = juros acumulados da Kamino que o
     CoinGecko não vinha acompanhando. Total agora 24.390234 SOL, batendo com o
     supply da Kamino (24.39) — ou seja, todo o SOL está depositado como colateral.
     `invested` inalterado de propósito: juro é renda, não aporte.
     NÃO É ERRO o total bater exatamente com o supply da Kamino: os ~0.04996 SOL
     de gas na carteira (≈$3,88 · 0,05% do patrimônio) ficam fora da contabilidade
     por decisão do Lucas (15/07/2026). Não "reconciliar" isso.
   ════════════════════════════════════════════════════════════════════ */
window.BAROLO_DATA = {
  asOf: '2026-07-15',
  brlRate: 4.95,

  // Holdings (CoinGecko — já inclui colateral DeFi). qty + custo de aquisição (invested em USD).
  holdings: [
    { ticker:'BTC',   cgId:'bitcoin',                  qty:0.00434195, invested:270.47  },
    { ticker:'ETH',   cgId:'ethereum',                 qty:2.37632741, invested:4880.53 },
    { ticker:'SOL',   cgId:'solana',                   qty:24.390234,  invested:2504.86 },
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
    { ticker:'USDS', cgId:'usds',  qty:300,      invested:300      }
  ],

  // View do lending (NÃO aditivo ao total de holdings).
  defi: {
    aave: {
      supply: { WETH:{ qty:2.16, apy:0.0142 }, USDT:{ qty:1600, apy:0.0321 } },
      borrow: { USDC:{ qty:756.12, apy:0.0363 } },
      healthFactor: 5.48   // estimado via CF (WETH 83% / USDT 78%) — AAVE não expôs o HF direto no print
    },
    kamino: {
      // Print 15/07/2026: SOL supply 24.39 @ 6.41% (o 12.74% de 04/07 e o 22.51% de 03/07
      // eram blends transitórios com incentivos KMNO — rewards são claimable à parte).
      // Supplied $2.19K (SOL $1.89K + USDS $303) · Borrowing $819.51.
      supply: { SOL:{ qty:24.39, apy:0.0641 }, USDS:{ qty:303.03, apy:0.0450 } },
      borrow: { USDC:{ qty:819.67, apy:0.0560 } },
      ltv: 0.3733, liqLtv: 0.7700   // 819.51 / (1892.19 + 303.03)
    },
    uniswapV3: {
      pool:'WETH/USDG 0.01%', network:'Robinhood Chain', status:'active',
      capital:340, pooled:338.91, totalFees:0.0353, uncollectedFees:0.0353,
      il:0, pnl:-1.09, apr:0.6, daysOpen:1, openDate:'2026-07-14',
      rangeMin:1852.38, rangeMax:2166.83, poolApr:111.83,
      // Pool Base (WETH/USDC 0.3%) DESMONTADA em 14/07/2026: remove → 0.1717 ETH + 47.22 USDC;
      // USDC trocado por 0.0255 ETH (Uniswap V4); ~0.197 ETH bridgeado (Across V2) para a
      // Robinhood Chain; add liquidity com 0.183 ETH (~$340) → nova posição WETH/USDG 0.01%.
      // Fee tier menor mas APR da pool ~112% e alta rotatividade (1D/VOL ~30).
      // Posição atual: 0.178 WETH ($330,24) + 8.67 USDG. Range $1.852,38–$2.166,83, in-range.
      // Estratégia mantida: saída gradual ETH→USDG. Card ESTÁTICO (chain nova, sem fetch
      // on-chain) — Lucas envia valores por print.
      note:'WETH/USDG 0.01% · Robinhood Chain · in-range · APR pool ~112%'
    }
  },

  // Agregados (derivados, mantidos explícitos para conveniência das páginas).
  debt:   { aave:756.12, kamino:819.67, total:1575.79 },
  stablesTotalUSD: 1602.52,   // USDT 1302.52 + USDS 300
  lpPooled: 365
};
