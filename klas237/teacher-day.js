/* Primary classroom planning. Uses the existing teacher class profile and save path. */
function teacherDayItems(records,profile,date){return profile?.id?records.filter(x=>x.profileId===profile.id&&x.level===profile.level&&x.subsystem===profile.subsystem&&x.date===date).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')):[];}
function teacherDayCounts(total,alone,help,notYet){return [total,alone,help,notYet].every(Number.isInteger)&&total>=1&&alone>=0&&help>=0&&notYet>=0&&alone+help+notYet<=total;}
(function(){
 let date=localDay(),editing=null;
 const previous=render;
 const t=(fr,en)=>tr(fr,en);
 const items=()=>data.teacherDay||=[];
 const context=()=>data.children[selected];
 const field=(name,label,value='',type='text',extra='')=>'<label>'+label+'<input name="'+name+'" type="'+type+'" value="'+esc(value)+'" '+extra+'></label>';
 function persist(){save();}
 function form(c){
  const d=items().find(x=>x.id===editing&&x.profileId===c.id)||{};
  const lessons=staffLessons().filter(x=>x.level===c.level&&(!x.group||x.group===c.name));
  return '<details class="card daily-entry" '+(editing?'open':'')+'><summary>'+t(editing?'Modifier la séance':'Ajouter une matière à la journée',editing?'Edit lesson':'Add a subject to the day')+'</summary><form id="td-form"><div class="formgrid">'+
   field('time',t('Heure (facultatif)','Time (optional)'),d.time,'time')+
   '<label>'+t('Matière','Subject')+'<select name="subject">'+[...new Set([...primarySubjects(c),d.subject].filter(Boolean))].map(s=>'<option '+(s===d.subject?'selected':'')+'>'+esc(s)+'</option>').join('')+'</select></label>'+
   field('topic',t('Leçon du jour','Today’s topic'),d.topic,'text','required maxlength="180"')+
   field('goal',t('Ce que la classe doit savoir faire','What the class should be able to do'),d.goal,'text','required maxlength="300"')+
   '<label class="full">'+t('Relier une préparation existante (facultatif)','Link an existing lesson plan (optional)')+'<select name="lessonId"><option value="">'+t('Aucune préparation liée','No linked plan')+'</option>'+lessons.map(l=>'<option value="'+esc(l.id)+'" '+(l.id===d.lessonId?'selected':'')+'>'+esc(l.subject+' · '+l.topic)+'</option>').join('')+'</select></label>'+
   '<label class="full">'+t('Devoir à domicile (facultatif)','Homework (optional)')+'<textarea name="homework" maxlength="1000">'+esc(d.homework||'')+'</textarea></label>'+
   field('due',t('À rendre le','Due date'),d.due,'date','min="'+date+'"')+
   field('checkDate',t('Prochain contrôle (si prévu)','Next assessment (if planned)'),d.checkDate,'date','min="'+date+'"')+
   '</div><p class="muted">'+t('Le contrôle peut être le vendredi ou un autre jour, selon votre organisation.','The assessment can be on Friday or another day, following your schedule.')+'</p><div class="actions"><button>'+t('Garder cette séance','Keep this lesson')+'</button>'+(editing?'<button type="button" id="td-cancel" class="secondary">'+t('Annuler la modification','Cancel edit')+'</button>':'')+'</div></form></details>';
 }
 function card(x){
  const done=x.reviewed,unobserved=done?x.total-x.alone-x.help-(x.notYet||0):0;
  return '<article class="card daily-entry"><div class="eyebrow">'+esc([x.time,x.subject].filter(Boolean).join(' · '))+'</div><h2>'+esc(x.topic)+'</h2><p>'+esc(x.goal)+'</p><p class="tag">'+(done?t('Bilan renseigné','Reviewed'):t('À travailler','Planned'))+'</p>'+
   (x.homework?'<p><strong>'+t('Devoir : ','Homework: ')+'</strong>'+esc(x.homework)+(x.due?' · '+esc(x.due):'')+'</p>':'')+
   (x.checkDate?'<p>'+t('Contrôle prévu : ','Assessment planned: ')+esc(x.checkDate)+'</p>':'')+
   (done?'<p>'+x.alone+' '+t('réussites sans aide','independent successes')+' · '+x.help+' '+t('avec aide','with help')+' · '+(x.notYet||0)+' '+t('à reprendre','need another try')+' · '+unobserved+' '+t('non vérifiés','not checked')+'</p>':'')+
   (x.difficulty?'<p><strong>'+t('À reprendre : ','Revisit: ')+'</strong>'+esc(x.difficulty)+'</p>':'')+
   (x.next?'<p><strong>'+t('Prochaine action : ','Next action: ')+'</strong>'+esc(x.next)+'</p>':'')+
   '<div class="actions"><button class="secondary" data-td-edit="'+x.id+'">'+t('Modifier','Edit')+'</button><button class="secondary" data-td-course="'+x.id+'">'+t(x.lessonId?'Ouvrir le cours':'Préparer ce cours',x.lessonId?'Open lesson plan':'Prepare this lesson')+'</button>'+(x.homework?'<button class="secondary" data-td-family="'+x.id+'">'+t('Texte pour les familles','Text for families')+'</button>':'')+'</div>'+
   '<details><summary>'+t('Faire le bilan de la classe','Review the class')+'</summary><form data-td-review="'+x.id+'"><p>'+t('Une courte vérification suffit. Comptez seulement les réponses observées ; les autres restent « non vérifiés ».','Use a short check. Count only observed responses; the others remain “not checked”.')+'</p><div class="formgrid">'+
   field('total',t('Élèves présents','Pupils present'),x.total??'','number','required min="1" max="500" step="1"')+
   field('alone',t('Ont réussi sans aide','Succeeded independently'),x.alone??'','number','required min="0" max="500" step="1"')+
   field('help',t('Ont réussi avec aide','Succeeded with help'),x.help??'','number','required min="0" max="500" step="1"')+
   field('notYet',t('N’ont pas encore réussi','Not yet successful'),x.notYet??'','number','required min="0" max="500" step="1"')+
   field('difficulty',t('Erreur fréquente ou point difficile','Common error or difficulty'),x.difficulty,'text','maxlength="500"')+
   field('next',t('Ce que je ferai à la prochaine séance','What I will do next lesson'),x.next,'text','maxlength="500"')+
   '</div><p role="status" class="muted"></p><button>'+t('Garder le bilan','Keep review')+'</button></form></details></article>';
 }
 render=function(){previous();const c=context();if(role!=='teacher'||c?.track!=='primary'||page!=='staff')return;
  if(!c.id)c.id=klasId();
  const today=teacherDayItems(items(),c,date),pending=items().filter(x=>x.profileId===c.id&&x.level===c.level&&x.subsystem===c.subsystem&&x.date<date&&x.difficulty).slice(-5);
  $('#screen').innerHTML='<h1>'+t('Ma journée de classe','My teaching day')+'</h1><p>'+t('Une classe, plusieurs matières. Préparez la journée puis notez ce qui mérite une reprise.','One class, several subjects. Plan the day, then note what needs another explanation.')+'</p><section class="card"><div class="eyebrow">'+esc(c.name+' · '+c.level)+' · '+(c.subsystem==='en'?'English subsystem':'Primaire francophone')+'</div><label>'+t('Journée','Date')+'<input id="td-date" type="date" value="'+date+'" required></label><p>'+today.length+' '+t('séance(s) prévues','planned lesson(s)')+' · '+today.filter(x=>x.reviewed).length+' '+t('bilan(s) renseignés','review(s) recorded')+'</p><p class="muted">'+t('Le suivi concerne toute cette classe. Pour changer de classe, revenez à vos espaces.','This page follows this whole class. To switch class, return to your spaces.')+'</p>'+(!cloud?'<p class="note">'+t('Mode démonstration : ces informations restent dans la session ouverte. Aucun envoi aux familles.','Demo mode: this information stays in the open session. Nothing is sent to families.')+'</p>':'')+'</section>'+form(c)+
   (pending.length?'<details class="card"><summary>'+t('Points signalés les jours précédents','Previously noted difficulties')+'</summary>'+pending.map(x=>'<p><strong>'+esc(x.date+' · '+x.subject)+'</strong><br>'+esc(x.difficulty)+(x.next?'<br>'+esc(x.next):'')+'</p>').join('')+'</details>':'')+
   (today.length?today.map(card).join(''):'<section class="card empty">'+t('Aucune séance prévue pour ce jour. Ajoutez la première matière ci-dessus.','No lessons planned for this day. Add the first subject above.')+'</section>')+
   '<div class="actions"><button class="secondary" id="td-library">'+t('Mes cours et bilans','My lesson plans and reviews')+'</button><button class="secondary" id="td-progress">'+t('Progression de classe','Class progress')+'</button></div>';
  $('#td-date').onchange=e=>{if(e.target.value&&e.target.reportValidity()){date=e.target.value;editing=null;render()}};
  const f=$('#td-form');f.elements.lessonId.onchange=()=>{const l=staffLessons().find(x=>x.id===f.elements.lessonId.value);if(l){if(![...f.elements.subject.options].some(o=>o.value===l.subject))f.elements.subject.add(new Option(l.subject,l.subject));f.elements.subject.value=l.subject;f.elements.topic.value=l.topic;f.elements.goal.value=l.goal;}};
  f.onsubmit=e=>{e.preventDefault();const values=Object.fromEntries(new FormData(f));if(!values.topic.trim()||!values.goal.trim())return;if(values.homework&&!values.due){f.elements.due.setCustomValidity(t('Indiquez quand rendre le devoir.','Enter a homework due date.'));f.elements.due.reportValidity();return;}const old=items().find(x=>x.id===editing&&x.profileId===c.id);const row={...values,profileId:c.id,level:c.level,subsystem:c.subsystem,date};if(old)Object.assign(old,row);else items().push({...row,id:klasId()});editing=null;persist();render();};
  f.elements.due.oninput=()=>f.elements.due.setCustomValidity('');f.elements.homework.oninput=()=>f.elements.due.setCustomValidity('');
  if($('#td-cancel'))$('#td-cancel').onclick=()=>{editing=null;render()};
  $('#td-library').onclick=()=>openRoute('lesson-library');$('#td-progress').onclick=()=>openRoute('classroom');
  document.querySelectorAll('[data-td-edit]').forEach(b=>b.onclick=()=>{editing=b.dataset.tdEdit;render();$('#td-form').scrollIntoView({block:'start'})});
  document.querySelectorAll('[data-td-course]').forEach(b=>b.onclick=()=>{const x=today.find(v=>v.id===b.dataset.tdCourse),l=staffLessons().find(v=>v.id===x.lessonId);if(l){modal(lessonSheet(l));return;}lessonDraft={level:c.level,group:c.name,subject:x.subject,topic:x.topic,goal:x.goal,duration:'30'};page='build-course';render();});
  document.querySelectorAll('[data-td-family]').forEach(b=>b.onclick=()=>{const x=today.find(v=>v.id===b.dataset.tdFamily),en=c.subsystem==='en';const text=(en?'Homework — ':'Devoir — ')+c.level+' · '+x.subject+'\n'+x.homework+'\n'+(en?'Due: ':'À rendre : ')+x.due+'\n'+(en?'Ask your child to explain the instruction. Help with one difficult point, then let them try. Tell us where they still need help.':'Demandez à votre enfant d’expliquer la consigne. Aidez-le sur un point difficile, puis laissez-le essayer. Signalez-nous ce qui bloque encore.');modal('<h2>'+t('Message à relire et copier','Review and copy this message')+'</h2><textarea rows="9" readonly>'+esc(text)+'</textarea><p>'+t('Aucun message envoyé automatiquement. Les 10 minutes servent à débloquer un point, pas forcément à terminer tout le devoir.','No message is sent automatically. The ten minutes help with one difficulty; they may not cover all the homework.')+'</p>');});
  document.querySelectorAll('[data-td-review]').forEach(f=>f.onsubmit=e=>{e.preventDefault();const row=Object.fromEntries(new FormData(f));for(const k of ['total','alone','help','notYet'])row[k]=Number(row[k]);if(!teacherDayCounts(row.total,row.alone,row.help,row.notYet)){f.querySelector('[role=status]').textContent=t('Le total des trois groupes ne peut pas dépasser les présents.','The three groups cannot exceed pupils present.');return;}Object.assign(today.find(x=>x.id===f.dataset.tdReview),row,{reviewed:true});persist();render();});
 };
 render();
})();
