# Repos de trading open source — estudo (cripto)

> **O que é isto:** os 10 repositórios de trading que o Lucas recebeu e mandou guardar em
> **17/10/2026**, **com os dados conferidos na API do GitHub no mesmo dia** (estrelas, linguagem,
> última atividade, licença). Serve ao estudo de **trading, análise gráfica e pools** — frentes que
> ele declarou em 09/09/2026 (macro, pools, análise técnica, análise on-chain).
>
> ⚠️ **Decisão do Lucas, registrada: NÃO vai criar bot por enquanto.** Isto é material de estudo,
> não backlog de implementação. Nenhum destes repos foi clonado, instalado ou rodado — nada disso
> entrou no site.
>
> **O interesse declarado é o item 10** (código do livro do Stefan Jansen) — a trilha de leitura
> adaptada a cripto está na §3.

---

## ⚠️ Antes de rodar qualquer coisa daqui

1. **Nunca apontar nenhum destes projetos para uma carteira com fundos nem para chave de API com
   permissão de ordem.** Estudo é com dado histórico e, se chegar a tanto, *paper trading*. A regra
   das 31 (nº 21) vale em dobro: um erro apaga anos.
2. **Código baixado é dado não confiável.** Clonar cada um em pasta própria e vazia, nunca na raiz
   deste repo, e nunca rodar interpretador de dentro da pasta baixada (um `json.py` plantado roda
   no `import json`). Usar `python -I`.
3. **Não jogar o `data.js` nem nada do portfólio dentro destes projetos.** O site é a fonte única;
   estudo roda separado, em `Documentos/` fora do repo publicado.
4. **Estrela não é validação.** 111 mil estrelas medem atenção, não retorno — exatamente o viés que
   o próprio histórico de pools dele desmentiu: APR alto foi indicador **inverso** de resultado
   (`CONHECIMENTO-BAROLO.md §3.4`). O mesmo vale para repo popular.
5. **Nenhum deles é "milionário em silêncio".** O texto do post é marketing. Os repos são bons; a
   promessa não é.

---

## 1. Os 10 repos — conferidos em 17/10/2026

