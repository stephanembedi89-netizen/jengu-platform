/* Klas 237 · Visite guidée à la première ouverture de chaque espace.
   Un projecteur entoure l'élément à connaître, une bulle explique en une phrase, « Suivant » ou « Passer ».
   Les éléments absents de l'écran sont sautés. Échap ferme. Vue une fois par espace (mémorisée dans le compte). */
(function(){
  'use strict';
  const T=(fr,en)=>typeof tr==='function'?tr(fr,en):fr;
  const visible=el=>{if(!el)return false;const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>4&&r.height>4&&cs.visibility!=='hidden'&&cs.display!=='none';};
  const pick=sel=>{for(const s of String(sel).split('|')){const list=[...document.querySelectorAll(s)].filter(visible);if(list.length)return list[0];}return null;};
  const mobile=()=>matchMedia('(max-width: 900px)').matches;
  const MENU='.kx-tabbar|#nav';
  const NOAI=':not(.secondary):not([class*="ai"]):not([data-ai])';
  const ACTION=['#screen .tk-head-actions button','#screen .fk-hero button','#screen .actions button','#screen button'].map(x=>x+NOAI).join('|');

  function steps(role){
    const who={parent:T('parent','parent'),student:T('élève','student'),teacher:T('enseignant','teacher'),tutor:T('accompagnateur','learning coach')}[role]||'';
    const s=[
      {title:T('Bienvenue dans votre espace ','Welcome to your ')+who+T('',' space'),text:T('30 secondes pour vous repérer. Vous pourrez revoir cette visite à tout moment depuis « Besoin d’aide ? ».','30 seconds to find your way. You can replay this tour any time from “Need help?”.')},
      {target:MENU,title:mobile()?T('Vos onglets','Your tabs'):T('Votre menu','Your menu'),text:{
        parent:T('Les 5 choses utiles chaque soir : aujourd’hui, devoirs, progrès, messages. Le reste est dans « Tous mes outils ».','The 5 things that matter each evening: today, homework, progress, messages. The rest is in “All my tools”.'),
        student:T('Ta journée, tes devoirs, tes révisions et tes notes. Tout ce qu’il te faut, sans chercher.','Your day, homework, revision and marks. Everything you need, without searching.'),
        teacher:T('Aujourd’hui, Mes élèves, Évaluations et notes, Mon année, Préparer un cours : votre journée de classe dans l’ordre.','Today, My students, Assessments, My year, Plan a lesson: your school day, in order.'),
        tutor:T('Vos élèves suivis, vos séances et les bilans aux parents, au même endroit.','Your learners, sessions and reports to parents, in one place.')}[role]||''},
      {target:ACTION,title:T('Commencez ici','Start here'),text:{
        parent:T('Notez le devoir du cahier : Klas 237 vous propose ensuite un petit geste concret pour aider votre enfant ce soir.','Note the homework from the book: Klas 237 then suggests one small, concrete step to help your child tonight.'),
        student:T('Ta prochaine tâche : un seul bouton pour t’y mettre.','Your next task: one button to get started.'),
        teacher:T('Faire l’appel, préparer demain : les actions du jour sont toujours en haut à droite.','Take the register, plan tomorrow: today’s actions are always at the top right.'),
        tutor:T('La séance du jour et sa préparation : tout part d’ici.','Today’s session and its preparation start here.')}[role]||''},
      {target:'.ai-fab',title:T('L’assistant','The assistant'),text:{
        parent:T('Bloqué sur une leçon ? Écrivez, dites ou photographiez le cahier : l’assistant explique autrement, avec des exemples du quotidien.','Stuck on a lesson? Type, speak or photograph the exercise book: the assistant explains another way, with everyday examples.'),
        student:T('Demande un indice : l’assistant t’aide à trouver, sans te donner la réponse.','Ask for a hint: the assistant helps you find it, without giving the answer.'),
        teacher:T('Préparer un cours, créer une épreuve, corriger une copie en photo, rédiger les appréciations : l’assistant vous fait gagner vos soirées.','Plan a lesson, create a test, mark a paper from a photo, write report comments: the assistant gives you your evenings back.'),
        tutor:T('Préparer une séance, trouver une autre explication, rédiger le bilan aux parents.','Plan a session, find another explanation, write the report to parents.')}[role]||''},
      {target:'.klas-help-trigger',title:T('Besoin d’aide ?','Need help?'),text:T('Une question, un souci de paiement ? Écrivez-nous ici ou sur WhatsApp au +237 672 705 729.','A question, a payment issue? Write to us here or on WhatsApp at +237 672 705 729.')},
      {target:'#entry-back',title:role==='parent'?T('Vos enfants et vos espaces','Your children and spaces'):T('Vos espaces','Your spaces'),text:role==='parent'?T('Pour ajouter un enfant ou passer de l’un à l’autre.','To add a child or switch between them.'):role==='teacher'?T('Pour ajouter une classe, ou ouvrir un espace accompagnateur pour vos cours particuliers.','To add a class, or open a learning coach space for private lessons.'):T('Pour retrouver vos espaces.','To find your spaces.')}
    ];
    return s;
  }

  let layer=null,idx=0,list=[],tourRole='',onKey=null,lastFocus=null;
  function seen(r){try{if(typeof data!=='undefined'&&data.tourSeen&&data.tourSeen[r])return true;return localStorage.getItem('klas-tour-'+r)==='1';}catch(e){return false;}}
  function markSeen(r){try{localStorage.setItem('klas-tour-'+r,'1');}catch(e){}try{if(typeof data!=='undefined'){data.tourSeen=Object.assign({},data.tourSeen,{[r]:true});if(typeof save==='function')save();}}catch(e){}}
  function close(){if(!layer)return;layer.remove();layer=null;document.removeEventListener('keydown',onKey,true);window.removeEventListener('resize',place);markSeen(tourRole);try{lastFocus&&lastFocus.focus();}catch(e){}}
  function place(){
    if(!layer)return;const st=list[idx];const el=st.target?pick(st.target):null;
    const spot=layer.querySelector('.kt-spot'),tip=layer.querySelector('.kt-tip');
    if(el){
      el.scrollIntoView({block:'nearest',inline:'nearest'});
      const r=el.getBoundingClientRect(),pad=8;
      Object.assign(spot.style,{display:'block',left:(r.left-pad)+'px',top:(r.top-pad)+'px',width:(r.width+pad*2)+'px',height:(r.height+pad*2)+'px'});
      layer.classList.remove('kt-center');
      const tw=Math.min(340,innerWidth-24),th=tip.offsetHeight||160;
      let left=Math.min(Math.max(12,r.left),innerWidth-tw-12),top=r.bottom+14;
      if(top+th>innerHeight-12)top=Math.max(12,r.top-th-14);
      if(r.height>innerHeight*.6){top=Math.min(innerHeight-th-12,Math.max(12,r.top+24));left=r.right+14+tw<innerWidth?r.right+14:Math.max(12,innerWidth-tw-12);}
      Object.assign(tip.style,{left:left+'px',top:top+'px',width:tw+'px'});
    }else{spot.style.display='none';layer.classList.add('kt-center');Object.assign(tip.style,{left:'',top:'',width:''});}
  }
  function show(){
    // Sauter les étapes dont l'élément n'est pas à l'écran
    while(idx<list.length&&list[idx].target&&!pick(list[idx].target))idx++;
    if(idx>=list.length){close();return;}
    const st=list[idx],n=list.filter((s,i)=>i<=idx).length;
    const tip=layer.querySelector('.kt-tip');
    const last=!list.slice(idx+1).some(s=>!s.target||pick(s.target));
    tip.innerHTML='<p class="kt-count">'+n+' / '+list.filter(s=>!s.target||pick(s.target)).length+'</p><h2 id="kt-title">'+st.title+'</h2><p>'+st.text+'</p><div class="kt-actions"><button type="button" class="kt-skip">'+(last?T('Fermer','Close'):T('Passer la visite','Skip the tour'))+'</button>'+(last?'':'<button type="button" class="kt-next">'+T('Suivant','Next')+'</button>')+(last?'<button type="button" class="kt-next kt-done">'+T('C’est parti','Let’s go')+'</button>':'')+'</div>';
    tip.querySelector('.kt-skip').onclick=close;
    const next=tip.querySelector('.kt-next');next.onclick=()=>{if(next.classList.contains('kt-done')){close();return;}idx++;show();};
    place();next.focus();
  }
  function start(r,force){
    if(layer)return;tourRole=r||'parent';
    if(!force&&seen(tourRole))return;
    list=steps(tourRole);idx=0;lastFocus=document.activeElement;
    layer=document.createElement('div');layer.className='kt-layer';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','kt-title');
    layer.innerHTML='<div class="kt-spot" aria-hidden="true"></div><div class="kt-tip"></div>';
    layer.addEventListener('click',e=>{if(e.target===layer)close();});
    document.body.append(layer);
    onKey=e=>{if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='Tab'){const f=[...layer.querySelectorAll('button')];if(!f.length)return;const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();}}};
    document.addEventListener('keydown',onKey,true);window.addEventListener('resize',place);
    show();
  }
  /* Lancement automatique à la première ouverture d'un espace */
  let timer=null;
  function maybeStart(){
    if(layer)return;
    clearTimeout(timer);timer=setTimeout(()=>{
      if(layer||document.body.dataset.entry!=='workspace'||document.querySelector('dialog[open]'))return;
      const r=typeof activeAudience==='function'?activeAudience():'';
      if(r&&!seen(r))start(r);
    },900);
  }
  if(typeof render==='function'){const prev=render;render=function(){prev.apply(this,arguments);maybeStart();};}
  window.klasTour={start:(r)=>start(r||(typeof activeAudience==='function'?activeAudience():undefined),true)};
})();
