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
   + 27/08/2026 (prints Kamino): repay parcial de 63,348964 USDC direto da
     wallet + supply de 0,371763411 SOL na MESMA obrigação (SOL/BTC Market).
     Estado final: SOL 24,90 @5,68% · USDS 304,44 @3,11% · borrow 762,26 USDC
     @5,79% · LTV 25,22%. Dívida total 1.585,51 → 1.523,19.
     `principals.kamino` ATUALIZADO junto (regra de manutenção): SOL
     23,274227 → 23,645990 e USDC 754,183048 → 690,834084 — sem isso o
     depósito novo apareceria como rendimento e o repay inflaria os "juros
     pagos" (bug real de 14/08/2026).
     ORIGEM DOS 63,348964 USDC do repay (extrato Phantom, confere exato):
       · 17,25042 USDC — troca de 17,44514 USDS da carteira
       · 46,09855 USDC — PAGAMENTO EXTERNO recebido (de FvUL…NYds)
     USDS holding 317,44 → 299,99 (−17,44514 da troca, já retirado do
     CoinGecko pelo Lucas). ⚠️ DUAS PENDÊNCIAS abertas por esta operação:
       (a) o holding de USDS (299,99) ficou ABAIXO do supply da Kamino
           (304,44). Como holdings incluem colateral, o piso correto seria
           304,44 — faltam ~4,45 USDS de yield acumulado nunca lançado
           (mesmo padrão do SOL/USDS reconciliado em 15/07). Patrimônio
           subestimado em ~$4,45 até a próxima reconciliação.
       (b) os 46,09855 USDC do pagamento externo são APORTE NOVO, não retorno
           do portfólio: entraram de fora e foram direto abater dívida, sem
           passar por `holdings`. O patrimônio sobe $46,10 corretamente, MAS o
           capital aportado precisa subir os mesmos $46,10 — senão o ROI e o
           TWR creditam ao gestor um dinheiro que veio de fora. Falta lançar em
           `wealthCurve.invested` (portfolio_analytics.html) no fechamento do
           mês. Mesma natureza dos 285,40 USDT da pendência de 22/08.
   + FECHAMENTO MENSAL AGOSTO/2026 (01/09/2026 — prints CoinGecko + AAVE V4 +
     Kamino; SEM print da Uniswap/Revert):
     · CoinGecko total $10.819,68 (+27,6% de ganho acumulado no book do CG).
       Mudaram só DUAS quantidades: USDT 1.789,524 → 2.198,08879 (+408,56) e
       POL 218,07 → 190,13 (−27,94, vale ~$2,50 — o custo do CG segue $143,88,
       logo é ajuste de contagem, não venda; `invested` não muda).
     · AAVE V4: WETH 2,1629 → 2,2248 @2,27% · USDT 1.604,84 → 2.012,82 @3,27%
       · borrow 761,99 USDC @1,88% (era 4,92% — despencou) · Collateral $6.031
       · Borrowing Power $5.268,67 ⇒ HF 7,91 = 6.031/762.
       DOIS DEPÓSITOS NOVOS no mês (por isso `principals` subiu junto — sem
       isso o aporte apareceria como "juros ganhos", o bug de 14/08):
         WETH +0,0604 (2,2248 supply − 0,01444 earnings = 2,2104 de principal).
           A carteira esvaziou (<0,01 ETH / $6,67): o ETH foi da wallet pra AAVE,
           por isso o holding do CoinGecko NÃO muda (holdings já incluem colateral).
         USDT +406,27 (2.012,82 − 18,90 earnings = 1.993,92 de principal).
       ⚠️ O supply do aWETH é DERIVADO, o card arredonda: "2,22 ETH" ⇒ [2,215;2,225]
         e "$5,37 mil" ⇒ [2,2227;2,2268]. A interseção é [2,2227;2,2250] — daí o
         2,2248. (A conta pelo CoinGecko daria 2,2261, fora da interseção; ±$3.)
       ⚠️ O supply do USDT também é derivado — o card diz "2,01 mil". Duas fontes
         independentes batem: CoinGecko 2.198,08879 − corretora 185 − carteira
         0,269 = 2.012,82 ✔ (e isso confirma que os 185 da corretora seguem FORA
         da AAVE — se tivessem entrado, o card mostraria "2,20 mil").
     · Kamino: SOL 24,90 → 24,92 @4,63% · USDS 304,44 → 304,59 @3,41% · borrow
       762,26 → 762,97 USDC @5,34% · LTV 25,22% → 27,39% (subiu pela QUEDA do
       SOL para $99,64, não por dívida nova) · Liq.LTV 76,64% · Net APY 4,17% ·
       juros ganhos (lifetime) +$160,51. Sem depósito/saque ⇒ `principals.kamino`
       inalterado (juros retidos hoje: +1,274 SOL · +4,20 USDS · −72,14 USDC pagos).
     · ORIGEM DOS ~406 USDT: **é a pool fechada**, não aporte novo (corrigido em
       01/09/2026 pelo Lucas, confirmado no Diário DeFi do Notion). Ele encerrou
       o ciclo WETH/USDG de 26/08 (~$410, 100% USDG, sem taxa nenhuma), converteu
       para USDT e depositou na AAVE. Ver o bloco `defi.uniswapV3` para o detalhe
       e as duas conferências que fecham. Consequências no lançamento:
         · o custo VIAJA com o dinheiro: ETH 4.880,53 → 4.474,26 e USDT 1.772,92
           → 2.179,19. Total investido inalterado (10.642,50) — foi troca, não
           dinheiro novo. Sem isso o USDT exibiria +$425 de lucro fantasma.
         · `wealthCurve.invested` de 08/26 sobe só $360 (DCA de SOL 28,50 + os
           285,40 de 22/08 + os 46,10 do pagamento externo), NÃO $766.
       ✅ RESOLVIDO em 01/09/2026 — os 285,40 USDT de 22/08 SÃO aporte novo
       mesmo ("foi aporte, mas só um usdt mesmo, estou esperando lá para
       comprar", Lucas). É pó seco parado esperando ponto de entrada, não
       dinheiro que já estava no portfólio. Logo os $360 estão certos e o TWR
       de agosto (+26,4%) fica como está.
       ⚠️ Mas isso CONFIRMA a outra pendência: se entrou dinheiro de fora,
       falta o custo em BRL na planilha Custo_BRL (aba Fiscal) — ver abaixo.
     · Pool: FECHADA ~28/08 sem gerar taxa. LP = $0 (não somar: o dinheiro dela
       já está dentro do CoinGecko como USDT na AAVE).
     · Patrimônio líquido = 10.819,68 + 0 (LP) − 1.524,96 (dívida) = $9.294,72.
     · PENDÊNCIA (a) de 27/08 CONTINUA: holding de USDS (300) segue ABAIXO do
       supply da Kamino (304,59) — faltam ~4,59 USDS de yield nunca lançados no
       CoinGecko. Patrimônio subestimado nesse valor.
     · PENDÊNCIA (b) de 27/08 RESOLVIDA: os 46,09855 USDC do pagamento externo
       entraram em wealthCurve.invested no ponto 08/26 (junto com os 285,40 USDT
       reconhecidos em 22/08, os 406,27 acima e o DCA de SOL de 05/08).
   ════════════════════════════════════════════════════════════════════ */
window.BAROLO_DATA = {
  asOf: '2026-10-30',
  brlRate: 4.95,

  // Holdings (CoinGecko — já inclui colateral DeFi). qty + custo de aquisição (invested em USD).
  holdings: [
    // BTC 0,00434195 -> 0,00494132 e invested 270,47 -> 320,45 (29/09/2026): 2 ordens limite executadas em 28/09 na OKX
    // (+0,00023934 @ US$ 83.521,35 = 19,99 e +0,00036003 @ US$ 83.298,61 = 29,99) pagas com os 50 USDT que estavam
    // parados la — ROTACAO, nao aporte (o custo migra do USDT). Confere com o print do CoinGecko (custo total 320,45).
    { ticker:'BTC',   cgId:'bitcoin',                  qty:0.00734754, invested:516.23  },  // +0,00023548 qty e +18,19 invested (30/10/2026, 14:26:01): compra de 0,00023571 BTC @ US$ 77.244 na OKX, taxa 0,00000023 BTC (0,1%) -> liquido 0,00023548. ROTACAO — paga com os 18,21 USDT do aporte de 7 minutos antes; o aporte ja entrou em `contributions`, contar aqui de novo seria dupla contagem.  // +0,00061824 qty e +49,26 invested (24/10/2026, 12:09:57): compra de 0,00061885 BTC @ US$ 79.705 na OKX, taxa 0,00000061 BTC (0,1%) -> liquido 0,00061824. ROTACAO, nao aporte — paga com o caixa de USDT que ja estava na corretora (49,32 parados desde 16/10; a compra consumiu 49,26 e sobraram 0,06). NAO veio dos 200 sacados da AAVE: aqueles estao na rede Ethereum, reservados nas ordens limite da Uniswap criadas as 11:42-11:43, 27 minutos antes desta compra. O custo migra do USDT para o BTC e o TOTAL_INVESTED nao muda.  // +0,00023791 qty e +19,40 invested (16/10/2026, lancado em 23/10): compra de 0,00023814 BTC @ US$ 81.450 na OKX (16:34:29), taxa 0,00000023 BTC (0,1%) -> liquido 0,00023791. APORTE da sexta 16/10 feito DEPOIS do review daquele dia, por isso nao estava no site — achado em 23/10 pela divergencia do CoinGecko. A conta fecha dos dois lados: site 0,00649382 vs CoinGecko 0,00649607 = 0,00000225, que e EXATAMENTE a soma das taxas das 5 compras de 07-23/10 (CoinGecko bruto, site liquido); e vs OKX 0,00647885 = 0,00001497, a diferenca ja conhecida de 02/10 (taxas das 8 compras antigas).  // +0,00024074 qty e +19,68 invested (23/10/2026): compra de 0,0002417 BTC @ US$ 81.409,30 na OKX (16:07:05), taxa 0,00000096 BTC (0,4%) -> liquido 0,00024074. Feita 44 segundos depois de o aporte semanal de R$ 100,00 virar USDT e consumiu PRATICAMENTE TODO ele (0,0002417 x 81.409,30 = 19,6766 dos 19,67667291 USDT recebidos): o dinheiro e NOVO (ver contributions de 23/10), mas ESTA perna e rotacao — o aporte foi contado quando o fiat virou USDT. Lancado no CoinGecko por ele.  // +0,00011905 qty e +9,86 invested (09/10/2026): compra de 0,00011916 BTC @ US$ 82.781 na OKX (ordem 399...584, 13:53), taxa 0,00000011 BTC (0,09%) -> liquido 0,00011905. Comprada 4 minutos depois de o aporte semanal de R$ 50,00 virar USDT: o dinheiro e NOVO (ver contributions de 09/10), mas ESTA perna e rotacao — o aporte foi contado quando o fiat virou USDT, contar de novo aqui seria dupla contagem. Lancada no CoinGecko por ele.  // +0,00046978 qty e +38,88 invested (08/10/2026): compra de 0,00047025 BTC @ US$ 82.745 na OKX (ordem 398...384, 00:21), taxa 0,00000047 BTC (0,1%) -> liquido 0,00046978. Paga com USDT que ja estava na corretora: ROTACAO, nao aporte. Lancada no CoinGecko por ele.  // +0,00048502 qty e +40,49 invested (07/10/2026): compra de 0,0004855 BTC @ US$ 83.417 na OKX (ordem 398...408, 10:02), taxa 0,00000048 BTC (0,1%) -> liquido 0,00048502. Paga com USDT que ja estava na corretora: ROTACAO, nao aporte.  // invested 320,45->320,47 (02/10): o historico de ordens da OKX mostra que as 2 compras de 28/09 foram US$ 30,00 (16:38) + US$ 20,00 (16:33) = US$ 50,00, nao 49,98 — o CoinGecko tinha 29,99+19,99. Qty inalterada (0,00036003 + 0,00023934 brutos). Em 02/10 o CoinGecko estava com 0,00530135 porque a compra de 0,00036003 tinha sido lancada DUAS vezes (uma datada 28 Oct 2026, data futura); ele apagou a duplicata e acertou os centavos no mesmo dia — CoinGecko e site conferem (0,00494132 / US$ 320,47). NOTA: o saldo REAL na OKX e 0,00492638 (print 02/10) — 0,00001494 a menos (~US$ 1,26), que e a soma das taxas das 8 compras, cobradas em BTC. O CoinGecko (e o site) contam a quantidade BRUTA de cada ordem. Diferenca conhecida e aceita; se um dia valer acertar, lancar uma saida de 0,00001494 como taxa.
    { ticker:'ETH',   cgId:'ethereum',                 qty:2.407841,   invested:4875.80 },  // +0,00053 (29/10/2026): juro do aWETH desde 24/10 (0,020961978554540399 -> 0,021492079899159378, MCP), custo zero.  // +0,04332 qty e +100 invested (24/10/2026, fim da tarde): EXECUTOU a ordem limite (a) da Uniswap — 100 USDT -> 0,04332 ETH @ 2.308,60. O ETH furou o preco da ordem na mesma tarde: minima de US$ 2.286,76 as 15:30 UTC (CoinGecko OHLC), pouco depois do saque das 14:41. ROTACAO, nao aporte — os 100 USDT sairam do supply da AAVE no mesmo dia, ja eram do portfolio; o custo migra do USDT para o ETH e o TOTAL_INVESTED nao muda. Sem gas extra: ordem limite da Uniswap e off-chain, o filler paga o gas e o custo ja esta no preco (Network cost US$ 0). ⚠️ No CoinGecko ele digitou 0,0433 (4 casas) em vez de 0,04332 — 0,00002 ETH a menos (~US$ 0,05); se nao corrigir, o `cgMirror` acusa isso como pendente para sempre.   // +0,00008 (24/10/2026): juro do aWETH desde a quitacao de 23/10 (0,020882033267722674 -> 0,020961978554540399, MCP), custo zero. O gas de 0,0001 ETH (US$ 0,19) do saque de 200 USDT NAO e descontado — mesmo tratamento do gas desde 15/07/2026 (aqui o gas comeu o juro da semana, mas a regra vale).   // +0,0000035 (23/10/2026): juro do aWETH entre o review e a quitacao (0,020878497926142669 -> 0,020882033267722674, MCP), custo zero.  // +0,000794 (23/10/2026): juro do aWETH desde 16/10 (0,020084290403746695 -> 0,020878497926142669, MCP), custo zero.  // +0,0007 (16/10/2026): juro do aWETH desde 09/10 (0,019384 -> 0,020084, MCP), custo zero.  // +0,00083 (09/10/2026): juro do aWETH desde 02/10 (0,018554 -> 0,019384, print), custo zero.  // +0,0031 qty e invested INALTERADO (08/10/2026): 7,91 USDC -> 0,0031 ETH na Uniswap V4 (Arbitrum, tx 0x0431...dc2d), pagos com a venda total do RDNT. O RDNT era AIRDROP (invested 0), entao o custo que migra na rotacao e ZERO — somar os 7,91 aqui criaria custo do nada e inflaria o TOTAL_INVESTED sem nenhum dolar novo ter entrado. Como o patrimonio nao muda na rotacao, o invested tambem nao pode mudar. Gas das 2 txs ~US$ 0,012, nao descontado (mesmo tratamento do gas desde 15/07/2026).  // +0,02 qty e +51,54 invested (07/10/2026): compra de 0,0200 ETH por 51,54 USDT na carteira EVM (tx 0xeff6cb...1aa167). ROTACAO, nao aporte — os 50 USDT eram o resto do saque da AAVE de 15/09 que ficou na carteira (dos 300: 200 viraram ETH em 15-16/09, 50 em 24/09, estes 50 agora). Os outros 1,54 vieram de 1,54 USDC de troco que estava na carteira e NAO estava contabilizado no site: trocado por USDT no 1inch (tx 0x8eb7...d735) minutos antes. Por isso o invested sobe 51,54 e o USDT so baixa 50 — o total investido sobe 1,54, que e CORRECAO DE REGISTRO (o patrimonio estava subestimado nesse valor), nao aporte nem ganho. Gas de 0,0001 ETH (US$ 0,25) NAO descontado, mesmo tratamento do gas em SOL (decisao de 15/07/2026).  // qty 2,338054->2,338483 (02/10): juro do aWETH 0,018125328 -> 0,018554029 (MCP), custo zero.  // qty 2,337575->2,338054 (29/09): juro do aWETH 0,017646465 -> 0,018125328 (MCP). qty 2,317675->2,337575 e invested 4674,26->4724,26 (25/09/2026): compra de 24/09 (+0,0189 ETH @ ~US$ 2.645) paga com 50 dos 100 USDT sacados da AAVE em 15/09 — ROTACAO, nao aporte (custo migra do USDT). No CoinGecko ele digitou 0,189, 10x a mais; ver cgMirror + 0,001000116 de juro do aWETH desde 18/09 (0,016646349 -> 0,017646465, MCP). qty 2,317635->2,317675 (18/09, apos o deposito): juro do aWETH 0,016605882 -> 0,016646349 (MCP). Deposito de 0,08 ETH na AAVE em 18/09 so muda de lugar (carteira -> supply), nao a qty. qty 2,31739->2,317635 (18/09): +0,000244777 ETH de juro do aWETH desde 16/09 (0,016361105 -> 0,016605882, MCP), custo zero.  qty 2,23317->2,31739 e invested 4474,26->4674,26 (16/09/2026): compras de 0,041698997 (15/09) + 0,041916377 (16/09) = +0,083615374 ETH por US$ 200, pagos com USDT sacado da AAVE (ROTACAO, nao aporte — custo migra do USDT) + 0,000607 ETH de juro do aWETH desde 11/09 (0,015754006 -> 0,016361105, MCP).  qty 2,23062->2,23317 (11/09/2026): +0,00255 ETH de juro da AAVE desde a reconciliacao de 22/08 (earnings 0,0132 -> 0,015754, MCP), custo zero — pendente no CoinGecko, ver cgMirror. -406,27: custo do ETH que virou a pool e foi vendido no fechamento dela (transferido para o USDT, total investido nao muda)
    // SOL 24,765222 -> 24,93 em 04/09/2026: MESMO caso do USDS logo abaixo — o holding
    // estava ABAIXO do supply da Kamino (24,93), violando o invariante de que holdings
    // incluem o colateral (o piso do holding e sempre o supply). A diferenca (0,164778 SOL,
    // ~$16,70) e yield acumulado que o CoinGecko nunca acompanhou. Entra a CUSTO ZERO, entao
    // `invested` fica em 2533.36 — juro e renda, nao aporte. Mesmo tratamento do SOL em
    // 15/07/2026 e do USDS em 04/09/2026.
    // Os ~0,04996 SOL de gas na carteira seguem FORA da contabilidade por decisao do Lucas
    // (15/07/2026, ~$5) — por isso o holding fica igual ao supply, nao supply + carteira.
    // ✅ CONFIRMADO PELO LUCAS (05/09/2026): "esse 0.1648sol foram ganhos mesmo, custo zero"
    // — ele vai espelhar no CoinGecko como 'transferencia de entrada' (custo 0). O valor
    // aqui esta certo; NAO puxar de volta para 24,765222 na proxima leitura de print.
    // ⚠️ MUDOU EM 07/10/2026: o holding de SOL NAO e mais igual ao supply da Kamino.
    // Agora sao DUAS partes — supply da Kamino + SOL comprado na OKX (0,36367745). A regra antiga
    // ("holding = supply") valia enquanto todo o SOL estava no protocolo; se alguem igualar o holding
    // ao supply num review futuro, APAGA o SOL da corretora. O yield da Kamino passa a entrar por
    // DELTA do supply (mesmo tratamento que ETH e USDT ja usam desde 11/09/2026).
    { ticker:'SOL',   cgId:'solana',                   qty:25.85735038, invested:2584.07 },  // +0,02 (23/10/2026): yield da Kamino por DELTA do supply (25,07 -> 25,09, print), custo zero. = Kamino 25,09 + OKX 0,76735038 (print da OKX confere).  // +0,02 (16/10/2026): yield da Kamino (25,05 -> 25,07, print), custo zero. = Kamino 25,07 + OKX 0,76735037 (print da OKX confere).  // +0,02 (09/10/2026): yield da Kamino (25,03 -> 25,05), custo zero. = Kamino 25,05 + OKX 0,76735038 (confere o print da OKX).  // +0,40367293 qty e +42,75 invested (08/10/2026): compra de 0,404077 SOL @ US$ 105,90 na OKX (ordem 399...400, 14:26), taxa 0,00040407 SOL (0,1%) -> liquido 0,40367293. Paga com USDT que ja estava na corretora: ROTACAO, nao aporte. Lancada no CoinGecko por ele. NOTA: taxa de 0,1% aqui contra 0,4% na compra de SOL de 07/10 — a de 07/10 e que destoou (provavel ordem a mercado contra limite).  // +0,36367745 qty e +42,48 invested (07/10/2026): compra de 0,365138 SOL @ US$ 116,37 na OKX (ordem 398...648), taxa 0,00146055 SOL (0,4%, cobrada em SOL) -> liquido 0,36367745. Paga com USDT que ja estava na corretora: ROTACAO, nao aporte.  // 24,98->25,03 (02/10): supply da Kamino, yield custo zero.  // 24,95->24,98 (18/09): supply da Kamino, yield custo zero.  24,94->24,95 (11/09): supply da Kamino, yield custo zero.  // invested = "Custo total" do CoinGecko (print 09/09/2026), fonte canonica. Era 2.533,36: o lancamento de 04/07 somou 53,92 por 0,66 SOL (preco do DIA do registro, $81,70) quando a compra real foi 0,661425 @ $62,26 = $41,18. Qty 24,93->24,94 acompanha o supply da Kamino (yield, custo zero).
    { ticker:'ADA',   cgId:'cardano',                  qty:375.245,    invested:530.95  },
    { ticker:'EIGEN', cgId:'eigenlayer',               qty:131.44388802, invested:45.87 },
    { ticker:'RDNT',  cgId:'radiant-capital',          qty:0,          invested:0       },  // POSICAO ENCERRADA em 08/10/2026 (7.290,46 -> 0): vendido TUDO em 2 swaps no 1inch (Arbitrum) — 6.913,01 (tx 0xd4ed...ee8b) + 365,05 (tx 0xf218...2d54) = 7.278,06 RDNT por 7,9029 USDC, US$ 0,001086/un. O dinheiro virou 0,0031 ETH no mesmo dia. Palavras dele: "RDNT subiu 150% e aproveitei e vendi o que eu tinha... pra nao ver mais". invested era 0 (airdrop), entao a venda realiza US$ 7,90 de ganho contabil e o TOTAL_INVESTED nao muda. ✅ FECHA A PENDENCIA DE 22/08/2026: o site tinha 7.290,46 e o CoinGecko 7.278,07 (12,39 a menos, deixado de lado por valer 1 centavo). A venda on-chain de 7.278,06 prova que o CoinGecko estava CERTO e o site contava 12,40 a mais; com a posicao zerada dos dois lados a divergencia deixa de existir. O protocolo Radiant foi hackeado em 2025 (1.079,17 ARB em stake perdidos, ~US$ 671, fora do P&L de pools) — a posicao ja estava economicamente morta.
    { ticker:'POL',   cgId:'polygon-ecosystem-token',  qty:190.13,     invested:143.88  },  // qty 218.07->190.13 (print CG 01/09); custo do CG segue 143,88 => ajuste de contagem, nao venda
    { ticker:'ZK',    cgId:'zksync',                   qty:876,        invested:0       },
    { ticker:'XAI',   cgId:'xai-blockchain',           qty:898.879,    invested:164.52  },
    { ticker:'ZETA',  cgId:'zetachain',                qty:51.1434,    invested:0       },
    { ticker:'SCR',   cgId:'scroll',                   qty:0.0018,     invested:0       }
  ],

  // Stablecoins (também já no total CoinGecko).
  stables: [
    // USDT 2198,08879 -> 2201,81879 (11/09/2026): +3,73 de juro da AAVE desde 22/08
    // (earnings 17,19 -> 20,917508, MCP). Custo zero, invested inalterado. O CoinGecko
    // ficou em 2198,08879 (22/08 + o deposito de 408,56 em 28/08, que e principal) —
    // pendente de lancar, ver cgMirror. Conferencia: AAVE 2016,818486 + corretora 185
    // + carteira ~0,27 = 2202,09 (o ~0,27 de diferenca e arredondamento de 22/08).
    // USDT 2201,81879 -> 2002,77816 e invested 2179,19 -> 1979,19 (16/09/2026): 200 USDT viraram ETH (rotacao;
    // o custo migra para o ETH, total investido nao muda) + 0,959374 de juro do aUSDT desde 11/09
    // (20,917508 -> 21,876882, MCP). Saque de 300 USDT da AAVE em 15/09: 200 foram pro ETH, 100 seguem fora da AAVE.
    // 🔸 BABY (Babylon) 16,96916228 = US$ 0,23 na OKX (print 02/10/2026) NAO entra na
    // contabilidade — mesmo tratamento dos ~0,05 SOL de gas na carteira (decisao de
    // 15/07/2026): valor abaixo do custo de registrar. Se um dia virar posicao, criar
    // entrada em holdings. O BRL 0,00003629 da OKX idem.
    // ✅ CONFERIDO contra o saldo da OKX (print 02/10/2026): dos 1.906,15 de USDT, 1.721,13
    // estao no supply da AAVE e 185,02 fora dela — 134,98 na OKX + ~50 na carteira EVM
    // (4 centavos de diferenca, arredondamento). Corrige a nota de 29/09 que dizia que o
    // caixa em corretora tinha acabado: NAO acabou. Reconstrucao: os 185 de caixa de 22/08
    // viraram 135 quando 50 compraram BTC na OKX em 28/09; e dos 300 sacados da AAVE em
    // 15/09, 200 viraram ETH em 15-16/09 e 50 em 24/09, sobrando ~50 na carteira EVM.
    { ticker:'USDT', cgId:'tether',           qty:100.219828, invested: 824.47  },  // +18,20684 qty e +18,21 invested, e logo -18,19 nos dois (30/10/2026) = liquido +0,01684 qty, +0,02 invested. APORTE SEMANAL de R$ 100,00 convertidos @ 5,4924 (par USDT/BRL, 14:19:14, taxa ZERO) que 7 minutos depois virou BTC. ⚠️ O CAMBIO SALTOU: 5,0822 em 23/10 -> 5,4924 hoje (+8,1% em uma semana) — os mesmos R$ 100 renderam 18,21 USDT contra 19,68 na semana passada. A OKX mostra o lado BRL como US$ 18,41 (cambio comercial ~5,432) contra os 18,20684 USDT entregues: ~1,2% de spread, bem menor que os 2,9% de 16/10.  // +0,427842 (29/10/2026): juro do aUSDT desde 24/10 (28,791148 -> 29,218990, MCP), custo zero.  // ⚡ -755,119968 qty e `invested` INALTERADO (29/10/2026): o USDT inteiro saiu da AAVE, virou 742,37 USDC na Velora e montou a pool ETH/USDC v4 (ver `defi.uniswapV3`). A qty SAI porque a pool ja e contada em `uniswapV3.pooled` — contar nos dois seria dupla contagem do mesmo dinheiro. O `invested` FICA: e o mesmo tratamento do ETH quando virou pool em 14/07/2026 (o custo so migrou no fechamento, 'transferido para o USDT, total investido nao muda'). `uniswapV3` nao tem campo de custo, entao baixar o invested aqui derrubaria o TOTAL_INVESTED em 755 e inflaria o ROI por artefato. Por isso o USDT fica com qty 100,20 e custo 824,45 ate a pool fechar — e esperado, nao e erro.   // -49,26 qty e invested (24/10/2026, 12:09:57): compra de 0,00061885 BTC na OKX paga com o caixa que ja estava la. ROTACAO — o custo migra para o BTC. Caixa da OKX: 49,32 -> 0,06.   // -100 qty e -100 invested (24/10/2026, fim da tarde): a ordem limite (a) executou e os 100 USDT viraram 0,04332 ETH. ROTACAO — o custo migra 1:1 para o ETH, `contributions` INALTERADA. Sobram 100 USDT reservados na ordem (b) (0,04564 ETH @ 2.191,11, vence 23/11/2026), que NAO executou: a minima do dia foi 2.286,76, bem acima do preco dela.   // +0,063402 (24/10/2026): juro do aUSDT desde a quitacao de 23/10 (28,727746 -> 28,791148, MCP), custo zero. ⚡ SAQUE DE 200 USDT DA AAVE no mesmo dia (14:41 UTC) NAO muda esta qty nem o invested: o USDT so mudou de lugar (supply da AAVE -> carteira EVM), continua no portfolio. Os 200 estao reservados em DUAS ORDENS LIMITE de compra de ETH na Uniswap, criadas 24/10 11:42-11:43: (a) 100 USDT -> 0,04332 ETH @ 2.308,6 USDT/ETH, expira 31/10/2026; (b) 100 USDT -> 0,04564 ETH @ 2.191,11 USDT/ETH, expira 23/11/2026. Mercado na hora: US$ 2.341,12. PENDENTES — enquanto nao executarem, nada muda. Quando executarem sera ROTACAO (o custo migra do USDT para o ETH), nunca aporte. Ele ainda NAO lancou no CoinGecko: vai esperar a execucao para dar a saida do USDT e a entrada do ETH de uma vez.   // -770 qty e -770 invested (23/10/2026, 17:19): QUITACAO DA DIVIDA DA AAVE. Os 770 USDT sacados do supply viraram 769,14 USDC no 1inch e pagaram os 768,40 de divida. NAO e compra nem venda: o ativo sai e o passivo some junto, entao o patrimonio cai so 1,60 (0,86 de slippage do swap + 0,74 da sobra em USDC que ficou fora da contabilidade). O custo migra 1:1, mesmo tratamento das compras. ⚠️ ELE PRECISA DAR SAIDA DE 770 USDT NO COINGECKO — nao e yield, e saida de ativo; ate la o `cgMirror` fica 766 acima e o yield-to-mirror vai acusar negativo. // +0,004710 (23/10/2026): juro do aUSDT entre o review e a quitacao (28,723036 -> 28,727746, MCP).  // +19,39657 qty e +19,40 invested, e logo -19,3965 qty e -19,40 invested (16/10/2026, lancado em 23/10) = liquido +0,00007 qty, invested inalterado. APORTE SEMANAL de R$ 100,00 @ 5,1555 (par USDT/BRL, 16:32:30, taxa ZERO) que 2 minutos depois virou BTC. Explica o caixa da OKX ter ficado parado em 49,32 de 16/10 a 23/10: entrou e saiu no mesmo dia.  // +1,015221 (23/10/2026): juro do aUSDT desde 16/10 (27,707815 -> 28,723036, MCP), custo zero.  // +19,67667291 qty e +19,68 invested, e logo -19,6766 qty e -19,68 invested (23/10/2026) = liquido +0,0000451 qty, invested inalterado. APORTE SEMANAL de R$ 100,00 convertidos @ 5,0822 (par USDT/BRL, 16:06:21, taxa ZERO) que 44 segundos depois virou BTC. O aporte entra em `contributions`; a compra de BTC e so a rotacao seguinte. A sobra de 0,0000451 USDT e arredondamento. Caixa da OKX: 49,46 -> 49,46.  // +1,057815 (16/10/2026): juro do aUSDT desde 09/10 (26,65 -> 27,707815, MCP), custo zero.  // +9,86463 qty e +9,86 invested, e logo -9,86 qty e invested (09/10/2026) = liquido +0,00463 qty, invested inalterado. APORTE SEMANAL de R$ 50,00 convertidos @ 5,0686 (par USDT/BRL, 13:49:47, taxa ZERO) que 4 minutos depois virou BTC. O aporte entra em `contributions`; a compra de BTC e so a rotacao seguinte. A sobra de 0,00463 USDT (meio centavo) fica no caixa com custo ~0 — arredondamento, nao vale perseguir. Caixa da OKX: 49,46 -> 49,46.  // +1,422459 (09/10/2026): juro do aUSDT desde 02/10 (25,227541 -> 26,65, print), custo zero.  // -81,63 qty e invested (08/10/2026): compras de BTC (38,88) e SOL (42,75) na OKX. ROTACAO — o custo migra para cada token, o TOTAL_INVESTED nao muda. USDT na corretora: 131,09 -> 49,46.  // -40,49 qty e invested (07/10/2026): compra de 0,0004855 BTC na OKX. ROTACAO — o custo migra para o BTC. USDT na corretora: 171,58 -> 131,09.  // -42,48 qty e invested (07/10/2026): compra de 0,365138 SOL na OKX. ROTACAO — o custo migra para o SOL. USDT na corretora: 214,06 -> 171,58 (o resto segue como caixa).  // -50 qty e -50 invested (07/10/2026): os 50 USDT que sobravam na carteira EVM (saque da AAVE de 15/09) compraram 0,02 ETH. ROTACAO — o custo migra para o ETH. Conferencia antes da operacao: USDT fora da AAVE 264,06 = OKX 134,98 + carteira ~50 + aporte de 05/10 79,04 (4 centavos de arredondamento) — confirma a reconstrucao feita em 02/10 e a fala do Lucas ("esse USDT foi aquele mesmo que tirei da AAVE").  // +79,03794294 qty e +79,12 invested (05/10/2026): APORTE DE VERDADE — R$ 400,00 convertidos em USDT na OKX @ 5,0558 (ordem 398...010, 09:51). Bruto 79,11706 - taxa 0,07911706 (0,1%) = 79,03794294 liquido. O invested leva o BRUTO (US$ 79,12, o que saiu do bolso); a diferenca de 8 centavos e a taxa, custo real.  // qty +0,528182 e invested -0,02 (02/10/2026): juro do aUSDT desde 29/09 (24,699359 -> 25,227541, MCP) e as compras de BTC de 28/09 custaram US$ 50,00 (OKX), nao 49,98 — 2 centavos a mais migram para o BTC.  // -49,98 (29/09/2026): os 50 USDT da ordem limite viraram BTC em 28/09 (rotacao; custo migra para o BTC) e +0,713205 de juro do aUSDT desde 25/09 (23,986154 -> 24,699359, MCP).  -50 (26/09/2026): 50 dos 100 USDT sacados da AAVE em 15/09 viraram ETH em 24/09 — ROTACAO, nao aporte (o custo migra para o ETH, total investido nao muda). Sobram 50 USDT em ordem limite, nao acionada.  2003,309704->2004,887432 (25/09/2026): +1,577728 de juro do aUSDT desde 18/09 (22,408426 -> 23,986154, MCP).  2003,268354->2003,309704 (18/09, apos o deposito): juro do aUSDT 22,367076 -> 22,408426 (MCP).  2002,77816->2003,268354 (18/09): +0,490194 USDT de juro do aUSDT desde 16/09 (21,876882 -> 22,367076, MCP), custo zero
    // USDS 300 -> 304.66 em 04/09/2026: o holding estava ABAIXO do supply da Kamino
    // (304,66), o que viola o invariante de que holdings incluem o colateral — o piso
    // do holding e sempre o supply. A diferenca e yield acumulado que o CoinGecko nunca
    // acompanhou (nao ha USDS em carteira desde o swap de 17,44514 em 27/08). Entra a
    // CUSTO ZERO, entao `invested` fica em 300 — juro e renda, nao aporte. Mesmo
    // tratamento dado ao SOL e ao proprio USDS na reconciliacao de 15/07/2026.
    // ✅ Mesma confirmacao do SOL (Lucas, 05/09/2026): e yield, custo zero, e ele espelha
    // no CoinGecko como 'transferencia de entrada'. NAO puxar de volta para 300.
    { ticker:'USDS', cgId:'usds',            qty:0,        invested:0        }  // 305,46->0 e invested 300->0 (02/10): posicao de USDS ENCERRADA no repay da Kamino. ROTACAO, nao aporte. Extrato da carteira Solana (02/10), em ordem: resgate do reward +1,59364 USDS -> troca de 307,051 USDS por 307,05707 USDC (1:1 no PRECO — o custo veio como taxa a parte, abaixo, nao como slippage) -> envio de 4,91291 USDC para BjQh...kA7X -> repay de 302,14416 USDC na Kamino. Confere: 305,46 (supply) + 1,59364 (reward) = 307,05364 trocados, e 307,05707 - 4,91291 = 302,14416 = o repay exato. ⚠️ PYUSD 0,07 e KMNO 6,38 seguem CLAIMABLE no print pos-repay — NAO foram convertidos. ✅ Os 4,91291 USDC (e 0,00137 SOL no 2o repay) para BjQh...kA7X foram TAXA do protocolo usado no swap (Lucas, 02/10) — custo real, ~1,6% do valor trocado; ja refletido (nao e ativo).
    // 2o REPAY no mesmo dia (02/10), pago com KMNO: recebeu +164,51055 KMNO do stake
    // (Ar48...V5c6), somou ao saldo/rewards e trocou 255,21922 KMNO por 10,09033 USDC;
    // repagou 10,09043 na Kamino (os 0,0001 de diferenca sao o dust de USDC do address
    // poisoning, que estava parado na carteira e acabou entrando no repay). Divida
    // 465,07 -> 454,97957. O KMNO NUNCA esteve contabilizado no site (rewards nao lancados),
    // entao essa conversao e GANHO: o passivo cai 10,09 sem nenhum ativo do site sair.
    // Tambem saiu -0,00137 SOL (gas, ~US$ 0,16) — fora da contabilidade como o resto do gas.
    // Rewards da Kamino depois disso: KMNO ZERADO, sobra PYUSD US$ 0,07.  // 305,05->305,46 (02/10): supply da Kamino, yield custo zero.  // 304,86->305,05 (18/09): supply da Kamino, yield custo zero.  304,69->304,86 (11/09): supply da Kamino, yield custo zero.  // 304,66->304,69: acompanha o supply da Kamino (print 05/09). Yield puro, custo zero.
  ],

  // View do lending (NÃO aditivo ao total de holdings).
  defi: {
    aave: {
      // Print 05/09/2026 (Position Details): ETH 2,22 deposited @2,16% earnings 0,01 ETH ($36,56)
      // · USDT 2,02 mil @3,90% earnings 19,65 USDT · USDC borrow 762,40 @1,96% (era 4,65%!)
      // fees paid 14,40 USDC · Borrowing Power livre $5.341,59 · colateral ponderado $6.104,00.
      // Quantidades = principal + earnings (metodologia 22/08): WETH 2,2104+0,014893=2,2253
      // (36,56 / 2.454,82) · USDT 1.993,92+19,65=2.013,57. O borrow confere sozinho:
      // 762,40 - 748 (principal) = 14,40 = exatamente o 'fees paid' do print. Sem deposito
      // nem reemprestimo no periodo -> principals INALTERADOS.
      // Refresh 11/09/2026 — print Position Details + MCP (get_position_items), EXATO:
      //   WETH 2,225494100 = principal 2,209740095 + juro 0,015754006 @1,78%
      //   USDT 2016,818486 = principal 1995,900978 + juro 20,917508 @3,21%
      //   USDC borrow 763,052538 = principal 748 + juro 15,052538 @5,63% (net; a taxa
      //   base do item veio 6,44%) — era 1,96% em 05/09, TRIPLICOU na semana.
      //   Deposited $7.672 · Borrowing Power $6.266,59 · HF 8,2135 (MCP).
      //   Os tres principals conferem na casa decimal com o bloco `principals`. Sem
      //   deposito/saque/reemprestimo -> principals INALTERADOS.
      supply: { WETH:{ qty:2.311232, apy:0.0159 }, USDT:{ qty:0, apy:0 } },   // ⚡ MCP 29/10/2026 (17:12 UTC, tx 0x73ed6dae...1a04): SACOU TODO O USDT — 755,119968 (principal 725,900978 + 29,218990 de juro, bate com o print). O item de USDT sumiu do `get_position_items`: so resta WETH 2.311232174632745104 = principal 2,289740094733585726 + 0,021492079899159378 de juro @1,5867%. 🔸 O supply do USDT marcava 13,11% de APY na hora do saque (era 3,23% em 24/10) — ele abriu mao disso pela pool de 72% (ver `uniswapV3`). Colateral agora e SO WETH; sem divida, nao ha HF.   // MCP 24/10/2026 (14:41 UTC, tx 0xf25c...ec00): SAQUE DE 200 USDT do supply -> principal 925,900978 -> 725,900978 (MCP confere na casa decimal, -200 exatos). USDT 754,692126 = 725,900978 + 28,791148 de juro @3,2339%. WETH intocado: 2,310702073288126125 = principal 2,289740094733585726 + 0,020961978554540399 de juro @1,6392%. Sem divida (HF null). Os 200 USDT NAO saem do portfolio — foram para a carteira e estao reservados em 2 ordens limite de compra de ETH na Uniswap (ver stables.USDT).   // MCP 23/10/2026 POS-QUITACAO (17:19): sacou 770 USDT do supply -> principal 1.695,900978 -> 925,900978. WETH intocado (principal 2,289740094733585726 + 0,020882033267722674 de juro).   // MCP 23/10/2026: WETH 2,289740094733585726 + 0,020878497926142669 @1,67% · USDT 1695,900978 + 28,723036 @3,22% (principals BATEM na casa decimal — sem movimentacao na semana).   // MCP 16/10/2026: WETH 2,28974 + 0,020084 @1,65% · USDT 1695,900978 + 27,707815 @3,00% (principals inalterados — sem movimentacao).   // print 09/10/2026: principal + earnings (WETH 2,28974 + 0,019384 [$48,25 / $2.489,20]; USDT 1695,900978 + 26,65). Sem movimentacao -> principals inalterados.   // MCP 02/10/2026 (principals conferem, sem movimentacao na AAVE desde o deposito de 0,08 ETH em 18/09)
      borrow: { USDC:{ qty:0, apy:0 } },   // ⚡ DIVIDA DA AAVE QUITADA em 23/10/2026 17:19 (block 26257675): repay de 768,40 USDC, taxa de borrow 5,11% na hora. MCP confirma totalDebtUsd 0 e healthFactor null. Sequencia: withdraw 770 USDT (tx 0xc150...5250) -> approve 1inch -> swap 770 USDT por 769,14 USDC (tx 0x5709...7846, slippage 0,11%) -> multicall repay (tx 0x6ae9...6e17). Sobraram 0,74 USDC na carteira, FORA da contabilidade (mesma regra do BABY e do gas).   // MCP 23/10/2026: 748 + 20,395695 de juro (fees paid do print confere). APY 6,12% = 'Borrow APY' do print (net); base 5,05% no MCP, netBorrowApy 6,10%. CEDEU de 8,79% para 6,12% — o alerta de quitar perde forca.   // MCP 16/10/2026: 748 + 19,459613 de juro. APY 8,79% = 'Borrow APY' do print (net; base 6,77% no print / 7,12% no MCP, netBorrowApy MCP 8,54%) — mais que dobrou desde 09/10 (3,44%).   // print 09/10/2026: 748 + 18,57 fees paid = 766,57 (confere o principal) @3,44%.   // MCP 02/10/2026: netBorrowApy 3,04% (base 4,13%) — a taxa oscila muito no dia
      // ══ HEALTH FACTOR — FORMULA DEFINITIVA (resolvido 09/09/2026 via MCP da Aave) ══
      //
      //   HF = Borrowing Power / divida = SOMA(colateral_i x CF_i) / divida
      //
      // Onde CF = Collateral Factor por ativo: WETH 83% · USDT 78%.
      // Conferido contra o `get_user_summary`/`get_user_positions` do mcp.aave.com em
      // 09/09/2026, que devolve os campos oficiais:
      //   maxBorrowingPowerUsd 6.167,641 / totalDebtUsd 762,7573 = healthFactor 8,0860 ✓
      //   averageCollateralFactorPct 81,6653 — e os CFs individuais batem:
      //   (5.538,77 x 0,83) + (2.013,57 x 0,78) = 6.167,76 -> 81,67% do colateral bruto ✓
      //
      // ⚠️ NAO usar `Collateral / Borrow` cru: superestima o HF (aqui daria 9,90 em vez de
      //    8,09). So coincide quando o numero de "Collateral" do print JA vem ponderado pelo
      //    CF — o que acontece em alguns cards da Aave e foi a origem da confusao historica.
      //
      // HISTORICO DA DIVERGENCIA (encerrado — nao reabrir): circularam 6,04 / 6,12 / 5,00 /
      // 7,25 em momentos diferentes. Nenhum era "outra formula": eram SNAPSHOTS DEFASADOS,
      // tirados com precos e colaterais diferentes, alguns com a formula crua por cima. O HF
      // se move com o preco do ETH, entao QUALQUER valor gravado aqui envelhece em horas.
      // O campo abaixo e SO FALLBACK — as paginas buscam o HF ao vivo e e esse que vale.
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
      // ── PENDENCIA DO ETH: RESOLVIDA EM 04/09/2026 (varredura on-chain) ──────
      // Durante semanas ficou aberta a duvida de quanto ETH estava FORA da AAVE.
      // Havia tres contagens divergentes de 22/08: 0,06595 (screenshots, que entrou
      // no livro), 0,09462 (implicito CoinGecko-AAVE) e 0,13100 (soma manual). A nota
      // antiga dizia que faltavam 0,03638 ETH (~$88) — e o numero estava errado duas
      // vezes: era calculado contra 0,09462, que nao e o que o livro usa; se a soma
      // manual estivesse certa, o que faltaria seria 0,06505.
      //
      // `scripts/eth-sweep.js` (Action `eth-sweep.yml`, workflow_dispatch) leu as 4
      // carteiras EVM em 4 redes, nativo + WETH. Resultado de 04/09/2026:
      //     ethereum 0,005632 · base 0,000019 · arbitrum 0,000364 · optimism 0,000011
      //     TOTAL FORA DA AAVE = 0,006026 ETH
      // O livro esperava holding 2,23062 - supply AAVE 2,2252 = 0,005420.
      // Diferenca 0,000606 ETH (~$1,49) => O LIVRO ESTAVA CERTO. Nao ha 0,036 nem
      // 0,065 em lugar nenhum; a soma manual de 0,131 quase certamente contou duas
      // vezes o aWETH da AAVE ou o Yearn. Nada a lancar.
      //
      // O QUE A VARREDURA NAO COBRE (residuo conhecido, deixado fora de proposito):
      //   · Yearn V3 0,0018 — e vault token (yvWETH), nao WETH na carteira
      //   · Robinhood Chain — sem RPC publico confiavel (ver CLAUDE.md)
      // Somando o Yearn, o holding estaria ~0,0024 ETH (~$5,90) subestimado. Fica
      // fora pelo mesmo criterio dos 0,04996 SOL de gas que o Lucas decidiu ignorar
      // em 15/07/2026 ($3,88) — mesma ordem de grandeza, nao vale o ruido.
      //
      // ⚠️ A MARGEM E APERTADA: holding - supply caiu de 0,09462 (22/08) para 0,00542.
      // Como o supply da AAVE cresce sozinho com juros, em poucas semanas o holding
      // fica ABAIXO do supply e viola o invariante (foi o que acabou de acontecer com
      // o USDS). Quando isso acontecer, rodar a Action `eth-sweep` de novo e subir o
      // holding para supply + total da varredura, a custo zero.
      // ✅ 11/09/2026: a partir de agora o juro do aWETH entra no holding (custo zero,
      // pendente no cgMirror) — o holding acompanha o supply e a margem deixa de encolher.
      healthFactor: null   // ⚡ SEM DIVIDA desde 23/10/2026 -> HF nao existe (o MCP devolve null; `lendingSnapshot` ja trata com `aD > 0`). Borrowing power livre: US$ 5.334,89. Era 7,74 antes da quitacao.  // FALLBACK. MCP 23/10/2026: 7,7447 (colateral 7.272,31, divida 768,26, CF medio 81,82%).  // FALLBACK. MCP 16/10/2026: 7,9245 (print 7,87 as 03:00).  // FALLBACK. print 09/10/2026: (borrowing power disponivel 5.350 + emprestado 766) / 766. Antes: 8,47 (MCP 02/10/2026) — caiu com o ETH, nao com a divida.
    },
    kamino: {
      // Print 07/08/2026: SOL supply 24.46 @ 4.49% / USDS 303.83 @ 4.00% (rewards claimable
      // à parte: USDS $1.59, PYUSD $0.07, KMNO $3.24). Net APY 3.45% · juros ganhos
      // acumulados +$151.56. Supplied $2.11K (SOL $1.81K + USDS $303,83) · Borrowing $822,48.
      // Refresh 21/08/2026: SOL 24.51 @4.61% / USDS 304.29 @2.89% (crescimento por yield
      // composto, sem depósito novo) · borrow 824.58 USDC @6.34% · Net APY 3.46% · juros
      // acumulados (lifetime Kamino) +$155.61 · LTV 32.77% (caiu vs semana passada por causa
      // do rali de SOL, não por repagamento) · Liq.LTV 76.81%.
      // Print 27/08/2026: repay parcial de 63,348964 USDC (wallet) + supply de
      // 0,371763411 SOL. Debt $825,58 -> $762,23 · LTV 27,67% -> 25,22% ·
      // Collateral $2,98K -> $3,02K · Net APY 5,28% -> 5,30% · rewards claimable
      // a parte (nao lancados): USDS $1,59 · PYUSD $0,07 · KMNO $4,95.
      // Print 04/09/2026 (standup): so acrescimo de juros, sem deposito/saque/repay —
      // `principals.kamino` INALTERADO. Net Value $2,07K · Net APY 4,16% · Interest
      // Earned (lifetime) +$161,52 · Supplied $2,83K · Borrowing $763,20.
      // Rewards claimable a parte, NAO lancados: USDS $1,59 · PYUSD $0,07 · KMNO $3,96.
      // Print 05/09/2026: Supplied $2,86K (24,94 SOL @4,67% = $2,55K + 304,69 USDS @3,44%) ·
      // Borrowing $763,32 (763,40 USDC @5,44%) · Net Value $2,09K · Net APY 4,21% ·
      // Interest Earned lifetime +$161,85 · rewards claimable a parte (nao lancados):
      // USDS $1,59 · PYUSD $0,07 · KMNO $4,04.
      // Print 11/09/2026: Supplied $2,86K (24,95 SOL @4,04% + 304,86 USDS @3,31%) ·
      // Borrowing $764,07 (764,14 USDC @5,56%) · Net Value $2,10K · Net APY 3,39% ·
      // Interest Earned lifetime +$163,95 · LTV 26,68% · Liq.LTV 76,60%. So juros, sem
      // deposito/saque/repay -> principals.kamino INALTERADO. Rewards claimable a parte
      // (nao lancados): USDS $1,59 · PYUSD $0,07 · KMNO $4,10.
      supply: { SOL:{ qty:25.09, apy:0.0405 }, USDS:{ qty:0, apy:0 } },   // print 23/10/2026: +0,02 SOL de yield (custo zero) @4,05%.   // print 09/10/2026: +0,02 SOL de yield (custo zero) @4,31%.   // print 02/10/2026 POS-REPAY; USDS 305,46->0 (posicao encerrada)
      borrow: { USDC:{ qty:456.71, apy:0.0606 } },   // print 23/10/2026: juro +0,60 @6,06% (era 8,88%) — cedeu junto com a AAVE.   // print 16/10/2026: juro +0,60 @8,88% (era 5,98%).   // print 09/10/2026: juro +0,53 @5,98%.   // APYs do print final 02/10 (Borrowing 454,98 @5,93% · SOL 5,49%)   // 2o repay de 02/10: -10,09043 USDC, pagos com KMNO (stake + rewards) convertidos   // 767,21->465,07 (02/10): repay de 302,144161 USDC (print)
      ltv: 0.1752, liqLtv: 0.8000   // print 23/10/2026: LTV 17,52% · liq. US$ 22,75 · Interest Earned +$178,91 · Net APY 3,62% · rewards PYUSD 0,07 + KMNO 6,82 (nao lancados).  // print 16/10/2026: LTV 17,14% · liq. US$ 22,74 · Interest Earned +$176,65 · Net APY 3,25% · rewards PYUSD 0,07 + KMNO 6,23 (nao lancados).  //   // print 09/10/2026: Liq.LTV SUBIU 75% -> 80% (parametro do mercado SOL/BTC da Kamino) -> SOL liquida em US$ 22,73. Interest Earned lifetime +$174,58 · Net APY 3,97%. Rewards: KMNO $5,59 + PYUSD $0,07 (nao lancados).
      //   // 02/10/2026, APOS OS DOIS REPAYS. O liqLtv 75,00% e do print pos-1o repay e nao muda com repay (o colateral e SOL puro — o USDS, que puxava a media para cima, saiu). Preco de liquidacao do SOL: US$ 24,24 (era 24,77 antes do 2o repay). LTV derivado com SOL a US$ 117,85; o print do 1o repay dava 15,80% com a divida em 465,07. Interest Earned lifetime +$171,79 · Net APY 5,45%.
    },
    uniswapV3: {
      // ⚡ POOL NOVA — 29/10/2026. O ciclo WETH/USDG (Robinhood) ja esta fechado e
      // registrado em `poolHistory` (3 linhas, 14/07 a 28/08); nada se perde aqui.
      pool:'ETH/USDC v4 (Dynamic · VolatilePairHook)', network:'Ethereum', status:'active',
      capital:743.12, pooled:743.12, totalFees:0, uncollectedFees:0,
      il:0, pnl:0, apr:72.09, daysOpen:0, openDate:'2026-10-29', closeDate:null,
      rangeMin:2190.79, rangeMax:2347.75, poolApr:72.09, feeApr:50.25,
      // ── COMO FOI MONTADA (29/10/2026, Ethereum) ──────────────────────────────
      // 17:12 withdraw 755,119968 USDT da AAVE (tx 0x73ed...1a04) -> approve Velora
      // -> swapExactAmountIn 755,12 USDT por 742,37 USDC (tx 0xe685...a22e) ->
      // approve Permit2 -> multicall Uniswap v4 com 743,12 USDC (tx 0xbe2c...e927).
      //
      // 🔸 Os 743,12 sao 742,37 do swap + os 0,74 USDC que sobraram da quitacao de
      // 23/10 e estavam FORA da contabilidade (1 centavo de arredondamento). Entao
      // a pool nasce com +0,74 de correcao de registro, nao de ganho.
      //
      // ⚠️ O SWAP CUSTOU CARO: 755,119968 USDT valiam US$ 754,28 (o print da AAVE da
      // o USDT a 0,99889) e vieram 742,37 USDC = **-US$ 11,91, 1,58%** em stable->stable,
      // onde o normal e ~0,01-0,05%. E a SEGUNDA vez: em 02/10 a troca de USDS por USDC
      // custou ~1,6% em taxa de protocolo. Nao e slippage de liquidez (o par USDT/USDC
      // e dos mais profundos que existem) — e taxa de roteador/interface. Vale testar
      // Curve ou Uniswap direto no proximo. Gas das 5 txs ~US$ 1,14, nao descontado
      // (mesma regra do gas desde 15/07/2026).
      //
      // ── ESTRATEGIA: pool de COMPRA (inversao da saida gradual) ───────────────
      // Entra 100% USDC e vira ETH conforme o preco CAI dentro do range. Abriu
      // **fora do range por cima** (market 2.348,87 > max 2.347,75), ou seja 0% ETH /
      // 100% USDC: enquanto o ETH nao recuar abaixo de 2.347,75 a posicao nao compra
      // nem gera taxa. Preco medio de compra se percorrer o range inteiro:
      // sqrt(2190,79 x 2347,75) = ~US$ 2.268.
      // ⚠️ MESMA TESE do ciclo de 26/08 na Robinhood, que fechou 0 a 0 porque o ETH
      // nunca voltou para dentro do range (ver `poolHistory`). A diferenca agora: o
      // range comeca 0,05% abaixo do mercado, nao 0,04% acima — fica a um movimento
      // minimo de comecar a trabalhar.
      //
      // APR do print: total 72,09% = 50,25% de taxa (24h) + 21,85% de reward em USDC.
      // `feeApr` guarda so a parte de taxa; `apr`/`poolApr` o total COM reward. Os dois
      // sao do painel da Uniswap (prospectivos, extrapolam as ultimas 24h) — nao e o
      // realizado. Fees earned no print: US$ 0 (recem aberta).
      // Card ESTATICO: sem fetch on-chain para v4 — atualizar por print.
      // ── histórico do ciclo anterior (WETH/USDG, Robinhood) ───────────────────
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
      // ── (g) 24-26/08/2026: DESVIO DE 2 DIAS PARA A BASE E VOLTA ──────────
      //     Sequencia confirmada pelo Lucas (Diario 24/08 + prints Uniswap):
      //       24/08 (seg) — a posicao estava fora do range por cima desde 20/08 e
      //         o preco nao voltou ao range no fim de semana. Ele decidiu remontar
      //         e viu que o APR estava mais alto na BASE, entao desmontou na
      //         Robinhood (~$413,05), fez bridge e montou WETH/USDC 0.3% na Base:
      //         $411,63 = 0 WETH + 411,63 USDC, range $2.208,39-$2.460,24,
      //         market $2.475,07 (ja entrou fora do range por cima, 0,6%).
      //       26/08 (qua) — desmontou a Base recolhendo $412 (dos quais $0,80 de
      //         fees), bridge de volta para a Robinhood chegando $410, e remontou
      //         WETH/USDG 0.01% com RANGE NOVO. Decisao: fica na Robinhood ate
      //         fechar a pool - sem mais bridges.
      //     VEREDITO DO DESVIO (registrar, e a licao que sobra):
      //       fees ganhas na Base .............. +$0,80 em 2 dias
      //       atrito das duas bridges ......... ~-$3,40 ($413,05 -> $411,63 na ida,
      //                                          $412 -> $410 na volta)
      //       resultado liquido ............... ~-$2,60
      //       e o range montado na Base ($2.208,39-$2.460,24) e praticamente
      //       IDENTICO ao que ele remontou de volta na Robinhood
      //       ($2.207,95-$2.464,17) - a viagem inteira terminou no mesmo lugar.
      //     ⚠️ FEE TIER MAIOR != APR REALIZADO MAIOR. O que atraiu foi o 0,3% da
      //       Base contra o 0,01% da Robinhood (30x), mas em WETH/USDC na Base o
      //       tier de 0,3% concorre com muita liquidez e recebe pouco roteamento
      //       de volume. Antes de migrar por APR, olhar volume/TVL do tier
      //       especifico e descontar o custo de bridge de ida E volta.
      //     Lancamento: os dois trechos estao como linhas SEPARADAS no historico
      //     (pools.html POOLS + relatorio.html POOLS_DATA) - Robinhood 07/08-24/08
      //     ($5,28) e Base 24/08-26/08 ($0,80). YTD 2026 de fees: $124,02.
      // ── PRINT Uniswap 26/08/2026 (fonte dos numeros do ciclo atual) ──────
      //     WETH/USDG v3 0,01% · Robinhood Chain · Out of range
      //     Position $410,00 · 0% WETH / 100% USDG (0 WETH + 410,00 USDG)
      //     Fees earned $0 ("you have no earnings yet" = posicao recem-aberta)
      //     Range NOVO: min $2.207,95 / max $2.464,17 · market $2.465,15
      //     ⇒ esta fora do range por CIMA por apenas 0,04% ($0,98). Qualquer
      //       recuo do ETH ja poe a posicao dentro do range e ela volta a
      //       gerar taxa. Enquanto estiver fora: taxa ZERO.
      // ── INVERSAO DA ESTRATEGIA (registrar, muda a leitura do card) ────────
      //     Os ciclos anteriores eram SAIDA GRADUAL ETH->USDG (entrava ~100%
      //     WETH e vendia subindo). Este ciclo entra 100% USDG com o preco
      //     ACIMA do range: e o inverso — ENTRADA GRADUAL USDG->ETH, comprando
      //     ETH conforme o preco cai dentro do range. Bate com a tese do Lucas
      //     (capitulacao ate outubro). Preco medio de compra se percorrer o
      //     range inteiro ≈ √(2207,95 × 2464,17) = $2.332.
      //     ⚠️ Range curto (11,6% de largura, $2.207,95-$2.464,17): se o ETH
      //       cair forte a posicao vira 100% WETH rapido e para de comprar.
      // ── POOL FECHADA ~28/08/2026 — NAO HA POSICAO ABERTA HOJE ────────────
      //     FONTE: Diario DeFi do Notion (pagina "Diario DeFi", secao intitulada
      //     "ETH/USDG 0.1% (ROBINHOOD) FECHADA 0 A 0"), confirmado pelo Lucas em
      //     01/09/2026. Ultimo callout da secao, sem data (a pagina foi editada
      //     pela ultima vez em 28/08/2026):
      //        "Pensei melhor e fechei essa pool sem nenhuma taxa."
      //     Ou seja: o ciclo aberto em 26/08 com $410 (100% USDG, fora do range
      //     por cima) foi encerrado poucos dias depois SEM GERAR TAXA NENHUMA —
      //     o ETH nunca recuou para dentro do range enquanto a posicao existiu.
      //     Resultado do ciclo: $0. `pooled` = 0, `status` = closed.
      //
      //     ⚠️ ONDE O DINHEIRO FOI PARAR (e por que isso NAO e aporte novo):
      //     os ~$410 sairam da pool, viraram USDT e foram depositados na AAVE.
      //     E exatamente o deposito de 406,27 USDT que apareceu no print de
      //     01/09 (410 − ~3,7 de atrito de bridge/swap). Duas conferencias:
      //       · CoinGecko USDT +408,56 no periodo = AAVE +407,98 (1.604,84 ->
      //         2.012,82) + 1,71 de yield. Bate.
      //       · Custo: o ETH que financiou a pool (0,183, deposito de 14/07) foi
      //         retirado de `holdings` em 21/08 mas o custo dele ficou em ETH.
      //         Agora que virou USDT, o custo VIAJA JUNTO: ETH 4.880,53 ->
      //         4.474,26 e USDT 1.772,92 -> 2.179,19. Total investido NAO MUDA
      //         (fica nos 10.642,50 de antes) porque nao entrou dinheiro novo —
      //         foi uma troca de ETH por stable dentro do proprio portfolio.
      //         Validacao: USDT vale 2.196,95 contra custo 2.179,19 = +17,76,
      //         praticamente igual aos 18,90 de EARNINGS declarados pela AAVE.
      //         Uma stable com P&L igual ao proprio yield e o resultado correto;
      //         se o custo tivesse ficado no ETH, o USDT exibiria +$425 de
      //         "lucro" fantasma (o mesmo artefato combatido em 23/06/2026).
      //
      //     ⚠️ LICAO (foi o erro cometido no fechamento de agosto, antes da
      //       correcao): sem print, eu DERIVEI a composicao da pool pela
      //       matematica de v3 e conclui que ela tinha entrado no range e estava
      //       comprando ETH. A matematica estava certa; a PREMISSA (existe uma
      //       posicao aberta) estava errada. Derivar o estado de uma posicao so
      //       vale depois de confirmar que a posicao existe — checar o Diario
      //       DeFi do Notion ANTES, nao depois.
      note:'SEM POOL ATIVA. O ciclo WETH/USDG 0.01% (Robinhood) aberto em 26/08 foi FECHADO ~28/08 sem gerar taxa nenhuma (fonte: Diario DeFi do Notion, secao "FECHADA 0 A 0") — o ETH nunca voltou para dentro do range. Os ~$410 viraram USDT e foram depositados na AAVE (o deposito de 406,27 do print de 01/09). Resultado do ciclo: $0.'
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
  // ── FONTE ON-CHAIN DOS PRINCIPALS DA AAVE (08/09/2026) ────────────────
  // Os principals da AAVE deixaram de ser derivados de print arredondado.
  // Agora vêm do histórico on-chain, via a GraphQL pública da Aave
  // (api.aave.com/graphql, query `activities` — a mesma fonte que o MCP
  // server oficial mcp.aave.com expõe). Reprodução:
  //   activities(request:{ query:{chainIds:[1]}, user:"0x5a9a…f396",
  //     types:[SUPPLY,WITHDRAW,BORROW,REPAY], pageSize:FIFTY })
  // 15 movimentos, 01/04/2026 → 28/08/2026. Somatório:
  //   USDT supply 3.443,900978 − withdraw 1.448,00 = 1.995,900978
  //   WETH supply 2,209740 (1,88 + 0,269740 + 0,06), zero saques
  //   USDC borrow 748,00, zero repay  → confere com o valor que já estava
  //
  // ⚠️ O `activities` só cobre a V4 (começa em 01/04/2026, a migração).
  //   A V3 foi auditada à parte pelos aTokens antigos via Alchemy
  //   (alchemy_getAssetTransfers em aEthWETH 0x4d5F…14E8 e aEthUSDT
  //   0x2387…086a, mint = supply / burn = saque). Resultado: a posição V3
  //   está ZERADA — aWETH entradas 2,03376729 = saídas 2,03376729 e
  //   aUSDT entradas 2.373,534210 vs saídas 2.373,534209 (dust). Tudo
  //   migrou para a V4 em 01–02/04/2026, então nada de V3 falta aqui.
  //
  // CORREÇÃO QUE ISTO TROUXE: o fechamento de agosto registrou os depósitos
  //   como "USDT +406,27" e "WETH +0,0604" (derivados do card, arredondado).
  //   On-chain foram +408,564790 e +0,060000. Os 2,29 a mais de USDT eram
  //   contados como juro — mesma classe do bug de 14/08, em escala menor
  //   (juro do USDT exibido caiu de 19,65 para 17,67, o valor real).
  //
  principals: {
    aave:   {
      WETH: 2.289740,      // ON-CHAIN EXATO: 2,209740 + 0,08 depositados em 18/09/2026 (MCP confere). Antes: 1,88 (01/04) + 0,269740 (05/06) + 0,06 (28/08), zero saques
      USDT:  0,            // ⚡ ZERADO em 29/10/2026: saque TOTAL de 755,119968 para montar a pool ETH/USDC v4 (MCP confirma — o item de USDT sumiu do spoke).   // 24/10/2026: 925,900978 - saque de 200 para as ordens limite de ETH (MCP get_user_activity confirma o unico movimento do dia: WithdrawActivity 200 USDT, 14:41:35 UTC, tx 0xf25c138e...aec00).   // 23/10/2026: 1.695,900978 - saque de 770 para quitar a divida (MCP confere o principal na casa decimal).   // ON-CHAIN EXATO: 1.995,900978 - saque de 300 em 15/09/2026 (MCP confere). Antes: supply 3.443,900978 - saques 1.448,00
      USDC: 0         // ⚡ ZERADO em 23/10/2026: divida quitada (repay de 768,40 USDC). Era 748,00 — borrow inicial (refin. 10/04/2026). Confere: 760,17 − 748 =
                      // 12,17 = exatamente o 'fees paid' do print AAVE.
    },
    kamino: {
      SOL:  23.645990,   // 23,274227 (CSV ate 15/07) + 0,371763411 depositados 27/08/2026
      USDS: 0,           // 300,392689->0 (02/10): USDS inteiro sacado para o repay
      USDC: 378.599493   // 388,689923->378,599493 (02/10, 2o repay): -10,09043 pagos com KMNO convertido. Antes: 690,834084->388,689923 no 1o repay de 302,144161. Antes: 754,183048 (CSV ate 15/07) − 63,348964 repagos 27/08/2026
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
  // ── RECONCILIACAO COMPLETA COM O COINGECKO (22/08/2026) ──────────────────
  // Varredura das 4 carteiras EVM + posicoes em DeFi + AAVE, cruzada token a token
  // com o print do CoinGecko. Ajustes lancados pelo Lucas:
  //   ETH    2,25752      -> 2,23062       (AAVE 2,1629 + carteiras 0,06595 + Yearn V3 0,0018)
  //   EIGEN  153,36298802 -> 131,44388802  (o CoinGecko estava a mais)
  //   XAI    692,86       -> 898,879       (estava STAKED em "unity capital X IF" —
  //                                         por isso nao aparecia na lista de tokens)
  //   POL    218          -> 218,07
  //   USDT   1.487,524    -> 1.789,524     (AAVE 1.604,84 + corretora 185 + carteira 0,269)
  // RDNT ficou de fora de proposito: a diferenca de -12,39 unidades vale 1 CENTAVO e o
  // XAI provou que existe posicao em stake fora da lista. So mexer se aparecer numa varredura.
  //
  // `invested` do USDT = 1.772,92, nao 1.789,52: dos 302 que faltavam, 17,19 sao juros
  // declarados pela propria AAVE (campo EARNINGS) e entram a custo zero; os outros 285,40
  // sao principal que o Lucas depositou e nunca lancou — esses SIM tem custo.
  // Os demais ajustes nao mexem em `invested`: correcao de contagem, nao operacao. O XAI
  // extra entrou a custo zero (recompensa de staking) — confere com o GP do print.
  //
  // ✅ ORIGEM CONFIRMADA (Lucas, 01/09/2026): aporte novo mesmo, USDT parado esperando
  // ponto de entrada para comprar. Nao e dinheiro que ja estava no portfolio.
  // ⚠️ PENDENTE (agora e a unica coisa que falta neste item): como entrou dinheiro de
  // fora, o custo em BRL precisa ser lancado na planilha Custo_BRL (aba Fiscal) — hoje
  // em R$ 36.632,97 e sem esses ~285 USDT. Falta a data e o cambio da conversao.
  //
  // ── CURVA DE PATRIMONIO (mensal, fechamento) — FONTE UNICA ────────────────
  // Promovida para ca em 04/09/2026. Antes existiam DUAS copias: a de
  // portfolio_analytics.html (WEEKLY_UPDATE.wealthCurve) e uma copia manual em
  // index.html (WEALTH_VALUES/INVESTED). A do index ficou TRES MESES atrasada
  // (terminava em 05/26 com $8.872 / aporte $6.261 contra 08/26 $9.295 / $7.610),
  // e como ela alimenta o CAGR e a TIR do hero da landing, a pagina publica exibia
  // numeros errados. As duas paginas leem daqui agora; os literais que sobraram nelas
  // sao so fallback para o caso de este arquivo nao carregar.
  //
  // ⚡ MANUTENCAO: NAO EDITAR A MAO (desde 05/09/2026).
  // `scripts/close-month.js` acrescenta o ponto do mes que fechou, e a Action
  // .github/workflows/close-month.yml roda isso todo dia 1. Definicao unica:
  //   labels   -> 'MM/AA' do mes que fechou
  //   values   -> ultimo snapshot do mes em networth-history.json, patrimonio
  //               BRUTO = holdings x preco (inclui colateral DeFi) + stables + LP,
  //               ANTES da divida
  //   invested -> aporte acumulado anterior + soma de `contributions` daquele mes
  // Para registrar um aporte novo, adicione UMA linha em `contributions` (acima).
  //
  // Historico do bug que motivou a automacao: 07/26 e 08/26 tinham entrado como
  // patrimonio LIQUIDO (depois da divida) enquanto todo o resto da serie e BRUTO —
  // um degrau falso de ~US$ 1.525 que contaminava retorno mensal/anual, TWR, XIRR,
  // drawdown e benchmark. Corrigido pelo script em 05/09/2026 (7031->8623, 9295->11037).
  //
  // Os tres arrays precisam ter o MESMO comprimento: todo o resto (retornos mensais,
  // retorno anual, TWR, XIRR, drawdown, benchmark CDI/IPCA) e derivado daqui.
  wealthCurve: {
    labels:   ['01/22','02/22','03/22','04/22','05/22','06/22','07/22','08/22','09/22','10/22','11/22','12/22','01/23','02/23','03/23','04/23','05/23','06/23','07/23','08/23','09/23','10/23','11/23','12/23','01/24','02/24','03/24','04/24','05/24','06/24','07/24','08/24','09/24','10/24','11/24','12/24','01/25','02/25','03/25','04/25','05/25','06/25','07/25','08/25','09/25','10/25','11/25','12/25','01/26','02/26','03/26','04/26','05/26','06/26','07/26','08/26','09/26'],
    values:   [853,860,1037,1108,1037,544,772,896,742,923,754,777,1119,1224,1388,1542,1570,1667,1780,1624,1639,1922,2226,2605,2959,3604,4636,4524,5471,5112,5955,5226,5170,6020,8153,8634,8570,7907,6760,6263,8069,8386,9424,8365,8545,12312,11610,10857,9511,7376,6371,9206,7392,7651,8623,11037,12055],
    invested: [1061,1276,1276,1681,1771,1810,1886,1904,2198,2274,2367,2367,2431,2480,2499,2567,2658,2721,2721,2762,2802,2842,2870,2977,2977,2977,2977,3056,3056,3098,3098,3195,3310,3592,3677,3952,4127,4527,4598,4948,5121,5121,5121,5121,5121,6098,6098,6108,6451,6639,6639,7190,7456,7606,7756,8162,8162]
  },

  // ── ESPELHO DO COINGECKO (yield de lending a lancar la) ───────────────────
  // O `holdings`/`stables` acima acompanha o SUPPLY dos protocolos: quando a AAVE
  // ou a Kamino paga juros, a qty sobe aqui na hora (a custo zero — juro e renda,
  // nao aporte). O CoinGecko nao acompanha isso sozinho: o Lucas precisa lancar
  // manualmente, como 'transferencia de entrada' com custo 0.
  //
  // Este bloco guarda a qty COMO ESTA NO COINGECKO hoje. A diferenca para o
  // `holdings` e exatamente o que falta lancar la.
  //
  // ⚡ ROTINA COMBINADA COM O LUCAS (05/09/2026): TODO FECHAMENTO DE MES eu passo
  // pra ele a soma do que precisa ser alterado no CoinGecko. O numero sai de
  //     node scripts/yield-to-mirror.js
  // e tambem aparece no card "Yield a lancar no CoinGecko" do dashboard (aba
  // Ativos), que so aparece quando ha algo pendente.
  //
  // MANUTENCAO: quando ele lancar no CoinGecko, atualizar a qty aqui para a nova
  // (igualando o holding) — o pendente zera sozinho. Se um ticker nao estiver
  // listado aqui, assume-se que CoinGecko == holding (nada pendente).
  // Base: print do CoinGecko de 05/09/2026.
  cgMirror: {
    // ✅ LANCADO POR ELE em 05/09/2026 ("Coloquei la no coingecko"): +0,174778 SOL
    // e +4,69 USDS entraram como transferencia de entrada, custo zero. Espelho
    // igualado ao holding -> pendente ZERO e o card do dashboard some sozinho.
    // ✅ ESPELHO EM DIA em 02/10/2026 — pendente ZERO, o card do dashboard some sozinho.
    // Ele lancou tudo em duas rodadas no mesmo dia: primeiro o acumulado de 11-29/09
    // (~US$ 25,89, fim da fase "acumulando" aberta em 11/09) e depois os ~US$ 7,99 do juro
    // de 30/09 em diante + o supply novo da Kamino do print de 02/10. Entrou como
    // transferencia de entrada datada 30/09, custo zero — a data nao entra em nenhuma conta
    // do site (so a qty e o custo) e datar no fechamento mantem o yield de setembro dentro
    // de setembro. A rotina do fechamento de mes continua valendo para o juro que vier.
    // Print do CoinGecko de 02/10/2026 — o que esta LA hoje (= holdings, os 13 conferidos):
    SOL:  25.85735038,   // +0,058135 (30/10/2026): yield da Kamino lancado por ele como entrada a custo zero. Em dia com o holding.  // print CoinGecko 16/10/2026.  // +0,40367293 (08/10): compra na OKX, lancada por ele ("ja coloquei no coingecko").
    USDS: 0,            // 305,46->0 (02/10): Lucas EXCLUIU o USDS do CoinGecko (nao vai mais comprar). Ok assim: o historico do USDS no CoinGecko ja nao tinha custo real (entrou a custo zero no reset de mar/26) e o site nao depende dele.
    ETH:  2.407841,   // +0,002938 (30/10/2026): juro do aWETH lancado por ele a custo zero. Em dia com o holding.   // ✅ ELE CORRIGIU (print 30/10/2026): o saldo de la agora e 2,361583374 + 0,04332, a qty certa da ordem limite — os 0,00002 que estavam pendentes sumiram.   // CORRIGIDO pelo print do portfolio (24/10/2026): ele lancou 0,0433 mesmo, nao 0,04332 — o saldo de la e 2,361583374 + 0,0433. Os 0,00002 ETH (~US$ 0,05) viram pendencia e devem sair junto com o proximo yield (lancar 0,002428 em vez de 0,002408), ou ele edita a transacao para 0,04332.   // +0,04332 (24/10/2026): ele lancou a compra da ordem limite (a) no CoinGecko, com a qty corrigida para 0,04332. NAO igualado ao holding de proposito — o yield pendente (+0,002408 de juro do aWETH) continua pendente e tem que seguir aparecendo.  // print 16/10/2026: ✅ os +0,0031 ETH do RDNT foram lancados. Falta so o juro do aWETH (09/10 em diante).      // ⚠️ PENDENTE (08/10): NAO inclui os +0,0031 ETH que vieram da venda do RDNT — ele nao confirmou se lancou. ⚡ COMO LANCAR: como TRANSFERENCIA DE ENTRADA a custo ZERO, NAO como compra de US$ 7,91. O RDNT era airdrop (custo 0) e foi EXCLUIDO do CoinGecko, entao o custo total de la nao caiu quando a posicao saiu; lancar o ETH como compra faria o custo do CoinGecko subir US$ 7,91 e divergir do site, que (certo) manteve o invested do ETH inalterado. Depois de lancar, subir para 2.361583 e o pendente zera. (No CoinGecko o ETH aparece como 2,338483374; o site arredonda em 6 casas, US$ 0,001 de diferenca.)
    USDT: 100.219828,   // +0,013066 (30/10/2026): lancado por ele a custo zero (o 1,3 centavo do aporte nao lancado + arredondamento). Em dia com o holding.   // ⚡ -754,69 (30/10/2026): ele deu a saida dos USDT que viraram a pool ETH/USDC v4. Usou o numero redondo que o `yield-to-mirror` mostrava (754,693774 -> 754,69), que ja era o liquido da saida de 755,119968 com o juro de 0,427842 dentro. Sobra +0,013066 contra o holding = os +0,01684 do aporte de hoje (18,20684 do aporte - 18,19 da compra de BTC), que ele nao lancou no USDT, menos os 0,003774 do arredondamento. Centavo e meio — nao vale perseguir, mas fica anotado para nao virar misterio no proximo review.   // print do portfolio (24/10/2026): o saldo de la ja absorveu o yield do aUSDT — 851,32676194 + 3,57. (Mesmo saldo daria se ele tivesse lancado a saida da compra de BTC como 45,69, o numero liquido que o yield-to-mirror mostrava, em vez de 49,26 + 3,57 de entrada: 49,26 - 45,69 = 3,57. Em SALDO e identico; so o custo no CoinGecko fica um pouco diferente, e o custo canonico e o do data.js.) USDT praticamente em dia: sobra -0,00164794, arredondamento sub-centavo.   // -49,26 (24/10/2026): saida da compra de BTC, lancada por ele. Espelho em dia — o delta para o holding volta a ser so o juro do aUSDT (+3,568352).   // -100 (24/10/2026): saida dos 100 USDT que viraram ETH na ordem limite (a), lancada por ele. Falta lancar a saida dos 49,26 da compra de BTC do mesmo dia — ate la o espelho fica ACIMA do holding e o yield-to-mirror acusa negativo.  // -770 (23/10/2026): ele deu a SAIDA dos 770 USDT que quitaram a divida da AAVE. Nao era yield, era ativo saindo do portfolio. O delta que sobra para o holding (3,50) volta a ser so o juro do aUSDT, pendente normal.  // print 16/10/2026 (a sobra de 0,00463 do aporte de 09/10 nao foi lancada — irrelevante).  // +0,00463 (09/10): a sobra do aporte semanal de R$ 50 depois da compra de BTC; ele confirmou ter lancado o aporte. O que falta espelhar no USDT e so o juro do aUSDT.  // -81,63 (08/10): as compras de BTC e SOL na OKX.  // +79,037943 (05/10): o aporte de R$ 400. ✅ CONFIRMADO pelo Lucas: ele lancou o LIQUIDO no CoinGecko, igual ao holding — espelho em dia, sem diferenca de taxa.
    BTC:  0.00735063,   // 🔸 FICA ASSIM por decisao dele (30/10/2026): o espelho segue 0,00000309 ACIMA do holding porque o CoinGecko conta a qty BRUTA das compras e o site a LIQUIDA. E a soma das taxas, nao e yield — aparece como negativo no yield-to-mirror e NAO deve ser lancado nunca.   // +0,00023571 (30/10/2026): compra do aporte de sexta, lancada por ele (qty BRUTA, como sempre — dai o espelho ficar 0,00000309 acima do holding, que e a soma das taxas).   // +0,00061885 (24/10/2026): compra na OKX lancada por ele. Ele lanca a qty BRUTA, o site a LIQUIDA (0,00061824) — por isso o espelho fica 0,00000286 acima do holding. E a soma das taxas das compras, diferenca conhecida e aceita desde 02/10; vai aparecer como negativo no yield-to-mirror e NAO deve ser lancada.  // print 23/10/2026 (fato do CoinGecko). ⚠️ 0,00024016 A MAIS que o site — nao e so taxa. O print do saldo da OKX mostra 0,00647885, tambem ~0,00022 acima do site. Conta: CoinGecko 16/10 0,00601623 + 0,0002417 (bruto da compra de hoje) = 0,00625793, faltam 0,00023814 (~US$ 19,4) = UMA COMPRA NAO LANCADA no site, provavelmente o aporte da sexta 16/10 feito DEPOIS do review daquele dia (o caderno registrou 'ainda nao feito'). NAO inventei o lancamento: falta o print da ordem (R$, cambio, preco, taxa). Ate la o holding fica em 0,00625591 e o patrimonio SUBESTIMADO em ~US$ 19.  // print 16/10/2026: 0,00000106 A MAIS que o site = taxas das 3 compras de 07-09/10 (CoinGecko lancou bruto, site liquido). Diferenca explicada, ~US$ 0,09 — nao e yield.
    RDNT: 0,            // 7.278,07 -> 0 (08/10): ele EXCLUIU o token do CoinGecko depois de vender tudo, mesmo
    //                     tratamento que deu ao USDS em 02/10. Espelho e holding batem em zero.
    // BTC, ADA, EIGEN, POL, ZK, XAI, ZETA, SCR: iguais ao holding, nada pendente
    // (o BTC ja inclui a compra de 08/10, que ele confirmou ter lancado).
  },

  // ── APORTES EXTERNOS (dinheiro que entrou DE FORA: fiat -> cripto/stable) ──
  // SO isto conta como aporte na curva de patrimonio. Yield, juros, airdrop e
  // rotacao interna (vender X para comprar Y, fechar pool) NAO entram — mexem em
  // `invested` dos holdings, nunca aqui.
  //
  // ⚡ E AQUI QUE VOCE REGISTRA UM APORTE NOVO. Uma linha, e pronto:
  // patrimonio, ROI de destaque, TWR, CAGR, XIRR, benchmark CDI/IPCA, drawdown,
  // grafico de DCA e o hero da landing se ajustam sozinhos no proximo fechamento.
  //
  // A serie historica (wealthCurve.invested) ja embute tudo ate 08/2026; esta
  // lista cobre 09/2026 em diante. `scripts/close-month.js` soma os aportes do
  // mes que fechou e acrescenta o ponto novo.
  contributions: [
    { date:'2026-10-30', usd:18.21, note:'aporte DCA SEMANAL (sexta, regua cumprida) — R$ 100,00 convertidos em USDT na OKX @ 5,4924 (par USDT/BRL, 14:19:14), taxa ZERO, 18,20684 USDT recebidos. FIAT -> CRIPTO = dinheiro de fora, aporte de verdade. Virou 0,00023548 BTC liquido 7 minutos depois (14:26:01, preco 77.244), mas essa compra e ROTACAO: o aporte ja foi contado aqui. ⚠️ CAMBIO: 5,4924 contra 5,0822 em 23/10 — o real caiu 8,1% na semana, entao os mesmos R$ 100 renderam US$ 18,21 em vez de 19,68. A OKX mostra o lado BRL como US$ 18,41 (comercial ~5,432): ~1,2% de spread, melhor que os 2,9% de 16/10. Tambem lancado em ferramentas.html -> FISCAL_ENTRADAS (BRL).' },
    { date:'2026-10-16', usd: 19.40, note:'aporte DCA SEMANAL — R$ 100,00 convertidos em USDT na OKX @ 5,1555 (par USDT/BRL, 16:32:30), taxa ZERO, 19,39657 USDT recebidos. Virou 0,00023814 BTC dois minutos depois (16:34:29, preco 81.450) — rotacao, ja contado aqui. ⚠️ LANCADO COM ATRASO, em 23/10: o review de 16/10 rodou ANTES desta operacao e o caderno registrou "aporte ainda nao feito"; a divergencia so apareceu no review seguinte, pelo BTC do CoinGecko. LICAO: o review de sexta pode sair antes do aporte — conferir o extrato da OKX no review seguinte, nao so o print do dia. OBS: a OKX mostra o lado BRL desta conversao como US$ 19,97 (cambio comercial ~5,0075) contra os 19,39657 USDT entregues @ 5,1555 — ~2,9% de spread embutido, mesmo com "taxa zero". O aporte entra pelo USDT recebido, que e a medida do site.' },
    { date:'2026-10-23', usd: 19.68, note:'aporte DCA SEMANAL — R$ 100,00 convertidos em USDT na OKX @ 5,0822 (par USDT/BRL, 16:06:21), taxa ZERO, 19,67667291 USDT recebidos. FIAT -> CRIPTO = dinheiro de fora, aporte de verdade. Virou 0,0002417 BTC 44 segundos depois (16:07:05, preco 81.409,30), mas essa compra e rotacao: o aporte ja foi contado aqui. Dobro da regua combinada (R$ 50) — o "podendo ser mais ou menos" e dele, so a sexta nao pode passar em branco. A sexta anterior (16/10) passou em branco. Tambem lancado em ferramentas.html -> FISCAL_ENTRADAS (BRL), junto com o de 09/10 que faltava la.' },
    { date:'2026-10-09', usd:  9.86, note:'aporte DCA SEMANAL (o 1o da regra nova) — R$ 50,00 convertidos em USDT na OKX @ 5,0686 (par USDT/BRL, 13:49:47), taxa ZERO, 9,86463 USDT recebidos. FIAT -> CRIPTO = dinheiro de fora, aporte de verdade. Virou 0,00011905 BTC 4 minutos depois (13:53), mas essa compra e rotacao: o aporte ja foi contado aqui. ⚡ REGRA NOVA combinada neste dia: aportar toda SEXTA-FEIRA, ~R$ 50 — CONFIRMADO por ele que sao 50 REAIS, nao dolares ("e 50 reais mesmo, pode cobrar assim"). O valor pode variar na semana; o que nao pode e a sexta passar em branco. Ver a rotina 2 no CLAUDE.md — ele pediu para ser cobrado.' },
    { date:'2026-10-05', usd: 79.12, note:'aporte DCA — R$ 400,00 convertidos em USDT na OKX @ 5,0558 (par USDT/BRL, ordem 398...010). FIAT -> CRIPTO = dinheiro de FORA, por isso entra aqui. Tambem lancado em ferramentas.html -> FISCAL_ENTRADAS (BRL).' },
    // { date:'2026-09-15', usd: 250, note:'DCA mensal SOL' },
    //
    // RECEBIDOS EM CRIPTO (nao passaram por fiat/corretora). Sao entradas de FORA
    // do portfolio: nao foram gerados pela operacao DeFi, entao nao podem contar
    // como performance. Decisao do Lucas em 09/09/2026 — registrar como
    // contribuicao, com a nota preservando que a origem foi trabalho, nao DCA.
    // ⚠️ Datas anteriores a 09/2026: `close-month.js` so aplica `contributions` a
    //    meses NOVOS (ver linha 114 do script — `invested` de mes existente e
    //    manual). Por isso o efeito destas ja foi somado A MAO em
    //    wealthCurve.invested: +221 de 01/26 em diante (os dois de janeiro),
    //    +285 de 04/26 em diante e +46 em 08/26.
    //    NAO somar de novo. Estao aqui para rastreabilidade e para o IR.
    // VERIFICACAO DOS DOIS DE JANEIRO (09/09/2026): o print 'USDT COINGECKO.png'
    //    mostra o historico COMPLETO do USDT (5 transacoes) e NAO tem nada de
    //    janeiro — a posicao no CoinGecko so comeca em 14/03/2026, com uma
    //    'transferencia de entrada' de 1.652,11 a CUSTO ZERO. Esse valor e o saldo
    //    do aUSDT da AAVE V3 (1.650,57 no fim de fev + 1,54 de juros), entao os dois
    //    pagamentos ESTAO ali dentro em quantidade — mas entraram sem custo e sem
    //    subir o capital aportado. Caminho provado pelo transactions_aave.csv:
    //    22/01 Supply 75,176145 USDT direto; 16/01 Supply 145,214452 USDe, sacado em
    //    20/01 e convertido, virando parte do Supply de 1.649,538907 USDT.
    { date:'2026-01-16', usd: 145.62, note:'recebido — pagamento de trabalho em USDT (nao DCA); de 0x0a91…09a0, virou 145,21 USDe e foi pro supply da AAVE V3 no mesmo dia' },
    { date:'2026-01-22', usd:  75.18, note:'recebido — pagamento de trabalho em USDT (nao DCA); de 0x0a91…09a0, supply direto na AAVE V3 no mesmo dia' },
    { date:'2026-04-24', usd: 285.40, note:'recebido — pagamento de trabalho em USDT (nao DCA); de 0x0a91…09a0 via carteira 0x8311, foi direto pro supply da AAVE no mesmo dia' },
    { date:'2026-08-27', usd:  46.10, note:'recebido — pagamento externo em USDC (nao DCA); entrou direto para abater divida na Kamino' },
  ],

  // ── ACUMULACAO DE TOKENS (ETH/SOL ganhos, nao comprados) ────────────────────
  // Desde 11/09/2026 o total e MEDIDO, nao estimado — lendingSnapshot() (no fim deste
  // arquivo) soma:
  //   · poolsETH / poolsSOL — fees de pool recebidas em ETH/SOL (Diario DeFi). Historico
  //     FECHADO: so muda se uma pool nova pagar fee em ETH/SOL que fique no holding.
  //   · ethLendingV3 — juro do WETH na AAVE V3 (abr/25–mar/26), ESTIMADO e congelado:
  //     ele virou principal na migracao para a V4 (01/04/2026), nao da para isolar on-chain.
  //   · juro retido AO VIVO = supply − principals (AAVE V4 WETH e Kamino SOL). O principal
  //     da Kamino vem do CSV da obrigacao INTEIRA (K1–K4), entao supply − principal = juro
  //     da vida inteira em SOL, inclusive o que foi sacado em 2025. Confere com o
  //     'Interest Earned' da Kamino (~$164 ≈ 1,30 SOL x preco medio + 4,5 USDS).
  // `history` = serie mensal ESTIMADA do Diario (out/24–abr/26), congelada. De jul/26 em
  // diante os pontos saem do networth-history.json (campo defi.accEth/accSol do snapshot
  // diario) — NAO editar a mao. Mai–jun/26 ficam sem ponto: nao ha principal confiavel
  // da Kamino nessas datas (o CSV da pasta vai so ate fev/26).
  tokenAccumulation: {
    poolsETH: 0.0700, poolsSOL: 2.070, ethLendingV3: 0.0158,
    history: {
      labels: ['Out/24','Nov/24','Dez/24','Jan/25','Fev/25','Mar/25','Abr/25','Mai/25','Jun/25','Jul/25','Ago/25','Set/25','Out/25','Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26'],
      eth:    [0.011,0.023,0.029,0.032,0.034,0.035,0.038,0.040,0.042,0.045,0.048,0.053,0.061,0.067,0.072,0.075,0.080,0.085,0.088],
      sol:    [0.000,0.000,0.000,0.514,1.182,1.655,1.727,1.768,1.809,1.851,1.892,1.933,2.056,2.179,2.334,2.426,2.508,2.560,2.600]
    }
  },

  // ── HISTÓRICO DE POOLS — FONTE ÚNICA (movido de pools.html em 15/09/2026) ──
  // Antes havia a lista POOLS em pools.html (32 pools) e outra, à mão, em relatorio.html
  // (POOLS_DATA, 17 linhas agregadas) — divergiam: o PDF somava fees $2.369 e resultado −$881
  // contra $2.466 / −$794 reais, e dizia "27 pools". As duas páginas leem daqui agora.
  // ⚡ FECHOU UMA POOL? Acrescente UMA entrada aqui; pools.html e o relatório acompanham sozinhos.
  //    Invariante (tests/data.test.js): result = fees − il. Datas em DD/MM/AAAA.
  poolHistory: [
    // ⚡ POOL ATIVA — a entrada aqui e o que faz o contador de pools ativas, o P&L YTD e os
    // graficos de pools.html a enxergarem (`defi.uniswapV3` sozinho nao entra nesses calculos).
    { pair:'ETH/USDC v4', net:'Ethereum', open:'29/10/2026', close:null, days:0,
      capital:743.12, fees:0, il:0, result:0, status:'active', lvr:0, fcr:0, invGrowth:0,
      obs:'Pool de COMPRA (inversao da saida gradual): entra 100% USDC e vira ETH conforme o preco CAI dentro do range 2.190,79-2.347,75. Montada com 755,119968 USDT sacados da AAVE (todo o supply, tx 0x73ed...1a04) -> 742,37 USDC na Velora -> 743,12 USDC na pool (os 0,75 a mais sao a sobra de USDC da quitacao de 23/10, que estava fora da contabilidade). Abriu FORA DO RANGE por cima (market 2.348,87 > max 2.347,75): 0% ETH / 100% USDC, sem taxa ate o ETH recuar. APR do painel: 72,09% total = 50,25% de taxa (24h) + 21,85% de reward em USDC. O swap USDT->USDC custou 1,58% (US$ 11,91) — caro para stable->stable, segunda vez seguida; ver nota em defi.uniswapV3. Mesma tese do ciclo de 26/08 que fechou 0 a 0, mas agora o range comeca logo abaixo do mercado em vez de acima.' },

    // ── 2026 ──
    { pair:'ETH/USDC 0.3%',  net:'Base',     open:'30/01/2026', close:'24/02/2026', days:25,  capital:453,  fees:16,   il:0,   result:16,   status:'closed', lvr:0,    fcr:52.8,  invGrowth:3.5  },
    { pair:'SOL/USDT 0.01%', net:'Solana',   open:'29/01/2026', close:'07/02/2026', days:9,   capital:25,   fees:1,    il:0,   result:1,    status:'closed', lvr:0,    fcr:161.1, invGrowth:4.0  },
    // ── 2025 ──
    { pair:'ETH/USDT 0.05%', net:'Arbitrum', open:'17/10/2025', close:'30/01/2026', days:105, capital:277,  fees:34,   il:0,   result:34,   status:'closed', lvr:0,    fcr:42.7,  invGrowth:12.3 },
    { pair:'SOL/USDC 0.04%', net:'Solana',   open:'19/10/2025', close:'20/01/2026', days:93,  capital:660,  fees:23,   il:0,   result:23,   status:'closed', lvr:0,    fcr:13.7,  invGrowth:3.5  },
    { pair:'XAI/WETH 0.3%',  net:'Arbitrum', open:'01/07/2025', close:'29/08/2025', days:60,  capital:35,   fees:7,    il:21,  result:-14,  status:'closed', lvr:3.0,  fcr:121.9, invGrowth:-40  },
    { pair:'SOL/GRIFT 2%',   net:'Solana',   open:'15/02/2025', close:'05/05/2025', days:80,  capital:780,  fees:1389, il:2899, result:-1510,status:'closed', lvr:0.36, fcr:815.7, invGrowth:-193, obs:'Token GRIFT foi a zero. Início: 4 SOL (~$3k). Taxas $1389 mas IL -$2900. Erro: acumulou mais que deveria, ficou preso em tendência baixa.' },
    { pair:'XAI/WETH 0.3%', net:'Ethereum', open:'10/01/2025', close:'28/01/2025', days:18,  capital:30,   fees:7,    il:10,  result:-3,   status:'closed', lvr:1.4,  fcr:473.1, invGrowth:-10, obs:'0.009 ETH entrada. Bom APR após queda. 24/01 saiu do range, remontagem com taxas XAI no compound. Token caiu demais, desmontada.' },
    // ── 2024 ──
    { pair:'MSTR/ETH 1%',    net:'Ethereum', open:'22/11/2024', close:'04/12/2024', days:13,  capital:260,  fees:36,   il:0,   result:36,   status:'closed', lvr:0,    fcr:390.1, invGrowth:13.8, obs:'Segunda posição MSTR. Resultado final +$36 em 13 dias.' },
    { pair:'MSTR/ETH 1%',    net:'Ethereum', open:'24/10/2024', close:'22/11/2024', days:29,  capital:395,  fees:36,   il:0,   result:36,   status:'closed', lvr:0,    fcr:115.1, invGrowth:9.1,  obs:'0.152 ETH + 3.77 MSTR entrada. APR 1100%→800%. Saiu do range em 6 dias. Remontagem 30/10. Fora no FDS, remontagem 22/11.' },
    { pair:'ARB/USDT 0.3%',  net:'Arbitrum', open:'01/10/2024', close:'18/11/2024', days:48,  capital:628,  fees:73,   il:0,   result:73,   status:'closed', lvr:0,    fcr:88.0,  invGrowth:11.6, obs:'Final: 307 USDT + 177 ARB. Taxas: $73 bruto. Gas $5.74. ARB/USDC tinha APR mais alto, migrou.' },
    { pair:'PEANUT/ETH 1%',  net:'Ethereum', open:'10/11/2024', close:'20/11/2024', days:10,  capital:300,  fees:0,    il:243, result:-243, status:'closed', lvr:0,    fcr:0,     invGrowth:-81,  obs:'Projeto SCAM. Altas taxas de gas: $22 montagem + $72 desmontagem. Ficou doente após montar, não conseguiu acompanhar.' },
    { pair:'PENG/ETH 1%',    net:'Ethereum', open:'08/06/2024', close:'20/07/2024', days:42,  capital:260,  fees:0,    il:72,  result:-72,  status:'closed', lvr:0,    fcr:0,     invGrowth:-27,  obs:'Token PENG caiu demais. Pool já em lucro mas mercado reverteu. IL consumiu resultado.' },
    { pair:'XAI/ETH 0.3%',   net:'Ethereum', open:'17/06/2024', close:'30/07/2024', days:43,  capital:100,  fees:3,    il:0,   result:3,    status:'closed', lvr:0,    fcr:25.4,  invGrowth:3,    obs:'Mercado caindo muito, remontou para capitalizar taxas. IL em XAI, continuou remontando. Saiu 12% pra baixo 30/06.' },
    { pair:'RDNT/ETH 0.3%',  net:'Arbitrum', open:'11/06/2024', close:'21/07/2024', days:40,  capital:1200, fees:42,   il:0,   result:42,   status:'closed', lvr:0,    fcr:32.0,  invGrowth:3.5,  obs:'Final: 7038.01 RDNT + 0.0016 ETH. Objetivo 7000 RDNT cumprido. 21/07 fechada após mercado cair.' },
    { pair:'RDNT/ETH 0.3%',  net:'Arbitrum', open:'18/05/2024', close:'11/06/2024', days:24,  capital:1500, fees:55,   il:0,   result:55,   status:'closed', lvr:0,    fcr:55.9,  invGrowth:3.7,  obs:'Final: 6952.68 RDNT + 0.0074 ETH. Taxas: 137.27 RDNT + 0.0074 ETH. Saiu +8% do range, remontagem.' },
    { pair:'PENG/SOL 2%',    net:'Solana',   open:'13/03/2024', close:'02/04/2024', days:20,  capital:50,   fees:3,    il:8,   result:-5,   status:'closed', lvr:2.7,  fcr:109.5, invGrowth:-10,  obs:'Token PENG (Solana) caiu 24%. $20 de taxas em 2 dias. Range 174% pra cima. Só caindo depois, fechada.' },
    { pair:'RDNT/ETH 0.3%',  net:'Arbitrum', open:'06/02/2024', close:'01/03/2024', days:23,  capital:2035, fees:85,   il:0,   result:85,   status:'closed', lvr:0,    fcr:66.4,  invGrowth:4.2,  obs:'$85.25 de taxas (+3.48% vs hold). Compound: 114.23 RDNT + 0.0133 ETH. Saiu do range 5%, remontagem 06/03.' },
    { pair:'ARB/USDT 0.3%',  net:'Arbitrum', open:'15/12/2023', close:'28/02/2024', days:75,  capital:628,  fees:22,   il:0,   result:22,   status:'closed', lvr:0,    fcr:17.1,  invGrowth:3.5,  obs:'Final: 307.49 USDT + 177.90 ARB. Taxas: 36.36 USDT + 12.89 ARB. Gas $5.74. APR 300%+.' },
    { pair:'RDNT/ETH 0.3%',  net:'Arbitrum', open:'05/01/2024', close:'05/02/2024', days:31,  capital:2035, fees:30,   il:0,   result:30,   status:'closed', lvr:0,    fcr:17.4,  invGrowth:1.5,  obs:'6313 RDNT entrada (~$2035). Aprovação ETF BTC spot. Saiu do range após 11 dias. Dias normais $10-14 de taxas.' },
    // ── 2023 ──
    { pair:'RDNT/ETH 0.3%',  net:'Arbitrum', open:'19/06/2023', close:'27/06/2023', days:8,   capital:957,  fees:90,   il:0,   result:90,   status:'closed', lvr:0,    fcr:163.3, invGrowth:9.4,  obs:'Primeira pool RDNT. Mono ativo. Grandes taxas em período curto. APR excepcional.' },
    { pair:'ARB/USDC 0.05%', net:'Arbitrum', open:'05/07/2023', close:'02/01/2024', days:181, capital:884,  fees:155,  il:0,   result:155,  status:'closed', lvr:0,    fcr:35.2,  invGrowth:17.5, obs:'25 dias iniciais: +11.55 ARB + 13.88 USDC = $27.51. Ampliada com 157 ARB + 237 USDC. Total fees $155. ROI ~20%.' },
    { pair:'MATIC/USDC 0.05%',net:'Polygon', open:'05/07/2023', close:'03/10/2023', days:90,  capital:67,   fees:5,    il:0,   result:5,    status:'closed', lvr:0,    fcr:30.3,  invGrowth:7.5,  obs:'MATIC 70.42 + USDC $19.91. Range 0.6579~0.700. APY 50-60%/mês. Saiu range +1.98 MATIC + 0.95 USDC. Mudou estratégia em outubro.' },
    { pair:'ARB/USDC 0.05%', net:'Arbitrum', open:'21/07/2023', close:'26/07/2023', days:5,   capital:900,  fees:180,  il:0,   result:180,  status:'closed', lvr:0,    fcr:1460,  invGrowth:20,   obs:'Melhor FCR de todas as pools. 5 dias altíssimo volume ARB. Saiu do range em FOMO.' },
    { pair:'ETH/USDC 0.05%', net:'ZkSync',   open:'21/08/2023', close:'20/10/2023', days:60,  capital:159,  fees:12,   il:0,   result:12,   status:'closed', lvr:0,    fcr:46.0,  invGrowth:7.5,  obs:'APY 700%→1200%. 0.014 ETH + $33.58 USDC inicial, ampliado para $159 após $1 em 2 dias. Encerrada 20/10.' },
    { pair:'ETH/USDC 0.05%', net:'Arbitrum', open:'01/08/2023', close:'26/03/2024', days:209, capital:1014, fees:22,   il:0,   result:22,   status:'closed', lvr:0,    fcr:3.8,   invGrowth:2.2,  obs:'Pool longa com pouco volume. ETH deu grande valorização, pool deslizou em ranges. Final: 0.148 ETH + 30.95 USDC.' },
    { pair:'RDNT/ETH 0.3%',  net:'Arbitrum', open:'06/12/2023', close:'27/12/2023', days:21,  capital:884,  fees:90,   il:0,   result:90,   status:'closed', lvr:0,    fcr:177.5, invGrowth:10.2, obs:'3345.90 RDNT entrada ($883.69). Mono ativo RDNT. 08/12: +48 RDNT + 0.0058 WETH. Mercado disparou 11/12, saiu do range. Compound 273.52 RDNT.' },
    // ── ATIVA ──
    { pair:'WETH/USDC 0.3%', net:'Base', open:'24/02/2026', close:'03/06/2026', days:99,  capital:365, fees:22.28, il:6.55, result:15.73, status:'closed', lvr:0,   fcr:30.9,  invGrowth:-0.57, obs:'Saiu do range em 03/06 com preço $1.821,67 < min $1.855,72 (100% WETH). Coletadas taxas e encerrada. Fee APR 32% realizado. il = fees − result (Revert 03/06).' },
    // ── fechada 14/07/2026 — remontada na Robinhood ──
    { pair:'WETH/USDC 0.3%', net:'Base', open:'03/06/2026', close:'14/07/2026', days:41, capital:329, fees:8.62, il:0, result:8.62, status:'closed', lvr:0, fcr:23.3, invGrowth:0, obs:'Desmontada 14/07/2026: remove liquidity → 0.1717 ETH + 47.22 USDC; USDC trocado por 0.0255 ETH (Uniswap V4); ~0.197 ETH bridgeado (Across V2) p/ a Robinhood Chain e remontado lá. Entrou 100% WETH na queda, acumulou ETH. Result = fees (valorização do ETH pertence ao holding, não à pool); fees ≈ última leitura uncollected.' },
    // ── fechada 07/08/2026 — reaberta na mesma pool (tentativa de migrar p/ v4 falhou) ──
    { pair:'WETH/USDG 0.01%', net:'Robinhood', open:'14/07/2026', close:'07/08/2026', days:24, capital:343, fees:13.04, il:0, result:13.04, status:'closed', lvr:0, fcr:37.6, invGrowth:0, obs:'Remontagem na Robinhood Chain (bridge Across V2 da Base, entrada 0.183 ETH ≈ $340). Fechada 07/08/2026: pooled $349,15 + fees $13,04 = ~$362,19 realizado. Lucas tentou migrar p/ outra pool v4, não conseguiu abrir, e reabriu a mesma pool v3. Result = fees (valorização do ETH pertence ao holding, não à pool).' },
    // ── ATIVA ──
    { pair:'WETH/USDG 0.01%', net:'Robinhood', open:'07/08/2026', close:'24/08/2026', days:17, capital:388.06, fees:5.28, il:0, result:5.28, status:'closed', lvr:0, fcr:29.2, invGrowth:0, obs:'Reaberta 07/08/2026 na mesma pool v3 WETH/USDG (Robinhood), range $1.852,38-$2.166,83, com o proveniente do ciclo anterior (entrou 0,150 WETH + 76,55 USDG = $364,28). 20/08: taxas COLETADAS ($5,28, swap 0,0023 ETH -> 5,28 USDG) e reaportadas junto com $18,50 da venda de ETH de fee antiga = +$23,78 mono-ativo (capital 364,28 -> 388,06). Print Uniswap 20/08: $413,05 = 0 WETH + 413,05 USDG, fora do range por cima (ETH ~$2.283 > max $2.166,83) -> saida gradual ETH->USDG COMPLETA, preco medio de venda ~$2.003. ENCERRADA 24/08 (segunda): o preco nao voltou ao range no fim de semana, o Lucas decidiu remontar e viu APR maior na BASE, entao desmontou aqui e fez bridge para a Base (ver linha seguinte). Saiu ~$413,05 e chegou $411,63 na Base (~$1,4 de bridge).' },
    { pair:'WETH/USDC 0.3%', net:'Base', open:'24/08/2026', close:'26/08/2026', days:2, capital:411.63, fees:0.80, il:0, result:0.80, status:'closed', lvr:0, fcr:35.5, invGrowth:0, obs:'Desvio de 2 dias para a Base atras de APR maior (fee tier 0,3% contra 0,01% da Robinhood). Print Uniswap 24/08: Position $411,63 = 0 WETH + 411,63 USDC (100% stable), range $2.208,39-$2.460,24, market $2.475,07 - ja entrou FORA do range por cima (0,6%), esperando o ETH cair para dentro e comprar. Desmontada 26/08 recolhendo $412 (dos quais $0,80 de fees) e o valor voltou por bridge para a Robinhood com $410. VEREDITO: o APR maior nao se materializou - $0,80 de fees em 2 dias contra ~$3,4 de atrito nas duas travessias de bridge = trecho LIQUIDO NEGATIVO (~-$2,6), e o range montado na Base ($2.208-$2.460) e praticamente identico ao que ele remontou de volta na Robinhood ($2.208-$2.464). Licao: fee tier maior nao significa APR realizado maior - em WETH/USDC na Base o 0,3% concorre com muita liquidez e recebe menos roteamento de volume.' },
    { pair:'WETH/USDG 0.01%', net:'Robinhood', open:'26/08/2026', close:'28/08/2026', days:2, capital:410, fees:0, il:0, result:0, status:'closed', lvr:0, fcr:0, invGrowth:0, obs:'FECHADA SEM GERAR TAXA NENHUMA. Ciclo aberto 26/08 com os $410 que voltaram da Base, range NOVO $2.207,95-$2.464,17, 100% USDG e ja fora do range por cima (market $2.465,15, 0,04% acima do teto). A ideia era a INVERSAO da estrategia — entrada gradual USDG->ETH, comprando na descida (tese de capitulacao ate outubro) — mas o ETH nunca recuou para dentro do range enquanto a posicao existiu. Fonte do encerramento: Diario DeFi do Notion, secao \"ETH/USDG 0.1% (ROBINHOOD) FECHADA 0 A 0\", ultimo callout: \"Pensei melhor e fechei essa pool sem nenhuma taxa.\" (sem data no callout; a pagina foi editada pela ultima vez em 28/08/2026, dai a data de fechamento). Os ~$410 viraram USDT e foram depositados na AAVE — e o deposito de 406,27 USDT que aparece no print de 01/09. Resultado do ciclo: $0. NAO HA POOL ATIVA desde entao.' }
  ],

  // ── Agregados DERIVADOS — NAO editar a mao ────────────────────────────────
  // Os valores abaixo sao recalculados no fim deste arquivo a partir das partes
  // (stables[] e defi.*.borrow). Ficam escritos so como fallback/documentacao.
  // Antes eram numeros digitados ao lado das partes — duas fontes para a mesma
  // verdade, entao bastava esquecer um para o site mostrar dado divergente.
  debt:   { aave:763.05, kamino:764.14, total:1527.19 },
  stablesTotalUSD: 2506.68   // USDT 2201.82 + USDS 304.86 (11/09)
  // NÃO adicionar `lpPooled` aqui: o valor da pool vive em defi.uniswapV3.pooled
  // (+ uncollectedFees). Um segundo campo só cria drift — a pool migra de rede e o
  // duplicado congela numa posição já desmontada (foi o que aconteceu até 15/07/2026).
};

/* ═══════════════════════════════════════════════════════════════════════════
   AGREGADOS DERIVADOS — recalculados a cada carregamento.
   Objetivo: mexer numa quantidade (aqui em cima) e o resto acompanhar sozinho,
   sem depender de ninguem lembrar de atualizar o total logo abaixo.
     · stablesTotalUSD = soma das qty de stables[]  (stable = US$ 1)
     · debt.aave / debt.kamino = borrow.USDC.qty de cada protocolo
     · debt.total = aave + kamino
   Roda tanto no browser quanto nos scripts Node (que carregam este arquivo com
   new Function('window', src)). Se algo estiver faltando, mantem o valor escrito.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (D) {
  if (!D) return;
  var r2 = function (n) { return Math.round(n * 100) / 100; };

  if (Array.isArray(D.stables)) {
    D.stablesTotalUSD = r2(D.stables.reduce(function (s, x) { return s + (Number(x.qty) || 0); }, 0));
  }

  D.debt = D.debt || {};
  var borrowOf = function (proto) {
    var b = D.defi && D.defi[proto] && D.defi[proto].borrow;
    if (!b) return null;
    // Soma qualquer token de divida (hoje so USDC, mas ja foi GHO e USDG).
    var t = 0, found = false;
    for (var k in b) { if (b[k] && typeof b[k].qty === 'number') { t += b[k].qty; found = true; } }
    return found ? r2(t) : null;
  };
  var a = borrowOf('aave'), k = borrowOf('kamino');
  if (a !== null) D.debt.aave = a;
  if (k !== null) D.debt.kamino = k;
  D.debt.total = r2((D.debt.aave || 0) + (D.debt.kamino || 0));

  // ── Snapshot do lending — UMA formula para os graficos 'Colateral vs Divida' e
  // 'Acumulacao de Tokens' (portfolio_analytics) e para o snapshot diario
  // (scripts/fetch-networth.js grava o resultado em networth-history.json -> defi).
  // px = { ETH: preco, SOL: preco } (stables a US$ 1). HF pela formula definitiva:
  // SOMA(colateral x CF) / divida, CF WETH 83% · USDT 78% (MCP 09/09/2026).
  var CF = { WETH: 0.83, USDT: 0.78 };
  D.lendingSnapshot = function (px) {
    px = px || {};
    var A = (D.defi && D.defi.aave) || {}, K = (D.defi && D.defi.kamino) || {};
    var q = function (o, t) { return (o && o[t] && typeof o[t].qty === 'number') ? o[t].qty : 0; };
    var eth = Number(px.ETH) || 0, sol = Number(px.SOL) || 0, hasPx = eth > 0 && sol > 0;
    var aW = q(A.supply, 'WETH'), aU = q(A.supply, 'USDT'), kS = q(K.supply, 'SOL'), kU = q(K.supply, 'USDS');
    var aD = D.debt.aave || 0, kD = D.debt.kamino || 0;
    var aCol = aW * eth + aU, kCol = kS * sol + kU;
    var pa = (D.principals && D.principals.aave) || {}, pk = (D.principals && D.principals.kamino) || {};
    var T = D.tokenAccumulation || {};
    var ethLendV4 = pa.WETH ? Math.max(0, aW - pa.WETH) : 0;
    var solLend = pk.SOL ? Math.max(0, kS - pk.SOL) : 0;
    return {
      aaveCol: hasPx ? r2(aCol) : null, kamCol: hasPx ? r2(kCol) : null,
      aaveDebt: r2(aD), kamDebt: r2(kD),
      hf:   (hasPx && aD > 0) ? +((aW * eth * CF.WETH + aU * CF.USDT) / aD).toFixed(3) : null,
      kLtv: (hasPx && kCol > 0) ? +(kD / kCol * 100).toFixed(2) : null,
      accEth: +((T.poolsETH || 0) + (T.ethLendingV3 || 0) + ethLendV4).toFixed(6),
      accSol: +((T.poolsSOL || 0) + solLend).toFixed(6),
      ethLendV4: +ethLendV4.toFixed(6), solLend: +solLend.toFixed(6)
    };
  };

  // ── Curva mensal + o mes CORRENTE ao vivo — UMA implementacao so ───────────
  // Antes cada pagina fazia diferente: a landing SUBSTITUIA o ultimo mes fechado
  // pelo valor de hoje (apagando um mes inteiro da serie) e o dashboard ignorava
  // o valor ao vivo. Resultado: CAGR/TWR diferentes nas duas para o mesmo dado.
  // Agora as duas chamam isto. `liveGross` = patrimonio BRUTO de agora (holdings x
  // preco + stables + LP, antes da divida) — mesma definicao dos pontos fechados.
  // O aporte do mes corrente sai de `contributions`, entao registrar um aporte novo
  // ja aparece no ROI/TWR/TIR no mesmo dia, sem esperar o fechamento do mes.
  D.curveWithLive = function (liveGross, refDate) {
    var wc = D.wealthCurve || {};
    var labels = (wc.labels || []).slice();
    var values = (wc.values || []).slice();
    var invested = (wc.invested || []).slice();
    if (!(liveGross > 0) || !labels.length) return { labels: labels, values: values, invested: invested };

    var now = refDate ? new Date(refDate) : new Date();
    var mm = ('0' + (now.getMonth() + 1)).slice(-2);
    var cur = mm + '/' + String(now.getFullYear()).slice(-2);
    var ym = now.getFullYear() + '-' + mm;

    var add = 0;
    (D.contributions || []).forEach(function (c) {
      if (c && c.date && String(c.date).slice(0, 7) === ym && typeof c.usd === 'number') add += c.usd;
    });

    if (labels[labels.length - 1] === cur) {
      values[values.length - 1] = liveGross;           // mes ainda aberto: so atualiza
    } else {
      labels.push(cur);
      values.push(liveGross);
      invested.push(Math.round((invested[invested.length - 1] || 0) + add));
    }
    return { labels: labels, values: values, invested: invested };
  };
})(typeof window !== 'undefined' ? window.BAROLO_DATA : null);
