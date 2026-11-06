'use strict';
// O que vai para o GitHub Pages: só os arquivos do site, e nenhuma referência quebrada.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { build, brokenRefs } = require('../scripts/build-pages.js');

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'barolo-pages-'));
const result = build(out);
const rel = result.files.map(f => path.relative(out, f).split(path.sep).join('/'));

test('todos os arquivos da lista existem no repositório', () => {
  assert.deepStrictEqual(result.missing, []);
});

test('toda referência local das páginas existe no artefato', () => {
  const { refs, bad } = brokenRefs(out);
  assert.ok(refs > 20, 'o scanner achou poucas referências: ' + refs);
  assert.deepStrictEqual(bad, []);
});

test('arquivos essenciais do Pages estão presentes', () => {
  for (const f of ['CNAME', '.nojekyll', 'robots.txt', 'index.html', 'data.js']) {
    assert.ok(rel.includes(f), 'falta ' + f);
  }
  assert.strictEqual(fs.readFileSync(path.join(out, 'CNAME'), 'utf8').trim(), 'barolocapital.com.br');
});

test('nenhum arquivo privado ou interno é publicado', () => {
  const proibido = /(^|\/)(agentes|tests|scripts|\.claude|\.github|\.agents|node_modules|DIARIO DEFI E PRINTS|EXPORTS SEMANAIS)(\/|$)|\.(md|py|xlsx|pdf)$|^(package\.json|skills-lock\.json|\.gitignore)$/;
  const vazou = rel.filter(f => proibido.test(f));
  assert.deepStrictEqual(vazou, []);
});

test('só HTML/CSS/JS/JSON/texto e as libs entram', () => {
  const ok = /\.(html|css|js|json|txt)$|^(CNAME|\.nojekyll)$/;
  assert.deepStrictEqual(rel.filter(f => !ok.test(f)), []);
});

test.after(() => fs.rmSync(out, { recursive: true, force: true }));
