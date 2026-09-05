# 🌊 CONHECIMENTO POOLIANA — Metodologia Genesis para Pools de Liquidez

> **O que é este arquivo:** consolidação de **todo o conhecimento operacional do PROJETO POOLIANA**
> (agente DeFi do curso Defiverso) num único documento autocontido, para ser reaproveitado em
> qualquer outro agente, prompt ou projeto — sem precisar abrir a pasta do projeto.
>
> **Extraído em 05/09/2026** de `C:\Users\barol\OneDrive\Documentos\PROJETO POOLIANA`.
> Fontes: `knowledge_base/data/METODOLOGIA_GENESIS.md` (a doutrina), `puliana/backend/persona.py`
> (system prompt operacional), `agent/autonomous.py` (o algoritmo real de seleção),
> `market/dex_scanner.py` (filtros e fórmulas), `risk/manager.py` + `risk/exit_monitor.py`
> (limites e gatilhos de saída), `agent/tools.py` (contrato de capacidades),
> `config/settings.py` (thresholds).
>
> **Convenção usada aqui:** marco como **[DOUTRINA]** o que está escrito na metodologia do curso e
> como **[CÓDIGO]** o que o agente de fato executa, com referência de arquivo. Onde os dois
> divergem, está sinalizado na **§13**. Isso importa: em vários pontos o código é mais permissivo
> que a doutrina.
>
> **Não contém segredo nenhum** — nenhuma chave de API, chave privada ou endereço de carteira.
>
> Documento irmão: `CONHECIMENTO-BAROLO.md` (a metodologia do próprio Lucas). Este aqui é a
> metodologia **Genesis/Defiverso**, que é outra coisa — ver §14 para onde as duas se encontram e
> onde se contradizem.

---

## 1. Identidade e princípios operacionais

Como o agente se comporta (de `agent/brain.py` e `puliana/backend/persona.py`):

- **É um operador DeFi, não um chatbot.** Aplica método, não opinião.
- **Idioma: português brasileiro, sempre.** Regra dura no prompt, com lista explícita de
  substituições ("Let me" → "Vou", "Sure" → "Claro").
- **Tom:** profissional, direto, amigável. Sem gíria forçada, sem formalidade excessiva.
  **Quando há risco, fala ANTES da decisão. Quando há oportunidade, traz os números.**
- **Nunca opera sem análise.** Todo trade precisa de motivo baseado em dado.
- **Preservação de capital > maximização de lucro.**
- **Entende a tendência macro antes de operar o curto prazo.**
- **Documenta cada operação com justificativa.**
- **Não inventa preço, multiplicador nem TVL — sempre via ferramenta.**
- **Não dá conselho fiscal nem jurídico.**
- **Cita a fonte** quando responde sobre conteúdo do curso (PDF, aula, módulo).

### 1.1 Economia de chamadas (regra dura do prompt)
Cada chamada de ferramenta custa 3–5s, então:
- **No máximo 1 ferramenta por pergunta.**
- Responde **só o que foi perguntado** — nada de "relatório completo" não pedido.
- Saldo → só portfólio. Top pools → só scan. Posições → só posições.
- Cumprimento → 1 frase, zero ferramentas. Pergunta vaga → pede pra repetir, zero ferramentas.
- **Nunca encadeia ferramentas "pra dar visão geral".**

### 1.2 Estilo de saída (pensado para voz/TTS)
- Respostas curtas para perguntas simples ("saldo? 0,04 SOL, 9 USDC").
- Vírgula como separador decimal ao falar (0,04 e não 0.04).
- Avisa antes ("vou rodar o scan..."), confirma depois ("pool aberta, tx aqui...").
- **Evita tabelas markdown, listas numeradas, separadores `---` e excesso de emoji** — não soam bem.
- **Nunca lê lista longa em voz alta.** Nome + 1 número-chave + 1 observação. Para ali.
- Ideal: 2–4 frases para perguntas simples, até 6 para interpretativas.

---

## 2. Método B.A.R.C.A — alocação de portfólio

**[DOUTRINA]** A régua que define quanto capital pode ir para pools.

| | Componente | Neutro | Bull | Bear | Descrição |
|---|---|---|---|---|---|
| **B** | Base Sólida | **50%** | 40% | **60%** | Bitcoin — DCA diário guiado por indicadores |
| **A** | Ativos Voláteis | 20% | **40%** | 5% | Altcoins pela metodologia Defiverso |
| **R** | Renda Passiva | **15%** | 10% | 10% | **Pools de liquidez** + real yield + staking |
| **C** | Caixa | 10% | 5% | **25%** | Stablecoins — reserva de oportunidade |
| **A** | Aprender | 5% | 5% | 0% | Testes, airdrops, novas aplicações |

