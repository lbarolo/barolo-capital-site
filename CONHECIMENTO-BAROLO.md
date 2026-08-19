<!-- KB-START -->

# 📚 BASE DE CONHECIMENTO CONSOLIDADA — BAROLO CAPITAL (Lucas)

> **O que é isto:** consolidação, em um único bloco autocontido, de (a) **todos os estudos do Notion** do Lucas, (b) **tudo que foi aprendido com ele nas conversas** (estratégia, filosofia, mentoria, decisões), e (c) **o portfólio completo e seu histórico**.
> **Criado em 18/08/2026 · revisado e auditado em 18/08/2026** (ver §16 — auditoria contra `data.js`, `briefing.json`, `pools.html` e o Diário DeFi do Notion) **· consolidado de novo em 19/08/2026** (havia duas cópias divergentes desta KB — corrigido, ver nota abaixo).
> **Fonte única: `CONHECIMENTO-BAROLO.md`** (com hífen) na raiz do repo — **editar aqui**. Este conteúdo também vive espelhado dentro do bloco `<!-- KB-START -->…<!-- KB-END -->` do `CLAUDE.md`; para regenerar a cópia standalone a partir do `CLAUDE.md`: `sed -n '/^<!-- KB-START -->$/,$p' CLAUDE.md > CONHECIMENTO-BAROLO.md`.
> **Nota de 19/08/2026:** por um período coexistiram `CONHECIMENTO-BAROLO.md` (este arquivo, rastreado no git, espelhando o bloco do `CLAUDE.md`) e um rascunho não versionado `CONHECIMENTOBAROLO.md` (sem hífen) com revisões mais novas (§3.2/§3.4/§8.5 corrigidas, §3.2.1/§8.6/§16 novas) mas com um cabeçalho que alegava — **incorretamente** — que este arquivo com hífen não existia e que o bloco `KB-START`/`KB-END` não existia no `CLAUDE.md`. As duas alegações eram falsas; os dois arquivos foram fundidos nesta versão e o rascunho sem hífen foi removido.
> **O que já existia no CLAUDE.md antes** (não repetido aqui em detalhe): posições atuais, tabela de pools, ciclos de empréstimo, logs de sessão do site, arquitetura do dashboard. **O que é novo aqui:** todo o conteúdo do Notion + a síntese de filosofia/estratégia/decisões.

---

## 1. Quem é Lucas / o que é a Barolo Capital

- **Gestão independente e individual de capital próprio** em criptoativos. Não é empresa que capta cliente, não é serviço vendido a terceiros. O site é **prova de competência técnica**, não portfólio público.
- **Desde 2021.** 1ª compra de ETH em **13/12/2021** (0,0130 ETH @ US$ 4.002,90) e 2ª em **16/12/2021** (0,0084 ETH @ US$ 3.979). A série de performance é medida a partir de **jan/2022** (1º mês completo) — por isso "desde 2021" e "CAGR 2022–2026" convivem sem contradição.
- **Horizonte: +10 anos.** DCA mensal fiat→cripto. Bear market = oportunidade de compra, não razão para sair.
- **Concentração intencional em ETH + SOL** (entende os protocolos profundamente). BTC como base. Alts menores mantidas por opcionalidade, sem realizar prejuízo.
- **Objetivo final:** o **yield pagar a vida sem tocar no capital** — mesma lógica do aluguel de imóvel e dos dividendos do Barsi. O capital fica trabalhando.
- **Sucesso é medido em ativos acumulados (tokens), não no preço em dólar.**
- **Meta original registrada no Notion (página META):** aporte inicial ~US$ 2.000, ~US$ 400/mês (~US$ 13,33/dia) → **US$ 10.000 em ~25 meses** (ou 50 meses a US$ 200/mês).
- **Privacidade é regra, não preferência:** "quero ser **efetivo**, não **visto**". Nada de endereço de carteira em URL pública, nada de identificadores únicos (NFT ID, endereço Cardano completo), `robots.txt` bloqueando tudo, `noindex` em todas as páginas.

### 1.1 Referências intelectuais confirmadas
| Referência | O que Lucas extrai |
|---|---|
| **Luiz Barsi Filho** | Dividendos; capital intocado, yield paga a vida → analogia direta com DeFi |
| **Stormer** | Trades e leitura de empresas; "comprar suporte em tendência de alta, vender resistência em tendência de baixa" |
| **Howard Marks** | Ciclos e risco assimétrico — "risco significa que mais coisas podem acontecer do que realmente acontecerão" |
| **Charlie Munger** | Qualidade e paciência; comprar bons ativos e não fazer nada |
| **Zé Mograbi** | "Enquanto o MEDO DE PERDER for maior que a vontade de GANHAR, você não performa no mercado (nem na vida)" |
| **Nassim Taleb** | "Quanto mais restrito, limitado ou escasso é um recurso, mais ele é sensível a choques" — escassez = volatilidade |

### 1.2 Manifesto Barolo Capital (literal, do Painel Notion)
> Riqueza real é construída com **consistência**, não com pressa.
> 1. Não buscamos o maior ganho, buscamos o ganho **sustentável**
> 2. Antes de ganhar dinheiro, **evitamos perder**
> 3. O **tempo no mercado** vence o timing do mercado
> 4. Decisões boas vêm de **mente calma**, não de urgência
> 5. Preferimos ganhar menos com **paz** do que mais com caos
> 6. Se **não é simples de entender**, não merece capital
> 7. O dinheiro existe para comprar **tempo e liberdade**

> "Nosso objetivo não é acertar o topo ou o fundo do mercado, mas navegar por ele com disciplina, preservando capital e capturando oportunidades ao longo do tempo. Valorizamos clareza, simplicidade e liberdade — porque o verdadeiro retorno não está apenas no dinheiro, mas na vida que ele permite construir."

---

## 2. Estratégia operacional — como o capital realmente trabalha

### 2.1 As três camadas de yield (risco crescente)
| Camada | Onde | Yield típico | Risco |
|---|---|---|---|
| **Lending passivo** | AAVE V4 (Ethereum) + Kamino (Solana) | 2–6% | Contrato + liquidação |
| **Pools ativas** | Uniswap V3/V4 (~5% do patrimônio) | 20–120% APR | IL + contrato + range |
| **Spot puro** | Resto da carteira | 0% | Exposição direcional |

### 2.2 Alavancagem produtiva anticíclica (o núcleo da operação)
O loop que Lucas descreve com as próprias palavras:
1. Colateral (WETH/USDT/SOL/USDS) depositado na AAVE/Kamino
2. Toma **USD emprestado** contra esse colateral
3. Compra ETH → monta **pool de liquidez**
4. A pool **paga o empréstimo com as taxas em dólar**; o ETH das taxas é acumulado
5. **Pool sai do range para baixo** → acumula mais ETH com USD (compra anticíclica automática)
6. **Pool sai do range para cima** → vende ETH acumulado + USD → paga a dívida
7. Fiat disponível como último recurso

**Avaliação:** é **alavancagem defensiva, não agressiva**. A estrutura *força* comportamento anticíclico por design — o operador não precisa ter disciplina no momento do pânico, o mecanismo já compra na queda.

**Risco principal identificado (monitorar):** o **spread entre custo do empréstimo e yield da pool pode comprimir em bull** (borrow APY sobe, volatilidade da pool cai). Monitorar a *diferença*, não só o yield bruto.

**Calibração de tamanho:** ~5% do patrimônio em pools hoje (conservador, dado o drawdown em dólar). Ideal: **aumentar em lateralização, reduzir em bull acelerado**.

### 2.3 Pools como estratégia de saída gradual — regra inegociável
- A pool ativa **não é só para taxas**: entra ~100% em ETH e sai em stable conforme o preço sobe. É uma **ordem de venda escalonada que paga para existir**.
- **Referência de performance sempre em USD.** Nunca em HOLD, nunca em ETH. (Lucas foi explícito: *"essa pool é da estratégia de venda, entrei full ETH e to saindo full USDT, deve ser vista e monitorada com a referência em USD não em HOLD nem em ETH"*.)
- A pool **migra de rede**. Histórico: Ethereum/Arbitrum (2024–25) → Base (fev–jul/2026) → **Robinhood Chain (desde 14/07/2026, atual)**. Nunca assumir a rede — sempre conferir em `data.js → defi.uniswapV3.network` antes de qualquer chamada on-chain.
- ⚠️ **A posição ativa foi remontada em 07/08/2026** na MESMA pool v3 WETH/USDG (tentativa de migrar para v4 falhou). Para a Revert é **uma posição contínua desde 14/07** (mesma NFT); no site o ciclo 1 está lançado como fechado ($13,04) para não duplicar o YTD. Campos de *estoque* em `data.js` = ciclo 2; campos de *taxa* (apr/feeApr) = lifetime.

### 2.4 Playbook operacional de pools (extraído do Diário DeFi, 2024–2026)
- **Fee tiers:** 0,01% stables · 0,05% pares estáveis · 0,3% maioria dos pares · 1% exóticos.
- **Estimar retorno:** `Fees 24h × dias que pretende ficar ÷ TVL`.
- **4 estratégias de range (Uniswap):**
  1. **Semanal / DCA de compra** — mínimo no preço onde quer comprar o ativo, máximo na resistência superior. Acumula bem na queda, mas taxa baixa se o range for largo demais.
  2. **Semanal / 2 ativos correlacionados** (ex.: LINK/ETH) — ganhar taxa nas duas pontas por um bom período.
  3. **4h / range apertado em lateralização** — identificar suporte e resistência em TF menor, gerar mais taxas. Boa para fim de semana.
  4. **Semanal / mono-ativo em suporte** — abrir com um ativo só para comprar mais barato em momento de liquidez.
- **Regras práticas aprendidas na prática:**
  - Saiu do range → **esperar pelo menos 24h** antes de remontar (não reagir no impulso).
  - Mercado caiu forte → **reposicionar a pool mais baixo** para capturar o bounce.
  - Recolher taxas e **reinvestir em token** quando o objetivo é acumular; usar as taxas em **stable para repagar o empréstimo** quando o objetivo é desalavancar.
  - Usar **VPVR (zonas de acumulação)** para desenhar o range.
  - **Não esticar demais o range**: uma pool ficou 100 dias esperando sair do range e o retorno foi baixo demais. Lição: metade da largura, seguindo a acumulação do VPVR.
  - Rede nova costuma pagar mais (TVL baixo vs volume) — foi exatamente o motivo da migração para Base e depois Robinhood Chain.
  - Remontar tem custo de gas: em rede cara, remontagem frequente come o retorno.

### 2.5 Rotina semanal de gestão (checklist do Painel Barolo)
**🧠 Reflexão da semana:** Como me senti em relação ao mercado? O mercado já precificou? O consenso está otimista demais / o cenário ruim já está no preço?
**📊 Revisão de estratégia:** Minha tese principal continua válida? Alguma mudança significativa exige revisão? Adicionei novas ideias/projetos para estudo?
**🔍 Riscos atuais:** Estamos em risco extremo? O risco está alto ou baixo? O mercado está complacente? Estou desconfortável?
**📌 Tarefas técnicas** + **🗂️ Anotações/insights**.

---

## 3. Portfólio — estado, metodologia e histórico

### 3.1 Metodologia canônica (NÃO violar)
- **Fonte única de posições: `data.js`** (`window.BAROLO_DATA`). Todas as 6 páginas HTML leem dele. Atualização mensal = **editar só o `data.js`**.
- **As quantidades de holdings JÁ INCLUEM o colateral depositado em AAVE/Kamino** — Lucas não separa carteira vs DeFi no CoinGecko. Portanto **`Patrimônio = total holdings + LP − dívida`**. **NUNCA somar o colateral por cima** (dupla contagem). O bloco `defi` é uma *view* do lending, não posição aditiva.
- **`invested` = USD efetivamente pago**, não o "custo" derivado do CoinGecko (`valor − P&L`), que gerava artefato em stablecoins (USDT aparecia com "lucro").
- **`principals`** (bloco no `data.js`) = *cost basis* do lending (principal depositado/emprestado, **sem juros**). Deve ser atualizado a cada depósito, saque ou reempréstimo — senão **aporte novo aparece como rendimento** (bug real que ocorreu em 14/08/2026).
- **Fees de pool são contabilizadas por data de COLETA/fechamento**, não de abertura. Isso mudou o P&L 2026 YTD de ~$39 para ~$96.

### 3.2 Composição (baseline `data.js` asOf **14/08/2026**; valores vivos em `data.js` + `briefing.json`)

| Token | Qtd | Invested (US$) |
|---|---|---|
| BTC | 0,00434195 | 270,47 |
| ETH | 2,37632741 | 4.880,53 |
| SOL | 24,765222 | 2.533,36 |
| ADA | 375,245 | 530,95 |
| EIGEN | 153,363 | 45,87 |
| RDNT | 7.290,46 | 0 (airdrop) |
| POL | 218 | 143,88 |
| ZK | 876 | 0 (airdrop) |
| XAI | 692,86 | 164,52 |
| ZETA | 51,1434 | 0 (airdrop) |
| SCR | 0,0018 | 0 |
| **USDT** | 1.302,524 | 1.302,52 |
| **USDS** | 317,44 | 300,00 |

