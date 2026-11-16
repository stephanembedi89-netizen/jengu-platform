const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1240,height:600},deviceScaleFactor:2});await p.goto('file://'+__dirname+'/preview.html');await p.waitForTimeout(600);
await p.screenshot({path:__dirname+'/../livrables/klas237-apercu-lien.png',fullPage:true});await b.close();})();
