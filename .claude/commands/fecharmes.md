# Fechamento Mensal — Barolo Capital

Executa o fechamento mensal completo do portfolio.

## O que fazer

1. Verifique se o usuario ja enviou os prints (CoinGecko, AAVE V4, Kamino, Revert Finance). Se nao enviou, peca agora antes de continuar.

2. Com os prints em maos, extraia todos os valores:
   - **CoinGecko**: qty e preco de cada token (ETH, SOL, USDT, USDS, ADA, EIGEN, POL, ZK, RDNT, XAI, ZETA)
   - **AAVE V4**: WETH qty + APY, USDT qty + APY, USDC borrow qty + APY
   - **Kamino**: SOL qty + APY, USDS qty + APY, USDC borrow qty + APY, LTV%
   - **Revert Finance (pool WETH/USDC Base)**: fees totais ($), divergence loss ($), pooled assets ($)

3. Calcule os campos derivados:
   - `stables_usd` = USDT qty + USDS qty
   - `total_debt` = AAVE borrow + Kamino borrow
   - `wealth_curve_value` = CoinGecko total + pool pooled - total_debt (arredondar para inteiro)

4. Crie o arquivo de dados no formato correto em EXPORTS SEMANAIS/{MES}/DD-MM-AA-dados.json usando a estrutura do dados_TEMPLATE.json como base.

5. Execute o script Python com dry-run primeiro:
   python fechar_mes.py "EXPORTS SEMANAIS/{MES}/DD-MM-AA-dados.json" --dry-run

   Confirme que todos os 6 arquivos mostram checkmark. Se algum falhar, investigue e corrija.

6. Se o dry-run estiver OK, execute de verdade com push:
   python fechar_mes.py "EXPORTS SEMANAIS/{MES}/DD-MM-AA-dados.json" --push ghp_TOKEN

   Peca o token ao usuario se necessario.

7. Apos o push, gere a analise mensal com um agente:
   - O que foi positivo no mes
   - Problemas identificados (spreads negativos, APYs, pool proxima do piso)
   - Pontos de atencao para o proximo mes

## Arquivos que o script atualiza

- index.html: ETH qty, STABLES_USD, TOTAL_DEBT
- portfolio_analytics.html: WEEKLY_UPDATE defi, AAVE_DEBT, KAMINO_DEBT, APY fallbacks, wealthCurve
- emprestimos.html: display HTML, updateCollateralCards, updateLiqPrices, fallbacks
- ferramentas.html: BASE simulator
- relatorio.html: APY constants
- pools.html: pool ativa (fees/il/result), ETH qty, debt fallbacks, AAVE_BORROW_RATE

## Notas importantes

- A pool ativa WETH/USDC esta na Base (chain_id=8453), NAO na Ethereum mainnet
- Performance da pool sempre em USD — nunca usar HODL ou ETH como referencia
- PnL real da pool = fees - il (nao o numero "vs HODL" do Revert)
- wealthCurve: se o mes ja tem ponto do inicio, atualizar com valor do fechamento
- Apos o push, o site atualiza em 1-2 minutos em barolocapital.com.br
