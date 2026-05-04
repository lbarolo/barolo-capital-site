# Barolo Capital — Briefing para Claude Code

## O que é este projeto

Dashboard DeFi pessoal e institucional de **Lucas (Barolo Capital)** — gestora individual de capital em criptoativos desde 2022. Filosofia: acumulação de longo prazo (+10 anos), DCA mensal em ETH/SOL/ADA, uso de DeFi como ferramenta de yield e estratégia de saída.

Todas as páginas são **HTML estático puro** (sem framework, sem build step). Hospedado no GitHub e aberto diretamente como `file://` ou via servidor local simples.

---

## Estrutura de arquivos

```
barolo-site/
├── index.html              # Landing page institucional (EN padrão, toggle PT/EN)
├── portfolio_analytics.html # Dashboard principal — patrimônio, gráficos, heatmap
├── pools.html              # Histórico de pools de liquidez + gráficos de performance
├── emprestimos.html        # Posições de lending (AAVE V4 + Kamino) + histórico
├── ferramentas.html        # Ferramentas DeFi + Diário DeFi
└── CLAUDE.md               # Este arquivo
```

---

## Design system

- **Tema**: dark/light toggle via `data-theme` no `<html>`, salvo em `localStorage['bc-theme']`
- **Fontes**: 
  - `Satoshi` (Fontshare CDN) — UI geral em todas as páginas exceto index
  - `Cormorant Garamond` (Google Fonts) — títulos/display no index
  - `JetBrains Mono` — todos os valores numéricos, dados, tickers (NUNCA substituir)
- **Paleta**: `--gold:#c9a050`, `--green:#3fb950`, `--red:#f85149`, `--muted:#8a7a62`
- **Favicon**: B branco (`fill='white'`) em fundo escuro em todas as páginas
- **Login**: usuário `ADM` / senha `102030` → redireciona para `portfolio_analytics.html`

---

## Carteiras e APIs

### Carteiras EVM (Ethereum/Arbitrum/Base)
```
0x5Ff957C19A03aF57B5098F3F395A578E394aE4B6
0x5a9aaA78B379ec19beb9E44CCe12697d1894f396  ← carteira AAVE principal
0x835a5F686c489023064Edb0EA3A0f4ee54BD77F6
0x8311038D68039f4C3e7237D64f4F2c598fBf4ea3
```

### Carteira Solana
```
Fq1F49Vx38f8h62SSRCQpGYPxPEtarY5NZ5GhrFVnrfW
```

### Carteira Cardano
```
addr1q8cqzzh3t03xvkw7tmzz3jx5nm0spk8ftly7huaj7s6nr4jhy6r0hzw7ygs9ccu6clqqrkm6znuy0ctq737ruk7e72dqkm0a23
```

### APIs usadas
| API | Key | Uso |
|-----|-----|-----|
| Alchemy | `R_9y5DBqKNR2NapexG8n7` | Saldos EVM |
| Helius | `76a7f1e6-fac9-4361-a6bb-f7787926c719` | Solana + Kamino |
| Blockfrost | `mainnetUUNZyRnZ6sg9uAvwnprB7vNIu8s7VPKm` | Cardano ADA stake |
| CoinGecko | (free tier) | Preços ao vivo |
| AAVE V4 | `api.aave.com/graphql` | Posição AAVE V4 |
| alternative.me | `/fng/?limit=30` | Fear & Greed Index |
| exchangerate-api | `/v4/latest/USD` | Taxa USD/BRL |

---

## Posições atuais (Abril 2026)

### Portfolio de tokens (CoinGecko)
| Token | Quantidade | Cor no gráfico |
|-------|-----------|----------------|
| ETH | 2.084106 | #E8773D |
| SOL | 20.31134268 | #14F195 |
| ADA | 375.245 | #3773F5 |
| EIGEN | 153.363 | #6B3FF5 |
| RDNT | 7290.46 | #00D4FF |
| POL | 218 | #A855F7 |
| ZK | 876 | #1E90FF |
| XAI | 692.86 | #F59E0B |
| ZETA | 51.1434 | #00C896 |

**Última compra**: +0.99907692 SOL a $78.78 = $78.71 (Abril 2026)

### AAVE V4 (pro.aave.com — migrado de V3)
- Supply: 1.88 WETH + 1,650 USDT = ~$5.7K total
- Borrow: **748 USDC @ 2.32%** ← refinanciado em 10/04/2026 (era GHO @ 3.84%)
- Health Factor: 6.24 | Borrow power usado: ~18%
- API: `getUserAccountData` + aToken `balanceOf` (on-chain, live)

### Kamino Finance (Solana)
- Supply: 19.37 SOL + 300.55 USDS = ~$2.05K total
- Borrow: $805.70 USDC @ 4.09%
- LTV: 39.22% | Liq. LTV: 77.20%
- Net Value: $1.25K | Net APY: 3.83%
- Liq. Price SOL: $35.77

### Totais
- **STABLES**: USDT $1,650 + USDS $300.55 = **~$1,950**
- **DÍVIDA TOTAL**: $748 USDC (AAVE) + $805.70 USDC (Kamino) = **~$1,554**
- **PATRIMÔNIO LÍQUIDO**: ~$6,640

---

## Histórico de pools (dados reais do diário)

| Par | Rede | Dias | Capital | Taxas | IL | Resultado | Status |
|-----|------|------|---------|-------|-----|-----------|--------|
| WETH/USDC 0.3% | **Base** | 17 | $365 | $9 | $0 | $1 | **ATIVA** |
| ETH/USDC BASE | Base | 25 | $453 | $16 | $0 | $16 | fechada |
| ETH/USDT 0.05% | Arbitrum | 105 | $277 | $34 | $0 | $34 | fechada |
| SOL/USDC 0.04% | Solana | 93 | $660 | $23 | $0 | $23 | fechada |
| XAI/WETH 0.3% | Arbitrum | 60 | $35 | $7 | $21 | -$14 | fechada |
| SOL/GRIFT 2% | Solana | 80 | $780 | $1,389 | $2,899 | -$1,510 | fechada |
| MSTR/ETH 1% | Ethereum | 13 | $260 | $36 | $0 | $36 | fechada |
| ARB/USDT 0.3% | Arbitrum | 48 | $628 | $73 | $0 | $73 | fechada |
| PEANUT/ETH 1% | Ethereum | 10 | $300 | $0 | $243 | -$243 | fechada |
| RDNT/ETH 0.3% | Arbitrum | 8 | $957 | $90 | $0 | $90 | fechada |
| ARB/USDC 0.05% | Arbitrum | 181 | $884 | $155 | $0 | $155 | fechada |
| ARB/USDC 0.05% | Arbitrum | 5 | $900 | $180 | $0 | $180 | fechada |
| ETH/USDC 0.05% | Arbitrum | 209 | $1,014 | $22 | $0 | $22 | fechada |

**Totais**: Taxas brutas $2,128 | P&L líquido -$1,021

### Pool ATIVA — Dados completos (verificados via Revert Finance em 17/04/2026)

**NUNCA assumir Ethereum — esta pool está na Base.**

| Campo | Valor |
|---|---|
| Par | WETH/USDC 0.30% |
| Protocolo | Uniswap V3 |
| **Rede** | **Base** (chain_id=8453) |
| Carteira | `0x5Ff957C19A03aF57B5098F3F395A578E394aE4B6` |
| Abertura | 18/03/2026 |
| Capital entrada | 0.17 WETH ($365 na época) — **100% WETH, zero USDC** |
| Range mínimo | **$1,855.72** |
| Range máximo | **$3,146.36** |
| Preço médio efetivo de saída | **$2,416** (√(1855.72 × 3146.36)) |
| Estratégia | Saída gradual ETH→USDC: entra 100% WETH, sai 100% USDC ao atingir $3,146 |
| Monitorar em | https://revert.finance/#/account/0x5Ff957C19A03aF57B5098F3F395A578E394aE4B6 |

**Dados de 17/04/2026 (Revert Finance):**
- Pooled: $384.56 (0.07741 WETH + 196.67 USDC)
- Total fees: $18.62 (0.004 WETH + 8.89 USDC)
- Divergence loss: -$28.20
- Total PnL: -$9.58 | Fee APR: 32% | Total APR: -16.34%
- Preço atual ETH: $2,431 (IN-RANGE ✅)
- % vendido: ~44.6% do ETH convertido em USDC

**Referência: sempre em USD** — não usar HOLD nem ETH como referência de performance.

**Para buscar dados on-chain:** usar Base RPC (`https://base-mainnet.g.alchemy.com/v2/R_9y5DBqKNR2NapexG8n7`), não Ethereum.

### Evento especial — Hack Radiant Capital (2025)
- 1,079.17 ARB em stake desde 25/03/2024 — perdidos no hack
- Valor na época: ~$971 | Prejuízo efetivo: ~$671
- Reembolso ~$300 prometido mas pendente — dado como perdido
- **NÃO incluído no P&L operacional de pools**

---

## Ciclos de empréstimo

### Kamino (K1–K4)
- K1, K2, K3: fechados
- **K4**: ABERTO — $804.22 USDC

### AAVE (A1–A3)
- A1, A2: fechados (V3)
- **A3**: ABERTO — $746.99 USDC (migrado para V4)

---

## Gráficos em pools.html — canvases e funções

| Canvas ID | Função JS | Layout atual |
|-----------|-----------|--------------|
| chartPnl | buildPnl(type) | Grid 1fr 1fr (esq) — ao lado de chartProj |
| chartFees | buildFees(type) | Standalone full-width |
| chartTimeline | buildTimeline(type) | Grid 3fr 2fr (esq) — ao lado de chartApr |
| chartApr | buildApr(type) | Grid 3fr 2fr (dir) |
| ~~chartRecent~~ | ~~removido~~ | ~~removido em 07/04/2026~~ |
| chartRanking | buildRanking(mode) | Grid 1fr 1fr (esq) — Análise Avançada |
| chartWaterfallAdv | buildWaterfallAdv() | Grid 1fr 1fr (dir) — Análise Avançada |
| chartProj | buildProjChart() | Grid 1fr 1fr (dir) — ao lado de chartPnl |
| chartFCR | buildFCR() | Performance — Ranking |
| chartWaterfall | buildWaterfall() | Performance — Composição |
| chartNetRanking | buildNetRanking() | Performance — Net |

**Todos os gráficos usam Chart.js 4.4.1 (carregado no `<head>`).**
Dependências: `var gc`, `var isDark`, `var gridColor`, `var font` — definidas no script principal.
Inicialização: `document.addEventListener('DOMContentLoaded', function() { loadChartJs(function() { ... }) })`

---

## Problemas conhecidos e histórico de bugs

- **2025-04**: Múltiplas injeções de código causaram corrupção do script principal de gráficos em pools.html. O array `netColors` foi truncado (`'rgba(74]`), causando SyntaxError que quebrava todos os gráficos.
- A função `runAll()` em script[6] foi perdida em uma limpeza e precisou ser recriada.
- `buildTable()` e `buildLicoes()` foram perdidas e recriadas como funções simples.
- Canvas `chartWaterfall` aparecia duplicado — renomeado para `chartWaterfallAdv` na seção Análise Avançada.
- **Ao editar scripts**: sempre verificar `depth=0` após edição. Usar parser que ignora strings e comentários.

---

## Idiomas

- **index.html**: EN padrão, toggle PT/EN via `toggleIndexLang()`, strings em `INDEX_LANG_STRINGS`
- **Outras páginas**: PT (português), sem toggle de idioma
- Elementos traduzíveis têm atributo `data-i18n="key"`

---

## Estratégia de investimento (contexto importante)

- Horizonte: **+10 anos**, acumulação de longo prazo
- DCA mensal em fiat → cripto
- Bear markets = oportunidade de compra, não razão para sair
- Pools usadas como **estratégia de saída gradual** de posições, não apenas para taxas
- Concentração intencional em ETH + SOL (entende os protocolos profundamente)
- Stables paradas = caixa aguardando ponto de entrada melhor
- RDNT ($40) e outros tokens menores: mantidos por opcionalidade, não realizando prejuízo

---

## Sessão 07/04/2026 — O que foi feito

### Implementado em pools.html (manhã — 1ª rodada)
- **P&L 2026 YTD bar** — barra no topo calculando fees brutas, P&L líquido, pools ativas e dias do ano (usa array `POOLS`)
- **HF nav badge** — badge na nav com Health Factor AAVE V4 ao vivo (`window._liveAaveHF`); verde > 3, amarelo > 1.5, vermelho < 1.5
- **Card nativo WETH/USDC** — métricas LP (POOLED, P&L, APR, FEES, IL) + range $2,450–$3,100 + indicador visual de posição do preço
- **Revert iframe restaurado** — iframes mantidos a pedido do usuário; card nativo ficou acima dentro do mesmo `.revert-panel`
- **Cardano section** — seção ADA stake via Blockfrost API
- **`buildPoolTable()`** — função criada para popular `poolTableBody` a partir do array `POOLS` (a tabela estava vazia antes)

### Implementado em pools.html (tarde — 2ª rodada)
- **Market ticker movido** — de `position:fixed;bottom:0` para sub-barra abaixo do nav (`top:50px`); container padding ajustado de 80px → 110px
- **Fetch do ticker implementado** — BTC, ETH, SOL via CoinGecko + GWEI via Alchemy (`eth_gasPrice`); atualiza a cada 60s com variação 24h colorida
- **Ordem BTC → ETH → SOL** — BTC aparece antes de ETH no ticker
- **Gráfico "Pool Ativa — Taxas Diárias" (chartRecent) removido** — HTML + `buildRecent()` + `setRecent()` + `recentPeriod` deletados
- **Seção "Pool Ativa — Composição de Tokens" removida** — card de 4 tokens (WETH, USDC, FEES WETH, FEES USDC) deletado junto com script LIVE DAYS COUNTER
- **chartPnl + chartProj lado a lado** — grid `1fr 1fr`, altura 160 cada (eram full-width separados)

### Testado
- P&L YTD bar: calcula OK com os dados do array `POOLS`
- Ticker: BTC/ETH/SOL/GWEI aparecem e atualizam (depende de CoinGecko free tier e Alchemy)
- buildPoolTable: tabela popula com todos os dados do array POOLS, cores corretas

### Problemas conhecidos
- Iframe Revert Finance bloqueado por X-Frame-Options no Chrome → cai no fallback. Card nativo acima serve como alternativa
- CoinGecko free tier tem rate limit (~10–30 req/min) — ticker pode falhar silenciosamente se muitas abas abertas
- `projKpis` (KPIs abaixo do chartProj) precisa verificar se ainda renderiza corretamente no novo layout lado a lado

### O que ainda falta (ao final de 07/04/2026 — tarde)
- ~~**View executiva em `portfolio_analytics.html`**~~ — FEITO (ver sessão 2)
- ~~**`index.html` SOL hardcoded**~~ — FEITO (19.31 → 20.31)
- **Separar `portfolio_analytics.html` em abas** — Visão Geral / Análise / Histórico (pendente)
- **Atualizar WEEKLY_UPDATE** em `portfolio_analytics.html` — dados de Mar/2026, precisam ser atualizados para Abr/2026 (SOL qty, AAVE/Kamino posições, curva de patrimônio)

---

## Sessão 07/04/2026 — 2ª parte (continuação)

### Implementado em `portfolio_analytics.html`
- **Executive Summary Bar** — barra de 5 métricas adicionada no topo da página (acima de "Alocação Atual"):
  1. **Patrimônio Líquido** — valor ao vivo + ROI total %
  2. **Dívida Total** — valor + ratio D/Patrimônio %
  3. **Health Factors** — AAVE HF (colorido: verde > 3, amarelo > 1.5, vermelho < 1.5) + Kamino LTV % (verde < 50%, amarelo < 65%, vermelho acima)
  4. **Juros / Mês** — custo mensal estimado das dívidas (AAVE 3.28% + Kamino 3.18%)
  5. **Yield DeFi / Mês** — retorno líquido estimado (supply yield − juros); verde se positivo, vermelho se negativo
- Layout: `grid 5 colunas`, gap de 1px com `var(--border)` como fundo (estilo Bloomberg)
- IDs HTML: `ev-net`, `ev-net-sub`, `ev-debt`, `ev-lev`, `ev-hf-aave`, `ev-hf-kamino`, `ev-hf-sub`, `ev-interest`, `ev-interest-sub`, `ev-yield`, `ev-yield-sub`
- JS: bloco IIFE dentro de `renderUI()` — usa `WEEKLY_UPDATE.defi` para APYs e `window._liveAaveHF` / `window._liveSolPrice` quando disponíveis

### Implementado em `index.html`
- **SOL qty corrigido** — 19.31 → 20.31 (linha do token-ticker)

### Problemas conhecidos (acumulados)
- Iframe Revert Finance bloqueado por X-Frame-Options no Chrome → cai no fallback. Card nativo acima serve como alternativa
- CoinGecko free tier tem rate limit (~10–30 req/min) — ticker pode falhar silenciosamente se muitas abas abertas
- `projKpis` (KPIs abaixo do chartProj em pools.html) precisa verificar se ainda renderiza corretamente no layout lado a lado
- Yield DeFi no exec bar usa APYs hardcoded (AAVE USDT 3.2%, Kamino SOL 6%, Kamino stables 10%) — atualizar conforme posições mudam

### O que ainda falta (ao final de 07/04/2026 — 2ª parte)
- ~~**Atualizar `WEEKLY_UPDATE`**~~ — FEITO na 3ª parte
- **Separar `portfolio_analytics.html` em abas** — Visão Geral / Análise / Histórico (pendente)

---

## Sessão 07/04/2026 — 3ª parte

### `index.html` — Correções completas
- **Logo corrigido** — era gradiente transparent→gold→transparent com font-weight:300 (ficava apagado). Agora `fill="#c9a050"` sólido + `font-weight:500`. SVG simplificado sem gradiente.
- **Login ADM/102030 implementado** — `loginNav()` criada; valida user `ADM` + senha `102030` → redireciona para `portfolio_analytics.html`. Credencial errada pisca o botão.
- **Toggle EN/PT corrigido** — `toggleIndexLang()` criada com todas as strings PT/EN em `INDEX_LANG_STRINGS`; alterna via `data-i18n` em todos os elementos; botão muda entre `PT` e `EN`.
- **Toggle dark/light corrigido** — `toggleTheme()` criada; alterna `data-theme`, salva em `localStorage`, atualiza ícone ☾/☀.
- **Ticker implementado** — `tickerInit()` busca BTC/ETH/SOL/ADA via CoinGecko com variação 24h colorida.
- **Funções auxiliares adicionadas** — `setActive()`, `closeMobile()`, `toggleMobile()` para navegação mobile.
- **Causa raiz** — nenhuma `<script>` com funções existia no arquivo. Todos os `onclick` do HTML chamavam funções inexistentes.

### `pools.html` — Ajustes de layout e dados
- **Gráficos reduzidos**:
  - `chartPnl` (Resultado Líquido): 160 → 120px
  - `chartProj` (Projeção Renda Passiva): 160 → 120px
  - `chartFees` (Taxas Anuais): 110 → 75px
  - Pool Ativa WETH/USDC iframe: 1080px → 480px (inline `style` no `#iframeWrap`)
