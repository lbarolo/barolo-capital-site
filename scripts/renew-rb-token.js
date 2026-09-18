#!/usr/bin/env node
/**
 * renew-rb-token.js — renova sozinho o token da Bitcoin Lab API (secret RB_TOKEN) antes de expirar.
 *
 * Regras da researchbitcoin.net (FAQ, conferido em 18/09/2026):
 *   - a chave vale 90 dias;
 *   - dá para renovar pela API (POST /v2/auth/renew), mas só nos 7 últimos dias antes de expirar;
 *   - a cada 180 dias é obrigatório entrar no site e gerar a chave lá — isso não tem como automatizar.
 * Foi o que derrubou a aba Ciclo em 16/09/2026 (token de 17/06, "reason":"token_expired").
 *
 * O que faz, uma vez por dia (Action rb-token.yml):
 *   - lê a validade em /v2/info/user_info;
 *   - faltando ≤ 7 dias: renova e grava a chave nova no secret RB_TOKEN (via `gh`, com o
 *     secret RB_RENEW_PAT — o GITHUB_TOKEN das Actions não tem permissão para gravar secrets);
 *   - quando só resolve entrando no site (180 dias, ou sem RB_RENEW_PAT): falha de propósito
 *     com 10 dias de antecedência — o e-mail de falha do GitHub é o lembrete.
 *
 * Repositório público: nunca imprimir o token nem o e-mail da conta. A chave nova é mascarada
 * (::add-mask::) antes de qualquer outra saída.
 */
const { spawnSync } = require('child_process');

const BASE = 'https://api.researchbitcoin.net/v2';
// O WAF da API recusa User-Agent incomum (403) — mesmo cabeçalho do fetch-onchain.js.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const DAY = 86400000;
const RENEW_WINDOW_DAYS = 7;   // a API só aceita renovar nos 7 últimos dias
const ALERT_DAYS = 10;         // antecedência do aviso quando precisar entrar no site

const MANUAL_STEPS =
  'Entre em https://api.researchbitcoin.net/v2/token (Log in → Generate New API Key) e troque o secret ' +
  'em Settings → Secrets and variables → Actions → RB_TOKEN.';

const daysUntil = (d, now) => (d.getTime() - now.getTime()) / DAY;
const br = d => d.toISOString().slice(0, 10).split('-').reverse().join('/');

/** Decide o que fazer hoje. Puro — testado em tests/rb-token.test.js. */
function decide({ expiresAt, reauthAt, now, hasPat }) {
  const exp = daysUntil(expiresAt, now);
  const re = daysUntil(reauthAt, now);
  const deadline = expiresAt < reauthAt ? expiresAt : reauthAt;
  if (re <= ALERT_DAYS)
    return { action: 'manual', deadline,
      reason: `o site exige novo login até ${br(reauthAt)} (a cada 180 dias; renovar pela API não resolve)` };
  if (exp <= RENEW_WINDOW_DAYS)
    return hasPat
      ? { action: 'renew', deadline }
      : { action: 'manual', deadline, reason: `o token expira em ${br(expiresAt)} e o secret RB_RENEW_PAT não está configurado` };
  if (exp <= ALERT_DAYS && !hasPat)
    return { action: 'manual', deadline, reason: `o token expira em ${br(expiresAt)} e o secret RB_RENEW_PAT não está configurado` };
  return { action: 'ok', deadline };
}

// Anotação do GitHub: vira o motivo no resumo do run e no e-mail de falha.
const annotate = (level, msg) =>
  `::${level} title=renew-rb-token::` + String(msg).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