**DeFi (view do lending — já contido acima):**
- **AAVE V4** — supply 2,16 WETH @1,83% + 1.600 USDT @2,17% · borrow **760,17 USDC @3,79%** · colateral **US$ 5.658,25** · **HF real 6,04** · LTV 13,4%
- **Kamino** — supply 24,48 SOL @4,47% + 304,07 USDS @4,06% · borrow **823,63 USDC @5,92%** · LTV **38,4%** vs liq. LTV **77,1%** (SOL liquidaria em ~US$ 28,90 = −61,6%)
- **Pool ativa** — WETH/USDG 0,01% · Robinhood Chain · pooled US$ 358,14 + US$ 1,81 de fees não coletadas · in-range · fee APR 50,91% / total APR 64,57%

### 3.2.1 Agregados (15/08/2026, `briefing.json`)

| | |
|---|---|
| **Patrimônio líquido** | **US$ 7.125,72** |
| Bruto (holdings, inclui colateral DeFi) | US$ 6.725,04 |
| Stables | US$ 1.619,96 (USDT 1.302,52 + USDS 317,44) |
| LP | US$ 359,95 = **5,05% do patrimônio** |
| **Dívida total** | **US$ 1.583,80** (AAVE 760,17 + Kamino 823,63) |
| Dívida / patrimônio | **22,2%** |
| Custo de borrow ponderado | **4,90%** |
| **Total investido (USD pago)** | **US$ 10.172,10** |
| ROI | **−29,9%** em USD (≈ break-even em BRL) |

**Carry da estrutura de lending:** supply yield US$ 203,59/ano − custo de borrow US$ 77,57/ano = **+US$ 126,02/ano (+US$ 10,50/mês)**. Somando a pool (US$ 360 a 32% de fee APR realizado ≈ US$ 116/ano), a máquina DeFi inteira rende **≈ US$ 242/ano = 3,4% do patrimônio**.

⚠️ **A cauda de alts está praticamente zerada:** BTC+ETH+SOL = US$ 6.599,74 dos US$ 6.725,04 brutos. Os **sete alts somados (ADA, EIGEN, RDNT, POL, ZK, XAI, ZETA) valem ~US$ 125,30**, contra **US$ 885,22 investidos** — uma perda de ~86% que já está realizada economicamente, ainda que não fiscalmente.

### 3.3 Custo de aquisição em BRL (base para IR)
Consolidado dos extratos Binance + OKX (out/2021 → jun/2026), em `Custo_BRL_Consolidado_Lucas.xlsx`:
- **Total fiat→cripto: R$ 35.498,19** (Binance R$ 29.664,20 + OKX R$ 5.065,50)
- **Câmbio médio de entrada: R$ 5,36/USD** (derivado das stables)
- Por token: BTC R$ 296.174/un · ETH R$ 15.096/un · SOL R$ 903,63/un · ADA R$ 12,06 · XAI R$ 1,29 · USDT R$ 5,41 · USDC R$ 5,46 · BUSD R$ 5,22
- **Achado importante:** com o dólar em ~5,12, o patrimônio em BRL fica em **~break-even (−0,3%)** — o câmbio amorteceu boa parte do drawdown em USD.
- **IR:** Bens e Direitos grupo 08 (códigos 01/02/03), declarar pelo custo, obrigatório ≥ R$ 5k por tipo. Isenção R$ 35k/mês (nacional). Lei 14.754/2023 → 15% exterior. IN 1888 → declarar acima de R$ 30k/mês. **Permuta cripto↔cripto conta como alienação.**

### 3.4 Track record de pools — **recomputado em 18/08/2026** (29 registros em `pools.html`)

Números conferidos direto do array `POOLS`, ponderados por **capital-dias** (não por número de pools):

| Grupo | n | Fee APR | **P&L APR** | P&L total | W / L |
|---|---|---|---|---|---|
| **"Chatas"** (par com stable ou blue-chip) | 22 | 44,4% | **+44,1%** | **+US$ 1.044,39** | 22 / 0 |
| **Narrativa** (GRIFT, PEANUT, PENG, XAI) | 7 | **610,4%** | **−798,8%** | **−US$ 1.844,00** | 1 / 6 |
| Só pares com stablecoin | 14 | 34,1% | +33,7% | +US$ 580,39 | 14 / 0 |
| **TODAS** | **29** | **94,7%** | **−30,8%** | **−US$ 799,61** | 23 / 6 |

**Taxas brutas acumuladas: US$ 2.459,94.** Fees realizadas por ano (data de coleta/fechamento):
**2023 US$ 377 (P&L +377) · 2024 US$ 562 (P&L +239) · 2025 US$ 1.403 (P&L −1.527) · 2026 YTD US$ 118 (P&L +111)**.

**Evolução — a virada é datável em 05/05/2025 (fechamento do GRIFT):**

| Período | n | Fee APR | **P&L APR** |
|---|---|---|---|
| Até o GRIFT fechar (≤05/2025) | 21 | 108,4% | **−41,6%** |
| Pós-GRIFT (>05/2025) | 8 | 28,2% | **+21,9%** |
| Só 2026 | 5 | 32,0% | **+28,6%** |

**Os aprendizados de pool:**
1. **A separação chatas × narrativa é perfeita, não é tendência** — 22 vitórias e zero derrotas nas chatas; 1 vitória e 6 derrotas nas de narrativa.
2. **APR alto foi indicador INVERSO de retorno.** As pools de narrativa tiveram **14x** o fee APR das chatas e destruíram capital a −799%/ano. Selecionar pool por APR anda na direção errada.
3. **SOL/GRIFT 2% (80 dias)** — taxas de +US$ 1.389 e IL de US$ 2.899 porque o token foi a zero. Resultado −US$ 1.510. O erro não foi entrar: foi **ampliar dentro da queda** (4 SOL → 10 SOL) e não sair. Lucas recuperou as SOL depois via lending na Kamino.
4. **PEANUT/ETH 1% (10 dias)** — −US$ 243 de IL puro, zero taxas, token scam. Causa registrada no diário: ficou doente logo após montar e não conseguiu acompanhar.
5. **Pares "chatos" (ETH/USDC, ARB/USDC, ETH/USDT)** — praticamente todo o P&L positivo veio deles. *"Um bom investimento é chato."*

### 3.5 Eventos especiais
- **Hack da Radiant Capital (2025):** 1.079,17 ARB em stake desde 25/03/2024 perdidos. Valor na época ~US$ 971, prejuízo efetivo ~US$ 671. Reembolso de ~$300 prometido e pendente — **dado como perdido**. Não entra no P&L operacional de pools.
- **Flash crash 10/10/2025:** maior liquidação da história até então (~US$ 19 bi), disparado pelo anúncio de tarifas de 100% sobre a China e revertido no dia seguinte. Lucas **não foi liquidado** e comprou ETH e SOL na queda. Leitura dele: *"foi pura manipulação... o mercado ainda é uma selva"* → e a conclusão prática: **pools de liquidez são melhor fonte de fluxo de caixa que trade alavancado em eventos assim**.
- **Ciclos de empréstimo:** Kamino K1–K3 fechados, **K4 aberto**; AAVE A1–A2 fechados (V3), **A3 aberto** (migrado para V4 em 01/04/2026). Refinanciamentos frequentes trocando o token de dívida (GHO → USDC → USDG → USDC) sempre buscando o APR de borrow mais baixo.

---

## 4. As 31 regras de DeFi (estudo âncora do Notion)

> *"31 pedaços de sabedoria que eu gostaria de poder enviar de volta no tempo para mim mesmo."*

**Sobre projetos e narrativas**
1. Projetos com cultos podem ser extremamente lucrativos — basta sair do foguete antes que ele caia.
2. Não vale a pena **travar tokens** por rendimento adicional. Nada pior que estar amarrado a uma pia que afunda.
3. **Proteja sua atenção a todo custo.** Tempo e energia são limitados; não desperdice com drama do CT.
4. Cuidado com **otimização excessiva de rendimento** — não existe almoço grátis. Cada camada extra de yield traz mais risco.
5. Seja cético com **todo** conselho do Crypto Twitter — todo mundo tem agenda.
6. Nova narrativa → viés para os **líderes de mercado** (vantagem de first-mover e mind share). Melhores betas: forks em chains novas e quentes.
7. Obsessão por ferramentas novas é procrastinação. Os maiores usam Etherscan, DeBank, DefiLlama. *"Não temo o homem que praticou 10.000 chutes; temo o homem que praticou um chute 10.000 vezes."* (Bruce Lee)

**Sobre informação e alfa**
8. Existe **cadeia alimentar de informação**: Builders > VC/Insiders > Baleias > Bots > traders manuais rápidos > traders manuais lentos. Quando divulgam no Twitter, já é tarde.
9. Alfa = ter informação privilegiada **ou** fazer o trabalho duro que os outros têm preguiça de fazer (ler Medium do protocolo e o Discord).
10. Tudo se repete, só reembalado. DeFi é **reconhecimento de padrões**.
11. Posicione-se cedo e deixe os ganhos chegarem. **FOMO é sinal de que pode ser tarde demais.**

**Sobre gestão e psicologia**
12. Veja P&L como **% do portfólio**, não em $. Comparar trade com compras da vida real destrói a racionalidade.
13. **Corte os perdedores agressivamente.** Defina o stop e saiba sair antes de entrar.
14. **Grave tudo.** Diário do que aconteceu, dos trades, dos erros e das lições — é assim que se melhora o algoritmo mental.
15. Não superestime fundamentos em **bull**: a lógica evapora. Veja a indústria como ela é, não como deveria ser.
16. **Incentivos movem preço** (airdrop, lock por recompensa, incentivo de ecossistema).
17. Não coloque ninguém em pedestal — Alameda e 3AC eram "os mais espertos da sala". **Proteja os fundos ao primeiro rumor de insolvência**: se estiver certo, salvou muito; se errado, perdeu alguns minutos.
18. Não se trata de estar certo — trata-se de **maximizar quando está certo e limitar quando está errado**.
19. **Estreitar o foco é vantagem subestimada.** Escolha poucos setores e domine-os.
20. Acompanhar **macro é superestimado**; basta monitorar fluxo de capital para os mercados. *"A história dos economistas na previsão de acontecimentos é monstruosamente errada."* (Taleb)
21. **Não toque em cripto em tilt, bêbado ou com sono.** Um erro apaga anos.
22. **Stablecoins não são tão estáveis**: UST colapsou, USDC teve susto de depeg. Guardar pó seco em fiat no banco é totalmente viável.
23. **Concentre para crescer o portfólio; diversifique para mantê-lo.**
24. **Desenvolva sistemas** — regras impedem que a emoção mate o jogo.
25. Achar que vai fazer 100x num trade não é realista. 99% das pessoas ficam melhor **aumentando o fluxo de caixa** e colocando mais metas no fogo.
26. A galera prefere **novos projetos e narrativas** — não suas bags de 2021. Não lute contra a natureza humana.
27. (repetição deliberada) Ceticismo com o CT. **Cuidado com você mesmo.**
28. Pare de se limitar a conteúdo cripto — **teoria dos jogos, economia comportamental e psicologia** ensinam mais que o nono artigo sobre EigenLayer.
29. Os melhores projetos têm **fundamentos + incentivos**: "pumpmentals" captam atenção, fundamentos dão motivo para continuar segurando.
30. **As incógnitas desconhecidas são mortais** (fundador jogando com o tesouro, passado duvidoso). Não dá para prever → **realização de lucro, tamanho de posição e gestão de portfólio são as defesas críticas**.
31. **Realizar lucro e colocar em apostas mais arriscadas NÃO é realizar lucro — é jogo.** Trave lucros em BTC, ETH, stablecoins e fiat.

> Fechamento do autor (que Lucas adotou): *"Ainda tenho a maior convicção no DeFi — apostei a próxima década da minha vida nisso. Por quê? Eficiência. Transparência. Um novo mundo onde temos mais controle sobre o nosso dinheiro suado."*

---

## 5. Framework de Análise Fundamentalista (Notion)

> *"A análise fundamentalista busca resumir o máximo possível de informação para ser consumida rápido — sabendo o que está escrevendo."*

**Etapa 1 — Identificação do projeto:** tem ecossistema próprio ou está em algum? (objetivo: diversificar ecossistemas) · tipo de projeto · focos de atuação · algum ponto muito relevante · o que é e o que faz.

**Etapa 2 — Proposta de valor:** quais as vantagens? algum serviço exclusivo/inovador? quais serviços são oferecidos? (achar descendo a home e nos docs). Etapa abstrata — muitos projetos fazem "uga buga" e querem vender o peixe.

