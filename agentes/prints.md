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

## Estado atual — 24/10/2026 (`asOf` 2026-10-24) — saque de 200 USDT da AAVE, 2 ordens limite de ETH e a PRIMEIRA já executou
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

🔸 **USDT ficou negativo de propósito (−45,69)**: ele ainda não lançou a saída dos 49,26 da compra de
BTC (= −49,26 + 3,57 de yield). Some quando lançar. O BTC aparece como +0,000616 pelo mesmo motivo —
quando ele lançar, o espelho fica 0,00711492 (ele lança **bruto**), uns 0,00000286 acima do site, que
é a diferença acumulada das taxas das compras, já conhecida e aceita desde 02/10.

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
- 24/10/2026 (3) — compra de **0,00061885 BTC @ US$ 79.705 (US$ 49,26)** na OKX, paga com o caixa que já estava lá (49,32 parados desde 16/10) → **ROTAÇÃO**; BTC 0,00649382 → **0,00711206**, USDT 904,155114 → **854,895114**. `cgMirror` da ordem (a) aplicado pelo DELTA da transação (ETH →2,404903374, USDT →900,58676194), **não igualado ao holding** — igualar apagaria o yield pendente. Yield pendente real ~US$ 15,31; USDT acusa −45,69 até ele lançar a saída da compra de BTC.
- 24/10/2026 (2) — **a ordem limite (a) executou**: 100 USDT → **0,04332 ETH @ 2.308,60** (ETH fez mínima de 2.286,76 às 15:30 UTC). ROTAÇÃO — custo migra 1:1, `contributions` intocada, `TOTAL_INVESTED` segue 9.667,58. ETH 2,363991 → **2,407311**; USDT 1.004,155114 → **904,155114**. A ordem (b) @ 2.191,11 (venc. 23/11) segue pendente com os outros 100. Líquido US$ 9.356,56. Ele precisa lançar DOIS movimentos no CoinGecko (compra do ETH + saída de 100 USDT) e corrigir 0,0433 → **0,04332**; `cgMirror` só depois da confirmação.
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
