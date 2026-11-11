const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const TRACKS = {
  primary: {
    label: 'Primaire',
    short: 'SIL → CM2 / Class 1 → 6',
    systems: {
      fr: { label: 'Francophone', classes: ['SIL', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'] },
      en: { label: 'Anglophone', classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'] }
    }
  },
  college: {
    label: 'Secondaire · Collège',
    short: '6e → 3e',
    systems: {
      fr: { label: 'Cycle collège 6e–3e', classes: ['6e', '5e', '4e', '3e'] }
    }
  }
};
const COLLEGE_LEVELS = TRACKS.college.systems.fr.classes;
const fresh = () => ({
  children: [
    { name: 'Alex', track: 'primary', subsystem: 'fr', level: 'CE2' },
    { name: 'Sam', track: 'college', subsystem: 'fr', level: '6e' }
  ],
  tasks: [{ title: 'Préparer les cahiers pour demain', date: '', done: false }],
  expenses: [], progress: [], plans: [], classAssessments: [{
    id: 'demo-class-4e-maths', course: 'college', level: '4e', group: 'B', subject: 'Mathématiques',
    title: 'Évaluation — équations', date: '2026-09-08', classSize: 68, copies: 65, scale: 20,
    average: 9.4, highest: 18, lowest: 3, passed: 28, passRate: 43,
    items: [
      {skill: 'Reconnaître une égalité', correct: 48, rate: 74, error: 'Confond égalité et résultat final.'},
      {skill: 'Isoler l’inconnue', correct: 31, rate: 48, error: 'Change de membre sans justifier l’opération.'},
      {skill: 'Résoudre puis vérifier', correct: 24, rate: 37, error: 'Ne remplace pas x dans l’égalité de départ.'},
      {skill: 'Traduire un problème en équation', correct: 18, rate: 28, error: 'Choisit l’opération avant d’identifier l’inconnue.'}
    ]
  }]
});

let role = 'parent';
let page = 'home';
let step = 0;
let session = null;
let cloud = false;
let selected = 0;
let homeTrack = 'all';
let data = fresh();
data.children = data.children.map(normalizeChild);
const cfg = window.NDAB_CONFIG || { supabaseUrl: '', publishableKey: '' };

function classEntries(track, subsystem) {
  const group = TRACKS[track] || TRACKS.primary;
  const system = group.systems[subsystem || 'fr'] || group.systems.fr;
  return system.classes;
}

function normalizeChild(child) {
  const rawLevel = String(child && child.level || '').trim();
  const guessedCollege = COLLEGE_LEVELS.includes(rawLevel);
  const guessedEnglish = /^class\s/i.test(rawLevel);
  const track = child && child.track === 'college' || !child?.track && guessedCollege ? 'college' : 'primary';
  const subsystem = track === 'primary' && (child && child.subsystem === 'en' || !child?.subsystem && guessedEnglish) ? 'en' : 'fr';
  return {
    id: child?.id || klasId(),
    name: String(child && child.name || 'Profil').trim() || 'Profil',
    track,
    subsystem,
    level: rawLevel || classEntries(track, subsystem)[0],
    // Keep the optional professional metadata so a teacher's class profile
    // survives a cloud round-trip just like a learner profile.
    ...(child?.professional ? { professional: true } : {}),
    ...(child?.subjects ? { subjects: String(child.subjects).trim() } : {}),
    ...(child?.professionalRole ? { professionalRole: String(child.professionalRole) } : {}),
    ...(Array.isArray(child?.teachSubjects) && child.teachSubjects.length ? { teachSubjects: child.teachSubjects.slice(0, 2).map(String) } : {}),
    ...(child?.school ? { school: String(child.school).slice(0, 80) } : {}),
    ...(child?.twinLevel ? { twinLevel: String(child.twinLevel).slice(0, 20) } : {})
  };
}

function normalizeData(raw) {
  const base = fresh();
  const value = raw && typeof raw === 'object' ? raw : {};
  const known = {
    entrySpaces: Array.isArray(value.entrySpaces) ? value.entrySpaces.filter(s=>s && ['parent','teacher','tutor','student'].includes(s.audience) && ['primary','college'].includes(s.course) && ['fr','en'].includes(s.system) && !(s.course==='college'&&s.system==='en') && !(s.audience==='student'&&s.course!=='college')).map(s=>({audience:s.audience,course:s.course,system:s.system})) : [],
    children: Array.isArray(value.children) ? value.children.map(normalizeChild) : base.children,
    tasks: Array.isArray(value.tasks) ? value.tasks : base.tasks,
    expenses: Array.isArray(value.expenses) ? value.expenses : [],
    progress: Array.isArray(value.progress) ? value.progress : [],
    plans: Array.isArray(value.plans) ? value.plans : []
    ,support: value.support || {}, sessions: Array.isArray(value.sessions) ? value.sessions : [], monthly: value.monthly || [], classroom: value.classroom || [], classAssessments: Array.isArray(value.classAssessments) ? value.classAssessments : [], daily: Array.isArray(value.daily) ? value.daily : [], teaching: Array.isArray(value.teaching) ? value.teaching : [], college: value.college || {work:[],blocks:[],revisions:[],checks:[]}, roadmap: value.roadmap && typeof value.roadmap==='object' ? value.roadmap : {}
  };
  // Conserver tout le reste de l'espace (kits enseignant, famille, accompagnateur, profils, rôle du compte, visite vue…) :
  // une donnée enregistrée ne doit jamais disparaître à la reconnexion.
  for (const key of Object.keys(value)) {
    if (key in known || key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const v = value[key];
    if (v === null || ['object', 'string', 'number', 'boolean'].includes(typeof v)) known[key] = v;
  }
  if (known.accountRole && !['parent', 'teacher', 'tutor', 'student'].includes(known.accountRole)) delete known.accountRole;
  return known;
}

function currentCourse(){return data.children[selected]?.track||'primary'}
function inCurrentCourse(item){let course=item.course;if(!course&&(item.level||item.class))course=COLLEGE_LEVELS.includes(item.level||item.class)?'college':'primary';if(!course){const matches=data.children.filter(c=>item.childId?c.id===item.childId:c.name===item.child);if(matches.length===1)course=matches[0].track;}return (course||'primary')===currentCourse()}
function scopedClasses(value){
  const child=data.children[selected];
  const c=currentCourse();
  if(c==='college')return classOptions('college','fr',value);
  // A primary workspace must never offer a secondary class. Keep the child's
  // school system as well, so a Francophone parent does not have to decode
  // English classes and vice versa.
  return classOptions('primary',child?.subsystem==='en'?'en':'fr',value);
}

function configured() {
  return /^https:\/\//.test(cfg.supabaseUrl || '') && String(cfg.publishableKey || '').length > 10;
}

function classOptions(track, subsystem, selectedValue) {
  return classEntries(track, subsystem).map((level) => '<option value="' + esc(level) + '" ' + (level === (selectedValue || '') ? 'selected' : '') + '>' + esc(level) + '</option>').join('');
}

function allClassOptions(selectedValue) {
  return '<optgroup label="Primaire · francophone">' + classOptions('primary', 'fr', selectedValue) + '</optgroup>'
    + '<optgroup label="Primaire · anglophone">' + classOptions('primary', 'en', selectedValue) + '</optgroup>'
    + '<optgroup label="Secondaire · collège · 6e à 3e">' + classOptions('college', 'fr', selectedValue) + '</optgroup>';
}

function trackLabel(child) {
  return child && child.track === 'college' ? 'Secondaire' : 'Primaire';
}

function systemLabel(child) {
  return child && child.track === 'primary' && child.subsystem === 'en' ? 'anglophone' : 'francophone';
}

function profileLabel(child) {
  return child ? trackLabel(child) + ' · ' + child.level + ' · ' + systemLabel(child) : '';
}

function toast(message) {
  $('#toast').textContent = message;
  $('#toast').style.display = 'block';
  setTimeout(() => { $('#toast').style.display = 'none'; }, 4500);
}

let refreshPromise=null;
let remoteRevision=0, workspaceConflict=false;
function setAuthSession(value){
  session=value;
  if(session && !session.expires_at)session.expires_at=Math.floor(Date.now()/1000)+(session.expires_in||3600);
}
async function refreshAccess(){
  if(refreshPromise)return refreshPromise;
  const original=session;
  if(!original?.refresh_token)throw Error(tr('Reconnectez-vous pour continuer.','Sign in again to continue.'));
  refreshPromise=(async()=>{
    const result=await api('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:original.refresh_token})});
    if(session!==original)throw Error(tr('La session a changé.','The session has changed.'));
    setAuthSession(result);
  })();
  try{await refreshPromise;}finally{refreshPromise=null;}
}
async function api(path, options) {
  const opts=options||{}, tokenRequest=path.startsWith('/auth/v1/token');
  if(!tokenRequest && session?.expires_at && session.expires_at*1000<Date.now()+60000)await refreshAccess();
  const response=await fetch(cfg.supabaseUrl+path,{
    ...opts,signal:opts.signal||AbortSignal.timeout(20000),
    headers:{apikey:cfg.publishableKey,...(!tokenRequest&&session?.access_token?{Authorization:'Bearer '+session.access_token}:{}),'Content-Type':'application/json',...(opts.headers||{})}
  });
  const raw=await response.text();let body=null;try{body=raw?JSON.parse(raw):null;}catch{}
  if(!response.ok){
    const error=Error(body?.code==='40001'?tr('Ce dossier a changé sur un autre appareil. Gardez votre travail avant de charger la version récente.','This workspace changed on another device. Keep your work before loading the latest version.'):tr('Opération impossible. Vérifiez votre connexion Internet et votre accès.','Unable to continue. Check your Internet connection and access.'));
    error.code=body?.code;error.status=response.status;throw error;
  }
  return body;
}
function showWorkspaceConflict(){
 modal('<h2>'+tr('Deux versions de votre travail','Two versions of your work')+'</h2><p>'+tr('Votre saisie est encore dans cette page. Copiez les éléments à garder avant de charger la sauvegarde récente. Rien ne sera écrasé automatiquement.','Your changes are still on this page. Copy anything you want to keep before loading the latest saved version. Nothing will be overwritten automatically.')+'</p><button id="conflict-load">'+tr('Charger la version sauvegardée','Load the saved version')+'</button>');
 $('#conflict-load').onclick=async()=>{
  if(!confirm(tr('Remplacer les modifications de cette page par la sauvegarde récente ?','Replace changes on this page with the latest saved version?')))return;
  const button=$('#conflict-load');button.disabled=true;
  try{const rows=await api('/rest/v1/ndab_spaces?select=payload,revision');data=normalizeData(rows?.[0]?.payload||{children:[],tasks:[],classAssessments:[]});remoteRevision=rows?.[0]?.revision||0;workspaceConflict=false;savedRevision=saveRevision;selected=0;page='home';$('#modal').close();render();saveStatus(tr('Version sauvegardée chargée.','Saved version loaded.'));}catch{toast(tr('Chargement impossible. Votre saisie est conservée.','Unable to load. Your changes are retained.'));}finally{button.disabled=false;}
 };
}

function saveStatus(text,failed=false){const el=$('#save-status');if(el)el.textContent=text;const retry=$('#retry-save');if(retry){retry.hidden=!failed;retry.onclick=()=>workspaceConflict?showWorkspaceConflict():save()}}
let saveQueue=Promise.resolve();
let saveRevision=0, savedRevision=0;
window.addEventListener('beforeunload',event=>{
  if(cloud && saveRevision>savedRevision){event.preventDefault();event.returnValue='';}
});
async function save() {
  if (!cloud){saveStatus(tr('Démo : modifications non sauvegardées après fermeture.','Demo: changes are not saved after closing.'));return false;}
  const revision=++saveRevision;
  const owner=session.user.id,body=JSON.stringify({owner_id:owner,payload:data});
  saveStatus(tr('Enregistrement…','Saving…'));
  const operation=saveQueue.then(async()=>{
    if(!cloud||session?.user?.id!==owner)return false;
    if(workspaceConflict){saveStatus(tr('Conflit : ouvrez Réessayer pour choisir la suite.','Conflict: open Retry to choose what happens next.'),true);return false;}
    try {
      remoteRevision=await api('/rest/v1/rpc/klas_save_workspace',{method:'POST',body:JSON.stringify({p_payload:JSON.parse(body).payload,p_revision:remoteRevision})});
      if(session?.user?.id===owner && revision===saveRevision)savedRevision=revision;
      if(session?.user?.id===owner && revision===saveRevision)saveStatus(tr('Enregistré dans votre compte.','Saved to your account.'));
      return true;
    }catch(error){
      if(error.code==='40001' && session?.user?.id===owner){workspaceConflict=true;saveStatus(error.message,true);return false;}
      if(session?.user?.id===owner)saveStatus(tr('Non enregistré. Gardez la page ouverte et réessayez.','Not saved. Keep this page open and try again.'),true);
      return false;
    }
  });
  saveQueue=operation.then(()=>{});return operation;
}

function modal(html) {
  $('#modalbody').innerHTML = html;
  $('#modal').showModal();
}

$('.close').onclick = () => $('#modal').close();
$('#modal').addEventListener('click', (event) => {
  if (event.target === $('#modal')) $('#modal').close();
});

function shell() {
  $('#parent').classList.toggle('selected', role === 'parent');
  $('#teacher').classList.toggle('selected', role === 'teacher');
  $('#tutor').classList.toggle('selected', role === 'tutor');
  $('#mode').textContent = cloud ? 'Mon compte · connecté' : 'Démo · données fictives';
}

$('#parent').onclick = () => { role = 'parent'; page = 'home'; render(); };
$('#teacher').onclick = () => { role = 'teacher'; page = 'home'; render(); };
$('#account').onclick = account;
$('#mode').onclick = account;

function title(kicker, heading, description) {
  return '<div class="eyebrow">' + uiText(kicker) + '</div><h1>' + uiText(heading) + '</h1><p class="muted">' + uiText(description || '') + '</p>';
}

function trackFilters() {
  return '<div class="trackbar" aria-label="Filtrer par parcours">'
    + '<span class="trackbar-label">Afficher :</span>'
    + '<button class="trackfilter ' + (homeTrack === 'all' ? 'selected' : '') + '" data-trackfilter="all">Tous les parcours</button>'
    + '<button class="trackfilter ' + (homeTrack === 'primary' ? 'selected' : '') + '" data-trackfilter="primary">'+uiText("Primaire")+'</button>'
    + '<button class="trackfilter ' + (homeTrack === 'college' ? 'selected' : '') + '" data-trackfilter="college">Secondaire · 6e–3e</button>'
    + '</div>';
}

function trackOverview() {
  return '<div class="track-overview">'
    + '<div class="track-card"><span class="number">PARCOURS 01 · PRIMAIRE</span><h3>Les premiers apprentissages</h3><p>Francophone : SIL, CP, CE1, CE2, CM1, CM2. Anglophone : Class 1 à 6.</p></div>'
    + '<div class="track-card"><span class="number">PARCOURS 02 · SECONDAIRE</span><h3>Le collège de 6e à 3e</h3><p>Un suivi simple des devoirs, contrôles, progrès et échanges avec la famille.</p></div>'
    + '</div>';
}

function childRows() {
  const visible = data.children.map((child, index) => ({ child, index })).filter(({ child }) => homeTrack === 'all' || child.track === homeTrack);
  if (!visible.length) return '<p class="empty">Aucun profil dans ce parcours. Ajoutez un prénom ou un surnom.</p>';
  return visible.map(({ child, index }) => '<div class="row">'
    + '<div class="avatar">' + esc(child.name.slice(0, 1).toUpperCase()) + '</div>'
    + '<div class="grow"><b>' + esc(child.name) + '</b><p>' + esc(child.level) + ' · ' + esc(trackLabel(child)) + '</p><span class="profile-meta">' + esc(systemLabel(child)) + '</span></div>'
    + '<button class="secondary" data-child="' + index + '">Choisir</button>'
    + '</div>').join('');
}

function render() {
  shell();
  let html = '';
  const child = data.children[selected];

  if (page === 'home') {
    html = title(role === 'parent' ? 'ESPACE FAMILLE' : 'ESPACE ENSEIGNANT', role === 'parent' ? 'L’essentiel, pour avancer.' : 'Une semaine bien préparée.', role === 'parent' ? 'Un enfant, un petit point, une prochaine étape.' : 'Préparer, observer et échanger avec les familles.');
    html += '<div class="headrow"><div>' + (cloud ? 'Vos informations sont enregistrées dans votre compte.' : 'Démonstration interactive : utilisez uniquement des informations fictives.') + '</div><button class="secondary" id="addchild">＋ ' + (role === 'parent' ? 'Ajouter un enfant' : 'Ajouter un élève') + '</button></div>';
    html += trackFilters();
    html += trackOverview();
    html += '<div class="grid"><section class="card hero"><div><div class="eyebrow">' + (role === 'parent' ? 'VOTRE RENDEZ-VOUS' : 'VOTRE PROCHAINE SÉANCE') + '</div><h2>' + (role === 'parent' ? 'Ce soir, on prend le temps.' : 'Une leçon. Un objectif clair.') + '</h2><p>' + (role === 'parent' ? 'Dix minutes pour écouter, regarder un point ensemble et préparer demain.' : 'Posez les étapes de la séance à partir de votre progression de classe.') + '</p><button data-go="' + (role === 'parent' ? 'routine' : 'prepare') + '">' + (role === 'parent' ? 'Commencer mes 10 minutes' : 'Préparer ma séance') + ' →</button></div><div class="clock"><b>' + (role === 'parent' ? '10' : '01') + '</b><span>' + (role === 'parent' ? 'MINUTES' : 'OBJECTIF') + '</span></div></section><section class="card"><h2>' + (role === 'parent' ? 'Mes enfants' : 'Mes élèves') + '</h2>' + childRows() + '</section></div>';
    html += '<div class="sectionline"><h2>De quoi avez-vous besoin ?</h2></div><div class="tools"><button class="tool" data-go="week"><span class="number">01 / ORGANISER</span><h3>Voir ma semaine</h3><p>Devoirs, évaluations et choses à prévoir.</p></button><button class="tool" data-go="progress"><span class="number">02 / COMPRENDRE</span><h3>Faire le point</h3><p>Une réussite, une difficulté, une suite.</p></button><button class="tool" data-go="messages"><span class="number">03 / ÉCHANGER</span><h3>Trouver les bons mots</h3><p>Préparer un message clair et respectueux.</p></button></div><div class="note">' + (role === 'parent' ? 'Chaque profil garde son parcours et sa classe. Vous pouvez accompagner plusieurs enfants dans le même espace.' : 'Les observations de cette version restent dans votre espace. Aucun message ne part automatiquement.') + '</div>';
  }

  if(page==='home'&&role==='parent'&&uiLanguage==='en')html=englishPrimaryHome();

  if (page === 'routine') {
    html = primaryRoutineView();
  }

  if (page === 'week') {
    html = title('ORGANISATION', 'Ma semaine', 'Gardez seulement ce qui mérite d’être retenu.');
    html += '<section class="card"><form id="taskform" class="formgrid"><div><label for="task">'+uiText("À prévoir")+'</label><input id="task" maxlength="180" required placeholder="Ex. Contrôle de français, cahier à signer…"></div><div><label for="date">'+uiText("Pour quand ?")+'</label><input id="date" type="date"></div><button>'+uiText("Ajouter")+'</button></form></section><section class="card" style="margin-top:20px">' + (data.tasks.map((task, index) => inCurrentCourse(task) ? '<div class="row"><input class="check" aria-label="Marquer ' + esc(task.title) + ' comme terminé" type="checkbox" data-task="' + index + '" ' + (task.done ? 'checked' : '') + '><div class="grow"><b>' + esc(task.title) + '</b><p>' + esc(task.date || 'Sans date précise') + ' · ' + (task.done ? 'Terminé' : 'À faire') + '</p></div><button class="remove" data-delete="tasks:' + index + '">'+uiText("Retirer")+'</button></div>' : '').join('') || '<div class="empty">'+uiText("Votre semaine est libre. Ajoutez une première tâche.")+'</div>') + '</section>';
  }

  if (page === 'budget') {
    const sum = data.expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
    html = title('LES DÉPENSES SCOLAIRES', 'Tout au même endroit.', 'Un aide-mémoire personnel pour les montants et les échéances.');
    html += '<section class="card"><span class="muted">'+uiText("Total noté")+'</span><div class="amount">' + sum.toLocaleString('fr-FR') + ' FCFA</div><form id="expenseform" class="formgrid"><div><label for="expense">'+uiText("Dépense")+'</label><input id="expense" required maxlength="150" placeholder="Transport, cahiers…"></div><div><label for="amount">'+uiText("Montant en FCFA")+'</label><input id="amount" type="number" min="1" max="100000000" required></div><div><label for="paid">'+uiText("État")+'</label><select id="paid"><option value="À payer">'+uiText("À payer")+'</option><option value="Payé">'+uiText("Payé")+'</option></select></div><div><label for="due">'+uiText("Échéance")+'</label><input id="due" type="date"></div><button>'+uiText("Enregistrer")+'</button></form>' + data.expenses.map((expense, index) => '<div class="row"><div class="grow"><b>' + esc(expense.title) + '</b><p>' + esc(uiText(expense.status)) + ' · ' + esc(expense.date || 'Sans échéance') + '</p></div><b>' + Number(expense.amount || 0).toLocaleString('fr-FR') + ' F</b><button class="remove" data-delete="expenses:' + index + '">'+uiText("Retirer")+'</button></div>').join('') + '</section>';
  }

  if (page === 'progress') {
    html = title('LES APPRENTISSAGES', role === 'parent' ? 'Un progrès à la fois.' : 'Observer pour mieux aider.', 'À partir d’un travail réellement vu. Chaque observation garde son auteur.');
    html += '<section class="card"><form id="progressform" class="formgrid"><div><label for="student">'+uiText("Enfant ou groupe")+'</label><input id="student" required maxlength="100" value="' + esc(role === 'parent' ? child && child.name || '' : '') + '" placeholder="Prénom, surnom ou groupe"></div><div><label for="progressclass">'+uiText("Classe / parcours")+'</label><select id="progressclass">' + scopedClasses(child && child.level || '') + '</select></div><div><label for="subject">'+uiText("Matière / notion")+'</label><input id="subject" required maxlength="160" placeholder="Ex. Français — comprendre une consigne"></div><div><label for="success">'+uiText("Ce qui va bien")+'</label><textarea id="success" required maxlength="1000"></textarea></div><div><label for="difficulty">'+uiText("Le point à reprendre")+'</label><textarea id="difficulty" maxlength="1000"></textarea></div><div><label for="status">'+uiText("Ce que j’ai observé")+'</label><select id="status"><option value="Réussit seul">'+uiText("Réussit seul")+'</option><option value="Réussit avec aide">'+uiText("Réussit avec aide")+'</option><option value="À revoir">'+uiText("À revoir")+'</option></select></div><div><label for="nextaction">'+uiText("La prochaine petite action")+'</label><input id="nextaction" maxlength="250"></div><button>'+uiText("Garder ce point")+'</button></form></section>' + data.progress.map((item, index) => inCurrentCourse(item) ? '<section class="card" style="margin-top:16px"><div class="eyebrow">' + esc(uiText(item.author)) + ' · ' + esc(item.date) + '</div><h2>' + esc(item.student) + ' · ' + esc(item.subject) + '</h2><span class="tag">' + esc(uiText(item.status)) + (item.level ? ' · ' + esc(item.level) : '') + '</span><p><b>'+uiText("Réussite :")+'</b> ' + esc(item.success) + '</p><p><b>'+uiText("À reprendre :")+'</b> ' + esc(item.difficulty || 'Aucun point noté') + '</p><p><b>'+uiText("Suite :")+'</b> ' + esc(item.next || 'À préciser') + '</p><button class="remove" data-delete="progress:' + index + '">'+uiText("Retirer")+'</button></section>' : '').join('');
  }

  if (page === 'prepare') {
    html = title('PRÉPARATION ENSEIGNANT', 'Une séance bien posée.', 'Appuyez-vous sur votre programme et votre progression. Ce modèle ne remplace pas les prescriptions de votre établissement.');
    html += '<section class="card"><form id="planform" class="formgrid"><div><label for="class">'+uiText("Classe / parcours")+'</label><select id="class" required>' + scopedClasses() + '</select></div><div><label for="topic">'+uiText("Matière et leçon")+'</label><input id="topic" required maxlength="300"></div><div><label for="goal">'+uiText("Ce que l’élève doit savoir faire")+'</label><input id="goal" required maxlength="300"></div><div><label for="material">Matériel disponible</label><input id="material" required maxlength="300"></div><div class="full"><label for="activity">'+uiText("Situation de départ et activité")+'</label><textarea id="activity" required maxlength="2000" placeholder="Situation concrète, consigne, travail individuel ou en groupe…"></textarea></div><div><label for="verify">'+uiText("Comment vérifier la compréhension ?")+'</label><textarea id="verify" required maxlength="1000"></textarea></div><div><label for="help">'+uiText("Que reprendre si l’élève bloque ?")+'</label><textarea id="help" maxlength="1000"></textarea></div><button>'+uiText("Garder ma préparation")+'</button></form></section>' + data.plans.map((plan, index) => inCurrentCourse(plan)&&(!plan.author||plan.author===role) ? '<section class="card" style="margin-top:20px"><div class="eyebrow">' + esc(plan.class) + '</div><h2>' + esc(plan.topic) + '</h2><p><b>Objectif :</b> ' + esc(plan.goal) + '</p><p><b>Matériel :</b> ' + esc(plan.material) + '</p><p>' + esc(plan.activity) + '</p><p><b>Vérification :</b> ' + esc(plan.verify) + '</p><p><b>Reprise :</b> ' + esc(plan.help) + '</p><button class="secondary" data-print="true">'+uiText("Imprimer")+'</button> <button class="remove" data-delete="plans:' + index + '">'+uiText("Retirer")+'</button></section>' : '').join('');
  }

  if (page === 'messages') {
    html = title('MAISON & ÉCOLE', 'Les mots pour se comprendre.', 'Préparez votre message, relisez-le et partagez-le vous-même.');
    html += '<section class="card"><label for="reason">'+uiText("Je souhaite…")+'</label><select id="reason"><option value="difficulty">'+uiText("Parler d’une difficulté")+'</option><option value="success">'+uiText("Partager une réussite")+'</option><option value="meeting">'+uiText("Demander un échange")+'</option><option value="absence">'+uiText("Signaler une absence")+'</option></select><label for="messagechild">'+uiText("Prénom ou surnom")+'</label><input id="messagechild" value="' + esc(child && child.name || '') + '" maxlength="100"><label for="detail">'+uiText("Le point à expliquer")+'</label><textarea id="detail" maxlength="1500" placeholder="Ex. La consigne de l’exercice 2 reste difficile à comprendre."></textarea><div class="actions"><button id="generate">'+uiText("Préparer le message")+'</button></div><div id="messageout"></div></section><p class="note">'+uiText("Modèles guidés. Cette première version ne génère pas de réponse par intelligence artificielle et n’envoie aucun message automatiquement.")+'</p>';
  }

  $('#screen').innerHTML = html;
  window.enhanceKlas({ role, page, data });
  bind();
}

function addProfile() {
  modal('<h2>'+uiText("Ajouter un profil")+'</h2><p>'+uiText("Un surnom suffit. En démonstration, utilisez un nom fictif.")+'</p><form id="childform"><label for="childname">'+uiText("Prénom ou surnom")+'</label><input id="childname" required maxlength="60" placeholder="Ex. Amina"><label for="childtrack">'+uiText("Parcours")+'</label><select id="childtrack"><option value="primary">'+uiText("Primaire")+'</option><option value="college">'+uiText("Secondaire · collège (6e à 3e)")+'</option></select><div id="subsystemwrap"><label for="childsystem">'+uiText("Sous-système")+'</label><select id="childsystem"><option value="fr">'+uiText("Francophone")+'</option><option value="en">'+uiText("Anglophone")+'</option></select></div><label for="childlevel">'+uiText("Classe")+'</label><select id="childlevel"></select><div class="actions"><button>'+uiText("Ajouter le profil")+'</button></div></form>');
  const updateLevels = () => {
    const track = $('#childtrack').value;
    const subsystem = track === 'primary' ? $('#childsystem').value : 'fr';
    $('#subsystemwrap').style.display = track === 'primary' ? 'block' : 'none';
    $('#childlevel').innerHTML = classOptions(track, subsystem);
  };
  $('#childtrack').onchange = updateLevels;
  $('#childsystem').onchange = updateLevels;
  updateLevels();
  $('#childform').onsubmit = (event) => {
    event.preventDefault();
    const track = $('#childtrack').value;
    const subsystem = track === 'primary' ? $('#childsystem').value : 'fr';
    data.children.push({ id:klasId(), name: $('#childname').value.trim(), track, subsystem, level: $('#childlevel').value });
    save();
    $('#modal').close();
    render();
    toast('Profil ajouté avec son parcours.');
  };
}

function bind() {
  document.querySelectorAll('[data-print]').forEach((button) => { button.onclick = () => window.print(); });
  document.querySelectorAll('[data-go]').forEach((button) => { button.onclick = () => { page = button.dataset.go; step = 0; render(); }; });
  document.querySelectorAll('[data-child]').forEach((button) => { button.onclick = () => { selected = Number(button.dataset.child); page = role === 'parent' ? 'routine' : 'progress'; render(); }; });
  document.querySelectorAll('[data-trackfilter]').forEach((button) => { button.onclick = () => { homeTrack = button.dataset.trackfilter; render(); }; });
  if ($('#addchild')) $('#addchild').onclick = addProfile;
  if ($('#who')) $('#who').onchange = (event) => { selected = Number(event.target.value); };
  if ($('#prev')) $('#prev').onclick = () => { step -= 1; render(); };
  if ($('#next')) $('#next').onclick = () => { if (step < 2) { step += 1; render(); } else { toast(tr('Le point est terminé. Une petite étape suffit.','Check-in complete. One small step is enough.')); page = 'progress'; render(); } };
  if ($('#taskform')) $('#taskform').onsubmit = (event) => { event.preventDefault(); data.tasks.push({ course:currentCourse(), title: $('#task').value.trim(), date: $('#date').value, done: false }); save(); render(); };
  document.querySelectorAll('[data-task]').forEach((checkbox) => { checkbox.onchange = () => { data.tasks[Number(checkbox.dataset.task)].done = checkbox.checked; save(); render(); }; });
  document.querySelectorAll('[data-delete]').forEach((button) => { button.onclick = () => { const [key, index] = button.dataset.delete.split(':'); if (confirm('Retirer cet élément ?')) { data[key].splice(Number(index), 1); save(); render(); } }; });
  if ($('#expenseform')) $('#expenseform').onsubmit = (event) => { event.preventDefault(); data.expenses.push({ title: $('#expense').value.trim(), amount: Number($('#amount').value), status: $('#paid').value, date: $('#due').value }); save(); render(); };
  if ($('#progressform')) $('#progressform').onsubmit = (event) => { event.preventDefault(); data.progress.unshift({ student: $('#student').value, level: $('#progressclass').value, subject: $('#subject').value, success: $('#success').value, difficulty: $('#difficulty').value, status: $('#status').value, next: $('#nextaction').value, author: role === 'parent' ? 'Observation du parent' : role === 'tutor' ? 'Observation du prof particulier' : 'Observation de l’enseignant', course: currentCourse(), date: new Date().toLocaleDateString('fr-FR') }); save(); render(); };
  if ($('#planform')) $('#planform').onsubmit = (event) => { event.preventDefault(); const plan = {}; ['class', 'topic', 'goal', 'material', 'activity', 'verify', 'help'].forEach((key) => { plan[key] = $('#' + key).value; }); plan.course=currentCourse();plan.author=role;data.plans.unshift(plan); save(); render(); };
  if ($('#generate')) $('#generate').onclick = () => {
    const name = $('#messagechild').value.trim() || tr('l’enfant','the child');
    const detail = $('#detail').value.trim();
    const reason = $('#reason').value;
    const message = messageDraft(reason,name,detail,role);
    $('#messageout').innerHTML = '<label for="draft">'+uiText("Votre message à relire")+'</label><textarea id="draft" style="min-height:180px">' + esc(message) + '</textarea><div class="actions"><button id="copy" class="secondary">'+uiText("Copier le texte")+'</button><button id="share">'+uiText("Partager")+'</button></div>';
    $('#copy').onclick = async () => { try { await navigator.clipboard.writeText($('#draft').value); toast('Message copié.'); } catch (error) { toast('Sélectionnez le texte pour le copier.'); } };
    $('#share').onclick = async () => { if (navigator.share) { try { await navigator.share({ text: $('#draft').value }); } catch (error) { /* annulé par l’utilisateur */ } } else { window.open('https://wa.me/?text=' + encodeURIComponent($('#draft').value), '_blank', 'noopener,noreferrer'); } };
  };
}

async function signUp(email, password) {
  if (!configured()) throw Error(tr('La création de compte est momentanément indisponible.','Account creation is temporarily unavailable.'));
  return api('/auth/v1/signup?redirect_to=' + encodeURIComponent(window.location.origin + window.location.pathname), {
    method:'POST',
    body:JSON.stringify({email:email.trim(),password,data:{klas_signup:'v1'}})
  });
}

async function signIn(email, password) {
  if(cloud)throw Error(tr('Déconnectez-vous avant de changer de compte.','Sign out before switching accounts.'));
  try {
    setAuthSession(await api('/auth/v1/token?grant_type=password', {method:'POST',body:JSON.stringify({email,password})}));
    const access = await api('/rest/v1/ndab_access?select=expires_at');
    if (!access?.length) {
      const expired=Error(tr('Votre accès est terminé. Choisissez une offre pour rouvrir votre espace.','Your access has ended. Choose a plan to reopen your space.'));
      expired.code='ACCESS_EXPIRED';
      throw expired;
    }
    const rows = await api('/rest/v1/ndab_spaces?select=payload,revision');
    data = normalizeData(rows?.[0]?.payload || {children:[],tasks:[],classAssessments:[]});
    remoteRevision=rows?.[0]?.revision||0;workspaceConflict=false;
    selected = 0;
    saveRevision=0; savedRevision=0;
    role = 'parent';
    page = 'home';
    cloud = true;
    saveStatus(tr('Espace privé connecté.','Private workspace connected.'));
  } catch (error) {
    // Keep a valid identity for the billing-only screen; no workspace data is loaded.
    if(error.code==='ACCESS_EXPIRED')throw error;
    if(session?.access_token) { try { await api('/auth/v1/logout',{method:'POST'}); } catch {} }
    session = null;
    cloud = false;
    throw error;
  }
}

function account() {
  if (cloud) {
    modal('<h2>'+uiText("Mon espace personnel")+'</h2><p>Connecté : ' + esc(session.user.email) + '</p><p>'+uiText("Vos informations restent dans votre compte. Utilisez les Cahiers partagés pour inviter une personne et choisir les notes à partager.")+'</p><button id="logout">'+uiText("Me déconnecter")+'</button>');
    $('#logout').onclick = async () => { if(saveRevision>savedRevision && !confirm(tr('Des modifications ne sont pas enregistrées. Vous déconnecter les fera perdre. Continuer ?','Some changes are not saved. Signing out will lose them. Continue?')))return; try { await api('/auth/v1/logout', { method: 'POST' }); } catch (error) { /* session locale réinitialisée */ } session = null; cloud = false; data = fresh(); selected = 0; window.location.reload(); };
    return;
  }
  if (!configured()) {
    modal('<div class="eyebrow">PREMIÈRE VERSION</div><h2>'+uiText("Découvrez Klas 237")+'</h2><p>'+uiText("Les espaces parent et enseignant sont disponibles en démonstration. Les données sont fictives et disparaissent lorsque la page est rechargée.")+'</p><div class="note">'+uiText("Les comptes personnels et les sauvegardes privées ne sont pas encore activés. Ne saisissez aucune donnée réelle d’enfant.")+'</div><p>'+uiText("Vous pouvez explorer les parcours Primaire et Secondaire (6e–3e), puis partager cette démonstration.")+'</p>');
    return;
  }
  modal('<h2>'+uiText("Mon accès personnel")+'</h2><p>'+uiText("Connexion réservée aux comptes activés par JenguAI.")+'</p><form id="login"><label for="email">'+uiText("Adresse e-mail")+'</label><input id="email" type="email" required autocomplete="username"><label for="password">'+uiText("Mot de passe")+'</label><input id="password" type="password" required autocomplete="current-password"><div class="actions"><button>'+uiText("Me connecter")+'</button></div><p id="loginerror" role="alert"></p></form>');
  $('#login').onsubmit = async (event) => {
    event.preventDefault();
    const button = $('#login button');
    button.disabled = true;
    try {
      await signIn($('#email').value, $('#password').value);
      $('#modal').close();
      render();
      toast(tr('Bienvenue dans votre espace personnel.','Welcome to your private workspace.'));
    } catch (error) {
      session = null;
      $('#loginerror').textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };
}

render();
