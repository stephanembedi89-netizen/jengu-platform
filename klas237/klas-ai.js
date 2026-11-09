/* Klas 237 · Assistant IA « Le relais ».
   On demande comme on veut : en écrivant, en parlant, en photographiant le cahier ou en écrivant à la main.
   La réponse arrive en cartes : comprendre, autres façons, exemples, à essayer, étapes, conseils, vérifier.
   - Compte connecté + service activé (NDAB_CONFIG.aiEnabled) : appel à la fonction Supabase « klas-ai ».
   - Sinon : réponses de démonstration, clairement signalées. */
(function(){
  'use strict';
  const cfg=window.NDAB_CONFIG||{};
  const T=(fr,en)=>tr(fr,en);
  const ui={task:'',subject:'',images:[],busy:false,answer:null,demo:false,listening:false,rec:null,lastQuestion:''};
  const live=()=>!!(cfg.aiEnabled&&cfg.supabaseUrl&&typeof cloud!=='undefined'&&cloud&&typeof session!=='undefined'&&session&&session.access_token);

  function who(){if(role==='teacher')return 'teacher';if(role==='tutor')return 'tutor';const a=typeof activeAudience==='function'?activeAudience():role;return a==='student'?'student':'parent';}
  const TASKS={
    parent:[['expliquer','Comprendre la notion','Understand the topic'],['autrement','Une autre façon','Another way'],['exemples','Plus d’exemples','More examples']],
    student:[['indice','Un indice, pas la réponse','A hint, not the answer']],
    teacher:[['preparer_cours','Préparer un cours','Plan a lesson'],['exercices','Créer des exercices','Create exercises'],['remediation','Reprendre une notion','Reteach a topic'],['gestion','Gérer ma classe','Classroom management'],['rediger','Rédiger un message','Write a message']],
    tutor:[['seance','Préparer une séance','Plan a session'],['expliquer','Comprendre la notion','Understand the topic'],['autrement','Une autre façon','Another way'],['rediger','Rédiger un bilan','Write a report']]
  };
  const PLACEHOLDER={parent:T('Ex. Il ne comprend pas les fractions. Comment le lui expliquer ?','e.g. They don’t understand fractions. How can I explain?'),student:T('Ex. Je ne sais pas comment commencer l’exercice 3.','e.g. I don’t know how to start exercise 3.'),teacher:T('Ex. Une séance de 55 min sur les fractions en CM1, classe de 70 élèves.','e.g. A 55-min lesson on fractions in CM1, 70 pupils.'),tutor:T('Ex. Élève de 3e qui bloque sur Thalès.','e.g. 3e student stuck on the intercept theorem.')};
  function ctx(){
    const c=data.children[selected]||{};const ly=window.klasLycee&&klasLycee(c.level);
    return {level:c.level||'',cycle:c.track==='primary'?'primaire':ly?'lycée':'collège',subsystem:c.subsystem||'fr',serie:ly?ly.info.full:'',subject:ui.subject,lang:uiLanguage};
  }
  function subjects(){const c=data.children[selected];try{if(c?.track==='college')return collegeSubjects(c.level);if(typeof primarySubjects==='function')return primarySubjects(c);}catch(e){}return ['Mathématiques','Français','Sciences','Anglais'];}

  /* ---------- Panneau ---------- */
  let panel,scrim;
  function build(){
    scrim=document.createElement('div');scrim.className='ai-scrim';scrim.hidden=true;scrim.addEventListener('click',e=>{if(e.target===scrim)close();});
    panel=document.createElement('section');panel.className='ai-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','ai-title');
    scrim.append(panel);document.body.append(scrim);
    panel.addEventListener('click',onClick);panel.addEventListener('change',onChange);panel.addEventListener('submit',onSubmit);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!scrim.hidden)close();});
  }
  function open(task,question){
    if(!panel)build();const w=who();ui.task=task&&TASKS[w].some(t=>t[0]===task)?task:TASKS[w][0][0];
    if(question)ui.lastQuestion=question;paint();scrim.hidden=false;document.body.classList.add('ai-open');
    setTimeout(()=>panel.querySelector('#ai-question')?.focus(),60);
  }
  function close(){stopVoice();window.speechSynthesis&&speechSynthesis.cancel();scrim.hidden=true;document.body.classList.remove('ai-open');}
  window.klasAI={open};

  function paint(){
    const w=who(),c=ctx(),S=subjects();
    const chip=[c.level,c.serie||c.cycle].filter(Boolean).join(' · ');
    panel.innerHTML='<header class="ai-head"><div class="ai-logo" aria-hidden="true"><span></span></div><div><h2 id="ai-title">'+T('Assistant Klas','Klas assistant')+'</h2><p>'+esc(chip)+(ui.demo||!live()?' · <b class="ai-demo-tag">'+T('Démonstration','Demo')+'</b>':'')+'</p></div><button type="button" class="ai-x" data-ai="close" aria-label="'+T('Fermer','Close')+'">×</button></header>'+
      '<div class="ai-body"><form id="ai-form" class="ai-ask"><div class="ai-tasks" role="group" aria-label="'+T('Ce dont j’ai besoin','What I need')+'">'+TASKS[w].map(([k,fr,en])=>'<button type="button" data-ai-task="'+k+'" aria-pressed="'+(ui.task===k)+'">'+T(fr,en)+'</button>').join('')+'</div>'+
      '<label class="ai-field">'+T('Matière','Subject')+'<input id="ai-subject" list="ai-subjects" value="'+esc(ui.subject)+'" maxlength="80" placeholder="'+T('Ex. Mathématiques','e.g. Mathematics')+'"></label><datalist id="ai-subjects">'+S.map(s=>'<option value="'+esc(s)+'"></option>').join('')+'</datalist>'+
      '<label class="ai-field">'+T('Votre question','Your question')+'<textarea id="ai-question" rows="3" maxlength="2000" placeholder="'+esc(PLACEHOLDER[w])+'">'+esc(ui.lastQuestion)+'</textarea></label>'+
      '<div class="ai-tools"><button type="button" class="ai-tool'+(ui.listening?' is-on':'')+'" data-ai="voice" aria-pressed="'+ui.listening+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg><span>'+(ui.listening?T('J’écoute…','Listening…'):T('Dicter','Speak'))+'</span></button>'+
      '<label class="ai-tool"><input type="file" accept="image/*" capture="environment" id="ai-photo" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><span>'+T('Photo du cahier','Photo of the book')+'</span></label>'+
      '<button type="button" class="ai-tool" data-ai="draw"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16l-1 4Z"/><path d="M14 6l3 3"/></svg><span>'+T('Écrire à la main','Handwrite')+'</span></button></div>'+
      (ui.images.length?'<div class="ai-thumbs">'+ui.images.map((im,i)=>'<figure><img src="data:'+im.media_type+';base64,'+im.data+'" alt="'+T('Image jointe ','Attached image ')+(i+1)+'"><button type="button" data-ai-rm="'+i+'" aria-label="'+T('Retirer l’image','Remove image')+'">×</button></figure>').join('')+'</div>':'')+
      '<details class="ai-method"><summary>'+T('Ajouter la méthode du cahier (facultatif)','Add the exercise-book method (optional)')+'</summary><textarea id="ai-method" rows="2" maxlength="1500" placeholder="'+T('Ex. La maîtresse fait poser l’opération en colonnes.','e.g. The teacher sets it out in columns.')+'"></textarea></details>'+
      '<p class="ai-privacy">'+T('N’écrivez ni nom complet ni numéro. La photo ne doit montrer que l’exercice.','Do not include full names or numbers. The photo should show only the exercise.')+'</p>'+
      '<button type="submit" class="ai-send"'+(ui.busy?' disabled':'')+'>'+(ui.busy?T('Je réfléchis…','Thinking…'):T('Demander','Ask'))+'</button></form>'+
      '<div class="ai-result" aria-live="polite">'+(ui.busy?loader():ui.answer?renderAnswer(ui.answer,w):intro(w))+'</div></div>';
  }
  function intro(w){
    const items={parent:[T('Il ne comprend pas une leçon : demandez une autre façon de l’expliquer.','They don’t get a lesson: ask for another way to explain it.'),T('Photographiez l’exercice du cahier : l’assistant le lit et vous guide.','Photograph the exercise: the assistant reads it and guides you.'),T('Parlez simplement : bouton « Dicter ».','Just speak: “Speak” button.')],student:[T('Tu reçois un indice et un exemple, pas la réponse : c’est toi qui trouves.','You get a hint and an example, not the answer: you find it.')],teacher:[T('Une séance complète en approche par compétences, avec durées et trace écrite.','A full competency-based lesson with timings and notes.'),T('Des exercices progressifs avec corrigé, une remédiation après une évaluation.','Graded exercises with answers, remediation after a test.'),T('Un conseil pour une classe nombreuse, un message aux parents.','Advice for a large class, a message to parents.')],tutor:[T('Une séance ciblée sur le blocage, et un bilan prêt pour les parents.','A session targeted at the difficulty, and a report ready for parents.')]}[w];
    return '<div class="ai-intro"><p><b>'+T('Je vous aide quand ça bloque.','I help when you’re stuck.')+'</b></p><ul>'+items.map(i=>'<li>'+i+'</li>').join('')+'</ul></div>';
  }
  function loader(){return '<div class="ai-loading"><span></span><span></span><span></span><p>'+T('Je lis la question et je prépare plusieurs façons de l’expliquer…','Reading the question and preparing several ways to explain it…')+'</p></div>';}

  /* ---------- Réponse en cartes ---------- */
  function renderAnswer(a,w){
    const card=(cls,icon,title,body,speak)=>'<article class="ai-card '+cls+'"><header><span class="ai-ic" aria-hidden="true">'+icon+'</span><h3>'+title+'</h3>'+(speak?'<button type="button" class="ai-speak" data-ai-say="'+esc(speak)+'" aria-label="'+T('Écouter','Listen')+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg></button>':'')+'</header>'+body+'</article>';
    const p=s=>'<p>'+esc(s).replace(/\n/g,'<br>')+'</p>';
    let h=(ui.demo?'<p class="ai-demo-note">'+T('Réponse de démonstration. Avec le service IA activé, chaque réponse est rédigée pour votre question précise.','Demo answer. With the AI service on, every answer is written for your exact question.')+'</p>':'')+'<h3 class="ai-title">'+esc(a.titre||'')+'</h3>';
    if(a.lu_dans_image)h+=card('read','📖',T('Ce que j’ai lu','What I read'),p(a.lu_dans_image));
    if(a.comprendre)h+=card('core','💡',w==='teacher'&&ui.task==='rediger'?T('Le texte','The text'):T('L’idée à comprendre','The key idea'),p(a.comprendre),a.comprendre);
    (a.autres_facons||[]).forEach((x,i)=>{h+=card('way w'+(i%3),['🧺','✏️','🪜'][i%3],esc(x.titre),p(x.texte),x.titre+'. '+x.texte);});
    if(a.exemples?.length)h+=card('ex','🔎',T('Exemples','Examples'),'<ol class="ai-list">'+a.exemples.map(x=>'<li><p>'+esc(x.enonce)+'</p><details><summary>'+T('Voir la solution','Show the solution')+'</summary>'+p(x.solution)+'</details></li>').join('')+'</ol>');
    if(a.a_essayer?.length)h+=card('try','🎯',w==='student'?T('À toi de jouer','Your turn'):T('À essayer ensemble','Try together'),'<ol class="ai-list">'+a.a_essayer.map(x=>'<li><p>'+esc(x.consigne)+'</p>'+(x.reponse?'<details><summary>'+T('Voir la réponse','Show the answer')+'</summary>'+p(x.reponse)+'</details>':'')+'</li>').join('')+'</ol>');
    if(a.etapes?.length)h+=card('steps','🗂️',T('Le déroulé','The plan'),'<ol class="ai-steps">'+a.etapes.map(x=>'<li><b>'+esc(x.titre)+'</b>'+(x.duree?'<time>'+esc(x.duree)+'</time>':'')+p(x.contenu)+'</li>').join('')+'</ol>');
    if(a.conseils?.length)h+=card('tips','🤝',w==='teacher'||w==='tutor'?T('Conseils pratiques','Practical tips'):T('Comment l’accompagner','How to support'),'<ul class="ai-list">'+a.conseils.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>');
    if(a.verifier)h+=card('check','✅',T('Vérifier que c’est compris','Check understanding'),p(a.verifier));
    if(a.si_ca_bloque)h+=card('next','➡️',T('Si ça bloque encore','If still stuck'),p(a.si_ca_bloque));
    if(a.prudence)h+='<p class="ai-caution">'+esc(a.prudence)+'</p>';
    h+='<div class="ai-follow">'+
      (w!=='student'?'<button type="button" data-ai-follow="autrement">'+T('Plus simple','Simpler')+'</button><button type="button" data-ai-follow="exemples">'+T('Autres exemples','More examples')+'</button>':'<button type="button" data-ai-follow="indice">'+T('Un autre indice','Another hint')+'</button>')+
      '<button type="button" data-ai="read-all">'+T('Tout écouter','Listen to all')+'</button><button type="button" data-ai="copy">'+T('Copier','Copy')+'</button>'+
      ((w==='teacher'||w==='tutor')&&a.etapes?.length?'<button type="button" class="ai-primary" data-ai="to-lesson">'+T('En faire ma préparation','Use as my lesson plan')+'</button>':'')+
      ((ui.task==='rediger')?'<a class="ai-wa" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(a.comprendre||'')+'">WhatsApp</a>':'')+
      '</div><p class="ai-foot">'+T('L’assistant peut se tromper : vérifiez avec le cahier et l’enseignant.','The assistant can be wrong: check with the book and the teacher.')+'</p>';
    return h;
  }
  const plain=a=>[a.titre,a.lu_dans_image,a.comprendre,...(a.autres_facons||[]).map(x=>x.titre+' : '+x.texte),...(a.exemples||[]).map(x=>x.enonce+' → '+x.solution),...(a.a_essayer||[]).map(x=>x.consigne+(x.reponse?' → '+x.reponse:'')),...(a.etapes||[]).map(x=>x.titre+(x.duree?' ('+x.duree+')':'')+' : '+x.contenu),...(a.conseils||[]),a.verifier,a.si_ca_bloque].filter(Boolean).join('\n\n');

  /* ---------- Voix ---------- */
  function startVoice(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){toast(T('La dictée n’est pas disponible sur ce navigateur. Essayez Chrome sur Android.','Dictation isn’t available in this browser. Try Chrome on Android.'));return;}
    const rec=new SR();rec.lang=uiLanguage==='en'?'en-GB':'fr-FR';rec.interimResults=true;rec.continuous=false;
    const box=panel.querySelector('#ai-question'),start=box.value?box.value.trim()+' ':'';
    rec.onresult=e=>{let txt='';for(const r of e.results)txt+=r[0].transcript;box.value=start+txt;ui.lastQuestion=box.value;};
    rec.onerror=e=>{ui.listening=false;paintTools();if(e.error==='not-allowed')toast(T('Autorisez le micro pour dicter.','Allow the microphone to dictate.'));};
    rec.onend=()=>{ui.listening=false;ui.rec=null;paintTools();};
    ui.rec=rec;ui.listening=true;rec.start();paintTools();
  }
  function stopVoice(){if(ui.rec){try{ui.rec.stop();}catch(e){}}ui.listening=false;}
  function paintTools(){const b=panel.querySelector('[data-ai="voice"]');if(!b)return;b.classList.toggle('is-on',ui.listening);b.setAttribute('aria-pressed',String(ui.listening));b.querySelector('span').textContent=ui.listening?T('J’écoute…','Listening…'):T('Dicter','Speak');}
  function say(text){
    if(!window.speechSynthesis){toast(T('La lecture à voix haute n’est pas disponible ici.','Read-aloud isn’t available here.'));return;}
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=uiLanguage==='en'?'en-GB':'fr-FR';u.rate=.95;
    const v=speechSynthesis.getVoices().find(x=>x.lang&&x.lang.startsWith(u.lang.slice(0,2)));if(v)u.voice=v;speechSynthesis.speak(u);
  }

  /* ---------- Images : photo et écriture à la main ---------- */
  function addImage(canvas){
    const data=canvas.toDataURL('image/jpeg',.82).split(',')[1];
    ui.images=[...ui.images.slice(-1),{media_type:'image/jpeg',data}];ui.lastQuestion=panel.querySelector('#ai-question')?.value||ui.lastQuestion;paint();
  }
  function loadPhoto(file){
    if(!file||!/^image\//.test(file.type))return;
    const img=new Image();img.onload=()=>{const max=1568,r=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*r);c.height=Math.round(img.height*r);const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(img.src);addImage(c);};
    img.onerror=()=>toast(T('Image illisible. Réessayez.','Unreadable image. Try again.'));img.src=URL.createObjectURL(file);
  }
  function drawPad(){
    const wrap=document.createElement('div');wrap.className='ai-pad';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-label',T('Écrire à la main','Handwrite'));
    wrap.innerHTML='<div class="ai-pad-box"><p>'+T('Écrivez ou dessinez l’exercice avec le doigt ou le stylet.','Write or draw the exercise with your finger or stylus.')+'</p><canvas width="900" height="560"></canvas><div class="ai-pad-actions"><button type="button" data-pad="clear" class="secondary">'+T('Effacer','Clear')+'</button><button type="button" data-pad="cancel" class="secondary">'+T('Annuler','Cancel')+'</button><button type="button" data-pad="use">'+T('Joindre à ma question','Attach to my question')+'</button></div></div>';
    document.body.append(wrap);const cv=wrap.querySelector('canvas'),g=cv.getContext('2d');
    const reset=()=>{g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);g.strokeStyle='rgba(0,122,94,.12)';g.lineWidth=1;for(let y=40;y<cv.height;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(cv.width,y);g.stroke();}g.strokeStyle='#14223b';g.lineWidth=4;g.lineCap='round';g.lineJoin='round';};
    reset();let drawing=false,used=false;
    const pos=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height];};
    cv.addEventListener('pointerdown',e=>{drawing=true;used=true;cv.setPointerCapture(e.pointerId);const [x,y]=pos(e);g.beginPath();g.moveTo(x,y);});
    cv.addEventListener('pointermove',e=>{if(!drawing)return;const [x,y]=pos(e);g.lineTo(x,y);g.stroke();});
    cv.addEventListener('pointerup',()=>{drawing=false;});
    wrap.addEventListener('click',e=>{const a=e.target.closest('[data-pad]')?.dataset.pad;if(!a)return;if(a==='clear'){reset();used=false;}if(a==='cancel')wrap.remove();if(a==='use'){if(!used){toast(T('Écrivez d’abord quelque chose.','Write something first.'));return;}addImage(cv);wrap.remove();}});
  }

  /* ---------- Envoi ---------- */
  async function ask(task,question){
    const w=who(),method=panel.querySelector('#ai-method')?.value||'';
    ui.subject=panel.querySelector('#ai-subject')?.value.trim()||ui.subject;ui.task=task||ui.task;ui.lastQuestion=question;
    if(question.trim().length<3&&!ui.images.length){toast(T('Écrivez, dictez ou photographiez la question.','Type, speak or photograph the question.'));return;}
    ui.busy=true;ui.answer=null;paint();
    try{
      if(live()){
        const r=await fetch(cfg.supabaseUrl+'/functions/v1/klas-ai',{method:'POST',headers:{'Content-Type':'application/json',apikey:cfg.publishableKey,Authorization:'Bearer '+session.access_token},body:JSON.stringify({role:w,task:ui.task,question,method,images:ui.images,context:ctx()})});
        const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||T('Service indisponible.','Service unavailable.'));
        ui.answer=j.answer;ui.demo=false;
      }else{await new Promise(r=>setTimeout(r,900));ui.answer=demoAnswer(w,ui.task,question,ui.images.length>0);ui.demo=true;}
    }catch(e){ui.answer=null;toast(e.message);}
    ui.busy=false;paint();panel.querySelector('.ai-title')?.scrollIntoView({block:'start',behavior:'smooth'});
  }

  function onClick(e){
    const b=e.target.closest('button,a');if(!b)return;const D=b.dataset;
    if(D.ai==='close'){close();return;}
    if(D.aiTask){ui.task=D.aiTask;ui.lastQuestion=panel.querySelector('#ai-question').value;ui.subject=panel.querySelector('#ai-subject').value;paint();return;}
    if(D.ai==='voice'){ui.listening?stopVoice():startVoice();return;}
    if(D.ai==='draw'){drawPad();return;}
    if(D.aiRm!=null){ui.images.splice(+D.aiRm,1);ui.lastQuestion=panel.querySelector('#ai-question').value;paint();return;}
    if(D.aiSay){say(D.aiSay);return;}
    if(D.ai==='read-all'&&ui.answer){say(plain(ui.answer));return;}
    if(D.ai==='copy'&&ui.answer){const t=plain(ui.answer);(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(T('Copié.','Copied.'))).catch(()=>toast(T('Sélectionnez le texte pour le copier.','Select the text to copy it.')));return;}
    if(D.aiFollow){ask(D.aiFollow,(ui.lastQuestion||'')+(D.aiFollow==='autrement'?T(' — Explique plus simplement, autrement.',' — Explain more simply, another way.'):D.aiFollow==='exemples'?T(' — Donne d’autres exemples.',' — Give more examples.'):T(' — Un autre indice.',' — Another hint.')));return;}
    if(D.ai==='to-lesson'&&ui.answer){const a=ui.answer,c=data.children[selected]||{};lessonDraft={level:c.level,group:c.name,subject:ui.subject,topic:a.titre,goal:a.comprendre,duration:'55'};close();if(typeof openRoute==='function')openRoute('build-course');toast(T('Déroulé repris dans « Préparer un cours ». Relisez et adaptez.','Plan copied into “Plan a lesson”. Review and adapt.'));return;}
  }
  function onChange(e){if(e.target.id==='ai-photo'){loadPhoto(e.target.files[0]);e.target.value='';}}
  function onSubmit(e){if(e.target.id!=='ai-form')return;e.preventDefault();stopVoice();ask(ui.task,panel.querySelector('#ai-question').value);}

  /* ---------- Points d'entrée ---------- */
  const dockBtn=document.createElement('button');dockBtn.type='button';dockBtn.className='ai-fab';dockBtn.innerHTML='<span class="ai-spark" aria-hidden="true"></span><span>'+T('Assistant','Assistant')+'</span>';dockBtn.addEventListener('click',()=>open());
  function placeDock(){const dock=document.querySelector('.kx-dock');const inWs=document.body.dataset.entry==='workspace';if(dock&&inWs&&dockBtn.parentNode!==dock)dock.prepend(dockBtn);if(!inWs&&dockBtn.parentNode)dockBtn.remove();dockBtn.querySelector('span:last-child').textContent=T('Assistant','Assistant');}
  const DEFAULT={parent:'expliquer',student:'indice',teacher:'preparer_cours',tutor:'seance'};
  function inject(){
    placeDock();if(document.body.dataset.entry!=='workspace')return;
    document.querySelectorAll('.learning-assistant button:not([data-ai-bound])').forEach(b=>{b.dataset.aiBound='1';b.textContent=T('Ouvrir l’assistant IA','Open the AI assistant');b.onclick=()=>open(DEFAULT[who()]);});
    document.querySelectorAll('#screen .tk-head-actions:not([data-ai-bound])').forEach(h=>{h.dataset.aiBound='1';const b=document.createElement('button');b.type='button';b.className='ai-inline';b.innerHTML='<span class="ai-spark" aria-hidden="true"></span>'+(who()==='teacher'?T('Préparer avec l’IA','Plan with AI'):who()==='student'?T('Un indice','A hint'):T('Demander à l’assistant','Ask the assistant'));b.addEventListener('click',()=>open(DEFAULT[who()]));h.prepend(b);});
    document.querySelectorAll('.fk-ritual .fk-steps li.is-current:not([data-ai-bound])').forEach(li=>{li.dataset.aiBound='1';const b=document.createElement('button');b.type='button';b.className='ai-mini';b.innerHTML='<span class="ai-spark" aria-hidden="true"></span>'+T('Ça bloque ? Demandez à l’assistant','Stuck? Ask the assistant');b.addEventListener('click',()=>open(who()==='student'?'indice':'autrement'));li.querySelector('div')?.append(b);});
  }
  if(typeof render==='function'){const prev=render;render=function(){prev();inject();};}
  new MutationObserver(()=>inject()).observe(document.body,{attributes:true,attributeFilter:['data-entry']});
  document.addEventListener('DOMContentLoaded',inject);inject();

  /* ---------- Réponses de démonstration (sans service IA) ---------- */
  function demoAnswer(w,task,q,hasImage){
    const s=(q||'').toLowerCase(),lu=hasImage?T('Exercice : « Colorie les 3/4 de la tablette de chocolat partagée en 8 carrés. »','Exercise: “Colour 3/4 of a chocolate bar split into 8 squares.”'):'';
    if(w==='teacher'&&(task==='preparer_cours'||task==='remediation'))return {titre:T('Séance · ','Lesson · ')+(q.slice(0,60)||T('les fractions en CM1','fractions in CM1')),lu_dans_image:lu,
      comprendre:T('Objectif observable : à la fin de la séance, chaque élève sait écrire et lire une fraction simple à partir d’un partage en parts égales. Prérequis : partager en parts égales, compter jusqu’à 20.','Observable goal: by the end, every pupil can write and read a simple fraction from an equal sharing. Prerequisites: equal sharing, counting to 20.'),
      autres_facons:[],exemples:[{enonce:T('Au tableau : un plantain coupé en 4 morceaux égaux, on en mange 3.','On the board: a plantain cut into 4 equal pieces, we eat 3.'),solution:T('On a mangé 3/4 du plantain : 4 parts égales en tout (dénominateur), 3 parts mangées (numérateur).','We ate 3/4: 4 equal parts in total (denominator), 3 eaten (numerator).')}],
      a_essayer:[{consigne:T('Un gâteau en 6 parts égales, Ama en prend 2. Quelle fraction ?','A cake in 6 equal parts, Ama takes 2. What fraction?'),reponse:'2/6'},{consigne:T('Colorie 1/2 d’une bande de 10 carreaux.','Colour 1/2 of a strip of 10 squares.'),reponse:T('5 carreaux','5 squares')}],
      etapes:[{titre:T('Situation de vie','Real-life situation'),duree:'10 min',contenu:T('Maman partage un ananas en 4 parts égales entre 4 enfants. Combien chacun reçoit-il ? Les élèves proposent, on note au tableau.','Mum shares a pineapple in 4 equal parts. How much does each child get? Pupils suggest, we write it up.')},{titre:T('Découverte en groupes','Discovery in groups'),duree:'15 min',contenu:T('Par groupes de 6 : bandes de papier à plier en 2, 4, 8. Chaque groupe colorie et nomme une part.','Groups of 6: paper strips folded into 2, 4, 8. Each group colours and names a part.')},{titre:T('Structuration · trace écrite','Structuring · written summary'),duree:'10 min',contenu:T('« Une fraction indique un partage en parts égales. Le dénominateur dit en combien de parts on partage, le numérateur combien de parts on prend. »','“A fraction shows equal sharing. The denominator says how many parts, the numerator how many we take.”')},{titre:T('Consolidation','Practice'),duree:'15 min',contenu:T('Exercices du manuel au choix selon le niveau ; binômes fort/fragile.','Book exercises by level; strong/weaker pairs.')},{titre:T('Évaluation','Assessment'),duree:'5 min',contenu:T('Sur l’ardoise : écris la fraction coloriée sur 3 dessins montrés.','On slates: write the fraction coloured on 3 pictures.')}],
      conseils:[T('Classe nombreuse : faites lever les ardoises toutes ensemble, vous voyez 70 réponses en 10 secondes.','Large class: all slates up at once, 70 answers in 10 seconds.'),T('Élèves en difficulté : bandes déjà pliées, fractions 1/2 et 1/4 seulement.','Struggling pupils: pre-folded strips, 1/2 and 1/4 only.'),T('Élèves rapides : comparer 2/4 et 1/2.','Fast finishers: compare 2/4 and 1/2.')],
      verifier:T('3 questions sur l’ardoise ; notez les élèves qui inversent numérateur et dénominateur pour la reprise.','3 slate questions; note pupils who swap numerator and denominator.'),si_ca_bloque:T('Reprendre le lendemain avec des objets réels (bâtonnets, capsules) avant le dessin.','Revisit tomorrow with real objects (sticks, bottle caps) before drawings.'),prudence:''};
    if(w==='teacher'&&task==='gestion')return {titre:T('Retrouver le calme dans une grande classe','Calm in a large class'),lu_dans_image:'',comprendre:T('Le bruit monte souvent aux transitions (sortie des cahiers, changement d’activité) et quand une partie de la classe attend.','Noise rises at transitions and when part of the class is waiting.'),autres_facons:[],exemples:[],a_essayer:[],etapes:[{titre:T('Dès demain','From tomorrow'),duree:'',contenu:T('Un signal unique (main levée, on se tait et on lève la main) répété jusqu’à devenir automatique.','One signal (raised hand: silence and raise hand) until it’s automatic.')},{titre:T('Cette semaine','This week'),duree:'',contenu:T('Nommer des chefs de rang qui distribuent et ramassent : moins de déplacements.','Row leaders hand out and collect: less movement.')}],conseils:[T('Toujours une tâche écrite au tableau pour ceux qui ont fini.','Always a written task on the board for early finishers.'),T('Félicitez à voix haute un rang calme plutôt que de gronder le plus bruyant.','Praise a calm row aloud rather than scolding the loudest.'),T('Changez d’activité toutes les 15 minutes au primaire.','Change activity every 15 minutes in primary.')],verifier:'',si_ca_bloque:T('Si un élève perturbe chaque jour, notez les faits trois jours et parlez-en à la direction et à la famille.','If a pupil disrupts daily, note facts for three days and talk to the head and family.'),prudence:''};
    if(task==='rediger')return {titre:T('Message aux parents','Message to parents'),lu_dans_image:'',comprendre:T('Bonjour chers parents,\nNous travaillons cette semaine les fractions. Ce soir, demandez à votre enfant de vous montrer son cahier et de partager un fruit en parts égales avec vous : c’est le meilleur exercice !\nMerci pour votre accompagnement.\nL’enseignant(e)','Dear parents,\nThis week we are working on fractions. Tonight, ask your child to show you the exercise book and share a fruit into equal parts with you!\nThank you for your support.\nThe teacher'),autres_facons:[{titre:T('Plus court','Shorter'),texte:T('Bonjour, cette semaine : les fractions. Ce soir, 10 minutes avec le cahier. Merci !','Hello, this week: fractions. Tonight, 10 minutes with the book. Thanks!')}],exemples:[],a_essayer:[],etapes:[],conseils:[],verifier:'',si_ca_bloque:'',prudence:''};
    if(w==='student')return {titre:T('Un indice pour avancer','A hint to move on'),lu_dans_image:lu,comprendre:T('Une fraction, c’est un partage en parts égales : le nombre du bas dit en combien de parts on coupe, le nombre du haut combien on en prend.','A fraction is equal sharing: bottom number = how many parts, top number = how many you take.'),autres_facons:[{titre:T('Première étape','First step'),texte:T('Commence par trouver en combien de parts égales l’objet est coupé. Écris ce nombre en bas.','First find how many equal parts the object is cut into. Write that number at the bottom.')}],exemples:[{enonce:T('Une pizza en 6 parts, on en mange 1.','A pizza in 6 parts, we eat 1.'),solution:'1/6'}],a_essayer:[{consigne:T('Reprends ton exercice : combien de parts en tout ? combien à colorier ?','Back to your exercise: how many parts in total? how many to colour?'),reponse:''}],etapes:[],conseils:[],verifier:T('Vérifie : si tu coloriais toutes les parts, tu aurais le même nombre en haut et en bas.','Check: colouring all parts gives the same number top and bottom.'),si_ca_bloque:T('Montre ton essai à ton parent ou à ton enseignant demain.','Show your attempt to your parent or teacher tomorrow.'),prudence:''};
    const frac=/fraction|moitié|quart|partage/.test(s)||!s.trim();
    return {titre:frac?T('Expliquer les fractions simplement','Explaining fractions simply'):T('Aider à comprendre : ','Helping understand: ')+q.slice(0,50),lu_dans_image:lu,
      comprendre:frac?T('Une fraction, c’est un partage en parts ÉGALES. Le nombre du bas (dénominateur) dit en combien de parts on a coupé. Le nombre du haut (numérateur) dit combien de parts on prend. 3/4, c’est « couper en 4, prendre 3 ».','A fraction is sharing into EQUAL parts. Bottom number: how many parts. Top number: how many we take. 3/4 = “cut into 4, take 3”.'):T('Partez de l’exemple du cahier, faites dire à l’enfant ce qu’on lui demande avec ses mots, puis montrez un exemple plus petit avant de revenir à l’exercice.','Start from the book example, have the child say what is asked, then show a smaller example before going back.'),
      autres_facons:[{titre:T('Au marché','At the market'),texte:T('Un tas de 8 tomates vendu 400 FCFA. Si on en prend la moitié (1/2), on prend 4 tomates et on paie 200 FCFA.','A pile of 8 tomatoes costs 400 FCFA. Half (1/2) = 4 tomatoes for 200 FCFA.')},{titre:T('Avec les mains','Hands-on'),texte:T('Prenez une feuille, pliez-la en 4. Faites colorier 3 parts : l’enfant voit 3/4.','Fold a sheet in 4. Colour 3 parts: the child sees 3/4.')},{titre:T('Pas à pas','Step by step'),texte:T('1) Compter toutes les parts → en bas. 2) Compter les parts prises → en haut. 3) Vérifier que les parts sont égales.','1) Count all parts → bottom. 2) Count parts taken → top. 3) Check parts are equal.')}],
      exemples:[{enonce:T('Un plantain coupé en 4 morceaux égaux ; on en mange 1.','A plantain cut into 4 equal pieces; we eat 1.'),solution:T('1/4 : 4 parts en tout, 1 mangée.','1/4: 4 parts in all, 1 eaten.')},{enonce:T('Un sachet de 6 beignets ; Paul en mange 2.','6 doughnuts; Paul eats 2.'),solution:T('2/6 des beignets (soit 1/3).','2/6 of the doughnuts (that is 1/3).')}],
      a_essayer:[{consigne:T('Une orange en 8 quartiers, on en mange 3. Quelle fraction ?','An orange in 8 segments, we eat 3. What fraction?'),reponse:'3/8'},{consigne:T('Colorie la moitié de 10 capsules.','Colour half of 10 bottle caps.'),reponse:T('5 capsules','5 caps')}],
      etapes:[],conseils:[T('Laissez l’enfant manipuler avant d’écrire : objets d’abord, dessin ensuite, chiffres à la fin.','Objects first, drawing next, numbers last.'),T('Évitez « c’est facile » : dites « on essaie ensemble ».','Avoid “it’s easy”: say “let’s try together”.'),T('Gardez la méthode du cahier pour l’écrit.','Keep the book method for written work.')],
      verifier:T('Demandez : « Si je coupe un pain en 3 et que je prends tout, quelle fraction ? » (3/3).','Ask: “If I cut bread in 3 and take it all, what fraction?” (3/3).'),si_ca_bloque:T('Notez la question précise et demandez à l’enseignant comment il l’explique en classe.','Note the exact question and ask the teacher how it’s taught in class.'),prudence:''};
  }
})();
