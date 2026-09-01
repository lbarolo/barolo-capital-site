/* ════════════════════════════════════════════════════════════════════
   diario.js — DIÁRIO DEFI (fonte compartilhada, git-tracked)
   ════════════════════════════════════════════════════════════════════
   O Diário DeFi (aba em ferramentas.html) grava normalmente no
   localStorage do navegador do Lucas ('bc-diary-v2') — isso NUNCA muda,
   é o armazenamento vivo enquanto ele usa a página.

   Este arquivo é a CÓPIA SINCRONIZADA e git-tracked dessas entradas.
   Ele existe para que sessões que não têm acesso ao navegador do Lucas
   (ex: o standup diário automatizado, ou qualquer sessão do Claude Code
   rodando fora do browser) consigam LER o diário — coisa que o
   localStorage sozinho não permite.

   Como sincronizar (fluxo manual, feito pelo Lucas ou pelo Claude numa
   sessão interativa):
     1. Na aba Diário DeFi de ferramentas.html, clicar em "Sincronizar".
     2. Isso copia o conteúdo atualizado deste arquivo para a área de
        transferência (ou baixa diario.js se o clipboard falhar).
     3. Colar no chat do Claude Code (ou mandar o arquivo baixado) e
        pedir para salvar/commitar em diario.js.

   ferramentas.html faz o inverso automaticamente: no load, faz o MERGE
   de window.BAROLO_DIARY (aqui) com o localStorage do navegador —
   entradas novas no navegador entram; entradas já commitadas aqui
   aparecem mesmo em um navegador/perfil novo. O localStorage sempre
   vence em caso de conflito de id (é a versão mais recente).

   Formato de cada entrada: igual ao objeto salvo em localStorage
   ('bc-diary-v2') — id, date, type (pool|lending|trade|insight|risk),
   title, body, pnl, tags[], e opcionalmente lending{} ou trade{}.
   ════════════════════════════════════════════════════════════════════ */
