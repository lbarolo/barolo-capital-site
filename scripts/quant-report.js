#!/usr/bin/env node
/* Relatório QUANT macro — Barolo Capital (só LEITURA: não grava nada no repo).
 * Uso: node scripts/quant-report.js          → relatório legível
 *      node scripts/quant-report.js --json   → objeto completo
 * Fontes (sem chave): Coinbase Exchange (candles diários BTC/ETH/SOL, ~4 anos),
 * FRED fredgraph.csv (juros, inflação implícita, dólar, M2, VIX), btc-onchain.json (MVRV etc.),
 * data.js (posições) e lib/barolo-core.js (TWR/TIR/Sharpe). Conceitos explicados em QUANT.md. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'data.js')); require(path.join(ROOT, 'benchmark-data.js'));
const D = window.BAROLO_DATA, C = require(path.join(ROOT, 'lib/barolo-core.js'));
const UA = { 'User-Agent': 'Mozilla/5.0' };
async function cb(prod){let end=Date.now(),out=[];for(let i=0;i<5;i++){const start=end-300*864e5;const u=`https://api.exchange.coinbase.com/products/${prod}/candles?granularity=86400&start=${new Date(start).toISOString()}&end=${new Date(end).toISOString()}`;const r=await fetch(u,{headers:UA});const j=await r.json();if(!Array.isArray(j)||!j.length)break;out.push(...j);end=start;}
 const m={};for(const c of out)m[new Date(c[0]*1000).toISOString().slice(0,10)]=c[4];return m;}
async function fred(id){const r=await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`,{headers:UA});const t=await r.text();return t.split('\n').slice(1).filter(Boolean).map(l=>l.split(',')).filter(a=>a[1]!=='.'&&a[1]!=='').map(a=>[a[0],+a[1]]).slice(-800);}
(async()=>{
const px={};for(const p of['BTC-USD','ETH-USD','SOL-USD'])px[p]=await cb(p);
const macro={};for(const id of['DGS10','DTWEXBGS','WM2NS','T10YIE','DFF','VIXCLS'])macro[id]=await fred(id);
const oc=JSON.parse(fs.readFileSync(path.join(ROOT,'btc-onchain.json'))).series;
const dates=Object.keys(px['BTC-USD']).filter(d=>px['ETH-USD'][d]&&px['SOL-USD'][d]).sort();
const S={BTC:dates.map(d=>px['BTC-USD'][d]),ETH:dates.map(d=>px['ETH-USD'][d]),SOL:dates.map(d=>px['SOL-USD'][d])};
const lr=a=>a.slice(1).map((v,i)=>Math.log(v/a[i]));
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length, sd=a=>{const m=mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1))};
const cov=(a,b)=>{const ma=mean(a),mb=mean(b);return a.reduce((s,x,i)=>s+(x-ma)*(b[i]-mb),0)/(a.length-1)};
const corr=(a,b)=>cov(a,b)/sd(a)/sd(b);
const R={};for(const k in S)R[k]=lr(S[k]);
const last=n=>a=>a.slice(-n);
const out={dates:[dates[0],dates.at(-1)]};
out.vol={};for(const k in R)out.vol[k]={d30:sd(R[k].slice(-30))*Math.sqrt(365),d90:sd(R[k].slice(-90))*Math.sqrt(365),d365:sd(R[k].slice(-365))*Math.sqrt(365)};
const r365={};for(const k in R)r365[k]=R[k].slice(-365);
out.corr365={BTC_ETH:corr(r365.BTC,r365.ETH),BTC_SOL:corr(r365.BTC,r365.SOL),ETH_SOL:corr(r365.ETH,r365.SOL)};
out.corr90={BTC_ETH:corr(R.BTC.slice(-90),R.ETH.slice(-90)),BTC_SOL:corr(R.BTC.slice(-90),R.SOL.slice(-90))};
out.beta365={ETH:cov(r365.ETH,r365.BTC)/cov(r365.BTC,r365.BTC),SOL:cov(r365.SOL,r365.BTC)/cov(r365.BTC,r365.BTC)};
const ma=(a,n)=>mean(a.slice(-n));
out.trend={};for(const k in S){const a=S[k],p=a.at(-1),ath=Math.max(...a);out.trend[k]={price:p,ma200d:ma(a,200),vsMa200:p/ma(a,200)-1,ma200w:a.length>=1400?ma(a,1400):null,ddFromHigh1500d:p/ath-1,ret90:p/a.at(-91)-1,ret365:p/a.at(-366)-1}}
// portfolio current weights
const P={BTC:S.BTC.at(-1),ETH:S.ETH.at(-1),SOL:S.SOL.at(-1)};
const cg={bitcoin:P.BTC,ethereum:P.ETH,solana:P.SOL,tether:1,usds:1,cardano:0.5};
let val={};for(const h of D.holdings){const k=h.ticker;const p=k in P?P[k]:null;if(p)val[k]=h.qty*p;else val.ALTS=(val.ALTS||0)+0}
const nw=C.netWorth(D,id=>cg[id]||0);out.netWorth=nw;
const stab=D.stables.reduce((s,x)=>s+x.qty,0);
const cryptoW={BTC:val.BTC,ETH:val.ETH,SOL:val.SOL};
const net=nw.netWorth;out.exposure={BTC:val.BTC/net,ETH:val.ETH/net,SOL:val.SOL/net,stables:stab/net,debt:-nw.debt/net,grossToNet:(val.BTC+val.ETH+val.SOL+stab)/net,cryptoBetaExposure:(val.BTC+val.ETH+val.SOL)/net};
// daily P&L series with current holdings (constant quantities), last 365d
const n=365;const pnl=[];for(let i=dates.length-n;i<dates.length;i++){let d=0;for(const k of['BTC','ETH','SOL'])d+=(val[k]/P[k])*(S[k][i]-S[k][i-1]);pnl.push(d/net)}
const srt=pnl.slice().sort((a,b)=>a-b);const q=p=>srt[Math.floor(p*srt.length)];
out.port={volAnn:sd(pnl)*Math.sqrt(365),VaR95_1d:q(0.05),VaR99_1d:q(0.01),CVaR95_1d:mean(srt.slice(0,Math.floor(0.05*srt.length))),VaR95_30d_param:-1.645*sd(pnl)*Math.sqrt(30),worstDay:srt[0]};
// risk contribution (Euler) on 365d
const ks=['BTC','ETH','SOL'];const w=ks.map(k=>val[k]/net);const Cm=ks.map(a=>ks.map(b=>cov(r365[a],r365[b])*365));
const sig=Math.sqrt(w.reduce((s,wi,i)=>s+w.reduce((t,wj,j)=>t+wi*wj*Cm[i][j],0),0));
out.riskContrib=Object.fromEntries(ks.map((k,i)=>[k,{weight:w[i],rc:w[i]*w.reduce((t,wj,j)=>t+wj*Cm[i][j],0)/sig/sig}]));
const allW=[val.BTC,val.ETH,val.SOL,stab].map(x=>x/(val.BTC+val.ETH+val.SOL+stab));out.HHI=allW.reduce((s,x)=>s+x*x,0);out.effN=1/out.HHI;
// liquidation distance
const sn=D.lendingSnapshot({ETH:P.ETH,SOL:P.SOL});out.lending=sn;
const k=D.defi.kamino;const solQ=k.supply.SOL.qty, usds=k.supply.USDS.qty, kdebt=Object.values(k.borrow).reduce((s,x)=>s+x.qty,0);
const solLiq=(kdebt/k.liqLtv-usds)/solQ;
const Ncdf=x=>{const t=1/(1+0.2316419*Math.abs(x));const d=0.3989423*Math.exp(-x*x/2);const p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return x>0?1-p:p};
const touch=(p,b,s,T)=>{const z=Math.log(b/p)/(s*Math.sqrt(T));return Math.min(1,2*Ncdf(z))};
const sSol=out.vol.SOL.d365;out.liq={SOL:{liqPrice:solLiq,drop:solLiq/P.SOL-1,sigmas1y:Math.log(solLiq/P.SOL)/sSol,pTouch90d:touch(P.SOL,solLiq,sSol,90/365),pTouch365d:touch(P.SOL,solLiq,sSol,1)}};
// AAVE: ETH price where HF=1 (USDT fixed)
const a=D.defi.aave;const ethQ=a.supply.WETH.qty,usdt=a.supply.USDT.qty,adebt=Object.values(a.borrow).reduce((s,x)=>s+x.qty,0);const ethLiq=(adebt-usdt*0.78)/(ethQ*0.83);out.liq.ETH_AAVE={liqPrice:ethLiq,note:ethLiq<=0?'imune (USDT cobre)':''};
// monthly track: TWR monthly vs BTC
// macro
const lastv=id=>macro[id].at(-1);const agoV=(id,days)=>{const arr=macro[id];const t=new Date(arr.at(-1)[0])-days*864e5;let v=arr[0][1];for(const [d,x] of arr)if(new Date(d)<=t)v=x;return v};
out.macro={us10y:lastv('DGS10'),breakeven10y:lastv('T10YIE'),real10y:lastv('DGS10')[1]-lastv('T10YIE')[1],fedFunds:lastv('DFF'),vix:lastv('VIXCLS'),dxy:lastv('DTWEXBGS'),dxy3m:lastv('DTWEXBGS')[1]/agoV('DTWEXBGS',90)-1,us10y_3m:lastv('DGS10')[1]-agoV('DGS10',90),m2yoy:lastv('WM2NS')[1]/agoV('WM2NS',365)-1};
const o=oc.at(-1);const pr=oc.map(x=>x.price);out.onchain={t:o.t,mvrv:o.mvrv,mvrv_sth:o.mvrv_sth,mvrv_lth:o.mvrv_lth,sopr_lth:o.sopr_lth,aviv:o.aviv,mayer:o.price/mean(pr.slice(-200)),realized:o.realized,realized_sth:o.realized_sth};
// DCA backtest BTC: fixed vs Mayer-scaled, weekly, 1500d
const B=S.BTC;let fx=0,fxUsd=0,mv=0,mvUsd=0;const mult=m=>m<0.8?2:m<1?1.5:m<1.5?1:m<2.4?0.5:0;
const buys=[];for(let i=200;i<B.length;i+=7){const m=B[i]/mean(B.slice(i-200,i));buys.push([i,mult(m)])}
const tot=buys.reduce((s,b)=>s+b[1],0);const unit=buys.length/tot;
for(const [i,m] of buys){fx+=100/B[i];fxUsd+=100;mv+=100*m*unit/B[i];mvUsd+=100*m*unit}
out.dca={weeks:buys.length,usd:fxUsd,btcFixed:fx,btcMayer:mv,gain:mv/fx-1,avgPriceFixed:fxUsd/fx,avgPriceMayer:mvUsd/mv,from:dates[200]};
out.portBetaBTC=out.exposure.BTC+out.exposure.ETH*out.beta365.ETH+out.exposure.SOL*out.beta365.SOL;
out.perf=C.performanceMetrics(D.wealthCurve,window.BENCHMARK_DATA);
if(process.argv.includes('--json')){console.log(JSON.stringify(out,null,1));return;}
const pc=x=>(x*100).toFixed(1)+'%',us=x=>'US$ '+Math.round(x).toLocaleString('pt-BR');
const L=[];const t=out.trend,m=out.macro,c=out.onchain;
L.push(`RELATÓRIO QUANT · ${out.dates[1]} · posições do data.js (${D.asOf})`,'');
L.push('1) PORTFÓLIO',`  Patrimônio líquido ${us(out.netWorth.netWorth)} · exposição cripto ${pc(out.exposure.cryptoBetaExposure)} do líquido`,
 `  Pesos: ETH ${pc(out.exposure.ETH)} · SOL ${pc(out.exposure.SOL)} · BTC ${pc(out.exposure.BTC)} · stables ${pc(out.exposure.stables)} · dívida ${pc(out.exposure.debt)}`,
 `  Beta ao BTC ${out.portBetaBTC.toFixed(2)} · vol anual ${pc(out.port.volAnn)} · N efetivo ${out.effN.toFixed(2)}`,
 `  Risco (contribuição): ETH ${pc(out.riskContrib.ETH.rc)} · SOL ${pc(out.riskContrib.SOL.rc)} · BTC ${pc(out.riskContrib.BTC.rc)}`,
 `  VaR95 1 dia ${pc(out.port.VaR95_1d)} (${us(out.port.VaR95_1d*out.netWorth.netWorth)}) · CVaR95 ${pc(out.port.CVaR95_1d)} · VaR95 30d ${pc(out.port.VaR95_30d_param)}`,
 `  Liquidação SOL ${us(out.liq.SOL.liqPrice)} (${pc(out.liq.SOL.drop)}, ${out.liq.SOL.sigmas1y.toFixed(2)}σ de 1 ano) · P(tocar em 1 ano) ${pc(out.liq.SOL.pTouch365d)} · AAVE: ${out.liq.ETH_AAVE.note||us(out.liq.ETH_AAVE.liqPrice)} · HF ${out.lending.hf.toFixed(2)}`,
 `  Track: TWR ${out.perf.twr.toFixed(2)}% a.a. · TIR ${out.perf.irr.toFixed(2)}% · Sharpe ${out.perf.sharpe.toFixed(2)} · MaxDD ${out.perf.maxDD.toFixed(1)}%`,'');
L.push('2) ATIVOS (vol 30d/1a · preço vs MM200d · vs MM200s · queda do topo 4a)');
for(const k of['BTC','ETH','SOL'])L.push(`  ${k}: vol ${pc(out.vol[k].d30)}/${pc(out.vol[k].d365)} · ${pc(t[k].vsMa200)} · ${t[k].ma200w?pc(t[k].price/t[k].ma200w-1):'—'} · ${pc(t[k].ddFromHigh1500d)}`);
L.push(`  Correlação 1a: BTC-ETH ${out.corr365.BTC_ETH.toFixed(2)} · BTC-SOL ${out.corr365.BTC_SOL.toFixed(2)} · beta ETH ${out.beta365.ETH.toFixed(2)} · SOL ${out.beta365.SOL.toFixed(2)}`,'');
L.push('3) MACRO',`  Juro 10a EUA ${m.us10y[1]}% (${m.us10y_3m>=0?'+':''}${m.us10y_3m.toFixed(2)} p.p. em 3m) · juro real ${m.real10y.toFixed(2)}% · Fed ${m.fedFunds[1]}%`,
 `  Dólar (DTWEXBGS) ${pc(m.dxy3m)} em 3m · M2 ${pc(m.m2yoy)} a.a. · VIX ${m.vix[1]}`,'');
L.push('4) CICLO ON-CHAIN (BTC)',`  MVRV ${c.mvrv.toFixed(2)} · STH ${c.mvrv_sth.toFixed(2)} · LTH ${c.mvrv_lth.toFixed(2)} · Mayer ${c.mayer.toFixed(2)} · AVIV ${c.aviv.toFixed(2)} · LTH SOPR ${c.sopr_lth.toFixed(2)}`,'');
L.push('5) TESTE DE REGRA — DCA semanal BTC fixo × escalado pelo Mayer (mesmo dinheiro total)',`  desde ${out.dca.from}: preço médio ${us(out.dca.avgPriceFixed)} × ${us(out.dca.avgPriceMayer)} → ${pc(out.dca.gain)} de BTC`);
console.log(L.join('\n'));
})().catch(e=>{console.error('ERRO',e.message);process.exit(1)});
