// Estrutura: todo JS das páginas e dos scripts compila, e as páginas que usam o core
// o carregam antes de usar. Pega o tipo de erro que já quebrou o site no passado
// (SyntaxError por edição que corrompe um bloco inteiro de <script>).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const H = require('./helpers/extract');

const PAGES = ['index.html', 'portfolio_analytics.html', 'pools.html', 'ferramentas.html', 'relatorio.html'];

for (const page of PAGES) {
  test(`${page}: todos os <script> inline compilam`, () => {
    H.inlineScripts(H.read(page)).forEach((src, i) => {
      assert.doesNotThrow(() => new vm.Script(src, { filename: `${page}#script${i}` }), `${page} script #${i}`);
    });
  });
}

test('páginas que usam BaroloCore carregam lib/barolo-core.js antes do primeiro uso', () => {
  for (const page of ['index.html', 'portfolio_analytics.html', 'relatorio.html']) {
    const html = H.read(page);
    const tag = html.indexOf('<script src="lib/barolo-core.js">');
    const use = html.indexOf('BaroloCore.');
    assert.ok(tag > 0, `${page} não carrega o core`);
    assert.ok(use > tag, `${page} usa BaroloCore antes de carregar`);
    assert.ok(html.indexOf('<script src="data.js">') < tag, `${page}: data.js deve vir antes do core`);
  }
});

test('páginas que usam BaroloChain carregam lib/barolo-chain.js antes do primeiro uso', () => {
  for (const page of ['portfolio_analytics.html', 'pools.html']) {
    const html = H.read(page);
    const tag = html.indexOf('<script src="lib/barolo-chain.js">');
    const use = html.indexOf('BaroloChain');
    assert.ok(tag > 0, `${page} não carrega lib/barolo-chain.js`);
    assert.ok(html.indexOf('BaroloChain', tag + 60) > tag && use >= tag, `${page} usa BaroloChain antes de carregar`);
    assert.ok(html.indexOf('<script src="data.js">') < tag, `${page}: data.js deve vir antes`);
  }
});

test('scripts Node compilam', () => {
  const dir = path.join(H.ROOT, 'scripts');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8').replace(/^#!.*/, '');
    assert.doesNotThrow(() => vm.compileFunction(src, ['require', 'module', 'exports', '__dirname', '__filename']), f);
  }
});
