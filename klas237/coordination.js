// One shared secondary-school issue, with actions adapted to each role.
const coordinationRender = render;
const coordinationNavigation = renderNavigation;

function coordinationStore() {
  collegeData();
  data.college.coordination ||= [];
  return data.college.coordination;
}

function coordinationItems() {
  const owner = collegeKey();
  const stored = coordinationStore().filter((item) => item.owner === owner);
  const known = new Set(stored.map((item) => item.sourceBlockId).filter(Boolean));
  const imported = collegeItems('blocks').filter((block) => !known.has(block.id)).map((block) => ({
    id: 'block-' + block.id,
    sourceBlockId: block.id,
    owner,
    subject: block.subject,
    need: block.question,
    attempt: block.attempt || block.tried || 'Essai non renseigné',
    created: block.date || '',
    priority: 'À regarder',
    helper: block.with || 'À décider ensemble',
    status: block.resolved ? 'À vérifier' : 'Ouvert',
    imported: true
  }));
  return [...stored, ...imported];
}

function coordinationAudience() {
  return typeof activeAudience === 'function' ? activeAudience() : role;
}

function coordinationState(value) {
  const labels = {'À décider ensemble':'Decide together','Ouvert':'Open','En cours':'In progress','À vérifier':'To check','Réglé':'Resolved','Signalé':'Reported','Orienté':'Support chosen','Pris en charge':'Support started'};
  return tr(value, labels[value] || value);
}

function coordinationRoleIntro(audience) {
  const copy = {
    student: [tr('Je signale clairement', "I describe the difficulty"), tr('J’écris le point précis, ce que j’ai essayé et ce dont j’ai besoin.', "I describe the exact point, what I tried and the help I need.")],
    parent: [tr('Je choisis la prochaine aide', "I choose the next support"), tr('Je ne dois pas refaire le cours. Je vérifie l’urgence et j’oriente vers la bonne personne.', "I check how urgent it is and choose who can help.")],
    teacher: [tr('Je réponds dans le cadre du cours', "I give guidance from the lesson"), tr('Je précise la notion, un repère du cahier et ce que toute la classe doit savoir faire.', "I clarify the concept, a reference in the exercise book and the class learning goal.")],
    tutor: [tr('Je travaille le point ciblé', "I work on the specific need"), tr('Je prépare une séance courte, puis je note ce qui est réussi et ce qui reste fragile.', "I plan a short session and record successes and remaining difficulties.")]
  };
  return copy[audience] || copy.parent;
}

function coordinationProgress(item) {
  const steps = [
    ['Signalé', true],
    ['Orienté', !!item.parentDecision],
    ['Pris en charge', !!(item.teacherReply || item.coachReply)],
    ['À vérifier', item.status === 'À vérifier' || item.status === 'Réglé']
  ];
  return '<ol class="coord-steps">' + steps.map(([label, done]) => '<li class="' + (done ? 'done' : '') + '"><span></span>' + coordinationState(label) + '</li>').join('') + '</ol>';
}

function relatedCoachReview(item) {
  return coachReviews().find((review) =>
    review.subject === item.subject &&
    review.focus && item.need &&
    (review.focus === item.need || review.focus.includes(item.need) || item.need.includes(review.focus))
  );
}

