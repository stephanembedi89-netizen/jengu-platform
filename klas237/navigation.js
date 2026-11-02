// Keep primary pickers inside the currently opened curriculum and profile type.
function primaryContextProfiles(){
 const current=data.children[selected];
 if(!current||current.track!=='primary')return [];
 return data.children.map((c,i)=>({c,i})).filter(({c})=>c.track==='primary'&&c.subsystem===current.subsystem&&!!c.professional===!!current.professional&&(!c.professional||c.professionalRole===current.professionalRole));
}
// Interface language is a device preference, never a student-data store.
let uiLanguage='fr';
try { uiLanguage=localStorage.getItem('klas-ui-language')==='en'?'en':'fr'; } catch {}
function tr(fr,en){return uiLanguage==='en'?en:fr}
function routeGroups(a,course){
 const common=[['support','Mon accompagnement','Learning support'],['sessions','Séances de soutien','Support sessions'],['monthly','Paiements du mois','Monthly payments'],['budget','Mes dépenses','Expenses'],['messages','Mes messages','Messages']];
 if(a==='teacher')return {main:[['staff','Ma journée','My day'],['build-course','Préparer un cours','Plan a lesson'],['classroom','Ma progression','Class progress'],['progress','Mes observations','Observations']],extra:[['lesson-library','Mes cours et bilans','Lessons and reviews'],['week','Ma semaine','My week'],['messages','Écrire aux familles','Write to families'],['prepare','Anciennes préparations','Earlier lesson plans']]};
 if(a==='tutor')return {main:[['staff','Mes accompagnements','My students'],['sessions','Mes séances','My sessions'],['build-course','Préparer une séance','Plan a session'],['progress','Les progrès','Learning progress']],extra:[['lesson-library','Mes séances et bilans','Plans and reviews'],['monthly','Paiements du mois','Monthly payments'],['messages','Bilan aux parents','Write to parents'],['prepare','Anciennes préparations','Earlier plans']]};
 if(course==='college')return a==='student'?{main:[['college','Mon travail','My work'],['block','Je bloque','I need help'],['revise','Mes révisions','My revision'],['parent-summary','Notre prochaine action','Our next step']],extra:[]}:{main:[['parent-summary','Mon suivi · 10 min','My 10-minute check-in'],['college','Son travail','Their work'],['block','Ses difficultés','Where help is needed'],['revise','Ses révisions','Their revision']],extra:common};
 return {main:[['home','Mon quotidien','My day'],['homework','Devoirs à domicile','Homework'],['routine','Mes 10 minutes','My 10 minutes'],['search','Je l’aide à comprendre','Help them understand']],extra:[['daily','Ce qui a été vu aujourd’hui','What was covered today'],['progress','Ses progrès','Learning progress'],['week','Ma semaine','My week'],...common]};
}
function openRoute(next){if(next==='search'&&typeof helpDraft!=='undefined')helpDraft.lang=uiLanguage;page=next;step=0;render();window.scrollTo({top:0,behavior:'auto'});const heading=document.querySelector('#screen h1, #screen h2');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}}
function renderNavigation(a,course){
 const nav=document.querySelector('#nav'),groups=routeGroups(a,course);nav.replaceChildren();nav.setAttribute('aria-label',tr('Navigation principale','Main navigation'));
 const add=(target,row)=>{const [id,fr,en]=row,b=document.createElement('button');b.textContent=tr(fr,en);b.dataset.route=id;if(page===id){b.className='active';b.setAttribute('aria-current','page')}b.onclick=()=>openRoute(id);target.append(b)};
 groups.main.forEach(row=>add(nav,row));
 if(groups.extra.length){const details=document.createElement('details');details.className='nav-extra';const summary=document.createElement('summary');summary.textContent=tr('Autres outils','More tools');details.append(summary);groups.extra.forEach(row=>add(details,row));details.open=groups.extra.some(row=>row[0]===page);nav.append(details)}
 document.documentElement.lang=uiLanguage;
 for(const [id,fr,en] of [['parent','Parent','Parent'],['student-view','Élève','Student'],['teacher','Enseignant','Teacher'],['tutor','Accompagnateur','Learning coach'],['account','Mon accès personnel','My account'],['mobile-account','Mon compte','My account']]){const el=document.getElementById(id);if(el)el.textContent=tr(fr,en)}
 const language=document.getElementById('ui-language');language.value=uiLanguage;language.onchange=()=>changeInterfaceLanguage(language.value);
 document.getElementById('mode').textContent=cloud?tr('Mon compte · connecté','My account · signed in'):tr('Démo · données fictives','Demo · fictional data');
}
function primaryRoutineView(){
 const stages=uiLanguage==='en'?[
 ['Let’s talk.','2 minutes','Ask: “What did you learn today? What did you enjoy or find difficult?”','Listen first. You do not need to correct everything.'],
 ['Let’s try together.','5 minutes','Choose one instruction in the exercise book. Ask your child to explain it, then try the first step.','If it is difficult, use “Find an explanation” or note a question for the teacher or tutor.'],
 ['Show me how.','3 minutes','Let your child explain what they understood. Choose one thing to prepare for tomorrow.','Recognise a specific effort: “You took time to explain your idea.”']]:[
 ['On se raconte.','2 minutes','Demandez : « Qu’as-tu appris aujourd’hui ? Qu’est-ce qui t’a plu ou semblé difficile ? »','Écoutez d’abord. Vous n’avez pas besoin de tout corriger.'],
 ['On regarde ensemble.','5 minutes','Choisissez une consigne dans le cahier. L’enfant la reformule, puis essaie la première étape.','Si ça bloque, utilisez « Trouver une explication » ou notez une question pour l’enseignant ou le prof particulier.'],
 ['Tu me montres ?','3 minutes','Laissez l’enfant expliquer ce qu’il a compris. Choisissez une chose à préparer pour demain.','Soulignez un effort précis : « Tu as pris le temps de m’expliquer. »']];
 const current=stages[step];
 return `<h1>${tr('Mes 10 minutes','My 10 minutes')}</h1><p class="muted">${tr('Une petite étape suffit.','One small step is enough.')}</p><section class="card"><label for="who">${tr('Avec quel enfant ?','Which child?')}</label><select id="who">${primaryContextProfiles().map(({c,i})=>true?`<option value="${i}" ${i===selected?'selected':''}>${esc(c.name)} · ${esc(c.level)}</option>`:'').join('')}</select><p class="minute-badge">${step+1} / 3 · ${current[1]}</p><h2>${current[0]}</h2><p>${current[2]}</p><p class="note">${current[3]}</p>${step===1?`<button class="secondary" data-go="search">${tr('Trouver une explication','Find an explanation')}</button>`:''}<div class="actions">${step?`<button id="prev" class="secondary">${tr('Revenir','Back')}</button>`:''}<button id="next">${step<2?tr('Passer à la suite','Next'):tr('Terminer ce moment','Finish this check-in')}</button></div></section>`;
}
function englishPrimaryHome(){
 return `<h1>One small step today.</h1><p class="muted">Listen, work on one difficulty, and decide what comes next.</p><div class="headrow"><p>${cloud?'Your account is connected.':'Interactive demo: use fictional information only.'}</p><button id="addchild" class="secondary">Add a child</button></div><div class="grid"><section class="card hero"><div><h2>Our 10 minutes together.</h2><p>You do not have to know every answer. Start with your child’s exercise book and one question.</p><button data-go="routine">Start my 10 minutes</button></div><div class="clock"><b>10</b><span>MINUTES</span></div></section><section class="card"><h2>My children</h2>${primaryContextProfiles().map(({c,i})=>true?`<div class="row"><div class="grow"><b>${esc(c.name)}</b><p>${esc(c.level)}</p></div><button class="secondary" data-child="${i}">Choose</button></div>`:'').join('')||'<p>Add a child to get started.</p>'}</section></div><div class="actions"><button data-go="daily" class="secondary">Today’s subjects</button><button data-go="search" class="secondary">Find an explanation</button></div>`;
}

