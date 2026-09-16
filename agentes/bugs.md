# Caderno — Caçador de bugs

> Usado pelo subagente `bugs` (só leitura), chamado com `/bugs`. O subagente **não edita
> arquivos**: ele devolve o relatório e quem chamou atualiza este caderno.
> Quem corrige é o `/corrigir`, que pega a fila em "Achados em aberto".

## O que varrer (checklist)
1. **Testes e sintaxe:** `npm test`; `node -c` nos scripts; `data.js` carrega em Node
   (`global.window={}; require('./data.js')`).
2. **Invariantes do `data.js`** (os de `tests/data.test.js` + estes): holding ≥ supply,
   supply ≥ principal, 3 arrays da `wealthCurve` alinhados, `invested` nunca cai, `cgMirror` sem
   diferença negativa, `asOf` recente (> 10 dias = review atrasado).
3. **Mesma métrica, mesmo número em todas as páginas:** patrimônio, TWR/CAGR, TIR, HF, dívida
   (index × portfolio × relatorio × pools). Divergência = alguém tem cópia própria do cálculo.
4. **Valor hardcoded defasado:** fallback que não lê o `data.js` (ex.: um HF, dívida, stables ou qty
   escrito à mão numa página). Comparar com o `data.js`.
5. **IDs órfãos:** `getElementById('x')` / `set('x')` sem elemento `id="x"` no HTML (e o inverso,
   elemento que nenhum código preenche).
6. **Endpoints mortos ou geo-bloqueados** (ex.: `price.jup.ag` já morreu; Binance dá 451 no Actions).
7. **Código morto** (função definida e nunca chamada, `return` no topo) — só reportar, não é urgente.
8. **Actions:** último run de cada workflow (se `gh` não estiver instalado, olhar o `git log` pelos
   commits automáticos do dia — ausência de commit de `networth`/`onchain`/`briefing` = falhou).
9. **Comandos/cadernos desatualizados** em `.claude/commands/` e `agentes/` contra o código atual.

## Não re-sinalizar (falsos positivos ou decisões tomadas)
- Endereços de carteira no repo público (aceito pelo Lucas em 05/09/2026). Só é bug se estiver em
  **URL pública**.
- Divergência histórica de Health Factor (encerrada em 09/09/2026; fórmula no `data.js`).
- `depth=-1`/parênteses em template literal; funções homônimas em IIFEs separadas; `</script>` em string.
- CoinGecko 429 / CDN bloqueado / screenshot travando no ambiente local.
- `emprestimos.html` ser bundle (é assim; dados via Action).
- `ETH.invested` ≠ CoinGecko; USDT/USDS com custo zero no CoinGecko.

## Formato de cada achado
`[ALTA|MÉDIA|BAIXA] arquivo:linha — o que está errado · evidência (valor visto × esperado) · correção sugerida`

## Achados em aberto
_(varreduras de 15/09/2026: a 1ª no HEAD `af2c418`, a 2ª no HEAD `584a48a`, depois da Fase 3
`b4523fa`. A Fase 3 não introduziu regressão; os itens novos da 2ª varredura são valores fixos de
20/06 que já existiam)_
- [MÉDIA] `portfolio_analytics.html:1619-1633` e `:2133-2146` — executive bar lê
  `WEEKLY_UPDATE.defi` com quantidades de 20/06 (USDT 1300, SOL 23,36, USDS 302,25) e deixa de fora
  o yield do WETH. "Yield DeFi/Mês" (`ev-yield`) mostra ≈ +US$ 5,06 × esperado **+US$ 15,57** (=
  carry do `briefing.json` e do card "Leitura da carteira" do pools; o WETH sozinho vale
  US$ 8,05/mês). "Kamino LTV" (`ev-hf-kamino`) 28,9% × **27,3%**. Correção: quantidades de
  `BAROLO_DATA.defi`/`lendingSnapshot`, somar o supply do WETH e trocar os APYs de fallback de junho
  (5,38 / 5,69 / 1,60 / 4,89 / 5,00) pelos do `data.js`. (2ª varredura 15/09/2026)
