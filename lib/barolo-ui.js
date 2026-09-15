/* ════════════════════════════════════════════════════════════════════════════
   lib/barolo-ui.js — tema claro/escuro e idioma, compartilhados pelas páginas
   ════════════════════════════════════════════════════════════════════════════
   Até 14/09/2026 cada página tinha a própria versão (5 toggleTheme diferentes, 3 cópias
   de applyLang/toggleLang/initLang), e o tema era aplicado em até 3 lugares por página
   (script no <head>, de novo no meio do arquivo e num bloco só para o ícone), com padrões
   diferentes entre eles. Resultado: o ícone ☾/☀ nem sempre batia com o tema — o portfolio
   escuro mostrava "◑ Tema"; pools e ferramentas, na primeira visita, mostravam ☀ numa página
   escura; landing e relatório não acertavam o ícone no carregamento.

   Uso, NO <head> (aplica o tema antes de pintar, sem piscar):
     <script src="lib/barolo-ui.js"></script>
     <script>BaroloUI.bootTheme('dark')</script>   ← tema da 1ª visita (sem nada salvo)
   Cada página mantém a própria toggleTheme() (é ela que o botão chama) e passa para
   BaroloUI.toggleTheme(fn) só o que é dela — rebuild dos gráficos. Idem para o idioma.
   Chaves de localStorage, compartilhadas entre as páginas: bc-theme, bc-lang.
   ════════════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BaroloUI = api;
})(typeof window !== 'undefined' ? window : null, function (root) {
  'use strict';

  var THEME_KEY = 'bc-theme', LANG_KEY = 'bc-lang';
  var THEME_ICON = { dark: '☾', light: '☀' };
  // Todo botão de tema: o da landing tem id; os dos dashboards, só o onclick.
  var THEME_BUTTONS = '#themeToggle, button[onclick="toggleTheme()"]';

  var doc = function () { return root.document; };
  function read(key) { try { return root.localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, value) { try { root.localStorage.setItem(key, value); } catch (e) { /* storage bloqueado */ } }

  // ── Tema ───────────────────────────────────────────────────────────────────
  // Sem data-theme a página renderiza escura (o :root de todas as páginas é a paleta escura).
  function currentTheme() {
    return doc().documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncThemeButtons() {
    var icon = THEME_ICON[currentTheme()];
    doc().querySelectorAll(THEME_BUTTONS).forEach(function (b) { b.textContent = icon; });
  }

  // Tema salvo, ou o padrão da página na primeira visita. O botão ainda não existe quando
  // isto roda no <head>, então o ícone é acertado no DOMContentLoaded.
  function bootTheme(defaultTheme) {
    var t = read(THEME_KEY) || defaultTheme;
    if (t) doc().documentElement.setAttribute('data-theme', t);
    if (doc().readyState === 'loading') doc().addEventListener('DOMContentLoaded', syncThemeButtons);
    else syncThemeButtons();
  }

  // Alterna, salva, acerta o ícone e chama onChange(novoTema) — é onde a página reconstrói
  // o que lê cor do tema na construção (gráficos).
  function toggleTheme(onChange) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    doc().documentElement.setAttribute('data-theme', next);
    write(THEME_KEY, next);
    syncThemeButtons();
    if (typeof onChange === 'function') onChange(next);
    return next;
  }

  // ── Idioma ─────────────────────────────────────────────────────────────────
  function currentLang() { return doc().documentElement.getAttribute('data-lang') || 'pt'; }

  // Aplica o dicionário da página (LANG_STRINGS: { chave: { pt, en } }) em todo [data-i18n].
  // htmlKey(chave) → true usa innerHTML (textos com marcação); o resto usa textContent.
  function applyI18n(strings, lang, htmlKey) {
    doc().documentElement.setAttribute('data-lang', lang);
    var btn = doc().getElementById('langBtn');
    if (btn) btn.textContent = lang === 'pt' ? 'EN' : 'PT';
    doc().querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var s = strings[key];
      if (!s || !s[lang]) return;
      if (htmlKey && htmlKey(key)) el.innerHTML = s[lang];
      else el.textContent = s[lang];
    });
  }

  // apply = a applyLang da página (que chama applyI18n e faz o que for só dela).
  function bootLang(apply) { apply(read(LANG_KEY) || 'pt'); }
  function toggleLang(apply) {
    var next = currentLang() === 'pt' ? 'en' : 'pt';
    write(LANG_KEY, next);
    apply(next);
  }

  return {
    THEME_ICON: THEME_ICON,
    currentTheme: currentTheme, syncThemeButtons: syncThemeButtons, bootTheme: bootTheme, toggleTheme: toggleTheme,
    currentLang: currentLang, applyI18n: applyI18n, bootLang: bootLang, toggleLang: toggleLang
  };
});
