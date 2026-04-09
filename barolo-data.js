
const BAROLO_WALLETS = {
  sol: "Fq1F49Vx38f8h62SSRCQpGYPxPEtarY5NZ5GhrFVnrfW"
};

window.baroloData = {
  solQty:0,
  solPrice:0,
  kaminoDebt:0
};

async function loadBaroloData(){

  const prices = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum,cardano&vs_currencies=usd")
  .then(r=>r.json());

  window.baroloData.solPrice = prices.solana.usd;

  try{

    const kamino = await fetch(`https://api.kamino.finance/user-metadata/${BAROLO_WALLETS.sol}/obligations`)
    .then(r=>r.json());

    let sol=0;
    let debt=0;

    kamino.forEach(o=>{
      o.deposits.forEach(d=>{
        if(d.mintAddress==="So11111111111111111111111111111111111111112"){
          sol+=Number(d.amount);
        }
      });
      o.borrows.forEach(b=>{
        debt+=Number(b.marketValue);
      });
    });

    window.baroloData.solQty = sol;
    window.baroloData.kaminoDebt = debt;

  }catch(e){
    console.log("Kamino API error",e);
  }

  console.log("Barolo data loaded",window.baroloData);
}

loadBaroloData();
setInterval(loadBaroloData,60000);
