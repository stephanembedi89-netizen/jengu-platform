// Subject headings from MINEDUB primary curricula (2018), available through eBASE.
const subjectRender=render;
const curriculumSource='https://ebaselearning.org/resources/curriculum-policy-documents';
function primarySubjects(child){
 if(!child||child.track!=='primary')return [];
 if(child.subsystem==='en')return [['Class 1','Class 2'].includes(child.level)?'English Language':'English Language and Literature','Mathematics','Science and Technology','Français','Social Studies','Vocational Studies','Arts','Physical Education and Sports','National Languages and Cultures','Information and Communication Technologies'];
 return ['Français','Anglais','Langues et cultures nationales','Mathématiques','Sciences et technologie','TIC / Informatique','Sciences humaines et sociales','Éducation artistique','Éducation physique et sportive','Développement personnel'];
}
function subjectHints(child,i){
 if(child.subsystem==='en')return 'Précisez la leçon travaillée dans le cahier.';
 return ['Lecture, expression orale, écriture, étude de la langue','Écouter, parler, lire, écrire','Langue et culture étudiées à l’école','Nombres et calculs, mesures, géométrie','Le vivant, la matière, les techniques, l’environnement','Outils informatiques, usages et sécurité',(['SIL','CP'].includes(child.level)?'Morale, citoyenneté, droits et devoirs':'Morale, citoyenneté, histoire, géographie'),'Dessin, musique, théâtre, danse','Activités physiques et sportives','Activités manuelles, domestiques et agropastorales'][i];
}
const localDay=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let subjectDay=localDay();
function dailyRecord(){return data.daily.find(x=>x.childIndex===selected&&x.date===subjectDay&&x.level===data.children[selected]?.level)}
function dailyView(){
 const child=data.children[selected],subjects=primarySubjects(child),record=dailyRecord();
 const states=[['Pas renseigné','Not entered'],['J’ai compris','I understood'],['Avec de l’aide','With help'],['J’ai besoin d’aide','I need help']];
 return `<h1>${tr('Ses matières du jour','Today’s subjects')}</h1><p>${tr('Choisissez les matières travaillées aujourd’hui, puis un point à reprendre.','Choose the subjects covered today, then one point to work on.')}</p><section class="card"><div class="formgrid"><label>${tr('Enfant','Child')}<select id="dailychild">${primaryContextProfiles().map(({c,i})=>true?`<option value="${i}" ${i===selected?'selected':''}>${esc(c.name)} · ${esc(c.level)}</option>`:'').join('')}</select></label><label>${tr('Journée','Date')}<input id="dailydate" type="date" value="${subjectDay}" max="${localDay()}"></label></div><p class="note">${tr('Lisez les choix avec votre enfant. Il dit ce qu’il a compris : ce n’est pas une note.','Read the choices with your child. They tell you what they understood: this is not a mark.')}</p></section><form id="dailyform"><div class="subject-grid">${subjects.map((s,i)=>{const old=record?.items.find(x=>x.subject===s);return `<section class="card subject-card"><h2>${esc(s)}</h2><p class="muted">${uiLanguage==='en'?'Use the lesson in the exercise book.':esc(subjectHints(child,i))}</p><label>${tr('Comment ça s’est passé ?','How did it go?')}<select name="state${i}" data-feeling="${i}">${states.map(([fr,en])=>`<option value="${fr}" ${old?.state===fr?'selected':''}>${tr(fr,en)}</option>`).join('')}</select></label><div id="details${i}" ${!old?'hidden':''}><label>${tr('La leçon ou l’exercice','Lesson or exercise')}<input name="lesson${i}" maxlength="160" placeholder="${tr('Le titre dans le cahier','Title in the exercise book')}" value="${esc(old?.lesson||'')}"></label><label>${tr('Où est la difficulté ? (facultatif)','What is difficult? (optional)')}<input name="difficulty${i}" maxlength="250" value="${esc(old?.difficulty||'')}"></label><label class="priority-choice"><input type="radio" name="priority" value="${i}" ${old?.priority?'checked':''}>${tr('Notre point pour les 10 minutes','Our focus for the 10 minutes')}</label></div></section>`}).join('')}</div><section class="card"><p>${tr('2 min pour écouter · 5 min sur un point · 3 min pour expliquer.','2 min to listen · 5 min on one point · 3 min to explain.')}</p><button>${tr('Garder le point du jour','Save today’s check-in')}</button><span id="dailysaved" role="status"></span></section></form><details class="card daily-entry"><summary>${tr('Les repères du programme','Curriculum references')}</summary><p>${tr('Curricula MINEDUB 2018 : les matières sont des repères. Suivez les leçons du cahier et la progression de l’enseignant.','MINEDUB 2018 curricula: subjects are reference headings. Follow the exercise book and the teacher’s lesson sequence.')}</p><a href="${curriculumSource}" target="_blank" rel="noopener">${tr('Consulter les références','View references')}</a></details>`;
}
render=function(){
 data.daily ||= [];subjectRender();
 if(page==='daily'){
 $('#screen').innerHTML=dailyView();
 installDailyExtras();
 $('#dailychild').onchange=e=>{selected=Number(e.target.value);render()};
 $('#dailydate').onchange=e=>{if(e.target.value&&e.target.reportValidity()){subjectDay=e.target.value;render()}};
 document.querySelectorAll('[data-feeling]').forEach(el=>el.onchange=()=>{const detail=$('#details'+el.dataset.feeling);detail.hidden=el.value==='Pas renseigné';if(detail.hidden)detail.querySelector('[type=radio]').checked=false});
 if($('#dailyform'))$('#dailyform').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),child=data.children[selected],items=primarySubjects(child).flatMap((s,i)=>f.get('state'+i)==='Pas renseigné'?[]:[{subject:s,state:f.get('state'+i),lesson:f.get('lesson'+i),difficulty:f.get('difficulty'+i),priority:f.get('priority')===String(i)}]).concat(readDailyExtras(e.target));data.daily=data.daily.filter(x=>!(x.childIndex===selected&&x.date===subjectDay&&x.level===child.level));if(items.length)data.daily.unshift({childIndex:selected,child:child.name,level:child.level,date:subjectDay,items});save();$('#dailysaved').textContent=tr('Point gardé pour cette journée','Today’s check-in recorded');toast(tr('Point du jour gardé.','Today’s check-in recorded.'));};
 }
 if(page==='routine'||page==='home'||page==='progress'){
 const child=data.children[selected];if(primarySubjects(child).length){const box=document.createElement('section');box.className='card daily-entry';const record=data.daily.find(x=>x.childIndex===selected&&x.date===localDay()&&x.level===child.level),priority=record?.items.find(x=>x.priority);box.innerHTML='<div class="eyebrow">'+esc(child.name+' · '+child.level)+'</div><h2>'+ (priority?tr('Notre point à reprendre','Our next focus'):tr('Quelles matières aujourd’hui ?','Which subjects today?'))+'</h2><p>'+ (priority?esc(priority.subject+' — '+(priority.lesson||priority.difficulty||priority.state)):tr('Lecture, calcul, sciences… L’enfant peut dire où ça bloque dans chaque matière.','Reading, maths, science… Your child can point out what was difficult in each subject.'))+'</p><button class="secondary" id="opendaily">'+(record?tr('Revoir les matières du jour','Review today’s subjects'):tr('Faire le point par matière','Check each subject'))+' →</button>';$('#screen').append(box);$('#opendaily').onclick=()=>{subjectDay=localDay();page='daily';render()};}
 if($('#who'))$('#who').onchange=e=>{selected=Number(e.target.value);render()};
 }
 // Preserve free text while suggesting curriculum headings in adult observations.
 if($('#subject')&&$('#progressclass')){
 const list=document.createElement('datalist');list.id='curriculumsubjects';$('#subject').setAttribute('list',list.id);$('#subject').after(list);
 const update=()=>{const level=$('#progressclass').value;const subjects=COLLEGE_LEVELS.includes(level)?collegeSubjects(level):primarySubjects({track:'primary',subsystem:level.startsWith('Class ')?'en':'fr',level});list.innerHTML=subjects.map(s=>'<option value="'+esc(s)+'"></option>').join('')};$('#progressclass').addEventListener('change',update);update();
 }
};render();