// Corpo de erro da API pode citar a conta — tira qualquer e-mail antes de imprimir.
const scrub = s => String(s).replace(/[^\s"'<>]+@[^\s"'<>]+/g, '<email>').slice(0, 200);

async function userInfo(fetchFn, token) {
  const r = await fetchFn(`${BASE}/info/user_info`, {
    headers: { 'X-API-Token': token, 'Accept': 'application/json', 'User-Agent': UA } });
  if (!r.ok) return { ok: false, status: r.status, body: scrub(await r.text()) };
  const j = await r.json();
  return { ok: true, data: j && j.data ? j.data : j };
}

/**
 * Fluxo completo com dependências injetáveis (teste sem rede).
 * deps: { env, fetch, gh(args, input) → { status, stderr }, log(line), now: Date }. Devolve o exit code.
 */
async function run({ env, fetch: fetchFn, gh, log, now }) {
  const token = env.RB_TOKEN;
  const pat = env.RB_RENEW_PAT;
  const repo = env.GITHUB_REPOSITORY;
  const fail = msg => { log(annotate('error', msg)); return 1; };

  if (!token) return fail('Secret RB_TOKEN não configurado. ' + MANUAL_STEPS);

  const info = await userInfo(fetchFn, token);
  if (!info.ok)
    return fail(`O token atual já não funciona (HTTP ${info.status}: ${info.body}). ` +
      'Renovação automática só vale antes de expirar. ' + MANUAL_STEPS);

  const expiresAt = new Date(info.data.api_key_expires_at);
  const reauthAt = new Date(info.data.web_reauth_required_at);
  if (isNaN(expiresAt) || isNaN(reauthAt))
    return fail('A API não devolveu api_key_expires_at / web_reauth_required_at — o formato mudou; conferir /v2/info/user_info.');

  log(`Token expira em ${br(expiresAt)} (${daysUntil(expiresAt, now).toFixed(1)} dias); ` +
      `login obrigatório no site até ${br(reauthAt)} (${daysUntil(reauthAt, now).toFixed(1)} dias).`);

  const d = decide({ expiresAt, reauthAt, now, hasPat: !!pat });
  if (d.action === 'ok') { log('Nada a fazer hoje.'); return 0; }
  if (d.action === 'manual')
    return fail(`Ação manual necessária até ${br(d.deadline)}: ${d.reason}. ` + MANUAL_STEPS);

  // ── renovar ──
  if (!repo) return fail('GITHUB_REPOSITORY ausente — só renova rodando no Actions.');
  // Antes de invalidar o token atual, garantir que dá para gravar o novo.
  const probe = gh(['api', `repos/${repo}/actions/secrets/public-key`], null);
  if (probe.status !== 0)
    return fail('O secret RB_RENEW_PAT não consegue gravar secrets neste repositório (expirado ou sem a ' +
      `permissão "Secrets: Read and write"). Nada foi renovado. Prazo: ${br(d.deadline)}. ` + MANUAL_STEPS);

  const r = await fetchFn(`${BASE}/auth/renew`, { method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'User-Agent': UA } });
  if (!r.ok)
    return fail(`A API recusou a renovação (HTTP ${r.status}: ${scrub(await r.text())}). ` +
      `O token atual segue valendo até ${br(d.deadline)}. ` + MANUAL_STEPS);
  const out = await r.json();
  const key = out && out.api_key;
  if (!key) return fail('A renovação não devolveu api_key. O token atual pode ter sido invalidado. ' + MANUAL_STEPS);
  log(`::add-mask::${key}`);

  const set = gh(['secret', 'set', 'RB_TOKEN', '--repo', repo], key);
  if (set.status !== 0)
    return fail('Renovei o token, mas não consegui gravar o secret RB_TOKEN (' + scrub(set.stderr) + '). ' +
      'A chave antiga já foi invalidada pela API. ' + MANUAL_STEPS);

  const check = await userInfo(fetchFn, key);
  if (!check.ok) {
    log(annotate('warning', `Secret gravado, mas a chave nova respondeu HTTP ${check.status} na conferência.`));
    return 0;
  }
  log(`✓ Token renovado e gravado no secret RB_TOKEN. Nova validade: ${br(new Date(check.data.api_key_expires_at))}.`);
  return 0;
}

if (require.main === module) {
  const gh = (args, input) => {
    const r = spawnSync('gh', args, { input: input == null ? undefined : input, encoding: 'utf8',
      env: Object.assign({}, process.env, { GH_TOKEN: process.env.RB_RENEW_PAT || '' }) });
    return { status: r.status == null ? 1 : r.status, stderr: r.stderr || (r.error && r.error.message) || '' };
  };
  run({ env: process.env, fetch, gh, log: l => console.log(l), now: new Date() })
    .then(code => process.exit(code))
    .catch(e => { console.log(annotate('error', 'Erro inesperado: ' + scrub(e.message))); process.exit(1); });
}

module.exports = { decide, run, annotate, RENEW_WINDOW_DAYS, ALERT_DAYS };