- **Net$ button corrigido** — bug no `buildRanking()`: `borderColor` usava regex `/bb|99|70\)/` que transformava `rgba(248,81,73,0.70)` em `rgba(248,81,73,0.ff)` (CSS inválido). Chart.js jogava erro interno → gráfico travava no modo anterior. Fix: regex correta `col.replace(/,\s*[\d.]+\)$/, ',1)')`.
- **Registro Histórico** — 2 pools do diário adicionadas ao array `POOLS` que estavam faltando:
  - `PENG/ETH 1%` Ethereum (08/06–20/07/2024) — token scam, capital $260, il $72 (gas saída), result −$72
  - `XAI/ETH 0.3%` Ethereum (17/06–30/07/2024) — taxas mínimas, capital $100, fees $3, result +$3
- **Pool Ativa — Composição de Tokens** — HTML já havia sido removido em sessão anterior; confirmado que não existe mais no HTML.

### `portfolio_analytics.html` — Ticker + dados revisados
- **Market ticker adicionado** — barra fixa `top:50px` idêntica ao pools.html: GWEI · BTC · ETH · SOL com variação 24h. CSS classes `.mk-*` para não conflitar com pools. JS: `mkTickerInit()` via Alchemy + CoinGecko, atualiza a cada 60s.
- **Container padding** ajustado: 80px → 110px (para não ficar atrás do ticker).
- **`WEEKLY_UPDATE` atualizado** para Abril 2026:

| Campo | Antes | Depois |
|---|---|---|
| date | Mar/2026 | Abril 2026 |
| holdings.SOL | 19.312 | 20.31134268 |
| holdings.USDS | 90.04 | 300.42 |
| holdings.USDT | 1651.49 | 1652.90 |
| defi.aave.usdtSupplied | 1651.49 | 1652.90 |
| defi.aave.usdcBorrowed | 745.94 | 746.99 |
| defi.aave.healthFactor | 6.00 | 6.24 |
| defi.kamino.solSupplied | 19.4 | 19.33 |
| defi.kamino.pyusdSupplied | 90.04 | 300.42 |
| defi.kamino.usdcBorrowed | 802.91 | 804.22 |
| defi.kamino.ltv | 44.93% | 39.22% |
| invested.SOL | 19.312 (era qty, não $) | $2280.39 |
| LP_POOLED | $357.24 | $365 |
| Card POOLS LP (HTML) | $346.94 hardcoded | $365 |
| Footer | MAR 2026 | ABR 2026 |

- **Fórmula Patrimônio Líquido corrigida** — removido `KAMINO_SOL_EXTRA_QTY` (que era **negativo**: 19.35 − 20.31 = −0.96 × $87 ≈ −$84 subtraídos incorretamente). Fórmula agora: `SPOT + STABLECOINS − Dívida total`.

### O que ainda falta
- **Separar `portfolio_analytics.html` em abas** — Visão Geral / Análise / Histórico
- **Atualizar curva de patrimônio** (`wealthCurve`) em `WEEKLY_UPDATE` — último ponto é Mar/2026; adicionar Abr/2026 quando encerrar o mês
- **Atualizar retornos mensais** (`monthlyReturns[2026]`) — Jan e Fev estão preenchidos; Abr/2026 pendente ao final do mês
- **APYs do exec bar** — `Juros/Mês` e `Yield DeFi/Mês` usam APYs hardcoded (AAVE USDT 3.2%, Kamino SOL 6%, stables 10%). Atualizar quando as taxas mudarem.
- **`emprestimos.html`** — não foi revisado nesta sessão; pode ter dados desatualizados

---

---

## Sessão 08/04/2026 — Tabs portfolio, Registro Histórico pools, evolução patrimonial, relatório PDF, logo index

### Implementado

#### `portfolio_analytics.html` — Sistema de abas
- **3 abas criadas**: Ativos | Performance | DeFi & Mercado
- Tab strip HTML inserido após stats-row (`.tabs` com `#mainTabs`)
- Função `switchTab(name, btn)` adicionada — mostra/oculta `.tab-pane`, salva aba ativa em `localStorage['bc-active-tab']`
- Restauração automática da última aba no `init()` via `localStorage`
- **Distribuição das seções:**
  - **Ativos**: Alocação Atual (donut + retorno anual) + Cardano Stake
  - **Performance**: Curva de Patrimônio + Benchmark + Heatmap + Drawdown + Análise por Ativo + P&L/ROI + DCA Tracking + **Evolução Patrimonial** (nova)
  - **DeFi & Mercado**: Composição DeFi + Fear & Greed + Taxas & Yield + Gas Fees + Métricas
- **Duplicata "Sentimento de Mercado" removida** — havia dois blocos (linhas ~848 e ~912); removido o antigo (SVG path), mantido o com `<canvas id="fg-gauge">`

#### `portfolio_analytics.html` — Gráfico Evolução Patrimonial (novo)
- Seção adicionada ao final do tab Performance
- **4 KPI chips**: Atual · Pico Histórico · Total Investido · ROI Total
- **Area chart** com gradiente dourado (patrimônio) + linha tracejada cinza (capital aportado) — 51 pontos mensais 01/22→03/26
- **Toggle USD/BRL** — converte usando `window._brlRate` já buscado pelo dashboard
- **Tooltip**: valor + P&L do ponto ao hover
- **Botão "Relatório PDF"** linka para `relatorio.html`
- Função: `buildWealthEvolution()`, variável: `wealthCurrency`, chamada em `buildStaticCharts()`

#### `index.html` — Logo corrigido
- SVG `viewBox` era `220x30` — texto "BAROLO CAPITAL" com letter-spacing 5 precisava de ~260px → cortava o "L" final
- Corrigido para `viewBox="0 0 260 30"` e `width="195"`

#### `pools.html` — Registro Histórico completo (27 pools)
- Array `POOLS` expandido de **16 para 27 entradas** com todos os dados do diário
- **11 pools novas adicionadas:**
  - 2025: XAI/WETH 0.3% Ethereum (Jan/2025)
  - 2024: MSTR/ETH 1% Oct/2024 · RDNT/ETH 0.3% ×2 (Mai e Jun-Jul/2024) · PENG/SOL 2% Solana (Mar/2024) · RDNT/ETH 0.3% Feb/2024 · ARB/USDT 0.3% Dec23-Feb24 · RDNT/ETH 0.3% Jan/2024
  - 2023: MATIC/USDC 0.05% Polygon · ETH/USDC 0.05% ZkSync · RDNT/ETH 0.3% Dez/2023
- **Campo `obs` adicionado** a todas as entradas — notas do diário por pool
- **`buildPoolTable()` atualizado** — linhas com `obs` mostram `▸` clicável que expande sub-linha com notas do diário (toggle show/hide)

#### `relatorio.html` — Página nova de relatório PDF
- Arquivo novo criado do zero
- **Seções**: Resumo Executivo (5 KPIs) · Carteira de Ativos (tabela completa) · Posições DeFi (AAVE + Kamino) · Pools (resumo) · Gráfico Evolução · Retorno Anual · Retornos Mensais 2024/2025/2026 · Observações · Disclaimer
- **Botão "Exportar PDF"** → `window.print()` com CSS `@media print` (A4, remove nav/botões)
- Toggle tema dark/light
- Link "← Dashboard" para voltar ao portfolio_analytics

#### `.claude/commands/salvar.md` — Comando `/salvar`
- Criado em `.claude/commands/salvar.md` no projeto e em `~/.claude/commands/salvar.md`
- Quando funcionar após restart do Claude Code, `/salvar` atualiza o CLAUDE.md automaticamente

### Dados atualizados
Nenhum dado novo nesta sessão — todas as alterações foram de estrutura/UI.

### Bugs corrigidos
| Bug | Causa | Fix |
|-----|-------|-----|
| Logo "BAROLO CAPITA" sem L | SVG `viewBox="0 0 220 30"` muito estreito para o texto com letter-spacing 5 | `viewBox="0 0 260 30"` + `width="195"` |
| Duplicate "Sentimento de Mercado" | Dois blocos HTML com os mesmos IDs (`fg-value`, `fg-label`, etc.) | Removido o bloco antigo (SVG path), mantido o com `<canvas id="fg-gauge">` |

### O que ainda falta
- **`emprestimos.html`** — não revisado; posições AAVE/Kamino desatualizadas
- **Sincronizar gráficos pools.html** — `pnlLabels`, `pnlNet`, `pnlFees`, `buildRanking()` hardcoded com 12 pools antigas; array POOLS agora tem 27
- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026
- **`monthlyReturns[2026].Abr`** — preencher após fim do mês
- **APYs hardcoded** no exec bar — atualizar quando taxas AAVE/Kamino mudarem
- **`/salvar` command** — ~~requer restart~~ **CONFIRMADO FUNCIONANDO** (testado em 08/04/2026 tarde)
- **`ferramentas.html`** — não revisada

---

## Sessão 08/04/2026 (continuação tarde) — Gráficos pools dinâmicos, LP metrics corrigidas, bug zeragem AAVE/Kamino

Esta sessão continuou de onde a anterior parou (contexto esgotado). Primeiro bloco foi retomado do summary.

### Implementado

#### `pools.html` — Gráficos sincronizados com array POOLS (27 entradas)

Todos os arrays hardcoded de gráficos foram substituídos por código dinâmico derivado do `POOLS` global.

**Variáveis globais no script principal (linhas ~1794-1815):**
Substituídas 9 linhas de arrays estáticos por código dinâmico:
```js
var _netColors = { Arbitrum:'#5882d2', Solana:'#14F195', Ethereum:'#E8773D', Base:'#4fa8ff', Polygon:'#A855F7', ZkSync:'#8080ff' };
var _poolLabel = function(p) { ... };   // gera label "PAR/TOKEN\nRED AA" a partir de p.pair e p.open
var _chron = POOLS.slice().sort(...)    // ordena cronológico
var pnlLabels, pnlNet, pnlFees, pnlIL  // derivados de _chron
var _withFees = POOLS.filter(p=>p.fees>0).sort(fcr desc)
var aprLabels, aprData                  // derivados de _withFees
var _grp = {}; POOLS.forEach(...)      // agrupa por rede
var netLabels, netPools, netFees        // derivados de _grp
```

**Funções corrigidas (arrays internos substituídos):**

| Função | Array antigo | Substituído por |
|--------|-------------|-----------------|
| `buildRanking()` | `pools_r` — 10 entradas hardcoded | `POOLS.map(p => { label, fcr, net, color })` |
| `buildWaterfallAdv()` | `pools_w` — 11 entradas hardcoded | `POOLS.filter(fees>0\|\|il>0).sort(...).map(...)` |
| `buildFCR()` | `pools_fcr` — 12 entradas hardcoded (com days manual) | `POOLS.map(p => ({...p.fcr})).sort(fcr desc)` |
| `buildWaterfall()` | `pools_w` — 12 entradas hardcoded | Mesmo filtro/sort dinâmico |
| `buildNetRanking()` | `pools_net` — 12 entradas hardcoded + notes manuais | `POOLS.map(p => { label, net, note })` com notas derivadas da lógica (IL severo / Scam / Best trade / Ativa) |

**Bug de split corrigido:** `buildApr` usava `l.split('\\n')` (literal backslash-n) mas os labels gerados dinamicamente usam `'\n'` real. Corrigido para `l.split('\n')`.

#### `pools.html` — LP Metrics: PnL, Total APR, Fee APR, Uncollected Fees, Fees Diárias

**HTML:**
- Label "FEES N. COLET." → "UNCOLLECTED FEES"
- Sub-label de fees ganhou `id="lp-daily-fees"` (antes era hardcoded `~$0.52/dia`)

**JS — `REFS` init:** adicionado campo `dailyFees:'—'` nos 3 objetos (usd/eth/hold)

**JS — `setRef()`:** adicionada linha `s('lp-daily-fees', r.dailyFees||'—');`

**JS — `fetchUniswapLP()` — fórmula do PnL corrigida:**
- Antes: `const pnl = totalPooled - CAPITAL` → mostrava $1 (errado)
- Depois: `const pnl = totalPooled + totalFees - CAPITAL` → inclui fees não coletadas → correto (~$63 como Revert mostra)
- Adicionado `totalApr` = PnL anualizado (era fee APR antes)
- Adicionado `feeAprPct` = fee APR no sub-label do APR
- Adicionado `dailyFeeStr` = `~$X.XX/dia` calculado como `totalFees / DAYS`
- REFS.usd agora inclui `dailyFees`

**Fallback (catch):** atualizado para incluir `dailyFees` e calcular `totalAprFallback` corretamente.

#### `pools.html` — Fix: AAVE zerando após refresh

**Causa:** `fetchAave()` em `runAll()` chama `ethCall()`. Quando o RPC retorna `"0x"` (vazio) por rate-limit ou falha silenciosa, `BigInt('0x')` = 0, `collateral = 0`, e a UI era sobrescrita com zeros.

**Fix:** sanity check adicionado após parse:
```js
if (collateral < 100) {
  console.warn('[AAVE] Sanity: collateral < $100, descartando update');
  return null;
}
```

#### `emprestimos.html` — Fix: AAVE e Kamino zerando após refresh

**Causa:** mesma raiz — RPC/API retornando resposta vazia → parse retorna 0 → UI zerada.

**Fix:** sanity checks adicionados em dois lugares:
- `fetchAave()` (linha ~1444): `if (collateral < 100) return null`
- `fetchKamino()` (linha ~1516): `if (totalDeposit < 100) return null`

Agora se qualquer chamada retornar dado suspeito, a UI mantém os valores anteriores corretos.

### Dados atualizados
Nenhum dado numérico novo. Apenas lógica de cálculo e derivação dos gráficos.

### Bugs corrigidos

| Bug | Causa raiz | Fix aplicado |
|-----|-----------|--------------|
| PnL LP mostrando $1 (correto: $63.54) | `pnl = totalPooled - CAPITAL` não incluía uncollected fees | `pnl = totalPooled + totalFees - CAPITAL` |
| APR mostrando "21d aberto" | Campo `feeApr` (sub-label) recebia dias em vez de APR de fees | Separado em `apr` (total APR) e `feeApr` (fee APR %) |
| Fees diárias hardcoded `~$0.52/dia` | String estática no HTML | ID `lp-daily-fees` + cálculo dinâmico `totalFees/DAYS` |
| Gráficos pools.html mostrando só 12 pools | Arrays `pnlLabels`, `pools_r`, `pools_fcr`, etc. todos hardcoded com ~12 pools antigas | Derivados dinamicamente de `POOLS` (27 entradas) |
| `buildApr` labels não quebravam linha | `l.split('\\n')` (literal backslash) mas labels tinham `'\n'` real | Corrigido para `l.split('\n')` |
| AAVE/Kamino zerando após 5 min | RPC/API retornando `"0x"` silenciosamente → parse dá 0 → UI sobrescrita | Sanity check `if (collateral < 100) return null` |

