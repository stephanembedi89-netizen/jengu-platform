// Audience is a demo view selector, never an authentication or permission boundary.
let collegeAudience='parent';
const audienceRender=render;
function activeAudience(){return role==='parent'&&data.children[selected]?.track==='college'?collegeAudience:role}
function audienceStart(a,course){return a==='teacher'||a==='tutor'?'staff':course==='college'?(a==='student'?'college':'parent-summary'):'home'}
function audienceNav(a){return a==='student'?[['college','Mon travail'],['block','Je bloque'],['revise','Mes révisions'],['parent-summary','Notre prochaine action']]:[['parent-summary','Mon suivi · 10 minutes'],['college','Son travail'],['block','Ses difficultés'],['revise','Ses révisions']]}
function nextActionView(){const checks=collegeItems('checks');return '<section class="card joint-action"><div class="eyebrow">LE LIEN AVEC LE PARENT</div><h2>'+uiText("Notre prochaine action")+'</h2>'+ (checks.length?checks.slice(0,3).map(x=>'<article class="college-item"><p><b>'+esc(x.next)+'</b></p><p>'+esc(x.with)+' · '+esc(x.date)+'</p><label>'+uiText("Mon retour")+'<select data-joint-state="'+esc(x.id)+'">'+['Pas encore commencé','J’ai commencé','J’ai besoin d’aide','Fait — à vérifier ensemble'].map(s=>'<option '+(s===x.studentState?'selected':'')+'>'+uiText(s)+'</option>').join('')+'</select></label></article>').join(''):'<p>'+uiText("Aucune action décidée ensemble. Faites le point avec le parent quand vous êtes disponibles.")+'</p>')+'</section>'}
render=function(){
 const courseBefore=data.children[selected]?.track||'primary';homeTrack=courseBefore;if(role==='parent'&&courseBefore==='college'&&page==='home')page=audienceStart(collegeAudience,'college');
 audienceRender();$('#mobile-account').onclick=account;const course=data.children[selected]?.track||'primary',a=activeAudience();document.body.dataset.audience=a;
 // The selector follows the course, so the same person knows which workspace is open.
 const roles=$('.switch');let student=$('#student-view');if(!student){student=document.createElement('button');student.id='student-view';student.textContent=tr('Élève','Student');roles.insertBefore(student,$('#teacher'))}student.hidden=course!=='college';
 for(const [id,value] of [['parent','parent'],['student-view','student'],['teacher','teacher'],['tutor','tutor']]){const b=$('#'+id);b.classList.toggle('selected',a===value);b.setAttribute('aria-pressed',String(a===value));b.onclick=()=>{if(value==='student'||value==='parent'){role='parent';collegeAudience=value}else role=value;page=audienceStart(value,course);render()}}
 let context=$('#audience-context');if(!context){context=document.createElement('section');context.id='audience-context';$('#screen').before(context)}
 const names={parent:'Parent',student:tr('Élève','Student'),teacher:tr('Enseignant','Teacher'),tutor:tr('Prof particulier','Private tutor')};
 context.innerHTML='<div><h2>'+names[a]+' · '+(course==='college'?tr('Secondaire','Secondary'):tr('Primaire','Primary'))+'</h2><p>'+esc(data.children[selected]?.name||'Choisir un élève')+' · '+esc(data.children[selected]?.level||'')+'</p></div><span class="audience-chip">'+(a==='parent'?tr('Mon suivi en 10 min','My 10-minute check-in'):a==='student'?tr('Mon travail du jour','My work today'):a==='teacher'?tr('Ma prochaine séance','My next lesson'):tr('Mon prochain accompagnement','My next tutoring session'))+'</span>';
 document.querySelectorAll('#nav button').forEach(b=>{if(b.classList.contains('active'))b.setAttribute('aria-current','page')});

 document.querySelectorAll('.trackbar,.track-overview').forEach(x=>x.remove());const courseBar=$('#course-bar');if(courseBar){const select=courseBar.querySelector('#course-profile');if(select)[...select.options].forEach(o=>{if(data.children[Number(o.value)]?.track!==course)o.remove()});const label=courseBar.querySelector('.profile-select');if(label)label.firstChild.textContent=a==='student'?tr('Profil élève de démonstration','Demo student profile'):tr('Enfant / élève suivi','Child / student');}
 renderNavigation(a,course);
 if(course!=='college'||role!=='parent')return;
 document.querySelectorAll('.college-tabs').forEach(x=>x.remove());
 if(a==='parent'){
 const headings={college:['Son travail, ses prochaines échéances.','Consultez ce que votre enfant a prévu. Il renseigne lui-même son avancement.'],block:['Les points où il demande de l’aide.','Regardez son essai avant de choisir ensemble qui peut l’aider.'],revise:['Ses révisions prévues.','Aidez à choisir un moment réaliste et encouragez la régularité.']};
 if(headings[page]){const h=$('.college-heading h1');if(h)h.textContent=uiText(headings[page][0]);const p=$('.college-heading .muted');if(p)p.textContent=uiText(headings[page][1])}
 for(const id of ['college-work','college-block','college-revision']){const form=$('#'+id);if(form)form.closest('.card').remove()}
 document.querySelectorAll('[data-work-state],[data-block-state],[data-revision-state]').forEach(s=>{const text=document.createElement('p');text.className='read-status';text.textContent=s.options[s.selectedIndex].textContent;s.parentElement.replaceWith(text)});
 document.querySelectorAll('[data-college-remove],#college-add,[data-block-research]').forEach(x=>x.remove());
 if($('#college-example'))$('#college-example').closest('.card').remove();
 document.querySelectorAll('.college-layout').forEach(x=>x.classList.add('parent-readonly'));
 if(page==='parent-summary'){const notes=collegeItems('checks').filter(x=>x.studentState);if(notes.length){const box=document.createElement('section');box.className='card daily-entry';box.innerHTML='<h2>'+uiText("Le retour de mon enfant")+'</h2>'+notes.slice(0,3).map(x=>'<p><b>'+esc(x.next)+'</b><br>'+esc(x.studentState)+'</p>').join('');$('#screen').append(box)}}
 }else{
 if(page==='parent-summary')$('#screen').innerHTML=nextActionView();else if(page==='college')$('#screen').append(Object.assign(document.createElement('div'),{innerHTML:nextActionView()}));
 document.querySelectorAll('[data-joint-state]').forEach(s=>s.onchange=()=>{const item=collegeItems('checks').find(x=>x.id===s.dataset.jointState);if(item){item.studentState=s.value;save();toast('Retour gardé pour le prochain point ensemble.')}});
 const link=$('.summary-link[data-college-go="parent-summary"]');if(link){link.textContent=tr('Notre prochaine action →','Our next step →')}
 }
};render();
