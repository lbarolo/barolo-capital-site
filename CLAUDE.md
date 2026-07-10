# Barolo Capital — Briefing para Claude Code

## O que é este projeto

Dashboard DeFi pessoal e institucional de **Lucas (Barolo Capital)** — gestora individual de capital em criptoativos desde 2021 (1ª compra ETH em 13/12/2021). Filosofia: acumulação de longo prazo (+10 anos), DCA mensal em ETH/SOL/ADA, uso de DeFi como ferramenta de yield e estratégia de saída.

Todas as páginas são **HTML estático puro** (sem framework, sem build step). Hospedado no GitHub e aberto diretamente como `file://` ou via servidor local simples.

---

## POLÍTICA DE PRIVACIDADE (IMPORTANTE)

**Lucas quer ser EFETIVO, não VISTO.**

### Regras de Privacidade:

1. **❌ NÃO EXPONHA endereços de wallet em links públicos**
   - ❌ Revert: `https://revert.finance/#/account/0x5Ff...4B6`
   - ✅ Revert: `https://revert.finance/`
   - Os endereços podem estar no JavaScript (necessário para fetch), mas NÃO em URLs públicas

2. **❌ NÃO REVELE identificadores únicos**
   - ❌ NFT ID: `#4694262` em comentários ou descrições
   - ❌ Cardano address completo em arquivos públicos
   - ✅ Use genéricos: "sua carteira", "sua pool ativa"

3. **✅ MANTENHA anonimato online**
   - `robots.txt`: bloqueia ALL crawlers
   - Meta `noindex, nofollow`: em todo HTML
   - Site NÃO aparece no Google
   - Links não expõem carteira

4. **❌ NÃO CRIE dados pessoais**
   - ❌ Nomes, endereços, telefones
   - ❌ Datas de nascimento ou eventos pessoais
   - ✅ Dados financeiros (apenas números, sem contexto pessoal)

### Objetivo:
O site é **prova de competência técnica**, não **portfolio público**. Funcionalidade sim, exposição não.

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

## Posições atuais (baseline 20/06/2026 — snapshot `EXPORTS SEMANAIS/JUNHO/20-06-26-posicoes.json`)

> **IMPORTANTE — metodologia de patrimônio:** o portfólio do CoinGecko (e o array `PORTFOLIO_DATA`) **já inclui** os tokens depositados como colateral na AAVE/Kamino — Lucas não separa carteira vs DeFi no CoinGecko. Portanto `Patrimônio = total CoinGecko − dívida`. **NUNCA somar o colateral AAVE/Kamino por cima do total do CoinGecko** (seria dupla contagem). O breakdown AAVE/Kamino abaixo é uma *view* do lending, não posições aditivas. (Confirmado por Lucas em 23/06/2026.)

### Portfolio de tokens (CoinGecko — inclui colateral DeFi)
| Token | Quantidade | Invested | Cor no gráfico |
|-------|-----------|----------|----------------|
| BTC | 0.00204156 | $135.74 | #F7931A |
| ETH | 2.37632741 | $4,880.53 | #E8773D |
| SOL | 23.31 | $2,450.94 | #14F195 |
| ADA | 375.245 | $530.95 | #3773F5 |
| EIGEN | 153.363 | $45.87 | #6B3FF5 |
| RDNT | 7290.46 | $0 (airdrop) | #00D4FF |
| POL | 218 | $143.88 | #A855F7 |
| ZK | 876 | $0 (airdrop) | #1E90FF |
| XAI | 692.86 | $164.52 | #F59E0B |
| ZETA | 51.1434 | $0 (airdrop) | #00C896 |
| SCR | 0.0018 | $0 | #FFB800 |

### AAVE V4 (view do lending — já contido no CoinGecko)
- Supply: 2.16 WETH + 1,300 USDT (APY 1.36% / 1.60%)
- Borrow: **754.65 USDC @ 5.38%** (spike de 21.66% em 12/06 normalizou: 7.59% → 5.38%)
- Health Factor: ~5.60 | Net deposit APY: 1.42% (carry ainda levemente negativo)

### Kamino Finance (Solana — view do lending)
- Supply: 23.36 SOL + 302.25 USDS (APY 4.89% / 5.00%)
- Borrow: **815.97 USDC @ 5.69%**
- LTV: 41.20% | Liq. LTV: 77.29% | Net APY: 4.35% | Juros ganhos acum.: +$134.79

### Pool ativa Uniswap V3 (WETH/USDC 0.3% · Base)
- Capital $365 · Pooled $325 · Fees totais $21.11 (uncollected $18.62) · IL −$28.20 · PnL −$9.58 · APR 0.43% · 94 dias
- ETH ~$1.727 < range min $1.822 → **fora do range** (100% WETH, fees ~$0/dia)

### Totais (20/06/2026)
- **STABLES**: USDT $1,302.52 + USDS $300 = **$1,602.52**
- **DÍVIDA TOTAL**: $754.65 (AAVE) + $815.97 (Kamino) = **$1,570.62**
- **PATRIMÔNIO LÍQUIDO**: ~$6,406 (CoinGecko $7,650.91 + LP − dívida)
- **TOTAL INVESTIDO**: $9,954.95 | **ROI**: −23.13% | **Leverage**: 0.245x

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

### Pool ATIVA — Dados completos (verificados on-chain em 10/06/2026)

**NUNCA assumir Ethereum — esta pool está na Base.**

A pool anterior (token ID 4694262, range $1,855.72–$3,146.36, aberta 24/02/2026) foi **encerrada em 03/06/2026** (saiu por baixo do range; fees $22.28, result +$15.73) e substituída no mesmo dia por uma nova posição:

| Campo | Valor |
|---|---|
| Par | WETH/USDC 0.30% |
| Protocolo | Uniswap V3 |
| **Rede** | **Base** (chain_id=8453) |
| Carteira | `0x5Ff957C19A03aF57B5098F3F395A578E394aE4B6` |
| Token ID | **5247352** |
| Pool contract | `0x6c561B446416E1A00E8E93E221854d6eA4171372` (token0=WETH, token1=USDC) |
| Abertura | 03/06/2026 (17:20 UTC) |
| Capital entrada | 0.18 WETH ($329 @ ETH $1,828) — **100% WETH, zero USDC** |
| Range mínimo | **$1,822.61** (tick -201240) |
| Range máximo | **$2,401.90** (tick -198480) |
| Preço médio efetivo de saída | **$2,092** (√(1822.61 × 2401.90)) |
| Estratégia | Saída gradual ETH→USDC: entra 100% WETH, sai 100% USDC ao atingir $2,402 |
| Estado 10/06/2026 | ETH ~$1,630 → **FORA DO RANGE (abaixo)** — 100% WETH, fees $0 |
| Monitorar em | https://revert.finance/ |

**Referência: sempre em USD** — não usar HOLD nem ETH como referência de performance.

**Para buscar dados on-chain:** usar Base RPC público (`https://mainnet.base.org`, `https://base.drpc.org`) — a key Alchemy do projeto NÃO tem Base habilitada. Nunca Ethereum.

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

## Sessão 04/05/2026 (continuação) — track.html: nav, KPIs, detalhe expandido, gráficos ap-panel, e dois novos gráficos (preço + liquidez)

### Contexto
Sessão continuada em worktree `agitated-faraday-439f56`. Todas as mudanças foram em `track.html`. Commit `499c376` → merge → push main.

### Implementado

#### `track.html` — Nav logo idêntica às outras páginas
- SVG `BAROLO CAPITAL` com linhas de gradiente dourado (linear, transparent→gold→transparent) substituiu o `B` simples que estava no nav
- CSS do nav reescrito para bater exatamente com `pools.html`: `font-size:10px`, `letter-spacing:0.1em`, `text-transform:uppercase`, fundo `rgba(242,236,224,0.97)` light / `rgba(13,9,23,0.96)` dark
- Links nav: Início · Portfolio · Pools & DeFi · **Track** (active) · Empréstimos · Ferramentas
- `.nav-links a.active` com borda dourada sutil; `.btn-sm` com `font-size:9px` e `letter-spacing:0.08em`

#### `track.html` — KPI cards separados com bordas
- `.kpi-grid`: `gap: 1px; background: var(--border)` → `gap: 12px`
- Cada `.kpi-card` ganhou `border: 1px solid var(--border); border-radius: 12px` (antes era só background)
- Resultado: 4 cards soltos com gap, ao invés de grid conectado

#### `track.html` — Linha de detalhe expandida (`.detail-content`)
- `.d-item` ganhou: `background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px`
- Card **Range** movido para primeira posição no grid
- Range split: `rangeMain = p.range.split(' (')[0]` → mostra só `$1,855 – $3,146`; sub-label separado com `regex.match(/\((.*?)\)/)` → `saída gradual ETH→USDC`
- `.d-value` Range com `white-space:nowrap` para não quebrar linha

#### `track.html` — Gráfico no detalhe expandido (`.detail-chart-wrap`)
- Canvas `id="dc-{poolId}"` dentro do detalhe expandido
- Abas: PnL · Assets value · APR · Fees · Div. loss
- `buildDetailChart(p, metric)` — linha colorida com gradiente fill, 9 pontos sintéticos históricos, tooltip com valor e delta
- `switchDetailChart(cid, metric, btn, poolId)` — troca aba e reconstrói chart
- `setTimeout(() => buildDetailChart(ep, 'pnl'), 60)` — chamado após `tbody.innerHTML = html`

#### `track.html` — Gráfico no ap-panel (estilo Revert Finance)
- `.ap-chart-section` adicionado abaixo do `.ap-kpi-row`
- Canvas `id="apChart"` com 5 abas: PnL · Assets value · APR · Fees APR · Div. loss
- `buildApChart(metric, p)` com `fill: { target: 'origin', above: 'rgba(63,185,80,0.22)', below: 'rgba(248,81,73,0.2)' }` — verde acima do zero, vermelho abaixo
- Header: valor atual + delta em tooltip lateral
- `switchApChart(metric, btn)` — troca aba

#### `track.html` — Cor da linha verde/vermelho (user request desta sessão)
- `buildApChart`: `borderColor` era `'#d0d0d0'` fixo → agora `last >= 0 ? '#3fb950' : '#f85149'`
- `buildDetailChart`: PnL usa `pnlNow >= 0 ? '#3fb950' : '#f85149'`; Div.loss usa `ilNow >= 0 ? '#3fb950' : '#f85149'`
- Resultado: linha verde quando o valor atual é positivo, vermelha quando negativo

#### `track.html` — Gráfico de preço WETH/USDC com range (novo)
- `_priceChart` (Chart.js line chart) + `buildPriceChart(currentEth)` (async)
- Fetch: `CoinGecko /coins/ethereum/market_chart?vs_currency=usd&days=75&interval=daily` → filtra a partir de 01/03/2026
- Linha dourada `#c9a050`, sem fill, tension=0.2
- Anotações via `chartjs-plugin-annotation@3.1.0`:
  - `lineMin`: linha horizontal `yMin=yMax=1855.72`, roxa tracejada, label "MIN $1,856"
  - `lineMax`: linha horizontal `yMin=yMax=3146.36`, roxa tracejada, label "MAX $3,146"
  - `deposit`: linha vertical no label '18/Mar', dourada tracejada, label "D"
- Fallback sintético se CoinGecko falhar (10 pontos mar→mai/2026)
- Chamado em `fetchLiveActivePool()` após fetch bem-sucedido

#### `track.html` — Gráfico de distribuição de liquidez (novo)
- `_liqDistChart` (Chart.js bar chart) + `buildLiqDistChart(currentEth)`
- Barra por faixa de $100, de $1,000 a $5,000 (41 barras)
- Barras **verdes** dentro do range [$1,856, $3,146]; **acinzentadas** fora
- Curva sintética: bell gaussiana centrada em $2,500 (meio do range) dentro; decaimento exponencial fora
- Anotações:
  - `minLine`: vertical no label mais próximo de MIN, roxo tracejado, label "MIN"
  - `maxLine`: vertical no label mais próximo de MAX, roxo tracejado, label "MAX"
  - `curPrice`: vertical no preço atual ETH, branco/escuro, label com valor "$X,XXX"
- Eixo Y oculto; eixo X mostra só ticks múltiplos de $500 ('$1.0K', '$1.5K', etc.)
- Chamado em `init()` com fallback `eth=1850` e atualizado em `fetchLiveActivePool()`

#### `chartjs-plugin-annotation@3.1.0` adicionado ao `<head>`
```html
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.1.0/dist/chartjs-plugin-annotation.min.js"></script>
```
Plugin registra automaticamente com Chart.js quando carregado.

