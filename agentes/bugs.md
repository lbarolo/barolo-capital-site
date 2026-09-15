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
_(varredura de 15/09/2026: todos os achados existem no HEAD commitado `af2c418`, nenhum veio da
Fase 3 não commitada)_
- [MÉDIA] `pools.html:1798-1813` (Meta de Alocação) — `QTYS` próprio com dados de junho (BTC
  0,00204 × 0,00434 · ETH 2,376 × 2,233 · SOL 23,31 × 24,95; falta SCR; fallback `7900`). O erro
  líquido hoje é só +US$ 18 **por coincidência** (os desvios se cancelam). Correção: ler
  `BAROLO_DATA.holdings`. (14/09, conferido 15/09/2026)
- [MÉDIA] `ferramentas.html:3723-3727` — APY Scanner (aba "Pools APY") nunca funciona: as 3 URLs
  são o serviço hospedado `api.thegraph.com/subgraphs/name/uniswap/...`, que responde
  301 → `error.thegraph.com`. Correção: GeckoTerminal (já usado no pools) ou gateway do The Graph
  com chave. (15/09/2026)
- [MÉDIA] `scripts/fetch-briefing.js:29,205` — "SOL liquida em" usa LT SOL 0,82 / USDS 0,80
  (Liq. LTV implícito 0,818), mas a Kamino informa 0,766 (`data.js → liqLtv`). Card do pools
  mostra US$ 25,43 (−75%); a conta com o `liqLtv` dá ≈ US$ 27,76 (−72%). Correção: usar o
  `liqLtv` do `data.js` (ou LT por ativo da API). Mesma constante `LT` do item de HF abaixo.
  (15/09/2026)
- [MÉDIA] `relatorio.html:399` + `POOLS_DATA` — resumo de pools diz "27 pools", mas a lista tem
  17; fees 2.369,02 / resultado −880,53 contra 2.466,02 / −793,53 do `POOLS` do pools (32
  entradas). Correção: mesma fonte nas duas páginas. (15/09/2026)
- [MÉDIA] `ferramentas.html` (~linha 2216, merge do Diário) — no conflito de `id` o
  localStorage sempre vence o `diario.js`. Consequência: **editar uma entrada que já existe no
  `diario.js` nunca chega ao navegador do Lucas**, e o próximo "📤 Sincronizar" exporta a versão
  antiga e desfaz a edição. Hoje a saída é criar entrada nova (foi o que se fez com a nota de
  revisão de agosto em 15/09). Correção sugerida: campo `updated` nas entradas e o merge ficar
  com a versão mais nova. ⚠️ Em 15/09 o `ferramentas.html` tinha trabalho não commitado de outra
  sessão (Fase 3) — confirmar antes de mexer. (15/09/2026)
- [BAIXA] `portfolio_analytics.html` — card ADA nunca mostra valor em USD: lê
  `window._livePrices`, que ninguém grava. (14/09/2026)
- [MÉDIA] `pools.html:1509-1673` e `1677-1792` — `fetchAaveData`/`fetchKaminoData` escrevem em
  ids que não existem (`aave-liq-main`, `aave-hf-badge`, `kamino-liq-main`…) mas ainda fazem rede
  a cada carregamento (eth_call em 2 spokes, 2× API Kamino, 2× preço), com RPCs mortos
  (`rpc.payload.de`, `eth.llamarpc.com` 525) e constantes de junho. Sobraram da Fase 2.
  Correção: remover (o `lib/barolo-chain.js` já cobre). (15/09/2026)
- [BAIXA] `relatorio.html:445` — "Última Compra" fixa em "+0.999 SOL @ $78.78 (Abr/2026)"; há
  compra mais recente no Diário (SOL 0,374988 @ $76,01 em 05/08/2026). Correção: ler a última
  entrada `type:'trade'` do `diario.js` (carregar o arquivo na página) ou tirar a linha. (15/09/2026)
- [BAIXA] `pools.html:2674` — ticker chama a Etherscan V1 com `apikey=YourApiKeyToken` a cada 60 s
  (endpoint deprecado; resultado não usado — o gas vem da Alchemy). Correção: remover. (15/09/2026)
- [BAIXA] `portfolio_analytics.html:2629, 2654-2658` — Convexidade com fallbacks fixos (dívida
  754,65 + 815,97, stables 2.536,40, colateral AAVE 6.000) e `kaminoLTVlimit = 0.7722` sempre
  (data.js: 0,766). Correção: ler o `data.js`. (15/09/2026)
- [BAIXA · código morto] `portfolio_analytics.html:1909-2040` (`fetchAllOnChain` e cia, sem
  chamador) · `portfolio_analytics.html:4196-4210` e `pools.html:1822-1834` (`LP_REFS`/`REFS` +
  `setRef`, sem `.ref-btn`) · `pools.html:2601-2608` (escreve em `lp-weth-usd` inexistente) ·
  `index.html:1559` (`loginAccess` sem chamador; `#access-error` não existe) ·
  `index.html:2486-2581` (drill-down anual sem canvas, com array `MR` de retornos estimados à mão
  que contradiz a curva — armadilha se reativar). (15/09/2026)
- [BAIXA] `.github/workflows/{briefing,networth,onchain,sync-emprestimos}.yml` ainda em
  `checkout@v4`/`setup-node@v4`/Node 20 (os outros em v5/Node 22). Previsto na Fase 5. (15/09/2026)
- [BAIXA] `Design.md:203` diz que o pools tem 2 `<nav>`; o duplicado foi removido em 13/07.
  (15/09/2026)
- [A CONFIRMAR] LT real da SOL na Kamino — a API pública só dá `maxLtv` 0,74. Se o
  `emprestimos.html` usa 0,82/0,80, o card de lá também erra o preço de liquidação. Precisa do LT
  por ativo (`klend/loans`) ou print da Kamino. (15/09/2026)
- [A CONFIRMAR] `bc-lang` preso em "en": nenhum dashboard tem botão de idioma; se o navegador tiver
  `bc-lang = en` salvo, portfolio/pools/ferramentas ficam em EN sem volta pela interface.
  (15/09/2026)
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
  0,83/0,78. Números diferentes no card de pools. (14/09/2026)

## Resolvidos
_(o `/corrigir` move os itens para cá, com data e hash do commit)_
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
- 15/09/2026 — `.claude/commands/fecharmes.md` desatualizado (mandava adicionar a curva em
  `portfolio_analytics.html` e preencher `monthlyReturns`, que hoje são automáticos). Reescrito:
  curva pela Action `close-month.yml`, checagem de `contributions`, `RENDA_2026`,
  `jurosAcumulados`, yield no CoinGecko acumulando, Diário com patrimônio líquido.

## Estado atual
- Última varredura completa: **15/09/2026** (subagente `bugs`, HEAD `af2c418`). 109/109 testes
  verdes e invariantes do `data.js` OK, mas 3 números visíveis errados (P&L da landing, lending
  do relatório, colateral do pools) — todos por valor fixo ou cache lido errado, não por cálculo.
  Actions rodando todo dia de 20/08 a 14/09.

## Histórico (mais recente no topo)
- 15/09/2026 — 1ª varredura completa do agente: 3 ALTA, 6 MÉDIA, 5 BAIXA (+ código morto), 2 a confirmar.
- 15/09/2026 — caderno criado; fila semeada com os achados abertos das sessões de 14/09 e 15/09.
