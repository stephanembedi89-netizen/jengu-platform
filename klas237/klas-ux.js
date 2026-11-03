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
    college:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 16a2 2 0 0 1 2-2h13"/><path d="M9 7h6M9 11h4"/>',
    block:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
    revise:'<path d="M3 5h18v14H3z"/><path d="M3 9h18M8 3v4M16 3v4M7.5 13l2 2 4-4"/>',
    'parent-summary':'<path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a5 5 0 0 1 10 0M12 20a5 5 0 0 1 10 0"/>',
    staff:'<path d="M3 5h18v14H3z"/><path d="M3 9h18M8 3v4M16 3v4"/><circle cx="12" cy="14" r="2"/>',
    'tk-students':'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    'tk-evals':'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13l2 2 4-4M9 18h6"/>',
    'tk-year':'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    'fk-home':'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    'fk-homework':'<path d="M9 5h11M9 12h11M9 19h11"/><path d="m3 5 1.5 1.5L7 4M3 12l1.5 1.5L7 11M3 19l1.5 1.5L7 18"/>',
    'fk-progress':'<path d="M3 20h18"/><path d="M6 16V11M11 16V7M16 16v-5M21 16V5"/>',
    'fk-focus':'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
    'fk-learners':'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    'fk-payments':'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>',
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
      const full=src.textContent.trim();const short={home:L('Accueil','Home'),homework:L('Devoirs','Homework'),routine:L('10 min','10 min'),search:L('Comprendre','Explain'),'parent-summary':L('Suivi','Check-in'),college:L('Travail','Work'),block:L('Difficultés','Stuck'),revise:L('Révisions','Revision'),staff:L('Aujourd’hui','Today'),'tk-students':L('Élèves','Students'),'tk-evals':L('Notes','Marks'),'tk-year':L('Année','Year'),'fk-home':L('Ce soir','Tonight'),'fk-homework':L('Devoirs','Homework'),'fk-progress':L('Suivi','Progress'),'fk-focus':L('Réviser','Revise'),'fk-teacher':L('Écrire','Write'),'fk-learners':L('Élèves','Learners'),'fk-payments':L('Paiements','Payments'),'fk-report':L('Bilans','Reports')}[src.dataset.route];b.querySelector('span').textContent=short||full;if(short)b.setAttribute('aria-label',full);
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
