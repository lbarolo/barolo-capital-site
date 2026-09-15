---
description: Bugs — roda o subagente caçador de bugs (só leitura) e registra a fila
argument-hint: [foco opcional, ex.: "só pools.html" ou "números da landing"]
---
# Lançar o agente BUGS

1. Use a ferramenta Agent com `subagent_type: "bugs"` e este pedido:
   "Faça a varredura descrita no seu checklist. Foco pedido pelo Lucas: $ARGUMENTS
   (se vazio, varredura completa). Leia agentes/bugs.md primeiro."
   Rode em primeiro plano — você precisa do relatório para o passo 2.
2. Com o relatório em mãos, atualize `agentes/bugs.md`:
   - acrescente os achados **novos** em "Achados em aberto" (sem duplicar os que já estão lá);
   - sobrescreva "Estado atual" (data da varredura + resumo em uma linha);
   - 1 linha no topo do "Histórico".
3. Mostre ao Lucas os achados em ordem de gravidade, separando o que o `/corrigir` pode resolver do
   que é decisão dele. **Não corrija nada aqui.**
4. Commit só de `agentes/bugs.md` (`docs: varredura de bugs DD/MM`), `pull --rebase --autostash`, push na main.
