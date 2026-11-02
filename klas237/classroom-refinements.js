/* Daily priorities built from the user's observations, never automatic grades. */
(function(){
 const previous=render;
 function action(box,label,route){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=label;b.onclick=()=>openRoute(route);box.append(b);}
 render=function(){
  previous();const c=data.children[selected];if(!c)return;
  const screen=document.querySelector('#screen');
  if(role==='teacher'&&c.track==='primary'&&page==='staff'){
   const rows=(data.teacherDay||[]).filter(x=>x.profileId===c.id&&x.level===c.level&&x.subsystem===c.subsystem&&x.reviewed).slice().sort((a,b)=>b.date.localeCompare(a.date));
   const latest=[...new Map(rows.map(x=>[x.subject,x]).reverse()).values()];
   const box=document.createElement('section');box.className='card daily-entry teacher-next';
   box.innerHTML='<h2>'+tr('Que reprendre avec ma classe ?','What should my class revisit?')+'</h2><p>'+tr('Le dernier bilan de chaque matière vous aide à choisir la prochaine séance. Les élèves non vérifiés ne sont pas comptés comme ayant réussi.','Use the latest review in each subject to choose the next lesson. Unchecked pupils are not counted as successful.')+'</p>';
   if(!latest.length){const p=document.createElement('p');p.textContent=tr('Après une séance, renseignez « Faire le bilan de la classe ». Les points à reprendre apparaîtront ici.','After a lesson, complete Review the class. Points to revisit will appear here.');box.append(p);}
   latest.forEach(x=>{const item=document.createElement('article');item.className='explain-step';const unchecked=Math.max(0,x.total-x.alone-x.help-(x.notYet||0));item.innerHTML='<h3>'+esc(x.subject+' · '+x.topic)+'</h3><p>'+esc(x.date)+' · '+x.alone+'/'+x.total+' '+tr('sans aide','independently')+' · '+x.help+' '+tr('avec aide','with help')+' · '+(x.notYet||0)+' '+tr('à reprendre','to revisit')+' · '+unchecked+' '+tr('non vérifiés','unchecked')+'</p><p>'+esc(x.difficulty||tr('Aucune difficulté précisée.','No difficulty specified.'))+'</p>';const b=document.createElement('button');b.className='secondary';b.textContent=tr('Préparer une reprise','Plan a follow-up lesson');b.onclick=()=>{lessonDraft={level:c.level,group:c.name,subject:x.subject,topic:x.topic,goal:x.goal,restart:x.difficulty||'',duration:'15',check:tr('Faire essayer un nouvel exemple à chaque élève et noter qui a encore besoin d’aide.','Ask each pupil to try a new example and note who still needs help.')};openRoute('build-course');};item.append(b);box.append(item);});
   const actions=document.createElement('div');actions.className='actions';action(actions,tr('Analyser une évaluation','Review an assessment'),'classroom');action(actions,tr('Préparer un nouveau cours','Plan a new lesson'),'build-course');box.append(actions);screen.append(box);
  }
  if(c.track!=='college'||!['6e','5e','4e','3e'].includes(c.level))return;
  if(['college','parent-summary','staff'].includes(page)){
   const who=activeAudience(),box=document.createElement('section');box.className='card secondary-role-guide';
   const messages={student:['Mon travail, ma prochaine étape','Je commence par mon essai. Je note le point précis qui bloque et je vérifie avec un autre exercice.'],parent:['Mon rôle : faire le point et encourager','Demandez à votre enfant de montrer son essai. Choisissez ensemble une prochaine action et la date pour en reparler.'],teacher:['Ma matière, ma classe, ma reprise','Préparez le cours, analysez les erreurs communes après correction, puis vérifiez la reprise avec un nouvel exercice.'],tutor:['Un besoin précis, puis un essai seul','Reprenez la méthode du cours, faites essayer un autre exercice et préparez un retour court pour le parent.']};
   const en={student:['My work, my next step','Start with your own attempt. Name the difficult step and check your understanding with another exercise.'],parent:['My role: check in and encourage','Ask your child to show their attempt. Agree on a next action and when to review it together.'],teacher:['My subject, my class, my follow-up','Plan the lesson, analyse common errors after marking, then check understanding with a new exercise.'],tutor:['One specific need, then an independent try','Follow the classroom method, try another exercise and prepare a short update for the parent.']};
   const text=(uiLanguage==='en'?en:messages)[who]||messages.parent;
   box.innerHTML='<div class="eyebrow">'+esc(c.level+' · '+c.name)+'</div><h2>'+esc(text[0])+'</h2><p>'+esc(text[1])+'</p><p class="muted">'+esc(COLLEGE_FOCUS[c.level][1])+'</p>';
   const actions=document.createElement('div');actions.className='actions';
   if(who==='teacher'){action(actions,'Construire mon cours','build-course');action(actions,'Analyser les copies','classroom');}
   else if(who==='tutor'){action(actions,'Préparer la séance','build-course');actions.lastElementChild.onclick=()=>{const need=coachAssignedBlocks()[0];lessonDraft=need?{level:c.level,group:c.name,subject:need.subject,topic:need.question,duration:'30'}:null;openRoute('build-course');};action(actions,'Paiements du mois','monthly');}
   else {action(actions,who==='student'?'Mon point difficile':'Notre prochaine action',who==='student'?'block':'coordination');action(actions,who==='parent'?'Voir ses révisions':'Prévoir une révision','revise');}
   box.append(actions);screen.prepend(box);
  }
 };
 const studentRender=render;
 render=function(){
  studentRender();
  const student=data.children[selected]?.track==='college'&&activeAudience()==='student';
  document.body.classList.toggle('secondary-student-simple',student);
  const parent=data.children[selected]?.track==='college'&&activeAudience()==='parent';
  document.body.classList.toggle('secondary-parent-simple',parent);
  if(!student&&!parent)return;
  if(parent&&page==='block'){const h=document.querySelector('.daily-entry h2');if(h)h.textContent=tr('Ses points à reprendre','Topics they need to revisit');}

  if(parent){
   if(page==='college'){
    document.querySelector('.college-priority')?.remove();
    const h=document.querySelector('.college-layout h2');if(h)h.textContent=tr('Ses prochaines étapes','Their next steps');
    const empty=document.querySelector('.college-layout .empty');if(empty)empty.textContent=tr('Votre enfant n’a pas encore ajouté de travail dans son espace. Faites le point avec son cahier.','Your child has not added work yet. Check their exercise book together.');
   }
   if(page==='revise'){
    document.querySelector('#secondary-result-form')?.remove();
    document.querySelectorAll('[data-result-remove]').forEach(b=>b.remove());
    const h=document.querySelector('.college-layout h2');if(h)h.textContent=tr('Son prochain entraînement','Their next practice');
    const empty=document.querySelector('.college-layout .empty');if(empty)empty.textContent=tr('Aucune révision prévue pour le moment. Choisissez ensemble un moment ; votre enfant la note dans son espace.','No revision planned yet. Agree on a time together; your child records it in their space.');
    const notebook=document.querySelector('.daily-entry');
    if(notebook){const p=notebook.querySelector('p');if(p)p.textContent=tr('Repérez avec votre enfant une difficulté qui revient. Consultez ses essais dans « Ses difficultés ».','Look together for a recurring difficulty and review their attempts.');
     const b=notebook.querySelector('button');if(b)b.textContent=tr('Voir ses points difficiles','View their difficulties');}
    const labels=[['Ce que j’ai compris :','Ce qu’il a compris :'],['L’erreur à reprendre :','L’erreur à reprendre :'],['Ma prochaine action :','Sa prochaine action :']];
    document.querySelectorAll('.secondary-result-item b').forEach(b=>{const pair=labels.find(x=>x[0]===b.textContent);if(pair)b.textContent=pair[1];});
   }
  }
  document.querySelector('#college-add')?.remove();
  const guide=document.querySelector('.secondary-role-guide');
  if(guide){const details=document.createElement('details');details.className='student-guide';const summary=document.createElement('summary');summary.textContent=parent?tr('Comment l’accompagner ?','How can I support them?'):tr('Comment avancer ?','How do I move forward?');guide.before(details);details.append(summary,guide);}
  const form=document.querySelector('#college-work');
  if(form)document.querySelectorAll('.college-priority [data-college-go="college"]').forEach(button=>button.onclick=()=>{form.scrollIntoView({behavior:'smooth',block:'start'});form.querySelector('input')?.focus({preventScroll:true});});
 };
 render();
})();
