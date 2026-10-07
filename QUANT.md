# QUANT MACRO — Barolo Capital

> Base de conhecimento do agente **QUANT** (`/quant`). Criado em 28/09/2026.
> Autocontido: dá para colar em outro chat. O caderno de trabalho (estado + histórico) fica em
> `agentes/quant.md`; o relatório sai de `node scripts/quant-report.js`.

## 0. O que é "ser quant" aqui (e o que NÃO é)

Quant = **decidir com número medido, regra escrita e teste antes de usar**, em vez de sensação.
Três ideias sustentam tudo:

1. **Medir risco, não só retorno.** Retorno sem o risco que custou não diz nada.
2. **Regra antes, dado depois.** Toda regra (quando aportar mais, quando reduzir, quando sair de
   pool) é escrita e **testada no passado** antes de valer. Se o teste não mostra ganho, a regra
   não entra — mesmo que "faça sentido".
3. **Horizonte longo.** Não é trading de alta frequência. É o mesmo Lucas de +10 anos, DCA e yield
   — só que com instrumentos de medição. Nada aqui muda a filosofia; muda a **calibração**.

O que não é: previsão de preço, robô de trade, alavancagem maior. Modelo quant **não sabe o
futuro**; ele diz *quanto pode doer* e *se uma regra funcionou antes*.

---

## 1. Glossário — explicado sem jargão

| Métrica | O que é, em uma frase | Como ler |
|---|---|---|
| **Retorno logarítmico** | `ln(preço hoje ÷ preço ontem)`. Soma certinho ao longo do tempo. | Base de quase toda conta abaixo. |
| **Volatilidade (vol)** | O quanto o preço costuma balançar, anualizado (desvio-padrão diário × √365). | BTC ~45%/ano = num ano "normal" pode estar ±45% do ponto de partida. |
| **Vol realizada 30d vs 1 ano** | A mesma coisa em janelas diferentes. | 30d muito abaixo do 1 ano = mercado calmo; costuma preceder movimento grande (como o BBWP). |
| **Correlação** | De −1 a +1: quanto dois ativos andam juntos. | 0,9 entre BTC e ETH = na prática é **uma aposta só**, não duas. |
| **Beta** | Quanto um ativo se move para cada 1% do BTC. | Beta 1,3 = BTC cai 10%, ele cai ~13%. |
| **Beta do portfólio** | Soma dos pesos × betas, sobre o patrimônio **líquido** (a dívida entra). | Diz "meu patrimônio é quantos BTCs de risco". |
| **Contribuição de risco** | De onde vem a volatilidade total (Euler). Peso ≠ risco. | Um ativo com 60% do peso pode gerar 66% do risco. |
| **N efetivo** | `1 ÷ Σ peso²`. Quantos ativos "independentes" você tem de verdade. | 2,6 = a carteira equivale a ~2,6 posições iguais. |
| **Drawdown / Max DD** | Queda do topo até o fundo. | O número que testa o estômago. |
| **VaR 95% (1 dia)** | "Em 95% dos dias, não perco mais que X." Tirado do histórico real. | É o dia ruim *comum*, não o pior. |
| **CVaR 95%** | A média dos 5% piores dias. | É o dia ruim de verdade. Sempre maior que o VaR. |
| **Sharpe** | (Retorno − taxa livre de risco) ÷ vol. | >1 bom, <0 = teria ganho mais no CDI/T-bill sem risco. |
| **Sortino** | Igual ao Sharpe, mas só pune a vol **para baixo**. | Mais justo para cripto (alta explosiva não é "risco"). |
| **Calmar** | Retorno anual ÷ max drawdown. | Quanto retorno cada ponto de queda comprou. |
| **σ até a liquidação** | Distância do preço de liquidação medida em "desvios-padrão de 1 ano". | 2σ ≈ evento que acontece ~1 em 20 anos… **em mundo gaussiano. Cripto tem cauda gorda: tratar como ~3× mais provável.** |
| **Probabilidade de toque** | Chance de o preço *encostar* numa barreira em T (fórmula do movimento browniano: `2·N(ln(B/P)/(σ√T))`). | Liquidação acontece no toque, não no fechamento. |
| **Juro real 10 anos** | Juro nominal do Tesouro americano − inflação implícita. | Alto e subindo = dinheiro "caro" = vento contra para ativo de risco. |
| **M2** | Quantidade de dinheiro em circulação nos EUA. | Crescendo = liquidez = vento a favor (com defasagem de meses). |
| **DXY / dólar amplo** | Força do dólar contra outras moedas. | Dólar forte costuma pesar em cripto. |
| **VIX** | "Medo" implícito na bolsa americana. | <15 = complacência; >30 = pânico. |
| **MVRV / Mayer / AVIV** | Indicadores de ciclo on-chain (aba Ciclo). | Descritos na KB §11.3 do CLAUDE.md. |
| **Backtest** | Aplicar uma regra nos dados passados para ver o que ela teria feito. | Passar no backtest é **necessário, não suficiente** (risco de overfitting). |
| **Overfitting** | Ajustar a regra até ela encaixar no passado — e falhar no futuro. | Defesa: regra simples, poucos parâmetros, testar em período que não foi usado para criar. |

