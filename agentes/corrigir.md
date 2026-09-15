# Caderno — Corrigir o site

> Lido pelo comando `/corrigir`. **Atualizar "Estado atual" e "Histórico" no fim de toda execução.**
> Fila de trabalho: "Achados em aberto" de `agentes/bugs.md` e `agentes/seguranca.md`.

## Mapa rápido
| Coisa | Onde |
|---|---|
| Posições e dados | `data.js` (fonte única) — mudança de DADO é papel do `/prints` |
| Cálculo (retornos, TWR, TIR, patrimônio) | `lib/barolo-core.js` |
| Leitura on-chain (AAVE, Kamino, Cardano) | `lib/barolo-chain.js` |
| Tema/idioma compartilhados | `lib/barolo-ui.js` (Fase 3 — conferir no `git status` se já foi commitado) |
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
9. Mover o item de "Achados em aberto" para "Resolvidos" no caderno de origem (com hash do commit).
10. Atualizar "Estado atual" e "Histórico" abaixo.

## Falsos positivos (não "corrigir")
- `depth=-1` / parênteses desbalanceados em scripts com template literal.
- Funções com o mesmo nome em IIFEs diferentes (`fmt`, `ready`, `pxAt`, `setEl`, `setLive`).
- `</script>` dentro de string JS.
- `ETH.invested` diferente do CoinGecko (migração de custo deliberada para o USDT).
- USDT/USDS com custo zero no CoinGecko (reset de março/2026).

## Estado atual (15/09/2026)
- Plano de arquitetura em andamento: Fase 1 (`barolo-core`) ✅ · Fase 2 (`barolo-chain`) ✅ ·
  **Fase 3 (`barolo-ui.js`) com trabalho não commitado no working tree em 15/09** (Design.md, 5
  páginas, `tests/ui*.test.js`) — de outra sessão; não commitar sem o Lucas confirmar que é para
  seguir. Fases 4 (rede), 5 (Actions) e 6 (des-bundlar `emprestimos.html`) pendentes.

## Histórico (mais recente no topo)
- 15/09/2026 — caderno criado.
