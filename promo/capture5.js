// Captures « vraies » de l'application en démo, écran de téléphone 390×844 @2x
const {chromium}=require('/opt/node-tools/node_modules/playwright');
const OUT=__dirname+'/shots2/';const BASE='http://localhost:8238/index.html';
const HIDE='html body #save-status,html body[data-entry=workspace] #save-status,html body[data-entry=workspace] main>header,html body #workspace-identity,html body .entry-note,html body .ai-demo-tag,html body .ai-demo-note,#toast,.kt-tip,.kt-veil{display:none!important}';
(async()=>{const b=await chromium.launch();
const mk=async()=>{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});await ctx.route(/supabase\.co/,r=>r.abort());
 await ctx.addInitScript(()=>{['parent','student','teacher','tutor'].forEach(r=>localStorage.setItem('klas-tour-'+r,'1'))});const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));return p;};
const go=async(p,s)=>{await p.waitForSelector(s,{state:'attached',timeout:8000});await p.waitForTimeout(250);await p.evaluate(s=>document.querySelector(s).click(),s);await p.waitForTimeout(500);};
const shot=async(p,n,y)=>{await p.addStyleTag({content:HIDE}).catch(()=>{});if(y!=null){await p.evaluate(y=>window.scrollTo(0,y),y);}await p.waitForTimeout(700);await p.screenshot({path:OUT+n+'.png'});console.log('ok',n);};
const scrollTo=async(p,sel,off=0)=>{await p.evaluate(([s,o])=>{const e=document.querySelector(s);if(e)window.scrollTo(0,e.getBoundingClientRect().top+scrollY-o);},[sel,off]);};
let p=await mk();await p.goto(BASE);await p.waitForTimeout(1200);
await shot(p,'a-accueil',0);
await shot(p,'a-accueil-tel',560);
await shot(p,'a-accueil-roles',1400);
await go(p,'[data-entry-go=worlds]');await shot(p,'b-cursus-primaire',260);
await shot(p,'b-cursus-secondaire',900);
await go(p,'[data-world=primary]');await shot(p,'c-roles',380);
await go(p,'[data-entry-role=parent]');await shot(p,'d-enfants',0);
await go(p,'[data-open-child="0"]');await p.waitForTimeout(800);await shot(p,'e-parent-ce-soir',0);
await shot(p,'e-parent-ce-soir-2',700);
await p.evaluate(()=>openRoute('fk-progress'));await shot(p,'f-parent-progres',0);
await p.evaluate(()=>openRoute('fk-teacher'));await shot(p,'f-parent-message',0);
await p.close();
// enseignant secondaire
p=await mk();await p.goto(BASE);
for(const s of ['[data-entry-go=worlds]','[data-world=college]','[data-entry-role=teacher]'])await go(p,s);
await shot(p,'g-prof-profil',0);
await p.fill('[name=callName]','M. Tabi');await p.selectOption('#entry-teacher-profile [name=subject1]',{label:'Mathématiques'});await p.click('#entry-teacher-profile > button');await p.waitForTimeout(500);
await shot(p,'g-prof-nouvelle-classe',0);
await p.selectOption('#profile-level','6e').catch(()=>{});await p.fill('#entry-profile [name=name]','6e A');await p.click('#entry-profile > button');await p.waitForTimeout(1000);
await shot(p,'h-prof-aujourdhui',0);
await p.evaluate(()=>openRoute('tk-evals'));await shot(p,'h-prof-notes',0);
await p.evaluate(()=>openRoute('tk-students'));await shot(p,'h-prof-eleves',0);
await p.evaluate(()=>openRoute('tk-year'));await shot(p,'h-prof-annee',0);
await p.evaluate(()=>openRoute('staff'));await p.waitForTimeout(500);
try{await go(p,'.ai-fab');await p.waitForTimeout(800);await shot(p,'i-prof-assistant');await p.evaluate(()=>{const d=document.querySelector('dialog[open], .ai-panel, .ai-sheet');const sc=d&&([...d.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+50)||d);if(sc)sc.scrollTop=380;});await shot(p,'i-prof-assistant-2');}catch(e){console.log('ai',e.message)}
await p.close();
// élève
p=await mk();await p.goto(BASE);
for(const s of ['[data-entry-go=worlds]','[data-world=college]','[data-entry-role=student]'])await go(p,s);
await shot(p,'j-eleve-entree',0);
try{await p.getByRole('button',{name:/Ouvrir/}).first().click();await p.waitForTimeout(900);}catch(e){}
await shot(p,'j-eleve',0);await shot(p,'j-eleve-2',700);
await p.evaluate(()=>openRoute('fk-focus'));await shot(p,'j-eleve-focus',0);
await p.close();
// offres
p=await mk();await p.goto(BASE);await go(p,'[data-entry-go=pricing]');await shot(p,'k-offres',0);await shot(p,'k-offres-2',600);
await b.close();})();