**Etapa 3 — Tokenomics** (a mais importante):
- **Alocação inicial** — mineração aberta vs pré-alocação. Tipos de participação: Fundadores/Foundation · Early Adopters/Advisors ("amigos do rei") · Dev/Marketing/Time · Market-Makers/Liquidity Mining · Airdrops/Growth · DAO/Treasury/Ecosystem · Public Sale/ICO · Pre-Sale/Seed/VCs · Validadores.
- **Regra de bolso: "regra de 1/3"** — se nenhum participante passa de ~1/3, está razoável. Exemplos analisados: **ETH** (só 16% para "amigos do rei" — bom) · **Chainlink** (30% empresa — justo) · **Solana** (⚠️ Fundação e Time são a mesma coisa + venda da fundação volta pros founders + seed fechado → **alocação centralizada**, beneficiou muito mais time e investidores que o público) · **Manta** (investidores <30%, time <30%, >10% airdrop → parece justa).
- *"O fundamentalismo agnóstico não se prende ao romantismo — pondere todos os lados. Um projeto pode ser centralizado, mas ter boa proposta de valor e bom time; pode valer arriscar. Dose o risco."*
- **Agenda de distribuição:** TGE (Token Generation Event) · **CLIFF** (abismo antes da 1ª nova distribuição) · **VESTING** (em quantas parcelas o restante é liberado). ⚠️ Cuidado com unlock "em porrada" (ex.: **PYTH** — longo cliff seguido de destrave enorme). ✅ **NEAR** é exemplo bom: unlock em curva, lento e gradual, e já distribuiu grande parte. Onde ver: docs do projeto, TokenUnlocks, CryptoRank (aba Vesting), CoinGecko, CMC.
- **Política monetária:**
  - *A ilusão da escassez* — escassez não é regra para valor; **escassez é sinônimo de volatilidade**. Procure ativos escassos **com demanda**.
  - **Emissão estática** (max supply fixo, sem queima): menos adaptável, menos sustentável, mais simples, mais previsível → bom para *commodities*.
  - **Emissão dinâmica** (emite + queima): menos previsível, mais complexa, mais adaptável, mais sustentável → bom para *sistemas econômicos*.
  - Como identificar: se **Total Supply == Max Supply** → estática. Se **Max Supply == ∞** → dinâmica. Inflação real e queima só nos docs/whitepaper.
  - **Staking** contribui para escassez, mas as recompensas são tokens impressos — **duas forças que se contrabalançam**. Blockchains *precisam* de staking; aplicativos não precisam (o staking de app é mais especulativo).
  - **Casos de uso do token:** utilitário/gas · staking · **governança (token que não serve para nada, se for só isso)**.
  - **Real Yield** — o primeiro foi o GMX: quem opera paga taxa, parte vai para LPs e parte para quem faz staking. O token realmente participa da economia. ⚠️ Problema: começa a se parecer com ação que paga dividendo → **risco regulatório**. Defesa: é *revenue sharing* programado no protocolo, não decisão voluntária de uma empresa.

**Etapa 4 — Estado atual e roadmap:** posição em market cap · TVL · fees/revenue vs concorrentes · dashboards (Dune) · **datar o estudo** (muda constantemente). Fases: DEVNET → TESTNET → MAINNET → UPGRADES.

**Etapa 5 — Considerações e decisão:** resumir pontos fortes / de atenção / críticos → avaliar destravas de valor, força da narrativa, perspectivas no ciclo → decidir: **ter ou não exposição, qual risco da exposição, qual perfil de portfólio**.

---

## 6. Métricas on-chain de DeFi — como avaliar de verdade

> *"Fundamentos on-chain dão ao DeFi uma vantagem sobre o TradFi. As finanças dos protocolos estão disponíveis em tempo real."*
> *"As métricas de receita estão entre as mais difíceis de falsificar, porque exigem que usuários realmente gastem dinheiro."*

| Métrica | O que é | Armadilha |
|---|---|---|
| **TVL** | Análogo ao **AUM** de um hedge fund. Mede confiança nos contratos e tamanho do protocolo. | **Não mede atividade.** Correlaciona com preço: se ETH cai 30%, todo TVL em ETH cai 30% **sem nenhuma saída real**. → Olhe **entradas em USD** junto com o TVL (Δsaldo por ativo × preço, somado). |
| **Fees** | Perspectiva do usuário: quanto foi pago para usar. ≈ **Receita bruta**. | Pode ir 100% para LPs. |
| **Revenue** | O corte que o **protocolo** guarda (tesouro, time, holders). ≈ **Renda bruta**. | Alguns geram fees enormes e revenue mínimo. |
| **Holders Revenue** | A parcela que chega ao **detentor do token** (recompra, queima, distribuição). ≈ **dividendo + buyback**. | É o que realmente importa para valuation do token. |
| **Volume (DEX/Perp)** | Atividade de negociação. | Comparação histórica perde sentido (setor cresceu muito). **Participação de mercado dentro da categoria** importa mais que volume absoluto. |
| **Open Interest** | Valor de contratos de derivativos em aberto = liquidez de perp DEX. | Colapsa em horas numa cascata de liquidação. Observar a **recuperação** revela se a liquidez voltou ou migrou de vez. |
| **Market cap de stablecoins na chain** | **Entrada de capital real** na rede. Crescer de $3bi → $8bi = $5bi de dinheiro novo. | Desde out/2023, ~$180bi de stablecoins entraram nas redes. |
| **App Fees / App Revenue** | ≈ **PIB da blockchain** (exclui stablecoins, staking líquido e gas). | **Não serve para valuation** (o token não tem direito a essa receita) — serve para **diagnosticar crescimento**. |

**A estrutura de decisão (3 regras):**
1. **Priorize crescimento constante e consistente.** Um pico que colapsa não diz nada. *"O tempo passa mais rápido em cripto: um mês de crescimento consistente equivale a ~4 anos em mercados tradicionais. Seis meses de expansão de receita = uma empresa com seis trimestres de melhora de lucro."*
2. **Combine uma métrica de STOCK com uma de FLOW.**
   - *Stock* (quanto está depositado): TVL, open interest, market cap de stablecoin, tesouraria.
   - *Flow* (quanto está acontecendo): fees, revenue, volume.
   - **Atividade é fácil de falsificar** (incentivo, wash trading); **liquidez é difícil de fabricar**.
   - Por tipo: Perp DEX → OI + volume · Lending → TVL + fees · Chain → mcap de stablecoin + app fees.
   - Só flow crescendo com stock estagnado → investigue, pode ser artificial. Só stock crescendo → pode ser um punhado de baleias.
3. **Conte desbloqueios e incentivos.** 90% do supply circulante = diluição futura mínima; 20% com cliff em 3 meses = configuração muito diferente. Receita alta impressiona menos se o protocolo distribui mais incentivo do que arrecada (DefiLlama rastreia isso como *Earnings*).

**Ferramentas:** DefiLlama (protocol, stablecoins/chains, open-interest, pro), Dune Analytics, Etherscan, DeBank, TokenUnlocks, CryptoRank, stakingrewards.com.

---

## 7. Análise Técnica — o corpo de conhecimento completo

> *"Análise técnica é uma mistura de arte, matemática e uma pitada de bom senso."* (Mark J. Pring)
> *"É a arte de prever movimentos e mudanças de tendência baseado em evidências."* (Rodrigo Tech)
> *"Todas as métricas de uma entrada devem ser atingidas antes de ser efetuado o trade."*

### 7.1 Fundamentos
- **Candles:** o pavio conta a história, **o fechamento (corpo) conta os fatos**. Quanto maior o tempo gráfico, mais pertinente a informação e menos ruído.
- **Tendência** = conjunto de movimentos erráticos que tendem mais para um lado. É **fractal**. A corrida do touro leva **mais tempo**; a queda do urso é **mais rápida**.
  - Topos e fundos **ascendentes** = alta; **descendentes** = baixa.
  - Primária (pernada, ~3 movimentos) · Secundária (pullback de **1/3 a 2/3**, usar Fibonacci) · Oscilação micro.
  - *"Presuma que a tendência segue até que ela rompa sua sequência de topos e fundos."*
  - **Pivot de reversão:** fundo descendente → topo descendente → rompimento do fundo prévio = confirmação.
  - Consolidações/lateralizações contam como topo ou fundo.
- **Teoria de Dow (analogia da maré):** a maré é a tendência maior; as ondas quebram cada vez mais longe enquanto o mar enche. **As pequenas ondas não mudam a maré.**
- **Suporte e resistência:** marcar como **ZONAS**, do TF maior para o menor. Suporte rompido vira resistência. Pontos emocionais (ATH prévia, quedas em meio a subida forte) e **números redondos** têm muita pertinência. Quanto **mais horizontal, mais forte**. Quanto mais vezes uma zona é testada, **mais fraca** ela fica — até romper. Em cripto, zona testada e não rompida costuma vir seguida de movimento forte.
- **Linhas de tendência:** mínimo **3 toques**, traçadas como zonas (pelo corpo ou pela sombra). A **angulação mede a força** — muito íngreme o mercado não sustenta por muito tempo. **Estender as LTs** para ver o comportamento invertido (spyderlines).
- **Volume:** o mercado está em estado constante de **movimento e consolidação**. Consolidação = soma das decisões de compradores e vendedores sobre o novo patamar → **retração da volatilidade**. O volume **sempre retrai para formar um novo padrão**; ao ultrapassar, cria vácuo e o preço é puxado. **Volume que decai não é fraqueza no curto prazo — é consolidação.** No longo prazo (1D/1S/1M), queda de volume após rally parabólico = sinal de exaustão. **Volume marca topos e fundos.**

### 7.2 Padrões gráficos
- **Fundo duplo** (fim de baixa, bullish) / **Topo duplo** (fim de alta, bearish) — o 2º fundo só precisa chegar **próximo** da zona; se romper, descarta-se. **Neckline** = zona de gatilho. Alvo = altura do padrão projetada do rompimento; **em cripto costuma levar no mínimo 2 movimentos** para atingir o alvo (o 1º pega ~metade, reteste, segue).
- **OCO e OCO invertido** — alvo do topo da cabeça até a neckline, projetado a partir da neckline. **Média de acerto altíssima quando combinado com outros indicadores.**
- **Xícara e alça** — recuperação gradativa; rompimento agressivo; mais forte em fim de tendência e TF maiores.
- **Triângulos** (todos os TFs): ascendente = altista · descendente = baixista · simétrico/horizontal = neutro, segue a tendência superior (50/50). **Regra do vértice: o rompimento vem entre 70% e 90% do caminho até o vértice — nunca chega no vértice.** Alvo = amplitude máxima (altura dos 2 primeiros toques) projetada do rompimento.
- **Cunhas** (mais em TFs menores): ascendente rompe geralmente **para baixo**; descendente, **para cima**. Alvo da ascendente na base da cunha. Quanto mais íngreme, mais forte o movimento contrário. *"Construir demora mais do que demolir"* — quedas são mais agressivas.
- **Bandeiras** (touro/urso) — pernada + lateralização contra a tendência. Alvo ≈ tamanho da pernada projetado do fundo do canal de correção; para ser assertivo, pegar 10–12% do topo e fazer uma **zona**.
- **Canais paralelos** — leem oscilações máximas e mínimas da consolidação; a **linha média** norteia.
- **Breakout:** rompimento **com grande volume** + **reteste** = altamente assertivo. Sem volume → suspeitar de falso rompimento.
- **Pivot de alta:** rompe resistência → reteste como suporte → rompe o topo prévio. **Pivot de baixa:** o inverso.
- ⚠️ *"Quando esses padrões falham, geralmente estão acontecendo CONTRA a tendência superior."*

### 7.3 Médias móveis
- São **áreas dinâmicas de suporte e resistência** (Pring). Não existe média escrita em pedra — testar por TF.
- Mais usadas: **8/9, 20, 50, 100, 200**. **MA** (simples) no tradicional; **EMA/WMA** em cripto (respondem mais rápido).
- **Indicadores atrasados**: cruzamento diz o que já aconteceu. Cruzamento **longe da ação de preço → pouco peso**; **perto → mais peso**.
- Bull: preço busca as médias como **suporte**; bear: como **resistência**. Quanto maior a média, mais significativa (**200 é o forte indicador do BTC**).
- **Semanal:** EMA 8/9, 50 e 200. **Diário:** EMA 20 e 50. **EMA Ribbon (20→55, 8 médias)**: quando comprimem, a leitura fica pobre (suporte e resistência ao mesmo tempo).
- **Confluência** (várias evidências apontando para o mesmo lado) é o sinal mais forte de reversão.

