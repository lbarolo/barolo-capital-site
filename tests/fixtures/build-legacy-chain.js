#!/usr/bin/env node
/* Gera tests/fixtures/legacy-chain.js: os blocos de busca on-chain (IIFEs initWalletFetch e
   initCardanoFetch) de portfolio_analytics.html e pools.html EXATAMENTE como eram antes da
   Fase 2 (commit f4587b5, 14/09/2026), extraídos do git. Guardados como texto: os testes
   executam cada IIFE num sandbox com fetch/document/timers falsos e comparam o que ele faz
   com o que o código novo faz, com as mesmas respostas de rede.

   Uso: node tests/fixtures/build-legacy-chain.js */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { inlineScripts, matchBrace, ROOT } = require('../helpers/extract');

const COMMIT = 'f4587b5';
const show = f => execSync(`git show ${COMMIT}:${f}`, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64e6 });

// Texto de uma IIFE nomeada: '(function <name>() { ... })();'
function iife(js, name) {
  const start = js.indexOf('(function ' + name + '() {');
  if (start < 0) throw new Error('IIFE não encontrada: ' + name);
  const close = matchBrace(js, js.indexOf('{', start));
  if (close < 0 || js.slice(close + 1, close + 5) !== ')();') throw new Error('fim da IIFE não reconhecido: ' + name);
  return js.slice(start, close + 5);
}

const out = { commit: COMMIT };
for (const [key, file] of [['portfolio', 'portfolio_analytics.html'], ['pools', 'pools.html']]) {
  const js = inlineScripts(show(file)).join('\n;\n');
  out[key + 'Wallet'] = iife(js, 'initWalletFetch');
  out[key + 'Cardano'] = iife(js, 'initCardanoFetch');
}
const text = `/* GERADO por tests/fixtures/build-legacy-chain.js — NÃO EDITAR À MÃO.
   Blocos on-chain LITERAIS do commit ${COMMIT} (antes da Fase 2), como texto. */
module.exports = ${JSON.stringify(out, null, 1)};
`;
fs.writeFileSync(path.join(__dirname, 'legacy-chain.js'), text);
console.log('OK tests/fixtures/legacy-chain.js (' + text.length + ' bytes, commit ' + COMMIT + ')');
