# Agentes da Barolo Capital

Cada papel tem **dois arquivos**:

- o **agente** (`.claude/commands/*.md` ou `.claude/agents/*.md`), que diz *como* trabalhar;
- o **caderno**, aqui em `agentes/`, que guarda *o que ele precisa saber* e *onde parou*.

O caderno existe para a conversa **não perder o contexto**. Todo agente lê o próprio caderno
antes de começar e, no fim, atualiza "Estado atual" e "Histórico". Uma sessão nova começa daqui,
sem precisar reler o CLAUDE.md inteiro, que tem mais de 3 mil linhas e é um log histórico.

| Papel | Como chamar | Tipo | Caderno | Edita arquivos do site? |
|---|---|---|---|---|
| Prints (review semanal / aporte) | `/prints` + os prints | comando | [prints.md](prints.md) | **sim** — `data.js` |
| Contas | `/contas <pergunta>` | comando | [contas.md](contas.md) | não (só o caderno) |
| Corrigir o site | `/corrigir <o quê>` | comando | [corrigir.md](corrigir.md) | **sim** |
| Caçar bugs | `/bugs` | subagente **só leitura** | [bugs.md](bugs.md) | não |
| Segurança | `/seguranca` | subagente **só leitura** | [seguranca.md](seguranca.md) | não |

## Como os papéis se passam trabalho

```
/bugs ──────► bugs.md "Achados em aberto" ──────► /corrigir ──► move para "Resolvidos"
/seguranca ─► seguranca.md "Achados em aberto" ─► /corrigir ──► move para "Resolvidos"
/prints ────► data.js  (se notar algo estranho, anota em bugs.md)
/contas ────► só lê data.js + lib/  (nunca altera posição)
```

## Regras comuns a todos

1. **Só um escritor por vez** (`/prints` ou `/corrigir`). Bugs, segurança e contas só leem e
   podem rodar junto com qualquer um.
2. **Antes de commitar, `git status`**. Commitar só os arquivos que o próprio papel mexeu —
   outra sessão pode ter trabalho em andamento na mesma pasta.
3. **Push direto na main**, depois de `npm test` verde. Sempre `git pull --rebase --autostash`
   antes (as Actions commitam todo dia de manhã).
4. **Caderno:** "Estado atual" é sobrescrito a cada execução; "Histórico" ganha **1 linha no
   topo** (manter ~15 linhas; apagar as mais antigas — o detalhe fica no git e no CLAUDE.md).
5. **Os cadernos estão num repositório público.** Não escrever neles endereço completo de
   carteira, NFT ID, chave de API nem dado pessoal. Para endereço/chave, citar
   `lib/barolo-chain.js → CONFIG`.
6. **Uma sessão por papel** fica mais organizada: crie uma pasta "Barolo" na barra lateral e
   abra cada sessão com o comando do papel.
