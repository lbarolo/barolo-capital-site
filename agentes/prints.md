# Caderno — Prints (review semanal, aporte, fechamento de posição)

> Lido pelo comando `/prints`. **Atualizar "Estado atual" e "Histórico" no fim de toda execução.**

## Quando usar
- Review semanal (prints de CoinGecko + AAVE + Kamino).
- Aporte novo, compra/venda, depósito/saque no lending, abertura/fechamento de pool.
- Extrato de corretora (conversão BRL→USDT) para a aba Fiscal.

## Regras que não podem quebrar
1. **`data.js` é a fonte única de posições.** As 6 páginas leem dele. `emprestimos.html` recebe
   sozinho pela Action `sync-emprestimos.yml` depois do push — não editar à mão para dados.
2. **Holdings JÁ incluem o colateral de AAVE/Kamino.** Patrimônio = holdings + stables + LP − dívida.
   Nunca somar o bloco `defi` por cima (dupla contagem).
3. **Piso do holding = supply do protocolo** (SOL e USDS: holding = supply da Kamino).
   `tests/data.test.js` quebra se o holding ficar abaixo.
4. **Juro/yield entra a custo zero**: a qty sobe, `invested` NÃO muda.
   - SOL/USDS: holding = supply da Kamino.
   - ETH/USDT: holding += (juro da AAVE hoje − juro da AAVE no último review). Os juros do
     último review ficam em "Estado atual" abaixo — por isso é obrigatório atualizá-lo.
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

## Estado atual — yields lançados no CoinGecko + duplicata de BTC a apagar (`asOf` 2026-10-02)
**Juros da AAVE no último review (base para a regra 4):** WETH **0,018554028543753534** · USDT **25,227541**

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,308294 | 1,70% | 2,289740 |
| AAVE USDT supply | 1.721,128519 | 3,67% | 1.695,900978 |
| AAVE USDC borrow | 765,737952 | 3,04% (net) · base 4,13% | 748,00 |
| Kamino SOL supply | 25,03 | 5,47% | 23,645990 |
| Kamino USDS supply | 305,46 | 3,63% | 300,392689 |
| Kamino USDC borrow | 767,21 | 5,95% | 690,834084 |

- ✅ **Ele lançou o yield acumulado no CoinGecko em 02/10** ("adcionei os valores ao coingecko"):
  ~US$ 25,89 de ETH/SOL/USDT/USDS entraram como transferência de entrada, custo zero. **Fim da fase
  "acumulando"** aberta em 11/09. SOL e USDS bateram na vírgula; no USDT ele lançou 7,56 contra
  7,531847 de pendente (3 centavos a mais, absorvidos pelo juro dos dias seguintes).
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
- Yield pendente: **~US$ 7,99** (ETH +0,000429 · SOL +0,05 · USDT +0,500029 · USDS +0,41) — o do
  ETH/USDT é o juro de 30/09 em diante; o de SOL/USDS é o supply novo da Kamino do print de 02/10.
- Borrow da AAVE em 4,13% base / 3,04% net contra supply do USDT em 3,67%: o carry voltou a ser
  favorável, não há mais o alerta de quitar que estava aberto desde 18/09.
- Rewards da Kamino não resgatados (~US$ 8,09: USDS 1,59 · PYUSD 0,07 · KMNO 6,43) — não lançar.
- `RENDA_2026` de setembro continua manual.

## Histórico (mais recente no topo, 1 linha por execução)
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