### O que ainda falta
- **Mobile do site (PRIORITÁRIO — para 09/04/2026):** Gráficos saem do quadro no mobile. Navegação Home/Portfolio/Pools não funciona direito no mobile. Afeta todas as páginas com Chart.js.
- **`emprestimos.html`** — posições AAVE e Kamino podem estar desatualizadas (dados hardcoded no HTML, live fetch corrige mas HTML inicial pode divergir)
- **APYs hardcoded no exec bar** — Juros/Mês e Yield DeFi/Mês usam taxas fixas (AAVE 3.28%, Kamino 3.18%)
- **`wealthCurve` Abr/2026** — adicionar ponto mensal após 30/04/2026
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ferramentas.html`** — não revisada em nenhuma sessão

---

## Sessão 09/04/2026 — Bug zeragem AAVE fortalecido + dados empréstimos atualizados + APYs ao vivo

### Implementado

#### `emprestimos.html` — Sanity check reforçado no `fetchAave()` (bug zeragem)

O sanity check anterior (`collateral < 100`) era insuficiente. Identificado caso onde o contrato AAVE retorna `totalCollateralBase > 100` mas `totalDebtBase = 0` (quando o RPC retorna bloco vazio ou dado inconsistente). Nesse caso, o healthFactor retornado é `type(uint256).max ≈ 1.16e77`, e o borrow display era sobrescrito com `$0.00`.

**4 novos checks adicionados** (linhas ~1499–1506):
```js
if (!isFinite(collateral) || !isFinite(debt) || !isFinite(hf))  → return null
if (collateral < 100)                                            → return null  (já existia)
if (hf > 1e15)   // captura debt=0 → HF = uint256.max           → return null
if (liqThresh < 0.5 || liqThresh > 1) // evita borrowPwr=∞      → return null
```

#### `emprestimos.html` — Valores estáticos (HTML fallback) atualizados

| Campo | Antes | Depois |
|---|---|---|
| AAVE WETH qty | 1.87 ETH | 1.88 WETH |
| AAVE USDT qty | 1,652.90 | 1,650 |
| AAVE borrow token | USDC | **GHO** (label corrigido) |
| AAVE borrow qty | 746.99 | 747.50 |
| AAVE borrow APY | 3.28% | 3.84% |
| AAVE supply APY | 1.78% (blended) | WETH 1.25% · USDT 1.87% (separados) |
| Kamino SOL qty | 19.33 | 19.37 |
| Kamino USDS qty | 300.42 | 300.55 |
| Kamino borrow | $804.22 | $805.70 |
| Kamino borrow APY | 3.18% | 4.09% |
| Kamino supply APY | 6.0% SOL | SOL 3.19% · USDS 3.69% (separados) |
| KPI dívida total | $1,551 | $1,553 |
| Ciclo A3 colateral | +1.87 ETH + 1652 USDT | +1.88 WETH + 1650 USDT |
| Estratégia AAVE text | USDT $1,652 | USDT $1,650 |

#### `emprestimos.html` — Auto-fetch de quantidades de token (aTokens)

Adicionadas constantes no IIFE `initLiveFetch`:
```js
const AWETH_TOKEN  = '0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8';  // aWETH
const AUSDT_TOKEN  = '0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a';  // aUSDT
const VDEBT_GHO    = '0x786dBff3f1292ae8F92ea68Cf93c30b34B1ed04B';  // variableDebtGHO
const AAVE_DATA_PROVIDER = '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3';
const WETH_ADDR    = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const USDT_ADDR    = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const GHO_ADDR     = '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2d';
```

**Função `fetchAaveApys()`** adicionada — chama `getReserveData(address)` (selector `0x35ea6a75`) no ProtocolDataProvider para cada ativo:
- offset 5 = `liquidityRate` (supply APY em RAY 10^27)
- offset 6 = `variableBorrowRate` (borrow APY em RAY)
- Faz 3 chamadas em `Promise.all` (WETH, USDT, GHO)

**`fetchAave()` refatorado** — busca em paralelo via `Promise.all`:
1. `getUserAccountData` → collateral, debt, liqThresh, HF
2. `aWETH.balanceOf(wallet)` → ethQty dinâmico (18 decimais)
3. `aUSDT.balanceOf(wallet)` → usdtQty dinâmico (6 decimais)
4. `variableDebtGHO.balanceOf(wallet)` → ghoQty dinâmico (18 decimais)
5. `fetchAaveApys()` → APYs ao vivo

Cada chamada individual tem `.catch(() => null)` → fallback para valores hardcoded se qualquer chamada falhar.

**Novos IDs adicionados no HTML:**
- `em-aave-weth-qty` — quantidade WETH dinâmica
- `em-aave-usdt-qty` — quantidade USDT dinâmica
- `em-aave-weth-apy` — APY supply WETH dinâmico
- `em-aave-usdt-apy` — APY supply USDT dinâmico
- `em-aave-borrow-token` — label token borrow (GHO)
- `em-kamino-sol-apy` — APY supply SOL dinâmico
- `em-kamino-usds-apy` — APY supply USDS dinâmico

#### `emprestimos.html` — APY Kamino extraído da API

Em `fetchKamino()`, os objetos de `deposits` e `borrows` da API Kamino agora são lidos para extrair APY:
```js
// deposits[].supplyInterestAPY ou .apy ou .supplyApy (decimal)
// borrows[].borrowInterestAPY ou .apy ou .borrowApy (decimal)
```
Fallbacks: SOL 3.19%, USDS 3.69%, borrow 4.09% (valores fornecidos pelo usuário).

Também atualizado:
- `window._liveKaminoDebt || 804.22` → `805.70`
- `window._liveAaveDebt || 746.99` → `747.50`

### Dados atualizados

Posições reais fornecidas por Lucas em 09/04/2026:

**AAVE V4:**
- Supply: 1.88 WETH (APY 1.25%) + 1,650 USDT (APY 1.87%)
- Borrow: 747.50 GHO @ APY 3.84%

**Kamino Finance:**
- Supply: 19.37 SOL (APY 3.19%) + 300.55 USDS (APY 3.69%)
- Borrow: 805.70 USDC @ APY 4.09%

### Bugs corrigidos

| Bug | Causa raiz | Fix aplicado |
|-----|-----------|--------------|
| AAVE V4 zerava após page load | `fetchAave()` recebia resposta do RPC com `debt=0` mas `collateral>100`; AAVE retorna `HF=uint256.max≈1.16e77` nesses casos. `hf>1e15` não era verificado. | 4 sanity checks: `!isFinite(collateral/debt/hf)`, `collateral<100`, **`hf>1e15`** (novo — captura debt=0), `liqThresh fora de [0.5,1]` |
| Borrow token label errado | HTML mostrava "USDC" mas a dívida atual é GHO | Label trocado para `<span id="em-aave-borrow-token">GHO</span>` |

### O que ainda falta

- **Mobile do site** — adiado por decisão do usuário em 09/04/2026 (baixa prioridade)
- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **APYs hardcoded no exec bar** (`portfolio_analytics.html`) — `Juros/Mês` e `Yield DeFi/Mês` ainda usam taxas fixas. Os APYs da página `emprestimos.html` já são ao vivo, mas o exec bar não foi atualizado.
- **`ferramentas.html`** — não revisada em nenhuma sessão

---

## Sessão 09/04/2026 (continuação) — APYs live no exec bar, seção Contact no index, ferramentas revisada

### Implementado

#### `portfolio_analytics.html` — APYs ao vivo no Executive Bar (exec bar)

**Bug corrigido:** `runAll` era chamado no IIFE `initWalletFetch` mas nunca foi definido como função. Isso causava erro silencioso → `fetchAave()` e `fetchKamino()` **nunca rodavam** nesta página. O exec bar sempre usava valores estáticos.

**Fix: `runAll` criado como `async function`:**
```js
async function runAll() {
  await Promise.all([
    fetchAave(ep), fetchAaveApys(), fetchKamino(),
    fetchUniswapLP(), fetchSolBalance(), fetchSolTokens()
  ]);
  // Re-render exec bar com APYs ao vivo
  const ok = await fetchPrices();
  if (ok) renderUI(buildEnriched());
}
```

**Constantes adicionadas** (seção Contracts no IIFE):
```js
const AAVE_DATA_PROVIDER = '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3';
const GHO_ADDR = '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2d';
```
(USDT_ADDR e WETH_ADDR já existiam)

**`fetchAaveApys()` adicionada** — chama `getReserveData(address)` (selector `0x35ea6a75`) no ProtocolDataProvider:
- USDT: offset 5 = liquidityRate (supply APY em RAY) → `window._liveAaveUsdtApy`
- GHO: offset 6 = variableBorrowRate → `window._liveAaveBorrowApy`

**`fetchKamino()` atualizado** — extrai APYs do JSON já buscado da Kamino API:
- `deposits[].supplyInterestAPY` → `window._liveKaminoSolApy` e `window._liveKaminoUsdsApy`
- `borrows[].borrowInterestAPY` → `window._liveKaminoBorrowApy`
- Mints identificados: SOL `So111...`, USDS `USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA`

**Exec bar em `renderUI()` (linhas ~1274–1283) atualizado:**
```js
const aaveBorrowApy  = window._liveAaveBorrowApy  || 3.84;
const kaminoBorrowApy= window._liveKaminoBorrowApy || 4.09;
const aaveUsdtApy    = window._liveAaveUsdtApy    || 1.87;
const kaminoSolApy   = window._liveKaminoSolApy   || 3.19;
const kaminoUsdsApy  = window._liveKaminoUsdsApy  || 3.69;
const monthlyInterest = (aaveDebt*(aaveBorrowApy/100) + kaminoDebt*(kaminoBorrowApy/100)) / 12;
const aaveSupplyYield = usdtSupplied * (aaveUsdtApy/100) / 12;
const kaminoSolYield  = (solSupplied*liveSol) * (kaminoSolApy/100) / 12;
const kaminoStableYield = pyusdSupplied * (kaminoUsdsApy/100) / 12;
```

**Subtitle do exec bar** atualizado dinamicamente:
```js
set('ev-interest-sub', 'AAVE ' + aaveBorrowApy.toFixed(2) + '% · Kamino ' + kaminoBorrowApy.toFixed(2) + '%');
```

**Fallback estático do subtitle** atualizado de `AAVE 3.28% · Kamino 3.18%` → `AAVE 3.84% · Kamino 4.09%`

**Variáveis estáticas atualizadas:**
- `AAVE_DEBT`: 746.99 → 747.50
- `KAMINO_DEBT`: 804.22 → 805.70
- `TOTAL_DEBT` comentário: $1,551.21 → $1,553.20
- Fallback `window._liveKaminoDebt || 804.22` → 805.70 (ambas as ocorrências)

#### `index.html` — Seção Contact (04)

- **Nav link adicionado**: `<a href="#contato">Contact</a>` (EN) / `Contato` (PT)
- **Seção HTML adicionada** após Portfolio (`#portfolio`), antes do `<script>`:
  ```html
  <section id="contato">
    <div class="section-num">04</div>
    ...
    <a href="mailto:contato@barolocapital.com.br" class="contact-email">contato@barolocapital.com.br</a>
  </section>
  ```
- **CSS adicionado**: `.contact-block`, `.contact-email` — email estilizado com borda gold, ícone ✉, hover fill dourado
- **i18n strings adicionadas** em EN e PT:
  - `nav-contact`, `contact-tag`, `contact-title`, `contact-desc`

#### `ferramentas.html` — Revisão e atualização de dados

Todos os valores hardcoded estavam desatualizados. Corrigido:

**HTML — Calculadora de Liquidação:**
| Campo | Antes | Depois |
|---|---|---|
| Título | "Aave V3" | "Aave V4" |
| ETH colateral | 1.87 | 1.88 |
| USDT colateral | 1651.3030 | 1650.00 |
| Label dívida AAVE | "Dívida USDC" | "Dívida GHO" |
| Dívida AAVE | 745.80 | 747.50 |
| SOL colateral | 19.28 | 19.37 |
| Label colateral Kamino | "PYUSD colateral" | "USDS colateral" |
| USDS colateral | 90 | 300.55 |
| Dívida Kamino | 802.76 | 805.70 |

**JS — BASE (simulador de cenários):**
| Campo | Antes | Depois |
|---|---|---|
| solQty | 19.28+0.13059 | 19.37+0.13059 |
| aaveDebt | 745.80 | 747.50 |
| aaveUSDT | 1651.30 | 1650.00 |
| aaveETH | 1.87 | 1.88 |
| kamDebt | 802.76 | 805.70 |
| kamPYUSD | 90 | 300.55 |
| kamSOL | 19.3 | 19.37 |

**JS — `checkAlerts()` (hardcoded):**
- `1.87*ethPrice+1651.30` → `1.88*ethPrice+1650.00`
- `(ethCol*0.86)/745.80` → `/747.50`
- `19.3*solPrice+90` → `19.37*solPrice+300.55`
- `802.76/kamCol` → `805.70/kamCol`

Preços ETH e SOL já eram ao vivo via CoinGecko — sem mudança.

### Dados atualizados
Posições confirmadas em 09/04/2026 (mesmos da sessão anterior, propagados para ferramentas.html e portfolio_analytics.html):
- AAVE: 1.88 WETH + 1,650 USDT → borrow 747.50 GHO @ 3.84%
- Kamino: 19.37 SOL + 300.55 USDS → borrow 805.70 USDC @ 4.09%

### Bugs corrigidos

| Bug | Causa raiz | Fix aplicado |
|-----|-----------|--------------|
| APYs hardcoded no exec bar (AAVE 3.28%, Kamino 3.18%) | Taxa desatualizada hardcoded no `renderUI()` | APYs agora lidos de `window._liveAave/KaminoBorrowApy` com fallbacks atualizados |
| `fetchAave`/`fetchKamino` nunca rodavam em `portfolio_analytics.html` | `runAll` referenciada no IIFE mas nunca definida como função → TypeError silencioso | `async function runAll()` criada corretamente no IIFE |
| Dados desatualizados em `ferramentas.html` | Página nunca revisada; posições antigas (PYUSD $90, USDC borrow) | Todos os inputs, BASE e checkAlerts atualizados |

### Workflow de atualização (confirmado com Lucas)

Lucas registra compras/vendas no CoinGecko → tira print das transações → salva na pasta:
```
C:\Users\barol\OneDrive\Documentos\barolo-site\DIARIO DEFI E PRINTS\
```
Avisa no chat → Claude lê o print e atualiza os valores no site.

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês (Lucas avisa com print)
- **Mobile do site** — adiado por decisão do usuário; não usar no mobile
- **ferramentas.html revisada** ✅ FEITO nessa sessão

---

## Sessão 09/04/2026 (4ª parte) — Retorno ao vivo no index, quantidades removidas, tradução ferramentas.html

### Implementado

#### `index.html` — Retorno total ao vivo no hero stat

O stat `+654%` que estava hardcoded agora é calculado dinamicamente a cada carregamento de página (e atualizado a cada 60s junto com o ticker).

**Como funciona:**
- O ticker já buscava BTC/ETH/SOL/ADA do CoinGecko. A lista de IDs foi expandida para incluir todos os tokens do portfólio: `eigenlayer`, `radiant-capital`, `matic-network`, `zksync`, `xai-blockchain`, `zetachain`
- Um array interno `HOLDINGS` define quantidades e valores investidos por token (não exibido na página)
- Após o fetch, `updateHeroReturn(prices)` calcula:
  ```
  spotVal  = soma(qty × price) para todos os holdings com preço disponível
  netWorth = spotVal + STABLES_USD + LP_POOLED - TOTAL_DEBT
  roi      = (netWorth - TOTAL_INVESTED) / TOTAL_INVESTED × 100
  ```
- Constantes usadas: `TOTAL_INVESTED = $7.520,06`, `STABLES_USD = $1.950,55`, `LP_POOLED = $365`, `TOTAL_DEBT = $1.553,20`
- Elemento `<div id="heroReturn">` atualizado com `+XX%`

**Quando atualizar:** Se Lucas comprar mais tokens, atualizar o array `HOLDINGS` em `index.html` (array interno no bloco `initTicker`). Se STABLES ou DEBT mudarem, atualizar as constantes no mesmo bloco.

#### `index.html` — Quantidades de tokens removidas do token grid

Todos os cards de tokens exibiam a quantidade (ex: `ETH · 2.08`). Removidas as quantidades — agora mostram apenas o símbolo (`ETH`, `SOL`, `ADA`, etc.).

**Motivação:** Quantidades ficam desatualizadas a cada compra e não devem ser expostas na landing page pública.

#### `ferramentas.html` — Toggle PT/EN implementado completamente

O botão `PT/EN` existia mas `LANG_STRINGS` só tinha 5 chaves de nav — o resto da página não mudava.

**Solução:** Adicionado `data-i18n` a todos os elementos traduzíveis e expandido `LANG_STRINGS` com ~60 chaves cobrindo:

| Seção | O que foi traduzido |
|-------|---------------------|
| Header | Título da página + subtítulo |
| Tabs | Todos os 7 tabs (Crenças→Beliefs, Liquidação→Liquidation, etc.) |
| Liquidação — AAVE | Labels dos 6 inputs + barra de saúde + simulação de preço |
| Liquidação — Kamino | Labels dos 6 inputs + barra de saúde + simulação de preço |
| Liquidação — Uniswap | Labels dos 6 inputs |
| Cenários | Título, descrição, presets label, todos os 8 labels de resultado |
| Diário DeFi | Labels do form, botões, título do insight, histórico |
| Alertas | Nome e descrição de cada alerta (6), botões (3), título do log |
| Evolução | Título da seção, charts, histórico |
| APY Scanner | Título da seção |

**`applyLang()` ajustada:** Usa `innerHTML` para `page-title` (que tem `<span>` colorido interno) e `textContent` para o resto.

### Dados atualizados
Nenhum dado numérico novo nesta sessão.

### Bugs corrigidos
Nenhum bug nesta sessão — apenas melhorias.

### O que ainda falta
- **`wealthCurve` Abr/2026** — após 30/04/2026, Lucas manda print
- **`monthlyReturns[2026].Abr`** — após fim do mês
- **`HOLDINGS` em `index.html`** — atualizar array quando Lucas comprar mais tokens

---

## Deploy — GitHub Pages

Repositório: `https://github.com/lbarolo/barolo-capital-site`
Site publicado: `https://lbarolo.github.io/barolo-capital-site/`

Comando para subir alterações (rodar na pasta do site):
```bash
git push https://lbarolo:TOKEN@github.com/lbarolo/barolo-capital-site.git main
```

Claude pode rodar esse comando diretamente quando solicitado. Após o push, o site atualiza em ~1-2 minutos.

---

## Como testar localmente

**Python NÃO está no PATH no Windows — usar Node.js:**

```bash
# Iniciar servidor local com Node (rodar no início de cada sessão)
node -e "
const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {
  let file = path.join(process.cwd(), req.url === '/' ? '/index.html' : req.url);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(file);
    const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css'}[ext] || 'text/plain';
    res.writeHead(200, {'Content-Type': mime});
    res.end(data);
  });
});
server.listen(8080, () => console.log('Servidor rodando em http://localhost:8080'));
" &
```

Depois abrir no browser:
- http://localhost:8080/pools.html
- http://localhost:8080/portfolio_analytics.html
- http://localhost:8080/emprestimos.html

Abrir F12 → Console para ver erros JS.

> **Nota para Claude:** Rodar o comando acima no início de cada sessão (em background) antes de testar qualquer página. Verificar com `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/pools.html` se retorna 200.

---

## Comandos úteis no Claude Code

```
# Ver erros no console de um arquivo
"abre o pools.html no browser e me diz os erros do console"

# Editar e testar
"corrige o buildRanking em pools.html, o gráfico não está carregando"

# Commit após resolver
"commita as mudanças com mensagem 'fix: graficos pools'"
```

---

## Sessão 10/04/2026 — GRIFT il corrigido + AAVE refinanciado GHO→USDC

### Contexto
Sessão continuou de context esgotado da sessão anterior. Havia uma tarefa pendente (corrigir il do GRIFT) e Lucas fez uma nova operação de refinanciamento no AAVE (trocou GHO → USDC como token de borrow).

### Implementado / Corrigido

#### `relatorio.html` — GRIFT il corrigido
- Campo `il` do GRIFT na `POOLS_DATA` array: `500` → `2899`
- **Por quê:** O valor `il:500` violava o invariante `result = fees - il`. Com `fees=1389` e `result=-1510`, o correto é `il = 1389 - (-1510) = 2899`.
- **Contexto:** IL alto porque GRIFT token foi a zero. Lucas vendeu o GRIFT por ~$100. SOL foi recuperado via Kamino (portfolio tem 20 SOL hoje — não foi desastroso operacionalmente).
- **`pnlOrigin.totalIL` em `portfolio_analytics.html` NÃO foi alterado** (mantém -2143): usa metodologia diferente (IL tradicional vs HODL: GRIFT $1,850 + PEANUT $243), que é uma métrica distinta e mais conservadora.
- Commit: `a75b44f`

#### `emprestimos.html` — Borrow GHO → USDC (refinanciamento 10/04/2026)
Lucas fez: swap GHO→USDC, repagou com USDT disponível, tomou novo borrow de $748 USDC @ 2.32% a.a.

**JS — endereços e variáveis atualizados:**
| Antes | Depois |
|---|---|
| `VDEBT_GHO = '0x786dBff3f1292ae8F92ea68Cf93c30b34B1ed04B'` | `VDEBT_USDC = '0x72E95b8931767C79bA4EeE721354d6E99a61D004'` |
| `GHO_ADDR = '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2d'` | `USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'` |
| `[weth, usdt, gho] = await Promise.all([..., rateOf(GHO_ADDR)])` | `[weth, usdt, usdc] = await Promise.all([..., rateOf(USDC_ADDR)])` |
| `ghoRaw, ghoQty, ghoApy` | `usdcRaw, usdcQty, usdcApy` |
| APY fallback `3.84` | APY fallback `2.32` |

**JS — fetch callback adicionado:**
```js
set('em-aave-borrow-token', 'USDC'); // força label ao vivo
```

**HTML fallback atualizado:**
- Token label: "GHO" → "USDC"
- APY inicial: "3.84%" → "2.32%"
- Quantidade: "747.50" → "748.00"

**Timeline — nova entrada:**
```js
{date:'10/04/26', proto:'AAVE', a:'repay', amt:'≈$748',
 det:'GHO→USDC refinanciamento: swap GHO→USDC, repago com USDT disponível, reborrow $748 USDC @ 2.32% a.a.'}
```

**Ciclo A3 badge:** `"● ABERTO · $747"` → `"● ABERTO · $748 USDC"`

#### `pools.html` — Taxa borrow AAVE atualizada
- HTML: `−3.28%` → `−2.32%` no card "CUSTO BORROW AAVE"
- JS: `const AAVE_BORROW_RATE = 3.28` → `2.32` (afeta cálculo de APR Líquido da pool WETH/USDC)
- Commit: `14071f1`

### Dados atualizados

