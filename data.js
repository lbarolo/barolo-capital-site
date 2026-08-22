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
   + Fechamento + reabertura da pool 07/08/2026: Lucas removeu a liquidez
     (posição fechava com $349,15 pooled + $13,04 fees = ~$362,19 realizado)
     tentando migrar pra outra pool v4, mas não conseguiu abrir a nova — voltou
     e reabriu a MESMA pool v3 WETH/USDG (Robinhood, mesmo range). Nova posição
     $364,28 = 0,150 WETH ($287,73) + 76,55 USDG ($76,55), fees ~$0 (recém
     aberta). Capital/openDate resetados; ciclo anterior fechado no histórico
     (pools.html POOLS + relatorio.html POOLS_DATA) com fees $13,04.
   + Refresh 21/08/2026 (prints AAVE V4 + Kamino, via check-in de mercado):
     AAVE WETH 2.16 @1.60% / USDT 1.600 @2.88% · borrow 760.78 USDC @4.20% ·
     Collateral $5.516,00 → HF≈7,25 (Collateral/Borrow — desta vez confere com
     o fetch ao vivo do briefing.json de 7,26, ao contrário do caso de
     18/08/2026); Kamino SOL 24.51 @4.61% / USDS 304.29 @2.89% · borrow 824.58
     USDC @6.34% · LTV 32.77% · Liq.LTV 76.81% · juros ganhos (lifetime Kamino)
     +$155.61.
   + Pool WETH/USDG saiu do range pelo TOPO em 20/08/2026 (rali forte de ETH,
     mercado > rangeMax $2.166,83) → posição virou 100% USDG. Coleta de fees +
     rotação do ETH velho (já contabilizado como renda no fechamento anterior)
     + reaporte mono-ativo de USDG na mesma posição — sequência completa e
     validada contra print da Uniswap já documentada nos comentários dentro de
     `defi.uniswapV3` (ver bloco "20/08/2026" ali). Não duplicar aqui.
   + 21/08/2026: REGRA DE CONTABILIDADE CONFIRMADA PELO LUCAS — taxas recebidas
     em ETH NÃO são lançadas no CoinGecko. Portanto, ao vender fee em ETH, NÃO
     subtrair de `holdings`: a qty vem do print do CoinGecko e só muda quando o
     print muda. A subtração de 0,0080 ETH feita em 20/08 foi revertida
     (2,36832741 → 2,37632741). Detalhe e evidências no bloco (f) de
     `defi.uniswapV3`.
   ════════════════════════════════════════════════════════════════════ */
