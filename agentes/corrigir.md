# Caderno — Corrigir o site

> Lido pelo comando `/corrigir`. **Atualizar "Estado atual" e "Histórico" no fim de toda execução.**
> Fila de trabalho: "Achados em aberto" de `agentes/bugs.md` e `agentes/seguranca.md`.

## Mapa rápido
| Coisa | Onde |
|---|---|
| Posições e dados | `data.js` (fonte única) — mudança de DADO é papel do `/prints`. Inclui o histórico de pools (`poolHistory`, desde 15/09/2026) |
| Cálculo (retornos, TWR, TIR, patrimônio) | `lib/barolo-core.js` |
| Leitura on-chain (AAVE, Kamino, Cardano) | `lib/barolo-chain.js` |
| Tema/idioma compartilhados | `lib/barolo-ui.js` (`BaroloUI.bootTheme`/`toggleTheme(gancho)`/`applyI18n`) — carregado no `<head>` das 5 páginas |
| UX/design (cores, componentes, "quero mudar X → vá aqui") | `Design.md` |
| Páginas | `index.html` (landing pública), `portfolio_analytics.html`, `pools.html`, `emprestimos.html`, `ferramentas.html`, `relatorio.html` |
| Testes | `npm test` (`tests/*.test.js`), roda também no Actions (`tests.yml`) em todo push |
| Automação | `.github/workflows/` (networth, onchain, briefing, benchmark, close-month, sync-emprestimos, tests, eth-sweep) |

Se precisar de contexto histórico, **buscar no CLAUDE.md por palavra-chave** (Grep), não ler inteiro.

## Regras que não podem quebrar
1. **Zero mudança de UX/visual sem perguntar ao Lucas.** Em 06/07/2026 ele rejeitou um refactor de
   design system inteiro. Corrigir bug ≠ redesenhar.
2. **Desktop intacto.** Ajuste de mobile só dentro de `@media(max-width:768px)` ou com
   `auto-fit/minmax`.
3. **JetBrains Mono em todo número.** Paleta e tokens: `Design.md §2`.
4. **Privacidade:** nunca endereço de carteira, NFT ID ou identificador único em URL pública
   (link, `src` de iframe, query string). No JavaScript pode (decisão de 05/09/2026 — não reabrir).
5. **Cálculo novo ou mudança de fórmula vai em `lib/barolo-core.js`**, não em cópia dentro de
   página. Mudou a lib → os testes de equivalência mostram o efeito.
6. **`emprestimos.html` é um bundle**, mas o shell (CSS/HTML/JS, ~149 KB) é texto editável dentro
   de uma string JS (`\n` e `\"` literais) — dá pra editar por substituição exata sem aspas nem
   quebras reais no texto novo. Os dados chegam sozinhos pela Action `sync-emprestimos.yml`.
7. **Nunca salvar HTML via proxy Cloudflare** (ofusca e-mail com `data-cfemail`).
8. **Chart.js:** canvas não entende `var(--x)` como cor (usar a cor resolvida); gráfico com
   `maintainAspectRatio:false` precisa de wrapper com altura fixa; gráfico criado em aba oculta
   mede 0×0.

## Passo a passo
1. Ler este caderno + o item a corrigir (em `bugs.md`/`seguranca.md` ou o pedido do Lucas).
2. `git status` — anotar o que já estava modificado **antes** de começar (não é seu, não commitar).
3. `git pull --rebase --autostash origin main`.
4. Reproduzir o problema antes de mexer (no navegador ou em Node).
5. Corrigir. Se houver risco visual, perguntar antes.
6. `npm test` verde.
7. Verificar no navegador: `preview_start` com `barolo-site` (launch.json, porta 8080).
   - Console: filtrar por `Error:`; o console acumula entre navegações — para rede use
     `performance.getEntriesByType('resource')`.
   - `resize_window` antes de medir (o painel pode abrir 0×0).
   - Screenshot trava nas páginas longas/animadas → validar por DOM (`javascript_tool`).
   - CoinGecko 429 / CDN bloqueado no ambiente não é bug do site.
   - Para comparar antes/depois: `git show HEAD:<arquivo> > _<arquivo>_head.html` temporário, apagar depois.
