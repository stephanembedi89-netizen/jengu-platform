/* Klas 237 · Architecture de navigation.
   Règles appliquées à tous les rôles :
   1. Une entrée de menu = un écran. Pas de doublon, pas d'entrée qui redirige ailleurs.
   2. Un même concept porte le même nom d'un rôle à l'autre (seul le pronom change : Ses / Mes).
   3. Le titre de l'écran reprend le nom du menu (« vous êtes ici ») ; la phrase d'accroche passe en sous-titre.
   4. 5 entrées principales au plus ; le reste dans « Tous mes outils », classé par usage. */
(function(){
  'use strict';
  // Écrans hérités remplacés par les nouveaux espaces (ils restent accessibles s'ils sont appelés directement)
  const HIDE={
    parent:['home','homework','routine','progress','parent-summary','college','revise','resources','messages'],
    student:['college','revise','parent-summary','resources'],
    teacher:['progress','messages','resources','prepare'],
    tutor:['messages','monthly','progress','resources','prepare']
  };
  // Noms communs à tous les rôles
  const LABELS={
    parent:{'fk-home':['Ce soir','Tonight'],classroom:['Analyse par compétence','Skills analysis'],'fk-progress':['Ses progrès','Their progress'],block:['Ses difficultés','Where they’re stuck'],'secondary-path':['Son cap examen','Their exam path'],daily:['Vu en classe aujourd’hui','Covered in class today'],roadmap:['Son cap examen','Their exam path'],sessions:['Cours de soutien','Tutoring sessions'],monthly:['Paiements','Payments'],budget:['Dépenses scolaires','School expenses'],support:['Son équipe','Their team'],messages:['Messages enregistrés','Saved messages'],coordination:['Plan d’aide partagé','Shared support plan'],week:['Ma semaine','My week']},
    student:{'fk-home':['Ma journée','My day'],'fk-progress':['Mes progrès','My progress'],block:['Je bloque','I’m stuck'],'secondary-path':['Mon cap examen','My exam path'],coordination:['Plan d’aide partagé','Shared support plan']},
    teacher:{staff:['Aujourd’hui','Today'],'tk-families':['Relais familles','Family relay'],classroom:['Analyse par compétence','Skills analysis'],'lesson-library':['Mes cours préparés','My lesson plans'],week:['Ma semaine','My week'],'build-course':['Préparer un cours','Plan a lesson']},
    tutor:{staff:['Aujourd’hui','Today'],sessions:['Planning des séances','Session planner'],'lesson-library':['Mes séances préparées','My session plans'],coordination:['Plan d’aide partagé','Shared support plan'],'build-course':['Préparer une séance','Plan a session']}
  };
  // Le titre de l'écran = le nom du menu, pour ces écrans hérités à titre « accroche »
  const RETITLE=['daily','roadmap','secondary-path','sessions','monthly','budget','support','messages','coordination','block','classroom','prepare','lesson-library','build-course','week','progress'];
  const roleKey=a=>a==='teacher'||a==='tutor'?a:a==='student'?'student':'parent';
  const cur=()=>roleKey(role==='teacher'||role==='tutor'?role:(typeof activeAudience==='function'?activeAudience():role));

  const base=routeGroups;
  routeGroups=function(a,course){
    const g=base(a,course),k=roleKey(a),hide=new Set(HIDE[k]||[]),lab=LABELS[k]||{};
    const fix=list=>list.filter(r=>!hide.has(r[0])).map(r=>lab[r[0]]?[r[0],lab[r[0]][0],lab[r[0]][1]]:r);
    const main=fix(g.main),ids=new Set(main.map(r=>r[0]));
    const seen=new Set();const extra=fix(g.extra).filter(r=>!ids.has(r[0])&&!seen.has(r[1])&&seen.add(r[1]));
    return {main,extra};
  };

  function retitle(){
    if(document.body.dataset.entry!=='workspace'||!RETITLE.includes(page))return;
    const k=cur(),lab=(LABELS[k]||{})[page];const btn=document.querySelector('#nav [data-route="'+page+'"]');
    const name=lab?tr(lab[0],lab[1]):btn?btn.textContent.trim():'';if(!name)return;
    const h=document.querySelector('#screen h1');if(!h||h.dataset.arch)return;
    const old=h.textContent.trim();if(old.toLowerCase().startsWith(name.toLowerCase().slice(0,6)))return;
    h.dataset.arch='1';h.textContent=name;
    const p=document.createElement('p');p.className='arch-lead';p.textContent=old.replace(/\.$/,'');h.after(p);
  }
  /* Les anciens modules ajoutent parfois leurs boutons après coup : on applique les mêmes règles au menu affiché */
  function tidyNav(){
    if(document.body.dataset.entry!=='workspace')return;
    const k=cur(),hide=new Set(HIDE[k]||[]),lab=LABELS[k]||{};
    document.querySelectorAll('#nav [data-route]').forEach(b=>{const r=b.dataset.route;if(hide.has(r)&&page!==r){b.remove();return;}if(lab[r]){const t=tr(lab[r][0],lab[r][1]);if(b.textContent.trim()!==t)b.textContent=t;}});
    document.querySelectorAll('#nav .workspace-tool-group').forEach(g=>{if(!g.querySelector('[data-route]'))g.remove();});
  }
  const prev=render;render=function(){prev();tidyNav();retitle();};
  // Certains modules reconstruisent le menu après le rendu : on le range à chaque reconstruction.
  let busy=false;const navEl=document.getElementById('nav');
  if(navEl)new MutationObserver(()=>{if(busy)return;busy=true;try{tidyNav();}finally{busy=false;}}).observe(navEl,{childList:true,subtree:true});
})();
