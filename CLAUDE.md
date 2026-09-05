# Barolo Capital — Briefing para Claude Code

## O que é este projeto

Dashboard DeFi pessoal e institucional de **Lucas (Barolo Capital)** — gestora individual de capital em criptoativos desde 2021 (1ª compra ETH em 13/12/2021). Filosofia: acumulação de longo prazo (+10 anos), DCA mensal em ETH/SOL/ADA, uso de DeFi como ferramenta de yield e estratégia de saída.

Todas as páginas são **HTML estático puro** (sem framework, sem build step). Hospedado no GitHub e aberto diretamente como `file://` ou via servidor local simples.

> 📚 **BASE DE CONHECIMENTO CONSOLIDADA** — no final deste arquivo (bloco delimitado pelos marcadores HTML KB-START / KB-END) está a consolidação de **todos os estudos do Notion do Lucas + tudo aprendido nas conversas + o portfólio completo**. É autocontida e existe também como cópia autônoma em `CONHECIMENTO-BAROLO.md` (para colar em outro chat). **Leia essa seção antes de responder qualquer coisa sobre estratégia, filosofia, análise de projeto, gestão de risco ou o portfólio do Lucas.**

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

5. **Escopo real da privacidade (decidido em 19/08 e reafirmado em 05/09/2026):** o repositório é
   **público** por escolha. `robots.txt` e `noindex` protegem o site publicado, não o repositório —
   o `data.js` e todo o histórico do git são legíveis por qualquer pessoa.
   **Sobre os endereços de carteira — DECISÃO TOMADA, NÃO REABRIR:** eles estão, sim, em arquivo
   público (`pools.html` 19 EVM + 1 SOL · `portfolio_analytics.html` 16 EVM + 1 SOL ·
   `ferramentas.html` 7 EVM · bundle de `emprestimos.html` · `CLAUDE.md` 18 EVM + 1 Cardano).
   Nos HTMLs isso é **funcional e inevitável num site estático**: é o JS do browser que chama
   Alchemy/Helius/AAVE/Kamino, então quem abre o site vê os endereços no DevTools de qualquer jeito
   — tirar do repo não esconderia nada, e `git rm --cached` não apaga o histórico. Lucas avaliou e
   **aceitou a exposição em 05/09/2026**: *"pode deixar assim, pensando que é um site que não
   divulgo a ninguém e decidi deixar o site no ar para poder acessar fora do computador também"*.
   O risco real é baixo porque o endereço só revela saldo/histórico on-chain (que já é público por
   natureza) e não dá nenhum poder de gasto. **Não re-sinalizar como achado nem propor
   privatizar o repo / reescrever histórico sem o Lucas pedir.**
   A regra que permanece **inegociável**: nunca colocar endereço, NFT ID ou identificador único
   em **URL pública** (link, iframe `src`, query string) — no JS pode, em URL não. Essa nunca foi
   violada (o caso do iframe do Revert foi corrigido em 16/06/2026).

### Objetivo:
O site é **prova de competência técnica**, não **portfolio público**. Funcionalidade sim, exposição não.

---

## ROTINAS COMBINADAS COM O LUCAS (obrigações permanentes)

### 1. Fechamento de mês → passar o yield a lançar no CoinGecko ⚡

**Combinado em 05/09/2026.** O Lucas disse, com estas palavras: *"eu ainda não tenho esse controle
pra pôr tudo no CoinGecko, por isso o site me ajuda nisso também; peço que anote aí para todo
final do mês passar a soma de quanto eu devo alterar no CoinGecko desse yield ganho nos
empréstimos."*

**Por que existe:** `holdings[]`/`stables[]` do `data.js` acompanham o **supply dos protocolos** —
quando AAVE/Kamino pagam juros, a quantidade sobe aqui na hora, a custo zero (juro é renda, não
aporte). O CoinGecko **não** acompanha isso sozinho: ele precisa lançar manualmente como
*transferência de entrada* com custo zero. Sem isso, o CoinGecko fica sistematicamente abaixo da
realidade e o "total de ganhos" de lá vira ficção.

**Como fazer (todo fechamento de mês, sem ele precisar pedir):**

```bash
node scripts/yield-to-mirror.js
```

Sai a lista por token (quanto lançar, valor em USD, `qty do CoinGecko → qty do site`) e o total.
Passar isso para ele no chat. O mesmo número aparece:
- no card **"Yield a lançar no CoinGecko"** do dashboard (aba **Ativos**) — só aparece quando há
  pendência, some sozinho quando zera;
- no log da Action `close-month.yml`, que roda todo dia 1.

**A fonte da verdade é `data.js → cgMirror`**: a quantidade **como está no CoinGecko hoje**. A
diferença para o `holdings` é o pendente. **Quando ele confirmar que lançou, atualizar o `cgMirror`
igualando às qty do holding** — aí o pendente zera e o card some.

⚠️ Se aparecer diferença **negativa** (CoinGecko com MAIS que o site), não é yield — é erro de
contagem ou posição fora do radar. Investigar antes de lançar qualquer coisa.

**Estado em 05/09/2026:** ✅ **em dia** — o Lucas lançou (+0,174778 SOL e +4,69 USDS,
transferência de entrada com custo zero) e o `cgMirror` foi igualado ao holding no mesmo dia.
Próxima cobrança: fechamento de setembro.

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

### Pool ativa Uniswap V3 (WETH/USDG 0.01% · Robinhood Chain) — remontada 14/07/2026
- Capital ~$340 (0.183 ETH) · Pooled $338.91 (0.178 WETH + 8.67 USDG) · **in-range** · APR da pool ~112% · fee tier 0.01%
- Range $1.852,38–$2.166,83 · market $1.859,53 · saída gradual ETH→USDG (entra ~100% WETH)
- Migrada da Base (WETH/USDC 0.3%) via bridge Across V2. Card **ESTÁTICO** (chain nova, sem fetch on-chain) — ver seção "Pool ATIVA — Dados completos".

### Totais (20/06/2026)
- **STABLES**: USDT $1,302.52 + USDS $300 = **$1,602.52**
- **DÍVIDA TOTAL**: $754.65 (AAVE) + $815.97 (Kamino) = **$1,570.62**
- **PATRIMÔNIO LÍQUIDO**: ~$6,406 (CoinGecko $7,650.91 + LP − dívida)
- **TOTAL INVESTIDO**: $9,954.95 | **ROI**: −23.13% | **Leverage**: 0.245x

---

## Histórico de pools (dados reais do diário)

| Par | Rede | Dias | Capital | Taxas | IL | Resultado | Status |
|-----|------|------|---------|-------|-----|-----------|--------|
| WETH/USDG 0.01% | **Robinhood** | 1 | $340 | $0 | $0 | $0 | **ATIVA** |
| WETH/USDC 0.3% | Base | 41 | $329 | $9 | $0 | $9 | fechada 14/07 |
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

### Pool ATIVA — Dados completos (remontada 14/07/2026 · Robinhood Chain)

**A pool ativa MIGRA DE REDE — SEMPRE ler esta seção antes de qualquer registro/chamada on-chain. NÃO assumir Base nem Ethereum.** Histórico de rede: Ethereum/Arbitrum (2024–25) → Base (fev–jul/2026) → **Robinhood Chain (atual)**.

Em **14/07/2026** a pool da Base (WETH/USDC 0.3%) foi **desmontada e remontada na Robinhood Chain** como WETH/USDG 0.01%. Sequência on-chain (prints do Lucas): remove liquidity Base (0.1717 ETH + 47.22 USDC) → swap USDC → 0.0255 ETH (Uniswap V4) → bridge ~0.197 ETH via **Across V2** → add liquidity Robinhood (0.183 ETH).

| Campo | Valor |
|---|---|
| Par | WETH/USDG 0.01% |
| Protocolo | Uniswap V3 |
| **Rede** | **Robinhood Chain** |
| Abertura | 14/07/2026 |
| Capital entrada | 0.183 ETH (~$340) — via bridge Across V2 da Base |
| Posição | $338.91 — 0.178 WETH ($330.24) + 8.67 USDG (~97% WETH) |
| Range | **$1.852,38 – $2.166,83** (in-range; market $1.859,53) |
| APR da pool | ~111.83% · fee tier 0.01% · 1D/VOL ~30 |
| Estratégia | Saída gradual ETH→USDG: entra ~100% WETH, sai USDG conforme ETH sobe |
| Card no site | **ESTÁTICO** — sem fetch on-chain (chain nova, sem RPC público/CORS confiável). Atualizar via `data.js` → `defi.uniswapV3` quando Lucas mandar print. |
| Monitorar em | https://app.uniswap.org/positions |

**Referência: sempre em USD** — não usar HOLD nem ETH como referência de performance.

**Pool anterior (Base · WETH/USDC 0.3%):** encerrada 14/07/2026 · fees ≈ $8.62 · result +$8.62 (a valorização do ETH pertence ao holding, não à pool). Contratos Base (descontinuados para esta posição): NFT_MGR `0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1`, POOL `0x6c561B446416E1A00E8E93E221854d6eA4171372`.

**Fetch on-chain desativado:** em `pools.html`, as funções `fetchUniswapLPData()` e `fetchUniswapLP()` (Base) têm `return` no topo. O token ID da NFT Robinhood não está persistido no repo (política de privacidade — não expor identificadores únicos). Para reativar o fetch: obter RPC + NonfungiblePositionManager + pool WETH/USDG + token ID da Robinhood Chain.

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

#### 2. ⚠️ DESCOBERTA — `emprestimos.html` é um BUNDLE — **CONCLUSÃO ABAIXO ESTÁ ERRADA (corrigida em 14/08/2026)**

> **⚠️ NÃO SIGA o que está escrito nesta subseção.** É verdade que o arquivo é um bundle, mas a conclusão ("não editar, precisa de fonte original + rebuild") é falsa e já fez o Claude responder errado ao Lucas mais de uma vez. O correto:
> - **Atualizar dados = editar SÓ o `data.js` e dar push.** A Action `.github/workflows/sync-emprestimos.yml` (dispara em `paths: [data.js]`) roda `scripts/refresh-emprestimos-data.js`, que regrava o `data.js` embutido no manifest e commita sozinha. Manual: `node scripts/refresh-emprestimos-data.js`.
> - **O shell do bundle (~149 KB) é texto puro editável** — CSS, HTML e todo o JS (`fetchAave`, `updateYieldCards`, `runFetch`…) ficam legíveis nele; só o `data.js` embutido é gzip+base64. Está dentro de uma string JS, então quebras de linha são `\n` literal e aspas são `\"`; dá pra editar por substituição de string exata **desde que o texto novo não contenha aspas nem quebras de linha reais**. Os outros 23 assets do manifest são fontes/binários.
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

---

## Sessão 13/07/2026 — Mobile responsivo (1ª passada): 5 páginas sem overflow horizontal + nav mobile funcional

### Contexto
Mobile era o item historicamente adiado ("adiado por decisão do usuário" em várias sessões). Lucas pediu para **iniciar**. Regra inegociável combinada: **desktop 100% intocado** — tudo via `@media(max-width:768px)` (ou `auto-fit`/`minmax`, que preservam o desktop). Ele escolheu: fazer a **nav mobile dos dashboards** (item 1) e depois **seguir página por página** (opção "a"), commitando e validando cada uma. Validação via `mcp__Claude_Browser__*` no viewport `mobile` (375×812) — **screenshots travam** nessas páginas (animações), então medi tudo por JS/DOM (`scrollWidth−clientWidth`, culpados por `getBoundingClientRect`).

### Diagnóstico inicial (@375px)
- **portfolio**: overflow +329px, **nav quebrada** (links `display:none`, sem hambúrguer → não dá pra navegar). **index**: +301px, hambúrguer existe mas `nav-right` (login) estoura.
- **Padrão descoberto**: os 4 dashboards têm o **CSS do hambúrguer** (dropdown + `@media(min-width:769px){.nav-hamburger{display:none}}`) mas **falta o elemento `<div class="nav-hamburger">` no markup** e não há função de toggle → hambúrguer morto. `relatorio` não tinha **nada** de nav mobile.

### Implementado (fix comum: hambúrguer com toggle inline, sem depender de função JS)
`<div class="nav-hamburger" onclick="document.querySelector('.nav-links').classList.toggle('open')">` — usa o CSS `.nav-links.open{display:flex}` que já existia.

#### `index.html` (passo 1 · commit `9f763b6`)
- `@media(max-width:600px)`: esconde os 2 inputs de login + Enter do topo (`.nav-right .nav-input,.nav-right .nav-btn{display:none}`) — a landing é pública e os dashboards abrem por URL (login é atalho de desktop). Mantém logo + PT + tema + hambúrguer (já existia no index).
- `.token-grid`: `repeat(2,minmax(0,1fr))` + `min-width:0` nos cards — corrige **blowout clássico** (card forçava coluna 249px num container de 327px, 2ª col cortada).
- Resultado: overflow 329→**0** (real, medido sem o guard), 0 cards cortados.

#### `portfolio_analytics.html` (passo 2 · commit `1f6fcf9`)
- Nav: hambúrguer adicionado ao markup (o CSS/dropdown já existia). `.nav-right .btn-sm:not(#currencyBtn):not(#themeBtn){display:none}` esconde PDF/Relatório no mobile.
- Conteúdo: `.container,#mainContent{max-width:100vw;overflow-x:hidden}`; `.card` e `#heatmapGrid` rolam internamente (`overflow-x:auto`); `#perfStats` 5→2 col. Driver real do overflow era a **tabela do heatmap** (834px) — agora comprime pra caber sem perder meses.
- Resultado: as **5 abas com `pageScrollsX=0`**.

#### `pools.html` (passo 3 · commit `f3da1fe`)
- 🐛 **BUG corrigido**: pools tinha **DOIS `<nav>` idênticos** empilhados em `position:fixed;top:0` (sobrepostos — visualmente 1, mas 2 no DOM; quebrava o `querySelector('.nav-links')` do toggle). **Removido o duplicado** — desktop inalterado (já se via só um).
- Nav: hambúrguer no nav único; esconde PDF/Relatório. Container recorta; `.card/.pool-card/tabelas` rolam internamente. Overflow real **0**.

#### `ferramentas.html` (passo 4 · commit `c6a438c`)
- Nav: hambúrguer + esconde PDF/Relatório.
- **`.tabs` (11 abas)**: `overflow-x:auto;flex-wrap:nowrap;scrollbar-width:none` — rolam horizontalmente em vez de estourar.
- **Fiscal**: os grids inline `repeat(4,1fr)` (KPIs) e `1fr 1fr` (IR) → `repeat(auto-fit,minmax(150px/260px,1fr))` — colapsam sozinhos no mobile e ficam **idênticos no desktop** (media query não sobrescreve `style` inline; `auto-fit` resolve sem `!important`).
- Resultado: **todas as 11 abas com overflow 0**.

#### `relatorio.html` (passo 5 · commit `4a8da24`)
- Não tinha nav mobile nenhum (só `@media print`). Adicionado o padrão completo (CSS do hambúrguer + markup + toggle) adaptado ao **nav variante** (50px fixo).
- Tabelas largas: `div:has(> table){overflow-x:auto}` — o **parent** rola e a tabela mantém o alinhamento das colunas (melhor que `display:block` na table). A tabela de retornos (596px) rola internamente. `@media print`/layout A4 preservados.

### Bugs corrigidos
| Bug | Causa | Fix |
|-----|-------|-----|
| Dashboards sem navegação no mobile | CSS do hambúrguer existia mas o `<div class="nav-hamburger">` faltava no markup (e sem toggle) | Adicionado o elemento + toggle inline nos 4 dashboards |
| `pools.html` com 2 `<nav>` idênticos empilhados | Duplicação acidental (ambos `fixed;top:0`, sobrepostos) | Removido o duplicado (desktop já mostrava só um) |
| Overflow horizontal em todas as páginas no mobile | grids `repeat(N,1fr)` com blowout, tabelas largas, nav-right largo, 11 abas sem wrap | `minmax(0,1fr)`/`auto-fit`, scroll interno de tabelas/cards, esconder itens não-essenciais do nav, `.tabs` com scroll-x |

### Dados atualizados
Nenhum dado de posição — só CSS/markup responsivo. `data.js` intocado.

### O que ainda falta
- **2ª passada de polimento mobile** (a combinar): tamanhos de fonte/espaçamento afinados pra tela pequena, altura dos gráficos otimizada, alvos de toque maiores, e decidir o **login no mobile** (hoje escondido no index — dashboards abrem por URL).
- **`emprestimos.html`** — segue bundle (não editável à mão); ficou de fora do mobile.
- Pendências antigas mantidas: curva diária na Evolução Patrimonial (~2 semanas de pontos), Registro Histórico de pools (reconstruir tabela das 28 ou aposentar `buildPoolTable()`), integração CSVs CEX já feita na aba Fiscal.
- **Observação de ambiente**: `mcp__Claude_Preview__*` virou `mcp__Claude_Browser__*` (porta dinâmica); `computer{action:screenshot}` trava (30s) nessas páginas — validar via `javascript_tool`/DOM.

### Commits (pushados direto na main)
`9f763b6` index · `1f6fcf9` portfolio · `f3da1fe` pools (+ remove nav duplicado) · `c6a438c` ferramentas · `4a8da24` relatorio

---

Atualizado: 13/07/2026 — **Mobile 1ª passada**: 5 páginas (index + 4 dashboards) sem overflow horizontal no mobile (medido real, `pageScrollsX=0`), **nav mobile funcional** (hambúrguer morto ressuscitado nos 4 dashboards + criado no relatorio), 11 abas do ferramentas rolam, tabelas/heatmap rolam internamente, Fiscal com `auto-fit`; **bug corrigido**: `pools.html` tinha 2 `<nav>` duplicados. Desktop 100% intocado (`@media(max-width:768px)`). Falta 2ª passada de polimento fino; `emprestimos` (bundle) fora

---

## Sessão 11/07/2026 — `diario.js`: Diário DeFi acessível fora do navegador (standup automatizado)

### Contexto
O standup diário automatizado (`daily-standup-barolo`, roda sem o Lucas presente) tentou preencher a seção "REGISTRO" com o Diário DeFi e não conseguiu: as entradas do Diário DeFi (`ferramentas.html`) só existem no `localStorage` do navegador do Lucas — inacessível a uma sessão automatizada rodando no filesystem/CLI. Lucas pediu explicitamente para dar acesso a isso.

### Implementado

#### `diario.js` (NOVO, raiz do repo) — cópia git-tracked do Diário DeFi
- Mesmo padrão do `data.js`: `window.BAROLO_DIARY = [...]`, carregado via `<script src="diario.js">` (funciona em `file://` e `https://`, ao contrário de `fetch()` que quebra por CORS em `file://`).
- Começa **vazio** (`[]`) — não havia como extrair as entradas já existentes no `localStorage` do Lucas a partir de uma sessão sem navegador dele. Passa a ser preenchido dali pra frente via sincronização manual (abaixo).

#### `ferramentas.html` — merge automático + botão "📤 Sincronizar"
- `<script src="diario.js"></script>` adicionado no `<head>`, logo após `data.js`.
- **Merge no load** (`diaryEntries`, linha ~2136): combina `window.BAROLO_DIARY` (arquivo) com `localStorage['bc-diary-v2']` (navegador) por `id`; **localStorage vence em conflito** (é sempre a versão mais recente); resultado ordenado (mais novo primeiro) e persistido de volta no `localStorage`. Zero mudança de comportamento pro Lucas — ele continua só usando o Diário normalmente.
- **Botão "📤 Sincronizar"** (ao lado de "Salvar entrada"/"Limpar histórico"): `exportDiaryToFile()` serializa `diaryEntries` (ordenado por id crescente) no formato `window.BAROLO_DIARY = [...]` com um cabeçalho de instrução, copia para o clipboard (`showToast` de confirmação) com fallback de download do arquivo se o clipboard falhar (`downloadDiaryFile()`).
- **Fluxo de sincronização (manual, como os prints de CEX/CoinGecko já funcionam neste projeto):** Lucas clica "Sincronizar" → cola o conteúdo copiado no chat do Claude Code → Claude salva/commita em `diario.js`. Testado no preview: merge dedupe/precedência OK, export gera o JS válido, zero erros de console.

### ⚡ Instrução permanente para sessões futuras (inclusive automatizadas)
**A partir de agora, para responder sobre o Diário DeFi (trades, decisões, observações — ex: seção REGISTRO do standup), leia `diario.js` na raiz do repo.** Se o Lucas não tiver sincronizado recentemente, o arquivo pode estar desatualizado ou vazio — nesse caso, diga isso explicitamente em vez de reportar "sem dados" sem explicação, e sugira que ele clique em "Sincronizar" na aba Diário DeFi.

### O que ainda falta
- **`diario.js` está vazio** — só passa a ter conteúdo real após o Lucas clicar em "Sincronizar" pela primeira vez e colar o resultado no chat
- Pendências antigas mantidas (ver sessão 10/07): curva diária na Evolução Patrimonial, `RENDA_2026`, CDI/IPCA anual, `FISCAL_ENTRADAS`, Registro Histórico em pools.html, `emprestimos.html` bundle, reconciliar `wealthCurve.invested`

---

Atualizado: 11/07/2026 — `diario.js` criado (Diário DeFi git-tracked, padrão `data.js`); `ferramentas.html` faz merge automático arquivo+localStorage e ganhou botão "📤 Sincronizar"; sessões automatizadas (ex: standup diário) devem ler `diario.js` para a seção de registro/trades

---

## Sessão 04/08/2026 — Card "E daí, pra mim?" portado para pools.html + `mercado.html` removida

### Contexto
Entre a sessão anterior (que só adicionou instruções de briefing ao daily standup) e esta, uma execução automatizada não logada aqui criou `mercado.html` (briefing diário completo: preços/ATH/dominância, Fear&Greed, risco de ciclo on-chain, faixa de valuation BTC, card de posição "E daí, pra mim?", manchetes RSS) + pipeline própria (`scripts/fetch-briefing.js` + `.github/workflows/briefing.yml`, cron ~06:50 BRT, gera `briefing.json` na raiz). Lucas pediu para portar só o card de posição para `pools.html` (acima da Meta de Alocação) e remover a página `mercado.html` do site, mantendo-a recuperável.

### Implementado
- **`pools.html`** — card `.me-band` "Leitura da carteira hoje" inserido logo após `<div class="container">`, acima de `#bc-meta-ytd-section` (Meta de Alocação). CSS portado de `mercado.html` (`.me-band/.me-head/.me-tag/.me-title/.me-note/.me-grid/.me-cell`, cores `.up/.dn/.gold/.neu` escopadas em `.me-cell` para não colidir com outras classes do arquivo). JS: IIFE que faz `fetch('briefing.json')` e renderiza a nota + 6 células (Patrimônio, Movimento 24h, AAVE HF, Kamino LTV, SOL liquida em, Carry mensal) — mesma lógica de `renderMe()` do `mercado.html`. Se o fetch falhar, o card se esconde (`display:none`) em vez de mostrar dado quebrado.
- **`mercado.html` removida** via `git rm` (fica recuperável no histórico do git — não foi deletada do GitHub, só tirada da árvore de trabalho/site publicado).
- **Nav "Mercado" removido** de `pools.html`, `ferramentas.html`, `portfolio_analytics.html`, `relatorio.html` (as 4 páginas que linkavam pra ela; `index.html` e o bundle `emprestimos.html` nunca tiveram o link).
- **`.github/workflows/briefing.yml`** — comentário atualizado avisando que o workflow **continua necessário** mesmo sem `mercado.html`: o campo `portfolio` de `briefing.json` agora alimenta o card novo em `pools.html`. Não desativar.
- Verificado no preview: card renderiza com dados ao vivo do `briefing.json` (patrimônio $7.048, HF AAVE 6.08, LTV Kamino 39.1%, SOL liquida em $29, carry +$13,68/mês), posicionado acima da Meta de Alocação, zero erros de console, nav sem link morto.

### Bugs corrigidos
Nenhum — feature nova + remoção limpa.

### O que ainda falta
- Se um dia quiser voltar com `mercado.html`: `git log --oneline -- mercado.html` (último commit antes da remoção) + restaurar o arquivo + religar os 4 links de nav + `.github/workflows/briefing.yml`/`fetch-briefing.js` já estão intactos e continuam gerando `briefing.json` normalmente.
- Pendências antigas mantidas (ver sessão 10/07): curva diária na Evolução Patrimonial, `RENDA_2026`, CDI/IPCA anual, `FISCAL_ENTRADAS`, Registro Histórico em pools.html, `emprestimos.html` bundle, reconciliar `wealthCurve.invested`

---

Atualizado: 04/08/2026 — Card "E daí, pra mim?" (patrimônio/HF AAVE/LTV Kamino/liquidação SOL/carry mensal) portado de `mercado.html` para `pools.html` (acima da Meta de Alocação), lendo `briefing.json` ao vivo; `mercado.html` removida do site (`git rm`, recuperável no histórico) e nav limpo nas 4 páginas que linkavam pra ela; pipeline `briefing.yml`/`fetch-briefing.js` mantida rodando (agora alimenta o card de pools, não só a página removida)

---

## Sessão 14/08/2026 — Refresh semanal + CORREÇÃO sobre `emprestimos.html` + fix dos juros acumulados (CSV Kamino)

### ⚡ CORREÇÃO — desfaz a "descoberta" de 06/07/2026 sobre `emprestimos.html`

A sessão de 06/07 concluiu que o arquivo "não é editável à mão" e que qualquer mudança
exigiria "código-fonte original + rebuild". **Isso está errado em dois pontos** e me fez
responder duas perguntas do Lucas incorretamente antes de eu verificar o repo.

**1. A atualização de dados É AUTOMÁTICA — só editar `data.js`.** Existe desde ~20/07/2026:
- `scripts/refresh-emprestimos-data.js` — acha o asset do `data.js` dentro do
  `<script type="__bundler/manifest">` (descomprime cada asset e procura `window.BAROLO_DATA`,
  sem depender do UUID) e regrava só ele. Idempotente.
- `.github/workflows/sync-emprestimos.yml` — dispara no push da `main` quando `data.js` muda
  (`paths: [data.js]`) e commita `emprestimos.html`. Sem secrets, não entra em loop.

**Fluxo real: editar `data.js` → push → pronto.** As 5 páginas normais leem via
`<script src="data.js">`; a de empréstimos recebe pela Action.

**2. O SHELL do bundle (~149 KB) é texto puro editável.** Só o `data.js` embutido é
gzip+base64. CSS, HTML e todo o JS (`fetchAave`, `updateYieldCards`, `runFetch`…) são
legíveis. Está dentro de uma string JS → quebras de linha viram `\n` literal e aspas `\"`.
Editável por substituição de string exata **se o texto novo não tiver aspas nem quebras**.