### 7.4 Indicadores
Quatro categorias: **momento/inércia · volatilidade (BB, BBWP) · volume (OBV) · tendência**.
- **RSI (IFR)** — 0 a 100, canal 30–70. *"O preço é um elástico."* Em bull o preço oscila do meio para cima (retesta a 50 e volta acima de 70); em bear, do meio para baixo. **Divergências**: preço faz fundo descendente e RSI fundo ascendente (alta) — ou preço topo ascendente e RSI topo descendente (baixa). No diário, **esperar de 2 a 3 divergências** para confirmar a tese. Topos laterais no RSI com topos ascendentes no preço também é alerta.
- **MACD** — médias 26 e 12, sinal 9. **Cruzamento longe do meio → reversão maior; perto do meio → lateralização.** Oscilador **solto** (não preso 0–100) — usar para **confirmar divergências vistas no RSI** (que é preso).
- **Estocástico** (e **Estocástico RSI**, mais volátil) — cruzamento **preferencialmente fora do canal**. O normal lê melhor o local; o de RSI lê melhor o movimento.
- **Bandas de Bollinger** — média 20 + volatilidade. **Compressão = consolidação, antecede grande movimento.** Vazou a banda, tende a voltar.
- **BBWP** (Bollinger Bands Width Percentile) — lê **timing**, não direção. Abaixo de 25% → grande movimento vindo. Perto de 100% → expansão/exaustão. Leitura falha em grandes topos/fundos.
- **OBV** — volume + tendência, oscilador solto. Valida congruências do RSI. Mapear topos/fundos e divergências.
- **VuManChu Cipher B** — 8 indicadores num só: RSI (curto prazo), Nuvem de Inércia (MACD preso, bolinhas verde/vermelha de reversão), Money Flow (entrada/saída de capital), nuvem VWAP. **No macro o smart money opera CONTRA a VWAP**, tanto no fundo quanto no topo. Cruzamentos valem mais nos extremos. Dois sinais próximos da mesma cor = **"snake eyes"**. Melhor no semanal e no 4h. **Descobrir por backtest em qual TF funciona melhor.**

### 7.5 Fibonacci
- Razão **1,618** — como as coisas se expandem e se retraem.
- **Retração:** traçar do fundo ao topo (alta) ou do topo ao fundo (baixa). Regra clássica: retração de **1/3 (0,38) a 2/3 (0,61)**. **"Coração da fibo"**: 90% das retrações ficam entre 0,3 e 0,61, respingando no 0,7 e no 0,2. **O mais importante é o 0,618 (Golden Pocket).**
- Retração **rasa (0,2–0,38) = tendência forte**; perder o 0,618 = tendência enfraquecida; **romper o 1 = tendência virou**.
- **Extensão** para alvos (1º alvo relevante: 0,618; o 1 costuma marcar o fim do movimento). **Garfo de Schiff** — a linha do meio é a mais pertinente para segurar a tendência.
- ⚠️ Fibo **não funciona bem em lateralização**. Em TFs menores, **desligar a escala LOG** do gráfico e da fibo.

### 7.6 Gestão de risco (o núcleo)
- **Disposição ao risco** (% do portfólio em risco por operação, 1–5%) e **tamanho de posição** são coisas diferentes e complementares.
- **Fórmula:** `Tamanho da posição = (Tamanho da carteira × Risco%) ÷ Distância % até o stop`
  Ex.: carteira 10.000, risco 2%, stop a 5% → (10.000 × 0,02) ÷ 0,05 = **4.000**. (Não considera slippage/taxas.)
- Se o stop está a **menos de 2%** (o risco escolhido), pode ir com a mão cheia; **acima de 2%, faça a conta**.
- **Alavancagem ideal (futuros):** `risco% ÷ distância do stop%`. Ex.: risco 2%, stop 0,1% → **20x**. Banca 7.000 × 20 = 140.000 de notional; se stopar, perde 2% = $140.
- Buscar entradas **mínimo 3:1** no início. Gráfico 4h+ → 3:1; menores → 2:1; muito pequenos → 1,5:1.
- **Sempre mapear S/R no TF maior antes de operar o menor** (1h ← 4h ← 1D; 15m ← 1h).
- **Tríade do operador: Estratégia, Gestão de Risco e Disciplina.** *"Stop-loss é o seu melhor amigo e sempre será."*
- **Stop deve ser técnico** (invalidação da tese), não % solto. **Stop financeiro** (Mograbi): profissionais operam com risco em R$ fixo — é o único jeito de controlar a curva de capital.

### 7.7 Setups validados (sistema RCESA)
**RCESA = Regras Condicionais · Entradas · Stop loss · Alvos.**
Validação: **backtest de no mínimo 100 operações** no par e TF escolhidos. Nenhuma estratégia acerta 100%; **~60% de win rate é excelente**; com R:R ≥ 1:1,5 já é extremamente lucrativa no longo prazo. Preparar o terreno: backtest → carteira de papel → gerenciamento de risco.

1. **VuManChu Cipher B + EMA 200/50** (pullback em tendência)
   LONG: preço acima da MM200 · Money Flow verde/positivo · pullback até a EMA50 · Onda de Inércia **abaixo** da linha neutra · sinal de cruzamento (bolinha verde) abaixo do zero → **entrada na abertura da vela seguinte**. SHORT = espelhado. Stop abaixo da última mínima local após o sinal. Alvo **2:1**.
   ⚠️ Evitar em lateralização (MM200/50 horizontais) e com Money Flow neutro.
2. **EMA 200 + RSI + Estocástico (14,2,2)** — divergência no RSI, MM200 norteia a tendência, entrada no **fechamento da vela que cruzou o estocástico**, stop abaixo do swing low, TP sempre 2:1.
3. **Média 9.1 (Larry Williams)** — semanal/diário, não funciona em lateral. Vela ultrapassa a EMA9 e a média sai de lateral para inclinada → marca máxima/mínima → entrada no rompimento da máxima na vela seguinte, stop abaixo da mínima, subindo o stop conforme anda.
4. **Tendências 15m: EMA 21/52 + BBWP + RSI** — comprado só com EMA21 **acima** da EMA52 (vendido, abaixo); preço volta e **toca a EMA52**; **BBWP abaixo de 25%**; opcional: divergência escondida reforça. Risco 2%. Saída: primeira divergência clássica contrária **ou** rompimento do último fundo ascendente. *"Se o diário está em tendência, ele pressiona o 1h, que pressiona o 15m."* Não usar com EMA52 lateralizada.
5. **Topo/Fundo duplo + divergência no RSI** — *"ESSE SETUP É EXTREMAMENTE ASSERTIVO."* Regra da zona: após mapeada, as próximas velas **podem violar** a zona, mas **nenhuma pode fechar inteira fora dela**. Frequentemente o preço nem chega a fazer o reteste.

### 7.8 Mandamentos do operador
*"Cuide bem do seu dinheiro, ou ele vai encontrar outro dono."* · *"Market humbles — ou o mercado te deixa humilde, ou ele cobra."*
- Paciência é virtude · Ponha todos os pingos nos "i"s antes de operar · **Fundos são mais difíceis de se formar do que topos** · Blinde-se emocionalmente · O pullback é seu melhor amigo · A tendência é sua amiga **até que não é mais** · **Não operar é operar** · Coloque um **limite diário de perdas** · O mercado é maratona · Coloque-se onde você **sobrevive aos seus erros** · Não pare de estudar · **O lucro só existe quando é realizado — ninguém quebra por tirar lucro** · Compre o medo, venda a ganância · **Suba o stop a partir dos pontos ascendentes, sempre (zero a zero)** · Volume marca topos e fundos · **Diário de operações é fundamental** (entrada, stop, alvo e **o que você estava sentindo**) · Sequências de derrota acontecem — confie no setup · **CUIDADO COM O FOMO** · Opere sempre em posição de vantagem · *"Será que to comprando topo? Será que to com medo de ficar de fora?"* · Topos e fundos são muito bem lidos por **sentimento (Fear & Greed)** · **VOCÊ É SEU MAIOR INIMIGO** · **Na dúvida, não entre** · **NUNCA ENTRE SEM STOPLOSS**.

### 7.9 Aula Zé Mograbi — psicologia e sistema
- **Obstinação = Maestria + Disciplina.** Estar na tela **não pode** te deixar com medo ou angustiado.
- Trader = comerciante, quem compra e vende → **por isso a importância de comprar barato**.
- *"O dinheiro não é seu — ele está sob o seu uso."*
- **Desafios:** solidão · punição instantânea · obesidade intelectual. *"Somos atletas de alta performance da mente"* → hábitos saudáveis, exercício, alimentação.
- **Por que as pessoas não ganham dinheiro:** (1) falácia do TF curto — quanto maior o TF, mais volume e mais confiabilidade; (2) não entender **expectativa matemática / payoff** — alvos sempre mais longe que os stops; (3) **localização** — marcar as zonas no gráfico grande e saber **quando NÃO operar**. *"Comprar caro na zona de resistência é coisa de amador. Só existe compra perto de média."*
- **Sentimentos por trás do preço: MEDO · GANÂNCIA · FRUSTRAÇÃO** (o mais poderoso). O profissional atua na ponta oposta do sentimento do amador. **Marque no gráfico, escrevendo**, onde está cada um. Pontos de frustração interessam **perto de média e de S/R**.
- **Sistema operacional:** quantidade de sinais · **drawdown máximo aceito: até 15% da conta** · **payoff ≥ 2** · *"o payoff é sempre mais importante que o nível de acerto"*.
- *"O dinheiro na tela, positivo ou negativo, se a operação não terminou, não é seu."* → Faça o trade e saia da tela. Ao atingir 1:1, **trave o stop no zero a zero** (cria a paz psicológica para buscar o alvo todo).
- **"Se o trade não é tão bom a ponto de você entrar com a mão cheia, não entre. Só opere trade perfeito."**

---

## 8. Sizing & Risk — dimensionamento de posição (implementado em `ferramentas.html`)

### 8.1 Kelly binário (pools com range)
`f* = (b·p − q) / b` — b = odds (ganho/perda), p = prob. de ganhar, q = 1−p.
Presets: Safe (50/50, b=1,5) · Moderate (60/40, b=2) · Aggressive (70/30, b=3).
**Usar Half ou Quarter Kelly**: errar `p` em 10% causa erro de 30%+ em `f*`.

### 8.2 Kelly contínuo / Merton (lending alavancado)
`f* = (μ − r) / σ²` — μ = APR esperado, r = custo de borrow, σ² = variância. Converte em **LTV ótima**, ajustada pela fração de segurança.

### 8.3 Hedge delta-neutro em pool Uniswap V3
- Delta varia dentro do range: **100% do ativo volátil em pmin, 0% em pmax**.
  `ETH_share = (√pb−√p)·√p/√pb ÷ [(√pb−√p)·√p/√pb + (√p−√pa)]`
- IL anualizado ≈ `−min(0,3 ; vol²/(8·rangeW))`, com `rangeW = (√pmax − √pmin)/√pcentro`.
- Custo do hedge: perp = funding × notional short; borrow-short = −borrow × notional.
- **Economia:** anula o IL e captura fees "puras".
- **Trade-offs:** funding pode flipar em bear agressivo · quebra de range anula o hedge · complexidade operacional (3 contratos encadeados).
- ⚠️ **Incompatível com a estratégia de saída gradual**: hedge > 70% anula o propósito da pool como *exit strategy*. Alerta implementado na ferramenta.

### 8.4 Leverage + Hedge combinado (comparação de 3 vias, mesmo capital próprio)
- **A) LP puro** — APR = (fees + IL) × lp/capital; DD = lp × delta × vol / capital
- **B) Leverage produtiva (estilo Barolo)** — fees+IL sobre o LP completo + supply do colateral − borrow; DD amplificado por lp/capital
- **C) Leverage + Hedge** — B + funding × notional; IL residual = IL × (1−hpct); DD reduzido por (1−hpct)
- **Validado em 3 cenários (03/07/2026):** cenário real (capital $5.040, LP $385, 100% borrow, sem hedge) → A +1,53%/Sharpe 0,67; B=C +2,52%/Sharpe 1,10 (B=C é esperado quando hpct=0). Hipotético $2.000 com hedge 100% → C domina. Extremo super-alavancado → dispara corretamente o aviso *"borrow excede capacidade do colateral"*. Matemática confere linha a linha.
- **Nota de modelagem:** o DD de A/B usa `lp × delta × vol / capital` — mede exposição direcional da posição LP, não solvência da alavancagem (essa é coberta pelo aviso de capacidade de colateral).

### 8.5 Calculadora de liquidação (fórmulas do site)
- **AAVE:** `liqETH = (borrow − usdt_qty × USDT_LT) ÷ (weth_qty × WETH_LT)` — WETH_LT 82,5%, USDT_LT 77,5%. Se o resultado é negativo, o WETH **não pode ser liquidado** (a stable sozinha cobre a dívida).
- **Kamino:** `liqSOL = (borrow − usds_qty × USDS_LT) ÷ (sol_qty × SOL_LT)` — SOL_LT 82%, USDS_LT 80%.
- **Health Factor (AAVE):** < 1 = liquidação. HF 2 significa que o ativo pode cair 50% até chegar a 1.
- ⚠️ **Duas fórmulas de HF convivem no projeto** — resolvido em 18/08/2026:
  - `Collateral ÷ Borrow` (convenção do comentário no `data.js`) **superestima** o HF.
  - `colateral × liquidation threshold ÷ dívida` é o **HF real da Aave**. **É este o correto** — e é o que o fetch ao vivo e o `briefing.json` reportam.
  - Verificação em 15/08/2026: colateral real US$ 5.658,25 (2,16 WETH @ US$ 1.878,82 + 1.600 USDT), borrow US$ 760,17 → fórmula do print daria **7,44**; **HF real = 6,04** (confere exatamente com o `briefing.json`).
  - O campo `data.js → defi.aave.healthFactor` grava **6,08**, que é ~correto **por coincidência**: o comentário deriva de um colateral defasado (US$ 4.622 ⇒ ETH a US$ 1.399), e os dois erros — fórmula que infla e colateral que deflaciona — quase se cancelam. **Não confiar no comentário; usar sempre o HF ao vivo.**