- [MÉDIA] `ferramentas.html:808-810, 838-840, 845` — calculadora de liquidação (aba Liquidação)
  abre com as posições de 20/06: `aave-eth` 2.16 · `aave-usdt` 1300 · `aave-debt` 754.65 ·
  `kam-sol` 23.36 · `kam-pyusd` 302.25 · `kam-debt` 815.97 · `kam-liq-thresh` 75.79 × `data.js`
  2,225494 · 2.016,82 · 763,05 · 24,95 · 304,86 · 764,14 · liqLtv 0,766. O override do `BASE`
  (2515-2527) só alimenta o simulador de cenários; ninguém preenche esses inputs. Correção: no load,
  copiar `BASE.aaveETH/aaveUSDT/aaveDebt/kamSOL/kamPYUSD/kamDebt/kamLiqThresh` para os `value`
  antes de `calcAave()`/`calcKamino()`. (2ª varredura 15/09/2026)
- [MÉDIA] `ferramentas.html:3465-3469` — `checkAlerts()` (a cada 5 min e a cada preço) usa as
  quantidades de junho com fator 0,86: HF 7,48 × **7,96** (fórmula CF do `data.js`), LTV Kamino
  30,9% × **27,3%** (erro conservador, mas o limite do Lucas deixa de significar o que ele pensa). O
  alerta "Uniswap Fora do Range" usa o range 1822,61–2401,90 de uma pool fechada e **dispara com ETH
  a 2.438 sem existir pool aberta** (`defi.uniswapV3.status: 'closed'`). Correção: mesma fonte do
  item acima (CF 0,83/0,78); tirar o alerta de range ou ligá-lo a `defi.uniswapV3` só com pool
  aberta. `aaveHFEl` (3461) não é usada. (2ª varredura 15/09/2026)
- [MÉDIA] `ferramentas.html:3724-3726` — APY Scanner (aba "Pools APY") nunca funciona: as 3 URLs
  são o serviço hospedado `api.thegraph.com/subgraphs/name/uniswap/...`, que responde
  301 → `error.thegraph.com`. Correção: GeckoTerminal (já usado no pools) ou gateway do The Graph
  com chave. (15/09/2026)
- [MÉDIA] `scripts/fetch-briefing.js:29,205` — "SOL liquida em" usa LT SOL 0,82 / USDS 0,80
  (Liq. LTV implícito 0,818), mas a Kamino informa 0,766 (`data.js → liqLtv`). Card do pools
  mostra US$ 25,43 (−75%); a conta com o `liqLtv` dá ≈ US$ 27,76 (−72%). Correção: usar o
  `liqLtv` do `data.js` (ou LT por ativo da API). Mesma constante `LT` do item de HF abaixo.
  (15/09/2026)
- [MÉDIA] `ferramentas.html` (~linha 2216, merge do Diário) — no conflito de `id` o
  localStorage sempre vence o `diario.js`. Consequência: **editar uma entrada que já existe no
  `diario.js` nunca chega ao navegador do Lucas**, e o próximo "📤 Sincronizar" exporta a versão
  antiga e desfaz a edição. Hoje a saída é criar entrada nova (foi o que se fez com a nota de
  revisão de agosto em 15/09). Correção sugerida: campo `updated` nas entradas e o merge ficar
  com a versão mais nova. (A Fase 3 já foi commitada em `b4523fa` — o arquivo está livre.) (15/09/2026)
- [BAIXA] `portfolio_analytics.html:5059` — card ADA nunca mostra valor em USD: lê
  `window._livePrices`, que ninguém grava. (14/09/2026)
