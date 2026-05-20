# Fluxo Mensal de Atualização — Barolo Capital Dashboard

**Frequência:** Todo dia 20–21 do mês (após fechamento de dados do mês anterior)  
**Entrada:** Prints do CoinGecko, AAVE V4, Kamino Finance  
**Saída:** Site atualizado + commit no GitHub + snapshot JSON

---

## 1. Prints Necessários (por onde buscar)

### A. CoinGecko — Portfolio completo
- **URL:** https://www.coinggecko.com/portfolio
- **O que capturar:** screenshot da tabela com Holdings (ETH, SOL, ADA, EIGEN, RDNT, POL, ZK, XAI, ZETA)
  - Colunas: **Symbol · Holdings · Price · Value · 24h %**
  - Salvar em: `DIARIO DEFI E PRINTS\portfolio-DD-MM-26.png`

### B. AAVE V4 — Posições de lending
- **URL:** https://app.aave.com/?chainId=1 (Ethereum mainnet)
- **O que capturar:** 
  - Seção **"Your Supplies"**: quantidade de WETH e USDT (com APY%)
  - Seção **"Your Borrows"**: quantidade e tipo de token (USDC em abr/26), APY%
  - Salvar em: `DIARIO DEFI E PRINTS\aave-DD-MM-26.png`

### C. Kamino Finance — Posições no Solana
- **URL:** https://app.kamino.finance/liquidity/view (selecionar wallet `Fq1F49Vx38f8h62SSRCQpGYPxPEtarY5NZ5GhrFVnrfW`)
- **O que capturar:**
  - **Supplied**: SOL qty, USDS qty (com APY%)
  - **Borrowed**: USDC qty, APY%
  - **LTV %** (liquidation threshold)
  - Salvar em: `DIARIO DEFI E PRINTS\kamino-DD-MM-26.png`

### D. (Opcional) Transações adicionais
- Compras de tokens via Binance/Bybit
- Depósitos/saques AAVE ou Kamino
- Coleta de fees em pools Uniswap V3 (Base)
- Salvar em: `DIARIO DEFI E PRINTS\trades-DD-MM-26.png`

---

## 2. Extração de Dados (mapeamento Print → Constantes do Site)

### Portfolio (CoinGecko)
| Print | JavaScript Constante | Arquivo | Linhas |
|-------|----------------------|---------|--------|
| ETH holdings qty | `HOLDINGS[0].qty` | `index.html` | ~150 |
| SOL holdings qty | `HOLDINGS[1].qty` | `index.html` | ~152 |
| ADA holdings qty | `HOLDINGS[2].qty` | `index.html` | ~154 |
| EIGEN holdings qty | `HOLDINGS[3].qty` | `index.html` | ~156 |
| RDNT holdings qty | `HOLDINGS[4].qty` | `index.html` | ~158 |
| POL holdings qty | `HOLDINGS[5].qty` | `index.html` | ~160 |
| ZK holdings qty | `HOLDINGS[6].qty` | `index.html` | ~162 |
| XAI holdings qty | `HOLDINGS[7].qty` | `index.html` | ~164 |
| ZETA holdings qty | `HOLDINGS[8].qty` | `index.html` | ~166 |

### AAVE V4 (Ethereum)
| Print | Constante/ID | Arquivo | Linhas |
|-------|--------------|---------|--------|
| WETH qty (supplied) | `WEEKLY_UPDATE.defi.aave.assets.WETH.deposited` | `portfolio_analytics.html` | ~XXX |
| WETH qty (display) | `AAVE_ETH_QTY` | `relatorio.html` | 541 |
| WETH qty (hardcoded) | `wethQty` | `emprestimos.html` | 1142 |
| USDT qty (supplied) | `WEEKLY_UPDATE.defi.aave.assets.USDT.deposited` | `portfolio_analytics.html` | ~XXX |
| USDT qty (display) | `AAVE_USDT_QTY` | `relatorio.html` | 542 |
| USDT qty (hardcoded) | `aaveUSDT` | `emprestimos.html` | 1143 |
| USDC qty (borrowed) | `WEEKLY_UPDATE.defi.aave.loans.assets.USDC.borrowed` | `portfolio_analytics.html` | ~XXX |
| USDC qty (display) | `AAVE_BORROW` | `relatorio.html` | 545 |
| USDC qty (hardcoded) | `aaveDebt` | `emprestimos.html` | 1165 |
| WETH APY (supply) | `AAVE_ETH_APY` | `relatorio.html` | 541 |
| USDT APY (supply) | `AAVE_USDT_APY` | `relatorio.html` | 542 |
| USDC APY (borrow) | `AAVE_BORROW_APY` | `relatorio.html` | 545 |

