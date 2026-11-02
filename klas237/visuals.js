window.enhanceKlas = function ({role,page,data}) {
  const paths={home:'M3 10 12 3l9 7v11h-6v-7H9v7H3z',routine:'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',week:'M4 5h16v16H4z M4 10h16 M8 3v4 M16 3v4',progress:'M4 20V4 M4 20h17 M8 16l4-5 4 2 5-8',budget:'M3 6h18v14H3z M3 10h18 M16 15h2',messages:'M3 4h18v13H8l-5 4z M7 8h10 M7 12h6',prepare:'M4 3h12l4 4v14H4z M8 11h8 M8 15h6',primary:'M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2z M12 6v15',college:'M3 21h18 M5 21V7h14v14 M3 7l9-5 9 5 M9 11v2 M15 11v2 M10 21v-5h4v5'};
  const icon = key => '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+paths[key]+'"/></svg>';
  document.querySelectorAll('nav [data-page]').forEach(b=>b.insertAdjacentHTML('afterbegin',icon(b.dataset.page)));
  document.querySelectorAll('.tool[data-go]').forEach(b=>b.insertAdjacentHTML('afterbegin',icon(b.dataset.go)));
  document.querySelectorAll('.track-card').forEach((b,i)=>b.insertAdjacentHTML('afterbegin',icon(i?'college':'primary')));
  if(page==='home'){
    const box=document.createElement('div');box.className='quick-status';
    const values=[[data.children.length,role==='parent'?'enfants à suivre':'élèves enregistrés'],[data.tasks.filter(t=>!t.done).length,'choses à prévoir'],[data.progress.length,'points de suivi']];
    values.forEach(([n,label])=>{const item=document.createElement('div'),strong=document.createElement('strong'),span=document.createElement('span');strong.textContent=n;span.textContent=label;item.append(strong,span);box.append(item)});
    document.querySelector('.grid')?.after(box);
    const overview=document.querySelector('.track-overview'),tools=document.querySelector('.tools');
    if(overview&&tools)tools.after(overview);
  }
};
