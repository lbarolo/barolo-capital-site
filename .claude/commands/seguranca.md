---
description: Segurança — roda o subagente de segurança (só leitura) e registra os achados
argument-hint: [foco opcional, ex.: "address poisoning" ou "Actions"]
---
# Lançar o agente SEGURANÇA

1. Use a ferramenta Agent com `subagent_type: "seguranca"` e este pedido:
   "Faça a verificação descrita no seu checklist. Foco pedido pelo Lucas: $ARGUMENTS
   (se vazio, verificação completa). Leia agentes/seguranca.md primeiro."
   Rode em primeiro plano — você precisa do relatório para o passo 2.
2. Com o relatório em mãos, atualize `agentes/seguranca.md`:
   - acrescente os achados **novos** em "Achados em aberto" (sem duplicar);
   - sobrescreva "Estado atual" (data + resumo em uma linha);
   - 1 linha no topo do "Histórico".
3. Mostre ao Lucas em ordem de gravidade, separando o que o `/corrigir` resolve do que **só ele**
   pode fazer (painéis de API, carteira, contas). **Não corrija nada aqui.**
4. Commit só de `agentes/seguranca.md` (`docs: verificacao de seguranca DD/MM`), `pull --rebase --autostash`, push na main.
