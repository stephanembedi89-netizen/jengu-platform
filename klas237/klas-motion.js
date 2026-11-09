/* Klas 237 · Mouvement par palier d'âge.
   play   : primaire (SIL → CM2)      rebonds, formes qui flottent, confettis aux couleurs nationales
   lively : collège (6e → 3e)         apparitions en cascade, étincelles discrètes
   focus  : lycée (2nde → Tle)        fondu sobre, coche animée, rien qui distrait
   pro    : enseignants, accompagnateurs : fondu et chiffres qui se comptent
   Respecte « réduire les animations » du système. */
(function(){
  'use strict';
  const reduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tier(){
    if(document.body.dataset.entry!=='workspace')return 'lively';
    if(typeof role!=='undefined'&&(role==='teacher'||role==='tutor'))return 'pro';
    const c=typeof data!=='undefined'&&data.children?data.children[selected]:null;
    if(!c)return 'lively';
    if(c.track==='primary')return 'play';
    return /^(2nde|1re|Tle) /.test(c.level||'')?'focus':'lively';
  }
  window.klasMotionTier=tier;

  function countUp(el){
    const raw=el.textContent.trim(),m=raw.match(/^(\d+(?:[.,]\d+)?)(.*)$/);if(!m||el.dataset.counted)return;
    el.dataset.counted='1';const target=parseFloat(m[1].replace(',','.')),dec=(m[1].split(/[.,]/)[1]||'').length,suffix=m[2],sep=m[1].includes(',')?',':'.';
    const t0=performance.now(),dur=700;
    const step=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3),v=(target*e).toFixed(dec).replace('.',sep);el.textContent=v+suffix;if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  }
  let lastKey='';
  function enter(){
    const T=tier();document.body.dataset.motion=T;document.body.dataset.kit=document.querySelector('#screen .tk')?'on':'off';
    if(reduced())return;
    const root=document.querySelector('#screen .tk');if(!root||root.dataset.entered)return;root.dataset.entered='1';
    const key=(typeof role!=='undefined'?role:'')+'|'+(typeof page!=='undefined'?page:'')+'|'+(typeof selected!=='undefined'?selected:'')+'|'+(typeof activeAudience==='function'?activeAudience():'');
    if(key===lastKey)return;lastKey=key;
    const items=root.querySelectorAll(':scope > *, .tk-kpis > *, .tk-grid > *, .fk-week > *');
    items.forEach((el,i)=>{el.style.setProperty('--kx-i',Math.min(i,14));el.classList.add('kx-in');});
    root.querySelectorAll('.tk-kpi strong,.tk-mini-stats strong,.fk-big').forEach(countUp);
  }
  /* Célébration : le même geste, intensité selon l'âge */
  window.klasCelebrate=function(anchor,strength){
    const T=tier();if(reduced())return;
    const r=anchor&&anchor.getBoundingClientRect?anchor.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0};
    const x=r.left+r.width/2,y=r.top+r.height/2;
    const n=T==='play'?(strength==='big'?46:28):T==='lively'?14:0;
    if(!n){anchor&&anchor.classList&&(anchor.classList.remove('kx-pop'),void anchor.offsetWidth,anchor.classList.add('kx-pop'));return;}
    const layer=document.createElement('div');layer.className='kx-confetti';layer.setAttribute('aria-hidden','true');
    const colors=['#007a5e','#ce1126','#fcd116'];
    for(let i=0;i<n;i++){
      const p=document.createElement('i');const a=Math.random()*Math.PI*2,d=(T==='play'?90:55)+Math.random()*(T==='play'?120:60);
      p.style.left=x+'px';p.style.top=y+'px';p.style.background=colors[i%3];
      p.style.setProperty('--dx',Math.cos(a)*d+'px');p.style.setProperty('--dy',(Math.sin(a)*d-(T==='play'?60:20))+'px');p.style.setProperty('--r',(Math.random()*540-270)+'deg');
      if(T==='play'&&i%5===0){p.className='star';}
      layer.append(p);
    }
    document.body.append(layer);setTimeout(()=>layer.remove(),1300);
  };
  if(typeof render==='function'){const prev=render;render=function(){prev();enter();};}
  document.addEventListener('DOMContentLoaded',enter);
  new MutationObserver(()=>{const r=document.querySelector('#screen .tk');if(r&&!r.dataset.entered)enter();else {document.body.dataset.motion=tier();document.body.dataset.kit=r?'on':'off';}}).observe(document.getElementById('screen')||document.body,{childList:true});
})();
