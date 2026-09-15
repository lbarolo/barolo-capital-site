---
description: Fechamento Mensal — Barolo Capital
---
# Fechamento Mensal — Barolo Capital

Fecha o mês que acabou. Rodar **no dia 1** (depois da Action das ~08:00 BRT) ou nos últimos dias
do mês, com os prints do fechamento.

> **O que é automático hoje (não refazer à mão):**
> - **Curva de patrimônio** (`data.js → wealthCurve`): a Action `close-month.yml` roda
>   `scripts/close-month.js` todo dia 1 e acrescenta o ponto do mês, usando o último snapshot do
>   mês (dia 25 em diante) de `networth-history.json`. Definição única: **patrimônio BRUTO**
>   (holdings × preço + stables + LP, antes da dívida); aporte = soma de `contributions` do mês.
> - **Retornos mensais/anuais, TWR, TIR, heatmap, relatório**: derivados da curva em runtime
>   (`lib/barolo-core.js`). Não existe mais `monthlyReturns` para preencher.
> - **`emprestimos.html`**: recebe o `data.js` pela Action `sync-emprestimos.yml` após o push.
>
> Desde 23/06/2026 o `data.js` é a fonte única de posições. Desde 04/09/2026 a curva também
> vive nele — **nunca** adicionar ponto em `WEEKLY_UPDATE.wealthCurve` do
> `portfolio_analytics.html`, que é só fallback.

## Antes de começar
1. Leia `agentes/prints.md` inteiro — as regras de prints/`data.js` e o estado do último review
   estão lá. Não leia o CLAUDE.md inteiro; busque por palavra-chave se precisar.
2. `git pull --rebase --autostash origin main` (as Actions commitam todo dia de manhã).
3. Peça os prints do fechamento se ainda não chegaram: CoinGecko, AAVE (Position Details),
   Kamino (My Loan) e Uniswap/Revert **só se houver pool aberta** (conferir
   `data.js → defi.uniswapV3.status`).

## Passo a passo
1. **Aportes do mês estão registrados?** Todo dinheiro de fora que entrou no mês precisa estar em
   `data.js → contributions` (`{ date, usd, note }`) **antes** de a curva fechar.
   ⚠️ `close-month.js` só aplica `contributions` a mês NOVO. Se a Action já fechou o mês e faltou
   um aporte, o `invested` daquele ponto (e dos seguintes) tem de ser corrigido à mão — anote no
   comentário do `contributions` que o ajuste já foi feito, para ninguém somar de novo.

2. **A curva fechou?**
   `node scripts/close-month.js --dry-run`
   - "Nada a fazer… até MM/AA" com o mês que acabou → a Action já fechou; conferir o commit
     `data: fechamento mensal da curva de patrimônio (automático)` no `git log`.
   - Se ele disser que acrescentaria o mês → a Action ainda não rodou (ou falhou). Rodar
     `node scripts/close-month.js` (sem `--dry-run`) só se existir snapshot do dia 25 em diante.
   - Conferir: o salto do `invested` no ponto novo = soma dos `contributions` do mês.

3. **Review das posições com os prints** — seguir o "Passo a passo" de `agentes/prints.md`
   (AAVE pelo MCP, principals, yield a custo zero, `cgMirror`). Isso atualiza `asOf`, `defi.*`,
   holdings/stables.

4. **Renda passiva do mês** — `portfolio_analytics.html → RENDA_2026`: acrescentar UMA linha
   `{ m:'Set', lp:…, lend:… }` com comentário da origem.
   - `lp` = fees de pool **realizadas no mês**, por data de coleta/fechamento — somar `fees` das
     entradas do array `POOLS` de `pools.html` cujo `close` cai no mês. Sem pool fechada no mês → `0`.
   - `lend` = lending líquido do mês = (Σ supply × APY − Σ borrow × APY) ÷ 12, com as posições do
     `data.js` e o preço MÉDIO do mês de ETH/SOL (`networth-history.json → prices`). Para o borrow
     da AAVE, preferir a taxa **realizada** (variação do "fees paid" no mês) ao APY spot do print.
   - Conferir: a soma de `lp` do ano = total de 2026 no `POOLS` (card "P&L 2026 YTD").

5. **Juros pagos acumulados** — `portfolio_analytics.html → WEEKLY_UPDATE.pnlOrigin.jurosAcumulados`
   (negativo): somar os juros de borrow do mês — variação do "fees paid" da AAVE + juros do
   borrow da Kamino no mês. Comentário com o valor anterior e a conta.