function readDailyExtras(form){return [...form.querySelectorAll('[data-extra-subject]')].flatMap(row=>{const subject=row.querySelector('[data-extra-name]').value.trim(),state=row.querySelector('select').value;return !subject||state==='Pas renseigné'?[]:[{subject,state,lesson:row.querySelector('[data-extra-lesson]').value,difficulty:row.querySelector('[data-extra-difficulty]').value,priority:row.querySelector('[type=radio]').checked,custom:true}];});}
function installDailyExtras(){
 const form=document.querySelector('#dailyform');if(!form)return;
 const section=document.createElement('section');section.className='card daily-extras';
 section.innerHTML='<h2>'+tr('Autres matières','Other subjects')+'</h2><p>'+tr('Une matière ou un intitulé du cahier manque dans la liste ? Ajoutez-le ici.','A subject or exercise-book heading is missing? Add it here.')+'</p><div id="daily-extra-list"></div><button type="button" class="secondary" id="daily-extra-add">'+tr('Ajouter une autre matière','Add another subject')+'</button>';
 form.querySelector('.subject-grid').after(section);
 let count=0;
 const add=(old={})=>{const row=document.createElement('div');row.className='explain-step';row.dataset.extraSubject='';const key='extra-'+count++;
 row.innerHTML='<label>'+tr('Nom dans le cahier','Name in the exercise book')+'<input data-extra-name required maxlength="100" value="'+esc(old.subject||'')+'"></label><label>'+tr('Comment ça s’est passé ?','How did it go?')+'<select>'+[['Pas renseigné','Not entered'],['J’ai compris','I understood'],['Avec de l’aide','With help'],['J’ai besoin d’aide','I need help']].map(([fr,en])=>'<option value="'+fr+'" '+(old.state===fr?'selected':'')+'>'+tr(fr,en)+'</option>').join('')+'</select></label><label>'+tr('La leçon ou l’exercice','Lesson or exercise')+'<input data-extra-lesson maxlength="160" value="'+esc(old.lesson||'')+'"></label><label>'+tr('Ce qui bloque (facultatif)','Difficulty (optional)')+'<input data-extra-difficulty maxlength="250" value="'+esc(old.difficulty||'')+'"></label><label><input type="radio" name="priority" value="'+key+'" '+(old.priority?'checked':'')+'>'+tr('Notre point pour les 10 minutes','Our focus for the 10 minutes')+'</label><button type="button" class="secondary">'+tr('Retirer cette matière','Remove this subject')+'</button>';
 row.querySelector('button').onclick=()=>row.remove();section.querySelector('#daily-extra-list').append(row);return row;};
 for(const item of dailyRecord()?.items||[])if(item.custom||!primarySubjects(data.children[selected]).includes(item.subject))add(item);
 section.querySelector('#daily-extra-add').onclick=()=>add().querySelector('input').focus();
}