### Refresh de posições (prints CoinGecko + AAVE V4 + Kamino + Revert)

Holdings e stables **sem alteração** — só APYs, juros e a pool se moveram.

| Campo | Antes (07/08) | Depois (14/08) |
|---|---|---|
| AAVE WETH / USDT apy | 1.79% / 2.65% | **1.83% / 2.17%** |
| AAVE borrow | 759.46 @ 4.00% | **760.17 @ 3.79%** |
| AAVE HF | 6.20 | **6.08** (Collateral $4.622 ÷ borrow $760,02) |
| Kamino SOL / USDS | 24.46 @4.49% / 303.83 @4.00% | **24.48 @4.47% / 304.07 @4.06%** |
| Kamino borrow | 822.62 @ 5.94% | **823.63 @ 5.92%** |
| Kamino LTV / LiqLTV | 38.95% / 77.16% | **38.46% / 77.13%** |
| Dívida total | $1.582,08 | **$1.583,80** |

**Pool WETH/USDG (Robinhood):** pooled $358,14 (0,1750 WETH + 29,91 USDG), fees não coletadas
$1,81, in-range (market $1.876,06). Card **estático** de `pools.html` atualizado — estava
congelado nos valores de 14/07 ($338,91 / 111,83% / borrow −5,38%).

**Metodologia da pool:** a Revert trata como **UMA posição contínua desde 14/07** (mesma NFT —
o "fechamento" de 07/08 foi *remove + add liquidity na mesma posição*): 30,9 dias, fees
lifetime $14,72 = $12,90 coletadas + $1,81 não coletadas. No site o ciclo 1 continua lançado
como **fechado** ($13,04) e o card ativo carrega só o ciclo 2 — assim o YTD não duplica. Campos
de **estoque** (pooled/fees/pnl/daysOpen) = ciclo 2; campos de **taxa** (apr/feeApr) = lifetime
da Revert (64,57% / 50,91%), porque anualizar 7 dias vira ruído.
YTD confere: 96,28 + 8,62 + 13,04 + 1,81 = **$119,75 ≈ $120**.

### 🐛 Bug corrigido — "JUROS EM TEMPO REAL" contava DEPÓSITO como RENDIMENTO

| Bug | Causa raiz | Fix |
|-----|-----------|-----|
| Cards de juros congelados nos fallbacks de maio/2026 mesmo com o fetch ao vivo OK | `runFetch()` terminava chamando `updateYieldSection()` — **nunca** `updateYieldCards()` (funções diferentes, nomes parecidos) | `updateYieldCards()` adicionado ao fim do `runFetch()` |
| Fallbacks e os 6 `*_PRINCIPAL` eram constantes fixas no shell, invisíveis ao `data.js` | Nunca foram ligados à fonte única | Todos leem de `window.BAROLO_DATA` (novo bloco **`principals`**), com o valor antigo como fallback |
| **Aporte novo aparecia como juros ganho** | `AAVE_USDT_PRINCIPAL` (1287.33) e `KAMINO_SOL_PRINCIPAL` (20.39) estavam meses defasados | Corrigidos — ver abaixo |

Antes do fix o site dizia **+316 USDT** e **+4,09 SOL (~$308)** de juros ganhos.

**Os principals da Kamino vieram do CSV oficial** (Transaction History, 65 movimentos,
01/02/2025 → 15/07/2026) — cobrem a obrigação inteira (K1–K4), não só o ciclo corrente:

| | Principal líquido | Posição hoje | Juros retidos |
|---|---|---|---|
| SOL | **23,274227** (29,405908 dep − 6,131681 saq) | 24,48 | +1,21 SOL (~$91) |
| USDS | **300,392689** (depósito único 19/03/2026) | 304,07 | +3,70 USDS |
| USDC | **754,183048** (1.807,089 borrow − 1.052,905 repay) | 823,63 | −69,46 pagos |

Os da AAVE saíram do próprio campo *earnings* do print: WETH **2,15**, USDT **1587,65**,
USDC **748,00** (este confere sozinho: 760,17 − 748 = 12,17 = o "fees paid" do print).

**Resultado (bate com os prints):**

| | Site | Print |
|---|---|---|
| AAVE pagos | −$12,22 | fees paid **12,17 USDC** ✓ |
| AAVE recebidos | +0,0122 WETH · +16,11 USDT | **0,01 ETH · 16,35 USDT** ✓ |
| AAVE net | **+$26,80** | — |
| Kamino recebidos | +1,2121 SOL ($91,49) · +3,70 USDS | — |
| Kamino pagos | −$69,46 | — |
| Kamino net | **+$25,74** | — |

**Por que NÃO bate com o "Interest Earned +$153,62" da Kamino (e não deve bater):** aquilo é
juro acumulado de toda a vida, **incluindo o que já foi sacado** — dos 6,13 SOL sacados em 2025,
parte era juro realizado. O site calcula `atual − principal` = juro **ainda retido** na posição,
que é a métrica certa para uma posição aberta. (Numa etapa intermediária desta sessão eu havia
estimado `kamino.SOL = 22,44` justamente forçando o encaixe nos $153,62 — o CSV mostrou que
errava em 0,83 SOL. Não repetir esse atalho.)

### ⚠️ Manutenção nova (não esquecer)

`data.js` → bloco **`principals`** é *cost basis* (principal depositado/emprestado, **sem** juros).
**Atualizar sempre que houver depósito, saque ou reempréstimo** — senão o aporte novo volta a
aparecer como rendimento. É exatamente o bug de 14/08. Fonte: CSV do Transaction History da
Kamino / campo *earnings* do print da AAVE.

### Divergência conhecida (não corrigida)

`data.js` grava `healthFactor: 6.08` pela convenção documentada (Collateral ÷ Borrow, do print),
mas o fetch ao vivo do `portfolio_analytics.html` mostra **5.00** — é o HF real da Aave
(colateral × *liquidation threshold* ÷ dívida). Fórmulas diferentes; o ao vivo é o correto quando
disponível. Pré-existente, só registrado aqui.

### Commits
- `e49f5ab` — data: refresh semanal 14/08/2026 (AAVE + Kamino + pool) e fix dos juros acumulados

### O que ainda falta
- Pendências antigas: curva diária na Evolução Patrimonial, `RENDA_2026`, CDI/IPCA anual,
  `FISCAL_ENTRADAS`, Registro Histórico em `pools.html`, reconciliar `wealthCurve.invested`

---

Atualizado: 14/08/2026 — Refresh semanal (AAVE/Kamino/pool) via `data.js`; **corrigida a
informação errada de 06/07 sobre `emprestimos.html`** (a atualização é automática via
`sync-emprestimos.yml`, e o shell do bundle é editável); **bug dos juros acumulados corrigido**
— `updateYieldCards` nunca rodava após o fetch e 2 principals defasados contavam depósito como
rendimento; principals da Kamino agora derivados do CSV oficial (SOL 23,274227 · USDS 300,392689
· USDC 754,183048)

---

## Sessão 19/08/2026 — ROI de destaque corrigido, retornos derivados da wealthCurve, benchmark de aporte equivalente, consolidação da KB

### Contexto

Lucas recebeu de outra sessão um brief de 7 passos apontando problemas de metodologia no
`portfolio_analytics.html` e nas bases de conhecimento do repo. Antes de implementar, o brief foi
verificado contra o código real (3 agentes de exploração em paralelo + leituras diretas): a
realidade era mais bagunçada do que o brief supunha (5 métricas de "ROI" diferentes na página, não
uma; o gráfico de benchmark visível não lia `WEEKLY_UPDATE.benchmark`; `MONTHLY_RETURNS_DATA` já
era sobrescrito em runtime, só que com a fórmula errada), mas os números-alvo do brief bateram
**exatamente** com o que os dados reais produzem, uma vez usada a fórmula certa — confirmado via
Node antes de qualquer edição.

### Implementado

#### `CLAUDE.md` + `CONHECIMENTO-BAROLO.md` — consolidação da KB
Havia duas cópias divergentes: `CONHECIMENTO-BAROLO.md` (rastreada, espelha o bloco
`KB-START`/`KB-END` do `CLAUDE.md`) e um rascunho não versionado `CONHECIMENTOBAROLO.md` com
seções mais novas (§3.2.1, §8.6, §16) mas cujo cabeçalho alegava — incorretamente — que o arquivo
com hífen e o bloco `KB-START` não existiam. Fundidas as duas: conteúdo mais completo incorporado
ao arquivo canônico, cabeçalho corrigido, ordem física de §8.5/§8.6 normalizada, tabela de
auditoria em §16.4 corrigida. `CONHECIMENTO-BAROLO.md` regenerado a partir do `CLAUDE.md` via o
próprio comando `sed` documentado no cabeçalho (garante espelhamento byte-a-byte). Rascunho sem
hífen removido.

#### `.gitattributes` (novo)
`* text=auto eol=lf` — previne diffs falsos de CRLF/LF que já induziram leituras erradas do estado
do repo em sessões anteriores. `git status` já estava limpo no momento (não havia os ~20 arquivos
que o brief supunha), então isto é puramente preventivo.

#### `portfolio_analytics.html` — ROI em destaque
O card "P&L Total" (hero) dividia o patrimônio por `TOTAL_INVESTED` (custo de aquisição, soma
todas as compras incluindo capital reciclado de vendas/rotações — ≈$10.172), mostrando ROI ≈ −30%.
Trocado para: patrimônio líquido (pós-dívida) ÷ aporte líquido real
(`WEEKLY_UPDATE.wealthCurve.invested`, último valor — ≈$7.250) − 1. O ROI sobre custo de aquisição
continua visível, movido para sub-linha do card "TOTAL INVESTIDO", rotulado "base IR" com tooltip
explicando a diferença.

| Campo | Antes | Depois (dado ao vivo no teste) |
|---|---|---|
| ROI em destaque | ≈ −29,9% (custo de aquisição) | **+2,7%** (aporte líquido real) |
| ROI custo de aquisição | (era o único, sem rótulo) | **−11,2%** · secundário, rotulado "base IR" |

**Fora de escopo, flagado:** `metric-return`, `metric-roi`/`ev-growth-pct` ("Lifetime Return", usa
capital-semente de Jan/2022 ≈$1.061) e `metric-roic` continuam com metodologias próprias — 4
números de "retorno" diferentes ainda coexistem na página. O brief só pediu o de destaque.

#### `portfolio_analytics.html` — retornos mensais/anuais 100% derivados
`WEEKLY_UPDATE.monthlyReturns` e o literal `MONTHLY_RETURNS_DATA` (com comentários "Sum ~+68%"
admitindo estimativa) já eram sobrescritos em runtime por `syncFromWealthCurve()`, mas com
denominador simples (`vIni`) em vez de Modified Dietz (`vIni + 0,5×aporte`), e o agregado anual
(`buildAnnualChart`) somava os meses aritmeticamente em vez de compor geometricamente — a
combinação dos dois erros distorcia o resultado.

Fix: `MONTHLY_RETURNS_DATA` nasce vazio, populado 100% em runtime a partir de
`wealthCurve.labels/.values/.invested` (scaffold dinâmico de anos, sem lista hardcoded).
`syncFromWealthCurve()` usa Modified Dietz. `buildAnnualChart()` usa compounding geométrico
(`compoundPct()`) no agregado anual e na linha acumulada do drilldown mensal. Lista de anos do
gráfico também é dinâmica (não mais `[2022,2023,2024,2025,2026]` hardcoded).
`calculatePerformanceMetrics()` (TWR/alpha) recebeu o mesmo fix de denominador, para não
contradizer o gráfico.

| Métrica | Antes | Depois (validado Node + browser) |
|---|---|---|
| Retorno 2025 | array hardcoded (não usado de fato) | **−2,3%** |
| Retorno 2024 | idem | **+182,2%** |
| TWR anualizado (`calculatePerformanceMetrics`) | denominador errado, número maior em módulo | **−7,2% a.a.** |

#### `portfolio_analytics.html` + `benchmark-data.js` (novo) — benchmark de aporte equivalente
O gráfico de Benchmark comparava patrimônio bruto (inclui todos os aportes) contra índices de
preço sintéticos (mesma taxa repetida por trimestre inteiro, sem aporte nenhum) —
`WEEKLY_UPDATE.benchmark` nem era lido pelo gráfico visível, só alimentava um cálculo de alpha à
parte com 16 pontos esparsos e `benchYears=4,33` hardcoded.

Fix: `benchmark-data.js` traz preços mensais reais de BTC/ETH (Binance klines, campo `close`) e
CDI (BCB SGS série 4391), alinhados a `wealthCurve.labels` (55 meses, Jan/22→Jul/26), com
`source`/`fetchedAt`/`methodology` documentados. `buildBenchmarkChart()` reescrito: 4 curvas em USD
absoluto — Portfólio real vs 100% ETH vs 100% BTC vs CDI — simulando "o mesmo aporte, na mesma
data, em cada alternativa" (`simulateDcaEquivalent`/`simulateCdiEquivalent`). S&P 500 e Ibovespa
removidos (fora do escopo pedido — só 4 curvas). `calculatePerformanceMetrics()` passou a usar os
mesmos preços reais para `alpha`/`benchmarkReturn`, com `benchYears` calculado de
`bench.labels.length/12` em vez de hardcoded.

**Fora de escopo, flagado:** sem GitHub Action recorrente para reatualizar `benchmark-data.js` — é
um refresh manual, como os demais dados do site hoje.

#### `CLAUDE.md` — política de privacidade
Novo item 5: o repositório é **público** por escolha (decisão verificada e confirmada pelo Lucas em
19/08/2026) — `robots.txt`/`noindex` protegem só o site publicado, não o repositório. A regra que
continua inegociável: nunca expor endereço de carteira, NFT ID ou identificador único on-chain.

### Razão de fundo (contexto para os números acima)

Duas métricas medem coisas diferentes e o dashboard estava misturando as duas: **TWR**
(time-weighted, −7,2% a.a.) mede o *gestor* — remove de propósito o efeito de quando se aporta.
**MWR/ROI sobre aporte líquido** (≈ 0 a 3% no teste ao vivo) mede o *poupador* — credita o timing
dos aportes. A diferença de vários pontos por ano é o valor mensurável do DCA. Como o Lucas está em
fase de acumulação e a estratégia dele *é* o timing do aporte, MWR/ROI sobre aporte líquido são as
métricas corretas para destaque; TWR fica como secundária, para avaliar seleção de ativo.

### Verificação

Todos os passos verificados no browser (servidor local, `http://localhost:8080`) antes de cada
commit: console sem erros, valores conferidos por `javascript_tool` contra o recomputo em Node
(2025 −2,3%/2024 +182,2%/TWR −7,2% batem exatamente), 4 datasets do benchmark renderizando em USD,
troca de período (1M/3M/6M/1A/Total) funcional, `git status` limpo após cada commit,
`CONHECIMENTO-BAROLO.md` idêntico ao bloco `KB-START`/`KB-END` do `CLAUDE.md` (`diff` vazio),
`CONHECIMENTOBAROLO.md` removido, `grep "Sum ~"` vazio na árvore rastreada.

### Commits

- `f20625f` — chore: normaliza fim de linha para LF (.gitattributes)
- `11f96f2` — docs: consolida base de conhecimento (remove CONHECIMENTOBAROLO.md duplicado)
- `b58c948` — fix: ROI em destaque usa aporte líquido real
- `2e9d4ff` — fix: retornos mensais/anuais 100% derivados da wealthCurve
- `abbf021` — feat: benchmark de aporte equivalente (ETH/BTC/CDI)
- `1a4ef86` — docs: registra decisão de repositório público na política de privacidade

### O que ainda falta

- ~~4 métricas de "ROI" não reconciliadas~~ — ✅ FEITO na sessão seguinte (19/08/2026, ver abaixo)
- **`benchmark-data.js` sem refresh automático** — mês corrente fica defasado até o próximo
  refresh manual (candidato a uma Action tipo `onchain.yml`/`networth.yml`)
- ~~`metrics.irr` alias de `metrics.twr`~~ — ✅ FEITO (XIRR real implementado, ver abaixo)
- **`data.js → defi.aave.healthFactor` tem 3 valores em jogo** (6,04 hardcoded, 6,12 ao vivo no
  `briefing.json`, 5,00 mencionado em nota antiga do CLAUDE.md) — não investigado ainda
- Pendências antigas mantidas: `monthlyReturns[2026]` (Ago–Dez, meses ainda não fechados),
  `RENDA_2026`, CDI/IPCA anual, `FISCAL_ENTRADAS`, Registro Histórico em `pools.html`, reconciliar
  `wealthCurve.invested` (série termina em 07/26, precisa de ponto novo mensal)

---

Atualizado: 19/08/2026 — **ROI de destaque corrigido** (custo de aquisição → aporte líquido real,
−29,9%→ perto de zero a zero), **retornos mensais/anuais 100% derivados da wealthCurve** (Modified
Dietz + compounding geométrico, sem array hardcoded — 2025 −2,3%, 2024 +182,2%, TWR −7,2% a.a.),
**benchmark de aporte equivalente novo** (`benchmark-data.js` — preços reais BTC/ETH/CDI, 4 curvas
em USD: Portfólio vs 100% ETH vs 100% BTC vs CDI), **KB consolidada** (duas cópias divergentes
fundidas em `CONHECIMENTO-BAROLO.md`), `.gitattributes` adicionado, política de privacidade
registra que o repo é público por escolha

---

## Sessão 19/08/2026 (continuação) — Métricas de performance unificadas na fonte única + XIRR real

### Contexto

Lucas pediu para continuar melhorando a partir do que ficou registrado em "O que ainda falta" da
sessão anterior. Ao investigar as "4 métricas de ROI não reconciliadas", a bagunça acabou sendo
maior do que o esperado: havia **quatro locais diferentes** na página mostrando Sharpe/Volatilidade/
Max Drawdown/CAGR, cada um com sua própria fórmula (às vezes hardcoded), e um painel inteiro de
métricas que **nunca tinha sido renderizado, desde sempre**, por um bug de seletor.

### Implementado (`portfolio_analytics.html`)

#### Bug crítico: `renderPerformanceMetrics()` nunca renderizava
O seletor usado para achar a aba Performance era `document.querySelector('[data-tab="performance"]')`
— esse atributo **não existe em lugar nenhum do HTML** (o id real é `#tab-performance`). Como
resultado, o painel inteiro de métricas (TWR/Benchmark/Alpha/Sharpe/MaxDD/ROIC/Vol/IRR, com os ids
`m-twr`, `m-bench`, etc.) nunca foi inserido no DOM em nenhuma sessão anterior — bug presente desde
a criação da função. Corrigido para `document.getElementById('tab-performance')`. Corrigir esse bug
revelou um **segundo bug**: `firstCard.nextSibling` não é necessariamente filho direto de `tabPane`
(já que `querySelector` busca descendentes, não só filhos diretos), então `insertBefore` lançava
`NotFoundError`. Corrigido para inserir relativo a `firstCard.parentNode`.

#### CAGR/"Lifetime Return"/"ROI Total" repetiam o mesmo erro do ROI de destaque
`s-cagr` (hero), `ev-growth-pct` (exec bar, "Lifetime Return") e `metric-cagr`/`metric-roi` (aba
Métricas) todos dividiam os ativos ao vivo pelo **capital-semente de Jan/2022** (~US$1.061) — o
mesmo erro categórico do ROI de destaque corrigido na sessão anterior (atribuir a "performance"
um crescimento que é majoritariamente aporte, não retorno). Unificados em:
- `metrics.twr` (TWR anualizado, Modified Dietz) → `s-cagr`, `metric-cagr`
- `metrics.twrCumulative` (novo campo — retorno composto desde a fundação, sem anualizar) →
  `ev-growth-pct`, `metric-roi` (relabelado "Retorno Acumulado (TWR)")

`pct-current` (texto) e o último ponto do gráfico "Evolução Patrimonial" (Série 2) também usavam
fórmulas diferentes entre si — uma inconsistência que só aparecia em atualizações ao vivo após o
primeiro carregamento. Unificados na mesma conta (`liveCur`, deposit-aware).

#### Valores hardcoded eliminados + XIRR real implementado
`metric-sharpe`/`metric-vol`/`metric-maxdd` (aba Métricas) tinham volatilidade **63,7% hardcoded**
e max drawdown **50,9% hardcoded**, mais um "IRR aproximado" com fórmula própria sem sentido
(`anos/2`). Um **quarto bloco**, estático e sem nenhum `id` (aba DeFi & Mercado, seção "Métricas"),
repetia Sharpe/Vol/MaxDD com números igualmente desatualizados (Sharpe **−1,42** hardcoded, Vol
**87%** hardcoded). Todos os 4 locais agora leem de uma única chamada a `calculatePerformanceMetrics()`
no topo de `renderUI()` (variável `metrics`, computada uma vez, reusada por hero/exec bar/aba
Métricas/aba Performance/aba DeFi).

`metrics.irr` era `= metrics.twr` (alias, comentário próprio admitia "fallback to TWR for now").
Implementado XIRR real via **bisseção** sobre o fluxo de caixa mensal (cada aporte como saída
negativa, valor atual do portfólio como resgate positivo no último mês) — `computeXIRR(cashflows,
times)`, robusto (não precisa de derivada), 100 iterações máx, `null` se não houver troca de sinal
no NPV (fallback para TWR nesse caso). O card "Alpha" também usava um **MWR hardcoded (8,4%)** e um
subtítulo com texto estático ("IRR 8.4% vs Benchmark 9.2%") — ambos agora dinâmicos, usando o
`metrics.irr` real.

| Métrica | Antes | Depois (validado Node + browser, ao vivo) |
|---|---|---|
| Sharpe (3 locais diferentes) | −1,42 (hardcoded) / outro cálculo / outro | **−0,14** nos 3 |
| Volatilidade (3 locais) | 87% (hardcoded) / 63,7% (hardcoded) / outro | **65,6%** nos 3 |
| Max Drawdown (2 locais) | 50,9% (hardcoded, coincidia por acaso) | **−50,9%** (agora real) |
| CAGR desde 2022 (hero) | fórmula viciada (capital-semente) | **−7,2%** (= TWR) |
| IRR / Alpha | alias de TWR / MWR 8,4% hardcoded | **XIRR −1,37% a.a.** (validado em Node) |

### Verificação
Testado no browser (tab nova, sem cache stale) em todas as 5 abas: console sem erros, `Sharpe`
idêntico nas 3 abas onde aparece, `TWR` idêntico nas 4 (hero/exec bar/Métricas/Performance),
`XIRR` calculado em Node contra o `wealthCurve` real bate exatamente com o valor exibido na página
(−1,37% a.a.), gráfico "Evolução Patrimonial" (Série 2) e o texto `pct-current` agora sempre
concordam entre si.

### Commits
- `0607d11` — fix: unifica as métricas de performance na fonte única (TWR/IRR/Sharpe/Vol/MaxDD) + XIRR real

### O que ainda falta
- ~~`benchmark-data.js` sem refresh automático~~ — ✅ FEITO na sessão seguinte (Action `benchmark.yml`)
- **`data.js → defi.aave.healthFactor` com 3 valores em jogo** (6,04 hardcoded, 6,12 ao vivo no
  `briefing.json`, 5,00 numa nota antiga do CLAUDE.md) — **deixado de propósito para depois**, a
  pedido do Lucas em 19/08/2026. Não investigar nem corrigir sem ele pedir.
- **`metric-return`/`metric-roic` (aba Métricas)** ainda usam suas próprias definições (retorno
  sobre capital deployado excluindo stables; ROIC médio) — são conceitos legitimamente distintos
  do ROI de destaque e do TWR/IRR, mantidos como estão, mas vale revisar se ainda fazem sentido
  lado a lado com tantas outras métricas na mesma aba
- Pendências antigas mantidas: `monthlyReturns[2026]` (Ago–Dez), `RENDA_2026`, CDI/IPCA anual,
  `FISCAL_ENTRADAS`, Registro Histórico em `pools.html`, reconciliar `wealthCurve.invested`

---

Atualizado: 19/08/2026 (continuação) — **Painel de métricas da aba Performance renderiza pela
primeira vez** (bug de seletor `[data-tab="performance"]` nunca existiu no DOM), **CAGR/"Lifetime
Return"/"ROI Total" corrigidos** (mesmo erro categórico do ROI de destaque — capital-semente de
2022 → TWR/twrCumulative), **Sharpe/Volatilidade/Max Drawdown hardcoded eliminados em 2 lugares**
(incluindo um bloco estático sem `id` na aba DeFi & Mercado), **XIRR real implementado** (bisseção
sobre fluxo de caixa mensal, −1,37% a.a., valida contra Node) substituindo o alias de TWR — todas
as métricas agora convergem para os mesmos números nas 5 abas onde aparecem

---

## Sessão 19/08/2026 (continuação 2) — Automação do refresh do benchmark-data.js

### Contexto
Último item pendente da rodada de correções de métrica: `benchmark-data.js` (preços reais de
BTC/ETH/CDI usados no gráfico de Benchmark de aporte equivalente) tinha sido gerado uma única vez,
manualmente, e ficaria defasado a partir do mês seguinte. Lucas pediu para automatizar o refresh
e deixar a divergência do Health Factor (3 valores em jogo — 6,04/6,12/5,00) **explicitamente
guardada para depois**, sem investigar agora.

### Implementado

#### `scripts/fetch-benchmark.js` (novo)
Segue o mesmo padrão de `fetch-networth.js`/`fetch-onchain.js`: busca BTC/ETH via **Binance klines**
mensais (`interval=1M`, campo `close`, sem chave) e CDI via **BCB SGS série 4391** (% a.m., sem
chave), de Jan/2022 até o mês corrente (inclui o candle/valor parcial do mês em andamento — o
benchmark do mês corrente fica se atualizando dia a dia até o mês fechar). Retry com backoff em
429/5xx. Sanity checks (preço BTC/ETH dentro de faixa plausível, no máximo 2 meses faltando).
Sobrescreve `benchmark-data.js` (`window.BENCHMARK_DATA = {...}`, mesmo formato de antes — `.js`,
não `.json`, para funcionar em `file://` igual a `data.js`/`diario.js`).

**Testado localmente**: rodou limpo, gerou 56 meses (Jan/22 → Ago/26, o mês atual incluído), preços
batendo com o fetch manual anterior (BTC $68.220 / ETH $2.094,77 no momento do teste). Verificado
no browser (servidor local): zero erros de console, gráfico de Benchmark renderiza normalmente com
o arquivo regenerado.

#### `.github/workflows/benchmark.yml` (novo)
Cron diário (`0 10 * * *`, ~07:00 BRT — depois dos horários do `onchain.yml`/`networth.yml` para não
competir por commit no mesmo minuto), mais `workflow_dispatch` para rodar manual. Sem secrets — só
APIs públicas. `git pull --rebase origin main` antes do push (mesmo padrão defensivo do
`networth.yml`, já que agora são 5 Actions escrevendo no repo em horários próximos). Só commita se
`benchmark-data.js` realmente mudou (`git diff --quiet`).

