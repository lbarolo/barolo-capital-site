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
    "id": 1773928041388,
    "date": "2026-03-19",
    "type": "lending",
    "title": "Troquei PYUSD para USDS para maior APR e coloquei mais $210,39",
    "body": "Reparei que o APR de PYUSD estava muito baixo e então decidi trazer $212,39 em USDT, transformar em USDS junto como PYUSD também em USDS, e colocar como supply. Tirei $2 e comprei em SOL pra ter a taxa da rede.",
    "pnl": 300.39,
    "tags": [
      "SOL",
      "USDS"
    ]
  },
  {
    "id": 1774358031194,
    "date": "2026-03-24",
    "type": "insight",
    "title": "Melhorar meu preço médio em SOL",
    "body": "Hoje meu preço médio em SOL está mais alto que o preço da tela, estou procurando novo ranges pra melhorar o meu preço médio",
    "pnl": null,
    "tags": []
  },
  {
    "id": 1775130192657,
    "date": "2026-04-02",
    "type": "risk",
    "title": "Troquei a posição de lending e borrow na Aave para a AavePRO",
    "body": "Mudei a posição para a nova AavePRO que esta com APY's melhores e também para testar",
    "pnl": null,
    "tags": [
      "Aave PRO"
    ]
  },
  {
    "id": 1775479799808,
    "date": "2026-04-02",
    "type": "trade",
    "title": "Compra de SOL",
    "body": "Bateu minha ordem de compra de SOL a $78,78, comprei 0.99907692 SOL gastando um total de $78,71",
    "pnl": null,
    "tags": [
      "SOL"
    ]
  },
  {
    "id": 1776355377632,
    "date": "2026-04-09",
    "type": "trade",
    "title": "Compra de USDT",
    "body": "Dia 9/04/2026 comprei $101.69 USDT por R$519,99 BRL e $94,39 USDT por R$480,00 e $69,76 USDT por R$349,92 reais.",
    "pnl": 265.84,
    "tags": [
      "USDT BRL"
    ]
  },
  {
    "id": 1776355397896,
    "date": "2026-03-28",
    "type": "trade",
    "title": "Compra de USDT",
    "body": "Comprei em 26/03/2026 $151,51 USDT por R$799,99 Reais,",
    "pnl": 151.51,
    "tags": [
      "USDT BRL"
    ]
  },
  {
    "id": 1777035614592,
    "date": "2026-04-23",
    "type": "trade",
    "title": "Compra de USDT",
    "body": "Compra de $70.66 USDT foi gasto R$350",
    "pnl": 70.66,
    "tags": [
      "USDT"
    ]
  },
  {
    "id": 1777035676944,
    "date": "2026-04-24",
    "type": "lending",
    "title": "Adcionei 0.99 SOL em supply na Kamino",
    "body": "Adcionei 0.99 SOL em supply na Kamino",
    "pnl": null,
    "tags": [
      "Kamino"
    ],
    "lending": {
      "proto": "kamino",
      "event": "add-collateral",
      "amount": null,
      "debtAfter": null
    }
  },
  {
    "id": 1777035714449,
    "date": "2026-04-24",
    "type": "lending",
    "title": "Add supply USDT na Aave",
    "body": "Adcionei $335,68 USDT na Aave de Supply",
    "pnl": null,
    "tags": [],
    "lending": {
      "proto": "kamino",
      "event": "add-collateral",
      "amount": null,
      "debtAfter": null
    }
  },
  {
    "id": 1778516917691,
    "date": "2026-05-07",
    "type": "trade",
    "title": "Comprei USDT",
    "body": "Comprei $47,85 a R$4,90 totalizando R$234,50 e $19,64 por R$4,92 e $27,26 por R$4,925 totalizando um  total de : $94,75",
    "pnl": 94.75,
    "tags": [
      "USDT"
    ]
  },
  {
    "id": 1780425595882,
    "date": "2026-06-02",
    "type": "trade",
    "title": "Comprei BTC",
    "body": "Comprei 0.00076443 BTC por $51,90",
    "pnl": null,
    "tags": []
  },
  {
    "id": 1780425623824,
    "date": "2026-06-01",
    "type": "trade",
    "title": "Comprei BTC",
    "body": "Comprei 0.00047187 BTC por $33,92",
    "pnl": null,
    "tags": []
  },
  {
    "id": 1780425659332,
    "date": "2026-06-02",
    "type": "trade",
    "title": "Comprei SOL",
    "body": "Comprei 0.922745 SOL por $72,79",
    "pnl": null,
    "tags": []
  },
  {
    "id": 1780425775322,
    "date": "2026-06-02",
    "type": "trade",
    "title": "Comprei SOL",
    "body": "Comprei 0.879804 SOL por $69,47",
    "pnl": null,
    "tags": [],
    "trade": {
      "token": "SOL",
      "side": "buy",
      "qty": 0.879804,
      "totalCost": 69.47
    }
  },
  {
    "id": 1780425809324,
    "date": "2026-06-02",
    "type": "trade",
    "title": "Comprei ETH",
    "body": "Comprei 0,02606 ETH por $50,58",
    "pnl": null,
    "tags": [],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.02606,
      "totalCost": 50.58
    }
  },
  {
    "id": 1780507456436,
    "date": "2026-06-03",
    "type": "pool",
    "title": "Remontei a Pool ETH/USDC na Base",
    "body": "Esperei por 100 dias a pool sair do range e achei que o retorno estava muito baixo pois ficou esticada demais, dessa vez vou fazer esticada mas pela metade, seguindo a acumulação do VPVR. 0.18ETH  entrei mono ativo denovo",
    "pnl": null,
    "tags": [
      "Uniswap"
    ]
  },
  {
    "id": 1780507525183,
    "date": "2026-06-03",
    "type": "lending",
    "title": "Realocando supply da AAVE",
    "body": "Retirei $300 de supply na Aave e estou realocando em ETH com pequenas compras",
    "pnl": -300,
    "tags": [
      "Aaave"
    ],
    "lending": {
      "proto": "aave",
      "event": "remove-collateral",
      "token": "USDT",
      "tokenQty": 300,
      "amount": 300,
      "debtAfter": null
    }
  },
  {
    "id": 1780507573859,
    "date": "2026-06-03",
    "type": "trade",
    "title": "Comprei ETH",
    "body": "Comprei $100 USDT por 0.0543ETH",
    "pnl": null,
    "tags": [],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.0543,
      "totalCost": 100
    }
  },
  {
    "id": 1780683542322,
    "date": "2026-06-05",
    "type": "lending",
    "title": "ADD SUPPLY KAMINO",
    "body": "Adcionei  2.783251039 SOL de supply na Kamino",
    "pnl": null,
    "tags": [],
    "lending": {
      "proto": "kamino",
      "event": "add-collateral",
      "token": "SOL",
      "tokenQty": 2.783251039,
      "amount": null,
      "debtAfter": null
    }
  },
  {
    "id": 1780683580060,
    "date": "2026-06-05",
    "type": "lending",
    "title": "Removi Colateral da AAVE",
    "body": "Removi $400 USDT da AAve de  colateral",
    "pnl": null,
    "tags": [],
    "lending": {
      "proto": "aave",
      "event": "remove-collateral",
      "token": "USDT",
      "tokenQty": 400,
      "amount": -400,
      "debtAfter": null
    }
  },
  {
    "id": 1780684583780,
    "date": "2026-06-03",
    "type": "trade",
    "title": "Comprei BTC",
    "body": "Compra de 0,00079526 BTC por $49,91 USDT",
    "pnl": null,
    "tags": [
      "BTC"
    ],
    "trade": {
      "token": "BTC",
      "side": "buy",
      "qty": 0.00079526,
      "totalCost": 49.91
    }
  },
  {
    "id": 1780684619624,
    "date": "2026-06-05",
    "type": "trade",
    "title": "Comprei SOL",
    "body": "Comprei 0,954781 SOL por $65,83",
    "pnl": null,
    "tags": [
      "SOL"
    ],
    "trade": {
      "token": "SOL",
      "side": "buy",
      "qty": 0.954781,
      "totalCost": 65.83
    }
  },
  {
    "id": 1780684789466,
    "date": "2026-06-04",
    "type": "trade",
    "title": "Comprei ETH",
    "body": "Comprei 0.0567 ETH por $100 USDT",
    "pnl": null,
    "tags": [
      "ETH"
    ],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.0567,
      "totalCost": 100
    }
  },
  {
    "id": 1780684812365,
    "date": "2026-06-04",
    "type": "trade",
    "title": "Comprei ETH",
    "body": "Comprei 0.0596 ETH por $100",
    "pnl": null,
    "tags": [
      "ETH"
    ],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.0596,
      "totalCost": 100
    }
  },
  {
    "id": 1780685094471,
    "date": "2026-06-05",
    "type": "trade",
    "title": "Comprei com as taxas da pools ETH",
    "body": "Comprei 0.0111 ETH por $17,51",
    "pnl": null,
    "tags": [
      "ETH"
    ],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.0111,
      "totalCost": 17.51
    }
  },
  {
    "id": 1780686019070,
    "date": "2026-06-05",
    "type": "lending",
    "title": "Add Supplye AAVE",
    "body": "Adcionei supply na AAVE de 0.2697 ETH",
    "pnl": null,
    "tags": [
      "ETH"
    ],
    "lending": {
      "proto": "aave",
      "event": "add-collateral",
      "token": "ETH",
      "tokenQty": 0.2697,
      "amount": null,
      "debtAfter": null
    }
  },
  {
    "id": 1780754889310,
    "date": "2026-06-06",
    "type": "trade",
    "title": "Comprei ETH",
    "body": "Comprei 0.0649 ETH por $100 USDT",
    "pnl": null,
    "tags": [
      "ETH"
    ],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.0649,
      "totalCost": 100
    }
  },
  {
    "id": 1782322176472,
    "date": "2026-06-24",
    "type": "trade",
    "title": "Comprei BTC",
    "body": "Comprei BTC  - $38,84 a 59.312,00 por 0.00065484 BTC",
    "pnl": 38.84,
    "tags": [
      "BTC"
    ],
    "trade": {
      "token": "BTC",
      "side": "buy",
      "qty": 0.00065848,
      "totalCost": 38.84
    }
  },
  {
    "id": 1782914651350,
    "date": "2026-07-01",
    "type": "trade",
    "title": "Comprei BTC",
    "body": "Comprei 0.00164555 BTC por $95,89 USDT",
    "pnl": null,
    "tags": [
      "BTC"
    ],
    "trade": {
      "token": "BTC",
      "side": "buy",
      "qty": 0.00164555,
      "totalCost": 95.89
    }
  },
  {
    "id": 1783356954848,
    "date": "2026-07-06",
    "type": "pool",
    "title": "Fechei a pool e abri novamente, diminuindo o tamanho do range",
    "body": "Agora com essa recuperação de mercado, decidi diminuir o tamanho do range, apoiado pelo GLI, acredito que possamos passar por uma fase de alta, fazendo um topo mais baixo que o anterior para continuarmos a queda, nesse período, pretendo fazer taxas e tenho a ideia de realizar algum lucro nessa topo e aguardar para quedas maiores.",
    "pnl": null,
    "tags": [
      "ETH"
    ]
  },
  {
    "id": 1784034175643,
    "date": "2026-07-14",
    "type": "pool",
    "title": "Fechei a pool na BASE",
    "body": "Fechei a pool ETH/USDC na BASE, pra remonta-la na RobinHood, uma rede nova",
    "pnl": 0.95,
    "tags": [
      "ETH"
    ]
  },
  {
    "id": 1784034234073,
    "date": "2026-07-14",
    "type": "pool",
    "title": "Abri uma pool na rede RobinHood",
    "body": "Abri a pool na rede nova da RobinHood, o 1D/VOL esta em 30, muito volume sendo gerado nela por enquanto, quero aproveitar para pegar essas taxas, reduzi o range da pool tambem pra cerca de 17% pra cima, entrei com 0.18 ETH",
    "pnl": null,
    "tags": [
      "ETH"
    ]
  },
  {
    "id": 1784074764008,
    "date": "2026-07-15",
    "type": "lending",
    "title": "Add mais liquidez de SOL na Kamino",
    "body": "Adcionei 0.236808947 SOL em supply na Kamino",
    "pnl": null,
    "tags": [
      "SOL"
    ],
    "lending": {
      "proto": "kamino",
      "event": "borrow",
      "token": "SOL",
      "tokenQty": 0.236808947,
      "amount": null,
      "debtAfter": null
    }
  },
  {
    "id": 1785456000000,
    "date": "2026-07-31",
    "type": "insight",
    "title": "Fechamento Julho/2026 — patrimônio $7.031 (−8,1% no mês)",
    "body": "Patrimônio líquido $7.031 (Jun $7.651 → −$620 / −8,1% em USD). Retorno mensal −10,1% (TWR). ROI total ~−30,7% sobre $10.143 investidos; em BRL amortecido pelo câmbio (~4,95).\n\nPOSITIVO: pool WETH/USDG (Robinhood) fee APR 68,86%, in-range, +$10,85 de fees em 17 dias (PnL real fees−IL = +$6,54); Kamino juros acumulados +$150,03; alavancagem defensiva mantida (dívida/patrimônio 22,5%, HF AAVE ~5,5, Kamino LTV 39,1% vs liq. 77,2%); DCA no bear (BTC +$95,89, SOL +$53,92).\n\nATENÇÃO: carry AAVE apertando (borrow subiu p/ 3,97% vs net deposit APY 1,89%); pool a só +1,3% do piso do range (market $1.877 vs mín $1.852) — se ETH cair sai do range por baixo (vira 100% WETH, sem conversão ETH→USDG ainda); carry Kamino justo (borrow 5,56% vs supply blend ~4,85%).\n\nPRÓXIMO MÊS: decidir range da pool se ETH seguir no piso (reposicionar ou aceitar acumular 100% WETH); vigiar borrow AAVE (reduzir dívida se subir mais); monitorar spread Kamino.",
    "pnl": -620,
    "tags": [
      "fechamento-mensal",
      "review",
      "defi",
      "julho-2026"
    ]
  },
  {
    "id": 1785957480000,
    "date": "2026-08-05",
    "type": "trade",
    "title": "Compra SOL (DCA) — 0,374988 SOL @ $76,01",
    "body": "Compra de +0,374988 SOL @ $76,01 = $28,50 (05/08 16:18). Total agora 24,765222 SOL — bate exato com o supply da Kamino, ou seja, todo o SOL segue depositado como colateral (nenhum extra na carteira livre).\n\nBriefing semanal (07/08/2026): patrimônio líquido ≈$7.220 (carteira $8.438,04 + LP $364,03 − dívida $1.582,08), semana levemente positiva (+~$100 a +$170 vs 7d atrás) e mês +~6% (vs 30d atrás). BTC $65.034 (+1,7% 7d) · ETH $1.924,87 (+1,5% 7d) · SOL $73,72 (0,0% 7d). Fear&Greed 29 (Fear), melhorando (era 25 há 7 dias). MVRV 1,22 / Mayer 0,915 / STH MVRV 0,95 — zona neutra/acumulação, sem sinal de topo.\n\nPosições seguras: AAVE HF 6,20 (WETH 2,16 @1,79% + USDT 1.600 @2,65% · borrow 759,46 USDC @4,00%); Kamino LTV 38,95% vs liq. 77,16% (SOL 24,46 @4,49% + USDS 303,83 @4,00% · borrow 822,62 USDC @5,94%; SOL precisaria cair a ~$31 pra risco de liquidação). Pool WETH/USDG (Robinhood) in-range, 24 dias, $351,18 + $12,85 fees não coletadas, fee APR ~57% (desacelerando um pouco vs semanas anteriores, ainda saudável).\n\nNota: registrado via Claude a pedido do Lucas — ainda não lançado manualmente na aba Diário DeFi (fazer isso mais tarde faz o Sync puxar/mesclar este id, sem duplicar).",
    "pnl": null,
    "tags": [
      "trade",
      "sol",
      "dca",
      "briefing-semanal"
    ],
    "trade": {
      "token": "SOL",
      "side": "buy",
      "qty": 0.374988,
      "totalCost": 28.5
    }
  },
  {
    "id": 1787228080143,
    "date": "2026-08-20",
    "type": "pool",
    "title": "ETH/USDG - saiu do range",
    "body": "Ontem a pool saiu do range, com uma boa valorização do ETH, então como planejado, vendi as fees de ETH para USDG e as fees da pool passada na rede BASE também, ficando com um total de $30.30 USDG que pretendo colocar de volta na pool quando voltar pro range",
    "pnl": null,
    "tags": [
      "ETH"
    ]
  },
  {
    "id": 1787228944973,
    "date": "2026-08-20",
    "type": "pool",
    "title": "ETH/USDG",
    "body": "Coloquei o restante de USDG de volta na pool, e agora espero ela voltar pro range pra coletar mais taxas",
    "pnl": null,
    "tags": []
  },
  {
    "id": 1787433600000,
    "date": "2026-08-21",
    "type": "pool",
    "title": "Pool WETH/USDG fora do range (100% USDG) + refresh AAVE/Kamino",
    "body": "Rali forte de ETH (24h +8,8%, 7d +28%) empurrou o mercado da pool acima do rangeMax $2.166,83 — a posição saiu do range em 20/08/2026 e virou 100% USDG (0 WETH), exatamente como a saída gradual foi desenhada. Esse evento já foi coletado, reconciliado contra print da Uniswap e documentado em detalhe em `data.js` (bloco `defi.uniswapV3`, comentário \"20/08/2026\") e no log de sessão do CLAUDE.md do mesmo dia — não repetir a reconciliação aqui, só o resumo: fees coletadas $5,28 (realizadas), ETH remanescente de um fechamento anterior foi vendido (rotação de holding, não renda de pool), e $23,78 USDG foram reaportados mono-ativo na mesma posição (tese: aguardar capitulação até outubro para a posição recomprar ETH na descida). Posição atual: $413,05 pooled, 100% USDG, PnL do ciclo +$30,27 sobre $388,06 de capital.\n\nRefresh de AAVE/Kamino via print de hoje (21/08): AAVE HF ≈7,25 (WETH 2,16 @1,60% + USDT 1.600 @2,88% · borrow 760,78 USDC @4,20%); Kamino LTV 32,77% (caiu por causa do rali de SOL, não repagamento) vs liq. 76,81% (SOL 24,51 @4,61% + USDS 304,29 @2,89% · borrow 824,58 USDC @6,34%).\n\nREGRA DE CONTABILIDADE FIRMADA HOJE: não lanço no CoinGecko as taxas que recebo em ETH das pools — elas ficam fora da contabilidade até virarem outra coisa. Consequência: ao vender fee em ETH, NÃO se subtrai nada de holdings; a quantidade vem do print do CoinGecko e só muda quando o print muda. Isso corrigiu uma subtração indevida de 0,0080 ETH feita ontem (patrimônio estava ~$19 subestimado). Com a correção, o total do site bate com o print do CoinGecko ($9.975,74 vs $9.974,58 — só timing de preço).\n\nNota: registrado via Claude a partir de prints enviados pelo Lucas durante o check-in de mercado automatizado — dados já propagados para data.js.",
    "pnl": 30.27,
    "tags": [
      "pool",
      "weth-usdg",
      "saida-gradual",
      "out-of-range",
      "aave",
      "kamino"
    ]
  },
  {
    "id": 1787591524096,
    "date": "2026-08-24",
    "type": "pool",
    "title": "Fechei a pool na Robin Hood que não gerou taxas",
    "body": "Fechei a pool na robinhood e reabri ela na BASE, fiz a Bridge e entrei na base com 411$ USD",
    "pnl": null,
    "tags": []
  },
  {
    "id": 1788307200000,
    "date": "2026-08-31",
    "type": "insight",
    "title": "Fechamento Agosto/2026 — patrimonio $9.295 (+32,2% no mes, +26,4% TWR)",
    "body": "Patrimonio liquido $9.294,72 (Jul $7.031 -> +$2.264). Do ganho, $360 foram aporte novo, entao o retorno de verdade e +26,4% (TWR Modified Dietz) — melhor mes de 2026 depois de abril. ROI sobre aporte liquido +22,1%; sobre custo de aquisicao ($10.642) ainda -12,7%. Composicao: carteira $10.819,68 (CoinGecko) + LP $0 - divida $1.524,96. SEM POOL ATIVA pela primeira vez em meses.\n\nPOSITIVO: (1) BORROW DA AAVE DESPENCOU 4,92% -> 1,88% — e o dinheiro mais barato que ja tomei, e inverteu o carry da AAVE (supply blend 2,54% vs borrow 1,88%, spread +0,66pp; era negativo o ano inteiro). (2) Desalavancagem por valorizacao: divida/patrimonio 22,2% -> 16,4%, HF AAVE 7,91, LTV Kamino 27,4% vs liq. 76,6% — SOL precisaria cair ~72% pra ameacar. (3) Repay de 63,35 USDC na Kamino (27/08). (4) Carry total da estrutura de lending +$258/ano, agora com $2.012 de USDT rendendo 3,27% na AAVE.\n\nATENCAO — O MES DA POOL FOI RUIM E O DIARIO MOSTRA POR QUE: quatro ciclos, quatro remontagens, e o resultado somado do mes foi +$6,08 de taxa (5,28 na Robinhood + 0,80 na Base) contra ~$3,4 de atrito de bridge = ~$2,7 liquidos sobre $410 parados o mes inteiro. Sequencia: 07/08-24/08 Robinhood ($5,28) -> 24/08-26/08 desvio pra Base atras de APR maior ($0,80, e o proprio Diario registra \"Fiz errado em mudar de rede\") -> 26/08 volta pra Robinhood com range novo -> fechada 0 A 0 poucos dias depois, sem nenhuma taxa, porque o ETH nunca recuou pra dentro do range. O padrao e o mesmo que ja apareceu em 2024 (75 remontagens pra +$239 no ano): remontar sem esperar o preco chegar. O range de 26/08 foi montado 0,04% ABAIXO do preco de mercado, ou seja ja nasceu fora e dependendo de uma queda que nao veio.\n\nOUTRAS ATENCOES: (1) Carry da Kamino INVERTEU: borrow 5,34% contra supply blend 4,50% — pago mais caro pelo dinheiro do que o colateral rende. Migrar a divida da Kamino pra AAVE economiza ~$26/ano (spread 3,46pp) e sobra $5.268 de borrowing power la. E o USDC emprestado nao esta financiando nada agora que a pool fechou. (2) Cauda de alts segue morta: $135,84 hoje contra $885,22 investidos (-85%), 1,3% do book. (3) Stables em 23,1% do book ($2.498) — municao pra tese de capitulacao ate outubro, mas rendendo 3,27%.\n\nCONTABILIDADE DO FECHAMENTO (registrar, porque quase saiu errado): os ~406 USDT que apareceram na AAVE no fim do mes NAO sao aporte novo — sao os $410 da pool fechada, convertidos pra USDT. Foi preciso o Lucas corrigir e o Diario do Notion confirmar. Consequencia: o custo viajou junto com o dinheiro (ETH $4.880,53 -> $4.474,26 e USDT $1.772,92 -> $2.179,19, total investido inalterado em $10.642,50) e o aporte de agosto ficou em $360, nao $766. Confere: USDT vale $2.196,95 contra custo $2.179,19 = +$17,76, praticamente igual aos $18,90 de EARNINGS que a AAVE declara — stable com P&L igual ao proprio yield e o resultado certo.\n\nPROXIMO MES: (a) definir se volta pra pool e com que criterio de entrada — o Diario mostra que o problema nao e escolher a pool, e remontar antes do preco chegar no range; (b) aproveitar o borrow da AAVE a 1,88% (e migrar a divida da Kamino pra la); (c) lancar os ~4,59 USDS de yield da Kamino que nunca entraram no CoinGecko (pendencia aberta desde 27/08).\n\nPENDENCIA FECHADA: os 285,40 USDT lancados em 22/08 SAO aporte novo mesmo — po seco parado esperando ponto de entrada pra comprar. Confirmado por mim em 01/09. Entao o aporte do mes fica em $360 e o TWR em +26,4%. O que sobra desse item e fiscal: como foi dinheiro de fora, falta lancar o custo em BRL na planilha Custo_BRL (aba Fiscal, hoje R$ 36.632,97) — preciso achar a data e o cambio da conversao.",
    "pnl": 2264,
    "tags": [
      "fechamento-mensal",
      "review",
      "defi",
      "agosto-2026",
      "pool-fechada"
    ]
  },
  {
    "id": 1789474381200,
    "date": "2026-08-31",
    "type": "insight",
    "title": "Nota de revisão — Fechamento Agosto/2026: retorno do mês +22,8% (não +26,4%)",
    "body": "NOTA DE REVISÃO, escrita em 15/09/2026 sobre o fechamento de agosto (entrada logo ao lado). Lá está +26,4% de retorno no mês (TWR). Pela metodologia que o site usa hoje, o número certo é +22,8%.\n\nPOR QUE MUDOU: (1) a conta de 01/09 usou patrimônio LÍQUIDO (Jul $7.031 → Ago $9.295), mas a curva do site é BRUTA, antes da dívida. Em 05/09 os pontos de julho e agosto foram corrigidos para $8.623 e $11.037 — tinham entrado como líquido enquanto o resto da série é bruto, o que criava um degrau falso de ~US$ 1.525. (2) O aporte do mês passou de $360 para $406: em 09/09 os US$ 46,10 recebidos em USDC em 27/08 foram registrados como contribuição (dinheiro que veio de fora, não resultado da operação).\n\nCONTA ATUAL (Modified Dietz, aporte no meio do mês): (11.037 − 8.623 − 406) ÷ (8.623 + 203) = +22,8%.\n\nTAMBÉM MUDA: o ROI sobre aporte líquido era +22,1% sobre $7.610. Com o aporte acumulado revisado para $8.162 (os recebidos em cripto de janeiro, abril e agosto, registrados em 09/09), fica +13,9% ($9.294,72 ÷ $8.162).\n\nO QUE NÃO MUDA: o patrimônio líquido de $9.294,72, o resto da análise e a leitura do mês — agosto segue o segundo melhor mês de 2026, atrás só de abril (+34,4%).",
    "pnl": null,
    "tags": [
      "fechamento-mensal",
      "revisao",
      "agosto-2026"
    ]
  },
  {
    "id": 1789738744676,
    "date": "2026-09-15",
    "type": "trade",
    "title": "Comprei ETH",
    "body": "Após uma leve queda no dia do Clarity Act eu resolvi tirar 15% de USDT da Aave e coloquei 3 ordens, de $100 somente 2 pegaram. Então foi uma de 0.041698997 com ETH no preço de $2.398,14",
    "pnl": null,
    "tags": [
      "ETH"
    ],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.041698997,
      "totalCost": 100
    }
  },
  {
    "id": 1789738799713,
    "date": "2026-09-16",
    "type": "trade",
    "title": "Comprei ETH",
    "body": "Comprei ETH com a queda, tirei da AAVEE $300 USDT, porem somente 2 ordens pegaram, essa de 0.041916377 por $2.385,70 ETH",
    "pnl": null,
    "tags": [
      "ETH"
    ],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.041916377,
      "totalCost": 100
    }
  },
  {
    "id": 1790339131371,
    "date": "2026-09-25",
    "type": "trade",
    "title": "Comprei ETH",
    "body": "Comprei $50 USDT de ETH a $2.645,50 - totalizando ETH 0.0189",
    "pnl": null,
    "tags": [
      "ETH"
    ],
    "trade": {
      "token": "ETH",
      "side": "buy",
      "qty": 0.0189,
      "totalCost": 50
    }
  }
];
