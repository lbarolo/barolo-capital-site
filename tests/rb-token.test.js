// Renovação automática do token da Bitcoin Lab (scripts/renew-rb-token.js), sem rede.
// Regras da API: chave vale 90 dias, renovação só nos 7 últimos dias, login no site a cada 180.
// O que precisa ser verdade: renova só na janela; avisa (falha) quando só resolve pelo site;
// nunca invalida o token atual sem antes provar que consegue gravar o novo; nunca imprime a
// chave nem o e-mail da conta (o repositório e os logs das Actions são públicos).
const test = require('node:test');
const assert = require('node:assert/strict');
const { decide, run } = require('../scripts/renew-rb-token.js');

const NOW = new Date('2026-12-10T08:00:00Z');
const at = days => new Date(NOW.getTime() + days * 86400000);
const OLD = '11111111-aaaa-4bbb-8ccc-000000000001';
const NEW = '22222222-dddd-4eee-8fff-000000000002';
const EMAIL = 'dono@exemplo.com';

test('decide: longe da validade não faz nada', () => {
  assert.equal(decide({ expiresAt: at(40), reauthAt: at(120), now: NOW, hasPat: true }).action, 'ok');
  assert.equal(decide({ expiresAt: at(40), reauthAt: at(120), now: NOW, hasPat: false }).action, 'ok');
});

test('decide: entre 10 e 7 dias espera a janela (com PAT) ou já avisa (sem PAT)', () => {
  assert.equal(decide({ expiresAt: at(9), reauthAt: at(120), now: NOW, hasPat: true }).action, 'ok');
  assert.equal(decide({ expiresAt: at(9), reauthAt: at(120), now: NOW, hasPat: false }).action, 'manual');
});

test('decide: dentro dos 7 dias renova (com PAT), senão pede ação manual', () => {
  assert.equal(decide({ expiresAt: at(6.5), reauthAt: at(120), now: NOW, hasPat: true }).action, 'renew');
  assert.equal(decide({ expiresAt: at(7), reauthAt: at(120), now: NOW, hasPat: true }).action, 'renew');
  assert.equal(decide({ expiresAt: at(6.5), reauthAt: at(120), now: NOW, hasPat: false }).action, 'manual');
});

test('decide: login de 180 dias chegando é sempre manual, e o prazo é o que vence primeiro', () => {
  const d = decide({ expiresAt: at(5), reauthAt: at(8), now: NOW, hasPat: true });
  assert.equal(d.action, 'manual');
  assert.equal(d.deadline.getTime(), at(5).getTime());
  assert.match(d.reason, /180 dias/);
  assert.equal(decide({ expiresAt: at(60), reauthAt: at(10), now: NOW, hasPat: true }).action, 'manual');
  assert.equal(decide({ expiresAt: at(60), reauthAt: at(11), now: NOW, hasPat: true }).action, 'ok');
});

// ── fluxo completo com API e `gh` falsos ──
function harness({ info = { exp: 6, reauth: 120 }, infoStatus = 200, renewStatus = 200,
                   probeStatus = 0, setStatus = 0, env = {} } = {}) {
  const calls = [], ghCalls = [], logs = [];
  const json = (status, body) => ({ ok: status < 300, status,
    json: async () => body, text: async () => JSON.stringify(body) });
  const fetch = async (url, opt = {}) => {
    calls.push({ url, opt });
    if (url.endsWith('/info/user_info')) {
      const tok = opt.headers['X-API-Token'];
      if (infoStatus !== 200 && tok === OLD) return json(infoStatus, { status: 'fail', error: 'unauthorized', details: { user: EMAIL } });
      const exp = tok === NEW ? 90 : info.exp;
      return json(200, { data: { api_key_expires_at: at(exp).toISOString(),
        web_reauth_required_at: at(info.reauth).toISOString(), user_email: EMAIL, user_tier: 0 } });
    }
    if (url.endsWith('/auth/renew'))
      return renewStatus === 200
        ? json(200, { api_key: NEW, api_key_expires_at: at(90).toISOString(), web_reauth_required_at: at(info.reauth).toISOString(), user_email: EMAIL })
        : json(renewStatus, { status: 'fail', error: 'forbidden', details: { user: EMAIL } });
    throw new Error('url inesperada ' + url);
  };
  const gh = (args, input) => {
    ghCalls.push({ args, input });
    if (args[0] === 'api') return { status: probeStatus, stderr: probeStatus ? 'HTTP 403' : '' };
    return { status: setStatus, stderr: setStatus ? 'falhou' : '' };
  };
  const E = Object.assign({ RB_TOKEN: OLD, RB_RENEW_PAT: 'pat', GITHUB_REPOSITORY: 'dono/repo' }, env);
  return { calls, ghCalls, logs,
    go: () => run({ env: E, fetch, gh, log: l => logs.push(l), now: NOW }) };
}
const renewed = h => h.calls.some(c => c.url.endsWith('/auth/renew'));

