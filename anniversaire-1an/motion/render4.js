const {chromium}=require('playwright');const fs=require('fs');
const [w,n,fps,dur]=process.argv.slice(2).map(Number);
const A=JSON.parse(fs.readFileSync(__dirname+'/warp.json'));
const warp=t=>{for(let i=0;i<A.length-1;i++){const [a0,b0]=A[i],[a1,b1]=A[i+1];if(t<=a1)return b0+(b1-b0)*(t-a0)/(a1-a0)}return A[A.length-1][1]};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/eau2.html');await p.evaluate(()=>window.ready);
const N=Math.round(fps*dur);
for(let f=w;f<N;f+=n){await p.evaluate(t=>render(t),warp(f/fps));
 await p.screenshot({path:`${__dirname}/frames4/f_${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:93});}
await b.close()})();
