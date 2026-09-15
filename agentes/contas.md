# Caderno — Contas

> Lido pelo comando `/contas`. **Atualizar "Estado atual" e "Histórico" no fim de toda execução.**
> Este papel **não altera posição nem página**. Se a conta mostrar que um dado está errado,
> anotar em `agentes/bugs.md` ("Achados em aberto") e avisar o Lucas.

## Regra de ouro
**Nunca fazer a conta de cabeça quando o projeto já tem a função.** Rodar em Node, a partir do
`data.js` e das libs, e mostrar ao Lucas: **fórmula, números de entrada, fonte e resultado**.
Scripts avulsos vão para o scratchpad da sessão, nunca para o repo.

## Ferramentas de cálculo que já existem
| Precisa de… | Use |
|---|---|
| Retorno mensal (Modified Dietz), tabela mensal/anual | `lib/barolo-core.js` → `dietzReturns`, `monthlyReturnsTable`, `compound` |
| TWR, TIR (XIRR), Sharpe, volatilidade, max drawdown, ROIC, benchmark, alpha | `BaroloCore.performanceMetrics(curve, window.BENCHMARK_DATA)` |
| Patrimônio líquido com preços | `BaroloCore.netWorth(D, priceOf)` |
| HF, LTV Kamino, colateral, tokens acumulados | `D.lendingSnapshot({ ETH, SOL })` (no fim do `data.js`) |
| Curva com o mês corrente ao vivo | `D.curveWithLive(liveGross)` |
| Yield pendente no CoinGecko | `node scripts/yield-to-mirror.js` (`--json`) |
| Fechamento do mês (simulação) | `node scripts/close-month.js --dry-run` |
| Snapshot de patrimônio de hoje | `node scripts/fetch-networth.js` (grava `networth-history.json` — só rodar se for pra gravar) |
| Série diária histórica | `networth-history.json` (campo `defi` traz HF/LTV/acumulação por dia) |
| Preços mensais BTC/ETH/CDI | `benchmark-data.js` |

Carregar tudo no Node (testado em 15/09/2026):
```js
global.window = {};
require('./data.js'); require('./benchmark-data.js');
const D = window.BAROLO_DATA, C = require('./lib/barolo-core.js');
const px = { bitcoin: 77378, ethereum: 2539.37, solana: 102.65, tether: 1, usds: 1 }; // stables precisam de preço 1
C.netWorth(D, id => px[id] || 0);                  // { gross, stables, lp, debt, netWorth }
C.performanceMetrics(D.wealthCurve, window.BENCHMARK_DATA); // { twr, twrCumulative, irr, roic, sharpe, maxDD, benchmarkReturn, alpha, volatility }
D.lendingSnapshot({ ETH: 2539.37, SOL: 102.65 }); // { hf, kLtv, aaveCol, kamCol, accEth, accSol, ... }
```
⚠️ Esquecer `tether:1, usds:1` no `priceOf` zera as stables no patrimônio.

## Definições (não misturar)
- **ROI de destaque** = patrimônio líquido ÷ aporte líquido acumulado (último `wealthCurve.invested`) − 1.
  Mede o **poupador**.
- **ROI sobre custo de aquisição** (Σ `invested` dos holdings) — secundário, "base IR".
- **TWR** (Modified Dietz, aporte no meio do mês, composto) — mede o **gestor**, tira o efeito do
  timing dos aportes. **CAGR do site = TWR anualizado.**
- **TIR/XIRR** — mede o poupador, credita o timing do aporte.
- **Retorno anual = composição geométrica dos meses**, nunca soma.
- **Benchmark** = mesmo fluxo de aportes aplicado em BTC/ETH/CDI, medido pelo mesmo XIRR.
- A diferença TWR × TIR é o valor do DCA. Em fase de acumulação, TIR/ROI vão no destaque.
- `wealthCurve.values` é patrimônio **BRUTO** (antes da dívida). O líquido desconta a dívida.

## Fórmulas de risco
- **HF AAVE** = Σ(colateral × CF) ÷ dívida · CF WETH 83% · USDT 78%. Nunca `Collateral ÷ Borrow` cru.
- **LTV Kamino** = dívida ÷ (SOL × preço + USDS).
- **Preço de liquidação do SOL (aprox.)** = (dívida ÷ Liq.LTV − USDS) ÷ SOL. A Kamino pondera o
  Liq.LTV por ativo; se o número dela divergir, **vale o da Kamino**.
