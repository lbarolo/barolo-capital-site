# Caderno — Segurança

> Usado pelo subagente `seguranca` (só leitura), chamado com `/seguranca`. O subagente **não
> edita arquivos**: devolve o relatório e quem chamou atualiza este caderno.
> Correções vão para o `/corrigir`; ações na carteira/contas são **sempre do Lucas**.

## O que verificar (checklist)
1. **A regra inegociável:** nenhum endereço de carteira (`0x` + 40 hex, Solana, Cardano), NFT ID
   ou identificador único em **URL pública** — `href`, `src` de iframe, query string, links em `.md`.
   No JavaScript pode (decisão de 05/09/2026).
2. **Anonimato do site:** `robots.txt` bloqueando tudo; `<meta name="robots" content="noindex, nofollow">`
   em **todos** os `.html`; nenhum nome, telefone, e-mail pessoal ou dado pessoal novo em arquivo
   rastreado (o único e-mail público é o de contato da landing).
3. **Arquivos privados fora do git:** `git ls-files` não pode ter `*.xlsx`, `*.pdf`, `DIARIO DEFI E PRINTS/`,
   `EXPORTS SEMANAIS/`, `*-posicoes.json` (conferir contra o `.gitignore`).
4. **Segredos:** chave nova que não seja as já conhecidas do front-end (Alchemy, Helius, Blockfrost —
   ficam no JS por necessidade de site estático). Procurar também no histórico recente
   (`git log -p -S "<padrão>" --since=...`). Token do GitHub ou `RB_TOKEN` jamais podem aparecer —
   só em `secrets.*` nas Actions.
5. **Actions:** `permissions:` mínimas; nenhum `echo` de secret; versões de actions fixadas;
   scripts não imprimem endereço (o `eth-sweep` imprime só índice de carteira).
6. **Scripts de CDN:** versão fixa (sem `@latest`), só de hosts conhecidos (cdnjs, jsdelivr,
   fontes Google/Fontshare). Listar os que não têm SRI (informativo).
7. **Address poisoning** (quando o Lucas pedir ou houver print de transação): conferir endereço
   **inteiro**, desconfiar de token com nome imitando USDT/ETH (caractere invisível, cirílico,
   Unicode), e de endereço que copia só o começo e o fim.
8. **Chaves de API:** lembrar que a proteção real é restringir por domínio no painel de cada
   provedor (Alchemy, Helius, Blockfrost) — tarefa do Lucas.

## Não re-sinalizar (decisões tomadas)
- Endereços de carteira nos HTMLs, `CLAUDE.md` e bundle — aceito em 05/09/2026. Não propor
  privatizar o repo nem reescrever histórico sem o Lucas pedir.
- Chaves Alchemy/Helius/Blockfrost no JS do front-end (inevitável em site estático) — só lembrar
  a restrição por domínio.
- `CLAUDE.md` rastreado apesar de estar no `.gitignore` (é assim desde o início).

## Casos reais já detectados (referência)
- **10/11/2026 — TAXA INJETADA POR EXTENSÃO DE NAVEGADOR (achado novo, investigado a pedido dele).** Os 3 swaps do dia na Ethereum pagaram **1,600% exatos** a um coletor rotulado no explorer como *Pocket Universe: Fee 4*, descontado do ETH **antes** de chegar na carteira. Confirmado on-chain: as 3 txs apontam para o mesmo endereço `0x9c87bb37…a40ad9`, e a mesma alíquota de 1,600% aparece em swaps de **outros usuários** no mesmo coletor → é tarifa fixa de 160 bps, não slippage nem erro. Cruzamento de todo o histórico do coletor (701 transfers desde ~mai/2026) com as 222 txs dele na Ethereum: **só esses 3**. Na Arbitrum (345 txs, 2 coletores testados): **zero**. Mas na **Solana em 02/10** houve ~1,6% num swap (os 4,91 USDC + 0,00137 SOL para `BjQh…kA7X` já registrados no `data.js`) — mesma alíquota, outra rede, o que aponta para a extensão e não para o site usado.
  **Mecanismo** (gist de um dev da MetaMask analisando a v0.39.0 da extensão, e a página oficial confirmando que existe a taxa e um toggle, sem nunca dizer a porcentagem): a extensão envolve o provider da carteira e **altera o calldata do swap antes da assinatura** (`PAY_PORTION` na Uniswap, `partnerFee` no CoW, `appFees` em marketplaces). O gist também acusa que ela desliga sozinha o UniswapX e o 1-click da Uniswap com o diálogo escondido ("user never sees it"), e que a taxa está atrelada ao setting de *insurance*, que vem **ligado por padrão** e tem **delay de 24h** ao ser desligado (`INSURANCE_DISABLE_DELAY_MS`). O gist mediu 80 bps naquela versão; on-chain hoje são **160 bps**.
  ⚠️ O ponto de segurança não é o valor (US$ 2,02 nesses 124) — é que **uma extensão modifica a transação entre o que ele vê e o que ele assina**. É o mesmo mecanismo de um drainer, com finalidade diferente. Vale como regra geral: conferir o destino e o valor **na tela da carteira**, não na da interface do swap.
- **28/08/2026** — carteira principal: duas saídas falsas de 408,564790 com tokens `Ụ᠋5` e `US͏DT`
  (caractere invisível) + endereço clonado copiando início e fim do endereço real da AAVE.
