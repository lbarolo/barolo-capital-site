# Caderno — Prints (review semanal, aporte, fechamento de posição)

> Lido pelo comando `/prints`. **Atualizar "Estado atual" e "Histórico" no fim de toda execução.**

## Quando usar
- Review semanal (prints de CoinGecko + AAVE + Kamino).
- Aporte novo, compra/venda, depósito/saque no lending, abertura/fechamento de pool.
- Extrato de corretora (conversão BRL→USDT) para a aba Fiscal.

## Regras que não podem quebrar
0. ⚡ **PEDIDO EXPLÍCITO DO LUCAS (25/10/2026): conferir o TOPO do dashboard em TODA atualização de
   valores.** Palavras dele: *"nessa parte, importa muito pra mim e pro site, sempre corrija junto
   essa parte do site, quando atualizar os valores"* — sobre a faixa do `portfolio_analytics.html`
   com **Health Factors · Lifetime Return · Yield líq./mês** e os 4 cards **SPOT · POOLS LP ·
   DÍVIDAS · STABLES**. Depois de mexer no `data.js`, abrir a página e conferir que esses 7 números
   e as legendas batem com o que foi lançado. Foi ali que a dívida quitada da AAVE ficou aparecendo
   como −US$ 1.211 por dois dias (corrigido em 25/10). **Checagem rápida no console:**
   `['ev-hf-aave','ev-hf-sub','ev-growth-pct','ev-yield','s-spot','s-pool','s-pool-sub','s-debt','s-debt-sub','s-stables'].map(i=>i+': '+(document.getElementById(i)||{}).textContent)`

1. **`data.js` é a fonte única de posições.** As 6 páginas leem dele. `emprestimos.html` recebe
   sozinho pela Action `sync-emprestimos.yml` depois do push — não editar à mão para dados.
2. **Holdings JÁ incluem o colateral de AAVE/Kamino.** Patrimônio = holdings + stables + LP − dívida.
   Nunca somar o bloco `defi` por cima (dupla contagem).
3. **Piso do holding = supply do protocolo** (SOL e USDS: holding = supply da Kamino).
   `tests/data.test.js` quebra se o holding ficar abaixo.
4. **Juro/yield entra a custo zero**: a qty sobe, `invested` NÃO muda. **Todos por DELTA:**
   - ETH/USDT: holding += (juro da AAVE hoje − juro da AAVE no último review).
   - ⚠️ **SOL mudou em 07/10/2026**: antes era `holding = supply da Kamino`, porque todo o SOL
     estava no protocolo. Agora há **0,36367745 SOL na OKX** além do supply — então o yield da
     Kamino entra por **delta do supply**, igual ao ETH/USDT. **Igualar o holding ao supply agora
     APAGA o SOL da corretora.** Mesma lógica vale se ele comprar USDS fora da Kamino.
   - Os juros do último review ficam em "Estado atual" abaixo — por isso é obrigatório atualizá-lo.
5. **`principals` só mudam com depósito, saque ou reempréstimo.** Se o principal devolvido pelo
   MCP da Aave for diferente do `data.js`, houve movimentação — investigar com
   `get_user_activity` antes de gravar. Esquecer isso faz depósito aparecer como rendimento
   (bug real de 14/08/2026).
6. **`cgMirror` = a qty que está no CoinGecko HOJE.** Só igualar ao holding quando o Lucas
   disser que lançou. Hoje está **acumulando por decisão dele** (desde 11/09/2026).
7. **Aporte = dinheiro que veio DE FORA** (fiat, pagamento de trabalho). Registrar UMA linha em
   `contributions` (`{ date, usd, note }`). Rotação interna (vender X pra comprar Y, fechar pool,
   ETH comprado com o próprio USDT) **não é aporte** — o teste é *de onde veio*, não *em que virou*.
8. **`invested` só muda com compra real.** Fonte: o campo **"Custo total" no topo** da tela do
   token no CoinGecko. Nunca derivar de valor + ganho (quebra quando o token teve venda).
9. **No CoinGecko o VALOR é confiável, a DATA nem sempre.** Casar transações por quantidade e
   valor, nunca por data.
10. **Não editar à mão:** `wealthCurve` (a Action `close-month.yml` fecha o mês no dia 1),
    `debt` e `stablesTotalUSD` (são derivados no fim do `data.js`).
11. **Pool:** a rede migra — ler do print, nunca assumir. Referência de performance sempre em USD.
    Token que entra na pool **sai do CoinGecko no mesmo dia** (a pool é contada em
    `defi.uniswapV3.pooled`). Fee em ETH que fica no holding = yield custo zero.
12. **Custo de stable em USD.** BRL só na aba Fiscal (`ferramentas.html` → `FISCAL_ENTRADAS`,
    `APORTADO_BRL`).
13. **Health Factor** (fallback no `data.js`): `Σ(colateral × CF) ÷ dívida`, CF WETH 83% ·
    USDT 78%. Nunca `Collateral ÷ Borrow` cru.
14. Diferença **negativa** no yield a lançar (CoinGecko com MAIS que o site) não é yield — é erro
    de contagem. Investigar antes de lançar qualquer coisa.
15. Print de transação: conferir o **endereço inteiro**. Já houve address poisoning duas vezes
    (tokens `US͏DT`/`Ụ᠋5` e "ETH" falso de endereço clonado).

## De onde vem cada número
| Fonte | O que ler | Para onde vai no `data.js` |
|---|---|---|
| **MCP da Aave** (preferir ao print) | `get_user_positions` (v4, chainId 1, carteira AAVE de `lib/barolo-chain.js → CONFIG.aave.wallet`) → pega o `spokeId` → `get_position_items` com `side:'supply'` e `side:'borrow'` → `balance`, `principal`, `interest`, APY | `defi.aave.supply.WETH/USDT {qty, apy}`, `defi.aave.borrow.USDC {qty, apy}`, `healthFactor` (fallback) |
| Print AAVE "Position Details" | APY que o Lucas vê (use o *net* do borrow) | idem |
| Print Kamino "My Loan" | SOL/USDS supply + APY, borrow USDC + APY, LTV, Liq. LTV, Interest Earned, rewards | `defi.kamino.*`, `ltv`, `liqLtv` |
| Print CoinGecko | qty de cada token, "Custo total" | `holdings[]`, `stables[]`, `cgMirror` |
| Print Uniswap/Revert | só se houver pool aberta | `defi.uniswapV3` |
| Pool **fechada** | par, rede, abertura/fechamento (DD/MM/AAAA), dias, capital, fees, IL, resultado (= fees − IL) | UMA entrada em `poolHistory` — pools.html e o relatório leem daqui (desde 15/09/2026; antes eram 2 listas à mão) |
| Extrato OKX/CEX | conversões BRL→USDT (data, qtd, câmbio, R$) | `ferramentas.html` aba Fiscal |

APY no `data.js` é **decimal** (5,63% → `0.0563`).

## Passo a passo
1. Ler este caderno inteiro. `git pull --rebase --autostash origin main`.
2. Conferir quais prints chegaram; pedir o que faltar antes de mexer.
3. AAVE pelo MCP (exato) e confrontar os principals com `data.js → principals.aave`.
4. Atualizar o `data.js`: `asOf`, `defi.*`, qty dos holdings pelas regras 3–4, comentário curto
   ao lado de cada linha alterada (`antes->depois (DD/MM): motivo`).
5. Validar:
   - `npm test` (os invariantes do `data.js` estão em `tests/data.test.js`)
   - `node scripts/yield-to-mirror.js` → quanto está pendente no CoinGecko
   - `node scripts/close-month.js --dry-run` → deve dizer "nada a fazer"
   - opcional: abrir `portfolio_analytics.html` no preview (`barolo-site` do launch.json) e
     conferir se o bruto bate com o total do print do CoinGecko (± o yield pendente)
6. Relatório para o Lucas (curto): patrimônio líquido (e variação vs último review), HF AAVE,
   LTV Kamino, preço de liquidação do SOL, carry/mês, taxas de borrow, yield pendente acumulado,
   alertas.
7. Commit só de `data.js` + `agentes/prints.md`: `data: review semanal DD/MM/AAAA (...)`,
   `pull --rebase`, `push origin main`. Se der conflito em `emprestimos.html`:
   `git checkout --ours emprestimos.html && node scripts/refresh-emprestimos-data.js`.
8. Atualizar "Estado atual" e "Histórico" abaixo.



### 30/10 (2) — print do portfólio: `cgMirror` acertado em 3 pontos, 7 tokens batem

**Saldo do CoinGecko US$ 8.635,37** · **GP −US$ 398,28 (−3,9%)**. Os 7 tokens sem movimento batem
na casa decimal (ADA, EIGEN, POL, ZK, XAI, ZETA, SCR) ✓.

| `cgMirror` | Antes | Depois | Por quê |
|---|---|---|---|
| ETH | 2,404883374 | **2,404903374** | ✅ **ele corrigiu para 0,04332** — os 0,00002 pendentes sumiram |
| BTC | 0,00711492 | **0,00735063** | lançou a compra de hoje (qty bruta) |
| USDT | 854,89676194 | **100,20676194** | deu a saída dos USDT que viraram a pool |

**A saída do USDT fecha:** ele usou o número redondo que o `yield-to-mirror` mostrava (754,693774
→ **754,69**), que já era o líquido da saída de 755,119968 com o juro de 0,427842 dentro.
854,89676194 − 754,69 = **100,20676194**, exato.

🔸 **Sobra +0,013066 (1,3 centavo)** contra o holding, e decompõe certinho: **+0,01684** do aporte
de hoje (18,20684 que entrou − 18,19 que virou BTC), que ele **não lançou no USDT**, **−0,003774**
do arredondamento da saída. Não vale perseguir; fica aqui para não virar mistério no próximo review.

⚠️ **O "Total de ganhos/perdas" do CoinGecko virou NEGATIVO (−US$ 398,28)** — era +US$ 793,39 em
24/10. **Não é perda**: é artefato da saída dos 754,69 USDT. O USDT de lá aparece com
**GP −561,47 (−84,9%)**, ou seja, a quantidade saiu mas boa parte do custo ficou. O mesmo acontece
aqui de propósito (o custo da pool fica estacionado nos US$ 824,47 do USDT), só que o site tem o
card POOLS LP para mostrar onde o dinheiro está e o CoinGecko não tem. **O número canônico é o do
site**; o GP de lá vai se normalizar quando a pool fechar e o resultado voltar para o portfólio.

✅ **FECHADO no mesmo dia — ele lançou os três a custo zero** (ETH +0,002938 · SOL +0,058135 ·
USDT +0,013066). `cgMirror` igualado ao holding nos três. **Pendente ZERO.**