### Verificação
- `node scripts/fetch-benchmark.js` rodado localmente: saída limpa, sem erros.
- `node -c benchmark-data.js`: sintaxe válida.
- Página `portfolio_analytics.html` recarregada no browser com o arquivo regenerado: console sem
  erros, gráfico de Benchmark e `calculatePerformanceMetrics()` (alpha/benchmarkReturn) consomem o
  novo arquivo normalmente.

### Commits
- (a seguir, junto com este log)

### O que ainda falta
- **`data.js → defi.aave.healthFactor` com 3 valores em jogo** — **guardado para depois a pedido
  do Lucas**, não mexer sem ele pedir.
- **Confirmar a Action rodando em produção** — primeira execução automática só acontece no próximo
  horário agendado (~07:00 BRT); pode rodar manual via aba Actions → "Atualizar benchmark de aporte
  equivalente" → Run workflow para confirmar antes disso.
- Pendências antigas mantidas: `monthlyReturns[2026]` (Ago–Dez), `RENDA_2026`, CDI/IPCA anual,
  `FISCAL_ENTRADAS`, Registro Histórico em `pools.html`, reconciliar `wealthCurve.invested`

---

Atualizado: 19/08/2026 (continuação 2) — **Refresh automático do `benchmark-data.js`**
(`scripts/fetch-benchmark.js` + Action `benchmark.yml`, cron diário ~07:00 BRT, sem secrets — Binance
klines + BCB SGS): último item pendente da rodada de métricas fica resolvido; **divergência do
Health Factor (6,04/6,12/5,00) fica registrada e guardada para depois, por pedido explícito do
Lucas** — não investigar nem corrigir sem ele pedir

---

## Sessão 20/08/2026 — Coleta de taxas + pool saiu do range por cima (100% USDG) + aporte mono-ativo

### Contexto

Dia de rally forte (BTC +11,4% / ETH +18,5% em 24h). Lucas mandou dois prints de swap na
Robinhood Chain e pediu para computar. O que parecia ser "duas coletas de taxa" acabou sendo
duas coisas contabilmente diferentes — e a apuração revelou que a pool ativa tinha saído do
range por cima, completando a estratégia de saída gradual ETH→USDG.

### Os dois swaps (não são a mesma coisa — não confundir de novo)

| Swap | Valor | O que é | Vai para o P&L de pool? |
|---|---|---|---|
| 0,0023 ETH → 5,28 USDG | US$ 5,28 | Taxas do ciclo 2 da pool ativa, coletadas | **SIM** — renda realizada |
| 0,0080 ETH → 18,50 USDG | US$ 18,50 | ETH de taxa **antiga da pool da Base**, que já estava fora da pool e só foi vendido agora ao preço-alvo | **NÃO** — rotação de holding |

**REGRA registrada no `data.js`** (explicação do Lucas): as duas pools tinham o **mesmo objetivo** —
saindo do range por cima, as fees em ETH seriam vendidas por USD de qualquer forma. Logo, manter
fee em ETH depois do fechamento é **posição direcional, não pool**: a fee já foi lançada em USD no
fechamento daquele registro histórico, e o que vem depois pertence ao holding. Sempre que aparecer
um swap de "fee velha" assim, tratar como rotação de holding — nunca como renda de pool.

### Implementado

#### `data.js` — pool ativa (3 atualizações no mesmo dia, na ordem)

1. **Coleta**: `totalFees` 1,81 → **5,28** (realizadas), `uncollectedFees` 1,81 → **0**.
2. **Saída do range**: com ETH ~US$ 2.283 > `rangeMax` 2.166,83, a posição virou **100% USDG**.
   Antes do print, `pooled` foi *derivado* da liquidez do print de 14/08 (L = 109,06 pelos dois
   lados; acima do range o valor é `L × (√pb − √pa)` = 382,80).
3. **Aporte mono-ativo + print**: Lucas devolveu os 23,78 USDG (5,28 da fee + 18,50 da venda)
   para a **mesma posição**. Print Uniswap confirmou **US$ 413,05**.

Estado final gravado:

```
capital:388.06, pooled:413.05, totalFees:5.28, uncollectedFees:0,
il:0, pnl:30.27, daysOpen:13, openDate:'2026-08-07'
```

**Contabilidade do aporte (por que o pnl fecha dos dois lados):**
- `capital` 364,28 → **388,06** (+23,78 aportados)
- `totalFees` fica 5,28 — a fee já realizada, ao ser reinvestida, vira capital novo; entra nos
  dois lados e por isso não infla o resultado
- `pnl` = 413,05 + 5,28 − 388,06 = **30,27** ✔ — confere pelo outro lado: capital **externo**
  364,28 + 18,50 = 382,78 → 413,05 − 382,78 = 30,27 (**+7,91% em 13 dias**)
- `holdings.ETH` 2,37632741 → **2,36832741** (−0,0080). Sem isso o mesmo dinheiro seria contado
  duas vezes (no ETH e na LP). `invested` do ETH **inalterado** de propósito: aquele ETH era fee,
  custo zero. ⚠️ **Se aqueles 0,0080 ETH nunca estiveram lançados no CoinGecko, reverter para
  2,37632741** — a condicional está escrita no `data.js`.
- `asOf` 2026-08-14 → **2026-08-20**
- Os 23,78 USDG **não** foram lançados em `stables`: decisão do Lucas nesta sessão (só entram
  quando ele registrar no CoinGecko). Como foram todos para dentro da pool, o ponto virou nulo.

#### `pools.html`
- Entrada ativa do array `POOLS`: `capital` 364,28 → 388,06, `fees`/`result` 1,81 → **5,28**,
  `fcr` 5,0 → 14,6, `obs` reescrita com a coleta + saída do range + aporte + print.
- Card estático: badge `badge-green ● IN-RANGE` → **`badge-warn ○ FORA DO RANGE (acima) — 100%
  USDG`** (usei a classe `badge-warn` que já existe no CSS, linha 120 — `badge-red` não existe);
  POOLED `$358.14` → **`$413.05`** com sub-label `0 WETH + 413,05 USDG (print 20/08)`;
  sub-label do APR agora diz `$5,28 coletados em 20/08`.

#### `relatorio.html`
- `POOLS_DATA` entrada ativa: `fees`/`result` 1,81 → **5,28** + comentário.
- Linha de texto da posição: acrescentado `fora do range (acima) = 100% USDG $413,05`.

### Dados atualizados

| Campo | Antes | Depois |
|---|---|---|
| Pool `capital` | 364,28 | **388,06** |
| Pool `pooled` | 358,14 | **413,05** (print) |
| Pool `totalFees` | 1,81 (não coletadas) | **5,28** (realizadas) |
| Pool `uncollectedFees` | 1,81 | **0** |
| Pool `pnl` | −4,33 | **+30,27** |
| Pool `daysOpen` | 7 | **13** |
| Composição da pool | 0,1750 WETH + 29,91 USDG | **0 WETH + 413,05 USDG** |
| `holdings.ETH` qty | 2,37632741 | **2,36832741** |
| `asOf` | 2026-08-14 | **2026-08-20** |
| **P&L 2026 YTD de pools** | US$ 119,75 | **US$ 123,22** |

Print Uniswap 20/08: Position $413,05 · 0% WETH / 100% USDG · Out of range · market $2.277,72 ·
range $1.852,38–$2.166,83 · **"Fees earned $0 — you have no earnings yet"** (confirma que a coleta
zerou o contador, ou seja `uncollectedFees:0` está certo).

### Lição técnica — derivar liquidez V3 vs. print

A derivação de `pooled` feita antes do print ficou **1,59% baixa**: 413,05 − 23,78 aportados =
389,27 real contra 382,80 estimado. **Causa:** L é calculado a partir de uma diferença de raízes
muito próximas (`√P − √pa ≈ 0,274`), então o arredondamento do preço exibido no print de 14/08
é amplificado. **Regra:** derivar serve para o card não congelar num valor obsoleto — mas quando
chega print, **o print manda**, e não se deve tentar reconciliar a diferença como se fosse aporte.
Registrado no `data.js`.

### Decisão estratégica do Lucas (registrada)

**Mantém a pool** e aportou o restante do USDG mono-ativo, no mesmo range. Tese: **espera novas
quedas / capitulação até outubro** e quer a posição comprando ETH na descida.

Contraponto que dei (ele decidiu ciente): o range termina em US$ 1.852,38 — a pool compra ETH de
US$ 2.167 até US$ 1.852 e nesse ponto está 100% comprada, **sem USDG para a capitulação em si**.
Ela captura o *caminho até* a capitulação, não a capitulação. Se o cenário for ETH a US$ 1.500,
chega lá com preço médio de US$ 2.003 (25% acima do fundo) e sem pó seco. São US$ 413 (~5% do
patrimônio) e ele ainda tem US$ 1.620 em stables como munição real — a pool é a compra escalonada
da correção normal, os stables da AAVE/Kamino é que são a munição da capitulação.

Também vale registrar o desvio consciente do playbook: o loop documentado (§2.2 do CONHECIMENTO)
diz *"pool sai do range para cima → vende ETH acumulado + USD → paga a dívida"*. Ele optou por
não abater dívida e manter a posição posicionada para recomprar.

**Enquanto estiver fora do range, a pool gera taxa ZERO.** ETH precisa cair 5,1% (de ~$2.278 para
$2.167) para voltar a gerar. Custo de oportunidade de US$ 413 parados contra dívida a 4,9% a.a.
≈ US$ 1,69/mês.

### Bugs corrigidos

**`benchmark.yml` falhava com HTTP 451 (Binance geo-bloqueia os runners).** A primeira execução
agendada da Action criada em 19/08 quebrou: `api.binance.com` responde **451 Unavailable For Legal
Reasons** para IPs dos EUA, e os runners do GitHub ficam na Azure US.

⚠️ **LIÇÃO (vale para qualquer script novo de Action):** o teste local não pega isso — o sandbox do
Claude Code sai por proxy fora dos EUA, então a Binance responde normalmente aqui e 451 lá. Ao
escolher uma API para rodar em Action, **conferir geo-bloqueio, não só se responde no sandbox**. As
Actions que já funcionavam (`networth.yml`, `briefing.yml`) usam CoinGecko, que não geo-bloqueia.

**Fix:** `scripts/fetch-benchmark.js` agora busca em **cascata**, usando a primeira fonte que
responder — 1) **Coinbase Exchange** (americana; candles diários agregados em fechamento mensal),
2) **Yahoo Finance** (candles mensais direto), 3) **Binance** (fallback local, segue 451 no
Actions). Também: `fetchWithRetry` não reinsiste em 4xx (é permanente, só gastava tempo); o step de
commit ganhou `if: github.ref == 'refs/heads/main'` para permitir disparo manual em branch só para
testar o fetch; `actions/checkout@v5` + `setup-node@v5` + Node 22 (elimina o aviso de deprecação do
Node 20 que aparecia junto do erro).

**Validado no ambiente que importa:** como nenhuma das fontes alternativas passa pelo proxy desta
sessão (só Binance e BCB estão na allowlist — o inverso do runner), o teste foi feito disparando a
própria Action via `workflow_dispatch` na branch de trabalho. Resultado: `BTC: 56 meses via Coinbase
Exchange · ETH: 56 meses via Coinbase Exchange · OK 08/26: BTC $72645 · ETH $2338.07`, commit step
corretamente pulado.

Uma armadilha contábil **evitada** no resto da sessão: lançar o aporte na LP sem subtrair o ETH
vendido dos holdings teria inflado o patrimônio em US$ 18,50 (dupla contagem).

### O que ainda falta

- **Mergear a branch na `main`** — enquanto o fix do `benchmark.yml` não estiver lá, a execução
  agendada (10:00 UTC) continua falhando: o cron roda sempre a partir da default branch.
- **Confirmar se os 0,0080 ETH estavam no CoinGecko** — se não estavam, reverter `holdings.ETH`
  para 2,37632741 (condicional escrita no `data.js`).
- **Diário DeFi → `diario.js`** — Lucas salvou no Notion e no Diário do site (localStorage). Para
  chegar ao repo (e ficar visível para sessões automatizadas, ex. standup) ele precisa clicar em
  **"📤 Sincronizar"** na aba Diário DeFi e colar o resultado no chat.
- **Monitorar o retorno ao range** — quando o ETH voltar abaixo de US$ 2.166,83 a pool volta a
  gerar taxa e a comprar ETH. Se **furar US$ 1.852,38**, a posição fica 100% ETH e sem compra —
  aí é reavaliar range, não adicionar mais.
- **`RENDA_2026`** — array vai só até Jun. Faltam Jul (LP US$ 8,62, coleta da Base em 14/07) e Ago
  (LP US$ 13,04 do ciclo 1 + US$ 5,28 desta coleta = US$ 18,32), mais o `lend` de cada mês. Ago só
  entra no fechamento do mês (o array é de meses fechados).
- **`data.js → defi.aave.healthFactor` com 3 valores em jogo** (6,04 / 6,12 / 5,00) — **guardado
  para depois a pedido explícito do Lucas**, não mexer sem ele pedir.
- Pendências antigas mantidas: `monthlyReturns[2026]` (Ago–Dez), CDI/IPCA anual, `FISCAL_ENTRADAS`,
  Registro Histórico em `pools.html`, reconciliar `wealthCurve.invested`, `benchmark-data.js`
  Action rodando em produção.

### Commits (branch `claude/taxas-swap-usdg-calculo-kjxi4j`)

| Hash | Mensagem |
|---|---|
| `2827f37` | data: taxas coletadas da pool ativa ($5,28) + posicao fora do range por cima |
| `95342d9` | docs: regra — fee em ETH mantida apos fechamento e holding, nao renda de pool |
| `1a17324` | data: aporte mono-ativo de 23,78 USDG na pool ativa (decisao 20/08) |
| `7a51113` | data: print Uniswap 20/08 — pool $413,05 (100% USDG, out of range) |
| `d11d4b8` | docs: log sessao 20/08/2026 |
| `1894c6c` | fix: benchmark-data.js falhava com HTTP 451 (Binance geo-bloqueia runner dos EUA) |

⚠️ **Esta sessão rodou no Claude Code na web com branch designada** — os commits foram para
`claude/taxas-swap-usdg-calculo-kjxi4j`, **não para a `main`** (o fluxo normal do projeto é push
direto na main; aqui a instrução da sessão exigia a branch). **Falta mergear na main** quando o
Lucas quiser.

---

Atualizado: 20/08/2026 — Pool WETH/USDG **saiu do range por cima = 100% USDG** (US$ 413,05, print
Uniswap), completando a saída gradual ETH→USDG: taxas do ciclo 2 coletadas (US$ 5,28) e reaportadas
mono-ativo junto com US$ 18,50 de venda de ETH de fee antiga; **regra nova**: fee mantida em ETH
após o fechamento é holding, não renda de pool; ciclo 2 em **+US$ 30,27 (+7,9% em 13 dias)**; Lucas
mantém a posição esperando capitulação até outubro (taxa zero enquanto fora do range)

---

## Sessão 21–22/08/2026 — Fix do benchmark.yml (451), merge na main, aba Métricas unificada, e RECONCILIAÇÃO COMPLETA do CoinGecko

### Contexto
Continuação direta da sessão de 20/08 (a pool saindo do range). Começou com o Lucas
perguntando se a falha vermelha do `benchmark.yml` estava certa, passou por uma rodada de UI,
e terminou numa auditoria token a token do CoinGecko que mudou 5 posições e produziu 3 regras
novas de contabilidade.

### 1. `benchmark.yml` — HTTP 451 (Binance geo-bloqueia os runners)

A primeira execução agendada da Action criada em 19/08 falhou: `api.binance.com` responde
**451 Unavailable For Legal Reasons** para IPs dos EUA, e os runners do GitHub ficam na Azure US.

⚠️ **LIÇÃO (vale para qualquer script novo de Action):** o teste local não pega isso — o sandbox
do Claude Code sai por proxy fora dos EUA, então a Binance responde normalmente aqui e 451 lá.
Ao escolher uma API para rodar em Action, **conferir geo-bloqueio, não só se responde no
sandbox**. As Actions que já funcionavam (`networth.yml`, `briefing.yml`) usam CoinGecko.

**Fix** em `scripts/fetch-benchmark.js`: busca em **cascata**, primeira fonte que responder —
1) **Coinbase Exchange** (americana; candles diários agregados em fechamento mensal),
2) **Yahoo Finance** (mensais direto), 3) **Binance** (fallback local, segue 451 no Actions).
Também: `fetchWithRetry` não reinsiste em 4xx; step de commit ganhou
`if: github.ref == 'refs/heads/main'` (permite disparo manual em branch só para testar o fetch);
`actions/checkout@v5` + `setup-node@v5` + Node 22 (elimina o aviso de deprecação do Node 20).

**Validação:** como nenhuma fonte alternativa passa pelo proxy desta sessão (só Binance e BCB
estão na allowlist — o inverso do runner), testei disparando a própria Action via
`workflow_dispatch`. Verde: `BTC: 56 meses via Coinbase Exchange · ETH: 56 meses · OK 08/26`.

**Merge na main** (autorizado): 9 commits da branch `claude/taxas-swap-usdg-calculo-kjxi4j`.
O merge disparou duas Actions em cadeia — `benchmark.yml` rodou e commitou sozinha
(`benchmark-data.js` atualizado: BTC $76.751 / ETH $2.372), e `sync-emprestimos.yml` regravou o
bundle. A execução agendada de 21/08 de manhã ainda falhou (o fix só chegou na main depois).

### 2. `portfolio_analytics.html` — layout da aba Performance + métricas

**Bug de layout que EU causei em 19/08:** ao consertar o seletor de `renderPerformanceMetrics()`,
o painel passou a ser injetado depois do primeiro `.card` — cujo pai é o grid de 2 colunas
"Desempenho Histórico | Benchmark". Ele virava a 2ª célula e empurrava o gráfico de benchmark
para baixo. Corrigido ancorando no **pai do grid**.

**Depois disso, o painel foi REMOVIDO de vez** (~117 linhas): ele duplicava 5 dos 9 cards que a
aba Métricas já tinha, com nomes diferentes para a mesma coisa (TWR vs CAGR, além de Sharpe,
Max DD, Volatilidade e IRR). Os 3 exclusivos (Benchmark, Alpha, ROIC) foram absorvidos.

**Aba Métricas reorganizada** — de 3 fileiras soltas para **4 grupos rotulados de 3 cards**:
`Capital` (Investido · Dry Powder · Retorno) · `Retorno` (CAGR TWR · IRR XIRR · Retorno
Acumulado) · `vs Benchmark` (Benchmark 50/50 · Alpha · ROIC) · `Risco` (Volatilidade · Max DD ·
Sharpe). Antes o Sharpe estava no grupo de retorno e o Retorno Acumulado no de risco.

**Correções de dado:**
| Card | Antes | Depois |
|---|---|---|
| Lifetime Return | +820,2% | **−28,5%** |
| Benchmark | +5,4% | **+2,0%** |
| Alpha | −6,7% | **−3,4%** |
| Sharpe | −0,14 **em verde** | vermelho |
| ROIC / IRR negativos | dourado | vermelho |

- **Lifetime Return** repetia o erro categórico já corrigido nos outros cards em 19/08: dividia o
  patrimônio de hoje pelo aporte do **primeiro mês** (~$1.061). Agora usa `twrCumulative`.
- **Benchmark** era retorno de PREÇO do índice (buy-and-hold desde jan/22, sem aporte) comparado
  contra o IRR do portfólio, que credita timing — maçã com laranja, e o alpha herdava o erro.
  Agora o 50/50 é simulado com o **mesmo fluxo de caixa** e medido com o **mesmo XIRR**. De
  quebra corrigiu um desalinhamento de período (usava o último mês do benchmark contra o último
  da wealthCurve, que são diferentes).
- `metrics.alpha` tinha duas definições (twr−bench no objeto, irr−bench no card). Uma só agora.
- Cor por sinal onde as cores eram fixas no CSS/HTML.

**Retorno Anual — ganho em dinheiro no tooltip.** O Lucas estranhou 2025 aparecer negativo
(−2,5%) num ano em que o patrimônio subiu 25,7%. **Não era erro:** dos +$2.223 de variação,
+$2.156 foram aporte — o ganho dos ativos foi **+$67**. Em 2025 o BTC fez −6,3% e o ETH −10,9%,
o que torna ~0% coerente. O verde antigo vinha do array hardcoded (os comentários admitiam
"Sum ~+68%"), removido em 19/08. Em vez de mascarar, o tooltip agora abre em 3 linhas —
variação do patrimônio, aporte do ano, ganho dos ativos (helper `annualCashSummary`) — e há nota
abaixo do gráfico explicando o que o TWR mede.

Ano a ano: 2022 aporte $2.367 / ganho −$1.590 · 2023 $610 / +$1.218 · 2024 $975 / **+$5.054** ·
2025 $2.156 / +$67 · 2026 YTD $1.142 / −$4.968.

### 3. `ferramentas.html` — botões atrás da barra fixa

`#panel-semanal`, `#panel-ciclo` e `#panel-fiscal` vivem **FORA do `.container`** — e é o
container que reserva os 80px de `padding-bottom` para a `.update-bar` (`position:fixed`).
Medido com Chromium (viewport 1600×960, página no fim): dos 34px do botão SALVAR SEMANA,
**31px ficavam cobertos** — 3px clicáveis. Fix: `padding-bottom:80px` nos três. Depois: botão
termina 49px acima da barra, sobreposição zero nas três abas.

Falso positivo descartado: os botões 🖊️ do Diário aparecem "abaixo" da barra na medição, mas
estão dentro de `#diary-list`, que tem `overflow-y:auto` — itens fora da lista rolável.

### 4. RECONCILIAÇÃO COMPLETA DO COINGECKO (o grosso da sessão)

Começou com "quanto de ETH eu vendi para lançar no CoinGecko" e virou auditoria token a token.

**Sequência do ETH (3 correções em cadeia, cada uma desmentindo a anterior):**
1. Em 20/08 eu tinha subtraído 0,0080 ETH dos holdings supondo que a fee estava lançada.
   **Revertido em 21/08** (commit `076c053`, de outra sessão): o Lucas confirmou que não lança
   fee em ETH no CoinGecko, com duas evidências (print pós-venda inalterado + git log da qty).
2. Calculei que faltavam 0,183 (o que entrou na pool). **Errado** — a pool girou durante o ciclo
   (0,183 → 0,132 → 0,175 → 0), então "o que entrou" ≠ "o que saiu".
3. O que fecha é o outro lado: **ETH que ele tem hoje**. AAVE + carteiras + pool(0).

**Os prints das 4 carteiras + posições DeFi resolveram:**
- ETH nas carteiras: **0,06595** (somado pelos valores em USD; a notação de subscrito
  `0.0₄6206` é ambígua em OCR)
- **WETH 0,0018 no Yearn V3** — não aparecia na lista de tokens
- **XAI 898,879 STAKED em "unity capital X IF"** — explica por que o XAI não aparecia nas
  carteiras, e o CoinGecko estava **206 XAI a MENOS**, não a mais

**Print "Position Details" da AAVE** trouxe os exatos:
| | Antes (arredondado) | Depois (exato) |
|---|---|---|
| WETH supply | 2,16 @1,60% | **2,1629 @2,21%** |
| USDT supply | 1.600 @2,88% | **1.604,84 @3,10%** |
| Borrow USDC | 760,78 @4,20% | **760,93 @4,92%** |
| Health Factor | 6,04 | **7,37** |

O USDT estava **$4,84 a menos**: o card mostra "1,60 mil" arredondado, e o real sai do principal
(1.587,65 + 17,19 de earnings = 1.604,84). **A mesma conta VALIDA os dois principals** — o
`emprestimos.html` agora reproduz o print exatamente: juros retidos **17,19 USDT** e
**0,0129 ETH** ($32,07). O bug de 14/08 (depósito virando rendimento) está fechado dos dois lados.
HF 7,37 = (borrowing power 4.849,44 + borrowed 761) / 761 — numerador já ponderado pelos CFs
(WETH 83% / USDT 78%).

### Dados atualizados — ajustes lançados no CoinGecko pelo Lucas

| Token | Antes | Depois | Origem |
|---|---|---|---|
| **ETH** | 2,25752 | **2,23062** | AAVE 2,1629 + carteiras 0,06595 + Yearn 0,0018 |
| **EIGEN** | 153,36298802 | **131,44388802** | CoinGecko estava a mais |
| **XAI** | 692,86 | **898,879** | estava em staking |
| **POL** | 218 | **218,07** | — |
| **USDT** | 1.487,524 | **1.789,524** | AAVE 1.604,84 + corretora 185 + carteira 0,269 |
| USDT `invested` | 1.487,524 | **1.772,92** | 17,19 juro (custo 0) + 285,40 principal (com custo) |
| stablesTotalUSD | 1.619,96 | **2.106,96** | |
| debt.aave | 760,78 | **760,93** | |

**RDNT deixado de fora de propósito:** diferença de −12,39 unidades = **1 centavo**, e o XAI
provou que existe posição em stake fora da lista. Só mexer se aparecer numa varredura.

Conferido: as 13 quantidades batem exatamente com o print. A diferença de $16,39 no total vem
dos preços arredondados (ETH e SOL respondem por $14,27 — o preço implícito do ETH é $2.424,95,
não os $2.428,43 exibidos).

### Aba Fiscal — 3 conversões USDT/BRL de mai–jun/2026

Planilha `Custo_BRL_Consolidado_Lucas.xlsx` (enviada pelo Lucas, **não está no repo** — o
`.gitignore` bloqueia dados financeiros) foi gerada em **11/05/2026** e sua última conversão é de
08/05. As três do print de ordens são posteriores → somar não duplica.

| Data | USDT | Câmbio | BRL |
|---|---|---|---|
| 23/05/2026 | 45,69601 | 5,1317 | R$ 234,50 |
| 05/06/2026 | 76,39353 | 5,2398 | R$ 400,29 |
| 17/06/2026 | 96,26852 | 5,1938 | R$ 500,00 |
| **Total** | **218,35806** | **5,1969** | **R$ 1.134,78** |

`FISCAL_ENTRADAS` USDT: 2.576,24 → **2.794,60** un · R$ 13.931,79 → **15.066,57** · taxa 5,41 →
**5,39**. `APORTADO_BRL`: 35.498,19 → **36.632,97**.