> **O número que mais importa operacionalmente: "Renda Passiva".** É o teto de quanto do
> portfólio pode estar em pool. Em mercado neutro, **15%**. A ferramenta `rebalance_for_pool`
> traz isso na própria descrição: *"capital a alocar no pool (recomendado: 15% do portfólio
> total, conforme Método B.A.R.C.A)"*.

**Meta de rendimento por ciclo:**

| Ciclo | Meta mínima mensal |
|---|---|
| Bear Market | **4% a 5%** — consistência acima de tudo |
| Bull Market | **20%+** — aproveitar volume e volatilidade |

---

## 3. O critério central — Multiplicador Taxas/TVL

**[DOUTRINA + CÓDIGO]** É *o* critério de seleção. Tudo mais é filtro que roda antes.

```
Multiplicador = Taxas 24h / TVL do pool
```

Entra sempre no pool com o **maior multiplicador**, independente de rede ou par —
**depois** de passar pelos filtros obrigatórios.

**Derivações** (`market/dex_scanner.py::calculate_taxa_tvl`):

```
daily   = fees_24h / tvl
weekly  = daily × 7
monthly = daily × 30
annual  = daily × 365
```

**Escala de interpretação** (`_interpret_taxa_tvl`, sobre a taxa **anualizada**):

| Anualizado | Leitura |
|---|---|
| ≥ 200% | 🔥 Excelente |
| ≥ 100% | ✅ Muito bom |
| ≥ 50% | 👍 Bom |
| ≥ 20% | ⚠️ Razoável — mínimo aceitável |
| < 20% | ❌ Abaixo do mínimo |

**Fee tier:** sem preferência (0,05% / 0,3% / 1%). **Entra sempre no tier com maior
multiplicador.**

**Prioridade de redes** — histórica, o multiplicador é quem decide:
`SOLANA → ARBITRUM → POLYGON → BASE → ETHEREUM`
No código o peso vira multiplicador de score: Solana `1.00`, Arbitrum `0.85`, Base `0.70`,
Ethereum `0.50` (`agent/autonomous.py`).

### 3.1 Heurísticas de sanidade sobre APR (de `persona.py`)
- **APR > 200% num blue-chip costuma ser subsídio temporário, insustentável.**
  Uma SOL/USDC com 100% sustentável é **melhor** que uma SOL/ORCA com 200%.
- **TVL > US$ 1M** = blue chip · **> US$ 5M** = muito sólido.
- **Volume 24h > 10% do TVL** = pool ativa, gerando fee de verdade.
- Em bear, meta 4–5%/mês. **Não se iludir com APR alto.**

---

## 4. Filtros obrigatórios — rodam ANTES do multiplicador

### 4.1 Filtros duros do pool **[CÓDIGO]** (`agent/autonomous.py::_select_best_pool`)
Qualquer um reprova e o pool é descartado sem entrar no ranking:

| Filtro | Corte |
|---|---|
| TVL mínimo | **US$ 150.000** no código · **US$ 500.000** na doutrina (ver §13) |
| Volume 24h mínimo | **US$ 10.000** |
| Multiplicador mínimo | **0,0005/dia** (≈ 18%/ano) |
| Par memecoin **e** memecoin | **bloqueado** — IL ilimitado |
| Nome do token contém `TEST`, `FAKE`, `SCAM`, `RUG`, `HONEYPOT` | bloqueado |
| Precisa ter âncora | pelo menos um lado em `SOL/WSOL/USDC/USDT/WBTC/WETH/ETH` |

### 4.2 Qualidade do token **[DOUTRINA]**

**Volume e liquidez (Portal 3):**
- Volume 24h saudável: **entre 2% e 4% do market cap**
- Volume 7 dias: **entre 10% e 20%** do market cap
- **Listado em mais de uma exchange** — só uma é red flag de liquidez
- Liquidez suficiente para entrar e sair sem impacto relevante no preço

**Verificação de contrato (OBRIGATÓRIA — Solscan / Etherscan / De.Fi Scanner / DeFiLlama):**
- Ownership foi renunciado?
- Há função de **mint ilimitado**? (red flag)
- Supply concentrado em poucas carteiras?
- Contrato foi auditado?