**AAVE após refinanciamento (10/04/2026):**
| Campo | Antes | Depois |
|---|---|---|
| Token borrow | GHO | **USDC** |
| Qty borrow | 747.50 | 748.00 |
| APY borrow | 3.84% | **2.32%** |
| Supply | 1.88 WETH + 1,650 USDT | igual |

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| `emprestimos.html` mostrava "GHO" como token borrow | Token foi trocado para USDC mas código ainda usava endereço e label do GHO | Substituído `VDEBT_GHO`/`GHO_ADDR` por `VDEBT_USDC`/`USDC_ADDR`; label forçado via JS |
| APR Líquido em `pools.html` calculado com custo de 3.28% | `AAVE_BORROW_RATE` hardcoded com taxa antiga do GHO | Atualizado para 2.32% (taxa atual USDC) |
| `relatorio.html` GRIFT `il:500` matematicamente inconsistente | Valor antigo provavelmente estimado, não calculado | `il = fees - result = 1389 - (-1510) = 2899` |

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`HOLDINGS` em `index.html`** — atualizar array quando Lucas comprar mais tokens
- **`ferramentas.html` — valores AAVE** — ainda usa GHO como dívida nos inputs da calculadora de liquidação; precisa atualizar para USDC quando Lucas confirmar os valores exatos
- **Workflow prints:** Lucas coloca prints com nome descritivo na pasta `DIARIO DEFI E PRINTS\` (sem subpastas, sem estrutura especial — acordado em 10/04/2026)

---

## Sessão 09/04/2026 (3ª parte) — Logos de tokens corrigidos + domínio personalizado barolocapital.com.br

### Implementado

#### `index.html` — Logos quebradas corrigidas (5 tokens)

5 tokens no token grid e protocol grid estavam sem logo (exibidos em branco por `onerror="this.style.display='none'"`). Os URLs do CoinGecko CDN estavam com filename ou ID incorretos. Corrigido via consulta direta à CoinGecko API para cada coin ID:

| Token | URL antiga (quebrada) | URL nova (funcionando) |
|-------|----------------------|------------------------|
| EIGEN (EigenLayer) | `coins/images/33373/large/eigen.png` | `coins/images/37441/large/eigencloud.jpg` |
| RDNT (Radiant Capital) | `coins/images/26536/large/Radiant-Logo.png` | `coins/images/26536/large/Radiant-Logo-200x200.png` |
| ZK (ZKsync) | `coins/images/38043/large/zksync.jpg` | `coins/images/38043/large/ZKTokenBlack.png` |
| ZETA (ZetaChain) | `coins/images/26718/large/zetachain.png` | `coins/images/26718/large/Twitter_icon.png` |
| Kamino (protocol card) | `coins/images/36217/large/kmno_logo.png` | `coins/images/35801/large/Kamino_200x200.png` |

**Nota:** EIGEN foi rebranded para "EigenCloud (prev. EigenLayer)" no CoinGecko — o ID do coin mudou de 33373 para 37441. As outras 4 tinham ID correto mas filename desatualizado.

#### Domínio personalizado `barolocapital.com.br` — configuração GitHub Pages

**Problema:** O DNS de `barolocapital.com.br` já estava configurado corretamente:
- `barolocapital.com.br` → A records para IPs do GitHub Pages (185.199.108–111.153)
- `www.barolocapital.com.br` → CNAME para `lbarolo.github.io`

Porém o GitHub Pages não tinha o campo `cname` configurado (retornava `null` na API). O site servia 404 para o domínio personalizado porque o GitHub não sabia que `barolocapital.com.br` pertencia ao repositório `lbarolo/barolo-capital-site`.

**Fix:** Criado arquivo `CNAME` na raiz do repositório com o conteúdo:
```
barolocapital.com.br
```

Após o push, o GitHub Pages detecta automaticamente o arquivo CNAME, associa o domínio ao repositório e provisiona o certificado SSL (Let's Encrypt). O processo leva 5–30 minutos.

**Arquivos criados:**
- `C:/Users/barol/OneDrive/Documentos/barolo-site/CNAME`

### Deploy

Dois pushes realizados nesta sessão:
1. `25418d6` — logos corrigidas em index.html
2. `6fec19d` — arquivo CNAME adicionado

### Bugs corrigidos

| Bug | Causa raiz | Fix aplicado |
|-----|-----------|--------------|
| 5 tokens sem logo no index.html | URLs do CoinGecko CDN com filenames desatualizados ou ID de coin trocado (EIGEN rebranded) | Consultada API CoinGecko para cada coin e URLs atualizadas |
| `barolocapital.com.br` retornava 404 | GitHub Pages não tinha domínio personalizado configurado (`cname: null`) apesar do DNS estar correto | Arquivo `CNAME` criado na raiz do repo com `barolocapital.com.br` |

### O que ainda falta

- **SSL de `barolocapital.com.br`** — provisionamento automático pelo GitHub (Let's Encrypt), pode levar até 30 min após o push do CNAME. Se passado esse tempo ainda der 404 ou erro de certificado, verificar nas configurações do repositório GitHub → Pages → Custom domain.
- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês (Lucas avisa com print)
- **Mobile do site** — adiado por decisão do usuário

---

## Sessão 11/04/2026 — emprestimos redesign colateral + liquidação por token + acumulação de tokens no portfolio + papel de mentor estabelecido

### Implementado

#### `emprestimos.html` — Visualização de colateral redesenhada (AAVE V4 + Kamino)

**Problema:** seção "Supply" de cada protocolo mostrava tokens como texto pequeno sem hierarquia visual.

**Fix — Supply redesenhado para ambos os protocolos:**
- Cada token agora tem uma linha própria com: dot colorado (WETH #627EEA, USDT #26a17b, SOL #9945ff, USDS #2775ca), quantidade em fonte maior (13px), valor USD ao vivo, APY, e barra de proporção horizontal mostrando % do colateral total
- IDs adicionados: `em-aave-weth-bar`, `em-aave-usdt-bar`, `em-kamino-sol-bar`, `em-kamino-usds-bar` (barras de proporção)
- IDs já existentes mantidos: `em-aave-weth-qty`, `em-aave-eth-usd`, `em-aave-usdt-qty`, `em-aave-usdt-usd`, `em-kamino-sol-qty`, `em-kamino-sol-usd`, `em-kamino-usds-qty`, `em-kamino-usds-usd`

#### `emprestimos.html` — Painel de preço de liquidação por token (novo)

Novo painel inserido **entre a LTV bar e a seção Estratégia** em cada protocolo, com fundo levemente avermelhado `rgba(156,42,42,0.03)`.

**AAVE V4 — cálculo:**
- Fórmula: `liqETH = (borrow - usdt_qty × USDT_LT) / (weth_qty × WETH_LT)`
- Parâmetros: WETH_LT=82.5%, USDT_LT=77.5% (AAVE V4 aproximado)
- Com 1.88 WETH + 1,650 USDT e borrow $747.50 → resultado **NEGATIVO** → WETH não pode ser liquidado
- Display: `"Protegido"` em verde + nota `"USDT($1278) > dívida($748)"`
- USDT: exibe `"$1.00"` + `"Stablecoin — risco depeg"`
- IDs: `em-aave-liq-eth`, `em-aave-liq-eth-note`

**Kamino — cálculo:**
- Fórmula: `liqSOL = (borrow - usds_qty × USDS_LT) / (sol_qty × SOL_LT)`
- Parâmetros: SOL_LT=82%, USDS_LT=80% (Kamino aproximado)
- Resultado: ~$35.60 (alinhado com $35.77 exibido anteriormente)
- Display: preço + `"XX% queda do atual ($YY)"` com cor dinâmica (verde <50% queda, amarelo <70%, vermelho acima)
- USDS: recalcula se SOL cobre dívida → exibe `"Protegido"` ou preço de depeg
- IDs: `em-kamino-liq-sol`, `em-kamino-liq-sol-note`, `em-kamino-liq-usds`, `em-kamino-liq-usds-note`
- Também atualiza os IDs existentes `em-kamino-liq` e `em-kamino-liq2` na seção borrow

#### `emprestimos.html` — Funções JS novas

**`updateCollateralCards()`** — atualiza ao vivo:
- WETH USD value = `wethQty × liveEth`
- AAVE supply total recalculado
- AAVE net worth recalculado
- Barras de proporção WETH/USDT e SOL/USDS
- LTV AAVE e Kamino recalculados em tempo real
- LTV fill bar atualizada

**`updateLiqPrices()`** — calcula e exibe preços de liquidação ao vivo usando `liveEth` e `liveSol`

**`fetchPrices()`** — adicionadas chamadas a `updateCollateralCards()` e `updateLiqPrices()` após fetch bem-sucedido

**`DOMContentLoaded`** — adicionadas chamadas iniciais a `updateCollateralCards()` e `updateLiqPrices()` antes do fetch

#### `portfolio_analytics.html` — Seção "Acumulação de Tokens" (nova)

Nova seção adicionada no tab "DeFi & Mercado", **antes de "Taxas de Rede (Gas)"**, após "Taxas & Yield Recebidos".

**HTML:**
- 2 KPI cards lado a lado: ETH (azul #627EEA) e SOL (roxo #9945ff)
- Cada card: total em tokens (fonte 32px), valor USD ao preço atual, breakdown por fonte com barras proporcionais
- Chart de linha cumulativa por mês com toggle ETH/SOL (botões `#accEthBtn`/`#accSolBtn`)
- Nota de rodapé: `"* Dados de pools extraídos do Diário DeFi · APY lending estimado por posição × período · Em tokens — não em USD"`
- IDs: `acc-eth-total`, `acc-eth-usd`, `acc-sol-total`, `acc-sol-usd`, `accChart`

**JS (bloco `<script>` separado ao final do arquivo):**

```js
const ACC_DATA = {
  eth: { pools: 0.0630, lending: 0.0140, staking: 0.0000 },
  sol: { pools: 2.070,  lending: 0.460,  staking: 0.000  }
};
```

Série `ACC_MONTHLY` com 19 pontos mensais (Out/24 → Abr/26), cumulativo por token.

Funções: `buildAccChart()`, `setAccToken(token, btn)`, `updateAccKpis()`

**Dados extraídos do diário para os totais:**

| Fonte | ETH | SOL |
|-------|-----|-----|
| Pools LP | 0.0630 ETH | 2.070 SOL |
| Lending APY | 0.0140 ETH | 0.460 SOL |
| Staking | 0 | 0 |
| **TOTAL** | **0.0770 ETH** | **2.530 SOL** |

Detalhamento ETH pools:
- MSTR/ETH 2024: ~0.054 ETH (fees convertidas a ETH ao longo dos trades)
- ETH/USDT Arbitrum Out/25→Jan/26: 0.005 ETH confirmado no diário
- BASE ETH/USDC + outras: ~0.004 ETH

Detalhamento SOL pools:
- SOL/GRIFT (Jan–Mar 2025): 2.07 SOL confirmados em extrações (0.659 + 0.142 + 0.46 + 0.81 SOL)
- SOL/USDC (Out–Dez/25) + SOL/USDT (Jan/26): ~0.27 SOL

**Para atualizar:** editar constantes `ACC_DATA` e array `ACC_MONTHLY` diretamente no script.

### Dados atualizados

Nenhum dado de posição ativo atualizado. Apenas derivação de dados históricos do diário.

### Bugs corrigidos

Nenhum bug novo. Melhorias de visualização e nova feature.

### Papel de mentor estabelecido (memória salva)

Lucas solicitou que Claude atue como **mentor multidisciplinar** em:
1. DeFi / Crypto (continuidade)
2. Economia (maior gap declarado)
3. Geopolítica (maior gap declarado)
4. Criptografia (base técnica)
5. Tecnofilosofia (impacto da tecnologia)

Salvo em `C:\Users\barol\.claude\projects\C--WINDOWS-system32\memory\feedback_mentor.md`

**Discussões desta sessão:**
- Bitcoin ainda age como ativo de risco correlacionado ao Nasdaq (confirmado empiricamente)
- Divergência emergente em Abr/2026 (tarifas Trump): dólar enfraqueceu + ouro ATH + BTC não despencou tanto — primeiro teste real da narrativa de reserva
- Dilema de Triffin: por que o dólar estruturalmente se enfraquece e por que cripto existe como resposta
- L2 tokens como armadilha de retail: tecnologia funciona, mas tokenomics nunca capturou valor para holders
- Filtro prático: "a receita vai para o token holder diretamente?" — HYPE/Hyperliquid passa, Scroll/Blast/StarkNet falham
- Leitura de dois posts do Vitalik (vitalik.eth.limo):
  - **Low-risk DeFi** (Set/2025): killer app do ETH = lending colateralizado + pools (exatamente o que Lucas faz)
  - **Balance of Power** (Dez/2025): framework Big Gov / Big Business / Big Mob; tecnologia destruiu os freios naturais

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ACC_DATA` e `ACC_MONTHLY`** — Lucas pode refinar os números de acumulação conforme for registrando yields mais precisos
- **Kamino liq price** — diferença de ~$0.17 vs valor anterior ($35.77 vs ~$35.60) explicada por arredondamento/juros acumulados; aceitável
- **`ferramentas.html` calculadora de liquidação** — ainda usa AAVE borrow como "GHO" nos inputs HTML; atualizar para USDC na próxima sessão que revisar ferramentas

---

## Sessão 11/04/2026 (continuação) — Mentoria: estratégia de yield, filosofia de acumulação, histórico CEX

### Implementado / Alterado

Nenhuma alteração técnica nesta parte da sessão. Sessão focada em mentoria e estratégia.

### Discussões de mentoria

#### WeSearch newsletter "A Ruptura Invisível" — perguntas para Dan

6 perguntas elaboradas para Lucas levar ao Dan Crypto (Danillo Uliana):
1. ETH deveria ser commodity pela taxonomia funcional? O staking muda isso?
2. ETFs de ETH com staking ficam em limbo regulatório?
3. HYPE/Hyperliquid passa no teste da taxonomia funcional ou vira derivativo não registrado?
4. Qual é o elo mais fraco na cascata de re-hipotecação (CeFi, DeFi, ou a ponte)?
5. MiCA vs UK vs Singapore — qual jurisdição um brasileiro sem offshore deve acompanhar?
6. **A mais importante:** qual seria a primeira evidência concreta de que a ruptura epistêmica é real?

**Respostas do mentor a cada pergunta:**
- ETH → provável commodity na prática, processo lento com linguagem ambígua
- ETFs staking → catalisador forte se aprovado; abre seguradoras/fundos de pensão que precisam de yield
- HYPE → zona cinza; burn ≠ dividendo (defesa), mas "esforço de outros" é o ponto de ataque da SEC
- Elo mais fraco → **a ponte** (WBTC, cbBTC, LSTs); indicadores: WBTC premium/discount, funding rates, stablecoin dominance
- Jurisdição para brasileiro → **EUA** para portfólio, **MiCA** para entender tendência futura
- Evidência da ruptura → banco tradicional usando smart contract em produção (não só comprando token); ou ETF com staking aprovado (pode ser 2026)

#### Filosofia de acumulação e bear market

- Bear = redistribuição de tokens de mãos fracas para mãos fortes
- Varejo tem vantagem sobre institucional no bear: institucional tem mandato/compliance, não consegue comprar quando está feio
- Distinção importante: **acumular tokens ≠ especular no preço**. Métricas em tokens, não em dólares.
- Tese da "invisibilidade": blockchain maduro é como TCP/IP — ninguém sabe que usa. A janela de assimetria existe porque a tecnologia ainda é visível e assusta.

#### Estratégia de yield — análise da estrutura de Lucas

3 camadas de yield com risco crescente confirmadas:
| Camada | Onde | Yield | Risco |
|--------|------|-------|-------|
| Lending passivo | AAVE + Kamino | 2-5% | Contrato + liquidação |
| Pools ativas | 5% do patrimônio | 20-80% | IL + contrato |
| Spot puro | Resto | 0% yield | Só exposição direcional |

**Estratégia de alavancagem produtiva descrita por Lucas:**
- Colateral na AAVE → pegar USD emprestado → comprar ETH → colocar em pool
- Pool paga o empréstimo com taxas em dólar; ETH das taxas acumulado
- Pool sai do range pra baixo → acumula mais ETH com USD (anti-cíclico automático)
- Pool sai do range pra cima → vende ETH acumulado + USD → paga dívida
- Fiat disponível como último recurso
- **Avaliação:** alavancagem defensiva, não agressiva. Estrutura força comportamento anti-cíclico por design.

**Risco identificado:** spread entre custo do empréstimo e yield da pool pode comprimir em bull (borrow APY sobe, volatilidade da pool cai). Monitorar essa diferença, não só o yield bruto.

**5% em pools:** conservador dado a queda do portfólio em dólar; Lucas pretende aumentar gradualmente. Calibração ideal: aumentar em lateralização, reduzir em bull acelerado.

#### Referências intelectuais de Lucas confirmadas

- **Luiz Barsi Filho** — dividendos; capital intocado, yield paga a vida → analogia direta com DeFi
- **Stormer** — trades e empresas
- **Howard Marks** — ciclos e risco assimétrico (framework correto para DeFi)
- **Charlie Munger** — qualidade e paciência; comprar bons ativos e não fazer nada
- **Objetivo:** yield pagar as contas sem tocar o capital; mesma lógica do aluguel na imobiliária

#### Histórico CEX — BRL→USD para custo de aquisição

**Contexto:** Lucas tem compras registradas no CoinGecko mas não tem registro das conversões BRL→USD nas CEX (Binance, Bybit, OKX).

**Decisão:** Lucas vai trazer CSVs das CEX na próxima semana. Objetivo:
- Calcular câmbio médio de entrada em BRL
- Fechar o custo de aquisição real em reais de tudo no portfólio
- Base para IR futuro (Receita Federal exige valores em BRL)
- Track record real para Barolo Capital como gestora

**Importante:** desconsiderar compras de tokens do CSV (já registradas no CoinGecko). Foco nas conversões fiat → USD.

**Para exportar:**
- Binance: Carteira → Histórico → Exportar
- Bybit: Ativos → Histórico de Ordens → Exportar
- OKX: similar

### Dados atualizados

Nenhum dado numérico do portfólio alterado.

### Bugs corrigidos

Nenhum.

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ACC_DATA` e `ACC_MONTHLY`** — refinar conforme Lucas registra yields mais precisos
- **`ferramentas.html`** — calculadora de liquidação ainda usa "GHO" nos inputs HTML (deve ser USDC)
- **CSVs das CEX** — Lucas traz na próxima semana para calcular custo de aquisição em BRL e base para IR
- **`HOLDINGS` em `index.html`** — atualizar array quando Lucas comprar mais tokens

---

## Sessão 14/04/2026 — APR BRUTO LP corrigido (fórmula e denominador) + workflow git estabelecido

### Implementado

#### `pools.html` — APR BRUTO LP: fórmula corrigida (dois bugs distintos)

**Bug 1 — APR BRUTO exibia PnL (fees + IL) em vez de só fees:**
- Antes: `lp-apr` recebia `fmtApr(apr)` onde `apr = pnl/hodlUsd/days*365*100` e `pnl = totalFees + il`
- Depois: `lp-apr` recebe `fmtApr(feeApr)` onde `feeApr = totalFees/ENTRY_CAPITAL/days*365*100`
- Label "APR BRUTO LP" e subtitle "fees / capital investido" agora são consistentes
- Subtitle passou a mostrar `"c/ IL: +X.X%"` (o APR total com IL incluso) como referência

**Bug 2 — Denominador marcado a mercado (hodlUsd) em vez do capital real:**
- Antes: denominador = `hodlUsd = d0 * eth_atual + d1` — revalorizava o WETH depositado ao preço atual do ETH
- Depois: denominador = `ENTRY_CAPITAL = 365` (capital real depositado em 18/03/2026)
- **Por quê importa:** se ETH subiu desde a abertura da posição, `hodlUsd` inflava o denominador e comprimia artificialmente o APR calculado vs o que o Revert Finance mostrava
- Constante `ENTRY_CAPITAL = 365` adicionada dentro do bloco The Graph (linha ~1192) com comentário explicativo

**APR LÍQUIDO** também corrigido: base passou de `apr` (com IL) para `feeApr` (só fees) antes de subtrair o `AAVE_BORROW_RATE = 2.32%`

**Código alterado (linhas ~1190–1220 de `pools.html`):**
```js
// ANTES
if (days>0 && hodlUsd>0) {
  apr    = pnl/hodlUsd/days*365*100;
  feeApr = totalFees/hodlUsd/days*365*100;
}
// ...
set('lp-apr', fmtApr(apr));                // mostrava pnl/hodlUsd
set('lp-apr-sub', 'só fees: +'+feeApr...); // feeApr era sub-info
const aprNet = apr - AAVE_BORROW_RATE;     // base errada

// DEPOIS
const ENTRY_CAPITAL = 365;
if (days>0 && ENTRY_CAPITAL>0) {
  apr    = pnl/ENTRY_CAPITAL/days*365*100;
  feeApr = totalFees/ENTRY_CAPITAL/days*365*100;
}
// ...
set('lp-apr', fmtApr(feeApr));             // só fees / capital real
set('lp-apr-sub', 'c/ IL: '+fmtApr(apr)); // PnL total como referência
const aprNet = feeApr - AAVE_BORROW_RATE;  // base correta
```

