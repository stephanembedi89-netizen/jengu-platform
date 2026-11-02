// Secondary learning-coach workspace. Loaded last so it can enrich the
// existing staff home without changing the teacher or primary experiences.
const secondaryCoachRender = render;

function coachReviews() {
  collegeData();
  data.college.coachReviews ||= [];
  return data.college.coachReviews.filter((item) => item.owner === collegeKey());
}

function coachAssignedBlocks() {
  const open = collegeItems('blocks').filter((item) => !item.resolved);
  const assigned = open.filter((item) => /accompagnateur|particulier/i.test(item.with || ''));
  const shared = typeof coordinationItems === 'function' ? coordinationItems()
    .filter(item => item.status !== 'Réglé' && /accompagnateur|particulier/i.test(item.helper || ''))
    .map(item => ({...item, question:item.need})) : [];
  const sharedIds = new Set(shared.map(item => item.sourceBlockId).filter(Boolean));
  return [...shared, ...assigned.filter(item => !sharedIds.has(item.id))];
}

function coachWorkspace() {
  const child = data.children[selected];
  const blocks = coachAssignedBlocks();
  const reviews = coachReviews();
  const focus = blocks[0];
  const subject = focus?.subject || '';
  const topic = focus?.question || '';
  return '<section class="coach-hero">'
    + tr('<div><div class="eyebrow">SECONDAIRE · ACCOMPAGNEMENT CIBLÉ</div>', "<div><div class=\"eyebrow\">SECONDARY · TARGETED SUPPORT</div>")
    + tr('<h1>Débloquer un point précis, puis rendre l’élève autonome.</h1>', "<h1>Work through one difficulty and build independence.</h1>")
    + tr('<p>Vous partez d’une difficulté réelle de ', "<p>Start with a real difficulty for ") + esc(child.name) + tr('. Vous ne remplacez ni le cours de l’enseignant ni son évaluation.</p></div>', ". This support complements classroom teaching and assessment.</p></div>")
    + tr('<div class="coach-role"><b>Votre rôle</b><span>1 besoin</span><span>1 séance</span><span>1 retour clair</span></div></section>', "<div class=\"coach-role\"><b>Your role</b><span>1 learning need</span><span>1 session</span><span>1 clear review</span></div></section>")
    + tr('<div class="coach-grid"><section class="card"><div class="eyebrow">1 · LE BESOIN TRANSMIS</div><h2>Ce qu’il faut travailler</h2>', "<div class=\"coach-grid\"><section class=\"card\"><div class=\"eyebrow\">1 · THE LEARNING NEED</div><h2>What needs practice</h2>")
    + (focus ? '<article class="coach-need"><span class="tag">' + esc(focus.subject) + '</span><h3>' + esc(focus.question) + '</h3><p>' + esc(focus.kind || tr('Difficulté signalée', "Reported difficulty")) + '</p></article>' : tr('<div class="empty">Aucune difficulté ouverte n’a encore été confiée. Vous pouvez préparer une séance à partir de votre observation.</div>', "<div class=\"empty\">No open difficulty has been assigned yet. You can plan a session from your observations.</div>"))
    + tr('<p class="muted">Dans cette démo, la transmission entre comptes reste manuelle. Rien n’est envoyé automatiquement.</p></section>', "<p class=\"muted\">This demo does not connect separate accounts. Nothing is sent automatically.</p></section>")
    + tr('<section class="card"><div class="eyebrow">2 · LA SÉANCE</div><h2>Préparer un renforcement</h2>', "<section class=\"card\"><div class=\"eyebrow\">2 · THE SESSION</div><h2>Plan targeted practice</h2>")
    + tr('<p>Reprendre la base utile, faire essayer, puis demander à l’élève d’expliquer sa démarche.</p>', "<p>Review the relevant foundation, let the student try, then ask them to explain their method.</p>")
    + tr('<button data-staff-go="build-course">Construire la séance</button></section></div>', "<button data-staff-go=\"build-course\">Plan the session</button></section></div>")
    + tr('<section class="card coach-review"><div class="eyebrow">3 · APRÈS LA SÉANCE</div><h2>Noter ce qui a vraiment changé</h2>', "<section class=\"card coach-review\"><div class=\"eyebrow\">3 · AFTER THE SESSION</div><h2>Record observable progress</h2>")
    + '<form id="coach-review-form" class="formgrid">'
    + tr('<label>Matière<input name="subject" required maxlength="100" value="', "<label>Subject<input name=\"subject\" required maxlength=\"100\" value=\"") + esc(subject) + tr('" placeholder="Ex. Mathématiques"></label>', "\" placeholder=\"e.g. Mathematics\"></label>")
    + '<label>Date<input name="date" type="date" required value="' + localDay() + '"></label>'
    + tr('<label>Format<select name="format"><option value="Individuel">Individuel</option><option value="Petit groupe">Petit groupe</option></select></label>', "<label>Format<select name=\"format\"><option value=\"Individuel\">Individual</option><option value=\"Petit groupe\">Small group</option></select></label>")
    + tr('<label>Élève ou groupe<input name="group" required maxlength="100" value="', "<label>Student or group<input name=\"group\" required maxlength=\"100\" value=\"") + esc(child.name) + '"></label>'
    + tr('<label class="full">Point travaillé<input name="focus" required maxlength="250" value="', "<label class=\"full\">Topic practised<input name=\"focus\" required maxlength=\"250\" value=\"") + esc(topic) + tr('" placeholder="Une notion ou une étape précise"></label>', "\" placeholder=\"A specific concept or step\"></label>")
    + tr('<label class="full">Ce que l’élève réussit maintenant<textarea name="success" required maxlength="800" placeholder="Décrire un fait observable, pas seulement « il a compris »."></textarea></label>', "<label class=\"full\">What the student can now do<textarea name=\"success\" required maxlength=\"800\" placeholder=\"Describe an observable result, not just “understood”.\"></textarea></label>")
    + tr('<label class="full">Ce qui reste difficile<textarea name="remaining" maxlength="800" placeholder="Ex. Il réussit avec un exemple, mais hésite encore seul."></textarea></label>', "<label class=\"full\">What remains difficult<textarea name=\"remaining\" maxlength=\"800\" placeholder=\"e.g. They succeed with an example but hesitate independently.\"></textarea></label>")
    + tr('<label class="full">Prochaine petite action<input name="next" required maxlength="250" placeholder="Ex. Refaire deux exercices jeudi sans aide"></label>', "<label class=\"full\">Next small step<input name=\"next\" required maxlength=\"250\" placeholder=\"e.g. Retry two exercises on Thursday independently\"></label>")
    + tr('<button>Garder ce bilan</button></form></section>', "<button>Keep this review</button></form></section>")
    + tr('<section class="card"><div class="item-line"><div><div class="eyebrow">HISTORIQUE</div><h2>Bilans de renforcement</h2></div><span class="tag">', "<section class=\"card\"><div class=\"item-line\"><div><div class=\"eyebrow\">HISTORY</div><h2>Session reviews</h2></div><span class=\"tag\">") + reviews.length + tr(' bilan(s)</span></div>', " review(s)</span></div>")
    + (reviews.map((item) => '<article class="coach-report"><div class="item-line"><b>' + esc(item.subject) + ' · ' + esc(item.focus) + '</b><span>' + esc(item.date) + tr('</span></div><p><b>Réussi :</b> ', "</span></div><p><b>Successful:</b> ") + esc(item.success) + '</p>' + (item.remaining ? tr('<p><b>À reprendre :</b> ', "<p><b>To revisit:</b> ") + esc(item.remaining) + '</p>' : '') + tr('<p><b>Suite :</b> ', "<p><b>Next:</b> ") + esc(item.next) + '</p><button class="secondary" data-coach-report="' + item.id + tr('">Compte rendu au parent</button></article>', "\">Review for the parent</button></article>")).join('') || tr('<div class="empty">Le premier bilan apparaîtra ici après la séance.</div>', "<div class=\"empty\">Your first review will appear here after a session.</div>"))
    + '</section>';
}