**Red flags que descartam automaticamente:**
- Sem utilidade real além de especulação pura
- Inflação absurda com tokens concentrados em poucas carteiras
- Sem controle de inflação
- Falta de transparência na equipe / time não verificável
- Sem liquidez / sem volume
- Modelo de negócio insustentável
- Métricas em queda contínua
- Promessa de lucro garantido
- Whitepaper inexistente ou muito fraco

**Tokenomics que preocupam:**
- **FDV muito maior que market cap** = diluição futura grande
- **Vesting com cliff próximo** (desbloqueio súbito)
- ICO que beneficiou demais os early investors
- Whales concentrando supply

**Green flags:**
- Narrativa forte com espaço para crescer · distribuição justa · **receita maior que subsídio**
- Caminho claro de monetização · métricas crescentes · desenvolvimento ativo
- Listagem em exchanges grandes · parcerias relevantes · expansão para novas redes

**Checklist inicial de token (7 perguntas do curso):**
1. Em qual nicho está? Tem narrativa de mercado?
2. Qual o mecanismo de consenso? Tem diferencial?
3. Que problema resolve? A solução é clara?
4. Existe mercado endereçável?
5. Tem modelo de negócio sustentável?
6. Captura parte da receita do protocolo?
7. Distribui receita para holders?

---

## 5. Hierarquia de pares — o que aceitar, e com qual penalidade

**[DOUTRINA]** Três tipos aceitos: **stable + volátil** (mais conservador), **dois voláteis**
(exige correlação), **memecoin** (só em bull confirmado).

**Regra de correlação para dois voláteis:** verificar em <https://defillama.com/correlation>.
Precisa de **correlação positiva alta** — se um sobe, o outro sobe. Alta correlação = menos IL.
Baixa ou negativa = IL alto = **evitar o par**.

### 5.1 Hierarquia antes de comparar Taxas/TVL (de `persona.py`)

1. **stable + volátil blue-chip** (SOL/USDC, WBTC/USDC, ETH/USDC) — baixo IL.
   Priorizado em **bear e neutro**. Ideal para capital defensivo.
2. **dois voláteis blue-chip** (SOL/ORCA, SOL/JUP, SOL/RAY) — IL maior, risco sobe se a
   correlação cair. **OK em bull, evitar em bear.**
3. **memecoin / token desconhecido** — alto risco. **Só em bull confirmado**, com
   `scale_out` e `hard_exit` planejados **antes** de entrar.

**Comportamento por ciclo:**
- **BEAR** → recomenda stable+volátil. **Não** recomenda dual-volatile como TOP. Se o dono
  pedir explicitamente uma dual-volatile, **avisa do IL primeiro**.
- **BULL** → pode equilibrar stable+volátil e dual-volatile. Memecoin só sob pedido.
- **NEUTRO/LATERAL** → prioriza stable+volátil. Dual-volatile só com correlação alta.

### 5.2 Penalidade de risco por nível **[CÓDIGO]** — os números reais do score

| Nível | Par | IL esperado | Penalidade |
|---|---|---|---|
| 1 | estável / estável (USDC/USDT) | ≈ 0% | **0%** |
| 2 | blue-chip / estável (SOL/USDC) | 2–10% | **5%** |
| 2b | desconhecido / estável | moderado (1 âncora) | **20%** |
| 3 | blue-chip / blue-chip (SOL/ETH) | 5–15% | **15%** |
| 3b | desconhecido / blue-chip | correlação parcial | **30%** |
| 4 | blue-chip / memecoin (SOL/BONK) | 10–30% | **60%** |
| 5 | sem âncora conhecida | máximo | **50%** |
| — | memecoin / memecoin | ilimitado | **BLOQUEADO** |

**Classificação de tokens usada no código** (`agent/autonomous.py`):
- **Stables:** `USDC, USDT, DAI, FRAX, BUSD, USDS`
- **Blue chips:** `SOL, WSOL, ETH, WETH, BTC, WBTC, JUP, RAY, ORCA, JTO, PYTH`
- **Memecoins:** `BONK, WIF, FARTCOIN, GRIFFAIN, POPCAT, TRUMP, MELANIA, BOME, SAMO`

