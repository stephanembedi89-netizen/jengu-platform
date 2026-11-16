const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});await p.goto('file://'+__dirname+'/og.html');await p.waitForTimeout(800);
await p.screenshot({path:__dirname+'/../../klas237/og-image.jpg',type:'jpeg',quality:88,clip:{x:0,y:0,width:1200,height:630}});await b.close();})();