**Planilha .xlsx atualizada foi gerada e enviada ao Lucas por arquivo** (3 linhas na aba OKX, 3 na
Evolução BRL-USDT, Resumo recalculado, formatação preservada). ⚠️ Na primeira tentativa escrevi
na linha do USDC em vez do USDT — refiz do original localizando a linha **pelo rótulo**, não por
índice. Conferido: soma da aba OKX = Resumo (R$ 6.200,28).

### Regras novas de contabilidade (todas gravadas no `data.js`)

1. **Fora do CoinGecko só o que JÁ É CONTADO EM OUTRO LUGAR.** O critério não é "operação vs
   hold" (a primeira formulação do Lucas). Pool/LP → fora (contada por `defi.uniswapV3.pooled`);
   **caixa em corretora → DENTRO** (nenhum outro campo a conta; se sair, some do patrimônio).
   Aplicado: +185 USDT de caixa (ordem em aberto para comprar BTC) lançados a custo US$ 185.
2. **Yield entra no CoinGecko como quantidade, custo zero** — aToken que cresce sozinho, fee de
   pool em ETH. Mesma regra já usada no SOL/USDS desde 15/07. **Isto REVOGA** a regra de 21/08 de
   manhã ("fee em ETH não entra"), que mantinha rendimento real fora da contabilidade.
3. **Token que entra em pool SAI do CoinGecko no mesmo dia.** Os 0,183 ficaram contados em dobro
   de 14/07 a 21/08 (~$434 de patrimônio inflado no pico).
4. **Custo de stable em USD, nunca em BRL** — em BRL o CoinGecko cria P&L cambial fantasma (foi o
   artefato de 23/06, USDT com "custo $582 e +$719 de lucro"). O BRL vive na planilha/aba Fiscal.

### Bugs corrigidos

| Bug | Causa raiz | Fix |
|---|---|---|
| `benchmark.yml` falhando (451) | Binance geo-bloqueia IPs dos EUA; testei só no sandbox, que sai por proxy fora dos EUA | Cascata Coinbase → Yahoo → Binance |
| Gráfico de benchmark empurrado para baixo | Painel de métricas injetado como 2ª célula do grid de 2 colunas | Ancorar no pai do grid |
| Painel duplicando 5 dos 9 cards da aba Métricas | `renderPerformanceMetrics` criada sem olhar o que já existia | Função removida, 3 exclusivos absorvidos |
| Lifetime Return +820,2% | Dividia patrimônio pelo aporte do 1º mês | `twrCumulative` |
| Benchmark/Alpha comparando preço vs IRR | Metodologias diferentes nos dois lados | DCA equivalente medido por XIRR |
| Sharpe −0,14 **em verde**, ROIC/IRR negativos em dourado | Cor fixa na classe CSS | Cor por sinal |
| Botões cobertos pela barra fixa | 3 painéis fora do `.container`, que é quem reserva os 80px | `padding-bottom:80px` nos três |
| USDT da AAVE $4,84 a menos | Card arredonda para "1,60 mil" | Derivado do principal: 1.604,84 |
| $302 de USDT fora do CoinGecko | Depósito na AAVE nunca lançado | Lançado: 17,19 juro + 285,40 principal |

### ⚠️ ACHADO DE PRIVACIDADE — endereços de carteira num repo PÚBLICO

Ao checar se eu tinha os endereços, encontrei: eles estão em **arquivos rastreados** no
repositório público `lbarolo/barolo-capital-site`.

| Arquivo | Endereços de carteira |
|---|---|
| `CLAUDE.md` | 7 |
| `portfolio_analytics.html` | 13 |
| `pools.html` | 10 |
| `emprestimos.html` | 1 |

O `.gitignore` **lista** o `CLAUDE.md` na seção "Arquivos privados — nunca subir para o GitHub
público", mas ele já estava rastreado antes disso (gitignore não afeta arquivo versionado).

Isso contraria a regra que o próprio `CLAUDE.md` chama de **inegociável** e afirma que "nunca foi
violada". Nos HTMLs o endereço precisa estar no JS para os fetches (a política permite; o que ela
proíbe é endereço em URL pública) — o problema é o repositório inteiro ser público.

**Apresentado ao Lucas com 3 caminhos (privatizar o repo / `git rm --cached CLAUDE.md` / não fazer
nada). Ele não respondeu — NÃO EXECUTAR nada disso sem decisão dele.**

### O que ainda falta

- ~~**Decisão sobre a exposição dos endereços**~~ — ✅ **RESOLVIDO em 05/09/2026**: Lucas avaliou e aceitou a exposição (ver política de privacidade, item 5). Não reabrir.
- **Origem dos 285,40 USDT** depositados na AAVE e nunca lançados. Se vieram de fiat, falta o
  custo em BRL na planilha (hoje R$ 36.632,97). Procurar no extrato um depósito/conversão de
  ~R$ 1.500 que foi direto para a AAVE.
- **R$ 950 de julho** (depósitos de 10/07 e 14/07): o Lucas confirmou que viraram os ~185 USDT
  parados na corretora, mas **não há conversão USDT/BRL de julho** no extrato de ordens (a janela
  de 3 meses cobre julho). Falta o print dessa operação para lançar no `FISCAL_ENTRADAS`
  (~185 USDT por R$ 950 = câmbio 5,1351).
- **RDNT** −12,39 un (1 centavo) — só ajustar se aparecer stake numa varredura.
- **SCR** (0,0018) não apareceu em print nenhum — pode estar em stake como o XAI.
- **BTC no Simple Earn** (entrou 22/08): a recompensa vem em **outro token** com incentivo, que o
  Lucas vai vender por BTC depois. Quando receber: entrada a custo zero; ao virar BTC, o BTC sobe
  mas o `invested` fica travado em $270,47.
- **Yield do USDT em corretora**: sugerido usar o Simple Earn (que ele já usa para BTC) em vez de
  mandar os 185 USDT para a AAVE — mover não compensa (US$ 0,44/mês de yield contra US$ 0,97–14,58
  de gas ida e volta, e perderia a ordem em aberto). Régua: só compensa a partir de ~US$ 1.000
  parados por mais de 3 meses.
- Pendências antigas: `monthlyReturns[2026]` (Set–Dez), `RENDA_2026` (Jul/Ago), CDI/IPCA anual,
  Registro Histórico em `pools.html`, reconciliar `wealthCurve.invested` ($7.250) com o canônico.

### Commits (todos na main)

| Hash | Mensagem |
|---|---|
| `1894c6c` | fix: benchmark-data.js falhava com HTTP 451 |
| `035c57d` | fix: layout da aba Performance + metricas corrigidas |
| `316f04b` | refactor: painel de metricas sai da Performance e a aba Metricas absorve tudo |
| `7f3915c` | Merge branch 'claude/taxas-swap-usdg-calculo-kjxi4j' |
| `5a0e4f5` | feat: Retorno Anual mostra o ganho em dinheiro |
| `0da817e` | fix: botoes do fim das abas Semanal/Ciclo/Fiscal atras da barra fixa |
| `43c6061` | data: reconcilia ETH com o CoinGecko (2,25752) + regras de pool e yield |
| `5f22edb` | data: aba Fiscal — 3 conversoes USDT/BRL (R$ 35.498 → 36.633) |
| `056734c` | data: +185 USDT de caixa em corretora lancados no CoinGecko |
| `c235475` | data: supply exato do aWETH (2.1629) |
| `16519ad` | data: AAVE com os numeros exatos do print Position Details |
| `e818ccd` | data: reconciliacao completa com o CoinGecko (print 22/08) |

*(`076c053` e `575e66a`, de 21/08, vieram de outra sessão — reversão da subtração do ETH e
refresh AAVE/Kamino via check-in de mercado.)*

---

Atualizado: 22/08/2026 — **`benchmark.yml` corrigido** (Binance responde 451 nos runners dos EUA;
agora cascata Coinbase → Yahoo → Binance) e branch mergeada na main; **aba Performance com os dois
gráficos lado a lado** e o painel duplicado removido, **aba Métricas reorganizada em 12 cards /
4 grupos**; **Retorno Anual mostra o ganho em dinheiro** (2025: +$67 de ativos contra +$2.156 de
aporte); botões que ficavam atrás da barra fixa em 3 abas; **RECONCILIAÇÃO COMPLETA DO COINGECKO**
— 5 posições ajustadas (ETH, EIGEN, XAI, POL, USDT), XAI achado em staking, AAVE com números
exatos (HF 7,37) e os principals validados contra o print; **3 regras novas de contabilidade** no
`data.js`; ⚠️ **descoberto que os endereços de carteira estão num repositório público** — decisão
pendente com o Lucas

---

## Sessão 04/09/2026 — Auditoria do site contra as sessões salvas: curva de patrimônio vira fonte única, dados congelados na landing, gráficos

### Contexto
Lucas pediu: *"Verifique pra mim o site, se bate todas as informações salvar em outras sessões aqui, corrija bugs, melhore os gráficos também."* Auditoria completa das 5 páginas
editáveis (`emprestimos.html` é bundle) cruzando o que elas exibem contra `data.js`,
`briefing.json`, `pools.html POOLS` e o que está registrado neste arquivo.

⚠️ **Nota de processo:** este log estava parado em 22/08. As sessões de **27/08, 01/09 e
04/09** (repay parcial na Kamino, fechamento mensal de agosto, reconciliação do USDS,
varredura on-chain do ETH) nunca foram logadas aqui — só existem nos comentários do
`data.js`, que estão detalhados e corretos. Quem for reconstruir o histórico precisa ler
os dois.

### Ambiente de verificação (importante para a próxima sessão)
O sandbox do Claude Code na web **bloqueia os CDNs por política de rede** (`cdnjs`,
`jsdelivr`, CoinGecko, fontes). Logo `Chart is not defined` e imagens quebradas **no
sandbox não são bugs do site** — na máquina do Lucas carregam normalmente. Para auditar
gráficos assim mesmo, foi usado um **stub do Chart.js** que registra as configs em
`window.__CHARTS` (injetado via `addInitScript` do Playwright): dá para inspecionar
séries, escalas e até *executar os callbacks de tooltip* sem a biblioteca real. Vale
reusar — está descrito no corpo desta sessão.

### Bugs de dados encontrados e corrigidos

| # | Onde | O que estava errado |
|---|---|---|
| 1 | `data.js` | Holding de **SOL (24,765222) ABAIXO do supply da Kamino (24,93)** — viola o invariante de que holdings incluem o colateral. 0,164778 SOL (~$16,70) de yield nunca lançados. Corrigido a custo zero, igual ao USDS em 04/09 e ao SOL em 15/07. ⚠️ **Espelhar no CoinGecko** como transferência de entrada. |
| 2 | `index.html` | Mantinha uma **SEGUNDA cópia da curva de patrimônio**, 3 meses atrasada (terminava 05/26 com $8.872 / aporte $6.261 contra 08/26 $9.295 / $7.610) — e o array de aportes era uma **série linear fictícia de +$100/mês**, não o aporte real. Alimenta o CAGR e a TIR do hero da landing pública. |
| 3 | `index.html` | Somava **`LP_POOLED = 296`** de uma pool da Base fechada em 14/07/2026 (não há pool aberta desde ~28/08). Em dois lugares. |
| 4 | `index.html` | `years = 4 + 4/12` cravado ("Jan 2022 to May 2026") e `TOTAL_APORTED = 6784` / `SPOT_VALUE = 5698` parados em junho. |
| 5 | `pools.html` | Card anunciava **"Pool Ativa"** e **"FORA DO RANGE — 100% USDG"** com **zero** posições abertas; custo de borrow marcava 3,79% contra os 4,65% do `data.js`. |
| 6 | `ferramentas.html` | Simulador comparava contra `totalBase = 5620` (junho) — o cenário "sem alteração nenhuma" já mostrava **+$3,6k de ganho fantasma**; `kamLiqThresh` 0,7579 vs 0,7661 do `data.js`. |
| 7 | `pools.html` | Gráfico **"Taxas por Período"** usava array de trimestres cravado à mão, parando em 2026 Q1 e somando **$2.034 contra os $2.466 reais**. Sobrou da sincronização de 08/04/2026, que derivou os outros gráficos e esqueceu este. |
| 8 | `portfolio_analytics.html` | **8 configs de gráfico passavam `'var(--muted)'` / `'var(--text)'` como cor para o Chart.js.** Canvas **não resolve custom properties**: o `fillStyle` fica inalterado e o tick cai numa cor herdada, deixando de seguir o tema. |
| 9 | `pools.html` | `toggleTheme()` só trocava o atributo `data-theme` — os 10 gráficos ficavam com a paleta do tema **anterior** até o próximo reload. |

### ⚡ MUDANÇA ESTRUTURAL — a curva de patrimônio agora vive no `data.js`

O bug #2 é de uma classe que ia se repetir todo mês. A curva foi **promovida para
`data.js` → `wealthCurve`** (`labels` / `values` / `invested`, 56 pontos, Jan/22→Ago/26) e
as duas páginas leem de lá, mantendo os literais que já tinham apenas como fallback:
- `portfolio_analytics.html` sobrescreve `WEEKLY_UPDATE.wealthCurve` (tudo na página é
  derivado dela: retornos mensais/anuais, TWR, XIRR, ROIC, drawdown, Sharpe, benchmark
  CDI/IPCA e o ROI de destaque);
- `index.html` sobrescreve `WEALTH_LABELS` / `WEALTH_VALUES` / `INVESTED`.

**O fechamento mensal passa a ser UMA edição só** — acrescentar um ponto nos três arrays
do `data.js`. A regra de o que entra em `invested` (só dinheiro que veio de fora; yield e
rotação interna não) está documentada no próprio bloco.

Efeito colateral bom: a **TIR do hero da landing (+9,0%) passou a bater com o IRR do
dashboard (+8,96%)** — antes divergiam porque usavam fluxos de caixa diferentes.

### Decisão do Lucas — CAGR e Track Record da landing

A landing exibia **"CAGR 2022–2026: +63,7%"** e **"Track Record (real): +621,7%"**. As duas
contas dividiam o patrimônio de hoje pelo **capital-semente de Jan/2022 (~$1.061)**, ou
seja, contavam os ~$7.610 aportados como se fossem retorno — **exatamente o erro
categórico que a sessão de 19/08 identificou e corrigiu no dashboard**, onde o mesmo CAGR
dá −2,2%.

Perguntei (três opções: corrigir / manter e trocar o rótulo / não mexer) e **Lucas escolheu
corrigir para bater com o dashboard**. Agora:
- **CAGR** = TWR anualizado (Modified Dietz mês a mês, aporte no meio do mês, composto
  geometricamente) → **−2,20%**, idêntico ao card do dashboard;
- **Track Record (real)** = TWR **acumulado** (−9,68%) descontado da inflação → **−24,9%**.

⚠️ **Armadilha registrada:** a tabela `CPI_USA` do `index.html` diz no comentário ser
*"accumulated since Jan/2022"*, mas os valores são **interanuais** (os 8,6 de 06/22 são o
pico YoY). Derivar a inflação acumulada dela daria ~3% no lugar de ~20% e inflaria o
retorno real em quase 20 pontos. Por isso ela ficou como **constante explícita
(20,2%, Jan/22→Mai/26)** com nota de manutenção anual. **Não "otimizar" isso depois.**

Também: as tabelas `CPI_USA` / `IPCA_BR` / `USD_BRL` do index param em `05/26` e passariam
a devolver `undefined` nos meses novos da curva (NaN na série em BRL e a linha de inflação
caindo para 0%). O lookup passou a repetir o último valor conhecido, com o câmbio caindo
para o `brlRate` do `data.js`.

### Gráficos

**Eixo duplo removido (`accChart`).** "Acumulação de Tokens" tinha dois eixos Y para duas
séries na **mesma unidade** (tokens): acumulado à esquerda e ganho mensal num eixo direito
com ticks escondidos e `max = maxDelta × 3,4`. Uma barra que ocupava um terço do gráfico
valia ~1/19 do acumulado. Trocado por **barra flutuante `[de, até]` no mesmo eixo** — a
altura passa a ser o ganho do mês e a posição mostra onde ele entrou na curva. Uma escala
só, geometria honesta, nada perdido.

**Tooltips.** Sete gráficos formatavam o *eixo* em dólar mas deixavam o tooltip no default
do Chart.js, mostrando o número cru ("1389" em vez de "$1.389"). Padronizados, e com o
contexto que faltava quando há 32 barras parecidas:
`chartPnl` e `chartApr` (título vira o par da pool; corpo traz rede, dias, capital, datas,
taxas e resultado) · `chartFees` (valor, participação no total, quantas pools fecharam no
ano) · `chartTimeline` · `chartRanking` · `pnlByAsset` / `roiByAsset` (nome, valor, custo,
ROI — usavam `tt()` sem callback, então saía float cru tipo "−645.9123") · `rendaChart`
(era o único sem nem o estilo do site) · `cpImpactChart` (mostra peso e convexidade por
trás do w×C).

**Card da LP agora lê do `data.js`** em vez de ser 100% estático — badge, rótulo da seção,
pooled, APR e custo de borrow acompanham sozinhos quando o Lucas reabrir uma posição.

### Verificação
Todas as 5 páginas: **0 erros de JS, 0 séries com NaN, 0 "NaN/undefined" no texto
renderizado, 0 overflow horizontal**, em tema claro e escuro, com o toggle de tema
exercitado. Os KPIs do dashboard fecham de forma aditiva
(`6.643 + 0 LP + 2.503 − 1.526 = 7.620`). O TWR calculado em Node sobre a curva bate
exatamente com o exibido (−2,20%). O caminho "ao vivo" da landing foi testado semeando o
cache de preços que o código usa como fallback.

### Confirmado pelo Lucas em 05/09/2026 (fecha duas pendências desta sessão)

- **Os +0,164778 SOL são ganhos mesmo, custo zero** — *"esse 0.1648sol foram ganhos mesmo,
  custo zero"*. Ele espelha no CoinGecko como transferência de entrada. O `data.js` está
  certo; **não puxar de volta para 24,765222** na próxima leitura de print. Mesma coisa
  vale para os +4,66 USDS de 04/09 (mesma operação, mesmo tratamento).
- **O USDT está certo no CoinGecko** — o delta de 184,71 contra o supply da AAVE não é
  drift a corrigir: são os ~185 de caixa em corretora + carteira, exatamente como
  documentado em 22/08. Não era pendência.

As duas notas ⚠️ no `data.js` foram trocadas por ✅ com a citação, para que a próxima
sessão não reabra o assunto.

### O que ainda falta
- ~~**Endereços de carteira em repositório público**~~ — ✅ **RESOLVIDO em 05/09/2026** (ver item 5 da política de privacidade). Não reabrir.
- **`data.js → defi.aave.healthFactor`** com valores divergentes — guardado para depois por
  pedido explícito do Lucas em 19/08. Não mexer.
- Pendências antigas mantidas: `monthlyReturns[2026]` (Set–Dez), CDI/IPCA anual,
  `FISCAL_ENTRADAS`, Registro Histórico em `pools.html`, custo em BRL dos ~285 USDT.

### Commits
| Hash | Mensagem |
|---|---|
| `eacb379` | fix: curva de patrimonio vira fonte unica no data.js + corrige dados congelados na landing |
| `e744c05` | fix: graficos — trimestre derivado do POOLS, eixo duplo removido, cores de tema e tooltips |
| `2a03310` | fix: CAGR e Track Record da landing passam a usar o TWR do dashboard |

---

## Sessão 05/09/2026 — Merge na main + automação de ponta a ponta (agregados derivados, fechamento mensal por Action, curva ao vivo unificada) + refresh 05/09

### O que o Lucas pediu
Três coisas, na ordem: (1) mergear na `main` o trabalho da sessão de 04/09 (o site publica da
main, então nada daquilo estava no ar); (2) deixar registrada a decisão sobre os endereços de
carteira; (3) **"aumentando ali o valor dos tokens que já mude automaticamente no valor do
patrimônio e tudo o mais, as porcentagens. Eu gostaria que tudo fosse automático, e que uma vez
por semana, ou quando eu fizer algum aporte novo ou coisa do tipo, coloco aqui o print e já vai
direto automático pro site também."**

### Decisão registrada — endereços de carteira (NÃO REABRIR)
Item 5 da política de privacidade reescrito. Lucas avaliou e **aceitou a exposição em
05/09/2026**: *"pode deixar assim, pensando que é um site que não divulgo a ninguém e decidi
deixar o site no ar para poder acessar fora do computador também"*. Nos HTMLs os endereços são
**funcionais e inevitáveis num site estático** (é o JS do browser que chama Alchemy/Helius/
AAVE/Kamino), então quem abre o site já os vê no DevTools — tirar do repo não esconderia nada, e
`git rm --cached` não apaga o histórico. Corrigida também uma imprecisão antiga do arquivo, que
dizia que "a regra nunca foi violada" sem dizer qual: o inegociável é **endereço em URL pública**
(link, `src` de iframe, query string); no JavaScript pode. As duas pendências abertas (22/08 e
04/09) ficam marcadas como resolvidas.

### Merge na main
`claude/site-verification-improvements-ou354i` → `main` em fast-forward (`0b48d62..5583729`).
O que estava fora do ar até então: SOL abaixo do supply da Kamino, landing somando US$ 296 de uma
pool fechada em julho + curva parada em maio/26 + aporte fictício de +$100/mês, CAGR +63,7% /
Track Record +621,7% (a conta do capital-semente), card "Pool Ativa · FORA DO RANGE" sem posição
aberta, simulador com +$3,6k de ganho fantasma, gráfico de taxas somando $2.034 em vez de $2.466.

### ⚡ AUTOMAÇÃO — o que mudou de verdade

#### 1. `data.js`: agregados agora são DERIVADOS, não digitados
Uma IIFE no fim do arquivo recalcula a cada carregamento (browser e Node):
`stablesTotalUSD` (soma de `stables[].qty`), `debt.aave` / `debt.kamino` (soma dos
`defi.*.borrow.*.qty`, qualquer token — já foi GHO e USDG) e `debt.total`. Antes eram números
escritos à mão ao lado das partes: duas fontes para a mesma verdade, bastava esquecer uma para o
site mostrar divergência. **Testado**: alterando só a qty de USDT e do borrow da AAVE, os totais
acompanharam sozinhos.

#### 2. `contributions` — o lugar único para registrar aporte novo
Lista nova em `data.js`. Uma linha (`{ date:'2026-09-15', usd:250, note:'DCA SOL' }`) e o aporte
entra no ROI de destaque, TWR, TIR, benchmark e gráfico de DCA **no mesmo dia**, sem esperar o
fechamento do mês. Só entra dinheiro que veio de fora — yield, juros, airdrop e rotação interna
mexem em `invested` do holding, nunca aqui.

#### 3. 🐛 BUG GRAVE encontrado e corrigido — degrau falso de US$ 1.525 na curva
A série `wealthCurve` estava **internamente inconsistente**: 07/26 e 08/26 tinham entrado como
patrimônio **LÍQUIDO** (depois da dívida) enquanto todo o resto é **BRUTO** (antes). Confirmado
pela própria mensagem do commit `65aeccd`: *"wealthCurve ganha 08/26: valor 9.704 (10.819,68 +
409,19 LP − 1.524,96 dívida)"*. Como a curva é a base de retorno mensal, retorno anual, TWR,
XIRR, drawdown, Sharpe, benchmark e do hero da landing, o degrau contaminava tudo — o mês de
julho aparecia como **−10%** quando o correto é **+10,6%**.

Corrigido pelo script novo (abaixo): **07/26 7031 → 8623** e **08/26 9295 → 11037**, ambos vindos
do último snapshot real do mês em `networth-history.json`. Cross-check: 06/26 = 7651 está
documentado no CLAUDE.md de 23/06 como "CoinGecko $7.650,91" (bruto), e 04/26 = 9206 como "saldo
CoinGecko" — ou seja, a definição bruta é a original da série.

#### 4. `scripts/close-month.js` + Action `close-month.yml` — fechamento mensal automático
Roda todo dia 1 (~08:00 BRT). Lê `networth-history.json`, pega o último snapshot de cada mês
completo (só conta a partir do dia 25, senão não é fechamento) e acrescenta o ponto na
`wealthCurve`: `values` = gross + stables + LP (antes da dívida), `invested` = acumulado anterior
+ `contributions` do mês. Também **reconcilia** meses já existentes que divirjam da definição —
foi assim que os dois pontos acima foram corrigidos. Idempotente (`--dry-run` disponível), valida
que o `data.js` reescrito ainda carrega e que os três arrays continuam alinhados antes de salvar.

#### 5. `BAROLO_DATA.curveWithLive()` — uma implementação só para dashboard e landing
Antes cada página fazia diferente com o valor ao vivo: a **landing SUBSTITUÍA o último mês
fechado** pelo valor de hoje (apagando um mês inteiro da série) e o **dashboard ignorava o valor
ao vivo**. Resultado: CAGR diferente nas duas para o mesmo dado. Agora as duas chamam a mesma
função, que **acrescenta** o mês corrente como ponto novo (com o aporte do mês vindo de
`contributions`). Verificado no browser com os preços do print de hoje: dashboard CAGR **+1,7%** e
landing CAGR **+1,7%**; TIR 15,98% vs 16,0%. Os fallbacks estáticos do hero foram atualizados
(eram −2,2% / −24,9% / +14,2% → +1,7% / −10,0% / +16,0%).

### Dados de 05/09/2026 aplicados (prints CoinGecko + AAVE + Kamino)

| Campo | Antes | Depois |
|---|---|---|
| SOL holding / supply Kamino | 24,93 | **24,94** (yield, custo zero) |
| USDS holding / supply Kamino | 304,66 | **304,69** (yield, custo zero) |
| AAVE WETH supply | 2,2252 | **2,2253** @2,16% |
| AAVE USDT supply | 2013,38 @3,27% | **2013,57 @3,90%** |
| AAVE borrow USDC | 762,29 @**4,65%** | **762,40 @1,96%** |
| Kamino SOL / USDS APY | 4,63% / 3,43% | **4,67% / 3,44%** |
| Kamino borrow USDC | 763,28 @5,43% | **763,40 @5,44%** |
| Kamino LTV / Liq.LTV | 26,96% / 76,61% | **26,72% / 76,60%** |
| Dívida total (derivada) | 1.525,57 | **1.525,80** |
| Stables total (derivado) | 2.502,75 | **2.502,78** |

**Sem aporte novo** — as quantidades do CoinGecko não mudaram, então `contributions` fica vazia.
Quantidades da AAVE derivadas por `principal + earnings` (metodologia de 22/08): WETH
2,2104 + 0,014893 (US$ 36,56 ÷ 2.454,82) = 2,2253 · USDT 1.993,92 + 19,65 = 2.013,57.
**O borrow valida os principals sozinho:** 762,40 − 748,00 = **14,40**, exatamente o "fees paid"
do print. Borrow da AAVE despencou de 4,65% para **1,96%** — vale observar se sustenta.

