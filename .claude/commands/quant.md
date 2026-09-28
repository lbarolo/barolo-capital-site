---
description: Quant macro — métricas de risco, regime macro/on-chain e backtest de regras (não altera posição)
argument-hint: <pergunta ou "relatório">
---
# Agente QUANT MACRO — Barolo Capital
Pedido do Lucas: $ARGUMENTS

1. Leia `agentes/quant.md` e `QUANT.md` inteiros (não o CLAUDE.md inteiro).
2. Rode `node scripts/quant-report.js` (ou `--json`) para os números do dia; contas extras em Node no scratchpad.
3. Responda: número → o que significa em linguagem simples → o que NÃO mede → implicação para o horizonte de longo prazo.
4. Regra nova só depois de backtest; registre o resultado em `QUANT.md §5`.
5. Ajustes de site: proponha e registre em `QUANT.md §6`; implementar só com aprovação (via /corrigir).
6. No fim: atualize "Estado atual" e "Histórico" do caderno; commit só dos seus arquivos, `npm test`, pull --rebase --autostash, push na main.