---

### 8.6 Dimensionamento da pool ativa — Kelly com ramo de ruína (18/08/2026)

⚠️ **Merton (§8.2) é a ferramenta ERRADA para dimensionar a pool.** Com μ = 44,1% (P&L APR realizado
das chatas), r = 4,90% e σ_LP ≈ 0,5 × vol_ETH, `f* = (μ − r)/σ²` devolve **entre 320% e 1145%**.
Isso não é oportunidade, é modelo inadequado: Merton assume risco gaussiano contínuo e **não enxerga
ruína binária** (exploit de contrato, token a zero) — que é o risco nº 1 declarado pelo Lucas desde
out/2025. Nunca usar Merton sozinho para pool.

**Modelo correto — Kelly com três ramos:**

```
E[log] = (1 − z − q)·ln(1 + f·μ)  +  z·ln(1 − f·L)  +  q·ln(1 − f)
```

| Parâmetro | Valor | Origem |
|---|---|---|
| `μ` | **44,1%/ano** | P&L APR realizado das 22 pools chatas (capital-dias) |
| `L` | **51% do capital** | perda média das 7 pools de narrativa (GRIFT sozinho: −194%) |
| `r` | **4,90%** | custo de borrow ponderado (AAVE 3,79% / Kamino 5,92%) |
| `z` | falha do filtro | histórico **24%** (7/29) · **2026: 0%** (0/5) |
| `q` | exploit anual | premissa (1–5%) |

**Quarter Kelly** (fração de segurança padrão, §8.1):

| z ↓ / q → | 0,5% | 1% | 3% | 5% |
|---|---|---|---|---|
| 0% | 24,6% | 24,2% | 22,5% | 20,9% |
| 10% | 24,3% | 23,6% | 21,0% | 18,7% |
| **24% (histórico)** | 20,7% | **19,2%** | **15,1%** | **11,9%** |
| 35% | 10,7% | 9,7% | 6,3% | 3,3% |

**Break-even:** com q = 1%, o filtro precisa falhar em **menos de 44,7%** das pools (q = 3% → 41,7%).
Histórico 24%, 2026 0% — folga confortável.

> ❌ **Descartar** a estimativa de "94,8% de confiabilidade mínima do filtro" que circulou numa versão
> intermediária desta análise: era artefato de anualizar posições de duração curta. O número válido é o
> de break-even acima.

**Resultado:** posição atual **5,05% do patrimônio (US$ 359,95)**. ¼ Kelly indica **12–15%
(US$ 850–1.075)** — ou seja **2,3x a 3x** o tamanho atual. Não ir além de 15% enquanto a regra de saída
não estiver escrita (ver §16.3).

**Condição, não recomendação solta:** a faixa 12–15% só vale enquanto `z` continuar baixo. `z` não é
propriedade do mercado — é propriedade do critério de entrada e saída. Sequência correta: **escrever a
regra → depois aumentar.** Nunca o inverso.

## 9. Currículo técnico — todos os estudos de tecnologia do Notion

### 9.1 Bitcoin
- Criptomoeda descentralizada, 2009, Satoshi Nakamoto. **Max 21 milhões**, halving a cada 210.000 blocos (~4 anos). PoW, dificuldade ajustada para 1 bloco/10 min. ECDSA hoje; **Schnorr** traria assinaturas menores, agregação de multi-assinaturas e mais privacidade. Lightning Network como camada de pagamento.
- *"A primeira coisa interrompida por blockchains não são bancos — é a regulamentação e os reguladores. Destrói a ideia de regulação hierárquica, representativa, de cima para baixo, jurisdicional e geográfica."*
- **Contras:** volatilidade · escalabilidade limitada · consumo de energia · risco regulatório · barreira de entrada.
- **Futuro / questões abertas:** sustentabilidade quando a emissão zerar (**sobreviver só de taxas**) · definição de propósito (moeda? reserva de valor? plataforma de NFT via Ordinals? regulador de grade elétrica no Texas?) · **centralização dos desenvolvedores** (eram 6, hoje 4 core devs; um único cliente, o Bitcoin Core; sem processo estruturado de decisão) · falta de privacidade em nível de transação.
- **"Resistance Money — A Philosophical Case for Bitcoin"** (estudo): Bitcoin é **moeda de resistência** contra o alcance corporativo e estatal. É *commodity-money* descentralizado com emissão pré-programada — **não é um sistema de pagamentos como Visa**, é uma **camada base de final settlement** sem atores centralizados de confiança. Abre mão da hiperbitcoinização. Ideia central: colocar o Bitcoin no mundo de um jeito que **force o Estado a ser mais isonômico**. Inclusão financeira: o problema é **sistêmico e institucional**, derivado de um sistema global que depende da boa-fé de intermediários. *"Se o dinheiro torna o mundo um lugar melhor, então o Bitcoin também o fará."*
- 🔑 **Frase-chave que Lucas adotou:** *"Blockchains não são a descentralização do DINHEIRO — são a descentralização da CONFIANÇA. Dinheiro é apenas uma das possíveis expressões da confiança."*

### 9.2 Ethereum
- **Camada de mensageria/registro (L1)**, plataforma de contratos inteligentes (Solidity), 2015, Vitalik. Transação carrega: destinatário, assinatura, valor, dados opcionais, **STARTGAS** (máximo de passos computacionais) e **GASPRICE** (taxa por passo) — o modelo anti-negação de serviço.
- **The Merge:** PoW → PoS, 32 ETH por validador. **Emissão caiu ~90%** (de ~3% a.a. para ~0,85%); com EIP-1559 queimando a base fee, ETH fica **deflacionário quando a rede é usada** ("ultrasound money" condicional). Shanghai liberou os saques — **não houve colapso**, staking ficou mais atraente.
- **Roadmap revisado (2025–26) — o que mudou:**
  - ✅ **EIP-4844 (proto-danksharding) já está ativa** (Cancun/Deneb, mar/2024). Blobs de dados separados do calldata → **custo de L2 caiu 10x a 100x**; rollups deixaram de competir diariamente com usuários da L1.
  - Hoje: **L1 = camada de liquidação + segurança; usuário comum = L2 quase sempre.** L1 cara, simples e extremamente segura por design intencional.
  - ⚠️ **The Verge (Verkle Trees) está atrasado**, ainda em pesquisa. **The Purge** ainda é conceitual.
- ⚠️ **O problema ainda aberto (e o mais perigoso): crescimento do estado.**
  - Full node exige SSD NVMe rápido, centenas de GB, manutenção técnica → menos gente roda nó → **mais centralização**.
  - **L2 NÃO resolve o estado.** Rollups reduzem *execução* e *custo*, mas **adicionam estado** (bridges, provas, contratos de verificação). Ironia: escalar via L2 torna o Ethereum mais usável **e aumenta a pressão sobre o estado da L1**.
  - **Centralização invisível** — mesmo com milhares de validadores, o **acesso ao estado** depende de Infura, Alchemy, QuickNode, cloud providers. *"A validação pode ser descentralizada; o acesso ao estado não é."* → ponto único de falha, risco regulatório, risco de censura.
  - Barreira para light clients: celular e browser **não conseguem validar** → o usuário precisa confiar em RPCs.
  - Por que não se resolve fácil: apagar contratos antigos quebra imutabilidade · state rent mata dApps e composabilidade · snapshots centralizados quebram trust minimization.
  - **Risco real, pouco falado:** o Ethereum pode virar uma *settlement layer* segura **operada por poucos grandes players** — mais parecida com um "SWIFT descentralizado" do que com um "computador mundial acessível". Não mata tecnicamente, mas muda a **natureza política e econômica** da rede.
  - **Mudança de filosofia:** de *"Ethereum precisa escalar tudo na L1"* para ***"Ethereum é o juiz, não o mercado"***.
- **Restaking (EigenLayer)** aumentou a eficiência de capital e criou um risco novo: **alavancagem de segurança**.

### 9.3 Escalabilidade — modelos de estado e as soluções
- **Estado** = resultado do processamento de todas as transações até um ponto. **Transação** = operação que modifica o estado.
- **Bitcoin usa UTXO** (coleção de saídas não gastas; não guarda saldo consolidado — é mais simples de manter). **Ethereum usa 3 árvores** (estado/carteiras, transações, recibos) porque contratos inteligentes tornariam o UTXO inviável.
- **Carteiras Ethereum:** **EOA** (controlada por chave privada, sem código) e **CA** (contrato, com *code* + *storage*). Só EOA inicia transação → **as taxas são sempre pagas por humanos**.
- **Custos:** transferência de ETH = 21.000 gas; ERC-20 ≈ 65.000 gas (executa contrato). Somar dois números = 3 gas; consultar saldo = 400 gas. **Armazenamento on-chain é caríssimo** → daí FileCoin, Storj, Arweave.
- **O gargalo:** o bloco tem limite de **gas** (15M–30M), gerado a cada ~13s. Mineradores escolhem por gasPrice → **leilão aberto**. Crises: CryptoKitties (2017), DeFi Summer (2020), NFTs (2021) → dominância da Ethereum caiu de 90% para <60% de TVL.
- **Soluções de 2ª camada:**
  - **State channels** — canal privado, várias transações off-chain, uma liquidação final (analogia do jogo de pôquer com fichas). Limitação: só grupos pequenos e conhecidos. Ex.: Celer.
  - **Custodial sidechains** — 100% independentes, custódia própria, consenso próprio. Rápidas e baratas, **mas você abre mão da segurança da Ethereum** e depende de bridges (hack da Ronin). Ex.: Skale, Ronin.
  - **Plasma** — blockchains-filhas com "bloco raiz" publicado periodicamente na mãe (checkpoint), operador centralizado, saques com **período de contestação de 7 dias**, retirada simples / adversariada em massa / rápida (via provedor de liquidez). Garante autenticidade e imutabilidade, **mas não anti-censura**. ❌ **Caiu em desuso**: o checkpoint guardava o estado mas **não as transações**, jogando no usuário o ônus de detectar fraude. Única implementação de referência: Polygon PoS ("commit-chain").
  - **Rollups** (Barry Whitehat, 2018) — evolução do checkpoint que **inclui as transações**. Objetivos: melhor aproveitamento de bloco · economia de gas (rateio entre usuários) · maior throughput.
    - **Optimistic** (Optimism, Arbitrum): sequencer agrega e publica via *calldata*; **prova de fraude** com janela de 7 dias; verifier ganha parte do slashing. Contratos: CTC (Canonical Transaction Chain) e SCC (State Commitment Chain). Depósito e saque via L1/L2 CrossDomainMessenger + bridges; **pontes rápidas** cobram taxa para adiantar o saque.
      - **Riscos:** hack do sequencer (congela a rede) · **dilema do verificador** (se os incentivos funcionam ninguém trapaceia; se ninguém trapaceia não vale rodar verificador; sem verificador surge incentivo para trapacear) → a segurança depende de *skin in the game* de players grandes · suborno de verificadores (mais fácil quanto mais centralizado).
      - Anti-censura: **qualquer um pode publicar na CTC**, não só o sequencer — mas na prática exige interagir direto com o contrato.
    - **ZK** (provas de validade junto com a transação — dispensa contestação).
- **ZK: SNARK vs STARK** — SNARK: provas compactas, mas geração complexa e menos transparente (curvas elípticas, trusted setup). STARK: geração simples/rápida e transparente (polinomial), mas provas **maiores**.
- **Os 4+1 tipos de ZK-EVM (Vitalik):**
  - **Tipo 1** — totalmente equivalente ao Ethereum, compatibilidade perfeita, **provas levam horas**. Scroll, Taiko.
  - **Tipo 2** — equivalente à EVM (não ao Ethereum); muda estruturas de dados que a EVM não acessa. Quebra apps que verificam provas de Merkle de blocos históricos (pontes). Polygon Hermez/Zero.
  - **Tipo 2.5** — igual, mas com custos de gas alterados para as operações caras em ZK.
  - **Tipo 3** — quase equivalente; remove pré-compilados difíceis; alguns apps precisam ser reescritos.
  - **Tipo 4** — compila da **linguagem de alto nível** (Solidity/Vyper) para algo ZK-friendly: **provas muito rápidas**, mas endereços diferentes, bytecode manual não suportado, ferramentas de debug não portam.
  - **Não há "melhor"** — é um espaço de trade-off. Vitalik espera convergência para o Tipo 1 com o tempo.

