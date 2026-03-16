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


// QUANTIDADES (AJUSTE SE QUISER)
const ethQty = 0;
const solQty = 19.312;
const adaQty = 0;


// EMPRÉSTIMO
const kaminoDebt = 803;


// CALCULOS
const spotValue =
(ethQty * ethPrice) +
(solQty * solPrice) +
(adaQty * adaPrice);

const netValue = spotValue - kaminoDebt;


// SALVAR GLOBAL
window.baroloData = {

ethPrice,
solPrice,
adaPrice,

ethQty,
solQty,
adaQty,

kaminoDebt,
spotValue,
netValue

};


// ATUALIZAR TELA
updateBaroloUI();

}catch(e){

console.log("API error",e);

}

}


// ATUALIZA OS ELEMENTOS DO SITE
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


// PREÇOS
set("solPrice", "$"+d.solPrice.toFixed(2));
set("ethPrice", "$"+d.ethPrice.toFixed(2));


// VALORES
set("spotValue", "$"+d.spotValue.toFixed(2));
set("debtValue", "$"+d.kaminoDebt.toFixed(2));
set("netValue", "$"+d.netValue.toFixed(2));

}


// CARREGAR
loadBaroloData();


// ATUALIZA A CADA 60s
setInterval(loadBaroloData,60000);