test('run: fora da janela só confere, não renova nem toca no secret', async () => {
  const h = harness({ info: { exp: 40, reauth: 120 } });
  assert.equal(await h.go(), 0);
  assert.equal(renewed(h), false);
  assert.equal(h.ghCalls.length, 0);
});

test('run: na janela confere a permissão, renova, mascara e grava a chave nova', async () => {
  const h = harness();
  assert.equal(await h.go(), 0);
  assert.deepEqual(h.ghCalls.map(c => c.args[0]), ['api', 'secret']);
  assert.deepEqual(h.ghCalls[1].args, ['secret', 'set', 'RB_TOKEN', '--repo', 'dono/repo']);
  assert.equal(h.ghCalls[1].input, NEW, 'chave vai pelo stdin, não pela linha de comando');
  assert.equal(h.calls.find(c => c.url.endsWith('/auth/renew')).opt.headers.Authorization, `Bearer ${OLD}`);
  const mask = h.logs.findIndex(l => l === `::add-mask::${NEW}`);
  assert.ok(mask >= 0, 'mascara a chave nova');
  h.logs.forEach((l, i) => { if (i !== mask) assert.ok(!l.includes(NEW), 'chave nova só na linha do mask'); });
  assert.ok(h.logs.some(l => l.includes('renovado')));
});

test('run: sem permissão para gravar secret NÃO renova (não invalida o token atual)', async () => {
  const h = harness({ probeStatus: 1 });
  assert.equal(await h.go(), 1);
  assert.equal(renewed(h), false);
  assert.match(h.logs.at(-1), /^::error .*RB_RENEW_PAT/);
});

test('run: API recusa a renovação → erro com prazo, sem gravar nada', async () => {
  const h = harness({ renewStatus: 403 });
  assert.equal(await h.go(), 1);
  assert.equal(h.ghCalls.filter(c => c.args[0] === 'secret').length, 0);
  assert.match(h.logs.at(-1), /^::error .*HTTP 403/);
});

test('run: renovou mas não gravou → avisa que a chave antiga já morreu', async () => {
  const h = harness({ setStatus: 1 });
  assert.equal(await h.go(), 1);
  assert.match(h.logs.at(-1), /já foi invalidada/);
});

test('run: sem RB_RENEW_PAT perto de vencer → falha com o passo a passo (vira e-mail)', async () => {
  const h = harness({ env: { RB_RENEW_PAT: '' } });
  assert.equal(await h.go(), 1);
  assert.equal(renewed(h), false);
  assert.match(h.logs.at(-1), /^::error .*api\.researchbitcoin\.net\/v2\/token/);
});

test('run: token já expirado → não tenta renovar, manda gerar no site', async () => {
  const h = harness({ infoStatus: 401 });
  assert.equal(await h.go(), 1);
  assert.equal(renewed(h), false);
  assert.match(h.logs.at(-1), /já não funciona/);
});

test('run: nenhum log expõe o token atual nem o e-mail da conta', async () => {
  for (const opts of [{}, { info: { exp: 40, reauth: 120 } }, { probeStatus: 1 }, { renewStatus: 403 },
                      { setStatus: 1 }, { infoStatus: 401 }, { info: { exp: 60, reauth: 5 } }]) {
    const h = harness(opts);
    await h.go();
    for (const l of h.logs) {
      assert.ok(!l.includes(OLD), 'token atual no log: ' + l);
      assert.ok(!l.includes(EMAIL), 'e-mail no log: ' + l);
    }
  }
});