### Kamino (Solana)
| Print | Constante/ID | Arquivo | Linhas |
|-------|--------------|---------|--------|
| SOL qty (supplied) | `WEEKLY_UPDATE.defi.kamino.supplied.SOL.quantity` | `portfolio_analytics.html` | ~XXX |
| SOL qty (display) | `KAM_SOL_QTY` | `relatorio.html` | 548 |
| SOL qty (hardcoded) | `kamSOL` | `emprestimos.html` | 1157 |
| USDS qty (supplied) | `WEEKLY_UPDATE.defi.kamino.supplied.USDS.quantity` | `portfolio_analytics.html` | ~XXX |
| USDS qty (display) | `KAM_USDS_QTY` | `relatorio.html` | 549 |
| USDS qty (hardcoded) | `kamPYUSD` | `emprestimos.html` | 1143 |
| USDC qty (borrowed) | `WEEKLY_UPDATE.defi.kamino.borrowed.USDC.quantity` | `portfolio_analytics.html` | ~XXX |
| USDC qty (display) | `KAM_BORROW` | `relatorio.html` | 550 |
| USDC qty (hardcoded) | `kamDebt` | `emprestimos.html` | 1165 |
| SOL APY (supply) | `KAM_SOL_APY` | `relatorio.html` | 548 |
| USDS APY (supply) | `KAM_USDS_APY` | `relatorio.html` | 549 |
| USDC APY (borrow) | `KAM_BORROW_APY` | `relatorio.html` | 550 |

### Valores Derivados (calculados a partir dos prints)
| Campo | Fórmula | Arquivo | ID/Constante |
|-------|---------|---------|--------------|
| `STABLES_USD` | USDT portfolio + USDS Kamino | Todos | `STABLES_USD` / `PORTFOLIO_DATA[9,10]` |
| `TOTAL_DEBT` | AAVE borrow + Kamino borrow | Todos | `TOTAL_DEBT` |
| `netTotal` | SPOT (ativos voláteis em CoinGecko) + STABLES − DÍVIDA | `portfolio_analytics.html` | calculado em `renderUI()` |

---

## 3. Arquivos a Atualizar (checklist)

### 3.1 `index.html`
- [ ] **HOLDINGS array** (linhas ~149–167): 9 tokens com qtys do CoinGecko
- [ ] **STABLES_USD** (linha ~149): USDT portfolio + USDS Kamino
- [ ] **TOTAL_DEBT** (linha ~150): AAVE borrow + Kamino borrow

### 3.2 `portfolio_analytics.html`
- [ ] **WEEKLY_UPDATE object** (~linhas 2400–2600):
  - `defi.aave.assets.WETH.deposited` + `.apy_pct`
  - `defi.aave.assets.USDT.deposited` + `.apy_pct`
  - `defi.aave.loans.assets.USDC.borrowed` + `.apy_pct`
  - `defi.kamino.supplied.SOL.quantity` + `.apy_pct`
  - `defi.kamino.supplied.USDS.quantity` + `.apy_pct`
  - `defi.kamino.borrowed.USDC.quantity` + `.apy_pct`
  - `defi.kamino.ltv_pct`
- [ ] **wealthCurve** (`WEEKLY_UPDATE.wealthCurve.values`): adicionar ponto ao final com patrimônio ao vivo

### 3.3 `emprestimos.html`
- [ ] **updateCollateralCards() function** (linhas ~1142–1170):
  - `wethQty`: AAVE WETH (do print)
  - `usdtQty`: AAVE USDT (do print)
  - `solQty`: Kamino SOL (do print)
  - `usdsQty`: Kamino USDS (do print)
  - `aaveDebt`: AAVE USDC borrowed
  - `kamDebt`: Kamino USDC borrowed
- [ ] **HTML fallback values** (linhas ~1126–1165): atualizar labels de qtys e APYs

### 3.4 `ferramentas.html`
- [ ] **BASE object** (linhas 2059–2068):
  - `aaveDebt`, `aaveETH`, `aaveUSDT`
  - `kamDebt`, `kamPYUSD`, `kamSOL`, `solQty`
- [ ] **Inputs HTML** da calculadora de liquidação AAVE e Kamino (valores fallback)
- [ ] **`checkAlerts()` function**: divisores nas fórmulas de LTV

### 3.5 `relatorio.html`
- [ ] **APY constants** (linhas 541–550): 6 valores de APY (AAVE supply × 2, AAVE borrow, Kamino supply × 2, Kamino borrow)
- [ ] **Position constants** (linhas 541–550): `AAVE_ETH_QTY`, `AAVE_USDT_QTY`, `KAM_SOL_QTY`, `KAM_USDS_QTY`, etc.
- [ ] **STABLES_USD**, **DEBT_TOTAL**, **TOTAL_INVESTED**

### 3.6 `pools.html`
- [ ] **updatePatrimonio() function** (linhas ~4095–4097):
  - `STABLES` (USDT + USDS)
  - Fallback values: `window._liveAaveDebt || XXX`, `window._liveKaminoDebt || XXX`

### 3.7 `EXPORTS SEMANAIS/MAIO/DD-MM-26-posicoes.json` (novo arquivo)
- [ ] Criar snapshot JSON com estrutura idêntica a `20-05-26-posicoes.json`
- [ ] Atualizar `date`, `timestamp`, `portfolio_total_usd`, todos os holdings, AAVE V4 e Kamino

---

## 4. Processo de Atualização (passo a passo)

