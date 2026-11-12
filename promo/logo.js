const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800},deviceScaleFactor:6});await p.route(/supabase/,r=>r.abort());
await p.goto('http://localhost:8238/index.html');await p.waitForSelector('.entry-brand');await p.waitForTimeout(500);
await p.addStyleTag({content:'.entry-brand,.entry-brand *{background:transparent!important}'});
await p.evaluate(()=>{document.documentElement.style.background='transparent';document.body.style.background='transparent';const h=document.querySelector('.entry-header');if(h){h.style.background='transparent';h.style.boxShadow='none';}});
await p.locator('.entry-brand').first().screenshot({path:__dirname+'/film/assets/logo-klas237.png',omitBackground:true});
console.log('logo ok');await b.close();})();