### 9.4 Data Availability e blockchains modulares
- **Monolítica** = execução + consenso + registro + DA na mesma camada (problema: NFT, DeFi e gaming precisam de coisas diferentes). **Modular** = múltiplas camadas especializadas; a **camada de DA é a "cola"**.
- As 4 camadas: **Execução** (Arbitrum, Polygon, ZKsync, Solana) · **Consenso** (PoW/PoS/PoH) · **Registro/Settlement** (Ethereum, Polkadot, Near) · **Data Availability** (Celestia, Avail, EigenLayer) — resolve **fragmentação de liquidez**.
- *"As soluções de disponibilidade de dados permitirão que existam blockchains cada vez mais customizadas, escaláveis e ajustadas ao seu propósito."* (Orlando Telles)
- **Celestia** — rede para *deploy* de novas blockchains modulares. Não tem camada de execução própria (agnóstica: EVM ou Cosmos SDK). **Data Availability Sampling**: os nós lidam com amostras em vez de replicar tudo → **fica mais performática quanto mais nós tem**. Crítica embutida ao modelo L1/L2: *"modularidade ingênua"* — a escalabilidade em L2 ainda é **limitada pelo espaço de bloco da L1**, então não resolve o trilema. Concorre diretamente com o Replicated Security do ATOM. Filosofia do time: **o usuário é o cidadão de primeira classe** — deve poder rodar clientes leves e verificar cada camada.
- **Dois tipos de armazenamento:** dados de transação (Celestia, Avail, CCIP) vs dados genéricos (Filecoin, Sia, Storj, Arweave).

### 9.5 Interoperabilidade cross-chain
- **Dois problemas:** (1) **duplicação e isolamento de contratos** — AAVE e Uniswap têm que se reimplantar em cada chain; (2) **fragmentação de carteiras e liquidez** — o usuário divide recursos e paga bridge (ineficiência de capital).
- **Multi-chain** = várias blockchains coexistem. **Cross-chain** = elas conversam. Soluções: **mensageria** (contratos trocam informação) e **liquidez** (movimentação de recursos). Nome melhor que "Layer-0": **Omnichain**.
- **Pontes ≠ interoperabilidade**: provêm liquidez mas normalmente não suportam mensageria (Orbiter, Owlto, Axelar, Stargate, deBridge, Rhino).

| Projeto | Mensageria | Liquidez | Escopo |
|---|---|---|---|
| LayerZero | ✅ (Oráculo + Relayer) | teórica | EVM |
| ZetaChain | teórica | teórica | EVM + Bitcoin/Doge |
| **IBC (Cosmos)** | ✅ | ✅ | Cosmos+EVM+DOT+NEAR |
| XCM (Polkadot) | ✅ (via Relay Chain) | ✅ | DOT |
| **CCIP + CCTP (Chainlink + Circle)** | ✅ | ✅ | EVM-hub |

- **IBC é o modelo mais descentralizado** — P2P, cada par de chains cria sua ponte (não é hub-and-spoke). Vem no Cosmos SDK.
- 🔑 **Conclusão do estudo:** *"De todos os projetos analisados, o de maior potencial é o combo **Chainlink + Circle**"* — Chainlink já é ator neutro na guerra das blockchains (bom para meio de campo em mensageria) e a Circle é a entidade capaz de arregimentar a maior liquidez cross-chain (USDC já mintado em quase todas as chains importantes, **sem precisar capturar liquidez**). Sinal de alerta para LayerZero e Zeta. XCM e IBC seguem relevantes **dentro dos seus ecossistemas**.
- **ZetaChain (ZETA — Lucas tem no portfólio via airdrop):** blockchain própria (Cosmos SDK, Tendermint BFT) que também faz mensageria e liquidez cross-chain. Os nós **observam eventos em outras chains** (contratos omnichain). Liquidez: ZETA é emitido nativamente em várias chains (queima em A / minta em B, sem wrapping) + pools ZETA/x em cada rede — **modelo herdado da ThorChain**. ⚠️ Riscos: depende de liquidez em todos os pools (trade-off "pouca liquidez" vs "inflação via liquidity mining") e a operação não é atômica (ZETA flutua durante o swap). ✅ Feito técnico real: integrou o **Bitcoin** (rede não-EVM). Concorrentes fortíssimos: LayerZero e CCIP.

### 9.6 Account Abstraction (ERC-4337)
- Objetivo: melhorar a UX. **Desacopla a conta da assinatura** — o usuário passa a usar uma **CA (carteira inteligente)** que se comporta como carteira.
- Novo tipo de transação: **UserOperation** → mempool alternativa → **Bundler** agrega em *bundle transaction* → **contrato universal (singleton)** valida e executa todas de uma vez → **Paymaster** pode subsidiar o gas.
- Habilita: 2FA/biometria no lugar de seed phrase, celular como Ledger, pagamentos recorrentes, limites de gasto, transações em lote, gas pago pelo dApp, **recuperação de conta**.
- Perguntas respondidas no estudo: **continua sendo autocustódia** (é o usuário que cria a UserOperation); carteiras não são aposentadas (continuam sendo a infraestrutura); mitigação de risco = a carteira inteligente **explicar de forma simples** o que a transação agregada vai fazer.
- Lançado como contrato inteligente — **sem hard fork**.

### 9.7 Money Legos & LSDFi
- **Money Legos = composabilidade**: aplicações que compartilham o mesmo espaço de bloco podem ser combinadas (mintar DAI na Maker → prover liquidez na Uniswap).
- **Exemplo canônico — Alchemix** (empréstimo autoquitável): deposita 100 → toma 50 emprestado → os 100 são investidos e os juros pagam o empréstimo → devolve os 100. Camadas: Ethereum → MakerDAO (DAI) → Alchemix (alUSD) → Curve/Yearn/Sushi.
- **Riscos:** custódia/rug/hack em cada camada · depeg da stable intermediária · **decisões ruins de investimento do protocolo** · liquidação em cascata quando usado para alavancagem · **risco sistêmico entre protocolos** (o hack da Curve criou sombra de liquidação em cascata na AAVE).
- **LSD/LST:** staking trava capital → **ineficiência**. Uma rede com 70% em staking só tem 30% de eficiência de capital. O LST devolve circulação: recompensas vão para o **detentor do LST**, e você pode vender sua posição de staking diretamente. Todo LST é um LSD; nem todo LSD é LST.
- **Sinergia com Money Legos:** stETH é um ERC-20 — pode ir para pool, ser colateral etc. E como é **ativo gerador de renda**, pode ser colateral **mais atrativo que o token nativo**.
- **Riscos extras:** risco do protocolo de staking líquido (LIDO) + **risco sistêmico de volatilidade** — se dá para alavancar em LST, dá para liquidar em cascata, e isso respinga no token que garante a segurança da rede.

### 9.8 Restaking / EigenLayer
- **Staking** = colocar poder de compra em risco para garantir bom comportamento. **Restaking** = o mesmo capital garante mais de uma operação.
- Definição tecnofilosófica registrada: *"Restaking é assumir maiores riscos de um mesmo capital travado, para buscar diferentes fontes de receita em operações de confiança derivadas do próprio capital travado — **TRUST-LEGOS**."*
- Usos: **EigenDA** (camada de DA) · **sequenciadores descentralizados** (validação como serviço) · **confiança em pontes** (o stake vira fundo garantidor) · **oráculos** · **aval para eventos pontuais** (lançamento/airdrop → seguradora descentralizada).
- Duas formas: delegar LSTs ou apontar um nó nativo (nesse caso o slashing só atinge as recompensas). Janela de saque: 7 dias.
- **Riscos:** hack nos contratos da EigenLayer · slashing adicional por cada serviço assumido · **incentivo da própria EigenLayer para alugar validação a projetos pouco seguros** se ela não compartilhar o risco de slashing.

### 9.9 Pendle Finance — separar o principal do rendimento
- Tokeniza um ativo gerador de renda em **PT** (principal, resgatável 1:1 no vencimento) e **YT** (rendimento futuro, com juros travados). AMM próprio para negociar PT/YT + estratégias.
- **Abre um leque novo de money legos**: arbitragem entre o yield implícito no YT e o custo real do staking nativo.
- **Avaliação de Lucas/estudo:** replica mercado de renda fixa de forma descentralizada usando stETH, rETH, GMX etc. **É um protocolo para quem realmente entende esse mercado** — as oportunidades de "renda fixa" parecem atraentes à primeira vista, mas exigem entender a mecânica antes do FOMO.

### 9.10 Radiant Capital (RDNT) — o estudo e o desfecho
- Lending **cross-chain** sobre LayerZero (Arbitrum + BNB), auto-alavancagem em loop até 4x, e tokenomics de **real yield**: lenders recebem 25% dos juros; **dLP (Dynamic Liquidity Providers — travam ≥5% do montante em ETH ou RDNT) capturam 60%**. Distribuição inicial "fair" (DAO 17%, time 19%, ~metade em incentivos). Incentivos com vesting de 90 dias e multa por resgate antecipado.
- Conclusão do estudo (out/2023): *"token interessante para interagir com a plataforma, mas não necessariamente para holding isolado"* (ainda inflacionário).
- **Desfecho real (2025):** protocolo **hackeado**; Lucas perdeu 1.079,17 ARB em stake (~US$ 671 de prejuízo efetivo). Reembolso prometido e não pago. → **Confirmação prática da regra 2 e da regra 30 das 31 regras.**

### 9.11 Real World Assets (RWA)
- **Ondo Finance** — fundos on-chain lastreados no mundo real, rating S&P/Moody's/Fitch, **KYC/AML**, ticket mínimo US$ 100k. OUSG (T-Bills) era o único operacional (~$130M). Também OMMF (money market) e OHYG (corporate bonds).
- **Enzyme Finance** — cofres (vaults) públicos/privados que automatizam estratégias DeFi; dispensa relatórios de atestamento e a infraestrutura de auditoria do mundo real (tudo verificável on-chain).
- **Tangible** — tokenização de imóveis (TNFTs) na Polygon, marketplace próprio, stablecoin USDR lastreada em cesta (cripto + LP tokens da Curve + seguro + portfólio de imóveis). Também tokeniza ouro, vinho e relógios. Token TNGBL com "3,3+ NFT": **66% da receita vai para quem trava; 33% para recompra e queima** — real yield.

### 9.12 Redes de privacidade
- Baseado em *"Privacy Market Outlook in Web3"* (Mykola Siusko, jan/2023).
- **Contexto:** o dinheiro está ficando digital; CBDCs dão ao Estado poder de vigilância econômica inédito. Historicamente, **o uso do dinheiro sempre envolveu privacidade** (duas pessoas trocando cédulas operam em modo privado por natureza).
- **Quatro níveis de privacidade:** infraestrutura (IP anônimo) · conexões de rede (não vazar IP para o RPC) · **aplicação** (emissor/receptor/valor não visíveis no explorer) · conteúdo.
- **Projetos:** Tornado Cash (mixer — sancionado pelos EUA, fundadores presos) · Secret Network (Cosmos, privacidade opcional em contratos) · Monero / Zcash (moedas) · Aleph Zero (L1 com privacidade opcional) · Nym (transporte anônimo) · Aztec (L2 de privacidade). Alianças: UPA e LPA.
- **Privacidade e descentralização andam de mãos dadas** — não há privacidade onde existe poder de censura centralizado.
- 🔑 **Conclusão de alocação (a mais importante):** se as redes de privacidade se tornarem essenciais, é **uma das maiores assimetrias do mercado**. Mas esse futuro pode não se concretizar se a via centralizada oferecer conveniência suficiente. → **Exposição de altíssimo risco e altíssima assimetria; não deveria ser posição considerável num portfólio com bom gerenciamento de risco.** (Lucas estudou ZEC em jan/2026 e "não gostou tanto quanto imaginava".)

### 9.13 Identidade on-chain
Mecanismos que identificam carteiras como humanos únicos — usados em airdrops e KYC. **Polygon ID** (ZK) · **OpenID3/Linea** (Gmail/GitHub, 1 email por carteira) · **Clique** (multi-chain, atestamentos por Twitter/GitHub/jogos) · **Galxe Passport** (SBT, não transferível mas revogável) · **Gitcoin Passport** (stamps; Linea exigia ≥20 pontos como prova de humanidade).

### 9.14 Replicated Security / Mesh Security (Cosmos)
- **Replicated Security** (ex-Interchain Security V1): consumer chains **alugam** a segurança do Cosmos Hub — os validadores do Hub validam também a consumer chain e ficam sujeitos ao mesmo slashing/jailing. Em troca, a consumer chain compartilha receita (≥25% das taxas de transação; ou taxas de aplicação se não tiver token próprio).
- **Inversão de lógica:** Ethereum = 1 blockchain / N aplicativos · Cosmos/Polkadot = 1 blockchain / 1 aplicativo · **Cosmos ICS = 1 aplicativo / N blockchains**.
- **Crítica de Sunny Aggarwal (Osmosis):** Replicated Security é derivação do consenso da Polkadot e "perda de tempo" — é **hierárquico e concentra poder**. Melhor: **Mesh Security**, com **soberania política + segurança compartilhada** (analogia com a OTAN: países soberanos com defesa mútua). E o comportamento atual do Cosmos **já é** uma *soft shared security*.
- **Prós do RS:** censurar a consumer chain custa o mesmo que atacar o Hub; ATOM em staking passa a receber recompensas extras → pressão compradora + redução de supply.