🔸 **O BTC fica com 0,00000309 a mais no espelho, por decisão dele** (*"os 3 do BTC não se lança,
pode deixar assim mesmo"*). É a soma das taxas das compras: o CoinGecko conta a qty **bruta** e o
site a **líquida**. **Nunca lançar** — vai aparecer como negativo no `yield-to-mirror` para sempre,
e é o comportamento certo. A nota está no próprio `cgMirror.BTC` do `data.js`.

⚠️ **Não houve print depois dos lançamentos**, então o espelho foi acertado pelos valores que ele
confirmou. **Conferir no próximo print do portfólio** — foi exatamente assim que os 0,0433 vs
0,04332 passaram em 24/10 (ele digitou menos casas do que disse).

### ✅ 30/10/2026 (sexta) — APORTE SEMANAL feito, régua cumprida

**R$ 100,00 → 18,20684 USDT** @ **5,4924** (par USDT/BRL, 14:19:14, taxa ZERO) → **0,00023571 BTC
bruto @ US$ 77.244**, taxa 0,00000023 (0,1%) → **0,00023548 líquido** (14:26:01, 7 min depois).

| | Antes | Depois |
|---|---|---|
| `contributions` out/26 | 4 linhas, US$ 128,06 | **5 linhas, US$ 146,27** |
| `holdings.BTC` | 0,00711206 / 498,04 | **0,00734754 / 516,23** |
| `stables.USDT` | 100,202988 / 824,45 | **100,219828 / 824,47** |
| `TOTAL_INVESTED` | 9.667,58 | **9.685,79** (+18,21, o aporte) |
| Fiscal `APORTADO_BRL` | R$ 38.232,97 | **R$ 38.332,97** |

As duas pernas, como sempre: **fiat→USDT é APORTE** (US$ 18,21 em `contributions`), **USDT→BTC é
ROTAÇÃO** (o custo migra, não conta de novo).

⚠️ **O CÂMBIO SALTOU 8,1% EM UMA SEMANA: 5,0822 (23/10) → 5,4924.** Os mesmos R$ 100 renderam
**US$ 18,21** contra US$ 19,68 na semana passada — US$ 1,47 a menos pelo mesmo dinheiro. Na régua de
R$ 50/semana isso é ~US$ 38/ano de poder de compra se o câmbio ficar aqui. Nada a fazer (ele aporta
em BRL), mas vale acompanhar: se o real continuar caindo, o DCA em dólar encolhe sozinho.

🔸 **Spread da OKX melhorou**: ela mostra o lado BRL como US$ 18,41 (comercial ~5,432) contra os
18,20684 entregues = **~1,2%**, contra os 2,9% de 16/10. Continua valendo medir o aporte pelo USDT
recebido, que é o que entra no site.


### ✅ 06/11/2026 (sexta) — APORTE feito, mas a compra de BTC ficou PENDENTE

**R$ 100,00 → 17,88726373 USDT** @ **5,5906** (par USDT/BRL, 14:49:14, taxa ZERO).
`contributions` +**US$ 17,89** · `stables.USDT` 100,219828 → **118,10709173** (invested 824,47 →
**842,36**) · `TOTAL_INVESTED` → **9.703,68** · Fiscal → **R$ 38.432,97** (USDT 3.143,94 un).

⏳ **Diferente das semanas anteriores, o USDT não virou BTC no mesmo minuto.** Ele deixou uma
**ordem de compra em aberto** e avisa quando bater. Até lá os 17,89 ficam como caixa em USDT na
OKX. **Quando executar é ROTAÇÃO** (o custo migra para o BTC), não aporte novo — o aporte já está
contado. Mesmo tratamento das ordens limite de 24/10.

⚠️ **O CÂMBIO JÁ SUBIU 10% EM TRÊS SEMANAS** e isso está corroendo o DCA em dólar:

| Sexta | Câmbio | R$ 100 viraram |
|---|---|---|
| 23/10 | 5,0822 | US$ 19,68 |
| 30/10 | 5,4924 | US$ 18,21 |
| **06/11** | **5,5906** | **US$ 17,89** |

São **US$ 1,79 a menos** pelo mesmo dinheiro em três semanas (−9,1%). Não há o que fazer do lado
da operação — ele aporta em reais —, mas se o real seguir nesse caminho a conversa vira o **tamanho
do aporte em BRL**, não o ritmo. A régua combinada (R$ 50) hoje compra US$ 8,94.

## Estado atual — 10/11/2026, à noite — 3 SWAPS NA QUEDA, CAIXA ZERADO

Poucas horas depois de fechar a pool, ele comprou a queda em três pernas. Palavras dele:
*"fiz mais 3 swaps agora nessa queda, com os 100$ que faltava também pra comprar, zerando o caixa
por enquanto"*.

| Ordem | Paga com | Recebe | Preço | tx |
|---|---|---|---:|---|
| 1 | 50,00 USDT | 0,0238 ETH | 2.100,84 | `0x4086...2e35` |
| 2 | **24,00 USDC** | 0,0114 ETH | 2.105,26 | `0x934c...2769` |
| 3 | 50,00 USDT | 0,0243 ETH | 2.057,61 | `0xba7c...2c10` (Uniswap V4) |
| | **124,00** | **0,0595 bruto** | **2.084,03** | gas 0,0001 ETH (US$ 0,23) |

Líquido no holding: **+0,0594**. Os 100 USDT eram os que estavam **reservados na ordem limite (b)**
criada em 24/10 (0,04564 ETH @ 2.191,11, venceria em 23/11) — ele não esperou a ordem, comprou a
mercado. A perna 2 é a que ele já tinha anunciado de manhã ("vou pegar as taxas em USDC e vou
comprar ETH").

### ⚠ O `invested` sobe 81,93, NÃO 124 — a parte que mais erra no automático
| | Antes | Depois |
|---|---:|---:|
| `holdings.ETH` | 2,747172553 / 5.618,17 | **2,806572553 / 5.700,10** |
| `stables.USDT` | 100,24709173 / 82,13 | **0,24709173 / 0,20** |
| `stables.USDC` | 24,00 / 0 | **0 / 0** |
| `TOTAL_INVESTED` | 9.703,68 | **9.703,68** ✓ |

Duas regras agindo juntas:
1. **Rotação migra o custo REAL, não o valor de mercado.** O USDT tinha 82,13 de custo para 100,25
   de qty (porque ~18 dos 100 sacados da AAVE em 24/10 eram **juro do aUSDT**, custo zero). Migra
   proporcional: `82,13 × (100 / 100,24709173) = 81,93`. Migrar 100 inventaria 18 dólares de custo.
2. **Os 24 USDC migram ZERO** — eram taxa da pool, entraram a custo zero. Mesma lógica do RDNT em
   08/10: rotação não cria custo do nada.

### ☀ Caixa em zero — observação, não alerta
Stables somam **US$ 0,25**. Não há mais pó seco na carteira nem na corretora; a próxima munição é
o aporte de sexta. A dívida restante (US$ 458, só Kamino, LTV 21,5%) está coberta pelo colateral
em SOL, então não há risco imediato — mas vale lembrar que **a AAVE está sem dívida desde 23/10**,
e por isso o card de HF da AAVE mostra "—" de propósito (não é bug).

### ⏳ Pendente no CoinGecko — a pendência do ETH agora tem QUATRO partes
`holding 2,806572553 − espelho 2,407841374 = 0,398931` (mais a saída de 100 USDT):

| O que | Qtd | Como lançar |
|---|---:|---|
| Fechamento da pool | 0,3384 | **Compra de US$ 742,37** (médio 2.194,36) |
| Compras com 100 USDT | 0,0481 | **Compra de US$ 100** + saída de 100 USDT |
| Perna paga com os 24 USDC | 0,0114 | **Entrada a custo ZERO** (taxa de pool) |
| Juro do aWETH | 0,001031 | **Entrada a custo ZERO** |

⚠ **Só as duas últimas são custo zero.** O `yield-to-mirror` chama a pendência inteira de
"transferência de entrada custo zero" — seguir isso inflaria o lucro em **US$ 842**. Nota gravada
no `cgMirror.ETH`. Depois de lançado, o espelho fica **0,0002 acima** do holding (o gas das duas
txs): diferença estrutural, igual à das taxas do BTC, não se persegue.
O `cgMirror.USDT` vai de 100,21982794 para **0,21982794**.

### Conferido no site
Patrimônio **US$ 8.014** · `8.472 SPOT + 0 LP + 0 STABLES − 458 DÍVIDA` ✓ · STABLES "USDT $0 ·
USDC $0 · USDS $0" · HF AAVE "—" (sem dívida lá) · Kamino LTV 21,5% · pools.html com 0 ativas,
fees 2026 YTD $170 e P&L +$106 · Meta 5% $401 · 152 testes · 0 NaN · 0 erro próprio de console.

---

## Estado atual — 10/11/2026 (`asOf` 2026-11-10) — POOL ETH/USDC v4 FECHADA

**Ele desmontou seguindo a regra das 24h** — nas palavras dele: *"esperei 24h depois que a pool saiu
do range, e desmontei como ela não voltou próximo"*. O ETH perdeu o piso (2.190,79) e saiu em 2.090,33.

**A tx (`modifyLiquidities`, Uniswap V4) devolveu +0,3384 ETH e +24,00 USDC:**

| | US$ | Em token |
|---|---:|---|
| Posição de volta | 685,51 | 0,328 ETH (100% convertida, 0 USDC) |
| Taxa em ETH | 22,46 | 0,011 ETH |
| Taxa em USDC | 24,00 | 24,00 USDC |
| **Earnings do painel** | **48,81** | = 22,46 + 24,00 + **2,35 de reward** |
| Gas | 0,18 | 0,0001 ETH |

⚠ **Os 2,35 USDC de reward NÃO vieram na tx** — claim separado, não lançados.

### Resultado: −US$ 11,15 em 12 dias (−1,5%), com fee APR REAL de 190,2% a.a.
`capital 743,12 − posição de volta 685,51 = IL 57,61` contra `46,46 de taxa` → **−11,15**.
A pool pagou **muita** taxa (190,2% a.a. realizado contra 50,25% projetado no print de 06/11) — o ETH
só caiu mais rápido do que ela compensava. ✅ **Funcionou como projetada:** era **pool de compra**,
entrou 100% USDC e saiu 100% ETH, comprando a queda inteira entre 2.347,75 e 2.190,79. O "IL" aqui
é o custo de ter comprado ETH na descida, que era a intenção.

### 💰 O custo migrou (a parte que mais erra se feita no automático)
| | Antes | Depois |
|---|---:|---:|
| `holdings.ETH` | 2,408872553 / 4.875,80 | **2,747172553 / 5.618,17** |
| `stables.USDT` | 100,24709173 / **824,50** | 100,24709173 / **82,13** |
| `stables.USDC` (novo) | — | **24,00 / invested 0** |
| `TOTAL_INVESTED` | 9.703,68 | **9.703,68** ✓ |

Os US$ 742,37 que estavam **estacionados** no `invested` do USDT desde 29/10 pousaram no ETH — mesmo
tratamento de 14/07/2026. A qty do ETH sobe **0,3383** (líquido do gas), não 0,3384.
O USDT fica com invested **abaixo** da qty (82,13 para 100,25) porque ~18 dos 100 sacados da AAVE em
24/10 eram **juro do aUSDT**, custo zero — normal, não é erro.

### 🔧 Mudança de código: o dashboard não enxergava um ticker novo
Acrescentar `USDC` ao `data.js` **não bastou**: o `PORTFOLIO_DATA` de `portfolio_analytics.html` é uma
lista estática e o override do `data.js` casa **por ticker** — ticker que não existe lá é ignorado em
silêncio. O card STABLES mostrava US$ 100 em vez de 124 e o patrimônio ficava US$ 24 abaixo.
Linha do USDC adicionada (`cgId:'usd-coin'`, logo conferido 200). **Lembrar disso na próxima stable
ou token novo.** `index`, `relatorio` e `pools` não precisaram: derivam de `stablesTotalUSD` /
`BaroloCore.netWorth`.

### Conferido no site
Patrimônio **US$ 8.197** · SPOT 8.531 + POOLS LP 0 + STABLES 124 − DÍVIDAS 458 = 8.197 ✓ · card da LP
em "— sem posição aberta" · STABLES "USDT $100 · USDC $24 · USDS $0" · pools.html com **0 ativas**,
fees 2026 YTD **$170** e P&L **+$106** · Meta 5% = $410 · 0 NaN, 0 erro de console.

### ⏳ Pendente com ele
1. **Lançar no CoinGecko:** compra de **0,3384 ETH por US$ 742,37** (médio **2.194,36**) — é **compra
   com custo**, não entrada a custo zero. ⚠ O `yield-to-mirror` chama a pendência inteira de
   "transferência de entrada custo zero"; seguir isso inflaria o lucro em US$ 742. Nota gravada no
   `cgMirror.ETH`.
2. **Os 24 USDC viram ETH** quando a ordem dele bater → **rotação de custo ZERO** (é taxa de pool), ou
   seja, entrada a custo zero no CoinGecko e `invested` do ETH **não** sobe.
3. **2,35 USDC de reward** da pool sem claim.

---

## Estado atual — 09/11/2026 — print do CoinGecko: compra lançada, espelho acertado

**Ele lançou a compra de BTC** (print do portfólio, 11 tokens). Conferência token a token:

| | Site | CoinGecko | Leitura |
|---|---:|---:|---|
| BTC | 0,00758610 | **0,00758942** | ✅ lançou a qty **bruta** (0,00735063 + 0,00023879, exato) e **com custo** — o GP do print dá custo implícito 534,03 contra 534,09 do site, 6 centavos. A diferença de 0,00000332 é a soma das taxas: estrutural, **nunca se lança**. |
| USDT | 100,24709173 | 100,21982794 | ✅ inalterado de propósito: ele **não** lançou nem a entrada do aporte (+17,89) nem a saída (−17,86), e como quase se cancelam o saldo segue certo. Os 0,027 de diferença são **exatamente** a sobra do aporte no caixa da OKX. |
| ETH | 2,408872553 | 2,407841374 | +0,001031 — yield segurado para o fechamento |
| SOL | 25,90 | 25,85735038 | +0,04265 — idem |
| POL | 190,13 → **190,113** | 190,113 | 🔸 corrigido no site: o print de 01/09 foi lido com uma casa a menos. Sem transação de POL no meio — é leitura, não movimento. US$ 0,0015. |
| ADA · EIGEN · ZK · XAI · ZETA · SCR | | | ✅ batem na casa decimal |

`cgMirror` acertado (BTC 0,00758942 · USDT 100,21982794). **Pendente volta a ser só o yield real:
ETH US$ 2,19 + SOL US$ 3,69 = ~US$ 5,88**, acumulando por decisão dele.

⚠️ **O total em USD do print não fecha com preço × qty** (~0,35% em todos os tokens): as colunas de
valor foram calculadas com preços mais antigos que a coluna de preço, com o mercado caindo ao vivo.
**Conferir sempre por quantidade, nunca pelo total em dólar do print.**

**Topo do dashboard (regra 0):** HF AAVE "—" + *"sem dívida na AAVE"* · Lifetime −19,3% · Yield
+$13 líq. · Patrimônio **US$ 8.451** (ROI +1,7%) · Dívida US$ 458 (Kamino). Aditivo: 8.033 + 776 +
100 − 458 = **8.451** ✓. Zero erro de console.

---

## Estado atual — 08/11/2026 (`asOf` 2026-11-08) — a ordem de sexta pegou no alvo

**Único evento:** a **ordem limite de BTC** deixada na sexta 06/11 (com os 17,89 USDT do aporte daquele
dia) **executou no domingo 08/11, 18:54:39**: 0,00023879 BTC @ **US$ 74.906**, taxa 0,00000023 BTC
→ **líquido 0,00023856**, custo **US$ 17,86**.

| | Antes | Depois |
|---|---:|---:|
| `holdings.BTC` qty / invested | 0,00734754 / 516,23 | **0,00758610 / 534,09** |
| `stables.USDT` qty / invested | 118,10709173 / 842,36 | **100,24709173 / 824,50** |
| `contributions` | 1 linha em nov (US$ 17,89) | **inalterada** |
| `TOTAL_INVESTED` | 9.703,68 | **9.703,68** (rotação pura) |

⚡ **ROTAÇÃO, não aporte** — o dinheiro novo foi contado quando o fiat virou USDT em 06/11. Esta perna
só move o custo de bolso. Nenhum protocolo tocado: AAVE, Kamino, pool e principals seguem como no
review de 06/11.

✅ **A ordem fez o que devia:** comprou a **US$ 74.906** contra 77.244 da semana anterior — ~3% mais
barato. Era exatamente o motivo de deixar ordem em aberto em vez de comprar a mercado.

**Caixa da OKX:** 17,887 → **0,027**. Os outros ~100,22 USDT **não são caixa livre**: 100 seguem
reservados na ordem limite (b) da Uniswap (0,04564 ETH @ 2.191,11, vence 23/11) e 0,22 são sobras.

**Topo do dashboard conferido (regra 0):** HF AAVE "—" + *"sem dívida na AAVE"* · LTV Kamino 20,4% ·
Lifetime Return −19,2% · Yield +$13 líq. · Patrimônio **US$ 8.463** (ROI +1,9%) · Dívida US$ 458
(só Kamino). Os 4 cards fecham aditivos: SPOT 8.045 + POOLS LP 776 + STABLES 100 − DÍVIDAS 458 =
**8.463** ✓. Zero erro de console. **A pool já acumulou US$ 45,13 de taxas** (pooled 730,48).

⏳ **Ele vai lançar no CoinGecko** ("agora vou por no coingecko tambem"). São **três** lançamentos,
não dois: entrada do aporte (+17,89 USDT), compra do BTC (+0,00023879 **bruto**) e saída dos 17,86
USDT. Se lançar só a compra e a saída, o USDT fica negativo. **Pedir print do portfólio** antes de
acertar o `cgMirror` — lição de 24/10 (ele disse 0,04332 e tinha lançado 0,0433).

---

## Estado atual — 06/11/2026 (`asOf` 2026-11-06) — review semanal: dia vermelho, posição intacta
**Juros da AAVE neste review (base da regra 4 no próximo):** WETH **0,022523655** — ⚠️ **derivado do
print, sem MCP da Aave nesta sessão** (mesma conta de 31/10): `(5.312,58 − 50,33) / 2,354959342722521912`
dá o preço do oráculo **US$ 2.234,54**; `50,33 / 2.234,54 = 0,022523655`; principal + isso = **2,377483**
e o card mostra **2,3775** ✓. **Conferir contra o MCP no próximo review.**

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | **2,377484** | 1,71% (estável) | 2,354959342722521912 (inalterado) |
| AAVE USDT supply | 0 — sacado em 29/10 | — | 0 |
| AAVE USDC borrow | 0 — quitada em 23/10 | — | 0 |
| Kamino SOL supply | **25,90** | **4,44%** (era 3,78%) | 24,408301673 (inalterado) |
| Kamino USDC borrow | **457,95** | **5,41%** (era 5,65%) | 378,599493 |

**Prints recebidos (5):** AAVE colateral, Kamino SOL/BTC, portfólio CoinGecko, portfólio OKX e,
mandado logo depois, a **pool ETH/USDC v4**. **Faltou só o print de aporte.**

### Semana sem movimentação — só preço e juro
Os dois principals batem com o `data.js` na casa decimal, então **não houve depósito, saque nem
reempréstimo**. Tudo que mudou foi preço de mercado e juro corrido.

✅ **O 25,90 da Kamino tem 2 casas no card, mas DOIS cruzamentos independentes caem exatos nele:**
liq. price `457,86 / (25,90 × 0,80)` = **US$ 22,10** ✓ (o card mostra 22,10) e LTV
`457,86 / (25,90 × 90,07)` = **19,63%** ✓ (o card mostra 19,63%). Não é arredondamento solto.

✅ **A OKX confirma o saque total de SOL de 04/11:** o print do portfólio **não lista SOL** — só BRL,
BTC, BABY, USDT e ETH. Então holding = supply da Kamino. ⚠️ **Mesmo assim o yield segue entrando por
DELTA** (regra 4): se ele comprar SOL fora de novo, igualar ao supply apagaria a compra.

✅ **Conciliação site × CoinGecko × OKX fecha nos 11 tokens.** 8 batem na casa decimal; os 3 que
divergem são exatamente as pendências conhecidas:
- ETH **+0,001031** e SOL **+0,04265** = o yield que ele está segurando para lançar no fechamento;
- BTC **−0,00000309** = a taxa das compras (CoinGecko conta bruto, site líquido), **nunca se lança**.
- **OKX BTC 0,00733256** vs site 0,00734754 = **0,00001498**, idêntico ao 0,00001497 documentado em
  02/10 (taxas das compras antigas) — confirma que não houve compra de BTC não registrada.

### ⚡ A pool seguiu comprando a queda — 74,39% em ETH
Print de 06/11, 8 dias de pool, **IN RANGE** (market 2.229,80 · range 2.190,79–2.347,75).

| Pool ETH/USDC v4 | Abertura 29/10 | 31/10 | **06/11** |
|---|---|---|---|
| Composição | 100% USDC | 62,32% ETH | **74,39% ETH** (0,243 ETH + 187,10 USDC) |
| Pooled | 743,12 | 733,29 | **730,48** |
| Fees não coletadas | 0 | 28,50 | **45,13** (0,010 ETH + 22,59 USDC) |
| IL (capital − pooled) | 0 | 9,83 | **12,64** |
| PnL | 0 | +18,67 | **+32,49 (+4,37% em 8 dias)** |

**Reconciliação fecha:** os Earnings do painel (US$ 47,47) são fees 45,13 + rewards 2,35 = 47,48,
1 centavo de arredondamento; os percentuais recalculados batem com os do print (47,47/47,58/4,95
contra 47,48/47,58/4,94); 543,38 + 187,10 = 730,48 = Position ✓; e o `pnl` confere pelos dois lados
(`pooled + fees − capital` = `fees − il` = 32,49).

🔸 **O reward de 2,35 USDC continua fora** — só entra quando resgatado, mesma regra da AAVE e da
Kamino.

⚠️ **`apr`/`poolApr`/`feeApr` seguem os da abertura (72,09 / 50,25).** O print da posição v4 **não
traz APR nenhum** — então o pedido de 31/10 ("pedir o APR do painel") não tem como ser atendido por
esta tela. O realizado em 8 dias anualiza para **~277%/ano** (45,13 / 743,12 / 8 × 365), alto demais
para publicar como se fosse taxa. **Decisão do Lucas se quer o realizado no site.**

### 🔗 Link do par registrado — e 4 coisas erradas no card da pool
Ele mandou a página do par (`app.uniswap.org/explore/pools/ethereum/0x9831…`) e **fez questão de
frisar: é o link do PAR, não da posição dele.** Guardado em `data.js → defi.uniswapV3.pairUrl`.
✅ **Pode ir em link público:** o `0x98…` é o *poolKey* da v4 (32 bytes) e identifica o **mercado**
ETH/USDC, como qualquer par. A política de privacidade proíbe **endereço de carteira e ID de
posição** em URL — não o id de um par. A posição dele segue só atrás de `/positions`.

Ao procurar onde encaixar o link, o card da LP em `pools.html` estava **se contradizendo**: o
cabeçalho dizia *WETH/USDG 0.01% · Robinhood Chain* (pool fechada em agosto) enquanto o badge ao
lado, esse sim vindo do `data.js`, dizia *ETH/USDC v4 · Ethereum*. Quatro trechos eram HTML fixo que
o script de sincronia nunca tocava:

| O que mostrava | Agora |
|---|---|
| `⬡ WETH/USDG` / `0.01% · Robinhood Chain` | **ETH/USDC v4** / Dynamic · VolatilePairHook · Ethereum |
| sub do APR: *"ciclo 26/08-28/08 fechado 0 a 0"* | **fee APR do painel na abertura (29/10/2026)** |
| CUSTO BORROW AAVE **−3,79%** · APR LÍQUIDO **−3,79%** | **0,00%** · **+50,25%** |
| sub do link: *WETH/USDG · Robinhood Chain* | **ETH/USDC v4 · … · página do par** |

⚠ **A causa do custo de borrow travado era um `||` comendo o zero legítimo:**
`(... apy * 100) || null`. Com a dívida da AAVE **quitada em 23/10** o APY é `0`, que é falsy, virava
`null`, o bloco inteiro era pulado e o card ficava nos **−3,79% de agosto** — mostrando a pool como
se estivesse perdendo 3,79% a.a. quando não há dívida nenhuma por trás dela. Trocado por teste de
existência. O badge também parou de repetir o nome do par (agora: *POSIÇÃO ABERTA — desde 29/10/2026
(8 dias)*), e o link de baixo aponta para o par; `/positions` continua no botão do cabeçalho.
**Os dois caminhos foram testados no navegador** — pool aberta e pool fechada (simulada).

### Números
- **Patrimônio líquido US$ 8.824** (ETH 2.237,26 · SOL 90,07 · BTC 75.880,01) contra US$ 9.088 em
  04/11 = **−US$ 264 (−2,9%)**, **tudo preço**. Dia vermelho: o CoinGecko marca −5,9% em 24h
  (ETH −7,6% · SOL −6,5% · BTC −5,4%). A pool amorteceu: subiu de US$ 762 para **US$ 776** no card
  (pooled 730,48 + fees 45,13) enquanto o SPOT caiu.
- Dívida **US$ 457,95**, só Kamino. **Sem HF na AAVE** (sem dívida). Kamino LTV **19,63%**
  (era 19,06%) · liq. LTV 80% · **SOL liquida em US$ 22,10** (−75,5%), era 22,77.
  O LTV subiu e o preço de liquidação caiu **sem dívida nova** — foi o SOL encolhendo o colateral.
  Dívida/patrimônio **5,2%**.
- **Carry +US$ 14,15/mês** — supply US$ 194,53/ano (AAVE WETH 90,96 + Kamino SOL 103,58) − borrow
  US$ 24,78/ano. Colateral: AAVE US$ 5.319 · Kamino US$ 2.333.
- **Borrow da Kamino cedeu pela 4ª semana seguida:** 8,88% → 6,06% → 5,65% → **5,41%**.
- **Yield pendente no CoinGecko: US$ 6,15** (ETH +0,001031 = US$ 2,31 · SOL +0,04265 = US$ 3,84).
  ⏸ **Segurando por decisão dele** (31/10) — lançar no fechamento; **não igualar o `cgMirror`** antes
  de ele confirmar. O card já soma só os positivos e marca o BTC como "não lançar".
- Rewards parados: Kamino **KMNO US$ 5,54** (era 5,18) + PYUSD US$ 0,07 · Uniswap 2,35 USDC ·
  Merkl/AAVE 1,47 USDC. Nenhum lançado (regra: só entra quando resgatado).
- Kamino **Interest Earned lifetime +US$ 183,10** (era 181,63 em 31/10).

### Para o próximo review
- ⚠️ **Aporte de sexta ainda não apareceu** — último foi **30/10** (US$ 18,21), há **7 dias**;
  `contributions` de novembro está **vazia**.
- 🔸 **A ordem limite (b) está a 2,1% de executar:** 100 USDT reservados na carteira EVM para comprar
  0,04564 ETH @ **US$ 2.191,11**, e o ETH fechou em **2.237,26** depois de cair 7,6% em 24h.
  **Vence 23/11/2026.** Quando executar é **ROTAÇÃO** (o custo migra do USDT para o ETH), nunca aporte.
  É aqui que vivem os ~100,22 USDT do site — a OKX tem só 0,00027.
- 🔸 **BABY (Babylon) subiu 29,20272757 → 31,69777122** na OKX (+2,49, provável recompensa de stake).
  Segue **US$ 0,36** — dust, fora do site pelo mesmo critério dos 0,74 USDC e do gas.
- 🔸 **CF do WETH na AAVE está em 84%** (subiu de 83% em 31/10), mas a regra 13 deste caderno e o
  `lendingSnapshot` do `data.js` usam **83%**. **Sem efeito hoje** (sem dívida na AAVE → HF null),
  mas subestimaria o HF se ele voltar a tomar emprestado lá. Anotado em `agentes/bugs.md`.
- ✅ **Topo do dashboard conferido (regra 0)**, com os preços do print: `ev-net` $8.810 ·
  `ev-debt` $458 · `ev-lev` 5,2% · `ev-hf-aave` "—" com "sem dívida na AAVE" · `ev-hf-kamino` 19,6% ·
  `ev-yield` +$14 líq. · `s-spot` $8.406 · `s-pool` **$776** · `s-debt` −$458 "Kamino USDC" ·
  `s-stables` $100. Os 4 cards somam **8.406 + 776 + 100 − 458 = 8.824** ✓ (reconferido depois de
  lançar a pool).

## Estado atual (ANTERIOR) — 04/11/2026 (`asOf` 2026-11-04) — ele está consolidando: SOL da OKX → Kamino, ETH da carteira → AAVE
**Juros da AAVE neste review (base da regra 4 no próximo):** WETH **0,02230989757338056**
(o USDT foi todo sacado em 29/10 — não há mais delta de USDT).

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,377269240295902472 | 1,71% | **2,354959342722521912** (+0,065219 hoje) |
| AAVE USDT supply | 0 — sacado em 29/10 | — | 0 |
| Kamino SOL supply | **25,13** (antes do depósito) | 3,78% | 23,645990 (**pendente**) |
| Kamino USDC borrow | 457,82 | 5,65% (do print anterior) | 378,599493 |

**Palavras dele:** *"tirei os SOL da OKX e to colocando na KAMINO"* e *"dos $200 em ETH que eu
tinha na carteira, coloquei 75% na AAVE também"*.

### 1. ETH: depósito de 0,0652 na AAVE ✅ CONFIRMADO on-chain
Print de sucesso: **0,0652 ETH (US$ 151,15)**, 04/11 09:44, block **26341531**, taxa de rede
US$ 0,08, APY 1,71%. O MCP confirma: principal **2,289740094733585726 → 2,354959342722521912**,
delta **0,065219247988936186** — e o juro passou a **0,02230989757338056 @1,7123%** (o print diz
1,71% ✓).

⚡ **Depósito não muda o holding** — o ETH só sai da carteira e entra no supply, e holdings já
incluem o colateral. Mudam `defi.aave.supply.WETH` e `principals.aave.WETH`. O holding subiu só
**+0,000428** (juro desde 31/10). Mesmo tratamento do depósito de 0,08 ETH em 18/09/2026.
⚠️ **O principal TEM de subir junto**: sem isso o depósito apareceria como juro ganho (bug de
14/08/2026). Conferido: o juro exibido ficou **0,022310**, não 0,087.

🔸 **Sobrou 0,031390 ETH fora da AAVE** (~US$ 73) = carteira ~0,0296 + Yearn 0,0018. Ele falou em
"75% dos US$ 200"; pelo on-chain foram **69% de US$ 220** — estimativa de cabeça, sem impacto.

### 2. SOL: saque da OKX feito, depósito na Kamino ⏳ PENDENTE DE CONFIRMAÇÃO
O print é a tela de **confirmação** (botão carregando, setas de simulação: Net Value 1,87K → 1,94K ·
LTV 19,64% → 19,06% · Collateral 2,33K → 2,40K). **O depósito em si não foi lançado.**

**O que JÁ foi lançado, porque independe do depósito:**
- `holdings.SOL` **25,88735038 → 25,892311673** = **+0,01** de yield da Kamino (supply 25,12 → 25,13)
  **−0,005038707** de taxa de saque da OKX (os 0,76735038 de lá chegaram como **0,762311673** na
  carteira, campo "Available" do print). Yield a custo zero; a taxa reduz a qty e não o `invested`.
- Conferência fecha na casa decimal: 25,13 + 0,762311673 = **25,892311673** = o holding.
- ⚠️ **A composição do SOL mudou**: era Kamino + **OKX**, agora é Kamino + **carteira Solana**.

✅ **CONFIRMADO por ele no mesmo dia.** supply → **25,892311673**, `principals.kamino.SOL` →
**24,408301673**, LTV → **19,06%** (o valor que o card simulava). O juro retido seguiu em
**1,484010 SOL**, idêntico ao de antes do depósito — prova de que o principal subiu junto e os
0,7623 não viraram "rendimento".

🔸 **A carteira Solana zerou** (ele usou o Max), então o holding voltou a ser igual ao supply da
Kamino, como era antes de 07/10. **Mesmo assim o yield continua entrando por DELTA** (regra 4), não
igualando: se ele comprar SOL fora de novo, igualar apagaria a compra. A regra não volta atrás.

⚠️ **Um teste quebrou e foi o TESTE que estava errado**, não o dado. `tests/chain.test.js` exigia
que `defi.kamino.supply.SOL.qty` ficasse a 1% da **fixture gravada em 14/09/2026** — um retrato que
nem o USDS encerrado reflete. Passava por coincidência (0,6%) e o depósito levou para 3,7%. O teste
agora compara o parser com o valor da própria fixture, que é o que ele existe para provar; conferir
se o `data.js` está em dia é papel do `/prints` (MCP + print), não de um teste de unidade.

🔸 **A tela da Kamino agora se chama "SOL/BTC Market"** (antes era só o market principal). Os
números batem com a nossa posição (dívida 457,82, supply 25,13), então é a MESMA, só renomeada ou
reorganizada por eles. Conferir no próximo print.

- **Patrimônio US$ 9.088** — SPOT $8.684 + pool $762 + stables $100 − dívida $458. Cards fecham ✓
  (regra 0 conferida). Sem HF na AAVE (sem dívida) · Kamino LTV 19,6%, liq. LTV 80%.
- Rewards parados: PYUSD US$ 0,07 (Kamino) + US$ 1,47 (Merkl/AAVE), não lançados.

## Estado atual — 31/10/2026 (`asOf` 2026-10-31) — review semanal: a POOL ENTROU NO RANGE e já comprou 62% em ETH
**Juros da AAVE neste review (base da regra 4 no próximo):** WETH **0,021881502** · USDT **0** (sem supply
desde o saque de 29/10 — não há delta de USDT para aplicar).

⚠️ **Sem MCP da Aave nesta sessão** — o juro do WETH foi **derivado do print**, não lido do MCP:
`deposits 5.192,34 − earnings 49,15 = 5.143,19`, dividido pelo principal `2,289740094733585726` dá o
preço do oráculo **US$ 2.246,19**; `49,15 / 2.246,19 = 0,021881502`. Soma com o principal: **2,311621502**,
e o card mostra **2,3116** ✓. **No próximo review, conferir esse 0,021881502 contra o MCP** — se divergir,
o delta do ETH desta semana (+0,000389422) foi estimado com 1–2 casas a menos de precisão.

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,3116215 | **2,43%** (era 1,59%) | 2,289740094733585726 (inalterado) |
| AAVE USDT supply | 0 | — | 0 |
| AAVE USDC borrow | 0 — quitada em 23/10 | — | 0 |
| Kamino SOL supply | **25,12** | **3,72%** (era 4,05%) | 23,645990 |
| Kamino USDC borrow | **457,56** | **5,65%** (era 6,06%) | 378,599493 |

**Prints recebidos (5):** carteira/CEX (OKX), portfólio CoinGecko, pool Uniswap v4, Kamino, AAVE.
O print da AAVE veio **cortado na seção de colateral** — só aparece "Borrowing Opportunities" abaixo,
que é o que a tela mostra quando não há empréstimo. Consistente com `borrow 0` desde 23/10.

⚡ **A POOL ENTROU NO RANGE E FEZ O QUE FOI DESENHADA PARA FAZER.** Abriu em 29/10 100% USDC com o ETH a
2.348,87 (fora do range por cima); o ETH caiu para **2.248,51** e em 2 dias a posição está **in range** e
**62,32% convertida em ETH** — 0,203 ETH (US$ 457,01) + 276,28 USDC. É o oposto do ciclo de 26/08, que
fechou 0 a 0 porque o ETH nunca voltou ao range.

| Pool ETH/USDC v4 | Abertura 29/10 | Hoje 31/10 |
|---|---|---|
| Composição | 100% USDC | **62,32% ETH / 37,68% USDC** |
| Pooled | 743,12 | **733,29** |
| Fees (não coletadas) | 0 | **28,50** (14,58 ETH + 13,92 USDC) |
| Rewards | 0 | 2,35 USDC — **não lançado** (não resgatado) |
| PnL | 0 | **+18,67 (+2,5% em 2 dias)** |

`il` 9,83 = `capital − pooled`: é a divergência de ter comprado ETH enquanto ele caía, medida contra ter
ficado 100% em USDC. **As taxas cobriram quase o triplo disso.**
🔸 `apr`/`poolApr`/`feeApr` seguem os do painel da **abertura** (72,09 / 50,25) de propósito: 28,50 em 2
dias anualiza para **~700%**, que é ruído e não taxa. **Pedir o APR do painel no próximo print.**

🔸 **O reward de 2,35 USDC fica de fora** pela mesma regra dos rewards da AAVE e da Kamino: só entra
quando for resgatado. Somando os três da casa, há **US$ 7,60 de reward não resgatado** (Uniswap 2,35 +
Kamino KMNO 5,18 + PYUSD 0,07) mais os **1,47 USDC da AAVE** parados na Merkl.

✅ **A melhor validação que a linha do SOL já teve.** O holding passou a 25,88735038 pelo delta do supply
(25,09 → 25,12) e isso **fecha exato contra a corretora**: Kamino 25,12 + OKX 0,76735037 (print de hoje)
= **25,88735037**, diferença de 1e-8. A regra nova de 07/10 (SOL por delta, não por igualar ao supply)
está confirmada na prática.

✅ **`cgMirror` conferido contra print** — os 11 tokens batem. ETH acertado para **2,407841374** (o site
vinha com 3 casas a menos, 0,000000374, fração de centavo): isso **resolve o alerta de 30/10** de que o
espelho tinha sido acertado sem print.

- **Patrimônio líquido US$ 9.006,51** (ETH 2.249,52 · SOL 95,96 · BTC 77.395) contra US$ 9.299 em 29/10 =
  **−US$ 292 (−3,1%)**, tudo preço. Dívida **US$ 457,56**, só Kamino. **Sem HF na AAVE.** Kamino LTV
  **18,99%** (era 17,52%) — subiu sem dívida nova, foi o SOL caindo; **SOL liquida em US$ 22,77** (−76,3%),
  valor que a Kamino agora mostra direto no card. Dívida/patrimônio **5,1%**.
- **Carry +US$ 15,85/mês** (supply 216,03/ano − borrow 25,85/ano). Colateral da AAVE é só WETH, US$ 5.200.
- **Yield pendente no CoinGecko: ~US$ 3,76** (ETH +0,000389 · SOL +0,03). BTC −0,000003 é a taxa das
  compras, **nunca se lança**.
- ⏸ **SEGURANDO O LANÇAMENTO POR DECISÃO DELE (31/10/2026)**, palavras dele: *"pode segurar esses
  valores que tem que lançar no coingecko vou lançar no final do mês pode deixar no site que esta
  pendente"*. ⚠ **NÃO igualar o `cgMirror` ao holding até ele CONFIRMAR que lançou** — ele quer a
  pendência visível no card para usar como lista no fechamento. Registrado também no comentário do
  `cgMirror` no `data.js`, para nenhuma sessão futura zerar por hábito.
  ✅ **RESOLVIDO em 31/10/2026, a pedido dele ("pode somar só os positivos no card"):** o total do
  card e o do `yield-to-mirror` passaram a somar **só os deltas positivos**. Antes o card dizia
  "$3,47 a lançar" em vez de $3,71 porque a linha do BTC entrava **negativa** no total (−US$ 0,24).
  Delta negativo nunca é yield — é a qty bruta vs líquida das compras (taxa) ou um lançamento
  faltando — e **não se lança**, então somá-lo dava um número que ele não podia usar como lista.
  As linhas negativas continuam visíveis (são informação) e agora levam um **"não lançar"** em
  vermelho, para o total fechar com o que está listado. Os dois lugares (card e script) têm que
  seguir concordando — se mexer em um, mexer no outro.
- 🔸 **BABY (Babylon) 29,20272757 — US$ 0,36 — aparece na OKX e não está em lugar nenhum do site.** Dust,
  mesmo critério dos 0,74 USDC e do gas. Só vale lançar se um dia crescer.
- ✅ **Topo do dashboard conferido (regra 0)** com preços injetados: `ev-net` $9.007 · `ev-debt` $458 ·
  `ev-lev` 5,1% · `ev-hf-aave` "—" com "sem dívida na AAVE" · `ev-hf-kamino` 19,0% · `ev-yield` +$16 líq.
  · `s-spot` $8.602 · `s-pool` $762 com o nome da pool v4 · `s-debt` −$458 "Kamino USDC" · `s-stables` $100.
  Os 4 cards somam: 8.602 + 762 + 100 − 458 = **9.006** ✓

## Estado atual (ANTERIOR) — 29/10/2026 (`asOf` 2026-10-29) — AAVE sem USDT e POOL NOVA ETH/USDC v4
**Juros da AAVE neste review (base da regra 4 no próximo):** WETH **0,021492079899159378** ·
USDT **29,218990** (o USDT foi todo sacado — no próximo review não há delta de USDT para aplicar).

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,311232174632745104 | 1,59% | 2,289740094733585726 (inalterado) |
| AAVE USDT supply | **0 — sacado por inteiro** | (marcava **13,11%** na hora) | **0** |
| AAVE USDC borrow | 0 — quitada em 23/10 | — | 0 |
| Kamino SOL supply | 25,09 | 4,05% | 23,645990 |
| Kamino USDC borrow | 456,71 | 6,06% | 378,599493 |

**Palavras dele:** *"Retirei os USDT da Aave para montar uma pool de compra de ETH na uniswap v4,
anotei meus pensamentos e tudo no notion, no diario de DeFi."*

**Sequência (29/10, Ethereum):** 17:12 withdraw **755,119968 USDT** (tx `0x73ed...1a04`, MCP
confirma e o item de USDT sumiu do spoke) → approve Velora → swap por **742,37 USDC**
(tx `0xe685...a22e`) → approve Permit2 → multicall Uniswap v4 com **743,12 USDC**
(tx `0xbe2c...e927`). Gas das 5 txs ~US$ 1,14, não descontado.

**A pool** (`defi.uniswapV3` + 1ª linha do `poolHistory`): **ETH/USDC v4 · Ethereum · Dynamic ·
VolatilePairHook**, capital **US$ 743,12**, range **2.190,79–2.347,75**, market 2.348,87 →
**fora do range por cima, 0% ETH / 100% USDC**. APR do painel **72,09%** = 50,25% de taxa (24h) +
21,85% de reward em USDC. Fees earned US$ 0 (recém-aberta).

⚡ **É pool de COMPRA — a inversão da saída gradual.** Entra 100% USDC e vira ETH conforme o preço
CAI dentro do range; preço médio se percorrer tudo: **~US$ 2.268**. Enquanto o ETH não recuar
abaixo de 2.347,75 ela não compra nem gera taxa. ⚠️ **Mesma tese do ciclo de 26/08 que fechou 0 a 0**
(o ETH nunca voltou ao range) — a diferença é que agora o range começa 0,05% ABAIXO do mercado,
não 0,04% acima.

⚡ **Contabilidade: a qty sai, o `invested` FICA.** `stables.USDT` 854,895114 → **100,202988**, mas
`invested` segue **824,45**. A qty sai porque a pool já é contada em `uniswapV3.pooled` (dupla
contagem); o custo fica porque `uniswapV3` não tem campo de custo e baixá-lo derrubaria o
`TOTAL_INVESTED` em 755, inflando o ROI por artefato. É o mesmo tratamento do ETH em 14/07/2026
(o custo só migrou no fechamento). **Conferido: `TOTAL_INVESTED` segue 9.667,58.** O USDT fica com
qty 100,20 e custo 824,45 até a pool fechar — esperado, não é erro.

🔸 **Os 743,12 são 742,37 do swap + 0,74 USDC** que sobraram da quitação de 23/10 e estavam fora da
contabilidade. Correção de registro, não ganho.

⚠️ **O SWAP CUSTOU 1,58% (US$ 11,91)** — 755,119968 USDT valiam US$ 754,28 (USDT a 0,99889) e
vieram 742,37 USDC. Em stable→stable o normal é 0,01–0,05%. **É a segunda vez**: em 02/10 a troca de
USDS por USDC custou ~1,6%. Não é slippage de liquidez (USDT/USDC é dos pares mais profundos que
existem) — é taxa de roteador/interface. **Vale testar Curve ou Uniswap direto no próximo.**

🔸 **Ele abriu mão de 13,11% de APY no supply do USDT** (era 3,23% em 24/10 — o pico veio da
utilização) para entrar numa pool de 72% nominal. Faz sentido pela régua, mas os 72% só valem se o
ETH entrar no range; fora dele, a posição rende **zero** contra os 13,11% garantidos que havia.

- **Patrimônio líquido US$ 9.299** (ETH 2.327) · dívida só Kamino **456,71** · sem HF na AAVE ·
  Kamino LTV 18,1% (SOL liquida em ~US$ 22,75) · **colateral da AAVE agora é só WETH**.
- **Yield pendente no CoinGecko: ~US$ 12,71** (ETH +0,002958 · SOL +0,058135) **mais a SAÍDA de
  754,69 USDT**, que ele ainda não lançou. ⚠️ O relatório vai acusar USDT **−754,69** até lá — é a
  pool, não erro. BTC −0,000003 é a taxa das compras, não se lança.
- 📌 **Ele pediu**: *"Depois com o decorrer da pool, peço pra vc preencher o controle da pool que
  criamos recentemente lá no notion"* — há uma página de controle de pool no Notion para preencher
  conforme a posição andar. Não é para agora.


### ⚠️ 29/10 — REWARDS da AAVE: existem, são SEPARADOS do juro e NÃO foram resgatados

Ele perguntou se os rewards já estavam nos tokens sacados. **Juro sim, reward não** — são dois
mecanismos diferentes e vale não confundir de novo:

| | O que é | Onde está | No site? |
|---|---|---|---|
| **Juro do aToken** | o saldo cresce sozinho | **dentro** dos 755,119968 sacados | ✅ sim |
| **Reward (Merkl)** | incentivo pago à parte, em USDC | contrato da Merkl, **não resgatado** | ❌ não |

**Juro — conferido e fecha na casa decimal.** `get_position_items` dá juro final **29,218990** no
USDT; a reconciliação de 22/08/2026 partiu de 17,19. A soma dos **13 lançamentos semanais** feitos
desde então (3,727508 + 0,959374 + 0,490194 + 0,041350 + 1,577728 + 0,713205 + 0,528182 + 1,422459
+ 1,057815 + 1,015221 + 0,004710 + 0,063402 + 0,427842) = **12,028990**, e 29,218990 − 17,19 =
**12,028990**. Nada escapou. Mesma coisa no WETH, cujo juro (**0,021492079899159378**, ~US$ 50)
continua na AAVE rendendo — só o do USDT saiu com o saque.

**Reward — `get_user_rewards` (29/10/2026): 1,467188 USDC (~US$ 1,47) claimable.** A v4 mostra como
5 janelas semanais de 27/08 a 01/10 (~0,2929 cada) e a v3 devolve o total agregado já com a
transação de claim pronta — é o MESMO reward em duas visões, não some os dois.
- **Não lançar no `data.js`** enquanto não for resgatado (mesma regra dos rewards da Kamino).
- 🔸 **Pode não compensar resgatar**: é Ethereum mainnet, e o gas de um claim costuma comer boa
  parte (ou tudo) de US$ 1,47. Deixar acumular e resgatar junto com outra operação é mais barato.
- As janelas pararam em 01/10 — provavelmente o programa de incentivo do USDT acabou; agora que o
  supply de USDT é zero, não deve gerar mais.

## Estado atual (ANTERIOR) — 24/10/2026 (`asOf` 2026-10-24) — saque de 200 USDT da AAVE, 2 ordens limite de ETH e a PRIMEIRA já executou
**Juros da AAVE neste review (base da regra 4 no próximo):** WETH **0,020961978554540399** · USDT **28,791148**

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,310702073288126125 | 1,64% | 2,289740094733585726 (inalterado) |
| AAVE USDT supply | 754,692126 | 3,23% | **725,900978** (−200 no saque de hoje) |
| AAVE USDC borrow | **0 — quitada em 23/10** | — | 0 |
| Kamino SOL supply | 25,09 | 4,05% | 23,645990 |
| Kamino USDC borrow | 456,71 | 6,06% | 378,599493 |

**Palavras dele:** *"tirei $200 USDT na aave e fiz 2 ordens limits pra comprar mais a baixo... ainda nao
lancei no coingecko, vou esperar confirmar as ordens e dai retiro os USDT e coloco os tokens"*.

**O saque** (MCP `get_user_activity`, único movimento do dia): **200 USDT**, 24/10 **14:41:35 UTC**,
tx `0xf25c138e...aec00`, US$ 199,7242, gas 0,0001 ETH (US$ 0,19). O principal caiu exatamente 200 —
925,900978 → **725,900978**, MCP confere na casa decimal.

⚡ **Saque da AAVE NÃO é venda nem aporte — não mexe em `stables.USDT`.** O USDT só muda de lugar
(supply → carteira EVM) e os holdings já incluem o colateral (regra 2). Mudam só o bloco `defi.aave`
e o `principals`. Foi o mesmo tratamento dos saques de 15/09 e 23/10.

**As 2 ordens limite (Uniswap, pendentes, criadas 24/10 11:42–11:43):**

| | Paga | Recebe | Preço | Expira |
|---|---|---|---|---|
| (a) | 100 USDT | 0,04332 ETH | **2.308,60** USDT/ETH (−1,4% do mercado) | 31/10/2026 |
| (b) | 100 USDT | 0,04564 ETH | **2.191,11** USDT/ETH (−6,4% do mercado) | 23/11/2026 |

Mercado na hora: **US$ 2.341,12**. Network cost US$ 0 nas duas (ordem off-chain, só paga gas se executar).
**Enquanto não executarem, nada muda no site** — os 200 USDT continuam contados como USDT. Quando
executarem será **ROTAÇÃO** (o custo migra do USDT para o ETH), **nunca aporte**: esse dinheiro já
estava no portfólio desde sempre, e lançar como aporte infla o capital e derruba o ROI por artefato.

🔸 **CoinGecko: ele vai lançar só depois da execução**, de uma vez (saída do USDT + entrada do ETH).
Decisão dele, e está certa — lançar a saída agora deixaria o CoinGecko 200 abaixo do site por dias.
Até lá o `yield-to-mirror` segue acusando só o yield normal.

- **Patrimônio líquido US$ 9.348,80** (ETH 2.344,97 · SOL 100,46 · BTC 80.217) contra US$ 9.540,96 em
  23/10 = **−US$ 192 (−2,0%)**, tudo preço (não houve entrada nem saída). Dívida total **US$ 456,71**,
  só Kamino. **Sem HF na AAVE** (sem dívida). Kamino LTV **17,52%**, SOL liquida em **US$ 22,75** (−77%).
- Borrowing power livre na AAVE depois do saque: **US$ 5.088,85** (era 5.334,89) — a "opção de compra"
  que ele descreveu em 23/10 continua de pé, só encolheu o colateral em USDT.
- **Yield pendente no CoinGecko: ~US$ 14,87** (ETH +0,002408 · SOL +0,058135 · USDT +3,568352 ·
  BTC −0,000002, a diferença conhecida das taxas). Sem relação com os 200 USDT das ordens.
- 🔸 **O gas do saque (0,0001 ETH, US$ 0,19) comeu o juro da semana do aWETH (+0,00008 ETH, US$ 0,19).**
  Pela decisão de 15/07/2026 o gas não é descontado — mantido, mas vale registrar que nesta semana o
  ETH ficou de fato empatado.
- Kamino **sem print nesta execução** — os números dela são os de 23/10 (supply 25,09 SOL, borrow
  456,71 @6,06%). Pedir no próximo review.


### ⚡ Fim da tarde de 24/10 — a ordem (a) EXECUTOU (ROTAÇÃO)

**100 USDT → 0,04332 ETH @ 2.308,60.** O ETH furou o preço da ordem na mesma tarde: **mínima de
US$ 2.286,76 às 15:30 UTC** (OHLC do CoinGecko), pouco depois do saque das 14:41. A ordem **(b)**
(0,04564 ETH @ **2.191,11**, vence 23/11) **não executou** — a mínima do dia ficou bem acima dela, e
os outros 100 USDT seguem reservados.

| | Antes | Depois |
|---|---|---|
| `holdings.ETH` | 2,363991 / US$ 4.775,80 | **2,407311 / US$ 4.875,80** |
| `stables.USDT` | 1.004,155114 / US$ 973,71 | **904,155114 / US$ 873,71** |
| `contributions` | — | **INALTERADA** |
| `TOTAL_INVESTED` | 9.667,58 | **9.667,58** (rotação não muda) |

⚡ **É rotação, não aporte** — os 100 USDT saíram do supply da AAVE no mesmo dia, já eram do
portfólio. O custo migra 1:1 do USDT para o ETH. Lançar em `contributions` inflaria o capital e
derrubaria o ROI por artefato.

🔸 **Sem gas extra.** Ordem limite da Uniswap é off-chain: o filler executa e paga o gas, que já
está embutido no preço (o card mostra "Network cost US$ 0"). Os 0,04332 são líquidos.

⚠️ **Ele digitou 0,0433 no CoinGecko, não 0,04332** (print da tela "Adicionar transação": Gasto total
US$ 100, Quantidade 0,0433, preço derivado 2.309,4688, 24 Oct 6:35PM). São **0,00002 ETH a menos
(~US$ 0,05)** — irrelevante em dinheiro, mas o `cgMirror` acusaria isso como pendente para sempre.
**Pedido a ele: corrigir para 0,04332** (o preço vira 2.308,60 sozinho).

**Pendente no CoinGecko — DOIS lançamentos, não um:** a compra do ETH **e a saída de 100 USDT**.
Enquanto só a compra entrar, o espelho fica com 100 USDT a mais. Por isso o `yield-to-mirror` mostra
hoje **ETH +0,045728** (0,002408 de yield + 0,04332 da compra) e **USDT −96,43** (−100 da compra
+3,57 de yield) — os dois são esperados e somem quando ele lançar os dois lados. **Só igualar o
`cgMirror` depois que ele confirmar.**

- **Patrimônio líquido US$ 9.356,56** com ETH a 2.337,75 (a rotação em si é neutra; comprar a
  2.308,60 com o ETH a ~2.338 já nasceu ~US$ 1,26 no azul).


### 24/10 (3) — compra de 0,00061885 BTC na OKX (ROTAÇÃO) + `cgMirror` da ordem (a)

**Ordem BTC/USDT, 12:09:57:** 0,00061885 BTC @ US$ 79.705 = **US$ 49,26**, taxa 0,00000061 BTC (0,1%)
→ líquido **0,00061824**. BTC 0,00649382 → **0,00711206** (invested 448,78 → **498,04**);
USDT 904,155114 → **854,895114** (invested 873,71 → **824,45**).

⚡ **Rotação, e a aritmética prova de onde veio:** o caixa da OKX tinha **49,32 USDT parados desde
16/10** e a compra consumiu 49,26 — sobraram **0,06**. **NÃO são os 200 sacados da AAVE**: aqueles
estão na rede Ethereum, reservados nas ordens limite da Uniswap criadas às 11:42–11:43, 27 minutos
antes desta compra. (Se algum dia aparecer um depósito novo de BRL nesse intervalo, é só mover os
49,26 para `contributions` — mas com o caixa batendo assim, não é o caso.)

**`cgMirror` depois dos lançamentos dele:** ETH 2,361583374 → **2,404903374** (+0,04332) e USDT
1.000,58676194 → **900,58676194** (−100).

⚠️ **ATENÇÃO — "igualar o `cgMirror`" NÃO é copiar o holding.** O `cgMirror` é o que está no
CoinGecko; aqui ele lançou **a transação**, não o yield. Copiar o holding apagaria o yield pendente
(ETH +0,002408 · SOL +0,058135 · USDT +3,568352) e o site pararia de cobrar. O certo é aplicar o
**delta da transação lançada**. Depois disso o relatório voltou a mostrar o ETH com só +0,002408 ✓.

✅ **FECHADO no mesmo dia — ele lançou a compra do BTC e a saída dos 49,26 USDT.** `cgMirror` BTC
→ **0,00711492** e USDT → **851,32676194**. Previsão confirmada: o espelho do BTC ficou **0,00000286
acima** do holding (ele lança a qty **bruta**, o site a líquida) — é a soma das taxas das compras, a
diferença conhecida desde 02/10. **Aparece como negativo no `yield-to-mirror` e NÃO deve ser lançada.**

**Espelho em dia.** Sobra só o yield normal: **~US$ 14,86** (ETH +0,002408 · SOL +0,058135 ·
USDT +3,568352), acumulando desde 16/10 por decisão dele (11/09). Lembrar no fechamento de 01/11.


### 24/10 (4) — print do portfólio: os 11 tokens conferidos, `cgMirror` acertado em 2 pontos

**Saldo do CoinGecko US$ 9.808,86.** Recalculando o site com os preços do próprio print:
**US$ 9.821,74** contra **US$ 9.810,40** do espelho = **US$ 11,35**, que é exatamente o yield pendente.
Fecha. (O print mostra 9.808,86 porque exibe os preços truncados; 1,54 de arredondamento.)

**Sete tokens batem na casa decimal, sem nenhuma ação:** ADA 375,245 · EIGEN 131,44388802 ·
**POL 190,13** · ZK 876 · XAI 898,879 · ZETA 51,1434 · SCR 0,0018. RDNT e USDS não aparecem —
excluídos por ele em 08/10 e 02/10. ✓

**Duas correções no `cgMirror`, as duas achadas pelo print:**

1. **ETH — ele lançou 0,0433 mesmo, não 0,04332.** O saldo de lá é 2,361583374 + 0,0433 =
   **2,404883374**. Eu tinha gravado 2,404903374 na palavra dele. Corrigido. Os **0,00002 ETH
   (~US$ 0,05)** viram pendência: sai junto com o próximo yield (lançar **0,002428** em vez de
   0,002408) ou ele edita a transação para 0,04332. ⚡ **Lição: o print do portfólio é o árbitro do
   `cgMirror`, não a confirmação verbal** — mesma hierarquia de 02/10, quando o extrato da OKX
   desmentiu o CoinGecko.
2. **USDT — o saldo de lá já absorveu o yield**: 851,32676194 + 3,57 = **854,89676194**. Em saldo é
   idêntico a ter lançado a saída da compra de BTC como 45,69 (o líquido que o relatório mostrava)
   em vez de 49,26 + 3,57 de entrada — 49,26 − 45,69 = 3,57. Dá no mesmo; só o custo no CoinGecko
   difere, e o custo canônico é o do `data.js`. **USDT praticamente em dia** (−0,00164794, sub-centavo).

**Yield pendente depois disso: ~US$ 11,34** (ETH +0,002428 · SOL +0,058135), mais os dois negativos
que NÃO se lança: BTC −0,00000286 (taxas, bruto×líquido) e USDT −0,0016 (arredondamento).

🔸 **O custo do CoinGecko segue abaixo do site** (ganho de +US$ 793,39 / +7,8% lá contra o
`TOTAL_INVESTED` de 9.667,58 aqui). É o resíduo do reset de março/2026 já auditado em 09/09/2026 —
USDT e USDS entraram lá a custo zero. **Não reabrir**: o custo canônico é o do `data.js`.

## Estado atual (ANTERIOR — ver o bloco de 05/10 logo acima do histórico) — yields lançados no CoinGecko + duplicata de BTC a apagar (`asOf` 2026-10-02)
**Juros da AAVE no último review (base para a regra 4):** WETH **0,018554028543753534** · USDT **25,227541**

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,308294 | 1,70% | 2,289740 |
| AAVE USDT supply | 1.721,128519 | 3,67% | 1.695,900978 |
| AAVE USDC borrow | 765,737952 | 3,04% (net) · base 4,13% | 748,00 |
| Kamino SOL supply | 25,03 | 5,53% | 23,645990 |
| Kamino USDS supply | **0 — encerrada** | — | 0 |
| Kamino USDC borrow | 454,97957 | 5,95% | 378,599493 |

- ✅ **ESPELHO EM DIA — pendente ZERO.** Ele lançou tudo em 02/10, em duas rodadas: o acumulado de
  11-29/09 (~US$ 25,89) e depois os ~US$ 7,99 (juro de 30/09 em diante + supply novo da Kamino).
  **Fim da fase "acumulando"** aberta em 11/09. Os 13 tokens conferidos contra o print, todos batem.
  Datou como 30/09 fazendo em 02/10 — **correto**: a data não entra em nenhuma conta do site (só a
  qty e o custo zero), e datar no fechamento mantém o yield de setembro dentro de setembro.
- ✅ **BTC reconciliado em 02/10.** Tinha duplicata no CoinGecko (0,00530135): a compra de 0,00036003
  de 28/09 estava lançada duas vezes, uma datada **28 Oct 2026** (data futura). Quem resolveu foi o
  **histórico de ordens da OKX** — só DUAS execuções em 28/09: 0,00036003 @ US$ 30,00 (16:38:06) e
  0,00023934 @ US$ 20,00 (16:33:20). Ele apagou a duplicata e acertou os centavos no mesmo dia;
  CoinGecko e site conferem (**0,00494132 / US$ 320,47**).
  ⚡ **Lição:** quantidade idêntica nas 8 casas decimais em datas diferentes = duplicata, não compra
  nova (preço diferente daria quantidade diferente). E o extrato da corretora é o árbitro — o
  CoinGecko é digitado à mão, a corretora não.
- Custo das compras de 28/09 corrigido de US$ 49,98 para **US$ 50,00** (valor real da OKX): BTC
  `invested` 320,45 → **320,47**, USDT `invested` 1879,21 → **1879,19**. Qty inalterada.
- HF AAVE **8,47** · Kamino LTV **23,40%** (liq. 76,40%) · pool: nenhuma aberta.
- ⚠️ **CORRIGE a nota de 29/09: o caixa em corretora NÃO acabou.** O print do saldo da OKX
  (02/10) mostra **134,98 USDT** lá. Conferência fecha: dos 1.906,15 de USDT, 1.721,13 estão no
  supply da AAVE e **185,02 fora** = 134,98 (OKX) + ~50 (carteira EVM), 4 centavos de diferença.
  Reconstrução: os 185 de caixa de 22/08 viraram 135 quando 50 compraram BTC na OKX em 28/09; e
  dos 300 sacados da AAVE em 15/09, 200 viraram ETH em 15-16/09 e 50 em 24/09, sobrando ~50 na
  carteira. **Lição: pedir o print do SALDO da corretora, não só o histórico de ordens** — foi ele
  que mostrou onde o dinheiro está de verdade.
- 🔸 **BTC: saldo real da OKX 0,00492638** contra 0,00494132 do site/CoinGecko — 0,00001494 a
  menos (~US$ 1,26), que é a soma das taxas das 8 compras, cobradas em BTC. Os dois contam a
  quantidade BRUTA. Diferença conhecida e aceita; se valer acertar, lançar uma saída de taxa.
- 🔸 **BABY (Babylon) 16,969 = US$ 0,23** na OKX fica FORA da contabilidade, como os ~0,05 SOL de
  gas (decisão de 15/07/2026). Idem o BRL 0,00003629.
- **Fechamento de setembro rodou sozinho em 01/10**: patrimônio 11.037 → **12.055**, aporte externo
  **zero** → **+9,2% de retorno puro**. As Actions do CoinGecko (networth/briefing) voltaram a rodar
  em 02/10 — o 403 era temporário.

**Pendências que o `/prints` deve lembrar:**
- ⚡ **REPAY NA KAMINO (02/10, fim da tarde)** — dívida **767,21 → 465,07 USDC**, LTV 23,40% → **15,80%**,
  liq. LTV 76,40% → **75,00%** (o colateral virou SOL puro) e preço de liquidação do SOL **US$ 24,77**.
  A **posição de USDS foi encerrada**: resgatou o reward (+1,59364), trocou 307,051 USDS por 307,05707
  USDC (1:1, **sem slippage material** — ao contrário do que dizia o 1º registro), enviou 4,91291 USDC
  e repagou 302,14416. PYUSD 0,07 e KMNO 6,38 **seguem claimable**, não foram convertidos.
- ⚡ **2º REPAY no mesmo dia, pago com KMNO** — resgatou +164,51055 KMNO do stake, somou ao saldo e
  aos rewards, trocou **255,21922 KMNO por 10,09033 USDC** e repagou **10,09043** na Kamino. Dívida
  **465,07 → 454,98**, LTV ~**15,42%**, preço de liquidação do SOL **US$ 24,24**. O KMNO nunca esteve
  contabilizado no site (rewards não lançados), então isso é **ganho puro**: o passivo cai US$ 10,09
  sem nenhum ativo do site sair. Rewards da Kamino depois: **KMNO zerado**, sobra PYUSD US$ 0,07.
  *(Os 0,0001 USDC de diferença entre a troca e o repay são o dust do address poisoning, que estava
  parado na carteira e acabou entrando no repay. Inócuo — é só valor.)*
- ✅ **Os 4,91291 USDC (e o 0,00137 SOL do 2º repay) eram TAXA do protocolo de swap** — confirmado
  por ele em 02/10. **Não são ativo**, saíram de vez. Custo real da operação: ~1,6% do valor trocado.
  A troca em si foi 1:1 no preço; o custo veio como taxa à parte, não como slippage. Efeito líquido
  no patrimônio: **−US$ 3,32** (taxa 4,91 menos o reward de 1,59 que nunca esteve no site).
- ✅ **USDS resolvido no CoinGecko**: ele **excluiu a moeda** do portfólio em vez de dar saída
  ("provável que eu não compre mais USDS"). `cgMirror` zerado, pendente ZERO. Efeito colateral bom:
  sumiu de lá um **ganho fantasma de US$ 305** — o USDS tinha entrado a custo zero no reset de
  março/2026, então o CoinGecko contava o saldo inteiro como lucro. O rastro para IR fica no `data.js`.
- 🚨 **ADDRESS POISONING em curso.** Logo depois do envio para `BjQh...kA7X` entrou um dust de
  **+0,0001 USDC** de `BjQh...BA7X` — mesmo começo, fim diferente. É o golpista plantando o endereço
  no histórico para a PRÓXIMA transferência. Na próxima vez, não copiar do histórico: conferir o
  endereço inteiro ou usar contato salvo. Terceiro caso registrado (ver aba Alertas do site).
- Borrow da AAVE em 4,13% base / 3,04% net contra supply do USDT em 3,67%: o carry voltou a ser
  favorável, não há mais o alerta de quitar que estava aberto desde 18/09.
- Rewards da Kamino não resgatados (~US$ 8,09: USDS 1,59 · PYUSD 0,07 · KMNO 6,43) — não lançar.
- `RENDA_2026` de setembro continua manual.

## Estado atual (ANTERIOR) — review 23/10/2026 (`asOf` 2026-10-23)
**Juros da AAVE neste review (base da regra 4 no próximo):** WETH **0,020878497926142669** · USDT **28,723036**

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,310619 | 1,67% | 2,289740 (inalterado) |
| AAVE USDT supply | 1.724,624014 | 3,22% | 1.695,900978 (inalterado) |
| AAVE USDC borrow | 768,395695 | **6,12%** (net do print; base 5,05% no MCP) | 748,00 |
| Kamino SOL supply | 25,09 | 4,05% | 23,645990 |
| Kamino USDC borrow | 456,71 | **6,06%** | 378,599493 |

- **Patrimônio líquido US$ 9.540,96** · HF AAVE **7,74** (MCP) · Kamino LTV **17,52%** (liq. 80%, SOL
  liquida em **US$ 22,75**) · sem pool. Dívida total **US$ 1.225,11**.
- ✅ **Borrow das duas CEDEU**: AAVE 8,79% → **6,12%**, Kamino 8,88% → **6,06%**. O alerta de quitar
  aberto em 16/10 perde força — mas o USDT da AAVE rende 3,22% contra 6,12% da dívida, então o carry
  dessa perna segue negativo. Regra de 11/09 (reavaliar se >5% por 2 semanas) continua valendo.
- **Aporte semanal de 23/10 (sexta) FEITO**: R$ 100,00 → 19,67667291 USDT @ 5,0822 (taxa ZERO,
  16:06:21) → 0,0002417 BTC bruto / **0,00024074 líquido** @ US$ 81.409,30 (16:07:05, taxa 0,4%).
  `contributions` +US$ 19,68. Dobro da régua (R$ 50) — o "podendo ser mais ou menos" é dele.
- **Fiscal atualizado**: `FISCAL_ENTRADAS` USDT 3.058,90 → **3.088,44 un** · R$ 16.416,57 →
  **16.566,57** (câmbio médio 5,37 → **5,36**) · `APORTADO_BRL` → **R$ 38.132,97**. Inclui os R$ 50 de
  **09/10 que nunca tinham sido lançados lá**.
- **Yield pendente no CoinGecko: ~US$ 14,90** (ETH +0,002324 · SOL +0,058135 · USDT +3,500170),
  acumulando desde 16/10.
- OKX: USDT **49,32** (inalterado desde 16/10) · SOL 0,76735037 confere · **BABY 25,82880465
  (US$ 0,34)** segue FORA da contabilidade (recompensa do Simple Earn — decisão de 02/10, mesma do gas).
  BRL zerado depois do depósito.

✅ **RESOLVIDO no mesmo dia — era o aporte da sexta 16/10, lançado com atraso.** Print da ordem:
  **R$ 100,00 @ 5,1555 = 19,39657 USDT** (16:32:30, taxa ZERO) → **0,00023814 BTC bruto @ US$ 81.450**
  (16:34:29, taxa 0,00000023) = **0,00023791 líquido**. `contributions` +US$ 19,40; BTC `invested`
  +19,40; Fiscal +R$ 100. **Outubro fecha com QUATRO aportes: US$ 128,06** (05, 09, 16 e 23/10).
  - A reconciliação fecha dos dois lados: site **0,00649382** vs CoinGecko 0,00649607 = **0,00000225**,
    que é exatamente a soma das taxas das 5 compras de 07–23/10 (CoinGecko lança bruto, site líquido);
    e vs OKX 0,00647885 = 0,00001497, a diferença já conhecida de 02/10.
  - Explica o caixa da OKX ter ficado parado em 49,32 de 16/10 a 23/10: entrou e saiu no mesmo dia.
  - ⚠️ **LIÇÃO PARA O PRÓXIMO REVIEW DE SEXTA:** o review pode rodar ANTES do aporte do dia (foi o que
    aconteceu em 16/10 — o caderno registrou "ainda não feito" e ele aportou às 16:32). **Conferir o
    extrato da OKX da semana inteira no review seguinte, não só os prints do dia.** Foi a divergência
    do BTC no CoinGecko que denunciou.
  - 🔸 **Spread da OKX:** a corretora mostra o lado BRL dessa conversão como US$ 19,97 (câmbio comercial
    ~5,0075) contra os 19,39657 USDT entregues @ 5,1555 — **~2,9% embutido no câmbio, mesmo com "taxa
    zero"**. O aporte entra pelo USDT recebido, que é a medida do site. Vale observar nas próximas.

~~PENDENTE — falta uma compra de BTC (resolvido acima)~~

## ⚡ 23/10/2026 (fim do dia) — DÍVIDA DA AAVE QUITADA (decisão dele, desalavancagem parcial)

**Palavras dele:** *"repaguei a divida na aave hoje, decidi fazer isso, pq o dinheiro parado não
justificava mais a espera por quedas que eu esperava, então com o restante deixo como caixa de
oportunidade, e caso caia muito mais do que o esperado, resolvo se pego mais divida dai pra comprar
mais barato ETH"*.

**Sequência on-chain (17:14–17:19, block 26257675):** withdraw **770 USDT** do supply da AAVE
(`0xc150...5250`) → approve 1inch (`0x8954...aba1`) → swap **770 USDT → 769,14 USDC**
(`0x5709...7846`, slippage 0,11%) → multicall repay **768,40 USDC** (`0x6ae9...6e17`).
Taxa de borrow no momento do repay: **5,11%**. Gas total ~US$ 0,45, pago com ETH do Gas Deposit.

| | Antes | Depois |
|---|---|---|
| AAVE USDT supply | 1.724,624014 | **954,628724** |
| AAVE WETH supply | 2,310619 | 2,310622 (só juro) |
| AAVE USDC borrow | 768,395695 @6,12% | **0 — QUITADA** |
| `principals.aave.USDT` | 1.695,900978 | **925,900978** (caiu exatamente 770, MCP confere) |
| `principals.aave.USDC` | 748 | **0** |
| HF AAVE | 7,74 | **null** (sem dívida não existe; MCP devolve null) |
| `stables.USDT` | 1.774,087002 / $1.743,71 | **1.004,091712 / $973,71** |
| **Dívida total** | US$ 1.225,11 | **US$ 456,71** (só Kamino) |
| Patrimônio líquido | ~US$ 9.577 | **US$ 9.576,74** |

⚡ **Como lançar um repay (não é compra nem venda):** o ativo sai e o passivo some junto, então o
patrimônio quase não muda. Aqui caiu **US$ 0,91** — o slippage do swap. O `invested` do USDT migra
**1:1** com a qty (mesmo tratamento das compras). **Nada vai para `contributions`** (nenhum dinheiro
entrou nem saiu do portfólio).

🔸 **Sobraram 0,74 USDC** na carteira (769,14 recebidos − 768,40 repagos). Ficam **fora da
contabilidade**, como o BABY e o gas (valor < US$ 1). Anotado para não se perder o rastro.

✅ **ELE JÁ DEU A SAÍDA dos 770 USDT no CoinGecko**, no mesmo dia. `cgMirror.USDT`
1.770,58676194 → **1.000,58676194**; o delta para o holding volta a ser só o juro do aUSDT
(**+3,50**), pendente normal. Não era yield — era ativo saindo do portfólio, por isso saída e não
transferência de entrada.

**Yield pendente no CoinGecko depois disso: ~US$ 14,94** — ETH +0,002328 · SOL +0,058135 ·
USDT +3,504950 · BTC −0,000002 (as taxas das 5 compras, diferença conhecida e explicada).

⚠️ **O HF deixou de existir — e isso quebrava 3 telas.** Com `healthFactor: null`, os consumidores
caíam em **fallbacks fixos** e mostrariam um HF inventado numa carteira sem dívida:
`index.html` (`|| 4.0`), `portfolio_analytics.html` exec bar (`|| 6.00`) e convexidade (`|| 5.00`).
Corrigidos para detectar dívida zero: as telas mostram **— / "sem dívida na AAVE"**, e a convexidade
entra com HF 99 (sem fragilidade de liquidação) em vez de 5. `relatorio.html` ganhou o traço também.
`tests/chain.test.js` ajustado: a comparação fixture×`data.js` dividia por `D.debt.aave` e dava NaN
com dívida 0 — agora só compara quando há dívida (a **regra** mudou, não o código).

🔸 **Leitura da posição:** sobra só a Kamino (456,71 @6,06%, LTV 17,52%, SOL liquida em US$ 22,75).
Borrowing power livre na AAVE: **US$ 5.334,89** — é a "opção de compra" que ele descreveu, disponível
a custo zero enquanto não for usada. O carry negativo da perna USDT (3,22% de supply contra 6,12% de
borrow, ~US$ 22/ano) **acabou**.

⚠️ **LIÇÃO TÉCNICA (vale para todo script de edição):** `io.open(p,'w')` no Windows grava **CRLF**,
e o `.gitattributes` do repo é `eol=lf`. Isso converteu 4 arquivos e quebrou um teste que procura
uma string com `\n` literal. **Sempre usar `newline=''`.** O git mascara no commit, então o CI fica
verde e só o teste local quebra — confuso de diagnosticar. E `open(...,'w')` **trunca na abertura**:
uma falha no meio do write zera o arquivo (zerou este caderno; recuperado com `git checkout HEAD --`).
Escrever em temporário e só depois substituir.

## Estado atual (ANTERIOR) — review 16/10/2026 (`asOf` 2026-10-16)
**Juros da AAVE neste review (base da regra 4 no próximo):** WETH **0,020084290403746695** · USDT **27,707815**

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,309824 | 1,65% | 2,289740 (inalterado) |
| AAVE USDT supply | 1.723,608793 | 3,00% | 1.695,900978 (inalterado) |
| AAVE USDC borrow | 767,459613 | **8,79%** (net do print; base 6,77–7,12%) | 748,00 |
| Kamino SOL supply | 25,07 | 4,22% | 23,645990 |
| Kamino USDC borrow | 456,11 | **8,88%** | 378,599493 |

- HF AAVE **7,92** (MCP) · Kamino LTV **17,14%** (liq. 80%, SOL liquida em **US$ 22,74**) · sem pool.
- ⚠️ **Borrow das duas mais que dobrou na semana** (AAVE 3,44% → 8,79%, Kamino 5,98% → 8,88%). Carry
  cai de ~US$ 20 para ~**US$ 12,5/mês**. Na AAVE o USDT rende 3,00% contra 8,79% da dívida: quitar os
  767 com o USDT do supply economizaria ~US$ 44/ano. Regra de 11/09: reavaliar se ficar >5% por 2 semanas.
- CoinGecko (print 16/10): os +0,0031 ETH do RDNT **foram lançados**. BTC lá tem 0,00000106 a MAIS
  que o site (taxas das compras de 07-09/10: CoinGecko bruto, site líquido) — explicado, ~US$ 0,09.
  **Yield pendente: ~US$ 10,23** (ETH +0,00153 · SOL +0,038 · USDT +2,48).
- OKX: USDT **49,32** (esperado ~49,46 — 0,14 a menos, não investigado) · BABY 22,907 (fora da
  contabilidade, recompensa do Simple Earn) · SOL 0,76735037 confere.
- Aporte semanal de 16/10 (sexta) **ainda não feito** no momento do review.

## ⚡ 09/10/2026 — REGRA NOVA: aporte toda SEXTA-FEIRA (e o primeiro já entrou)

**Ele pediu para ser cobrado.** *"Criei uma regra nova agora, vou aportar cerca de 50$ toda
sexta-feira, podendo ser mais ou menos, porém com aportes semanais. Anote isso pra me cobrar
também, e hoje começamos assim."* Rotina 2 do CLAUDE.md + memória `project_aporte_semanal.md`.

**Primeiro da série** (sexta, 09/10): R$ 50,00 → **9,86463 USDT** (OKX, par USDT/BRL @ 5,0686,
13:49:47, **taxa ZERO**) → **0,00011905 BTC** líquido 4 minutos depois (ordem 399...584, 13:53,
bruto 0,00011916 @ US$ 82.781, taxa 0,09%). Ele já lançou no CoinGecko.

⚡ **As duas pernas têm tratamentos diferentes — não confundir:**
- **fiat → USDT** = **APORTE** (dinheiro de fora). Vai para `contributions`: US$ 9,86.
- **USDT → BTC** = **ROTAÇÃO**. O custo migra do USDT para o BTC; contar de novo seria dupla
  contagem do mesmo aporte.

`TOTAL_INVESTED` 10.388,64 → **10.398,50** (+9,86, o aporte). Outubro agora tem **dois**: os
R$ 400 de 05/10 (US$ 79,12) e estes R$ 50.

✅ **CONFIRMADO NO MESMO DIA: são 50 REAIS** — *"é 50 reais mesmo, pode cobrar assim"*. Régua fechada:
**R$ 50/semana = R$ 217/mês = R$ 2.600/ano ≈ US$ 513/ano**. Valor pode variar na semana; o que não
pode é a sexta passar em branco. **Não reabrir.**

---

## 08/10/2026 (2) — RDNT ZERADO: vendeu tudo e virou 0,0031 ETH (ROTAÇÃO de custo ZERO)

**A posição de RDNT acabou.** Dois swaps no 1inch (Arbitrum): 6.913,01 (tx `0xd4ed...ee8b`) +
365,05 (tx `0xf218...2d54`) = **7.278,06 RDNT por 7,9029 USDC** (US$ 0,001086/un). Os 7,91 USDC
viraram **0,0031 ETH** na Uniswap V4 (tx `0x0431...dc2d`). Palavras dele: *"RDNT subiu 150% e
aproveitei e vendi o que eu tinha... pra não ver mais"*. Já **excluiu o token do CoinGecko**
(mesmo tratamento que deu ao USDS em 02/10).

⚡ **O ponto contábil que importa — airdrop vendido NÃO cria custo.** O RDNT tinha `invested: 0`.
Na rotação o custo que migra é **zero**, então o `invested` do ETH fica **INALTERADO** em 4.775,80.
Somar os US$ 7,91 ali criaria custo do nada: o `TOTAL_INVESTED` subiria sem nenhum dólar novo ter
entrado e o ROI cairia por artefato. Regra geral: **na rotação migra o CUSTO, não o VALOR** — e o
custo de um airdrop é zero. (Conferido: `TOTAL_INVESTED` continua **10.388,64** depois das duas
operações do dia.)

⚡ **Como ele deve lançar no CoinGecko:** os +0,0031 ETH entram como **transferência de entrada a
custo ZERO**, não como compra de US$ 7,91. Ele excluiu o RDNT de lá, e o RDNT não tinha custo —
logo o custo total do CoinGecko não caiu na saída; lançar o ETH como compra faria esse custo subir
US$ 7,91 e divergir do site. **Pendente de confirmação** (é o único item do `cgMirror` hoje).

✅ **FECHA A PENDÊNCIA DE 22/08/2026.** O site tinha 7.290,46 e o CoinGecko 7.278,07 — 12,39 de
diferença, deixada de lado na época por valer 1 centavo. A venda on-chain de **7.278,06** prova que
**o CoinGecko estava certo** e o site contava 12,40 a mais. Com a posição zerada dos dois lados, a
divergência deixa de existir. (O protocolo Radiant foi hackeado em 2025 — 1.079,17 ARB em stake
perdidos, ~US$ 671 — então a posição já estava economicamente morta há mais de um ano.)

---

## 08/10/2026 — compras de BTC e SOL na OKX com o caixa que já estava lá (ROTAÇÃO)

| Ordem | Par | Qtd bruta | Preço | Valor | Taxa (0,1%) | Líquido |
|---|---|---|---|---|---|---|
| 398...384 · 00:21 | BTC/USDT | 0,00047025 | US$ 82.745 | US$ 38,88 | 0,00000047 BTC | **0,00046978** |
| 399...400 · 14:26 | SOL/USDT | 0,404077 | US$ 105,90 | US$ 42,75 | 0,00040407 SOL | **0,40367293** |

Pagas com os US$ 81,63 de USDT que já estavam na corretora — **rotação, não aporte**. Caixa da OKX
**131,09 → 49,46**. As duas ele confirmou ter lançado no CoinGecko (*"já coloquei no coingecko"*),
então o `cgMirror` de BTC, SOL e USDT acompanha.

⚠️ **Taxa de 0,1% nas duas** — contra os 0,4% da compra de SOL de 07/10. Confirma o que eu tinha
levantado naquele dia: **a de 07/10 é que destoou**, provável ordem a mercado contra limite.

---

## 07/10/2026 (3) — compra de 0,0004855 BTC na OKX (ROTAÇÃO)
Ordem `398…408` (10:02:30): **0,0004855 BTC @ US$ 83.417 = US$ 40,49**, taxa **0,00000048 BTC (0,1%)**
→ líquido **0,00048502**. Pago com USDT da corretora — rotação.
- `holdings.BTC`: qty **0,00494132 → 0,00542634** · invested **320,47 → 360,96**
- `stables.USDT`: qty **1.892,706762 → 1.852,216762** · invested **1.865,83 → 1.825,34**
- USDT na corretora: **171,58 → 131,09** · `contributions` inalterada
*(O BTC não está no `cgMirror` — foi tirado em 02/10 quando a duplicata foi corrigida; sem entrada ali,
o script assume espelho igual ao holding.)*

**Os três movimentos de 07/10 juntos** (0,02 ETH + 0,365 SOL + 0,000485 BTC = US$ 134,51) consumiram
os 50 USDT da carteira EVM e US$ 82,97 do caixa da OKX. **Nenhum foi aporte** — todo o dinheiro já
estava no portfólio. O único aporte do mês segue sendo os R$ 400 de 05/10.

## 07/10/2026 (2) — compra de 0,365138 SOL na OKX (ROTAÇÃO) · ⚠️ a regra do SOL mudou
Print da ordem `398…648` (09:58:21): **0,365138 SOL @ US$ 116,37 = US$ 42,48**, taxa **0,00146055 SOL
(0,4%, cobrada em SOL)** → **líquido 0,36367745 SOL**. Pago com USDT que já estava na OKX — rotação.

- `holdings.SOL`: qty **25,03 → 25,39367745** · invested **2.498,84 → 2.541,32** (+42,48)
- `stables.USDT`: qty **1.935,186762 → 1.892,706762** · invested **1.908,31 → 1.865,83** (−42,48)
- USDT na corretora: **214,06 → 171,58** · `contributions` inalterada

⚠️ **MUDANÇA DE REGRA (está na regra 4 acima e comentada no `data.js`):** o holding de SOL **deixou
de ser igual ao supply da Kamino**. Agora são duas partes — supply 25,03 + **0,36367745 na OKX**.
A regra antiga valia enquanto todo o SOL estava no protocolo. **Num review futuro, igualar o holding
ao supply apagaria o SOL da corretora.** O yield da Kamino passa a entrar por delta, igual ao ETH/USDT.

## 07/10/2026 — compra de 0,02 ETH (ROTAÇÃO) + 1,54 USDC de troco que estava fora do site
Extrato da carteira EVM: 1,54 USDC → 1,54 USDT no 1inch (tx `0x8eb7…d735`) e, minutos depois,
**51,54 USDT → 0,0200 ETH** (tx `0xeff6cb…1aa167`). Gas 0,0001 ETH (US$ 0,25).

**É rotação, e a conferência prova:** antes da operação o site tinha **264,06 USDT fora da AAVE** =
OKX 134,98 + carteira EVM ~50 + aporte de 05/10 79,04 (4 centavos de arredondamento). Os 50 da
carteira são exatamente o resto do saque da AAVE de 15/09 — dos 300 sacados, 200 viraram ETH em
15-16/09, 50 em 24/09 e **estes 50 agora**. Fecha com a fala dele e confirma a reconstrução de 02/10.

- `holdings.ETH`: qty **2,338483 → 2,358483** · invested **4.724,26 → 4.775,80** (+51,54)
- `stables.USDT`: qty **1.985,186762 → 1.935,186762** · invested **1.958,31 → 1.908,31** (−50,00)
- `contributions` **inalterada** — nenhum dinheiro veio de fora.

⚠️ **Os 1,54 do USDC não estavam contabilizados no site** (não existe entrada de USDC nos stables).
Por isso o ETH leva +51,54 de custo e o USDT só baixa 50: o **total investido sobe 1,54**. Isso é
**correção de registro** — o patrimônio estava subestimado nesse valor — e não aporte nem ganho.
Lançar como ganho inflaria a performance; lançar como aporte inflaria o capital.
**Gas de 0,0001 ETH não descontado**, mesmo tratamento do gas em SOL (decisão de 15/07/2026).

## ⚡ APORTE NOVO — 05/10/2026 (primeiro de outubro, e o primeiro aporte externo desde agosto)
Print da ordem OKX (par USDT/BRL, 398...010, 09:51:14): **R$ 400,00 @ 5,0558 = 79,11706 USDT bruto**,
taxa 0,07911706 (0,1%), **líquido 79,03794294 USDT**. Aritmética fecha: 79,11706 × 5,0558 = R$ 400,00.

**FIAT → CRIPTO = dinheiro de FORA**, então desta vez é **aporte de verdade** (diferente das compras
de set/28-09, que eram rotação de USDT que já era dele). Lançado nos dois lugares:
- `data.js → contributions`: **US$ 79,12** (o bruto — é o que saiu do bolso; a taxa de 8 centavos é
  custo real e aparece como perda, não some da conta).
- `data.js → stables.USDT`: qty **1.906,148819 → 1.985,186762** (+79,038 líquido) · invested
  **1.879,19 → 1.958,31** (+79,12).
- `ferramentas.html → FISCAL_ENTRADAS` USDT **2.979,78 → 3.058,90 un** · **R$ 16.016,57 → 16.416,57**
  · câmbio médio 5,38 → **5,37**. `APORTADO_BRL` **37.582,97 → 37.982,97**.
- `cgMirror.USDT` subido junto porque ele disse que ia lançar na hora. ⚠️ **Se ele lançar o BRUTO
  (79,11706) em vez do líquido, vai sobrar 0,079 de diferença** — conferir no próximo print.

⚠️ **Efeito no fechamento de outubro:** outubro deixa de ser mês sem aporte. O `close-month.js` soma
`contributions` do mês ao `invested` da curva, então o retorno de outubro já sai descontado disso.

## Histórico (mais recente no topo, 1 linha por execução)
- 06/11/2026 — **aporte semanal (sexta)**: R$ 100,00 → **17,88726373 USDT** @ **5,5906** (taxa zero). `contributions` +US$ 17,89 → `TOTAL_INVESTED` **9.703,68**; USDT 100,219828 → **118,10709173**; Fiscal **R$ 38.432,97**. ⏳ **A compra de BTC ficou em ordem aberta** — quando bater é rotação, não aporte; ele avisa. ⚠️ Câmbio +10% em 3 semanas (5,0822 → 5,5906): os mesmos R$ 100 renderam US$ 17,89 contra 19,68.
- **06/11/2026** — review semanal (4 prints: AAVE, Kamino, CoinGecko, OKX). Sem movimentação: principals batem na casa decimal. AAVE WETH 2,377484 @1,71% (juro derivado do print, sem MCP) · Kamino SOL 25,90 @4,44%, borrow 457,95 @5,41% (4ª queda seguida), LTV 19,63%, SOL liquida em US$ 22,10. Pool ETH/USDC v4 em 8 dias: 74,39% em ETH, pooled 730,48 + 45,13 de fees, **PnL +32,49 (+4,37%)**. Patrimônio **US$ 8.824** (−US$ 264, −2,9%, tudo preço). Yield pendente US$ 6,15, segurando até o fechamento. **Faltou o print do aporte (7 dias sem).**
- 04/11/2026 — **consolidação**: ETH da carteira → AAVE (**+0,0652**, confirmado on-chain, principal 2,289740 → **2,354959342722521912**) e SOL da OKX → carteira Solana (chegaram **0,762311673** dos 0,76735038: **0,005038707 de taxa de saque**). Depósito na Kamino **confirmado no mesmo dia**: supply **25,892311673**, principal **24,408301673**, LTV 19,06%, juro retido intacto em 1,484010. Holding do SOL já ajustado (+0,01 de yield − a taxa). Patrimônio US$ 9.088, cards fecham. 🔸 A Kamino renomeou a tela para "SOL/BTC Market".
- 31/10/2026 — **review semanal (5 prints)**: a **pool v4 entrou no range em 2 dias** e já está **62% comprada em ETH** (0,203 ETH + 276,28 USDC), fees **US$ 28,50** não coletadas, **PnL +18,67 (+2,5%)** — o oposto do ciclo de 26/08 que fechou 0 a 0. AAVE: WETH 2,3116215 @**2,43%** (CF subiu p/ 84%), sem dívida, juro derivado do print por falta do MCP. Kamino: SOL 25,12 @3,72%, borrow **457,56 @5,65%** (3ª semana cedendo), LTV 18,99%, liq. US$ 22,77. Holdings: ETH +0,000389422 e SOL +0,03 de yield custo zero — **o SOL fecha exato contra a OKX (25,12 + 0,76735037 = 25,88735037)**. `cgMirror` conferido nos 11 tokens. Líquido **US$ 9.006,51** (−3,1% vs 29/10, só preço). Regra 0 conferida. 🔸 BABY US$ 0,36 na OKX fora do site (dust).
- 30/10/2026 (2) — **print do portfólio**: `cgMirror` acertado em 3 (ETH **2,404903374** — ele corrigiu para 0,04332; BTC **0,00735063**; USDT **100,20676194**, saída dos que viraram a pool). 7 tokens batem na casa decimal. Sobra 1,3 centavo de USDT (o aporte de hoje não lançado lá). ⚠️ O GP do CoinGecko virou −US$ 398,28 por **artefato** da saída do USDT (custo ficou, qty saiu) — não é perda; o canônico é o site. Yield pendente ~US$ 11,83.
- 30/10/2026 — **aporte semanal (sexta)**: R$ 100,00 → 18,20684 USDT @ **5,4924** (taxa zero) → 0,00023548 BTC líquido @ 77.244. `contributions` +US$ 18,21 (outubro fecha com **5 aportes, US$ 146,27**); BTC 0,00711206 → **0,00734754**; `TOTAL_INVESTED` → **9.685,79**; Fiscal → **R$ 38.332,97**. ⚠️ Câmbio +8,1% na semana (5,0822 → 5,4924): os mesmos R$ 100 renderam US$ 18,21 contra 19,68. Topo do dashboard conferido (regra 0): cards fecham, HF "—", pool US$ 743.
- 29/10/2026 — **AAVE sem USDT e POOL NOVA**: sacou os 755,119968 USDT (todo o supply, que marcava 13,11% de APY), trocou por 742,37 USDC na Velora e montou **ETH/USDC v4 na Ethereum** com US$ 743,12 — **pool de COMPRA**, range 2.190,79–2.347,75, abriu fora do range por cima (100% USDC), APR do painel 72,09%. Qty do USDT sai, **`invested` fica** (TOTAL_INVESTED segue 9.667,58). ⚠️ Swap custou **1,58%** (2ª vez ~1,6%); vale testar Curve. Patrimônio US$ 9.299. **Bug achado e corrigido no caminho**: o patrimônio do dashboard e do relatório não somava o LP (−US$ 743) — invisível desde 28/08 por não haver pool aberta.
- 24/10/2026 (4) — **print do portfólio conferido**: 7 tokens batem na casa decimal (ADA, EIGEN, POL 190,13, ZK, XAI, ZETA, SCR). `cgMirror` corrigido em 2 pontos — ETH **2,404883374** (ele lançou 0,0433, não 0,04332: o print é o árbitro, não a confirmação verbal) e USDT **854,89676194** (o saldo de lá já absorveu o yield de 3,57). Total: site 9.821,74 vs CoinGecko 9.810,40 = **US$ 11,35 = o yield pendente**, fecha. Sobram ETH +0,002428 e SOL +0,058135 a lançar.
- 24/10/2026 (3) — compra de **0,00061885 BTC @ US$ 79.705 (US$ 49,26)** na OKX, paga com o caixa que já estava lá (49,32 parados desde 16/10) → **ROTAÇÃO**; BTC 0,00649382 → **0,00711206**, USDT 904,155114 → **854,895114**. `cgMirror` da ordem (a) aplicado pelo DELTA da transação (ETH →2,404903374, USDT →900,58676194), **não igualado ao holding** — igualar apagaria o yield pendente. Ele lançou os dois lados no mesmo dia e o espelho fechou (BTC 0,00711492 · USDT 851,32676194); sobra só o yield normal, **~US$ 14,86**, mais o −0,000003 de BTC que é taxa e não se lança.
- 24/10/2026 (2) — **a ordem limite (a) executou**: 100 USDT → **0,04332 ETH @ 2.308,60** (ETH fez mínima de 2.286,76 às 15:30 UTC). ROTAÇÃO — custo migra 1:1, `contributions` intocada, `TOTAL_INVESTED` segue 9.667,58. ETH 2,363991 → **2,407311**; USDT 1.004,155114 → **904,155114**. A ordem (b) @ 2.191,11 (venc. 23/11) segue pendente com os outros 100. Líquido US$ 9.356,56. Ele precisa lançar DOIS movimentos no CoinGecko (compra do ETH + saída de 100 USDT) e corrigir 0,0433 → **0,04332**; `cgMirror` só depois da confirmação.
- 10/11/2026 (noite) — **3 swaps comprando a queda, caixa zerado**: 50 USDT → 0,0238 ETH, **24 USDC** → 0,0114 ETH e 50 USDT → 0,0243 ETH; bruto +0,0595, líquido **+0,0594** (gas 0,0001), médio **US$ 2.084,03/ETH**. Gastou os 100 USDT que estavam presos na ordem limite (b) de 24/10 — não esperou, comprou a mercado. ⚠ **`invested` sobe só 81,93, não 124**: a rotação migra o custo REAL do USDT (82,13 para 100,25 de qty) e os 24 USDC de taxa migram ZERO. `TOTAL_INVESTED` intacto. Stables em **US$ 0,25** — sem pó seco até sexta. Pendência do CoinGecko virou 0,398931 ETH em QUATRO partes, **só duas a custo zero** (tabela no Estado atual).
- 10/11/2026 — **pool ETH/USDC v4 FECHADA** pela regra das 24h (ETH perdeu o piso do range e não voltou): voltaram 0,3384 ETH + 24,00 USDC; IL 57,61 contra 46,46 de taxa = **−US$ 11,15 em 12 dias**, com fee APR real de **190,2% a.a.** Funcionou como pool de COMPRA (entrou 100% USDC, saiu 100% ETH). Custo migrou US$ 742,37 do USDT para o ETH (`TOTAL_INVESTED` intacto); USDC criado em `stables` a custo zero. ⚠ **Bug de código achado e corrigido**: ticker novo no `data.js` não aparecia no dashboard — o `PORTFOLIO_DATA` casa por ticker e ignorava o USDC, deixando o patrimônio US$ 24 abaixo. Pendente: ele lançar a **compra** de 0,3384 ETH por US$ 742,37 no CoinGecko (não é custo zero) e os 2,35 USDC de reward sem claim.
- 09/11/2026 — print do CoinGecko confirma a compra lançada (BTC bruto 0,00758942, com custo); `cgMirror` acertado e pendente de volta ao yield real (~US$ 5,88, ETH+SOL). USDT inalterado de propósito (entrada e saída não lançadas se cancelam; sobram 3 centavos). **POL corrigido 190,13 → 190,113** — erro de leitura do print de 01/09, sem transação no meio. Os outros 8 tokens batem na casa decimal. Nota: o total em USD do print não fecha com preço × qty (colunas de valor defasadas ~0,35%) — conferir sempre por quantidade.
- 08/11/2026 — a **ordem limite de BTC de sexta executou no domingo** (0,00023879 @ US$ 74.906, líquido 0,00023856, US$ 17,86): rotação dos 17,89 USDT do aporte de 06/11, `contributions` intocada e `TOTAL_INVESTED` em 9.703,68. ~3% mais barato que a semana anterior. Nenhum protocolo tocado. Topo do dashboard conferido: patrimônio US$ 8.463, os 4 cards fecham aditivos, 0 erro de console; pool já com US$ 45,13 de taxas. Pendente: ele lançar os 3 movimentos no CoinGecko (entrada do aporte + compra bruta + saída do USDT) e mandar o print para acertar o `cgMirror`.
- 24/10/2026 — **saque de 200 USDT da AAVE** (tx `0xf25c...ec00`, 14:41 UTC) para duas ordens limite de compra de ETH na Uniswap (100 @ 2.308,60 venc. 31/10 · 100 @ 2.191,11 venc. 23/11; mercado 2.341,12). Saque não mexe em `stables.USDT` — só `defi.aave` e `principals` (925,900978 → 725,900978, MCP confere). Ordens **pendentes**: quando executarem é rotação, não aporte. Juros da semana: WETH +0,00008 · USDT +0,063402. Líquido US$ 9.348,80 (−2,0% vs 23/10, só preço); dívida só Kamino 456,71; yield pendente ~US$ 14,87. Kamino sem print.
- 23/10/2026 (2) — **dívida da AAVE QUITADA** (768,40 USDC, com 770 USDT sacados do supply via swap no 1inch); dívida total 1.225,11 → **456,71** (só Kamino); HF deixa de existir (null) e 3 telas que mostrariam HF inventado foram corrigidas; custo da operação US$ 0,91 (slippage); pendente: dar saída de 770 USDT no CoinGecko.
- 23/10/2026 — review semanal + aporte de sexta (R$ 100 → 19,68 USDT → 0,00024074 BTC); AAVE e Kamino pelo MCP/print, principals intocados; borrow CEDEU nas duas (AAVE 6,12%, Kamino 6,06%); HF 7,74; LTV 17,52%; líquido US$ 9.540,96; Fiscal +R$ 150 (o de 09/10 faltava lá); achado e lançado o aporte de 16/10 que faltava (R$ 100 → 0,00023791 BTC) — outubro fecha com 4 aportes, US$ 128,06.
- 16/10/2026 — review semanal sem movimentação (principals conferem pelo MCP); só juros; borrow AAVE 8,79% e Kamino 8,88% (dobraram); HF 7,92; LTV 17,14%; yield pendente ~US$ 10,23; RDNT→ETH lançado no CoinGecko.
- 09/10/2026 — **regra nova: aporte toda sexta** (ele pediu para ser cobrado); 1o da série R$ 50 → 9,86463 USDT
  → 0,00011905 BTC; fiat→USDT é aporte (US$ 9,86 em `contributions`), USDT→BTC é rotação; `TOTAL_INVESTED` 10.398,50;
  régua confirmada por ele no mesmo dia: 50 REAIS, não dólares.
- 08/10/2026 — **RDNT zerado** (7.278,06 vendidos por US$ 7,90 → 0,0031 ETH; custo zero migra, `invested` do ETH
  intocado) + compras de BTC e SOL na OKX com o caixa de lá; tudo rotação, `TOTAL_INVESTED` segue 10.388,64;
  fecha a divergência de 12,39 RDNT aberta em 22/08; pendente no CoinGecko: só os 0,0031 ETH.
- 07/10/2026 (3) — compra de 0,0004855 BTC na OKX com USDT da corretora (rotação); caixa da OKX 171,58 → 131,09.
- 07/10/2026 (2) — compra de 0,365138 SOL na OKX com USDT da corretora (rotação); **regra do SOL mudou**: holding ≠ supply da Kamino, yield agora por delta.
- 07/10/2026 — compra de 0,02 ETH com os 50 USDT que sobravam na carteira EVM (rotação) + 1,54 USDC de troco incorporado.
- 05/10/2026 — **aporte de R$ 400 → 79,04 USDT** (fiat→cripto, 1ª contribuição externa desde ago/26);
  Fiscal e `contributions` atualizados.
- 02/10/2026 (7) — pendências fechadas: os 4,91 USDC eram taxa do protocolo (não ativo) e ele excluiu o USDS do CoinGecko; espelho zerado.
- 02/10/2026 (6) — 2º repay com KMNO convertido (−10,09 USDC): dívida Kamino 454,98, total 1.220,72; ganho puro (o KMNO não estava no site).
- 02/10/2026 (5) — repay na Kamino (767,21 → 465,07) com o USDS inteiro; corrigidos APY do SOL, LTV e liq.LTV que a sessão do /quant deixou do print anterior (liq.LTV 76,4% → 75% muda o preço de liquidação de 24,32 para 24,77).
- 02/10/2026 (4) — ele lançou os ~US$ 7,99 restantes; `cgMirror` igualado ao holding, pendente ZERO, 13 tokens conferidos.
- 02/10/2026 (3) — print do saldo da OKX (134,98 USDT — o caixa NÃO acabou) + Kamino de 02/10 (SOL 25,03 · USDS 305,46 · borrow 767,21 · LTV 23,40%).
- 02/10/2026 (2) — duplicata do BTC apagada por ele; CoinGecko e site conferem (0,00494132 / US$ 320,47); `cgMirror` limpo.
- 02/10/2026 — yields lançados por ele no CoinGecko (fim da fase "acumulando"); duplicata de BTC detectada pelo
  histórico da OKX (0,00036003 lançada 2x, uma com data futura); custo das compras de 28/09 corrigido para US$ 50,00;
  AAVE via MCP (HF 8,47); setembro fechou em +9,2% sem aporte.
- 29/09/2026 — 2 compras de BTC (US$ 49,98) com os 50 USDT da ordem limite: rotação; AAVE via MCP (HF 8,57);
  yield pendente ~US$ 26.
- 26/09/2026 — correção: a compra de 24/09 era rotação (USDT da AAVE), não aporte — `contributions` de 09/26
  esvaziada, USDT −50; `diario.js` sincronizado (44 entradas).
- 25/09/2026 — aporte de US$ 50 (+0,0189 ETH) em 24/09, 1ª linha de `contributions` de 09/26; qty errada no
  CoinGecko (0,189) confirmada pelo Lucas; AAVE via MCP (HF 8,53); yield pendente ~US$ 23,96.
- 18/09/2026 — depósito de 0,08 ETH na AAVE (principal WETH 2,289740, HF 8,35); yield pendente ~US$ 19,16.
- 18/09/2026 — verificação pós-publicação: local = origin/main, 121 testes e Actions verdes, site no ar com asOf 18/09 (portfolio líquido $9.716, HF 7,79, empréstimos com juros 0,0166 WETH / 22,37 USDT), 0 erro de console.
- 18/09/2026 — review semanal sem movimentação (principals conferem); só juros; borrow AAVE 6,10%; líquido US$ 9.710; yield pendente ~US$ 18,27.
- 16/09/2026 — 2 compras de ETH (US$ 200) pagas com USDT sacado da AAVE: rotação, não aporte; AAVE via MCP
  (principal USDT 1.695,90, borrow net 2,93%, HF 7,60); yield pendente ~US$ 13,44.
- 11/09/2026 — review via MCP da Aave (principals bateram na casa decimal); juro da AAVE passou a
  entrar no holding; yield pendente no CoinGecko fica acumulando; líquido US$ 9.691.
- 05/09/2026 — refresh semanal; ciclo do `cgMirror` fechado (Lucas lançou SOL/USDS); agregados
  passaram a ser derivados.
- 04/09/2026 — SOL estava abaixo do supply da Kamino (+0,164778 SOL de yield, custo zero).
