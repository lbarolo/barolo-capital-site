const EVM_WALLETS = [
"0x5a9aaA78B379ec19beb9E44CCe12697d1894f396",
"0x5Ff957C19A03aF57B5098F3F395A578E394aE4B6",
"0x835a5F686c489023064Edb0EA3A0f4ee54BD77F6",
"0x8311038D68039f4C3e7237D64f4F2c598fBf4ea3"
];

const SOL_WALLET = "Fq1F49Vx38f8h62SSRCQpGYPxPEtarY5NZ5GhrFVnrfW";

async function loadBaroloData(){

try{

// =============================
// PREÇOS
// =============================

const priceRes = await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana,cardano&vs_currencies=usd"
);

const priceData = await priceRes.json();

const ethPrice = priceData.ethereum.usd;
const solPrice = priceData.solana.usd;


// =============================
// EVM BALANCES
// =============================

let totalETH = 0;

for(const wallet of EVM_WALLETS){

const res = await fetch(
`https://api.ethplorer.io/getAddressInfo/${wallet}?apiKey=freekey`
);

const data = await res.json();

if(data.ETH){

totalETH += data.ETH.balance;

}

}


// =============================
// SOLANA BALANCE
// =============================

const solRes = await fetch("https://api.mainnet-beta.solana.com",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
jsonrpc:"2.0",
id:1,
method:"getBalance",
params:[SOL_WALLET]
})
});

const solData = await solRes.json();

const solBalance = solData.result.value / 1e9;


// =============================
// CALCULOS
// =============================

const ethValue = totalETH * ethPrice;
const solValue = solBalance * solPrice;

const portfolioValue = ethValue + solValue;


// =============================
// SALVAR GLOBAL
// =============================

window.baroloData = {

totalETH,
solBalance,

ethPrice,
solPrice,

ethValue,
solValue,

portfolioValue

};


// =============================
// UPDATE UI
// =============================

updateUI();

}catch(e){

console.log("Erro carregando dados",e);

}

}



function updateUI(){

if(!window.baroloData) return;

const d = window.baroloData;

function set(id,val){

const el = document.getElementById(id);

if(el) el.innerText = val;

}

set("ethBalance", d.totalETH.toFixed(4));
set("solBalance", d.solBalance.toFixed(3));

set("ethPrice", "$"+d.ethPrice.toFixed(2));
set("solPrice", "$"+d.solPrice.toFixed(2));

set("ethValue", "$"+d.ethValue.toFixed(2));
set("solValue", "$"+d.solValue.toFixed(2));

set("portfolioValue", "$"+d.portfolioValue.toFixed(2));

}



loadBaroloData();

setInterval(loadBaroloData,60000);
