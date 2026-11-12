/* Klas 237 · « Tout ce que vous pouvez faire ici ».
   Sur l'écran d'accueil de chaque espace, une carte repliable présente les outils du profil
   (y compris ceux rangés dans « Tous mes outils ») et y mène en un geste.
   Elle rappelle aussi, pendant l'essai gratuit, le nombre de jours restants.
   Rien n'est inventé : chaque raccourci n'apparaît que si l'écran existe dans le menu du profil. */
(function(){
  'use strict';
  const fr=()=>(document.documentElement.lang||'fr').slice(0,2)!=='en';
  const L=(a,b)=>fr()?a:b;
  const HOME=['fk-home','staff'];
  const ITEMS={
    parent:[
      ['@ai','Une leçon bloque ?','L’assistant l’explique autrement, avec des exemples du quotidien.','Stuck on a lesson?','The assistant explains it another way, with everyday examples.'],
      ['fk-teacher','Écrire à l’enseignant','Un message clair, prêt à envoyer, sans chercher ses mots.','Write to the teacher','A clear message, ready to send.'],
      ['child-space','Mode enfant','Il s’entraîne seul, par petits défis, à côté de vous.','Child mode','Short challenges your child can do next to you.'],
      ['roadmap','Son cap examen','Les étapes jusqu’à l’examen, semaine après semaine.','Exam roadmap','The steps to the exam, week by week.'],
      ['daily','Vu en classe aujourd’hui','Notez la leçon du jour : la révision du soir part de là.','Seen in class today','Note today’s lesson: the evening review starts there.'],
      ['budget','Dépenses scolaires','Fournitures, frais, cours de soutien : tout au même endroit.','School expenses','Supplies, fees, tutoring: all in one place.']
    ],
    student:[
      ['@ai','Un indice, pas la réponse','L’assistant t’aide à trouver par toi-même.','A hint, not the answer','The assistant helps you find it yourself.'],
      ['fk-focus','Réviser avec un minuteur','Des séances courtes, une seule chose à la fois.','Revise with a timer','Short sessions, one thing at a time.'],
      ['block','Je bloque','Dis où ça coince : on reprend par un exemple plus simple.','I’m stuck','Say where it’s hard: we restart with a simpler example.'],
      ['secondary-path','Mon cap examen','Ce qu’il te reste à voir avant l’examen.','My exam roadmap','What is left before the exam.'],
      ['fk-progress','Mes notes et objectifs','Tes moyennes, et le prochain objectif à atteindre.','My marks and goals','Your averages and your next goal.']
    ],
    teacher:[
      ['@ai','L’assistant de l’enseignant','Préparer un cours, créer une épreuve, rédiger les appréciations.','The teacher’s assistant','Plan a lesson, create a test, write report comments.'],
      ['tk-students','Ma liste de classe','Importez-la depuis Excel, puis faites l’appel en 30 secondes.','My class list','Import it from Excel, then take the register in 30 seconds.'],
      ['tk-evals','Évaluations et notes','Saisie rapide, moyennes calculées, résultats par élève.','Tests and marks','Fast entry, averages calculated, results per student.'],
      ['tk-year','Mon année','Votre progression, et où vous devriez en être à cette date.','My year','Your progress, and where you should be by now.'],
      ['tk-families','Relais familles','Un message aux parents, prêt à copier sur WhatsApp.','Family relay','A message to parents, ready to copy to WhatsApp.'],
      ['classroom','Analyse par compétence','Repérez ce qui est acquis et ce qu’il faut reprendre.','Skills analysis','See what is mastered and what to revisit.']
    ],
    tutor:[
      ['@ai','L’assistant de séance','Préparer une séance, trouver une autre explication.','The session assistant','Plan a session, find another explanation.'],
      ['fk-report','Bilan aux parents','Un compte rendu clair après chaque séance.','Report to parents','A clear summary after each session.'],
      ['fk-payments','Paiements','Qui a payé, qui relancer, avec le message de rappel prêt.','Payments','Who has paid, who to remind, with the reminder ready.'],
      ['sessions','Planning des séances','Vos rendez-vous de la semaine, élève par élève.','Session planning','Your week’s appointments, learner by learner.'],
      ['build-course','Préparer une séance','Un déroulé pas à pas, adapté au niveau de l’élève.','Plan a session','A step-by-step plan at the learner’s level.']
    ]
  };
  const ARROW='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const who=()=>{try{return typeof activeAudience==='function'?activeAudience():(typeof role!=='undefined'?role:'parent');}catch(e){return 'parent';}};
  const cur=()=>{try{return typeof page!=='undefined'?page:'';}catch(e){return '';}};
  const key=w=>'klas-plus-open-'+w;
  const isOpen=w=>{try{return localStorage.getItem(key(w))!=='0';}catch(e){return true;}};
  const hasRoute=r=>!!document.querySelector('#nav [data-route="'+r+'"]');
  const hasAI=()=>!!document.querySelector('.ai-fab');

  /* Jours d'essai restants : seulement pour un compte connecté sans offre payée */
  function trialDays(){
    try{
      if(typeof cloud==='undefined'||!cloud)return null;
      const a=window.klasAccess;if(!a||!a.expiresAt||a.plan)return null;
      const ms=new Date(a.expiresAt).getTime()-Date.now();if(!(ms>0))return null;
      const d=Math.ceil(ms/86400000);return d>14?null:d;
    }catch(e){return null;}
  }
  function goOffers(){
    const back=document.getElementById('entry-back');if(back)back.click();
    setTimeout(()=>{const b=document.querySelector('[data-entry-go="pricing"]');if(b)b.click();},60);
  }
  function build(w){
    const list=(ITEMS[w]||[]).filter(i=>i[0]==='@ai'?hasAI():hasRoute(i[0]));
    if(list.length<2)return null;
    const d=document.createElement('details');d.className='kp-card';d.dataset.kp=w;d.dataset.lang=fr()?'fr':'en';d.open=isOpen(w);
    const days=trialDays();
    d.innerHTML='<summary><span class="kp-title">'+L('Tout ce que vous pouvez faire ici','Everything you can do here')+'</span><span class="kp-count">'+list.length+' '+L('outils','tools')+'</span></summary>'+
      (days?'<p class="kp-trial"><span>'+(days===1?L('Essai gratuit : dernier jour.','Free trial: last day.'):L('Essai gratuit : encore '+days+' jours.','Free trial: '+days+' days left.'))+'</span> <button type="button" class="kp-offers">'+L('Voir les offres','See plans')+'</button></p>':'')+
      '<div class="kp-grid">'+list.map(i=>'<button type="button" class="kp-item" data-kp-go="'+esc(i[0])+'"><span class="kp-txt"><b>'+esc(L(i[1],i[3]))+'</b><span>'+esc(L(i[2],i[4]))+'</span></span><span class="kp-arrow">'+ARROW+'</span></button>').join('')+'</div>';
    d.addEventListener('toggle',()=>{try{localStorage.setItem(key(w),d.open?'1':'0');}catch(e){}});
    d.addEventListener('click',e=>{
      const o=e.target.closest('.kp-offers');if(o){goOffers();return;}
      const b=e.target.closest('[data-kp-go]');if(!b)return;
      const r=b.dataset.kpGo;
      if(r==='@ai'){const f=document.querySelector('.ai-fab');if(f)f.click();return;}
      const nav=document.querySelector('#nav [data-route="'+r+'"]');
      if(nav){nav.click();window.scrollTo({top:0,behavior:'auto'});}
    });
    return d;
  }
  function place(){
    const screen=document.getElementById('screen');if(!screen)return;
    const old=screen.querySelector('.kp-card');
    const inWs=document.body.dataset.entry==='workspace';
    if(!inWs||!HOME.includes(cur())){if(old)old.remove();return;}
    const w=who();
    if(old&&old.dataset.kp===w&&old.dataset.lang===(fr()?'fr':'en')&&old.parentNode===screen)return;
    if(old)old.remove();
    const card=build(w);if(card)screen.append(card);
  }
  let pending=false;
  new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;place();});}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['lang','data-entry']});
  place();
})();
