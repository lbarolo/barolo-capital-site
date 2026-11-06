#!/usr/bin/env node
/**
 * Monta a pasta _site/ com SÓ os arquivos que o site precisa para funcionar.
 * É o que o workflow pages.yml publica no GitHub Pages — o resto do repositório
 * (CLAUDE.md, QUANT.md, agentes/, tests/, scripts/, .claude/ ...) deixa de ser
 * servido no domínio.
 *
 * Uso:   node scripts/build-pages.js [pastaDeSaida]      (padrão: _site)
 *
 * Arquivo novo que o site passa a usar? Acrescente em FILES (ou DIRS) abaixo.
 * O teste tests/pages-build.test.js falha se uma página referenciar algo que
 * ficou de fora.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const FILES = [
  'index.html', 'portfolio_analytics.html', 'pools.html', 'ferramentas.html',
  'relatorio.html', 'emprestimos.html',
  'ui-polish.css',
  'data.js', 'diario.js', 'benchmark-data.js',
  'btc-onchain.json', 'networth-history.json', 'briefing.json',
  'robots.txt', 'CNAME', '.nojekyll',
];
const DIRS = ['lib'];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}

function build(outDir) {
  const out = path.resolve(outDir);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const missing = [];
  for (const f of FILES) {
    const src = path.join(ROOT, f);
    if (f === '.nojekyll') { fs.writeFileSync(path.join(out, f), ''); continue; }
    if (!fs.existsSync(src)) { missing.push(f); continue; }
    fs.copyFileSync(src, path.join(out, f));
  }
  for (const d of DIRS) fs.cpSync(path.join(ROOT, d), path.join(out, d), { recursive: true });
  return { out, missing, files: walk(out) };
}

// Referências locais (src/href/fetch/strings) a arquivos com extensão do site.
const REF_RE = /(?:src=|href=|fetch\(|['"])\s*['"]?((?:\.\/)?(?:lib\/)?[A-Za-z0-9_-]+\.(?:js|css|json|html))['"]/g;

function brokenRefs(out) {
  const bad = new Set();
  let refs = 0;
  for (const f of walk(out).filter(f => /\.(html|js)$/.test(f))) {
    const t = fs.readFileSync(f, 'utf8');
    let m;
    REF_RE.lastIndex = 0;
    while ((m = REF_RE.exec(t))) {
      const r = m[1].replace(/^\.\//, '');
      refs++;
      if (!fs.existsSync(path.join(out, r))) bad.add(path.basename(f) + ' -> ' + r);
    }
  }
  return { refs, bad: [...bad] };
}

module.exports = { FILES, DIRS, ROOT, build, brokenRefs, walk };

if (require.main === module) {
  const { out, missing, files } = build(process.argv[2] || '_site');
  const { refs, bad } = brokenRefs(out);
  const kb = Math.round(files.reduce((s, f) => s + fs.statSync(f).size, 0) / 1024);
  console.log(`_site: ${files.length} arquivos, ${kb} KB, ${refs} referências`);
  if (missing.length) { console.error('Faltando no repositório: ' + missing.join(', ')); process.exit(1); }
  if (bad.length) { console.error('Referências quebradas:\n  ' + bad.join('\n  ')); process.exit(1); }
}
