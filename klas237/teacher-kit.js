/* Klas 237 · Le cartable de l'enseignant (primaire, collège, lycée).
   Une classe = un espace : élèves, appel, évaluations et notes, progression annuelle
   (cahier de textes) et relais vers les familles. Tout reste dans le compte de
   l'enseignant ; aucun message n'est envoyé automatiquement. */
(function(){
  'use strict';
  const PAGES=['staff','tk-students','tk-evals','tk-year','tk-families'];
  const ui={appel:false,filter:'all',query:'',openEval:null,resultsEval:null,period:'',family:{type:'homework',student:'',eval:''}};
  const fr=()=>uiLanguage!=='en';
  const num=(n,d=1)=>Number.isFinite(n)?n.toLocaleString(fr()?'fr-FR':'en-GB',{maximumFractionDigits:d,minimumFractionDigits:0}):'—';
  const today=()=>typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10);
  const addDays=(d,n)=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10);};
  const daysBetween=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5);
  const longDate=d=>new Date(d+'T12:00:00').toLocaleDateString(fr()?'fr-FR':'en-GB',{weekday:'long',day:'numeric',month:'long'});
  const shortDate=d=>d?new Date(d+'T12:00:00').toLocaleDateString(fr()?'fr-FR':'en-GB',{day:'numeric',month:'short'}):'';
  const uid=()=>typeof klasId==='function'?klasId():Math.random().toString(36).slice(2);

  function cls(){const c=data.children[selected];return role==='teacher'&&c&&c.professional?c:null;}
  const secondary=c=>c.track==='college';
  function periods(c){return secondary(c)?[1,2,3,4,5,6].map(n=>tr('Séquence ','Sequence ')+n):[1,2,3].map(n=>tr('Trimestre ','Term ')+n);}
  function evalTypes(c){
    const exam=window.klasExam?klasExam(c.level):'';const ex=c.level==='CM2'||c.level==='Class 6'?'CEP':exam;
    const base=secondary(c)?[tr('Interrogation écrite','Written quiz'),tr('Devoir surveillé','Supervised test'),tr('Évaluation séquentielle','Sequence assessment'),tr('Travaux pratiques','Practical work')]:[tr('Interrogation','Quiz'),tr('Devoir','Test'),tr('Évaluation','Assessment'),tr('Composition','Term exam')];
    return ex?[...base,tr('Examen blanc · ','Mock exam · ')+ex]:base;
  }
  function subjects(c){
    try{if(secondary(c)){const T=window.klasTeach?klasTeach.taught(c):[];return T.length?T:collegeSubjects(c.level);}if(typeof primarySubjects==='function')return primarySubjects(c);}catch(e){}
    return ['Français','Mathématiques','Sciences','Histoire','Géographie','Anglais'];
  }

  /* ---------- Données ---------- */
  function kit(c){
    data.teacherKit||={};
    const k=data.teacherKit[c.id]||(data.teacherKit[c.id]={students:[],attendance:{},evals:[],lessons:[],seeded:false});
    for(const key of ['students','evals','lessons'])if(!Array.isArray(k[key]))k[key]=[];
    if(!k.attendance||typeof k.attendance!=='object')k.attendance={};
    if(!cloud&&!k.seeded){seed(c,k);}
    return k;
  }
  function seed(c,k){
    k.seeded=true;
    const names=['Aïcha N.','Brice T.','Carine M.','Daniel E.','Estelle K.','Franck O.','Grâce B.','Hervé D.','Inès F.','Joël A.','Kevin S.','Laure E.','Mireille T.','Nathan B.'];
    k.students=names.map(n=>({id:uid(),name:n,status:'ras',notes:[]}));
    const s=k.students;
    s[3].status='suivre';s[3].notes.push({id:uid(),date:addDays(today(),-3),type:tr('Travail','Work'),text:tr('Ne rend pas les exercices de calcul. À voir avec la famille.','Not handing in arithmetic exercises. Check with the family.')});
    s[8].status='progres';s[8].notes.push({id:uid(),date:addDays(today(),-6),type:tr('Progrès','Progress'),text:tr('Participe davantage depuis la mise en binôme.','Participates more since working in pairs.')});
    s[11].status='suivre';s[11].notes.push({id:uid(),date:addDays(today(),-2),type:tr('Comportement','Behaviour'),text:tr('Bavardages répétés en fin de journée.','Repeated chatting at the end of the day.')});
    const T=secondary(c)&&window.klasTeach?klasTeach.taught(c):[];
    const sub=secondary(c)?(T[0]||(subjects(c)[0])):tr('Mathématiques','Mathematics'),sub2=secondary(c)?(T[1]||sub):tr('Français','French');
    const p=periods(c)[0];
    const marks=[14,9.5,12,6,16.5,11,13,8,15,10.5,7,12.5,17,9];
    const L=(fr,en)=>tr(fr,en);
    const PLANS={
      maths:[L('Équations du premier degré','First-degree equations'),L('Inéquations','Inequalities'),L('Fonctions affines','Linear functions'),L('Statistiques','Statistics'),L('Théorème de Thalès','Intercept theorem'),L('Systèmes d’équations','Systems of equations')],
      pc:[L('Mélanges et corps purs','Mixtures and pure substances'),L('La masse volumique','Density'),L('Le courant électrique','Electric current'),L('La tension électrique','Voltage'),L('Atomes et ions','Atoms and ions'),L('Les réactions chimiques','Chemical reactions')],
      svt:[L('La cellule','The cell'),L('La nutrition des végétaux','Plant nutrition'),L('La digestion','Digestion'),L('La respiration','Breathing'),L('La reproduction','Reproduction'),L('Les écosystèmes','Ecosystems')],
      info:[L('Les algorithmes','Algorithms'),L('Les variables','Variables'),L('Les structures conditionnelles','Conditionals'),L('Les boucles','Loops'),L('Les tableaux','Arrays'),L('Les réseaux','Networks')],
      compta:[L('Le bilan','The balance sheet'),L('Le compte de résultat','The income statement'),L('Les amortissements','Depreciation'),L('La TVA','VAT'),L('Les provisions','Provisions'),L('Les travaux de fin d’exercice','Year-end entries')],
      eco:[L('L’activité économique','Economic activity'),L('La production','Production'),L('La consommation','Consumption'),L('La monnaie','Money'),L('Le marché','The market'),L('La croissance économique','Economic growth')],
      droit:[L('Les sources du droit','Sources of law'),L('Les personnes juridiques','Legal persons'),L('Les biens','Property'),L('Le contrat','Contracts'),L('La responsabilité civile','Civil liability'),L('L’entreprise et le droit','Business law')],
      commerce:[L('La mercatique','Marketing'),L('L’étude de marché','Market research'),L('Le prix de vente','Selling price'),L('La distribution','Distribution'),L('La communication commerciale','Marketing communication'),L('La relation client','Customer relations')],
      lettres:[L('Le résumé de texte','Text summary'),L('La dissertation','The essay'),L('Le commentaire composé','Commentary'),L('L’argumentation','Argumentation'),L('La poésie','Poetry'),L('Le roman africain','The African novel')],
      langues:['Reading comprehension','Essay writing','Tenses','Reported speech','Conditionals','Oral presentation'],
      hg:[L('La Première Guerre mondiale','World War I'),L('La décolonisation','Decolonisation'),L('Le Cameroun sous tutelle','Cameroon under trusteeship'),L('Le relief du Cameroun','Cameroon’s landforms'),L('Les climats','Climates'),L('La population','Population')],
      eps:[L('L’endurance','Endurance'),L('La vitesse','Speed'),L('Les sauts','Jumping'),L('Le football','Football'),L('Le handball','Handball'),L('La gymnastique','Gymnastics')],
      primary:[L('Les nombres jusqu’à 10 000','Numbers up to 10,000'),L('Additions et soustractions posées','Column addition and subtraction'),L('La multiplication','Multiplication'),L('Les mesures de longueur','Length measures'),L('La division','Division'),L('Les fractions simples','Simple fractions')]
    };
    function planKey(subject){
      const d=window.klasTeach?klasTeach.domainOf(subject):'maths';
      if(d==='tertiaire'){const x=String(subject).toLowerCase();return /compta|gestion|fiscal|financi|administrat|bureautique|organisation/.test(x)?'compta':/(é|e)conom|sociolog/.test(x)?'eco':/droit/.test(x)?'droit':'commerce';}
      return PLANS[d]?d:'maths';
    }
    const topics=secondary(c)?PLANS[planKey(sub)]:PLANS.primary,topics2=secondary(c)?PLANS[planKey(sub2)]:[tr('Conjugaison : le présent','Verb tenses: present')];
    const t2=sub2===sub?topics2[3]:topics2[0];
    k.evals.push({id:uid(),type:evalTypes(c)[1],period:p,subject:sub,title:secondary(c)?topics[0]:topics[1],date:addDays(today(),-9),scale:20,coef:2,marks:Object.fromEntries(s.map((st,i)=>[st.id,i===5?'abs':String(marks[i])])),appreciations:{}});
    k.evals.push({id:uid(),type:evalTypes(c)[2],period:p,subject:sub,title:secondary(c)?topics[2]:topics[2],date:addDays(today(),4),scale:20,coef:3,marks:{},appreciations:{}});
    k.evals.push({id:uid(),type:evalTypes(c)[0],period:p,subject:sub2,title:t2,date:addDays(today(),-1),scale:10,coef:1,marks:{},appreciations:{}});
    const plan=topics.map((t,i)=>[t,i<4?(i<2?0:i===2?0:1):i===4?1:2,i<2]);
    k.lessons=plan.map(([t,pi,done],i)=>({id:uid(),source:'klas',title:t,subject:sub,period:periods(c)[pi],done,doneDate:done?addDays(today(),-14+i*4):'',homework:''}));
  }
  const studentById=(k,id)=>k.students.find(s=>s.id===id);
  function markValue(e,id){const v=e.marks[id];if(v==null||v===''||v==='abs')return null;const n=Number(String(v).replace(',','.'));return Number.isFinite(n)?n:null;}
  const graded=e=>Object.values(e.marks).some(v=>v!==''&&v!=null);
  function stats(k,e){
    const vals=k.students.map(s=>markValue(e,s.id)).filter(v=>v!=null).sort((a,b)=>a-b);
    if(!vals.length)return null;
    const sum=vals.reduce((a,b)=>a+b,0),mid=Math.floor(vals.length/2);
    const half=e.scale/2,high=e.scale*.75;
    const bins=[0,0,0,0];vals.forEach(v=>bins[Math.min(3,Math.floor(v/(e.scale/4)))]++);
    return {n:vals.length,mean:sum/vals.length,median:vals.length%2?vals[mid]:(vals[mid-1]+vals[mid])/2,min:vals[0],max:vals[vals.length-1],pass:vals.filter(v=>v>=half).length,bins,
      low:k.students.filter(s=>{const v=markValue(e,s.id);return v!=null&&v<half;}),top:k.students.filter(s=>{const v=markValue(e,s.id);return v!=null&&v>=high;}),
      absent:k.students.filter(s=>e.marks[s.id]==='abs')};
  }
  function studentAverage(k,id,period){
    let tot=0,w=0;for(const e of k.evals){if(period&&e.period!==period)continue;const v=markValue(e,id);if(v==null)continue;tot+=v/e.scale*20*(+e.coef||1);w+=(+e.coef||1);}
    return w?tot/w:null;
  }
  function absences(k,id){return Object.values(k.attendance).filter(a=>Array.isArray(a.absent)&&a.absent.includes(id)).length;}
  function appreciation(v,scale){
    if(v==null)return '';const r=v/scale;
    if(r>=.8)return tr('Excellent travail. Continuez ainsi.','Excellent work. Keep it up.');
    if(r>=.7)return tr('Très bon travail, régulier et soigné.','Very good, steady and careful work.');
    if(r>=.6)return tr('Bon travail. Peut encore progresser.','Good work. Room to progress.');
    if(r>=.5)return tr('Résultat juste. Revoir les points manqués.','Just enough. Review the points missed.');
    if(r>=.35)return tr('Insuffisant. Reprendre la leçon avec méthode.','Insufficient. Go back over the lesson step by step.');
    return tr('Très insuffisant. Un accompagnement est nécessaire.','Well below expectations. Support is needed.');
  }
  const STATUS={ras:[tr('RAS','All good'),'ras'],suivre:[tr('À suivre','Watch'),'suivre'],progres:[tr('En progrès','Improving'),'progres'],felicitations:[tr('Félicitations','Praise'),'felicitations']};
  const statusLabel=s=>({ras:tr('RAS','All good'),suivre:tr('À suivre','Watch'),progres:tr('En progrès','Improving'),felicitations:tr('Félicitations','Praise')})[s]||s;

  /* ---------- Navigation ---------- */
  const baseGroups=routeGroups;
  routeGroups=function(a,course){
    if(a!=='teacher')return baseGroups(a,course);
    return {main:[['staff','Aujourd’hui','Today'],['tk-students','Mes élèves','My students'],['tk-evals','Évaluations et notes','Assessments and marks'],['tk-year','Mon année','My year'],['build-course','Préparer un cours','Plan a lesson']],
      extra:[['tk-families','Relais familles','Family relay'],['classroom','Analyse par compétence','Skills analysis'],['progress','Mes observations','Observations'],['lesson-library','Mes cours et bilans','Lessons and reviews'],['prepare','Anciennes préparations','Earlier lesson plans'],['week','Ma semaine','My week'],['messages','Écrire aux familles','Write to families']]};
  };

  /* ---------- Vues ---------- */
  const head=(c,kicker,title,lead,actions='')=>'<div class="tk-head"><div><p class="eyebrow">'+esc(kicker)+'</p><h1>'+esc(title)+'</h1>'+(lead?'<p class="tk-lead">'+lead+'</p>':'')+'</div>'+(actions?'<div class="tk-head-actions">'+actions+'</div>':'')+'</div>';
  const classKicker=c=>{const T=secondary(c)&&window.klasTeach?klasTeach.taught(c):[];return c.name+' · '+c.level+' · '+(secondary(c)?(T.length?T.join(' + '):tr('Secondaire','Secondary')):tr('Primaire · toutes les matières','Primary · all subjects'));};
  /* Matières : invitation à déclarer sa matière au secondaire */
  const subjectBar=c=>{if(!secondary(c)||!window.klasTeach)return '';const T=klasTeach.taught(c);
    return T.length?'<p class="tk-subjects"><span>'+(T.length>1?tr('Mes matières','My subjects'):tr('Ma matière','My subject'))+' :</span> '+T.map(x=>'<b>'+esc(x)+'</b>').join(' + ')+' <button type="button" class="tk-link" data-tk-subjects="1">'+tr('Modifier','Change')+'</button></p>'
      :'<div class="tk-subjects is-missing" role="status"><p><b>'+tr('Quelle matière enseignez-vous dans cette classe ?','Which subject do you teach in this class?')+'</b> '+tr('Au collège et au lycée, chaque enseignant a sa spécialité. Indiquez-la : évaluations, progression et assistant s’y adaptent.','In secondary school every teacher has a specialism. Set it: assessments, scheme of work and assistant adapt to it.')+'</p><button type="button" data-tk-subjects="1">'+tr('Choisir ma matière','Choose my subject')+'</button></div>';};
  const btn=(label,attrs,cls='')=>'<button type="button" class="'+cls+'" '+attrs+'>'+label+'</button>';

  function cockpit(c,k){
    const d=today(),att=k.attendance[d],n=k.students.length;
    const upcoming=k.evals.filter(e=>e.date>=d).sort((a,b)=>a.date.localeCompare(b.date));
    const toGrade=k.evals.filter(e=>e.date<d&&!graded(e));
    const done=k.lessons.filter(l=>l.done).length,total=k.lessons.length,pct=total?Math.round(done/total*100):0;
    const next=k.lessons.find(l=>!l.done);
    const lastGraded=k.evals.filter(graded).sort((a,b)=>b.date.localeCompare(a.date))[0];
    const st=lastGraded&&stats(k,lastGraded);
    const watch=k.students.map(s=>({s,avg:studentAverage(k,s.id),abs:absences(k,s.id)})).filter(x=>x.s.status==='suivre'||(x.avg!=null&&x.avg<10)||x.abs>=2).slice(0,6);
    const kpi=(value,label,sub,tone='')=>'<div class="tk-kpi '+tone+'"><strong>'+value+'</strong><span>'+label+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div>';
    const ne=upcoming[0];
    const task=(ok,title,detail,action)=>'<li class="tk-task'+(ok?' is-done':'')+'"><span class="tk-check" aria-hidden="true"></span><div><b>'+title+'</b><p>'+detail+'</p></div>'+(action||'')+'</li>';
    return head(c,classKicker(c),tr('Ma classe aujourd’hui','My class today'),esc(longDate(d)).replace(/^./,m=>m.toUpperCase())+' · '+n+' '+tr('élèves','students'),
        btn(tr('Faire l’appel','Take the register'),'data-tk-go="tk-students" data-tk-appel="1"')+btn(tr('Préparer demain','Plan tomorrow'),'data-tk-go="build-course"','secondary'))+subjectBar(c)+
      '<div class="tk-kpis">'+
        kpi(att?(n-att.absent.length)+'/'+n:'—',tr('présents aujourd’hui','present today'),att?(att.absent.length?att.absent.length+' '+tr('absent(s)','absent'):tr('Classe complète','Full class')):tr('Appel non fait','Register not taken'),att?'':'warn')+
        kpi(ne?(daysBetween(d,ne.date)===0?tr('Auj.','Today'):'J-'+daysBetween(d,ne.date)):'—',tr('prochaine évaluation','next assessment'),ne?esc(ne.type+' · '+ne.subject):tr('Rien de programmé','Nothing scheduled'))+
        kpi(toGrade.length,tr('paquet(s) de copies','set(s) of papers'),toGrade.length?tr('Notes à saisir','Marks to enter'):tr('Tout est à jour','All up to date'),toGrade.length?'warn':'')+
        kpi(pct+' %',tr('du programme couvert','of the programme covered'),done+'/'+total+' '+tr('leçons','lessons'))+
      '</div><div class="tk-grid">'+
      '<section class="card tk-card"><h2>'+tr('Aujourd’hui, dans l’ordre','Today, in order')+'</h2><ol class="tk-tasks">'+
        task(!!att,tr('Faire l’appel','Take the register'),att?tr('Fait. ','Done. ')+(att.absent.length?att.absent.map(id=>esc(studentById(k,id)?.name||'')).join(', '):tr('Aucun absent.','Nobody absent.')):tr('Touchez seulement les absents : 30 secondes, même avec une grande classe.','Tap only the absent students: 30 seconds, even with a large class.'),att?'':btn(tr('Appel','Register'),'data-tk-go="tk-students" data-tk-appel="1"','secondary'))+
        task(false,tr('Leçon du jour','Today’s lesson'),next?esc(next.subject+' · '+next.title):tr('Ajoutez votre progression dans « Mon année ».','Add your scheme of work in “My year”.'),next?'<span class="tk-row-actions">'+btn(tr('Préparer','Plan'),'data-tk-prep="'+next.id+'"','secondary')+btn(tr('Faite ✓','Done ✓'),'data-tk-lesson-done="'+next.id+'"')+'</span>':btn(tr('Mon année','My year'),'data-tk-go="tk-year"','secondary'))+
        task(!toGrade.length,tr('Copies à corriger','Papers to mark'),toGrade.length?toGrade.map(e=>esc(e.type+' · '+e.subject+' ('+shortDate(e.date)+')')).join('<br>'):tr('Aucune copie en attente.','No papers waiting.'),toGrade.length?btn(tr('Saisir les notes','Enter marks'),'data-tk-grade="'+toGrade[0].id+'"','secondary'):'')+
        task(false,tr('Informer les familles','Inform families'),tr('Devoir du jour, évaluation annoncée, absence : un message prêt à copier sur WhatsApp.','Today’s homework, an announced test, an absence: a message ready to paste into WhatsApp.'),btn(tr('Écrire','Write'),'data-tk-go="tk-families"','secondary'))+
      '</ol></section>'+
      '<section class="card tk-card"><h2>'+tr('Élèves à suivre','Students to watch')+'</h2>'+(watch.length?'<ul class="tk-list">'+watch.map(x=>'<li><button type="button" class="tk-link" data-tk-student="'+x.s.id+'"><b>'+esc(x.s.name)+'</b><span>'+[x.s.status==='suivre'?tr('signalé « à suivre »','flagged “watch”'):'',x.avg!=null&&x.avg<10?tr('moyenne ','average ')+num(x.avg)+'/20':'',x.abs>=2?x.abs+' '+tr('absences','absences'):''].filter(Boolean).join(' · ')+'</span></button></li>').join('')+'</ul>':'<p class="muted">'+tr('Personne pour le moment. Les élèves en difficulté, souvent absents ou signalés apparaîtront ici.','Nobody right now. Students struggling, often absent or flagged will appear here.')+'</p>')+'</section>'+
      '<section class="card tk-card"><h2>'+tr('Calendrier des évaluations','Assessment calendar')+'</h2>'+(upcoming.length?'<ul class="tk-list">'+upcoming.slice(0,4).map(e=>'<li><div><b>'+esc(e.type)+'</b><span>'+esc(e.subject+' · '+e.title)+'</span></div><time class="tk-date">'+esc(shortDate(e.date))+'</time></li>').join('')+'</ul>':'<p class="muted">'+tr('Aucune évaluation programmée.','No assessment scheduled.')+'</p>')+btn(tr('Programmer une évaluation','Schedule an assessment'),'data-tk-go="tk-evals"','secondary')+'</section>'+
      '<section class="card tk-card"><h2>'+tr('Derniers résultats','Latest results')+'</h2>'+(st?'<p class="muted">'+esc(lastGraded.type+' · '+lastGraded.subject+' · '+lastGraded.title)+'</p><div class="tk-mini-stats"><div><strong>'+num(st.mean)+'</strong><span>/'+lastGraded.scale+' '+tr('moyenne','average')+'</span></div><div><strong>'+Math.round(st.pass/st.n*100)+' %</strong><span>'+tr('ont la moyenne','passed')+'</span></div><div><strong>'+st.low.length+'</strong><span>'+tr('à reprendre','to revisit')+'</span></div></div>'+histogram(st,lastGraded)+btn(tr('Voir l’analyse','See the analysis'),'data-tk-results="'+lastGraded.id+'"','secondary'):'<p class="muted">'+tr('Saisissez les notes d’une évaluation pour voir la moyenne, le taux de réussite et les élèves à reprendre.','Enter the marks of an assessment to see the average, pass rate and who needs help.')+'</p>')+'</section>'+
      '</div>';
  }
  function histogram(st,e){
    const max=Math.max(1,...st.bins),q=e.scale/4;
    const labels=[0,1,2,3].map(i=>num(i*q,1)+'–'+num((i+1)*q,1));
    return '<div class="tk-hist" role="img" aria-label="'+tr('Répartition des notes','Mark distribution')+': '+st.bins.map((b,i)=>labels[i]+' : '+b).join(', ')+'">'+st.bins.map((b,i)=>'<div class="tk-bar b'+i+'"><span style="height:'+Math.round(b/max*100)+'%"></span><b>'+b+'</b><small>'+labels[i]+'</small></div>').join('')+'</div>';
  }

  function studentsView(c,k){
    const d=ui.appelDate||today(),att=k.attendance[d]||{absent:[]};
    const q=ui.query.trim().toLowerCase();
    let list=k.students.filter(s=>!q||s.name.toLowerCase().includes(q));
    if(ui.filter==='suivre')list=list.filter(s=>s.status==='suivre');
    if(ui.filter==='absents')list=list.filter(s=>(k.attendance[today()]?.absent||[]).includes(s.id));
    const appel=ui.appel?'<section class="card tk-card tk-appel"><div class="tk-appel-head"><h2>'+tr('L’appel','Register')+'</h2><label>'+tr('Date','Date')+'<input type="date" id="tk-appel-date" value="'+esc(d)+'"></label></div><p class="muted">'+tr('Touchez les élèves absents. Les autres sont comptés présents.','Tap the absent students. Everyone else counts as present.')+'</p><div class="tk-appel-grid">'+k.students.map(s=>{const a=(ui.appelDraft||att.absent).includes(s.id);return '<button type="button" class="tk-pupil'+(a?' is-absent':'')+'" aria-pressed="'+a+'" data-tk-absent="'+s.id+'">'+esc(s.name)+'<small>'+(a?tr('Absent','Absent'):tr('Présent','Present'))+'</small></button>';}).join('')+'</div><div class="tk-appel-foot"><b>'+(k.students.length-(ui.appelDraft||att.absent).length)+'/'+k.students.length+' '+tr('présents','present')+'</b>'+btn(tr('Enregistrer l’appel','Save the register'),'data-tk-appel-save="1"')+btn(tr('Fermer','Close'),'data-tk-appel-close="1"','secondary')+'</div></section>':'';
    return head(c,classKicker(c),tr('Mes élèves','My students'),k.students.length+' '+tr('élèves · moyennes, absences et observations au même endroit.','students · averages, absences and notes in one place.'),
        btn(tr('Faire l’appel','Take the register'),'data-tk-appel-open="1"')+btn(tr('Exporter la liste','Export the list'),'data-tk-export-students="1"','secondary'))+appel+
      '<div class="tk-toolbar"><label class="tk-search">'+tr('Rechercher','Search')+'<input id="tk-search" type="search" value="'+esc(ui.query)+'" placeholder="'+tr('Nom de l’élève','Student name')+'"></label><div class="tk-chips" role="group" aria-label="'+tr('Filtrer','Filter')+'">'+[['all',tr('Tous','All')],['suivre',tr('À suivre','Watch')],['absents',tr('Absents aujourd’hui','Absent today')]].map(([v,l])=>'<button type="button" data-tk-filter="'+v+'" aria-pressed="'+(ui.filter===v)+'">'+l+'</button>').join('')+'</div></div>'+
      '<div class="tk-table">'+(list.length?list.map(s=>studentRow(c,k,s)).join(''):'<p class="muted tk-empty">'+tr('Aucun élève dans cette vue.','No students in this view.')+'</p>')+'</div>'+
      '<details class="card tk-card tk-add"><summary>'+tr('Ajouter des élèves','Add students')+'</summary><p class="muted">'+tr('Collez votre liste de classe : un élève par ligne. Utilisez le prénom et l’initiale du nom si vous le souhaitez.','Paste your class list: one student per line. First name and initial are enough.')+'</p><textarea id="tk-new-students" rows="5" placeholder="'+tr('Ex. Aïcha N.\nBrice T.','e.g. Aïcha N.\nBrice T.')+'"></textarea>'+btn(tr('Ajouter à la classe','Add to the class'),'data-tk-add-students="1"')+'</details>';
  }
  function studentRow(c,k,s){
    const avg=studentAverage(k,s.id),abs=absences(k,s.id),last=s.notes[s.notes.length-1];
    const open=ui.openStudent===s.id;
    return '<details class="tk-student" '+(open?'open':'')+' data-tk-student-row="'+s.id+'"><summary><span class="tk-name">'+esc(s.name)+'</span><span class="tk-avg '+(avg==null?'':avg<10?'low':avg>=14?'high':'')+'">'+(avg==null?'—':num(avg)+'/20')+'</span><span class="tk-abs">'+abs+' '+tr('abs.','abs.')+'</span><span class="tk-status s-'+s.status+'">'+statusLabel(s.status)+'</span><span class="tk-last">'+(last?esc(last.text):'')+'</span></summary>'+
      '<div class="tk-student-body"><div class="tk-student-col"><label>'+tr('Statut','Status')+'<select data-tk-status="'+s.id+'">'+Object.keys(STATUS).map(v=>'<option value="'+v+'" '+(s.status===v?'selected':'')+'>'+statusLabel(v)+'</option>').join('')+'</select></label>'+
      '<h3>'+tr('Notes','Marks')+'</h3><ul class="tk-marks">'+(k.evals.filter(e=>e.marks[s.id]!=null&&e.marks[s.id]!=='').map(e=>'<li><span>'+esc(e.subject+' · '+e.type)+'</span><b>'+(e.marks[s.id]==='abs'?tr('Abs.','Abs.'):esc(e.marks[s.id])+'/'+e.scale)+'</b></li>').join('')||'<li class="muted">'+tr('Pas encore de note.','No marks yet.')+'</li>')+'</ul></div>'+
      '<div class="tk-student-col"><h3>'+tr('Observations','Notes')+'</h3><ul class="tk-notes">'+(s.notes.slice().reverse().map(n=>'<li><small>'+esc(shortDate(n.date)+' · '+n.type)+'</small>'+esc(n.text)+'</li>').join('')||'<li class="muted">'+tr('Aucune observation.','No notes yet.')+'</li>')+'</ul>'+
      '<div class="tk-note-form"><select id="tk-note-type-'+s.id+'" aria-label="'+tr('Type d’observation','Note type')+'">'+[tr('Travail','Work'),tr('Comportement','Behaviour'),tr('Progrès','Progress'),tr('Difficulté','Difficulty'),tr('Famille','Family')].map(t=>'<option>'+t+'</option>').join('')+'</select><input id="tk-note-text-'+s.id+'" maxlength="300" placeholder="'+tr('Ce que vous avez observé','What you observed')+'" aria-label="'+tr('Observation','Note')+'">'+btn(tr('Noter','Save'),'data-tk-note="'+s.id+'"')+'</div>'+
      '<div class="tk-row-actions">'+'<button type="button" class="ai-inline-sm" data-tk-ai="suivi:'+s.id+'"><span class="ai-spark" aria-hidden="true"></span>'+tr('Plan d’accompagnement (IA)','Support plan (AI)')+'</button>'+btn(tr('Mot aux parents','Note to parents'),'data-tk-family-student="'+s.id+'"','secondary')+btn(tr('Retirer de la classe','Remove from class'),'data-tk-remove-student="'+s.id+'"','tk-danger')+'</div></div></div></details>';
  }

  function evalsView(c,k){
    const d=today(),ps=periods(c);
    const list=k.evals.slice().sort((a,b)=>b.date.localeCompare(a.date));
    const form='<details class="card tk-card tk-add" '+(k.evals.length?'':'open')+'><summary>'+tr('Programmer une évaluation','Schedule an assessment')+'</summary><form id="tk-eval-form" class="tk-form"><label>'+tr('Type','Type')+'<select name="type">'+evalTypes(c).map(t=>'<option>'+esc(t)+'</option>').join('')+'</select></label><label>'+tr('Période','Period')+'<select name="period">'+ps.map(p=>'<option>'+esc(p)+'</option>').join('')+'</select></label><label>'+tr('Matière','Subject')+'<input name="subject" list="tk-subjects" required maxlength="80"></label><datalist id="tk-subjects">'+subjects(c).map(s=>'<option value="'+esc(s)+'"></option>').join('')+'</datalist><label>'+tr('Date','Date')+'<input name="date" type="date" required value="'+addDays(d,7)+'"></label><label class="tk-wide">'+tr('Notions évaluées','Topics assessed')+'<input name="title" required maxlength="160" placeholder="'+tr('Ex. Les fractions, le passé composé…','e.g. Fractions, past tense…')+'"></label><label>'+tr('Noté sur','Marked out of')+'<select name="scale"><option value="20">20</option><option value="10">10</option><option value="40">40</option><option value="100">100</option></select></label><label>'+tr('Coefficient','Weight')+'<input name="coef" type="number" min="1" max="10" value="1"></label><button type="submit">'+tr('Programmer','Schedule')+'</button></form></details>';
    const card=e=>{const st=stats(k,e),past=e.date<d,status=graded(e)?['ok',tr('Notée','Marked')]:past?['warn',tr('À corriger','To mark')]:['plan',tr('Prévue','Scheduled')];
      return '<article class="card tk-eval"><div class="tk-eval-top"><span class="tk-badge '+status[0]+'">'+status[1]+'</span><time class="tk-date">'+esc(shortDate(e.date))+(past?'':' · J-'+daysBetween(d,e.date))+'</time></div><h2 class="tk-eval-title">'+esc(e.type)+' · '+esc(e.subject)+'</h2><p>'+esc(e.title)+' · '+esc(e.period)+' · '+tr('sur ','out of ')+e.scale+' · coef. '+esc(e.coef)+'</p>'+(st?'<p class="tk-eval-stats"><b>'+num(st.mean)+'/'+e.scale+'</b> '+tr('de moyenne','average')+' · <b>'+Math.round(st.pass/st.n*100)+' %</b> '+tr('de réussite','pass rate')+' · '+st.low.length+' '+tr('à reprendre','to revisit')+'</p>':'')+
      '<div class="tk-row-actions">'+btn(graded(e)?tr('Modifier les notes','Edit marks'):tr('Saisir les notes','Enter marks'),'data-tk-grade="'+e.id+'"',graded(e)?'secondary':'')+(st?btn(tr('Résultats et appréciations','Results and comments'),'data-tk-results="'+e.id+'"','secondary'):'')+btn(tr('Annoncer aux familles','Tell families'),'data-tk-family-eval="'+e.id+'"','secondary')+btn(tr('Supprimer','Delete'),'data-tk-del-eval="'+e.id+'"','tk-danger')+'</div>'+
      (ui.openEval===e.id?gradeSheet(k,e):'')+(ui.resultsEval===e.id&&st?resultsPanel(k,e,st):'')+'</article>';};
    const per=ui.period||ps[0];
    const rows=k.students.map(s=>({s,avg:studentAverage(k,s.id,per)})).filter(x=>x.avg!=null).sort((a,b)=>b.avg-a.avg);
    const summary='<section class="card tk-card"><div class="tk-appel-head"><h2>'+tr('Moyennes de la période','Period averages')+'</h2><label>'+tr('Période','Period')+'<select id="tk-period">'+ps.map(p=>'<option '+(p===per?'selected':'')+'>'+esc(p)+'</option>').join('')+'</select></label></div><p class="muted">'+tr('Moyenne sur 20, pondérée par les coefficients, de toutes les évaluations notées de la période. Prête pour le bulletin.','Average out of 20, weighted by coefficients, across all marked assessments in the period. Ready for the report card.')+'</p>'+(rows.length?'<div class="tk-scroll" tabindex="0" role="region" aria-label="'+tr('Tableau','Table')+'"><table class="tk-results"><thead><tr><th>'+tr('Rang','Rank')+'</th><th>'+tr('Élève','Student')+'</th><th>'+tr('Moyenne','Average')+'</th><th>'+tr('Appréciation proposée','Suggested comment')+'</th></tr></thead><tbody>'+rows.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(x.s.name)+'</td><td class="'+(x.avg<10?'low':x.avg>=14?'high':'')+'">'+num(x.avg,2)+'</td><td>'+esc(((k.periodAppr||{})[per]||{})[x.s.id]||appreciation(x.avg,20))+(((k.periodAppr||{})[per]||{})[x.s.id]?' <small class="ai-tag">IA · '+tr('relu','reviewed')+'</small>':'')+'</td></tr>').join('')+'</tbody></table></div>'+'<div class="tk-row-actions">'+'<button type="button" class="ai-inline-sm" data-tk-ai="appreciations"><span class="ai-spark" aria-hidden="true"></span>'+tr('Rédiger les appréciations avec l’IA','Write comments with AI')+'</button>'+btn(tr('Copier pour le bulletin','Copy for the report card'),'data-tk-copy-period="1"')+btn(tr('Télécharger (CSV)','Download (CSV)'),'data-tk-csv-period="1"','secondary')+'</div>':'<p class="muted">'+tr('Aucune note pour cette période.','No marks for this period yet.')+'</p>')+'</section>';
    return head(c,classKicker(c),tr('Évaluations et notes','Assessments and marks'),secondary(c)?tr('Interrogations, devoirs surveillés, évaluations séquentielles et examens blancs : programmez, notez, analysez.','Quizzes, supervised tests, sequence assessments and mock exams: schedule, mark, analyse.'):tr('Interrogations, devoirs, évaluations et compositions : programmez, notez, analysez.','Quizzes, tests, assessments and term exams: schedule, mark, analyse.'))+form+'<div class="tk-evals">'+(list.map(card).join('')||'<p class="muted">'+tr('Aucune évaluation pour le moment.','No assessments yet.')+'</p>')+'</div>'+summary;
  }
  function gradeSheet(k,e){
    return '<form class="tk-grade" data-tk-grade-form="'+e.id+'"><p class="muted">'+tr('Saisissez une note sur ','Enter a mark out of ')+e.scale+tr(', ou « abs » pour un absent. Touche Entrée pour passer à l’élève suivant.',', or “abs” for an absent student. Press Enter to move to the next student.')+'</p><div class="tk-grade-grid">'+k.students.map((s,i)=>'<label><span>'+esc(s.name)+'</span><input inputmode="decimal" name="'+s.id+'" value="'+esc(e.marks[s.id]||'')+'" data-tk-grade-input="'+i+'" autocomplete="off" pattern="^([0-9]+([.,][0-9]+)?|abs|ABS|Abs)$" aria-label="'+esc(s.name)+'"></label>').join('')+'</div><div class="tk-row-actions"><button type="submit">'+tr('Enregistrer les notes','Save marks')+'</button><button type="button" class="ai-inline-sm" data-tk-ai="corriger:'+e.id+'"><span class="ai-spark" aria-hidden="true"></span>'+tr('Corriger une copie en photo','Mark a paper from a photo')+'</button>'+btn(tr('Annuler','Cancel'),'data-tk-grade-close="1"','secondary')+'</div></form>';
  }
  function resultsPanel(k,e,st){
    return '<div class="tk-results-panel"><div class="tk-mini-stats"><div><strong>'+num(st.mean)+'</strong><span>'+tr('moyenne','average')+'</span></div><div><strong>'+num(st.median)+'</strong><span>'+tr('médiane','median')+'</span></div><div><strong>'+num(st.max)+' / '+num(st.min)+'</strong><span>'+tr('max / min','high / low')+'</span></div><div><strong>'+st.pass+'/'+st.n+'</strong><span>'+tr('ont la moyenne','passed')+'</span></div></div>'+histogram(st,e)+
      '<div class="tk-two"><div><h4>'+tr('À reprendre','To revisit')+' ('+st.low.length+')</h4><p>'+(st.low.map(s=>esc(s.name)).join(', ')||tr('Personne.','Nobody.'))+'</p></div><div><h4>'+tr('Félicitations','Praise')+' ('+st.top.length+')</h4><p>'+(st.top.map(s=>esc(s.name)).join(', ')||tr('Personne.','Nobody.'))+'</p></div></div>'+(st.absent.length?'<p class="muted">'+tr('Absents : ','Absent: ')+st.absent.map(s=>esc(s.name)).join(', ')+'</p>':'')+
      '<div class="tk-scroll" tabindex="0" role="region" aria-label="'+tr('Tableau','Table')+'"><table class="tk-results"><thead><tr><th>'+tr('Élève','Student')+'</th><th>'+tr('Note','Mark')+'</th><th>'+tr('Appréciation','Comment')+'</th></tr></thead><tbody>'+k.students.map(s=>{const v=markValue(e,s.id);const a=e.appreciations[s.id]??appreciation(v,e.scale);return '<tr><td>'+esc(s.name)+'</td><td class="'+(v==null?'':v<e.scale/2?'low':v>=e.scale*.75?'high':'')+'">'+(e.marks[s.id]==='abs'?tr('Abs.','Abs.'):v==null?'—':num(v,2))+'</td><td><input value="'+esc(a)+'" data-tk-appr="'+e.id+':'+s.id+'" aria-label="'+tr('Appréciation de ','Comment for ')+esc(s.name)+'"></td></tr>';}).join('')+'</tbody></table></div>'+
      '<div class="tk-row-actions">'+btn(tr('Copier notes et appréciations','Copy marks and comments'),'data-tk-copy-eval="'+e.id+'"')+btn(tr('Télécharger (CSV)','Download (CSV)'),'data-tk-csv-eval="'+e.id+'"','secondary')+btn(tr('Préparer la remédiation','Plan remediation'),'data-tk-remed="'+e.id+'"','secondary')+'<button type="button" class="ai-inline-sm" data-tk-ai="analyse:'+e.id+'"><span class="ai-spark" aria-hidden="true"></span>'+tr('Analyser avec l’IA · groupes de besoin','Analyse with AI · needs groups')+'</button>'+'</div></div>';
  }

  /* ---------- Compléter mon programme : écrire, importer un cours, ou faire rédiger une notion par l'IA ---------- */
  const SRC={moi:['Ajouté par moi','Added by me','moi'],import:['Mon cours importé','My imported course','import'],ia:['Rédigé avec l’IA · à relire','Written with AI · review it','ia']};
  const srcTag=l=>{const x=SRC[l.source];return x?'<em class="tk-src tk-src-'+x[2]+'">'+tr(x[0],x[1])+'</em>':'';};
  function progFields(c,pre){
    const ps=periods(c),T=subjects(c),fixed=secondary(c)&&window.klasTeach&&klasTeach.taught(c).length;
    return '<label>'+tr('Matière','Subject')+(fixed?'<select name="subject" id="'+pre+'-subject">'+T.map(x=>'<option'+(x===ui.progSubject?' selected':'')+'>'+esc(x)+'</option>').join('')+'</select>':'<input name="subject" id="'+pre+'-subject" list="tk-subjects-y" required maxlength="80" value="'+esc(ui.progSubject||'')+'"><datalist id="tk-subjects-y">'+T.map(x=>'<option value="'+esc(x)+'"></option>').join('')+'</datalist>')+'</label>'+
      '<label>'+tr('Période','Period')+'<select name="period" id="'+pre+'-period">'+ps.map(x=>'<option'+(x===ui.progPeriod?' selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label>';
  }
  function progPanel(c,k){
    const tab=ui.prog||'import',open=ui.progOpen||!k.lessons.length;
    const tabs=[['import',tr('Importer mon cours','Import my course')],['ia',tr('Notion manquante · IA','Missing topic · AI')],['write',tr('Écrire mes chapitres','Type my chapters')]];
    let body='';
    if(tab==='write')body='<form id="tk-lesson-form" class="tk-form">'+progFields(c,'tk-w')+'<label class="tk-wide">'+tr('Leçons ou chapitres (un par ligne)','Lessons or chapters (one per line)')+'<textarea name="titles" rows="4" required placeholder="'+tr('Ex. La proportionnalité\nLes pourcentages','e.g. Proportionality\nPercentages')+'"></textarea></label><button type="submit">'+tr('Ajouter à ma progression','Add to my scheme of work')+'</button></form>';
    else if(tab==='import'){
      const d=ui.importDraft;
      body='<div class="tk-form">'+progFields(c,'tk-i')+'</div>'+
        (d&&d.length?'<div class="tk-imp-preview"><p><b>'+d.length+' '+tr('chapitre(s) trouvé(s).','chapter(s) found.')+'</b> '+tr('Décochez ce qui ne doit pas entrer dans votre progression, corrigez un titre si besoin.','Untick what should not go in, fix a title if needed.')+'</p><ol>'+d.map((x,i)=>'<li><label class="tk-imp-item"><input type="checkbox" data-tk-imp-keep="'+i+'" '+(x.skip?'':'checked')+' aria-label="'+tr('Garder le chapitre ','Keep chapter ')+(i+1)+'"><input type="text" class="tk-imp-title" data-tk-imp-title="'+i+'" value="'+esc(x.title)+'" maxlength="120" aria-label="'+tr('Titre du chapitre ','Chapter title ')+(i+1)+'"></label>'+(x.content?'<small>'+tr('Avec son cours','With its notes')+' · '+x.content.length+' '+tr('caractères','characters')+'</small>':'')+'</li>').join('')+'</ol><div class="tk-row-actions"><button type="button" data-tk-imp-add="1">'+tr('Ajouter à ma progression','Add to my scheme of work')+'</button>'+btn(tr('Recommencer','Start again'),'data-tk-imp-reset="1"','secondary')+'</div></div>'
        :'<div class="tk-imp-drop"><label class="tk-file"><span>'+tr('Choisir un fichier','Choose a file')+'</span><input type="file" id="tk-imp-file" accept=".txt,.md,.docx,.html,.htm,text/plain"><small>'+tr('Word (.docx), texte ou page web. Seul le texte est gardé.','Word (.docx), text or web page. Only the text is kept.')+'</small></label>'+
          '<label class="tk-wide">'+tr('Ou collez votre cours, votre sommaire ou votre progression','Or paste your course, contents page or scheme of work')+'<textarea id="tk-imp-text" rows="6" placeholder="'+tr('Chapitre 1 : Le bilan\n(texte du cours…)\nChapitre 2 : Le compte de résultat\n…','Chapter 1: The balance sheet\n(course text…)\nChapter 2: …')+'"></textarea></label>'+
          '<div class="tk-row-actions"><button type="button" data-tk-imp-parse="1">'+tr('Découper en chapitres','Split into chapters')+'</button><button type="button" class="ai-inline-sm" data-tk-ai="programme"><span class="ai-spark" aria-hidden="true"></span>'+tr('Photo du cahier, du manuel ou PDF : lire avec l’IA','Photo of a book or PDF: read with AI')+'</button></div></div>');
    }else body='<div class="tk-form">'+progFields(c,'tk-n')+'<label class="tk-wide">'+tr('Notion ou chapitre à ajouter','Topic or chapter to add')+'<input id="tk-notion" maxlength="120" placeholder="'+tr('Ex. Les effets de commerce','e.g. Bills of exchange')+'"></label></div><p class="muted">'+tr('L’IA rédige le cours de cette notion pour votre classe : objectif, trace écrite, exemples et exercices corrigés. Vous le relisez, puis il rejoint votre progression comme les autres leçons.','AI writes the course for this topic for your class: objective, notes, examples and worked exercises. You review it, then it joins your scheme of work like the other lessons.')+'</p><div class="tk-row-actions"><button type="button" class="ai-inline-sm" data-tk-notion-ai="1"><span class="ai-spark" aria-hidden="true"></span>'+tr('Rédiger le cours avec l’IA','Write the course with AI')+'</button>'+btn(tr('Ajouter sans le cours','Add without notes'),'data-tk-notion-add="1"','secondary')+'</div>';
    return '<details class="card tk-card tk-add tk-prog" data-tk-prog-box '+(open?'open':'')+'><summary>'+tr('Compléter mon programme','Complete my programme')+'</summary>'+
      '<p class="tk-prog-lead">'+tr('La progression proposée par Klas 237 est un point de départ. Un chapitre manque, votre établissement suit un autre ordre, ou vous avez déjà vos cours ? Ajoutez-les ici : ils se gèrent ensuite comme les autres leçons (cocher, préparer, cahier de textes).','The Klas 237 scheme is a starting point. A chapter missing, a different order at your school, or you already have your notes? Add them here: they are then managed like any other lesson (tick, plan, record book).')+'</p>'+
      '<div class="tk-prog-tabs" role="tablist" aria-label="'+tr('Façon d’ajouter','How to add')+'">'+tabs.map(([id,l])=>'<button type="button" role="tab" aria-selected="'+(id===tab)+'" data-tk-prog="'+id+'">'+l+'</button>').join('')+'</div><div class="tk-prog-body" role="tabpanel">'+body+'</div></details>';
  }
  function importError(err){const m=err&&err.message;return m==='ai'?tr('Photo, PDF ou ancien Word : utilisez « Lire avec l’IA », ou copiez-collez le texte.','Photo, PDF or old Word file: use “Read with AI”, or copy and paste the text.'):m==='browser'?tr('Ce navigateur ne lit pas les fichiers Word : copiez-collez le texte.','This browser cannot read Word files: copy and paste the text.'):tr('Fichier illisible : copiez-collez le texte.','Unreadable file: copy and paste the text.');}
  function editCourse(c,k,l){
    modal('<form class="ts-modal tk-course-modal" data-tk-course-form="'+l.id+'"><h2>'+esc(l.title)+'</h2><p class="muted">'+esc(l.subject+' · '+l.period)+'</p><label>'+tr('Mon cours : trace écrite, notes, exercices','My notes: written summary, exercises')+'<textarea name="content" rows="12" maxlength="20000">'+esc(l.content||'')+'</textarea></label><label class="tk-file"><span>'+tr('Prendre le texte d’un fichier','Take the text from a file')+'</span><input type="file" data-tk-course-file accept=".txt,.md,.docx,.html,.htm,text/plain"></label><div class="tk-row-actions"><button type="submit">'+tr('Enregistrer','Save')+'</button><button type="button" class="ai-inline-sm" data-tk-course-ai="1"><span class="ai-spark" aria-hidden="true"></span>'+tr('Rédiger avec l’IA','Write with AI')+'</button><button type="button" class="secondary" data-tk-course-cancel="1">'+tr('Fermer','Close')+'</button></div></form>');
    const f=$('#modalbody [data-tk-course-form]');
    f.querySelector('[data-tk-course-cancel]').onclick=()=>$('#modal').close();
    f.querySelector('[data-tk-course-file]').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{f.content.value=(await klasImport.readFile(file)).slice(0,20000);}catch(err){toast(importError(err));}};
    f.querySelector('[data-tk-course-ai]').onclick=()=>{$('#modal').close();notionAI(c,k,l.title,l.subject,l.period,l);};
    f.onsubmit=e=>{e.preventDefault();l.content=f.content.value.trim().slice(0,20000);if(l.content&&!l.source)l.source='moi';$('#modal').close();rerender();toast(tr('Cours enregistré.','Notes saved.'));};
  }
  function courseText(a){
    const parts=[a.comprendre,...(a.etapes||[]).map(x=>x.titre+(x.duree?' ('+x.duree+')':'')+'\n'+x.contenu),(a.exemples||[]).length?tr('Exemples','Examples')+'\n'+a.exemples.map(x=>'• '+x.enonce+(x.solution?' → '+x.solution:'')).join('\n'):'',(a.a_essayer||[]).length?tr('Exercices','Exercises')+'\n'+a.a_essayer.map((x,i)=>(i+1)+'. '+x.consigne+(x.reponse?' ('+tr('réponse','answer')+' : '+x.reponse+')':'')).join('\n'):'',a.verifier];
    return parts.filter(Boolean).join('\n\n').slice(0,20000);
  }
  function notionAI(c,k,notion,subject,period,existing){
    if(!window.klasAI){toast(tr('Assistant indisponible.','Assistant unavailable.'));return;}
    const q=tr('Notion à ajouter à ma progression : « ','Topic to add to my scheme of work: “')+notion+tr(' ». Classe : ','”. Class: ')+c.level+' · '+subject+tr('. Rédige le cours conforme au programme officiel camerounais : objectif, trace écrite, exemples et exercices corrigés.','. Write the course in line with the official Cameroonian curriculum: objective, written summary, examples and worked exercises.');
    window.klasAI.open('cours_notion',q,{subject,applyLabel:existing?tr('Enregistrer comme mon cours','Save as my notes'):tr('Ajouter à ma progression','Add to my scheme of work'),onApplyAnswer:a=>{
      const ex=(a.exemples||[])[0],tr1=(a.a_essayer||[])[0];
      const parts={goal:(a.comprendre||'').slice(0,250),example:ex?((ex.enonce||'')+(ex.solution?' → '+ex.solution:'')).slice(0,1800):'',practice:(tr1?.consigne||'').slice(0,1800),answer:(tr1?.reponse||'').slice(0,1800)};
      const l=existing||{id:uid(),title:notion.slice(0,120),subject,period,done:false,doneDate:'',homework:''};
      Object.assign(l,{content:courseText(a),parts,source:'ia'});if(!existing)k.lessons.push(l);ui.progOpen=false;rerender();
      toast(tr('Cours ajouté à votre progression. Relisez-le avant la séance.','Course added to your scheme of work. Review it before class.'));}});
  }
  function readProgramme(c,k){
    if(!window.klasAI){toast(tr('Assistant indisponible.','Assistant unavailable.'));return;}
    const subj=$('#tk-i-subject')?.value||subjects(c)[0]||'';
    window.klasAI.open('programme',tr('Voici ma progression (ou le sommaire de mon manuel) en ','Here is my scheme of work (or my textbook contents) for ')+subj+' · '+c.level+tr('. Ajoutez la photo, puis listez les chapitres dans l’ordre.','. Add the photo, then list the chapters in order.'),{subject:subj,applyLabel:tr('Vérifier et ajouter ces chapitres','Check and add these chapters'),onApplyAnswer:a=>{
      const items=(a.etapes||[]).map(x=>({title:String(x.titre||'').slice(0,120),content:String(x.contenu||'')})).filter(x=>x.title);
      if(!items.length){toast(tr('Aucun chapitre lu. Essayez une photo plus nette.','No chapter found. Try a sharper photo.'));return;}
      ui.importDraft=items;ui.importSource='ia';ui.prog='import';ui.progOpen=true;if(page!=='tk-year')go('tk-year');else render();
      setTimeout(()=>document.querySelector('.tk-imp-preview')?.scrollIntoView({block:'center'}),80);}});
  }
  function yearView(c,k){
    const ps=periods(c);
    const total=k.lessons.length,done=k.lessons.filter(l=>l.done).length;
    const block=p=>{const ls=k.lessons.filter(l=>l.period===p),dn=ls.filter(l=>l.done).length;return '<section class="card tk-card tk-period"><div class="tk-period-head"><h2>'+esc(p)+'</h2><span>'+dn+'/'+ls.length+'</span></div><div class="tk-progress" role="progressbar" aria-valuemin="0" aria-valuemax="'+ls.length+'" aria-valuenow="'+dn+'" aria-label="'+esc(p)+'"><span style="width:'+(ls.length?Math.round(dn/ls.length*100):0)+'%"></span></div>'+(ls.length?'<ul class="tk-lessons">'+ls.map(l=>'<li class="'+(l.done?'is-done':'')+'"><label class="tk-lesson-check"><input type="checkbox" data-tk-lesson="'+l.id+'" '+(l.done?'checked':'')+'><span><b>'+esc(l.title)+'</b>'+srcTag(l)+'<small>'+esc(l.subject)+(l.done&&l.doneDate?' · '+tr('faite le ','done on ')+esc(shortDate(l.doneDate)):'')+'</small></span></label><span class="tk-row-actions">'+btn(l.content?tr('Mon cours','My notes'):tr('+ Cours','+ Notes'),'data-tk-course="'+l.id+'" aria-label="'+(l.content?tr('Mon cours : ','My notes: '):tr('Joindre mon cours à ','Attach my notes to '))+esc(l.title)+'"','secondary tk-course-btn')+btn(tr('Préparer','Plan'),'data-tk-prep="'+l.id+'"','secondary')+btn('×','data-tk-del-lesson="'+l.id+'" aria-label="'+tr('Retirer ','Remove ')+esc(l.title)+'"','tk-danger tk-x')+'</span>'+(l.done?'<input class="tk-homework" data-tk-homework="'+l.id+'" value="'+esc(l.homework||'')+'" placeholder="'+tr('Devoir donné (facultatif)','Homework set (optional)')+'" aria-label="'+tr('Devoir donné pour ','Homework for ')+esc(l.title)+'">':'')+(l.content?'<details class="tk-course"><summary>'+tr('Lire mon cours','Read my notes')+'</summary><div class="tk-course-text">'+esc(l.content)+'</div></details>':'')+'</li>').join('')+'</ul>':'<p class="muted">'+tr('Aucune leçon prévue.','No lessons planned.')+'</p>')+'</section>';};
    return head(c,classKicker(c),tr('Mon année','My year'),tr('Votre progression, période par période. Cochez une leçon faite : elle s’inscrit dans votre cahier de textes avec sa date.','Your scheme of work, period by period. Tick a lesson when done: it goes into your record book with its date.'),'<button type="button" class="ai-inline-sm" data-tk-ai="rapport"><span class="ai-spark" aria-hidden="true"></span>'+tr('Cahier de textes de la semaine (IA)','This week’s record book (AI)')+'</button>')+
      '<div class="tk-kpis"><div class="tk-kpi"><strong>'+(total?Math.round(done/total*100):0)+' %</strong><span>'+tr('du programme couvert','of the programme covered')+'</span><small>'+done+'/'+total+' '+tr('leçons','lessons')+'</small></div><div class="tk-kpi"><strong>'+k.evals.length+'</strong><span>'+tr('évaluations','assessments')+'</span><small>'+k.evals.filter(graded).length+' '+tr('notées','marked')+'</small></div></div>'+
      progPanel(c,k)+
      '<div class="tk-periods">'+ps.map(block).join('')+'</div>';
  }

  function familyMessage(c,k){
    const f=ui.family,d=today();
    const s=f.student&&studentById(k,f.student),e=f.eval&&k.evals.find(x=>x.id===f.eval);
    const lastDone=k.lessons.filter(l=>l.done).sort((a,b)=>(b.doneDate||'').localeCompare(a.doneDate||''))[0];
    const hello=tr('Bonjour chers parents de la classe de ','Hello, parents of class ')+c.name+',';
    switch(f.type){
      case 'homework':return hello+'\n'+tr('Aujourd’hui, nous avons travaillé : ','Today we worked on: ')+(lastDone?lastDone.subject+' – '+lastDone.title:'…')+'.\n'+tr('Devoir pour la prochaine fois : ','Homework for next time: ')+(lastDone?.homework||'…')+'\n'+tr('Merci de vérifier le cahier de votre enfant ce soir (10 minutes suffisent).','Please check your child’s exercise book tonight (10 minutes is enough).')+'\n'+tr('L’enseignant(e)','The teacher');
      case 'eval':return hello+'\n'+tr('Une évaluation est prévue le ','An assessment is planned on ')+(e?longDate(e.date):'…')+' : '+(e?e.type+' de '+e.subject:'…')+'.\n'+tr('Notions à réviser : ','Topics to revise: ')+(e?e.title:'…')+'.\n'+tr('Aidez votre enfant à relire ses leçons un peu chaque soir plutôt que tout la veille.','Help your child go over the lessons a little each evening rather than all the night before.')+'\n'+tr('L’enseignant(e)','The teacher');
      case 'results':{const st=e&&stats(k,e);return hello+'\n'+tr('Les copies de l’évaluation ','The papers for ')+(e?e.type+' de '+e.subject+' ('+e.title+')':'…')+tr(' sont corrigées.',' have been marked.')+'\n'+(st?tr('Moyenne de la classe : ','Class average: ')+num(st.mean)+'/'+e.scale+'.\n':'')+tr('Chaque enfant rapporte sa copie : merci de la signer et de regarder avec lui la correction.','Each child brings home their paper: please sign it and look at the corrections together.')+'\n'+tr('L’enseignant(e)','The teacher');}
      case 'absence':return tr('Bonjour, ','Hello, ')+tr('votre enfant ','your child ')+(s?s.name:'…')+tr(' était absent(e) le ',' was absent on ')+longDate(d)+'.\n'+tr('Merci de nous en indiquer le motif et de l’aider à rattraper la leçon : ','Please let us know the reason and help them catch up on the lesson: ')+(lastDone?lastDone.title:'…')+'.\n'+tr('L’enseignant(e)','The teacher');
      case 'praise':return tr('Bonjour, ','Hello, ')+tr('je tiens à féliciter ','I want to congratulate ')+(s?s.name:'…')+tr(' pour ses efforts en classe ces derniers jours. ',' for their effort in class recently. ')+tr('Encouragez-le/la à continuer ainsi !','Encourage them to keep it up!')+'\n'+tr('L’enseignant(e)','The teacher');
      case 'meeting':return hello+'\n'+tr('Vous êtes invités à une rencontre parents-enseignant le ','You are invited to a parent-teacher meeting on ')+longDate(addDays(d,7))+tr(' à 15 h, en salle de classe.',' at 3 pm, in the classroom.')+'\n'+tr('Nous ferons le point sur la période et sur la façon d’accompagner les enfants à la maison.','We will review the period and how to support the children at home.')+'\n'+tr('L’enseignant(e)','The teacher');
    }
    return '';
  }
  function familiesView(c,k){
    const f=ui.family;const types=[['homework',tr('Devoir du jour','Today’s homework')],['eval',tr('Évaluation annoncée','Announced assessment')],['results',tr('Copies corrigées','Papers marked')],['absence',tr('Absence d’un élève','Student absence')],['praise',tr('Félicitations','Praise')],['meeting',tr('Réunion de parents','Parents’ meeting')]];
    const needStudent=['absence','praise'].includes(f.type),needEval=['eval','results'].includes(f.type);
    if(needEval&&!f.eval){const e=f.type==='eval'?k.evals.filter(x=>x.date>=today()).sort((a,b)=>a.date.localeCompare(b.date))[0]:k.evals.filter(graded).sort((a,b)=>b.date.localeCompare(a.date))[0];f.eval=e?.id||'';}
    if(needStudent&&!f.student)f.student=(f.type==='absence'&&(k.attendance[today()]?.absent||[])[0])||k.students[0]?.id||'';
    const msg=familyMessage(c,k);
    return head(c,classKicker(c),tr('Relais familles','Family relay'),tr('Un message clair, prêt à coller dans le groupe WhatsApp de la classe ou à recopier dans le carnet de correspondance.','A clear message, ready to paste into the class WhatsApp group or copy into the home-school notebook.'))+
      '<div class="tk-family"><section class="card tk-card"><h2>'+tr('1 · Le message','1 · The message')+'</h2><div class="tk-chips tk-chips-wrap" role="group" aria-label="'+tr('Type de message','Message type')+'">'+types.map(([v,l])=>'<button type="button" data-tk-ftype="'+v+'" aria-pressed="'+(f.type===v)+'">'+l+'</button>').join('')+'</div>'+
      (needStudent?'<label>'+tr('Élève','Student')+'<select id="tk-f-student">'+k.students.map(s=>'<option value="'+s.id+'" '+(s.id===f.student?'selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></label>':'')+
      (needEval?'<label>'+tr('Évaluation','Assessment')+'<select id="tk-f-eval">'+k.evals.map(e=>'<option value="'+e.id+'" '+(e.id===f.eval?'selected':'')+'>'+esc(shortDate(e.date)+' · '+e.type+' · '+e.subject)+'</option>').join('')+'</select></label>':'')+
      '<p class="tk-privacy">'+(needStudent?tr('Message individuel : envoyez-le seulement au parent concerné, jamais dans le groupe.','Individual message: send it only to the parent concerned, never to the group.'):tr('Message collectif : aucune note individuelle n’y figure.','Group message: no individual mark is included.'))+'</p></section>'+
      '<section class="card tk-card"><h2>'+tr('2 · Relire et envoyer','2 · Review and send')+'</h2><label class="tk-msg">'+tr('Vous pouvez modifier le texte','You can edit the text')+'<textarea id="tk-f-text" rows="9">'+esc(msg)+'</textarea></label><div class="tk-row-actions">'+btn(tr('Copier le message','Copy the message'),'data-tk-copy-msg="1"')+'<a class="tk-wa" id="tk-wa" href="https://wa.me/?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener">'+tr('Ouvrir dans WhatsApp','Open in WhatsApp')+'</a></div><p class="muted">'+tr('Klas 237 n’envoie rien à votre place : vous choisissez le destinataire dans WhatsApp.','Klas 237 never sends anything for you: you choose the recipient in WhatsApp.')+'</p></section></div>';
  }

  /* ---------- Rendu ---------- */
  const prevRender=render;
  render=function(){
    prevRender();
    const c=cls();if(!c||!PAGES.includes(page))return;
    const k=kit(c);const screen=$('#screen');if(!screen)return;
    screen.innerHTML='<div class="tk">'+(page==='staff'?cockpit(c,k):page==='tk-students'?studentsView(c,k):page==='tk-evals'?evalsView(c,k):page==='tk-year'?yearView(c,k):familiesView(c,k))+'</div>';
    screen.querySelectorAll('.class-assessment-callout,.staff-banner').forEach(n=>n.remove());
  };
  const rerender=()=>{save();render();};
  const go=r=>{if(typeof openRoute==='function')openRoute(r);else{page=r;render();}};
  async function copy(text,ok){try{await navigator.clipboard.writeText(text);toast(ok||tr('Copié.','Copied.'));}catch(e){const t=document.createElement('textarea');t.value=text;document.body.append(t);t.select();try{document.execCommand('copy');toast(ok||tr('Copié.','Copied.'));}catch(_){toast(tr('Copie impossible : sélectionnez le texte.','Copy failed: select the text.'));}t.remove();}}
  function download(name,text){try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+text],{type:'text/csv;charset=utf-8'}));a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}catch(e){copy(text);}}
  const csvCell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  function evalCsv(k,e){return [[tr('Élève','Student'),tr('Note','Mark'),tr('Sur','Out of'),tr('Appréciation','Comment')].map(csvCell).join(';'),...k.students.map(s=>{const v=markValue(e,s.id);return [s.name,e.marks[s.id]==='abs'?'abs':v==null?'':String(v).replace('.',','),e.scale,e.appreciations[s.id]??appreciation(v,e.scale)].map(csvCell).join(';');})].join('\n');}
  function periodCsv(c,k){const per=ui.period||periods(c)[0];const rows=k.students.map(s=>({s,avg:studentAverage(k,s.id,per)})).filter(x=>x.avg!=null).sort((a,b)=>b.avg-a.avg);return [[tr('Rang','Rank'),tr('Élève','Student'),tr('Moyenne /20','Average /20'),tr('Absences','Absences'),tr('Appréciation','Comment')].map(csvCell).join(';'),...rows.map((x,i)=>[i+1,x.s.name,num(x.avg,2),absences(k,x.s.id),(((k.periodAppr||{})[per]||{})[x.s.id]||appreciation(x.avg,20))].map(csvCell).join(';'))].join('\n');}
  const fileName=(c,what)=>('klas237-'+c.name+'-'+what+'.csv').replace(/[^\w.-]+/g,'-');

  function editSubjects(c){
    const T=klasTeach.taught(c);
    modal('<form method="dialog" class="ts-modal" data-ts-form="1"><h2>'+tr('Mes matières dans ','My subjects in ')+esc(c.name)+'</h2><p class="muted">'+tr('Une matière principale. Une deuxième seulement si elle est du même domaine (ex. Comptabilité et Économie, Histoire et Géographie, Physique et Chimie).','One main subject. A second only if it is in the same field (e.g. Accounting and Economics, History and Geography, Physics and Chemistry).')+'</p><div data-teach-box class="ts-box">'+klasTeach.pickerHTML(c.level,T)+'</div><div class="tk-row-actions"><button type="submit" value="ok">'+tr('Enregistrer','Save')+'</button><button type="button" class="secondary" data-ts-cancel="1">'+tr('Annuler','Cancel')+'</button></div></form>');
    const f=$('#modalbody [data-ts-form]');klasTeach.bindPicker(f,c.level);
    f.querySelector('[data-ts-cancel]').onclick=()=>$('#modal').close();
    f.onsubmit=e=>{e.preventDefault();const a=f.subject1.value,b=f.subject2&&!f.subject2.disabled?f.subject2.value:'';if(!a){f.subject1.focus();return;}
      c.teachSubjects=[a,b].filter(Boolean);c.subjects=c.teachSubjects.join(', ');$('#modal').close();toast(tr('Matières enregistrées.','Subjects saved.'));rerender();};
  }
  function onClick(ev){
    const subj=ev.target.closest('[data-tk-subjects]');if(subj){const c=cls();if(c)editSubjects(c);return;}
    const c=cls();if(!c||!PAGES.includes(page))return;
    const sum=ev.target.closest('[data-tk-prog-box] > summary');if(sum){ui.progOpen=!sum.parentElement.open;return;}
    const t=ev.target.closest('button,a');if(!t)return;const k=kit(c),D=t.dataset;
    if(D.tkAi==='programme'){readProgramme(c,k);return;}
    if(D.tkAi){aiTool(c,k,D.tkAi);return;}
    if(D.tkProg){ui.prog=D.tkProg;ui.progOpen=true;render();document.querySelector('[data-tk-prog="'+D.tkProg+'"]')?.focus();return;}
    if(D.tkCourse){const l=k.lessons.find(x=>x.id===D.tkCourse);if(l)editCourse(c,k,l);return;}
    if(D.tkImpParse){const txt=$('#tk-imp-text')?.value||'';const items=klasImport.parse(txt);if(!items.length){toast(tr('Collez d’abord le texte de votre cours ou de votre sommaire.','Paste the text of your course or contents first.'));$('#tk-imp-text')?.focus();return;}ui.importDraft=items;ui.importSource='import';render();return;}
    if(D.tkImpReset){ui.importDraft=null;render();return;}
    if(D.tkImpAdd){
      const d=ui.importDraft||[],subject=($('#tk-i-subject')?.value||'').trim(),period=$('#tk-i-period')?.value||periods(c)[0];
      if(!subject){toast(tr('Indiquez la matière.','Enter the subject.'));$('#tk-i-subject')?.focus();return;}
      let n=0;d.forEach((x,i)=>{const keep=document.querySelector('[data-tk-imp-keep="'+i+'"]');if(keep&&!keep.checked)return;const ti=(document.querySelector('[data-tk-imp-title="'+i+'"]')?.value||x.title).trim();if(!ti)return;
        k.lessons.push({id:uid(),source:ui.importSource==='ia'?'ia':'import',title:ti.slice(0,120),subject,period,done:false,doneDate:'',homework:'',...(x.content?{content:x.content.slice(0,20000)}:{})});n++;});
      ui.importDraft=null;ui.progOpen=false;rerender();toast(n+' '+tr('chapitre(s) ajouté(s) à ','chapter(s) added to ')+period+'.');return;}
    if(D.tkNotionAi||D.tkNotionAdd){
      const notion=($('#tk-notion')?.value||'').trim(),subject=($('#tk-n-subject')?.value||'').trim(),period=$('#tk-n-period')?.value||periods(c)[0];
      if(!notion){toast(tr('Écrivez la notion à ajouter.','Type the topic to add.'));$('#tk-notion')?.focus();return;}
      if(!subject){toast(tr('Indiquez la matière.','Enter the subject.'));$('#tk-n-subject')?.focus();return;}
      if(D.tkNotionAdd){k.lessons.push({id:uid(),source:'moi',title:notion.slice(0,120),subject,period,done:false,doneDate:'',homework:''});ui.progOpen=false;rerender();toast(tr('Notion ajoutée à ','Topic added to ')+period+'.');return;}
      notionAI(c,k,notion,subject,period,null);return;}
    if(D.tkGo){if(D.tkAppel){ui.appel=true;ui.appelDraft=null;ui.appelDate=today();}go(D.tkGo);return;}
    if(D.tkAppelOpen){ui.appel=true;ui.appelDraft=null;ui.appelDate=today();render();return;}
    if(D.tkAppelClose){ui.appel=false;ui.appelDraft=null;render();return;}
    if(D.tkAbsent){const d=ui.appelDate||today();ui.appelDraft||=[...(k.attendance[d]?.absent||[])];const i=ui.appelDraft.indexOf(D.tkAbsent);i<0?ui.appelDraft.push(D.tkAbsent):ui.appelDraft.splice(i,1);render();const b=document.querySelector('[data-tk-absent="'+D.tkAbsent+'"]');b&&b.focus();return;}
    if(D.tkAppelSave){const d=ui.appelDate||today();k.attendance[d]={absent:[...(ui.appelDraft||k.attendance[d]?.absent||[])],at:new Date().toISOString()};ui.appel=false;ui.appelDraft=null;rerender();toast(tr('Appel enregistré.','Register saved.'));return;}
    if(D.tkFilter){ui.filter=D.tkFilter;render();return;}
    if(D.tkStudent){ui.openStudent=D.tkStudent;ui.filter='all';ui.query='';go('tk-students');setTimeout(()=>document.querySelector('[data-tk-student-row="'+D.tkStudent+'"]')?.scrollIntoView({block:'center'}),50);return;}
    if(D.tkAddStudents){const lines=($('#tk-new-students')?.value||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).slice(0,200);if(!lines.length){toast(tr('Collez au moins un nom.','Paste at least one name.'));return;}lines.forEach(n=>k.students.push({id:uid(),name:n.slice(0,60),status:'ras',notes:[]}));rerender();toast(lines.length+' '+tr('élève(s) ajouté(s).','student(s) added.'));return;}
    if(D.tkNote){const id=D.tkNote,s=studentById(k,id),text=$('#tk-note-text-'+id)?.value.trim();if(!text){toast(tr('Écrivez une observation.','Write a note.'));return;}s.notes.push({id:uid(),date:today(),type:$('#tk-note-type-'+id).value,text:text.slice(0,300)});ui.openStudent=id;rerender();return;}
    if(D.tkRemoveStudent){const s=studentById(k,D.tkRemoveStudent);if(t.dataset.confirm!=='1'){t.dataset.confirm='1';t.textContent=tr('Confirmer le retrait','Confirm removal');return;}k.students=k.students.filter(x=>x!==s);rerender();toast(tr('Élève retiré.','Student removed.'));return;}
    if(D.tkFamilyStudent){ui.family={type:'praise',student:D.tkFamilyStudent,eval:''};go('tk-families');return;}
    if(D.tkFamilyEval){const e=k.evals.find(x=>x.id===D.tkFamilyEval);ui.family={type:graded(e)?'results':'eval',student:'',eval:e.id};go('tk-families');return;}
    if(D.tkGrade){ui.openEval=ui.openEval===D.tkGrade&&page==='tk-evals'?null:D.tkGrade;ui.resultsEval=null;if(page!=='tk-evals')go('tk-evals');else render();setTimeout(()=>document.querySelector('[data-tk-grade-input="0"]')?.focus(),60);return;}
    if(D.tkGradeClose){ui.openEval=null;render();return;}
    if(D.tkResults){ui.resultsEval=ui.resultsEval===D.tkResults&&page==='tk-evals'?null:D.tkResults;ui.openEval=null;if(page!=='tk-evals')go('tk-evals');else render();return;}
    if(D.tkDelEval){if(t.dataset.confirm!=='1'){t.dataset.confirm='1';t.textContent=tr('Confirmer la suppression','Confirm deletion');return;}k.evals=k.evals.filter(e=>e.id!==D.tkDelEval);rerender();return;}
    if(D.tkCopyEval){const e=k.evals.find(x=>x.id===D.tkCopyEval);copy(evalCsv(k,e).replace(/;/g,'\t').replace(/"/g,''),tr('Copié : collez dans Excel ou votre bulletin.','Copied: paste into Excel or your report.'));return;}
    if(D.tkCsvEval){const e=k.evals.find(x=>x.id===D.tkCsvEval);download(fileName(c,e.subject+'-'+e.date),evalCsv(k,e));return;}
    if(D.tkCopyPeriod){copy(periodCsv(c,k).replace(/;/g,'\t').replace(/"/g,''),tr('Copié : collez dans Excel ou votre bulletin.','Copied: paste into Excel or your report.'));return;}
    if(D.tkCsvPeriod){download(fileName(c,(ui.period||periods(c)[0])),periodCsv(c,k));return;}
    if(D.tkRemed){const e=k.evals.find(x=>x.id===D.tkRemed),st=stats(k,e);lessonDraft={level:c.level,group:c.name+(st&&st.low.length?' · '+tr('groupe de reprise (','review group (')+st.low.length+')':''),subject:e.subject,topic:e.title,goal:tr('Reprendre les erreurs fréquentes de l’évaluation du ','Go back over common mistakes from the assessment of ')+shortDate(e.date),duration:'45'};go('build-course');return;}
    if(D.tkPrep){const l=k.lessons.find(x=>x.id===D.tkPrep);lessonDraft={level:c.level,group:c.name,subject:l.subject,topic:l.title,duration:secondary(c)?'55':'45',...(l.parts||{}),...(l.content&&!l.parts?{simple:l.content.slice(0,1800)}:{})};go('build-course');return;}
    if(D.tkLessonDone){const l=k.lessons.find(x=>x.id===D.tkLessonDone);l.done=true;l.doneDate=today();rerender();toast(tr('Leçon inscrite au cahier de textes.','Lesson added to the record book.'));return;}
    if(D.tkDelLesson){k.lessons=k.lessons.filter(l=>l.id!==D.tkDelLesson);rerender();return;}
    if(D.tkFtype){ui.family={type:D.tkFtype,student:'',eval:''};render();return;}
    if(D.tkCopyMsg){copy($('#tk-f-text').value,tr('Message copié. Collez-le dans WhatsApp.','Message copied. Paste it into WhatsApp.'));return;}
    if(D.tkExportStudents){download(fileName(c,'eleves'),[[tr('Élève','Student'),tr('Moyenne /20','Average /20'),tr('Absences','Absences'),tr('Statut','Status')].map(csvCell).join(';'),...k.students.map(s=>[s.name,studentAverage(k,s.id)==null?'':num(studentAverage(k,s.id),2),absences(k,s.id),statusLabel(s.status)].map(csvCell).join(';'))].join('\n'));return;}
  }
  /* ---------- Outils IA nourris par les données de la classe (élèves anonymisés) ---------- */
  function codes(k){const map={},names={};k.students.forEach((s,i)=>{map[s.id]='E'+(i+1);names['E'+(i+1)]=s.name;});return {map,names};}
  function aiTool(c,k,spec){
    if(!window.klasAI){toast(tr('Assistant indisponible.','Assistant unavailable.'));return;}
    const [kind,id]=spec.split(':'),{map,names}=codes(k),per=ui.period||periods(c)[0];
    if(kind==='appreciations'){
      const prev=p=>{const ps=periods(c),i=ps.indexOf(p);return i>0?ps[i-1]:null;},pp=prev(per);
      const lines=k.students.map(s=>{const a=studentAverage(k,s.id,per);if(a==null)return null;const b=pp?studentAverage(k,s.id,pp):null;const obs=s.notes.slice(-2).map(n=>n.type+' : '+n.text).join(' ; ');return map[s.id]+' · moyenne '+num(a,2)+'/20'+(b!=null?' · évolution '+(a-b>=0?'+':'')+num(a-b,1):'')+' · '+absences(k,s.id)+' absence(s) · statut '+statusLabel(s.status)+(obs?' · observations : '+obs:'');}).filter(Boolean);
      if(!lines.length){toast(tr('Aucune note pour cette période.','No marks for this period.'));return;}
      window.klasAI.open('appreciations',tr('Appréciations du bulletin · ','Report comments · ')+per+' · '+c.name,{data:lines.join('\n'),names,dataLabel:tr('Moyennes, évolutions, absences et observations de ','Averages, trends, absences and notes for ')+lines.length+tr(' élèves',' students'),onApply:list=>{k.periodAppr||={};k.periodAppr[per]||={};const back={};Object.entries(map).forEach(([sid,code])=>back[code]=sid);list.forEach(x=>{const sid=back[x.code];if(sid)k.periodAppr[per][sid]=x.text.slice(0,300);});save();render();}});
      return;}
    if(kind==='analyse'){
      const e=k.evals.find(x=>x.id===id),st=stats(k,e);if(!st)return;
      const data=['Évaluation : '+e.type+' · '+e.subject+' · '+e.title+' · sur '+e.scale,'Moyenne : '+num(st.mean,2)+' · médiane '+num(st.median,2)+' · max '+num(st.max)+' · min '+num(st.min)+' · '+st.pass+'/'+st.n+' ont la moyenne','Répartition par quart du barème : '+st.bins.join(' / '),...k.students.map(s=>{const v=markValue(e,s.id);return map[s.id]+' · note '+(e.marks[s.id]==='abs'?'absent':v==null?'—':num(v,2)+'/'+e.scale);})].join('\n');
      window.klasAI.open('analyse',tr('Analyse de l’évaluation « ','Analysis of the test “')+e.title+tr(' » : erreurs probables, groupes de besoin et remédiation.','”: likely errors, needs groups and remediation.'),{data,names,subject:e.subject,dataLabel:tr('Statistiques et notes de ','Stats and marks for ')+st.n+tr(' élèves',' students')});return;}
    if(kind==='corriger'){const e=k.evals.find(x=>x.id===id);window.klasAI.open('corriger',tr('Copie de ','Paper for ')+e.type+' · '+e.subject+' · '+e.title+tr(' · barème sur ',' · out of ')+e.scale+tr('. Joignez la photo de la copie et, si possible, votre corrigé.','. Attach the photo of the paper and, if possible, your answer key.'),{subject:e.subject});return;}
    if(kind==='suivi'){const s=k.students.find(x=>x.id===id);const data=['Élève : '+map[s.id]+' · statut '+statusLabel(s.status)+' · '+absences(k,s.id)+' absence(s) · moyenne '+(studentAverage(k,s.id)==null?'—':num(studentAverage(k,s.id),2)+'/20'),...s.notes.map(n=>'- '+n.date+' · '+n.type+' : '+n.text),...k.evals.filter(e=>e.marks[s.id]!=null&&e.marks[s.id]!=='').map(e=>'- note '+e.subject+' ('+e.type+') : '+e.marks[s.id]+'/'+e.scale)].join('\n');
      window.klasAI.open('suivi_eleve',tr('Plan d’accompagnement pour cet élève, et un message à sa famille.','Support plan for this student, and a message to the family.'),{data,names,dataLabel:tr('Observations, notes et absences de l’élève','The student’s notes, marks and absences')});return;}
    if(kind==='rapport'){const d=today(),done=k.lessons.filter(l=>l.done&&l.doneDate&&daysBetween(l.doneDate,d)<=7).sort((a,b)=>a.doneDate.localeCompare(b.doneDate));const data=['Classe : '+c.name+' ('+c.level+')',...done.map(l=>'- '+l.doneDate+' · '+l.subject+' · '+l.title+(l.homework?' · devoir : '+l.homework:'')),...k.evals.filter(e=>daysBetween(e.date,d)<=7&&daysBetween(e.date,d)>=-7).map(e=>'- évaluation '+e.date+' · '+e.type+' · '+e.subject)].join('\n');
      window.klasAI.open('rapport',tr('Cahier de textes de la semaine, prêt à recopier.','This week’s record book, ready to copy.'),{data,dataLabel:tr('Leçons faites, devoirs et évaluations de la semaine','Lessons done, homework and tests this week')});return;}
  }
  function onChange(ev){
    const c=cls();if(!c||!PAGES.includes(page))return;const k=kit(c),t=ev.target,D=t.dataset;
    if(/^tk-[iwn]-period$/.test(t.id)){ui.progPeriod=t.value;return;}
    if(/^tk-[iwn]-subject$/.test(t.id)){ui.progSubject=t.value;return;}
    if(t.id==='tk-imp-file'){const file=t.files[0];if(!file)return;klasImport.readFile(file).then(txt=>{const items=klasImport.parse(txt);if(!items.length){toast(tr('Aucun texte trouvé dans ce fichier.','No text found in this file.'));return;}ui.importDraft=items;ui.importSource='import';render();toast(items.length+' '+tr('chapitre(s) trouvé(s) dans ','chapter(s) found in ')+file.name);}).catch(err=>toast(importError(err)));return;}
    if(D.tkStatus){studentById(k,D.tkStatus).status=t.value;ui.openStudent=D.tkStatus;rerender();return;}
    if(D.tkLesson){const l=k.lessons.find(x=>x.id===D.tkLesson);l.done=t.checked;l.doneDate=t.checked?today():'';rerender();return;}
    if(D.tkHomework){k.lessons.find(x=>x.id===D.tkHomework).homework=t.value.slice(0,200);save();return;}
    if(D.tkAppr){const [eid,sid]=D.tkAppr.split(':');k.evals.find(e=>e.id===eid).appreciations[sid]=t.value.slice(0,200);save();return;}
    if(t.id==='tk-appel-date'){ui.appelDate=t.value||today();ui.appelDraft=null;render();return;}
    if(t.id==='tk-period'){ui.period=t.value;render();return;}
    if(t.id==='tk-f-student'){ui.family.student=t.value;render();return;}
    if(t.id==='tk-f-eval'){ui.family.eval=t.value;render();return;}
  }
  function onInput(ev){
    const t=ev.target;if(t.id==='tk-search'){ui.query=t.value;const pos=t.selectionStart;render();const s=$('#tk-search');if(s){s.focus();s.setSelectionRange(pos,pos);}}
    if(t.id==='tk-f-text'){const a=$('#tk-wa');if(a)a.href='https://wa.me/?text='+encodeURIComponent(t.value);}
  }
  function onKey(ev){
    const t=ev.target;if(ev.key==='Enter'&&t.dataset&&t.dataset.tkGradeInput!=null){ev.preventDefault();const n=document.querySelector('[data-tk-grade-input="'+(+t.dataset.tkGradeInput+1)+'"]');n?n.focus():t.form.requestSubmit();}
  }
  function onSubmit(ev){
    const c=cls();if(!c||!PAGES.includes(page))return;const k=kit(c),f=ev.target;
    if(f.id==='tk-eval-form'){ev.preventDefault();const v=Object.fromEntries(new FormData(f));k.evals.push({id:uid(),type:v.type,period:v.period,subject:v.subject.trim(),title:v.title.trim(),date:v.date,scale:+v.scale||20,coef:+v.coef||1,marks:{},appreciations:{}});rerender();toast(tr('Évaluation programmée.','Assessment scheduled.'));return;}
    if(f.id==='tk-lesson-form'){ev.preventDefault();const v=Object.fromEntries(new FormData(f));const titles=v.titles.split(/\n+/).map(x=>x.trim()).filter(Boolean).slice(0,60);titles.forEach(ti=>k.lessons.push({id:uid(),source:'moi',title:ti.slice(0,120),subject:v.subject.trim(),period:v.period,done:false,doneDate:'',homework:''}));rerender();toast(titles.length+' '+tr('leçon(s) ajoutée(s).','lesson(s) added.'));return;}
    if(f.dataset.tkGradeForm){ev.preventDefault();const e=k.evals.find(x=>x.id===f.dataset.tkGradeForm);let bad=0;for(const s of k.students){let v=(f.elements[s.id]?.value||'').trim().toLowerCase();if(v==='abs'){e.marks[s.id]='abs';continue;}if(v===''){delete e.marks[s.id];continue;}const n=Number(v.replace(',','.'));if(!Number.isFinite(n)||n<0||n>e.scale){bad++;continue;}e.marks[s.id]=String(n);}
      if(bad){toast(bad+' '+tr('note(s) hors barème ignorée(s).','mark(s) outside the scale ignored.'));}
      ui.openEval=null;ui.resultsEval=e.id;rerender();if(!bad)toast(tr('Notes enregistrées.','Marks saved.'));return;}
  }
  const screen=document.getElementById('screen');
  if(screen){screen.addEventListener('click',onClick);screen.addEventListener('change',onChange);screen.addEventListener('input',onInput);screen.addEventListener('keydown',onKey);screen.addEventListener('submit',onSubmit);}
})();