### 5.3 Memecoin em bull — condições **[DOUTRINA]**
Genesis operou GRIFFAIN e POPCAT com sucesso. A lógica: em bull com momentum forte, a pool
com memecoin paga **taxa alta pelo volume** *e* dá **valorização do token dentro da pool**.
Condições para aceitar: bull confirmado · volume real e crescente · contrato verificado ·
liquidez para sair · **timing consciente com saída planejada**.

---

## 6. A fórmula de score completa **[CÓDIGO]**

Este é o algoritmo de decisão real do agente. Reproduzível em qualquer linguagem:

```
score = taxa_tvl_anualizada × peso_da_rede × (1 − penalidade_de_risco)
```

Onde:

```
taxa_tvl_anualizada = taxa_efetiva × 365

# Proteção contra spike de volume:
spike_ratio = volume_24h / tvl
se spike_ratio > 5.0:
    taxa_efetiva = min(taxa_tvl_multiplier, 0.010)   # teto de 1%/dia = 365%/ano
senão:
    taxa_efetiva = taxa_tvl_multiplier

peso_da_rede = { solana:1.00, arbitrum:0.85, base:0.70, ethereum:0.50 }
penalidade_de_risco = tabela da §5.2
```

> **Por que o teto de spike existe:** volume 24h maior que **5× o TVL** indica evento único,
> não retorno sustentado. Sem o teto, uma pool que pegou um spike de um dia dominaria o
> ranking sobre pools de retorno real. Esse detalhe é o que separa o método de um "ordenar
> por APR desc".

---

## 7. Definição de range

**[DOUTRINA]**
- Ferramenta principal: **suporte e resistência** no gráfico (método das aulas).
- **Bollinger Bands** como auxílio, especialmente na estratégia mono-ativo.
- **Estratégia mono-ativo (sem IL):** entrar "full" num único ativo; Bollinger define o range
  sem exposição a impermanent loss.
- **Princípio: não existe range fixo.** Cada pool, cada ativo, cada momento de mercado pede um
  range diferente.

**[CÓDIGO]** (`agent/autonomous.py::_calculate_optimal_range`)
- Se há Bollinger disponível: `lower = banda_inferior × 0.97` e `upper = banda_superior × 1.03`
  (3% de margem de segurança de cada lado).
- Sem indicador: **range padrão ±20%** do preço atual.
- Calcula o IL estimado no extremo do range e **alerta se passar de 20%**.

**Leitura do RSI para timing de entrada:**
- RSI > 70 → sobrecomprado: considerar range mais alto ou aguardar correção
- RSI < 30 → sobrevendido: bom momento para entrar, mas aguardar reversão
- 30–70 → neutro: condições favoráveis

**Leitura do IL estimado:**
- < 5% → baixo, par com boa correlação
- < 15% → moderado, gerenciável
- < 20% → próximo do limite, monitorar de perto
- ≥ 20% → **revisar o range ou trocar de par**

### 7.1 Fórmula do Impermanent Loss

```
IL = 2 × √k / (1 + k) − 1        onde k = razão de variação do preço
```

Exemplo: preço dobra (k = 2) → IL ≈ −5,7%. Preço a 4× (k = 4) → IL ≈ −20%.

---

## 8. Remontagem de pool — senso crítico

**[DOUTRINA]** É a seção mais contraintuitiva do método e vale citar literal:

> *"Na maioria das vezes o preço VOLTA para o range. Não sair rápido demais."*

**O agente NÃO remonta automaticamente.** Precisa analisar criticamente.

**Gatilho de remontagem — só quando os DOIS forem verdade:**
1. O preço saiu **MUITO** do range (não uma saída pontual)
2. **E não há expectativa de retorno** — a análise técnica indica continuação

**Perguntas antes de remontar:**
- A saída foi um wick/spike temporário ou uma quebra de estrutura?
- O volume confirma a direção da saída?
- O preço está formando novo suporte/resistência fora do range?
- Qual a tendência de curto e médio prazo?
- **Em dúvida → aguardar.**

**Quando NÃO remontar:**
- Saída pequena → aguardar retorno
- Pouco volume na saída → provável retorno
- Spike sem fechamento de candle fora do range → aguardar
- Mercado em consolidação → o range tende a ser respeitado

---

## 9. Gestão de risco

### 9.1 Limites da doutrina
- **IL máximo tolerado: 20%** — acima disso, sair da pool
- Renda Passiva = **15%** do portfólio total (B.A.R.C.A)
- Bear: priorizar pools de stablecoin ou pares BTC/ETH + stable
- Bull: aceitar mais volatilidade em troca de mais taxa

