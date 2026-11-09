/* Klas 237 · mouvements de la DA « Relais » : apparition au défilement et transitions entre écrans. */
(function(){
  'use strict';
  const reduced=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  let io=null;
  function reveal(){
    if(reduced()||!('IntersectionObserver' in window))return;
    io=io||new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
    document.querySelectorAll('.nx-reveal:not(.nx-pre)').forEach((el,i)=>{const r=el.getBoundingClientRect();if(r.top<innerHeight*.92)return;el.style.setProperty('--d',(i%4)*80+'ms');el.classList.add('nx-pre');io.observe(el);});
  }
  const root=document.getElementById('entry-root');
  if(root)new MutationObserver(()=>requestAnimationFrame(reveal)).observe(root,{childList:true});
  document.addEventListener('DOMContentLoaded',reveal);requestAnimationFrame(reveal);
  // Transition douce entre deux écrans de l'espace de travail
  if(typeof openRoute==='function'&&document.startViewTransition){
    const go=openRoute;
    openRoute=function(next){if(reduced()||next===page)return go(next);document.startViewTransition(()=>go(next));};
  }
})();
