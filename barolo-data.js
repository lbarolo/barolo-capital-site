const EVM_WALLETS = [
"0x5a9aaA78B379ec19beb9E44CCe12697d1894f396",
"0x5Ff957C19A03aF57B5098F3F395A578E394aE4B6",
"0x835a5F686c489023064Edb0EA3A0f4ee54BD77F6",
"0x8311038D68039f4C3e7237D64f4F2c598fBf4ea3"
];

const SOL_WALLET = "Fq1F49Vx38f8h62SSRCQpGYPxPEtarY5NZ5GhrFVnrfW";

async function loadBaroloData(){

try{

let totalEVMValue = 0;

// =====================
// EVM (DeBank)
// =====================

for(const wallet of EVM_WALLETS){

const res = await fetch(
`https://openapi.debank.com/v1/user/total_balance?id=${wallet}`
);

const data = await res.json();

if(data.total_usd_value){

totalEVMValue += data.total_usd_value;

}

}


// =====================
// SOLANA
// =====================

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


// preço SOL
const priceRes = await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
);

const priceData = await priceRes.json();

const solPrice = priceData.solana.usd;

const solValue = solBalance * solPrice;


// =====================
// TOTAL
// =====================

const portfolioValue = totalEVMValue + solValue;


// =====================
// SAVE
// =====================

window.baroloData = {

totalEVMValue,
solBalance,
solPrice,
solValue,
portfolioValue

};


// =====================
// UPDATE UI
// =====================

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

set("evmValue","$"+d.totalEVMValue.toFixed(2));
set("solBalance",d.solBalance.toFixed(3));
set("solValue","$"+d.solValue.toFixed(2));
set("portfolioValue","$"+d.portfolioValue.toFixed(2));

}



loadBaroloData();

setInterval(loadBaroloData,60000);
