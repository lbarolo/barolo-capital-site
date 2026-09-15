// Equivalência da Fase 3: tema e idioma de cada página, ANTES (tests/fixtures/legacy-ui.js,
// literal do commit 5a334fc) e DEPOIS (código atual + lib/barolo-ui.js), no mesmo DOM falso.
//   · Tema aplicado, tema salvo e sequência de cliques: IDÊNTICOS em todas as páginas e estados.
//   · Ícone ☾/☀: o novo sempre bate com o tema. Os casos em que o antigo errava estão
//     listados aqui, um a um — são os bugs corrigidos.
//   · Idioma: textos de todas as chaves de LANG_STRINGS idênticos, em PT e EN.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('vm');
const H = require('./helpers/extract');
const { makeFakeDom, makeCtx } = require('./helpers/fakedom');
const LEG = require('./fixtures/legacy-ui.js');

const UI_SRC = H.read('lib/barolo-ui.js');
const FILES = { index: 'index.html', portfolio: 'portfolio_analytics.html', pools: 'pools.html', ferramentas: 'ferramentas.html', relatorio: 'relatorio.html' };
const ICON = { dark: '☾', light: '☀' };
// Dependências que as toggleTheme das páginas tocam, no estado REAL depois do carregamento:
// no portfolio os gráficos já estão prontos (chartsBuilt = true) e renderUI os refaz.
const PRELUDE = 'var chartsBuilt = true; var allocChartInst = null; var sparkCharts = {};\n' +
  'function destroyStatic(){} function buildEnriched(){ return []; } function renderUI(){ chartsBuilt = true; }\n' +
  'var evoChart = null;';

function button(page) {
  return page === 'index'
    ? { tag: 'button', attrs: { id: 'themeToggle', onclick: 'toggleTheme()' }, text: '☾' }
    : { tag: 'button', attrs: { onclick: 'toggleTheme()' }, text: '☾' };
}

// Página ANTIGA: head → scripts do corpo → DOMContentLoaded, com os trechos literais.
function oldPage(page, storage) {
  const L = LEG[page];
  const dom = makeFakeDom({ htmlTheme: 'dark', elements: [button(page)], storage });
  const ctx = makeCtx(dom);
  vm.runInContext(PRELUDE, ctx);
  L.head.forEach(s => vm.runInContext(s, ctx));
  vm.runInContext(L.toggleTheme, ctx);
  L.parse.forEach(s => vm.runInContext(s, ctx));
  dom.ready();
  L.ready.forEach(s => vm.runInContext(s, ctx));
  return { dom, ctx };
}

// Página NOVA: o <script> do <head> que chama BaroloUI.bootTheme(...) e a toggleTheme da página.
function newPage(page, storage) {
  const html = H.read(FILES[page]);
  const boot = html.match(/BaroloUI\.bootTheme\([^)]*\);?/);
  assert.ok(boot, FILES[page] + ' não chama BaroloUI.bootTheme');
  const dom = makeFakeDom({ htmlTheme: 'dark', elements: [button(page)], storage });
  const ctx = makeCtx(dom);
  vm.runInContext(PRELUDE, ctx);
  vm.runInContext(UI_SRC, ctx);
  vm.runInContext(boot[0], ctx);
  vm.runInContext(H.extractFunction(H.inlineScripts(html).join('\n;\n'), 'toggleTheme'), ctx);
  dom.ready();
  return { dom, ctx };
}

const state = p => ({ theme: p.dom.root.getAttribute('data-theme'), saved: p.dom.store['bc-theme'] ?? null });
const icon = p => p.dom.els[0].textContent;

// Onde o código ANTIGO mostrava o ícone errado (tema salvo → etapa → ícone antigo).
const OLD_WRONG_ICON = {
  'portfolio|dark|load': '◑ Tema',            // init() trocava o ☾ por "◑ Tema" (até o 1º clique)
  'pools|none|load': '☀',                    // 1ª visita: página escura, ícone ☀
  'ferramentas|none|load': '☀',
  'index|light|load': '☾',                   // ícone fixo no HTML, nunca acertado no carregamento
  'relatorio|light|load': '☾',               // relatório: toggle nunca trocava o ícone
  'relatorio|dark|click1': '☾',
  'relatorio|none|click1': '☾',
  'relatorio|light|click2': '☾'
};

