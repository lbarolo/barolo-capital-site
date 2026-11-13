'use strict';
// Aba "Semanal" (ferramentas.html): o botao SALVAR SEMANA chama swSave -> swRenderHistory,
// que passa entry.week / entry.year (NUMEROS) para escHtml. Em 22/10/2026 escHtml so aceitava
// texto e estourava "t.replace is not a function": o dado era gravado, mas o aviso "SALVO" e a
// lista de semanas nao apareciam. Estes testes seguram essa regressao.
const test = require('node:test');
const assert = require('node:assert');
const { read, inlineScripts, extractFunction } = require('./helpers/extract');

const js = inlineScripts(read('ferramentas.html')).join('\n');
const escHtml = new Function(extractFunction(js, 'escHtml') + '; return escHtml;')();

test('escHtml aceita numero, null e undefined sem estourar', () => {
  assert.strictEqual(escHtml(46), '46');
  assert.strictEqual(escHtml(2026), '2026');
  assert.strictEqual(escHtml(null), '');
  assert.strictEqual(escHtml(undefined), '');
});

test('escHtml continua escapando HTML e quebrando linha', () => {
  assert.strictEqual(escHtml('<b>&</b>'), '&lt;b&gt;&amp;&lt;/b&gt;');
  assert.strictEqual(escHtml('a\nb'), 'a<br>b');
});

test('o historico semanal chama escHtml com week/year (numeros) — por isso ele tem de aceitar numero', () => {
  const render = extractFunction(js, 'swRenderHistory');
  assert.match(render, /escHtml\(entry\.week\)/);
  assert.match(render, /escHtml\(entry\.year\)/);
});
