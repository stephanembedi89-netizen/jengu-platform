/* Klas 237 · confort d'usage : lien d'évitement, texte agrandi, aide regroupée,
   barre d'onglets mobile reprenant les actions principales de l'espace. */
(function(){
  'use strict';
  const fr=()=>(document.documentElement.lang||'fr').slice(0,2)!=='en';
  const L=(a,b)=>fr()?a:b;

  /* 1. Lien d'évitement vers le contenu */
  const skip=document.createElement('a');
  skip.className='kx-skip';skip.href='#';
  skip.addEventListener('click',e=>{e.preventDefault();const ws=document.body.dataset.entry==='workspace';const target=ws?document.querySelector('#screen h1, #screen'):document.querySelector('#entry-root h1, #entry-root');if(target){target.tabIndex=-1;target.focus();}});
  document.body.prepend(skip);

  /* 2. Aide + taille du texte regroupées dans un même coin */
  const dock=document.createElement('div');dock.className='kx-dock';
  const size=document.createElement('button');size.type='button';size.className='kx-textsize';size.textContent='A+';
  let large=false;try{large=localStorage.getItem('klas-text-large')==='1';}catch(e){}
  function applySize(){document.body.classList.toggle('kx-large',large);size.setAttribute('aria-pressed',String(large));}
  size.addEventListener('click',()=>{large=!large;applySize();try{localStorage.setItem('klas-text-large',large?'1':'0');}catch(e){}});
  dock.append(size);document.body.append(dock);
  function adoptHelp(){const h=document.querySelector('.klas-help-trigger');if(h&&h.parentNode!==dock)dock.append(h);}
  adoptHelp();applySize();

  /* 3. Barre d'onglets mobile */
  const icons={
    home:'<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"/>',
    homework:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 16a2 2 0 0 1 2-2h13"/><path d="M9 7h6M9 11h4"/>',
    routine:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
    search:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
    def:'<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>'
  };
  const bar=document.createElement('nav');bar.className='kx-tabbar';
  document.body.append(bar);
  let last='';
  function build(){
    adoptHelp();
    const nav=document.getElementById('nav');if(!nav)return;
    bar.setAttribute('aria-label',L('Actions principales','Main actions'));
    const items=[...nav.querySelectorAll(':scope > button[data-route]')].slice(0,4);
    const sig=items.map(b=>b.dataset.route+'|'+b.textContent.trim()+'|'+(b.classList.contains('active')||b.getAttribute('aria-current')==='page')).join(';');
    if(sig===last)return;last=sig;
    nav.querySelectorAll('.kx-mirrored').forEach(b=>b.classList.remove('kx-mirrored'));
    bar.innerHTML='';
    items.forEach(src=>{
      src.classList.add('kx-mirrored');
      const b=document.createElement('button');b.type='button';
      const active=src.classList.contains('active')||src.getAttribute('aria-current')==='page';
      if(active)b.setAttribute('aria-current','page');
      b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icons[src.dataset.route]||icons.def)+'</svg><span></span>';
      const full=src.textContent.trim();const short={home:L('Accueil','Home'),homework:L('Devoirs','Homework'),routine:L('10 min','10 min'),search:L('Comprendre','Explain')}[src.dataset.route];b.querySelector('span').textContent=short||full;if(short)b.setAttribute('aria-label',full);
      b.addEventListener('click',()=>{src.click();window.scrollTo({top:0,behavior:'auto'});});
      bar.append(b);
    });
  }
  function labelUi(){
    const s=L('Aller au contenu','Skip to content'),z=L('Agrandir le texte','Larger text');
    if(skip.textContent!==s)skip.textContent=s;
    if(size.title!==z){size.title=z;size.setAttribute('aria-label',z);}
  }
  new MutationObserver(build).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-current','lang','data-entry']});
  new MutationObserver(labelUi).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  labelUi();build();
})();