- **Carry** = Σ(supply × APY) − Σ(borrow × APY), por ano e por mês.
- **Dimensionar pool:** Kelly com ramo de ruína (CLAUDE.md, KB §8.6) — **nunca Merton** para pool
  (dá 300–1000%, não enxerga exploit/token a zero). ¼ Kelly histórico ≈ 12–15% do patrimônio, só
  com regra de saída escrita.

## Metas do Lucas (09/09/2026)
- Viver de yield: **US$ 20k/ano** (intermediária) e **US$ 100k/ano** (final).
- Capital necessário para 20k/ano: 5% → US$ 400k · 8% → 250k · 12% → 167k · 15% → 133k · 25% → 80k.
- Ponto de virada: o retorno passa a render mais que o aporte (~US$ 2k/ano) quando o patrimônio
  passa de ~US$ 13k a 15%.
- Lucas tinha 31 anos em 09/2026. Planejar pelo cenário conservador (~45 anos para os US$ 133k).

## Fiscal (BRL)
- Aportado em BRL: **R$ 37.582,97** (Binance + OKX, até jul/2026). Câmbio médio USDT 5,38.
- Custo em USD vem do CoinGecko; custo em BRL vem dos extratos das CEX (incompletos por natureza).
  **Não reconciliar `wealthCurve.invested` contra os extratos** — são fontes diferentes.
- IR: Bens e Direitos grupo 08; isenção R$ 35k/mês de venda (nacional); permuta cripto↔cripto é
  alienação. Dizer sempre que não é assessoria fiscal.

## Armadilhas conhecidas
- Dividir patrimônio pelo capital-semente de 2022 (~US$ 1.061) — erro que já inflou CAGR para +63%.
- Somar retornos mensais em vez de compor.
- Comparar retorno de PREÇO de índice com TIR do portfólio.
- `CPI_USA` do `index.html` é **interanual**, não acumulado — não derivar inflação acumulada dela.
- No `data.js`, **`apy`, `ltv` e `liqLtv` são FRAÇÃO** (0,0563 = 5,63%; liqLtv 0,766). Não dividir
  por 100 de novo — em 15/09 isso deu carry de US$ 1,89/ano e SOL liquidando em US$ 3.986.
  (`lendingSnapshot().kLtv` já devolve em %.)
- Não dar recomendação de investimento personalizada como se fosse assessor. Mostrar a conta e as
  opções; a decisão é do Lucas.

## Estado atual — números de referência (15/09/2026, CoinGecko ao vivo: BTC 76.851 · ETH 2.476,76 · SOL 100,85 · USD/BRL 5,14; posições do data.js de 11/09)
- Patrimônio líquido US$ 9.501 (≈ R$ 48.836) · bruto US$ 11.028 · dívida US$ 1.527,19 · aporte líquido US$ 8.162
- ROI sobre aporte +16,4% · ROI sobre custo de aquisição (US$ 10.608) −10,4%
- TWR desde 2022 ≈ +0,3% a.a. (+1,5% acumulado; ≈ +54,6% a.a. desde jan/2023 — 2022 sozinho foi −79%)
- TIR ≈ 13,6% a.a. · benchmark 50/50 BTC/ETH ≈ 12,3% · alpha +1,4 p.p. · vol ≈ 64,6% · max DD −50,9%
- Carry do lending: supply US$ 274,6/ano − borrow US$ 85,4/ano = **+US$ 189/ano (+US$ 15,8/mês)**
- HF AAVE 8,06 · LTV Kamino 27,1% · SOL liquida em ~US$ 27,76 (−72%)
- Acumulado em token: 0,1016 ETH · 3,374 SOL · yield pendente no CoinGecko ~US$ 11,22 (acumulando)
- Benchmark de mesmo fluxo (09/09): BTC +54,4% · S&P +41,3% · **portfólio +35,2%** · CDI +34,0% · Ibov +16,5% · ETH +6,2%

## Histórico (mais recente no topo)
- 15/09/2026 — 1ª sessão (sem pergunta específica): retrato ao vivo — PL US$ 9.501, ROI +16,4%, TIR 13,6%, carry +US$ 15,8/mês, HF 8,06.
- 15/09/2026 — caderno criado; snippet de Node testado (metrics, netWorth, lendingSnapshot).