function coordinationCard(item, audience) {
  const coach = relatedCoachReview(item);
  const next = audience === 'student'
    ? (item.parentDecision || item.teacherReply || item.coachReply || tr('Attends la décision avec ton parent.', 'Discuss the next step with your parent.'))
    : audience === 'parent'
      ? (item.parentDecision || tr('Choisir qui peut aider et pour quand.', 'Choose who can help and when.'))
      : audience === 'teacher'
        ? (item.teacherReply || tr('Ajouter un repère du cours et une prochaine vérification.', 'Add lesson guidance and a next check.'))
        : (coach?.next || item.coachReply || tr('Préparer une séance ciblée.', 'Plan a targeted session.'));
  return '<article class="coord-card">'
    + '<div class="item-line"><span class="tag">' + esc(item.subject || 'Matière') + '</span><span class="coord-status">' + esc(coordinationState(item.status || 'Ouvert')) + '</span></div>'
    + '<h2>' + esc(item.need) + '</h2>'
    + tr('<p><b>Essai de l’élève :</b> ', "<p><b>Student attempt:</b> ") + esc(item.attempt || 'Non renseigné') + '</p>'
    + coordinationProgress(item)
    + tr('<div class="coord-next"><small>PROCHAINE ACTION POUR MOI</small><p>', "<div class=\"coord-next\"><small>MY NEXT ACTION</small><p>") + esc(next) + '</p></div>'
    + tr('<details><summary>Nos retours</summary>', "<details><summary>Our feedback</summary>") +
      [['parentDecision',tr('Décision du parent', "Parent decision")],['teacherReply',tr('Repère de l’enseignant', "Teacher guidance")],['teacherCheck',tr('Vérification en classe', "Classroom check")],['coachReply',tr('Retour du renforcement', "Tutoring feedback")],['studentReply',tr('Retour de l’élève', "Student feedback")]]
      .filter(([key]) => item[key]).map(([key,label]) => '<p><b>' + label + ' :</b> ' + esc(item[key]) + '</p>').join('') + '</details>'
    + (audience === 'parent' ? '<button data-coordinate="' + esc(item.id) + tr('">Décider de la suite</button>', "\">Choose the next step</button>") : '')
    + (audience === 'teacher' ? '<button data-teacher-coordinate="' + esc(item.id) + tr('">Donner un repère scolaire</button>', "\">Add lesson guidance</button>") : '')
    + (audience === 'tutor' ? '<button data-coach-coordinate="' + esc(item.id) + tr('">Préparer / rendre compte</button>', "\">Plan / give feedback</button>") : '')
    + (audience === 'student' ? '<button data-student-coordinate="' + esc(item.id) + tr('" class="secondary">Ajouter mon retour</button>', "\" class=\"secondary\">Add my feedback</button>") : '')
    + '</article>';
}

function coordinationView() {
  const audience = coordinationAudience();
  const intro = coordinationRoleIntro(audience);
  const child = data.children[selected];
  const items = coordinationItems();
  return tr('<section class="coord-head"><div><div class="eyebrow">SECONDAIRE · SUIVI PARTAGÉ</div><h1>Une difficulté, une décision claire.</h1><p>', "<section class=\"coord-head\"><div><div class=\"eyebrow\">SECONDARY · SHARED FOLLOW-UP</div><h1>One difficulty, one clear next step.</h1><p>") + esc(child.name) + ' · ' + esc(child.level) + '</p></div><div class="coord-role"><b>' + intro[0] + '</b><span>' + intro[1] + '</span></div></section>'
    + tr('<section class="coord-guard"><b>Chacun garde son rôle.</b><span>L’élève décrit. Le parent oriente. L’enseignant donne le repère scolaire. L’accompagnateur renforce. Les messages sont relus avant tout partage.</span></section>', "<section class=\"coord-guard\"><b>Everyone has a role.</b><span>The student describes the difficulty. The parent chooses support. The teacher gives lesson guidance. The tutor provides practice. Review messages before sharing.</span></section>")
    + (audience === 'student' ? tr('<section class="card coord-new"><h2>Signaler un nouveau point</h2><form id="coord-new" class="formgrid"><label>Matière<input name="subject" required maxlength="100"></label><label class="full">Où est-ce que ça bloque ?<input name="need" required maxlength="250" placeholder="Ex. Je ne sais pas quand changer le signe dans une équation."></label><label class="full">Ce que j’ai déjà essayé<textarea name="attempt" required maxlength="600" placeholder="Montre ton raisonnement ou l’étape déjà tentée."></textarea></label><button>Garder ma demande</button></form></section>', "<section class=\"card coord-new\"><h2>Report a new difficulty</h2><form id=\"coord-new\" class=\"formgrid\"><label>Subject<input name=\"subject\" required maxlength=\"100\"></label><label class=\"full\">Where are you stuck?<input name=\"need\" required maxlength=\"250\" placeholder=\"e.g. I am unsure when a sign changes in an equation.\"></label><label class=\"full\">What I have already tried<textarea name=\"attempt\" required maxlength=\"600\" placeholder=\"Describe your reasoning or the step you tried.\"></textarea></label><button>Keep my request</button></form></section>") : '')
    + '<div class="coord-list">' + (items.map((item) => coordinationCard(item, audience)).join('') || tr('<section class="card empty">Aucune difficulté partagée pour le moment.</section>', "<section class=\"card empty\">No shared difficulties yet.</section>")) + '</div>'
    + tr('<p class="muted coord-disclaimer">Les vues simulent les rôles dans un même espace. Ces fiches restent dans votre espace ; utilisez les Cahiers partagés pour transmettre une note à une personne invitée. Aucune notification n’est envoyée. Une progression saisie ne confirme pas à elle seule un acquis.</p>', "<p class=\"muted coord-disclaimer\">These views simulate roles in one workspace. These records stay in your workspace; use Shared notebooks to share a note with an invited person. No notifications are sent. A recorded update alone does not confirm mastery.</p>");
}