### 9.2 Limites configuráveis **[CÓDIGO]** (`config/settings.py`, defaults)

| Parâmetro | Default | O que faz |
|---|---|---|
| `MAX_TRADE_PCT` | **5%** | Teto de uma operação como % do portfólio |
| `STOP_LOSS_PCT` | **10%** | Stop padrão |
| `MAX_SLIPPAGE_PCT` | **1%** | Slippage máximo em swap |
| `MAX_GAS_GWEI` | **50** | Teto de gas em EVM |
| `DAILY_LOSS_LIMIT_PCT` | **20%** | Perda diária que **bloqueia operações até o dia seguinte** |
| `AGENT_MEMORY_SIZE` | 50 | Mensagens mantidas em memória |

### 9.3 O que o gerenciador de risco valida antes de CADA operação
(`risk/manager.py::check_operation` — retorna `{approved, reason, warnings}`)

**Bloqueia (hard block):**
1. Limite diário de perda atingido
2. Operação acima de `MAX_TRADE_PCT` do portfólio
3. Valor abaixo de **US$ 1**

**Avisa (não bloqueia):**
- Operação acima de **80% do limite** → "operação grande"
- Modo mainnet → "esta operação usará fundos reais"
- `add_liquidity` → "você está exposto a Impermanent Loss, verifique a volatilidade do par"
- `borrow` → "risco de liquidação se o colateral cair; **mantenha health factor > 1.5**"
- Slippage > 2% → "risco de sandwich attack"

**Lista de tokens vetados por nome** (verificação manual obrigatória): `SAFEMOON, SQUID, LUNA, UST`.

---

## 10. Critérios de saída — como uma posição é encerrada

**[CÓDIGO]** (`risk/exit_monitor.py`) — roda em loop (default **a cada 10 min**), avalia cada
posição aberta contra os `exit_criteria` gravados quando a posição foi montada.

> **Política sobre taxas: taxa NÃO dispara fechamento.** Fees acumulam indefinidamente enquanto
> a pool estiver ativa. **Todos os critérios de saída são sobre o CAPITAL investido.**

| Critério | Condição | Severidade | Auto-executa? |
|---|---|---|---|
| `scale_out_upside` | preço ≥ gatilho | ACTION | ❌ manual — saída parcial é decisão humana |
| `hard_exit_upside` | preço ≥ topo do range | CRITICAL | ✅ sim |
| `stop_loss_downside.full` | preço ≤ piso **E** perda ≥ X% do capital | CRITICAL | ✅ sim |
| `stop_loss_downside.price` | preço ≤ piso, mas perda < X% | WARN | ❌ só alerta |

O detalhe importante do stop: é uma condição **E**, não OU. Preço caindo sozinho **não** fecha
posição — o agente lê o valor on-chain da posição, calcula a perda real contra
`total_usd_at_open` e só dispara se **as duas** condições baterem. Se não conseguir ler o valor
on-chain, vira WARN manual em vez de agir no escuro.

**Trava de segurança do auto-execute:** máximo de **3 execuções automáticas por hora**
(`server.py::_auto_exec_allowed`), com o comentário explícito no código: *"hard safety cap so a
buggy monitor can't drain the wallet through repeated remove_liquidity calls"*. Tudo é logado em
`security_events` para auditoria.

---

## 11. Regras duras de execução e segurança

- **NUNCA dispara transação on-chain sem o dono dizer "go", "manda" ou equivalente explícito.**
  As ferramentas de broadcast pausam o fluxo automaticamente e aguardam confirmação.
- **Ferramentas de broadcast** (`puliana/backend/security.py::BROADCAST_TOOLS`):
  `execute_swap`, `add_liquidity`, `remove_liquidity`, `close_position`, `collect_fees`.
- **Kill switch global** — interruptor que pausa toda operação na hora.
- **Carteira dedicada, nunca a principal.** Chave privada só em `config/.env` (permissão 600,
  fora do git).
- **Mainnet desde o setup** — transação é dinheiro real.
- Auditoria diária + rastreio de custo de API (`make cost-today`).

---

## 12. Fluxo de decisão completo (as 6 etapas)

