# Fechamento Mensal — Barolo Capital

Executa o fechamento mensal completo do portfolio. Rodar no último dia do mês.

> Arquitetura atual (desde 23/06/2026): **`data.js` é a fonte única de posições**.
> Os 6 HTMLs leem de `window.BAROLO_DATA` (valores hardcoded são só fallback).
> O `fechar_mes.py` foi APOSENTADO — não existe mais; editar `data.js` direto.

## O que fazer

1. Verifique se o usuário já enviou os prints (CoinGecko, AAVE V4, Kamino, Revert Finance). Se não enviou, peça agora antes de continuar.

2. `git pull --rebase origin main` primeiro (as Actions diárias commitam `briefing.json`, `btc-onchain.json`, `networth-history.json`). Preserve alterações locais não-commitadas (ex.: `emprestimos.html`) com `git stash` → rebase → `git stash pop`.

3. Extraia os valores dos prints:
   - **CoinGecko**: qty e preço de cada token (BTC, ETH, SOL, USDT, USDS, ADA, EIGEN, POL, ZK, RDNT, XAI, ZETA, SCR) + saldo total, mudança 24h, ganho/perda total
   - **AAVE V4**: WETH qty + APY, USDT qty + APY, USDC borrow qty + APY, borrowing power
   - **Kamino**: SOL qty + APY, USDS qty + APY, USDC borrow qty + APY, LTV%, liq LTV%, juros ganhos
   - **Revert Finance (pool ativa)**: pooled assets ($), fees não coletadas ($), divergence loss/IL ($), PnL ($), fee APR, dias, composição de tokens
     - ⚠️ A pool **MIGRA DE REDE** — hoje é **WETH/USDG na Robinhood Chain** (não mais Base). Sempre ler o print, nunca assumir a rede.

4. **Atualize `data.js`** (único arquivo de posições):
   - `asOf`, `holdings[].qty/invested`, `stables[].qty`
   - `defi.aave` (supply WETH/USDT {qty,apy}, borrow {qty,apy}, healthFactor)
   - `defi.kamino` (supply SOL/USDS {qty,apy}, borrow {qty,apy}, ltv, liqLtv)
   - `defi.uniswapV3` (pooled, totalFees, uncollectedFees, il, pnl, apr, daysOpen, note + comentário com composição)
   - `debt {aave,kamino,total}`, `stablesTotalUSD`
   - Atualize o bloco de comentário do topo com o refresh do mês
   - Metodologia: `invested` = USD realmente pago (não muda sem compra nova); holdings JÁ incluem colateral DeFi; juro/rendimento é renda, não aporte.
   - Valide: `node -e "global.window={}; require('./data.js'); console.log(window.BAROLO_DATA.asOf)"`

5. **Fechamento em `portfolio_analytics.html`** (`WEEKLY_UPDATE`):
   - `wealthCurve`: adicione o ponto do mês (label `MM/AA`) em `labels`, `values` e `invested` (as 3 séries têm que ter o mesmo tamanho)
     - `value` = CoinGecko total + pool pooled − dívida total (arredondar p/ inteiro)
     - `invested` = invested do mês anterior + aportes novos do mês (BTC/SOL/etc.)
   - `monthlyReturns[ANO][mês]`: retorno via **TWR** = `(valor_mês − aportes_do_mês − valor_mês_anterior) / valor_mês_anterior × 100` (remove os aportes novos antes de medir)
   - `pnlOrigin.jurosAcumulados`: atualize a estimativa (+~$5/mês)

6. **Snapshot JSON** em `EXPORTS SEMANAIS/{MÊS}/DD-MM-AA-posicoes.json` (a pasta é gitignored — fica só local, é registro histórico). Use a estrutura do último snapshot como base.

7. **Análise mensal** (escreva você mesmo, não precisa de agente):
   - O que foi positivo no mês
   - Problemas/atenção (spreads/carry negativos, APYs, pool próxima do piso, alavancagem, HF/LTV)
   - Pontos de atenção para o próximo mês

8. **Registre a análise no Diário DeFi** (`diario.js`) — passo fixo, pedido pelo Lucas em 31/07/2026 para ter controle histórico mês a mês:
   - Adicione uma entrada em `window.BAROLO_DIARY` com formato `{ id: <epoch ms único>, date:'AAAA-MM-DD', type:'insight', title:'Fechamento {Mês}/{Ano} — patrimônio $X (±Y% no mês)', body:'<resumo positivo/atenção/próximo mês>', pnl:<variação do mês em USD>, tags:['fechamento-mensal','review','defi','{mes}-{ano}'] }`
   - O `ferramentas.html` faz merge automático (arquivo + localStorage) no load; id novo não conflita.
   - Valide: `node -e "global.window={}; require('./diario.js'); console.log(window.BAROLO_DIARY.length)"`

9. **Commit + push direto na main** (workflow do Lucas — sem PR):
   - `git add data.js portfolio_analytics.html diario.js`
   - commit `data: fechamento mensal {Mês}/{Ano} (...)` com `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
   - `git pull --rebase origin main` → `git push origin main`
   - O site atualiza em 1-2 min em barolocapital.com.br

## Verificação (preview local, porta 8080)

- `data.js` parseia e `window.BAROLO_DATA.asOf` é a data nova; portfolio carrega sem erro de console
- `wealthCurve` labels/values/invested com mesmo comprimento; último label = mês novo
- entrada do Diário aparece no `window.BAROLO_DIARY` e faz merge no localStorage

## Notas importantes

- Pool ativa: **WETH/USDG na Robinhood Chain** (card ESTÁTICO, sem fetch on-chain). NUNCA assumir Base nem Ethereum.
- Performance da pool sempre em **USD** — nunca usar HODL ou ETH como referência.
- PnL real da pool = **fees − IL** (não o número "vs HODL"/PnL total do Revert, que embute valorização do ETH).
- NUNCA somar colateral AAVE/Kamino por cima do total do CoinGecko (dupla contagem) — `defi` é view, não posição aditiva.