function storedCoordination(item) {
  if (!item.imported) return item;
  const saved = {...item, id: klasId(), imported: false};
  return saved;
}

function coordinationModal(item, audience) {
  const saved = storedCoordination(item);
  if (audience === 'parent') {
    modal(tr('<h2>Décider de la suite</h2><p>Choisissez une seule prochaine action réaliste.</p><form id="coord-action"><label>Qui peut aider ?<select name="helper"><option value="Parent">Parent</option><option value="Enseignant de la matière">Enseignant de la matière</option><option value="Accompagnateur pédagogique">Accompagnateur pédagogique</option><option value="Élève en autonomie, avec vérification">Élève en autonomie, avec vérification</option></select></label><label>Décision simple<input name="parentDecision" required maxlength="250" value="', "<h2>Choose the next step</h2><p>Choose one realistic next step.</p><form id=\"coord-action\"><label>Who can help?<select name=\"helper\"><option value=\"Parent\">Parent</option><option value=\"Enseignant de la matière\">Subject teacher</option><option value=\"Accompagnateur pédagogique\">Learning coach</option><option value=\"Élève en autonomie, avec vérification\">Student independently, with a check-in</option></select></label><label>A simple decision<input name=\"parentDecision\" required maxlength=\"250\" value=\"") + esc(saved.parentDecision || '') + tr('" placeholder="Ex. Poser la question au professeur lundi."></label><label>État<select name="status"><option value="Ouvert">Ouvert</option><option value="En cours">En cours</option><option value="À vérifier">À vérifier</option><option value="Réglé">Réglé</option></select></label><button>Garder notre décision</button></form>', "\" placeholder=\"e.g. Ask the teacher on Monday.\"></label><label>Status<select name=\"status\"><option value=\"Ouvert\">Open</option><option value=\"En cours\">In progress</option><option value=\"À vérifier\">To check</option><option value=\"Réglé\">Resolved</option></select></label><button>Keep our decision</button></form>"));
  } else if (audience === 'teacher') {
    modal(tr('<h2>Donner un repère scolaire</h2><p>Répondez sur la notion et la prochaine vérification, sans suivi individuel quotidien.</p><form id="coord-action"><label>Repère du cours<textarea name="teacherReply" required maxlength="800">', "<h2>Add lesson guidance</h2><p>Give guidance on the concept and the next classroom check.</p><form id=\"coord-action\"><label>Lesson reference<textarea name=\"teacherReply\" required maxlength=\"800\">") + esc(saved.teacherReply || '') + tr('</textarea></label><label>À vérifier en classe<input name="teacherCheck" maxlength="250" value="', "</textarea></label><label>To check in class<input name=\"teacherCheck\" maxlength=\"250\" value=\"") + esc(saved.teacherCheck || '') + tr('"></label><button>Garder ce repère</button></form>', "\"></label><button>Keep this guidance</button></form>"));
  } else if (audience === 'tutor') {
    modal(tr('<h2>Renforcement ciblé</h2><p>Notez uniquement le résultat utile à l’élève et au parent.</p><form id="coord-action"><label>Retour de séance<textarea name="coachReply" required maxlength="800">', "<h2>Targeted practice</h2><p>Record the outcome that will help the student and parent.</p><form id=\"coord-action\"><label>Session feedback<textarea name=\"coachReply\" required maxlength=\"800\">") + esc(saved.coachReply || '') + tr('</textarea></label><label>État<select name="status"><option value="En cours">En cours</option><option value="À vérifier">À vérifier</option><option value="Réglé">Réglé</option></select></label><button>Garder ce bilan</button></form>', "</textarea></label><label>Status<select name=\"status\"><option value=\"En cours\">In progress</option><option value=\"À vérifier\">To check</option><option value=\"Réglé\">Resolved</option></select></label><button>Keep this review</button></form>"));
  } else {
    modal(tr('<h2>Mon retour</h2><p>Dis ce que tu arrives maintenant à faire, ou ce qui bloque encore.</p><form id="coord-action"><label>Mon retour<textarea name="studentReply" required maxlength="600">', "<h2>My feedback</h2><p>Describe what you can now do or where you are still stuck.</p><form id=\"coord-action\"><label>My feedback<textarea name=\"studentReply\" required maxlength=\"600\">") + esc(saved.studentReply || '') + tr('</textarea></label><label>État<select name="status"><option value="Ouvert">Ouvert</option><option value="En cours">En cours</option><option value="À vérifier">À vérifier</option></select></label><button>Garder mon retour</button></form>', "</textarea></label><label>Status<select name=\"status\"><option value=\"Ouvert\">Open</option><option value=\"En cours\">In progress</option><option value=\"À vérifier\">To check</option></select></label><button>Keep my feedback</button></form>"));
  }
  const form = $('#coord-action');
  for (const field of form.elements) {
    if (field.name && saved[field.name] != null) {
      if (field.tagName === 'SELECT' && !Array.from(field.options).some(option => option.value === saved[field.name])) {
        const option = document.createElement('option');
        option.value = saved[field.name];
        option.textContent = coordinationState(saved[field.name]);
        field.append(option);
      }
      field.value = saved[field.name];
    }
  }
  form.onsubmit = (event) => {
    event.preventDefault();
    Object.assign(saved, Object.fromEntries(new FormData(form)));
    if (!coordinationStore().includes(saved)) coordinationStore().unshift(saved);
    save();
    $('#modal').close();
    render();
    toast(tr('Mise à jour gardée dans ce suivi.', "Update kept in this follow-up."));
  };
}

