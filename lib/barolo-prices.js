/* ════════════════════════════════════════════════════════════════════════════
   lib/barolo-prices.js — preço do CoinGecko compartilhado entre as páginas + polling
   ════════════════════════════════════════════════════════════════════════════
   Até 15/09/2026 cada página buscava o próprio preço (9 lugares chamando /simple/price, 4 só
   no pools) com cache próprio, em chaves e formatos diferentes. Abrir duas páginas em seguida
   repetia a mesma consulta, e o free tier do CoinGecko responde 429. E nenhum timer parava com
   a aba escondida: o site seguia consultando CoinGecko, Alchemy, Kamino a cada minuto sem
   ninguém olhando.

   ⚠️ 29/09/2026: o CoinGecko passou a responder 403 (CloudFront "Request blocked") nas rotas
   de dados sem chave — no navegador e nos runners. O preço virou CASCATA: Coinbase Exchange
   (/products/stats, 1 requisição para ~513 pares, cobre 10 dos 13 tokens) → CoinPaprika (a
   cauda: XAI, SCR, RDNT) → CoinGecko. As duas primeiras servem o navegador
   (access-control-allow-origin: *). Mesma cascata dos crons (scripts/lib/spot-prices.js).

   get(ids, { maxAge }) → Promise<{ id: { usd, usd_24h_change? } }>   (formato do /simple/price)
     · usa o preço salvo por QUALQUER página se tiver menos de maxAge (padrão 60 s);
     · busca só os ids velhos e junta pedidos simultâneos da mesma página;
     · se TODAS as fontes falharem, devolve o último preço conhecido e marca o resultado com
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
  var CB_STATS   = 'https://api.exchange.coinbase.com/products/stats';
  var PAPRIKA    = 'https://api.coinpaprika.com/v1/tickers/';
  var TIMEOUT_MS = 8000, COOLDOWN_MS = 30000, MISS_MS = 60000;

  // cgId → ticker na Coinbase (t), id na CoinPaprika (p) e o NOME que a paprika
  // precisa devolver (x). Mesmo mapa, conferido um a um, de scripts/lib/spot-prices.js.
  // ⚠️ O `x` não é decoração: existem 8 moedas com símbolo XAI e o SCR tem homônimo
  // ("Scorum"). Cotação com nome que não bate é DESCARTADA — preço de outro ativo
  // seria pior que preço faltando.
  var MAP = {
    'bitcoin':                  { t: 'BTC',   p: 'btc-bitcoin',                 x: 'bitcoin' },
    'ethereum':                 { t: 'ETH',   p: 'eth-ethereum',                x: 'ethereum' },
    'solana':                   { t: 'SOL',   p: 'sol-solana',                  x: 'solana' },
    'cardano':                  { t: 'ADA',   p: 'ada-cardano',                 x: 'cardano' },
    'eigenlayer':               { t: 'EIGEN', p: 'eigen-eigenlayer',            x: 'eigenlayer' },
    'radiant-capital':          { t: 'RDNT',  p: 'rdnt-radiant-capital',        x: 'radiant' },
    'polygon-ecosystem-token':  { t: 'POL',   p: 'pol-polygon-ecosystem-token', x: 'polygon' },
    'zksync':                   { t: 'ZK',    p: 'zk-zksync',                   x: 'zksync' },
    'xai-blockchain':           { t: 'XAI',   p: 'xai-xai-games',               x: 'xai games' },
    'zetachain':                { t: 'ZETA',  p: 'zeta-zetachain',              x: 'zetachain' },
    'scroll':                   { t: 'SCR',   p: 'scr-scroll',                  x: 'scroll' },
    'tether':                   { t: 'USDT',  p: 'usdt-tether',                 x: 'tether' },
    'usds':                     { t: 'USDS',  p: 'usds-usds',                   x: 'usds' }
  };

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

  function getJson(url) {
    var timer = new Promise(function (_, rej) { root.setTimeout(function () { rej(new Error('timeout')); }, TIMEOUT_MS); });
    return Promise.race([root.fetch(url), timer]).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  // ── Fonte 1: Coinbase Exchange — TODOS os produtos numa requisição só ──────
  // /products/stats devolve stats_24hour {open,last} de ~513 pares; cobre 10 dos
  // 13 tokens da carteira com 1 chamada (o /simple/price do CoinGecko também era 1).
  function fromCoinbase(ids, got) {
    var want = ids.filter(function (id) { return MAP[id]; });
    if (!want.length) return Promise.resolve();
    return getJson(CB_STATS).then(function (all) {
      want.forEach(function (id) {
        var s = all && all[MAP[id].t + '-USD'], h = s && s.stats_24hour;
        if (!h) return;
        var last = parseFloat(h.last), open = parseFloat(h.open);
        if (!(last > 0)) return;
        got[id] = { usd: last, usd_24h_change: open > 0 ? (last / open - 1) * 100 : 0 };
      });
    }, function () { /* segue para a próxima fonte */ });
  }

  // ── Fonte 2: CoinPaprika — a cauda que a Coinbase não lista (XAI, SCR, RDNT) ─
  function fromPaprika(ids, got) {
    var want = ids.filter(function (id) { return MAP[id]; });
    if (!want.length) return Promise.resolve();
    return Promise.all(want.map(function (id) {
      var m = MAP[id];
      return getJson(PAPRIKA + m.p).then(function (j) {
        var nome = String((j && j.name) || '').toLowerCase();
        if (nome.indexOf(m.x) < 0) throw new Error('nome nao confere: ' + (j && j.name));
        if (String((j && j.symbol) || '').toUpperCase() !== m.t) throw new Error('simbolo nao confere');
        var q = j.quotes && j.quotes.USD;
        if (!q || !(q.price > 0)) return;
        got[id] = { usd: q.price, usd_24h_change: typeof q.percent_change_24h === 'number' ? q.percent_change_24h : 0 };
      }, function () { /* segue */ });
    }));
  }

  // ── Fonte 3: CoinGecko — por último; desde 29/09/2026 responde 403 sem chave ─
  function fromGecko(ids, got) {
    if (!ids.length) return Promise.resolve();
    return getJson(URL_SIMPLE + '?ids=' + ids.join(',') + '&vs_currencies=usd&include_24hr_change=true')
      .then(function (d) {
        ids.forEach(function (id) {
          var v = d && d[id];
          if (v && typeof v.usd === 'number') got[id] = { usd: v.usd, usd_24h_change: typeof v.usd_24h_change === 'number' ? v.usd_24h_change : 0 };
        });
      }, function () { /* segue */ });
  }

  // Preço em CASCATA (29/09/2026). Era só o /simple/price do CoinGecko, que passou a
  // responder 403 (CloudFront, "Request blocked") sem chave — no navegador e no runner.
  // Cada fonte só busca o que a anterior não trouxe; nunca rejeita: devolve `true` ou o erro.
  function request(ids) {
    var got = {};
    var falta = function () { return ids.filter(function (id) { return !got[id]; }); };
    return fromCoinbase(ids, got)
      .then(function () { return fromPaprika(falta(), got); })
      .then(function () { return fromGecko(falta(), got); })
      .then(function () {
        if (!Object.keys(got).length) throw new Error('nenhuma fonte de preço respondeu');
        var t = now();
        put(got, t);
        falta().forEach(function (id) { missUntil[id] = t + MISS_MS; });
        return true;
      })
      .catch(function (e) {
        coolUntil = now() + COOLDOWN_MS;
        return e;
      });
  }

  function stale(out, why) {
    Object.defineProperty(out, '_stale', { value: true });
    var got = Object.keys(out);
    if (got.length && root.console) root.console.warn('[price] preço ao vivo ' + why + ' — usando o último preço salvo de ' + got.join(', '));
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

  // ── Câmbio USD/BRL ─────────────────────────────────────────────────────────
  // Era `tether&vs_currencies=brl` no CoinGecko, que caiu junto com o resto em
  // 29/09/2026 — a régua em BRL e a aba Fiscal ficavam no fallback do data.js
  // (4,95 contra 5,21 reais, ~5% de erro). Fonte nova: AwesomeAPI (brasileira,
  // sem chave, access-control-allow-origin: *), com o CoinGecko atrás.
  // usdBrl({ maxAge }) → Promise<number|null> — null só se nunca deu certo.
  var BRL_KEY = 'bc-brl';
  function usdBrl(opts) {
    var maxAge = (opts && opts.maxAge) || 30 * 60 * 1000;
    var c = readObj(BRL_KEY);
    if (c && c.rate > 0 && now() - c.ts < maxAge) return Promise.resolve(c.rate);
    var save = function (rate) {
      if (!(rate > 0)) throw new Error('câmbio inválido');
      writeObj(BRL_KEY, { rate: rate, ts: now() });
      return rate;
    };
    return getJson('https://economia.awesomeapi.com.br/last/USD-BRL')
      .then(function (j) { return save(parseFloat(j && j.USDBRL && j.USDBRL.bid)); })
      .catch(function () {
        return getJson(URL_SIMPLE + '?ids=tether&vs_currencies=brl')
          .then(function (d) { return save(d && d.tether && d.tether.brl); });
      })
      .catch(function () { return (c && c.rate > 0) ? c.rate : null; });
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

  return { KEY: KEY, get: get, put: put, poll: poll, hidden: hidden, usdBrl: usdBrl,
    known: function (ids) { return shape(known(ids), ids); } };
});