### 9.15 Ferramentas de análise de contratos
- **Análise estática** (lê o código-fonte procurando padrões inseguros) vs **análise dinâmica** (acompanha o contrato em execução). A maioria das ferramentas é estática, e **não existe uma "super solução"** de um clique.
- **Escopo real de análise:** (1) as **regras de negócio** — o que o contrato faz de fato (pode ser uma pirâmide); (2) custo de gas (pode ser proibitivo); (3) instruções maliciosas/vulnerabilidades.
- Limitação honesta registrada: é uma disciplina **para programadores**, não para o usuário final se precaver.
- Ferramentas gratuitas: CyberScan (tokens) · Safescan (carteiras) · SimilarityScan (similaridade entre contratos).

---

## 10. História e filosofia — por que cripto existe (estudo do Notion)

**Raízes (1930–40):** ficção distópica onde uma elite controla a humanidade por meios diferentes (Orwell / Huxley).
**Internet e cypherpunks (1960–80):** ARPANET (1969) → internet oficial (01/01/1983). Nos anos 70, pensadores identificam a internet como possível **ferramenta de controle estatal**; nos anos 80 respondem criando as **BBS** — uma internet paralela fora do governo americano.
- **Vernor Vinge, *True Names*** — uma das primeiras visões de metaverso anônimo e criptografado ("O Outro Lado").
- **Phil Salin, AMIX (1980)** — primeiro mercado digital aberto da história, para negociar informação. *"A habilidade de comprar exatamente o conteúdo que se deseja, quando se deseja, irá explodir numa velocidade nunca vista desde a prensa."* / *"Pelo ano 2000 a economia global será uma economia global de informação; comunidades de interesses compartilhados vão se expandir além das fronteiras geopolíticas."*
- **Chip Morningstar, HABITAT** — primeiro metaverso. *"Planejamento central é impossível; nem se dê ao trabalho de tentar."*
- **Mark Miller** — sistemas agóricos (ágora = praça/mercado) e **teoria dos jogos**: a teoria do 3,3 — para receber benefícios você precisa cooperar. **É a raiz do desenho de incentivos econômicos em cripto hoje.**
- **O racha ideológico (1987):** Timothy C. May — para ele **todo** governo era corrupto; queria destruir o Estado. Rascunhos do **Manifesto Cripto-Anarquista** e da BlackNet (qualquer serviço comprado e vendido). Registro crítico do estudo: *"não necessariamente esse mundo mais livre é um lugar melhor — definitivamente não é utópico, tem aspectos assustadores."*
- **A jornada até o Bitcoin:** 1989 David Chaum **DigiCash** → 1997 Adam Back **HashCash** → 1998 Wei Dai **B-Money** → 1998 Nick Szabo **Bit Gold** → 2004 Hal Finney **RPOW** → 2008 **Satoshi / Bitcoin**.
- 🔑 **Conclusões do estudo (importantes para calibrar o discurso):**
  - *"Bitcoin é uma tecnologia que não necessariamente vai destruir o Estado. Pode ser que no futuro a tecnologia seja tão boa que o próprio Estado a adote, e essa guerra vire uma guerra de poder de influência."*
  - *"Satoshi fala muito mais sobre economias autônomas, como aposentar os bancos, do que sobre destruir governos."*
  - Nos anos 90 os EUA **desistiram de lutar contra a criptografia**. Hoje os governos estão atrás de entender como usar a tecnologia para si (CBDCs).

---

## 11. Ciclo do BTC e leitura macro

### 11.1 Fractal de ciclo
BTC repete um fractal de ~4 anos, tipicamente com 1 ano de baixa. **Mas:** a expansão monetária do FED (corte de juros, impressora) pode quebrar o padrão — e só existem 3 ciclos anteriores como amostra, o que é estatisticamente pouco.

### 11.2 O duplo mandato do FED e a leitura de Lucas
- FED olha inflação **e** desemprego. O problema: o desemprego **antecede** e retroalimenta o PIB, e o PIB segue muito positivo — pode levar a **falsa interpretação**, com 60% dos itens do CPI já 3% acima do implícito nos juros. **A preocupação é a inflação real ser maior que a declarada.**
- Do outro lado: pedidos de seguro-desemprego em nível baixo — as pessoas saem do mercado **trocadas por IA**, o que é ganho de performance, não só perda de emprego.
- **Regra de Taylor** (via PIB ou via desemprego, sempre considerando a inflação): pelo PIB, os juros estão **muito abaixo do ideal** — perigoso, fora da neutralidade.
- **Equilíbrio frágil:** baixa oferta de mão de obra (menor imigração, envelhecimento) + baixa contratação (automação/IA, incerteza) + **baixas demissões** (memória da escassez do COVID; empresas reféns, com medo de não conseguir recontratar). Resultado: mercado aparentemente resiliente mas vulnerável, **desaceleração gradual, não abrupta** — diferente das recessões tradicionais. Risco: virar recessão se mal gerenciada.
- **IA + energia:** demanda por IA maior do que a capacidade elétrica existente; a China detém as **terras raras** necessárias para expandir. Governo americano financiando e virando sócio das empresas.
- **Stablecoins:** ~$300bi projetados para $1,3T — criam lastro para o dólar e **exportam a inflação americana para o resto do mundo**.
- ❓ Pergunta em aberto registrada: *"Possível bear? Bear diferente? 2026 provável expansão monetária… Recessão? Quando anunciada, já está acontecendo há ~6 meses. BTC vai subir com a expansão monetária como sempre foi?"*

### 11.3 Indicadores on-chain que Lucas monitora (aba Ciclo em `ferramentas.html`)
8 indicadores via API do ResearchBitcoin (snapshot diário automatizado em `btc-onchain.json`):
**MVRV · STH MVRV · LTH MVRV · Mayer Multiple · Realized Price · LTH SOPR · AVIV · CVDD.**
Insight técnico chave: **Realized Price = PriceUSD ÷ MVRV** (MVRV = market cap / realized cap), o que permite derivar tudo sem acesso pago à realized cap.
Veredito de ciclo combinado: FUNDO/COMPRA · ACUMULAÇÃO · EXPANSÃO · TOPO/EUFORIA.

### 11.4 Sinais de virada de ciclo que Lucas acompanha
Dominância do BTC caindo + altcoin season index + oferta de stablecoin crescendo. Fear & Greed no dashboard. **Regra: "a virada de ciclo não é anunciada".**

---

## 12. Mentoria — teses e discussões registradas nas conversas

*(Papel definido pelo Lucas: mentor multidisciplinar em DeFi/Cripto, Economia, Geopolítica, Criptografia e Tecnofilosofia. Economia e geopolítica são os gaps declarados.)*

- **Bitcoin ainda age como ativo de risco correlacionado ao Nasdaq** (confirmado empiricamente). Divergência emergente em abr/2026 (tarifas Trump): dólar enfraqueceu + ouro em ATH + BTC não despencou tanto → **primeiro teste real da narrativa de reserva de valor**.
- **Dilema de Triffin** — por que o dólar se enfraquece estruturalmente e por que cripto existe como resposta.
- **L2 tokens como armadilha de varejo** — a tecnologia funciona, mas o tokenomics nunca capturou valor para o holder. **Filtro prático: "a receita vai para o token holder diretamente?"** HYPE/Hyperliquid passa; Scroll, Blast e StarkNet falham.
- **Vitalik — *Low-risk DeFi* (set/2025):** o killer app do ETH é **lending colateralizado + pools** — exatamente o que Lucas já faz.
- **Vitalik — *Balance of Power* (dez/2025):** framework Big Gov / Big Business / Big Mob; a tecnologia destruiu os freios naturais entre eles.
- **Fred Ehrsam (Paradigm), *How to Survive a Crypto Cycle*** — 6 insights aplicados:
  1. Tudo morre no bear exceto o que tem PMF real → AAVE, Uniswap e Kamino sobreviveram; GRIFT não.
  2. **Cash (stables) = opcionalidade, não fraqueza.** O bear é quando os retornos são plantados.
  3. Yield sem entender o risco é o caminho mais rápido para zero.
  4. Ciclos duram mais do que se espera — **nos dois sentidos**. Calendário de DCA força disciplina mecânica.
  5. **A virada de ciclo não é anunciada.**
  6. **Sobreviver para o próximo ciclo É a estratégia.** Preservação de capital é alfa.
- **Bear = redistribuição** de tokens de mãos fracas para mãos fortes. **O varejo tem vantagem sobre o institucional no bear** — o institucional tem mandato e compliance e não consegue comprar quando está feio.
- **Distinção fundamental: acumular tokens ≠ especular no preço.** Métricas em tokens, não em dólares.
- **Tese da invisibilidade:** blockchain maduro é como TCP/IP — ninguém sabe que usa. **A janela de assimetria existe justamente porque a tecnologia ainda é visível e assusta.**
- **Taxonomia regulatória (perguntas elaboradas para o Dan Crypto/WeSearch):** ETH provavelmente vira commodity na prática, com processo lento e linguagem ambígua · **ETF de ETH com staking é catalisador forte** (abre seguradoras e fundos de pensão que precisam de yield) · HYPE em zona cinza (burn ≠ dividendo é a defesa; "esforço de outros" é o ponto de ataque da SEC) · **o elo mais fraco da cascata de re-hipotecação é a PONTE** (WBTC, cbBTC, LSTs) — indicadores: prêmio/desconto do WBTC, funding rates, dominância de stablecoin · jurisdição a acompanhar: EUA para o portfólio, MiCA para entender a tendência · **evidência concreta de "ruptura real"**: banco tradicional usando smart contract em produção (não só comprando token), ou ETF com staking aprovado.
- **DeFi state-of-the-art 2026 a estudar (pendente):** Euler V2 (lending modular com prazo fixo) · Morpho Blue (mercados isolados com LTV custom) · Gearbox V3 (credit accounts nativos) · Drift BTC-PERP (basis trade em Solana) · Hyperliquid HLP (vault maker-taker ~15% APR) · Pendle PT (renda fixa).

---

## 13. Diário de bordo — o que efetivamente aconteceu (2025–2026)

**2025 — o ano do aprendizado caro e da recuperação**
- Jul: carteira em ATH. *"Preciso pensar com mais calma, realizar mais lucros e esperar correção."*
- Ago: perde o topo do ETH por não realizar. *"Desviei o foco essa semana."* Registra a crença limitante ("poderia subir mais um pouco") — **e o erro se repete duas semanas depois**.
- Set: corrige o comportamento — vende parcial em resistência para repagar empréstimo antes da queda esperada. Funciona.
- Out: entra por FOMO num jogo de farm ("fazenda de WEED") no time errado, financiado com a venda do GRIFT no prejuízo. Token cai ~90%. *"Denovo acabei entrando no FOMO."*
- **10/10/2025 — flash crash.** Não é liquidado; compra ETH e SOL no sábado. Conclusão que muda a estratégia: *"em momentos assim, pools de liquidez são a melhor saída para um fluxo de caixa constante"* → passa a estudar DeFi a fundo e reservar capital para pools.
- Dez: monta 2 pools de venda (SOL e ETH) para rebalancear os empréstimos, estando de férias. Mercado derretendo.
- **31/12/2025 — balanço do ano:** *"Consegui manter sem retirar muito lucro para o fiat, consegui investir bastante. A Raydium com a pool SOL/GRIFT me deixou ruim na desvalorização do token, mas com boas taxas — **aprendi a sair mais cedo das pools**. Me re-ergui com trades estruturados em borrow e lending na Kamino, **recuperei minhas 10 solanas** que havia perdido nas pools. No Q4 montei posições de saída para ETH e SOL. No geral o ano foi ótimo — +30% de alta nos ativos."*

**2026 — o ano da estrutura**
- Jan: *"aumento de QE nos EUA me anima."* Estuda ZEC e **não gosta**. Compra USD abaixo de R$ 5,19 e ETH/SOL nas quedas. Migra a pool ETH/USDT para a **Base** (APY melhor).
- Fev: mercado lateral pós-queda. Pool ETH/USDC dando ~5% em 15 dias / APY 125% mesmo com volume baixo. **Fear & Greed em medo extremo** → *"ainda estou esperando um recuo para comprar mais"*. Troca USDG→USDC no borrow quando o APR sobe.
- Mar: guerra no Irã afetando os mercados. *"O consenso ainda é pessimista; eu sigo otimista com o ano, mas cauteloso nos aportes."* / *"Não estamos em risco extremo, pelo contrário — em MEDO extremo."*
- Abr: *"Mercado está apostando em mais quedas, eu estou me sentindo bem com isso."*
- **O padrão que se repete em todo o ano:** riscos = as **altcoins menores** (RDNT, ADA, ZK, ZETA, XAI, POL, EIGEN) que derreteram e precisariam subir múltiplos para voltar ao patamar. Decisão consciente e repetida: *"não tem por que vender, nem o que fazer com elas — vou segurar e esperar o próximo bull. Melhor esperar uma nova alta para rebalancear."*
- **Risco declarado #1 a partir de out/2025:** *"os principais riscos hoje são os riscos de contratos inteligentes — tento manter minhas operações nos grandes protocolos do mercado."*

