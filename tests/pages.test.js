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

test('as 5 páginas carregam lib/barolo-ui.js no <head>, antes de qualquer BaroloUI.*', () => {
  for (const page of PAGES) {
    const html = H.read(page);
    const tag = html.indexOf('<script src="lib/barolo-ui.js">');
    assert.ok(tag > 0, `${page} não carrega lib/barolo-ui.js`);
    assert.ok(tag < html.indexOf('</head>'), `${page}: lib/barolo-ui.js tem de estar no <head> (evita piscar o tema)`);
    assert.ok(html.indexOf('BaroloUI.') > tag, `${page} usa BaroloUI antes de carregar`);
  }
});

test('as 5 páginas carregam lib/barolo-prices.js no <head>, antes de qualquer BaroloPrices.*', () => {
  for (const page of PAGES) {
    const html = H.read(page);
    const tag = html.indexOf('<script src="lib/barolo-prices.js">');
    assert.ok(tag > 0, `${page} não carrega lib/barolo-prices.js`);
    assert.ok(tag < html.indexOf('</head>'), `${page}: lib/barolo-prices.js deve estar no <head>`);
    assert.ok(html.indexOf('BaroloPrices.') > tag, `${page} usa BaroloPrices antes de carregar`);
  }
});

// Todo onclick="fn(...)" / onclick="Obj.fn(...)" precisa ter o que chamar na página — pega
// botão que ficou apontando para função removida.
test('todo onclick das páginas aponta para algo definido', () => {
  const LIBS = ['lib/barolo-core.js', 'lib/barolo-chain.js', 'lib/barolo-ui.js'].map(f => H.read(f)).join('\n');
  for (const page of PAGES) {
    const html = H.read(page);
    const js = H.inlineScripts(html).join('\n') + '\n' + LIBS;
    const names = [...new Set([...html.matchAll(/onclick="\s*([A-Za-z_$][\w$]*)/g)].map(m => m[1]))]
      // código inline no próprio onclick (var x = …; if …) não é chamada de função
      .filter(n => !['this', 'event', 'document', 'window', 'location', 'history', 'if', 'return',
        'var', 'let', 'const', 'new', 'typeof', 'void', 'function', 'try', 'true', 'false', 'null'].includes(n));
    for (const n of names) {
      const defined = new RegExp('function\\s+' + n + '\\s*\\(|(?:window\\.|\\b(?:var|let|const)\\s+)' + n + '\\s*=|\\b' + n + '\\s*=\\s*(?:function|\\()').test(js);
      assert.ok(defined, `${page}: onclick chama ${n}, que não está definido`);
    }
  }
});

test('scripts Node compilam', () => {
  const dir = path.join(H.ROOT, 'scripts');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8').replace(/^#!.*/, '');
    assert.doesNotThrow(() => vm.compileFunction(src, ['require', 'module', 'exports', '__dirname', '__filename']), f);
  }
});