---

## 2. As quatro camadas do agente QUANT

1. **Portfólio (risco atual):** pesos, beta ao BTC, vol, VaR/CVaR, contribuição de risco, N efetivo.
2. **Alavancagem:** HF, LTV, distância de liquidação em σ, probabilidade de toque em 90d/1a,
   carry (supply − borrow).
3. **Macro + ciclo (regime):** juro real, direção do juro, dólar, M2, VIX, MVRV/Mayer/STH.
   Serve para **calibrar tamanho de aporte e de alavancagem**, não para prever preço.
4. **Regras testadas:** toda regra nova passa por backtest no `scripts/` antes de virar prática.
   Resultado (bom ou ruim) fica registrado aqui na §5.

---

## 3. Fotografia de 28/09/2026 (primeiro relatório)

Preços: BTC US$ 83.732 · ETH US$ 2.694,70 · SOL US$ 120,05 · posições do `data.js` de 25/09.

### Portfólio
- Patrimônio líquido **≈ US$ 10,5 mil**. Exposição a cripto volátil = **91% do líquido**.
- Pesos sobre o líquido: **ETH 60% · SOL 28% · BTC 3,5%** · stables 21% · dívida −15%.
- **Beta ao BTC 1,17** → o patrimônio se move ~1,17× o BTC. Não é "carteira de BTC": é uma
  carteira *mais* arriscada que o BTC, por causa de ETH/SOL (beta 1,28/1,31) e da dívida.
- Vol anual **~59%**. **VaR95 1 dia −4,6% (≈ US$ 480)** · CVaR95 −7,7% · pior dia do último ano −19,8%.
  VaR95 de 30 dias ≈ −28%: num mês ruim "comum", ~US$ 2.900 a menos.
- **Contribuição de risco: ETH 66% · SOL 32% · BTC 2,5%.** N efetivo **2,6**.
- Correlações de 1 ano: BTC-ETH 0,91 · BTC-SOL 0,87 · ETH-SOL 0,89 — **diversificação dentro de
  cripto é quase nula**. A única diversificação real da carteira hoje são as stables.

**Leitura:** a concentração em ETH/SOL é *intencional* (KB §1) — o número não diz que está errada.
Diz o **preço** dela: o BTC, que é o ativo de menor vol (45% vs 64–68%) e o "carro-chefe" que o
Lucas já reconheceu (09/09), pesa 3,5% e contribui 2,5% do risco. Se a tese de focar nos maiores
players for adiante, **o aporte em BTC é o que mais reduz risco por dólar**.

### Alavancagem
- HF AAVE **8,45** — o WETH é **imune** à liquidação (o USDT sozinho cobre a dívida).
- Kamino: SOL liquida em **~US$ 28 (−77%)** = **2,1σ de 1 ano**. Probabilidade de tocar em 90 dias
  ≈ 0%; em 1 ano ≈ **3% (gaussiano) → tratar como ~10% com cauda gorda**. Confortável, mas não zero.