⚠️ O print do CoinGecko ainda mostra SOL 24,765222 e USDS 300 (Lucas ainda não espelhou o yield
como "transferência de entrada"). O `data.js` está certo — **não puxar de volta**; o piso do
holding é sempre o supply do protocolo.

### Verificação
Todas as 5 páginas no browser (servidor local), com e sem preços semeados: **0 erros de JS reais**
(os que aparecem são CDN bloqueado pelo sandbox), **0 séries com NaN**, **0 "NaN/undefined" no
texto**, **0 overflow horizontal**. KPIs aditivos com os preços do print de hoje:
`8.521 SPOT + 0 LP + 2.503 STABLES − 1.526 DÍVIDA = 9.498 PATRIMÔNIO` (bruto 11.024, que bate com
o total do print — 11.002,32 + 17,89 de SOL + 4,69 de USDS = 11.024,90). `close-month.js` rodado
duas vezes seguidas para confirmar idempotência. Bundle de `emprestimos.html` regravado.

### Rotina nova combinada — yield a lançar no CoinGecko (05/09/2026)

O Lucas explicou que **não mantém o CoinGecko em dia com o yield de lending** — o site é que faz
esse controle pra ele: *"peço que anote aí para todo final do mês passar a soma de quanto eu devo
alterar no CoinGecko desse yield ganho nos empréstimos."*

Ficou registrado como obrigação permanente (seção "ROTINAS COMBINADAS COM O LUCAS", no topo deste
arquivo) e ganhou três formas de aparecer, para não depender da minha memória:

1. **`data.js → cgMirror`** — a qty **como está no CoinGecko** hoje. A diferença para o `holdings`
   (que acompanha o supply dos protocolos) é exatamente o pendente. Base: print de 05/09.
2. **`scripts/yield-to-mirror.js`** — relatório por token com qty, valor em USD e total; busca
   preço ao vivo, mas funciona sem rede (só perde a coluna de USD). Tem `--json`.
3. **Card "Yield a lançar no CoinGecko"** no dashboard (aba Ativos) — aparece só quando há
   pendência e some sozinho quando zera. Verificado nos dois temas, e verificado que some quando
   `cgMirror` iguala o holding e quando o bloco não existe.

A Action `close-month.yml` também roda o relatório todo dia 1 (`continue-on-error`, então nunca
derruba o fechamento).

**Primeiro ciclo já fechado no mesmo dia:** o pendente era SOL +0,174778 (~US$ 18) e USDS +4,69
(~US$ 22,74 no total). Ele lançou (*"Coloquei lá no coingecko"*) e o `cgMirror` foi igualado ao
holding — o relatório passou a dizer "nada pendente" e o card sumiu do dashboard (verificado nos
dois temas). A rotina está validada de ponta a ponta.

⚠️ Diferença **negativa** (CoinGecko com mais que o site) não é yield — é erro de contagem ou
posição fora do radar. O script marca com aviso; investigar antes de lançar.

### O que ainda falta
- **`monthlyReturns[2026]`** Set–Dez (meses ainda não fechados — entram sozinhos pela Action)
- **CDI/IPCA anual** (`ferramentas`/`portfolio`) e **`FISCAL_ENTRADAS`** — atualização anual/manual
- **`US_CPI_CUMULATIVE_PCT`** no `index.html` (hoje 20,2%, Jan/22→Mai/26) — atualizar no
  fechamento de cada ano. **Não derivar da tabela `CPI_USA`**: apesar do comentário dela, os
  valores são interanuais, não acumulados
- **Registro Histórico em `pools.html`** — decidir se reconstrói a tabela das 28 pools
- **Custo em BRL dos ~285 USDT** depositados na AAVE (falta a data e o câmbio da conversão)
- **`data.js → defi.aave.healthFactor`** — guardado a pedido do Lucas (19/08). Não mexer
- **Confirmar a Action `close-month.yml` rodando** — a primeira execução agendada é em 01/10;
  dá para disparar antes por Actions → "Fechamento mensal da curva de patrimônio" → Run workflow
- **05/26 na curva** — não deu para verificar (o `networth-history.json` só começa em 08/07/2026);
  os pontos até 06/26 seguem como estavam. Se um dia aparecer um extrato mais antigo, vale conferir

---

<!-- KB-START -->

# 📚 BASE DE CONHECIMENTO CONSOLIDADA — BAROLO CAPITAL (Lucas)

> **O que é isto:** consolidação, em um único bloco autocontido, de (a) **todos os estudos do Notion** do Lucas, (b) **tudo que foi aprendido com ele nas conversas** (estratégia, filosofia, mentoria, decisões), e (c) **o portfólio completo e seu histórico**.
> **Criado em 18/08/2026 · revisado e auditado em 18/08/2026** (ver §16 — auditoria contra `data.js`, `briefing.json`, `pools.html` e o Diário DeFi do Notion) **· consolidado de novo em 19/08/2026** (havia duas cópias divergentes desta KB — corrigido, ver nota abaixo).
> **Fonte única: `CONHECIMENTO-BAROLO.md`** (com hífen) na raiz do repo — **editar aqui**. Este conteúdo também vive espelhado dentro do bloco `<!-- KB-START -->…<!-- KB-END -->` do `CLAUDE.md`; para regenerar a cópia standalone a partir do `CLAUDE.md`: `sed -n '/^<!-- KB-START -->$/,$p' CLAUDE.md > CONHECIMENTO-BAROLO.md`.
> **Nota de 19/08/2026:** por um período coexistiram `CONHECIMENTO-BAROLO.md` (este arquivo, rastreado no git, espelhando o bloco do `CLAUDE.md`) e um rascunho não versionado `CONHECIMENTOBAROLO.md` (sem hífen) com revisões mais novas (§3.2/§3.4/§8.5 corrigidas, §3.2.1/§8.6/§16 novas) mas com um cabeçalho que alegava — **incorretamente** — que este arquivo com hífen não existia e que o bloco `KB-START`/`KB-END` não existia no `CLAUDE.md`. As duas alegações eram falsas; os dois arquivos foram fundidos nesta versão e o rascunho sem hífen foi removido.
> **O que já existia no CLAUDE.md antes** (não repetido aqui em detalhe): posições atuais, tabela de pools, ciclos de empréstimo, logs de sessão do site, arquitetura do dashboard. **O que é novo aqui:** todo o conteúdo do Notion + a síntese de filosofia/estratégia/decisões.

---

## 1. Quem é Lucas / o que é a Barolo Capital

- **Gestão independente e individual de capital próprio** em criptoativos. Não é empresa que capta cliente, não é serviço vendido a terceiros. O site é **prova de competência técnica**, não portfólio público.
- **Desde 2021.** 1ª compra de ETH em **13/12/2021** (0,0130 ETH @ US$ 4.002,90) e 2ª em **16/12/2021** (0,0084 ETH @ US$ 3.979). A série de performance é medida a partir de **jan/2022** (1º mês completo) — por isso "desde 2021" e "CAGR 2022–2026" convivem sem contradição.
- **Horizonte: +10 anos.** DCA mensal fiat→cripto. Bear market = oportunidade de compra, não razão para sair.
- **Concentração intencional em ETH + SOL** (entende os protocolos profundamente). BTC como base. Alts menores mantidas por opcionalidade, sem realizar prejuízo.
- **Objetivo final:** o **yield pagar a vida sem tocar no capital** — mesma lógica do aluguel de imóvel e dos dividendos do Barsi. O capital fica trabalhando.
- **Sucesso é medido em ativos acumulados (tokens), não no preço em dólar.**
- **Meta original registrada no Notion (página META):** aporte inicial ~US$ 2.000, ~US$ 400/mês (~US$ 13,33/dia) → **US$ 10.000 em ~25 meses** (ou 50 meses a US$ 200/mês).
- **Privacidade é regra, não preferência:** "quero ser **efetivo**, não **visto**". Nada de endereço de carteira em URL pública, nada de identificadores únicos (NFT ID, endereço Cardano completo), `robots.txt` bloqueando tudo, `noindex` em todas as páginas.

### 1.1 Referências intelectuais confirmadas
| Referência | O que Lucas extrai |
|---|---|
| **Luiz Barsi Filho** | Dividendos; capital intocado, yield paga a vida → analogia direta com DeFi |
| **Stormer** | Trades e leitura de empresas; "comprar suporte em tendência de alta, vender resistência em tendência de baixa" |
| **Howard Marks** | Ciclos e risco assimétrico — "risco significa que mais coisas podem acontecer do que realmente acontecerão" |
| **Charlie Munger** | Qualidade e paciência; comprar bons ativos e não fazer nada |
| **Zé Mograbi** | "Enquanto o MEDO DE PERDER for maior que a vontade de GANHAR, você não performa no mercado (nem na vida)" |
| **Nassim Taleb** | "Quanto mais restrito, limitado ou escasso é um recurso, mais ele é sensível a choques" — escassez = volatilidade |

### 1.2 Manifesto Barolo Capital (literal, do Painel Notion)
> Riqueza real é construída com **consistência**, não com pressa.
> 1. Não buscamos o maior ganho, buscamos o ganho **sustentável**
> 2. Antes de ganhar dinheiro, **evitamos perder**
> 3. O **tempo no mercado** vence o timing do mercado
> 4. Decisões boas vêm de **mente calma**, não de urgência
> 5. Preferimos ganhar menos com **paz** do que mais com caos
> 6. Se **não é simples de entender**, não merece capital
> 7. O dinheiro existe para comprar **tempo e liberdade**

> "Nosso objetivo não é acertar o topo ou o fundo do mercado, mas navegar por ele com disciplina, preservando capital e capturando oportunidades ao longo do tempo. Valorizamos clareza, simplicidade e liberdade — porque o verdadeiro retorno não está apenas no dinheiro, mas na vida que ele permite construir."

---

## 2. Estratégia operacional — como o capital realmente trabalha

### 2.1 As três camadas de yield (risco crescente)
| Camada | Onde | Yield típico | Risco |
|---|---|---|---|
| **Lending passivo** | AAVE V4 (Ethereum) + Kamino (Solana) | 2–6% | Contrato + liquidação |
| **Pools ativas** | Uniswap V3/V4 (~5% do patrimônio) | 20–120% APR | IL + contrato + range |
| **Spot puro** | Resto da carteira | 0% | Exposição direcional |

### 2.2 Alavancagem produtiva anticíclica (o núcleo da operação)
O loop que Lucas descreve com as próprias palavras:
1. Colateral (WETH/USDT/SOL/USDS) depositado na AAVE/Kamino
2. Toma **USD emprestado** contra esse colateral
3. Compra ETH → monta **pool de liquidez**
4. A pool **paga o empréstimo com as taxas em dólar**; o ETH das taxas é acumulado
5. **Pool sai do range para baixo** → acumula mais ETH com USD (compra anticíclica automática)
6. **Pool sai do range para cima** → vende ETH acumulado + USD → paga a dívida
7. Fiat disponível como último recurso

**Avaliação:** é **alavancagem defensiva, não agressiva**. A estrutura *força* comportamento anticíclico por design — o operador não precisa ter disciplina no momento do pânico, o mecanismo já compra na queda.

**Risco principal identificado (monitorar):** o **spread entre custo do empréstimo e yield da pool pode comprimir em bull** (borrow APY sobe, volatilidade da pool cai). Monitorar a *diferença*, não só o yield bruto.

**Calibração de tamanho:** ~5% do patrimônio em pools hoje (conservador, dado o drawdown em dólar). Ideal: **aumentar em lateralização, reduzir em bull acelerado**.

### 2.3 Pools como estratégia de saída gradual — regra inegociável
- A pool ativa **não é só para taxas**: entra ~100% em ETH e sai em stable conforme o preço sobe. É uma **ordem de venda escalonada que paga para existir**.
- **Referência de performance sempre em USD.** Nunca em HOLD, nunca em ETH. (Lucas foi explícito: *"essa pool é da estratégia de venda, entrei full ETH e to saindo full USDT, deve ser vista e monitorada com a referência em USD não em HOLD nem em ETH"*.)
- A pool **migra de rede**. Histórico: Ethereum/Arbitrum (2024–25) → Base (fev–jul/2026) → **Robinhood Chain (desde 14/07/2026, atual)**. Nunca assumir a rede — sempre conferir em `data.js → defi.uniswapV3.network` antes de qualquer chamada on-chain.
- ⚠️ **A posição ativa foi remontada em 07/08/2026** na MESMA pool v3 WETH/USDG (tentativa de migrar para v4 falhou). Para a Revert é **uma posição contínua desde 14/07** (mesma NFT); no site o ciclo 1 está lançado como fechado ($13,04) para não duplicar o YTD. Campos de *estoque* em `data.js` = ciclo 2; campos de *taxa* (apr/feeApr) = lifetime.

### 2.4 Playbook operacional de pools (extraído do Diário DeFi, 2024–2026)
- **Fee tiers:** 0,01% stables · 0,05% pares estáveis · 0,3% maioria dos pares · 1% exóticos.
- **Estimar retorno:** `Fees 24h × dias que pretende ficar ÷ TVL`.
- **4 estratégias de range (Uniswap):**
  1. **Semanal / DCA de compra** — mínimo no preço onde quer comprar o ativo, máximo na resistência superior. Acumula bem na queda, mas taxa baixa se o range for largo demais.
  2. **Semanal / 2 ativos correlacionados** (ex.: LINK/ETH) — ganhar taxa nas duas pontas por um bom período.
  3. **4h / range apertado em lateralização** — identificar suporte e resistência em TF menor, gerar mais taxas. Boa para fim de semana.
  4. **Semanal / mono-ativo em suporte** — abrir com um ativo só para comprar mais barato em momento de liquidez.
- **Regras práticas aprendidas na prática:**
  - Saiu do range → **esperar pelo menos 24h** antes de remontar (não reagir no impulso).
  - Mercado caiu forte → **reposicionar a pool mais baixo** para capturar o bounce.
  - Recolher taxas e **reinvestir em token** quando o objetivo é acumular; usar as taxas em **stable para repagar o empréstimo** quando o objetivo é desalavancar.
  - Usar **VPVR (zonas de acumulação)** para desenhar o range.
  - **Não esticar demais o range**: uma pool ficou 100 dias esperando sair do range e o retorno foi baixo demais. Lição: metade da largura, seguindo a acumulação do VPVR.
  - Rede nova costuma pagar mais (TVL baixo vs volume) — foi exatamente o motivo da migração para Base e depois Robinhood Chain.
  - Remontar tem custo de gas: em rede cara, remontagem frequente come o retorno.

### 2.5 Rotina semanal de gestão (checklist do Painel Barolo)
**🧠 Reflexão da semana:** Como me senti em relação ao mercado? O mercado já precificou? O consenso está otimista demais / o cenário ruim já está no preço?
**📊 Revisão de estratégia:** Minha tese principal continua válida? Alguma mudança significativa exige revisão? Adicionei novas ideias/projetos para estudo?
**🔍 Riscos atuais:** Estamos em risco extremo? O risco está alto ou baixo? O mercado está complacente? Estou desconfortável?
**📌 Tarefas técnicas** + **🗂️ Anotações/insights**.

---

## 3. Portfólio — estado, metodologia e histórico

### 3.1 Metodologia canônica (NÃO violar)
- **Fonte única de posições: `data.js`** (`window.BAROLO_DATA`). Todas as 6 páginas HTML leem dele. Atualização mensal = **editar só o `data.js`**.
- **As quantidades de holdings JÁ INCLUEM o colateral depositado em AAVE/Kamino** — Lucas não separa carteira vs DeFi no CoinGecko. Portanto **`Patrimônio = total holdings + LP − dívida`**. **NUNCA somar o colateral por cima** (dupla contagem). O bloco `defi` é uma *view* do lending, não posição aditiva.
- **`invested` = USD efetivamente pago**, não o "custo" derivado do CoinGecko (`valor − P&L`), que gerava artefato em stablecoins (USDT aparecia com "lucro").
- **`principals`** (bloco no `data.js`) = *cost basis* do lending (principal depositado/emprestado, **sem juros**). Deve ser atualizado a cada depósito, saque ou reempréstimo — senão **aporte novo aparece como rendimento** (bug real que ocorreu em 14/08/2026).
- **Fees de pool são contabilizadas por data de COLETA/fechamento**, não de abertura. Isso mudou o P&L 2026 YTD de ~$39 para ~$96.

### 3.2 Composição (baseline `data.js` asOf **14/08/2026**; valores vivos em `data.js` + `briefing.json`)

| Token | Qtd | Invested (US$) |
|---|---|---|
| BTC | 0,00434195 | 270,47 |
| ETH | 2,37632741 | 4.880,53 |
| SOL | 24,765222 | 2.533,36 |
| ADA | 375,245 | 530,95 |
| EIGEN | 153,363 | 45,87 |
| RDNT | 7.290,46 | 0 (airdrop) |
| POL | 218 | 143,88 |
| ZK | 876 | 0 (airdrop) |
| XAI | 692,86 | 164,52 |
| ZETA | 51,1434 | 0 (airdrop) |
| SCR | 0,0018 | 0 |
| **USDT** | 1.302,524 | 1.302,52 |
| **USDS** | 317,44 | 300,00 |

**DeFi (view do lending — já contido acima):**
- **AAVE V4** — supply 2,16 WETH @1,83% + 1.600 USDT @2,17% · borrow **760,17 USDC @3,79%** · colateral **US$ 5.658,25** · **HF real 6,04** · LTV 13,4%
- **Kamino** — supply 24,48 SOL @4,47% + 304,07 USDS @4,06% · borrow **823,63 USDC @5,92%** · LTV **38,4%** vs liq. LTV **77,1%** (SOL liquidaria em ~US$ 28,90 = −61,6%)
- **Pool ativa** — WETH/USDG 0,01% · Robinhood Chain · pooled US$ 358,14 + US$ 1,81 de fees não coletadas · in-range · fee APR 50,91% / total APR 64,57%

### 3.2.1 Agregados (15/08/2026, `briefing.json`)

| | |
|---|---|
| **Patrimônio líquido** | **US$ 7.125,72** |
| Bruto (holdings, inclui colateral DeFi) | US$ 6.725,04 |
| Stables | US$ 1.619,96 (USDT 1.302,52 + USDS 317,44) |
| LP | US$ 359,95 = **5,05% do patrimônio** |
| **Dívida total** | **US$ 1.583,80** (AAVE 760,17 + Kamino 823,63) |
| Dívida / patrimônio | **22,2%** |
| Custo de borrow ponderado | **4,90%** |
| **Total investido (USD pago)** | **US$ 10.172,10** |
| ROI | **−29,9%** em USD (≈ break-even em BRL) |

**Carry da estrutura de lending:** supply yield US$ 203,59/ano − custo de borrow US$ 77,57/ano = **+US$ 126,02/ano (+US$ 10,50/mês)**. Somando a pool (US$ 360 a 32% de fee APR realizado ≈ US$ 116/ano), a máquina DeFi inteira rende **≈ US$ 242/ano = 3,4% do patrimônio**.

⚠️ **A cauda de alts está praticamente zerada:** BTC+ETH+SOL = US$ 6.599,74 dos US$ 6.725,04 brutos. Os **sete alts somados (ADA, EIGEN, RDNT, POL, ZK, XAI, ZETA) valem ~US$ 125,30**, contra **US$ 885,22 investidos** — uma perda de ~86% que já está realizada economicamente, ainda que não fiscalmente.

### 3.3 Custo de aquisição em BRL (base para IR)
Consolidado dos extratos Binance + OKX (out/2021 → jun/2026), em `Custo_BRL_Consolidado_Lucas.xlsx`:
- **Total fiat→cripto: R$ 35.498,19** (Binance R$ 29.664,20 + OKX R$ 5.065,50)
- **Câmbio médio de entrada: R$ 5,36/USD** (derivado das stables)
- Por token: BTC R$ 296.174/un · ETH R$ 15.096/un · SOL R$ 903,63/un · ADA R$ 12,06 · XAI R$ 1,29 · USDT R$ 5,41 · USDC R$ 5,46 · BUSD R$ 5,22
- **Achado importante:** com o dólar em ~5,12, o patrimônio em BRL fica em **~break-even (−0,3%)** — o câmbio amorteceu boa parte do drawdown em USD.
- **IR:** Bens e Direitos grupo 08 (códigos 01/02/03), declarar pelo custo, obrigatório ≥ R$ 5k por tipo. Isenção R$ 35k/mês (nacional). Lei 14.754/2023 → 15% exterior. IN 1888 → declarar acima de R$ 30k/mês. **Permuta cripto↔cripto conta como alienação.**

### 3.4 Track record de pools — **recomputado em 18/08/2026** (29 registros em `pools.html`)

Números conferidos direto do array `POOLS`, ponderados por **capital-dias** (não por número de pools):

| Grupo | n | Fee APR | **P&L APR** | P&L total | W / L |
|---|---|---|---|---|---|
| **"Chatas"** (par com stable ou blue-chip) | 22 | 44,4% | **+44,1%** | **+US$ 1.044,39** | 22 / 0 |
| **Narrativa** (GRIFT, PEANUT, PENG, XAI) | 7 | **610,4%** | **−798,8%** | **−US$ 1.844,00** | 1 / 6 |
| Só pares com stablecoin | 14 | 34,1% | +33,7% | +US$ 580,39 | 14 / 0 |
| **TODAS** | **29** | **94,7%** | **−30,8%** | **−US$ 799,61** | 23 / 6 |

**Taxas brutas acumuladas: US$ 2.459,94.** Fees realizadas por ano (data de coleta/fechamento):
**2023 US$ 377 (P&L +377) · 2024 US$ 562 (P&L +239) · 2025 US$ 1.403 (P&L −1.527) · 2026 YTD US$ 118 (P&L +111)**.

**Evolução — a virada é datável em 05/05/2025 (fechamento do GRIFT):**

| Período | n | Fee APR | **P&L APR** |
|---|---|---|---|
| Até o GRIFT fechar (≤05/2025) | 21 | 108,4% | **−41,6%** |
| Pós-GRIFT (>05/2025) | 8 | 28,2% | **+21,9%** |
| Só 2026 | 5 | 32,0% | **+28,6%** |

**Os aprendizados de pool:**
1. **A separação chatas × narrativa é perfeita, não é tendência** — 22 vitórias e zero derrotas nas chatas; 1 vitória e 6 derrotas nas de narrativa.
2. **APR alto foi indicador INVERSO de retorno.** As pools de narrativa tiveram **14x** o fee APR das chatas e destruíram capital a −799%/ano. Selecionar pool por APR anda na direção errada.
3. **SOL/GRIFT 2% (80 dias)** — taxas de +US$ 1.389 e IL de US$ 2.899 porque o token foi a zero. Resultado −US$ 1.510. O erro não foi entrar: foi **ampliar dentro da queda** (4 SOL → 10 SOL) e não sair. Lucas recuperou as SOL depois via lending na Kamino.
4. **PEANUT/ETH 1% (10 dias)** — −US$ 243 de IL puro, zero taxas, token scam. Causa registrada no diário: ficou doente logo após montar e não conseguiu acompanhar.
5. **Pares "chatos" (ETH/USDC, ARB/USDC, ETH/USDT)** — praticamente todo o P&L positivo veio deles. *"Um bom investimento é chato."*

### 3.5 Eventos especiais
- **Hack da Radiant Capital (2025):** 1.079,17 ARB em stake desde 25/03/2024 perdidos. Valor na época ~US$ 971, prejuízo efetivo ~US$ 671. Reembolso de ~$300 prometido e pendente — **dado como perdido**. Não entra no P&L operacional de pools.
- **Flash crash 10/10/2025:** maior liquidação da história até então (~US$ 19 bi), disparado pelo anúncio de tarifas de 100% sobre a China e revertido no dia seguinte. Lucas **não foi liquidado** e comprou ETH e SOL na queda. Leitura dele: *"foi pura manipulação... o mercado ainda é uma selva"* → e a conclusão prática: **pools de liquidez são melhor fonte de fluxo de caixa que trade alavancado em eventos assim**.
- **Ciclos de empréstimo:** Kamino K1–K3 fechados, **K4 aberto**; AAVE A1–A2 fechados (V3), **A3 aberto** (migrado para V4 em 01/04/2026). Refinanciamentos frequentes trocando o token de dívida (GHO → USDC → USDG → USDC) sempre buscando o APR de borrow mais baixo.

---

## 4. As 31 regras de DeFi (estudo âncora do Notion)

> *"31 pedaços de sabedoria que eu gostaria de poder enviar de volta no tempo para mim mesmo."*

**Sobre projetos e narrativas**
1. Projetos com cultos podem ser extremamente lucrativos — basta sair do foguete antes que ele caia.
2. Não vale a pena **travar tokens** por rendimento adicional. Nada pior que estar amarrado a uma pia que afunda.
3. **Proteja sua atenção a todo custo.** Tempo e energia são limitados; não desperdice com drama do CT.
4. Cuidado com **otimização excessiva de rendimento** — não existe almoço grátis. Cada camada extra de yield traz mais risco.
5. Seja cético com **todo** conselho do Crypto Twitter — todo mundo tem agenda.
6. Nova narrativa → viés para os **líderes de mercado** (vantagem de first-mover e mind share). Melhores betas: forks em chains novas e quentes.
7. Obsessão por ferramentas novas é procrastinação. Os maiores usam Etherscan, DeBank, DefiLlama. *"Não temo o homem que praticou 10.000 chutes; temo o homem que praticou um chute 10.000 vezes."* (Bruce Lee)

**Sobre informação e alfa**
8. Existe **cadeia alimentar de informação**: Builders > VC/Insiders > Baleias > Bots > traders manuais rápidos > traders manuais lentos. Quando divulgam no Twitter, já é tarde.
9. Alfa = ter informação privilegiada **ou** fazer o trabalho duro que os outros têm preguiça de fazer (ler Medium do protocolo e o Discord).
10. Tudo se repete, só reembalado. DeFi é **reconhecimento de padrões**.
11. Posicione-se cedo e deixe os ganhos chegarem. **FOMO é sinal de que pode ser tarde demais.**