```
ETAPA 1 — FILTRO DE QUALIDADE DO TOKEN
→ Contrato verificado? NÃO = DESCARTAR
→ Volume saudável (2-4% do market cap/24h)? NÃO = DESCARTAR
→ Red flags presentes? SIM = DESCARTAR
→ Par de dois voláteis? → verificar correlação no DeFiLlama
→ É memecoin? → só em bull confirmado

ETAPA 2 — FILTRO DO POOL
→ TVL abaixo do piso? DESCARTAR
→ Calcular Multiplicador = Taxas 24h / TVL
→ Comparar todos os candidatos
→ Selecionar o de MAIOR multiplicador (ajustado por rede e risco — §6)

ETAPA 3 — VALIDAÇÃO DO CICLO
→ Bull ou bear?
→ O multiplicador projeta a meta? (4-5%/mês bear | 20%+/mês bull)
→ Não projeta? → buscar outro pool

ETAPA 4 — DEFINIÇÃO DE RANGE
→ Identificar suporte e resistência
→ Bollinger Bands como auxílio
→ Adaptar ao momento do ativo
→ IL estimado > 20%? → range mais amplo ou outro par

ETAPA 5 — MONITORAMENTO E REMONTAGEM
→ Preço saiu do range?
→ Vai voltar ou continua fora? (senso crítico — §8)
→ Só remontar se saiu MUITO e sem expectativa de retorno
→ IL > 20%? → sair

ETAPA 6 — COLETA DE TAXAS
→ Coletar regularmente
→ Reinvestir conforme B.A.R.C.A e ciclo
   (token quando o objetivo é acumular; stable quando é desalavancar)
```

---

## 13. ⚠️ Divergências entre doutrina e código

Isto não é detalhe — quem for reusar este conhecimento precisa saber onde o agente real
**não** segue a metodologia escrita.

### 13.1 TVL mínimo — três valores diferentes em produção

| Onde | Valor |
|---|---|
| `METODOLOGIA_GENESIS.md` (doutrina) | **US$ 500.000** |
| `agent/tools.py` (descrição + default da ferramenta) | **US$ 500.000** *("regra do curso")* |
| `agent/autonomous.py:150` (chamada do scan) | **US$ 500.000** |
| `puliana/backend/dashboard.py` (top 5 do painel) | **US$ 500.000** |
| **`market/dex_scanner.py:21` (default do scanner)** | **US$ 150.000** |
| **`agent/autonomous.py:190` (filtro duro da seleção)** | **US$ 150.000** |

O comentário no código justifica: *"$150K cobre pools sólidos em Solana sem excluir boas
oportunidades"*. Ou seja, **é uma flexibilização consciente da regra**, não um bug — mas o
filtro que de fato decide é o de **$150K**, e não os $500K que a metodologia promete. Quem
copiar o método precisa escolher qual dos dois quer.

### 13.2 Penalidade de memecoin: doutrina vs código
A doutrina diz que memecoin é aceitável em bull confirmado. O código aplica **60% de
penalidade** ao par blue-chip/memecoin — na prática ele quase nunca vence o ranking, mesmo em
bull. O bloqueio real e absoluto é só memecoin/memecoin.

### 13.3 Scanner da Orca — ✅ CORRIGIDO em 05/09/2026
`market/dex_scanner.py:190-191` chamava a API v2 da Orca com `sortBy=feeApr`. A API **rejeitava**
esse valor:

```
unknown variant `feeApr`, expected one of `volume`, ..., `fees24h`, `fees7d`, ...
```

Resultado: as duas chamadas v2 falhavam e caía no fallback `v1_legacy`
(`api.mainnet.orca.so/v1/whirlpool/list`), que baixa **~18 MB** a cada varredura.
**Corrigido** para `sortBy=fees24h` nos dois endpoints (`v2_search` e `v2_list`).

### 13.4 Escopo de arquivo apontando para outra máquina
`puliana/backend/security.py` tem `ALLOWED_FS_ROOT` fixo em
`/Users/nakamoto/Documents/Projeto Agente Defiverso` — caminho macOS do autor original. Em
qualquer outra máquina esse allowlist não corresponde a nada. Não é falha de segurança
(erra para o lado restritivo), mas quebra qualquer funcionalidade que dependa de
`assert_within_scope`.

---

## 14. Onde a metodologia Genesis encontra a do Lucas

Confrontando com `CONHECIMENTO-BAROLO.md`:

**Concordam:**
- Pool como instrumento de renda, não aposta direcional
- Par "chato" (stable + blue-chip) é o que ganha dinheiro no longo prazo
- IL é o inimigo; correlação é a defesa
- Preservação de capital acima de maximização
- Disciplina de saída definida **antes** da entrada

**Divergem — e a divergência é informativa:**

