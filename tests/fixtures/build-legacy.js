#!/usr/bin/env node
/* Gera tests/fixtures/legacy.js: cópia LITERAL do código de cálculo como era ANTES da
   refatoração (commit 5ed73a1, 14/09/2026), extraída do git — não reescrita à mão.
   Os testes de equivalência rodam essas versões antigas lado a lado com o código novo
   sobre os mesmos dados e exigem o mesmo resultado.

   Uso: node tests/fixtures/build-legacy.js   (só é preciso rodar de novo se mudar o commit) */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { extractFunction, inlineScripts, ROOT } = require('../helpers/extract');

const COMMIT = '5ed73a1';
const show = f => execSync(`git show ${COMMIT}:${f}`, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64e6 });
const js = f => inlineScripts(show(f)).join('\n;\n');

function between(src, start, end) {
  const a = src.indexOf(start);
  if (a < 0) throw new Error('marcador não encontrado: ' + start);
  const b = src.indexOf(end, a + start.length);
  if (b < 0) throw new Error('marcador final não encontrado: ' + end);
  return src.slice(a, b + end.length);
}

const portfolio = js('portfolio_analytics.html');
const index = js('index.html');
const relatorio = js('relatorio.html');
const networth = show('scripts/fetch-networth.js');

const parts = {
  // portfolio_analytics.html
  calculatePerformanceMetrics: extractFunction(portfolio, 'calculatePerformanceMetrics'),
  computeXIRR: extractFunction(portfolio, 'computeXIRR'),
  portfolioTableBlock: between(portfolio,
    ' W.wealthCurve.labels.forEach(function(lbl){',
    '   }\n })();'),
  // index.html
  monthlyTWRSeries: extractFunction(index, 'monthlyTWRSeries'),
  calculateCAGR: extractFunction(index, 'calculateCAGR'),
  calculateRealReturn: extractFunction(index, 'calculateRealReturn'),
  estimateIRR: extractFunction(index, 'estimateIRR'),
  // relatorio.html
  relatorioIIFE: between(relatorio,
    '(function(){\n  var wc = window.BAROLO_DATA && window.BAROLO_DATA.wealthCurve;',
    '  MONTHLY_RETURNS = mr;\n})();'),
  // scripts/fetch-networth.js
  networthBlock: between(networth,
    '  const val = a => a.qty * prices[a.cgId].usd;',
    '  const netWorth = gross + stables + lp - debt;')
};

const out = `/* GERADO por tests/fixtures/build-legacy.js — NÃO EDITAR À MÃO.
   Código de cálculo LITERAL do commit ${COMMIT} (antes da refatoração de 14/09/2026),
   empacotado em funções para rodar isolado nos testes de equivalência. */

// ── portfolio_analytics.html ───────────────────────────────────────────────
${parts.calculatePerformanceMetrics}

${parts.computeXIRR}

function legacyPortfolioTable(W, MONTHLY_RETURNS_DATA) {
${parts.portfolioTableBlock}
  return MONTHLY_RETURNS_DATA;
}

// ── index.html (funções de dentro da IIFE do hero) ─────────────────────────
${parts.monthlyTWRSeries}

${parts.calculateCAGR}

${parts.calculateRealReturn}

${parts.estimateIRR}

// ── relatorio.html ─────────────────────────────────────────────────────────
function legacyRelatorioTable(window) {
  var WEALTH_CURVE = null, MONTHLY_RETURNS = null;
${parts.relatorioIIFE}
  return MONTHLY_RETURNS;
}

// ── scripts/fetch-networth.js ──────────────────────────────────────────────
function legacyNetWorth(B, prices) {
${parts.networthBlock}
  return { gross: gross, stables: stables, lp: lp, debt: debt, netWorth: netWorth };
}
`;
fs.writeFileSync(path.join(__dirname, 'legacy.js'), out);
console.log('OK tests/fixtures/legacy.js (' + out.length + ' bytes, commit ' + COMMIT + ')');