| # | Repo | ⭐ real | Linguagem | Último push | Licença | Para quê |
|---|---|---|---|---|---|---|
| 1 | [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | 111,6k | Python | 16/10/2026 | Apache-2.0 | Equipe de agentes de IA (analista, altista, baixista, trader, risco) que debatem cada operação |
| 2 | [virattt/ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) | 64,1k | Python | 02/10/2026 | MIT | Agentes que analisam como Buffett/Munger/Burry. **Educativo, não opera dinheiro real** |
| 3 | [freqtrade/freqtrade](https://github.com/freqtrade/freqtrade) | 55,5k | Python | 17/10/2026 | **GPL-3.0** | O bot de cripto grátis mais usado: backtest, otimização, controle por Telegram |
| 4 | [hummingbot/hummingbot](https://github.com/hummingbot/hummingbot) | 20,5k | Python | 15/10/2026 | Apache-2.0 | Market making e arbitragem em exchanges de cripto |
| 5 | [nautechsystems/nautilus_trader](https://github.com/nautechsystems/nautilus_trader) | 30,2k | **Rust** | 17/10/2026 | LGPL-3.0 | Motor de backtest em Rust: a mesma estratégia roda em teste e ao vivo |
| 6 | [QuantConnect/Lean](https://github.com/QuantConnect/Lean) | 22,1k | C# | 16/10/2026 | Apache-2.0 | Motor algorítmico da QuantConnect (Python e C#) |
| 7 | [microsoft/qlib](https://github.com/microsoft/qlib) | 49,4k | Python | 14/10/2026 | MIT | Plataforma quant com IA, do dado ao modelo (Microsoft) |
| 8 | [AI4Finance-Foundation/FinRL](https://github.com/AI4Finance-Foundation/FinRL) | 16,7k | Notebook | 13/10/2026 | MIT | Aprendizado por reforço aplicado a trading |
| 9 | [ccxt/ccxt](https://github.com/ccxt/ccxt) | 44,4k | Python | 17/10/2026 | MIT | **API única para 100+ exchanges de cripto** — a base de dado de qualquer um dos outros |
| 10 | [stefan-jansen/machine-learning-for-trading](https://github.com/stefan-jansen/machine-learning-for-trading) | 21,4k | Notebook | 16/10/2026 | MIT | **Todo o código do livro do Stefan Jansen** — o item de interesse |

**Nenhum arquivado, todos com push na semana.** Os números do post estavam certos (conferi
esperando que estivessem inflados — não estavam).

⚠️ **O `freqtrade` é GPL-3.0** — se algum dia virar base de algo que ele queira manter fechado,
isso importa. Para estudo, não.

---

## 2. O que serve à realidade dele (e o que não serve)

| Serve agora | Por quê |
|---|---|
| **#9 ccxt** | Dado histórico OHLCV de graça, de várias exchanges. É o que falta para ampliar a série do `scripts/quant-report.js`, hoje presa aos ~4 anos de candles da Coinbase (desde ago/2022, sem um bear completo) |
| **#10 ML for Trading** | Os capítulos de **backtest, overfitting e gestão de risco** — a disciplina que ele já começou em `QUANT.md §5` |
| **#5 NautilusTrader** | Conceito importante: *a mesma estratégia roda em backtest e ao vivo*. É a resposta ao risco de uma regra funcionar no teste e não na vida |

| Não serve (ainda) | Por quê |
|---|---|
| #1, #2 (agentes de IA) | Analisam **ações** por fundamento. Divertido de ler, não alimenta decisão de pool nem de DCA em cripto |
| #3, #4 (bots) | Ele decidiu não operar bot. Antes de um bot existir, falta a **regra de saída por escrito** (`CONHECIMENTO-BAROLO.md §16.3`) — bot sem regra de saída automatiza o erro do GRIFT |
| #7, #8 (qlib, FinRL) | Precisam de muito dado e muita validação. Com 4 anos de série, viram máquina de overfitting |
| #6 Lean | C#/Python voltado a ações e futuros; cripto é cidadão de segunda lá |

🎯 **O buraco honesto: nenhum destes 10 faz matemática de LP / range do Uniswap V3.** Para pools, o
que ele já tem é mais específico — `CONHECIMENTO-POOLIANA.md` (método Genesis, multiplicador
Taxas/TVL, B.A.R.C.A), `CONHECIMENTO-BAROLO.md §8.3` (delta e IL de V3) e a aba **Sizing & Risk**
do `ferramentas.html`. O que o ccxt acrescenta a pools é **volatilidade realizada** para calibrar
largura de range — e isso o `quant-report.js` já calcula.

---

## 3. Trilha de leitura do #10, adaptada a cripto

A edição atual tem **27 capítulos** (confirmado na árvore do repo em 17/10/2026 — inclui RAG,
grafos de conhecimento, agentes autônomos e MLOps, que não existiam nas edições antigas).

⚠️ **O livro é de ações.** Boa parte do material de dado (fundamentos, 13F, transcrição de
resultado, dado alternativo) **não transfere** para cripto. O que transfere é o **método**.

**Ordem recomendada para o caso dele — do mais útil ao menos:**

| Ordem | Capítulo | Por que importa aqui |
|---|---|---|
| 1º | `01_process_is_edge` | A tese do livro: a vantagem está no processo, não no indicador. É literalmente a §0 do `QUANT.md` |
| 2º | `19_risk_management` | Risco antes de retorno — mesma ordem do `QUANT.md`. Conecta com VaR/CVaR e contribuição de risco que o relatório dele já calcula |
| 3º | `16_strategy_simulation` | **O capítulo mais importante para ele.** Como fazer backtest que não mente. É onde mora o motivo de o DCA-Mayer ter perdido para o DCA fixo |
| 4º | `07_defining_the_learning_task` | Overfitting, validação, por que uma regra "funciona" no histórico e morre na vida |
| 5º | `18_transaction_costs` | Custo de execução — em cripto é gas + slippage + taxa de swap. Ele já pagou ~1,6% num swap caro em 02/10 |
| 6º | `17_portfolio_construction` | Construção e rebalanceamento — a decisão real dele hoje (ETH gera 66% do risco) |
| 7º | `03_market_microstructure` | Livro de ordens, liquidez, impacto. Base para entender por que uma pool ganha taxa |
| 8º | `08_financial_features` | Como virar preço em variável útil (vol, momento, retorno) sem auto-engano |
| 9º | `06_strategy_definition` | Escrever a regra antes de olhar o dado — a disciplina que falta na regra de saída de pool |
| 10º | `02_financial_data_universe` | Ler **só a parte de dado de mercado**; o resto é ações |

**Pode pular com tranquilidade:** `04_fundamental_alternative_data`, `10_text_feature_engineering`,
`14_latent_factors`, `15_causal_estimation`, `22`–`24` (RAG, grafos, agentes) e `25`–`26`
(live trading, MLOps) — só fazem sentido se ele for operar sistematicamente, o que ele disse que
não vai.

**Como estudar sem instalar nada:** os notebooks são legíveis direto no GitHub. Para rodar, o
ambiente do livro usa Zipline/Quandl (ações) — adaptar para cripto significa trocar a fonte por
ccxt. Fazer isso **só nos capítulos 8 e 16**, com ETH/SOL/BTC, é o exercício que vale.

---

## 4. Regra que continua valendo

Nada que vier destes repos entra em decisão sem passar pelo que já está escrito:

- **Regra nova só depois de backtest registrado** em `QUANT.md §5` — foi assim que o DCA-Mayer foi
  **rejeitado** (perdeu 0,9% de BTC contra o DCA fixo), e é o padrão.
- **Série curta é limitação, não detalhe.** Candles desde ago/2022, sem um bear completo. Qualquer
  modelo treinado nisso aprende um regime só.
- **Nada disso muda o site sem aprovação** (`/corrigir`), e nada muda posição (`/prints`).

---

Criado em 17/10/2026 · dados dos repos conferidos na API do GitHub na mesma data