| Tema | Genesis / Pooliana | Lucas / Barolo |
|---|---|---|
| **Critério de seleção** | maior multiplicador Taxas/TVL | pool como **estratégia de saída gradual** — o range é uma ordem de venda escalonada |
| **Referência de performance** | APR / multiplicador anualizado | **sempre em USD**, nunca em HOLD nem no token |
| **Memecoin** | aceitável em bull confirmado | track record próprio: 7 pools de narrativa, **1 vitória e 6 derrotas**, −US$ 1.844 |
| **Peso em pools** | 15% do portfólio (B.A.R.C.A) | ~5% hoje, com Kelly indicando 12–15% |
| **Rede** | Solana primeiro | onde a pool ativa estiver (hoje Robinhood Chain) |

> **O dado empírico do Lucas reforça a hierarquia de pares da §5:** as 22 pools "chatas" dele
> deram **+US$ 1.044 com 22 vitórias e 0 derrotas**; as 7 de narrativa tiveram **14× o fee APR**
> e destruíram **−US$ 1.844**. Ou seja: na prática, **APR alto foi indicador inverso de
> retorno** — exatamente o que a heurística "APR > 200% costuma ser subsídio insustentável"
> (§3.1) prevê.

---

## 15. Contrato de capacidades (as ferramentas do agente)

Útil para replicar o agente em outro framework.

**Leitura / análise (seguras, sem broadcast):**

| Ferramenta | O que faz |
|---|---|
| `get_price` | Preço atual de um ativo em USD |
| `get_technical_indicators` | RSI, MACD, Bollinger, EMA, SMA, volume por timeframe |
| `get_onchain_data` | TVL de protocolo, volume de pool, posições de baleia, funding rate |
| `analyze_pool` | APY, volume 24h, range atual, IL, posições ativas de um pool |
| `get_portfolio` | Saldos, posições em pools, empréstimos, P&L |
| `get_trade_history` | Histórico de operações do agente |
| `check_risk` | Valida operação contra os limites — **usar SEMPRE antes de executar** |
| `search_knowledge` | Busca semântica na base do curso (ChromaDB, embeddings multilíngues) |
| `scan_dex_pools` | Varre Raydium/Orca/Uniswap/Aerodrome e ranqueia pelo método |
| `rebalance_for_pool` | Calcula o swap necessário para entrar na proporção certa |
| `monitor_positions` | Acompanha posições abertas e gatilhos |
| `set_price_alert` | Alerta de preço (notify / auto_buy / auto_sell) |
| `run_autonomous_cycle` | Ciclo completo; `auto_execute=false` (default) só planeja |

**Broadcast (exigem "go" explícito):**
`execute_swap` · `add_liquidity` · `remove_liquidity` · `close_position` · `collect_fees`

**Parâmetros técnicos dos indicadores:** RSI período 14 · MACD 12/26/9 ·
Bollinger 20 períodos, 2 desvios.

---

## 16. Fontes de dados (todas públicas e sem chave)

Verificado em 05/09/2026 — **as três respondem com `Access-Control-Allow-Origin: *`**, ou seja,
são chamáveis direto do navegador, sem backend:

| Fonte | Endpoint | Uso |
|---|---|---|
| **Raydium** | `api-v3.raydium.io/pools/info/list` | pools CLMM: par, TVL, `fee24h`, símbolos |
| **Orca** | `api.orca.so/v2/solana/pools?sortBy=fees24h` | Whirlpools (ver bug §13.3) |
| **Orca legacy** | `api.mainnet.orca.so/v1/whirlpool/list` | fallback, ~18 MB |
| **GeckoTerminal** | `api.geckoterminal.com/api/v2/...` | Aerodrome/Base e outras DEXes |
| **DefiLlama** | `coins.llama.fi/prices/current/...` | preço (fonte primária do exit monitor) |
| **CoinGecko** | `api.coingecko.com/api/v3/...` | preço (fallback) e OHLC dos indicadores |
| Uniswap (The Graph) | `gateway.thegraph.com` | **requer** `GRAPH_API_KEY` — pulado sem ela |

> **Consequência prática:** todo o **scan e ranking de pools não depende de LLM nem de
> servidor**. É aritmética sobre dado público. Dá para rodar no navegador, num GitHub Action
> ou em qualquer script.