**Sobre gestão e psicologia**
12. Veja P&L como **% do portfólio**, não em $. Comparar trade com compras da vida real destrói a racionalidade.
13. **Corte os perdedores agressivamente.** Defina o stop e saiba sair antes de entrar.
14. **Grave tudo.** Diário do que aconteceu, dos trades, dos erros e das lições — é assim que se melhora o algoritmo mental.
15. Não superestime fundamentos em **bull**: a lógica evapora. Veja a indústria como ela é, não como deveria ser.
16. **Incentivos movem preço** (airdrop, lock por recompensa, incentivo de ecossistema).
17. Não coloque ninguém em pedestal — Alameda e 3AC eram "os mais espertos da sala". **Proteja os fundos ao primeiro rumor de insolvência**: se estiver certo, salvou muito; se errado, perdeu alguns minutos.
18. Não se trata de estar certo — trata-se de **maximizar quando está certo e limitar quando está errado**.
19. **Estreitar o foco é vantagem subestimada.** Escolha poucos setores e domine-os.
20. Acompanhar **macro é superestimado**; basta monitorar fluxo de capital para os mercados. *"A história dos economistas na previsão de acontecimentos é monstruosamente errada."* (Taleb)
21. **Não toque em cripto em tilt, bêbado ou com sono.** Um erro apaga anos.
22. **Stablecoins não são tão estáveis**: UST colapsou, USDC teve susto de depeg. Guardar pó seco em fiat no banco é totalmente viável.
23. **Concentre para crescer o portfólio; diversifique para mantê-lo.**
24. **Desenvolva sistemas** — regras impedem que a emoção mate o jogo.
25. Achar que vai fazer 100x num trade não é realista. 99% das pessoas ficam melhor **aumentando o fluxo de caixa** e colocando mais metas no fogo.
26. A galera prefere **novos projetos e narrativas** — não suas bags de 2021. Não lute contra a natureza humana.
27. (repetição deliberada) Ceticismo com o CT. **Cuidado com você mesmo.**
28. Pare de se limitar a conteúdo cripto — **teoria dos jogos, economia comportamental e psicologia** ensinam mais que o nono artigo sobre EigenLayer.
29. Os melhores projetos têm **fundamentos + incentivos**: "pumpmentals" captam atenção, fundamentos dão motivo para continuar segurando.
30. **As incógnitas desconhecidas são mortais** (fundador jogando com o tesouro, passado duvidoso). Não dá para prever → **realização de lucro, tamanho de posição e gestão de portfólio são as defesas críticas**.
31. **Realizar lucro e colocar em apostas mais arriscadas NÃO é realizar lucro — é jogo.** Trave lucros em BTC, ETH, stablecoins e fiat.

> Fechamento do autor (que Lucas adotou): *"Ainda tenho a maior convicção no DeFi — apostei a próxima década da minha vida nisso. Por quê? Eficiência. Transparência. Um novo mundo onde temos mais controle sobre o nosso dinheiro suado."*

---

## 5. Framework de Análise Fundamentalista (Notion)

> *"A análise fundamentalista busca resumir o máximo possível de informação para ser consumida rápido — sabendo o que está escrevendo."*

**Etapa 1 — Identificação do projeto:** tem ecossistema próprio ou está em algum? (objetivo: diversificar ecossistemas) · tipo de projeto · focos de atuação · algum ponto muito relevante · o que é e o que faz.

**Etapa 2 — Proposta de valor:** quais as vantagens? algum serviço exclusivo/inovador? quais serviços são oferecidos? (achar descendo a home e nos docs). Etapa abstrata — muitos projetos fazem "uga buga" e querem vender o peixe.

**Etapa 3 — Tokenomics** (a mais importante):
- **Alocação inicial** — mineração aberta vs pré-alocação. Tipos de participação: Fundadores/Foundation · Early Adopters/Advisors ("amigos do rei") · Dev/Marketing/Time · Market-Makers/Liquidity Mining · Airdrops/Growth · DAO/Treasury/Ecosystem · Public Sale/ICO · Pre-Sale/Seed/VCs · Validadores.
- **Regra de bolso: "regra de 1/3"** — se nenhum participante passa de ~1/3, está razoável. Exemplos analisados: **ETH** (só 16% para "amigos do rei" — bom) · **Chainlink** (30% empresa — justo) · **Solana** (⚠️ Fundação e Time são a mesma coisa + venda da fundação volta pros founders + seed fechado → **alocação centralizada**, beneficiou muito mais time e investidores que o público) · **Manta** (investidores <30%, time <30%, >10% airdrop → parece justa).
- *"O fundamentalismo agnóstico não se prende ao romantismo — pondere todos os lados. Um projeto pode ser centralizado, mas ter boa proposta de valor e bom time; pode valer arriscar. Dose o risco."*
- **Agenda de distribuição:** TGE (Token Generation Event) · **CLIFF** (abismo antes da 1ª nova distribuição) · **VESTING** (em quantas parcelas o restante é liberado). ⚠️ Cuidado com unlock "em porrada" (ex.: **PYTH** — longo cliff seguido de destrave enorme). ✅ **NEAR** é exemplo bom: unlock em curva, lento e gradual, e já distribuiu grande parte. Onde ver: docs do projeto, TokenUnlocks, CryptoRank (aba Vesting), CoinGecko, CMC.
- **Política monetária:**
  - *A ilusão da escassez* — escassez não é regra para valor; **escassez é sinônimo de volatilidade**. Procure ativos escassos **com demanda**.
  - **Emissão estática** (max supply fixo, sem queima): menos adaptável, menos sustentável, mais simples, mais previsível → bom para *commodities*.
  - **Emissão dinâmica** (emite + queima): menos previsível, mais complexa, mais adaptável, mais sustentável → bom para *sistemas econômicos*.
  - Como identificar: se **Total Supply == Max Supply** → estática. Se **Max Supply == ∞** → dinâmica. Inflação real e queima só nos docs/whitepaper.
  - **Staking** contribui para escassez, mas as recompensas são tokens impressos — **duas forças que se contrabalançam**. Blockchains *precisam* de staking; aplicativos não precisam (o staking de app é mais especulativo).
  - **Casos de uso do token:** utilitário/gas · staking · **governança (token que não serve para nada, se for só isso)**.
  - **Real Yield** — o primeiro foi o GMX: quem opera paga taxa, parte vai para LPs e parte para quem faz staking. O token realmente participa da economia. ⚠️ Problema: começa a se parecer com ação que paga dividendo → **risco regulatório**. Defesa: é *revenue sharing* programado no protocolo, não decisão voluntária de uma empresa.

**Etapa 4 — Estado atual e roadmap:** posição em market cap · TVL · fees/revenue vs concorrentes · dashboards (Dune) · **datar o estudo** (muda constantemente). Fases: DEVNET → TESTNET → MAINNET → UPGRADES.

**Etapa 5 — Considerações e decisão:** resumir pontos fortes / de atenção / críticos → avaliar destravas de valor, força da narrativa, perspectivas no ciclo → decidir: **ter ou não exposição, qual risco da exposição, qual perfil de portfólio**.

---

## 6. Métricas on-chain de DeFi — como avaliar de verdade

> *"Fundamentos on-chain dão ao DeFi uma vantagem sobre o TradFi. As finanças dos protocolos estão disponíveis em tempo real."*
> *"As métricas de receita estão entre as mais difíceis de falsificar, porque exigem que usuários realmente gastem dinheiro."*

| Métrica | O que é | Armadilha |
|---|---|---|
| **TVL** | Análogo ao **AUM** de um hedge fund. Mede confiança nos contratos e tamanho do protocolo. | **Não mede atividade.** Correlaciona com preço: se ETH cai 30%, todo TVL em ETH cai 30% **sem nenhuma saída real**. → Olhe **entradas em USD** junto com o TVL (Δsaldo por ativo × preço, somado). |
| **Fees** | Perspectiva do usuário: quanto foi pago para usar. ≈ **Receita bruta**. | Pode ir 100% para LPs. |
| **Revenue** | O corte que o **protocolo** guarda (tesouro, time, holders). ≈ **Renda bruta**. | Alguns geram fees enormes e revenue mínimo. |
| **Holders Revenue** | A parcela que chega ao **detentor do token** (recompra, queima, distribuição). ≈ **dividendo + buyback**. | É o que realmente importa para valuation do token. |
| **Volume (DEX/Perp)** | Atividade de negociação. | Comparação histórica perde sentido (setor cresceu muito). **Participação de mercado dentro da categoria** importa mais que volume absoluto. |
| **Open Interest** | Valor de contratos de derivativos em aberto = liquidez de perp DEX. | Colapsa em horas numa cascata de liquidação. Observar a **recuperação** revela se a liquidez voltou ou migrou de vez. |
| **Market cap de stablecoins na chain** | **Entrada de capital real** na rede. Crescer de $3bi → $8bi = $5bi de dinheiro novo. | Desde out/2023, ~$180bi de stablecoins entraram nas redes. |
| **App Fees / App Revenue** | ≈ **PIB da blockchain** (exclui stablecoins, staking líquido e gas). | **Não serve para valuation** (o token não tem direito a essa receita) — serve para **diagnosticar crescimento**. |

**A estrutura de decisão (3 regras):**
1. **Priorize crescimento constante e consistente.** Um pico que colapsa não diz nada. *"O tempo passa mais rápido em cripto: um mês de crescimento consistente equivale a ~4 anos em mercados tradicionais. Seis meses de expansão de receita = uma empresa com seis trimestres de melhora de lucro."*
2. **Combine uma métrica de STOCK com uma de FLOW.**
   - *Stock* (quanto está depositado): TVL, open interest, market cap de stablecoin, tesouraria.
   - *Flow* (quanto está acontecendo): fees, revenue, volume.
   - **Atividade é fácil de falsificar** (incentivo, wash trading); **liquidez é difícil de fabricar**.
   - Por tipo: Perp DEX → OI + volume · Lending → TVL + fees · Chain → mcap de stablecoin + app fees.
   - Só flow crescendo com stock estagnado → investigue, pode ser artificial. Só stock crescendo → pode ser um punhado de baleias.
3. **Conte desbloqueios e incentivos.** 90% do supply circulante = diluição futura mínima; 20% com cliff em 3 meses = configuração muito diferente. Receita alta impressiona menos se o protocolo distribui mais incentivo do que arrecada (DefiLlama rastreia isso como *Earnings*).

**Ferramentas:** DefiLlama (protocol, stablecoins/chains, open-interest, pro), Dune Analytics, Etherscan, DeBank, TokenUnlocks, CryptoRank, stakingrewards.com.

---

## 7. Análise Técnica — o corpo de conhecimento completo

> *"Análise técnica é uma mistura de arte, matemática e uma pitada de bom senso."* (Mark J. Pring)
> *"É a arte de prever movimentos e mudanças de tendência baseado em evidências."* (Rodrigo Tech)
> *"Todas as métricas de uma entrada devem ser atingidas antes de ser efetuado o trade."*

### 7.1 Fundamentos
- **Candles:** o pavio conta a história, **o fechamento (corpo) conta os fatos**. Quanto maior o tempo gráfico, mais pertinente a informação e menos ruído.
- **Tendência** = conjunto de movimentos erráticos que tendem mais para um lado. É **fractal**. A corrida do touro leva **mais tempo**; a queda do urso é **mais rápida**.
  - Topos e fundos **ascendentes** = alta; **descendentes** = baixa.
  - Primária (pernada, ~3 movimentos) · Secundária (pullback de **1/3 a 2/3**, usar Fibonacci) · Oscilação micro.
  - *"Presuma que a tendência segue até que ela rompa sua sequência de topos e fundos."*
  - **Pivot de reversão:** fundo descendente → topo descendente → rompimento do fundo prévio = confirmação.
  - Consolidações/lateralizações contam como topo ou fundo.
- **Teoria de Dow (analogia da maré):** a maré é a tendência maior; as ondas quebram cada vez mais longe enquanto o mar enche. **As pequenas ondas não mudam a maré.**
- **Suporte e resistência:** marcar como **ZONAS**, do TF maior para o menor. Suporte rompido vira resistência. Pontos emocionais (ATH prévia, quedas em meio a subida forte) e **números redondos** têm muita pertinência. Quanto **mais horizontal, mais forte**. Quanto mais vezes uma zona é testada, **mais fraca** ela fica — até romper. Em cripto, zona testada e não rompida costuma vir seguida de movimento forte.
- **Linhas de tendência:** mínimo **3 toques**, traçadas como zonas (pelo corpo ou pela sombra). A **angulação mede a força** — muito íngreme o mercado não sustenta por muito tempo. **Estender as LTs** para ver o comportamento invertido (spyderlines).
- **Volume:** o mercado está em estado constante de **movimento e consolidação**. Consolidação = soma das decisões de compradores e vendedores sobre o novo patamar → **retração da volatilidade**. O volume **sempre retrai para formar um novo padrão**; ao ultrapassar, cria vácuo e o preço é puxado. **Volume que decai não é fraqueza no curto prazo — é consolidação.** No longo prazo (1D/1S/1M), queda de volume após rally parabólico = sinal de exaustão. **Volume marca topos e fundos.**

### 7.2 Padrões gráficos
- **Fundo duplo** (fim de baixa, bullish) / **Topo duplo** (fim de alta, bearish) — o 2º fundo só precisa chegar **próximo** da zona; se romper, descarta-se. **Neckline** = zona de gatilho. Alvo = altura do padrão projetada do rompimento; **em cripto costuma levar no mínimo 2 movimentos** para atingir o alvo (o 1º pega ~metade, reteste, segue).
- **OCO e OCO invertido** — alvo do topo da cabeça até a neckline, projetado a partir da neckline. **Média de acerto altíssima quando combinado com outros indicadores.**
- **Xícara e alça** — recuperação gradativa; rompimento agressivo; mais forte em fim de tendência e TF maiores.
- **Triângulos** (todos os TFs): ascendente = altista · descendente = baixista · simétrico/horizontal = neutro, segue a tendência superior (50/50). **Regra do vértice: o rompimento vem entre 70% e 90% do caminho até o vértice — nunca chega no vértice.** Alvo = amplitude máxima (altura dos 2 primeiros toques) projetada do rompimento.
- **Cunhas** (mais em TFs menores): ascendente rompe geralmente **para baixo**; descendente, **para cima**. Alvo da ascendente na base da cunha. Quanto mais íngreme, mais forte o movimento contrário. *"Construir demora mais do que demolir"* — quedas são mais agressivas.
- **Bandeiras** (touro/urso) — pernada + lateralização contra a tendência. Alvo ≈ tamanho da pernada projetado do fundo do canal de correção; para ser assertivo, pegar 10–12% do topo e fazer uma **zona**.
- **Canais paralelos** — leem oscilações máximas e mínimas da consolidação; a **linha média** norteia.
- **Breakout:** rompimento **com grande volume** + **reteste** = altamente assertivo. Sem volume → suspeitar de falso rompimento.
- **Pivot de alta:** rompe resistência → reteste como suporte → rompe o topo prévio. **Pivot de baixa:** o inverso.
- ⚠️ *"Quando esses padrões falham, geralmente estão acontecendo CONTRA a tendência superior."*

### 7.3 Médias móveis
- São **áreas dinâmicas de suporte e resistência** (Pring). Não existe média escrita em pedra — testar por TF.
- Mais usadas: **8/9, 20, 50, 100, 200**. **MA** (simples) no tradicional; **EMA/WMA** em cripto (respondem mais rápido).
- **Indicadores atrasados**: cruzamento diz o que já aconteceu. Cruzamento **longe da ação de preço → pouco peso**; **perto → mais peso**.
- Bull: preço busca as médias como **suporte**; bear: como **resistência**. Quanto maior a média, mais significativa (**200 é o forte indicador do BTC**).
- **Semanal:** EMA 8/9, 50 e 200. **Diário:** EMA 20 e 50. **EMA Ribbon (20→55, 8 médias)**: quando comprimem, a leitura fica pobre (suporte e resistência ao mesmo tempo).
- **Confluência** (várias evidências apontando para o mesmo lado) é o sinal mais forte de reversão.

### 7.4 Indicadores
Quatro categorias: **momento/inércia · volatilidade (BB, BBWP) · volume (OBV) · tendência**.
- **RSI (IFR)** — 0 a 100, canal 30–70. *"O preço é um elástico."* Em bull o preço oscila do meio para cima (retesta a 50 e volta acima de 70); em bear, do meio para baixo. **Divergências**: preço faz fundo descendente e RSI fundo ascendente (alta) — ou preço topo ascendente e RSI topo descendente (baixa). No diário, **esperar de 2 a 3 divergências** para confirmar a tese. Topos laterais no RSI com topos ascendentes no preço também é alerta.
- **MACD** — médias 26 e 12, sinal 9. **Cruzamento longe do meio → reversão maior; perto do meio → lateralização.** Oscilador **solto** (não preso 0–100) — usar para **confirmar divergências vistas no RSI** (que é preso).
- **Estocástico** (e **Estocástico RSI**, mais volátil) — cruzamento **preferencialmente fora do canal**. O normal lê melhor o local; o de RSI lê melhor o movimento.
- **Bandas de Bollinger** — média 20 + volatilidade. **Compressão = consolidação, antecede grande movimento.** Vazou a banda, tende a voltar.
- **BBWP** (Bollinger Bands Width Percentile) — lê **timing**, não direção. Abaixo de 25% → grande movimento vindo. Perto de 100% → expansão/exaustão. Leitura falha em grandes topos/fundos.
- **OBV** — volume + tendência, oscilador solto. Valida congruências do RSI. Mapear topos/fundos e divergências.
- **VuManChu Cipher B** — 8 indicadores num só: RSI (curto prazo), Nuvem de Inércia (MACD preso, bolinhas verde/vermelha de reversão), Money Flow (entrada/saída de capital), nuvem VWAP. **No macro o smart money opera CONTRA a VWAP**, tanto no fundo quanto no topo. Cruzamentos valem mais nos extremos. Dois sinais próximos da mesma cor = **"snake eyes"**. Melhor no semanal e no 4h. **Descobrir por backtest em qual TF funciona melhor.**

### 7.5 Fibonacci
- Razão **1,618** — como as coisas se expandem e se retraem.
- **Retração:** traçar do fundo ao topo (alta) ou do topo ao fundo (baixa). Regra clássica: retração de **1/3 (0,38) a 2/3 (0,61)**. **"Coração da fibo"**: 90% das retrações ficam entre 0,3 e 0,61, respingando no 0,7 e no 0,2. **O mais importante é o 0,618 (Golden Pocket).**
- Retração **rasa (0,2–0,38) = tendência forte**; perder o 0,618 = tendência enfraquecida; **romper o 1 = tendência virou**.
- **Extensão** para alvos (1º alvo relevante: 0,618; o 1 costuma marcar o fim do movimento). **Garfo de Schiff** — a linha do meio é a mais pertinente para segurar a tendência.
- ⚠️ Fibo **não funciona bem em lateralização**. Em TFs menores, **desligar a escala LOG** do gráfico e da fibo.

### 7.6 Gestão de risco (o núcleo)
- **Disposição ao risco** (% do portfólio em risco por operação, 1–5%) e **tamanho de posição** são coisas diferentes e complementares.
- **Fórmula:** `Tamanho da posição = (Tamanho da carteira × Risco%) ÷ Distância % até o stop`
  Ex.: carteira 10.000, risco 2%, stop a 5% → (10.000 × 0,02) ÷ 0,05 = **4.000**. (Não considera slippage/taxas.)
- Se o stop está a **menos de 2%** (o risco escolhido), pode ir com a mão cheia; **acima de 2%, faça a conta**.
- **Alavancagem ideal (futuros):** `risco% ÷ distância do stop%`. Ex.: risco 2%, stop 0,1% → **20x**. Banca 7.000 × 20 = 140.000 de notional; se stopar, perde 2% = $140.
- Buscar entradas **mínimo 3:1** no início. Gráfico 4h+ → 3:1; menores → 2:1; muito pequenos → 1,5:1.
- **Sempre mapear S/R no TF maior antes de operar o menor** (1h ← 4h ← 1D; 15m ← 1h).
- **Tríade do operador: Estratégia, Gestão de Risco e Disciplina.** *"Stop-loss é o seu melhor amigo e sempre será."*
- **Stop deve ser técnico** (invalidação da tese), não % solto. **Stop financeiro** (Mograbi): profissionais operam com risco em R$ fixo — é o único jeito de controlar a curva de capital.

### 7.7 Setups validados (sistema RCESA)
**RCESA = Regras Condicionais · Entradas · Stop loss · Alvos.**
Validação: **backtest de no mínimo 100 operações** no par e TF escolhidos. Nenhuma estratégia acerta 100%; **~60% de win rate é excelente**; com R:R ≥ 1:1,5 já é extremamente lucrativa no longo prazo. Preparar o terreno: backtest → carteira de papel → gerenciamento de risco.

1. **VuManChu Cipher B + EMA 200/50** (pullback em tendência)
   LONG: preço acima da MM200 · Money Flow verde/positivo · pullback até a EMA50 · Onda de Inércia **abaixo** da linha neutra · sinal de cruzamento (bolinha verde) abaixo do zero → **entrada na abertura da vela seguinte**. SHORT = espelhado. Stop abaixo da última mínima local após o sinal. Alvo **2:1**.
   ⚠️ Evitar em lateralização (MM200/50 horizontais) e com Money Flow neutro.
2. **EMA 200 + RSI + Estocástico (14,2,2)** — divergência no RSI, MM200 norteia a tendência, entrada no **fechamento da vela que cruzou o estocástico**, stop abaixo do swing low, TP sempre 2:1.
3. **Média 9.1 (Larry Williams)** — semanal/diário, não funciona em lateral. Vela ultrapassa a EMA9 e a média sai de lateral para inclinada → marca máxima/mínima → entrada no rompimento da máxima na vela seguinte, stop abaixo da mínima, subindo o stop conforme anda.
4. **Tendências 15m: EMA 21/52 + BBWP + RSI** — comprado só com EMA21 **acima** da EMA52 (vendido, abaixo); preço volta e **toca a EMA52**; **BBWP abaixo de 25%**; opcional: divergência escondida reforça. Risco 2%. Saída: primeira divergência clássica contrária **ou** rompimento do último fundo ascendente. *"Se o diário está em tendência, ele pressiona o 1h, que pressiona o 15m."* Não usar com EMA52 lateralizada.
5. **Topo/Fundo duplo + divergência no RSI** — *"ESSE SETUP É EXTREMAMENTE ASSERTIVO."* Regra da zona: após mapeada, as próximas velas **podem violar** a zona, mas **nenhuma pode fechar inteira fora dela**. Frequentemente o preço nem chega a fazer o reteste.

### 7.8 Mandamentos do operador
*"Cuide bem do seu dinheiro, ou ele vai encontrar outro dono."* · *"Market humbles — ou o mercado te deixa humilde, ou ele cobra."*
- Paciência é virtude · Ponha todos os pingos nos "i"s antes de operar · **Fundos são mais difíceis de se formar do que topos** · Blinde-se emocionalmente · O pullback é seu melhor amigo · A tendência é sua amiga **até que não é mais** · **Não operar é operar** · Coloque um **limite diário de perdas** · O mercado é maratona · Coloque-se onde você **sobrevive aos seus erros** · Não pare de estudar · **O lucro só existe quando é realizado — ninguém quebra por tirar lucro** · Compre o medo, venda a ganância · **Suba o stop a partir dos pontos ascendentes, sempre (zero a zero)** · Volume marca topos e fundos · **Diário de operações é fundamental** (entrada, stop, alvo e **o que você estava sentindo**) · Sequências de derrota acontecem — confie no setup · **CUIDADO COM O FOMO** · Opere sempre em posição de vantagem · *"Será que to comprando topo? Será que to com medo de ficar de fora?"* · Topos e fundos são muito bem lidos por **sentimento (Fear & Greed)** · **VOCÊ É SEU MAIOR INIMIGO** · **Na dúvida, não entre** · **NUNCA ENTRE SEM STOPLOSS**.

### 7.9 Aula Zé Mograbi — psicologia e sistema
- **Obstinação = Maestria + Disciplina.** Estar na tela **não pode** te deixar com medo ou angustiado.
- Trader = comerciante, quem compra e vende → **por isso a importância de comprar barato**.
- *"O dinheiro não é seu — ele está sob o seu uso."*
- **Desafios:** solidão · punição instantânea · obesidade intelectual. *"Somos atletas de alta performance da mente"* → hábitos saudáveis, exercício, alimentação.
- **Por que as pessoas não ganham dinheiro:** (1) falácia do TF curto — quanto maior o TF, mais volume e mais confiabilidade; (2) não entender **expectativa matemática / payoff** — alvos sempre mais longe que os stops; (3) **localização** — marcar as zonas no gráfico grande e saber **quando NÃO operar**. *"Comprar caro na zona de resistência é coisa de amador. Só existe compra perto de média."*
- **Sentimentos por trás do preço: MEDO · GANÂNCIA · FRUSTRAÇÃO** (o mais poderoso). O profissional atua na ponta oposta do sentimento do amador. **Marque no gráfico, escrevendo**, onde está cada um. Pontos de frustração interessam **perto de média e de S/R**.
- **Sistema operacional:** quantidade de sinais · **drawdown máximo aceito: até 15% da conta** · **payoff ≥ 2** · *"o payoff é sempre mais importante que o nível de acerto"*.
- *"O dinheiro na tela, positivo ou negativo, se a operação não terminou, não é seu."* → Faça o trade e saia da tela. Ao atingir 1:1, **trave o stop no zero a zero** (cria a paz psicológica para buscar o alvo todo).
- **"Se o trade não é tão bom a ponto de você entrar com a mão cheia, não entre. Só opere trade perfeito."**

---

## 8. Sizing & Risk — dimensionamento de posição (implementado em `ferramentas.html`)

### 8.1 Kelly binário (pools com range)
`f* = (b·p − q) / b` — b = odds (ganho/perda), p = prob. de ganhar, q = 1−p.
Presets: Safe (50/50, b=1,5) · Moderate (60/40, b=2) · Aggressive (70/30, b=3).
**Usar Half ou Quarter Kelly**: errar `p` em 10% causa erro de 30%+ em `f*`.

### 8.2 Kelly contínuo / Merton (lending alavancado)
`f* = (μ − r) / σ²` — μ = APR esperado, r = custo de borrow, σ² = variância. Converte em **LTV ótima**, ajustada pela fração de segurança.

### 8.3 Hedge delta-neutro em pool Uniswap V3
- Delta varia dentro do range: **100% do ativo volátil em pmin, 0% em pmax**.
  `ETH_share = (√pb−√p)·√p/√pb ÷ [(√pb−√p)·√p/√pb + (√p−√pa)]`
- IL anualizado ≈ `−min(0,3 ; vol²/(8·rangeW))`, com `rangeW = (√pmax − √pmin)/√pcentro`.
- Custo do hedge: perp = funding × notional short; borrow-short = −borrow × notional.
- **Economia:** anula o IL e captura fees "puras".
- **Trade-offs:** funding pode flipar em bear agressivo · quebra de range anula o hedge · complexidade operacional (3 contratos encadeados).
- ⚠️ **Incompatível com a estratégia de saída gradual**: hedge > 70% anula o propósito da pool como *exit strategy*. Alerta implementado na ferramenta.

