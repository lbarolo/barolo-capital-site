# Caderno — Mesa DeFi diária

> Lido pela tarefa agendada **"Mesa diária"** (todo dia ~08:10) e pelo comando `/mesa`.
> **Atualizar "Estado atual", "Diário" e "Backlog" no fim de toda execução.**

## O que é
`mesa.html` é o painel de operação ao vivo (regime, sugestões de ação, alertas, colateral, APYs, laboratório de
pools, quant). A rotina diária faz três coisas: **(1) confere** que os dados chegaram, **(2) lê** a Mesa e
registra o que mudou desde ontem, **(3) melhora** o projeto em um passo pequeno por dia.

## Passo a passo da rotina
1. `git pull --rebase --autostash origin main` e `git status` (outra sessão pode estar mexendo na pasta).
2. **Saúde dos dados** — `quant.json` e `yields.json` com `generatedAt` de hoje? Se não (a Action `mesa.yml`
   falhou), rodar `node scripts/fetch-mesa.js`, e commitar **só** esses dois arquivos.
   Conferir também `networth-history.json` (último ponto de hoje ou ontem) e `briefing.json`.
3. `npm test` — se falhar, registrar em `agentes/bugs.md` → "Achados em aberto" e **não** fazer a melhoria do dia.
4. **Leitura** — `node scripts/mesa-report.js --json` (roda o mesmo código da página). Comparar com a linha de
   ontem no Diário: regime, vereditos de cada frente e alertas novos/resolvidos.
5. **Melhoria do dia** — pegar o item de maior prioridade do Backlog marcado `[auto]` e fazer, seguindo as regras
   abaixo. Item sem `[auto]` só é proposto no relatório (o Lucas decide no chat).
6. Atualizar este caderno, commitar só os arquivos da rotina, `npm test` verde, push na main.
7. **Relatório final** (curto, em português, sem jargão): o regime, o que mudou desde ontem, as sugestões que
   estão "Excelente"/"Evitar", alertas novos, a melhoria feita (ou proposta) e qualquer falha de dado.

## O que a rotina PODE fazer sozinha
- Rodar `scripts/fetch-mesa.js` e commitar `quant.json`/`yields.json`.
- Atualizar este caderno.
- Uma melhoria `[auto]` por dia, só em `mesa.html`, `scripts/fetch-mesa.js`, `scripts/mesa-report.js`,
  `.github/workflows/mesa.yml` e `tests/` — com `npm test` verde e conferida rodando o `mesa-report.js`.

## O que a rotina NUNCA faz sem o Lucas
- Mexer em posições (`data.js`), em `emprestimos.html` (bundle) ou em outras páginas do site.
- Mudar **regras, pisos, pesos ou limiares** das sugestões (HF ≥ 3, 2σ, 60% de concentração, notas de corte…).
  Isso é estratégia dele — propor no relatório.
- Reintroduzir "não tomar dívida em acumulação": o looping na queda é estratégia dele (corrigido em 25/11/2026).
- Colocar endereço de carteira ou identificador único em URL. Commitar arquivo que não é da rotina.

## Estado atual (25/11/2026)
Mesa publicada. Regime: zona de fundo, tendência de baixa (score 0,08, F&G 11). Compra: BTC/SOL/HYPE Excelente,
ETH Bom (concentração). Venda: Evitar. Pools: compra escalonada SOL/USDC Bom (falta stable). Empréstimos: looping
ETH na AAVE Bom (~US$ 1.200 até HF 3); Kamino abaixo do piso (1,6σ). Trocar SOL por LST: Excelente.

## Diário (1 linha por dia, mais recente em cima, manter ~30)
- 25/11/2026 — criação. Regime fundo (0,08) · Compra Excelente (BTC) · Venda Evitar · Pools Bom (compra escalonada SOL) · Empréstimos Bom (looping ETH AAVE) · 6 alertas de atenção.

## Backlog de melhorias (prioridade de cima para baixo)
- [ ] **Backtest das sugestões de compra** — "Excelente" de compra contra DCA fixo de sexta, em BTC/ETH/SOL desde 2022
  (QUANT.md §4 regra 5: regra nova só com backtest). Resultado vai para QUANT.md §5. *(propor ao Lucas antes de mudar pesos)*
- [ ] [auto] **Histórico dos vereditos** — `mesa.yml` grava 1 ponto/dia (`mesa-history.json`) com regime e vereditos;
  a Mesa mostra "Excelente desde dd/mm" em cada sugestão.
- [ ] **Bug no `fetch-briefing.js`**: AAVE aparece com dívida 0 e HF vazio (só lê borrow em USDC; hoje é GHO) — afeta o
  card "E daí, pra mim?" do pools.html. *(é fora da Mesa: registrar em bugs.md para o /corrigir)*
- [ ] [auto] **CAGR da tendência** (QUANT §4 regra 6) de BTC/ETH/SOL/HYPE no `fetch-mesa.js` e no quant da Mesa.
- [ ] [auto] **Notificação** quando um veredito mudar de faixa ou surgir alerta crítico (via PushNotification na rotina).
- [ ] **Funding e open interest** (velo/coinglass) como critério da venda fracionada e do looping — testar fonte no runner antes.
- [ ] [auto] Testes do motor de sugestões (`tests/mesa.test.js`) com quant/yields fixos — trava regressão no `buildActions`.

## Histórico da rotina
- 25/11/2026 — caderno criado; tarefa agendada "Mesa diária" (08:10).
