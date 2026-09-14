// Utilitários dos testes: ler as páginas HTML e extrair funções pelo nome.
// As páginas são HTML estático com JS inline, então os testes pegam o código
// DIRETO do arquivo (o mesmo que o browser executa) em vez de uma cópia.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }

// Blocos <script> inline (sem src) de uma página, na ordem do arquivo.
function inlineScripts(html) {
  return [...html.matchAll(/<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(m => !/type\s*=\s*"(?!text\/javascript|module)[^"]*"/i.test(m[1])) // ignora JSON/manifest
    .map(m => m[2]);
}

// Índice do '}' que fecha o bloco aberto em `start` (que aponta para '{'),
// ignorando chaves dentro de strings, template literals e comentários.
function matchBrace(js, start) {
  let depth = 0, q = null;
  for (let i = start; i < js.length; i++) {
    const c = js[i], n = js[i + 1];
    if (q) {
      if (c === '\\') { i++; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === '/' && n === '/') { i = js.indexOf('\n', i); if (i < 0) return -1; continue; }
    if (c === '/' && n === '*') { i = js.indexOf('*/', i + 2) + 1; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

// Fonte completa de `function <name>(...) {...}` (a primeira ocorrência).
function extractFunction(js, name) {
  const m = new RegExp('(async\\s+)?function\\s+' + name + '\\s*\\(').exec(js);
  if (!m) throw new Error('função não encontrada: ' + name);
  const open = js.indexOf('{', m.index + m[0].length - 1);
  const close = matchBrace(js, js.indexOf('{', js.indexOf(')', m.index)));
  if (open < 0 || close < 0) throw new Error('chaves desbalanceadas em ' + name);
  return js.slice(m.index, close + 1);
}

// Executa código num contexto isolado e devolve o contexto (globais viram props).
function run(code, globals) {
  const ctx = vm.createContext(Object.assign({ Math, JSON, isFinite, parseInt, parseFloat, Array, Object }, globals || {}));
  vm.runInContext(code, ctx);
  return ctx;
}

// Carrega o data.js real como o browser carrega (window.BAROLO_DATA).
function loadData(src) {
  const win = {};
  new Function('window', src || read('data.js'))(win);
  return win.BAROLO_DATA;
}

function loadBenchmark() {
  const win = {};
  new Function('window', read('benchmark-data.js'))(win);
  return win.BENCHMARK_DATA;
}

module.exports = { ROOT, read, inlineScripts, extractFunction, matchBrace, run, loadData, loadBenchmark };