**Já implementado no `barolo-capital-site`** (05/09/2026): `scripts/fetch-pools.js` é a porta em
Node deste scan — aplica os filtros da §4, as penalidades da §5.2 e a fórmula da §6, e grava
`pooliana-pools.json`. Roda diariamente pela Action `.github/workflows/pools.yml` (~08:00 BRT,
**sem secret nenhum**) e alimenta a tabela da aba Pooliana.
**Este arquivo é a especificação daquele script** — mudou o método aqui, mude lá.

---

## 17. Bloco pronto para colar em outro agente

Para dar a metodologia a qualquer agente sem anexar o documento inteiro:

```
Você seleciona pools de liquidez pela metodologia Genesis (curso Defiverso).

CRITÉRIO CENTRAL: multiplicador = taxas_24h / TVL. Maior multiplicador vence —
mas só depois dos filtros. Nunca ordene por APR anunciado.

FILTROS DUROS (reprovou, descarta):
- TVL < $150K (o curso prega $500K; escolha um e seja consistente)
- Volume 24h < $10K
- multiplicador < 0,0005/dia (~18%/ano)
- par memecoin/memecoin
- nenhum lado do par é âncora (SOL/WSOL/USDC/USDT/WBTC/WETH/ETH)
- contrato não verificado, red flag de tokenomics, ou volume 24h fora de 2-4% do market cap

SCORE = (taxa_efetiva × 365) × peso_rede × (1 − penalidade_risco)
- teto anti-spike: se volume_24h > 5×TVL, limite taxa_efetiva a 0,010/dia
- peso_rede: solana 1,00 | arbitrum 0,85 | base 0,70 | ethereum 0,50
- penalidade: stable/stable 0% | blue/stable 5% | blue/blue 15% | desconhecido/stable 20%
  | desconhecido/blue 30% | sem âncora 50% | blue/memecoin 60%

CICLO manda: bear → stable+volátil, meta 4-5%/mês. bull → pode dual-volatile, meta 20%+/mês.
Neutro → prioriza stable+volátil. APR > 200% em blue-chip geralmente é subsídio insustentável.

RANGE: suporte/resistência do gráfico; Bollinger ±3% como proxy; sem indicador, ±20%.
IL = 2√k/(1+k) − 1. IL estimado > 20% → range mais amplo ou outro par.

REMONTAGEM: só se o preço saiu MUITO do range E não há expectativa de retorno.
Saída pequena, pouco volume ou spike sem fechamento → aguardar. Em dúvida, aguardar.

SAÍDA: taxa nunca dispara fechamento (acumula). Stop-loss exige preço ≤ piso E perda ≥ X%
do capital — as duas condições. Saída parcial é decisão humana.

RISCO: máx 5% do portfólio por operação | stop 10% | slippage 1% | perda diária 20% bloqueia
o dia | pools ≤ 15% do portfólio (B.A.R.C.A) | health factor > 1,5 em borrow.

NUNCA dispare transação on-chain sem "go" explícito. Nunca invente preço, TVL ou multiplicador.
Responda em pt-BR, 1 ferramenta por pergunta, só o que foi perguntado.
```

---

## 18. Stack de referência (como o original é construído)

| Camada | Tecnologia |
|---|---|
| Backend | FastAPI · Python · porta 8000 |
| Frontend | React + Vite + Tailwind · porta 5173 |
| Cérebro | Claude (Anthropic) · loop de raciocínio de até **10 iterações** por mensagem |
| Base de conhecimento | ChromaDB · chunks de 1000 palavras com overlap de 200 · embeddings `paraphrase-multilingual-MiniLM-L12-v2` |
| Voz (opcional) | Whisper (STT) · ElevenLabs (TTS) · wake word |
| Execução Solana | Orca Whirlpools · Jupiter (swap) |
| Persistência | SQLite local · `positions.json` · auditoria + custo de API |
| Monitor de saída | processo separado, loop de 10 min, heartbeat para a UI |

**Fast-path sem LLM:** perguntas reconhecidas por regex (saldo, posições, top pools, preço,
cumprimento) são respondidas direto, sem gastar chamada de modelo. O classificador inclusive
cobre erros comuns do Whisper ("salto"/"salgo" → saldo; "puzzles"/"pulls"/"polls" → pools).

---

*Extraído do PROJETO POOLIANA em 05/09/2026. Metodologia original: Genesis (fundador Defiverso).
Base: 467 aulas transcritas + 8 PDFs dos Portais, segundo o cabeçalho da metodologia.
Este documento é referência interna do Barolo Capital — não é recomendação de investimento.*
