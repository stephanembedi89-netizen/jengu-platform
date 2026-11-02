/* One visible navigation layer, with the established learning modules preserved. */
(function(){
 const previous=render;
 const action=(route,fr,en,desc,eng)=>'<button class="workspace-action" data-work-route="'+route+'"><span><strong>'+tr(fr,en)+'</strong><small>'+tr(desc,eng)+'</small></span><b aria-hidden="true">↗</b></button>';
 function dashboard(c){
  const s=document.getElementById('screen');
  s.innerHTML='<section class="workspace-hero"><div><p class="entry-kicker">'+tr('À LA MAISON · ','AT HOME · ')+esc(c.level)+'</p><h1>'+tr('On avance avec ','Moving forward with ')+esc(c.name)+'.</h1><p>'+tr('Pas besoin de tout savoir. Ouvrez le cahier, choisissez une difficulté et faites un petit pas ensemble.','You do not need every answer. Open the exercise book, choose one difficulty and take a small step together.')+'</p><button data-work-route="homework">'+tr('Regarder les devoirs →','Look at homework →')+'</button></div><img src="assets/entry-family.webp" width="960" height="640" alt=""></section><div class="workspace-columns"><section class="workspace-today"><p class="entry-kicker">'+tr('LE QUOTIDIEN','EVERY DAY')+'</p><h2>'+tr('Par où commence-t-on ?','Where shall we start?')+'</h2>'+action('daily','Les matières du jour','Today’s subjects','Repérer ce qui va bien et ce qui bloque.','See what is going well and what is difficult.')+action('search','M’aider à expliquer','Help me explain','Un sujet précis, des mots simples, un essai.','A specific topic, simple words and a practice task.')+action('routine','Notre moment · 10 minutes','Our time · 10 minutes','Écouter, essayer ensemble, laisser expliquer.','Listen, try together, let them explain.')+'</section><section class="workspace-child"><img src="assets/entry-primary.webp" width="960" height="640" alt=""><div><p class="entry-kicker">'+tr('AU TOUR DE L’ENFANT','THE CHILD’S TURN')+'</p><h2>'+tr('Un petit défi, à son rythme.','A small challenge, at their pace.')+'</h2><p>'+tr('Une consigne à la fois. Vous restez à proximité.','One instruction at a time. Stay nearby.')+'</p><button data-child-launch>'+tr('Ouvrir le mode enfant →','Open child mode →')+'</button></div></section></div><section class="workspace-bottom"><h2>'+tr('Et pour la suite…','And for what comes next…')+'</h2><div>'+action('progress','Ses progrès','Learning progress','Observer les efforts dans la durée.','Follow efforts over time.')+action('support','Faire équipe','Work together','Passer le relais à l’accompagnateur.','Hand over to the learning coach.')+action('resources','Fiches sans connexion','Offline cards','Garder les activités de cette classe.','Keep this class’s activities.')+'</div></section>';
 }
 render=function(){
  const requested=page;
  if(page==='resources')page=role==='parent'?'search':'staff';
  if(page==='child-space')page='routine';
  previous();
  page=requested;
  const c=data.children[selected];if(!c)return;
  const course=currentCourse(),a=activeAudience();document.body.dataset.workspaceCourse=course;
  const caption=document.querySelector('.side-caption');
  if(caption)caption.textContent=tr('Le carnet qui relie la maison et l’école.','Connecting home and school.');
  const footer=document.querySelector('main > footer');
  if(footer)footer.innerHTML=tr('Klas 237 · Une création JenguAI <span>Conçu pour le quotidien des familles et des enseignants.</span>','Klas 237 · By JenguAI <span>For the everyday needs of families and teachers.</span>');
  if(!cloud)document.getElementById('save-status').textContent=tr('Démo : utilisez des profils fictifs. Les modifications ne sont pas sauvegardées après fermeture.','Demo: use fictional profiles. Changes are not saved after closing.');
  const s=document.getElementById('screen');
  if(role==='parent'&&course==='primary'&&page==='home')dashboard(c);
  if(page==='resources'){
   const kit=document.getElementById('download-primary-kit')?.closest('section');
   if(kit){s.replaceChildren(kit);kit.insertAdjacentHTML('afterbegin','<p class="entry-kicker">'+esc(c.level)+' · '+tr('MA BIBLIOTHÈQUE','MY LIBRARY')+'</p>');}
  }
  if(page==='child-space'){
   const invite=s.querySelector('.child-invite');if(invite){const keep=[];for(let node=invite;node;node=node.nextElementSibling)if(!node.querySelector('#download-primary-kit'))keep.push(node);s.replaceChildren(...keep);}
  }
  const groups=routeGroups(a,course);let rows=[...groups.main,...groups.extra];
  if(course==='college'){
   rows.push(['coordination','Notre plan d’aide','Our support plan']);
   if(['parent','student'].includes(a))rows.push(['secondary-path','Mon cap BEPC','My BEPC pathway']);
  }
  if(course==='primary')rows.push(...(role==='parent'?[['roadmap',c.subsystem==='en'?'Son chemin vers le FSLC':'Son chemin vers le CEP',c.subsystem==='en'?'Their path to the FSLC':'Their path to the CEP'],['child-space','Mode enfant','Child mode']]:[]),['resources','Fiches sans connexion','Offline cards']);
  if(a==='teacher')rows=rows.map(row=>row[0]==='classroom'?['classroom','Bilan de la classe','Class assessment']:row);
  const nav=document.getElementById('nav');nav.replaceChildren();
  const label=document.createElement('p');label.className='workspace-nav-title';label.textContent=tr(course==='primary'?'MON PRIMAIRE':'MON SECONDAIRE',course==='primary'?'MY PRIMARY SPACE':'MY SECONDARY SPACE');nav.append(label);
  const extras=document.createElement('details');extras.className='workspace-more';extras.open=rows.slice(groups.main.length).some(row=>row[0]===page);
  const summary=document.createElement('summary');summary.textContent=tr('Tous mes outils','All my tools');extras.append(summary);
  const sections=[
   {fr:'Apprendre et progresser',en:'Learning and progress',ids:['daily','progress','lesson-library','prepare','roadmap','child-space','resources','secondary-path']},
   {fr:'S’organiser',en:'Planning',ids:['week','sessions','monthly','budget']},
   {fr:'Faire équipe',en:'Working together',ids:['support','messages','coordination']}
  ];
  const add=(target,[id,fr,en])=>{const b=document.createElement('button');b.textContent=tr(fr,en);b.dataset.route=id;if(page===id){b.className='active';b.setAttribute('aria-current','page');}b.onclick=()=>openRoute(id);target.append(b);};
  rows.slice(0,groups.main.length).forEach(row=>add(nav,row));
  const remaining=rows.slice(groups.main.length).filter((row,i,all)=>all.findIndex(x=>x[0]===row[0])===i);
  for(const section of sections){const matching=remaining.filter(row=>section.ids.includes(row[0]));if(!matching.length)continue;const group=document.createElement('div');group.className='workspace-tool-group';if(section.ids.includes('messages'))group.dataset.teamTools='true';const h=document.createElement('p');h.textContent=tr(section.fr,section.en);group.append(h);matching.forEach(row=>add(group,row));extras.append(group);}
  remaining.filter(row=>!sections.some(section=>section.ids.includes(row[0]))).forEach(row=>add(extras,row));

  if(rows.length>groups.main.length)nav.append(extras);

  document.querySelectorAll('.family-perspective').forEach(el=>el.remove());
  let context=document.getElementById('workspace-identity');if(!context){context=document.createElement('div');context.id='workspace-identity';document.querySelector('main > header').after(context);}
  context.innerHTML='<span>'+tr(course==='primary'?'Primaire':'Secondaire',course==='primary'?'Primary':'Secondary')+' / '+tr(c.subsystem==='en'?'Anglophone':'Francophone',c.subsystem==='en'?'English-language':'French-language')+'</span><strong>'+tr({parent:'Parent',teacher:'Enseignant',tutor:'Accompagnateur',student:'Élève'}[a],{parent:'Parent',teacher:'Teacher',tutor:'Learning coach',student:'Student'}[a])+' · '+esc(c.name)+' · '+esc(c.level)+'</strong>';
  if(course==='college'&&role==='parent'){
   const switcher=document.createElement('section');switcher.className='family-perspective';switcher.setAttribute('aria-label',tr('Qui utilise cet écran ?','Who is using this screen?'));
   const copy=document.createElement('p');copy.textContent=a==='student'?tr('Espace élève : je travaille, j’essaie et je demande de l’aide.','Student view: I work, try and ask for help.'):tr('Espace parent : je regarde ses efforts et nous choisissons la suite.','Parent view: I follow their efforts and we choose the next step.');switcher.append(copy);
   const controls=document.createElement('div');controls.className='actions';
   for(const [view,fr,en] of [['student','L’élève travaille','Student works'],['parent','Le parent accompagne','Parent supports']]){const b=document.createElement('button');b.className='secondary';b.textContent=tr(fr,en);b.setAttribute('aria-pressed',String(a===view));b.onclick=()=>{collegeAudience=view;openRoute(audienceStart(view,'college'));};controls.append(b);}switcher.append(controls);context.after(switcher);
  }
  if(['staff','parent-summary','college'].includes(page)&&!s.querySelector('.workspace-role-banner')){
   s.querySelectorAll('.entry-workspace-art').forEach(x=>x.remove());const asset=role==='teacher'?'teacher':role==='tutor'?'coach':'secondary';
   s.insertAdjacentHTML('afterbegin','<div class="workspace-role-banner"><img src="assets/entry-'+asset+'.webp" width="960" height="540" alt=""><div><p class="entry-kicker">'+tr('VOTRE ESPACE','YOUR SPACE')+'</p><h2>'+tr(role==='teacher'?'Une classe, plusieurs façons de réussir.':role==='tutor'?'Le bon appui, au bon moment.':a==='student'?'Je prends mon travail en main.':'L’autonomie se construit ensemble.',role==='teacher'?'One class, many ways to succeed.':role==='tutor'?'The right help, at the right time.':a==='student'?'I take charge of my learning.':'Building independence together.')+'</h2></div></div>');
  }
  s.querySelectorAll('[data-work-route]').forEach(b=>b.onclick=()=>openRoute(b.dataset.workRoute));s.querySelectorAll('[data-child-launch]').forEach(b=>b.onclick=()=>window.openKlasChildPractice());
 };
 render();
})();
