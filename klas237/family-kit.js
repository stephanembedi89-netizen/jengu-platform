/* Klas 237 · Kits Parents, Élèves et Accompagnateurs.
   Mêmes briques que le cartable de l'enseignant (tableau de bord, tâches dans l'ordre,
   indicateurs, suivi chiffré, messages prêts pour WhatsApp), adaptées à chaque rôle :
   - Parent (primaire et secondaire) : Ce soir, Devoirs et contrôles, Suivi, Écrire à l'enseignant
   - Élève (collège et lycée)        : Ma journée, Devoirs et contrôles, Mes notes, Réviser
   - Accompagnateur                  : Aujourd'hui, Mes élèves, Paiements, Bilans aux parents
   Les données restent dans le compte ; rien n'est envoyé automatiquement. */
(function(){
  'use strict';
  const FK=['fk-home','fk-homework','fk-progress','fk-teacher','fk-focus','fk-learners','fk-payments','fk-report'];
  const ui={step:0,timer:null,timerEnd:0,timerTotal:0,timerKind:'',mood:'',msg:'absence',goal:'',learner:'',month:'',report:'',focusSubject:''};
  const fr=()=>uiLanguage!=='en';
  const num=(n,d=1)=>Number.isFinite(n)?n.toLocaleString(fr()?'fr-FR':'en-GB',{maximumFractionDigits:d}):'—';
  const fcfa=n=>num(n,0)+' FCFA';
  const today=()=>typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10);
  const addDays=(d,n)=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10);};
  const diff=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5);
  const longDate=d=>new Date(d+'T12:00:00').toLocaleDateString(fr()?'fr-FR':'en-GB',{weekday:'long',day:'numeric',month:'long'});
  const shortDate=d=>d?new Date(d+'T12:00:00').toLocaleDateString(fr()?'fr-FR':'en-GB',{day:'numeric',month:'short'}):'';
  const uid=()=>typeof klasId==='function'?klasId():Math.random().toString(36).slice(2);
  const btn=(label,attrs,cls='')=>'<button type="button" class="'+cls+'" '+attrs+'>'+label+'</button>';
  const head=(kicker,title,lead,actions='')=>'<div class="tk-head"><div><p class="eyebrow">'+esc(kicker)+'</p><h1>'+title+'</h1>'+(lead?'<p class="tk-lead">'+lead+'</p>':'')+'</div>'+(actions?'<div class="tk-head-actions">'+actions+'</div>':'')+'</div>';
  const kpi=(value,label,sub,tone='')=>'<div class="tk-kpi '+tone+'"><strong>'+value+'</strong><span>'+label+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div>';

  /* ---------- Qui regarde ? ---------- */
  function who(){
    if(role==='teacher')return null;
    if(role==='tutor')return 'tutor';
    const c=data.children[selected];if(!c||c.professional)return null;
    const a=typeof activeAudience==='function'?activeAudience():role;
    return a==='student'?'student':'parent';
  }
  const child=()=>data.children[selected];
  const cycle=c=>c.track==='primary'?'primary':/^(2nde|1re|Tle) /.test(c.level||'')?'lycee':'college';
  function subjects(c){try{if(c.track==='college')return collegeSubjects(c.level);if(typeof primarySubjects==='function')return primarySubjects(c);}catch(e){}return ['Français','Mathématiques','Sciences','Anglais','Histoire','Géographie'];}

  /* ---------- Données famille ---------- */
  function fk(c){
    data.familyKit||={};
    const k=data.familyKit[c.id]||(data.familyKit[c.id]={homework:[],tests:[],grades:[],evenings:{},focus:{},examDate:'',goal:'',seeded:false});
    for(const key of ['homework','tests','grades'])if(!Array.isArray(k[key]))k[key]=[];
    k.evenings||={};k.focus||={};
    if(!cloud&&!k.seeded)seedFamily(c,k);
    return k;
  }
  function seedFamily(c,k){
    k.seeded=true;const d=today(),cy=cycle(c),S=subjects(c);
    const tert=window.klasLycee&&klasLycee(c.level)&&klasLycee(c.level).info.family==='STT';
    const s1=tert?S[0]:cy==='primary'?tr('Mathématiques','Mathematics'):'Mathématiques',s2=cy==='primary'?tr('Français','French'):'Français',s3=tert?S[4]||'Économie générale':cy==='primary'?tr('Sciences','Science'):(S.find(x=>/SVT|Physique|Sciences/.test(x))||'Anglais');
    k.homework=[
      {id:uid(),subject:s1,task:cy==='primary'?tr('Exercices 3 et 4 page 42','Exercises 3 and 4, page 42'):tert?tr('Passer les écritures de l’exercice 2','Post the entries for exercise 2'):tr('Exercices 12 à 15 page 87','Exercises 12 to 15, page 87'),due:addDays(d,1),done:false},
      {id:uid(),subject:s2,task:cy==='primary'?tr('Apprendre la poésie (2 strophes)','Learn the poem (2 verses)'):tr('Lire le chapitre 3 et relever les personnages','Read chapter 3 and list the characters'),due:addDays(d,2),done:false},
      {id:uid(),subject:s3,task:tr('Recopier la leçon proprement','Copy out the lesson neatly'),due:addDays(d,-1),done:true,doneDate:addDays(d,-1)}];
    k.tests=[{id:uid(),subject:s1,title:cy==='primary'?tr('La multiplication','Multiplication'):tert?tr('Les amortissements','Depreciation'):tr('Fonctions affines','Linear functions'),date:addDays(d,4)}];
    const marks=cy==='primary'?[[s1,7,10,1,-20],[s2,8,10,1,-18],[s3,6,10,1,-12],[s1,8.5,10,1,-5],[s2,6.5,10,1,-3]]:[[s1,11,20,3,-24],[s2,13,20,2,-20],[s3,9.5,20,2,-15],[s1,12.5,20,3,-8],[s2,14,20,2,-4],[s3,10.5,20,2,-2]];
    k.grades=marks.map(([s,v,sc,co,o])=>({id:uid(),subject:s,value:v,scale:sc,coef:co,date:addDays(d,o),label:tr('Interrogation','Quiz')}));
    for(const o of [-1,-2,-4,-5])k.evenings[addDays(d,o)]={mood:['top','bien','bien','dur'][-o%4],at:''};
    k.focus[addDays(d,-1)]=2;
    k.goal=cy==='primary'?'':'12';
  }
  const gradeOn20=g=>g.value/g.scale*20;
  function averages(k){
    const by={};for(const g of k.grades){(by[g.subject]||(by[g.subject]={sum:0,w:0,list:[]}));by[g.subject].sum+=gradeOn20(g)*(+g.coef||1);by[g.subject].w+=(+g.coef||1);by[g.subject].list.push(g);}
    const subjects=Object.entries(by).map(([s,v])=>({subject:s,avg:v.sum/v.w,list:v.list.sort((a,b)=>a.date.localeCompare(b.date))}));
    let sum=0,w=0;for(const g of k.grades){sum+=gradeOn20(g)*(+g.coef||1);w+=(+g.coef||1);}
    return {subjects:subjects.sort((a,b)=>b.avg-a.avg),general:w?sum/w:null,sum,w};
  }
  function streak(k){let n=0,d=today();if(!k.evenings[d])d=addDays(d,-1);while(k.evenings[d]){n++;d=addDays(d,-1);}return n;}
  function weekStrip(k){
    const d=today(),dt=new Date(d+'T12:00:00'),dow=(dt.getDay()+6)%7,monday=addDays(d,-dow);
    const names=fr()?['L','M','M','J','V','S','D']:['M','T','W','T','F','S','S'];
    return '<ol class="fk-week" aria-label="'+tr('Soirs de travail cette semaine','Study evenings this week')+'">'+names.map((n,i)=>{const day=addDays(monday,i),on=!!k.evenings[day],isT=day===d;return '<li class="'+(on?'on':'')+(isT?' today':'')+'" title="'+esc(longDate(day))+'"><span>'+n+'</span><i aria-hidden="true"></i><b class="sr">'+(on?tr('fait','done'):tr('pas encore','not yet'))+'</b></li>';}).join('')+'</ol>';
  }
  const examName=c=>c.track==='primary'?(c.level==='CM2'||c.level==='Class 6'?'CEP':''):(window.klasExam?klasExam(c.level):'')||(c.level==='3e'?'BEPC':'');

  /* ---------- Le rituel du soir ---------- */
  function ritualSteps(c,w){
    const cy=cycle(c),n=esc(c.name);
    if(w==='student')return [
      [tr('Ce que j’ai vu aujourd’hui','What I covered today'),tr('Ouvre ton cahier. Relis la leçon du jour et souligne la phrase la plus importante.','Open your exercise book. Re-read today’s lesson and underline the key sentence.')],
      [tr('Ce qui me bloque','What I’m stuck on'),tr('Écris en une phrase la question précise qui te pose problème. Si rien ne bloque, choisis l’exercice le plus difficile.','Write the exact question you’re stuck on in one sentence. If nothing is blocking, pick the hardest exercise.')],
      [tr('Je m’entraîne seul(e)','I practise on my own'),cy==='lycee'?tr('Refais un exercice type sans regarder la correction, en temps limité. Puis vérifie.','Redo a model exercise without looking at the answer, against the clock. Then check.'):tr('Refais un exercice sans regarder la correction. Puis compare avec le cahier.','Redo one exercise without looking at the answer. Then compare with the book.')]];
    if(cy==='primary')return [
      [tr('Ce qu’il a vu','What they covered'),tr('Demandez à ','Ask ')+n+tr(' de vous montrer son cahier et de vous raconter la leçon du jour avec ses mots.',' to show you the exercise book and tell you about today’s lesson in their own words.')],
      [tr('Où ça bloque','Where it’s stuck'),tr('Choisissez un seul exercice difficile. Demandez : « Qu’est-ce qu’on te demande ? Par quoi tu commences ? »','Choose one difficult exercise. Ask: “What are you asked to do? Where do you start?”')],
      [tr('On essaie ensemble','We try together'),tr('Faites un exemple avec des objets ou des dessins, puis laissez-le refaire seul. Félicitez l’effort, pas seulement la réponse.','Do one example with objects or drawings, then let them redo it alone. Praise the effort, not just the answer.')]];
    return [
      [tr('Ce qu’il a à faire','What they have to do'),tr('Regardez ensemble l’agenda : devoirs pour demain et prochain contrôle. Faites choisir une priorité.','Look at the planner together: homework for tomorrow and the next test. Let them choose one priority.')],
      [tr('Montre-moi un point','Show me one point'),tr('« Explique-moi ce que tu as compris, ou montre-moi l’étape qui bloque. » Vous n’avez pas besoin de connaître la matière.','“Explain what you understood, or show me the step that’s blocking.” You don’t need to know the subject.')],
      [tr('Quelle est la suite ?','What’s next?'),tr('Décidez ensemble d’une action : refaire un exercice, demander au professeur, réviser 15 minutes demain.','Agree on one action: redo an exercise, ask the teacher, revise 15 minutes tomorrow.')]];
  }
  function ritualCard(c,k,w){
    const steps=ritualSteps(c,w),done=!!k.evenings[today()];
    const minutes=w==='student'?(cycle(c)==='lycee'?25:15):10;
    const t=ui.timerKind==='ritual'?timerState():null;
    if(done)return '<section class="card tk-card fk-ritual is-done"><div class="fk-ritual-done"><span class="fk-medal" aria-hidden="true">★</span><div><h2>'+tr('Ce soir, c’est fait.','Done for tonight.')+'</h2><p>'+(w==='student'?tr('Bravo pour ta régularité. Demain, on continue.','Well done for keeping it up. Same again tomorrow.'):tr('Merci pour ce moment. Ce sont ces petits pas qui font les grandes réussites.','Thank you for this time together. Small steps make big achievements.'))+'</p></div></div>'+btn(tr('Refaire le rituel','Do it again'),'data-fk-ritual-reset="1"','secondary')+'</section>';
    return '<section class="card tk-card fk-ritual"><div class="fk-ritual-head"><div><p class="eyebrow">'+(w==='student'?tr('MA MÉTHODE DU SOIR','MY EVENING METHOD'):tr('NOTRE MOMENT · '+minutes+' MINUTES','OUR MOMENT · '+minutes+' MINUTES'))+'</p><h2>'+(w==='student'?tr('Trois étapes, et c’est fait.','Three steps and you’re done.'):tr('On part du cahier, pas d’un nouveau cours.','Start from the exercise book, not a new lesson.'))+'</h2></div>'+ring(t,minutes)+'</div>'+
      '<ol class="fk-steps">'+steps.map(([h,p],i)=>'<li class="'+(i<ui.step?'is-done':i===ui.step?'is-current':'')+'"><span class="fk-step-n" aria-hidden="true">'+(i<ui.step?'✓':i+1)+'</span><div><h3>'+h+'</h3>'+(i===ui.step?'<p>'+p+'</p>':'')+'</div></li>').join('')+'</ol>'+
      (ui.step<3?'<div class="tk-row-actions">'+(t?'':btn(tr('Lancer le minuteur','Start the timer'),'data-fk-timer="ritual:'+minutes+'"','secondary'))+btn(ui.step<2?tr('Étape suivante','Next step'):tr('C’est fait','Done'),'data-fk-step="1"')+'</div>':
      '<div class="fk-mood"><p><b>'+(w==='student'?tr('Comment ça s’est passé ?','How did it go?'):tr('Comment s’est passé ce moment ?','How did this time go?'))+'</b></p><div class="fk-mood-row" role="group">'+[['top','😄',tr('Très bien','Great')],['bien','🙂',tr('Bien','Good')],['moyen','😐',tr('Moyen','Okay')],['dur','😟',tr('Difficile','Hard')]].map(([v,e,l])=>'<button type="button" class="fk-mood-btn" data-fk-mood="'+v+'" aria-label="'+l+'"><span aria-hidden="true">'+e+'</span>'+l+'</button>').join('')+'</div></div>')+'</section>';
  }
  function timerState(){const left=Math.max(0,ui.timerEnd-Date.now());return {left,total:ui.timerTotal,ratio:ui.timerTotal?left/ui.timerTotal:0};}
  function ring(t,minutes,size=96){
    const r=42,C=2*Math.PI*r,ratio=t?t.ratio:1,left=t?t.left:minutes*60000;
    const mm=Math.floor(left/60000),ss=Math.floor(left%60000/1000);
    return '<div class="fk-ring'+(t?' is-running':'')+'" style="--s:'+size+'px" role="timer" aria-live="off" aria-label="'+tr('Temps restant','Time left')+'"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="'+r+'" class="bg"/><circle cx="50" cy="50" r="'+r+'" class="fg" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-ratio)).toFixed(1)+'"/></svg><b data-fk-clock>'+mm+':'+String(ss).padStart(2,'0')+'</b></div>';
  }
  function startTimer(kind,minutes){
    clearInterval(ui.timer);ui.timerKind=kind;ui.timerTotal=minutes*60000;ui.timerEnd=Date.now()+ui.timerTotal;
    ui.timer=setInterval(()=>{const t=timerState();const el=document.querySelector('[data-fk-clock]');const fg=document.querySelector('.fk-ring .fg');
      if(!el){clearInterval(ui.timer);ui.timerKind='';return;}
      el.textContent=Math.floor(t.left/60000)+':'+String(Math.floor(t.left%60000/1000)).padStart(2,'0');
      if(fg){const C=+fg.getAttribute('stroke-dasharray');fg.setAttribute('stroke-dashoffset',(C*(1-t.ratio)).toFixed(1));}
      if(t.left<=0){clearInterval(ui.timer);ui.timerKind='';if(kind==='focus')finishFocus(true);else{toast(tr('Les minutes sont passées. Terminez l’étape en cours.','Time’s up. Finish the current step.'));}}},500);
  }
  function finishFocus(auto){
    const c=child(),k=fk(c),d=today();k.focus[d]=(k.focus[d]||0)+1;save();render();
    const b=document.querySelector('.fk-focus-count');window.klasCelebrate&&klasCelebrate(b,'big');
    toast(auto?tr('Session terminée. Pause de 5 minutes !','Session complete. Take a 5-minute break!'):tr('Session enregistrée.','Session saved.'));
  }

  /* ---------- Vues Parent / Élève ---------- */
  function homeView(c,k,w){
    const d=today(),todo=k.homework.filter(h=>!h.done).sort((a,b)=>a.due.localeCompare(b.due)),late=todo.filter(h=>h.due<d),tomorrow=todo.filter(h=>h.due<=addDays(d,1));
    const test=k.tests.filter(t=>t.date>=d).sort((a,b)=>a.date.localeCompare(b.date))[0];
    const av=averages(k),st=streak(k),evs=Object.keys(k.evenings).filter(x=>diff(x,d)<7&&diff(x,d)>=0).length;
    const ex=examName(c),exDays=k.examDate&&k.examDate>=d?diff(d,k.examDate):null;
    const title=w==='student'?tr('Ma journée','My day'):tr('Ce soir avec ','Tonight with ')+esc(c.name);
    const kick=c.name+' · '+c.level+' · '+(c.track==='primary'?tr('Primaire','Primary'):cycle(c)==='lycee'?tr('Lycée','Upper secondary'):tr('Collège','Lower secondary'));
    return head(kick,title,esc(longDate(d)).replace(/^./,m=>m.toUpperCase()),
        (w==='parent'?btn(tr('Écrire à l’enseignant','Write to the teacher'),'data-fk-go="fk-teacher"','secondary'):btn(tr('Réviser maintenant','Revise now'),'data-fk-go="fk-focus"','secondary'))+btn(tr('Ajouter un devoir','Add homework'),'data-fk-go="fk-homework"'))+
      '<section class="fk-streak card tk-card"><div class="fk-streak-n"><span class="fk-flame" aria-hidden="true"></span><div><strong class="fk-big">'+st+'</strong><span>'+(st>1?tr('soirs de suite','evenings in a row'):tr('soir de suite','evening in a row'))+'</span></div></div>'+weekStrip(k)+'<p class="muted">'+(st>=3?tr('Belle régularité. On garde le rythme !','Great consistency. Keep the rhythm!'):tr('Un petit moment chaque soir vaut mieux qu’une longue soirée la veille du contrôle.','A short moment every evening beats a long night before the test.'))+'</p></section>'+
      '<div class="tk-kpis">'+
        kpi(tomorrow.length,tr('devoir(s) pour demain','homework for tomorrow'),late.length?late.length+' '+tr('en retard','overdue'):tr('Rien en retard','Nothing overdue'),late.length?'warn':'')+
        kpi(test?(diff(d,test.date)===0?tr('Auj.','Today'):'J-'+diff(d,test.date)):'—',tr('prochain contrôle','next test'),test?esc(test.subject+' · '+test.title):tr('Rien de prévu','Nothing planned'))+
        kpi(av.general==null?'—':num(av.general)+'/20',tr('moyenne générale','overall average'),av.subjects.length?av.subjects.length+' '+tr('matières suivies','subjects tracked'):tr('Ajoutez une note','Add a mark'),av.general!=null&&av.general<10?'warn':'')+
        (ex?kpi(exDays!=null?'J-'+exDays:'—',ex,exDays!=null?shortDate(k.examDate):tr('Date à renseigner','Set the date')):kpi(evs+'/7',tr('soirs cette semaine','evenings this week'),tr('Objectif : 5','Goal: 5')))+
      '</div><div class="tk-grid">'+ritualCard(c,k,w)+
      '<section class="card tk-card"><h2>'+(w==='student'?tr('À faire','To do'):tr('Ses devoirs','Their homework'))+'</h2>'+(todo.length?'<ul class="fk-todo">'+todo.slice(0,6).map(h=>todoItem(h,d)).join('')+'</ul>':'<p class="muted">'+(typeof c!=='undefined'&&c&&c.track==='primary'?tr('Aucun devoir en attente. Ajoutez ceux notés dans le cahier.','No homework waiting. Add the ones written in the exercise book.'):tr('Aucun devoir en attente. Ajoutez ceux du cahier de textes.','No homework waiting. Add the ones from the planner.'))+'</p>')+btn(tr('Tous les devoirs','All homework'),'data-fk-go="fk-homework"','secondary')+'</section>'+
      (test?'<section class="card tk-card"><h2>'+tr('Préparer le contrôle','Prepare for the test')+'</h2><p><b>'+esc(test.subject)+'</b> · '+esc(test.title)+' · <span class="tk-date">'+esc(shortDate(test.date))+'</span></p>'+revisionPlan(test,d)+'</section>':'')+
      '<section class="card tk-card"><h2>'+(w==='student'?tr('Mes notes','My marks'):tr('Ses résultats','Their results'))+'</h2>'+(av.subjects.length?bars(av.subjects.slice(0,5)):'<p class="muted">'+tr('Notez les résultats des contrôles pour voir les progrès matière par matière.','Record test results to see progress subject by subject.')+'</p>')+btn(w==='student'?tr('Mes notes et objectifs','My marks and goals'):tr('Voir le suivi','See progress'),'data-fk-go="fk-progress"','secondary')+'</section>'+
      '</div>';
  }
  function todoItem(h,d){const late=!h.done&&h.due<d,dd=diff(d,h.due);return '<li class="'+(h.done?'is-done':'')+(late?' is-late':'')+'"><label><input type="checkbox" data-fk-hw="'+h.id+'" '+(h.done?'checked':'')+'><span><b>'+esc(h.subject)+'</b> '+esc(h.task)+'</span></label><time class="fk-due">'+(h.done?tr('fait','done'):late?tr('en retard','overdue'):dd===0?tr('aujourd’hui','today'):dd===1?tr('demain','tomorrow'):shortDate(h.due))+'</time></li>';}
  function revisionPlan(t,d){
    const days=Math.max(1,Math.min(4,diff(d,t.date)));
    const plan=[[tr('Relire la leçon et faire une fiche (5 lignes)','Re-read the lesson and make a 5-line summary')],[tr('Refaire 2 exercices du cahier sans la correction','Redo 2 book exercises without the answers')],[tr('Faire un exercice nouveau, chronométré','Do a new exercise against the clock')],[tr('Relire la fiche, dormir tôt','Re-read the summary, sleep early')]].slice(-days);
    return '<ol class="fk-plan">'+plan.map(([p],i)=>'<li><time>'+esc(shortDate(addDays(t.date,-(plan.length-i))))+'</time><span>'+p+'</span></li>').join('')+'</ol>';
  }
  function bars(list){return '<ul class="fk-bars">'+list.map(s=>'<li><span>'+esc(s.subject)+'</span><div class="fk-bar"><i style="--w:'+Math.max(4,Math.min(100,s.avg/20*100)).toFixed(0)+'%" class="'+(s.avg<10?'low':s.avg>=14?'high':'mid')+'"></i></div><b>'+num(s.avg)+'</b></li>').join('')+'</ul>';}

  function homeworkView(c,k,w){
    const d=today(),S=subjects(c);
    const groups=[[tr('En retard','Overdue'),k.homework.filter(h=>!h.done&&h.due<d)],[tr('Pour demain','For tomorrow'),k.homework.filter(h=>!h.done&&h.due>=d&&h.due<=addDays(d,1))],[tr('Plus tard','Later'),k.homework.filter(h=>!h.done&&h.due>addDays(d,1))],[tr('Faits','Done'),k.homework.filter(h=>h.done).slice(-5)]];
    return head(c.name+' · '+c.level,tr('Devoirs et contrôles','Homework and tests'),(c.track==='primary'?tr('Tout ce que l’enseignant a noté dans le cahier, au même endroit. Cochez quand c’est fait.','Everything the teacher wrote in the exercise book, in one place. Tick when done.'):tr('Tout ce qui est noté dans le cahier de textes, au même endroit. Cochez quand c’est fait.','Everything from the planner in one place. Tick when done.')))+
      '<div class="tk-grid"><section class="card tk-card"><h2>'+tr('Ajouter un devoir','Add homework')+'</h2><form id="fk-hw-form" class="tk-form fk-form2"><label>'+tr('Matière','Subject')+'<input name="subject" list="fk-subj" required maxlength="80"></label><label>'+tr('Pour quand ?','When for?')+'<input name="due" type="date" required value="'+addDays(d,1)+'"></label><label class="tk-wide">'+tr('Consigne','Task')+'<input name="task" required maxlength="200" placeholder="'+tr('Ex. Exercices 3 et 4 page 42','e.g. Exercises 3 and 4, page 42')+'"></label><button type="submit">'+tr('Ajouter','Add')+'</button></form></section>'+
      '<section class="card tk-card"><h2>'+tr('Annoncer un contrôle','Add a test')+'</h2><form id="fk-test-form" class="tk-form fk-form2"><label>'+tr('Matière','Subject')+'<input name="subject" list="fk-subj" required maxlength="80"></label><label>'+tr('Date','Date')+'<input name="date" type="date" required value="'+addDays(d,5)+'"></label><label class="tk-wide">'+tr('Notions à réviser','Topics to revise')+'<input name="title" required maxlength="160"></label><button type="submit">'+tr('Ajouter','Add')+'</button></form></section></div><datalist id="fk-subj">'+S.map(s=>'<option value="'+esc(s)+'"></option>').join('')+'</datalist>'+
      '<div class="tk-grid">'+groups.filter(([,l])=>l.length).map(([t,l])=>'<section class="card tk-card"><h2>'+t+' <span class="fk-count">'+l.length+'</span></h2><ul class="fk-todo">'+l.map(h=>todoItem(h,d)).join('')+'</ul></section>').join('')+
      k.tests.filter(t=>t.date>=d).sort((a,b)=>a.date.localeCompare(b.date)).map(t=>'<section class="card tk-card fk-test"><div class="tk-eval-top"><span class="tk-badge plan">'+tr('Contrôle','Test')+'</span><time class="tk-date">'+esc(shortDate(t.date))+' · J-'+diff(d,t.date)+'</time></div><h3>'+esc(t.subject)+' · '+esc(t.title)+'</h3>'+revisionPlan(t,d)+'<div class="tk-row-actions">'+btn(tr('Note reçue','Mark received'),'data-fk-test-grade="'+t.id+'"','secondary')+btn(tr('Retirer','Remove'),'data-fk-del-test="'+t.id+'"','tk-danger')+'</div></section>').join('')+'</div>';
  }

  function progressView(c,k,w){
    const av=averages(k),S=subjects(c),d=today();
    const sorted=av.subjects.slice(),strong=sorted.slice(0,2),weak=sorted.slice(-2).reverse().filter(x=>!strong.includes(x));
    let goalBox='';
    if(w==='student'||cycle(c)!=='primary'){
      const target=parseFloat(String(k.goal||'').replace(',','.')),coef=3;
      let res='';if(Number.isFinite(target)&&av.w){const need=(target*(av.w+coef)-av.sum)/coef;res=need<=0?tr('Objectif déjà atteint : gardez le cap !','Goal already reached: stay on course!'):need>20?tr('Objectif hors d’atteinte avec un seul contrôle : visez-le sur la période.','Out of reach with a single test: aim for it over the term.'):tr('Il faut environ ','You need about ')+'<b>'+num(need)+'/20</b>'+tr(' au prochain contrôle (coefficient 3).',' on the next test (weight 3).');}
      goalBox='<section class="card tk-card fk-goal"><h2>'+tr('Objectif de moyenne','Average goal')+'</h2><p class="muted">'+tr('Quelle note faut-il au prochain contrôle pour atteindre la moyenne visée ?','What mark is needed on the next test to reach the target average?')+'</p><label class="fk-goal-in">'+tr('Moyenne visée','Target average')+'<input id="fk-goal" inputmode="decimal" value="'+esc(k.goal||'')+'" placeholder="12"><span>/20</span></label><p class="fk-goal-res" aria-live="polite">'+res+'</p></section>';
    }
    return head(c.name+' · '+c.level,w==='student'?tr('Mes progrès','My progress'):tr('Ses progrès','Their progress'),(c.track==='primary'?tr('Chaque note du trimestre compte. Les points forts et ceux à travailler apparaissent tout seuls.','Every mark of the term counts. Strengths and points to work on show up on their own.'):tr('Chaque note compte, sur 20 et avec son coefficient. Les points forts et ceux à travailler apparaissent tout seuls.','Every mark counts, out of 20 with its weight. Strengths and weak spots show up automatically.')))+
      '<div class="tk-kpis">'+kpi(av.general==null?'—':num(av.general),tr('moyenne générale /20','overall average /20'),k.grades.length+' '+tr('notes','marks'),av.general!=null&&av.general<10?'warn':'')+kpi(strong[0]?num(strong[0].avg):'—',tr('meilleure matière','best subject'),strong[0]?esc(strong[0].subject):'')+kpi(weak[0]?num(weak[0].avg):'—',tr('à travailler','to work on'),weak[0]?esc(weak[0].subject):'',weak[0]&&weak[0].avg<10?'warn':'')+'</div>'+
      '<div class="tk-grid"><section class="card tk-card"><h2>'+tr('Par matière','By subject')+'</h2>'+(av.subjects.length?bars(av.subjects):'<p class="muted">'+tr('Aucune note pour le moment.','No marks yet.')+'</p>')+'</section>'+goalBox+
      '<section class="card tk-card"><h2>'+tr('Ajouter une note','Add a mark')+'</h2><form id="fk-grade-form" class="tk-form fk-form2"><label>'+tr('Matière','Subject')+'<input name="subject" list="fk-subj2" required maxlength="80"></label><label>'+tr('Type','Type')+'<input name="label" maxlength="60" value="'+tr('Interrogation','Quiz')+'"></label><label>'+tr('Note','Mark')+'<input name="value" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label><label>'+tr('Sur','Out of')+'<select name="scale"><option>20</option><option>10</option></select></label>'+(c.track==='primary'?'<input type="hidden" name="coef" value="1">':'<label>'+tr('Coefficient','Weight')+'<input name="coef" type="number" min="1" max="10" value="1"></label>')+'<label>'+tr('Date','Date')+'<input name="date" type="date" value="'+d+'"></label><button type="submit">'+tr('Enregistrer','Save')+'</button></form><datalist id="fk-subj2">'+S.map(s=>'<option value="'+esc(s)+'"></option>').join('')+'</datalist></section>'+
      '<section class="card tk-card"><h2>'+tr('Dernières notes','Latest marks')+'</h2><ul class="tk-marks">'+(k.grades.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8).map(g=>'<li><span>'+esc(shortDate(g.date)+' · '+g.subject+' · '+g.label)+'</span><b class="'+(gradeOn20(g)<10?'low':gradeOn20(g)>=14?'high':'')+'">'+num(g.value)+'/'+g.scale+'</b></li>').join('')||'<li class="muted">—</li>')+'</ul></section></div>';
  }

  function focusView(c,k){
    const d=today(),cy=cycle(c),mins=cy==='lycee'?25:15,t=ui.timerKind==='focus'?timerState():null,n=k.focus[d]||0;
    const ex=examName(c),exDays=k.examDate&&k.examDate>=d?diff(d,k.examDate):null,test=k.tests.filter(x=>x.date>=d).sort((a,b)=>a.date.localeCompare(b.date))[0];
    return head(c.name+' · '+c.level,tr('Réviser','Revise'),cy==='lycee'?tr('Des sessions de 25 minutes, une pause de 5. La méthode des étudiants qui tiennent la distance jusqu’au Bac.','25-minute sessions, 5-minute breaks. The method of students who go the distance to the Bac.'):tr('Des sessions de 15 minutes, une pause de 5. Court, mais tous les jours.','15-minute sessions, 5-minute breaks. Short, but every day.'))+
      '<div class="tk-grid"><section class="card tk-card fk-focus"><h2>'+tr('Session de concentration','Focus session')+'</h2><label>'+tr('Je révise','I’m revising')+'<input id="fk-focus-subject" list="fk-subj3" value="'+esc(ui.focusSubject||test?.subject||'')+'" placeholder="'+tr('Matière','Subject')+'"></label><datalist id="fk-subj3">'+subjects(c).map(s=>'<option value="'+esc(s)+'"></option>').join('')+'</datalist><div class="fk-focus-ring">'+ring(t,mins,180)+'</div><div class="tk-row-actions fk-center">'+(t?btn(tr('J’ai terminé','I’m done'),'data-fk-focus-done="1"')+btn(tr('Arrêter','Stop'),'data-fk-focus-stop="1"','secondary'):btn(tr('Démarrer ','Start ')+mins+' min','data-fk-timer="focus:'+mins+'"'))+'</div><p class="fk-focus-count"><b>'+n+'</b> '+tr('session(s) aujourd’hui','session(s) today')+' · '+tr('téléphone retourné, cahier ouvert.','phone face down, book open.')+'</p></section>'+
      (ex?'<section class="card tk-card fk-exam"><h2>'+tr('Cap sur le ','Eyes on the ')+esc(ex)+'</h2><div class="fk-exam-n"><strong class="fk-big">'+(exDays!=null?exDays:'—')+'</strong><span>'+tr('jours restants','days left')+'</span></div><label>'+tr('Date de la première épreuve','Date of the first paper')+'<input type="date" id="fk-exam-date" value="'+esc(k.examDate||'')+'"></label><p class="muted">'+(c.track==='primary'?tr('Renseignez la date officielle dès sa publication par le ministère de l’Éducation de base.','Enter the official date as soon as it is published by the Ministry of Basic Education.'):tr('Renseignez la date officielle dès sa publication par le ministère ou l’Office du Bac.','Enter the official date as soon as it is published by the ministry or the Office du Bac.'))+'</p>'+(exDays!=null?'<p>'+tr('Soit environ ','That’s about ')+'<b>'+Math.max(0,Math.round(exDays/7))+'</b> '+(c.track==='primary'?tr('semaines : une matière par semaine, et un sujet d’examen des années passées le week-end, avec vous.','weeks: one subject a week, and a past exam paper at the weekend, with you.'):tr('semaines : une matière à coefficient fort par semaine, et des sujets d’annales en temps limité le week-end.','weeks: one high-weight subject a week, and past papers against the clock at weekends.'))+'</p>':'')+'</section>':'')+
      (test?'<section class="card tk-card"><h2>'+tr('Prochain contrôle','Next test')+'</h2><p><b>'+esc(test.subject)+'</b> · '+esc(test.title)+'</p>'+revisionPlan(test,d)+'</section>':'')+
      '<section class="card tk-card"><h2>'+tr('Je bloque sur un exercice','I’m stuck on an exercise')+'</h2><p class="muted">'+tr('Décris la question, ce que tu as déjà essayé, puis reçois un indice avant la réponse.','Describe the question and what you’ve tried, then get a hint before the answer.')+'</p>'+btn(tr('Ouvrir « Je bloque »','Open “I’m stuck”'),'data-fk-go="block"','secondary')+'</section></div>';
  }

  function teacherMsg(c){
    const t=ui.msg,n=c.name,d=longDate(today());
    const map={
      absence:tr('Bonjour Madame, Monsieur,\nJe vous informe que mon enfant ','Dear teacher,\nI am writing to let you know that my child ')+n+' ('+c.level+')'+tr(' était absent(e) le ',' was absent on ')+d+tr(' pour raison de santé. Merci de bien vouloir excuser cette absence. Je veillerai à ce qu’il/elle rattrape la leçon.\nCordialement.',' due to illness. Please excuse this absence. I will make sure they catch up on the lesson.\nKind regards.'),
      meeting:tr('Bonjour Madame, Monsieur,\nJe souhaiterais vous rencontrer pour faire le point sur le travail de ','Dear teacher,\nI would like to meet you to discuss the work of ')+n+' ('+c.level+')'+tr('. Quel moment vous conviendrait cette semaine ?\nCordialement.','. When would suit you this week?\nKind regards.'),
      difficulty:tr('Bonjour Madame, Monsieur,\nÀ la maison, ','Dear teacher,\nAt home, ')+n+tr(' a du mal avec : … (précisez la leçon ou l’exercice). Nous avons essayé de … Auriez-vous un conseil ou un exercice pour l’aider ?\nMerci beaucoup.',' is struggling with: … (name the lesson or exercise). We tried … Would you have some advice or an exercise to help?\nThank you very much.'),
      homework:tr('Bonjour Madame, Monsieur,\n','Dear teacher,\n')+n+tr(' n’a pas bien noté le devoir pour demain en … Pourriez-vous me le préciser ?\nMerci et bonne journée.',' did not write down tomorrow’s homework in … properly. Could you let me know what it is?\nThank you, have a good day.'),
      thanks:tr('Bonjour Madame, Monsieur,\nMerci pour votre travail avec ','Dear teacher,\nThank you for your work with ')+n+tr('. Nous voyons des progrès à la maison et il/elle parle de la classe avec plaisir.\nBien cordialement.','. We can see progress at home and they talk about class with pleasure.\nWarm regards.')};
    return map[t]||'';
  }
  function teacherView(c){
    const types=[['absence',tr('Justifier une absence','Excuse an absence')],['meeting',tr('Demander un rendez-vous','Ask for a meeting')],['difficulty',tr('Signaler une difficulté','Report a difficulty')],['homework',tr('Question sur un devoir','Homework question')],['thanks',tr('Remercier','Say thank you')]];
    const m=teacherMsg(c);
    return head(c.name+' · '+c.level,tr('Écrire à l’enseignant','Write to the teacher'),tr('Un message poli et clair, prêt à envoyer par WhatsApp ou à recopier dans le carnet de correspondance.','A clear, polite message ready to send by WhatsApp or copy into the home-school notebook.'),'<button type="button" class="secondary" data-fk-go="messages">'+tr('Mes messages enregistrés','My saved messages')+'</button>')+
      '<div class="tk-family"><section class="card tk-card"><h2>'+tr('1 · Pourquoi écrire ?','1 · Why write?')+'</h2><div class="tk-chips tk-chips-wrap" role="group">'+types.map(([v,l])=>'<button type="button" data-fk-msg="'+v+'" aria-pressed="'+(ui.msg===v)+'">'+l+'</button>').join('')+'</div><p class="tk-privacy">'+tr('Remplacez les « … » par vos mots. Un message court est plus vite lu.','Replace the “…” with your own words. A short message gets read faster.')+'</p></section>'+
      '<section class="card tk-card"><h2>'+tr('2 · Relire et envoyer','2 · Review and send')+'</h2><label class="tk-msg">'+tr('Votre message','Your message')+'<textarea id="fk-msg-text" rows="8">'+esc(m)+'</textarea></label><div class="tk-row-actions">'+btn(tr('Copier','Copy'),'data-fk-copy="#fk-msg-text"')+'<a class="tk-wa" data-fk-wa="#fk-msg-text" href="https://wa.me/?text='+encodeURIComponent(m)+'" target="_blank" rel="noopener">'+tr('Ouvrir dans WhatsApp','Open in WhatsApp')+'</a></div></section></div>';
  }

  /* ---------- Accompagnateur ---------- */
  function rawLearners(){const cur=data.children[selected];return data.children.map((c,i)=>({c,i})).filter(({c})=>(c.professional&&c.professionalRole==='tutor')||(c===cur&&!c.professional));}
  function learners(){tk();return rawLearners();}
  function tk(){
    data.tutorKit||={learners:{},seeded:false};const T=data.tutorKit;T.learners||={};
    if(!cloud&&!T.seeded){T.seeded=true;
      const mine=rawLearners();if(mine.length<3){const base=mine[0]?.c||{track:'college',subsystem:'fr'};
        [['Yannick',base.track==='primary'?'CM2':'3e'],['Grâce',base.track==='primary'?'CE1':'1re D']].forEach(([n,l])=>data.children.push({id:uid(),name:n,track:/^(SIL|CP|CE|CM)/.test(l)?'primary':'college',subsystem:'fr',level:l,professional:true,professionalRole:'tutor',subjects:''}));}
      const d=today();rawLearners().forEach(({c},i)=>{const cy=cycle(c),ly=window.klasLycee&&klasLycee(c.level);const L=T.learners[c.id]={goal:cy==='primary'?tr('Lire couramment et comprendre les consignes','Read fluently and understand instructions'):ly?(ly.info.family==='STT'?tr('Sécuriser la comptabilité pour le Bac','Secure accounting for the Bac'):tr('Gagner 3 points en maths avant le Probatoire','Gain 3 points in maths before the Probatoire')):c.level==='3e'?tr('Réussir le BEPC en maths','Pass BEPC maths'):tr('Retrouver la moyenne en maths','Get back to a pass mark in maths'),start:[8,9.5,10][i%3],marks:[[i?11:10.5,-10],[i?12:11.5,-3]].map(([v,o])=>({value:v,date:addDays(d,o)})),parent:[tr('Maman de ','Mother of '),tr('Papa de ','Father of '),tr('Tante de ','Aunt of ')][i%3]+c.name,fee:[15000,12000,20000][i%3],day:[1,3,5][i%3],sessions:[],payments:{}};
        const tops=cy==='primary'?[tr('Les sons complexes','Complex sounds'),tr('Lire une consigne','Reading an instruction'),tr('La multiplication','Multiplication')]:ly&&ly.info.family==='STT'?[tr('Le bilan','The balance sheet'),tr('Les amortissements','Depreciation'),tr('Les amortissements · suite','Depreciation · continued')]:[tr('Les fractions','Fractions'),tr('Les équations','Equations'),tr('Les équations · suite','Equations · continued')];L.sessions=[[-14,tops[0],'reussi'],[-7,tops[1],'partiel'],[-2,tops[2],'reussi']].map(([o,tp,r])=>({id:uid(),date:addDays(d,o-i),minutes:60,topic:tp,result:r,next:tr('Problèmes à deux étapes','Two-step problems')}));
        L.payments[d.slice(0,7)]={paid:i===1};});}
    return T;
  }
  function learner(c){const T=tk();return T.learners[c.id]||(T.learners[c.id]={goal:'',start:null,marks:[],parent:'',fee:0,day:1,sessions:[],payments:{}});}
  const RES={reussi:[tr('Réussi','Achieved'),'ok'],partiel:[tr('En partie','Partly'),'plan'],reprendre:[tr('À reprendre','To revisit'),'warn']};
  function tutorHome(){
    const d=today(),month=d.slice(0,7),list=learners(),T=tk();
    const wk=list.reduce((n,{c})=>n+learner(c).sessions.filter(s=>diff(s.date,d)<7&&diff(s.date,d)>=0).length,0);
    const due=list.filter(({c})=>!learner(c).payments[month]?.paid).reduce((s,{c})=>s+(+learner(c).fee||0),0);
    const dow=(new Date(d+'T12:00:00').getDay()+6)%7+1;
    const todayL=list.filter(({c})=>+learner(c).day===dow);
    return '<div class="tk">'+head(tr('ACCOMPAGNATEUR · ','LEARNING COACH · ')+list.length+' '+tr('élèves','learners'),tr('Aujourd’hui · mes accompagnements','Today · my learners'),esc(longDate(d)).replace(/^./,m=>m.toUpperCase()),btn(tr('Noter une séance','Log a session'),'data-fk-go="fk-learners"')+btn(tr('Bilan aux parents','Report to parents'),'data-fk-go="fk-report"','secondary'))+
      '<div class="tk-kpis">'+kpi(list.length,tr('élèves suivis','learners'),'')+kpi(wk,tr('séances cette semaine','sessions this week'),'')+kpi(num(due/1000,1)+' k',tr('FCFA à encaisser ce mois','FCFA due this month'),due?tr('Rappels prêts','Reminders ready'):tr('Tout est réglé','All paid'),due?'warn':'')+kpi(todayL.length,tr('séance(s) prévue(s) aujourd’hui','session(s) planned today'),todayL.map(({c})=>esc(c.name)).join(', '))+'</div>'+
      '<div class="fk-learner-grid">'+list.map(({c,i})=>{const L=learner(c),last=L.sessions.slice().sort((a,b)=>b.date.localeCompare(a.date))[0],lm=L.marks[L.marks.length-1],delta=lm&&L.start!=null?lm.value-L.start:null;return '<article class="card tk-card fk-learner"><div class="fk-learner-top"><span class="fk-avatar" aria-hidden="true">'+esc(c.name[0])+'</span><div><h2 class="fk-name">'+esc(c.name)+'</h2><small>'+esc(c.level)+' · '+esc(L.goal||tr('Objectif à définir','Goal to set'))+'</small></div></div><div class="fk-progress-line"><span>'+tr('Départ','Start')+' <b>'+(L.start!=null?num(L.start):'—')+'</b></span><span class="fk-arrow" aria-hidden="true">→</span><span>'+tr('Aujourd’hui','Now')+' <b>'+(lm?num(lm.value):'—')+'</b></span>'+(delta!=null?'<span class="fk-delta '+(delta>=0?'up':'down')+'">'+(delta>=0?'+':'')+num(delta)+'</span>':'')+'</div>'+(last?'<p class="muted">'+tr('Dernière séance : ','Last session: ')+esc(shortDate(last.date)+' · '+last.topic)+' <span class="tk-badge '+RES[last.result][1]+'">'+RES[last.result][0]+'</span></p>':'')+'<div class="tk-row-actions">'+btn(tr('Fiche','Open'),'data-fk-learner="'+c.id+'"','secondary')+btn(tr('Préparer la séance','Plan the session'),'data-fk-prep-learner="'+i+'"','secondary')+'</div></article>';}).join('')+'</div></div>';
  }
  function learnersView(){
    const list=learners();if(!ui.learner||!list.some(({c})=>c.id===ui.learner))ui.learner=list[0]?.c.id||'';
    const sel=list.find(({c})=>c.id===ui.learner);if(!sel)return head('',tr('Mes élèves','My learners'),tr('Ajoutez un élève depuis « Mes espaces ».','Add a learner from “My spaces”.'));
    const c=sel.c,L=learner(c),d=today();
    return head(tr('ACCOMPAGNATEUR','LEARNING COACH'),tr('Mes élèves','My learners'),tr('Un objectif, un journal de séances, des progrès mesurés.','A goal, a session log, measured progress.'))+
      '<div class="tk-chips tk-chips-wrap" role="group" aria-label="'+tr('Élève','Learner')+'">'+list.map(({c:x})=>'<button type="button" data-fk-learner="'+x.id+'" aria-pressed="'+(x.id===ui.learner)+'">'+esc(x.name)+' · '+esc(x.level)+'</button>').join('')+'</div>'+
      '<div class="tk-grid"><section class="card tk-card"><h2>'+tr('Objectif et repères','Goal and baseline')+'</h2><form id="fk-learner-form" class="tk-form fk-form2"><label class="tk-wide">'+tr('Objectif','Goal')+'<input name="goal" value="'+esc(L.goal)+'" maxlength="140"></label><label>'+tr('Note de départ /20','Starting mark /20')+'<input name="start" inputmode="decimal" value="'+esc(L.start??'')+'"></label><label>'+tr('Tarif mensuel (FCFA)','Monthly fee (FCFA)')+'<input name="fee" type="number" min="0" step="500" value="'+esc(L.fee||'')+'"></label><label>'+tr('Jour de séance','Session day')+'<select name="day">'+[tr('Lundi','Monday'),tr('Mardi','Tuesday'),tr('Mercredi','Wednesday'),tr('Jeudi','Thursday'),tr('Vendredi','Friday'),tr('Samedi','Saturday'),tr('Dimanche','Sunday')].map((n,i)=>'<option value="'+(i+1)+'" '+(+L.day===i+1?'selected':'')+'>'+n+'</option>').join('')+'</select></label><label>'+tr('Parent à contacter','Parent contact')+'<input name="parent" value="'+esc(L.parent)+'" maxlength="80"></label><label>'+tr('Nouvelle note scolaire /20','New school mark /20')+'<input name="mark" inputmode="decimal" placeholder="—"></label><button type="submit">'+tr('Enregistrer','Save')+'</button></form></section>'+
      '<section class="card tk-card"><h2>'+tr('Noter la séance','Log the session')+'</h2><form id="fk-session-form" class="tk-form fk-form2"><label>'+tr('Date','Date')+'<input name="date" type="date" value="'+d+'"></label><label>'+tr('Durée (min)','Length (min)')+'<input name="minutes" type="number" min="15" max="240" value="60"></label><label class="tk-wide">'+tr('Notion travaillée','Topic covered')+'<input name="topic" required maxlength="140"></label><label>'+tr('Résultat observé','Observed result')+'<select name="result">'+Object.entries(RES).map(([v,[l]])=>'<option value="'+v+'">'+l+'</option>').join('')+'</select></label><label class="tk-wide">'+tr('Prochaine étape','Next step')+'<input name="next" maxlength="140"></label><button type="submit">'+tr('Ajouter au journal','Add to the log')+'</button></form></section></div>'+
      '<section class="card tk-card"><h2>'+tr('Journal des séances','Session log')+'</h2><ul class="fk-log">'+(L.sessions.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(s=>'<li><time>'+esc(shortDate(s.date))+'</time><div><b>'+esc(s.topic)+'</b><small>'+esc(s.minutes+' min'+(s.next?' · '+tr('ensuite : ','next: ')+s.next:''))+'</small></div><span class="tk-badge '+RES[s.result][1]+'">'+RES[s.result][0]+'</span></li>').join('')||'<li class="muted">'+tr('Aucune séance notée.','No sessions logged.')+'</li>')+'</ul></section>';
  }
  function paymentsView(){
    const d=today();ui.month||=d.slice(0,7);const m=ui.month,list=learners();
    const rows=list.map(({c})=>{const L=learner(c),p=L.payments[m]||{},n=L.sessions.filter(s=>s.date.slice(0,7)===m).length;return {c,L,p,n};});
    const expected=rows.reduce((s,r)=>s+(+r.L.fee||0),0),got=rows.filter(r=>r.p.paid).reduce((s,r)=>s+(+r.L.fee||0),0);
    const label=new Date(m+'-15T12:00:00').toLocaleDateString(fr()?'fr-FR':'en-GB',{month:'long',year:'numeric'});
    return head(tr('ACCOMPAGNATEUR','LEARNING COACH'),tr('Paiements','Payments'),tr('Qui a réglé, combien de séances ce mois-ci, et un rappel courtois quand il le faut.','Who has paid, how many sessions this month, and a polite reminder when needed.'),'<label class="fk-month">'+tr('Mois','Month')+'<input type="month" id="fk-month" value="'+m+'"></label>')+
      '<div class="tk-kpis">'+kpi(num(got/1000,1)+' k',tr('FCFA encaissés','FCFA received'),esc(label))+kpi(num((expected-got)/1000,1)+' k',tr('FCFA en attente','FCFA pending'),'',expected-got?'warn':'')+kpi(expected?Math.round(got/expected*100)+' %':'—',tr('du mois réglé','of the month paid'),'')+'</div>'+
      '<section class="card tk-card"><div class="tk-scroll" tabindex="0" role="region" aria-label="'+tr('Tableau','Table')+'"><table class="tk-results"><thead><tr><th>'+tr('Élève','Learner')+'</th><th>'+tr('Séances','Sessions')+'</th><th>'+tr('Montant','Amount')+'</th><th>'+tr('Statut','Status')+'</th><th><span class="sr">'+tr('Action','Action')+'</span></th></tr></thead><tbody>'+rows.map(r=>'<tr><td><b>'+esc(r.c.name)+'</b><br><small class="muted">'+esc(r.L.parent||'')+'</small></td><td>'+r.n+'</td><td>'+fcfa(+r.L.fee||0)+'</td><td><label class="fk-paid"><input type="checkbox" data-fk-paid="'+r.c.id+'" '+(r.p.paid?'checked':'')+'> '+(r.p.paid?tr('Réglé','Paid'):tr('En attente','Pending'))+'</label></td><td>'+(r.p.paid?'':btn(tr('Rappel','Reminder'),'data-fk-remind="'+r.c.id+'"','secondary'))+'</td></tr>').join('')+'</tbody></table></div><p class="muted">'+tr('Mobile Money : notez la référence de transaction dans votre carnet. Klas 237 n’encaisse rien à votre place.','Mobile Money: keep the transaction reference in your notebook. Klas 237 never collects money for you.')+'</p></section>'+
      (ui.remind?'<section class="card tk-card"><h2>'+tr('Rappel courtois','Polite reminder')+'</h2><textarea id="fk-remind-text" rows="6">'+esc(ui.remind)+'</textarea><div class="tk-row-actions">'+btn(tr('Copier','Copy'),'data-fk-copy="#fk-remind-text"')+'<a class="tk-wa" data-fk-wa="#fk-remind-text" href="https://wa.me/?text='+encodeURIComponent(ui.remind)+'" target="_blank" rel="noopener">'+tr('Ouvrir dans WhatsApp','Open in WhatsApp')+'</a></div></section>':'');
  }
  function reportText(c){
    const L=learner(c),d=today(),recent=L.sessions.filter(s=>diff(s.date,d)<=14).sort((a,b)=>a.date.localeCompare(b.date)),lm=L.marks[L.marks.length-1];
    return tr('Bonjour,\nVoici le point sur l’accompagnement · ','Hello,\nHere is an update on ')+c.name+' ('+c.level+')'+tr(' ces deux dernières semaines.\n\n',' over the last two weeks.\n\n')+tr('Objectif : ','Goal: ')+(L.goal||'…')+'\n'+(recent.length?tr('Séances : ','Sessions: ')+recent.length+'\n'+recent.map(s=>'• '+shortDate(s.date)+' – '+s.topic+' : '+RES[s.result][0].toLowerCase()).join('\n')+'\n':'')+(lm&&L.start!=null?tr('Note de départ : ','Starting mark: ')+num(L.start)+'/20 → '+tr('dernière note : ','latest mark: ')+num(lm.value)+'/20\n':'')+'\n'+tr('Prochaine étape : ','Next step: ')+((recent[recent.length-1]||{}).next||'…')+'\n'+tr('À la maison : 10 minutes de relecture du cahier chaque soir l’aideront beaucoup.\n\nBien cordialement.','At home: 10 minutes reviewing the exercise book each evening will help a lot.\n\nKind regards.');
  }
  function reportView(){
    const list=learners();if(!ui.report||!list.some(({c})=>c.id===ui.report))ui.report=list[0]?.c.id||'';const sel=list.find(({c})=>c.id===ui.report);
    const txt=sel?reportText(sel.c):'';
    return head(tr('ACCOMPAGNATEUR','LEARNING COACH'),tr('Bilan aux parents','Report to parents'),tr('Le bilan se rédige tout seul à partir de votre journal de séances. Relisez, ajustez, envoyez.','The report writes itself from your session log. Read, adjust, send.'))+
      '<div class="tk-chips tk-chips-wrap" role="group">'+list.map(({c})=>'<button type="button" data-fk-report="'+c.id+'" aria-pressed="'+(c.id===ui.report)+'">'+esc(c.name)+'</button>').join('')+'</div><section class="card tk-card"><label class="tk-msg">'+tr('Bilan','Report')+'<textarea id="fk-report-text" rows="14">'+esc(txt)+'</textarea></label><div class="tk-row-actions">'+btn(tr('Copier','Copy'),'data-fk-copy="#fk-report-text"')+'<a class="tk-wa" data-fk-wa="#fk-report-text" href="https://wa.me/?text='+encodeURIComponent(txt)+'" target="_blank" rel="noopener">'+tr('Ouvrir dans WhatsApp','Open in WhatsApp')+'</a></div></section>';
  }

  /* ---------- Navigation ---------- */
  const baseGroups=routeGroups;
  const merge=(main,base)=>{const ids=new Set(main.map(r=>r[0]));const extra=[...base.main,...base.extra].filter(r=>!ids.has(r[0]));return {main,extra};};
  routeGroups=function(a,course){
    const base=baseGroups(a,course);
    if(a==='teacher')return base;
    if(a==='tutor')return merge([['staff','Aujourd’hui','Today'],['fk-learners','Mes élèves','My learners'],['fk-payments','Paiements','Payments'],['fk-report','Bilan aux parents','Report to parents'],['build-course','Préparer une séance','Plan a session']],base);
    if(a==='student')return merge([['fk-home','Ma journée','My day'],['fk-homework','Devoirs et contrôles','Homework and tests'],['fk-progress','Mes progrès','My progress'],['fk-focus','Réviser','Revise'],['block','Je bloque','I’m stuck']],base);
    if(course==='college')return merge([['fk-home','Ce soir','Tonight'],['fk-homework','Devoirs et contrôles','Homework and tests'],['fk-progress','Ses progrès','Their progress'],['fk-teacher','Écrire à l’enseignant','Write to the teacher'],['block','Ses difficultés','Where help is needed']],base);
    return merge([['fk-home','Ce soir','Tonight'],['fk-homework','Devoirs et contrôles','Homework and tests'],['fk-progress','Ses progrès','Their progress'],['search','Je l’aide à comprendre','Help them understand'],['fk-teacher','Écrire à l’enseignant','Write to the teacher']],base);
  };
  if(typeof audienceStart==='function'){const bs=audienceStart;audienceStart=function(a,course){return a==='teacher'||a==='tutor'?bs(a,course):'fk-home';};}
  const firstOpen=new Set();

  /* ---------- Rendu ---------- */
  const prevRender=render;
  render=function(){
    const w0=who(),c0=child();
    if(w0&&w0!=='tutor'&&c0&&!c0.professional){const key=c0.id+':'+w0;if(!firstOpen.has(key)&&['home','parent-summary','college'].includes(page)){firstOpen.add(key);page='fk-home';}}
    prevRender();
    const w=who(),c=child(),screen=$('#screen');if(!w||!screen)return;
    if(w==='tutor'){if(!['staff','fk-learners','fk-payments','fk-report'].includes(page))return;screen.innerHTML=page==='staff'?tutorHome():'<div class="tk">'+(page==='fk-learners'?learnersView():page==='fk-payments'?paymentsView():reportView())+'</div>';return;}
    if(!FK.includes(page)||!c)return;
    if(page==='fk-focus'&&w!=='student')page='fk-home';
    const k=fk(c);
    screen.innerHTML='<div class="tk fk fk-'+w+'">'+(page==='fk-home'?homeView(c,k,w):page==='fk-homework'?homeworkView(c,k,w):page==='fk-progress'?progressView(c,k,w):page==='fk-teacher'?teacherView(c):focusView(c,k))+'</div>';
    document.querySelectorAll('#nav [data-route]').forEach(b=>{const on=b.dataset.route===page;b.classList.toggle('active',on);on?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current');});
  };
  const rerender=()=>{save();render();};
  const go=r=>{if(typeof openRoute==='function')openRoute(r);else{page=r;render();}};
  async function copy(text,ok){try{await navigator.clipboard.writeText(text);toast(ok||tr('Copié.','Copied.'));}catch(e){const t=document.createElement('textarea');t.value=text;document.body.append(t);t.select();try{document.execCommand('copy');toast(ok||tr('Copié.','Copied.'));}catch(_){toast(tr('Sélectionnez le texte pour le copier.','Select the text to copy it.'));}t.remove();}}
  const parseNum=v=>{const n=Number(String(v||'').replace(',','.').trim());return String(v||'').trim()!==''&&Number.isFinite(n)?n:null;};

  function onClick(ev){
    const w=who();if(!w)return;const t=ev.target.closest('button,a');if(!t)return;const D=t.dataset;
    const inFk=FK.includes(page)||(w==='tutor'&&page==='staff');if(!inFk)return;
    const c=child();
    if(D.fkGo){go(D.fkGo);return;}
    if(D.fkCopy){copy($(D.fkCopy).value,tr('Copié. Collez-le dans WhatsApp.','Copied. Paste it into WhatsApp.'));return;}
    if(w==='tutor'){
      if(D.fkLearner){ui.learner=D.fkLearner;go('fk-learners');return;}
      if(D.fkPrepLearner!=null){selected=+D.fkPrepLearner;const x=data.children[selected];lessonDraft={level:x.level,group:x.name,subject:'',topic:(learner(x).sessions.slice(-1)[0]||{}).next||'',duration:'60'};go('build-course');return;}
      if(D.fkRemind){const x=data.children.find(y=>y.id===D.fkRemind),L=learner(x);const label=new Date(ui.month+'-15T12:00:00').toLocaleDateString(fr()?'fr-FR':'en-GB',{month:'long'});ui.remind=tr('Bonjour,\nJ’espère que vous allez bien. Petit rappel pour les séances d’accompagnement du mois de ','Hello,\nI hope you are well. A gentle reminder about the sessions for ')+label+' ('+x.name+') : '+fcfa(+L.fee||0)+tr('. Vous pouvez régler par Orange Money ou MTN MoMo. Merci beaucoup et bonne journée.','. You can pay by Orange Money or MTN MoMo. Thank you and have a good day.');render();return;}
      if(D.fkReport){ui.report=D.fkReport;render();return;}
      return;
    }
    const k=fk(c);
    if(D.fkStep){ui.step=Math.min(3,ui.step+1);render();const cur=document.querySelector('.fk-steps .is-done:last-of-type .fk-step-n');window.klasCelebrate&&klasCelebrate(cur||t);return;}
    if(D.fkTimer){const [kind,m]=D.fkTimer.split(':');if(kind==='focus')ui.focusSubject=$('#fk-focus-subject')?.value||'';startTimer(kind,+m);render();return;}
    if(D.fkMood){k.evenings[today()]={mood:D.fkMood,at:new Date().toISOString()};ui.step=0;clearInterval(ui.timer);ui.timerKind='';rerender();window.klasCelebrate&&klasCelebrate(document.querySelector('.fk-medal')||document.querySelector('.fk-streak'),'big');toast(tr('Soirée enregistrée. Belle série !','Evening saved. Nice streak!'));return;}
    if(D.fkRitualReset){delete k.evenings[today()];ui.step=0;rerender();return;}
    if(D.fkFocusDone){clearInterval(ui.timer);ui.timerKind='';finishFocus(false);return;}
    if(D.fkFocusStop){clearInterval(ui.timer);ui.timerKind='';render();return;}
    if(D.fkDelTest){k.tests=k.tests.filter(x=>x.id!==D.fkDelTest);rerender();return;}
    if(D.fkTestGrade){const x=k.tests.find(y=>y.id===D.fkTestGrade);ui.prefill={subject:x.subject,label:x.title};go('fk-progress');setTimeout(()=>{const f=$('#fk-grade-form');if(f){f.elements.subject.value=x.subject;f.elements.label.value=x.title;f.elements.value.focus();}},60);return;}
    if(D.fkMsg){ui.msg=D.fkMsg;render();return;}
  }
  function onChange(ev){
    const w=who();if(!w)return;const t=ev.target,D=t.dataset;
    if(w==='tutor'){if(D.fkPaid){const L=learner(data.children.find(y=>y.id===D.fkPaid));L.payments[ui.month]={paid:t.checked,at:today()};if(t.checked){ui.remind='';}rerender();if(t.checked)window.klasCelebrate&&klasCelebrate(document.querySelector('[data-fk-paid="'+D.fkPaid+'"]'));return;}if(t.id==='fk-month'){ui.month=t.value||today().slice(0,7);ui.remind='';render();}return;}
    const c=child();if(!c||!FK.includes(page))return;const k=fk(c);
    if(D.fkHw){const h=k.homework.find(x=>x.id===D.fkHw);h.done=t.checked;h.doneDate=t.checked?today():'';rerender();if(t.checked){const el=document.querySelector('[data-fk-hw="'+h.id+'"]');window.klasCelebrate&&klasCelebrate(el);}return;}
    if(t.id==='fk-exam-date'){k.examDate=t.value;rerender();return;}
    if(t.id==='fk-goal'){k.goal=t.value.slice(0,5);rerender();setTimeout(()=>{const g=$('#fk-goal');g&&g.focus();},0);return;}
  }
  function onInput(ev){const t=ev.target;if(t.tagName==='TEXTAREA'){const a=document.querySelector('[data-fk-wa="#'+t.id+'"]');if(a)a.href='https://wa.me/?text='+encodeURIComponent(t.value);}}
  function onSubmit(ev){
    const w=who();if(!w)return;const f=ev.target;
    if(w==='tutor'){const c=data.children.find(y=>y.id===ui.learner);if(!c)return;const L=learner(c);
      if(f.id==='fk-learner-form'){ev.preventDefault();const v=Object.fromEntries(new FormData(f));L.goal=v.goal.trim();L.start=parseNum(v.start);L.fee=+v.fee||0;L.day=+v.day||1;L.parent=v.parent.trim();const m=parseNum(v.mark);if(m!=null&&m>=0&&m<=20)L.marks.push({value:m,date:today()});rerender();toast(tr('Fiche enregistrée.','Saved.'));return;}
      if(f.id==='fk-session-form'){ev.preventDefault();const v=Object.fromEntries(new FormData(f));L.sessions.push({id:uid(),date:v.date||today(),minutes:+v.minutes||60,topic:v.topic.trim(),result:v.result,next:v.next.trim()});rerender();toast(tr('Séance ajoutée au journal.','Session logged.'));return;}
      return;}
    const c=child();if(!c||!FK.includes(page))return;const k=fk(c);
    if(f.id==='fk-hw-form'){ev.preventDefault();const v=Object.fromEntries(new FormData(f));k.homework.push({id:uid(),subject:v.subject.trim(),task:v.task.trim(),due:v.due,done:false});rerender();toast(tr('Devoir ajouté.','Homework added.'));return;}
    if(f.id==='fk-test-form'){ev.preventDefault();const v=Object.fromEntries(new FormData(f));k.tests.push({id:uid(),subject:v.subject.trim(),title:v.title.trim(),date:v.date});rerender();toast(tr('Contrôle ajouté, avec son plan de révision.','Test added, with its revision plan.'));return;}
    if(f.id==='fk-grade-form'){ev.preventDefault();const v=Object.fromEntries(new FormData(f));const val=parseNum(v.value),sc=+v.scale||20;if(val==null||val<0||val>sc){toast(tr('Note hors barème.','Mark outside the scale.'));return;}k.grades.push({id:uid(),subject:v.subject.trim(),label:v.label.trim()||tr('Note','Mark'),value:val,scale:sc,coef:+v.coef||1,date:v.date||today()});rerender();toast(tr('Note enregistrée.','Mark saved.'));if(val/sc>=.7)window.klasCelebrate&&klasCelebrate(document.querySelector('.tk-kpi'),'big');return;}
  }
  const screen=document.getElementById('screen');
  if(screen){screen.addEventListener('click',onClick);screen.addEventListener('change',onChange);screen.addEventListener('input',onInput);screen.addEventListener('submit',onSubmit);}
})();
