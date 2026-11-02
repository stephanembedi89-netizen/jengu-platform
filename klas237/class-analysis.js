/* Diagnostic collectif après évaluation — enseignant, sans dossiers individuels. */
(function () {
  const caT = (fr, en) => typeof uiLanguage !== 'undefined' && uiLanguage === 'en' ? en : fr;
  const store = () => (data.classAssessments ||= []);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

  function statusFor(rate) {
    if (rate < 50) return {key: 'reteach', label: caT('À reprendre avec la classe', 'Reteach with the class')};
    if (rate < 75) return {key: 'guided', label: caT('À consolider', 'Needs consolidation')};
    return {key: 'secure', label: caT('Plutôt acquis', 'Mostly secure')};
  }

  function rateFor(correct, copies) {
    return copies ? Math.round((Number(correct) / Number(copies)) * 100) : 0;
  }

  function skillRow(index, item) {
    const value = item || {};
    return '<div class="analysis-skill-row" data-analysis-row>'
      + '<span class="analysis-row-number">' + (index + 1) + '</span>'
      + '<label>' + caT('Question ou compétence', 'Question or skill') + '<input name="skill" maxlength="180" required placeholder="' + caT('Ex. Résoudre une équation simple', 'e.g. Solve a simple equation') + '" value="' + esc(value.skill || '') + '"></label>'
      + '<label>' + caT('Copies réussies', 'Successful papers') + '<input name="correct" type="number" min="0" max="200" required value="' + esc(value.correct == null ? '' : value.correct) + '"></label>'
      + '<label class="analysis-error">' + caT('Erreur ou confusion la plus fréquente', 'Most common error or misconception') + '<input name="error" maxlength="240" placeholder="' + caT('Ex. Change le signe sans expliquer pourquoi', 'e.g. Changes the sign without explaining why') + '" value="' + esc(value.error || '') + '"></label>'
      + '<button type="button" class="analysis-remove secondary" aria-label="' + caT('Retirer cette ligne', 'Remove this row') + '">' + caT('Retirer', 'Remove') + '</button>'
      + '</div>';
  }

  function classSubjectOptions(level) {
    try {
      const child = data.children[selected];
      const list = currentCourse() === 'college'
        ? collegeSubjects(level || child?.level || '6e')
        : primarySubjects({...child, level: level || child?.level || 'CP'});
      return list.map(subject => '<option value="' + esc(subject) + '"></option>').join('');
    } catch { return ''; }
  }

  function assessmentForm(open) {
    return '<details class="analysis-entry" ' + (open ? 'open' : '') + '><summary><span>' + caT('Nouveau bilan collectif', 'New whole-class review') + '</span><small>' + caT('5 à 8 minutes après la correction', '5 to 8 minutes after marking') + '</small></summary>'
      + '<form id="class-assessment-form">'
      + '<section class="analysis-form-section"><h2>' + caT('Le contexte de l’évaluation', 'Assessment context') + '</h2><div class="formgrid">'
      + '<label>' + caT('Classe', 'Class') + '<select name="level" required>' + scopedClasses(data.children[selected]?.level) + '</select></label>'
      + '<label>' + caT('Groupe / série', 'Group / stream') + '<input name="group" maxlength="80" required placeholder="Ex. 4e B"></label>'
      + '<label>' + caT('Matière', 'Subject') + '<input name="subject" list="assessment-subjects" maxlength="100" required><datalist id="assessment-subjects">' + classSubjectOptions() + '</datalist></label>'
      + '<label>' + caT('Évaluation', 'Assessment') + '<input name="title" maxlength="160" required placeholder="' + caT('Ex. Séquence 1 — équations', 'e.g. Sequence 1 — equations') + '"></label>'
      + '<label>' + caT('Date de remise des copies', 'Date papers were returned') + '<input name="date" type="date" required></label>'
      + '</div></section>'
      + '<section class="analysis-form-section"><h2>' + caT('La photographie générale', 'Whole-class snapshot') + '</h2><p>' + caT('Saisissez seulement les nombres déjà obtenus pendant la correction.', 'Enter only the figures already obtained while marking.') + '</p><div class="analysis-numbers">'
      + '<label>' + caT('Effectif de la classe', 'Class size') + '<input name="classSize" type="number" min="1" max="200" required></label>'
      + '<label>' + caT('Copies corrigées', 'Papers marked') + '<input name="copies" type="number" min="1" max="200" required></label>'
      + '<label>' + caT('Barème', 'Maximum score') + '<input name="scale" type="number" min="1" max="100" step="0.5" value="20" required></label>'
      + '<label>' + caT('Moyenne de la classe', 'Class average') + '<input name="average" type="number" min="0" max="100" step="0.01" required></label>'
      + '<label>' + caT('Meilleure note', 'Highest score') + '<input name="highest" type="number" min="0" max="100" step="0.01" required></label>'
      + '<label>' + caT('Note la plus basse', 'Lowest score') + '<input name="lowest" type="number" min="0" max="100" step="0.01" required></label>'
      + '<label>' + caT('Copies à la moyenne ou plus', 'Papers at or above pass mark') + '<input name="passed" type="number" min="0" max="200" required></label>'
      + '</div></section>'
      + '<section class="analysis-form-section"><div class="analysis-section-head"><div><h2>' + caT('Où se situe la difficulté ?', 'Where is the difficulty?') + '</h2><p>' + caT('Comptez les réussites par question ou compétence. Aucun nom d’élève.', 'Count successes by question or skill. No student names.') + '</p></div><button type="button" id="add-analysis-row" class="secondary">' + caT('Ajouter une ligne', 'Add a row') + '</button></div><div id="analysis-skill-rows">' + [0,1,2].map(i => skillRow(i)).join('') + '</div></section>'
      + '<p class="note">' + caT('L’outil propose une lecture pédagogique. L’enseignant garde la décision selon son cours, son barème et les conditions réelles de la classe.', 'The tool suggests a teaching interpretation. The teacher keeps the decision based on the lesson, marking scheme and actual classroom conditions.') + '</p>'
      + '<div class="actions"><button>' + caT('Analyser la classe', 'Analyse the class') + '</button></div></form></details>';
  }

  function groupList(items, key) {
    const filtered = items.filter(item => statusFor(item.rate).key === key);
    return filtered.length ? filtered.map(item => '<li><b>' + esc(item.skill) + '</b><span>' + item.rate + '% · ' + esc(item.error || caT('Erreur à préciser', 'Error to specify')) + '</span></li>').join('') : '<li class="muted">' + caT('Aucun point dans ce groupe.', 'No item in this group.') + '</li>';
  }

  function summaryText(a) {
    const sorted = a.items.slice().sort((x, y) => x.rate - y.rate);
    const priority = sorted[0];
    return [
      caT('BILAN COLLECTIF', 'WHOLE-CLASS REVIEW') + ' — ' + a.level + ' ' + a.group,
      a.subject + ' · ' + a.title + ' · ' + a.date,
      caT('Moyenne', 'Average') + ' : ' + a.average + '/' + a.scale + ' · ' + caT('Réussite', 'Pass rate') + ' : ' + a.passRate + '% · ' + caT('Copies', 'Papers') + ' : ' + a.copies + '/' + a.classSize,
      caT('Priorité de reprise', 'Reteaching priority') + ' : ' + priority.skill + ' (' + priority.rate + '%)',
      caT('Erreur fréquente', 'Common error') + ' : ' + (priority.error || caT('À préciser après observation des copies.', 'Specify after reviewing papers.')),
      caT('Prochaine séance', 'Next lesson') + ' : ' + caT('corriger l’erreur commune, refaire un exemple, faire essayer seul puis vérifier avec une question courte.', 'address the common error, model one example, let pupils try independently, then check with one short question.')
    ].join('\n');
  }

  function familyText(a) {
    const priority = a.items.slice().sort((x, y) => x.rate - y.rate)[0];
    return [
      caT('Bonjour chers parents,', 'Dear parents,'),
      caT('Après la correction de ', 'After marking ') + a.title + caT(' en ', ' in ') + a.subject + caT(', la classe va reprendre un point important : ', ', the class will revisit an important point: ') + priority.skill + '.',
      caT('La difficulté observée le plus souvent est : ', 'The most common difficulty was: ') + (priority.error || caT('une étape de la méthode reste à consolider.', 'one step in the method still needs consolidation.')),
      caT('Au prochain cours, nous allons réexpliquer ce point, essayer un nouvel exemple puis vérifier la compréhension avec une question courte.', 'In the next lesson, we will explain this point again, try a new example, then check understanding with one short question.'),
      caT('À la maison, demandez simplement à votre enfant de vous montrer ce qu’il a compris après cette reprise. Il n’est pas nécessaire de refaire tout le cours.', 'At home, simply ask your child to show what they understood after this review. There is no need to reteach the whole lesson.'),
      caT('Merci pour votre accompagnement.', 'Thank you for your support.')
    ].join('\n\n');
  }

  function assessmentReport(a, index) {
    const sorted = a.items.slice().sort((x, y) => x.rate - y.rate);
    const priority = sorted[0];
    return '<details class="assessment-report" ' + (index === 0 ? 'open' : '') + '><summary><span><b>' + esc(a.title) + '</b><small>' + esc(a.level + ' ' + a.group + ' · ' + a.subject + ' · ' + a.date) + '</small></span><span class="report-average">' + esc(a.average) + '<small>/' + esc(a.scale) + '</small></span></summary><div class="assessment-report-body">'
      + '<div class="assessment-metrics"><div><strong>' + esc(a.average) + '/' + esc(a.scale) + '</strong><span>' + caT('moyenne générale', 'class average') + ' · min ' + esc(a.lowest) + ' · max ' + esc(a.highest) + '</span></div><div><strong>' + a.passRate + '%</strong><span>' + caT('à la moyenne ou plus', 'at or above pass mark') + '</span></div><div><strong>' + esc(a.copies) + '/' + esc(a.classSize) + '</strong><span>' + caT('copies analysées', 'papers analysed') + '</span></div><div><strong>' + priority.rate + '%</strong><span>' + caT('sur le point prioritaire', 'on the priority item') + '</span></div></div>'
      + '<section class="analysis-priority"><div><h2>' + caT('Le point à reprendre d’abord', 'What to reteach first') + '</h2><p><b>' + esc(priority.skill) + '</b> — ' + priority.rate + '% ' + caT('de réussite.', 'successful.') + '</p><p>' + esc(priority.error || caT('Précisez l’erreur commune en relisant quelques copies.', 'Specify the common error by reviewing a few papers.')) + '</p></div><span class="priority-stamp">' + caT('PRIORITÉ', 'PRIORITY') + '</span></section>'
      + '<section class="skill-table-wrap"><h2>' + caT('Lecture par compétence ou question', 'Results by skill or question') + '</h2><div class="skill-table" role="table"><div class="skill-table-head" role="row"><span>' + caT('Point évalué', 'Assessed item') + '</span><span>' + caT('Réussite', 'Success') + '</span><span>' + caT('Lecture', 'Interpretation') + '</span></div>'
      + a.items.slice().sort((x,y) => x.rate-y.rate).map(item => { const state = statusFor(item.rate); return '<div class="skill-result" role="row"><span><b>' + esc(item.skill) + '</b><small>' + esc(item.error || caT('Aucune erreur commune notée', 'No common error recorded')) + '</small></span><span class="skill-rate"><i style="--rate:' + item.rate + '%"></i><b>' + item.rate + '%</b></span><span class="analysis-status ' + state.key + '">' + state.label + '</span></div>'; }).join('') + '</div></section>'
      + '<section class="remediation-section"><h2>' + caT('Organiser la reprise sans faire du cas par cas', 'Organise reteaching without individual casework') + '</h2><p>' + caT('Ces groupes sont temporaires et portent sur la compétence, pas sur la valeur de l’élève.', 'These groups are temporary and concern the skill, not the student’s worth.') + '</p><div class="remediation-groups"><article><h3>' + caT('Reprise collective', 'Whole-class reteaching') + '</h3><small>&lt; 50%</small><ul>' + groupList(a.items, 'reteach') + '</ul></article><article><h3>' + caT('Consolidation guidée', 'Guided consolidation') + '</h3><small>50–74%</small><ul>' + groupList(a.items, 'guided') + '</ul></article><article><h3>' + caT('Approfondissement', 'Extension') + '</h3><small>≥ 75%</small><ul>' + groupList(a.items, 'secure') + '</ul></article></div></section>'
      + '<section class="next-lesson"><h2>' + caT('Trame du prochain cours', 'Next lesson outline') + '</h2><ol><li><b>8 min</b><span>' + caT('Montrer l’erreur commune sans citer d’élève, puis faire expliquer pourquoi elle ne fonctionne pas.', 'Show the common error without naming a pupil, then explain why it does not work.') + '</span></li><li><b>15 min</b><span>' + caT('Reprendre le point prioritaire avec un exemple différent de l’évaluation.', 'Reteach the priority with an example different from the assessment.') + '</span></li><li><b>12 min</b><span>' + caT('Faire essayer seul, puis comparer les démarches en binôme.', 'Let pupils try independently, then compare methods in pairs.') + '</span></li><li><b>5 min</b><span>' + caT('Une question de sortie pour décider : continuer ou avancer.', 'Use one exit question to decide whether to continue or move on.') + '</span></li></ol></section>'
      + '<div class="assessment-actions"><button type="button" data-assessment-course="' + esc(a.id) + '">' + caT('Préparer le cours de reprise', 'Plan the reteaching lesson') + '</button><button type="button" class="secondary" data-assessment-family="' + esc(a.id) + '">' + caT('Message simple aux familles', 'Simple family message') + '</button><button type="button" class="secondary" data-assessment-copy="' + esc(a.id) + '">' + caT('Copier le bilan', 'Copy review') + '</button><button type="button" class="secondary" data-assessment-print>' + caT('Imprimer la fiche', 'Print sheet') + '</button><button type="button" class="remove" data-assessment-delete="' + esc(a.id) + '">' + caT('Retirer', 'Remove') + '</button></div><p class="analysis-action-status" role="status"></p>'
      + '</div></details>';
  }

  function assessmentView() {
    const records = store().filter(a => a.course === currentCourse());
    return '<div class="class-analysis-heading"><h1>' + caT('Après les copies, où reprendre la classe ?', 'After marking, what should the class revisit?') + '</h1><p class="muted">' + caT('Une lecture collective de l’évaluation pour corriger les erreurs communes et préparer la prochaine séance. Aucun dossier individuel.', 'A whole-class reading of the assessment to address common errors and prepare the next lesson. No individual student records.') + '</p><div class="analysis-promise"><b>' + caT('Une classe entière', 'A whole class') + '</b><span>' + caT('Des résultats globaux', 'Overall results') + '</span><span>' + caT('Une reprise ciblée', 'Targeted reteaching') + '</span></div></div>'
      + assessmentForm(records.length === 0)
      + '<div class="assessment-history"><div class="analysis-section-head"><div><h2>' + caT('Bilans de classe', 'Class reviews') + '</h2><p>' + caT('Retrouvez les évaluations déjà analysées pour ce cursus.', 'Find assessments already analysed for this pathway.') + '</p></div><span class="history-count">' + records.length + '</span></div>'
      + (records.length ? records.map(assessmentReport).join('') : '<div class="analysis-empty"><h3>' + caT('Aucun bilan pour le moment', 'No review yet') + '</h3><p>' + caT('Commencez avec une seule évaluation et trois compétences importantes.', 'Start with one assessment and three important skills.') + '</p></div>') + '</div>';
  }

  function bindAssessment() {
    const form = document.getElementById('class-assessment-form');
    if (form) {
      const rows = form.querySelector('#analysis-skill-rows');
      const level = form.querySelector('[name="level"]');
      const subjects = form.querySelector('#assessment-subjects');
      level.onchange = () => { subjects.innerHTML = classSubjectOptions(level.value); };
      const bindRemove = () => rows.querySelectorAll('.analysis-remove').forEach(button => button.onclick = () => {
        if (rows.children.length <= 1) { toast(caT('Gardez au moins une compétence à analyser.', 'Keep at least one skill to analyse.')); return; }
        button.closest('[data-analysis-row]').remove();
        [...rows.children].forEach((row, i) => row.querySelector('.analysis-row-number').textContent = i + 1);
      });
      bindRemove();
      document.getElementById('add-analysis-row').onclick = () => {
        if (rows.children.length >= 8) { toast(caT('Huit lignes suffisent pour garder une analyse rapide.', 'Eight rows keep the review manageable.')); return; }
        rows.insertAdjacentHTML('beforeend', skillRow(rows.children.length));
        bindRemove();
      };
      form.onsubmit = event => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(form));
        const classSize = Number(values.classSize), copies = Number(values.copies), scale = Number(values.scale), passed = Number(values.passed);
        if (copies > classSize) { toast(caT('Le nombre de copies ne peut pas dépasser l’effectif.', 'The number of papers cannot exceed class size.')); return; }
        if (passed > copies) { toast(caT('Le nombre de copies à la moyenne ne peut pas dépasser les copies corrigées.', 'The number at pass mark cannot exceed papers marked.')); return; }
        if ([values.average, values.highest, values.lowest].some(value => Number(value) > scale)) { toast(caT('Une note dépasse le barème indiqué.', 'A score exceeds the maximum score.')); return; }
        try {
          if (Number(values.lowest) > Number(values.average) || Number(values.average) > Number(values.highest)) throw new Error(caT('Vérifiez les notes : minimum ≤ moyenne ≤ maximum.', 'Check the scores: minimum ≤ average ≤ maximum.'));
          const items = [...form.querySelectorAll('[data-analysis-row]')].map(row => {
            const skill = row.querySelector('[name="skill"]').value.trim();
            const correct = Number(row.querySelector('[name="correct"]').value);
            if (correct > copies) throw new Error(caT('Une réussite par compétence dépasse le nombre de copies.', 'A skill success count exceeds the number of papers.'));
            return {skill, correct, error: row.querySelector('[name="error"]').value.trim(), rate: rateFor(correct, copies)};
          });
          const record = {id: klasId(), course: currentCourse(), level: values.level, group: values.group.trim(), subject: values.subject.trim(), title: values.title.trim(), date: values.date, classSize, copies, scale, average: Number(values.average), highest: Number(values.highest), lowest: Number(values.lowest), passed, passRate: rateFor(passed, copies), items};
          store().unshift(record); save(); render(); toast(caT('Bilan collectif créé. La priorité de reprise apparaît en premier.', 'Whole-class review created. The reteaching priority appears first.'));
        } catch (error) { toast(error.message); }
      };
    }
    document.querySelectorAll('[data-assessment-delete]').forEach(button => button.onclick = () => {
      if (!confirm(caT('Retirer ce bilan de classe ?', 'Remove this class review?'))) return;
      data.classAssessments = store().filter(a => a.id !== button.dataset.assessmentDelete); save(); render();
    });
    document.querySelectorAll('[data-assessment-print]').forEach(button => button.onclick = () => {
      const report = button.closest('.assessment-report');
      report.classList.add('print-target');
      document.body.classList.add('printing-assessment');
      const cleanup = () => {
        report.classList.remove('print-target');
        document.body.classList.remove('printing-assessment');
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
      window.print();
    });
    document.querySelectorAll('[data-assessment-copy]').forEach(button => button.onclick = async () => {
      const record = store().find(a => a.id === button.dataset.assessmentCopy);
      const status = button.closest('.assessment-report-body').querySelector('.analysis-action-status');
      try { await navigator.clipboard.writeText(summaryText(record)); status.textContent = caT('Bilan copié. Relisez-le avant de le partager.', 'Review copied. Read it before sharing.'); }
      catch { status.textContent = caT('Copie impossible sur cet appareil. Utilisez « Imprimer la fiche ».', 'Copy is unavailable on this device. Use “Print sheet”.'); }
    });
    document.querySelectorAll('[data-assessment-family]').forEach(button => button.onclick = () => {
      const record = store().find(a => a.id === button.dataset.assessmentFamily);
      modal('<h2>' + caT('Message simple aux familles', 'Simple family message') + '</h2><p>' + caT('Un message collectif, sans nom d’élève ni classement. Relisez-le avant de le partager.', 'A whole-class message with no pupil names or ranking. Read it before sharing.') + '</p><label>' + caT('Texte à relire', 'Text to review') + '<textarea id="assessment-family-message" rows="12">' + esc(familyText(record)) + '</textarea></label><div class="actions"><button id="assessment-family-copy">' + caT('Copier le message', 'Copy message') + '</button><button id="assessment-family-share" class="secondary">' + caT('Partager', 'Share') + '</button></div><p id="assessment-family-status" role="status"></p>');
      const field = document.getElementById('assessment-family-message'), status = document.getElementById('assessment-family-status');
      document.getElementById('assessment-family-copy').onclick = async () => { try { await navigator.clipboard.writeText(field.value); status.textContent = caT('Message copié.', 'Message copied.'); } catch { field.select(); status.textContent = caT('Sélectionnez puis copiez le texte.', 'Select and copy the text.'); } };
      document.getElementById('assessment-family-share').onclick = async () => { if (navigator.share) { try { await navigator.share({text: field.value}); } catch {} } else window.open('https://wa.me/?text=' + encodeURIComponent(field.value), '_blank', 'noopener,noreferrer'); };
    });
    document.querySelectorAll('[data-assessment-course]').forEach(button => button.onclick = () => {
      const a = store().find(item => item.id === button.dataset.assessmentCourse);
      const priority = a.items.slice().sort((x,y) => x.rate-y.rate)[0];
      lessonDraft = {level: a.level, group: a.group, subject: a.subject, duration: '40', topic: caT('Reprise — ', 'Reteaching — ') + priority.skill, goal: caT('Corriger l’erreur commune et réussir un nouvel exemple sans aide.', 'Address the common error and complete a new example independently.'), prior: a.title + ' · ' + a.average + '/' + a.scale, simple: priority.error ? caT('Nous allons comprendre pourquoi cette erreur revient : ', 'We will understand why this error keeps appearing: ') + priority.error : '', example: '', together: '', practice: '', answer: '', support: '', extension: '', check: caT('Une question courte de sortie sur ', 'One short exit question on ') + priority.skill, restart: priority.error};
      page = 'build-course'; render(); toast(caT('La trame de reprise est prête. Ajoutez votre exemple et votre exercice.', 'The reteaching outline is ready. Add your example and exercise.'));
    });
  }

  const originalNavigation = renderNavigation;
  renderNavigation = function classAnalysisNavigation(audience, course) {
    originalNavigation(audience, course);
    if (audience !== 'teacher') return;
    const button = document.querySelector('#nav [data-route="classroom"]');
    if (button) button.textContent = course === 'college' ? caT('Diagnostic de classe', 'Class diagnosis') : caT('Progression & bilans', 'Progress and reviews');
  };

  const originalRender = render;
  render = function classAnalysisRender() {
    originalRender();
    const course = currentCourse();
    if (role === 'teacher') {
      const context = document.getElementById('audience-context');
      if (context) {
        const title = context.querySelector('h2'), description = context.querySelector('p'), chip = context.querySelector('.audience-chip');
        if (title) title.textContent = caT('Enseignant', 'Teacher') + ' · ' + (course === 'college' ? caT('Secondaire', 'Secondary') : caT('Primaire', 'Primary'));
        if (description) description.textContent = course === 'college' ? caT('Pilotage collectif · classes de 6e à 3e', 'Whole-class overview · forms 6e to 3e') : caT('Progression collective de la classe', 'Whole-class learning progress');
        if (chip) chip.textContent = caT('La classe, pas un dossier individuel', 'The class, not an individual record');
      }
      if (page === 'staff' && !document.querySelector('.class-assessment-callout')) {
        const banner = document.querySelector('.staff-banner');
        if (banner) {
          const callout = document.createElement('section');
          callout.className = 'class-assessment-callout';
          callout.innerHTML = '<div><h2>' + caT('Après les copies, voir ce que la classe n’a pas compris.', 'After marking, see what the class did not understand.') + '</h2><p>' + caT('Moyenne, erreurs communes, compétences fragiles et prochain cours de reprise — sans saisir les élèves un par un.', 'Average, common errors, fragile skills and the next reteaching lesson — without entering pupils one by one.') + '</p></div><button type="button">' + caT('Analyser une évaluation', 'Analyse an assessment') + '</button>';
          banner.after(callout);
          callout.querySelector('button').onclick = () => { page = 'classroom'; render(); };
        }
      }
    }
    if (role === 'teacher' && page === 'classroom') {
      document.getElementById('screen').innerHTML = assessmentView();
      bindAssessment();
    }
  };
  render();
}());