renderNavigation = function (audience, course) {
  coordinationNavigation(audience, course);
  if (course !== 'college') return;
  const nav = $('#nav');
  const button = document.createElement('button');
  button.dataset.route = 'coordination';
  button.textContent = tr('Suivi partagé', 'Shared follow-up');
  if (page === 'coordination') {
    button.className = 'active';
    button.setAttribute('aria-current', 'page');
  }
  button.onclick = () => openRoute('coordination');
  const extra = nav.querySelector('.nav-extra');
  nav.insertBefore(button, extra || null);
};

render = function () {
  coordinationRender();
  const child = data.children[selected];
  if (child?.track !== 'college' || page !== 'coordination') return;
  $('#screen').innerHTML = coordinationView();
  const form = $('#coord-new');
  if (form) form.onsubmit = (event) => {
    event.preventDefault();
    coordinationStore().unshift({
      id: klasId(),
      owner: collegeKey(),
      created: localDay(),
      priority: 'À regarder',
      helper: 'À décider ensemble',
      status: 'Ouvert',
      ...Object.fromEntries(new FormData(form))
    });
    save();
    render();
    toast(tr('Demande gardée. Elle sera relue avec le parent.', "Request kept for review with the parent."));
  };
  const audience = coordinationAudience();
  for (const selector of ['[data-coordinate]', '[data-teacher-coordinate]', '[data-coach-coordinate]', '[data-student-coordinate]']) {
    document.querySelectorAll(selector).forEach((button) => button.onclick = () => {
      const id = button.dataset.coordinate || button.dataset.teacherCoordinate || button.dataset.coachCoordinate || button.dataset.studentCoordinate;
      const item = coordinationItems().find((entry) => entry.id === id);
      if (item) coordinationModal(item, audience);
    });
  }
};

render();
