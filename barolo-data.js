async function loadBaroloData(){

try{

// PREÇOS
const priceRes = await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana,cardano&vs_currencies=usd"
);

const priceData = await priceRes.json();

const ethPrice = priceData.ethereum.usd;
const solPrice = priceData.solana.usd;
const adaPrice = priceData.cardano.usd;


// QUANTIDADES CRYPTO
const ethQty = 0;
const solQty = 19.312;
const adaQty = 0;


// STABLECOINS
const usdcQty = 0;   // coloque sua quantidade
const usdtQty = 0;   // coloque sua quantidade


// EMPRÉSTIMOS
const kaminoDebt = 803; // valor da dívida


// CALCULO SPOT
const spotValue =
(ethQty * ethPrice) +
(solQty * solPrice) +
(adaQty * adaPrice) +
usdcQty +
usdtQty;


// VALOR LÍQUIDO
const netValue = spotValue - kaminoDebt;


// SALVAR GLOBAL
window.baroloData = {

ethPrice,
solPrice,
adaPrice,

ethQty,
solQty,
adaQty,

usdcQty,
usdtQty,

kaminoDebt,

spotValue,
netValue

};


// ATUALIZAR INTERFACE
updateBaroloUI();

}catch(e){

console.log("Erro API",e);

}

}



function updateBaroloUI(){

if(!window.baroloData) return;

const d = window.baroloData;


function set(id,val){

const el = document.getElementById(id);

if(el) el.innerText = val;

}


// QUANTIDADES
set("solQty", d.solQty.toFixed(3));
set("ethQty", d.ethQty.toFixed(3));
set("adaQty", d.adaQty.toFixed(3));

set("usdcQty", d.usdcQty.toFixed(2));
set("usdtQty", d.usdtQty.toFixed(2));


// PREÇOS
set("solPrice", "$"+d.solPrice.toFixed(2));
set("ethPrice", "$"+d.ethPrice.toFixed(2));
set("adaPrice", "$"+d.adaPrice.toFixed(2));


// VALORES
set("spotValue", "$"+d.spotValue.toFixed(2));
set("debtValue", "$"+d.kaminoDebt.toFixed(2));
set("netValue", "$"+d.netValue.toFixed(2));

}



// PRIMEIRA CARGA
loadBaroloData();


// ATUALIZA A CADA 60s
setInterval(loadBaroloData,60000);
