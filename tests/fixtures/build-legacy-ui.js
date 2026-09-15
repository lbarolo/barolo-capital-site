#!/usr/bin/env node
/* Gera tests/fixtures/legacy-ui.js: o código de TEMA e IDIOMA de cada página EXATAMENTE como
   era antes da Fase 3 (commit 5a334fc, 14/09/2026), extraído do git. Cada trecho é procurado
   literalmente no arquivo daquele commit — se não existir, o script aborta.
   Guardado como texto; tests/ui-equivalence.test.js roda cada página antiga e nova num DOM
   falso e compara tema, ícone, localStorage e textos traduzidos.

   Uso: node tests/fixtures/build-legacy-ui.js */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { inlineScripts, extractFunction, matchBrace, ROOT } = require('../helpers/extract');

const COMMIT = '5a334fc';
const show = f => execSync(`git show ${COMMIT}:${f}`, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64e6 });

// Trechos de inicialização do tema, literais. Rodam na ordem em que o browser os rodava.
const DASH_HEAD = "(function(){\n var t=localStorage.getItem('bc-theme');\n if(t) document.documentElement.setAttribute('data-theme',t);\n})();";
const ICON_IIFE = "(function(){\n  var t = localStorage.getItem('bc-theme') || 'light';\n  var btn = document.querySelector('button[onclick=\"toggleTheme()\"]');\n  if(btn) btn.textContent = t === 'dark' ? '☾' : '☀';\n})();";
const PAGES = {
  index: {
    file: 'index.html',
    head: ["(function(){\n  var t=localStorage.getItem('bc-theme')||'dark';\n  document.documentElement.setAttribute('data-theme',t);\n})();",
           "(function(){\n  var t=localStorage.getItem('bc-theme');\n  if(t) document.documentElement.setAttribute('data-theme',t);\n})();"],
    parse: [], ready: []
  },
  portfolio: {
    file: 'portfolio_analytics.html', head: [DASH_HEAD], parse: [ICON_IIFE],
    ready: [" const saved=localStorage.getItem('bc-theme');\n document.documentElement.setAttribute('data-theme', saved || 'light');\n // Update theme button icon\n const thBtn=document.querySelector('button[onclick=\"toggleTheme()\"]');\n if(thBtn && saved==='dark') thBtn.textContent='◑ Tema';"],
    lang: true
  },
  pools: {
    file: 'pools.html', head: [DASH_HEAD], parse: [ICON_IIFE],
    ready: [" const saved=localStorage.getItem('bc-theme');\n if(saved)document.documentElement.setAttribute('data-theme',saved);"],
    lang: true
  },
  ferramentas: {
    file: 'ferramentas.html', head: [DASH_HEAD],
    parse: ["var savedTheme=localStorage.getItem('bc-theme');\nif(savedTheme) document.documentElement.setAttribute('data-theme',savedTheme);", ICON_IIFE],
    ready: [], lang: true
  },
  relatorio: {
    file: 'relatorio.html',
    head: ["(function(){\n  var t = localStorage.getItem('bc-theme') || 'dark';\n  document.documentElement.setAttribute('data-theme', t);\n})();"],
    parse: [], ready: []
  }
};

const out = { commit: COMMIT };
for (const [key, p] of Object.entries(PAGES)) {
  const html = show(p.file);
  for (const s of [...p.head, ...p.parse, ...p.ready]) {
    if (!html.includes(s)) throw new Error(`${p.file}: trecho não encontrado no commit ${COMMIT}:\n${s}`);
  }
  const js = inlineScripts(html).join('\n;\n');
  const entry = {
    head: p.head, parse: p.parse,
    ready: p.ready.map(s => '(function(){\n' + s + '\n})();'),   // eram corpo de DOMContentLoaded/init
    toggleTheme: extractFunction(js, 'toggleTheme')
  };
  if (p.lang) {
    const start = js.indexOf('var LANG_STRINGS = {');
    const close = matchBrace(js, js.indexOf('{', start));
    entry.langStrings = js.slice(start, close + 1) + ';';
    entry.applyLang = extractFunction(js, 'applyLang');
    entry.toggleLang = extractFunction(js, 'toggleLang');
    entry.initLang = "(function initLang() {\n  var saved = localStorage.getItem('bc-lang') || 'pt';\n  applyLang(saved);\n})();";
    if (!html.includes(entry.initLang)) throw new Error(p.file + ': initLang não encontrado');
  }
  out[key] = entry;
}
const text = `/* GERADO por tests/fixtures/build-legacy-ui.js — NÃO EDITAR À MÃO.
   Tema e idioma de cada página, LITERAIS do commit ${COMMIT} (antes da Fase 3). */
module.exports = ${JSON.stringify(out, null, 1)};
`;
fs.writeFileSync(path.join(__dirname, 'legacy-ui.js'), text);
console.log('OK tests/fixtures/legacy-ui.js (' + text.length + ' bytes, commit ' + COMMIT + ')');