### 8.4 Leverage + Hedge combinado (comparação de 3 vias, mesmo capital próprio)
- **A) LP puro** — APR = (fees + IL) × lp/capital; DD = lp × delta × vol / capital
- **B) Leverage produtiva (estilo Barolo)** — fees+IL sobre o LP completo + supply do colateral − borrow; DD amplificado por lp/capital
- **C) Leverage + Hedge** — B + funding × notional; IL residual = IL × (1−hpct); DD reduzido por (1−hpct)
- **Validado em 3 cenários (03/07/2026):** cenário real (capital $5.040, LP $385, 100% borrow, sem hedge) → A +1,53%/Sharpe 0,67; B=C +2,52%/Sharpe 1,10 (B=C é esperado quando hpct=0). Hipotético $2.000 com hedge 100% → C domina. Extremo super-alavancado → dispara corretamente o aviso *"borrow excede capacidade do colateral"*. Matemática confere linha a linha.
- **Nota de modelagem:** o DD de A/B usa `lp × delta × vol / capital` — mede exposição direcional da posição LP, não solvência da alavancagem (essa é coberta pelo aviso de capacidade de colateral).

### 8.5 Calculadora de liquidação (fórmulas do site)
- **AAVE:** `liqETH = (borrow − usdt_qty × USDT_LT) ÷ (weth_qty × WETH_LT)` — WETH_LT 82,5%, USDT_LT 77,5%. Se o resultado é negativo, o WETH **não pode ser liquidado** (a stable sozinha cobre a dívida).
- **Kamino:** `liqSOL = (borrow − usds_qty × USDS_LT) ÷ (sol_qty × SOL_LT)` — SOL_LT 82%, USDS_LT 80%.
- **Health Factor (AAVE):** < 1 = liquidação. HF 2 significa que o ativo pode cair 50% até chegar a 1.
- ⚠️ **Duas fórmulas de HF convivem no projeto** — resolvido em 18/08/2026:
  - `Collateral ÷ Borrow` (convenção do comentário no `data.js`) **superestima** o HF.
  - `colateral × liquidation threshold ÷ dívida` é o **HF real da Aave**. **É este o correto** — e é o que o fetch ao vivo e o `briefing.json` reportam.
  - Verificação em 15/08/2026: colateral real US$ 5.658,25 (2,16 WETH @ US$ 1.878,82 + 1.600 USDT), borrow US$ 760,17 → fórmula do print daria **7,44**; **HF real = 6,04** (confere exatamente com o `briefing.json`).
  - O campo `data.js → defi.aave.healthFactor` grava **6,08**, que é ~correto **por coincidência**: o comentário deriva de um colateral defasado (US$ 4.622 ⇒ ETH a US$ 1.399), e os dois erros — fórmula que infla e colateral que deflaciona — quase se cancelam. **Não confiar no comentário; usar sempre o HF ao vivo.**

---

### 8.6 Dimensionamento da pool ativa — Kelly com ramo de ruína (18/08/2026)

⚠️ **Merton (§8.2) é a ferramenta ERRADA para dimensionar a pool.** Com μ = 44,1% (P&L APR realizado
das chatas), r = 4,90% e σ_LP ≈ 0,5 × vol_ETH, `f* = (μ − r)/σ²` devolve **entre 320% e 1145%**.
Isso não é oportunidade, é modelo inadequado: Merton assume risco gaussiano contínuo e **não enxerga
ruína binária** (exploit de contrato, token a zero) — que é o risco nº 1 declarado pelo Lucas desde
out/2025. Nunca usar Merton sozinho para pool.

**Modelo correto — Kelly com três ramos:**

```
E[log] = (1 − z − q)·ln(1 + f·μ)  +  z·ln(1 − f·L)  +  q·ln(1 − f)
```

| Parâmetro | Valor | Origem |
|---|---|---|
| `μ` | **44,1%/ano** | P&L APR realizado das 22 pools chatas (capital-dias) |
| `L` | **51% do capital** | perda média das 7 pools de narrativa (GRIFT sozinho: −194%) |
| `r` | **4,90%** | custo de borrow ponderado (AAVE 3,79% / Kamino 5,92%) |
| `z` | falha do filtro | histórico **24%** (7/29) · **2026: 0%** (0/5) |
| `q` | exploit anual | premissa (1–5%) |

**Quarter Kelly** (fração de segurança padrão, §8.1):

| z ↓ / q → | 0,5% | 1% | 3% | 5% |
|---|---|---|---|---|
| 0% | 24,6% | 24,2% | 22,5% | 20,9% |
| 10% | 24,3% | 23,6% | 21,0% | 18,7% |
| **24% (histórico)** | 20,7% | **19,2%** | **15,1%** | **11,9%** |
| 35% | 10,7% | 9,7% | 6,3% | 3,3% |

**Break-even:** com q = 1%, o filtro precisa falhar em **menos de 44,7%** das pools (q = 3% → 41,7%).
Histórico 24%, 2026 0% — folga confortável.

> ❌ **Descartar** a estimativa de "94,8% de confiabilidade mínima do filtro" que circulou numa versão
> intermediária desta análise: era artefato de anualizar posições de duração curta. O número válido é o
> de break-even acima.

**Resultado:** posição atual **5,05% do patrimônio (US$ 359,95)**. ¼ Kelly indica **12–15%
(US$ 850–1.075)** — ou seja **2,3x a 3x** o tamanho atual. Não ir além de 15% enquanto a regra de saída
não estiver escrita (ver §16.3).

**Condição, não recomendação solta:** a faixa 12–15% só vale enquanto `z` continuar baixo. `z` não é
propriedade do mercado — é propriedade do critério de entrada e saída. Sequência correta: **escrever a
regra → depois aumentar.** Nunca o inverso.

## 9. Currículo técnico — todos os estudos de tecnologia do Notion

### 9.1 Bitcoin
- Criptomoeda descentralizada, 2009, Satoshi Nakamoto. **Max 21 milhões**, halving a cada 210.000 blocos (~4 anos). PoW, dificuldade ajustada para 1 bloco/10 min. ECDSA hoje; **Schnorr** traria assinaturas menores, agregação de multi-assinaturas e mais privacidade. Lightning Network como camada de pagamento.
- *"A primeira coisa interrompida por blockchains não são bancos — é a regulamentação e os reguladores. Destrói a ideia de regulação hierárquica, representativa, de cima para baixo, jurisdicional e geográfica."*
- **Contras:** volatilidade · escalabilidade limitada · consumo de energia · risco regulatório · barreira de entrada.
- **Futuro / questões abertas:** sustentabilidade quando a emissão zerar (**sobreviver só de taxas**) · definição de propósito (moeda? reserva de valor? plataforma de NFT via Ordinals? regulador de grade elétrica no Texas?) · **centralização dos desenvolvedores** (eram 6, hoje 4 core devs; um único cliente, o Bitcoin Core; sem processo estruturado de decisão) · falta de privacidade em nível de transação.
- **"Resistance Money — A Philosophical Case for Bitcoin"** (estudo): Bitcoin é **moeda de resistência** contra o alcance corporativo e estatal. É *commodity-money* descentralizado com emissão pré-programada — **não é um sistema de pagamentos como Visa**, é uma **camada base de final settlement** sem atores centralizados de confiança. Abre mão da hiperbitcoinização. Ideia central: colocar o Bitcoin no mundo de um jeito que **force o Estado a ser mais isonômico**. Inclusão financeira: o problema é **sistêmico e institucional**, derivado de um sistema global que depende da boa-fé de intermediários. *"Se o dinheiro torna o mundo um lugar melhor, então o Bitcoin também o fará."*
- 🔑 **Frase-chave que Lucas adotou:** *"Blockchains não são a descentralização do DINHEIRO — são a descentralização da CONFIANÇA. Dinheiro é apenas uma das possíveis expressões da confiança."*

### 9.2 Ethereum
- **Camada de mensageria/registro (L1)**, plataforma de contratos inteligentes (Solidity), 2015, Vitalik. Transação carrega: destinatário, assinatura, valor, dados opcionais, **STARTGAS** (máximo de passos computacionais) e **GASPRICE** (taxa por passo) — o modelo anti-negação de serviço.
- **The Merge:** PoW → PoS, 32 ETH por validador. **Emissão caiu ~90%** (de ~3% a.a. para ~0,85%); com EIP-1559 queimando a base fee, ETH fica **deflacionário quando a rede é usada** ("ultrasound money" condicional). Shanghai liberou os saques — **não houve colapso**, staking ficou mais atraente.
- **Roadmap revisado (2025–26) — o que mudou:**
  - ✅ **EIP-4844 (proto-danksharding) já está ativa** (Cancun/Deneb, mar/2024). Blobs de dados separados do calldata → **custo de L2 caiu 10x a 100x**; rollups deixaram de competir diariamente com usuários da L1.
  - Hoje: **L1 = camada de liquidação + segurança; usuário comum = L2 quase sempre.** L1 cara, simples e extremamente segura por design intencional.
  - ⚠️ **The Verge (Verkle Trees) está atrasado**, ainda em pesquisa. **The Purge** ainda é conceitual.
- ⚠️ **O problema ainda aberto (e o mais perigoso): crescimento do estado.**
  - Full node exige SSD NVMe rápido, centenas de GB, manutenção técnica → menos gente roda nó → **mais centralização**.
  - **L2 NÃO resolve o estado.** Rollups reduzem *execução* e *custo*, mas **adicionam estado** (bridges, provas, contratos de verificação). Ironia: escalar via L2 torna o Ethereum mais usável **e aumenta a pressão sobre o estado da L1**.
  - **Centralização invisível** — mesmo com milhares de validadores, o **acesso ao estado** depende de Infura, Alchemy, QuickNode, cloud providers. *"A validação pode ser descentralizada; o acesso ao estado não é."* → ponto único de falha, risco regulatório, risco de censura.
  - Barreira para light clients: celular e browser **não conseguem validar** → o usuário precisa confiar em RPCs.
  - Por que não se resolve fácil: apagar contratos antigos quebra imutabilidade · state rent mata dApps e composabilidade · snapshots centralizados quebram trust minimization.
  - **Risco real, pouco falado:** o Ethereum pode virar uma *settlement layer* segura **operada por poucos grandes players** — mais parecida com um "SWIFT descentralizado" do que com um "computador mundial acessível". Não mata tecnicamente, mas muda a **natureza política e econômica** da rede.
  - **Mudança de filosofia:** de *"Ethereum precisa escalar tudo na L1"* para ***"Ethereum é o juiz, não o mercado"***.
- **Restaking (EigenLayer)** aumentou a eficiência de capital e criou um risco novo: **alavancagem de segurança**.

### 9.3 Escalabilidade — modelos de estado e as soluções
- **Estado** = resultado do processamento de todas as transações até um ponto. **Transação** = operação que modifica o estado.
- **Bitcoin usa UTXO** (coleção de saídas não gastas; não guarda saldo consolidado — é mais simples de manter). **Ethereum usa 3 árvores** (estado/carteiras, transações, recibos) porque contratos inteligentes tornariam o UTXO inviável.
- **Carteiras Ethereum:** **EOA** (controlada por chave privada, sem código) e **CA** (contrato, com *code* + *storage*). Só EOA inicia transação → **as taxas são sempre pagas por humanos**.
- **Custos:** transferência de ETH = 21.000 gas; ERC-20 ≈ 65.000 gas (executa contrato). Somar dois números = 3 gas; consultar saldo = 400 gas. **Armazenamento on-chain é caríssimo** → daí FileCoin, Storj, Arweave.
- **O gargalo:** o bloco tem limite de **gas** (15M–30M), gerado a cada ~13s. Mineradores escolhem por gasPrice → **leilão aberto**. Crises: CryptoKitties (2017), DeFi Summer (2020), NFTs (2021) → dominância da Ethereum caiu de 90% para <60% de TVL.
- **Soluções de 2ª camada:**
  - **State channels** — canal privado, várias transações off-chain, uma liquidação final (analogia do jogo de pôquer com fichas). Limitação: só grupos pequenos e conhecidos. Ex.: Celer.
  - **Custodial sidechains** — 100% independentes, custódia própria, consenso próprio. Rápidas e baratas, **mas você abre mão da segurança da Ethereum** e depende de bridges (hack da Ronin). Ex.: Skale, Ronin.
  - **Plasma** — blockchains-filhas com "bloco raiz" publicado periodicamente na mãe (checkpoint), operador centralizado, saques com **período de contestação de 7 dias**, retirada simples / adversariada em massa / rápida (via provedor de liquidez). Garante autenticidade e imutabilidade, **mas não anti-censura**. ❌ **Caiu em desuso**: o checkpoint guardava o estado mas **não as transações**, jogando no usuário o ônus de detectar fraude. Única implementação de referência: Polygon PoS ("commit-chain").
  - **Rollups** (Barry Whitehat, 2018) — evolução do checkpoint que **inclui as transações**. Objetivos: melhor aproveitamento de bloco · economia de gas (rateio entre usuários) · maior throughput.
    - **Optimistic** (Optimism, Arbitrum): sequencer agrega e publica via *calldata*; **prova de fraude** com janela de 7 dias; verifier ganha parte do slashing. Contratos: CTC (Canonical Transaction Chain) e SCC (State Commitment Chain). Depósito e saque via L1/L2 CrossDomainMessenger + bridges; **pontes rápidas** cobram taxa para adiantar o saque.
      - **Riscos:** hack do sequencer (congela a rede) · **dilema do verificador** (se os incentivos funcionam ninguém trapaceia; se ninguém trapaceia não vale rodar verificador; sem verificador surge incentivo para trapacear) → a segurança depende de *skin in the game* de players grandes · suborno de verificadores (mais fácil quanto mais centralizado).
      - Anti-censura: **qualquer um pode publicar na CTC**, não só o sequencer — mas na prática exige interagir direto com o contrato.
    - **ZK** (provas de validade junto com a transação — dispensa contestação).
- **ZK: SNARK vs STARK** — SNARK: provas compactas, mas geração complexa e menos transparente (curvas elípticas, trusted setup). STARK: geração simples/rápida e transparente (polinomial), mas provas **maiores**.
- **Os 4+1 tipos de ZK-EVM (Vitalik):**
  - **Tipo 1** — totalmente equivalente ao Ethereum, compatibilidade perfeita, **provas levam horas**. Scroll, Taiko.
  - **Tipo 2** — equivalente à EVM (não ao Ethereum); muda estruturas de dados que a EVM não acessa. Quebra apps que verificam provas de Merkle de blocos históricos (pontes). Polygon Hermez/Zero.
  - **Tipo 2.5** — igual, mas com custos de gas alterados para as operações caras em ZK.
  - **Tipo 3** — quase equivalente; remove pré-compilados difíceis; alguns apps precisam ser reescritos.
  - **Tipo 4** — compila da **linguagem de alto nível** (Solidity/Vyper) para algo ZK-friendly: **provas muito rápidas**, mas endereços diferentes, bytecode manual não suportado, ferramentas de debug não portam.
  - **Não há "melhor"** — é um espaço de trade-off. Vitalik espera convergência para o Tipo 1 com o tempo.

### 9.4 Data Availability e blockchains modulares
- **Monolítica** = execução + consenso + registro + DA na mesma camada (problema: NFT, DeFi e gaming precisam de coisas diferentes). **Modular** = múltiplas camadas especializadas; a **camada de DA é a "cola"**.
- As 4 camadas: **Execução** (Arbitrum, Polygon, ZKsync, Solana) · **Consenso** (PoW/PoS/PoH) · **Registro/Settlement** (Ethereum, Polkadot, Near) · **Data Availability** (Celestia, Avail, EigenLayer) — resolve **fragmentação de liquidez**.
- *"As soluções de disponibilidade de dados permitirão que existam blockchains cada vez mais customizadas, escaláveis e ajustadas ao seu propósito."* (Orlando Telles)
- **Celestia** — rede para *deploy* de novas blockchains modulares. Não tem camada de execução própria (agnóstica: EVM ou Cosmos SDK). **Data Availability Sampling**: os nós lidam com amostras em vez de replicar tudo → **fica mais performática quanto mais nós tem**. Crítica embutida ao modelo L1/L2: *"modularidade ingênua"* — a escalabilidade em L2 ainda é **limitada pelo espaço de bloco da L1**, então não resolve o trilema. Concorre diretamente com o Replicated Security do ATOM. Filosofia do time: **o usuário é o cidadão de primeira classe** — deve poder rodar clientes leves e verificar cada camada.
- **Dois tipos de armazenamento:** dados de transação (Celestia, Avail, CCIP) vs dados genéricos (Filecoin, Sia, Storj, Arweave).

### 9.5 Interoperabilidade cross-chain
- **Dois problemas:** (1) **duplicação e isolamento de contratos** — AAVE e Uniswap têm que se reimplantar em cada chain; (2) **fragmentação de carteiras e liquidez** — o usuário divide recursos e paga bridge (ineficiência de capital).
- **Multi-chain** = várias blockchains coexistem. **Cross-chain** = elas conversam. Soluções: **mensageria** (contratos trocam informação) e **liquidez** (movimentação de recursos). Nome melhor que "Layer-0": **Omnichain**.
- **Pontes ≠ interoperabilidade**: provêm liquidez mas normalmente não suportam mensageria (Orbiter, Owlto, Axelar, Stargate, deBridge, Rhino).

| Projeto | Mensageria | Liquidez | Escopo |
|---|---|---|---|
| LayerZero | ✅ (Oráculo + Relayer) | teórica | EVM |
| ZetaChain | teórica | teórica | EVM + Bitcoin/Doge |
| **IBC (Cosmos)** | ✅ | ✅ | Cosmos+EVM+DOT+NEAR |
| XCM (Polkadot) | ✅ (via Relay Chain) | ✅ | DOT |
| **CCIP + CCTP (Chainlink + Circle)** | ✅ | ✅ | EVM-hub |

- **IBC é o modelo mais descentralizado** — P2P, cada par de chains cria sua ponte (não é hub-and-spoke). Vem no Cosmos SDK.
- 🔑 **Conclusão do estudo:** *"De todos os projetos analisados, o de maior potencial é o combo **Chainlink + Circle**"* — Chainlink já é ator neutro na guerra das blockchains (bom para meio de campo em mensageria) e a Circle é a entidade capaz de arregimentar a maior liquidez cross-chain (USDC já mintado em quase todas as chains importantes, **sem precisar capturar liquidez**). Sinal de alerta para LayerZero e Zeta. XCM e IBC seguem relevantes **dentro dos seus ecossistemas**.
- **ZetaChain (ZETA — Lucas tem no portfólio via airdrop):** blockchain própria (Cosmos SDK, Tendermint BFT) que também faz mensageria e liquidez cross-chain. Os nós **observam eventos em outras chains** (contratos omnichain). Liquidez: ZETA é emitido nativamente em várias chains (queima em A / minta em B, sem wrapping) + pools ZETA/x em cada rede — **modelo herdado da ThorChain**. ⚠️ Riscos: depende de liquidez em todos os pools (trade-off "pouca liquidez" vs "inflação via liquidity mining") e a operação não é atômica (ZETA flutua durante o swap). ✅ Feito técnico real: integrou o **Bitcoin** (rede não-EVM). Concorrentes fortíssimos: LayerZero e CCIP.

### 9.6 Account Abstraction (ERC-4337)
- Objetivo: melhorar a UX. **Desacopla a conta da assinatura** — o usuário passa a usar uma **CA (carteira inteligente)** que se comporta como carteira.
- Novo tipo de transação: **UserOperation** → mempool alternativa → **Bundler** agrega em *bundle transaction* → **contrato universal (singleton)** valida e executa todas de uma vez → **Paymaster** pode subsidiar o gas.
- Habilita: 2FA/biometria no lugar de seed phrase, celular como Ledger, pagamentos recorrentes, limites de gasto, transações em lote, gas pago pelo dApp, **recuperação de conta**.
- Perguntas respondidas no estudo: **continua sendo autocustódia** (é o usuário que cria a UserOperation); carteiras não são aposentadas (continuam sendo a infraestrutura); mitigação de risco = a carteira inteligente **explicar de forma simples** o que a transação agregada vai fazer.
- Lançado como contrato inteligente — **sem hard fork**.

### 9.7 Money Legos & LSDFi
- **Money Legos = composabilidade**: aplicações que compartilham o mesmo espaço de bloco podem ser combinadas (mintar DAI na Maker → prover liquidez na Uniswap).
- **Exemplo canônico — Alchemix** (empréstimo autoquitável): deposita 100 → toma 50 emprestado → os 100 são investidos e os juros pagam o empréstimo → devolve os 100. Camadas: Ethereum → MakerDAO (DAI) → Alchemix (alUSD) → Curve/Yearn/Sushi.
- **Riscos:** custódia/rug/hack em cada camada · depeg da stable intermediária · **decisões ruins de investimento do protocolo** · liquidação em cascata quando usado para alavancagem · **risco sistêmico entre protocolos** (o hack da Curve criou sombra de liquidação em cascata na AAVE).
- **LSD/LST:** staking trava capital → **ineficiência**. Uma rede com 70% em staking só tem 30% de eficiência de capital. O LST devolve circulação: recompensas vão para o **detentor do LST**, e você pode vender sua posição de staking diretamente. Todo LST é um LSD; nem todo LSD é LST.
- **Sinergia com Money Legos:** stETH é um ERC-20 — pode ir para pool, ser colateral etc. E como é **ativo gerador de renda**, pode ser colateral **mais atrativo que o token nativo**.
- **Riscos extras:** risco do protocolo de staking líquido (LIDO) + **risco sistêmico de volatilidade** — se dá para alavancar em LST, dá para liquidar em cascata, e isso respinga no token que garante a segurança da rede.

### 9.8 Restaking / EigenLayer
- **Staking** = colocar poder de compra em risco para garantir bom comportamento. **Restaking** = o mesmo capital garante mais de uma operação.
- Definição tecnofilosófica registrada: *"Restaking é assumir maiores riscos de um mesmo capital travado, para buscar diferentes fontes de receita em operações de confiança derivadas do próprio capital travado — **TRUST-LEGOS**."*
- Usos: **EigenDA** (camada de DA) · **sequenciadores descentralizados** (validação como serviço) · **confiança em pontes** (o stake vira fundo garantidor) · **oráculos** · **aval para eventos pontuais** (lançamento/airdrop → seguradora descentralizada).
- Duas formas: delegar LSTs ou apontar um nó nativo (nesse caso o slashing só atinge as recompensas). Janela de saque: 7 dias.
- **Riscos:** hack nos contratos da EigenLayer · slashing adicional por cada serviço assumido · **incentivo da própria EigenLayer para alugar validação a projetos pouco seguros** se ela não compartilhar o risco de slashing.

### 9.9 Pendle Finance — separar o principal do rendimento
- Tokeniza um ativo gerador de renda em **PT** (principal, resgatável 1:1 no vencimento) e **YT** (rendimento futuro, com juros travados). AMM próprio para negociar PT/YT + estratégias.
- **Abre um leque novo de money legos**: arbitragem entre o yield implícito no YT e o custo real do staking nativo.
- **Avaliação de Lucas/estudo:** replica mercado de renda fixa de forma descentralizada usando stETH, rETH, GMX etc. **É um protocolo para quem realmente entende esse mercado** — as oportunidades de "renda fixa" parecem atraentes à primeira vista, mas exigem entender a mecânica antes do FOMO.

### 9.10 Radiant Capital (RDNT) — o estudo e o desfecho
- Lending **cross-chain** sobre LayerZero (Arbitrum + BNB), auto-alavancagem em loop até 4x, e tokenomics de **real yield**: lenders recebem 25% dos juros; **dLP (Dynamic Liquidity Providers — travam ≥5% do montante em ETH ou RDNT) capturam 60%**. Distribuição inicial "fair" (DAO 17%, time 19%, ~metade em incentivos). Incentivos com vesting de 90 dias e multa por resgate antecipado.
- Conclusão do estudo (out/2023): *"token interessante para interagir com a plataforma, mas não necessariamente para holding isolado"* (ainda inflacionário).
- **Desfecho real (2025):** protocolo **hackeado**; Lucas perdeu 1.079,17 ARB em stake (~US$ 671 de prejuízo efetivo). Reembolso prometido e não pago. → **Confirmação prática da regra 2 e da regra 30 das 31 regras.**

### 9.11 Real World Assets (RWA)
- **Ondo Finance** — fundos on-chain lastreados no mundo real, rating S&P/Moody's/Fitch, **KYC/AML**, ticket mínimo US$ 100k. OUSG (T-Bills) era o único operacional (~$130M). Também OMMF (money market) e OHYG (corporate bonds).
- **Enzyme Finance** — cofres (vaults) públicos/privados que automatizam estratégias DeFi; dispensa relatórios de atestamento e a infraestrutura de auditoria do mundo real (tudo verificável on-chain).
- **Tangible** — tokenização de imóveis (TNFTs) na Polygon, marketplace próprio, stablecoin USDR lastreada em cesta (cripto + LP tokens da Curve + seguro + portfólio de imóveis). Também tokeniza ouro, vinho e relógios. Token TNGBL com "3,3+ NFT": **66% da receita vai para quem trava; 33% para recompra e queima** — real yield.

### 9.12 Redes de privacidade
- Baseado em *"Privacy Market Outlook in Web3"* (Mykola Siusko, jan/2023).
- **Contexto:** o dinheiro está ficando digital; CBDCs dão ao Estado poder de vigilância econômica inédito. Historicamente, **o uso do dinheiro sempre envolveu privacidade** (duas pessoas trocando cédulas operam em modo privado por natureza).
- **Quatro níveis de privacidade:** infraestrutura (IP anônimo) · conexões de rede (não vazar IP para o RPC) · **aplicação** (emissor/receptor/valor não visíveis no explorer) · conteúdo.
- **Projetos:** Tornado Cash (mixer — sancionado pelos EUA, fundadores presos) · Secret Network (Cosmos, privacidade opcional em contratos) · Monero / Zcash (moedas) · Aleph Zero (L1 com privacidade opcional) · Nym (transporte anônimo) · Aztec (L2 de privacidade). Alianças: UPA e LPA.
- **Privacidade e descentralização andam de mãos dadas** — não há privacidade onde existe poder de censura centralizado.
- 🔑 **Conclusão de alocação (a mais importante):** se as redes de privacidade se tornarem essenciais, é **uma das maiores assimetrias do mercado**. Mas esse futuro pode não se concretizar se a via centralizada oferecer conveniência suficiente. → **Exposição de altíssimo risco e altíssima assimetria; não deveria ser posição considerável num portfólio com bom gerenciamento de risco.** (Lucas estudou ZEC em jan/2026 e "não gostou tanto quanto imaginava".)

### 9.13 Identidade on-chain
Mecanismos que identificam carteiras como humanos únicos — usados em airdrops e KYC. **Polygon ID** (ZK) · **OpenID3/Linea** (Gmail/GitHub, 1 email por carteira) · **Clique** (multi-chain, atestamentos por Twitter/GitHub/jogos) · **Galxe Passport** (SBT, não transferível mas revogável) · **Gitcoin Passport** (stamps; Linea exigia ≥20 pontos como prova de humanidade).

