/* Klas 237 · Affichage sans superposition (téléphone et ordinateur).
   Rien ne flotte au-dessus du contenu :
   - sur ordinateur, « Assistant », « Aide » et « A+ » sont dans la barre du haut ;
   - l'assistant devient un onglet de la barre du bas (ajouté par klas-ux.js) ;
   - « Aide » et « A+ » rejoignent l'en-tête (pages d'accueil) ou la barre du haut (espaces) ;
   - le menu « Tous mes outils » reprend aussi l'action principale qui ne tient pas dans les onglets. */
(function(){
  'use strict';
  const fr=()=>(document.documentElement.lang||'fr').slice(0,2)!=='en';
  const L=(a,b)=>fr()?a:b;
  const help=()=>document.querySelector('.klas-help-trigger');
  const size=()=>document.querySelector('.kx-textsize');
  const fab=()=>document.querySelector('.ai-fab');
  const SPARK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>';
  function tools(withAI){
    const box=document.createElement('div');box.className='kx-mtools';
    if(withAI){const i=document.createElement('button');i.type='button';i.className='kx-mtool kx-mtool-ai';i.innerHTML=SPARK+'<span></span>';i.addEventListener('click',()=>{const f=fab();if(f)f.click();});box.append(i);}
    const h=document.createElement('button');h.type='button';h.className='kx-mtool kx-mtool-help';
    const a=document.createElement('button');a.type='button';a.className='kx-mtool kx-mtool-size';a.textContent='A+';
    h.addEventListener('click',()=>{const t=help();if(t)t.click();});
    a.addEventListener('click',()=>{const t=size();if(t){t.click();label(box);}});
    box.append(h,a);label(box);return box;
  }
  function label(box){
    const h=box.querySelector('.kx-mtool-help'),a=box.querySelector('.kx-mtool-size'),i=box.querySelector('.kx-mtool-ai');
    if(i){const t=L('Assistant','Assistant'),sp=i.querySelector('span');if(sp.textContent!==t)sp.textContent=t;i.hidden=!fab();}
    const ht=L('Aide','Help');if(h.textContent!==ht)h.textContent=ht;
    const set=(el,k,v)=>{if(el.getAttribute(k)!==v)el.setAttribute(k,v);};
    set(h,'aria-label',L('Besoin d’aide ?','Need help?'));
    const z=L('Agrandir le texte','Larger text');set(a,'aria-label',z);set(a,'title',z);
    const t=size();if(t)set(a,'aria-pressed',t.getAttribute('aria-pressed')||'false');
  }
  /* L'action principale qui ne tient pas dans la barre d'onglets (la 5e) est reprise en tête de « Tous mes outils » */
  function extraInMenu(){
    const nav=document.getElementById('nav');if(!nav)return;
    const menu=nav.querySelector('details');if(!menu)return;
    const rest=[...nav.querySelectorAll(':scope > button[data-route]:not(.kx-mirrored)')];
    menu.querySelectorAll('.kx-mclone').forEach(c=>{if(!rest.some(r=>r.dataset.route===c.dataset.mroute))c.remove();});
    rest.forEach(src=>{
      let c=menu.querySelector('.kx-mclone[data-mroute="'+src.dataset.route+'"]');
      if(!c){c=document.createElement('button');c.type='button';c.className='kx-mclone';c.dataset.mroute=src.dataset.route;c.addEventListener('click',()=>{src.click();menu.open=false;});const sum=menu.querySelector('summary');(sum?sum.nextSibling:null)?menu.insertBefore(c,sum.nextSibling):menu.append(c);}
      const t=src.textContent.trim();if(c.textContent!==t)c.textContent=t;
      c.classList.toggle('active',src.classList.contains('active'));
    });
  }
  function place(){
    // Pages d'accueil : outils dans l'en-tête
    const eh=document.querySelector('.entry-header');
    if(eh){let b=eh.querySelector('.kx-mtools');if(!b){b=tools();eh.append(b);}else label(b);}
    // Espaces : outils dans la barre du haut
    // (si la barre est rangée dans un volet repliable, les outils restent dehors, toujours visibles)
    const hd=document.querySelector('main > header');
    if(hd){
      const ta=hd.querySelector('.topbar-actions');
      const th=ta&&!ta.closest('details')?ta:hd;
      let b=hd.querySelector('.kx-mtools');
      if(!b)b=tools(true);
      if(b.parentNode!==th)th.append(b);
      label(b);
    }
    extraInMenu();
  }
  let pending=false;
  new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;place();});}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['lang','class','aria-pressed']});
  place();
})();
