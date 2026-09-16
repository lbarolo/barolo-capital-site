/* ════════════════════════════════════════════════════════════════════════════
   lib/barolo-prices.js — preço do CoinGecko compartilhado entre as páginas + polling
   ════════════════════════════════════════════════════════════════════════════
   Até 15/09/2026 cada página buscava o próprio preço (9 lugares chamando /simple/price, 4 só
   no pools) com cache próprio, em chaves e formatos diferentes. Abrir duas páginas em seguida
   repetia a mesma consulta, e o free tier do CoinGecko responde 429. E nenhum timer parava com
   a aba escondida: o site seguia consultando CoinGecko, Alchemy, Kamino a cada minuto sem
   ninguém olhando.

   get(ids, { maxAge }) → Promise<{ id: { usd, usd_24h_change? } }>   (formato do /simple/price)
     · usa o preço salvo por QUALQUER página se tiver menos de maxAge (padrão 60 s);
     · busca só os ids velhos, numa requisição, e junta pedidos simultâneos da mesma página;
     · se o CoinGecko falhar, devolve o último preço conhecido e marca o resultado com
       `_stale` (propriedade não enumerável) — nunca rejeita. Depois de uma falha espera 30 s
       antes de tentar de novo (evita uma rajada de 429 com várias partes da página pedindo).
   poll(fn, ms) → setInterval que não roda com a aba oculta e, quando ela volta, roda na hora
     se já passou o intervalo. A 1ª chamada continua sendo da página.

   Cache: localStorage 'bc-px' = { id: { usd, chg, ts } }. Também lê, só para consulta, os
   caches antigos: bc-prices-cache (portfolio), bc-index-prices-cache (landing) e
   bc-pools-last-prices (pools, gravado até 15/09/2026). Vence sempre o mais recente.
   ════════════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BaroloPrices = api;
})(typeof window !== 'undefined' ? window : null, function (root) {
  'use strict';

  var KEY = 'bc-px';
  var URL_SIMPLE = 'https://api.coingecko.com/api/v3/simple/price';
  var TIMEOUT_MS = 8000, COOLDOWN_MS = 30000, MISS_MS = 60000;

  var inflight = {};    // id → Promise da requisição em andamento (resolve true ou o erro)
  var missUntil = {};   // id que o CoinGecko não devolveu → não pedir de novo até esta hora
  var coolUntil = 0;    // depois de uma falha, não bate na API até esta hora
  var mem = {};         // cópia em memória do bc-px: com o storage bloqueado o preço buscado não se perde

  function now() { return Date.now(); }
  function readObj(k) {
    try { var v = JSON.parse(root.localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; }
    catch (e) { return null; }
  }
  function writeObj(k, v) { try { root.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage bloqueado */ } }

  // Melhor preço conhecido de cada id entre o cache compartilhado e os antigos (o mais recente vence).
  function known(ids) {
    var best = {};
    function take(id, usd, chg, ts) {
      if (typeof usd !== 'number' || !(usd > 0)) return;
      ts = ts || 0;
      if (!best[id] || ts > best[id].ts) best[id] = { usd: usd, chg: typeof chg === 'number' ? chg : undefined, ts: ts };
    }
    var px = readObj(KEY) || {}, pools = readObj('bc-pools-last-prices') || {};
    var port = readObj('bc-prices-cache'), land = readObj('bc-index-prices-cache');
    var portData = port && port.data && typeof port.data === 'object' ? port.data : null;
    var landData = land && land.data && typeof land.data === 'object' ? land.data : null;
    ids.forEach(function (id) {
      var m = mem[id];      if (m) take(id, m.usd, m.chg, m.ts);
      var a = px[id];       if (a) take(id, a.usd, a.chg, a.ts);
      var b = pools[id];    if (b) take(id, b.usd, undefined, b.ts);
      var c = portData && portData[id]; if (c) take(id, c.usd, c.usd_24h_change, port.ts);
      if (landData) take(id, landData[id], landData[id + '_change'], land.ts);
    });
    return best;
  }

  function shape(best, ids) {
    var out = {};
    ids.forEach(function (id) {
      var b = best[id];
      if (!b) return;
      out[id] = { usd: b.usd };
      if (typeof b.chg === 'number') out[id].usd_24h_change = b.chg;
    });
    return out;
  }

  // Grava no cache compartilhado dados no formato do /simple/price.
  function put(data, ts) {
    ts = ts || now();
    var px = readObj(KEY) || {};
    Object.keys(data || {}).forEach(function (id) {
      var d = data[id];
      if (d && typeof d.usd === 'number') px[id] = mem[id] = { usd: d.usd, chg: typeof d.usd_24h_change === 'number' ? d.usd_24h_change : undefined, ts: ts };
    });
    writeObj(KEY, px);
  }

  function request(ids) {
    var url = URL_SIMPLE + '?ids=' + ids.join(',') + '&vs_currencies=usd&include_24hr_change=true';
    var timer = new Promise(function (_, rej) { root.setTimeout(function () { rej(new Error('timeout')); }, TIMEOUT_MS); });
    return Promise.race([root.fetch(url), timer]).then(function (r) {
      if (!r.ok) throw new Error('CoinGecko HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      var t = now();
      put(data, t);
      ids.forEach(function (id) { if (!(data && data[id])) missUntil[id] = t + MISS_MS; });
      return true;
    }, function (e) {
      coolUntil = now() + COOLDOWN_MS;
      return e;
    });
  }

  function stale(out, why) {
    Object.defineProperty(out, '_stale', { value: true });
    var got = Object.keys(out);
    if (got.length && root.console) root.console.warn('[price] CoinGecko ' + why + ' — usando o último preço salvo de ' + got.join(', '));
    return out;
  }

  function get(ids, opts) {
    ids = (ids || []).filter(function (id, i, a) { return id && a.indexOf(id) === i; });
    var maxAge = (opts && opts.maxAge) || 60000;
    var t = now(), best = known(ids);
    var old = ids.filter(function (id) { return (!best[id] || t - best[id].ts > maxAge) && !(missUntil[id] > t); });
    if (!old.length) return Promise.resolve(shape(best, ids));
    if (t < coolUntil && !old.some(function (id) { return inflight[id]; })) return Promise.resolve(stale(shape(best, ids), 'em pausa após falha'));

    var need = old.filter(function (id) { return !inflight[id]; });
    if (need.length && t >= coolUntil) {
      var p = request(need);
      need.forEach(function (id) { inflight[id] = p; });
      p.then(function () { need.forEach(function (id) { if (inflight[id] === p) delete inflight[id]; }); });
    }
    var waits = old.map(function (id) { return inflight[id]; })
      .filter(function (w, i, a) { return w && a.indexOf(w) === i; });
    return Promise.all(waits).then(function (results) {
      var out = shape(known(ids), ids);
      var err = results.filter(function (r) { return r !== true; })[0];
      return err ? stale(out, 'falhou (' + (err && err.message) + ')') : out;
    });
  }

  // ── Polling que respeita a aba oculta ──────────────────────────────────────
  function hidden() {
    var d = root.document;
    return !!(d && (d.hidden === true || d.visibilityState === 'hidden'));
  }
  function poll(fn, ms) {
    var last = now();
    function run() { last = now(); fn(); }
    var id = root.setInterval(function () { if (!hidden()) run(); }, ms);
    var d = root.document;
    if (d && d.addEventListener) d.addEventListener('visibilitychange', function () {
      if (!hidden() && now() - last >= ms) run();
    });
    return function stop() { root.clearInterval(id); };
  }

  return { KEY: KEY, get: get, put: put, poll: poll, hidden: hidden,
    known: function (ids) { return shape(known(ids), ids); } };
});
