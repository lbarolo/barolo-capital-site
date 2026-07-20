/* ════════════════════════════════════════════════════════════════════
   refresh-emprestimos-data.js
   ════════════════════════════════════════════════════════════════════
   emprestimos.html é um BUNDLE: o data.js fica embutido (gzip+base64)
   dentro do <script type="__bundler/manifest">, congelado no momento do
   build. Todas as outras páginas leem o data.js VIVO; só o Empréstimos
   carrega essa cópia embutida — então ele "trava" numa data antiga toda
   vez que o data.js é atualizado.

   Este script regrava SÓ o asset do data.js dentro do manifest com o
   conteúdo atual do data.js. Não toca no template, no loader, nem nos
   outros assets — tudo fica byte-idêntico. Idempotente: se já estiver
   sincronizado, não escreve nada (exit 0, sem commit).

   Uso manual:   node scripts/refresh-emprestimos-data.js
   Automático:   .github/workflows/sync-emprestimos.yml (dispara quando
                 data.js muda no push)

   Robusto: descobre qual asset é o data.js descomprimindo e procurando
   'window.BAROLO_DATA' — não depende do UUID fixo (se o bundle for
   reconstruído com outro UUID, continua funcionando).
   ════════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const EMP = path.join(ROOT, 'emprestimos.html');
const DATA = path.join(ROOT, 'data.js');
const MANIFEST_RE = /<script type="__bundler\/manifest">([\s\S]*?)<\/script>/;

function log(m) { console.log('[refresh-emprestimos] ' + m); }

function main() {
  if (!fs.existsSync(EMP) || !fs.existsSync(DATA)) {
    log('emprestimos.html ou data.js não encontrado — nada a fazer.');
    return 0;
  }
  const html = fs.readFileSync(EMP, 'utf8');
  const m = html.match(MANIFEST_RE);
  if (!m) {
    // Não é um bundle (ex: foi des-bundlado) → nada a sincronizar.
    log('emprestimos.html não é um bundle (sem manifest) — nada a fazer.');
    return 0;
  }

  const manifest = JSON.parse(m[1]);
  const dataJs = fs.readFileSync(DATA); // Buffer (bytes exatos do arquivo)

  // Descobre o asset do data.js: descomprime cada um e procura BAROLO_DATA.
  let targetUuid = null;
  for (const uuid of Object.keys(manifest)) {
    const e = manifest[uuid];
    if (!e || !e.data) continue;
    try {
      const raw = Buffer.from(e.data, 'base64');
      const txt = e.compressed ? zlib.gunzipSync(raw).toString('utf8') : raw.toString('utf8');
      if (txt.includes('window.BAROLO_DATA')) { targetUuid = uuid; break; }
    } catch (_) { /* asset binário (fonte/imagem) — ignora */ }
  }

  if (!targetUuid) {
    log('ERRO: nenhum asset com window.BAROLO_DATA encontrado no manifest.');
    return 1;
  }

  // Recomprime o data.js atual no mesmo formato do bundle (gzip → base64).
  const gz = zlib.gzipSync(dataJs, { level: 9 });
  const newB64 = gz.toString('base64');

  if (manifest[targetUuid].data === newB64) {
    log('Já sincronizado (asset ' + targetUuid.slice(0, 8) + ') — sem alteração.');
    return 0;
  }

  manifest[targetUuid].mime = manifest[targetUuid].mime || 'application/javascript';
  manifest[targetUuid].compressed = true;
  manifest[targetUuid].data = newB64;

  const newHtml = html.split(m[1]).join(JSON.stringify(manifest));
  fs.writeFileSync(EMP, newHtml);

  // Verifica round-trip a partir do arquivo recém-escrito.
  const check = fs.readFileSync(EMP, 'utf8').match(MANIFEST_RE);
  const man2 = JSON.parse(check[1]);
  const back = zlib.gunzipSync(Buffer.from(man2[targetUuid].data, 'base64')).toString('utf8');
  if (back !== dataJs.toString('utf8')) {
    log('ERRO: round-trip do data.js falhou — abortando.');
    return 1;
  }
  const asOf = (back.match(/asOf:\s*.(\d{4}-\d{2}-\d{2})/) || [])[1] || '?';
  log('OK — data.js embutido atualizado (asOf ' + asOf + ', asset ' + targetUuid.slice(0, 8) + ').');
  return 0;
}

process.exit(main());