window.BAROLO_DATA = {
  asOf: '2026-08-22',
  brlRate: 4.95,

  // Holdings (CoinGecko — já inclui colateral DeFi). qty + custo de aquisição (invested em USD).
  holdings: [
    { ticker:'BTC',   cgId:'bitcoin',                  qty:0.00434195, invested:270.47  },
    { ticker:'ETH',   cgId:'ethereum',                 qty:2.25752,    invested:4880.53 },
    { ticker:'SOL',   cgId:'solana',                   qty:24.765222,  invested:2533.36 },
    { ticker:'ADA',   cgId:'cardano',                  qty:375.245,    invested:530.95  },
    { ticker:'EIGEN', cgId:'eigenlayer',               qty:153.36298802, invested:45.87 },
    { ticker:'RDNT',  cgId:'radiant-capital',          qty:7290.46,    invested:0       },
    { ticker:'POL',   cgId:'polygon-ecosystem-token',  qty:218,        invested:143.88  },
    { ticker:'ZK',    cgId:'zksync',                   qty:876,        invested:0       },
    { ticker:'XAI',   cgId:'xai-blockchain',           qty:692.86,     invested:164.52  },
    { ticker:'ZETA',  cgId:'zetachain',                qty:51.1434,    invested:0       },
    { ticker:'SCR',   cgId:'scroll',                   qty:0.0018,     invested:0       }
  ],

  // Stablecoins (também já no total CoinGecko).
  stables: [
    { ticker:'USDT', cgId:'tether',           qty:1487.524, invested:1487.524 },
    { ticker:'USDS', cgId:'usds',            qty:317.44,   invested:300      }
  ],

  // View do lending (NÃO aditivo ao total de holdings).
  defi: {
    aave: {
      supply: { WETH:{ qty:2.1629, apy:0.0221 }, USDT:{ qty:1604.84, apy:0.0310 } },
      borrow: { USDC:{ qty:760.93, apy:0.0492 } },
      // HF REAL da Aave = colateral x liquidation threshold / divida. Conferido com
      // briefing.json (15/08/2026): colateral $5.658,25 (2,16 WETH @ $1.878,82 + 1.600 USDT),
      // borrow $760,17, LTV 13,4% -> HF 6,04.
      // CORRECAO 18/08/2026: o 6.08 anterior vinha de um colateral defasado ($4.622, que implica
      // ETH a $1.399,07) combinado com a formula Collateral/Borrow, que SUPERESTIMA o HF (daria
      // 7,44). Os dois erros quase se cancelavam. NAO usar Collateral/Borrow como regra geral.
      // Refresh 21/08/2026: print mostra "Collateral" $5.516,00 direto (já é o valor ponderado
      // pelo Collateral Factor de cada ativo — CF WETH 83% / CF USDT 78%, conferido: 2,16 ETH
      // @$2.372 x 0,83 + 1.600 USDT x 0,78 = ~$5.500, bate com os $5.516 do print). Collateral/
      // Borrow = 5.516/760,78 = 7,25, e desta vez CONFERE com o fetch ao vivo do briefing.json
      // (7,26) — ao contrário do caso de 18/08, aqui o número já vem corretamente ponderado.
      // ── PRINT "POSITION DETAILS" DA AAVE (22/08/2026) — dados exatos ─────
      //   WETH: deposited 2,16 (exato 2,1629) · APY 2,21% · earnings 0,01 ETH
      //         ($32,07 = 0,0132 ETH) · CF 83%
      //   USDT: deposited "1,60 mil" (ARREDONDADO) · APY 3,10% · earnings 17,19 · CF 78%
      //   USDC borrow: 760,93 · APY 4,92% · fees paid 12,93
      //   Borrowing Power $4.849,44 · Borrowed $761,00
      //
      //   ⚠️ USDT: o card arredonda para "1,60 mil", e o data.js vinha gravando 1600.
      //   O valor real sai do principal: 1.587,65 + 17,19 de earnings = 1.604,84
      //   (que de fato arredonda para "1,60 mil"). Corrigido — estava $4,84 a menos.
      //   O principal 1.587,65 fica CONFIRMADO por esta conta, não muda.
      //   O mesmo cruzamento valida o WETH: principal 2,15 + 0,0132 de earnings
      //   = 2,1632, contra os 2,1629 informados. Bate.
      //
      //   HF 7,37 = (borrowing power 4.849,44 + borrowed 761,00) / 761,00 — o
      //   numerador é o colateral JÁ PONDERADO pelo CF de cada ativo, que é o que
      //   a Aave usa. Substitui o 6,04 de 15/08.
      // ── SUPPLY EXATO DO aWETH (22/08/2026) ────────────────────────────────
      // 2.1629 (antes 2.16, arredondado do card). Com o exato, a decomposição do
      // ETH fecha:  CoinGecko 2,25752 − AAVE 2,1629 = 0,09462 em carteira.
      // Juros retidos = supply − principal = 2,1629 − 2,15 = 0,0129 ETH (~$31).
      // ⚠️ PENDENTE: o Lucas somou os "farelos" das carteiras e chegou a 0,131,
      // não 0,09462 — ou seja, faltariam 0,03638 ETH (~$88, 1% do patrimônio) no
      // CoinGecko. As duas somas não cobriram as mesmas carteiras/redes. Resolver
      // com uma varredura única antes de lançar; NÃO é dust desprezível (o gas de
      // 0,04996 SOL deixado fora em 15/07 valia $3,88, duas ordens de grandeza
      // menos). Enquanto não resolver, o patrimônio está ~$88 subestimado.
      healthFactor: 7.37
    },
    kamino: {
      // Print 07/08/2026: SOL supply 24.46 @ 4.49% / USDS 303.83 @ 4.00% (rewards claimable
      // à parte: USDS $1.59, PYUSD $0.07, KMNO $3.24). Net APY 3.45% · juros ganhos
      // acumulados +$151.56. Supplied $2.11K (SOL $1.81K + USDS $303,83) · Borrowing $822,48.
      // Refresh 21/08/2026: SOL 24.51 @4.61% / USDS 304.29 @2.89% (crescimento por yield
      // composto, sem depósito novo) · borrow 824.58 USDC @6.34% · Net APY 3.46% · juros
      // acumulados (lifetime Kamino) +$155.61 · LTV 32.77% (caiu vs semana passada por causa
      // do rali de SOL, não por repagamento) · Liq.LTV 76.81%.
      supply: { SOL:{ qty:24.51, apy:0.0461 }, USDS:{ qty:304.29, apy:0.0289 } },
      borrow: { USDC:{ qty:824.58, apy:0.0634 } },
      ltv: 0.3277, liqLtv: 0.7681   // print Kamino 21/08/2026
    },
    uniswapV3: {
      pool:'WETH/USDG 0.01%', network:'Robinhood Chain', status:'active',
      capital:388.06, pooled:413.05, totalFees:5.28, uncollectedFees:0,
      il:0, pnl:30.27, apr:64.57, daysOpen:14, openDate:'2026-08-07',
      rangeMin:1852.38, rangeMax:2166.83, poolApr:64.57, feeApr:50.91,
      // Ciclo anterior (aberto 14/07/2026) fechado em 07/08/2026: pooled $349,15
      // + fees $13,04 = ~$362,19 realizado (capital de entrada $343 → ganho
      // ~$19,19). Lucas tentou migrar para outra pool v4 mas não conseguiu abrir
      // — voltou e reabriu a MESMA pool v3 WETH/USDG (Robinhood, mesmo range),
      // redepositando o proveniente do fechamento. Ver histórico (fechado) em
      // pools.html POOLS + relatorio.html POOLS_DATA.
      // Print Uniswap 07/08/2026: nova posição $364,28 = 0,150 WETH ($287,73) +
      // 76,55 USDG ($76,55), fees $0,000001 (recém aberta, arredondado p/ 0).
      // Market $1.913,30, range $1.852,38–$2.166,83, in-range. Estratégia mantida:
      // saída gradual ETH→USDG. Card ESTÁTICO (chain nova, sem fetch on-chain) —
      // Lucas envia valores por print.
      // ── Print Revert 14/08/2026 ──────────────────────────────────────────
      // ATENÇÃO (metodologia): a Revert trata isto como UMA posição contínua
      // desde 14/07/2026 (mesma NFT — o "fechamento" de 07/08 foi remove+add
      // liquidity na MESMA posição, não uma NFT nova): 30,9 dias de idade,
      // fees lifetime $14,72 = $12,90 coletadas (ciclo 1, já lançadas como
      // pool FECHADA em pools.html/relatorio.html com $13,04) + $1,81 não
      // coletadas (ciclo 2, desde 07/08). PnL lifetime $18,84 · ROI 2,68%.
      // Os campos de ESTOQUE abaixo (pooled/fees/pnl/daysOpen) são do CICLO 2
      // apenas, para não duplicar o ciclo 1 que já está no histórico.
      // Os campos de TAXA (apr/poolApr/feeApr) usam os números lifetime da
      // Revert (64,57% / 50,91%): taxa é melhor estimada na amostra longa —
      // anualizar 7 dias daria ruído (o PnL −$4,33 do ciclo 2 é só o ETH
      // caindo de $1.913,30 → $1.876,06, não performance da pool).
      // Composição agora: 0,17501149 WETH ($328,24) + 29,9106110 USDG ($29,90).
      // Entrou 0,150 WETH + 76,55 USDG → girou pra mais WETH na queda (compra
      // automática na baixa dentro do range, como a estratégia prevê).
      // IL do ciclo 2 ≈ 0 (HODL da cesta de entrada valeria $357,96 vs pooled
      // $358,14). Gas lifetime 0,00003943 ETH ($0,07). In-range.
      // ── 20/08/2026: FEES COLETADAS + POSIÇÃO SAIU DO RANGE POR CIMA ───────
      // (a) Coleta: Lucas recolheu as taxas do ciclo 2 e trocou por USDG na
      //     Robinhood (swap 0,0023 ETH → 5,28 USDG, gas $0,0067). Logo
      //     totalFees do ciclo 2 = $5,28 REALIZADOS e uncollectedFees = 0.
      //     Os 5,28 USDG ficaram na carteira (Lucas quer recomprar ETH mais
      //     barato depois) e NÃO estão lançados em `stables` por decisão dele
      //     — entram quando ele registrar no CoinGecko.
      // (b) No mesmo bloco de transações houve um segundo swap (0,0080 ETH →
      //     18,50 USDG). NÃO é taxa desta pool: é ETH que já tinha sido
      //     retirado da pool antiga da Base (taxas já contabilizadas naquele
      //     registro histórico) e que o Lucas só vendeu agora, ao preço-alvo.
      //     Não lançar como renda — é rotação ETH→USDG. Registrado no Diário.
      //     REGRA (Lucas, 20/08/2026): as duas pools tinham o MESMO objetivo —
      //     se saíssem do range por cima, as fees em ETH seriam vendidas por
      //     USD de qualquer jeito. Ou seja, manter fee em ETH depois do
      //     fechamento é POSIÇÃO DIRECIONAL, não pool: a fee já foi lançada em
      //     USD no fechamento daquele registro, e o que veio depois pertence ao
      //     holding. Sempre que aparecer um swap de "fee velha" assim, tratar
      //     como rotação de holding — nunca como renda de pool.
      // (c) ETH a ~$2.283–2.309 > rangeMax $2.166,83 ⇒ posição FORA DO RANGE
      //     POR CIMA = 100% USDG. A saída gradual ETH→USDG COMPLETOU.
      //     `pooled` 382,80 é DERIVADO (sem print, chain sem fetch), não chute:
      //     do print de 14/08 (0,17501149 WETH + 29,9106110 USDG @ $1.876,06)
      //     sai L = 109,06 pelos dois lados; acima do range o valor é
      //     L × (√pb − √pa) = 109,06 × 3,50993 = 382,80 USDG — e, por estar
      //     100% em stable, esse número NÃO se move mais enquanto ETH ≥ $2.167.
      //     Conferir no próximo print; se divergir, o print manda.
      //     Resultado do ciclo 2 em USD (a régua do Lucas): 382,80 + 5,28
      //     − 364,28 = +$23,80 (+6,53% em 13 dias). Preço médio de saída
      //     ≈ √(1852,38 × 2166,83) = $2.003.
      // ── (d) 20/08/2026: APORTE MONO-ATIVO DE 23,78 USDG (decisão do Lucas) ─
      //     Ele mantém a pool e devolveu os 23,78 USDG (5,28 da fee coletada +
      //     18,50 da venda do ETH velho) para a MESMA posição, mono-ativo. Com
      //     o preço acima do range a posição é 100% USDG, então dá para
      //     adicionar só USDG. Tese: espera capitulação até outubro e quer a
      //     posição comprando ETH na descida.
      //     CONTABILIDADE (para não contar duas vezes):
      //       capital 364,28 → 388,06 (+23,78 aportados)
      //       pooled  382,80 → 413,05 (PRINT Uniswap 20/08, ver (e) abaixo)
      //       totalFees fica 5,28 (fee JÁ realizada; ao ser reinvestida vira
      //         capital novo, por isso entra nos dois lados e o pnl não muda)
      //       pnl = 413,05 + 5,28 − 388,06 = 30,27 ✔ (confere pelo outro lado:
      //         capital externo 364,28 + 18,50 = 382,78 → 413,05 − 382,78 = 30,27)
      //       holdings.ETH: NÃO mexer (fica 2,37632741). Ver (f) abaixo.
      // ── (f) 21/08/2026: A SUBTRAÇÃO DOS 0,0080 ETH FOI REVERTIDA ──────────
      //     Em 20/08 os holdings.ETH foram baixados 2,37632741 → 2,36832741 por
      //     medo de contar o mesmo dinheiro duas vezes (no ETH e na LP). ERRADO,
      //     e a condicional que ficou escrita aqui foi resolvida em 21/08:
      //     ⇒ REGRA CONFIRMADA PELO LUCAS (21/08/2026): ele NÃO lança no
      //       CoinGecko as taxas recebidas em ETH das pools. Elas ficam fora da
      //       contabilidade até virarem outra coisa. Logo o 2,37632741 do
      //       CoinGecko NUNCA incluiu aqueles 0,0080 de fee — subtrair removeu
      //       ETH que nunca esteve lançado (patrimônio ~$19 subestimado).
      //     Confirmado por DUAS evidências independentes:
      //       1. Print CoinGecko de 21/08 (DEPOIS da venda) ainda mostra
      //          2,37632741 — o livro dele não perdeu ETH nenhum.
      //       2. `git log` do data.js: a qty de ETH ficou parada em 2,37632741
      //          de 23/06 a 20/08. A pool da Base fechou em 14/07 gerando fee em
      //          ETH e a qty NÃO subiu — prova que fee em ETH nunca entra no CG.
      //     Não há dupla contagem: os 18,50 USDG que entraram na LP vieram de um
      //     ETH que estava FORA do CoinGecko. O patrimônio sobe 18,50 não como
      //     ganho, mas como valor real que passou a ser rastreado.
      //     ⇒ ⚠️ REGRA REVOGADA EM 21/08/2026 — ver (f) abaixo. Ela mantinha fora da
      //       contabilidade rendimento que existe de verdade. Vale agora a regra
      //       unificada do SOL/USDS: yield entra como quantidade, custo zero.
      // ── (e) PRINT Uniswap 20/08/2026 (confirma o aporte, valor manda) ────
      //     Position $413,05 · 0% WETH / 100% USDG (0 WETH + 413,05 USDG) ·
      //     Out of range · market $2.277,72 · range $1.852,38–$2.166,83 ·
      //     "Fees earned $0 — you have no earnings yet" = confirma que a coleta
      //     zerou o contador (uncollectedFees:0 está certo).
      //     A derivação de $382,80 feita antes do print (via L da leitura de
      //     14/08) ficou 1,59% BAIXA: 413,05 − 23,78 aportados = 389,27 real
      //     contra 382,80 estimado. Causa: L vem de uma diferença de raízes
      //     muito próximas (√P − √pa ≈ 0,274), então arredondamento do preço
      //     exibido no print amplifica o erro. LIÇÃO: derivar L serve para não
      //     deixar o card congelado num valor obsoleto, mas quando chegar print
      //     o print manda — não tentar reconciliar a diferença como aporte.
      //     Resultado do ciclo 2: +$30,27 sobre $382,78 de capital externo
      //     (+7,91% em 13 dias). Posição agora é 100% stable, esperando o preço
      //     voltar ao range para comprar ETH na descida (Lucas espera
      //     capitulação até outubro). Enquanto fora do range: taxa ZERO.
      // ── (f) RECONCILIAÇÃO DO ETH COM O COINGECKO (21/08/2026) ────────────
      //     Print CoinGecko 21/08: ETH 2,25752 (era 2,37632741). O ajuste veio de
      //     DOIS lançamentos, feitos pelo Lucas:
      //       −0,183      saída do ETH que entrou na pool em 14/07 e hoje é USDG
      //       +0,0642     entrada de yield a custo zero (aWETH da AAVE + taxas em
      //                   ETH de pools que nunca tinham sido lançadas)
      //       = 2,25752, batendo com a soma que ele fez na carteira (AAVE + wallet)
      //     `invested` fica em 4880.53: o que saiu era LP e o que entrou é renda.
      //
      //     ⇒ DUAS REGRAS QUE PASSAM A VALER (substituem a de 21/08 de manhã):
      //       1. ETH (ou qualquer token) que entra numa pool SAI do CoinGecko no
      //          mesmo dia. A partir daí quem conta aquele valor é a LP —
      //          Patrimônio = CoinGecko + LP − dívida, então deixar nos dois lados
      //          é dupla contagem. Os 0,183 ficaram contados em dobro de 14/07 a
      //          21/08 (~$434 de patrimônio inflado no pico).
      //       2. Yield em qualquer token (aToken da AAVE que cresce sozinho, fee de
      //          pool recebida em ETH) ENTRA no CoinGecko como quantidade, com
      //          custo zero — mesma regra já aplicada ao SOL e ao USDS em 15/07.
      //          O `invested` nunca sobe com yield; o ganho aparece como P&L.
      //
      //     O USDG da pool NÃO foi lançado no CoinGecko, e é assim que deve ser:
      //     os $413,05 já entram pelo lado da LP (defi.uniswapV3.pooled).
      //
      //     ── REGRA REFINADA (22/08/2026) — o critério NÃO é "operação vs hold" ──
      //     Fica FORA do CoinGecko só o que JÁ É CONTADO EM OUTRO LUGAR:
      //       · pool/LP        → fora  (contada por defi.uniswapV3.pooled)
      //       · caixa em corretora → DENTRO (não existe outro campo que a conte;
      //         se sair do CoinGecko, some do patrimônio). Mesma natureza das
      //         stables na AAVE/Kamino, que sempre estiveram lançadas.
      //     Aplicado em 22/08: +185 USDT de caixa na corretora (ordem em aberto
      //     para comprar BTC numa queda) lançados no CoinGecko a custo US$ 185 —
      //     stable com custo em USD dá P&L zero, que é o correto. O custo em BRL
      //     desse aporte vive na planilha Custo_BRL (aba Fiscal), não aqui.
      //
      //     ⚠️ PENDENTE: os números informados não fecham entre si — AAVE 2,16
      //     (print, arredondado) + carteira 0,131 = 2,291, contra o total de
      //     2,25752 que ele somou. Resíduo de 0,03348 ETH (~$79). O supply exato
      //     do aWETH resolveria; afeta também `principals.aave.WETH` (2,15) e o
      //     cálculo de juros acumulados do emprestimos.html.
      note:'WETH/USDG 0.01% · Robinhood Chain · FORA DO RANGE (acima) = 100% USDG · fees $5,28 coletadas 20/08 · saída gradual completa · +23,78 USDG aportados 20/08 (mono-ativo)'
    }
  },

  // Cost basis do lending (principal depositado/emprestado, SEM juros). Usado pela
  // seção JUROS EM TEMPO REAL do emprestimos.html: juros = atual − principal.
  // ATUALIZAR quando houver novo depósito/saque/reempréstimo — senão o depósito novo
  // aparece como se fosse juros ganho (foi o bug encontrado em 14/08/2026).
  //
  // ⚠️ AS DUAS ARMADILHAS (as duas já aconteceram — 14/08/2026):
  //   1. NUNCA fazer `principal = supply do print`. Na Kamino/AAVE o yield COMPÕE
  //      dentro do saldo, então o supply do print SEMPRE inclui juros. Igualar os
  //      dois zera o juro acumulado exibido no site.
  //   2. NUNCA esquecer de somar um depósito. Se o Lucas aporta e o principal fica
  //      parado, o aporte novo aparece como "juros ganhos" (foi assim que o site
  //      chegou a mostrar +316 USDT e +4,09 SOL de juros que não existiam).
  //
  // MANUTENÇÃO: o Lucas avisa por print toda vez que deposita/saca. Basta somar ou
  // subtrair o valor informado aqui. NÃO é preciso o CSV toda semana — ele só serve
  // para auditar/reconstruir o baseline se houver suspeita de drift (ou no fim do
  // ano, para o IR). O baseline abaixo foi cravado com o CSV de 15/07/2026.
  //
  principals: {
    aave:   {
      WETH: 2.15,     // 2,16 depositado − 0,01 earnings (print AAVE 14/08/2026)
      USDT: 1587.65,  // 1.604 depositado − 16,35 earnings (print AAVE 14/08/2026)
      USDC: 748.00    // borrow inicial (refin. 10/04/2026). Confere: 760,17 − 748 =
                      // 12,17 = exatamente o 'fees paid' do print AAVE.
    },
    kamino: {
      SOL:  23.274227,   // 29,405908 depositados − 6,131681 sacados (CSV Kamino)
      USDS: 300.392689,  // depósito único 19/03/2026 (CSV Kamino)
      USDC: 754.183048   // 1.807,089 emprestados − 1.052,905 repagos (CSV Kamino)
    }
    // ── Kamino: derivados do CSV oficial (Transaction History), 65 movimentos
    //    01/02/2025 → 15/07/2026. Cobrem a obrigação INTEIRA (ciclos K1–K4), não
    //    só o ciclo corrente — por isso USDC 754,18 e não os 807,49 do K4 isolado.
    //    Confere com o print de 14/08/2026:
    //      SOL   24,48   − 23,274227  = +1,2058 SOL retidos (~$90,53)
    //      USDS  304,07  − 300,392689 = +3,68 USDS retidos
    //      USDC  823,63  − 754,183048 = 69,45 USDC de juros já pagos
    //
    //    ATENÇÃO — não bate (e não deve bater) com o "Interest Earned +$153,62" que a
    //    Kamino mostra: aquilo é juro ACUMULADO DE TODA A VIDA, incluindo o que já foi
    //    sacado. Dos 6,13 SOL sacados ao longo de 2025, parte era juro realizado. O que
    //    o site calcula (atual − principal ≈ $94) é o juro AINDA RETIDO na posição, que
    //    é a métrica certa para "juros acumulados" de uma posição aberta.

    //    O SOL comprado em 05/08/2026 (+0,374988) NÃO foi depositado — ficou na carteira
    //    (holdings 24,765222 vs supply 24,48). Por isso o CSV termina em 15/07 e continua
    //    completo.
  },
  // Agregados (derivados, mantidos explícitos para conveniência das páginas).
  debt:   { aave:760.93, kamino:824.58, total:1585.51 },
  stablesTotalUSD: 1804.96   // USDT 1487.52 + USDS 317.44
  // NÃO adicionar `lpPooled` aqui: o valor da pool vive em defi.uniswapV3.pooled
  // (+ uncollectedFees). Um segundo campo só cria drift — a pool migra de rede e o
  // duplicado congela numa posição já desmontada (foi o que aconteceu até 15/07/2026).
};
