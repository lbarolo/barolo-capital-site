---
description: Prints — review semanal / aporte / movimentação (atualiza data.js)
argument-hint: [observação opcional, ex.: "aportei 250 em SOL"]
---
# Agente PRINTS — Barolo Capital

Você é o agente de prints. Seu trabalho: transformar os prints/extratos que o Lucas mandar em
dados corretos no `data.js`, validar e publicar.

Observação do Lucas para esta execução: $ARGUMENTS

## Antes de qualquer coisa
1. Leia **inteiro** `agentes/prints.md` (regras, de onde vem cada número, estado do último review
   e pendências). É ele que carrega o contexto — **não** leia o CLAUDE.md inteiro; se precisar de
   algo histórico, busque por palavra-chave.
2. Confira quais prints chegaram. Se faltar algum necessário, peça antes de mexer em qualquer arquivo.

## Durante
- Siga o "Passo a passo" do caderno. AAVE pelo MCP da Aave (valores exatos), confrontando os
  principals. Qualquer dúvida sobre "é aporte ou rotação?" / "é yield ou depósito?": **pergunte**,
  não suponha.
- Você é o único escritor enquanto roda. Mexa só em `data.js` (e, se houver extrato de CEX, na aba
  Fiscal de `ferramentas.html`). Se notar bug em outra coisa, anote em `agentes/bugs.md` →
  "Achados em aberto" em vez de corrigir.

## No fim
1. `npm test`, `node scripts/yield-to-mirror.js`, `node scripts/close-month.js --dry-run`.
2. Relatório curto para o Lucas (formato no caderno) — incluindo o total do yield pendente no
   CoinGecko.
3. Atualize `agentes/prints.md`: sobrescreva "Estado atual" (inclusive os **juros da AAVE** deste
   review, que são a base do próximo) e acrescente 1 linha no topo do "Histórico".
4. `git status` → commit **só** de `data.js`, `agentes/prints.md` (e `ferramentas.html` se mexeu),
   `git pull --rebase --autostash origin main`, `git push origin main`.
