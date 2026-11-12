const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true});await ctx.route(/supabase\.co/,r=>r.abort());
await ctx.addInitScript(()=>{['parent','student','teacher','tutor'].forEach(r=>localStorage.setItem('klas-tour-'+r,'1'))});
const p=await ctx.newPage();await p.goto('http://localhost:8238/index.html');
for(const s of ['[data-entry-go=worlds]','[data-world=primary]','[data-entry-role=parent]','[data-open-child="0"]']){await p.waitForSelector(s,{state:'attached'});await p.waitForTimeout(250);await p.evaluate(s=>document.querySelector(s).click(),s);}
await p.waitForTimeout(900);await p.evaluate(()=>document.querySelectorAll('main header, #screen header, body > header').forEach(e=>e.style.setProperty('display','none','important')));await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const e=document.elementFromPoint(150,150);let o=[];for(let n=e;n&&n.tagName!=='BODY';n=n.parentElement)o.push(n.tagName+'#'+n.id+'.'+(n.className||'')+' d='+getComputedStyle(n).display);return o.join('\n');}));
await b.close();})();