**Commit:** `af6a54f`

### Workflow git estabelecido

Lucas confirmou: **sempre fazer push direto na main**, sem Pull Request. Processo correto quando estiver num worktree:

```bash
# 1. Commit no worktree (branch claude/elegant-nightingale)
git add <arquivo> && git commit -m "..."

# 2. Mergear e push na main (do diretório principal)
cd "C:\Users\barol\OneDrive\Documentos\barolo-site"
git merge claude/elegant-nightingale
git push origin main
```

Salvo em memória: `C:\Users\barol\.claude\projects\C--Users-barol-OneDrive-Documentos-barolo-site\memory\feedback_git_push.md`

### Contexto técnico — Por que Revert mostra APR maior

O APR do Revert é prospectivo (volume das últimas 24h/7d extrapolado para o ano), enquanto o calculado no site é retrospectivo (fees reais desde abertura / capital inicial / dias). São métricas complementares:
- **Revert:** "o que essa pool pode gerar agora se o volume se mantiver"
- **Site:** "o que essa posição efetivamente gerou até hoje"

The Graph hosted service (`api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`) está depreciado — o bloco de fetch de fees históricas pode falhar silenciosamente. Quando falha, `feeApr` fica `null` e `lp-apr` mostra "—". O Bloco 2 (on-chain RPC) só conta fees ainda não coletadas, o que pode ser menor que o total real.

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ACC_DATA` e `ACC_MONTHLY`** — refinar conforme Lucas registra yields mais precisos
- **`ferramentas.html`** — calculadora de liquidação ainda usa "GHO" nos inputs HTML (deve ser USDC)
- **CSVs das CEX** — Lucas traz na próxima semana para custo de aquisição em BRL e base para IR
- **`HOLDINGS` em `index.html`** — atualizar array quando Lucas comprar mais tokens
- **The Graph endpoint** — considerar migrar para endpoint ativo (decentralized network requer API key) ou alternativa on-chain para fees históricas coletadas

---

## Sessão 15/04/2026 — iframe Uniswap substituído por GeckoTerminal + endpoint APR corrigido

### Implementado

#### `pools.html` — Painel Uniswap Explore: iframe → GeckoTerminal embed

**Problema:** O iframe de `app.uniswap.org/explore/pools` estava dando "connection refused" / ERR_CONNECTION_REFUSED. O servidor do Uniswap retorna `X-Frame-Options: SAMEORIGIN` e `Content-Security-Policy: frame-ancestors 'self' https://app.safe.global`, bloqueando embedding de qualquer domínio externo. O comportamento intermitente (às vezes funcionava, às vezes não) é explicado por inconsistência de edge servers na CDN do Uniswap — alguns nós mandam o header, outros não.

**Fix definitivo:** Substituído o iframe do Uniswap pelo embed do **GeckoTerminal**, que tem suporte explícito a iframe:
- URL: `https://www.geckoterminal.com/eth/pools?embed=1&info=0&swaps=0`
- Toolbar atualizada: título "UNISWAP V3", sub "via GeckoTerminal · Ethereum"
- Link "↗ Abrir GeckoTerminal" aponta para `geckoterminal.com/eth/pools`
- Fallback mantido (caso GeckoTerminal também bloqueie em algum ambiente)
- Botões "Expandir" e "Recarregar" mantidos

**IDs mantidos:** `uniswapWrap`, `uniswapLoading`, `uniswapFrame`, `uniswapFallback` — sem quebrar `initIframePanel`.

#### `pools.html` — APR BRUTO LP: endpoint The Graph substituído

**Problema:** O endpoint depreciado `api.thegraph.com/subgraphs/name/uniswap/uniswap-v3` falhava silenciosamente, deixando `feeApr = null` e o card APR BRUTO LP exibindo "—".

**Fix — bloco 8 de `fetchUniswapLPData()` reescrito:**

1. **Endpoint principal:** `https://interface.gateway.uniswap.org/v1/graphql` (gateway atual do Uniswap Labs, sem API key)
   - Headers: `Content-Type: application/json`, `origin: https://app.uniswap.org`, `x-request-source: uniswap-web`
   - Mesmo query GraphQL de antes: `position(id)` com `depositedToken*`, `withdrawnToken*`, `collectedFeesToken*`, `transaction.timestamp`

2. **Fallback on-chain:** se o gateway falhar, usa `uncFeeUsd` (fees não coletadas, já calculado no bloco 7 via RPC) com label `"parcial · só fees não coletadas"` no sub-label do card APR BRUTO

3. **Fallback total:** se nenhuma fonte tiver dados, sub-label exibe `"dados indisponíveis — subgraph offline"` (sem "—" silencioso)

4. **Log de diagnóstico:** `console.debug('[LP] subgraph OK via <url>')` indica qual endpoint funcionou

**Constantes adicionadas:**
```js
const ENTRY_CAPITAL = 365;      // capital real — já existia, movido para escopo externo
const OPEN_TS = new Date('2026-03-18').getTime() / 1000; // para calcular dias no fallback
const aprSource = 'histórico';  // label dinâmico da fonte
```

**Lógica de atualização do card APR BRUTO LP:**
- Fonte subgraph: sub-label = `"c/ IL: +X.X%"` (PnL total)
- Fonte on-chain fallback: sub-label = `"parcial · só fees não coletadas"`
- Sem dados: sub-label = `"dados indisponíveis — subgraph offline"`

### Dados atualizados