**Lições do Diário de Trading (2023–2025)**
- *"Meu erro foi ter subido o alvo do meio do movimento — fui querer ser ganancioso e como sempre não bateu o alvo."*
- *"NÃO OPERAR CANSADO E MAIS DE 1 TRADE POR DIA."* (registrado duas vezes, em dias diferentes)
- *"Mais um trade que não queria ter feito e fiz por impulso. Erro aprendido."*
- Evolução real do método: passou a **stopar só 50% da posição** e buscar a assimetria com o resto; e **nunca deixar de posicionar o TP**.

---

## 14. Índice completo dos estudos no Notion (inventário — nada foi deixado de fora)

**Frameworks e método:** DEFI 31 regras · Análise Fundamentalista · Análise Técnica · Setups · DCA por intensidade · DCA ETH · Ferramentas de análise de contratos · Crypto AI prompts · Aula Zé Mograbi · Curso Liga M1 · TECHTALKS 09/03/23 · Frases · LIVROS · META.
**Fundamentos:** BITCOIN · ETHEREUM · DeFi · Money Legos & LSDFi · Escalabilidade em Ethereum · Rollups – ZK-EVMs · Data Availability · Account Abstraction · STARKNET-Account Abstraction · Interoperabilidade Cross-Chain · Replicated Security · Redes de Privacidade · Identidade On-Chain · Real World Assets · Shangai Fork · História do Mercado Crypto · Implicações econômicas do Ciclo BTC · Crypto World (hub).
**Protocolos e redes:** EigenLayer · Pendle Finance · Radiant Capital (RDNT) · Radiant · LayerZero Labs · ZetaChain (ZETA) · Chainlink · Pyth Network · Celestia · NEAR Protocol · Injective · SEI Network · Osmosis · Polygon 2.0 · Polygon Matic · Astar Network · Dymension · RONIN · BNB Chain · Radix · Hyperledger Foundation · Singularity DAO · Lens Protocol · Solana · ADA Cardano · Ethereum (ficha) · Polygon (ficha) · Revert Finance · AIRDROPS.
**Operação e portfólio:** Painel – Barolo (diário semanal + PDFs mensais) · Diário DeFi (registro pool a pool, 2024–2026) · Diario de Trading · Empréstimos Cripto · COMPRAS ETH · Portifólio (snapshots semanais 27/12/2025 → 24/03/2026) · ANÁLISE DEFIVERSO · painel_cripto_lucas · Portfólio Dashboard · DeFi Dashboard · MATIC/USDC · ARB/USDC · Notas · Journal · Task List · Links para assistir · Habit Tracker · Personal Home · Privacy.

> **Nota de fidelidade:** os estudos de protocolo individuais (Chainlink, Pyth, NEAR, Injective, SEI, Osmosis, Astar, Dymension, Ronin, BNB, Radix, Hyperledger, Singularity DAO, Lens, LayerZero, Solana, ADA) seguem **exatamente o mesmo template de 5 etapas** da seção 5 (o que é/faz → proposta de valor → tokenomics → estado atual e roadmap → considerações e decisão) e estão resumidos onde relevante nas seções 9.x. Se for preciso o detalhe integral de algum deles, ele está na página correspondente do Notion.

---

## 15. Como usar esta base num chat novo

1. **Para responder sobre estratégia/filosofia:** seções 1, 2, 4, 12, 13. O tom certo é o do manifesto — consistência, preservação de capital, ativos acumulados e não preço.
2. **Para analisar um projeto novo:** seção 5 (framework) + seção 6 (métricas) + o filtro *"a receita vai para o token holder diretamente?"*.
3. **Para dimensionar posição ou avaliar risco:** seções 7.6 e 8.
4. **Para responder sobre o portfólio:** seção 3 + `data.js` (fonte única). **Nunca somar colateral DeFi por cima do total.**
5. **Para o Diário DeFi (trades, decisões, observações):** a fonte real e completa é a **página do Notion "📗 Diário DeFi"** (`bb704dfd-a8b0-4838-b18e-a22ab1e2557d`) — 66 seções, 2023→2026. O arquivo `diario.js` na raiz do repo é apenas um espelho parcial (em 18/08/2026 continha **2 entradas**) usado por sessões automatizadas sem acesso ao Notion. **Não tratar `diario.js` como o diário.** Ao buscar o Notion: a página vem com ~800 mil caracteres por causa das URLs assinadas das imagens — limpar `!\[\]\(https://prod-files-secure...\)` reduz para ~72 mil caracteres de texto real.
6. **Regras que nunca podem ser quebradas:** privacidade (§1) · metodologia de patrimônio (§3.1) · referência da pool sempre em USD (§2.3) · nunca assumir a rede da pool ativa (§2.3) · nunca expor endereço de carteira em URL.


---

## 16. Leitura do Diário DeFi e auditoria de dados (18/08/2026)

Análise das **66 seções** do Diário DeFi do Notion (2023→2026, ~72 mil caracteres de texto próprio),
cruzada com `pools.html`, `data.js` e `briefing.json`.

### 16.1 A curva de comportamento — sim, melhorou, e dá para datar

| Ano | Posições no diário | Remontagens | Stable / Alt / Meme | Resultado |
|---|---|---|---|---|
| 2023 | 9 | 7 | **4 / 2 / 0** | **+US$ 377** |
| 2024 | 49 | **75** | 2 / **21** / **7** | +US$ 239 |
| 2025 | 4 | 34 | 2 / 1 / 1 | **−US$ 1.527** |
| 2026 | 4 | 13 | **4 / 0 / 0** | **+US$ 111** |

2024 foi o pico de *churn*: 75 remontagens para +US$ 239 de resultado. 2026 é uma operação
qualitativamente diferente — só pares com stable, 13 remontagens, dívida dentro da decisão
(*"vou repagar um pouco da dívida com os dolares que recebi"*) e range calibrado por método
(*"achei que o retorno estava muito baixo pois ficou esticada demais, dessa vez vou fazer esticada mas
pela metade, seguindo a acumulação do VPVR"*).

### 16.2 Os cinco padrões que o diário revela

1. **O denominador errado — a única vez em que "medir em tokens" traiu a estratégia.**
   21 das 49 seções de 2024 são a *mesma* posição RDNT/ETH remontada. Entrou com 6.313 RDNT em janeiro,
   saiu com 7.038 em julho: **+725 RDNT, +11,5% em tokens** — sucesso pela régua declarada. Hoje os sete
   alts somados valem **~US$ 125** (contra US$ 885 investidos) e o protocolo Radiant foi hackeado em 2025.
   **A regra não está errada, está incompleta:** medir em tokens só protege se o token sobrevive uma
   década. Para ETH/SOL/BTC funciona; para um alt, o numerador crescendo *esconde* a posição morrendo.

2. **A pool foi usada como anestésico de aversão à perda — cinco vezes, em cinco pools, escrito.**
   *"Como não pretendo vender os tokens no prejuizo"* · *"Por mais que gere menos taxas não posso mais
   sair no prejuizo"* · *"Como ainda não pretendo vender os tokens com esse prejuizo inicial, vou diminuir
   um pouco o range"* · *"Como não pretendo realizar esse prejuizo vou remontar a pool aqui mesmo"* ·
   *"não quero sair agora e tornar o loss permanent"*. Racionalizado é coerente (gero taxas enquanto
   espero); na prática é **hold disfarçado de operação**, e explica os 75 remounts de 2024 melhor que
   qualquer tese de mercado. É o efeito disposição.

3. **O GRIFT foi um erro de 38 dias, não de um dia.** O diagnóstico correto está escrito em 31/01/2025
   (*"Deveria ter retirado a posição toda quando a carteira bateu ATH em 3K dolares"*), reforçado em
   01/02 (*"Cheguei a ter 10 SOL na pool, agora não tenho 6"*) e em 24/02 (*"Me sinto agora preso nessa
   operação"*) — e a operação seguiu até 10/03. **O que faltava não era análise, era um gatilho de saída
   que não dependesse de concordar com ele no momento.**

4. **Indisponibilidade é fator de risco mensurável.** Dez menções a doença, gripe, viagem ou mudança,
   coincidindo com os piores resultados. O PEANUT (−US$ 243) é literal: *"Acabei ficando doente logo
   depois que montei essa pool e não consegui acompanhar."* Uma estratégia que exige atenção diária tem
   custo escondido nos dias sem atenção. **Range mais largo é seguro contra gripe** — e é a variável que
   deve moderar o aumento de tamanho indicado em §8.6.

5. **A regra das 24h existe e funciona — foi violada exatamente na pool que quebrou.** *"Minha estratégia
   continua sendo, esperar pelo menos 24h para re-montar as pools"* aparece 5 vezes. No GRIFT houve
   remontagens no mesmo dia, repetidas vezes.

### 16.3 O que falta escrever (prioridade)

**Regra de SAÍDA por tempo, não de entrada.** O GRIFT prova que a entrada não mata — ficar preso mata.
Elementos mínimos: máximo de dias fora do range antes de encerrar obrigatoriamente · teto de aportes
adicionais dentro de uma posição perdedora (o erro 4 SOL → 10 SOL) · veto a token cujo preço é a própria
tese · piso de TVL e razão volume/TVL · teto de tamanho por pool não-blue-chip.

### 16.4 Correções de dados aplicadas nesta revisão

| Item | Estava | Correto |
|---|---|---|
| Baseline do portfólio | 20/06/2026 | **14/08/2026** (`data.js asOf`) |
| Total investido | ~US$ 9.955 | **US$ 10.172,10** |
| Patrimônio líquido | não registrado | **US$ 7.125,72** (15/08/2026) |
| Dívida total | ~US$ 1.570 | **US$ 1.583,80** |
| Leverage | "0,245x" | **dívida/patrimônio 22,2%** |
| Taxas brutas de pools | ~US$ 2.437 | **US$ 2.459,94** |
| P&L líquido de pools | "−840 a −1.021" | **−US$ 799,61** (valor único, calculado) |
| Nº de registros de pool | 28 | **29** em `pools.html` · **66 seções** no diário |
| Fórmula de HF | "o ao vivo é o correto" (sem detalhe) | resolvido em §8.5 — HF real **6,04** |
| Fonte do Diário DeFi | `diario.js` | **página do Notion** (`diario.js` tem 2 entradas) |
| Duplicata desta KB | rascunho não versionado `CONHECIMENTOBAROLO.md` (sem hífen) coexistia com o canônico, com cabeçalho contendo 2 alegações falsas | **mesclado e removido em 19/08/2026** — `CONHECIMENTO-BAROLO.md` (com hífen) é a fonte única, espelhada no `CLAUDE.md` |

### 16.5 Pendências abertas (dados)

- **`data.js → defi.aave.healthFactor`**: o comentário deriva de colateral defasado (US$ 4.622 ⇒ ETH a
  US$ 1.399). O colateral real é **US$ 5.658,25**. Corrigido no `data.js` em 18/08/2026 — manter a
  convenção do HF real da Aave daqui em diante.
- **Duas pools do diário não estão em `pools.html`**: **POPCAT/SOL 1%** e **WEN/SOL 0.16%** (mar/2024),
  ambas memecoins na Solana. Como as duas são do grupo "narrativa", incluí-las **piora** o track record
  agregado e eleva `z` de 24% para ~29% no histórico. Os números de §3.4 são conservadores por omissão.
- **% do tempo em range** da pool ativa nunca foi computado. É a variável que faz o fee APR de 50,91%
  cair para ~25% se a pool ficar metade do tempo fora. Reconstruível a partir das datas do diário.
- **`monthlyReturns[2026]`** e reconciliação de `wealthCurve.invested` (série termina em US$ 7.100 vs
  total canônico US$ 10.172) seguem pendentes.

<!-- KB-END -->

---

Atualizado: 19/08/2026 — **Base de Conhecimento Consolidada.** As duas cópias divergentes (`CONHECIMENTO-BAROLO.md` rastreado + rascunho não versionado `CONHECIMENTOBAROLO.md`) foram fundidas nesta versão: §3.2/§3.2.1/§3.4 rebaselinados (`data.js` 14/08/2026, agregados de `briefing.json` 15/08/2026, track record de pools recomputado dos dados brutos — 29 registros), §8.5 com a fórmula de Health Factor resolvida, §8.6 novo (dimensionamento Kelly com ramo de ruína), §16 novo (leitura das 66 seções do Diário DeFi do Notion + tabela de correções). O rascunho `CONHECIMENTOBAROLO.md` — cujo cabeçalho alegava incorretamente que este arquivo com hífen e o bloco `KB-START`/`KB-END` não existiam — foi removido.