### Dados atualizados
Nenhum dado de posição alterado nesta sessão.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Nav de track.html diferente das outras páginas | CSS tinha font-size maior, sem uppercase, fundo errado no light | Reescrito para copiar exatamente o CSS do pools.html |
| KPI cards colados (grid sem gap) | `gap: 1px; background: var(--border)` criava visual de tabela | `gap: 12px` + border individual em cada card |
| Range do card expandido quebrava linha | `.d-value` sem `white-space:nowrap` | Adicionado `white-space:nowrap`; texto dividido em duas linhas (valor + nota) |
| Linha do gráfico sempre cinza (#d0d0d0) | `borderColor` fixo no buildApChart | Dinâmico: verde se ≥0, vermelho se <0 |
| PnL e Div.loss sempre vermelhos no detail chart | `color:'#f85149'` fixo mesmo quando positivo | Cor calculada do valor atual: `pnlNow >= 0 ? '#3fb950' : '#f85149'` |

### O que ainda falta

- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — Lucas traz para custo BRL + IR
- **Verificar V4 fetch ao vivo** — selector `0x91b89fba` + offsets [2,3,4] em produção
- **i18n painel Sizing & Risk** — labels só em PT; falta strings EN
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho, Gearbox, Drift, Hyperliquid HLP, Pendle PT
- **APR pool Base** — só via uncollected fees; Collect events históricos não contabilizados
- **`buildPriceChart`** — confirmar em produção que CoinGecko retorna dados filtrados corretamente a partir de 01/03/2026; verificar se label '18/Mar' existe no array para o marcador D
- **Distribuição de liquidez real** — a atual é sintética (estimada); leitura real exigiria Uniswap V3 subgraph com scan de ticks

---

## Sessão 06/05/2026 — track.html visual refinements + Unclaimed Fees KPI card + font size increase

### Contexto
Sessão iniciada retomando de context esgotado. O redesign visual de track.html estava em progresso (cards grid, gráficos side-by-side). Finalizadas as mudanças de UI e JS relacionadas ao novo card KPI "Unclaimed Fees".

### Implementado

#### `track.html` — Aumento de fontes nos cards de métricas
**Objetivo:** match font sizes no ap-metrics-grid com a hierarquia visual do KPI section superior.

| Classe CSS | Antes | Depois | Elemento |
|-----------|-------|--------|----------|
| `.ap-metric-label` | 9px | 10px | Label (ex: "Current Assets") |
| `.ap-metric-item` | 11px | 13px | Nome do ativo (ex: "WETH") + espaçamento gap 6→8px |
| `.ap-metric-tok` | 10px | 12px | Símbolo do token em monospace |
| `.ap-metric-val` | 16px | 20px | Valor principal (ex: "0.0774") |
| `.ap-metric-val-large` | 22px | 28px | Valor destacado em cards grandes |
| `.ap-metric-box` | — | padding 10→12px, 12→14px | Aumentado padding interno dos boxes |

**Mudança de cor:** `.ap-metric-item` color `var(--muted)` → `var(--text)` (mais legível nos nomes de ativos)

#### `track.html` — Novo card KPI "Unclaimed Fees"
**Estrutura HTML:** 5º card adicionado no `.kpi-grid`, logo após "Liquidez Atual":
```html
<div class="kpi-card">
  <div class="kpi-label">Unclaimed Fees</div>
  <div class="kpi-value pos" id="kpi-unclaimed">—</div>
  <div class="kpi-sub" id="kpi-unclaimed-sub">—</div>
</div>
```

**Ordem final dos KPIs:** Liquidez Atual · **Unclaimed Fees** (novo) · Taxas Acumuladas · APR Pool Ativa · Profit/Loss

**Renomear card anterior:** "Unclaimed / Claimed Fees" → "Taxas Acumuladas" (reflete melhor que são fees já coletadas, não em análise)

#### `track.html` — Código JavaScript para popular Unclaimed Fees KPI
**Novo bloco adicionado em `fetchLiveActivePool()` (após o bloco `kpi-apr`, antes de `computeKPIs()`):**
```js
// Update Unclaimed Fees KPI
const unclaimedEl = document.getElementById('kpi-unclaimed');
if (unclaimedEl) {
  unclaimedEl.textContent = fmtUsd(uncFeeUsd, 2);
  unclaimedEl.className = 'kpi-value pos';
}
const unclaimedSubEl = document.getElementById('kpi-unclaimed-sub');
if (unclaimedSubEl) unclaimedSubEl.innerHTML =
  `<span class="live-dot"></span>${uncW.toFixed(6)} WETH + ${uncU.toFixed(2)} USDC`;
```

**Fonte de dados:**
- `uncFeeUsd` — valor total em USD dos fees não coletados (calculado via BigInt math from on-chain)
- `uncW` — WETH não coletado (wei → 1e18)
- `uncU` — USDC não coletado (wei → 1e6)
- Live dot indicator mostra que é atualizado em tempo real

### Dados atualizados
Nenhum dado de posição alterado nesta sessão. Apenas refinamentos visuais.

### Bugs corrigidos

| Bug | Causa raiz | Fix aplicado |
|-----|-----------|--------------|
| Cards de métricas com fontes pequenas (11-16px) | Cópia de design de outra página, não otimizado para legibilidade | Aumentadas todas as fontes: label 9→10, item 11→13, val 16→20, val-large 22→28px |
| Sem card específico para "Unclaimed Fees" | KPI anterior "Unclaimed / Claimed Fees" misturava dois conceitos | Separado em dois cards: novo "Unclaimed Fees" (ao vivo) + "Taxas Acumuladas" (total histórico) |
| KPI card novo sem JavaScript | HTML inserido mas sem código para preencher os IDs | Adicionado bloco em `fetchLiveActivePool()` que popula `kpi-unclaimed` e `kpi-unclaimed-sub` |

### Commits realizados
1. **`26c4391`** — `feat: track.html visual + entry data fix + LP pooled live propagation`
   - Aumentos de font-size em ap-metric-* classes
   - Novo card KPI "Unclaimed Fees" no HTML
   - Rename "Unclaimed / Claimed Fees" → "Taxas Acumuladas"

2. **`e56a5f1`** — `feat: populate Unclaimed Fees KPI card with live data`
   - Código JavaScript para preencher `kpi-unclaimed` e `kpi-unclaimed-sub`
   - Display de valor USD total + breakdown WETH + USDC

### O que ainda falta

- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — Lucas traz para custo BRL + IR
- **Verificar V4 fetch ao vivo** — selector `0x91b89fba` + offsets [2,3,4] em produção
- **i18n painel Sizing & Risk** — labels só em PT; falta strings EN
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho, Gearbox, Drift, Hyperliquid HLP, Pendle PT
- **Distribuição de liquidez real** — a atual é sintética; leitura real exigiria Uniswap V3 subgraph
- **Track.html responsividade mobile** — charts podem sair do quadro em telas pequenas

---

## Sessão 08–09/05/2026 — Code review geral: AAVE V4 GraphQL + Kamino novo endpoint (3 arquivos)

### Contexto
Sessão iniciada com revisão geral de código ("ver se está tudo rodando certinho, sem erros, e atualizando automaticamente da blockchain"). Encontrados dois bugs críticos que impediam todos os fetches ao vivo de funcionar.

### Bugs corrigidos

#### `emprestimos.html` — SyntaxError por `const` duplicado em `fetchAave()` (vinha da sessão anterior)
- Duas declarações idênticas de `wethApy`, `usdtApy`, `usdcApy`, `ethUsd` dentro do mesmo bloco `try`
- JavaScript ParseError silencioso: função parseada como `undefined`, nunca executada
- Fix: bloco duplicado removido (mantida apenas a primeira declaração em linha ~1774)

#### `emprestimos.html` — Yield section hardcoded (sem IDs, sem atualização ao vivo)
- "228 dias", "128 dias", "≈ $57", "≈ $115" eram strings estáticas no HTML sem IDs
- Fix: IDs adicionados a todos os valores (`yd-aave-yield`, `yd-kamino-yield`, etc.) + função `updateYieldSection()` que calcula dinamicamente e é chamada em `runFetch()`

#### AAVE V4 — V3 aToken addresses retornando 0 (causa raiz da zeragem)
- `AWETH_TOKEN = '0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8'` (V3 aWETH) e `AUSDT_TOKEN = '0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a'` (V3 aUSDT) retornam 0 porque a posição foi migrada para V4
- Todos os sanity checks falhavam (`wethQty < 0.01`), `fetchAave()` retornava `null`, UI mostrava dados estáticos
- **Fix:** `fetchAave()` substituído completamente — agora usa `api.aave.com/graphql`:
  - `userSummary` → `totalCollateral.value`, `totalDebt.value`, `lowestHealthFactor`
  - `userSupplies` → wethQty (`0xC02a...` = WETH), usdtQty (`0xdAC1...` = USDT)
  - `userBorrows` → usdcQty (`0xA0b8...` = USDC)
  - Tudo em paralelo com `fetchAaveApys()` (DataProvider, sem alteração)
- **Resultado verificado:** `WETH=1.884 USDT=1992 USDC_debt=750.66 HF=6.88`

#### Kamino — `/user-metadata/{wallet}/obligations` retornando 404 (endpoint descontinuado)
- API Kamino mudou: endpoint antigo deprecado, dados não disponíveis nesta rota
- **Fix:** novo fluxo em 2 passos:
  1. `/kamino-market/{market}/users/{wallet}/obligations` → `obligationAddress`
  2. `/klend/loans/{obligationAddress}` → `tokenAmount`, `tokenValue`, `currentLtv`, `liquidationLtv`
  3. `/kamino-market/{market}/reserves/metrics` → `supplyApy`, `borrowApy` por mint
- **Resultado verificado:** `Deposit $2182 Borrow $809 SOL 20.43 LTV 37.1%`
- Aplicado em **3 arquivos**: `emprestimos.html`, `portfolio_analytics.html`, `pools.html`
  - Em `pools.html` também corrigido `USER_WALLET` (era `xXfd2g...` = obligation address, não wallet Solana) → `Fq1F49...` (wallet correto)
  - `FIXED.solQty 19.33 → 20.42`, `FIXED.debtUsd 804.22 → 808.77`

### AAVE GraphQL API — campos descobertos via introspection

| Tipo | Campo | Formato |
|------|-------|---------|
| `userSummary` | `totalCollateral { value }` | String decimal USD |
| `userSummary` | `totalDebt { value }` | String decimal USD |
| `userSummary` | `lowestHealthFactor` | BigDecimal (sem subfields) |
| `userSupplies request` | `query: { userChains: { user, chainIds: [1] } }` | Oneof input |
| `userSupplies request` | `orderBy: { amount: DESC }` | Input object |
| `UserSupplyItem` | `balance { amount { value } token { address } }` | Endereço lowercase |
| `userBorrows` | `debt { amount { value } token { address } }` | Mesmo padrão |

### Kamino API — endpoints ativos descobertos

| Endpoint | Retorna |
|----------|---------|
| `/kamino-market/{market}/users/{wallet}/obligations` | Lista de obligations com `obligationAddress` |
| `/klend/loans/{obligationAddress}` | `loanInfo.collateral.deposits[].{tokenMint, tokenAmount, tokenValue}` + `loanInfo.debt.borrows[]` + `loanInfo.currentLtv` + `loanInfo.liquidationLtv` |
| `/kamino-market/{market}/reserves/metrics` | `{ liquidityTokenMint, supplyApy, borrowApy }[]` |

### Globals verificados após fix

```json
{ "aaveHF": 6.88, "aaveDebt": 750.57, "aaveWeth": 1.884, "aaveUsdt": 1992.4,
  "kaminoDebt": 809.24, "kaminoDeposit": 2182.48, "kaminoSol": 20.43 }
```

### Commit
- **`339d8e4`** — `fix: AAVE V4 GraphQL API + Kamino new endpoint (all 3 files)`

### O que ainda falta

- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — Lucas traz para custo BRL + IR
- **i18n painel Sizing & Risk** — labels só em PT; falta strings EN
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho, Gearbox, Drift, Hyperliquid HLP, Pendle PT
- **Distribuição de liquidez real** — a atual é sintética (track.html)
- **Track.html responsividade mobile** — charts podem sair do quadro em telas pequenas

---

## Sessão 16/05/2026 — track.html redesign estilo Metrix (overview + pool rows + range bar)

### Contexto
Sessão continuou de context esgotado. Havia uma tarefa pendente: implementar o overview estilo Metrix em `track.html` e verificar/publicar. Usuário também enviou print do Metrix para guiar o redesign da lista de pools.

### Implementado

#### `track.html` — Overview estilo Metrix (2 colunas: gráfico + stats panel)

**Seção `.track-overview` adicionada** entre o page-header e os KPI cards (que foram ocultados com `display:none`):

**Coluna esquerda (gráfico):**
- Label `ov-chart-mode-label` + número grande `ov-total` no header
- Botão `↻` (`id="refreshBtn"`, `onclick="refreshAll()"`) ao lado de "atualizado X ago"
- Controles em uma linha com `justify-content:space-between`:
  - Period tabs esquerda: `7D | 1M | 3M | YTD | All` (`.track-period-tab`)
  - Value/Earnings toggle direita (`.track-vt-toggle` dentro de `.track-chart-controls`)
- Canvas `ovChart` em wrapper `position:relative; height:185px`

**Coluna direita (stats panel, largura 272px):**
- Tabs `Stats | Exposure` (`.track-stat-tab`)
- **Stats**: Earnings (`ov-earnings`), Pending (`ov-pending`), APR (`ov-apr`), divider, Profit & Loss (`ov-pnl`), vs HODL (`ov-vs-hodl`), ROI (`ov-roi`)
- **Exposure**: barras WETH/USDC (`ov-exp-weth/usdc-bar/pct`), ETH price (`ov-exp-price`), in-range (`ov-in-range`)

**JS — funções novas:**

| Função | O que faz |
|--------|-----------|
| `updateOvStats()` | Soma todos os POOLS: totFees, totPnl, totIL, totCap → preenche todos os IDs do stats panel |
| `_updateOvTotal()` | Atualiza `ov-total` com P&L ou fees brutas dependendo de `_ovMode` |
| `buildOvChart()` | Chart.js line area, verde/vermelho baseado no delta do período selecionado |
| `_buildOvPoints(period, mode)` | Gera pontos por dia: value=P&L acumulado, earnings=fees acumuladas. Último ponto patchado com dados ao vivo da pool ativa |
| `setOvPeriod(p, btn)` | Troca período e reconstrói gráfico |
| `setOvMode(m, btn)` | Troca Value/Earnings e atualiza label + `ov-total` + reconstrói gráfico |
| `setOvPanel(panel, btn)` | Alterna Stats/Exposure |
| `refreshAll()` | Chama `fetchLiveActivePool()` com feedback visual no botão (opacity durante fetch) |

**`ov-total` mostra retorno TOTAL de todas as pools** (não só a pool ativa):
- Value mode: `totPnl = POOLS.reduce((s,p) => s + p.result, 0)` = `-$839.39`
- Earnings mode: `totFees = POOLS.reduce((s,p) => s + p.fees, 0)` = `+$2,437.11`
- `_buildOvPoints` value mode: `val += ev.result * progress` (P&L proporcional — não capital)
- Last point: `closedPools finalValue + liveActivePnl` (via `window._liveLP - capital`)

**`fetchLiveActivePool()` atualizado** para preencher todos os IDs da overview após fetch:
- `ov-total`, `ov-pending`, `ov-apr`, `ov-earnings`, `ov-pnl`, `ov-vs-hodl`, `ov-roi`
- Barras de exposure: WETH/USDC split calculado de `amount0`/`amount1`
- `ov-exp-price`, `ov-in-range`
- `window._liveEthPrice` setado para uso em `rangeBarHtml()`

#### `track.html` — Pool list redesign estilo Metrix

**Table headers** simplificados de 10 colunas para 4:
```
Par / Protocolo | Balance / Earnings / APR | Range | ▾
```

**`renderTable()` reescrita** — cada row usa `.pr-row` com 4 colunas:

| Coluna | Conteúdo |
|--------|----------|
| Col 1 (identidade) | 2 ícones circulares sobrepostos (cor por token) + par + protocolo/rede com dot colorido |
| Col 2 (métricas) | Balance · Pending Earnings · APR (3 linhas label/valor) |
| Col 3 (range) | `rangeBarHtml(p, window._liveEthPrice)` |
| Col 4 | `▾` expand icon |

**Token color map:**
```js
{ ETH:'#627EEA', WETH:'#627EEA', USDC:'#2775ca', USDT:'#26a17b',
  SOL:'#9945ff', ARB:'#28a0f0', WBTC:'#F7931A', RDNT:'#00D4FF', ... }
```

**`rangeBarHtml(p, livePrice)` nova função:**
- Parseia `p.range` via regex `\$([\d,]+\.?\d*)\s*[–\-]\s*\$([\d,]+\.?\d*)`
- Calcula `pct = (cur - pMin) / (pMax - pMin) * 100`
- Gera barra com `.range-fill` (verde, largura = pct%), `.range-dot` (verde se in-range, vermelho se out)
- Labels min/max acima, percentuais `+X% from min` / `+Y% to max` abaixo

**CSS adicionado** (antes do `@media print`):
`.pr-row`, `.pr-identity`, `.pr-icons`, `.pr-icon`, `.pr-icon2`, `.pr-info`, `.pr-pair`, `.pr-fee`, `.pr-proto`, `.pr-proto-dot`, `.pr-metrics`, `.pr-metric-row`, `.pr-ml`, `.pr-mv`, `.range-bar-wrap`, `.range-bar-labels`, `.range-track`, `.range-fill`, `.range-dot`, `.range-bar-pcts`, `.range-na`

**Expand rows**: `colspan` atualizado de `10` → `4`. Conteúdo do detalhe expandido mantido intacto (grid com d-items + gráfico de série histórica com 5 tabs).

**Footer da tabela** atualizado para 4 colunas com Capital · Fees · P&L.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| `ov-total` mostrava valor da pool ativa ($360) | `updateOvStats` usava `window._liveLP || activePool.capital` para o número grande | Substituído por soma de `result` (value mode) ou `fees` (earnings mode) de TODOS os POOLS |
| Gráfico renderizava 388px | `maintainAspectRatio:false` no Chart.js faz ignorar `height="80"` no `<canvas>` | Wrapper `<div style="position:relative;height:185px;">` → Chart.js respeita a altura do container |
| Value/Earnings toggle no painel direito | Movido para `track-stats-header` (direita) para parecer diferente — mas Metrix tem no mesmo row dos period tabs | Movido de volta para `.track-chart-controls` com `justify-content:space-between` |
| `_buildOvPoints` value mode mostrava capital + P&L | `val += ev.capital + ev.result * progress` inflava o gráfico com capital deployed | Removido o `ev.capital` — só P&L: `val += ev.result * progress` |

### Commits desta sessão

| Hash | Mensagem |
|------|----------|
| `2228b5e` | feat: track.html Metrix-style overview — chart + Stats/Exposure panel |
| `2d4159b` | fix: track.html overview — gráfico menor + Value/Earnings movido para direita |
| `1a48887` | feat: track.html overview — total return de todas as pools (não só pool ativa) |
| `fab3b96` | feat: track.html redesign estilo Metrix — pool rows + range bar + refresh |

### O que ainda falta

- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — Lucas traz para custo BRL + IR
- **i18n painel Sizing & Risk** — labels só em PT; falta strings EN
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho, Gearbox, Drift, Hyperliquid HLP, Pendle PT
- **Distribuição de liquidez real** — a atual é sintética (track.html); leitura real exige scan de ticks do subgraph
- **Track.html responsividade mobile** — charts e range bar podem sair do quadro em telas pequenas
- **pools.html redesign** — plano existente (cards expandíveis + pools recomendadas) ainda não executado — o plan file em `.claude/plans/glistening-juggling-forest.md` descreve o escopo completo

---

## Sessão 20/05/2026 — Automação mensal + verificação dados 20/05 + workflow template criado

### Contexto
Sessão iniciada em context esgotado. Foram retomadas e finalizadas as atualizações de dados de 20/05/2026 de uma sessão anterior (all 6 HTML files + JSON snapshot já haviam sido atualizados). O usuário solicitou explicitamente: (1) verificação que todos os dados estão corretos, (2) criação de um processo mensal automatizado para future updates.

### Implementado

#### **Verificação de dados (20/05/2026)**
Confirmado que os 7 arquivos foram corretamente atualizados na sessão anterior:
- `index.html`: HOLDINGS array (9 tokens), STABLES_USD, TOTAL_DEBT
- `portfolio_analytics.html`: WEEKLY_UPDATE object completo com defi.aave e defi.kamino
- `emprestimos.html`: updateCollateralCards() com hardcoded values + live fetch
- `ferramentas.html`: BASE simulator object
- `relatorio.html`: APY constants + position quantities
- `pools.html`: STABLES fallback + debt fallbacks
- `EXPORTS SEMANAIS/MAIO/20-05-26-posicoes.json`: snapshot JSON criado

**Dados de 20/05/2026 confirmados:**
| Campo | Valor |
|-------|-------|
| Portfolio total USD | $8,871.78 |
| ETH | 2.084106 |
| SOL | 20.3113268 |
| AAVE WETH | 1.89 (supply) |
| AAVE USDT | 1,990 (supply) |
| AAVE USDC borrow | 751.82 @ 8.93% APY |
| Kamino SOL | 20.47 (supply) @ 5.59% APY |
| Kamino USDS | 301.42 (supply) @ 4.56% APY |
| Kamino USDC borrow | 811.35 @ 6.19% APY |
| STABLES_USD | 2,536.40 (USDT 2,235.98 + USDS 300.42) |
| TOTAL_DEBT | 1,563.17 (AAVE 751.82 + Kamino 811.35) |

#### **Automação mensal — MONTHLY_UPDATE_WORKFLOW.md criado**
Arquivo novo criado na raiz: `C:\Users\barol\OneDrive\Documentos\barolo-site\MONTHLY_UPDATE_WORKFLOW.md`

**Conteúdo do workflow (9 seções):**
1. **Prints necessários** — exatamente onde tirar screenshot (CoinGecko, AAVE V4, Kamino) e pasta para salvar
2. **Mapeamento Print → Código** — tabelas com correspondência exata:
   - CoinGecko holdings → HOLDINGS array em index.html
   - AAVE V4 qtys e APYs → AAVE_*_QTY e AAVE_*_APY em relatorio.html
   - Kamino qtys e APYs → KAM_*_QTY e KAM_*_APY em relatorio.html
   - Hardcoded values em emprestimos.html (updateCollateralCards, linhas 1142–1165)
   - BASE simulator em ferramentas.html (linhas 2059–2068)
3. **Checklist dos 6 arquivos HTML + JSON** — qual constante atualizar em cada arquivo
4. **Passo a passo do processo** — extrair prints → editar HTML → criar JSON → git commit → validar
5. **Validação pós-atualização** — Health Factor, LTV, CAGR, STABLES_USD, JSON snapshot
6. **Campos opcionais** — compras via CEX, coleta de fees em pools, novos tokens
7. **Automação futura** — sugestões de OCR + webhook + GitHub Actions
8. **Template de commit** — mensagem padrão para copiar/colar
9. **Calendário** — próximas datas de atualização (20–21 de cada mês)

**Objetivo:** quando Lucas enviar prints no próximo mês, será possível seguir o workflow exatamente sem qualquer pergunta ou ambiguidade.

### Dados atualizados
Nenhum. Todos os dados de 20/05/2026 foram atualizados na sessão anterior (confirmado nesta).

### Bugs corrigidos
Nenhum nesta sessão. Arquivo novo criado (MONTHLY_UPDATE_WORKFLOW.md).

### Commits desta sessão

| Hash | Mensagem |
|------|----------|
| `da87f94` | docs: monthly update workflow template — automação para future prints |

---

## Sessão 20/05/2026 (continuação) — Fix: Risco & Convexidade com valores dinâmicos

### Bug identificado e corrigido
Aba "Risco & Convexidade" em `portfolio_analytics.html` tinha valores hardcoded que não atualizavam:
- `cpStables` (% stables): hardcoded "64.2%"
- `cpMarginAAVE` (margem até liquidação AAVE): hardcoded "81%"
- `cpMarginKamino` (margem até liquidação Kamino): hardcoded "37%"
- Débito na fórmula de alavancagem: hardcoded "1558.93" (valor antigo de maio)

### Fix aplicado
**Função `calculatePortfolioConvexity()`:**
- Débito agora dinâmico: `debt = window._liveAaveDebt + window._liveKaminoDebt`
- Cálculo de margens no retorno:
  - `stablesPct = stablesTotal / grossAssets` (calcula % ao vivo)
  - `aaveMargin = ((0.825 - aaveLTVcurrent) / 0.825) * 100` (82.5% = max LTV AAVE)
  - `kaminoMargin = ((0.7722 - kaminoLTV) / kaminoLTV) * 100` (77.22% = liq threshold Kamino)

**Função `buildConvexityUI()`:**
- Substitui hardcoded por dinâmico:
  - `cpStables`: `(cv.stablesPct*100).toFixed(1)+'%'`
  - `cpMarginAAVE`: `Math.max(0, cv.aaveMargin).toFixed(0)+'%'`
  - `cpMarginKamino`: `Math.max(0, cv.kaminoMargin).toFixed(0)+'%'`

**Função `renderUI()`:**
- Adicionada linha: `window._stablesTotalUSD = stablesTotal;` para fornecer global à convexidade

### Resultado
Todos os valores no tab "Risco & Convexidade" agora atualizam dinamicamente:
- Quando AAVE debt ou Kamino debt mudam → alavancagem recalcula
- Quando USDT/USDS mudam → % stables recalcula
- Quando AAVE HF ou Kamino LTV mudam → margens recalculam
- Gauge de CP atualiza cor (verde < 0.20, laranja < 0.35, vermelho acima)

### Commits
- **`fb636ca`** — fix: Risk & Convexity tab — valores dinâmicos em vez de hardcoded

### O que ainda falta

- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada (ainda pendente de clarificação)
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR (pendente desde sessão 11/04)
- **i18n painel Sizing & Risk** — labels só em PT; falta strings EN
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT
- **Distribuição de liquidez real em track.html** — a atual é sintética; leitura real exige scan de Uniswap V3 subgraph ticks
- **Track.html responsividade mobile** — charts e range bar podem sair do quadro em telas pequenas
- **pools.html redesign** — cards expandíveis + recomendações de pools (plano em `.claude/plans/glistening-juggling-forest.md`)

### Workflow para próximas sessões

**Modelo padrão (jun/2026 e futuro):**
1. Lucas envia prints de CoinGecko, AAVE V4, Kamino (salva em `DIARIO DEFI E PRINTS/`)
2. Claude segue `MONTHLY_UPDATE_WORKFLOW.md` seção por seção
3. Atualiza 6 arquivos HTML + cria JSON snapshot
4. Git commit com template padrão
5. Push para main
6. Zero confirmações necessárias (user autorizou antecipadamente em 20/05/2026)

---

## Sessão 12/06/2026 — Daily standup + confirmação rebalanceamento AAVE (05/06/2026)

### Contexto
Standup automatizado (08:30 BRT) detectou via fetch ao vivo (AAVE V4 GraphQL) uma composição de colateral diferente da última documentada em CLAUDE.md: WETH supply subiu de 1.89 → 2.1565, USDT supply caiu de ~1990/2000 → 1296.55, USDC borrow ~753.82, HF ~5.32. O relatório inicial sinalizou isso como "⚠️ possível mudança não registrada". Lucas corrigiu: a operação **foi registrada** — pediu para localizar o log e documentar no CLAUDE.md.

### Confirmado
Localizado em `EXPORTS SEMANAIS/JUNHO/05-06-26-posicoes.json` (array `transactions`), datado de **05/06/2026**:

| Data | Protocolo | Ação | Ativo | Qty | Valor |
|------|-----------|------|-------|-----|-------|
| 05/06/2026 | AAVE | withdraw colateral | USDT | 400 | $400 |
| 05/06/2026 | AAVE | add colateral | WETH | +0.27 | $419 |
| 05/06/2026 | Kamino | add colateral | SOL | +2.88 | $181.49 |

**Rebalanceamento intencional**: Lucas reduziu USDT supplied na AAVE e converteu para WETH supply (~$400 USDT → ~0.27 WETH), além de adicionar 2.88 SOL extra de colateral no Kamino. O JSON de 05/06 já registra WETH=2.16 / USDT=1300 (consistente com os valores ao vivo de hoje: WETH 2.1565, USDT 1296.55).

### Nova baseline confirmada (12/06/2026, via fetch ao vivo AAVE V4 GraphQL)
| Campo | Valor |
|---|---|
| AAVE WETH supply | **2.1565** |
| AAVE USDT supply | **1296.55** |
| AAVE USDC borrow | **753.82** |
| AAVE Health Factor | **5.32** |
| Kamino SOL supply | ~23.3 (após +2.88 de 05/06) |

**Nota para próximas sessões**: ~~estes valores ainda precisam ser propagados~~ **✅ RESOLVIDO** — a atualização mensal de 20/06/2026 já propagou os valores atuais (WETH 2.16 / USDT 1.300 / AAVE borrow 754.65 / Kamino SOL 23.36) para os 6 arquivos HTML + snapshot JSON. A baseline 12/06 abaixo é **histórica**; a baseline vigente é a de 20/06 (ver seção "Posições atuais" no topo do arquivo). Não re-sinalizar como anomalia nem como pendência.

### O que ainda falta
- Propagar WETH 2.1565 / USDT 1296.55 / USDC borrow 753.82 / Kamino SOL ~23.3 para os 6 arquivos HTML + criar snapshot JSON de 12/06
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — Lucas traz para custo de aquisição em BRL e base para IR
- **i18n painel Sizing & Risk** — labels só em PT
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT

---

## Sessão 16/06/2026 — Fees 2026 YTD por data de coleta + gráfico Taxas Anuais dinâmico + fix do "pulo" no load (lazy-load iframes)

### Contexto
Lucas pediu para conferir se os dados das fees coletadas em 2026 estavam corretos. A verificação revelou um problema de metodologia no card "P&L 2026 YTD". Em seguida, pediu para corrigir o "pulo" que a página `pools.html` dava para o meio ao carregar (e voltava para o topo).

### Implementado — `pools.html` (todas as mudanças nesta sessão foram neste arquivo)

#### 1. `calcYTD()` — fees 2026 agora por data de FECHAMENTO/coleta (não abertura)
- **Linha ~547**: filtro mudou de `p.open.indexOf('2026')` para `p.close.indexOf('2026')` (+ `|| p.status === 'active'`).
- **Por quê**: "fees coletadas" se realizam no fechamento da pool. O filtro por abertura excluía duas pools abertas em out/2025 e **coletadas** em jan/2026: SOL/USDC Solana ($23, fechada 20/01/2026) e ETH/USDT Arbitrum ($34, fechada 30/01/2026).
- **Resultado** (verificado em Node contra o próprio array `POOLS`):
  - FEES BRUTAS: ~$39 → **$96** (exato $96,28)
  - P&L LÍQUIDO: +$33 → **+$90**
  - POOLS ATIVAS: 1
  - As 6 pools contadas: ETH/USDC Base $16, SOL/USDT $1, ETH/USDT Arb $34, SOL/USDC Sol $23, WETH/USDC Base fechada $22,28, WETH/USDC Base ativa $0.

#### 2. `calcYTD()` — DIAS OP. conta só a fração dentro de 2026
- Adicionado `YEAR_START = new Date(2026,0,1)` + helper `_parseDMY()`. Para cada pool contada, soma `(close − max(open, YEAR_START))` em dias; pool ativa usa `new Date()` (hoje) como fim.
- **Por quê**: com o filtro por fechamento, as pools que cruzaram o ano arrastavam o tempo de 2025 (105+93 dias), inflando o total para 344. Agora conta só o pedaço de 2026.
- **Resultado**: ETH/USDT 105→29, SOL/USDC 93→19 (clipadas em 01/jan); demais inalteradas; ativa 13 dias. **Total 344 → 194 dias** (não dispara com o tempo: ativa medida até hoje, fechadas com fração fixa).

#### 3. Gráfico "Taxas Anuais" (`buildFees()`) — derivado dinâmico de `POOLS`
- **Linha ~2653**: substituído array hardcoded `yearFees=[267,109,1453,25]` / `yearLabels=['2023','2024','2025','2026 YTD']` por cálculo dinâmico que agrupa `p.fees` por **ano de realização** (fechamento; pool ativa → ano corrente), mesmo critério do card YTD.
- **Resultado**: 2023 **$377** · 2024 **$562** · 2025 **$1.403** · 2026 YTD **$96** (antes: $267/$109/$1453/$25 — estava stale, ex: 2024 real era ~$363 mostrava $109). Agora se atualiza sozinho a cada pool nova.

#### 4. Fix do "pulo" no load — lazy-load dos 4 iframes via IntersectionObserver
- **Causa raiz**: 4 iframes de dApps (`revertFrame` Revert, `uniswapFrame` DefiLlama, `aaveFrame` AAVE pro, `raydiumFrame` Raydium) carregavam todos no load. dApps roubam o foco e rolam a página até si (o comentário antigo já acusava "auto scroll to Raydium"). Os paliativos antigos (`display:none` no Raydium + vários `scrollTo(0,0)` + `setTimeout` 500ms) só puxavam de volta ao topo — o "vai-e-volta" visível.
- **Fix**:
  - Os 4 `<iframe src="...">` viraram `<iframe data-src="...">`.
  - Nova IIFE `lazyIframePanels()` (substituiu as 4 chamadas diretas `initIframePanel(...)` nas linhas ~1319-1322): `IntersectionObserver` com `rootMargin:'300px 0px'`; ao entrar na viewport, chama `initIframePanel(...)` (anexa listener + timer de fallback) **e depois** atribui `f.src = f.dataset.src + (suffix||'')`. Fallback p/ browsers sem IO: carrega tudo.
  - **Importante**: `initIframePanel` iniciava o timer de fallback (15s) imediatamente — por isso ele agora só é chamado quando o iframe entra em view (senão mostraria "bloqueado" sem o usuário ter rolado até lá).
  - Removido o `style="display:none"` do `#bc-raydium-section` e o bloco `setTimeout(...500)` que o revelava.
- **Bônus privacidade**: o `revertFrame` tinha o endereço da carteira na URL pública (`#/account/0x5Ff…`), marcado como ❌ na política do CLAUDE.md. Agora o markup só tem `data-src="https://revert.finance/"` e o sufixo `#/account/0x5Ff957C19A03aF57B5098F3F395A578E394aE4B6` é uma const `REVERT_ACCT` no JS, anexada em runtime (política permite endereço no JS, não na URL).
- **Verificado no browser (preview localhost:8080)**: no load `scrollY:0` com `readyState:complete`; DefiLlama/AAVE/Raydium ficam sem `src` (não carregam no topo); ao rolar até eles, carregam sob demanda (`dataset.loaded='1'`); zero erros no console; Revert carrega com o account anexado via JS.

### Dados verificados (não alterados — apenas confirmados corretos)
Valores por pool de 2026 batem entre `pools.html` (`POOLS`) e `relatorio.html` (`POOLS_DATA`). Total coletado em 2026 = **$96,28**.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Card "P&L 2026 YTD" subcontava fees ($39 em vez de $96) | `calcYTD` filtrava por data de abertura, excluindo 2 pools abertas em 2025 e coletadas em 2026 | Filtro por `p.close` (data de coleta) |
| DIAS OP. inflado (344) ao mudar p/ fechamento | Pools que cruzaram o ano traziam dias de 2025 | Conta só a fração de 2026 via `max(open, 1º jan)` → close/hoje |
| Gráfico "Taxas Anuais" com valores stale (ex: 2024 $109 vs real ~$363) | Array `yearFees` hardcoded | Derivado de `POOLS` por ano de realização |
| Página `pools.html` pulava p/ o meio e voltava ao topo no load | 4 iframes de dApps carregavam no load e roubavam o scroll/foco | Lazy-load via IntersectionObserver; iframes só carregam ao entrar na viewport |
| Endereço de carteira exposto na URL do iframe Revert (viola política) | `src` com `#/account/0x5Ff…` no markup | Endereço movido para const JS `REVERT_ACCT`, anexado em runtime |

### Commits (push direto na main — `760baf4..a1eb644`)
- `231dc9b` — data: atualização posições 13/06/2026 (AAVE WETH 2.16/USDT 1.300, borrow APY normalizado 7,59%, Kamino LTV 35,5%) — *era alteração pré-existente não-commitada em `relatorio.html`, commitada separadamente*
- `a1eb644` — fix: fees 2026 YTD por data de coleta/fechamento + gráfico Taxas Anuais dinâmico + lazy-load dos iframes (corrige pulo no load)

### O que ainda falta
- ~~Propagar baseline 12/06 para os 6 arquivos HTML~~ ✅ FEITO na atualização mensal de 20/06/2026 (baseline vigente: WETH 2.16 / USDT 1.300 / Kamino SOL 23.36)
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** — labels só em PT
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT
- **Mesma lógica de fees por coleta**: considerar aplicar o critério de fechamento também em `relatorio.html`/`track.html` se eles exibirem agregados YTD (nesta sessão só `pools.html` foi corrigido)

---

## Sessão 17/06/2026 — Nova página `ciclo.html`: indicadores on-chain BTC (MVRV, Mayer, Realized Price)

### Contexto
Lucas mandou um print de um painel "Bitcoin Lab" (provavelmente o **Bitcoin Lab Pulse** do researchbitcoin.net) com 8 indicadores on-chain sobre o preço do BTC: MVRV Ratio, STH MVRV, Mayer Multiple, LTH MVRV, Realized Price, LTH SOPR, AVIV, CVDD — cada um com "níveis de sinal" (preço que dispara WATCH/STRONG/EXTREME). Perguntou se dá pra implementar todos juntos numa página do site.

### Decisão de escopo (definida pelo usuário via pergunta)
O gargalo é **dado**, não código. Indicadores segmentados por idade de holder (STH/LTH MVRV, SOPR, AVIV, CVDD) exigem provedor pago (Glassnode) ou key (BGeometrics, free tier 8 req/h · 15 req/dia). Os "calculáveis de graça sem key" são só 4. **Lucas escolheu a versão enxuta "só os 4 grátis sem key".**

APIs validadas via curl antes de codar:
- **CoinMetrics Community API** (`community-api.coinmetrics.io/v4/timeseries/asset-metrics`) — sem key, CORS ok. `CapMVRVCur` + `PriceUSD` retornam 200; `CapRealUSD` (realized cap) está **gated** no free tier. Janela de 365d (`start_time`/`end_time`, `page_size=10000`) volta ~370 linhas numa única página, ascendente, mais recente no fim.
- **CoinGecko** `/simple/price` — spot BTC ao vivo (sem key).
- **Insight chave**: Realized Price = `PriceUSD ÷ MVRV` (porque MVRV = market cap/realized cap = preço/realized price). Logo não preciso da realized cap gated — derivo tudo de MVRV + PriceUSD numa única chamada.

### Implementado — `ciclo.html` (arquivo novo)
- **Design system clonado de `pools.html`**: mesmas CSS vars (dark/light), nav fixo, favicon B, fontes Satoshi/JetBrains Mono/Cormorant, `noindex`, theme toggle (`toggleTheme` + `bc-theme` localStorage).
- **Fetch**: `fetchOnChain()` (CoinMetrics, 370d, obrigatório) + `fetchSpot()` (CoinGecko, opcional). `buildDATA(rows)` computa séries price/realized/mvrv + `sma200` (média dos últimos 200 closes) + `mayer = curPrice/sma200`. Cache localStorage `bc-onchain-v1` TTL 6h; fallback p/ cache stale se a API falhar.
- **Gráfico** (`buildChart()`, Chart.js 4.4.1 + `chartjs-plugin-annotation@3.1.0`, ambos carregados sob demanda via `loadCharts()`): linha BTC (gold, area gradient) + linha Realized Price (azul tracejada) no mesmo eixo. Linhas de anotação horizontais = preço que dispara cada zona, derivadas de `realized × {0.8,1.0,1.2,3.2,3.7}` (MVRV) e `sma200 × {0.6,0.8,1.0,2.4}` (Mayer) + "Preço Agora".
- **Painel de overlays togláveis** (`LEVELS` array, `renderOverlayList()`, `toggleOverlay()`, `setAllOverlays()`): 11 níveis com switch on/off; reconstrói as anotações do gráfico ao alternar. Default liga um subconjunto sensato.
- **4 cards de indicadores** (`renderCards()`): Mayer Multiple, MVRV Ratio, Realized Price, Price vs Realized. Cada um: valor grande (mono), badge de zona colorida (`classify()` contra `MAYER_ZONES`/`MVRV_ZONES`), nota, e buckets destacando a faixa atual.
- **Status bar** (`renderStatus()`): BTC spot ao vivo, Realized Price, **veredito de ciclo** (FUNDO/COMPRA · ACUMULAÇÃO · EXPANSÃO · TOPO/EUFORIA via blend MVRV+Mayer), timestamp.
- **Card de Metodologia & Fontes** + disclaimer "não é recomendação".
- Responsivo (grid colapsa < 880px; cards 4→2→1 col), nav hamburger mobile, botão ↻ refresh.

### Implementado — nav "Ciclo" nas 5 páginas internas
Link `<a href="ciclo.html">Ciclo</a>` inserido entre "Pools & DeFi" e "Empréstimos" em: `portfolio_analytics.html`, `pools.html` (2 navs duplicados → replace_all), `emprestimos.html`, `ferramentas.html`, `relatorio.html`. **Sem `data-i18n`** de propósito (não há string `nav-cycle` definida; assim o toggle de idioma não apaga o link). `index.html` **não** recebeu o link — é a landing pública (nav por âncoras, dashboards internos ficam atrás do login; condizente com a política de privacidade).

### Verificação no browser (preview localhost:8080)
- 370 pontos, Chart.js + annotation carregados, **zero erros de console**.
- Valores ao vivo conferem com o print: MVRV **1.23** (NORMAL), Mayer **0.85** (WATCH), Realized Price **$53.419** (PRÊMIO), Price vs Realized **+23%** (NEUTRO), ciclo **ACUMULAÇÃO**, spot $64.308.
- Overlays togláveis funcionam (6→7 ao ligar, →1 ao ocultar todos mantendo "Preço Agora", →11 ao mostrar todos), sem erro.
- Layout desktop (>880px) = chart + painel de overlays lado a lado; nav renderiza "Início · Portfolio · Pools & DeFi · Ciclo · Empréstimos · Ferramentas" sem o i18n apagar o Ciclo.

### Dados atualizados
Nenhum dado de posição alterado. Página puxa dados on-chain ao vivo (CoinMetrics + CoinGecko).

### Bugs corrigidos
Nenhum (feature nova).

### Commits (push direto na main)
- `82d55a8` — feat: pagina ciclo.html — indicadores on-chain BTC (MVRV, Mayer, Realized Price) + link Ciclo no nav das 5 páginas internas

### O que ainda falta
- **Completar os outros 4 indicadores** (STH MVRV, LTH MVRV, LTH SOPR, AVIV, CVDD) — exige key BGeometrics (free tier 15 req/dia → arquitetura ideal seria snapshot JSON diário commitado no repo) ou Glassnode pago. `ciclo.html` está estruturado pra receber novos indicadores facilmente (adicionar zonas + card + nível).
- ~~Propagar baseline 12/06 para os 6 arquivos HTML~~ ✅ FEITO na atualização mensal de 20/06/2026 (baseline vigente: WETH 2.16 / USDT 1.300 / Kamino SOL 23.36)
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** — labels só em PT
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT
- **Mesma lógica de fees por coleta** em `relatorio.html`/`track.html` se exibirem agregados YTD

---

## Sessão 17–18/06/2026 (continuação) — ciclo.html: gráfico maior + zoom, e UPGRADE pros 8 indicadores via Bitcoin Lab API (researchbitcoin.net) + snapshot diário automatizado

### Contexto
Continuação da sessão da `ciclo.html`. Duas frentes: (1) melhorar o gráfico (estava pequeno/comprimido); (2) Lucas mostrou que a fonte do painel "Bitcoin Lab" que o inspirou é o **yldlab.xyz**, que tem os 8 indicadores de graça — o que reabriu a possibilidade de fazer os 8 completos (antes ficamos só nos 4 grátis sem key).

### Implementado

#### `ciclo.html` — gráfico maior + zoom interativo (commit `7dbbea6`)
- Altura `360→480px` (+ botão **Expandir** → 720px via classe `.chart-wrap.big`; `toggleExpand()` usa `requestAnimationFrame` p/ `_cycleChart.resize()` — **sem** `transition:height` porque a animação fazia o resize pegar altura intermediária).
- **chartjs-plugin-zoom@2.0.1** adicionado ao `loadCharts()` (Chart→annotation→zoom). Config: `pan xy` (arraste), `zoom wheel/pinch xy`, `limits.y.minRange`. Botão **⟲ Reset** (`resetZoom()`). Registro defensivo: `if(!Chart.registry.plugins.get('zoom')) Chart.register(...)`.
- **Mayer TOPO off por padrão** — a linha em ~$185k esticava o eixo Y e comprimia a ação de preço; agora o eixo auto-ajusta (~$50–130k). Continua disponível nos overlays.

#### Descoberta da fonte de dados (yldlab → ResearchBitcoin)
- O painel "Bitcoin Lab" (yldlab.xyz) é uma **camada visual** sobre a **Bitcoin Lab API do researchbitcoin.net**.
- OpenAPI público em `https://api.researchbitcoin.net/openapi/openapi.json` (sem auth p/ ler o spec). Endpoints `/v2/{categoria}/{data_field}?resolution=d1&output_format=json&from_time=&to_time=`. **Auth: header `X-API-Token`**. Free tier `user_tier:0` → **`allowed_historical_days: 365`** (pedir >365 dias retorna 403 "Insufficient user tier").
- **Token do Lucas** (free signup): guardado como **secret `RB_TOKEN`** no GitHub (NUNCA no código/repo). Lucas colou no chat; é read-only de dados públicos, baixo risco, pode rotacionar.

#### Mapeamento dos 8 indicadores → campos reais da API
| Indicador | Endpoint / campo |
|---|---|
| MVRV | `market_value_to_realized_value/mvrv` |
| STH MVRV | `market_value_to_realized_value/mvrv_sth` |
| LTH MVRV | `market_value_to_realized_value/mvrv_lth` |
| Realized Price | `realizedprice/realized_price` (+ `_sth`, `_lth` p/ níveis) |
| LTH SOPR | `spent_output_profit_ratio/sopr_lth` |
| AVIV | `cointime_statistics/active_value_to_investor_value` |
| Mayer Multiple | calculado: `price/price` ÷ MM200 |
| CVDD | **derivado**: `(cointime_statistics/coinblock_value_cum_destroyed / 144) / (idade_dias × 6.000.000)` |
- Validado com token: valores batem com o painel (MVRV 1.20, STH 0.89, AVIV 0.83, Realized $53.462, CVDD ratio ~1.38x). **Gotcha resolvido**: o `fetch` do Node dava 403 com User-Agent customizado — o WAF bloqueia UA estranho; usar **UA de browser** resolve.

#### Arquitetura snapshot diário (commit `f59f063`)
- **`scripts/fetch-onchain.js`** — lê `process.env.RB_TOKEN`, busca os 10 campos (360 dias), calcula CVDD/Mayer, grava **`btc-onchain.json`** na raiz (só dados públicos, ~76KB). Rodar local: `RB_TOKEN=xxx node scripts/fetch-onchain.js`.
- **`.github/workflows/onchain.yml`** — cron `20 9 * * *` (~06:20 BRT) + `workflow_dispatch`; usa `secrets.RB_TOKEN`; commita `btc-onchain.json` se mudou (`git diff --quiet`). `permissions: contents:write`. **Action confirmada verde** por Lucas após adicionar o secret.
- **`ciclo.html` reescrita** — `fetchOnChain()` agora lê `btc-onchain.json` estático (não mais CoinMetrics live). Estrutura **config-driven**: array `INDICATORS` (8) + objetos `Z` (zonas) e `BK` (buckets) por indicador; `renderCards()` gera os 8 cards dinamicamente. Gráfico com 3 datasets (BTC, Realized, CVDD — séries temporais) + 9 níveis planos togláveis (`buildLevels()`: cur, STH/LTH custo-base, Mayer 0.8/200d/2.4, MVRV 0.8/1.2/3.2). Veredito de ciclo (`renderStatus`) por score combinando MVRV+Mayer+SOPR+AVIV+STH. CoinGecko só p/ o spot "BTC Agora". Cache localStorage `bc-onchain-v2`.

### Dados / estado atual (18/06/2026, via ciclo.html)
MVRV 1.20 NORMAL · STH MVRV 0.89 WATCH · Mayer 0.84 WATCH · LTH MVRV 1.30 ACUMULAR · Realized $53.462 PRÊMIO · LTH SOPR 0.84 STRONG · AVIV 0.83 WATCH · CVDD 1.38x (piso $47.149) PISO → veredito **ACUMULAÇÃO**.

### Bugs corrigidos
| Bug | Causa | Fix |
|-----|-------|-----|
| Expandir não mudava a altura | `transition:height .2s` fazia o `resize()` pegar altura intermediária | removida a transição; resize via duplo `requestAnimationFrame` |
| `fetch` Node → 403 na API | WAF bloqueia User-Agent customizado | UA de browser no header |
| Script → 403 "Insufficient tier" | pediu 420 dias; free tier = 365 | `DAYS=360` |
| Gráfico comprimido (eixo até ~$185k) | overlay Mayer TOPO ligado por padrão | desligado por padrão |

### O que ainda falta
- **Histórico > 365 dias** (ciclos anteriores) exige tier pago do ResearchBitcoin; hoje a página mostra 360 dias.
- Ao mexer no repo localmente, dar **`git pull`** antes (a Action pode ter commitado `btc-onchain.json` automático).
- Ajuste fino dos thresholds de zona (são heurísticas) se Lucas quiser calibrar contra os do painel.
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** — labels só em PT
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT

---

## Sessão 19/06/2026 — `ciclo.html` virou aba dentro de `ferramentas.html` (migração + remoção do standalone)

### Contexto
Lucas pediu: "Mude a aba Ciclo para uma aba no Ferramentas". Ou seja, tirar o **Ciclo** do nav (página standalone `ciclo.html`) e transformá-lo numa **aba** dentro de `ferramentas.html`, junto às outras (Crenças, Liquidação, Cenários, Sizing & Risk, Diário, Alertas, Evolução, Pools APY, Semanal).

### Implementado

#### `ferramentas.html` — nova aba "Ciclo"
- **Botão de aba** inserido entre "Pools APY" e "Semanal": `<button class="tab" onclick="switchTab('ciclo',this)" data-i18n="tab-ciclo">Ciclo</button>`. String `'tab-ciclo':{pt:'Ciclo',en:'Cycle'}` adicionada ao `LANG_STRINGS` (após `tab-apy`). Ordem das abas: Crenças · Liquidação · Cenários · Sizing & Risk · Diário DeFi · Alertas · Evolução · Pools APY · **Ciclo** · Semanal.
- **CSS isolado sob `#panel-ciclo`** (bloco novo antes de `</style>`): todos os seletores do ciclo.html prefixados com `#panel-ciclo `; keyframe `pulse`→`cyPulse`; `--mono` definido no escopo. Isso evita colisão com classes que JÁ existem no Ferramentas: `.page-title`/`.page-sub` (header da página), `.chart-wrap` (usado pelo `evoChart` com altura própria!), `.live-dot`. Reaproveita `.btn-sm` e as vars existentes (`--surface`, `--surface2`, `--green/red/accent/muted/text`, `--card-shadow`, `--border`). Wrapper do gráfico renomeado p/ `.cy-wrap` (480px; `.big` = 720px no expand).
- **Painel `#panel-ciclo`** (HTML, inserido antes de `panel-semanal`): page-head + status-row + chart-grid (canvas + overlays) + grid de indicadores + card de Metodologia. **Todos os IDs prefixados `cy-`** p/ não colidir: `cy-st-price`, `cy-st-realized`, `cy-st-cvdd`, `cy-st-cycle`, `cy-st-updated`, `cy-chart` (canvas), `cy-ovList`, `cy-indGrid`, `cy-refresh`, `cy-expandBtn`. Botões chamam `Ciclo.refresh()`, `Ciclo.resetZoom()`, `Ciclo.toggleExpand(this)`, `Ciclo.setAllOverlays(bool)`, `Ciclo.toggleOverlay(id)`.
- **JS em IIFE `window.Ciclo`** (novo `<script>` antes de `</body>`): toda a lógica do ciclo.html reescrita encapsulada — **não vaza nem clobbera** globais do Ferramentas (`DATA`, `COL`, `isDark`, `fmtUsd`, `fmtNum`, `Z`, `BK`, `INDICATORS`, `loadCharts`, `buildChart`, etc. ficam locais ao IIFE). Mantém zonas/buckets/8 indicadores, `loadCharts` (Chart.js já está no `<head>` 4.4.0 → adiciona annotation@3.1.0 + zoom@2.0.1 sob demanda), `fetchOnChain` (lê `btc-onchain.json`), `fetchSpot` (CoinGecko spot), `buildDATA`/`buildLevels`/`renderOverlayList`/`buildChart`/`renderCards`/`renderStatus`/`refreshAll`. Cache localStorage `bc-onchain-v2`.
- **API pública exposta**: `Ciclo.{open, refresh, rebuild, resetZoom, toggleExpand, setAllOverlays, toggleOverlay}`. `open()` faz lazy-load dos plugins + 1º fetch só na 1ª vez; reaberturas apenas dão `_cycleChart.resize()`.
- **Hooks adicionados**: `switchTab()` ganhou `if(id==='ciclo' && window.Ciclo) Ciclo.open();` — carrega só quando a aba abre (canvas visível, evita Chart.js renderizar com altura 0). `toggleTheme()` ganhou `if(window.Ciclo) Ciclo.rebuild();` — gráfico/overlays seguem o tema.

#### Nav — link standalone removido (5 páginas)
`<a href="ciclo.html">Ciclo</a>` retirado de `ferramentas.html`, `portfolio_analytics.html`, `pools.html` (2 navs — desktop e mobile), `emprestimos.html`, `relatorio.html`. `index.html` nunca teve (landing pública).

#### `ciclo.html` — REMOVIDO (`git rm`)
Conteúdo 100% migrado para a aba; manter geraria duplicação/drift de lógica. **`btc-onchain.json`, a GitHub Action (`onchain.yml`) e `scripts/fetch-onchain.js` permanecem** — continuam gerando o snapshot diário que a aba consome. Atualizei só os comentários: `onchain.yml` name → "(aba Ciclo · ferramentas.html)"; cabeçalho do `fetch-onchain.js` → "para a aba Ciclo (ferramentas.html)".

### Dados atualizados
Nenhum dado de posição alterado — migração estrutural/UI. (Estado on-chain ao vivo verificado durante o teste: MVRV 1.20, ciclo ACUMULAÇÃO, BTC spot $65.253.)

### Bugs corrigidos
Nenhum (feature). Armadilhas evitadas na migração: colisões de classe (`.page-title`, `.chart-wrap`) resolvidas via escopo `#panel-ciclo`; colisões de ID via prefixo `cy-`; `toggleTheme`/`fmtUsd`/`DATA` do Ferramentas preservados via IIFE. **Nota técnica**: o plugin de zoom auto-registra como global `ChartZoom` (não `chartjs-plugin-zoom`), então o guard `Chart.register(window['chartjs-plugin-zoom'])` vira no-op — mas o zoom registra sozinho mesmo assim (verificado `Chart.registry.plugins.get('zoom') === true`).

### Verificação (browser localhost:8080)
- Abas: `… Pools APY · Ciclo · Semanal`; link standalone sumiu de todas as páginas (grep `ciclo.html` em `*.html` → 0 matches).
- Ao abrir a aba: 8 indicadores, 9 overlays, gráfico criado, plugins `zoom:true` + `annotation:true`, `cy-wrap` 480px, BTC spot ao vivo, **zero erros de console**.
- Interações OK: toggle de tema (chart rebuild sem erro), expandir (480↔720), overlays show/hide (9→1, mantém "Preço Agora"), toggle PT/EN (aba vira "Cycle"/"Ciclo"), round-trip de abas Liquidação↔Ciclo (gráfico persiste, panel ativo).
- `preview_screenshot` deu timeout (ambiental — página longa); responsividade confirmada via `preview_eval`.

### O que ainda falta
- **Aba Ciclo — outros indicadores/histórico**: completar séries segmentadas extras exige key/tier pago do ResearchBitcoin; histórico >365 dias idem. Thresholds de zona são heurísticas (calibrar se Lucas quiser).
- ~~Propagar baseline 12/06 para os 6 HTML~~ ✅ FEITO na atualização mensal de 20/06/2026 (baseline vigente: WETH 2.16 / USDT 1.300 / Kamino SOL 23.36)
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** — labels só em PT (a aba Ciclo está só em PT também, exceto o rótulo da aba)
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT

---

Atualizado: 19/06/2026 — aba **Ciclo** migrada para dentro de `ferramentas.html` (CSS escopado `#panel-ciclo`, JS em IIFE `window.Ciclo`, IDs `cy-`); `ciclo.html` removido; link "Ciclo" retirado do nav das 5 páginas; `btc-onchain.json` + GitHub Action mantidos

---

## Sessão 22/06/2026 — Convexidade Completa + Régua Global USD/BRL/BTC/ETH + KPI vs HODL

### Contexto
Sessão iniciada com implementação do plano de "Convexidade Completa" que estava pendente. Adicionado também sistema de régua de medida global (USD/BRL/BTC/ETH) no hero e KPI final "vs HODL" que responde a pergunta mais importante: a operação ativa está acumulando mais cripto do que se fosse só HODL?

### Implementado

#### `portfolio_analytics.html` — Convexidade Completa (4a5a6a0)
- **Gráfico de Barras Impacto** (`cpImpactChart` canvas): top 10 ativos por w×C[i] (peso × convexidade), Chart.js horizontal bar, cores por threshold (verde <0.05, amarelo 0.05-0.15, vermelho >0.15)
- **Pie Chart Decomposição** (`cpDecompositionChart` canvas): doughnut mostrando split λ₁/λ₂/λ₃ (ativos / fragilidade / regime Markov), cores #627EEA/#f85149/#3fb950, tooltips com % e valores
- **Série Temporal Melhorada** (`cpHistChart` canvas): linha histórica CP 19 meses com annotations (linha alerta CP=0.20, plugins Chart.js)
- **Matriz de Cenários** (tabela HTML): 7 linhas (Atual, ETH −30%, SOL −40%, Bull +50%, Bear −40%, AAVE Liq Risk, Kamino Liq Risk), recalcula CP por cenário, cores dinâmicas por resultado
- **Tabela por Ativo Melhorada**: C[i], peso, vol (from change24h), impacto w×C[i], ordenada por impacto descending, 11 linhas, cores por risco
- **Funções novas**:
  - `buildConvexityImpactChart(cv)` — gráfico barras horizontais
  - `buildConvexityDecompositionChart(cv)` — pie chart λ₁/λ₂/λ₃
  - `buildConvexityHistChart(cpValue)` — série temporal com annotations
  - `buildConvexityScenarios(cv, liveEth, liveSol)` — matriz stress testing
- **Chamadas em `buildConvexityUI()`**: todas as 4 funções + `updateVsHodlKpi()` (descrito abaixo)
- **Plugin Annotation**: linha 24 do head já tinha `chartjs-plugin-annotation@3.1.0` do trabalho anterior

#### `portfolio_analytics.html` — Régua Global USD/BRL/BTC/ETH (f37d3c1)
- **Botão novo no nav** (`currencyBtn`): entre "Relatório" e tema, texto muda com toggle
- **`toggleCurrency()` refatorada**: cicla 4 estados (USD → BRL → BTC → ETH → USD), salva em localStorage `bc-currency`, reatualiza UI completa (`renderUI`, `buildPnlOrigin`, `buildDebtChart`)
- **`fmtCurrency(usdValue, decimals)` estendido**: branch novo para BTC/ETH → divide USD pelo preço e usa decimais adaptativos (a ≥ 100 → 2 casas, a ≥ 1 → 3 casas, a ≥ 0.01 → 4 casas, senão 6 casas)
- **`currSymbol()` atualizado**: retorna `₿` (BTC), `Ξ` (ETH), `R$` (BRL), `$` (USD)
- **`toDisplay(usd)` estendido**: converte USD para régua (divide por `getPrice()` para tokens)
- **Restauração no `init()`**: se `bc-currency` em localStorage, restaura a última régua escolhida (persistência entre reloads)
- **Verificado ao vivo**: ciclo USD → BRL → BTC → ETH → USD, todas as conversões corretas (Patrimônio $6,107 → R$ 31.449 → ₿0.0950 → Ξ3.531), exec bar + tabelas + gráficos acompanham

#### `portfolio_analytics.html` — KPI "vs HODL" no hero (d271eff + d5824bb)
- **HTML novo**: card no hero após CAGR, mostra `+/-X% | Ξ/₿ agora vs Ξ/₿ HODL (Ξ/₿ delta)`
- **`computeVsHodl(coin)`**: calcula DCA equivalente mensal (cada aporte do usuário em ETH/BTC ao preço de cada mês), compara com patrimônio líquido atual (bruto − dívida) convertido pra coin → retorna delta % e absoluto
- **`updateVsHodlKpi()`**: popula o card, cores dinâmicas (verde se positivo/batendo HODL, vermelho se atrás), acompanha régua (mostra "vs HODL ETH/BTC")
- **Chamada em `renderUI()`**: após atualizar stats
- **Valores verificados ao vivo**: 
  - vs HODL ETH: −11.7% (Ξ3.531 atual vs Ξ3.997 DCA, −Ξ0.466 atrás)
  - vs HODL BTC: −44.9% (₿0.0951 atual vs ₿0.1725 DCA, −₿0.0775 atrás)

### Dados atualizados
Nenhum dado de posição alterado (todas as alterações foram estruturais e de visualização).

### Bugs corrigidos
1. **Edits multi-linha falhavam por CRLF** — substituído por edits de linha única
2. **Sinal de menos no delta do vs HODL** — trocado de `-` (hífen) para `−` (menos Unicode)

### Verificação
- **Convexidade**: 4 canvases (`cpImpactChart`, `cpDecompositionChart`, `cpHistChart`, matriz de cenários) renderizam OK, zero erros de console, dados corretos ao vivo
- **Régua**: botão alterna USD → BRL → BTC → ETH, conversões corretas, localStorage persiste régua entre reloads, todas as páginas refletem a mudança
- **vs HODL**: card renderiza % + delta, cores dinâmicas, segue régua, cálculo DCA bate com gráfico de Evolução Patrimonial

### Commits
- `4a5a6a0` — feat: convexidade completa — gráfico impacto, pie decomposição, evolução histórica, matriz de cenários
- `f37d3c1` — feat: régua de medida global no hero — USD/BRL/BTC/ETH (patrimônio e P&L em cripto)
- `d271eff` — feat: KPI 'vs HODL' no hero — alpha da operacao ativa vs comprar e segurar ETH/BTC
- `d5824bb` — fix: sinal de menos no delta do KPI vs HODL

### O que ainda falta
- **Mobile responsividade** — usuário não acessa pelo celular por enquanto, adiado
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** — labels só em PT
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT

---

Atualizado: 22/06/2026 — Convexidade visual completa (4 gráficos + matriz stress), Régua global no hero (USD/BRL/BTC/ETH), KPI vs HODL benchmark final

---

## Sessão 23/06/2026 — Convexidade refeita (perdida por sync) + Breakdown Alpha vs HODL + Fonte única `data.js` nos 6 arquivos + revisão de dados

### Contexto
Sessão longa, 3 frentes: (1) o trabalho de Convexidade da sessão anterior tinha sido **perdido por um `pull --rebase`/sync do OneDrive** antes do commit pegar — refeito do zero e travado no remoto imediatamente; (2) revisão geral dos dados a pedido do Lucas; (3) duas melhorias escolhidas por ele: breakdown do vs HODL por ativo (item 1) + fonte única de dados (item 3).

### ⚡ MUDANÇA ESTRUTURAL — `data.js` é a fonte única de posições

**A atualização mensal de posições agora é UMA edição só: `data.js`** (`window.BAROLO_DATA`). Os 6 arquivos HTML carregam via `<script src="data.js">` (no `<head>`, logo após `<meta charset>`) e leem qty/invested/dívidas/APYs dele, com os valores hardcoded antigos só como **fallback**. `MONTHLY_UPDATE_WORKFLOW.md` ganhou aviso no topo.

**Estrutura do `data.js`:** `asOf`, `brlRate`, `holdings[]` (ticker/cgId/qty/invested), `stables[]`, `defi.aave` (supply WETH/USDT {qty,apy} + borrow USDC {qty,apy} + healthFactor), `defi.kamino` (supply SOL/USDS + borrow USDC + ltv/liqLtv), `defi.uniswapV3`, `debt {aave,kamino,total}`, `stablesTotalUSD`, `lpPooled`.

**Metodologia (registrada no `data.js`):** as quantidades de holdings **já incluem** o colateral DeFi (Lucas não separa carteira vs DeFi no CoinGecko). Patrimônio = total holdings − dívida. O bloco `defi` é uma *view* do lending — **nunca somar** ao total (dupla contagem).

### Implementado

#### `portfolio_analytics.html` — Convexidade Completa (refeita) — `4a5a6a0`
`buildConvexityImpactChart(cv)` (barras top 10 por w×C[i]), `buildConvexityDecompositionChart(cv)` (pie λ₁/λ₂/λ₃), `buildConvexityHistChart(cpValue)` (série 19m + annotation alerta 0.20), `buildConvexityScenarios(cv,eth,sol)` (matriz 7 cenários). Tabela por ativo melhorada (vol de change24h, sort por impacto). Canvases: `cpImpactChart`, `cpDecompositionChart`, `cpScenariosTable`, `cpHistChart`.

#### `portfolio_analytics.html` — Régua global USD/BRL/BTC/ETH — `f37d3c1`
Botão `currencyBtn` no nav cicla 4 estados (`CURRENCY_ORDER`), salva em `localStorage['bc-currency']`, restaura no `init()`. `fmtCurrency()` com branch BTC/ETH (decimais adaptativos, símbolos ₿/Ξ). `currSymbol()`/`toDisplay()` estendidos. **Nota:** `toggleCurrency` existia mas o botão nunca tinha sido criado (estava órfã).

#### `portfolio_analytics.html` — KPI "vs HODL" + Breakdown por ativo — `d271eff`, `d5824bb`, `a76171c`
`computeVsHodl(coin)` (DCA equivalente vs patrimônio líquido em coin) + `updateVsHodlKpi()` no hero. `buildAlphaVsHodl()` + canvas `alphaHodlChart` na aba Performance: barras decompondo o vs HODL por ativo (`nowX − hodlX`, blendedEntry = TOTAL_INVESTED/hodlCoin) + linha "Alavancagem". Soma das barras reconcilia com o total. Segue a régua.

#### Fonte única `data.js` (item 3) — `a10a62c`, `fc76f79`, `404a900`, `9611802`
- `data.js` criado (baseline 20/06/2026).
- `portfolio_analytics.html`: `applyUpdate()` (~linha 3801) lê qty+invested de `BAROLO_DATA` (fallback `WEEKLY_UPDATE`); `AAVE_DEBT`/`KAMINO_DEBT` de `BAROLO_DATA.debt`.
- `index.html`: override `HOLDINGS` por cgId; `STABLES_USD`/`TOTAL_DEBT`/`STABLES_DRY_POWDER`.
- `relatorio.html`: override `PORTFOLIO_DATA` por ticker; `STABLES_USD`/`DEBT_TOTAL` + 12 constantes `AAVE_*`/`KAM_*` (qty+apy) de `BAROLO_DATA.defi`.
- `pools.html`: `STABLES` (×2), `AAVE_BORROW_RATE`, fallbacks de dívida.
- `ferramentas.html`: override do objeto `BASE`.
- `emprestimos.html`: `updateCollateralCards()` lê qty + dívidas de `BAROLO_DATA`.
- Verificado ao vivo em cada página: valores aplicando, **zero erros de console**.

#### Documentação — `baa039f`, `9611802`
`CLAUDE.md` seção "Posições atuais" → baseline 20/06 + aviso de metodologia; pendência fantasma "propagar baseline 12/06" resolvida. `MONTHLY_UPDATE_WORKFLOW.md` aponta para `data.js`.

### Dados atualizados

**Custo de aquisição canônico — decisão do Lucas (23/06/2026):** `invested` = **USD realmente pago** (não o "custo" do CoinGecko `valor − P&L`, que tinha artefato em stablecoins — USDT aparecia com custo $582 e "+$719 de lucro").

| Campo | Antes (CoinGecko-cost) | Depois (canônico) |
|-------|----------------------|-------------------|
| ETH invested | $4.532,01 | **$4.880,53** |
| SOL invested | $2.435,48 | **$2.450,94** |
| USDT invested | $582,64 | **$1.302,524** |
| TOTAL_INVESTED | ~$8.831 | **$9.954,95** |
| vs HODL ETH | −11.7% | **−16.4%** (honesto) |

Baseline 20/06/2026 (consistente nos 6 arquivos): ETH 2.376 / SOL 23.31 / BTC 0.00204; AAVE 2.16 WETH + 1.300 USDT borrow 754.65 @ 5.38%; Kamino 23.36 SOL + 302.25 USDS borrow 815.97 @ 5.69%; stables $1.602,52; dívida $1.570,62.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Convexidade "sumiu" | `pull --rebase`/sync OneDrive sobrescreveu antes do commit | Refeito e commitado/pushado **imediatamente** após cada bloco (pull --rebase + push, verificando `origin == HEAD`) |
| `vs HODL` com salto/pessimista | `computeVsHodl` misturava fiat aportado ($7.100) com custo-base ($9.954) → salto no último mês | Escala a série de aportes ao total canônico preservando o timing |
| Patrimônio "subestimado $7k" (falso positivo) | Assumi CoinGecko = só carteira; Lucas esclareceu que já inclui colateral DeFi | Sem mudança de cálculo; metodologia documentada |
| `invested` divergente (2 fontes) | `applyUpdate()` sobrescrevia com `WEEKLY_UPDATE.invested` (CoinGecko-cost) | `applyUpdate` lê de `data.js` (USD pago canônico) |
| Edits multi-linha falhando | CRLF (Windows) | Edits de linha única |

### O que ainda falta
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** — labels só em PT
- **Validar `calcLevHedge()`** com cenários reais
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT
- **Reconciliar `wealthCurve.invested`** (série mensal termina em $7.100) com o total canônico $9.954 — hoje `computeVsHodl` escala localmente; reconciliação histórica dos 53 pontos fica pendente
- **`avgCost` do ETH** no `PORTFOLIO_DATA` — campo cosmético inconsistente (não usado em cálculo)

---

Atualizado: 23/06/2026 — `data.js` é a fonte única de posições (6 arquivos), Breakdown Alpha vs HODL por ativo, invested canônico = USD pago ($9.954), Convexidade refeita

---

## Sessão 24–25/06/2026 — Redesign UX (a16z/WeSearch/Metrix) + market board cripto + razão áurea (φ) + revisão de copy + paleta unificada + BTC update

Sessão longa, multi-frente. Lucas pediu redesign da UX inspirado em **a16z.com**, **wesearchdao.xyz** e **metrix.finance**. Via `AskUserQuestion` escolheu: escopo **Landing + dashboards**, direção **dark + ouro modernizado** (manter identidade, evoluir layout/tipografia/grid/motion). Toda a verificação foi via preview local (`barolo-site` em launch.json); o `preview_screenshot` trava nas páginas longas/animadas (ambiental) — verificação feita por `preview_eval` lendo o DOM/computed styles. **Zero erros de console** em todas as páginas ao final.

### Implementado

#### `index.html` — Hero editorial 2 colunas + painel "Barolo · Live" (a16z + Metrix + WeSearch)
- `.hero` virou **grid 2 colunas**; `.hero-lead` (texto) à esquerda, `<aside class="hero-panel">` à direita.
- **Painel de dados ao vivo** `.hero-panel`: header "Barolo · Live" + dot verde pulsante (`.hp-dot` / `@keyframes hpPulse`); mini-tabela de mercado (`.hp-row`: `.hp-coin` + `.hp-sym` + `.hp-name` + `.hp-spark` + `.hp-price` + `.hp-chg`); grid 2×2 de stats (`.hp-stat`: CAGR/Track Record/Retorno Anual/Foco — IDs `heroCAGR`, `heroRealReturn`, `heroCAGRYTD` preservados p/ o count-up); rodapé `.hp-foot` ("Desde 2021 · Gestão privada" + "● noindex").
- **Overlay de grade modular** (`.hero::after`, `background-size` Fibonacci, mask radial que desbota nas bordas).
- **Numerais editoriais de seção** (`.section-num`) ampliados (Cormorant, 89px) como watermark.
- **Nav**: underline dourado animado no hover/ativo (`.nav-links a::after` scaleX); `.strat-card::before` top-accent dourado que cresce no hover.
- **Plumbing reaproveitado**: `renderTicker(prices)` agora também chama `renderHeroMarket(prices)` (popula `hm-btc/eth/sol` + `-c`) — mesma fonte do ticker, zero requisição extra. Strings i18n novas (`hp-cagr/track/irr/focus/foot-since`) em EN e PT. Animação de entrada (`riseIn`), reduced-motion e safety-net atualizados para incluir `.hero-panel` (removido `.hero-stats`).

#### `ui-polish.css` (NOVO) — camada de polish compartilhada
- Linkado no `<head>` de index + portfolio + pools + emprestimos + ferramentas + relatorio (`<link rel="stylesheet" href="ui-polish.css">`).
- Conteúdo: `::selection` dourada; **scrollbar fina dourada** (webkit + firefox); **nav underline** no hover (`nav .nav-links a:hover` border-bottom, vence por especificidade); **hover de cards** (`.stat-card/.metric-card/.defi-card/.hero-card` → translateY + glow, `!important` p/ vencer `box-shadow:none`); **top-accent dourado** no `.hero-card::after`; `.btn-sm` hover; `@media reduced-motion`.
- Seguro por design (só refina; não altera layout/paleta-base/lógica de gráficos).

#### `index.html` — Market board cripto-nativo nos assets
- **BTC adicionado** (lidera o token-grid) · **RADIANT removido** do quadro visível (RDNT continua no cálculo interno via data.js).
- Cada `.token-card` ganhou, via JS, **preço ao vivo + variação 24h colorida + sparkline 7d**: `buildTokenBoard()` (lê `.token-ticker`, mapeia `TICKER_TO_CG`, injeta `.token-quote` + `<svg.token-spark>` antes da seta), `renderTokenBoard(prices)` (reaproveita fetch do ticker), `drawSparkline(svg,arr)` (polyline normalizada, verde/vermelho por tendência 7d), `fetchSparklines()` (CoinGecko `/coins/markets?sparkline=true`, cache `bc-index-spark-cache` 10 min, fallback gracioso), `applySparks(map)` (desenha em `.token-spark[data-cg]` E `.hp-spark[data-cg]`).
- CSS: `.token-spark`, `.token-quote`, `.token-price`, `.token-chg.up/.dn`; sparkline some em ≤680px.

#### `index.html` — Hero "mais vivo" (escolha do Lucas via AskUserQuestion)
- **Sparklines no painel do hero** (BTC/ETH/SOL): `<svg class="hp-spark" data-cg="...">` em cada `.hp-row`; grid da row ajustado p/ `1fr 46px auto 56px`.
- **Título com efeito de digitação**: IIFE no script "Hero vivo" — captura `innerHTML`, esvazia, digita char-a-char preservando o `<em>` dourado + `.type-caret` piscando; roda 1× no load; respeita reduced-motion; não roda no toggle de idioma.
- **Aurora/grid/spotlight que seguem o cursor**: `pointermove` (rAF-throttled) seta `--mx/--my` (spotlight radial no `.hero` background) e `--gx/--gy` (translate do `.hero::after`); `pointerleave` reseta.

#### `index.html` — Razão áurea (φ) como sistema de design (escolha: "Sistema φ na landing + motivo")
- Tokens no `:root`: `--phi:1.618`, `--inv-phi:0.618`, `--fib-1..6` (8·13·21·34·55·89).
- **Proporção**: `.hero` grid `1.618fr 1fr` (= 61.8% / 38.2%, medido 642/397px); `hero-sub` max-width ≈ `610×1/φ`.
- **Escala/ritmo Fibonacci**: hero-title `clamp(34px,6vw,89px)`; section-title `clamp(34px,4vw,55px)`; section-num 89px (55→34 responsivo); paddings/gaps/margens em 21/34/55/89; grid modular `55×55`.
- **Espiral áurea (assinatura)**: `<svg class="phi-spiral">` no hero, path gerado por JS (log-spiral cresce ×φ por quarto de volta, centro na linha áurea 61.8%), opacity .13 ouro, **desenha ao carregar** (stroke-dashoffset 2.6s), reduced-motion-guard.
- **Selo** no rodapé: `phi-note` "Designed on the golden ratio · φ 1.618" / "Projetado na proporção áurea" (EN/PT).

#### `index.html` — Reordenação de seções
- Nova ordem: **Sobre (01) → Portfolio (02: Ativos + Track Record + Inflação) → Selective Strategies (03) → Contato (04)** (Portfolio subiu antes de Strategies). Numerais renumerados; **nav reordenado** (Home · About · Portfolio · Strategies · Contact).

#### `index.html` — Widget de gwei fixo + logos no painel
- **Widget de gas fixo** no canto inferior direito (`position:fixed`, `.gwei-widget` / `#gweiVal`): pílula dourada com dot verde, valor ao vivo via **Alchemy `eth_gasPrice`** (`/1e9`, decimais), atualiza a cada 45s. "Rola junto com a página" (sempre visível).
- Painel "Barolo · Live": **bolinhas coloridas (`<span.hp-coin>`) → logos dos tokens** (`<img.hp-coin>` BTC/ETH/SOL do CoinGecko, com `onerror` que restaura a cor de fundo). `.hp-coin` ganhou `object-fit:cover` + borda.

#### Paleta unificada nos dashboards (warm da index, mesmo layout)
- `:root` (dark) de **portfolio, pools, emprestimos, ferramentas, relatorio** trocado de roxo → warm: `--bg:#0e0e12 --surface:#141418 --surface2:#1a1a20 --border:#2a2620 --border2:#3a3228 --text:#e8dfc8 --muted:#8a7a62` (accent/green/red/yellow/orange/token-colors preservados). Light alinhado à index (`--bg:#f5f0e8 --surface:#faf6ee --surface2:#f0ebe0 --border:#ddd4c0 --text:#2a1e0e --muted:#7a6a52`).
- **Nav backgrounds** (eram `rgba(13,9,23,0.96)` roxo) → `rgba(14,14,18,0.96)`; dropdown mobile `rgba(...)` → `rgba(20,20,24,.98)`.
- **Blocos `@media print`** e literais hardcoded warmificados (`#0d0917→#0e0e12`, `#14102b→#141418`, `#1a1533→#1a1a20`, `#2a2244→#2a2620`).
- `ferramentas.html`: vars extras (`--s1/--s2/--s3/--dim`) warmificadas; `--purple`/`--orange`/`--border2`(gold) mantidos (funcionais). "Refinando as bordas" = de roxo translúcido `rgba(180,140,240,0.09)` → bordas warm definidas `#2a2620`.

#### `portfolio_analytics.html` — Evolução Patrimonial reordenada
- Bloco **"Evolução Patrimonial — Histórico Completo"** (`#wealthKpis` + `#wealthEvolutionChart` + botões USD/BTC/ETH + link Relatório PDF) **movido para logo abaixo** de "Curva de Patrimônio & Benchmark" (antes ficava após Heatmap/Drawdown/Análise/P&L/DCA). Sem duplicação (1 chart, 4 KPIs).

#### `portfolio_analytics.html` + `pools.html` — Ticker do rodapé
- **Relógio removido** (`#mkTs` / `#tickerTs` deletados do HTML + `setEl(...toLocaleTimeString...)` removido do JS).
- **Gwei corrigido**: era `Math.round(parseInt(result,16)/1e9)` → mostrava "0 gwei" p/ gás < 1 gwei. Agora `gwei < 10 ? toFixed(2) : toFixed(1)` e cor **dourada** (`--accent`), igual ao widget da index. Obs.: o gwei do ticker depende do fetch de preços (CoinGecko) rodar antes — no navegador do Lucas os preços carregam, então exibe certo.

#### Revisão de copy EN/PT (alinhamento com a filosofia)
- **Posicionamento → indivíduo / prova de competência** (Lucas escolheu via AskUserQuestion): removido tom de "firma/empresa que capta cliente". Reescritos `hero-sub`, `about-lead` ("gestão independente e individual de capital próprio… prova de competência, privada"), `about-p2` (injetado **yield paga a vida / capital fica trabalhando** + **sucesso medido em ativos acumulados, não no preço** — lógica Barsi/tokens-não-dólar), `strat2-desc` (**alavancagem defensiva e anticíclica**, renda de taxas paga a dívida), `contact-desc` (tirou "parcerias/colaboração").
- `ferramentas.html` aba **Crenças**: "uma empresa independente" → "gestão independente e individual de capital próprio… não um serviço vendido a terceiros". `relatorio.html`: rótulo "borrow colateralizado **defensivo**".
- **Bug**: string EN do `perf-note` dizia "aporte" (português) → "the timing of contributions"; e o `perf-note` agora carrega em **EN no load** (antes vinha PT) com **negrito + link preservados nos dois idiomas** (markup movido p/ os valores i18n).

### Dados atualizados

**Data de fundação confirmada = 2021** (Lucas mandou print: 1ª compra ETH **13/12/2021** 0.0130 ETH @ $4.002,90 e **16/12/2021** 0.0084 ETH @ $3.979). "Desde 2021" canônico; série de performance medida de **jan/2022** (1º mês completo). `perf-note` agora explicita "DCA mensal desde dez/2021; série medida a partir de jan/2022" — resolve a aparente contradição com "CAGR 2022–2026". Memória `project_founding_date.md` criada (+ índice MEMORY.md).

**Compra de BTC (24/06/2026)** — print CoinGecko, atualizado em `data.js`:
| Campo | Antes | Depois |
|---|---|---|
| BTC qty | 0.00204156 | **0.0026964** (+0.00065484) |
| BTC invested | $135,74 | **$174,58** (+$38,84) |
| TOTAL_INVESTED | $9.954,95 | **≈$9.993,79** |
| `asOf` | 2026-06-20 | **2026-06-24** |

Diário NÃO duplica: o sync de trades foi removido de index e portfolio ("Diário DeFi NÃO altera mais as holdings") — é só log pessoal; o site lê da base (`data.js`).

### Bugs corrigidos
| Bug | Causa | Fix |
|-----|-------|-----|
| Ticker rodapé "0 gwei" | `Math.round` arredondava gás < 0,5 gwei para 0 | `toFixed(2/1)` (decimais) + cor dourada |
| `perf-note` EN com "aporte" (PT) e carregando em PT no load | string i18n EN tinha palavra PT; HTML estático do perf-note era PT | "timing of contributions"; HTML default → EN; markup (bold+link) movido p/ i18n EN e PT |
| Nav dos dashboards continuava roxo após trocar `:root` | nav bg era `rgba(13,9,23,..)` hardcoded (não usava var) | replace_all p/ `rgba(14,14,18,..)` |
| `preview_screenshot` timeout em páginas longas/animadas | Ambiental (compositor ocupado com aurora/espiral/ticker) | Verificação via `preview_eval` (DOM/computed styles) |

### Commits (push direto na main)
- `5010c79` — redesign UX (landing + dashboards) + market board ao vivo + revisão de copy
- `7c8cc8b` — landing redesenhada sobre a razão áurea (φ)
- `9b1f7ac` — index (reorder seções + gwei fixo + logos no painel) + paleta unificada nos dashboards
- `4e0daef` — BTC update (24/06) + reorder Evolução Patrimonial + ticker (sem relógio, gwei decimal)

### O que ainda falta
- **Sistema φ nos dashboards** — Lucas pode querer levar as proporções/escala áurea pros painéis (avaliado, ficou de fora por ser mais arriscado nos gráficos).
- **Gwei do ticker desacoplado do fetch de preços** — hoje o gwei do rodapé só aparece se o fetch CoinGecko rodar antes; na index o gwei é independente. Se rate-limit do CoinGecko atrapalhar, considerar desacoplar (como na index).
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** (ferramentas) — labels só em PT
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT
- **CLAUDE.md topo "desde 2022"** — desatualizado; o correto é 2021 (ver memória `project_founding_date.md`)

---

## Sessão 01/07/2026 — Compra BTC computada no data.js

### Implementado
- Lucas mandou print de transação CoinGecko (compra BTC, 01/07/2026 10:59AM): **+0.00164555 BTC @ $58.272,31 = $95,89** (taxa $0,00).
- `data.js` — único arquivo editado (fonte única de posições, ver sessão 23/06):
  - `holdings[0]` (BTC): `qty` `0.0026964 → 0.00434195` (+0.00164555) · `invested` `$174,58 → $270,47` (+$95,89)
  - `asOf`: `2026-06-26 → 2026-07-01`
  - Comentário de baseline no topo do arquivo atualizado com a nota da compra
- Verificado no preview local (`preview_start` porta 8080 + `preview_eval`): `window.BAROLO_DATA.holdings` reflete o BTC novo; zero erros de console.
- Commit `b8913b5` → `git pull --rebase origin main` (remoto tinha 4 commits novos da Action diária `data: atualização on-chain BTC (automático)`, sem conflito) → push `39e4451` direto na main.

### Dados atualizados
| Campo | Antes | Depois |
|---|---|---|
| BTC qty | 0.0026964 | **0.00434195** (+0.00164555) |
| BTC invested | $174,58 | **$270,47** (+$95,89) |
| `asOf` (data.js) | 2026-06-26 | **2026-07-01** |

Como o `data.js` é a fonte única (desde 23/06/2026), nenhum outro arquivo HTML precisou ser tocado — os 6 arquivos leem esse valor automaticamente.

### Bugs corrigidos
Nenhum nesta sessão.

### O que ainda falta
- **Sistema φ nos dashboards** — avaliado, ficou de fora por ser mais arriscado nos gráficos
- **Gwei do ticker desacoplado do fetch de preços** (pools/portfolio) — hoje depende do CoinGecko rodar antes; na index é independente
- **`monthlyReturns[2026].Abr`** — preencher quando metodologia confirmada
- **CSVs das CEX** — custo de aquisição em BRL + base para IR
- **i18n painel Sizing & Risk** (ferramentas) — labels só em PT
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT
- **CLAUDE.md topo "desde 2022"** — desatualizado; o correto é 2021 (ver memória `project_founding_date.md`)

---

Atualizado: 01/07/2026 — Compra BTC (+0.00164555 @ $58.272,31) computada via `data.js`, push direto na main

---

## Sessão 03/07/2026 — Pendências fechadas: monthlyReturns Mai/Jun, CSVs CEX localizados, i18n Sizing & Risk (bug real) + validação calcLevHedge

### Contexto
Sessão de limpeza de pendências acumuladas: `monthlyReturns[2026].Abr`, CSVs das CEX, i18n do painel Sizing & Risk, validação de `calcLevHedge()`, e o "desde 2022" no topo deste arquivo (já corrigido acima).

### Implementado

#### `portfolio_analytics.html` — monthlyReturns 2026 completo até Jun
- **Abr/2026 já estava preenchido (+40,3%)** desde sessão anterior não registrada — verificado batendo com TWR: `(9206−266−6371)/6371 = 40,3%` (266 = aporte novo no mês). A nota "preencher quando metodologia confirmada" era stale.
- **Mai/2026 e Jun/2026 preenchidos** usando a mesma metodologia TWR (remove aportes novos antes de calcular o retorno do mês):
  - Mai/26: `(7392−266−9206)/9206 = −22,6%`
  - Jun/26: `(7651−150−7392)/7392 = +1,5%`
- Array: `2026: [-18.0,-22.0,-13.6,+40.3,-22.6,+1.5,null,null,null,null,null,null]`

#### CSVs das CEX — encontrados e localizados
- Não eram CSVs soltos — **já haviam sido consolidados em 11/05/2026** em `Custo_Aquisicao_BRL_Lucas.xlsx` e `Custo_BRL_Consolidado_Lucas.xlsx` (raiz do projeto), com histórico completo Binance + OKX de out/2021 a jun/2026.
- **Total BRL investido em cripto: R$ 35.498,19** (Binance R$ 29.664,20 + OKX R$ 5.065,50 — só conversões fiat→cripto/stable, sem duplicar compras já no CoinGecko).
- Câmbio médio de entrada por token disponível na aba "Resumo" do consolidado (ex: BTC R$ 296.174/BTC, ETH R$ 15.096/ETH blended).
- **Não foi integrado a nenhuma página** — os arquivos existem mas nunca foram usados para gerar uma seção de custo BRL/IR no site. Fica como próximo passo se Lucas quiser essa view.

#### `ferramentas.html` — i18n Sizing & Risk: labels já estavam OK; bug real era nos vereditos dinâmicos
- Auditoria mostrou que **os 111 `data-i18n` do painel já tinham PT+EN completos** desde alguma sessão não registrada (`sz-header-*`, `sz-kp-*`, `sz-km-*`, `sz-hd-*`, `sz-lh-*`, `sz-notes-*`) — a nota "labels só em PT" também era stale.
- **Bug real encontrado**: `toggleLang()`/`applyLang()` só atualiza elementos `[data-i18n]` estáticos — os vereditos das 4 calculadoras (`kp-verdict`, `km-verdict`, `hd-verdict`, `lh-verdict`, notas e avisos) são gerados via JS (`tStr()`) e ficavam presos no idioma anterior até o próximo input. **Fix**: `applyLang()` agora chama `calcKellyPool()`, `calcKellyMerton()`, `calcHedge()`, `calcLevHedge()` (com guard `document.getElementById`) depois de trocar o idioma.
- **`hd-inrange`** ("IN-RANGE"/"FORA DO RANGE") não usava `tStr` — hardcoded PT. Adicionadas chaves `sz-hd-status-in`/`sz-hd-status-out` e trocado para `tStr(...)`.
- **`lh-note`** (baseNote + 3 avisos de `calcLevHedge`) estava 100% hardcoded em PT dentro do JS, ignorando o idioma. Adicionadas chaves `sz-lh-warn-maxborrow`, `sz-lh-warn-hedge`, `sz-lh-warn-borrow80`; JS trocado para `tStr(...).replace(...)`.
- Verificado no preview (`applyLang('en')` / `applyLang('pt')`): todos os vereditos e avisos alternam corretamente nos dois idiomas, sem stale text.

#### `ferramentas.html` — bugs de corrupção/duplicação encontrados e corrigidos (achados ao validar `calcLevHedge`)
- **`flashHighlight`/`showToast` duplicadas 4× no arquivo** (redeclaração de função). A última cópia (que prevalece em JS) tinha o ícone corrompido: `'<span class="toast-icon">�u2713</span>'` em vez de `✓`. Removidas as 3 cópias redundantes, mantida 1 versão limpa.
- **`loadBaroloScenario()`** tinha um bloco de feedback visual órfão no meio da função — `flashHighlight([...IDs do painel Hedge LP...])` + `showToast("Pool ativa carregada...")` (texto e IDs errados, copiados de `loadActivePoolHedge()`) entre `set('lh-brw', ...)` e `set('lh-fund', ...)`. Removido; o `flashHighlight`/`showToast` corretos (com IDs `lh-*` e texto "Cenário Barolo carregado...") já existiam no final da função.

#### Validação de `calcLevHedge()` — 3 cenários testados manualmente
1. **Real (Cenário Barolo, `loadBaroloScenario()`)**: capital $5.040, LP $385, 100% borrow, sem hedge → A +1,53%/Sh 0,67, B=C +2,52%/Sh 1,10 (B=C esperado, pois `hPct=0` anula o efeito do hedge). Matemática bate 100% com a fórmula manualmente recalculada.
2. **Hipotético $2.000 com hedge 100%**: capital $6.000, LP $2.000, 50% borrow, hedge 100% → C domina (APR +12,10%, DD 0%, Sharpe ∞) por IL residual e DD zerados pelo hedge total. Decomposição (fees $640, supply $90, IL $0, borrow −$54, funding +$50, net $726) confere linha a linha.
3. **Extremo super-alavancado ($8.000 LP sobre $6.000 capital, 100% borrow)**: sanity check corretamente dispara aviso "Borrow (8000) excede capacidade do colateral (4800 @ 80% LT). Cenário inviável." — o modelo não trava nem gera NaN/Infinity, apenas avisa.
- **Nota de modelagem** (não é bug): o drawdown de A/B usa `lp×delta×vol / capital` — não escala com `brwPct` diretamente, pois mede a exposição direcional em $ da própria posição LP (fixa), não o risco de solvência da alavancagem. O risco de solvência é coberto separadamente pelo aviso de "borrow excede capacidade do colateral".
- **Conclusão: `calcLevHedge()` está matematicamente correto** nos 3 cenários testados; os únicos problemas encontrados na área foram os bugs de UI/i18n acima, não a lógica de cálculo.

#### CLAUDE.md — "desde 2022" corrigido
- Linha 5 (abertura do arquivo): `desde 2022` → `desde 2021 (1ª compra ETH em 13/12/2021)`.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Vereditos do Sizing & Risk presos no idioma anterior após toggle | `applyLang()` só atualizava `[data-i18n]` estáticos, não recalculava as 4 calculadoras | `applyLang()` chama `calcKellyPool/calcKellyMerton/calcHedge/calcLevHedge` após trocar idioma |
| `hd-inrange` e avisos de `lh-note` hardcoded em PT | Strings direto no JS, sem `tStr()` | Chaves novas em `LANG_STRINGS` + `tStr(...)` nos dois lugares |
| Ícone de toast corrompido (`�u2713`) | 4 cópias duplicadas de `flashHighlight`/`showToast`; a última (vencedora) estava corrompida | 3 cópias redundantes removidas, mantida 1 limpa com `✓` |
| `loadBaroloScenario()` mostrava toast/flash errado ("Pool ativa carregada" com IDs do Hedge LP) no meio da execução | Bloco copiado de `loadActivePoolHedge()` colado por engano | Bloco órfão removido; o flash/toast correto do final da função permanece |

### O que ainda falta
- **CSVs CEX → integração no site** — dados consolidados existem (`Custo_*_Lucas.xlsx`) mas não viram uma seção/página; avaliar se Lucas quer uma view de custo BRL/IR em `relatorio.html` ou nova página
- **Sistema φ nos dashboards** — avaliado, ficou de fora por ser mais arriscado nos gráficos
- **Gwei do ticker desacoplado do fetch de preços** (pools/portfolio)
- **Mentoria DeFi avançado** — Euler V2, Morpho Blue, Gearbox V3, Drift basis trade, Hyperliquid HLP, Pendle PT

---

Atualizado: 03/07/2026 — monthlyReturns Mai/Jun preenchidos, CSVs CEX localizados (R$ 35.498,19 consolidado), i18n Sizing & Risk corrigido (vereditos dinâmicos + bugs de duplicação/corrupção), calcLevHedge() validado em 3 cenários, cabeçalho "desde 2021" corrigido

---

## Sessão 06/07/2026 — Design system (tentado e revertido) + limpezas invisíveis + Design.md + tooltip "bolinha" nos gráficos

### Arco da sessão
Pedido inicial: transformar a UX num **design system compartilhado** (worktree, agentes paralelos, biblioteca de componentes). Executei por completo — e **Lucas rejeitou** ("não gostei nada do que foi feito, pode voltar ao normal a UX"). **Revertido 100%, nada foi para a main.** Em seguida fizemos só melhorias invisíveis, criamos o `Design.md`, e por fim a mudança de tooltip dos gráficos.

### Implementado

#### 1. Design system compartilhado — TENTADO e REVERTIDO (⚠️ NÃO está no repo)
- Worktree `worktree-design-system`. Criei `design-system/{tokens.css,components.css,ui.js}` + `GOAL.md` + `README.md`; migrei `relatorio.html` (referência) + `index/portfolio/pools/ferramentas` via **4 agentes Sonnet paralelos** (background), tudo validado no browser. Decisão de escopo escolhida por Lucas na hora: "canônico + variantes".
- **Lucas rejeitou a mudança de UX.** `ExitWorktree` com `remove` descartou os 5 commits e todo o `design-system/`. **Nada foi pushado.**
- **Lição (registrar):** Lucas quer **zero mudança de UX/design**. Não impor refactor visual. Preferir mudanças invisíveis e, quando houver risco visual, **perguntar antes** (usei `AskUserQuestion`).

#### 2. ⚠️ DESCOBERTA — `emprestimos.html` é um BUNDLE (não é editável à mão)
- O arquivo root (884 KB, 178 linhas) é um **artefato de build minificado**: shell `__bundler_loading` / `__bundler_thumbnail` / `__bundler_placeholder` + payload **base64/gzip** (`H4sI…`) numa única linha de 729 KB.
- **NÃO tem** `:root`/nav/CSS/`ui-polish`/`BAROLO_DATA`/`fetchAave` legíveis — tudo está comprimido dentro do bundle.
- **Consequência (importante p/ próximas sessões):** não editar `emprestimos.html` diretamente. Mudança de design/JS nele exige o **código-fonte original + rebuild**. Fica fora de escopo de qualquer edição inline (design system, tooltip, etc.).
- Contradiz a premissa "HTML estático puro, sem build step" — provavelmente algum experimento/tool sobrescreveu o fonte no root em algum momento.

#### 3. Melhorias invisíveis — commit `6dbba00` (pushado)
Lucas pediu "o que for para melhorar apenas, sem mudar a UX". Escolheu 4 via `AskUserQuestion`; fiz 3 e pulei a 4ª:
- **Limpeza de worktrees:** 27 worktrees obsoletos removidos de `.claude/worktrees/` (`git worktree remove` sem `--force`). O OneDrive sincronizava ~29 cópias inteiras do site. **2 preservados** por terem trabalho não-commitado: `fervent-boyd-3709cc`, `upbeat-edison-4705fd`.
- **CSS duplicado (`ferramentas.html`):** removidas 3 de 4 cópias byte-idênticas do bloco "FEEDBACK VISUAL: Highlight + Toast" (`highlightFlash`/`toastSlideIn`/`.toast-notification`, ~85 linhas). 1 cópia mantida. Renderização idêntica.
- **HTML malformado (`portfolio_analytics.html`):** removido o `</head>` **prematuro** (linha 21). Os `<script>` do Chart.js + o `<style>` principal ficavam depois dele; o `</head>` real é o da linha 563 (antes do `<body>`). Browsers já processavam esse conteúdo como head → renderização idêntica. Verificado: 32 canvases OK, 0 erros.
- **#4 Centralizar tokens — PULADO (decisão do Lucas):** análise (script) mostrou que os tokens **divergiram** muito entre páginas; só **16 props** são idênticas nas 5 (9 no `:root`, 7 no `[data-theme=light]`). Detalhe na tabela de divergência do `Design.md §2.2`. Risco (quebrar `:root` = perder cores) > ganho.

#### 4. `Design.md` criado na raiz — commit `3e0589d` (pushado)
Mapa único de UX/design para atualizar a interface sem ler o código todo. Seções:
- **§0** regras invioláveis (privacidade, JetBrains Mono nos números, `data.js` fonte de posições, `emprestimos` é bundle, sem build).
- **§1** tabela "Quero mudar X → vá aqui".
- **§2** tokens (paleta canônica de 16 props + **tabela de divergência por página** — não há fonte única de cor).
- **§3** tipografia · **§4** componentes (nav + 2 variantes, ticker, botões, cards, tabs) · **§5** interações JS por página · **§6** mapa das 6 páginas · **§7** testar/deploy · **§8** pegadinhas.
- Reflete a **realidade inline atual** (cada página autossuficiente; a lib compartilhada foi descartada).

#### 5. Tooltip dos gráficos → "bolinha" cheia — commit `dee156e` (pushado)
- Pedido: no hover, mostrar **bolinha (círculo) cheia da cor da série, sem borda** em vez do quadrado padrão do Chart.js (referência: gráficos da aba Performance do Portfolio).
- **Implementação global** via `Chart.defaults`, num `<script>` inline logo após o `<script src=…chart.umd…>` no `<head>` de cada página com gráficos: `portfolio_analytics`, `pools`, `ferramentas`, `index`, `relatorio`:
  ```js
  Chart.defaults.plugins.tooltip.usePointStyle = true;
  Chart.defaults.plugins.tooltip.callbacks.labelPointStyle = () => ({ pointStyle:'circle', rotation:0 });
  Chart.defaults.plugins.tooltip.callbacks.labelColor = (ctx) => {
    const ds=ctx.dataset||{}, at=v=>Array.isArray(v)?v[ctx.dataIndex]:v;
    const c=[at(ds.borderColor),at(ds.pointBackgroundColor),at(ds.backgroundColor)].find(x=>typeof x==='string'&&x)||'#c9a050';
    return { borderColor:c, backgroundColor:c, borderWidth:0 };
  };
  ```
- Guardado com `if(window.Chart)`; os loaders lazy de pools (`loadChartJs`) e ferramentas (`loadCharts`) têm `if(window.Chart)` → os defaults do `<head>` persistem. Não precisou tocar em cada gráfico. `emprestimos` fora (bundle).
- Documentado em `Design.md §4.6` (como trocar formato/reativar borda).
- Validado no browser nas 5 páginas: `usePointStyle=true`, `labelColor`/`labelPointStyle` são funções, swatch computado `{ backgroundColor==borderColor, borderWidth:0 }` (bolinha cheia, sem borda), gráficos renderizam (portfolio 31, pools 9, relatorio 2, ferramentas/index OK), **0 erros de console**.

### Dados atualizados
Nenhum dado de posição alterado — só estrutura/UI/docs. `data.js` e valores intocados.

### Bugs corrigidos
| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| `portfolio_analytics.html` com `</head>` duplicado | `</head>` prematuro na linha 21; scripts Chart.js + `<style>` caíam depois | Removido o prematuro; `<head>` vai até a linha 563 (antes do `<body>`). Zero mudança de render. |
| `ferramentas.html` com 4 cópias idênticas do CSS de toast | Duplicação acumulada em sessões antigas | Mantida 1, removidas 3 (~85 linhas) |
| ~29 worktrees obsoletos sincronizando no OneDrive | Sobras de sessões antigas em `.claude/worktrees/` | 27 removidos (`git worktree remove`); 2 com trabalho pendente preservados |
| Tooltip dos gráficos mostrava quadrado | Default do Chart.js | `Chart.defaults` global → bolinha cheia da cor, sem borda |

### O que ainda falta
- **`emprestimos.html`** — é bundle; qualquer mudança (design system, tooltip, dados de display) só via **fonte original + rebuild**. Não editar o artefato. (O `M emprestimos.html` no working tree é uma alteração **pré-existente do Lucas**, não-commitada — preservada em todos os pushes via `git stash`; não mexer.)
- **Design system compartilhado** — Lucas **rejeitou**; só refazer se ele pedir explicitamente **e** sem mudança de UX.
- **Centralizar tokens (fonte única de cor)** — pulado; tokens divergiram (só 16 props comuns). Se um dia quiser, reconciliar a `Design.md §2.2`.
- **`Design.md`** — manter atualizado ao mexer em UX (é o mapa de referência agora).
- Pendências antigas mantidas: integração dos CSVs CEX (custo BRL/IR), mentoria DeFi avançado (Euler V2, Morpho, Gearbox, Drift, Hyperliquid HLP, Pendle PT).

### Commits (pushados direto na main)
- `6dbba00` — limpezas invisíveis (worktrees, CSS dup em ferramentas, `</head>` em portfolio)
- `3e0589d` — `Design.md` (mapa de UX/design)
- `dee156e` — tooltip bolinha cheia da cor da série em todos os gráficos

---

Atualizado: 06/07/2026 — Design system compartilhado **tentado e revertido** (Lucas rejeitou; nada na main); descoberto que **`emprestimos.html` é um bundle** (não editável à mão); limpezas invisíveis (27 worktrees, CSS dup, `</head>`); **`Design.md`** criado (mapa de UX); **tooltip dos gráficos vira bolinha cheia sem borda** (global via `Chart.defaults`, 5 páginas)

---

## Sessão 08/07/2026 — Revisão geral de erros: e-mail de contato restaurado (Cloudflare cfemail) + HTML malformado + JS duplicado

### Contexto
Lucas pediu: "revise todos os modelos, pode ficar à vontade para fazer o que bem entender, revise os erros, adeque o que precisar" — mantendo a regra estabelecida de **zero mudança de UX/visual**. Varredura completa das 6 páginas: análise estática (script Node: balanceamento de tags, chaves/parênteses por `<script>`, funções duplicadas) + navegador via preview (console, rede, interações) + consistência do `data.js`.

### Implementado

#### `index.html` — E-mail de contato restaurado (bug REAL em produção, o mais grave)
- **Sintoma:** todo visitante via "**[email protected]**" com link morto na seção Contato (04).
- **Causa raiz:** em algum momento o HTML foi salvo através de um **proxy Cloudflare**, que ofuscou o e-mail: o `<a href="mailto:...">` virou `<a href="/cdn-cgi/l/email-protection#54...">` + `<span data-cfemail="680b...">[email protected]</span>` + `<script src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js">`. Esse decodificador **não existe no GitHub Pages** → 404 → o e-mail nunca era decodificado.
- **Fix:** decodificado o payload `data-cfemail` (XOR com chave `0x68`) → confirmado `contato@barolocapital.com.br` (bate com o log da sessão 09/04/2026). Restaurado `<a href="mailto:contato@barolocapital.com.br" class="contact-email">contato@barolocapital.com.br</a>` e removido o `<script>` do email-decode.
- **Também:** `index.html` terminava **sem `</body></html>`** (arquivo truncado no fim do último `</script>`) — tags adicionadas.

#### `ferramentas.html` — `</head>` prematuro + funções duplicadas
- **`</head>` prematuro na linha 19** (mesmo bug corrigido no `portfolio_analytics.html` em 06/07): fonts, Chart.js e o `<style>` principal ficavam "fora" do head; o verdadeiro `</head>` é o da linha ~642 (antes do `<body>`). Removido o prematuro. Zero mudança de render (browsers já toleravam).
- **`flashHighlight`/`showToast` duplicadas no escopo global** (linhas 2718 e 2742, byte-idênticas — a 2ª sobrescrevia a 1ª silenciosamente). Sobrou da limpeza de 03/07 que removeu 3 de 4 cópias mas deixou 2. Removida a 2ª cópia; agora exatamente 1 definição de cada.

#### `Design.md` — §8 pegadinhas atualizada
- Nova linha: **nunca salvar HTML via proxy Cloudflare** (ofusca e-mails em `data-cfemail` + script `/cdn-cgi/` que não existe no GitHub Pages).

### Verificado e OK (sem mexer)
- **0 erros de console nas 5 páginas editáveis** (index, portfolio, pools, ferramentas, relatorio); gráficos renderizam (portfolio 18+, pools 9, relatorio 2); toast/tabs/gwei/tickers/login funcionam; tooltip bolinha (06/07) ativo.
- **Links internos** entre páginas todos resolvem; **noindex** presente nas 6 páginas; **`data.js` consistente** (debt.total 1.574,30 = 756,12 AAVE + 818,18 Kamino ✓; stablesTotalUSD 1.602,52 = USDT 1.302,524 + USDS 300 ✓).
- **Falsos positivos do parser descartados** (não são bugs): "duplicatas" `fmt`/`ready` (index), `pxAt`/`setEl` (portfolio), `setLive` (pools) estão em escopos IIFE/função separados — legítimas. "Imbalance" de `<script>` counts = `</script>` dentro de strings JS. `parens=-1` em portfolio script#5 / pools script#8 = template literals (falso positivo já conhecido do CLAUDE.md).

### Dados atualizados
Nenhum. `data.js` intocado (asOf 2026-07-04, com os refreshes automáticos da Action).

### Bugs corrigidos
| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| E-mail de contato "[email protected]" com link morto (produção) | HTML salvo via proxy Cloudflare → `data-cfemail` + `/cdn-cgi/email-decode.min.js` que 404a no GitHub Pages | Payload decodificado (XOR 0x68) → `mailto:contato@barolocapital.com.br` restaurado; script morto removido |
| `index.html` sem `</body></html>` | Truncado em alguma edição antiga | Tags adicionadas ao final |
| `ferramentas.html` com `</head>` duplicado | `</head>` prematuro na linha 19 (mesmo padrão do portfolio) | Removido; head real fecha antes do `<body>` |
| `flashHighlight`/`showToast` definidas 2× no escopo global (ferramentas) | Limpeza de 03/07 deixou 2 das 4 cópias | 2ª cópia (byte-idêntica) removida |

### Avisos registrados (decisão do Lucas, NÃO mexido)
- **Tabela "Registro Histórico" de pools não existe mais no HTML** — só `buildPoolTable()` sobrou (código morto, guardado com `if(!tbody) return`, não dá erro). Aparentemente ligado à remoção intencional do `track.html` (comentários no código: "track.html não existe mais"). **Se Lucas quiser a tabela das 28 pools de volta, reconstruir.**
- **CoinGecko em rajada no load do portfolio** (~5 requests simultâneos) — falhou no ambiente de preview (cache segurou); na máquina do Lucas funciona. Consolidável no futuro se incomodar.

### Commits (pushados direto na main)
- `62f5423` — fix: revisão geral — e-mail de contato restaurado + HTML malformado + JS duplicado

### O que ainda falta
- **Registro Histórico em pools.html** — decidir se reconstrói a tabela (28 pools) ou remove `buildPoolTable()` de vez
- **`emprestimos.html`** — segue bundle (não editável à mão); a alteração local não-commitada do Lucas segue preservada no working tree
- Pendências antigas: integração dos CSVs CEX (custo BRL/IR), mentoria DeFi avançado (Euler V2, Morpho, Gearbox, Drift, Hyperliquid HLP, Pendle PT)

---

Atualizado: 08/07/2026 — Revisão geral: **e-mail de contato do index restaurado** (corrompido por proxy Cloudflare — visitantes viam "[email protected]"), `</body></html>` faltando no index, `</head>` prematuro em ferramentas, `flashHighlight`/`showToast` dedup; 0 erros de console nas 5 páginas; avisos: tabela Registro Histórico (pools) não existe mais no HTML

---

## Sessão 08–10/07/2026 — Dashboard PF: 4 módulos novos (Renda Passiva, Snapshot diário, CDI/IPCA, aba Fiscal) + fix cgId USDS

### Contexto
Lucas pediu recomendações pensando "dashboard de portfólio cripto de investidor PF". Recomendei 6; ele escolheu: fazer **2 (Renda Passiva)** na hora, deixar 1/3/5 para depois — em seguida **removeu o 3 (alertas Telegram — não fazer)** e mandou executar **4 (Snapshot diário)**, **5 (CDI/IPCA)** e **1 (Fiscal)** na sequência. Tudo implementado, validado no browser e pushado.

### Implementado

#### 1. `portfolio_analytics.html` — Renda Passiva Realizada (livro-razão mensal) — commit `fbd3e48`
- **Onde:** aba DeFi & Mercado, entre "Taxas & Yield Recebidos" (agregado vitalício) e "Acumulação de Tokens".
- **4 KPIs:** Renda YTD Realizada (**+$147,68** = $96,28 LP ✓ bate com P&L YTD de pools + $51,40 lending) · Média/Mês (+$24,61) · Mês Atual run-rate **ao vivo** via `BAROLO_DATA.defi` + preços live (+$26,37, com nota dos $18,62 fees pendentes) · **Cobertura dos Juros** (380% verde — renda média ÷ juros/mês da dívida).
- **Gráfico:** barras empilhadas Jan–Jun + Jul* (run-rate): ouro = fees LP realizadas na coleta, verde = lending líquido estimado; tooltip com total do mês.
- **Dados:** array `RENDA_2026` — LP por **data de fechamento** (Jan $57 = SOL/USDC $23 + ETH/USDT $34 · Fev $17 = SOL/USDT $1 + ETH/USDC $16 · Jun $22,28 = WETH/USDC), lending = posição × APY documentado do mês (Jan–Mar 8,0 · Abr 8,4 · Mai 11,1 · Jun 7,9).
- **Função:** `buildRendaPassiva()` (auto-destrutiva via `Chart.getChart`), chamada em `buildStaticCharts()` → reconstrói no toggle de tema.
- **Manutenção:** a cada fechamento de mês, adicionar 1 linha no `RENDA_2026` (candidato a entrar no fluxo do `/fecharmes`).

#### 2. Snapshot diário automático do patrimônio — commit `9417e15`
- **`scripts/fetch-networth.js`**: patrimônio líquido do dia = Σ holdings×preço CoinGecko (já inclui colateral DeFi) + stables + LP (pooled+unc fees) − dívida — **posições/dívida/LP do `data.js`** (decisão: zero deps de AAVE/Kamino API num cron não-assistido; deriva de juros ~$4/mês é aceitável). Upsert 1 ponto/dia em `networth-history.json`, retry backoff p/ 429 (30/60/90s), sanity check de faixa ($1k–$1M). **Sem secrets.**
- **`.github/workflows/networth.yml`**: cron `40 9 * * *` (~06:40 BRT, após o onchain) + `workflow_dispatch`; commit→rebase→push se mudou. **Action confirmada rodando** (commits automáticos "data: snapshot diário do patrimônio" já no histórico).
- **`networth-history.json`** semeado: 08/07/2026 → **$6.728,96** (gross $6.358,38 + stables $1.601,26 + lp $343,62 − debt $1.574,30), preços BTC/ETH/SOL gravados junto.
- **Testado:** rodado 2× local — retry recuperou de 429; upsert não duplica o mesmo dia.
- **Próximo passo (registrado):** com ~2 semanas de pontos, plugar a curva diária na Evolução Patrimonial (drawdown/vol reais; aposenta o print mensal p/ curva).

#### 3. `portfolio_analytics.html` — Benchmark CDI/IPCA na Evolução Patrimonial — commit `59a73e6`
- **2 linhas novas no gráfico (só na régua USD):** azul = os **mesmos aportes mensais** rendendo CDI (`b_t = (b_{t-1}+aporte_t)×(1+i_mês)`); roxa tracejada = aportes corrigidos pelo IPCA. Em BTC/ETH as linhas **somem** (validado).
- **Taxas:** `CDI_MONTHLY_BY_YEAR` = {2022:0.98, 2023:1.03, 2024:0.87, 2025:1.11, 2026:1.10} %a.m. · `IPCA_MONTHLY_BY_YEAR` = {0.47, 0.38, 0.39, 0.39, 0.36} (médias mensais por ano, B3/BCB/IBGE). **Manutenção: 1 linha/ano.**
- **Nota dinâmica** sob o gráfico responde "estou batendo a renda fixa?": CDI hoje **$12.764** vs patrimônio → **−36% vs CDI**; IPCA $11.011. Aproximação documentada (câmbio constante — CDI é BRL, curva é USD).
- **Nota técnica:** a série herda o salto do ponto ao vivo do Capital Aportado (gap conhecido wealthCurve $7.100 vs canônico ~$10k) — consistente com a linha cinza exibida; direção conservadora.
- Helper: `_fixedIncomeSeries(labels, invested, ratesByYear)` antes de `buildWealthEvolution()`.

#### 4. `ferramentas.html` — Aba Fiscal (custo em BRL & IR) — commit `f83636b`
- **Dados extraídos das planilhas** `Custo_BRL_Consolidado_Lucas.xlsx` / `Custo_Aquisicao_BRL_Lucas.xlsx` (lidas via Python/openpyxl): total fiat→cripto **R$ 35.498,19** (Binance 29.664,20 + OKX 5.065,50), por token: BTC 0,00337 @ R$ 296.174/un · ETH 0,3872 @ R$ 15.096 · SOL 1,012 @ R$ 903,63 · ADA 307,99 @ R$ 12,06 · XAI 79 @ R$ 1,29 · USDT 2.576,24 @ R$ 5,41 · USDC 531,13 @ R$ 5,46 · BUSD 1.231,66 @ R$ 5,22 · DOT 2,97 · BNB 0,1115. Câmbio médio de entrada via stables: **R$ 5,36/USD**.
- **Aba nova** entre Ciclo e Semanal (11 abas agora): 4 KPIs (aportado R$ 35.498 · câmbio entrada 5,36 · patrimônio hoje em BRL **ao vivo** · resultado em BRL) + tabela de entradas por token + bloco IR (Bens e Direitos grupo 08 códigos 01/02/03, declarar pelo custo, obrigatório ≥ R$ 5k por tipo; isenção R$ 35k/mês nacional; Lei 14.754/2023 15% exterior; IN 1888 > R$ 30k/mês; permuta cripto↔cripto conta como alienação) + disclaimer.
- **JS:** IIFE `window.Fiscal` lazy (`Fiscal.open()` no `switchTab`, padrão do Ciclo) — `FISCAL_ENTRADAS`/`APORTADO_BRL` estáticos + fetch CoinGecko `usd,brl` (cache 5min `bc-fiscal-prices`; câmbio = tether.brl/tether.usd; retry na próxima abertura se falhar). i18n `tab-fiscal` (Fiscal/Tax).
- **Achado da validação:** patrimônio R$ 35.387 ($6.907 × câmbio 5,12) → **−0,3% em BRL** — em reais Lucas está no break-even (entrou a câmbio 5,36, dólar caiu p/ 5,12 amortecendo o bear em USD).
- **Manutenção:** novos extratos das CEX → atualizar `FISCAL_ENTRADAS` + `APORTADO_BRL`.

### Dados atualizados
Nenhuma posição alterada. Novos dados derivados: `networth-history.json` (série diária, cresce sozinho via Action) e constantes históricas (RENDA_2026, CDI/IPCA, FISCAL_ENTRADAS).

### Bugs corrigidos
| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| USDS sem preço ao vivo em todo o site (fallback fixo $1 — **depeg ficaria invisível**) | CoinGecko **renomeou** o ID `usds-stablecoin` → `usds`; o antigo não retorna nada | `sed` em `data.js`, `index.html`, `pools.html`, `portfolio_analytics.html` (7 ocorrências) — commit `9417e15` |
| Workflow networth: `git pull --rebase` após `git add` falharia com staged changes | Ordem errada no yml | Reordenado: add → commit → pull --rebase → push |
| Script networth 429 na primeira execução | Burst do free tier CoinGecko | `fetchPrices` com retry/backoff 30/60/90s |

### Observações operacionais
- **Screenshots de index/portfolio/ferramentas via preview travam** (timeout 30s) — ambiental (animações); validar via JS/DOM em vez de screenshot.
- Agora são **duas Actions commitando de manhã** (onchain 09:20 UTC + networth 09:40 UTC) → **sempre `git pull --rebase` antes de trabalhar local** (padrão já usado: stash do emprestimos.html → rebase → push → pop).
- Ambiente de preview mudou entre retomadas de sessão (`mcp__Claude_Preview__*` → `mcp__Claude_Browser__*` na porta dinâmica).

### O que ainda falta
- **Curva diária na Evolução Patrimonial** — plugar `networth-history.json` quando houver ~2 semanas de pontos
- **`RENDA_2026`** — adicionar linha a cada fechamento de mês (considerar incluir no `/fecharmes`)
- **`CDI_MONTHLY_BY_YEAR`/`IPCA_MONTHLY_BY_YEAR`** — atualizar 1×/ano (e a estimativa 2026 no fim do ano)
- **`FISCAL_ENTRADAS`/`APORTADO_BRL`** — atualizar ao importar novos extratos das CEX
- **Registro Histórico em pools.html** — decidir se reconstrói a tabela (28 pools) ou remove `buildPoolTable()` de vez (pendência da revisão de 08/07)
- **`emprestimos.html`** — segue bundle (não editável à mão); edição local do Lucas preservada não-commitada
- **Reconciliar `wealthCurve.invested`** ($7.100) com o total canônico (~$10k) — afeta a precisão do último ponto do CDI/IPCA e do Capital Aportado

---

Atualizado: 10/07/2026 — **4 módulos novos de dashboard PF**: Renda Passiva Realizada (livro-razão mensal + cobertura dos juros 380%), Snapshot diário automático do patrimônio (Action `networth.yml` → `networth-history.json`, 1º ponto $6.728,96), Benchmark CDI/IPCA na Evolução Patrimonial (−36% vs CDI), aba **Fiscal** em ferramentas (R$ 35.498 aportados, câmbio entrada 5,36, **−0,3% em BRL** = break-even em reais); fix cgId `usds-stablecoin`→`usds` (depeg ficaria invisível); item 3 (Telegram) removido por decisão do Lucas
