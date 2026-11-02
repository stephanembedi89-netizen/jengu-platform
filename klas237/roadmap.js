/* A calm, parent-readable preparation map. It records follow-up, never predicts an exam result. */
(function(){
  const previous=render;
  const termNames=['1er trimestre','2e trimestre','3e trimestre'];
  function key(c){return [c.id,c.subsystem,c.level].join(':')}
  function statusLabel(value){return tr({todo:'À commencer',going:'En bonne voie',review:'À reprendre'}[value],{todo:'To start',going:'Going well',review:'To revisit'}[value])}
  function examFor(c){return c.subsystem==='en'?['FSLC','First School Leaving Certificate','Class 6']:['CEP','Certificat d’études primaires','CM2']}
  function stageState(level,index,current,terms){
    if(index<current)return ['past',tr('Étape passée','Earlier class')];
    if(index>current)return ['future',tr('À venir','Later')];
    const values=terms||[];
    if(values.length===3&&values.every(x=>x==='going'))return ['done',tr('Année bien suivie','Year followed')];
    return ['current',tr('Cette année','This year')];
  }
  function mapView(c){
    const levels=PRIMARY_LEVELS[c.subsystem],current=primaryGrade(c),exam=examFor(c);
    data.roadmap ||= {};
    const record=data.roadmap[key(c)]||{terms:['todo','todo','todo'],note:''};
    const route=levels.map((level,i)=>{const [state,label]=stageState(level,i,current,record.terms);return '<article class="roadmap-stop '+state+'"><b>'+esc(level)+'</b><small>'+label+'</small><span class="roadmap-state">'+(i===levels.length-1?exam[0]:i===current?tr('En cours','Current'):state==='past'?tr('Parcouru','Completed'):'…')+'</span></article>';}).join('');
    return '<section class="roadmap-hero"><p class="entry-kicker">'+tr('MON CHEMIN SCOLAIRE','MY SCHOOL PATH')+'</p><h1>'+tr('On avance jusqu’au ','Moving towards ')+exam[0]+'.</h1><p>'+tr('On ne cherche pas la perfection. On regarde une étape après l’autre : ce qui est compris, ce qui mérite encore un peu d’aide, puis la suite.','We do not seek perfection. We look one step at a time: what is understood, what needs help, then what comes next.')+'</p><p class="roadmap-note">'+tr('Cette route aide à préparer l’examen. Elle ne donne pas une garantie de réussite : l’examen reste une épreuve à part.','This path helps prepare for the exam. It does not guarantee a result: the exam remains a separate assessment.')+'</p></section><section class="card"><h2>'+tr('Le parcours de ','The path to ')+exam[0]+'</h2><div class="roadmap-track">'+route+'</div><div class="roadmap-final"><strong>'+exam[0]+' · '+tr('fin de ','end of ')+exam[2]+'</strong><p>'+tr('Quand ce moment arrivera : révisions par matière, petites simulations et difficultés à reprendre — sans remplacer les consignes de l’école.','When the time comes: subject-by-subject revision, small practice sessions and areas to revisit — without replacing the school’s guidance.')+'</p></div></section><section class="card"><p class="entry-kicker">'+esc(c.level)+' · '+tr('CE TRIMESTRE','THIS TERM')+'</p><h2>'+tr('Comment ça avance ?','How is it going?')+'</h2><p>'+tr('Choisissez le mot le plus simple. Vous pourrez le changer après une discussion avec l’enfant ou l’enseignant.','Choose the simplest word. You can change it after talking with the child or teacher.')+'</p><form id="roadmap-form"><div class="roadmap-quarter">'+termNames.map((name,i)=>'<label>'+tr(name,['Term 1','Term 2','Term 3'][i])+'<select name="term'+i+'">'+['todo','going','review'].map(value=>'<option value="'+value+'" '+(record.terms[i]===value?'selected':'')+'>'+statusLabel(value)+'</option>').join('')+'</select></label>').join('')+'</div><label>'+tr('Une petite note pour la famille (facultatif)','A short note for the family (optional)')+'<input name="note" maxlength="180" value="'+esc(record.note||'')+'" placeholder="'+tr('Ex. revoir les divisions samedi','e.g. review division on Saturday')+'"></label><button>'+tr('Garder ce repère','Save this update')+'</button><span id="roadmap-saved" role="status"></span></form></section><section class="card"><h2>'+tr('Avant le '+exam[0]+', on vérifie simplement','Before '+exam[0]+', keep it simple')+'</h2><div class="exam-checklist"><p>'+tr('Les leçons importantes vues en classe','Key lessons covered in class')+'</p><p>'+tr('Les points difficiles repris un par un','Difficult points revisited one at a time')+'</p><p>'+tr('Des exercices d’entraînement adaptés au moment','Practice tasks suited to the moment')+'</p></div></section>';
  }
  render=function(){
    previous();
    const c=data.children[selected];
    if(page!=='roadmap'||role!=='parent'||c?.track!=='primary'||c.professional)return;
    const screen=document.getElementById('screen');screen.innerHTML=mapView(c);
    document.getElementById('roadmap-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);data.roadmap ||= {};data.roadmap[key(c)]={terms:[f.get('term0'),f.get('term1'),f.get('term2')],note:f.get('note')};save();document.getElementById('roadmap-saved').textContent=tr('Repère gardé.','Update saved.');};
  };
  render();
}());
