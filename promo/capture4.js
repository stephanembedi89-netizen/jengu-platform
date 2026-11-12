const {chromium}=require('/opt/node-tools/node_modules/playwright');
const OUT=__dirname+'/shots/';const BASE='http://localhost:8238/index.html';
const clickSel=async(p,s)=>{await p.waitForSelector(s,{state:'attached',timeout:8000});await p.waitForTimeout(250);await p.evaluate(s=>document.querySelector(s).click(),s);};
(async()=>{const b=await chromium.launch();
const mk=async()=>{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});await ctx.route(/supabase\.co/,r=>r.abort());
await ctx.addInitScript(()=>{['parent','student','teacher','tutor'].forEach(r=>localStorage.setItem('klas-tour-'+r,'1'))});return ctx.newPage();};
const fs=require('fs');
const tall=async(p,n)=>{await p.waitForTimeout(600);await p.addStyleTag({content:'html body[data-entry=workspace] #save-status,html body[data-entry=workspace] main header,html body[data-entry=workspace] #screen header,.kx-tabbar,#toast{display:none!important}'}).catch(()=>{});
 const info=await p.evaluate(()=>{const els=[document.scrollingElement,...document.querySelectorAll('main,#screen,body')];let best=document.scrollingElement;for(const e of els){if(e&&e.scrollHeight>best.scrollHeight)best=e;}return {H:Math.max(document.scrollingElement.scrollHeight,document.querySelector('main')?document.querySelector('main').scrollHeight:0),vh:innerHeight};});
 const slices=[];let y=0;const step=640;
 for(let i=0;i<12;i++){if(i===1)await p.addStyleTag({content:'body::before,body::after,html::before,#screen::before,main::before{display:none!important} body[data-entry=workspace]>aside{visibility:hidden!important} .stripe,[class*=flag]{display:none!important}'});await p.evaluate(yy=>{window.scrollTo(0,yy);},y);await p.waitForTimeout(250);const real=await p.evaluate(()=>window.scrollY);const f=OUT+'_s_'+n+'_'+i+'.png';await p.screenshot({path:f});slices.push([real,f]);if(real+info.vh>=info.H-2||(i>0&&real===slices[i-1][0]))break;y+=step;}
 fs.writeFileSync(OUT+'_s_'+n+'.json',JSON.stringify({H:info.H,vh:info.vh,slices}));console.log('slices',n,info.H,slices.length);};
let p=await mk();await p.goto(BASE);
for(const s of ['[data-entry-go=worlds]','[data-world=primary]','[data-entry-role=parent]','[data-open-child="0"]'])await clickSel(p,s);
await p.waitForTimeout(700);await tall(p,'t-parent-ce-soir');
await p.evaluate(()=>openRoute('fk-progress'));await tall(p,'t-parent-progres');
await p.close();
p=await mk();await p.goto(BASE);
for(const s of ['[data-entry-go=worlds]','[data-world=college]','[data-entry-role=teacher]'])await clickSel(p,s);
await p.fill('[name=callName]','M. Ngono');await p.selectOption('#entry-teacher-profile [name=subject1]',{label:'Mathématiques'});await p.click('#entry-teacher-profile > button');await p.waitForTimeout(300);
await p.selectOption('#profile-level','4e');await p.fill('#entry-profile [name=name]','4e B');await p.click('#entry-profile > button');await p.waitForTimeout(900);
await tall(p,'t-prof-aujourdhui');
await p.evaluate(()=>openRoute('tk-year'));await tall(p,'t-prof-annee');
await p.close();
p=await mk();await p.goto(BASE);
for(const s of ['[data-entry-go=worlds]','[data-world=college]','[data-entry-role=student]'])await clickSel(p,s);
await p.waitForTimeout(500);try{await p.getByRole('button',{name:/Ouvrir/}).first().click();await p.waitForTimeout(900);}catch(e){}
await tall(p,'t-eleve');
await b.close();})();