- Dívida = 15% do líquido. A alavancagem hoje **não é** a fonte principal de risco — a
  concentração é.

### Ativos e tendência
| | Vol 30d | Vol 1a | vs MM200 dias | vs MM200 semanas | Do topo (4a) | 90 dias |
|---|---|---|---|---|---|---|
| BTC | 42% | 45% | +17% | +27% | −33% | +43% |
| ETH | 45% | 64% | +27% | +6% | −45% | +72% |
| SOL | 65% | 68% | +39% | +8% | −55% | +63% |

Os três acima da média de 200 dias (tendência de alta de médio prazo) e **acima da média de 200
semanas** (a linha que historicamente marca o piso de ciclo). Rally forte de 90 dias.
Vol de 30d do ETH bem abaixo da de 1 ano → mercado mais calmo que a média.

### Macro (FRED)
- Juro 10 anos EUA **5,18%**, **+0,80 p.p. em 3 meses** · juro real **2,84%** (muito alto) ·
  Fed Funds 3,88% → **curva inclinada: o mercado cobra prêmio longo** (inflação/fiscal).
- Dólar amplo −0,7% em 3m (neutro) · **M2 +6,1% a.a.** (liquidez crescendo) · VIX 14 (calmaria).
- **Leitura:** sinais *mistos*. Liquidez a favor (M2), juro real contra e subindo rápido.
  Juro real alto + VIX baixo = cenário em que choque de juros derruba ativo de risco rápido.
  Não é sinal de venda; é argumento para **não aumentar alavancagem agora**.

### Ciclo on-chain (BTC, 26/09)
MVRV 1,57 · STH-MVRV 1,15 (quem comprou nos últimos 155 dias está +15%) · LTH-MVRV 1,71 ·
Mayer 1,18 · AVIV 1,09 · LTH-SOPR 1,29 (holders de longo prazo realizando lucro).
**Regime: meio de ciclo / expansão inicial** — longe tanto de fundo (MVRV <1) quanto de euforia (>3).

---

## 4. Regras quant propostas (a decidir com o Lucas — nenhuma está valendo ainda)

1. **Teto de concentração por risco, não por peso:** nenhum ativo acima de ~60% da contribuição
   de risco. Hoje o ETH está em 66%. Ajuste pelo **aporte** (direcionar DCA para BTC), nunca
   vendendo — respeita a regra de não realizar prejuízo à toa.
2. **Alavancagem condicionada a regime:** só aumentar dívida com juro real em queda **e**
   MVRV < 2. Hoje o juro real sobe → manter.
3. **Liquidação ≥ 3σ de 1 ano** como piso para qualquer posição com dívida (hoje 2,1σ na Kamino
   — está dentro do aceitável *apenas* porque o LTV é 23%; subir o borrow pioraria rápido).
4. **Orçamento de VaR:** VaR95 de 30 dias ≤ 30% do líquido. Hoje ~28% — no limite.
5. **Toda regra nova passa por backtest** em `scripts/` e o resultado entra na §5.

---

## 5. Diário de backtests (resultados, inclusive os que falharam)

| Data | Regra | Período | Resultado | Veredito |
|---|---|---|---|---|
| 28/09/2026 | DCA semanal em BTC **escalado pelo Mayer** (2× se <0,8 · 1,5× <1 · 1× <1,5 · 0,5× <2,4 · 0 acima), mesmo dinheiro total do DCA fixo | mar/2023 → set/2026 (186 semanas) | Preço médio US$ 56.045 vs US$ 55.563 do fixo → **−0,9% de BTC** | ❌ **Não adotar.** Num período majoritariamente de alta, cortar aporte quando está "caro" deixou de comprar barato antes das pernadas. Lição: intuição boa ("compre mais no medo") **não bateu o DCA simples** nesta janela. Retestar quando houver um ciclo completo com bear (os candles da Coinbase só cobrem desde ago/2022). |

