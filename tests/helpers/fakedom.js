// DOM mínimo para testar tema e idioma sem navegador: elementos com atributos, texto e HTML;
// os seletores que as páginas usam (#id, [atributo], tag[atributo="valor"], listas com
// vírgula); DOMContentLoaded disparável; localStorage em memória.
const vm = require('vm');

function makeFakeDom({ htmlTheme = 'dark', elements = [], storage = {} } = {}) {
  const listeners = [];
  const mkEl = spec => ({
    tag: (spec.tag || 'div').toLowerCase(), attrs: Object.assign({}, spec.attrs || {}),
    textContent: spec.text || '', innerHTML: spec.html || spec.text || '', style: {},
    getAttribute(n) { return n in this.attrs ? this.attrs[n] : null; },
    setAttribute(n, v) { this.attrs[n] = String(v); }
  });
  const root = mkEl({ tag: 'html', attrs: htmlTheme ? { 'data-theme': htmlTheme } : {} });
  const els = elements.map(mkEl);
  const match = (el, sel) => {
    sel = sel.trim();
    let m;
    if ((m = sel.match(/^#([\w-]+)$/))) return el.attrs.id === m[1];
    if ((m = sel.match(/^\[([\w-]+)\]$/))) return m[1] in el.attrs;
    if ((m = sel.match(/^(\w+)\[([\w-]+)="([^"]*)"\]$/))) return el.tag === m[1] && el.attrs[m[2]] === m[3];
    throw new Error('seletor não suportado no DOM falso: ' + sel);
  };
  const qsa = sel => els.filter(el => sel.split(',').some(s => match(el, s)));
  const document = {
    documentElement: root, readyState: 'loading',
    getElementById: id => els.find(e => e.attrs.id === id) || null,
    querySelectorAll: sel => qsa(sel),
    querySelector: sel => qsa(sel)[0] || null,
    addEventListener: (ev, fn) => { if (ev === 'DOMContentLoaded') listeners.push(fn); }
  };
  const store = Object.assign({}, storage);
  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  };
  return {
    document, localStorage, store, els, root,
    ready() { document.readyState = 'interactive'; listeners.splice(0).forEach(fn => fn()); },
    snapshot() {
      return {
        html: Object.assign({}, root.attrs),
        els: els.map(e => ({ attrs: Object.assign({}, e.attrs), text: e.textContent, html: e.innerHTML })),
        store: Object.assign({}, store)
      };
    }
  };
}

// Contexto vm com o DOM falso; window === global (como no browser).
function makeCtx(dom, extra) {
  const ctx = vm.createContext(Object.assign({
    document: dom.document, localStorage: dom.localStorage,
    requestAnimationFrame: fn => fn(), console: { log() {}, warn() {}, error() {}, debug() {} }
  }, extra || {}));
  ctx.window = ctx;
  return ctx;
}

module.exports = { makeFakeDom, makeCtx };
