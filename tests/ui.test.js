// Testes unitários de lib/barolo-ui.js num DOM falso.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('vm');
const H = require('./helpers/extract');
const { makeFakeDom, makeCtx } = require('./helpers/fakedom');

const UI_SRC = H.read('lib/barolo-ui.js');
function setup(opts = {}) {
  const dom = makeFakeDom(Object.assign({
    elements: [{ tag: 'button', attrs: { onclick: 'toggleTheme()' }, text: '☾' }, { tag: 'button', attrs: { id: 'themeToggle' }, text: '☾' }]
  }, opts));
  const ctx = makeCtx(dom);
  vm.runInContext(UI_SRC, ctx);
  return { dom, UI: ctx.BaroloUI };
}
const icons = dom => dom.els.filter(e => e.tag === 'button').map(e => e.textContent);

test('bootTheme: usa o tema salvo; sem nada salvo, o padrão da página', () => {
  let s = setup({ storage: { 'bc-theme': 'light' } });
  s.UI.bootTheme('dark');
  assert.strictEqual(s.dom.root.getAttribute('data-theme'), 'light');
  s = setup();
  s.UI.bootTheme('light');
  assert.strictEqual(s.dom.root.getAttribute('data-theme'), 'light');
  s = setup();
  s.UI.bootTheme('dark');
  assert.strictEqual(s.dom.root.getAttribute('data-theme'), 'dark');
});

test('bootTheme no <head>: o ícone é acertado quando o DOM fica pronto', () => {
  const s = setup({ storage: { 'bc-theme': 'light' } });
  s.UI.bootTheme('dark');
  assert.deepStrictEqual(icons(s.dom), ['☾', '☾']);   // ainda carregando
  s.dom.ready();
  assert.deepStrictEqual(icons(s.dom), ['☀', '☀']);
});

test('toggleTheme alterna, salva, acerta TODOS os botões e chama o gancho da página', () => {
  const s = setup();
  s.UI.bootTheme('dark');
  s.dom.ready();
  const seen = [];
  assert.strictEqual(s.UI.toggleTheme(t => seen.push(t)), 'light');
  assert.strictEqual(s.dom.root.getAttribute('data-theme'), 'light');
  assert.strictEqual(s.dom.store['bc-theme'], 'light');
  assert.deepStrictEqual(icons(s.dom), ['☀', '☀']);
  s.UI.toggleTheme(t => seen.push(t));
  assert.deepStrictEqual(seen, ['light', 'dark']);
  assert.deepStrictEqual(icons(s.dom), ['☾', '☾']);
});

test('sem data-theme a página é escura (paleta do :root) e o 1º clique vai para claro', () => {
  const s = setup({ htmlTheme: null });
  assert.strictEqual(s.UI.currentTheme(), 'dark');
  s.UI.toggleTheme();
  assert.strictEqual(s.dom.root.getAttribute('data-theme'), 'light');
});

test('localStorage bloqueado não quebra o tema', () => {
  const dom = makeFakeDom({ elements: [] });
  const ctx = makeCtx(dom);
  Object.defineProperty(ctx, 'localStorage', { get() { throw new Error('SecurityError'); } });
  vm.runInContext(UI_SRC, ctx);
  ctx.BaroloUI.bootTheme('light');
  assert.strictEqual(dom.root.getAttribute('data-theme'), 'light');
  assert.strictEqual(ctx.BaroloUI.toggleTheme(), 'dark');
});

test('idioma: aplica o dicionário, respeita chaves com HTML e guarda a escolha', () => {
  const s = setup({ elements: [
    { attrs: { 'data-i18n': 'a' }, text: 'A' }, { attrs: { 'data-i18n': 'b' }, text: 'B' },
    { attrs: { 'data-i18n': 'sem-traducao' }, text: 'fica' }, { attrs: { id: 'langBtn' }, text: '?' }
  ] });
  const STR = { a: { pt: 'um', en: 'one' }, b: { pt: '<b>dois</b>', en: '<b>two</b>' } };
  const apply = lang => s.UI.applyI18n(STR, lang, k => k === 'b');
  s.UI.bootLang(apply);
  assert.deepStrictEqual(s.dom.els.map(e => [e.textContent, e.innerHTML]),
    [['um', 'A'], ['B', '<b>dois</b>'], ['fica', 'fica'], ['EN', '?']]);
  s.UI.toggleLang(apply);
  assert.strictEqual(s.dom.store['bc-lang'], 'en');
  assert.strictEqual(s.dom.root.getAttribute('data-lang'), 'en');
  assert.strictEqual(s.dom.els[0].textContent, 'one');
  assert.strictEqual(s.dom.els[3].textContent, 'PT');
});