function changeInterfaceLanguage(language){
 const composed=document.getElementById('draft')?.value;
 const controls=[...document.querySelectorAll('#screen input, #screen textarea, #screen select')];
 const drafts=controls.map((el,index)=>({key:draftControlKey(el,index),value:el.value,checked:el.checked,type:el.type}));
 uiLanguage=language==='en'?'en':'fr';try{localStorage.setItem('klas-ui-language',uiLanguage)}catch{}
 if(page==='search'&&typeof helpDraft!=='undefined')helpDraft.lang=uiLanguage;
 render();
 [...document.querySelectorAll('#screen input, #screen textarea, #screen select')].forEach((el,index)=>{
   const saved=drafts.find(x=>x.key===draftControlKey(el,index)&&x.type===el.type);
   if(!saved||el.id==='help-lang')return;
   el.value=saved.value;if(el.type==='checkbox'||el.type==='radio')el.checked=saved.checked;
 });
 if(composed!==undefined&&document.getElementById('generate')){document.getElementById('generate').click();document.getElementById('draft').value=composed;}
 document.querySelectorAll('[data-feeling]').forEach(el=>{const details=document.getElementById('details'+el.dataset.feeling);if(details)details.hidden=el.value==='Pas renseigné'});
}

function draftControlKey(el,index){return el.id||(el.name?el.name+(['radio','checkbox'].includes(el.type)?':'+el.value:''):String(index))}
