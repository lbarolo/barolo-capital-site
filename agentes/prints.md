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

## Estado atual — review de 18/09/2026 + depósito de 0,08 ETH na AAVE no mesmo dia (`asOf` 2026-09-18)
**Juros da AAVE no último review (base para a regra 4):** WETH **0,016646349** · USDT **22,408426** (lidos depois do depósito)

| | Qtd | APY | Principal |
|---|---|---|---|
| AAVE WETH supply | 2,306386 | 2,29% | **2,289740** (+0,08 depositado em 18/09) |
| AAVE USDT supply | 1.718,309404 | 3,27% | 1.695,900978 |
| AAVE USDC borrow | 763,990329 | 2,81% (net) · base 3,87% (oscilou 6,10% no mesmo dia) | 748,00 |
| Kamino SOL supply | 24,98 | 5,81% | 23,645990 |
| Kamino USDS supply | 305,05 | 3,27% | 300,392689 |
| Kamino USDC borrow | 764,96 | 5,43% | 690,834084 |

- Semana sem movimentação: principals da AAVE conferem na casa decimal (MCP); Kamino cresceu só o juro.
- CoinGecko = `cgMirror` exatamente (nenhuma compra/venda nova).
- 18/09: depositou **0,08 ETH** na AAVE (dos 0,0836 comprados em 15–16/09; ~0,0036 ETH ficam na carteira). Holding não muda, só o principal.
- HF AAVE 8,35 (após o depósito) · LTV Kamino 25,94% (Liq. 76,55%) · SOL liquida em ~US$ 27,79 · pool: nenhuma aberta.
- Patrimônio líquido US$ 9.710 (preços do print) · bruto US$ 11.239 · dívida US$ 1.528,92 · carry +US$ 19,57/mês.

**Pendências que o `/prints` deve lembrar:**
- ⏸ **Yield a lançar no CoinGecko ACUMULANDO** (decisão do Lucas, 11/09): **~US$ 18,27** em 18/09
  (ETH +0,0034 · SOL +0,04 · USDT +5,18 · USDS +0,36). Informar o total em todo review e no fechamento.
- Borrow da AAVE voltou a 6,10% (16/09 era 2,93%; 11/09 5,63%) contra supply do USDT 3,31%. Se ficar
  > 5% no próximo review também (2 seguidos), sugerir quitar a AAVE com o USDT (decisão dele).
- Rewards da Kamino não resgatados (~US$ 6,10: USDS 1,59 · PYUSD 0,07 · KMNO 4,44) — não lançar.
- Fechamento de setembro: 01/10 (Action `close-month.yml` + `/fecharmes`).

## Histórico (mais recente no topo, 1 linha por execução)
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
