/* ════════════════════════════════════════════════════════════════════════════
   lib/barolo-chain.js — leitura on-chain do lending (AAVE V4, Kamino) e do stake ADA
   ════════════════════════════════════════════════════════════════════════════
   Até 14/09/2026 portfolio_analytics.html e pools.html tinham, cada um, uma cópia
   própria destes fetchers (~590 linhas repetidas) — e as cópias já tinham divergido:
   se a Kamino falhasse, o portfolio assumia a dívida em US$ 808,77 (fixo, de maio)
   e o pools usava o data.js. Agora existe uma implementação só.

   Duas camadas:
     · fetch* / parse* → buscam e interpretam; devolvem dados e não mexem em nada.
     · apply*          → gravam os globais window._live* que as páginas leem.
   Carrega no browser com <script src="lib/barolo-chain.js"> (→ window.BaroloChain).
   Testado em tests/chain*.test.js contra respostas reais gravadas.

   Privacidade (CLAUDE.md): endereços e chaves ficam SÓ no JS, que é o que o browser
   precisa para buscar. Nunca em link, iframe src ou URL pública.
   ════════════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BaroloChain = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var CONFIG = {
    ethRpc: 'https://eth-mainnet.g.alchemy.com/v2/R_9y5DBqKNR2NapexG8n7',
    aave: {
      wallet: '0x5a9aaA78B379ec19beb9E44CCe12697d1894f396',
      mainSpoke: '0x94e7A5dCbE816e498b89aB752661904E2F56c485',     // WETH + USDT supply + USDC borrow
      bluechipSpoke: '0x973a023A77420ba610f06b3858aD991Df6d85A08', // tier extra de WETH (se houver)
      accountSelector: '0xbf92857c',                               // getUserAccountData (struct V4)
      dataProvider: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3',  // getReserveData → APYs
      usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    kamino: {
      api: 'https://api.kamino.finance',
      wallet: 'Fq1F49Vx38f8h62SSRCQpGYPxPEtarY5NZ5GhrFVnrfW',
      market: '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF',
      solMint: 'So11111111111111111111111111111111111111112',
      usdsMint: 'USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA',
      usdcMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    },
    cardano: {
      api: 'https://cardano-mainnet.blockfrost.io/api/v0',
      key: 'mainnetUUNZyRnZ6sg9uAvwnprB7vNIu8s7VPKm',
      address: 'addr1q8cqzzh3t03xvkw7tmzz3jx5nm0spk8ftly7huaj7s6nr4jhy6r0hzw7ygs9ccu6clqqrkm6znuy0ctq737ruk7e72dqkm0a23'
    }
  };

  // ── Hex / ABI ──────────────────────────────────────────────────────────────
  var padAddr = function (a) { return '000000000000000000000000' + a.slice(2).toLowerCase(); };
  // Palavra de 32 bytes na posição `offset`. Resposta vazia ('0x') lança — de propósito:
  // quem chama trata como falha, em vez de interpretar como zero.
  var decUint = function (hex, offset) {
    offset = offset || 0;
    return BigInt('0x' + (hex.slice(2) || '0').slice(offset * 64, (offset + 1) * 64) || '0');
  };
  var decNum = function (n, dec) { return Number(n) / Math.pow(10, dec); };

  async function rpc(url, method, params) {
    var r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1, jsonrpc: '2.0', method: method, params: params })
    });
    var d = await r.json();
    if (d.error) throw new Error(d.error.message);
    return d.result;
  }
  function ethCall(rpcUrl, to, data) { return rpc(rpcUrl, 'eth_call', [{ to: to, data: data }, 'latest']); }

  // ── AAVE V4 ────────────────────────────────────────────────────────────────
  // Struct de getUserAccountData (V4): [2]=HF (WAD 1e18), [3]=colateral USD (/1e26),
  // [4]=dívida USD (/1e53 = escala do colateral × RAY 1e27). Devolve null quando a
  // resposta não é crível — um RPC que devolve lixo não pode zerar a tela (bug de 04/2026).
  function parseAaveV4(mainRaw, bcRaw) {
    var mainColl = decNum(decUint(mainRaw, 3), 26);
    var mainDebt = decNum(decUint(mainRaw, 4), 53);
    var hf = decNum(decUint(mainRaw, 2), 18);

    var bcColl = 0;
    if (bcRaw && bcRaw.length > 10 && bcRaw !== '0x') {
      var bcHF = decNum(decUint(bcRaw, 2), 18);
      if (isFinite(bcHF) && bcHF < 1e15) {
        var bc = decNum(decUint(bcRaw, 3), 26);
        if (isFinite(bc) && bc > 50) bcColl = bc;
      }
    }
    var collateral = mainColl + bcColl;
    var debt = mainDebt;

    console.log('[AAVE V4] coll=$' + collateral.toFixed(0) + ' debt=$' + debt.toFixed(2) + ' HF=' + hf.toFixed(2));

    if (!isFinite(collateral) || !isFinite(debt) || !isFinite(hf)) {
      console.warn('[AAVE V4] Sanity: non-finite value, discarding'); return null;
    }
    if (collateral < 100) {
      console.warn('[AAVE V4] Sanity: collateral $' + collateral.toFixed(2) + ' < $100, discarding'); return null;
    }
    if (hf > 1e15) { // dívida 0 → HF = uint256.max
      console.warn('[AAVE V4] Sanity: HF impossible (' + hf.toExponential(2) + '), discarding'); return null;
    }
    // Com HF > 1, dívida < colateral sempre. Valor acima = erro de escala no parse.
    if (debt > collateral || debt > 1e7) {
      console.warn('[AAVE V4] Sanity: debt $' + debt.toExponential(2) + ' > collateral, parse error, discarding'); return null;
    }
    return { collateral: collateral, debt: debt, hf: hf };
  }

  async function fetchAave() {
    try {
      var c = CONFIG.aave, data = c.accountSelector + padAddr(c.wallet);
      var raw = await Promise.all([
        ethCall(CONFIG.ethRpc, c.mainSpoke, data),
        ethCall(CONFIG.ethRpc, c.bluechipSpoke, data).catch(function () { return null; })
      ]);
      return parseAaveV4(raw[0], raw[1]);
    } catch (e) {
      console.warn('[AAVE V4] failed:', e.message);
      return null;
    }
  }

  // APYs via ProtocolDataProvider.getReserveData: [5]=liquidityRate (supply), [6]=variableBorrowRate,
  // ambos em RAY. Só aceita 0 < APY < 50%; fora disso fica sem valor (a página usa o fallback).
  async function fetchAaveApys() {
    var out = {};
    try {
      var c = CONFIG.aave, sel = '0x35ea6a75', RAY = 1e27;
      var raw = await Promise.all([
        ethCall(CONFIG.ethRpc, c.dataProvider, sel + padAddr(c.usdt)).catch(function () { return null; }),
        ethCall(CONFIG.ethRpc, c.dataProvider, sel + padAddr(c.usdc)).catch(function () { return null; })
      ]);
      if (raw[0]) {
        var supplyRate = Number(decUint(raw[0], 5)) / RAY * 100;
        if (supplyRate > 0 && supplyRate < 50) out.usdtSupplyApy = supplyRate;
      }
      if (raw[1]) {
        var borrowRate = Number(decUint(raw[1], 6)) / RAY * 100;
        if (borrowRate > 0 && borrowRate < 50) out.usdcBorrowApy = borrowRate;
      }
    } catch (e) {
      console.warn('[AAVE APY] failed:', e.message);
    }
    return out;
  }

  // ── Kamino ─────────────────────────────────────────────────────────────────
  function parseKaminoLoan(loan) {
    var deposits = loan.loanInfo?.collateral?.deposits || [];
    var borrows = loan.loanInfo?.debt?.borrows || [];
    var totalDepositUsd = 0, totalBorrowUsd = 0, solQty = 0;
    deposits.forEach(function (d) {
      var val = parseFloat(d.tokenValue || 0);
      totalDepositUsd += val;
      if (d.tokenMint === CONFIG.kamino.solMint) solQty = parseFloat(d.tokenAmount || 0);
    });
    borrows.forEach(function (b) { totalBorrowUsd += parseFloat(b.tokenValue || 0); });
    var netValue = totalDepositUsd - totalBorrowUsd;
    var ltv = totalDepositUsd > 0 ? totalBorrowUsd / totalDepositUsd : 0;
    return { totalDepositUsd: totalDepositUsd, totalBorrowUsd: totalBorrowUsd, netValue: netValue, solQty: solQty, ltv: ltv };
  }

  // APY de supply de SOL e USDS e de borrow de USDC, em %. Só 0 < APY < 50%.
  function parseKaminoReserves(reserves) {
    var k = CONFIG.kamino, out = {};
    reserves.forEach(function (r) {
      var apy = parseFloat(r.supplyApy || 0) * 100;
      var bapy = parseFloat(r.borrowApy || 0) * 100;
      if (r.liquidityTokenMint === k.solMint && apy > 0 && apy < 50) out.sol = apy;
      if (r.liquidityTokenMint === k.usdsMint && apy > 0 && apy < 50) out.usds = apy;
      if (r.liquidityTokenMint === k.usdcMint && bapy > 0 && bapy < 50) out.borrow = bapy;
    });
    return out;
  }

  // → { position: {...} | null, apys: {...}, failed: bool }
  //   position null + failed false = resposta chegou mas não é crível (depósito < US$ 100).
  //   failed true = a busca quebrou; apply usa o fallback da dívida.
  async function fetchKamino(opts) {
    var k = CONFIG.kamino, withApys = !!(opts && opts.withApys);
    try {
      var reqs = [fetch(k.api + '/kamino-market/' + k.market + '/users/' + k.wallet + '/obligations')];
      if (withApys) reqs.push(fetch(k.api + '/kamino-market/' + k.market + '/reserves/metrics'));
      var resps = await Promise.all(reqs);
      var oblResp = resps[0], resResp = resps[1];
      if (!oblResp.ok) throw new Error('Obligations API ' + oblResp.status);
      var obligations = await oblResp.json();
      if (!obligations || !obligations.length) throw new Error('no obligations');

      var loanResp = await fetch(k.api + '/klend/loans/' + obligations[0].obligationAddress);
      if (!loanResp.ok) throw new Error('Loan API ' + loanResp.status);
      var pos = parseKaminoLoan(await loanResp.json());

      var apys = (resResp && resResp.ok) ? parseKaminoReserves(await resResp.json()) : {};

      console.log('[Kamino] Deposits: $' + pos.totalDepositUsd.toFixed(2) + ', Borrows: $' + pos.totalBorrowUsd.toFixed(2) +
        ', SOL: ' + pos.solQty.toFixed(3) + ', LTV: ' + (pos.ltv * 100).toFixed(1) + '%');
      if (pos.totalDepositUsd < 100) {
        console.warn('[Kamino] Sanity: deposit too low, discarding');
        return { position: null, apys: apys, failed: false };
      }
      return { position: pos, apys: apys, failed: false };
    } catch (e) {
      console.warn('[Kamino] failed:', e.message);
      return { position: null, apys: {}, failed: true };
    }
  }

  // ── Cardano (Blockfrost) ───────────────────────────────────────────────────
  var LOVELACE = 1000000;
  async function bf(path) {
    var r = await fetch(CONFIG.cardano.api + path, { headers: { 'project_id': CONFIG.cardano.key } });
    if (!r.ok) throw new Error('Blockfrost ' + r.status + ': ' + path);
    return r.json();
  }

  // → { adaWallet, stakedAda, rewardsAda, poolName, poolTicker, poolApy, totalRewardsEarned } | null
  async function fetchCardano() {
    try {
      var addrInfo = await bf('/addresses/' + CONFIG.cardano.address);
      var adaWallet = (addrInfo.amount?.find(function (a) { return a.unit === 'lovelace'; })?.quantity || 0) / LOVELACE;
      var stakeAddr = addrInfo.stake_address;
      console.log('[Cardano] Wallet ADA: ' + adaWallet.toFixed(2) + ', Stake addr: ' + stakeAddr);

      var stakedAda = 0, rewardsAda = 0, poolName = '—', poolTicker = '—', poolApy = null, totalRewardsEarned = 0;
      if (stakeAddr) {
        var stakeInfo = await bf('/accounts/' + stakeAddr);
        stakedAda = parseInt(stakeInfo.controlled_amount || 0) / LOVELACE;
        rewardsAda = parseInt(stakeInfo.withdrawable_amount || 0) / LOVELACE;
        var poolId = stakeInfo.pool_id;
        console.log('[Cardano] Staked: ' + stakedAda.toFixed(2) + ' ADA, Rewards pending: ' + rewardsAda.toFixed(4) + ' ADA');

        if (poolId) {
          try {
            var poolInfo = await bf('/pools/' + poolId + '/metadata');
            poolName = poolInfo.name || poolId.slice(0, 12) + '...';
            poolTicker = poolInfo.ticker || '—';
          } catch (e) { /* metadata é opcional */ }
          try {
            var poolHistory = await bf('/pools/' + poolId + '/history?count=5&order=desc');
            if (poolHistory?.length > 0) {
              var latest = poolHistory[0];
              // APY ≈ ROI do epoch anualizado (~73 epochs por ano)
              var epochRoi = parseFloat(latest.active_stake) > 0
                ? (parseFloat(latest.rewards) / parseFloat(latest.active_stake)) * 100
                : 0;
              poolApy = (epochRoi * 73).toFixed(2);
            }
          } catch (e) { /* APY é opcional */ }
        }
        try {
          var rewardHistory = await bf('/accounts/' + stakeAddr + '/rewards?count=20&order=desc');
          totalRewardsEarned = rewardHistory.reduce(function (s, r) { return s + parseInt(r.amount || 0) / LOVELACE; }, 0);
        } catch (e) { /* histórico é opcional */ }
      }
      return { adaWallet: adaWallet, stakedAda: stakedAda, rewardsAda: rewardsAda, poolName: poolName,
        poolTicker: poolTicker, poolApy: poolApy, totalRewardsEarned: totalRewardsEarned };
    } catch (e) {
      console.warn('[Cardano] fetch failed:', e.message);
      return null;
    }
  }

  // ── apply*: gravam os globais que as páginas leem ──────────────────────────
  function applyAave(r, win) {
    if (!r) return;
    win._liveAaveDebt = r.debt;
    win._liveAaveCollateral = r.collateral;
    win._liveAaveHF = r.hf;
  }
  function applyAaveApys(r, win) {
    if (r.usdtSupplyApy !== undefined) win._liveAaveUsdtApy = r.usdtSupplyApy;
    if (r.usdcBorrowApy !== undefined) win._liveAaveBorrowApy = r.usdcBorrowApy;
    console.log('[AAVE APY] USDT supply: ' + (win._liveAaveUsdtApy || 0).toFixed(2) + '%, USDC borrow: ' + (win._liveAaveBorrowApy || 0).toFixed(2) + '%');
  }
  // Falha na busca: mantém a última dívida conhecida; sem ela, usa a do data.js.
  function applyKamino(r, win) {
    var a = r.apys || {};
    if (a.sol !== undefined) win._liveKaminoSolApy = a.sol;
    if (a.usds !== undefined) win._liveKaminoUsdsApy = a.usds;
    if (a.borrow !== undefined) win._liveKaminoBorrowApy = a.borrow;
    if (r.position) win._liveKaminoDebt = r.position.totalBorrowUsd;
    else if (r.failed) {
      win._liveKaminoDebt = win._liveKaminoDebt ||
        (win.BAROLO_DATA && win.BAROLO_DATA.debt && win.BAROLO_DATA.debt.kamino);
    }
  }

  return {
    CONFIG: CONFIG,
    hex: { padAddr: padAddr, decUint: decUint, decNum: decNum },
    rpc: rpc, ethCall: ethCall,
    parseAaveV4: parseAaveV4, fetchAave: fetchAave, fetchAaveApys: fetchAaveApys,
    parseKaminoLoan: parseKaminoLoan, parseKaminoReserves: parseKaminoReserves, fetchKamino: fetchKamino,
    fetchCardano: fetchCardano,
    applyAave: applyAave, applyAaveApys: applyAaveApys, applyKamino: applyKamino
  };
});
