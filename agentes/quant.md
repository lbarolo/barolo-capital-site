# Caderno — Quant macro

> Lido pelo comando `/quant`. Base de conhecimento completa (glossário, regras, backtests,
> backlog do site): **`QUANT.md`** na raiz. Relatório: `node scripts/quant-report.js` (`--json`).
> Este papel **não altera posição**. Mudança no site só via `/corrigir`, com aprovação do Lucas.

## Regras
- Medir antes de opinar; toda regra nova passa por backtest e o resultado (bom ou ruim) vai para `QUANT.md §5`.
- Explicar cada métrica em linguagem simples (o Lucas está aprendendo quant).
- Não é recomendação de investimento; decisão é do Lucas.

## Estado atual (02/10/2026)
Beta ao BTC 1,17 · vol 59% · VaR95 1d −4,6% · risco: ETH 66% / SOL 32% / BTC 2,5% · N efetivo 2,6 ·
SOL liquida a 2,1σ · juro real 2,84% subindo · M2 +6,1% · MVRV 1,57 (meio de ciclo).
Dívidas (02/10): quitar a Kamino é a melhor opção (+US$ 25/ano vs hoje, zera a perna de 2,1σ);
a AAVE é neutra (borrow ≈ supply do USDT); mover a dívida para a AAVE ganha pouco na média. Ver QUANT.md §9.
Backtest DCA-Mayer: −0,9% vs DCA fixo → não adotar. Backlog Q1–Q7 em `QUANT.md §6`, sem prioridade.

## Histórico
- 02/10/2026 — Lucas executou o 1o passo (repay com USDS): Kamino 465,07 USDC, SOL liquida ~US$ 24,3 (2,3σ). Falta: pool SOL/USDC 140–190 / aporte.
- 02/10/2026 — plano do Lucas: USDS parcial + pool SOL/USDC 140–190 (~2,83 SOL, saída média US$ 163) + aporte; contas em §9.
- 02/10/2026 — análise trocar/quitar dívidas: quitar a Kamino vence (§9); decisão do Lucas.
- 28/09/2026 — agente criado; `QUANT.md` + `scripts/quant-report.js`; primeiro relatório.