8. Commit **só dos arquivos que você mexeu** + caderno(s) atualizados, mensagem `fix: ...` /
   `feat: ...`, com a linha de atribuição indicada pelo sistema. `pull --rebase`, `push origin main`.
   Conflito em `emprestimos.html`: `git checkout --ours emprestimos.html && node scripts/refresh-emprestimos-data.js`.
   - **Arquivo com trabalho alheio não commitado** (ex.: `index.html`/`relatorio.html` em 15/09):
     não dá `git add` nele, e `git add -p` não funciona aqui (interativo). Método que funciona
     para qualquer tipo de trecho (inclusive remoção pura): **HEAD + só os seus trechos, aplicados
     pelas posições exatas de linha** de `git diff -U0 HEAD -- <arquivo>` (de baixo para cima,
     conferindo que cada linha `-` é igual à do HEAD); grave com `git hash-object -w <tmp>` e
     `git update-index --cacheinfo 100644,<hash>,<arquivo>`. Antes de commitar, confira:
     scripts compilam, `git diff <HEAD> <hash>` tem só os seus trechos, e depois do commit
     `git diff -U0 HEAD -- <arquivo>` mostra só os trechos alheios.
   - ⚠️ **Nunca** use `git apply --cached --unidiff-zero` com parte dos trechos: ele posicionou
     inserções 8 linhas fora do lugar e o `e49aadc` foi publicado com a `renderKPIs()` quebrada
     (corrigido no `9fe0b8f`). Compilar não pega esse erro — só rodando.
   - **Teste a versão commitada, não só a da pasta:** `git show HEAD:<arquivo> > _<arquivo>_head.html`,
     abrir no preview, conferir, apagar.
   - **PowerShell 5.1 + aspas duplas na mensagem** quebra `git commit -m $msg` ("pathspec did not
     match"). Grave a mensagem num arquivo do scratchpad e use `git commit -F <arquivo>`.
9. Mover o item de "Achados em aberto" para "Resolvidos" no caderno de origem (com hash do commit).
10. Atualizar "Estado atual" e "Histórico" abaixo.

## Falsos positivos (não "corrigir")
- `depth=-1` / parênteses desbalanceados em scripts com template literal.
- Funções com o mesmo nome em IIFEs diferentes (`fmt`, `ready`, `pxAt`, `setEl`, `setLive`).
- `</script>` dentro de string JS.
- `ETH.invested` diferente do CoinGecko (migração de custo deliberada para o USDT).
- USDT/USDS com custo zero no CoinGecko (reset de março/2026).

## Estado atual (15/09/2026)
- Fila de bugs: **nenhum ALTA aberto** — resolvidos em 15/09 a landing (`7b1902d`), o lending do
  relatório (`e49aadc` + `9fe0b8f`), as stables do relatório (`4b700a8`) e o colateral do pools
  (`aab2279`); MÉDIA da Meta de Alocação do pools (`a80a193`), das funções mortas do pools
  (`f84856b`) e do resumo de pools do relatório (`b97e713`). Próximos MÉDIA: APY Scanner do
  ferramentas (The Graph desligado), "SOL liquida em" do briefing, merge do Diário.
- `pools.html` passou a carregar `lib/barolo-core.js` (15/09) — cálculo novo no pools usa a lib.
- Script de stage parcial: `stage-mine2.js` (scratchpad de 15/09; recria-se pelo método do passo 8).
- Plano de arquitetura: Fase 1 (`barolo-core`) ✅ · Fase 2 (`barolo-chain`) ✅ ·
  **Fase 3 (`barolo-ui.js`) ✅ `b4523fa`** (15/09). Tema/idioma de qualquer página: mudar no
  módulo; a `toggleTheme()` da página só passa o gancho de rebuild dos gráficos. Fases 4 (rede),
  5 (Actions) e 6 (des-bundlar `emprestimos.html`) pendentes.
- Com a Fase 3 no ar, os itens da fila que esperavam por ela estão liberados: aba Pools APY do
  ferramentas, Etherscan no ticker do pools, formatação da tabela de pools do relatório,
  fallbacks fixos da Convexidade.

## Histórico (mais recente no topo)
- 15/09/2026 — Fase 3: tema e idioma compartilhados em `lib/barolo-ui.js` (5 páginas), moeda morta de pools/ferramentas removida; zero mudança de UX, conferido nas 5 páginas — `b4523fa`.
- 15/09/2026 — histórico de pools vira fonte única (`data.js → poolHistory`); relatório agrega dela e para de divergir — `b97e713`.
- 15/09/2026 — pools: removidas `fetchAaveData`/`fetchKaminoData` (285 linhas mortas, −6 chamadas de rede) — `f84856b`.
- 15/09/2026 — pools: Meta de Alocação usa `BaroloCore.netWorth` (fim do `QTYS` de junho e do US$ 1 por token sem preço) — `a80a193`.
- 15/09/2026 — pools: tabela "Colateral em Empréstimos" + nota leem o `data.js` ($8.638 → $10.358) — `aab2279`.
- 15/09/2026 — relatório: custo das stables vem do `data.js` (P&L do PDF +$2.033 → +$437) — `4b700a8`.
- 15/09/2026 — relatório: bloco de lending/dívida/caixa/período passa a ler o `data.js` — `e49aadc` (publicado quebrado: blocos deslocados pelo stage parcial) + `9fe0b8f` (correção).
- 15/09/2026 — landing: card "Portfolio Assets" lia o cache de preços errado (+53,8% → +4,9%) — `7b1902d`.
- 15/09/2026 — `/fecharmes` reescrito para a arquitetura atual (curva automática, sem `monthlyReturns`).
- 15/09/2026 — caderno criado.
