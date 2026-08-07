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
   + USDS reconciliado em 15/07/2026 (mesma lógica do SOL): 300 → 320.47 =
     303.03 de supply na Kamino + 17.44 na carteira. Os +20.47 são rendimento
     (custo zero), então `invested` fica em 300 — o USDS passa a exibir P&L
     +$20,47 / ROI +6,8%, o que é correto: é yield, não desvio de peg.
   + Refresh completo 31/07/2026 (prints CoinGecko + AAVE V4 + Kamino + Revert):
     AAVE WETH 2.16 @1.74% / USDT 1600 @2.28% · borrow 758.80 USDC @3.97%;
     Kamino SOL 24.44 @4.95% / USDS 303.60 @4.27% · borrow 821.66 USDC @5.56% ·
     LTV 39.13% · juros ganhos +$150.03; USDS holding 320.47→317.44;
     Pool WETH/USDG (Robinhood, NFT 116561, 17 dias): pooled $343.23, fees
     $10.85 (uncollected), PnL +$15.13, IL $4.31, APR 96.01% / fee APR 68.86%,
     in-range (market $1.877,01), 0.167 WETH + 29.79 USDG.
   + Compra SOL 05/08/2026 16:18 (+0.374988 SOL @ $76,01 = $28,50) — total
     24.765222 SOL, bate exato com CoinGecko/Kamino supply. Refresh completo
     07/08/2026 (prints CoinGecko + AAVE V4 + Kamino + Uniswap):
     AAVE WETH 2.16 @1.79% / USDT 1600 @2.65% · borrow 759.46 USDC @4.00% ·
     Collateral $4.705 (print direto) → HF≈6,20; Kamino SOL 24.46 @4.49% /
     USDS 303.83 @4.00% · borrow 822.62 USDC @5.94% · LTV 38.95% · Liq.LTV
     77.16% · juros ganhos +$151.56; Pool WETH/USDG (Robinhood, 24 dias):
     pooled $351.18 (0.132 WETH + 96.01 USDG), fees $12.85 (uncollected),
     in-range (market $1.932,34, range $1.852,38–$2.166,83).
   ════════════════════════════════════════════════════════════════════ */
window.BAROLO_DATA = {
  asOf: '2026-08-07',
  brlRate: 4.95,

  // Holdings (CoinGecko — já inclui colateral DeFi). qty + custo de aquisição (invested em USD).
  holdings: [
    { ticker:'BTC',   cgId:'bitcoin',                  qty:0.00434195, invested:270.47  },
    { ticker:'ETH',   cgId:'ethereum',                 qty:2.37632741, invested:4880.53 },
    { ticker:'SOL',   cgId:'solana',                   qty:24.765222,  invested:2533.36 },
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
    { ticker:'USDS', cgId:'usds',            qty:317.44,   invested:300      }
  ],

  // View do lending (NÃO aditivo ao total de holdings).
  defi: {
    aave: {
      supply: { WETH:{ qty:2.16, apy:0.0179 }, USDT:{ qty:1600, apy:0.0265 } },
      borrow: { USDC:{ qty:759.46, apy:0.0400 } },
      healthFactor: 6.20   // = Collateral $4.705,00 (valor direto do print AAVE) / Borrow $759,46
    },
    kamino: {
      // Print 07/08/2026: SOL supply 24.46 @ 4.49% / USDS 303.83 @ 4.00% (rewards claimable
      // à parte: USDS $1.59, PYUSD $0.07, KMNO $3.24). Net APY 3.45% · juros ganhos
      // acumulados +$151.56. Supplied $2.11K (SOL $1.81K + USDS $303,83) · Borrowing $822,48.
      supply: { SOL:{ qty:24.46, apy:0.0449 }, USDS:{ qty:303.83, apy:0.0400 } },
      borrow: { USDC:{ qty:822.62, apy:0.0594 } },
      ltv: 0.3895, liqLtv: 0.7716   // print Kamino 07/08/2026
    },
    uniswapV3: {
      pool:'WETH/USDG 0.01%', network:'Robinhood Chain', status:'active',
      capital:343, pooled:351.18, totalFees:12.85, uncollectedFees:12.85,
      il:0, pnl:21.03, apr:93.26, daysOpen:24, openDate:'2026-07-14',
      rangeMin:1852.38, rangeMax:2166.83, poolApr:93.26, feeApr:56.98,
      // Pool Base (WETH/USDC 0.3%) DESMONTADA em 14/07/2026: remove → 0.1717 ETH + 47.22 USDC;
      // USDC trocado por 0.0255 ETH (Uniswap V4); ~0.197 ETH bridgeado (Across V2) para a
      // Robinhood Chain; add liquidity com 0.183 ETH (~$340) → nova posição WETH/USDG 0.01%.
      // Print Uniswap 07/08/2026 (24 dias): position $351,18 = 0.132 WETH ($255,17) + 96.01
      // USDG ($96,01). Fees earned $12,85 (uncollected) = 0.003 WETH ($6,48) + 6.37 USDG
      // ($6,37). Market $1.932,34, range $1.852,38–$2.166,83, in-range. PnL total (pooled+
      // fees−capital) = +$21,03; pooled > capital, então sem IL líquido neste corte (il:0 —
      // campo apenas descritivo, não usado em cálculo de nenhuma página).
      // Estratégia mantida: saída gradual ETH→USDG. Card ESTÁTICO (chain nova, sem fetch
      // on-chain) — Lucas envia valores por print.
      note:'WETH/USDG 0.01% · Robinhood Chain · in-range · fee APR 56,98% · total APR 93,26%'
    }
  },

  // Agregados (derivados, mantidos explícitos para conveniência das páginas).
  debt:   { aave:759.46, kamino:822.62, total:1582.08 },
  stablesTotalUSD: 1619.96   // USDT 1302.52 + USDS 317.44
  // NÃO adicionar `lpPooled` aqui: o valor da pool vive em defi.uniswapV3.pooled
  // (+ uncollectedFees). Um segundo campo só cria drift — a pool migra de rede e o
  // duplicado congela numa posição já desmontada (foi o que aconteceu até 15/07/2026).
};