- [BAIXA] `index.html:2128` (`buildInflationChart`) + `:1573`, e `relatorio.html:800` + `:486` —
  os gráficos leem a cor do tema na construção e a `toggleTheme()` dessas duas páginas não passa
  gancho de rebuild para `BaroloUI.toggleTheme`: ao ir para o claro, ticks do gráfico de inflação
  continuam `#e8dfc8` sobre fundo claro até recarregar. Não é regressão (antes também não refazia).
  Correção: `BaroloUI.toggleTheme(function(){ buildInflationChart(...) })` e o equivalente no
  relatório. (2ª varredura 15/09/2026)
- [BAIXA] `ferramentas.html:2210` — `STORAGE_ALERTS = 'bc-alerts-v2'` declarado e nunca usado:
  toggles e limites dos alertas não persistem entre recargas. Só é bug se a intenção for lembrar os
  alertas ligados. (2ª varredura 15/09/2026)
- [BAIXA] `relatorio.html` (`renderPoolTable`) — formatação dos valores da tabela de pools: fees
  sem casas fixas ("$31,7", "$0,8") e IL montado com `'−$'+p.il`, sem locale ("−$6.55" com ponto).
  Já existia; ficou mais visível com os valores agregados. Correção: `toLocaleString('pt-BR',
  {minimumFractionDigits:2, maximumFractionDigits:2})` nas três colunas. (15/09/2026)
- [BAIXA] `relatorio.html:445` — "Última Compra" fixa em "+0.999 SOL @ $78.78 (Abr/2026)"; há
  compra mais recente no Diário (SOL 0,374988 @ $76,01 em 05/08/2026). Correção: ler a última
  entrada `type:'trade'` do `diario.js` (carregar o arquivo na página) ou tirar a linha. (15/09/2026)
- [BAIXA] `portfolio_analytics.html:2629, 2654-2658` — Convexidade com fallbacks fixos (dívida
  754,65 + 815,97, stables 2.536,40, colateral AAVE 6.000) e `kaminoLTVlimit = 0.7722` sempre
  (data.js: 0,766). Correção: ler o `data.js`. (15/09/2026)
- [BAIXA · código morto] `portfolio_analytics.html:1909-2040` (`fetchAllOnChain` e cia, sem
  chamador) · `portfolio_analytics.html:4196-4210` e `pools.html:1822-1834` (`LP_REFS`/`REFS` +
  `setRef`, sem `.ref-btn`) · `pools.html:2601-2608` (escreve em `lp-weth-usd` inexistente) ·
  `index.html:1559` (`loginAccess` sem chamador; `#access-error` não existe) ·
  `index.html:2486-2581` (drill-down anual sem canvas, com array `MR` de retornos estimados à mão
  que contradiz a curva — armadilha se reativar). Linhas podem ter andado com a Fase 3. (15/09/2026)
- [BAIXA] `.github/workflows/{briefing,networth,onchain,sync-emprestimos}.yml` ainda em
  `checkout@v4`/`setup-node@v4`/Node 20 (os outros em v5/Node 22). Previsto na Fase 5. (15/09/2026)
- [A CONFIRMAR] `data.js → poolHistory`, "ETH/USDC 0.05%" Arbitrum (01/08/2023 → 26/03/2024):
  `days: 209`, mas as datas dão 238 dias (o `fcr` 3,8 bate com 209). Ou a abertura ou os dias estão
  errados — precisa do Diário. O teste só confere `result = fees − il`. (2ª varredura 15/09/2026)
- [A CONFIRMAR] LT real da SOL na Kamino — a API pública só dá `maxLtv` 0,74. Se o
  `emprestimos.html` usa 0,82/0,80, o card de lá também erra o preço de liquidação. Precisa do LT
  por ativo (`klend/loans`) ou print da Kamino. (15/09/2026)
- [A CONFIRMAR · risco menor] `bc-lang` preso em "en": depois da Fase 3 nenhuma página escreve mais
  `bc-lang` (os `toggleLang()` de portfolio/pools/ferramentas não têm `onclick`). Só um valor antigo
  já salvo no navegador prende o idioma; não surgem casos novos. Sugestão: fechar, ou o `bootLang`
  ignorar `en` enquanto não houver botão. (15/09/2026)
