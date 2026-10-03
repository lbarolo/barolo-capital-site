# Caderno — Quant macro

> Lido pelo comando `/quant`. Base de conhecimento completa (glossário, regras, backtests,
> backlog do site): **`QUANT.md`** na raiz. Relatório: `node scripts/quant-report.js` (`--json`).
> Este papel **não altera posição**. Mudança no site só via `/corrigir`, com aprovação do Lucas.

## Regras
- Medir antes de opinar; toda regra nova passa por backtest e o resultado (bom ou ruim) vai para `QUANT.md §5`.
- Explicar cada métrica em linguagem simples (o Lucas está aprendendo quant).
- Não é recomendação de investimento; decisão é do Lucas.

## Estado atual (03/10/2026)
Relatório de 03/10: líquido US$ 10.552 · beta ao BTC 1,17 · vol 57,5% · VaR95 1d −4,6% (US$ 486) · VaR95 30d −27,1% ·
risco: ETH 65% / SOL 32% / BTC 2,9% · N efetivo 2,58 · juro real 2,88% (10a 5,24%, +0,75 p.p. em 3m) · M2 +6,1% ·
VIX 16,4 · MVRV 1,58 (meio de ciclo) · TWR 2,25% a.a. · TIR 17,6% · DCA-Mayer segue perdendo (−1,2%).
**Kamino após os 2 repays de 02/10:** 25,03 SOL @5,49% · dívida 454,98 USDC @5,93% · LTV ~15,4% ·
liqLtv 75% · SOL liquida ~US$ 24,24 (≈2,3σ). USDS zerado. AAVE inalterada (765,74 USDC, neutra).
Plano em aberto (QUANT.md §9): pool SOL/USDC 140–190 (~2,83 SOL, saída média US$ 163) e/ou aporte
para quitar o resto (~US$ 27/ano de juros). Backlog Q1–Q7 e regras da §4 sem decisão do Lucas.
Backtest DCA-Mayer: −0,9% vs DCA fixo → não adotar.

## Histórico
- 03/10/2026 — nova janela retomando o handoff; relatório rodado (SOL liquida a 2,36σ, P(toque 1a) 1,8%).
- 03/10/2026 — nova janela retomando o handoff; relatório rodado (SOL liquida a 2,36σ, P(toque 1a) 1,8%).
- 03/10/2026 — handoff da sessão salvo fora do repo (pasta temp); estado atualizado após os repays.
- 02/10/2026 — Lucas executou o 1o passo (repay com USDS): Kamino 465,07 USDC, SOL liquida ~US$ 24,3 (2,3σ). Falta: pool SOL/USDC 140–190 / aporte.
- 02/10/2026 — plano do Lucas: USDS parcial + pool SOL/USDC 140–190 (~2,83 SOL, saída média US$ 163) + aporte; contas em §9.
- 02/10/2026 — análise trocar/quitar dívidas: quitar a Kamino vence (§9); decisão do Lucas.
- 28/09/2026 — agente criado; `QUANT.md` + `scripts/quant-report.js`; primeiro relatório.