6. **Yield a lançar no CoinGecko** — `node scripts/yield-to-mirror.js` e passar o total ao Lucas
   (rotina combinada em 05/09/2026). ⏸ Desde 11/09/2026 está **acumulando por decisão dele**:
   informar o total, não igualar `cgMirror` sem ele confirmar que lançou.

7. **Números do mês** (para a análise e o Diário):
   - Retorno do mês (Modified Dietz, o mesmo do site):
     `node -e "global.window={};require('./data.js');const D=window.BAROLO_DATA,C=require('./lib/barolo-core.js'),w=D.wealthCurve,r=C.dietzReturns(w.values,w.invested);console.log(w.labels.at(-1),(r.at(-1)*100).toFixed(1)+'%')"`
   - Patrimônio **líquido** no fechamento = `netWorth` do último snapshot do mês:
     `node -e "const h=require('./networth-history.json').history.filter(p=>p.date.startsWith('AAAA-MM'));console.log(h.at(-1))"`
   - Variação em USD vs o fechamento anterior (líquido) e quanto dela foi aporte.
   - HF AAVE, LTV Kamino, carry, dívida/patrimônio: `D.lendingSnapshot({ETH,SOL})` e
     `agentes/contas.md`.

8. **Análise mensal** (você mesmo escreve):
   - O que foi positivo no mês
   - Atenção: carry/spread (borrow vs supply), APYs, alavancagem, HF/LTV, pool (se houver),
     cauda de alts, stables paradas
   - Próximo mês: decisões pendentes e o que vigiar

9. **Diário DeFi** (`diario.js`) — passo fixo, pedido pelo Lucas em 31/07/2026. Nova entrada em
   `window.BAROLO_DIARY`:
   `{ id: <epoch ms único>, date:'AAAA-MM-DD' (último dia do mês), type:'insight', title:'Fechamento {Mês}/{Ano} — patrimônio líquido $X (±Y% no mês, ±Z% TWR)', body:'<POSITIVO / ATENÇÃO / PRÓXIMO MÊS>', pnl:<variação líquida do mês em USD>, tags:['fechamento-mensal','review','defi','{mes}-{ano}'] }`
   Valide: `node -e "global.window={};require('./diario.js');console.log(window.BAROLO_DIARY.length)"`

10. **Snapshot local (opcional)** — `EXPORTS SEMANAIS/{MÊS}/DD-MM-AA-posicoes.json` (pasta no
    `.gitignore`, só registro local). O registro oficial diário já é o `networth-history.json`.

## Verificação
- `npm test` verde (invariantes do `data.js`: 3 arrays da curva alinhados, `invested` que nunca
  cai, holding ≥ supply, supply ≥ principal).
- `node scripts/close-month.js --dry-run` → "Nada a fazer".
- Preview local (`barolo-site` do `.claude/launch.json`): `portfolio_analytics.html` sem erro de
  console; o heatmap e o gráfico de Renda Passiva mostram o mês novo; o Diário DeFi em
  `ferramentas.html` mostra a entrada nova.

## Commit + push direto na main (sem PR)
1. `git status` — commitar **só** o que este fechamento mexeu (outra sessão pode ter trabalho
   em andamento): `data.js`, `portfolio_analytics.html`, `diario.js`, `agentes/prints.md`.
2. Mensagem `data: fechamento mensal {Mês}/{Ano} (...)`, com a linha de atribuição indicada pelo
   sistema.
3. `git pull --rebase --autostash origin main` → `git push origin main`. Conflito em
   `emprestimos.html`: `git checkout --ours emprestimos.html && node scripts/refresh-emprestimos-data.js`.
4. Atualizar `agentes/prints.md` ("Estado atual" + 1 linha no "Histórico": "fechamento {Mês}").

## Notas importantes
- **Holdings já incluem o colateral** de AAVE/Kamino — nunca somar o bloco `defi` por cima.
- `invested` só muda com compra real ("Custo total" do CoinGecko); juro/yield entra a custo zero.
- Pool: a rede migra — ler do print, nunca assumir. Performance sempre em **USD**; resultado real
  da pool = fees − IL (não o PnL "vs HODL" da Revert, que embute valorização do ETH).
- A curva é **bruta**; o Diário e o relatório ao Lucas usam o patrimônio **líquido** — deixar
  claro qual é qual no texto.
