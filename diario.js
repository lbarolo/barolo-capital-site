/* ════════════════════════════════════════════════════════════════════
   diario.js — DIÁRIO DEFI (fonte compartilhada, git-tracked)
   ════════════════════════════════════════════════════════════════════
   O Diário DeFi (aba em ferramentas.html) grava normalmente no
   localStorage do navegador do Lucas ('bc-diary-v2') — isso NUNCA muda,
   é o armazenamento vivo enquanto ele usa a página.

   Este arquivo é a CÓPIA SINCRONIZADA e git-tracked dessas entradas.
   Ele existe para que sessões que não têm acesso ao navegador do Lucas
   (ex: o standup diário automatizado, ou qualquer sessão do Claude Code
   rodando fora do browser) consigam LER o diário — coisa que o
   localStorage sozinho não permite.

   Como sincronizar (fluxo manual, feito pelo Lucas ou pelo Claude numa
   sessão interativa):
     1. Na aba Diário DeFi de ferramentas.html, clicar em "Sincronizar".
     2. Isso copia o conteúdo atualizado deste arquivo para a área de
        transferência (ou baixa diario.js se o clipboard falhar).
     3. Colar no chat do Claude Code (ou mandar o arquivo baixado) e
        pedir para salvar/commitar em diario.js.

   ferramentas.html faz o inverso automaticamente: no load, faz o MERGE
   de window.BAROLO_DIARY (aqui) com o localStorage do navegador —
   entradas novas no navegador entram; entradas já commitadas aqui
   aparecem mesmo em um navegador/perfil novo. O localStorage sempre
   vence em caso de conflito de id (é a versão mais recente).

   Formato de cada entrada: igual ao objeto salvo em localStorage
   ('bc-diary-v2') — id, date, type (pool|lending|trade|insight|risk),
   title, body, pnl, tags[], e opcionalmente lending{} ou trade{}.
   ════════════════════════════════════════════════════════════════════ */
window.BAROLO_DIARY = [
  {
    id: 1785456000000,
    date: '2026-07-31',
    type: 'insight',
    title: 'Fechamento Julho/2026 — patrimônio $7.031 (−8,1% no mês)',
    body: 'Patrimônio líquido $7.031 (Jun $7.651 → −$620 / −8,1% em USD). Retorno mensal −10,1% (TWR). ROI total ~−30,7% sobre $10.143 investidos; em BRL amortecido pelo câmbio (~4,95).\n\n'
      + 'POSITIVO: pool WETH/USDG (Robinhood) fee APR 68,86%, in-range, +$10,85 de fees em 17 dias (PnL real fees−IL = +$6,54); Kamino juros acumulados +$150,03; alavancagem defensiva mantida (dívida/patrimônio 22,5%, HF AAVE ~5,5, Kamino LTV 39,1% vs liq. 77,2%); DCA no bear (BTC +$95,89, SOL +$53,92).\n\n'
      + 'ATENÇÃO: carry AAVE apertando (borrow subiu p/ 3,97% vs net deposit APY 1,89%); pool a só +1,3% do piso do range (market $1.877 vs mín $1.852) — se ETH cair sai do range por baixo (vira 100% WETH, sem conversão ETH→USDG ainda); carry Kamino justo (borrow 5,56% vs supply blend ~4,85%).\n\n'
      + 'PRÓXIMO MÊS: decidir range da pool se ETH seguir no piso (reposicionar ou aceitar acumular 100% WETH); vigiar borrow AAVE (reduzir dívida se subir mais); monitorar spread Kamino.',
    pnl: -620,
    tags: ['fechamento-mensal', 'review', 'defi', 'julho-2026']
  }
];