- [DECISÃO DO LUCAS] `index.html`, card "Portfolio Assets" — o "+%" é uma 4ª definição de ROI
  (holdings sem stables ÷ custo de aquisição): ≈ +4,9% hoje, contra ≈ +16% do ROI de destaque do
  dashboard (patrimônio líquido ÷ aporte). Alinhar a conta ou só o rótulo "sobre o capital
  investido"? (15/09/2026)
- [DECISÃO DO LUCAS] `relatorio.html`, Resumo Executivo — "Total Investido" tem o subtítulo
  "capital aportado", mas mostra o **custo de aquisição** ($10.608); o aporte líquido é $8.162. E o
  "P&L Total" do PDF é bruto, sem descontar a dívida (+$437, +4,1%), enquanto o dashboard mostra
  ROI sobre aporte (≈ +16%) e sobre custo com dívida descontada (≈ −10%). Trocar o subtítulo para
  "custo de aquisição" e/ou alinhar a conta ao dashboard? (15/09/2026)
- [DECISÃO DO LUCAS] `scripts/fetch-briefing.js` usa LT 0,825/0,775 no HF; o `data.js` usa CF
  0,83/0,78. Números diferentes no card de pools (HF 7,92 × 7,96 em 15/09). (14/09/2026)

## Resolvidos
_(o `/corrigir` move os itens para cá, com data e hash do commit)_
- 16/09/2026 · `0121e9e` — [BAIXA] pools: ticker chamava a Etherscan V1 com `YourApiKeyToken` a
  cada 60 s sem usar o resultado. Removido na Fase 4 (preço via `lib/barolo-prices.js`).
- 16/09/2026 · `0121e9e` — [BAIXA] `Design.md` dizia que o pools tem 2 `<nav>`. Corrigido.
- 15/09/2026 · `7b1902d` — [ALTA] landing, card "Portfolio Assets": `prices()` lia o nível de
  cima de `bc-index-prices-cache` (gravado como `{ts, data}`) e caía sempre nos preços `FB` —
  P&L +53,8%. Agora lê `data`. Verificado: +7,5% com preços semeados (= conta em Node) e +4,9%
  com os preços ao vivo (= conta com o cache). Sobrou só a decisão sobre a definição/rótulo desse
  "+%" (ver "Achados em aberto").
- 15/09/2026 · `e49aadc` + `9fe0b8f` — [ALTA] relatório PDF: bloco de lending, KPI de dívida,
  "Período" e "Capital em Caixa" eram textos fixos de 20/06 (HF 5.32, dívida $1.569, SOL 23,36,
  LTV 41,2%, "Abril 2026"). Agora leem o `data.js`; HF e LTV recalculados com preço ao vivo pela
  `lendingSnapshot` (sem preço ao vivo: valor do `data.js`). ⚠️ O `e49aadc` saiu com dois blocos
  deslocados (quebrava a `renderKPIs()`); corrigido no `9fe0b8f` minutos depois. Verificado:
  HF 8,07 = fórmula (8,067), LTV 27,0% = 27,04%, caminho sem preço = 8,21 / 26,7%.
- 15/09/2026 · `4b700a8` — [ALTA] relatório PDF: `STABLES_COST` era 882,64 (custo do CoinGecko,
  zerado no reset de março) e somava ≈ US$ 1.624 de ganho fantasma. Agora = Σ `stables[].invested`
  do `data.js` (2.479,19). Antes → depois: Total Investido $9.011 → $10.608 (= custo de aquisição
  do dashboard), P&L +$2.033 (+22,6%) → +$437 (+4,1%), linha STABLES +$1.624 (+184%) → +$27
  (+1,1%, = yield de lending). Conferido também na cópia exata do commit.