for (const page of Object.keys(FILES)) {
  for (const saved of [null, 'dark', 'light']) {
    test(`tema · ${page} · salvo=${saved || 'nada'}: mesmo tema e mesmo localStorage; ícone sempre certo`, () => {
      const storage = saved ? { 'bc-theme': saved } : {};
      const o = oldPage(page, storage), n = newPage(page, storage);
      const tag = saved || 'none';
      const steps = [['load', () => {}], ['click1', () => { o.ctx.toggleTheme(); n.ctx.toggleTheme(); }], ['click2', () => { o.ctx.toggleTheme(); n.ctx.toggleTheme(); }]];
      for (const [step, act] of steps) {
        act();
        assert.deepStrictEqual(state(n), state(o), `${step}: estado difere`);
        assert.strictEqual(icon(n), ICON[state(n).theme], `${step}: ícone novo não bate com o tema`);
        const key = `${page}|${tag}|${step}`;
        if (key in OLD_WRONG_ICON) assert.strictEqual(icon(o), OLD_WRONG_ICON[key], `${key}: o antigo não errava como documentado`);
        else assert.strictEqual(icon(o), icon(n), `${key}: ícone mudou num caso em que o antigo estava certo`);
      }
    });
  }
}

test('portfolio antes de os gráficos ficarem prontos: a toggle antiga nem trocava o ícone; a nova troca', () => {
  const o = oldPage('portfolio', { 'bc-theme': 'light' }), n = newPage('portfolio', { 'bc-theme': 'light' });
  vm.runInContext('chartsBuilt = false;', o.ctx);
  vm.runInContext('chartsBuilt = false;', n.ctx);
  o.ctx.toggleTheme(); n.ctx.toggleTheme();
  assert.deepStrictEqual(state(n), state(o));
  assert.strictEqual(state(n).theme, 'dark');
  assert.strictEqual(icon(o), '☀');   // antigo: tema escuro, ícone de claro
  assert.strictEqual(icon(n), '☾');
});

test('portfolio, 1ª visita: continua claro (era o init; agora já no <head>, sem piscar escuro antes)', () => {
  assert.strictEqual(state(newPage('portfolio', {})).theme, 'light');
  assert.strictEqual(state(oldPage('portfolio', {})).theme, 'light');
});

// ── Idioma ────────────────────────────────────────────────────────────────
function langDom(page) {
  const ctx0 = vm.createContext({});
  vm.runInContext(LEG[page].langStrings, ctx0);
  const keys = Object.keys(ctx0.LANG_STRINGS);
  const elements = keys.map(k => ({ attrs: { 'data-i18n': k }, text: 'orig-' + k }));
  elements.push({ attrs: { id: 'langBtn' }, text: '?' });
  return { keys, elements };
}
function runLang(page, which, steps, storage) {
  const { elements } = langDom(page);
  const dom = makeFakeDom({ elements, storage });
  const ctx = makeCtx(dom);
  vm.runInContext(PRELUDE, ctx);
  vm.runInContext(LEG[page].langStrings, ctx);   // mesmo dicionário nos dois lados
  if (which === 'old') {
    vm.runInContext(LEG[page].applyLang + '\n' + LEG[page].toggleLang, ctx);
    vm.runInContext(LEG[page].initLang, ctx);
  } else {
    const js = H.inlineScripts(H.read(FILES[page])).join('\n;\n');
    vm.runInContext(UI_SRC, ctx);
    const extra = /function\s+langHtmlKey\s*\(/.test(js) ? H.extractFunction(js, 'langHtmlKey') + '\n' : '';
    vm.runInContext(extra + H.extractFunction(js, 'applyLang') + '\n' + H.extractFunction(js, 'toggleLang'), ctx);
    vm.runInContext('BaroloUI.bootLang(applyLang);', ctx);
  }
  const snaps = [dom.snapshot()];
  for (let i = 0; i < steps; i++) { ctx.toggleLang(); snaps.push(dom.snapshot()); }
  return snaps;
}

for (const page of ['portfolio', 'pools', 'ferramentas']) {
  for (const saved of [null, 'en']) {
    test(`idioma · ${page} · salvo=${saved || 'nada'}: todas as ${langDom(page).keys.length} chaves idênticas, ida e volta`, () => {
      const storage = saved ? { 'bc-lang': saved } : {};
      assert.deepStrictEqual(runLang(page, 'new', 2, storage), runLang(page, 'old', 2, storage));
    });
  }
}

test('bloco de moeda morto saiu de pools e ferramentas (sem botão e sem [data-usd])', () => {
  for (const f of ['pools.html', 'ferramentas.html']) {
    const html = H.read(f);
    assert.ok(!/id=["']currencyBtn["']/.test(html) && !/data-usd=/.test(html), f + ' ganhou botão/valores de moeda — reavaliar');
    assert.ok(!html.includes('exchangerate-api.com/v4/latest/USD'), f + ' ainda busca o câmbio sem usar');
    assert.ok(!/function\s+toggleCurrency\s*\(/.test(html), f);
  }
});