- **04/02/2026** — ERC-20 falso chamado "ETH" de endereço imitando o da exchange, com o mesmo valor
  do saque real.
- Endereço de hot wallet "enviando" token de nome falso não prova que a contraparte é maliciosa —
  são eventos forjados por contratos de spam.
- Publicado para o Lucas em `ferramentas.html` → aba Alertas (`#sec-poisoning`).

## Formato de cada achado
`[CRÍTICO|ALTO|MÉDIO|INFO] onde — o risco · evidência · o que fazer · quem faz (Claude via /corrigir | Lucas)`

## Achados em aberto
- [MÉDIO · Lucas] **Extensão Pocket Universe injetando 1,600% nos swaps** (ver o caso de 10/11/2026 abaixo). Ação dele: desligar o *insurance/coverage* nas opções da extensão (a taxa só para 24h depois, por desenho) ou remover a extensão; e, no próximo swap, conferir se o coletor terminado em `a40ad9` ainda aparece. Em 3–4 swaps/mês a tarifa custa ~US$ 100/ano, mais que o yield líquido mensal do lending. (10/11/2026)
- [VERIFICAR · Claude] Gatilho `workflow_run` do `pages.yml` ainda não foi visto em produção (só dispara quando uma Action de dados termina). Na próxima atualização automática de `data.js`/`btc-onchain.json`, conferir em Actions se "Publicar site no GitHub Pages" rodou logo depois; se não, o cron diário (11:30 UTC) cobre. (07/11/2026)
- [MÉDIO · Lucas] Dado pessoal em `.md` público (os `.md` saíram do site em 07/11, mas o repo segue público no GitHub): idade ("31 anos"), renda necessária, saúde. Decidir se tira. (22/10/2026)
- [INFO · Lucas] Login ADM/102030 do index é só client-side e não protege nada; assumir como atalho ou usar StatiCrypt/Cloudflare Access. (22/10/2026)
- [BAIXA] SRI/versão fixa nas libs lazy (zoom/annotation em `ferramentas.html`, Chart.js em `pools.html` lazy) e `sync-emprestimos.yml` ainda em checkout/setup-node v4. (22/10/2026)
- [MÉDIO · Lucas] Restringir por domínio as chaves Alchemy, Helius e Blockfrost nos painéis de
  cada provedor (pendente desde 14/09/2026).
- [INFO] Repositório dentro do OneDrive (objetos temporários no `.git`) — considerar mover para
  fora do OneDrive (14/09/2026).

## Resolvidos
- 07/11/2026 · `edca504` — Pages não serve mais o repo inteiro: `scripts/build-pages.js` monta `_site/` só com 6 `.html`, `lib/`, `data.js`, JSONs de dados, `ui-polish.css`, `robots.txt`, `CNAME`, `.nojekyll`; `pages.yml` publica (Source do Pages = GitHub Actions, trocado pelo Lucas). Verificado ao vivo: `CLAUDE.md`, `QUANT.md`, `agentes/`, `tests/`, `scripts/`, `.claude/`, `package.json`, `.github/` dão 404; site e dados 200. `tests/pages-build.test.js` barra arquivo privado e referência quebrada. **Arquivo novo que o site passa a usar → acrescentar em `FILES`/`DIRS` do `build-pages.js`** (o teste avisa). Reverter: Source = "Deploy from a branch".
- 22/10/2026 · `31ad424` — XSS via nome de pool do GeckoTerminal (`pools.html`, `escHtml` + id [0-9A-Za-z]); Chart.js com SRI e 3 libs de CDN sem uso removidas; CSP mínima (object-src/base-uri/form-action); iframes de dApps com sandbox/referrerpolicy e sem `allow=*`; blocos mortos com NFT ID (pools) e chaves/carteiras (portfolio) removidos; escapes de dado local em `ferramentas.html`; `eth-sweep.yml` com `permissions: contents: read`.
- 16/06/2026 — endereço da carteira no `src` do iframe do Revert (movido para o JS).
- 08/07/2026 — e-mail de contato ofuscado por proxy Cloudflare restaurado.

## Estado atual
- 10/11/2026 — investigação pontual (pedida por ele) da taxa de 1,6% vista nos swaps do dia: identificada como **taxa injetada pela extensão Pocket Universe**, 160 bps fixos, coletor `…a40ad9`. Confirmada on-chain em 3 redes e contra outros usuários. Nenhuma varredura completa nesta sessão — a de 22/10 segue valendo.
- 22/10/2026 — 1ª varredura completa, método "redução de superfície de ataque" (Anthropic): 3 passes (config padrão · alcance precoce · interação entre configs). Corrigido em `31ad424`. Abertos abaixo.

## Histórico (mais recente no topo)
- 10/11/2026 — **taxa de 1,600% nos swaps rastreada até a extensão Pocket Universe** (coletor `…a40ad9`): confirmada on-chain nas 3 txs do dia, reproduzida em outros usuários do mesmo coletor, zero ocorrências na Arbitrum e 3 de 222 txs na Ethereum — mas bate com o ~1,6% da Solana em 02/10. O risco real é o mecanismo (altera a transação antes da assinatura), não o valor.
- 07/11/2026 — Pages passa a publicar só os arquivos do site (`edca504`); achado MÉDIO de 22/10 resolvido.
- 22/10/2026 — varredura de superfície de ataque; 7 correções em `31ad424`, 3 decisões para o Lucas.
- 15/09/2026 — caderno criado.
