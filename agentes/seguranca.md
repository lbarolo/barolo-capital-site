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
- [MÉDIO · Lucas] Restringir por domínio as chaves Alchemy, Helius e Blockfrost nos painéis de
  cada provedor (pendente desde 14/09/2026).
- [INFO] Repositório dentro do OneDrive (objetos temporários no `.git`) — considerar mover para
  fora do OneDrive (14/09/2026).

## Resolvidos
- 16/06/2026 — endereço da carteira no `src` do iframe do Revert (movido para o JS).
- 08/07/2026 — e-mail de contato ofuscado por proxy Cloudflare restaurado.

## Estado atual
- Nenhuma varredura completa feita por este agente ainda (caderno criado em 15/09/2026).

## Histórico (mais recente no topo)
- 15/09/2026 — caderno criado.