function coachReport(item) {
  const child = data.children[selected];
  const text = tr('Point de renforcement — ', "Learning support — ") + child.name + '\n'
    + item.subject + ' · ' + item.focus + '\n\n'
    + tr('Ce qui est réussi : ', "What went well: ") + item.success + '\n'
    + (item.remaining ? tr('Ce qui reste à travailler : ', "Still needs practice: ") + item.remaining + '\n' : '')
    + tr('Prochaine étape : ', "Next step: ") + item.next + '\n\n'
    + tr('Ce bilan décrit la séance de renforcement. Il ne remplace pas l’évaluation de l’enseignant.', "This review describes the tutoring session. It does not replace teacher assessment.");
  modal(tr('<h2>Compte rendu au parent</h2><p>Relisez et adaptez ce message. Rien n’est envoyé automatiquement.</p><textarea id="coach-report-text" rows="10">', "<h2>Review for the parent</h2><p>Review and adapt this message. Nothing is sent automatically.</p><textarea id=\"coach-report-text\" rows=\"10\">") + esc(text) + tr('</textarea><button id="coach-copy-report">Copier le compte rendu</button><p id="coach-copy-status" role="status"></p>', "</textarea><button id=\"coach-copy-report\">Copy the review</button><p id=\"coach-copy-status\" role=\"status\"></p>"));
  $('#coach-copy-report').onclick = async () => {
    try {
      await navigator.clipboard.writeText($('#coach-report-text').value);
      $('#coach-copy-status').textContent = tr('Copié. Vous pouvez maintenant choisir où l’envoyer.', "Copied. You can choose where to share it.");
    } catch {
      $('#coach-report-text').select();
      $('#coach-copy-status').textContent = tr('Sélectionnez puis copiez le texte.', "Select and copy the text.");
    }
  };
}

render = function () {
  secondaryCoachRender();
  const child = data.children[selected];
  if (role !== 'tutor' || child?.track !== 'college' || page !== 'staff') return;
  $('#screen').innerHTML = coachWorkspace();
  document.querySelectorAll('[data-staff-go]').forEach((button) => button.onclick = () => {
    page = button.dataset.staffGo;
    if (page === 'build-course') {
      const need = coachAssignedBlocks()[0];
      lessonDraft = need ? {level:child.level, group:child.name, subject:need.subject, topic:need.question, duration:'30'} : null;
    }
    render();
  });
  const form = $('#coach-review-form');
  if (form) form.onsubmit = (event) => {
    event.preventDefault();
    collegeData();
    data.college.coachReviews ||= [];
    data.college.coachReviews.unshift({
      id: klasId(),
      owner: collegeKey(),
      ...Object.fromEntries(new FormData(form))
    });
    save();
    render();
    toast(tr('Bilan gardé dans l’espace de cet élève.', "Review kept in this student’s workspace."));
  };
  document.querySelectorAll('[data-coach-report]').forEach((button) => button.onclick = () => {
    const item = coachReviews().find((review) => review.id === button.dataset.coachReport);
    if (item) coachReport(item);
  });
};

render();