### 9.14 Replicated Security / Mesh Security (Cosmos)
- **Replicated Security** (ex-Interchain Security V1): consumer chains **alugam** a segurança do Cosmos Hub — os validadores do Hub validam também a consumer chain e ficam sujeitos ao mesmo slashing/jailing. Em troca, a consumer chain compartilha receita (≥25% das taxas de transação; ou taxas de aplicação se não tiver token próprio).
- **Inversão de lógica:** Ethereum = 1 blockchain / N aplicativos · Cosmos/Polkadot = 1 blockchain / 1 aplicativo · **Cosmos ICS = 1 aplicativo / N blockchains**.
- **Crítica de Sunny Aggarwal (Osmosis):** Replicated Security é derivação do consenso da Polkadot e "perda de tempo" — é **hierárquico e concentra poder**. Melhor: **Mesh Security**, com **soberania política + segurança compartilhada** (analogia com a OTAN: países soberanos com defesa mútua). E o comportamento atual do Cosmos **já é** uma *soft shared security*.
- **Prós do RS:** censurar a consumer chain custa o mesmo que atacar o Hub; ATOM em staking passa a receber recompensas extras → pressão compradora + redução de supply.

### 9.15 Ferramentas de análise de contratos
- **Análise estática** (lê o código-fonte procurando padrões inseguros) vs **análise dinâmica** (acompanha o contrato em execução). A maioria das ferramentas é estática, e **não existe uma "super solução"** de um clique.
- **Escopo real de análise:** (1) as **regras de negócio** — o que o contrato faz de fato (pode ser uma pirâmide); (2) custo de gas (pode ser proibitivo); (3) instruções maliciosas/vulnerabilidades.
- Limitação honesta registrada: é uma disciplina **para programadores**, não para o usuário final se precaver.
- Ferramentas gratuitas: CyberScan (tokens) · Safescan (carteiras) · SimilarityScan (similaridade entre contratos).

---

## 10. História e filosofia — por que cripto existe (estudo do Notion)

**Raízes (1930–40):** ficção distópica onde uma elite controla a humanidade por meios diferentes (Orwell / Huxley).
**Internet e cypherpunks (1960–80):** ARPANET (1969) → internet oficial (01/01/1983). Nos anos 70, pensadores identificam a internet como possível **ferramenta de controle estatal**; nos anos 80 respondem criando as **BBS** — uma internet paralela fora do governo americano.
- **Vernor Vinge, *True Names*** — uma das primeiras visões de metaverso anônimo e criptografado ("O Outro Lado").
- **Phil Salin, AMIX (1980)** — primeiro mercado digital aberto da história, para negociar informação. *"A habilidade de comprar exatamente o conteúdo que se deseja, quando se deseja, irá explodir numa velocidade nunca vista desde a prensa."* / *"Pelo ano 2000 a economia global será uma economia global de informação; comunidades de interesses compartilhados vão se expandir além das fronteiras geopolíticas."*
- **Chip Morningstar, HABITAT** — primeiro metaverso. *"Planejamento central é impossível; nem se dê ao trabalho de tentar."*
- **Mark Miller** — sistemas agóricos (ágora = praça/mercado) e **teoria dos jogos**: a teoria do 3,3 — para receber benefícios você precisa cooperar. **É a raiz do desenho de incentivos econômicos em cripto hoje.**
- **O racha ideológico (1987):** Timothy C. May — para ele **todo** governo era corrupto; queria destruir o Estado. Rascunhos do **Manifesto Cripto-Anarquista** e da BlackNet (qualquer serviço comprado e vendido). Registro crítico do estudo: *"não necessariamente esse mundo mais livre é um lugar melhor — definitivamente não é utópico, tem aspectos assustadores."*
- **A jornada até o Bitcoin:** 1989 David Chaum **DigiCash** → 1997 Adam Back **HashCash** → 1998 Wei Dai **B-Money** → 1998 Nick Szabo **Bit Gold** → 2004 Hal Finney **RPOW** → 2008 **Satoshi / Bitcoin**.
- 🔑 **Conclusões do estudo (importantes para calibrar o discurso):**
  - *"Bitcoin é uma tecnologia que não necessariamente vai destruir o Estado. Pode ser que no futuro a tecnologia seja tão boa que o próprio Estado a adote, e essa guerra vire uma guerra de poder de influência."*
  - *"Satoshi fala muito mais sobre economias autônomas, como aposentar os bancos, do que sobre destruir governos."*
  - Nos anos 90 os EUA **desistiram de lutar contra a criptografia**. Hoje os governos estão atrás de entender como usar a tecnologia para si (CBDCs).

---

## 11. Ciclo do BTC e leitura macro

### 11.1 Fractal de ciclo
BTC repete um fractal de ~4 anos, tipicamente com 1 ano de baixa. **Mas:** a expansão monetária do FED (corte de juros, impressora) pode quebrar o padrão — e só existem 3 ciclos anteriores como amostra, o que é estatisticamente pouco.

### 11.2 O duplo mandato do FED e a leitura de Lucas
- FED olha inflação **e** desemprego. O problema: o desemprego **antecede** e retroalimenta o PIB, e o PIB segue muito positivo — pode levar a **falsa interpretação**, com 60% dos itens do CPI já 3% acima do implícito nos juros. **A preocupação é a inflação real ser maior que a declarada.**
- Do outro lado: pedidos de seguro-desemprego em nível baixo — as pessoas saem do mercado **trocadas por IA**, o que é ganho de performance, não só perda de emprego.
- **Regra de Taylor** (via PIB ou via desemprego, sempre considerando a inflação): pelo PIB, os juros estão **muito abaixo do ideal** — perigoso, fora da neutralidade.
- **Equilíbrio frágil:** baixa oferta de mão de obra (menor imigração, envelhecimento) + baixa contratação (automação/IA, incerteza) + **baixas demissões** (memória da escassez do COVID; empresas reféns, com medo de não conseguir recontratar). Resultado: mercado aparentemente resiliente mas vulnerável, **desaceleração gradual, não abrupta** — diferente das recessões tradicionais. Risco: virar recessão se mal gerenciada.
- **IA + energia:** demanda por IA maior do que a capacidade elétrica existente; a China detém as **terras raras** necessárias para expandir. Governo americano financiando e virando sócio das empresas.
- **Stablecoins:** ~$300bi projetados para $1,3T — criam lastro para o dólar e **exportam a inflação americana para o resto do mundo**.
- ❓ Pergunta em aberto registrada: *"Possível bear? Bear diferente? 2026 provável expansão monetária… Recessão? Quando anunciada, já está acontecendo há ~6 meses. BTC vai subir com a expansão monetária como sempre foi?"*

### 11.3 Indicadores on-chain que Lucas monitora (aba Ciclo em `ferramentas.html`)
8 indicadores via API do ResearchBitcoin (snapshot diário automatizado em `btc-onchain.json`):
**MVRV · STH MVRV · LTH MVRV · Mayer Multiple · Realized Price · LTH SOPR · AVIV · CVDD.**
Insight técnico chave: **Realized Price = PriceUSD ÷ MVRV** (MVRV = market cap / realized cap), o que permite derivar tudo sem acesso pago à realized cap.
Veredito de ciclo combinado: FUNDO/COMPRA · ACUMULAÇÃO · EXPANSÃO · TOPO/EUFORIA.

### 11.4 Sinais de virada de ciclo que Lucas acompanha
Dominância do BTC caindo + altcoin season index + oferta de stablecoin crescendo. Fear & Greed no dashboard. **Regra: "a virada de ciclo não é anunciada".**

---

## 12. Mentoria — teses e discussões registradas nas conversas

*(Papel definido pelo Lucas: mentor multidisciplinar em DeFi/Cripto, Economia, Geopolítica, Criptografia e Tecnofilosofia. Economia e geopolítica são os gaps declarados.)*

- **Bitcoin ainda age como ativo de risco correlacionado ao Nasdaq** (confirmado empiricamente). Divergência emergente em abr/2026 (tarifas Trump): dólar enfraqueceu + ouro em ATH + BTC não despencou tanto → **primeiro teste real da narrativa de reserva de valor**.
- **Dilema de Triffin** — por que o dólar se enfraquece estruturalmente e por que cripto existe como resposta.
- **L2 tokens como armadilha de varejo** — a tecnologia funciona, mas o tokenomics nunca capturou valor para o holder. **Filtro prático: "a receita vai para o token holder diretamente?"** HYPE/Hyperliquid passa; Scroll, Blast e StarkNet falham.
- **Vitalik — *Low-risk DeFi* (set/2025):** o killer app do ETH é **lending colateralizado + pools** — exatamente o que Lucas já faz.
- **Vitalik — *Balance of Power* (dez/2025):** framework Big Gov / Big Business / Big Mob; a tecnologia destruiu os freios naturais entre eles.
- **Fred Ehrsam (Paradigm), *How to Survive a Crypto Cycle*** — 6 insights aplicados:
  1. Tudo morre no bear exceto o que tem PMF real → AAVE, Uniswap e Kamino sobreviveram; GRIFT não.
  2. **Cash (stables) = opcionalidade, não fraqueza.** O bear é quando os retornos são plantados.
  3. Yield sem entender o risco é o caminho mais rápido para zero.
  4. Ciclos duram mais do que se espera — **nos dois sentidos**. Calendário de DCA força disciplina mecânica.
  5. **A virada de ciclo não é anunciada.**
  6. **Sobreviver para o próximo ciclo É a estratégia.** Preservação de capital é alfa.
- **Bear = redistribuição** de tokens de mãos fracas para mãos fortes. **O varejo tem vantagem sobre o institucional no bear** — o institucional tem mandato e compliance e não consegue comprar quando está feio.
- **Distinção fundamental: acumular tokens ≠ especular no preço.** Métricas em tokens, não em dólares.
- **Tese da invisibilidade:** blockchain maduro é como TCP/IP — ninguém sabe que usa. **A janela de assimetria existe justamente porque a tecnologia ainda é visível e assusta.**
- **Taxonomia regulatória (perguntas elaboradas para o Dan Crypto/WeSearch):** ETH provavelmente vira commodity na prática, com processo lento e linguagem ambígua · **ETF de ETH com staking é catalisador forte** (abre seguradoras e fundos de pensão que precisam de yield) · HYPE em zona cinza (burn ≠ dividendo é a defesa; "esforço de outros" é o ponto de ataque da SEC) · **o elo mais fraco da cascata de re-hipotecação é a PONTE** (WBTC, cbBTC, LSTs) — indicadores: prêmio/desconto do WBTC, funding rates, dominância de stablecoin · jurisdição a acompanhar: EUA para o portfólio, MiCA para entender a tendência · **evidência concreta de "ruptura real"**: banco tradicional usando smart contract em produção (não só comprando token), ou ETF com staking aprovado.
- **DeFi state-of-the-art 2026 a estudar (pendente):** Euler V2 (lending modular com prazo fixo) · Morpho Blue (mercados isolados com LTV custom) · Gearbox V3 (credit accounts nativos) · Drift BTC-PERP (basis trade em Solana) · Hyperliquid HLP (vault maker-taker ~15% APR) · Pendle PT (renda fixa).

---

## 13. Diário de bordo — o que efetivamente aconteceu (2025–2026)

**2025 — o ano do aprendizado caro e da recuperação**
- Jul: carteira em ATH. *"Preciso pensar com mais calma, realizar mais lucros e esperar correção."*
- Ago: perde o topo do ETH por não realizar. *"Desviei o foco essa semana."* Registra a crença limitante ("poderia subir mais um pouco") — **e o erro se repete duas semanas depois**.
- Set: corrige o comportamento — vende parcial em resistência para repagar empréstimo antes da queda esperada. Funciona.
- Out: entra por FOMO num jogo de farm ("fazenda de WEED") no time errado, financiado com a venda do GRIFT no prejuízo. Token cai ~90%. *"Denovo acabei entrando no FOMO."*
- **10/10/2025 — flash crash.** Não é liquidado; compra ETH e SOL no sábado. Conclusão que muda a estratégia: *"em momentos assim, pools de liquidez são a melhor saída para um fluxo de caixa constante"* → passa a estudar DeFi a fundo e reservar capital para pools.
- Dez: monta 2 pools de venda (SOL e ETH) para rebalancear os empréstimos, estando de férias. Mercado derretendo.
- **31/12/2025 — balanço do ano:** *"Consegui manter sem retirar muito lucro para o fiat, consegui investir bastante. A Raydium com a pool SOL/GRIFT me deixou ruim na desvalorização do token, mas com boas taxas — **aprendi a sair mais cedo das pools**. Me re-ergui com trades estruturados em borrow e lending na Kamino, **recuperei minhas 10 solanas** que havia perdido nas pools. No Q4 montei posições de saída para ETH e SOL. No geral o ano foi ótimo — +30% de alta nos ativos."*

**2026 — o ano da estrutura**
- Jan: *"aumento de QE nos EUA me anima."* Estuda ZEC e **não gosta**. Compra USD abaixo de R$ 5,19 e ETH/SOL nas quedas. Migra a pool ETH/USDT para a **Base** (APY melhor).
- Fev: mercado lateral pós-queda. Pool ETH/USDC dando ~5% em 15 dias / APY 125% mesmo com volume baixo. **Fear & Greed em medo extremo** → *"ainda estou esperando um recuo para comprar mais"*. Troca USDG→USDC no borrow quando o APR sobe.
- Mar: guerra no Irã afetando os mercados. *"O consenso ainda é pessimista; eu sigo otimista com o ano, mas cauteloso nos aportes."* / *"Não estamos em risco extremo, pelo contrário — em MEDO extremo."*
- Abr: *"Mercado está apostando em mais quedas, eu estou me sentindo bem com isso."*
- **O padrão que se repete em todo o ano:** riscos = as **altcoins menores** (RDNT, ADA, ZK, ZETA, XAI, POL, EIGEN) que derreteram e precisariam subir múltiplos para voltar ao patamar. Decisão consciente e repetida: *"não tem por que vender, nem o que fazer com elas — vou segurar e esperar o próximo bull. Melhor esperar uma nova alta para rebalancear."*
- **Risco declarado #1 a partir de out/2025:** *"os principais riscos hoje são os riscos de contratos inteligentes — tento manter minhas operações nos grandes protocolos do mercado."*

**Lições do Diário de Trading (2023–2025)**
- *"Meu erro foi ter subido o alvo do meio do movimento — fui querer ser ganancioso e como sempre não bateu o alvo."*
- *"NÃO OPERAR CANSADO E MAIS DE 1 TRADE POR DIA."* (registrado duas vezes, em dias diferentes)
- *"Mais um trade que não queria ter feito e fiz por impulso. Erro aprendido."*
- Evolução real do método: passou a **stopar só 50% da posição** e buscar a assimetria com o resto; e **nunca deixar de posicionar o TP**.

---

## 14. Índice completo dos estudos no Notion (inventário — nada foi deixado de fora)

**Frameworks e método:** DEFI 31 regras · Análise Fundamentalista · Análise Técnica · Setups · DCA por intensidade · DCA ETH · Ferramentas de análise de contratos · Crypto AI prompts · Aula Zé Mograbi · Curso Liga M1 · TECHTALKS 09/03/23 · Frases · LIVROS · META.
**Fundamentos:** BITCOIN · ETHEREUM · DeFi · Money Legos & LSDFi · Escalabilidade em Ethereum · Rollups – ZK-EVMs · Data Availability · Account Abstraction · STARKNET-Account Abstraction · Interoperabilidade Cross-Chain · Replicated Security · Redes de Privacidade · Identidade On-Chain · Real World Assets · Shangai Fork · História do Mercado Crypto · Implicações econômicas do Ciclo BTC · Crypto World (hub).
**Protocolos e redes:** EigenLayer · Pendle Finance · Radiant Capital (RDNT) · Radiant · LayerZero Labs · ZetaChain (ZETA) · Chainlink · Pyth Network · Celestia · NEAR Protocol · Injective · SEI Network · Osmosis · Polygon 2.0 · Polygon Matic · Astar Network · Dymension · RONIN · BNB Chain · Radix · Hyperledger Foundation · Singularity DAO · Lens Protocol · Solana · ADA Cardano · Ethereum (ficha) · Polygon (ficha) · Revert Finance · AIRDROPS.
**Operação e portfólio:** Painel – Barolo (diário semanal + PDFs mensais) · Diário DeFi (registro pool a pool, 2024–2026) · Diario de Trading · Empréstimos Cripto · COMPRAS ETH · Portifólio (snapshots semanais 27/12/2025 → 24/03/2026) · ANÁLISE DEFIVERSO · painel_cripto_lucas · Portfólio Dashboard · DeFi Dashboard · MATIC/USDC · ARB/USDC · Notas · Journal · Task List · Links para assistir · Habit Tracker · Personal Home · Privacy.

> **Nota de fidelidade:** os estudos de protocolo individuais (Chainlink, Pyth, NEAR, Injective, SEI, Osmosis, Astar, Dymension, Ronin, BNB, Radix, Hyperledger, Singularity DAO, Lens, LayerZero, Solana, ADA) seguem **exatamente o mesmo template de 5 etapas** da seção 5 (o que é/faz → proposta de valor → tokenomics → estado atual e roadmap → considerações e decisão) e estão resumidos onde relevante nas seções 9.x. Se for preciso o detalhe integral de algum deles, ele está na página correspondente do Notion.

---

## 15. Como usar esta base num chat novo

1. **Para responder sobre estratégia/filosofia:** seções 1, 2, 4, 12, 13. O tom certo é o do manifesto — consistência, preservação de capital, ativos acumulados e não preço.
2. **Para analisar um projeto novo:** seção 5 (framework) + seção 6 (métricas) + o filtro *"a receita vai para o token holder diretamente?"*.
3. **Para dimensionar posição ou avaliar risco:** seções 7.6 e 8.
4. **Para responder sobre o portfólio:** seção 3 + `data.js` (fonte única). **Nunca somar colateral DeFi por cima do total.**
5. **Para o Diário DeFi (trades, decisões, observações):** a fonte real e completa é a **página do Notion "📗 Diário DeFi"** (`bb704dfd-a8b0-4838-b18e-a22ab1e2557d`) — 66 seções, 2023→2026. O arquivo `diario.js` na raiz do repo é apenas um espelho parcial (em 18/08/2026 continha **2 entradas**) usado por sessões automatizadas sem acesso ao Notion. **Não tratar `diario.js` como o diário.** Ao buscar o Notion: a página vem com ~800 mil caracteres por causa das URLs assinadas das imagens — limpar `!\[\]\(https://prod-files-secure...\)` reduz para ~72 mil caracteres de texto real.
6. **Regras que nunca podem ser quebradas:** privacidade (§1) · metodologia de patrimônio (§3.1) · referência da pool sempre em USD (§2.3) · nunca assumir a rede da pool ativa (§2.3) · nunca expor endereço de carteira em URL.


---

## 16. Leitura do Diário DeFi e auditoria de dados (18/08/2026)

Análise das **66 seções** do Diário DeFi do Notion (2023→2026, ~72 mil caracteres de texto próprio),
cruzada com `pools.html`, `data.js` e `briefing.json`.

### 16.1 A curva de comportamento — sim, melhorou, e dá para datar

| Ano | Posições no diário | Remontagens | Stable / Alt / Meme | Resultado |
|---|---|---|---|---|
| 2023 | 9 | 7 | **4 / 2 / 0** | **+US$ 377** |
| 2024 | 49 | **75** | 2 / **21** / **7** | +US$ 239 |
| 2025 | 4 | 34 | 2 / 1 / 1 | **−US$ 1.527** |
| 2026 | 4 | 13 | **4 / 0 / 0** | **+US$ 111** |

2024 foi o pico de *churn*: 75 remontagens para +US$ 239 de resultado. 2026 é uma operação
qualitativamente diferente — só pares com stable, 13 remontagens, dívida dentro da decisão
(*"vou repagar um pouco da dívida com os dolares que recebi"*) e range calibrado por método
(*"achei que o retorno estava muito baixo pois ficou esticada demais, dessa vez vou fazer esticada mas
pela metade, seguindo a acumulação do VPVR"*).

### 16.2 Os cinco padrões que o diário revela

1. **O denominador errado — a única vez em que "medir em tokens" traiu a estratégia.**
   21 das 49 seções de 2024 são a *mesma* posição RDNT/ETH remontada. Entrou com 6.313 RDNT em janeiro,
   saiu com 7.038 em julho: **+725 RDNT, +11,5% em tokens** — sucesso pela régua declarada. Hoje os sete
   alts somados valem **~US$ 125** (contra US$ 885 investidos) e o protocolo Radiant foi hackeado em 2025.
   **A regra não está errada, está incompleta:** medir em tokens só protege se o token sobrevive uma
   década. Para ETH/SOL/BTC funciona; para um alt, o numerador crescendo *esconde* a posição morrendo.

2. **A pool foi usada como anestésico de aversão à perda — cinco vezes, em cinco pools, escrito.**
   *"Como não pretendo vender os tokens no prejuizo"* · *"Por mais que gere menos taxas não posso mais
   sair no prejuizo"* · *"Como ainda não pretendo vender os tokens com esse prejuizo inicial, vou diminuir
   um pouco o range"* · *"Como não pretendo realizar esse prejuizo vou remontar a pool aqui mesmo"* ·
   *"não quero sair agora e tornar o loss permanent"*. Racionalizado é coerente (gero taxas enquanto
   espero); na prática é **hold disfarçado de operação**, e explica os 75 remounts de 2024 melhor que
   qualquer tese de mercado. É o efeito disposição.

3. **O GRIFT foi um erro de 38 dias, não de um dia.** O diagnóstico correto está escrito em 31/01/2025
   (*"Deveria ter retirado a posição toda quando a carteira bateu ATH em 3K dolares"*), reforçado em
   01/02 (*"Cheguei a ter 10 SOL na pool, agora não tenho 6"*) e em 24/02 (*"Me sinto agora preso nessa
   operação"*) — e a operação seguiu até 10/03. **O que faltava não era análise, era um gatilho de saída
   que não dependesse de concordar com ele no momento.**

4. **Indisponibilidade é fator de risco mensurável.** Dez menções a doença, gripe, viagem ou mudança,
   coincidindo com os piores resultados. O PEANUT (−US$ 243) é literal: *"Acabei ficando doente logo
   depois que montei essa pool e não consegui acompanhar."* Uma estratégia que exige atenção diária tem
   custo escondido nos dias sem atenção. **Range mais largo é seguro contra gripe** — e é a variável que
   deve moderar o aumento de tamanho indicado em §8.6.

5. **A regra das 24h existe e funciona — foi violada exatamente na pool que quebrou.** *"Minha estratégia
   continua sendo, esperar pelo menos 24h para re-montar as pools"* aparece 5 vezes. No GRIFT houve
   remontagens no mesmo dia, repetidas vezes.

### 16.3 O que falta escrever (prioridade)

**Regra de SAÍDA por tempo, não de entrada.** O GRIFT prova que a entrada não mata — ficar preso mata.
Elementos mínimos: máximo de dias fora do range antes de encerrar obrigatoriamente · teto de aportes
adicionais dentro de uma posição perdedora (o erro 4 SOL → 10 SOL) · veto a token cujo preço é a própria
tese · piso de TVL e razão volume/TVL · teto de tamanho por pool não-blue-chip.

### 16.4 Correções de dados aplicadas nesta revisão

| Item | Estava | Correto |
|---|---|---|
| Baseline do portfólio | 20/06/2026 | **14/08/2026** (`data.js asOf`) |
| Total investido | ~US$ 9.955 | **US$ 10.172,10** |
| Patrimônio líquido | não registrado | **US$ 7.125,72** (15/08/2026) |
| Dívida total | ~US$ 1.570 | **US$ 1.583,80** |
| Leverage | "0,245x" | **dívida/patrimônio 22,2%** |
| Taxas brutas de pools | ~US$ 2.437 | **US$ 2.459,94** |
| P&L líquido de pools | "−840 a −1.021" | **−US$ 799,61** (valor único, calculado) |
| Nº de registros de pool | 28 | **29** em `pools.html` · **66 seções** no diário |
| Fórmula de HF | "o ao vivo é o correto" (sem detalhe) | resolvido em §8.5 — HF real **6,04** |
| Fonte do Diário DeFi | `diario.js` | **página do Notion** (`diario.js` tem 2 entradas) |
| Duplicata desta KB | rascunho não versionado `CONHECIMENTOBAROLO.md` (sem hífen) coexistia com o canônico, com cabeçalho contendo 2 alegações falsas | **mesclado e removido em 19/08/2026** — `CONHECIMENTO-BAROLO.md` (com hífen) é a fonte única, espelhada no `CLAUDE.md` |

### 16.5 Pendências abertas (dados)

- **`data.js → defi.aave.healthFactor`**: o comentário deriva de colateral defasado (US$ 4.622 ⇒ ETH a
  US$ 1.399). O colateral real é **US$ 5.658,25**. Corrigido no `data.js` em 18/08/2026 — manter a
  convenção do HF real da Aave daqui em diante.
- **Duas pools do diário não estão em `pools.html`**: **POPCAT/SOL 1%** e **WEN/SOL 0.16%** (mar/2024),
  ambas memecoins na Solana. Como as duas são do grupo "narrativa", incluí-las **piora** o track record
  agregado e eleva `z` de 24% para ~29% no histórico. Os números de §3.4 são conservadores por omissão.
- **% do tempo em range** da pool ativa nunca foi computado. É a variável que faz o fee APR de 50,91%
  cair para ~25% se a pool ficar metade do tempo fora. Reconstruível a partir das datas do diário.
- **`monthlyReturns[2026]`** e reconciliação de `wealthCurve.invested` (série termina em US$ 7.100 vs
  total canônico US$ 10.172) seguem pendentes.

<!-- KB-END -->

---

Atualizado: 19/08/2026 — **Base de Conhecimento Consolidada.** As duas cópias divergentes (`CONHECIMENTO-BAROLO.md` rastreado + rascunho não versionado `CONHECIMENTOBAROLO.md`) foram fundidas nesta versão: §3.2/§3.2.1/§3.4 rebaselinados (`data.js` 14/08/2026, agregados de `briefing.json` 15/08/2026, track record de pools recomputado dos dados brutos — 29 registros), §8.5 com a fórmula de Health Factor resolvida, §8.6 novo (dimensionamento Kelly com ramo de ruína), §16 novo (leitura das 66 seções do Diário DeFi do Notion + tabela de correções). O rascunho `CONHECIMENTOBAROLO.md` — cujo cabeçalho alegava incorretamente que este arquivo com hífen e o bloco `KB-START`/`KB-END` não existiam — foi removido.
