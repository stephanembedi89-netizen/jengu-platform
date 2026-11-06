const {chromium}=require('playwright');
const F={'4x5':[1080,1350],'9x16':[1080,1920],'1x1':[1080,1080]};
(async()=>{const b=await chromium.launch();
for(const [k,[w,h]] of Object.entries(F)){const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:Number(process.argv[2]||1)});
 await p.goto('file://'+__dirname+'/poster.html#'+k);await p.evaluate(()=>window.ready);
 await p.screenshot({path:`${__dirname}/poster_${k}.png`});await p.close()}
await b.close()})();
