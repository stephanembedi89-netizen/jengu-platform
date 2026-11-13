const {chromium}=require('playwright');
const [w,n,fps,dur]=process.argv.slice(2).map(Number);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/'+(process.env.F||'film.html'));await p.evaluate(()=>window.ready);
const N=Math.round(fps*dur);
for(let f=w;f<N;f+=n){await p.evaluate(t=>render(t),f/fps);
 await p.screenshot({path:`${__dirname}/framesK/f_${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:93});}
await b.close()})();
