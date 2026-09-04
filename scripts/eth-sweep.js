#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   eth-sweep.js — varredura de ETH nas carteiras EVM (diagnostico)

   POR QUE EXISTE: o data.js carrega uma pendencia recorrente — saber quanto
   ETH esta FORA da AAVE, para validar a decomposicao
       holding CoinGecko = supply AAVE + carteiras + Yearn
   Em 22/08/2026 havia tres contagens divergentes (0,06595 dos screenshots,
   0,09462 implicito, 0,13100 da soma manual). Este script substitui a
   contagem manual por leitura on-chain, que e a unica que nao depende de
   lembrar em quais redes olhar.

   COMO RODAR: nao roda de dentro de uma sessao Claude (a politica de rede do
   ambiente bloqueia a Alchemy). Rode pela Action `eth-sweep.yml`
   (workflow_dispatch) — o runner do GitHub tem rede.
   Local, se quiser: `node scripts/eth-sweep.js`

   PRIVACIDADE: os enderecos e a key saem do CLAUDE.md (ja versionado), nao ha
   copia nova aqui. O log imprime saldos por INDICE de carteira, nunca o
   endereco, e nao grava arquivo nenhum no repo.
   ════════════════════════════════════════════════════════════════════ */
const fs = require('fs');

const md = fs.readFileSync(__dirname + '/../CLAUDE.md', 'utf8');
const WALLETS = [...new Set((md.match(/0x[0-9a-fA-F]{40}/g) || []))]
  .filter(a => md.indexOf('### Carteiras EVM') < md.indexOf(a) &&
               md.indexOf(a) < md.indexOf('### Carteira Solana'));
const KEY = (md.match(/\|\s*Alchemy\s*\|\s*`([^`]+)`/) || [])[1];

if (!WALLETS.length || !KEY) { console.error('nao achei carteiras/key no CLAUDE.md'); process.exit(1); }

// WETH (ERC-20) por rede — ETH embrulhado conta igual como ETH no portfolio.
// Robinhood Chain fica de fora: nao ha RPC publico confiavel (ver CLAUDE.md).
const NETS = [
  { name: 'ethereum', weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    rpcs: [`https://eth-mainnet.g.alchemy.com/v2/${KEY}`, 'https://eth.llamarpc.com', 'https://cloudflare-eth.com'] },
  { name: 'base',     weth: '0x4200000000000000000000000000000000000006',
    rpcs: [`https://base-mainnet.g.alchemy.com/v2/${KEY}`, 'https://mainnet.base.org', 'https://base.llamarpc.com'] },
  { name: 'arbitrum', weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    rpcs: [`https://arb-mainnet.g.alchemy.com/v2/${KEY}`, 'https://arb1.arbitrum.io/rpc'] },
  { name: 'optimism', weth: '0x4200000000000000000000000000000000000006',
    rpcs: [`https://opt-mainnet.g.alchemy.com/v2/${KEY}`, 'https://mainnet.optimism.io'] },
];

// A key da Alchemy so tem Ethereum e Arbitrum habilitados (Base e Optimism voltam 403),
// entao cada rede tem uma cascata: Alchemy primeiro, RPC publico depois.
const rpc = async (net, method, params) => {
  let last;
  for (const url of net.rpcs) {
    try {
      const r = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      });
      if (!r.ok) { last = new Error(`HTTP ${r.status}`); continue; }
      const j = await r.json();
      if (j.error) { last = new Error(j.error.message); continue; }
      return j.result;
    } catch (e) { last = e; }
  }
  throw last || new Error('sem RPC');
};
const wei = h => (!h || h === '0x') ? 0 : Number(BigInt(h)) / 1e18;

(async () => {
  console.log(`Varredura de ${WALLETS.length} carteiras EVM x ${NETS.length} redes (nativo + WETH)\n`);
  let total = 0;
  const porRede = {};
  for (const net of NETS) {
    let sub = 0;
    for (let i = 0; i < WALLETS.length; i++) {
      const w = WALLETS[i];
      let nativo = 0, weth = 0;
      try { nativo = wei(await rpc(net, 'eth_getBalance', [w, 'latest'])); }
      catch (e) { console.log(`  ! carteira ${i + 1} ${net.name} nativo: ${e.message}`); }
      try {
        const data = '0x70a08231' + '0'.repeat(24) + w.slice(2).toLowerCase();
        weth = wei(await rpc(net, 'eth_call', [{ to: net.weth, data }, 'latest']));
      } catch (e) { console.log(`  ! carteira ${i + 1} ${net.name} WETH: ${e.message}`); }
      if (nativo > 0 || weth > 0)
        console.log(`  carteira ${i + 1} · ${net.name.padEnd(9)} nativo ${nativo.toFixed(6)}  WETH ${weth.toFixed(6)}`);
      sub += nativo + weth; total += nativo + weth;
    }
    porRede[net.name] = sub;
  }
  console.log('\n── por rede ──');
  for (const [n, v] of Object.entries(porRede)) console.log(`  ${n.padEnd(9)} ${v.toFixed(6)} ETH`);
  console.log(`\n  TOTAL FORA DA AAVE = ${total.toFixed(6)} ETH`);

  // Veredito contra as duas hipoteses registradas no data.js
  global.window = {}; require('../data.js');
  const B = global.window.BAROLO_DATA;
  const holding = B.holdings.find(h => h.ticker === 'ETH').qty;
  const supply = B.defi.aave.supply.WETH.qty;
  const esperado = holding - supply;
  console.log(`\n  esperado pelo livro = holding ${holding} - supply AAVE ${supply} = ${esperado.toFixed(6)}`);
  console.log(`  diferenca           = ${(total - esperado).toFixed(6)} ETH`);
  console.log(total - esperado > 0.01
    ? `\n  >>> LANCAR: holding deve subir para ${(supply + total).toFixed(5)} (a custo zero)`
    : `\n  >>> PENDENCIA MORTA: o livro ja esta certo, nao ha nada a lancar.`);
})().catch(e => { console.error('falhou:', e.message); process.exit(1); });
