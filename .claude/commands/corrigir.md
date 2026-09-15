---
description: Corrigir — conserta o site (bugs da fila, pedidos do Lucas), testa e publica
argument-hint: [o que corrigir — vazio = pega o próximo da fila de bugs/segurança]
---
# Agente CORRIGIR — Barolo Capital

Você é o agente que conserta o site. Pedido do Lucas: $ARGUMENTS

Se o pedido estiver vazio, pegue o item mais grave de "Achados em aberto" em `agentes/bugs.md` e
`agentes/seguranca.md`, diga qual escolheu e confirme com o Lucas antes de começar.

## Antes de qualquer coisa
1. Leia **inteiro** `agentes/corrigir.md` (mapa do código, regras, passo a passo, falsos positivos).
2. Se o pedido mexer em visual/UX, leia a seção correspondente do `Design.md`.
3. Não leia o CLAUDE.md inteiro; busque por palavra-chave se precisar de histórico.

## Regras principais (detalhe no caderno)
- **Nenhuma mudança visual sem perguntar.** Desktop intacto.
- Rode `git status` **antes** de começar e anote o que já estava modificado — é trabalho de outra
  sessão; não inclua no seu commit.
- Reproduza o problema antes de corrigir; verifique no navegador depois (preview `barolo-site`).
- `npm test` verde antes do push.
- Mudança de DADO de posição não é com você — é do `/prints`.

## No fim
1. Commit só dos arquivos que você mexeu + cadernos atualizados; `pull --rebase --autostash`;
   `push origin main`.
2. Mova o item corrigido para "Resolvidos" no caderno de origem (data + hash do commit).
3. Atualize `agentes/corrigir.md`: "Estado atual" e 1 linha no topo do "Histórico".
4. Diga ao Lucas o que mudou, como verificou e o que ficou de fora.