### Pré-requisito
- [ ] Salvar os 3 prints (CoinGecko, AAVE V4, Kamino) na pasta `DIARIO DEFI E PRINTS\`
- [ ] Anotar a data (DD-MM-26) e hora (para o JSON timestamp)

### Execução
1. **Extrair dados dos prints** manualmente (OU usar OCR/screenshot se houver ferramenta)
   - CoinGecko: copiar qtys de cada token (9 linhas)
   - AAVE V4: anotar WETH qty, USDT qty, USDC borrow, 3 APYs
   - Kamino: anotar SOL qty, USDS qty, USDC borrow, 3 APYs

2. **Editar os 6 arquivos HTML** com os valores novos (usar Claude Code ou editor local)
   - Sugestão: começar por `relatorio.html` (constantes bem organizadas)
   - Depois `emprestimos.html` (hardcoded no updateCollateralCards)
   - Depois `ferramentas.html` (BASE object + inputs)
   - Depois `pools.html` (STABLES fallback)
   - Depois `portfolio_analytics.html` (WEEKLY_UPDATE — maior)
   - Por último `index.html` (HOLDINGS array)

3. **Criar JSON snapshot** (`DD-MM-26-posicoes.json`)
   - Copiar de `20-05-26-posicoes.json`
   - Atualizar: `date`, `timestamp`, `portfolio_total_usd` (CoinGecko portfolio value)
   - Atualizar todos os `holdings[].quantity` com qtys do CoinGecko
   - Atualizar `aave_v4.assets.*`, `aave_v4.loans.*` com dados do AAVE print
   - Atualizar `kamino.supplied.*`, `kamino.borrowed.*` com dados do Kamino print
   - **Importante:** manter estrutura exata (chaves, decimal places, arrays)

4. **Git commit e push**
   ```bash
   git add index.html portfolio_analytics.html emprestimos.html ferramentas.html relatorio.html pools.html "EXPORTS SEMANAIS/MAIO/DD-MM-26-posicoes.json"
   git commit -m "data: atualização mensal DD-05-26 — AAVE V4 + Kamino + portfolio"
   git push origin main
   ```

---

## 5. Validação (checklist pós-atualização)

- [ ] **Portfolio total USD** no dashboard bate com valor exibido no CoinGecko?
- [ ] **AAVE Health Factor** mostrado ao vivo (>1.5 amarelo, >3 verde)?
- [ ] **Kamino LTV %** dentro do esperado (<50% verde, <77% ok)?
- [ ] **STABLES_USD + TOTAL_DEBT** atualizados em todos os 6 arquivos?
- [ ] **CAGR** em `portfolio_analytics.html` recalculado automaticamente?
- [ ] **JSON snapshot** salvo com data correta (DD-MM-26)?
- [ ] **Git commit** passou sem erros (checar GitHub Pages em 1–2 min)?

---

## 6. Campos Opcionais (se houver transações adicionais)

### Compras via CEX (Binance, Bybit, OKX)
- Usar dados dos CSVs de histórico de ordens
- Atualizar `WEEKLY_UPDATE.invested` (custo total em USD por token)
- Calcular custo em BRL para fins de IR

### Coleta de fees em pools Uniswap V3 (Base)
- Atualizar `POOLS[0].fees` se houver Collect event
- Notar a data do Collect no campo `obs` do pool

### Novos tokens adicionados ao portfólio
- Adicionar entrada a `HOLDINGS` array em `index.html`
- Adicionar entrada a `PORTFOLIO_DATA` array em `portfolio_analytics.html`
- Adicionar entrada a `FALLBACK_PRICES` em todos os arquivos que usam CoinGecko

---

## 7. Automação Futura

**Sem servidor backend:** usando localStorage + JavaScript
- Criar ferramenta OCR que lê prints automaticamente
- Parser que extrai dados estruturados (qty, APY, preço)
- Auto-preencher formulário web no site
- One-click commit via GitHub API (requer token)

**Com servidor:** Node.js + GitHub Actions
- Webhook Telegram/Discord para lembrar atualização
- Script que faz git commit automaticamente
- Histórico de versões no `EXPORTS SEMANAIS/`

---

## 8. Template de Commit (copiar e colar)

```
data: atualização mensal DD-MM-26 — AAVE V4 + Kamino + portfolio

- AAVE V4: WETH 1.89, USDT 1990, USDC borrow 751.82
- Kamino: SOL 20.47, USDS 301.42, USDC borrow 811.35
- Portfolio total: $8,XXX (CoinGecko)
- CAGR atualizado: +X.X% YTD
- JSON snapshot salvo: DD-MM-26-posicoes.json

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

---

## 9. Calendário de Próximas Atualizações

| Data | Mês Anterior | Status |
|------|-------------|--------|
| 20–21/mai | Abril | ✅ FEITO |
| 20–21/jun | Maio | ⏳ Próximo |
| 20–21/jul | Junho | ⏳ Planejado |
| 20–21/ago | Julho | ⏳ Planejado |

---

**Salvo em:** `.claude/commands/` (se houver CLI) ou `MONTHLY_UPDATE_WORKFLOW.md` (este arquivo)  
**Última atualização:** 20/05/2026  
**Próxima atualização esperada:** ~20/06/2026
