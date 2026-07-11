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
window.BAROLO_DIARY = [];
