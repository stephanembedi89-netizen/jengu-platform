/* Primary homework extends the daily check-in; secondary reuses its work ledger. */
function homeworkFollowup(records, child) {
  if (!child || child.track !== 'primary' || child.professional) return [];
  return records.filter(w => w.childId === child.id && w.level === child.level && w.reviewedAt)
    .slice().sort((a,b) => b.reviewedAt.localeCompare(a.reviewedAt));
}
(function () {
  const t = (fr, en) => tr(fr, en);
  let editingTest = null;
  const formDrafts = new Map();
  let activeWork = null;
  let workStep = 0;
  const outcomeDrafts = new Map();
  function workPanel(w, host) {
    activeWork=w.id;
    const labels=[t('Comprendre','Understand'),t('Aider sur un point','Help with one step'),t('Faire le bilan','Review together')];
    host.innerHTML='<div class="hw-line"><b>'+esc(w.subject)+' · '+esc(data.children[selected].level)+'</b><button class="secondary" id="hw-close-flow">'+t('Revenir aux devoirs','Back to homework')+'</button></div><h3>'+esc(w.task)+'</h3><ol class="hw-flow-steps">'+labels.map((s,i)=>'<li '+(i===workStep?'aria-current="step"':'')+'>'+s+'</li>').join('')+'<h2 tabindex="-1">'+['2 min · ','5 min · ','3 min · '][workStep]+labels[workStep]+'</h2>';
    const body=document.createElement('div');host.append(body);
    const guideBox=document.createElement('div');guideBox.innerHTML=primaryLevelGuide(data.children[selected]);host.querySelector('h3').after(guideBox);
    if(workStep===0){
      body.innerHTML='<p>'+t('Demandez : « Que dois-tu faire ? Montre-moi un exemple dans ton cahier. » Laissez votre enfant essayer la première étape.','Ask: “What do you need to do? Show me an example in your exercise book.” Let your child try the first step.')+'</p><label>'+t('Le point à reprendre (facultatif)','The point to revisit (optional)')+'<textarea id="hw-focus" maxlength="240">'+esc(w.note||'')+'</textarea></label><label>'+t('La méthode ou l’exemple du cahier (facultatif)','The method or example from the exercise book (optional)')+'<textarea id="hw-method" maxlength="1000">'+esc(w.method||'')+'</textarea></label><button id="hw-continue">'+t('Aider sur ce point','Help with this step')+'</button>';
      body.querySelector('#hw-focus').oninput=e=>{w.note=e.target.value;};
      body.querySelector('#hw-focus').onchange=()=>save();
      body.querySelector('#hw-method').oninput=e=>{w.method=e.target.value;};
      body.querySelector('#hw-method').onchange=()=>save();
      body.querySelector('#hw-continue').onclick=()=>{save();workStep=1;workPanel(w,host);};
    }else if(workStep===1){
      body.innerHTML='<p>'+t('Gardez la méthode du cahier. Regardez un exemple ensemble, puis laissez votre enfant essayer.','Follow the exercise book’s method. Look at one example together, then let your child try.')+'</p><p>'+esc(w.note||w.goal||'')+'</p><button id="hw-explain-inline" class="secondary">'+t('Aidez-moi à expliquer','Help me explain')+'</button><div id="help-results" aria-live="polite"></div><div class="actions"><button id="hw-back-step" class="secondary">'+t('Revoir la difficulté','Review the difficulty')+'</button><button id="hw-continue">'+t('Faire le bilan avec mon enfant','Review with my child')+'</button></div>';
      const languageBox=document.createElement('div');body.querySelector('#hw-explain-inline').before(languageBox);helpLanguageControl(languageBox,data.children[selected],w.subject,()=>workPanel(w,host));
      body.querySelector('#hw-explain-inline').onclick=()=>{
        helpDraft={subject:w.subject,query:[w.task,w.note,w.method?t('Méthode du cahier : ','Exercise book method: ')+w.method:''].filter(Boolean).join('\n'),lang:adultHelpLanguage()};
        showHelpResults(data.children[selected],t);
        homeExplanationTools(body.querySelector("#help-results"),w,data.children[selected]);
      };
      body.querySelector('#hw-back-step').onclick=()=>{workStep=0;workPanel(w,host);};
      body.querySelector('#hw-continue').onclick=()=>{workStep=2;workPanel(w,host);};
    }else{
      body.innerHTML='<p>'+t('Demandez : « Montre-moi comment tu fais sur un petit exemple. » Ce bilan décrit votre observation à la maison.','Ask: “Show me how you do it with a small example.” This review records your observation at home.')+'</p><form id="hw-outcome"><fieldset><legend>'+t('Après cet essai','After this attempt')+'</legend>'+[['alone',t('Il a réussi seul','Succeeded independently')],['done',t('Il a réussi avec de l’aide','Succeeded with help')],['help',t('Nous avons encore besoin d’aide','We still need help')]].map(([v,s])=>'<label><input type="radio" name="result" value="'+v+'" required '+(w.state===v?'checked':'')+'> '+s+'</label>').join('')+'</fieldset><label>'+t('La prochaine petite étape (facultatif)','The next small step (optional)')+'<input name="next" maxlength="240" value="'+esc(w.next||'')+'"></label><div class="actions"><button type="button" class="secondary" id="hw-back-step">'+t('Revoir l’aide','Review the help')+'</button><button>'+t('Garder ce bilan','Save this review')+'</button></div></form>';
      body.querySelector('#hw-back-step').onclick=()=>{workStep=1;workPanel(w,host);};
      const outcome=body.querySelector('form'),draft=outcomeDrafts.get(w.id);
      if(draft){outcome.elements.result.value=draft.result||'';outcome.elements.next.value=draft.next||'';}
      outcome.oninput=()=>outcomeDrafts.set(w.id,Object.fromEntries(new FormData(outcome)));
      outcome.onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);w.state=f.get('result');w.next=String(f.get('next')||'').trim();w.reviewedAt=new Date().toISOString();outcomeDrafts.delete(w.id);save();activeWork=null;refresh();toast(t('Bilan gardé avec ce devoir.','Review saved with this homework.'));};
    }
    host.querySelector('#hw-close-flow').onclick=()=>{save();activeWork=null;refresh();};
    host.querySelector('h2').focus({preventScroll:true});
  }
  function refresh(exclude) {
    const key=data.children[selected].id;
    for(const id of ['hw-form','hw-test-form']){
      const form=document.getElementById(id);
      if(id===exclude)formDrafts.delete(key+id);
      else if(form)formDrafts.set(key+id,Object.fromEntries(new FormData(form)));
    }
    render();
  }
  const previousNormalize = normalizeData;
  normalizeData = function (value) {
    const result = previousNormalize(value);
    result.homework = Array.isArray(value?.homework) ? value.homework : [];
    result.homeworkTests = Array.isArray(value?.homeworkTests) ? value.homeworkTests : [];
    return result;
  };
  const owns = x => x.childId === data.children[selected]?.id && x.level === data.children[selected]?.level;
  const items = () => (data.homework ||= []).filter(owns);
  const tests = () => (data.homeworkTests ||= []).filter(owns);
  const states = () => [['todo',t('À faire','To do')],['help',t('Ça bloque','Stuck')],['done',t('Fait avec aide','Done with help')],['alone',t('Refait seul','Tried again independently')]];
  const friday = () => { const d = new Date(localDay()+'T12:00:00'); d.setDate(d.getDate()+(5-d.getDay()+7)%7); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
  function guide() {
    return '<ol class="hw-guide"><li><b>'+t('2 min · Comprendre','2 min · Understand')+'</b><p>'+t('Ouvrez le cahier : « Qu’est-ce qu’on te demande de faire ? Montre-moi l’exemple de la maîtresse ou du maître. »','Open the exercise book: “What are you being asked to do? Show me your teacher’s example.”')+'</p></li><li><b>'+t('5 min · Aider sur un point','5 min · Help with one step')+'</b><p>'+t('Laissez l’enfant essayer. S’il bloque : « Quelle est la première petite étape ? » Utilisez des bouchons pour compter, un dessin ou une phrase de la vie courante. Gardez la méthode du cahier.','Let your child try. If stuck: “What is the first small step?” Use bottle tops to count, a drawing or an everyday sentence. Follow the exercise book’s method.')+'</p></li><li><b>'+t('3 min · Vérifier ensemble','3 min · Check together')+'</b><p>'+t('« Explique-moi comment tu as fait. Peux-tu refaire un petit exemple seul ? » Notez ce qui reste difficile. Si vous ne connaissez pas la réponse, cherchez une explication ou préparez une question pour l’adulte qui accompagne.','“Explain how you did it. Can you try a small example on your own?” Note what remains difficult. If you do not know the answer, look for an explanation or prepare a question for the supporting adult.')+'</p></li></ol>';
  }
  function row(w) {
    return '<article class="hw-item"><div class="hw-line"><b>'+esc(w.subject)+'</b><span>'+t('Pour le ','Due ')+esc(w.due)+(w.due<localDay()&&['todo','help'].includes(w.state)?' · '+t('À replanifier','Reschedule'):'')+'</span></div><h3>'+esc(w.task)+'</h3><p>'+esc(w.goal||'')+'</p><label>'+t('Après le travail','After working')+'<select data-hw-state="'+esc(w.id)+'">'+states().map(([v,label])=>'<option value="'+v+'" '+(v===w.state?'selected':'')+'>'+label+'</option>').join('')+'</select></label><label>'+t('Le point qui bloque ou reste à revoir','What is difficult or needs practice')+'<input data-hw-note="'+esc(w.id)+'" maxlength="240" value="'+esc(w.note||'')+'"></label><div class="actions"><button class="secondary" data-hw-help="'+esc(w.id)+'">'+t('Aidez-moi à lui expliquer','Help me explain it')+'</button><button class="secondary" data-hw-question="'+esc(w.id)+'">'+t('Préparer une question','Prepare a question')+'</button><button class="remove" data-hw-remove="'+esc(w.id)+'">'+t('Retirer','Remove')+'</button></div></article>';
  }
  function review(e) {
    const linked=items().filter(w=>w.subject===e.subject && (!e.from||w.due>=e.from) && w.due<=e.date);
    const weak=linked.filter(w=>w.state!=='alone');
    return '<article class="hw-item"><div class="hw-line"><b>'+esc(e.subject)+' · '+esc(e.title)+'</b><span>'+esc(e.date)+'</span></div><p>'+t('Notions annoncées dans le cahier : ','Topics announced in the exercise book: ')+esc(e.topics)+'</p><p>'+linked.length+' '+t('devoir(s) lié(s) par matière et période.','homework item(s) linked by subject and date range.')+'</p>'+(weak.length?'<h3>'+t('À revoir en priorité','Practise first')+'</h3><ul>'+weak.map(w=>'<li>'+esc(w.task)+(w.note?' — '+esc(w.note):'')+'</li>').join('')+'</ul>':'<p>'+t('Pas de difficulté signalée dans les devoirs liés. Faites un petit essai sans le cahier ; cela ne garantit pas que tout est acquis.','No difficulty recorded in linked homework. Try a short exercise without the book; this does not guarantee mastery.')+'</p>')+'<p>'+t('Un petit entraînement : une question orale, un exercice du cahier refait seul, puis une correction expliquée. Étalez les reprises avant la date prévue.','A short practice: one oral question, one exercise tried independently, then an explained correction. Spread practice before the due date.')+'</p><label>'+t('Après le contrôle : que faut-il encore travailler ?','After the test: what needs more practice?')+'<input data-hw-test-note="'+esc(e.id)+'" value="'+esc(e.note||'')+'" maxlength="300"></label><button class="remove" data-hw-test-remove="'+esc(e.id)+'">'+t('Retirer ce contrôle','Remove this test')+'</button></article>';
  }
  function view() {
    const c=data.children[selected];
    return '<h1>'+t('Devoirs à domicile','Homework')+'</h1><p>'+esc(c.name)+' · '+esc(c.level)+'</p><p class="note">'+t('Les 10 minutes servent à accompagner un point. Les devoirs peuvent prendre plus longtemps : prévoyez une pause et reprenez si nécessaire.','The 10-minute check-in helps with one point. Homework can take longer: take a break and return if needed.')+'</p><div class="hw-layout"><section><h2>'+t('Le travail du cahier','Work from the exercise book')+'</h2><form id="hw-form" class="formgrid"><label>'+t('Matière','Subject')+'<input name="subject" list="hw-subjects" required maxlength="100"></label><datalist id="hw-subjects">'+primarySubjects(c).map(s=>'<option value="'+esc(s)+'"></option>').join('')+'</datalist><label>'+t('Pour quand ?','Due date')+'<input name="due" type="date" required value="'+localDay()+'"></label><label class="full">'+t('Consigne ou exercice donné','Instruction or assigned exercise')+'<textarea name="task" required maxlength="500" placeholder="'+t('Ex. Lire le texte page 12 et répondre aux questions 1 et 2','e.g. Read page 12 and answer questions 1 and 2')+'"></textarea></label><label class="full">'+t('Petit objectif (facultatif)','Small goal (optional)')+'<input name="goal" maxlength="200" placeholder="'+t('Ex. Retrouver la réponse dans le texte','e.g. Find the answer in the text')+'"></label><button>'+t('Ajouter ce devoir','Add homework')+'</button></form><h2>'+t('Les devoirs à suivre','Homework to follow up')+'</h2>'+(items().slice().sort((a,b)=>a.due.localeCompare(b.due)).map(row).join('')||'<p>'+t('Commencez par un devoir du cahier. Vous pourrez noter plusieurs matières pour le même jour.','Start with one assignment. You can add several subjects for the same day.')+'</p>')+'</section><section class="hw-coach"><h2>'+t('Comment l’aider ce soir ?','How can I help tonight?')+'</h2>'+guide()+'</section></div><section class="hw-review"><h2>'+t('Préparer le prochain contrôle','Prepare for the next test')+'</h2><p>'+t('Le vendredi est proposé si votre école fait un contrôle hebdomadaire. Changez la date et les notions selon le cahier de l’enfant.','Friday is suggested if your school holds a weekly test. Change the date and topics to match your child’s exercise book.')+'</p><details><summary>'+t('Ajouter un contrôle ou une composition','Add a test or exam')+'</summary><form id="hw-test-form" class="formgrid"><label>'+t('Matière','Subject')+'<input name="subject" list="hw-subjects" required maxlength="100"></label><label>'+t('Intitulé','Title')+'<input name="title" required maxlength="100" value="'+t('Contrôle de la semaine','Weekly test')+'"></label><label>'+t('Revoir les devoirs depuis le','Review homework from')+'<input name="from" type="date" required value="'+localDay()+'"></label><label>'+t('Date du contrôle','Test date')+'<input name="date" type="date" required value="'+friday()+'"></label><label class="full">'+t('Notions annoncées par l’enseignant','Topics announced by the teacher')+'<textarea name="topics" required maxlength="500"></textarea></label><button>'+t('Préparer ce contrôle','Prepare this test')+'</button></form></details>'+tests().slice().sort((a,b)=>a.date.localeCompare(b.date)).map(review).join('')+'</section>';
  }
  function bind() {
    // Unique field IDs also preserve each form independently during language changes.
    document.querySelectorAll('#hw-form [name],#hw-test-form [name]').forEach(el=>el.id=el.form.id+'-'+el.name);
    for(const id of ['hw-form','hw-test-form']){
      const form=document.getElementById(id),draft=formDrafts.get(data.children[selected].id+id);
      if(draft)for(const [name,value] of Object.entries(draft))if(form.elements[name])form.elements[name].value=value;
      if(id==='hw-test-form'&&editingTest&&tests().some(x=>x.id===editingTest)){form.closest('details').open=true;form.querySelector('button').textContent=t('Enregistrer les changements','Save changes');}
    }
    document.querySelectorAll('[data-hw-test-remove]').forEach(remove=>{
      const edit=document.createElement('button');edit.type='button';edit.className='secondary';edit.textContent=t('Modifier le contrôle','Edit test');remove.before(edit);
      edit.onclick=()=>{const e=tests().find(x=>x.id===remove.dataset.hwTestRemove);if(!e)return;editingTest=e.id;const form=document.getElementById('hw-test-form');for(const name of ['subject','title','from','date','topics'])form.elements[name].value=e[name]||'';form.closest('details').open=true;form.querySelector('button').textContent=t('Enregistrer les changements','Save changes');form.elements.subject.focus();};
    });
    for (const [id,key] of [['hw-form','homework'],['hw-test-form','homeworkTests']]) document.getElementById(id).onsubmit=e=>{
      e.preventDefault();const values=Object.fromEntries(new FormData(e.target));
      for(const k of Object.keys(values))values[k]=values[k].trim();
      if(!values.subject || (key==='homework'&&!values.task) || (key==='homeworkTests'&&(!values.topics||!values.title)))return toast(t('Complétez la matière et le travail à préparer.','Enter the subject and work to prepare.'));
      if(values.from&&values.from>values.date)return toast(t('Le début des révisions doit précéder le contrôle.','The review period must start no later than the test.'));
      const existing=key==='homeworkTests'&&editingTest?tests().find(x=>x.id===editingTest):null;
      if(existing)Object.assign(existing,values);
      else (data[key]||=[]).push({id:klasId(),childId:data.children[selected].id,level:data.children[selected].level,...values,state:'todo'});
      if(key==='homeworkTests')editingTest=null;
      save();refresh(id);toast(t('Suivi mis à jour.','Follow-up updated.'));
    };
    for(const [selector,key,property] of [['data-hw-state','homework','state'],['data-hw-note','homework','note'],['data-hw-test-note','homeworkTests','note']])document.querySelectorAll('['+selector+']').forEach(el=>el.onchange=()=>{const w=data[key].find(x=>x.id===el.getAttribute(selector)&&owns(x));if(w){w[property]=el.value;save();if(property==='state')refresh();}});
    for(const [attr,key] of [['data-hw-remove','homework'],['data-hw-test-remove','homeworkTests']])document.querySelectorAll('['+attr+']').forEach(b=>b.onclick=()=>{if(!confirm(t('Retirer cette entrée ?','Remove this entry?')))return;data[key]=data[key].filter(x=>x.id!==b.getAttribute(attr)||!owns(x));save();render();});
    document.querySelectorAll('[data-hw-help]').forEach(b=>{
      const w=items().find(x=>x.id===b.dataset.hwHelp),host=b.closest('article');
      if(w.reviewedAt){const summary=document.createElement('p');summary.className='note';summary.textContent=t('Dernier bilan : ','Last review: ')+(states().find(x=>x[0]===w.state)?.[1]||'')+(w.next?' · '+w.next:'');host.append(summary);}
      b.textContent=t('Accompagner ce devoir · 10 min','Work on this homework · 10 min');
      b.onclick=()=>{activeWork=null;refresh();workStep=0;const button=[...document.querySelectorAll('[data-hw-help]')].find(x=>x.dataset.hwHelp===w.id);workPanel(w,button.closest('article'));};
      if(activeWork===w.id)workPanel(w,host);
    });
    document.querySelectorAll('[data-hw-question]').forEach(b=>b.onclick=()=>{const w=items().find(x=>x.id===b.dataset.hwQuestion);modal('<h2>'+t('Question à relire','Review your question')+'</h2><p>'+t('Pour l’enseignant ou l’accompagnateur. Aucun envoi automatique.','For the teacher or tutor. Nothing is sent automatically.')+'</p><textarea id="hw-message" rows="6">'+esc(t('Bonjour, pour le devoir de ','Hello, for the homework in ')+w.subject+' : '+w.task+'\n'+t('Le point à reprendre : ','The point to revisit: ')+(w.note||t('À préciser avec l’enfant.','To clarify with the child.'))+'\n'+t('Quelle première étape pouvons-nous revoir avec la méthode du cahier ?','Which first step can we revisit using the exercise book’s method?'))+'</textarea><button id="hw-copy">'+t('Copier la question','Copy question')+'</button><p id="hw-copy-status" role="status"></p>');document.getElementById('hw-copy').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('hw-message').value);document.getElementById('hw-copy-status').textContent=t('Question copiée.','Question copied.');}catch{document.getElementById('hw-message').select();document.getElementById('hw-copy-status').textContent=t('Sélectionnez puis copiez le texte.','Select and copy the text.');}};});
  }
  const previousRender=render;
  render=function(){
    previousRender();
    if(role!=='parent')return;
    const primary=data.children[selected]?.track==='primary';
    if(primary&&page==='homework'){document.getElementById('screen').innerHTML=view();bind();}
    if(primary&&['home','routine','daily','progress'].includes(page)){
      const section=document.createElement('section');section.className='hw-shortcut';
      section.innerHTML='<div><h2>'+t('Un devoir à faire ce soir ?','Homework tonight?')+'</h2><p>'+t('Retrouvez les consignes, aidez sur un point et préparez le prochain contrôle.','Find assignments, help with one point and prepare for the next test.')+'</p></div><button>'+t('Voir les devoirs','View homework')+'</button>';
      section.querySelector('button').onclick=()=>openRoute('homework');document.getElementById('screen').append(section);
      const reviews=homeworkFollowup(data.homework||[],data.children[selected]);
      if(reviews.length){
        const followup=document.createElement('section');followup.className='card hw-followup';
        followup.innerHTML='<h2>'+t('Nos derniers bilans de devoirs','Our latest homework reviews')+'</h2><p>'+t('Observations à la maison, pour cet enfant et cette classe.','Home observations for this child and class.')+'</p>';
        for(const w of reviews.slice(0,page==='progress'?10:3)){
          const row=document.createElement('article');row.className='hw-item';
          const next=w.next||(w.state==='alone'?t('Reprendre un petit exemple plus tard.','Try a small example again later.'):w.state==='done'?t('Refaire un petit exemple sans aide.','Try a small example without help.'):t('Préparer une question pour l’enseignant ou l’accompagnateur.','Prepare a question for the teacher or learning coach.'));
          row.innerHTML='<b>'+esc(w.subject)+'</b><h3>'+esc(w.task)+'</h3><p>'+esc(states().find(x=>x[0]===w.state)?.[1]||'')+'</p><p><strong>'+t('Prochaine étape : ','Next step: ')+'</strong>'+esc(next)+'</p><button class="secondary">'+t('Retrouver ce devoir','Open this homework')+'</button>';
          row.querySelector('button').onclick=()=>{activeWork=w.id;workStep=w.state==='alone'?2:0;openRoute('homework');};
          followup.append(row);
        }
        section.after(followup);
      }
    }
    if(!primary){
      const student=activeAudience()==='student',button=document.querySelector('#nav [data-route="college"]');
      if(button)button.textContent=student?t('Mes devoirs et leçons','My homework and lessons'):t('Ses devoirs et leçons','Their homework and lessons');
      if(page==='college'){
        const note=document.createElement('p');note.className='note';note.textContent=student?t('Tu organises tes devoirs et renseignes ton avancement. Pour un contrôle ou une composition, prévois aussi tes séances dans « Mes révisions ». Le parent fait le point avec toi.','Organise your homework and record your progress. For a test or exam, also plan sessions in “My revision”. Your parent checks in with you.'):t('Votre enfant renseigne ses devoirs et son avancement dans l’espace Élève. Vous suivez les échéances et décidez ensemble de l’aide utile pendant le point de 10 minutes.','Your child records homework and progress in the Student view. Follow deadlines and agree on useful support during the 10-minute check-in.');document.getElementById('screen').prepend(note);
      }
    }
  };
  render();
}());