---

## 6. Ajustes propostos no site (backlog — prioridade a definir)

| # | O quê | Onde | Por quê |
|---|---|---|---|
| Q1 | **Painel "Risco Quant"**: beta ao BTC, vol, VaR/CVaR, contribuição de risco por ativo, N efetivo | `portfolio_analytics.html`, aba Risco | Hoje a aba usa a "Convexidade" com pesos λ arbitrários; estas são as métricas padrão de mercado |
| Q2 | **Liquidação em σ + probabilidade de toque** ao lado do "% de queda" | `emprestimos.html` (via `data.js`) e card do `pools.html` | "−77%" não diz o quão provável é; σ e probabilidade dizem |
| Q3 | **Painel Macro** (juro real, variação 3m, dólar, M2, VIX) + score de regime | aba Ciclo do `ferramentas.html` | Juntar macro e on-chain num lugar só |
| Q4 | **Action `macro.yml`** gerando `macro.json` e `quant.json` diários (sem chave: FRED + Coinbase) | `scripts/`, `.github/workflows/` | O site lê arquivo estático — mesmo padrão do `btc-onchain.json` |
| Q5 | **Sortino e Calmar** ao lado do Sharpe | aba Métricas | Sharpe pune alta; Sortino é mais justo para cripto |
| Q6 | **Correlação e vol rolantes 90d** (gráfico) | aba Risco | Mostra quando a diversificação some (em crash tudo vai a 1) |
| Q7 | Métricas diárias a partir do `networth-history.json` quando passar de 180 pontos | aba Performance | Série mensal (56 pontos) é curta demais para vol/Sharpe confiáveis |

⚠️ Regra do Lucas: **zero mudança de UX sem perguntar.** Os itens acima entram como seções novas
no padrão visual existente, um por vez, com aprovação.

---

## 7. Fontes de dados (todas sem chave)

> Esta tabela é a lista **canônica para automação** — só o que tem API pública e já foi testado no
> runner do GitHub. Para pesquisa manual (whale tracking, unlocks, funding/OI, fluxo de ETF, TVL),
> ver **`FONTES-PESQUISA.md`** na raiz. Candidatos de lá a virar Action, em ordem: fluxo de ETF
> (farside.co.uk), funding e open interest (velo.xyz/coinglass — hoje premissa fixa de 5% a.a. na
> §8.3/§8.4 da KB), TVL e fees (defillama.com), supply e queima do ETH (ultrasound.money).
> ⚠️ Testar por `workflow_dispatch` numa branch antes de confiar: a Binance responde aqui e dá
> **451** no runner (foi o bug da `benchmark.yml` em 20/08/2026).

| Dado | Fonte | Observação |
|---|---|---|
| Preços diários BTC/ETH/SOL | Coinbase Exchange `/products/X-USD/candles?granularity=86400` | 300 candles por chamada; ~4 anos com 5 chamadas. Funciona no runner do GitHub (Binance dá 451). |
| Juro 10a, inflação implícita, Fed, dólar, M2, VIX | FRED `fredgraph.csv?id=` `DGS10`, `T10YIE`, `DFF`, `DTWEXBGS`, `WM2NS`, `VIXCLS` | CSV público; séries diárias/semanais. |
| Ciclo on-chain | `btc-onchain.json` (Action `onchain.yml`) | 360 dias |
| Posições | `data.js` | fonte única |
| TWR/TIR/Sharpe/MaxDD do track | `lib/barolo-core.js → performanceMetrics` | série mensal `wealthCurve` |

## 8. Limitações honestas
- Tudo aqui usa o **passado**. Correlação e vol mudam de regime (em crash, correlação vai a ~1).
- VaR histórico com 1 ano de dados subestima caudas. Olhar sempre CVaR e o pior dia junto.
- Probabilidades "gaussianas" em cripto **subestimam** eventos extremos — por isso a regra 3σ.
- A carteira de ALTS (ADA, EIGEN, XAI…) fica fora do risco diário (≈ US$ 125, peso desprezível).
- Não é recomendação de investimento; é instrumento de medição para as decisões do Lucas.

