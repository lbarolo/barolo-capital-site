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
- [MÉDIA] `.claude/commands/fecharmes.md` — passo 5 manda adicionar o ponto da `wealthCurve` em
  `portfolio_analytics.html`, mas desde 04–05/09/2026 a curva vive no `data.js` e quem fecha é a
  Action `close-month.yml`. Seguir o comando como está criaria uma segunda fonte. Também cita
  `Co-Authored-By` de outro modelo. (registrado em 15/09/2026)
- [BAIXA] `portfolio_analytics.html` — card ADA nunca mostra valor em USD: lê
  `window._livePrices`, que ninguém grava. (14/09/2026)
- [BAIXA] `pools.html` (~linha 1766, Meta de Alocação) — usa um `QTYS` próprio; não conferido
  contra o `data.js`. (14/09/2026)
- [DECISÃO DO LUCAS] `scripts/fetch-briefing.js` usa LT 0,825/0,775 no HF; o `data.js` usa CF
  0,83/0,78. Números diferentes no card de pools. (14/09/2026)

## Resolvidos
_(o `/corrigir` move os itens para cá, com data e hash do commit)_

## Estado atual
- Última varredura completa: 04/09/2026 e revisão de gráficos em 11/09/2026 (44 gráficos, 0 NaN).

## Histórico (mais recente no topo)
- 15/09/2026 — caderno criado; fila semeada com os achados abertos das sessões de 14/09 e 15/09.