window.BAROLO_DIARY = [
  {
    id: 1785456000000,
    date: '2026-07-31',
    type: 'insight',
    title: 'Fechamento Julho/2026 — patrimônio $7.031 (−8,1% no mês)',
    body: 'Patrimônio líquido $7.031 (Jun $7.651 → −$620 / −8,1% em USD). Retorno mensal −10,1% (TWR). ROI total ~−30,7% sobre $10.143 investidos; em BRL amortecido pelo câmbio (~4,95).\n\n'
      + 'POSITIVO: pool WETH/USDG (Robinhood) fee APR 68,86%, in-range, +$10,85 de fees em 17 dias (PnL real fees−IL = +$6,54); Kamino juros acumulados +$150,03; alavancagem defensiva mantida (dívida/patrimônio 22,5%, HF AAVE ~5,5, Kamino LTV 39,1% vs liq. 77,2%); DCA no bear (BTC +$95,89, SOL +$53,92).\n\n'
      + 'ATENÇÃO: carry AAVE apertando (borrow subiu p/ 3,97% vs net deposit APY 1,89%); pool a só +1,3% do piso do range (market $1.877 vs mín $1.852) — se ETH cair sai do range por baixo (vira 100% WETH, sem conversão ETH→USDG ainda); carry Kamino justo (borrow 5,56% vs supply blend ~4,85%).\n\n'
      + 'PRÓXIMO MÊS: decidir range da pool se ETH seguir no piso (reposicionar ou aceitar acumular 100% WETH); vigiar borrow AAVE (reduzir dívida se subir mais); monitorar spread Kamino.',
    pnl: -620,
    tags: ['fechamento-mensal', 'review', 'defi', 'julho-2026']
  },
  {
    id: 1785957480000,
    date: '2026-08-05',
    type: 'trade',
    title: 'Compra SOL (DCA) — 0,374988 SOL @ $76,01',
    body: 'Compra de +0,374988 SOL @ $76,01 = $28,50 (05/08 16:18). Total agora 24,765222 SOL — bate exato com o supply da Kamino, ou seja, todo o SOL segue depositado como colateral (nenhum extra na carteira livre).\n\n'
      + 'Briefing semanal (07/08/2026): patrimônio líquido ≈$7.220 (carteira $8.438,04 + LP $364,03 − dívida $1.582,08), semana levemente positiva (+~$100 a +$170 vs 7d atrás) e mês +~6% (vs 30d atrás). BTC $65.034 (+1,7% 7d) · ETH $1.924,87 (+1,5% 7d) · SOL $73,72 (0,0% 7d). Fear&Greed 29 (Fear), melhorando (era 25 há 7 dias). MVRV 1,22 / Mayer 0,915 / STH MVRV 0,95 — zona neutra/acumulação, sem sinal de topo.\n\n'
      + 'Posições seguras: AAVE HF 6,20 (WETH 2,16 @1,79% + USDT 1.600 @2,65% · borrow 759,46 USDC @4,00%); Kamino LTV 38,95% vs liq. 77,16% (SOL 24,46 @4,49% + USDS 303,83 @4,00% · borrow 822,62 USDC @5,94%; SOL precisaria cair a ~$31 pra risco de liquidação). Pool WETH/USDG (Robinhood) in-range, 24 dias, $351,18 + $12,85 fees não coletadas, fee APR ~57% (desacelerando um pouco vs semanas anteriores, ainda saudável).\n\n'
      + 'Nota: registrado via Claude a pedido do Lucas — ainda não lançado manualmente na aba Diário DeFi (fazer isso mais tarde faz o Sync puxar/mesclar este id, sem duplicar).',
    pnl: null,
    tags: ['trade', 'sol', 'dca', 'briefing-semanal'],
    trade: { token: 'SOL', side: 'buy', qty: 0.374988, totalCost: 28.50 }
  },
  {
    id: 1787433600000,
    date: '2026-08-21',
    type: 'pool',
    title: 'Pool WETH/USDG fora do range (100% USDG) + refresh AAVE/Kamino',
    body: 'Rali forte de ETH (24h +8,8%, 7d +28%) empurrou o mercado da pool acima do rangeMax $2.166,83 — a posição saiu do range em 20/08/2026 e virou 100% USDG (0 WETH), exatamente como a saída gradual foi desenhada. Esse evento já foi coletado, reconciliado contra print da Uniswap e documentado em detalhe em `data.js` (bloco `defi.uniswapV3`, comentário "20/08/2026") e no log de sessão do CLAUDE.md do mesmo dia — não repetir a reconciliação aqui, só o resumo: fees coletadas $5,28 (realizadas), ETH remanescente de um fechamento anterior foi vendido (rotação de holding, não renda de pool), e $23,78 USDG foram reaportados mono-ativo na mesma posição (tese: aguardar capitulação até outubro para a posição recomprar ETH na descida). Posição atual: $413,05 pooled, 100% USDG, PnL do ciclo +$30,27 sobre $388,06 de capital.\n\n'
      + 'Refresh de AAVE/Kamino via print de hoje (21/08): AAVE HF ≈7,25 (WETH 2,16 @1,60% + USDT 1.600 @2,88% · borrow 760,78 USDC @4,20%); Kamino LTV 32,77% (caiu por causa do rali de SOL, não repagamento) vs liq. 76,81% (SOL 24,51 @4,61% + USDS 304,29 @2,89% · borrow 824,58 USDC @6,34%).\n\n'
      + 'REGRA DE CONTABILIDADE FIRMADA HOJE: não lanço no CoinGecko as taxas que recebo em ETH das pools — elas ficam fora da contabilidade até virarem outra coisa. Consequência: ao vender fee em ETH, NÃO se subtrai nada de holdings; a quantidade vem do print do CoinGecko e só muda quando o print muda. Isso corrigiu uma subtração indevida de 0,0080 ETH feita ontem (patrimônio estava ~$19 subestimado). Com a correção, o total do site bate com o print do CoinGecko ($9.975,74 vs $9.974,58 — só timing de preço).\n\n'
      + 'Nota: registrado via Claude a partir de prints enviados pelo Lucas durante o check-in de mercado automatizado — dados já propagados para data.js.',
    pnl: 30.27,
    tags: ['pool', 'weth-usdg', 'saida-gradual', 'out-of-range', 'aave', 'kamino']
  },
  {
    id: 1788307200000,
    date: '2026-08-31',
    type: 'insight',
    title: 'Fechamento Agosto/2026 — patrimonio $9.704 (+38% no mes, +25,7% TWR)',
    body: 'Patrimonio liquido $9.703,91 (Jul $7.031 -> +$2.673). Do ganho bruto, $766 foram APORTE novo, entao o retorno de verdade e +25,7% (TWR Modified Dietz) — melhor mes de 2026 depois de abril. ROI sobre aporte liquido +21,1%; sobre custo de aquisicao ($11.049) ainda -12,2%. Composicao: carteira $10.819,68 (CoinGecko) + LP $409,19 - divida $1.524,96.\n\n'
      + 'POSITIVO: (1) BORROW DA AAVE DESPENCOU 4,92% -> 1,88% — e o dinheiro mais barato que ja tomei, e inverteu o carry da AAVE (supply blend 2,54% vs borrow 1,88%, spread +0,66pp; era negativo o ano inteiro). (2) Desalavancagem por valorizacao: divida/patrimonio 22,2% -> 15,7%, HF AAVE 7,91, LTV Kamino 27,4% vs liq. 76,6% — SOL precisaria cair ~72% pra ameacar. (3) Repay de 63,35 USDC na Kamino (27/08) + aporte recorde de $766 no mes (vs $150/mes no 2o trimestre). (4) Carry total da estrutura de lending +$258/ano. (5) A pool ENTROU NO RANGE (ETH $2.413,65 dentro de $2.207,95-$2.464,17): a entrada gradual USDG->ETH comecou, ~$331 USDG + 0,0324 WETH.\n\n'
      + 'ATENCAO: (1) CARRY DA KAMINO INVERTEU: borrow 5,34% contra supply blend 4,50% — pago mais caro pelo dinheiro do que o colateral rende, e esse USDC financia uma pool que ficou fora do range de 20/08 a ~31/08 gerando ZERO. Migrar a divida da Kamino pra AAVE economiza ~$26/ano (spread 3,46pp) e sobra borrowing power de $5.268 la. (2) CHURN DA POOL: 3 remontagens no mes (07/08 Robinhood, 24/08 Base, 26/08 Robinhood); o desvio de 2 dias pra Base rendeu +$0,80 de fee e custou ~$3,40 de bridge = -$2,60, e terminou num range praticamente identico. Muito atrito pra uma posicao de $410 (4,2% do patrimonio). (3) Range curto (11,6%): se o ETH romper $2.464 de novo, volta a 100% USDG sem ter comprado quase nada. (4) Cauda de alts segue morta: $135,84 hoje contra $885,22 investidos (-85%), 1,3% do book — perda ja realizada economicamente. (5) Stables em 23,1% do book ($2.498) — municao proposital pra tese de capitulacao ate outubro, mas e muito capital a 3,3%.\n\n'
      + 'PROXIMO MES: (a) pedir print da Uniswap/Revert — as fees do periodo em range NAO estao contabilizadas, o resultado da pool esta subestimado; (b) avaliar migrar a divida da Kamino pra AAVE enquanto o borrow la esta a 1,88%; (c) se a tese e comprar capitulacao, a alavanca certa agora e a AAVE, nao a Kamino; (d) lancar os ~4,59 USDS de yield da Kamino que nunca entraram no CoinGecko (pendencia aberta desde 27/08).\n\n'
      + 'PENDENCIA ABERTA: nao foi identificada a origem dos ~406 USDT que entraram na AAVE no fim do mes (fiat/DCA? venda? transferencia?). Foram tratados como aporte novo (principal com custo) no fechamento — se for outra coisa, corrigir o `invested` do USDT e o ponto 08/26 de wealthCurve.invested juntos.',
    pnl: 2673,
    tags: ['fechamento-mensal', 'review', 'defi', 'agosto-2026']
  }
];
