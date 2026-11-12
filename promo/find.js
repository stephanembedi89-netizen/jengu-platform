const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true});await ctx.route(/supabase\.co/,r=>r.abort());
await ctx.addInitScript(()=>{['parent','student','teacher','tutor'].forEach(r=>localStorage.setItem('klas-tour-'+r,'1'))});
const p=await ctx.newPage();await p.goto('http://localhost:8238/index.html');
for(const s of ['[data-entry-go=worlds]','[data-world=primary]','[data-entry-role=parent]','[data-open-child="0"]']){await p.waitForSelector(s,{state:'attached'});await p.waitForTimeout(250);await p.evaluate(s=>document.querySelector(s).click(),s);}
await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.offsetParent&&e.children.length<3&&/Démonstration|Démo ·/.test(e.textContent||'')&&e.textContent.length<300).map(e=>e.tagName+'#'+e.id+'.'+e.className+' | '+e.textContent.slice(0,50))));
await b.close();})();