Nenhum dado numérico de posição alterado nesta sessão.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Uniswap iframe dava "connection refused" | `app.uniswap.org` usa `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'` — bloqueia qualquer origem externa. CDN inconsistente explicava o comportamento intermitente. | Substituído por GeckoTerminal embed que suporta iframe explicitamente |
| APR BRUTO LP mostrava "—" | Endpoint The Graph (`api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`) depreciado — falhava silenciosamente, `feeApr` ficava `null` | Substituído por `interface.gateway.uniswap.org/v1/graphql` com fallback on-chain e labels claros |
| Fallback do iframe não detectava ERR_CONNECTION_REFUSED | Catch do `load` event chamava `showFrame()` incondicionalmente para qualquer SecurityError — incluindo página de erro do browser (chrome-error://) | Identificado mas não corrigido via código — problema resolvido pela troca de embed (GeckoTerminal) |

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ACC_DATA` e `ACC_MONTHLY`** — refinar conforme Lucas registra yields mais precisos
- **`ferramentas.html`** — calculadora de liquidação ainda usa "GHO" nos inputs HTML (deve ser USDC)
- **CSVs das CEX** — Lucas traz na próxima semana para custo de aquisição em BRL e base para IR
- **`HOLDINGS` em `index.html`** — atualizar array quando Lucas comprar mais tokens
- **Testar gateway Uniswap Labs** — confirmar se `interface.gateway.uniswap.org/v1/graphql` retorna dados da posição #4694262 em produção (pode exigir CORS ou auth adicional; se falhar, cai no fallback on-chain)

---

## Sessão 16/04/2026 — Sync diário→portfolio, tooltip donut, USDT 2069, stables nos gráficos

### Implementado

#### `ferramentas.html` — Diário DeFi: tipo Trade com campos estruturados

Quando o usuário seleciona tipo **"Trade / Swap"** no Diário DeFi, agora aparece um bloco extra com campos:
- **Token** (select: ETH, SOL, ADA, EIGEN, RDNT, POL, ZK, XAI, ZETA)
- **Operação** (Compra / Venda)
- **Quantidade**
- **Custo total ($)**

Ao salvar, `entry.trade = { token, side, qty, totalCost }` é persistido em `localStorage['bc-diary-v2']`.

Nota informativa verde abaixo do bloco: *"↺ Sincroniza automaticamente com Portfolio e Index"*

**Funções alteradas:**
- `toggleLendingFields` renomeada para `toggleExtraFields` — agora controla tanto `#lending-fields` quanto `#trade-fields`
- `saveEntry()` — bloco `if (type === 'trade')` adicionado para capturar e salvar dados estruturados
- `clearForm()` — limpa `d-trade-qty` e `d-trade-cost` ao resetar o form

#### `ferramentas.html` — Diário DeFi: ordenação por data

`renderDiary()` agora faz `.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))` antes de renderizar — exibe mais recente primeiro, mais antigo por último.

**Por quê:** `diaryEntries.unshift()` (inserção no topo) não garante ordem cronológica quando o usuário registra entradas com datas retroativas.

#### `index.html` — Sync automático com trades do Diário DeFi

IIFE adicionado antes de `TOTAL_INVESTED`:
```js
(function(){
  var diary = JSON.parse(localStorage.getItem('bc-diary-v2') || '[]');
  var idMap = { ETH:'ethereum', SOL:'solana', ... };
  diary.filter(e => e.type==='trade' && e.trade && e.trade.qty>0)
       .forEach(e => {
         var h = HOLDINGS.find(h => h.id === idMap[e.trade.token]);
         if (!h) return;
         var mul = e.trade.side === 'buy' ? 1 : -1;
         h.qty += mul * e.trade.qty;
         if (e.trade.totalCost) h.invested += mul * e.trade.totalCost;
       });
})();
```

Os trades do diário são **incrementais** sobre a base hardcoded — não registrar no diário compras que já estão na base.

#### `portfolio_analytics.html` — Sync automático com trades do Diário DeFi

Mesmo padrão do `index.html`, aplicado após `applyUpdate()`:
```js
(function(){
  var diary = JSON.parse(localStorage.getItem('bc-diary-v2') || '[]');
  var tickerMap = {}; PORTFOLIO.forEach(a => tickerMap[a.ticker] = a);
  diary.filter(e => e.type==='trade' && e.trade && e.trade.qty>0)
       .forEach(e => { ... a.qty += mul*t.qty; a.invested += mul*t.totalCost; });
})();
TOTAL_INVESTED = PORTFOLIO.reduce((s,a)=>s+a.invested, 0); // recomputa
```

#### `index.html` — Hero stat de retorno fixado

`heroReturn` hardcoded em **+649.9%** (track record histórico).

`updateHeroReturn()` esvaziada — não sobrescreve mais o valor com cálculo ao vivo. Justificativa: na landing page pública, o retorno deve ser o track record, não oscilar com o mercado e aparecer como "0%" em dias de queda.

#### `portfolio_analytics.html` — Tooltip do donut com qty + USD

`buildAllocationChart` — callback do tooltip atualizado:
```js
label: ctx => {
  const item = items[ctx.dataIndex];
  const pct = (ctx.raw/total*100).toFixed(1);
  const usdLine = ` ${ctx.label}: ${fmtCurrency(ctx.raw,0)} (${pct}%)`;
  if (!item || item.qty == null) return usdLine;
  const dec = q < 1 ? 6 : q < 100 ? 4 : q < 10000 ? 2 : 0;
  return [usdLine, `  ${qFmt} ${ctx.label}`];
}
```
Agora ao passar o mouse: linha 1 = valor USD + %, linha 2 = quantidade em tokens.

#### `portfolio_analytics.html` — USDT e USDS movidos para PORTFOLIO_DATA

Anteriormente hardcoded no `buildAllocationChart` e somados via `STABLES_USD`. Agora são entradas do array `PORTFOLIO_DATA` com `isStable:true`:
```js
{ cgId:'tether',         ticker:'USDT', qty:2069.46, invested:2069.46, color:'#26A17B', isStable:true },
{ cgId:'usds-stablecoin',ticker:'USDS', qty:300.42,  invested:300.42,  color:'#5B8EF0', isStable:true },
```

`STABLES_USD = 0` — evita dupla contagem.

`buildAllocationChart` simplificado: `enriched.filter(a=>a.currentValue>0).sort(...)` — sem stables hardcoded.

#### `portfolio_analytics.html` — Stables nos gráficos P&L e ROI (Análise por Ativo)

`buildLiveCharts` antes filtrava `!a.isStable`. Agora inclui todos os ativos com `invested > 0`:
```js
const withInv = enriched.filter(a=>a.invested>0).sort((a,b)=>a.pnl-b.pnl);
const withROI = enriched.filter(a=>a.invested>0).sort(...);
```
USDT e USDS aparecem com P&L = $0 e ROI = 0% (correto para stablecoins 1:1).

`FALLBACK_PRICES` atualizado: `'tether':1,'usds-stablecoin':1` adicionados.

### Dados atualizados

**USDT — print CoinGecko 16/04/2026:**

| Campo | Antes | Depois |
|---|---|---|
| USDT qty (WEEKLY_UPDATE.holdings) | 1652.90 | **2069.46** |
| USDT invested (WEEKLY_UPDATE.invested) | 1652.90 | **2069.46** |
| USDT qty (PORTFOLIO_DATA) | n/a (era STABLES_USD) | **2069.46** |
| STABLES_USD | 1953.32 | **0** (movido para PORTFOLIO_DATA) |
| index.html STABLES_USD | 1950.55 | **2369.88** (USDT 2069.46 + USDS 300.42) |

**Compras USDT detectadas no print:**
| Data | Qty | Custo |
|------|-----|-------|
| 16/Abr/2026 | +69.76 | $69.86 |
| 09/Abr/2026 | +94.39 | $94.00 |
| 09/Abr/2026 | +101.69 | $101.83 |
| 28/Mar/2026 | +151.51 | $152.26 |

**SOL invested** em `index.html`: `$2201.68` → `$2280.39` (DCA +0.99 SOL @ $78.78 de Abr/2026 estava faltando)

**TOTAL_DEBT** em `index.html`: `$1553.20` → `$1553.70` (AAVE $748 USDC pós-refinanciamento)

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Hero stat mostrando "+0%" | `updateHeroReturn()` recalculava com preços ao vivo; com ETH ~$1470 o portfólio ficava no break-even | Função esvaziada; `heroReturn` hardcoded em `+649.9%` |
| SOL invested desatualizado | Último DCA (+0.99 SOL @ $78.78) estava no `WEEKLY_UPDATE.invested` mas não no `HOLDINGS` do index | `invested` corrigido de `$2201.68` para `$2280.39` |
| USDT desatualizado (1652.90) | Três compras de Mar–Abr/2026 não registradas | Atualizado para 2069.46 via print CoinGecko |
| USDT/USDS não apareciam em P&L e ROI por ativo | `buildLiveCharts` filtrava `!a.isStable` | Filtro removido; stables incluídas com P&L=0, ROI=0% |

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ferramentas.html` calculadora de liquidação** — ainda usa "GHO" nos inputs HTML (deve ser USDC)
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR (pendente)
- **`ACC_DATA` e `ACC_MONTHLY`** — refinar conforme Lucas registra yields mais precisos
- **Testar gateway Uniswap Labs** — confirmar `interface.gateway.uniswap.org/v1/graphql` em produção

### Nota sobre sync diário→portfolio

O sync via localStorage funciona apenas quando as páginas são abertas **no mesmo browser e origem** (file:// ou mesmo servidor local). Compras registradas no diário de `ferramentas.html` são **incrementais** sobre a base hardcoded em `PORTFOLIO_DATA` e `HOLDINGS`. Não registrar no diário o que já está na base — seria dupla contagem.

---

## Sessão 17/04/2026 — Logo USDS corrigido + stat "Melhor 24h" + variação 24h com LP

### Implementado

#### `portfolio_analytics.html` — Stat "MELHOR 24h" no hero

Novo `hero-meta-item` adicionado ao lado de "TOTAL INVESTIDO" no bloco hero:
```html
<div class="hero-meta-item">
  <div class="hero-meta-label">MELHOR 24h</div>
  <div class="hero-meta-val pos" id="s-best24h">—</div>
  <div style="font-size:8px;color:var(--muted);" id="s-best24h-sub">—</div>
</div>
```

**JS em `renderUI()`:** calcula o ativo com maior ganho absoluto em $ nas últimas 24h (excluindo stables):
```js
const best24 = enriched.filter(a=>!a.isStable).reduce((best,a)=>{
  const gain = a.currentValue*(a.change24h/100);
  return gain > (best ? best.gain : -Infinity) ? {a, gain} : best;
}, null);
```
- `s-best24h` → valor em $, colorido verde/vermelho
- `s-best24h-sub` → ticker + % de variação (ex: `SOL +2.43%`)

#### `portfolio_analytics.html` — Variação 24h inclui LP pool

**Antes:** `ch24` calculava apenas ativos em `PORTFOLIO_DATA`, ignorando o LP pool.

**Depois:** LP pool ($365, ~50% WETH) contribui proporcionalmente ao ETH 24h:
```js
const ethChange24 = get24h('ethereum');
const lpCh24 = LP_POOLED * 0.5 * (ethChange24 / 100);
const ch24 = enriched.reduce((s,a)=>s+(a.currentValue*(a.change24h/100)), 0) + lpCh24;
```

**Por quê:** CoinGecko mostrava $131.89 e o site $105. Parte da diferença era o LP ignorado. A outra parte pode ser timing de fetch (preços capturados em momentos diferentes).

#### `portfolio_analytics.html` — Logo USDS corrigido

URL da imagem estava com ID errado (33613) — retornava 403:
| Campo | Antes | Depois |
|---|---|---|
| Logo URL | `coins/images/33613/small/usds.png` | `coins/images/39926/small/usds.webp` |

Causa: CoinGecko tem dois coins com nome similar. O ID correto do USDS (Sky/Maker) é 39926, não 33613. Verificado via `curl -s -o /dev/null -w "%{http_code}"` retornando 200.

### Dados atualizados

Nenhum dado de posição alterado nesta sessão.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Logo USDS não aparecia em "Análise por Ativo" | URL da imagem no CoinGecko CDN com ID errado (33613 → 403) | Atualizado para ID 39926, formato `.webp` |
| Variação 24h subestimada vs CoinGecko | LP pool ($365 em WETH/USDC) não incluído no cálculo `ch24` | Adicionado `LP_POOLED × 0.5 × ETH_change24h` |

### O que ainda falta (após parte 1 de 17/04)

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ferramentas.html` calculadora de liquidação** — ainda usa "GHO" nos inputs HTML (deve ser USDC)
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR (pendente)
- **`ACC_DATA` e `ACC_MONTHLY`** — refinar conforme Lucas registra yields mais precisos
- **Testar gateway Uniswap Labs** — confirmar `interface.gateway.uniswap.org/v1/graphql` em produção

---

## Sessão 17/04/2026 (continuação) — Pool Base corrigida + AAVE iframe + Meta ao vivo + APR portfolio tokens

### Contexto
Sessão continuou de context esgotado. A parte inicial (logo USDS, stat "Melhor 24h", variação 24h com LP) está logada acima. Esta parte cobre as implementações após o context reset.

### Feedback crítico recebido (IMPORTANTE — não repetir)

Lucas ficou frustrado quando Claude assumiu que a pool WETH/USDC estava na Ethereum mainnet, quando já está documentado no site que está na Base. Feedback literal:
> "É logico que ta na base vc ja deveria saber isso, esta no site... vc esta me fazendo gastar mais tokens do que o necessário, garanta que isso não ocorra novamente"

**Regra:** SEMPRE ler a seção "Pool ATIVA — Dados completos" no CLAUDE.md antes de qualquer chamada on-chain relacionada à pool. A pool está na **Base** (chain_id=8453), nunca na Ethereum mainnet.

Sobre referência de performance:
> "essa pool é da estratégia de venda, entrei full ETH e to saindo Full USDT, deve ser vista e monitorada com a referencia em USD não em HOLD nem em ETH"

**Regra:** Performance da pool WETH/USDC sempre em USD. Nunca usar HOLD (benchmark ETH) nem ETH absoluto como referência.

### Implementado

#### `CLAUDE.md` — Seção "Pool ATIVA — Dados completos" adicionada

Seção detalhada com dados verificados via Revert Finance em 17/04/2026:
- Rede: **Base** (chain_id=8453) — warning "NUNCA assumir Ethereum"
- Range real: **$1,855.72 – $3,146.36**
- Preço médio efetivo de saída: **$2,416** (√(1855.72 × 3146.36))
- Estratégia: entra 100% WETH, sai 100% USDC ao atingir $3,146
- Estado em 17/04/2026: pooled $384.56, fees $18.62, PnL -$9.58, Fee APR 32%

#### `portfolio_analytics.html` — LP range visual: tentado e removido a pedido

Recurso para exibir range da pool foi implementado mas Lucas pediu remoção: "Ficou ruim isso". Removido sem rastros.

#### `pools.html` — Meta de Alocação 5%: auto-atualização com patrimônio ao vivo

**Root cause do bug:** `updatePatrimonio()` (chamada pelo `runAll`) tinha:
1. `STABLES = 1953.32` (desatualizado — correto é 2369.88)
2. Debt fallbacks antigos (746.99 e 804.22)
3. `solExtra` incorreto (linha CLAUDE.md confirma remoção prévia)
4. **Não atualizava DOM** dos elementos `capop-patrimonio` e `capop-rec`

**Fix em `updatePatrimonio()` (~linha 3550 de `pools.html`):**
```js
const STABLES = 2369.88;          // USDT 2069.46 + USDS 300.42
const LP_POOLED = window._liveLP || 365;
const DEBT = (window._liveAaveDebt || 748) + (window._liveKaminoDebt || 805.70);
const total = spot + STABLES + LP_POOLED - DEBT;
window._livePatrimonio = total;
// Atualiza Meta DOM:
const pEl = document.getElementById('capop-patrimonio');
const rEl = document.getElementById('capop-rec');
if (pEl) pEl.textContent = '$' + Math.round(total).toLocaleString('en-US');
if (rEl) rEl.textContent = '$' + Math.round(total * 0.05).toLocaleString('en-US');
```

Fallback do META setTimeout: `6640` → `7900`.

#### `pools.html` — AAVE iframe: pro.aave.com → app.aave.com

`pro.aave.com` descontinuado. Corrigido em 5 lugares (sub-label, link toolbar, src iframe, link fallback, link footer "Nova aba"). Commit: `6b7d16c`.

#### `pools.html` — Uniswap APR: tokens do portfolio adicionados por aba

Nova constante `PORTFOLIO_ADDRS` com endereços por rede:
- **ETH:** EIGEN, POL, ZK, ZETA
- **Arbitrum:** RDNT, XAI
- **Base:** vazio (nenhum token do portfolio lá)

Nova função `fetchPortfolioTokens(net)` — GeckoTerminal API, top 3 pools por token, TVL > $5K, ordena APR desc. Cache em `_cachePort`.

`renderTable` refatorada com `rowHtml()` helper e seção separada "TOKENS DO PORTFOLIO" com badge dourado do símbolo.

`loadNet` atualizado: `Promise.all([fetchNet, fetchPortfolioTokens])`.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Meta 5% mostrando "$6,640" estático | `updatePatrimonio()` com STABLES stale e sem update DOM | STABLES=2369.88, LP_POOLED, DOM atualizado |
| AAVE iframe quebrado | `pro.aave.com` descontinuado | Trocado para `app.aave.com` |
| Uniswap APR sem tokens do portfolio | Código filtrava só WETH/stable | `fetchPortfolioTokens()` + seção separada |
| Pool network errada assumida como Ethereum | CLAUDE.md desatualizado + Claude não releu antes de agir | Seção "Pool ATIVA — Dados completos" + warning explícito adicionados |

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ferramentas.html` calculadora de liquidação** — ainda usa "GHO" nos inputs HTML (deve ser USDC)
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR (pendente)
- **`ACC_DATA` e `ACC_MONTHLY`** — refinar conforme Lucas registra yields mais precisos
- **`app.aave.com` iframe** — pode igualmente bloquear embed; link "↗ Nova aba" já está correto como fallback
- **`window._liveLP` no Meta** — fallback $365; quando pool fechar ou capital mudar, atualizar `ENTRY_CAPITAL` e o fallback

---

## Sessão 18/04/2026 — LP Base corrigida + APR backoff + gráficos portfolio melhorados + footers 2021

### Implementado

#### `pools.html` — LP card: contratos e RPCs corrigidos para Base

**Root cause:** `fetchUniswapLPData()` usava endereços da Ethereum mainnet (`NFT_MGR = 0xC364...`, `POOL = 0x88e6...`) mas a pool ativa está na **Base** (chain_id=8453). Qualquer chamada RPC retornava dados de outra posição ou erro silencioso.

**Fix:**
```js
const NFT_MGR = '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1'; // Base NonfungiblePositionManager
const POOL    = '0x6c561B446416E1A00E8E93E221854d6eA4171372'; // Base WETH/USDC 0.30%
const BASE_RPCS = [
  'https://mainnet.base.org',
  'https://base.llamarpc.com',
  'https://base.drpc.org',
  'https://base.publicnode.com'
];
```

`ethcall()` agora itera `BASE_RPCS` em vez de `RPCS` (lista de RPCs Ethereum).

**Subgraph ETH removido:** O endpoint `interface.gateway.uniswap.org/v1/graphql` só indexa posições da Ethereum mainnet — retornava dados de outro usuário para o token ID 4694262. Removido o bloco de fetch do subgraph. APR calculado diretamente via fees não coletadas (on-chain Base) como fonte única:
```js
// Antes: tentava subgraph ETH, caía em fallback on-chain se falhar
// Depois: usa só on-chain Base (correto), label = 'parcial · só fees não coletadas'
if (uncFeeUsd > 0) {
  feeApr    = uncFeeUsd / ENTRY_CAPITAL / days * 365 * 100;
  dailyFees = uncFeeUsd / days;
}
```

#### `pools.html` — Uniswap APR: fetchWithRetry + ZK removido + stagger aumentado

**`fetchWithRetry(url, tries=3)`** adicionada — retry com backoff exponencial em HTTP 429 (rate limit do GeckoTerminal):
```js
async function fetchWithRetry(url, tries=3) {
  for (let i=0; i<tries; i++) {
    const r = await fetch(url, {headers:{Accept:'application/json'}});
    if (r.ok) return r;
    if (r.status === 429 && i < tries-1) {
      await new Promise(res => setTimeout(res, 1500 * (i+1)));
      continue;
    }
    throw new Error('HTTP '+r.status);
  }
}
```

`fetchNet` e `fetchPortfolioTokens` trocados para usar `fetchWithRetry`.

**ZK removido de `PORTFOLIO_ADDRS.eth`:** token `0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e` retornava 404 na GeckoTerminal (ZK não existe em ETH mainnet como ERC-20 liquid; é token da rede ZKsync).

**Stagger de carregamento aumentado:** `1.5s→4s` (Base) e `3s→8s` (Arbitrum) para evitar burst de requisições e HTTP 429.

#### `pools.html` — AAVE iframe: revertido app.aave.com → pro.aave.com

`app.aave.com` também bloqueia iframe via `X-Frame-Options`. Revertido `pro.aave.com` em 5 lugares (sub-label, link toolbar, src iframe, link fallback, link "Nova aba"). Esta é a URL que funciona como embed (ou mostra fallback graciosamente).

#### `portfolio_analytics.html` — P&L por ativo: airdrops incluídos

`buildLiveCharts` — filtro do gráfico P&L por ativo alterado:
```js
// Antes: invested > 0 (excluía RDNT/ZK/ZETA que têm qty mas invested=0)
// Depois: qty > 0 (inclui airdrops — P&L = currentValue, sem cost basis)
const withInv = enriched.filter(a=>a.qty>0).sort((a,b)=>a.pnl-b.pnl);
// ROI ainda filtra por invested>0 (ROI de cost zero = indefinido)
const withROI = enriched.filter(a=>a.invested>0).sort(...);
```

RDNT, ZK e ZETA agora aparecem no gráfico P&L com P&L = valor atual (já que custo é zero — airdrops).

#### `portfolio_analytics.html` — DCA Tracking: gráfico dinâmico com wealthCurve

Substituídos 13 pontos trimestrais hardcoded por leitura dinâmica do `WEEKLY_UPDATE.wealthCurve` (51 meses, Jan/22→Mar/26) + ponto ao vivo de Abr/26 quando `_livePortfolioGross` disponível:
```js
var wc = WEEKLY_UPDATE.wealthCurve;
var labels = wc.labels.slice();
var vals   = wc.values.slice();
var inv    = wc.invested.slice();
if (typeof _livePortfolioGross !== 'undefined' && _livePortfolioGross > 0) {
  labels.push('04/26'); vals.push(Math.round(_livePortfolioGross));
  inv.push(Math.round(TOTAL_INVESTED));
}
```

**Tooltip melhorado:** título do mês + P&L + ROI no hover:
```js
afterBody: items => {
  const pnl = v - c, roi = (pnl/c*100).toFixed(1);
  return ['──────────', ' P&L: +$X,XXX', ' ROI: +XX%'];
}
```

Eixo X agora com `maxTicksLimit:13, autoSkip:true` para não sobrecarregar labels.

#### `portfolio_analytics.html` — perfChart: tooltip contextual + halo nos pontos

`buildPerfChart` melhorado:
- Tooltip title: `"Hora "`, `"Dia "` ou `"Mês "` conforme o período selecionado (24h/7d/all)
- Tooltip after-body: P&L + ROI no hover (igual ao DCA)
- Pontos em hover com halo branco 5px: `pointHoverBackgroundColor:'#b8963a', pointHoverBorderColor:'#fff', pointHoverBorderWidth:2`

#### `portfolio_analytics.html` — riskBubble: ZETA adicionado

ZETA adicionado ao `buildRiskBubble` (era 10 ativos, agora 11):
```js
{ x:1.90, y: 9999, r: 2, label:'ZETA', color:'#00C896' }, // airdrop → posicionado em +85%
```

#### `index.html`, `portfolio_analytics.html`, `relatorio.html` — Footers "Since 2021"

Três arquivos atualizados:
- `index.html`: hero stat "Since" — `2022` → `2021`
- `portfolio_analytics.html`: footer — `"GESTÃO ATIVA · ABR 2026"` → `"SINCE 2021"`
- `relatorio.html`: footer — `"Gestão Ativa"` → `"Since 2021"`

**Por quê:** Barolo Capital opera desde 2021, não 2022. Corrige o track record exibido publicamente.

### Dados atualizados

Nenhum dado de posição alterado nesta sessão.

### Bugs corrigidos

| Bug | Causa raiz | Fix aplicado |
|-----|-----------|--------------|
| LP card (POOLED/APR/CUSTO/LIQUIDO) com dados errados | `NFT_MGR` e `POOL` eram endereços da Ethereum mainnet; pool está na Base | Substituídos pelos endereços corretos da Base + `BASE_RPCS` |
| APR card mostrando dados de outro usuário | Subgraph ETH indexa por `tokenId` global — `#4694262` pode pertencer a outra posição na ETH | Subgraph removido; APR calculado 100% on-chain via Base RPC |
| GeckoTerminal retornava HTTP 429 (rate limit) | Três redes carregavam em burst com stagger curto (1.5s/3s) | `fetchWithRetry` com backoff + stagger 4s/8s |
| ZK retornava 404 no GeckoTerminal | Token ZK não existe em ETH mainnet como ERC-20 liquide | ZK removido de `PORTFOLIO_ADDRS.eth` |
| DCA chart com só 13 pontos trimestrais hardcoded | Array estático desatualizado | Dinâmico via `wealthCurve` (51 pts) + ponto ao vivo |
| RDNT/ZK/ZETA ausentes do gráfico P&L | Filtro `invested>0` excluía airdrops com `invested=0` | Filtro trocado para `qty>0` no P&L (ROI mantém `invested>0`) |
| AAVE iframe quebrado | `app.aave.com` bloqueia `X-Frame-Options` igual ao Uniswap | Revertido para `pro.aave.com` |
| Hero/footer mostrando "2022" | Ano de início errado (Lucas opera desde 2021) | Corrigido para 2021 nos 3 arquivos |

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ferramentas.html` calculadora de liquidação** — ainda usa "GHO" nos inputs HTML (deve ser USDC)
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR (pendente)
- **`ACC_DATA` e `ACC_MONTHLY`** — refinar conforme Lucas registra yields mais precisos
- **APR pool Base** — calculado só via fees não coletadas (uncollected); fees já coletadas (Collect events) não são contabilizadas. Para APR histórico completo precisaria de scan de logs Base — complexidade alta, pendente.
- **`pro.aave.com` iframe** — também pode bloquear embed em alguns browsers; fallback com link "Nova aba" está correto

---

## Sessão 21/04/2026 — Code review geral + relatorio.html corrigido + cache CoinGecko

### Contexto
Sessão iniciada com revisão proativa de qualidade de código em todos os arquivos HTML. Nenhum dado de posição novo nesta sessão.

### Implementado

#### Code review — achados por arquivo

Foi feita uma análise completa de todos os arquivos. Principais achados confirmados como bugs reais (não falsos positivos):

| Arquivo | Problema | Severidade |
|---------|----------|------------|
| `relatorio.html` | Fetch CoinGecko buscava só ETH/SOL/ADA — 6 tokens com preços estáticos de fev/2025 | Alta |
| `relatorio.html` | Yield calc (`renderKPIs`) usava APYs hardcoded desatualizados (3.28%, 3.18%) | Alta |
| `relatorio.html` | `STABLES_USD=1953.32`, `DEBT_TOTAL=1551.21`, SOL invested stale, pool net "Ethereum" | Média |
| Todos | Sem cache de preços CoinGecko — rate limit em múltiplas abas ou reloads rápidos | Média |

Falsos positivos identificados (não corrigidos):
- `emprestimos.html` fallback ETH qty 1.88 → **correto** (supply AAVE, não total do portfólio)
- `portfolio_analytics.html` ZETA `y:9999` → **correto** (sentinel mapeado para 85 via `.map()`, tooltip mostra "Airdrop")

#### `relatorio.html` — Fetch CoinGecko: 3 → 9 tokens

**Antes:** URL hardcoded `?ids=ethereum,solana,cardano` — RDNT, EIGEN, POL, ZK, XAI, ZETA sempre usavam preços estáticos de meses atrás.

**Fix:** `cgId` adicionado a cada entrada do `PORTFOLIO_DATA`; fetch usa `PORTFOLIO_DATA.map(a=>a.cgId).join(',')` automaticamente. Se um token novo for adicionado ao array, o fetch atualiza sem código extra.

```js
// Antes
fetch('...?ids=ethereum,solana,cardano')
  .then(p => {
    PORTFOLIO_DATA[0].price = p.ethereum.usd;
    PORTFOLIO_DATA[1].price = p.solana.usd;
    ...

// Depois
var allIds = PORTFOLIO_DATA.map(function(a){ return a.cgId; }).join(',');
fetch('...?ids=' + allIds)
  .then(p => {
    PORTFOLIO_DATA.forEach(function(a){ if (p[a.cgId]) a.price = p[a.cgId].usd; });
```

#### `relatorio.html` — Yield calc dinâmico

**Antes:** `renderKPIs()` calculava juros e yield com valores e APYs hardcoded:
```js
var juros = (747*0.0328 + 804*0.0318)/12;
var yieldM = (1.87*PORTFOLIO_DATA[0].price*0.015 + 1652.90*0.032 + 19.33*PORTFOLIO_DATA[1].price*0.06 + 300.42*0.10)/12;
```

**Fix:** Constantes explícitas adicionadas logo após `DEBT_TOTAL`:
```js
var AAVE_ETH_QTY=1.88,  AAVE_ETH_APY=0.0125;
var AAVE_USDT_QTY=1650, AAVE_USDT_APY=0.0187;
var AAVE_BORROW=748,    AAVE_BORROW_APY=0.0232;
var KAM_SOL_QTY=19.37,  KAM_SOL_APY=0.0319;
var KAM_USDS_QTY=300.55,KAM_USDS_APY=0.0369;
var KAM_BORROW=805.70,  KAM_BORROW_APY=0.0409;
```
`renderKPIs()` agora usa essas constantes. Para atualizar APYs ou quantidades, basta editar as constantes.

`renderKPIs()` também ganhou:
- `r-invested` atualizado dinamicamente (era `$6.418` hardcoded)
- `r-aave-eth-usd`, `r-aave-supply`, `r-kam-sol-usd`, `r-kam-supply` preenchidos com valores USD ao vivo
- `r-cost-total` no tfoot da tabela calculado de `calcTotals().costTotal`

#### `relatorio.html` — Dados stale atualizados

| Campo | Antes | Depois |
|-------|-------|--------|
| `STABLES_USD` | 1953.32 | **2369.88** (USDT 2069.46 + USDS 300.42) |
| `DEBT_TOTAL` | 1551.21 | **1553.70** (AAVE 748 + Kamino 805.70) |
| `PORTFOLIO_DATA[1].invested` (SOL) | 2201.68 | **2280.39** |
| Pool WETH/USDC `net` | `'Ethereum'` | **`'Base'`** |
| KPI Dívida Total HTML | `$1.551` | **`$1.554`** |
| AAVE Supply ETH HTML | `1.87 ETH` | **`1.88 WETH`** |
| AAVE Supply USDT HTML | `1.652,90 USDT` | **`1.650 USDT`** |
| AAVE Borrow HTML | `746,99 USDC · 3,28%` | **`748 USDC · 2,32%`** |
| AAVE Juros/Mês HTML | `~$2,04` | **`~$1,45`** |
| Kamino Supply SOL HTML | `19,33 SOL` | **`19,37 SOL`** |
| Kamino Supply USDS HTML | `300,42 USDS` | **`300,55 USDS`** |
| Kamino Borrow HTML | `804,22 USDC` | **`805,70 USDC`** |
| Kamino Juros/Mês HTML | `~$2,13` | **`~$2,75`** |

#### Cache localStorage para preços CoinGecko (3 arquivos)

Implementado sistema de cache com TTL diferente por página:

| Arquivo | Chave localStorage | TTL | Comportamento se API falhar |
|---------|-------------------|-----|----------------------------|
| `portfolio_analytics.html` | `bc-prices-cache` | **5 min** | Usa cache + mostra "cache Xmin atrás" no status |
| `index.html` | `bc-index-prices-cache` | **2 min** | Renderiza ticker com dados do cache |
| `relatorio.html` | `bc-prices-cache` (compartilhada) | **30 min** | Aplica preços sem nenhum fetch extra |

**Lógica:**
1. Na abertura: se cache < TTL → usa diretamente (zero requests para CoinGecko)
2. Se cache expirado: tenta API → salva no cache em caso de sucesso
3. Se API falhar: usa cache desatualizado (muito melhor que fallbacks de mar/2025 hardcoded)
4. `relatorio.html` compartilha a chave `bc-prices-cache` com `portfolio_analytics.html` → se o analytics foi aberto antes, o relatório já tem preços prontos

**Funções adicionadas em `portfolio_analytics.html`:**
```js
function loadPriceCache() { ... }  // retorna null se sem cache ou erro de parse
function savePriceCache(data) { ... }  // salva liveData com timestamp
```

### Dados atualizados

Nenhum dado de posição novo. Todos os updates foram de dados stale já existentes no código.

### Bugs corrigidos

| Bug | Causa raiz | Fix aplicado |
|-----|-----------|--------------|
| `relatorio.html` — RDNT, EIGEN, POL, ZK, XAI, ZETA com preços de fev/2025 | Fetch `?ids=ethereum,solana,cardano` não incluía os outros tokens | `cgId` adicionado ao `PORTFOLIO_DATA`; fetch usa todos os IDs dinamicamente |
| `relatorio.html` — Yield líq./mês calculado com APYs de jan/2026 (3.28%/3.18%) | Valores hardcoded nunca atualizados após refinanciamento AAVE | Constantes explícitas `AAVE_BORROW_APY=0.0232`, `KAM_BORROW_APY=0.0409`, etc. |
| `relatorio.html` — `STABLES_USD`, `DEBT_TOTAL`, quantidades stale | Dados de março/2026 nunca atualizados | Todos atualizados para valores de abril/2026 |
| `relatorio.html` — pool WETH/USDC listada como "Ethereum" | `POOLS_DATA` copiada antes da correção de rede | `net:'Ethereum'` → `net:'Base'` |
| CoinGecko rate limit em múltiplas abas | Sem cache — cada abertura de página fazia requests imediatos | Cache localStorage com TTL por página |
| `portfolio_analytics.html` — fallback de preços usa valores de mar/2025 quando API falha | `FALLBACK_PRICES` hardcoded nunca atualizado | Cache desatualizado usado antes do fallback estático |

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **`ferramentas.html` calculadora de liquidação** — inputs AAVE ainda usam "GHO" (deve ser USDC) e quantidades antigas
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR (pendente)
- **`ACC_DATA` e `ACC_MONTHLY`** — refinar conforme Lucas registra yields mais precisos
- **APR pool Base** — calculado só via uncollected fees; Collect events históricos não contabilizados

---

## Sessão 22/04/2026 — Painel Sizing & Risk em ferramentas.html (Kelly + Merton + Hedge + Lev+Hedge) + GHO→USDC no calculador

### Contexto

Sessão focada em mentoria sobre regra de Kelly e hedge de pools com leverage, seguida da implementação prática no `ferramentas.html`. Lucas pediu inspiração no [defibuddy.io/hedging-calculator](https://www.defibuddy.io/hedging-calculator) (SPA com JS — WebFetch retornou vazio, concepção veio de conhecimento geral). Lucas escolheu a opção 3: painel combinado "Sizing & Risk" com Kelly + Hedge integrados.

### Implementado

#### `ferramentas.html` — Novo painel "Sizing & Risk" (4ª aba)

**Nova aba** inserida entre "Cenários" e "Diário DeFi":
- Botão tab com `data-i18n="tab-sizing"` (EN/PT: "Sizing & Risk")
- Panel `#panel-sizing` com 4 calculadoras sequenciais

**Calculadora 1 — Kelly Pool (binário)**
- Fórmula: `f* = (b·p − q) / b` onde b = odds (ganho/perda), p = prob. ganhar, q = 1−p
- Inputs (IDs): `kp-preset` (select: Safe/Moderate/Aggressive/Custom), `kp-p` (prob %), `kp-win` (ganho $), `kp-loss` (perda $), `kp-capital` ($), `kp-frac` (Full/Half/Quarter)
- Outputs: `kp-edge` (edge %), `kp-fstar` (Kelly %), `kp-applied` (aplicado %), `kp-allocate` ($ a alocar), `kp-growth` (crescimento geométrico esperado), `kp-verdict` (veredito colorido), `kp-note` (recomendação)
- Presets: Safe (50/50, b=1.5), Moderate (60/40, b=2), Aggressive (70/30, b=3)
- Função: `calcKellyPool()` + `applyKpPreset(name)`

**Calculadora 2 — Kelly Leverage (Merton, contínuo)**
- Fórmula: `f* = (μ − r) / σ²` onde μ = APR esperado, r = custo borrow, σ² = variância
- Aplicação: LTV ótima ajustada por fração de segurança (Half/Quarter Kelly)
- Inputs (IDs): `km-apr` (APR esperado %), `km-borrow` (custo %), `km-vol` (vol anualizada %), `km-ltv` (LTV atual %), `km-frac` (fração)
- Outputs: `km-excess` (APR excess), `km-var` (variância), `km-lev` (leverage ótima), `km-ltv-opt` (LTV ótima %), `km-diff` (vs atual), `km-verdict`
- Função: `calcKellyMerton()`

**Calculadora 3 — Hedge LP (delta-neutro)**
- Delta Uniswap V3: `ETH_share = (sb-s)·s/sb / [(sb-s)·s/sb + (s-sa)]`
- IL anualizado: `−min(0.3, vol²/(8·rangeW))` com `rangeW = (√pmax - √pmin) / √pcenter`
- Hedge cost: perp = funding × short_usd; borrow-short = −borrow × short_usd
- Inputs (IDs): `hd-capital` (padrão $365 — pool atual), `hd-pmin=1855.72`, `hd-pmax=3146.36`, `hd-pnow=2431` (ETH ao vivo via `syncHedgeLivePrice`), `hd-feeapr=32`, `hd-funding=5`, `hd-borrow=3`, `hd-vol=60`, `hd-pct` (range 0–100%), `hd-instr` (perp/borrow-short)
- Outputs: `hd-inrange`, `hd-delta`, `hd-ethval`, `hd-short` (notional + ETH), `hd-fee-line`, `hd-il`, `hd-hedge-cost`, `hd-apr-naked`, `hd-apr-hedged`, `hd-verdict`, `hd-warning`
- Avisos específicos: `hd-pct > 0.7` + preço ainda abaixo de 90% do pmax → alerta sobre anular estratégia de saída gradual
- Funções: `calcHedge()`, `syncHedgeLivePrice()` (sincroniza com `liveETH` via fetchLivePrices, respeita `dataset.userTouched`)

**Calculadora 4 — Leverage + Hedge Combinado (3-vias)** ← adicionado nesta sessão
- Compara 3 estratégias com mesmo capital próprio:
  - **A) LP puro** — sem leverage; APR = (fees + IL) × lp/capital; DD = lp × delta × vol / capital
  - **B) Leverage produtiva (Barolo style)** — fees+IL sobre LP completo + supply colateral − borrow; DD amplificado pela razão lp/capital
  - **C) Leverage + Hedge (delta-neutro)** — B + funding × hedge_notional; IL residual = IL × (1−hpct); DD reduzido por (1−hpct)
- Inputs (IDs): `lh-capital=6000`, `lh-lp=2000`, `lh-brwpct` (slider 0–100%), `lh-supapy=1.5`, `lh-feeapr=32`, `lh-il=-12`, `lh-brw=2.32`, `lh-fund=5`, `lh-delta=50`, `lh-hpct` (slider 0–100%), `lh-vol=60`
- Outputs: Tabela 3×3 com APR/DD/Sharpe (IDs `lh-{a,b,c}-{apr,dd,sh}`) + decomposição da C (`lh-c-fee`, `lh-c-sup`, `lh-c-ilr`, `lh-c-brw`, `lh-c-fund`, `lh-c-net`) + veredito (maior Sharpe vence)
- Range sliders com display inline: `lh-brwpct-val`, `lh-hpct-val`
- Avisos: hedge >70% anula saída gradual; borrow >80% risco de liquidação
- Função: `calcLevHedge()` — adicionada após `syncHedgeLivePrice()`, inicializada no `setTimeout` de primeira renderização

**Seção "Notas / Fundamentos"** ao final do painel: 4 colunas (grid 1fr×4) explicando Kelly binário, Merton, Hedge LP, Lev+Hedge com fórmulas resumidas.

#### `ferramentas.html` — Fix refinanciamento GHO → USDC (10/04/2026)

A calculadora de liquidação AAVE ainda tinha dados antigos. Atualizado para refletir o refinanciamento:

| Campo | Antes | Depois |
|-------|-------|--------|
| Label dívida AAVE (HTML + i18n key) | `lbl-gho-debt` "Dívida GHO" | `lbl-usdc-debt-aave` "Dívida USDC" |
| Valor dívida AAVE (input) | 747.50 | **748** |
| `BASE.aaveDebt` (JS simulador) | 747.50 | **748** |
| `BASE.aaveUSDT` | 1651.30 | **1650** |
| `BASE.aaveETH` | 1.87 | **1.88** |
| `BASE.kamPYUSD` | 90 | **300.55** |
| `BASE.kamSOL` | 19.3 | **19.37** |
| `BASE.kamDebt` | 802.76 | **805.70** |
| `checkAlerts()` — divisão LTV | `/747.50` | `/748` |
| `checkAlerts()` — bloco Kamino | `19.3`, `90`, `802.76` | `19.37`, `300.55`, `805.70` |

Commits: `9a9e79f` (Sizing & Risk panel) e `b6c798a` (GHO→USDC fix).

### Conteúdo da mentoria (registrado em memória)

Sessão incluiu discussão extensiva sobre:

**Regra de Kelly aplicada a DeFi:**
- Binário (pools com range): `f* = (b·p − q)/b`
- Contínuo/Merton (lending alavancado): `f* = (μ − r)/σ²`
- Half/Quarter Kelly recomendado — errar `p` em 10% causa erro de 30%+ em `f*`
- Kelly não considera frequência de rebalance nem liquidity slippage — base para decisão, não resposta final

**Hedge delta-neutro em pools:**
- Uniswap V3: delta varia dentro do range (100% ETH em pmin, 0% em pmax)
- Hedge perfeito: short notional = delta × valor_pool
- Economia: anula IL, captura fees "puras"
- Trade-offs: funding pode flipar (bear agressivo), range break anula hedge, complexidade operacional (3 smart contracts)
- **Incompatível com estratégia de saída gradual** — hedge >70% anula o propósito da pool como exit strategy

**Combo Leverage + Hedge (tese "delta-neutral farming"):**
- Estratégia atual do Lucas: colateral AAVE + borrow USDC → LP ETH/USDC → pool paga borrow com fees
- Com hedge: adiciona short ETH perpétuo proporcional ao delta, captura fees sem exposição direcional
- Funciona bem em lateralização; performa pior em bull acelerado (perde valorização do ETH)
- Red flags: funding flip, bridge risk (WBTC/cbBTC premium), liquidation cascade em smart contracts encadeados

**State-of-the-art 2026 (pendente discussão detalhada):**
- Euler V2 — modular lending com borrow fixed-term
- Morpho Blue — isolated markets com custom LTV
- Gearbox V3 — credit accounts nativo com estratégias pré-aprovadas
- Drift BTC-PERP — basis trade em Solana com funding estável
- Hyperliquid HLP — vault maker-taker com yield ~15% APR
- Pendle PT — trade de rendimento fixo (separar yield de principal)

### Dados atualizados

Nenhum dado de posição alterado. Apenas calculadora de ferramentas.html refletindo refinanciamento AAVE (GHO→USDC @ 2.32%) que já estava documentado em outras páginas desde 10/04/2026.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| `ferramentas.html` calculadora de liquidação com "GHO" como dívida AAVE | HTML e JS `BASE` nunca atualizados após refinanciamento de 10/04/2026 | Label, value, `BASE.aaveDebt`, `checkAlerts()` todos atualizados para USDC @ $748 |
| `ferramentas.html` usando quantidades antigas (1.87 WETH, 1651 USDT, 19.3 SOL, 90 USDS, 802 USDC) | Hardcoded no `BASE` do simulador de cenários | Atualizados para valores de abril/2026 (1.88, 1650, 19.37, 300.55, 805.70) |
| `ferramentas.html` sem ferramenta de sizing/Kelly | Nunca existiu — nova feature | Painel `#panel-sizing` com 4 calculadoras |

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR (pendente)
- **~~`ACC_DATA` e `ACC_MONTHLY`~~** — ✅ FEITO em 23/04/2026
- **~~APR pool Base label~~** — ✅ FEITO em 23/04/2026
- **Continuação mentoria** — aprofundar em Euler V2, Morpho Blue, Gearbox, Drift basis trade, Hyperliquid HLP, Pendle PT
- **Validar calcLevHedge() com dados reais** — rodar cenários com pool atual ($365) e pool hipotética ($2000) para sanity check
- **i18n do painel Sizing & Risk** — labels dos 4 calculadores só em PT; adicionar `data-i18n` e strings EN se for traduzir
- **Presets Hedge LP** — inputs default são da pool atual (hd-capital=365, pmin=1855.72, pmax=3146.36); considerar botão "carregar pool ativa" que lê do array POOLS em pools.html

---

## Sessão 23/04/2026 — Refinamento ACC_DATA, APR pool Base, GRIFT il, comando /salvar

### Contexto

Sessão iniciada via Claude Code na web (sem PC local necessário). Lucas confirmou que o workflow funciona 100% na web — pode fazer push, commit, merge para main sem precisar de nenhuma interação local.

### Implementado

#### `portfolio_analytics.html` — ACC_DATA refinado com dados confirmados

**Metodologia de refinamento:**
- `eth.pools`: revisados todos os `obs` do array `POOLS` em `pools.html` para extrair ETH confirmado
- `eth.lending`: recalculado com histório completo AAVE abr/25→abr/26 (timeline de `emprestimos.html`)
- `sol.lending`: recalculado com ciclos Kamino K1-K4 completos (K1-K3 fev/25–dez/25 + K4 jan/26–abr/26)

| Campo | Antes | Depois | Base |
|-------|-------|--------|------|
| `eth.pools` | 0.0630 | **0.0700** | Confirmado via obs: RDNT/ETH 0.0281 Ξ + MSTR/ETH ≈0.011 + ETH/USDT Arb ≈0.007 + BASE pools ≈0.007 |
| `eth.lending` | 0.0140 | **0.0180** | AAVE: supply crescendo 0.316→1.88 ETH, média ~1.1 Ξ × 12 meses @ 1.4% APY |
| `sol.pools` | 2.070 | **2.070** | Inalterado — GRIFT 2.071 SOL confirmado. SOL/USDC fees saíram como USDC. |
| `sol.lending` | 0.460 | **0.530** | Kamino K1-K3 avg 11 SOL @ ~4% × 10 meses ≈ 0.330 + K4 19.37 SOL @ 3.19% × 3.8 meses ≈ 0.195 |
| **ETH total** | **0.077** | **0.088** | |
| **SOL total** | **2.530** | **2.600** | |

**ACC_MONTHLY:** todos os 19 pontos reescalados pelos novos totais (ETH ×1.143, SOL ×1.028). Valores do último ponto:
- Abr/26: `[0.077, 2.530]` → `[0.088, 2.600]`

#### `pools.html` — APR label corrigido

`aprSource` de `'parcial · só fees não coletadas'` → `'acumulado desde abertura'`

**Motivo:** sem Collect events na posição, `uncollected fees = total fees acumuladas desde 18/03/2026`. O label "parcial" era incorreto e induzia a pensar que o APR estava subestimado quando na verdade estava correto.

**Aviso adicionado no comentário:** se ocorrer um Collect event manual, o contador de uncollected reseta e o APR passaria a ser subestimado.

#### `pools.html` — GRIFT il corrigido

`il: 500` → `il: 2899` no array `POOLS`.

**Motivo:** `il = fees − result = 1389 − (−1510) = 2899`. O valor 500 violava o invariante e era matematicamente inconsistente. Esta correção já havia sido feita em `relatorio.html` em 10/04/2026 mas havia ficado pendente em `pools.html`.

#### `.claude/commands/salvar.md` — Comando /salvar recriado

Arquivo criado em `/home/user/barolo-capital-site/.claude/commands/salvar.md`.

Instrui o Claude a: atualizar CLAUDE.md com log da sessão no formato padrão → commit `docs: log sessão` → push main.

### Dados atualizados

Nenhum dado de posição ao vivo alterado. Apenas refinamentos de estimativas derivadas do histórico.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| APR label "parcial · só fees não coletadas" | Label copiado de antes da análise da pool Base; sem Collect events, uncollected = total | Trocado para "acumulado desde abertura" |
| GRIFT `il:500` em pools.html | Fix de 10/04 só foi aplicado em relatorio.html | `il:500` → `il:2899` (invariante `fees − result = il`) |

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR (pendente)
- **Continuação mentoria** — Euler V2, Morpho Blue, Gearbox, Drift basis trade, Hyperliquid HLP, Pendle PT
- **Validar calcLevHedge()** — rodar cenários com pool atual ($365) e hipotética ($2000)
- **i18n painel Sizing & Risk** — labels só em PT; adicionar strings EN
- **Presets Hedge LP** — botão "carregar pool ativa" no painel Hedge

---

## Sessão 23/04/2026 (continuação tarde) — Feedback visual presets + Daily Standup agendado

### Implementado

#### `ferramentas.html` — Feedback visual nos botões de preset

**Feature:** Quando clica "Carregar pool ativa" ou "Cenário Barolo", os inputs preenchidos piscam em ouro + toast verde com confirmação.

**CSS adicionado:**
- `@keyframes highlightFlash` — pisca 0.8s com fundo rgba(201,160,80,.25)
- `@keyframes toastSlideIn/toastSlideOut` — notificação desliza de cima
- `.toast-notification` — posição fixed top-right, background verde #63b950, duração 2.5s

**JS adicionado:**
- `flashHighlight(elementIds, duration)` — aplica classe `.preset-highlight`
- `showToast(message, duration)` — cria elemento toast, anima, remove após duração

**Chamadas nos presets:**
- `loadActivePoolHedge()` — flash 9 inputs + toast "Pool ativa carregada (WETH/USDC Base)"
- `loadBaroloScenario()` — flash 11 inputs + toast "Cenario Barolo carregado (leverage + no hedge)"

**Commit:** `aab6a40`

#### Daily Standup para CEO — Tarefa agendada

**Novo processo diário:** Scheduled task recorrente `daily-standup-barolo` via `mcp__scheduled-tasks`.

**Schedule:** 08:30 BRT todos os dias (cron `30 8 * * *`)

**Fluxo (15 min):**
1. CHECK-IN VIVO — preços, portfolio, P&L 24h, HF, LTV
2. RISK DASHBOARD — liq prices, funding rates, depeg alerts, gas
3. YIELD TRACKING — APY AAVE/Kamino, fee APR, yield do dia
4. REGISTRO — trades, decisões alocação, observações mercado
5. REFLEXÃO — melhor decisão, arrependimentos, meta do dia

**Next run:** 24/04/2026 08:37 (com jitter)
**Notificações:** Enabled

### Dados atualizados

Nenhum.

### Bugs corrigidos

Nenhum nesta sessão.

### O que ainda falta

- **Avisos visuais melhorados** — warnings com fundo + ícone ⚠️
- **Mobile responsividade Sizing & Risk** — layout 1 coluna em mobile
- **Tooltips informativos** — inputs técnicos com `?` explicativo
- **Cards de resultado** — APR/DD/Sharpe em cards coloridos
- **`wealthCurve` Abr/2026** — após 30/04
- **`monthlyReturns[2026].Abr`** — fim do mês
- **CSVs CEX** — custo BRL + IR (Lucas traz)
- **Mentoria DeFi avançado** — Euler V2, Morpho, Gearbox, Drift, Hyperliquid, Pendle

---

## Sessão 24/04/2026 — Layout pools + fix tabs ferramentas + atualização posições

### Implementado

- **`pools.html`**: Seções reordenadas via CSS `order` (flex container): Melhores APRs topo → Pool Ativa → Meta+P&L YTD lado a lado em grid `1fr 1fr`. POL removido de `PORTFOLIO_ADDRS.eth`. Stagger Arbitrum aumentado para 12s.
- **`ferramentas.html`**: `netPortfolio` agora usa `BASE.aaveUSDT + BASE.kamPYUSD` dinamicamente (era `1650+300.55` hardcoded). `loadBaroloScenario` ETH default corrigido para 1936.
- **`portfolio_analytics.html`**: SOL 20.31134268→20.39, USDT 2069.46→2140.12, USDS 300.42→300.78, Kamino debt 805.70→807.49, fallback APYs atualizados (kaminoBorrowApy 4.09→6.90, aaveUsdtApy 1.87→9.26, kaminoSolApy 3.19→4.22).
- **`emprestimos.html`**: Textos de display atualizados (SOL 19.33→20.39, USDT 1,650→1,986, Kamino borrow 804.22→807.49, APY borrow 3.18→6.90%). `aaveBorrow` fallback 747.50→748.
- **`index.html`**: SOL 20.31134268→20.39, STABLES_USD 2369.88→2440.90, TOTAL_DEBT 1553.70→1555.49.
- **`relatorio.html`**: SOL 20.31→20.39, STABLES_USD 2369.88→2440.90, DEBT_TOTAL 1553.70→1555.49, AAVE_USDT_QTY 1650→1985.68, KAM_SOL_QTY 19.37→20.39, KAM_USDS_QTY 300.55→300.78, KAM_BORROW 805.70→807.49, APYs atualizados.

### Dados atualizados (prints de 24/04/2026)

| Campo | Antes | Depois |
|-------|-------|--------|
| AAVE USDT supply | 1,650 | **1,985.68** (+335.68 deposit) |
| Kamino SOL supply | 19.37 | **20.39** (+1.02 SOL) |
| USDT total portfolio | 2,069.46 | **2,140.12** (+70.66 compra) |
| USDS | 300.42 | **300.78** |
| Kamino borrow | 805.70 | **807.49** |

### Bugs corrigidos

| Bug | Fix |
|-----|-----|
| `ferramentas.html` todas as abas quebradas | SyntaxError: `\'` (backslash-escaped quotes) em literais de array dentro de `flashHighlight`/`showToast` — duas cópias duplicadas e corrompidas removidas de `loadActivePoolHedge()`, `loadBaroloScenario()` e dentro do array `DEFI_RULES` |
| `netPortfolio` em ferramentas.html com stables hardcoded | `1650+300.55` substituído por `BASE.aaveUSDT+BASE.kamPYUSD` |

### O que ainda falta

- **`wealthCurve` Abr/2026** — após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** — só em PT; falta strings EN
- **Validar calcLevHedge()** com dados reais da pool atual ($365) e hipotética ($2000)
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox, Drift, Hyperliquid HLP, Pendle PT

---

## Sessão 24/04/2026 (continuação) — Pico patrimonial + Diário melhorado

### Implementado

- **`portfolio_analytics.html`**: `wealthCurve` Oct/25 corrigido: `10395` → `12312`. O "Pico Histórico" agora exibe `$12.312` (valor real do CoinGecko em 06/10/2025).
- **`ferramentas.html` — Lending form**: adicionado seletor de **Token** (SOL/ETH/WETH/USDT/USDC/USDS/GHO) + campo **Quantidade (tokens)**. Dados salvos em `entry.lending.token` e `entry.lending.tokenQty`. Protocolo corrigido de "AAVE V3" → "AAVE V4".
- **`ferramentas.html` — Trade form**: **USDT** e **USDC** adicionados como opções de token no select de compra/venda.
- **`ferramentas.html` — renderDiary()**: entradas de lending e trade agora mostram badges inline com token, quantidade e valor USD (ex: `KAMINO · Supply | 1.020 SOL · $85.00`).

### Bugs corrigidos

| Bug | Fix |
|-----|-----|
| Pico histórico mostrava `$11.610` | `wealthCurve[45]` (Oct/25) era `10.395`; real peak foi `$12.312,02` em 06/10/2025 — atualizado |
| Lending form sem campo de token/qty | Formulário só tinha Valor ($) e Dívida restante; adicionado token selector + qty |
| Trade form sem USDT/USDC | Select de token não listava stablecoins; USDT e USDC adicionados |

### O que ainda falta

- **`wealthCurve` Abr/2026** — após 30/04/2026
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **CSVs das CEX** — custo de aquisição em BRL + base para IR

---

## Sessão 25/04/2026 — netTotal inclui LP + SPOT só voláteis + merge para main

### Implementado
- `portfolio_analytics.html` — `netTotal` agora inclui `LP_POOLED` ($365) que estava faltando: fórmula `cgTotal + LP_POOLED − debt` (era `cgTotal + STABLES_USD − debt` com STABLES_USD=0). Afeta `s-net-total`, `ev-net`, `realPnL` e ROI — todos estavam ~$365 abaixo do real.
- `portfolio_analytics.html` — `s-spot` agora mostra só ativos voláteis (filter `!isStable`); contador também só voláteis. Antes mostrava volatile+stables, criando double-count visual com o card STABLES separado. Agora os 4 cards são aditivos: SPOT + POOLS LP + STABLES − DÍVIDAS = Patrimônio Líquido.
- Branch `claude/setup-code-execution-omZ99` mergeada em `main` e pushada (resolveu conflito em CLAUDE.md mantendo logs das sessões 23 e 24/04 em ordem cronológica).

### Bugs corrigidos
| Bug | Fix |
|-----|-----|
| Patrimônio Líquido subestimado em ~$365 | `netTotal` faltava `LP_POOLED` na fórmula |
| SPOT card mostrando volatile+stables (double-count com STABLES card) | Filtro `!isStable` adicionado em `s-spot` e contador |

### O que ainda falta
- **`wealthCurve` Abr/2026** — após 30/04/2026
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **CSVs das CEX** — custo BRL + IR (Lucas traz)

---

## Sessão 27/04/2026 — track.html live on-chain + Solana APR + nav Track em todas as páginas

### Implementado

#### `track.html` — Fetch ao vivo da pool ativa (Base RPC, on-chain)

**Função `fetchLiveActivePool()`** adicionada antes do bloco THEME:
- Contratos: `NFT_MGR = '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1'` (Base NonfungiblePositionManager), `POOL = '0x6c561B446416E1A00E8E93E221854d6eA4171372'` (Base WETH/USDC 0.30%), `TOKEN_ID = 4694262`
- Constantes: `ENTRY_CAPITAL = 365`, `OPEN_TS = new Date('2026-03-18').getTime() / 1000`
- RPCs: `['https://base-mainnet.g.alchemy.com/v2/R_9y5DBqKNR2NapexG8n7', 'https://mainnet.base.org', 'https://base.llamarpc.com', 'https://base.drpc.org']`
- Lógica completa com BigInt: `positions()`, `slot0()`, `feeGrowthGlobal0X128`/`feeGrowthGlobal1X128`, dados do tick inferior e superior, cálculo de liquidez `SqrtPriceMath`, fees não coletadas em wei → USD
- Atualiza `POOLS[0].days`, `POOLS[0].fees`, `POOLS[0].il`, `POOLS[0].result` com dados ao vivo
- Atualiza DOM: `kpi-liq` (valor pooled em $) e `kpi-apr` (Fee APR = `fees / ENTRY_CAPITAL / days * 365 * 100`)
- Helper `fetchTimeout()` adicionado — `Promise.race` com timeout de 8s por RPC
- Helper `getLivePrice(ids)` adicionado — CoinGecko com fallback Jupiter, cache 60s em `window._priceCache`
- Chamada em `init()`: `fetchLiveActivePool().catch(e => console.debug(...))`

**Resultado verificado via preview_eval:** `kpi-apr: "+43.0%"`, `kpi-liq: "$325"`, `POOLS[0].days: 41, fees: 17.54` — dados corretos conforme Base RPC.

#### `pools.html` — Solana adicionado ao explorador de APR

**Mapeamentos adicionados:**
```js
WETH = { solana: 'So11111111111111111111111111111111111111112' }
NET_COLOR = { solana: '#14F195' }
NET_SHORT  = { solana: 'SOL' }
UNI_LINK   = { solana: 'https://www.geckoterminal.com/solana/pools/' }
```

**Chip "Solana" (verde)** adicionado à linha de filtros de rede.

**`fetchNet()` — branch Solana:**
```js
if (net === 'solana') {
  const url = `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${WETH.solana}/pools?...`;
  // filtra TVL >= $100K, detecta Orca/Raydium via relationships.dex.data.id
  // top 25 por APR
}
```

**`protoBadge`** adicionado em `rowHtml()` — exibe badge "ORCA" (verde) ou "RAYDIUM" (roxo) para pools Solana.

**Stagger:** `loadNet('solana')` com delay de 20s em `loadAllUniPools` e `DOMContentLoaded` para evitar HTTP 429.

**Seção atualizada:** label "DEX — Melhores APRs (ETH · Base · Arbitrum · Solana)"; footer menciona Orca + Raydium + filtro TVL mín $100K.

**"↗ ABRIR TRACK" button** adicionado no Registro Histórico — link dourado para `track.html` com nota explicativa no rodapé.

#### Nav "Track" adicionada em todas as páginas

| Arquivo | Mudança |
|---------|---------|
| `pools.html` | `<a href="track.html" data-i18n="nav-track">Track</a>` + `LANG_STRINGS['nav-track']` |
| `portfolio_analytics.html` | idem |
| `emprestimos.html` | idem |
| `ferramentas.html` | idem + fix: `data-i18n="nav-pools"` que estava faltando no link de pools |

### Dados atualizados

Nenhum dado de posição alterado. `track.html` passou a derivar `days`, `fees`, `result` da pool ativa diretamente do Base RPC em tempo real.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| APR card em track.html sempre "—" | Não havia fetch on-chain implementado; valores derivados do array estático `POOLS` | `fetchLiveActivePool()` implementado com Base RPC + BigInt math |
| Nav sem "Track" em 4 páginas | Link nunca foi adicionado na sessão de criação do track.html | `<a href="track.html">` adicionado em todas as páginas |
| `ferramentas.html` link "Pools" sem data-i18n | Esquecido na criação original | `data-i18n="nav-pools"` adicionado |

### Discussão estratégica — Site como plataforma SaaS

Lucas perguntou sobre viabilidade de transformar o site em multi-usuário (cadastro + wallet connect + CSV import).

**3 opções avaliadas:**
1. **Wallet Connect puro** — `ethers.js` + RainbowKit + Wagmi; detecta posições Uniswap V3, Aave, Kamino automaticamente; 2–4 semanas; sem backend
2. **CSV Import** — upload de CSV Binance/CoinGecko/Aave; parser front-end; simples mas experiência pior
3. **Backend SaaS** — auth, DB, billing; $15–30/mês infra; meses de dev; necessário para escala

**Recomendação dada:** começar pelo Wallet Connect como proof-of-concept — sem backend, funciona 100% no browser, já resolve o problema de Lucas de não precisar hardcodar dados.

**Barreira maior identificada:** não é técnica — é UX/onboarding. Usuário DeFi precisa entender o que o site faz antes de conectar a carteira. Sugestão: landing page clara + "demo mode" com dados de exemplo.

### Conteúdo da mentoria — "How to Survive a Crypto Cycle" (Fred Ehrsam, Paradigm, 2021)

PDF lido e analisado. 6 insights aplicados à realidade de Lucas:

1. **"Tudo morre no bear exceto o que tem produto-market fit real"** — AAVE, Uniswap e Kamino sobreviveram; GRIFT e tokens de narrativa não. Lucas já está nos protocolos certos.
2. **"Cash (stables) = optionalidade, não fraqueza"** — $2.4K em USDT/USDS não é posição perdida; é poder de compra esperando assimetria. O bear é quando os retornos são plantados.
3. **"Yield sem entender o risco é o caminho mais rápido para zero"** — experiência do GRIFT/PEANUT válida. A separação atual (5% em pools, resto passivo) é exatamente o framework sugerido.
4. **"Ciclos duram mais do que você espera — nos dois sentidos"** — bull mercados convencem que vai durar para sempre, bears convencem que nunca vai voltar. Calendário de DCA força disciplina mecânica.
5. **"A virada de ciclo não é anunciada"** — indicadores a monitorar: BTC dominância caindo + altcoin season index + stablecoin supply crescendo. Lucas já tem Fear & Greed no dashboard.
6. **"Sobreviver para o próximo ciclo é a estratégia"** — preservação de capital é alpha. Lucas já executa isso: lending conservador, sem alavancagem agressiva, pools como exit strategy.

### Commits

- `cb25616` — feat: track.html live on-chain fetch + Solana pools no APR explorer
- `57065cd` — feat: aba Track adicionada ao nav de todas as páginas

### O que ainda falta

- **`wealthCurve` Abr/2026** — adicionar ponto após 30/04/2026 (Lucas avisa com print)
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **CSVs das CEX** — Binance/Bybit/OKX para custo de aquisição em BRL e base para IR
- **`relatorio.html`** — ainda não tem link "Track" no nav (só tem "← Pools" e "Analytics")
- **Continuação mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT
- **Validar calcLevHedge()** — rodar cenários com pool atual ($365) e hipotética ($2000)
- **i18n painel Sizing & Risk** — labels só em PT; adicionar strings EN
- **APR pool Base** — só via uncollected fees; Collect events históricos não contabilizados
- **Wallet Connect** — proof-of-concept para detectar posições automaticamente (avaliado mas não implementado)

---

## Sessão 03/05/2026 — Aave V4 Hub-and-Spoke live fetch (3 arquivos)

### Implementado

- **`emprestimos.html`** — `fetchAave()` reescrito para V4: queries MAIN_SPOKE (`0x94e7A5dCbE816e498b89aB752661904E2F56c485`) + BLUECHIP_SPOKE (`0x973a023A77420ba610f06b3858aD991Df6d85A08`) em paralelo. Selector V4: `0x91b89fba`. Offsets do struct: `[2]`=HF(WAD), `[3]`=collateral(8dec USD), `[4]`=debt(RAY). Per-asset qty derivada dos totais USD (sem aToken V4 calls). USDC borrow (não GHO). Sanity checks mantidos (collateral < 100, HF > 1e15, !isFinite).
- **`portfolio_analytics.html`** — `fetchAave()` reescrito (versão simplificada — só HF + totais para exec bar). `fetchAaveApys()` corrigido: `GHO_ADDR` → `USDC_ADDR` (borrow token atual). Constantes V3 (`AAVE_POOL`, `GHO_ADDR`) removidas; V4 spokes adicionados.
- **`pools.html`** — Dois lugares atualizados: (1) `fetchAaveData()` IIFE standalone: ETH_QTY 1.87→1.88, USDT_QTY 1651.49→1985.68, USDT_LT 0.75→0.775; `callAave()` reescrito com parseSpoke V4. (2) `fetchAave()` no `initWalletFetch`: mesmo padrão V4 do portfolio_analytics.

### Bugs corrigidos

| Bug | Fix |
|-----|-----|
| `fetchAave()` usava V3 `AAVE_POOL` (`0x87870...`) — depreciado na V4 | Substituído por MAIN_SPOKE + BLUECHIP_SPOKE com selector V4 `0x91b89fba` |
| `fetchAaveApys()` em `portfolio_analytics.html` buscava APY do GHO (token trocado em 10/04) | `GHO_ADDR` → `USDC_ADDR` (`0xA0b8...`) |
| Brace counter reportava depth=-1 em script[8] | Falso positivo — `{` dentro de template literals contados incorretamente; confirmado pré-existente via `git stash` |

### O que ainda falta
- **`wealthCurve` Abr/2026** — Lucas avisa com print após 30/04/2026
- **`monthlyReturns[2026].Abr`** — preencher ao final do mês
- **CSVs das CEX** — custo BRL + IR
- **Verificar V4 fetch ao vivo** — sandbox bloqueou RPC durante desenvolvimento; confirmar selector `0x91b89fba` e offsets [2,3,4] funcionando em produção

---

## Sessão 04/05/2026 — Atualização de posições + wealthCurve Abr/26 + Standup semanal

### Implementado

#### Standup
Cron `daily-standup-barolo` mudado de diário (`30 8 * * *`) para **semanal sextas** (`30 8 * * 5`). Description renomeada para "Weekly Standup para CEO - Barolo Capital (sextas)".

#### Posições atualizadas (prints CoinGecko + AAVE V4 + Kamino, 04/05/2026)

| Campo | Antes | Depois |
|---|---|---|
| AAVE USDT supply | 1985.68 | **1990** |
| AAVE WETH APY | 1.25% | **2.50%** |
| AAVE USDT APY | 1.87% (fallback 9.26%) | **1.77%** |
| AAVE borrow | 748 USDC @ 2.32% | **750.16 USDC @ 3.79%** |
| Kamino SOL supply | 20.39 | **20.42** |
| Kamino USDS supply | 300.78 | **301.01** |
| Kamino borrow | 807.49 USDC @ 6.90% | **808.77 USDC @ 4.64%** |
| Kamino SOL APY | 4.22% | **5.26%** |
| Kamino USDS APY | 3.69% | **4.61%** |
| Kamino LTV | 39.22% | **40.07%** |
| STABLES_USD | 2440.90 | **2441.13** (USDT 2140.12 + USDS 301.01) |
| TOTAL_DEBT | 1555.49 | **1558.93** (750.16 + 808.77) |

Arquivos atualizados: `portfolio_analytics.html`, `emprestimos.html`, `pools.html`, `index.html`, `relatorio.html`, `ferramentas.html`.

Em `relatorio.html`: bloco `AAVE_*_APY` / `KAM_*_APY` totalmente revisado com APYs ao vivo dos prints.

Em `ferramentas.html`: `BASE` do simulador de cenários (`aaveDebt`, `kamDebt`, `aaveUSDT`, `kamPYUSD`, `kamSOL`, `solQty`) + inputs HTML da calculadora de liquidação + `checkAlerts()` + `loadBaroloScenario()` (supapy 1.5→2.1, brw 2.32→3.79).

Em `emprestimos.html`: card live + ciclo K4 + ciclo A3 badge + KPI dívida + ticker + timeline (entrada nova `04/05/26 AAVE borrow ≈$750`).

Em `pools.html`: `AAVE_BORROW_RATE` 2.32→3.79, custo borrow card −2.32→−3.79, `STABLES` 2369.88→2441.13, `USDT_QTY` 1985.68→1990.

#### `portfolio_analytics.html` — `wealthCurve` Abr/2026 adicionado

Ponto adicionado: `04/26 = $9,206` (saldo CoinGecko atual). `invested` Abr/26 = `6684` (Mar 6418 + USDT compras Abr ~$266).

`monthlyReturns[2026].Abr` deixado como `null` — metodologia de cálculo (TWR vs raw curve) não bate exatamente; aguardando confirmação para preencher.

### O que ainda falta

- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada (Mar não bate com cálculo direto da curva, sugerindo TWR com inflows removidos)
- **CSVs das CEX** — Lucas traz para custo BRL + IR
- **Verificar V4 fetch ao vivo** — confirmar em produção que selector `0x91b89fba` + offsets [2,3,4] retornam dados corretos
- **i18n painel Sizing & Risk** — só em PT
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho, Gearbox, Drift, Hyperliquid HLP, Pendle PT
- **Wallet Connect PoC** — avaliado mas não implementado

---

