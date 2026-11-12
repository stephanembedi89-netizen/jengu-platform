const {chromium,devices}=require('/opt/node-tools/node_modules/playwright');
const OUT=__dirname+'/shots/';
const BASE='http://localhost:8238/index.html';
const clickSel=async(p,s)=>{await p.waitForSelector(s,{state:'attached',timeout:8000});await p.waitForTimeout(250);await p.evaluate(s=>document.querySelector(s).click(),s);};
(async()=>{const b=await chromium.launch();
const mk=async()=>{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});await ctx.route(/supabase\.co/,r=>r.abort());
await ctx.addInitScript(()=>{['parent','student','teacher','tutor'].forEach(r=>localStorage.setItem('klas-tour-'+r,'1'))});return ctx.newPage();};
const shot=async(p,n,full)=>{await p.waitForTimeout(700);await p.evaluate(()=>{const t=document.getElementById('toast');if(t)t.style.display='none';});await p.screenshot({path:OUT+n+'.png',fullPage:!!full});console.log('ok',n);};
let p=await mk();
// 1 accueil + défilement
await p.goto(BASE);await shot(p,'01-accueil');
await p.evaluate(()=>window.scrollTo(0,900));await shot(p,'02-accueil-2');
await p.evaluate(()=>window.scrollTo(0,1900));await shot(p,'03-accueil-3');
// offres
await p.goto(BASE);await clickSel(p,'[data-entry-go=pricing]');await shot(p,'04-offres');
await p.evaluate(()=>window.scrollTo(0,700));await shot(p,'05-offres-2');
// inscription
await p.goto(BASE);await clickSel(p,'[data-entry-go=signup]');await shot(p,'06-inscription');
// choix cursus / rôle
await p.goto(BASE);await clickSel(p,'[data-entry-go=worlds]');await shot(p,'07-cursus');
await clickSel(p,'[data-world=primary]');await shot(p,'08-roles');
// parent
await clickSel(p,'[data-entry-role=parent]');await shot(p,'09-enfants');
await clickSel(p,'[data-open-child="0"]');await shot(p,'10-parent-ce-soir');
await p.evaluate(()=>window.scrollTo(0,700));await shot(p,'11-parent-ce-soir-2');
await p.evaluate(()=>openRoute('fk-progress'));await p.evaluate(()=>window.scrollTo(0,0));await shot(p,'12-parent-progres');
await p.evaluate(()=>openRoute('fk-homework'));await p.evaluate(()=>window.scrollTo(0,0));await shot(p,'13-parent-devoirs');
// assistant
await p.evaluate(()=>openRoute('fk-home'));await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(300);
await p.evaluate(()=>document.querySelector('.ai-fab').click());await shot(p,'14-assistant');
await p.close();
// enseignant secondaire
p=await mk();await p.goto(BASE);
for(const s of ['[data-entry-go=worlds]','[data-world=college]','[data-entry-role=teacher]'])await clickSel(p,s);
await p.fill('[name=callName]','M. Ngono');await p.selectOption('#entry-teacher-profile [name=subject1]',{label:'Mathématiques'});await p.click('#entry-teacher-profile > button');await p.waitForTimeout(300);
await shot(p,'15-prof-classe-form');
await p.selectOption('#profile-level','4e');await p.fill('#entry-profile [name=name]','4e B');await p.click('#entry-profile > button');await p.waitForTimeout(900);
await shot(p,'16-prof-aujourdhui');
await p.evaluate(()=>window.scrollTo(0,650));await shot(p,'17-prof-aujourdhui-2');
await p.evaluate(()=>openRoute('tk-year'));await p.evaluate(()=>window.scrollTo(0,0));await shot(p,'18-prof-annee');
await p.evaluate(()=>openRoute('tk-evals'));await p.evaluate(()=>window.scrollTo(0,0));await shot(p,'19-prof-notes');
await p.close();
// élève
p=await mk();await p.goto(BASE);
for(const s of ['[data-entry-go=worlds]','[data-world=college]','[data-entry-role=student]'])await clickSel(p,s);
await shot(p,'20-eleve-enfants');
try{await clickSel(p,'[data-open-child="0"]');await shot(p,'21-eleve-journee');await p.evaluate(()=>window.scrollTo(0,700));await shot(p,'22-eleve-journee-2');}catch(e){console.log('élève:',e.message.slice(0,80));}
await b.close();})();