- 15/09/2026 · `aab2279` — [ALTA] pools, tabela "Colateral em Empréstimos" + nota abaixo dela:
  quantidades e dívidas do print de 13/03 (total $8.637,95). Agora vêm de `data.js → defi.*`
  (total $10.357,95 = conta com os mesmos preços). O `catch` usa o último preço salvo em vez de
  ETH 2.074 / SOL 86 fixos; sem preço de ETH/SOL o total mostra "—". Linha ETH/WETH da tabela de
  fees não chama mais de "ativa (uncollected)" a pool fechada em 14/07. Conferido na cópia exata
  do commit.
- 15/09/2026 · `a80a193` — [MÉDIA] pools, Meta de Alocação: `QTYS` próprio de junho (sem SCR e sem
  LP), fallbacks de dívida 754,65/815,97 e patrimônio 7.900, e US$ 1 por token sem preço. Agora o
  `pools.html` carrega `lib/barolo-core.js` e a Meta usa `BaroloCore.netWorth` (a mesma conta do
  dashboard e do snapshot diário) com a dívida ao vivo; sem preço de BTC/ETH/SOL mostra "—".
  Verificado: $9.507 (meta $475) = conta com os mesmos preços; caminho sem preço = "—"; cópia do
  commit conferida.
- 15/09/2026 · `f84856b` — [MÉDIA] pools: `fetchAaveData`/`fetchKaminoData` removidas (285
  linhas). Preenchiam 36 ids inexistentes (conferido no HTML e no DOM) e faziam rede à toa.
  Resultado: 6 chamadas a menos por carregamento (eth.drpc 2→0, Kamino 4→2, CoinGecko 6→4);
  dívida/HF ao vivo seguem pela `barolo-chain`; Meta, colateral, 10 gráficos e console iguais.
  Cópia do commit conferida.
- 15/09/2026 · `b97e713` — [MÉDIA] resumo de pools do relatório divergia do pools (17 linhas à
  mão, "27 pools", fees $2.369,02 / resultado −$880,53). O histórico virou fonte única em
  `data.js → poolHistory` (movido verbatim, JSON idêntico); o pools lê de lá (10 gráficos e P&L
  YTD idênticos ao antes) e o relatório agrupa por par+rede (20 linhas, fees $2.466,02 / IL
  −$3.259,55 / resultado −$793,53, "32 pools · 2023–2026"). Teste novo em `tests/data.test.js`.
- 15/09/2026 — `.claude/commands/fecharmes.md` desatualizado (mandava adicionar a curva em
  `portfolio_analytics.html` e preencher `monthlyReturns`, que hoje são automáticos). Reescrito:
  curva pela Action `close-month.yml`, checagem de `contributions`, `RENDA_2026`,
  `jurosAcumulados`, yield no CoinGecko acumulando, Diário com patrimônio líquido.

## Estado atual
- Última varredura completa: **15/09/2026 (2ª do dia)**, HEAD `584a48a`, depois da Fase 3. 110/110
  testes verdes, invariantes do `data.js` OK (`asOf` 11/09, 4 dias), Fase 3 sem regressão. Nenhum
  ALTA. Os 3 MÉDIA novos são o mesmo padrão de sempre: valor fixo de 20/06 que não lê o `data.js`
  (executive bar do dashboard, calculadora de liquidação e alertas do ferramentas — este último
  dispara alerta de range de uma pool fechada). Actions de 15/09 commitaram; `tests.yml` pós-`b4523fa`
  não conferido (sem `gh`).

## Histórico (mais recente no topo)
- 15/09/2026 — 2ª varredura (pós-Fase 3): 0 ALTA, 3 MÉDIA, 2 BAIXA e 1 a confirmar novos; 4 itens da fila atualizados.
- 15/09/2026 — 1ª varredura completa do agente: 3 ALTA, 6 MÉDIA, 5 BAIXA (+ código morto), 2 a confirmar.
- 15/09/2026 — caderno criado; fila semeada com os achados abertos das sessões de 14/09 e 15/09.