---

## 9. Análises pontuais

### 02/10/2026 — Trocar ou quitar as dívidas (AAVE × Kamino)

Base: `data.js` de 02/10 · ETH US$ 2.663 · SOL US$ 117,98 · taxas médias de 23 snapshots do
`data.js` (jun→out/26): borrow AAVE 3,79% (dp 1,1 p.p., faixa 1,9–5,6%) · borrow Kamino 5,81%
(dp 0,3 p.p., faixa 5,3–6,4%) · supply USDT AAVE 2,84% · supply USDS Kamino 3,69%.
A Kamino foi mais cara que a AAVE em 22 de 23 leituras.

| Opção | Carry/ano hoje | Carry/ano média | HF AAVE | SOL liquida | Dívida | Stables |
|---|---:|---:|---:|---|---:|---:|
| 0 · como está | +5 | −13 | 8,4 | US$ 28 (2,1σ) | 1.533 | 2.212 |
| **1 · quitar Kamino** (USDS + USDT parado + ~277 USDT da AAVE) | **+30** | **+12** | 8,1 | **sem risco** | 766 | 1.444 |
| 2 · levar a dívida da Kamino para a AAVE | +28 | +2 | 4,2 (ETH liq. US$ 99) | sem risco | 1.533 | 2.212 |
| 3 · quitar a AAVE com o USDT da AAVE | +1 | −6 | — | US$ 28 (2,1σ) | 767 | 1.446 |
| 4 · quitar as duas | +25 | +19 | — | sem risco | 0 | 679 |

*Carry = juro recebido nas stables em protocolo − juro pago nas dívidas.*

**Leitura:** a dívida não financia nada desde que a pool fechou (28/08); ela só mantém stables
paradas. A AAVE (3% contra USDT rendendo ~3%) é praticamente neutra. A Kamino (≈6% contra USDS a
≈3,6%) custa ~2 p.p. a mais e é a única perna com risco de liquidação abaixo de 3σ. Quitar a
Kamino ganha ~US$ 25/ano contra o status quo e zera esse risco. O SOL continua depositado,
rendendo o supply de 5,5%. Na média histórica, a opção 2 ganha bem menos, porque fica exposta aos
picos de taxa da AAVE. Valores pequenos (≈0,2% do patrimônio): **o ganho principal é de risco**.
Pegar a dívida de volta é 1 transação se a pool reabrir.

**Plano do Lucas (02/10, em estudo):** quitar parte com os 305 USDS e o resto com a valorização do SOL
via **pool SOL/USDC no range US$ 140–190**, além de capital novo aos poucos. Contas (SOL a US$ 118,
vol 68%):
- Quitar só com o USDS: dívida 767 → 462 · +US$ 7/ano · SOL liquida em US$ 24,1 (2,3σ, era 2,1σ).
- A pool 140–190 aberta abaixo do range entra 100% em SOL e **vende SOL por USDC conforme sobe**:
  preço médio de saída √(140·190) = **US$ 163**. Para gerar os 462 USDC bastam **~2,83 SOL**. É a mesma
  lógica da saída gradual (§2.3 da KB), e o USDC que ela gera paga a Kamino.
- Retirar 2,9 SOL da Kamino para a pool leva a liquidação a US$ 27,3 (2,15σ), quase igual a hoje.
- Chance de tocar no preço, sem prever direção: US$ 140 → 61% em 90 dias, 80% em 1 ano · US$ 163 →
  34% / 63% · US$ 190 (pool toda em USDC) → 16% / 48%. **Abaixo de US$ 140 a pool não gera taxa.**
- Capital novo usado para quitar a Kamino rende **~5,8% garantido em USD** (o juro que deixa de pagar),
  acima de qualquer supply de stable disponível. Entra como `contributions` normalmente.
