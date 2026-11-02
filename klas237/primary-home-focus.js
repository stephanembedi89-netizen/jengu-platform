/* The primary space is home support, not a second classroom. */
(function(){
  const previous=render;
  const text=(fr,en)=>tr(fr,en);
  function focusCard(){return '<section class="primary-home-focus"><div><p class="entry-kicker">'+text('CE SOIR, À LA MAISON','TONIGHT, AT HOME')+'</p><h2>'+text('On part de son cahier, pas d’un nouveau cours.','Start with the exercise book, not another lesson.')+'</h2><p>'+text('D’abord ce qui a été vu. Ensuite ce qui bloque. Enfin, un exemple simple à essayer ensemble.','First what was covered. Then what is difficult. Finally, one simple example to try together.')+'</p></div><ol><li><b>1</b><span>'+text('Ce qu’il a vu','What they saw')+'</span></li><li><b>2</b><span>'+text('Où ça bloque','What is difficult')+'</span></li><li><b>3</b><span>'+text('On essaie ensemble','Try together')+'</span></li></ol><button data-primary-focus="daily">'+text('Commencer avec sa journée →','Start with today →')+'</button></section>';}
  render=function(){
    previous();
    const c=data.children[selected];
    if(role!=='parent'||c?.track!=='primary'||c.professional)return;
    const screen=document.getElementById('screen');
    if(page==='home'&&!screen.querySelector('.primary-home-focus')){
      const hero=screen.querySelector('.workspace-hero');if(hero)hero.insertAdjacentHTML('afterend',focusCard());
    }
    if(page==='search'){
      const h=screen.querySelector('h1');if(h)h.textContent=text('Je l’aide à comprendre','Help them understand');
      const form=screen.querySelector('#help-search');if(form&&!screen.querySelector('.primary-help-reminder'))form.insertAdjacentHTML('beforebegin','<p class="primary-help-reminder">'+text('Dites simplement ce qu’il n’a pas compris. Klas 237 vous aide à le redire avec des mots simples et un exemple de la maison.','Simply say what was not understood. Klas 237 helps you explain it with simple words and a home example.')+'</p>');
    }
    screen.querySelectorAll('[data-primary-focus]').forEach(button=>button.onclick=()=>openRoute(button.dataset.primaryFocus));
  };
  render();
}());
