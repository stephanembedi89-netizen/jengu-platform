/* Lot 3 — interface hardening, complete copy pass and role-specific helpers.
   This layer keeps the existing demo data model intact until Supabase is live. */
(function () {
  const LOT3_EN = {
    "ANNÉE SCOLAIRE · 2026—2027": "SCHOOL YEAR · 2026—2027",
    "Votre espace": "Your space",
    "Petit à petit.": "Step by step.",
    "Un petit pas à la fois.": "One small step at a time.",
    "Votre espace pour une année mieux organisée.": "Your space for a more organised year.",
    "Mon compte": "My account",
    "Démo · données fictives": "Demo · fictional data",
    "Démonstration interactive : utilisez uniquement des informations fictives.": "Interactive demo: use fictional information only.",
    "Vos informations sont enregistrées dans votre compte.": "Your information is saved in your account.",
    "Ajouter un enfant": "Add a child",
    "Ajouter un élève": "Add a student",
    "Afficher :": "Show:",
    "Tous les parcours": "All pathways",
    "Secondaire · 6e–3e": "Secondary · 6e–3e",
    "PARCOURS 01 · PRIMAIRE": "PATHWAY 01 · PRIMARY",
    "Les premiers apprentissages": "Early learning",
    "Francophone : SIL, CP, CE1, CE2, CM1, CM2. Anglophone : Class 1 à 6.": "French-speaking: SIL, CP, CE1, CE2, CM1, CM2. English-speaking: Class 1 to 6.",
    "PARCOURS 02 · SECONDAIRE": "PATHWAY 02 · SECONDARY",
    "Le collège de 6e à 3e": "Collège from 6e to 3e",
    "Un suivi simple des devoirs, contrôles, progrès et échanges avec la famille.": "Simple tracking for homework, tests, progress and family conversations.",
    "VOTRE RENDEZ-VOUS": "YOUR CHECK-IN",
    "VOTRE PROCHAINE SÉANCE": "YOUR NEXT SESSION",
    "Ce soir, on prend le temps.": "Tonight, we make time.",
    "Une semaine bien préparée.": "A well-planned week.",
    "Une leçon. Un objectif clair.": "One lesson. One clear goal.",
    "Dix minutes pour écouter, regarder un point ensemble et préparer demain.": "Ten minutes to listen, look at one point together and prepare for tomorrow.",
    "Posez les étapes de la séance à partir de votre progression de classe.": "Set out the session steps from your class progress.",
    "Commencer mes 10 minutes": "Start my 10 minutes",
    "Préparer ma séance": "Plan my session",
    "Mes enfants": "My children",
    "Mes élèves": "My students",
    "De quoi avez-vous besoin ?": "What do you need?",
    "Voir ma semaine": "See my week",
    "Devoirs, évaluations et choses à prévoir.": "Homework, assessments and things to plan.",
    "Faire le point": "Check in",
    "Une réussite, une difficulté, une suite.": "A success, a difficulty, a next step.",
    "Trouver les bons mots": "Find the right words",
    "Préparer un message clair et respectueux.": "Prepare a clear, respectful message.",
    "Chaque profil garde son parcours et sa classe. Vous pouvez accompagner plusieurs enfants dans le même espace.": "Each profile keeps its pathway and class. You can support several children in one space.",
    "Les observations de cette version restent dans votre espace. Aucun message ne part automatiquement.": "Observations in this version stay in your space. No message is sent automatically.",
    "Choisir": "Choose",
    "Aucun profil dans ce parcours. Ajoutez un prénom ou un surnom.": "No profile in this pathway. Add a first name or nickname.",
    "Sans date précise": "No specific date",
    "Retirer cet élément ?": "Remove this item?",
    "Point gardé pour cet élève.": "Point saved for this student.",
    "Profil ajouté avec son parcours.": "Profile added with its pathway.",
    "ESPACE ENSEIGNANT": "TEACHER SPACE",
    "ESPACE FAMILLE": "FAMILY SPACE",
    "ENSEIGNANT · LA CLASSE": "TEACHER · THE CLASS",
    "PROF PARTICULIER · L’ÉLÈVE": "LEARNING COACH · THE LEARNER",
    "PRÉPARATION ENSEIGNANT": "TEACHER PREPARATION",
    "ENSEIGNANT · PRÉPARATION DE CLASSE": "TEACHER · CLASS PREPARATION",
    "Prof particulier": "Learning coach",
    "Avec le prof particulier": "With a learning coach",
    "Accompagnateur pédagogique": "Learning coach",
    "ACCOMPAGNATEUR PÉDAGOGIQUE · SUIVI INDIVIDUEL": "LEARNING COACH · ONE-TO-ONE SUPPORT",
    "ESPACE ACCOMPAGNATEUR PÉDAGOGIQUE": "LEARNING COACH SPACE",
    "Mes accompagnements": "My learners",
    "Mon prochain accompagnement": "My next learner session",
    "Mes séances": "My sessions",
    "Bilan aux parents": "Family update",
    "Préparer un renforcement": "Plan targeted support",
    "Construire un cours": "Build a lesson",
    "Construire un renforcement": "Build targeted support",
    "Un déroulé guidé, rédigé par vous. Vous pouvez partir d’un exemple et l’adapter.": "A guided plan written by you. You can start from an example and adapt it.",
    "Classe / groupe": "Class / group",
    "Élève ou petit groupe": "Learner or small group",
    "Matériel disponible": "Available materials",
    "Tableau, cahiers, ardoises, objets du quotidien…": "Board, exercise books, slates, everyday objects…",
    "Demandez une courte réponse de chaque élève. Repérez ceux qui ont besoin d’un autre exemple.": "Ask each learner for a short answer. Identify who needs another example.",
    "Faites refaire un nouvel exemple seul. Notez le type d’aide encore nécessaire.": "Ask the learner to try a new example independently. Record the support still needed.",
    "Ex. Chacun explique une étape ou résout un exemple différent.": "e.g. Each learner explains one step or solves a different example.",
    "M’aider à expliquer simplement": "Help me explain simply",
    "Des mots qui aident à comprendre": "Words that help learners understand",
    "Conseils de rédaction ; aucune reformulation automatique par IA.": "Writing guidance; no automatic AI rewriting.",
    "Annoncez une seule idée : « Aujourd’hui, nous allons apprendre à… »": "State one idea: ‘Today, we are going to learn to…’",
    "Expliquez chaque mot nouveau avant de l’utiliser.": "Explain each new word before using it.",
    "Montrez un exemple et dites à voix haute pourquoi vous faites chaque étape.": "Show an example and say aloud why you complete each step.",
    "Donnez une consigne courte, puis laissez un temps pour essayer.": "Give one short instruction, then allow time to try.",
    "Demandez « Montre-moi comment tu as fait » plutôt que seulement « Vous avez compris ? ».": "Ask ‘Show me how you did it’ instead of only ‘Do you understand?’",
    "Une phrase dépasse 25 mots : essayez de la couper en deux idées.": "One sentence is longer than 25 words: split it into two ideas.",
    "Relisez votre explication à voix haute et repérez les mots qui demandent un exemple.": "Read your explanation aloud and identify words that need an example.",
    "Au primaire : montrez, faites nommer, puis laissez manipuler ou dessiner.": "For primary: show, ask learners to name, then let them handle objects or draw.",
    "Au collège : gardez le terme exact du cours, puis expliquez-le en mots courants et demandez une justification.": "For secondary: keep the exact lesson term, explain it in everyday words, then ask for a reason.",
    "Primaire : partez d’un objet, d’un dessin ou d’une situation familière. Donnez une consigne à la fois, montrez, puis laissez essayer.": "Primary: start with an object, drawing or familiar situation. Give one instruction at a time, show, then let learners try.",
    "Collège : rappelez la base utile, montrez votre raisonnement étape par étape, puis demandez aux élèves de justifier leur démarche.": "Secondary: recall the useful foundation, show your reasoning step by step, then ask learners to explain their method.",
    "Comment vais-je vérifier ?": "How will I check understanding?",
    "Voir ma fiche de cours": "Preview my lesson plan",
    "Garder mon brouillon": "Keep my draft",
    "Préparer la prochaine séance": "Plan the next session",
    "Relisez et ajustez votre texte": "Review and edit your text",
    "Mes séances et bilans": "My sessions and reviews",
    "Rendez-vous": "Appointments",
    "Progrès individuels": "Individual progress",
    "Un besoin précis, une séance, un retour à la famille.": "One clear need, one session, one family update.",
    "Quel point allons-nous débloquer ?": "Which difficulty will we unlock?",
    "Repartez du dernier essai de l’élève et choisissez une petite étape.": "Start from the learner’s latest attempt and choose one small step.",
    "Préparer, observer et échanger avec les familles.": "Plan, observe and communicate with families.",
    "Une leçon, plusieurs façons d’aider.": "One lesson, several ways to help.",
    "Ces options sont facultatives. Elles complètent votre préparation et restent modifiables.": "These options are optional. They complete your plan and can be changed.",
    "ADAPTER SANS REFAIRE TOUT LE COURS": "ADAPT WITHOUT REBUILDING THE WHOLE LESSON",
    "Les groupes restent souples : un élève peut changer de niveau d’aide selon la notion.": "Groups stay flexible: a learner can move between support levels for each topic.",
    "Deux questions courtes, à adapter au temps disponible. Faites répondre chaque élève.": "Two short questions to fit the time available. Let every learner answer.",
    "Les boutons assemblent vos textes dans une trame. Ils ne génèrent ni nouveau corrigé ni réponse avec une IA.": "These buttons assemble your text into a template. They do not generate a new answer or an AI response.",
    "Renseignez d’abord l’exercice à faire sans aide.": "First add the exercise to try independently.",
    "Trames complétées dans les champs vides. Relisez et adaptez.": "Empty fields were filled with a draft. Review and adapt it.",
    "Deux questions reprises de votre cours. Vérifiez leur durée et les réponses.": "Two questions were taken from your lesson. Check their timing and answers.",
    "Brouillon gardé pour cette session de démonstration.": "Draft kept for this demo session.",
    "Exemple simple à adapter au niveau réel de vos élèves et au programme. Il remplacera le brouillon si vous choisissez de l’utiliser.": "A simple example to adapt to your learners’ actual level and curriculum. It replaces the draft only if you choose to use it.",
    "Utiliser cet exemple": "Use this example",
    "À reprendre :": "To revisit:",
    "Reste :": "Remaining:",
    "séances réalisées": "sessions completed",
    "Avec ": "With ",
    "Copié. Vous pouvez le transmettre à la personne choisie.": "Copied. You can send it to the person you chose.",
    "Sélectionnez et copiez ce texte.": "Select and copy this text.",
    "Bilan gardé.": "Review saved.",
    "Préparez, observez, ajustez.": "Plan, observe, adjust.",
    "LE RENDEZ-VOUS AVEC LE PARENT": "PARENT CHECK-IN",
    "LE LIEN AVEC LE PARENT": "THE PARENT LINK",
    "MON ESPACE COLLÈGE": "MY COLLÈGE SPACE",
    "UN POINT À LA FOIS": "ONE POINT AT A TIME",
    "01 · JE PRÉVOIS": "01 · I PLAN",
    "02 · J’AVANCE": "02 · I MOVE FORWARD",
    "S’ENTRAÎNER À LA MÉTHODE": "PRACTISE THE METHOD",
    "3 · À toi :": "3 · Your turn:",
    "L’IA du site n’est pas encore activée. Cette demande peut être copiée dans un outil IA avec recherche Web.": "The site AI is not active yet. You can copy this request into an AI tool with Web search.",
    "Choisissez l’adulte, relisez et copiez le message. Rien n’est envoyé automatiquement.": "Choose the adult, review and copy the message. Nothing is sent automatically.",
    "Copié. Vous pouvez le transmettre.": "Copied. You can send it.",
    "MAISON · ÉCOLE · COURS PARTICULIERS": "HOME · SCHOOL · LEARNING SUPPORT",
    "RENFORCEMENT SCOLAIRE": "LEARNING SUPPORT",
    "Choix conservés dans cet espace. Aucun accès tiers créé.": "Choices kept in this space. No third-party access was created.",
    "Accompagnement retiré. Les séances restent dans l’historique.": "Support arrangement removed. Sessions remain in the history.",
    "Avec un accompagnateur pédagogique": "With a learning coach",
    "Aucun accompagnateur pédagogique n’est encore configuré.": "No learning coach has been configured yet.",
    "La prochaine petite action": "The next small action",
    "La carte 2-5-3": "The 2-5-3 card",
    "Préparer une carte courte à relire avant de la partager.": "Prepare a short card to review before sharing it.",
    "Prévisualiser la carte": "Preview the card",
    "Copier la carte": "Copy the card",
    "Écrire aux familles": "Write to families",
    "À relire avant tout partage. Une observation réelle passe avant toute conclusion.": "Review before sharing. A real observation comes before any conclusion.",
    "Le parcours de l’accompagnateur": "The learning coach flow",
    "1. Repérer le besoin": "1. Identify the need",
    "2. Préparer une séance": "2. Plan a session",
    "3. Faire le bilan": "3. Write the review",
    "Le forfait mensuel reste l’option recommandée pour plusieurs séances.": "A monthly agreement is recommended for several sessions.",
    "La séance à l’unité reste possible si la famille le préfère.": "A single-session arrangement remains possible if the family prefers it.",
    "Le parent garde la décision et peut retirer l’accès à tout moment.": "The parent keeps the decision and can remove access at any time.",
    "FICHE DE SÉANCE": "SESSION REVIEW",
    "Préparer un bilan court à compléter après l’observation.": "Prepare a short review to complete after observing the learner.",
    "Point travaillé": "Focus",
    "Ce que l’élève a essayé": "What the learner tried",
    "Ce qui est acquis ou à reprendre": "What is secure or needs more practice",
    "Prochaine action pour l’élève et la famille": "Next step for the learner and family",
    "Préparer le bilan": "Prepare the review",
    "Copier le bilan": "Copy the review",
    "Bilan copié. Relisez-le avec la famille.": "Review copied. Read it with the family.",
    "Écrire au parent": "Write to the parent",
    "À compléter après la séance : aucune conclusion automatique.": "Complete after the session: no automatic conclusion.",
    "Notre prochaine action": "Our next step",
    "Parent et élève suivent la même petite action, chacun depuis son espace.": "Parent and learner follow the same small action, each from their own space."
  };

  if (typeof UI_EN === 'object') Object.assign(UI_EN, LOT3_EN);

  const fr = (value) => String(value == null ? '' : value);
  const t = (f, e) => uiLanguage === 'en' ? e : f;

  function translateText(value) {
    const raw = fr(value), trimmed = raw.trim();
    if (!trimmed || uiLanguage !== 'en') return raw;
    let translated = (typeof UI_EN === 'object' && UI_EN[trimmed]) || trimmed;
    translated = translated.replace(/^Reste\s*:/, 'Remaining:');
    translated = translated.replace(/^Reste à régler\s*:/, 'Remaining to pay:');
    translated = translated.replace(/^À reprendre\s*:/, 'To revisit:');
    translated = translated.replace(/^Avec\s+/, 'With ');
    translated = translated.replace(/^(\d+)\s*\/\s*(\d+)\s*séances réalisées$/, '$1 / $2 sessions completed');
    translated = translated.replace(/^Bilan saisi en mode prof particulier/, 'Review entered by learning coach');
    translated = translated.replace(/^Bilan saisi en mode enseignant/, 'Review entered by teacher');
    translated = translated.replace(/^Aucun bilan enregistré$/, 'No review recorded');
    return raw.replace(trimmed, translated);
  }

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  function localizeDom(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach((textNode) => {
      const parent = textNode.parentElement;
      if (!parent || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/i.test(parent.tagName)) return;
      if (parent.closest('[data-user-content]')) return;
      if (parent.tagName === 'OPTION' && !parent.hasAttribute('value')) parent.setAttribute('value', parent.value);
      const previous = originalText.get(textNode);
      const source = previous && previous.output === textNode.nodeValue ? previous.source : textNode.nodeValue;
      const output = translateText(source);
      originalText.set(textNode, {source, output});
      textNode.nodeValue = output;
    });
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach((el) => {
      ['placeholder', 'aria-label', 'title'].forEach((attribute) => {
        if (!el.hasAttribute(attribute)) return;
        const records = originalAttributes.get(el) || {};
        const current = el.getAttribute(attribute), previous = records[attribute];
        const source = previous && previous.output === current ? previous.source : current;
        const output = translateText(source);
        records[attribute] = {source, output};
        originalAttributes.set(el, records);
        el.setAttribute(attribute, output);
      });
    });
  }

  function visibleTutorName() {
    document.querySelectorAll('#tutor,.staff-role-label').forEach((el) => {
      if (el.id === 'tutor') el.textContent = t('Accompagnateur pédagogique', 'Learning coach');
      else if (role === 'tutor') el.textContent = t('ACCOMPAGNATEUR PÉDAGOGIQUE · SUIVI INDIVIDUEL', 'LEARNING COACH · ONE-TO-ONE SUPPORT');
    });
    document.querySelectorAll('#supportmode option').forEach((option) => {
      if (option.value === 'Avec un prof particulier') option.textContent = t('Avec un accompagnateur pédagogique', 'With a learning coach');
    });
    if (uiLanguage === 'fr') {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) nodes.push(node);
      nodes.forEach((textNode) => {
        const parent = textNode.parentElement;
        if (!parent || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/i.test(parent.tagName) || parent.closest('[data-user-content]')) return;
        textNode.nodeValue = textNode.nodeValue.replace(/Prof particulier/g, 'Accompagnateur pédagogique');
      });
    }
  }

  function fieldValue(form, name) {
    const field = form && form.elements && form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  }

  function compose253(form) {
    const missing = t('À compléter dans la préparation.', 'Add this to the lesson plan.');
    const goal = fieldValue(form, 'goal') || missing;
    const simple = fieldValue(form, 'simple') || missing;
    const example = fieldValue(form, 'example') || missing;
    const together = fieldValue(form, 'together') || missing;
    const practice = fieldValue(form, 'practice') || missing;
    const check = fieldValue(form, 'check') || fieldValue(form, 'quick1') || missing;
    const next = fieldValue(form, 'restart') || fieldValue(form, 'support') || missing;
    return [
      t('2 MIN · COMPRENDRE', '2 MIN · UNDERSTAND') + '\n' + goal + '\n' + simple,
      t('5 MIN · ESSAYER', '5 MIN · TRY') + '\n' + example + '\n' + together + '\n' + practice,
      t('3 MIN · VÉRIFIER ET DÉCIDER', '3 MIN · CHECK AND DECIDE') + '\n' + check + '\n' + next
    ].join('\n\n');
  }

  let messageSeed = '';

  function openMessageWithSeed(seed) {
    messageSeed = seed;
    page = 'messages';
    render();
    const detail = document.querySelector('#detail');
    if (detail && messageSeed) {
      detail.maxLength = Math.max(detail.maxLength, messageSeed.length);
      detail.value = messageSeed;
      messageSeed = '';
      detail.focus({ preventScroll: true });
    }
  }

  function editableReview(panel, selector, form, compose, draftKey) {
    const old = panel.querySelector(selector);
    const label = document.createElement('label');
    label.htmlFor = old.id;
    label.textContent = t('Relisez et ajustez votre texte', 'Review and edit your text');
    const editor = document.createElement('textarea');
    editor.id = old.id;
    editor.className = 'review-editor';
    editor.rows = 12;
    editor.setAttribute('data-user-content', '');
    editor.value = lessonDraft?.[draftKey] || '';
    label.hidden = editor.hidden = !editor.value;
    old.replaceWith(label, editor);
    editor.oninput = () => { lessonDraft = {...courseObject(form), [draftKey]: editor.value}; };
    const show = () => {
      if (!editor.value.trim()) editor.value = compose(form);
      label.hidden = editor.hidden = false;
      lessonDraft = {...courseObject(form), [draftKey]: editor.value};
      return editor.value;
    };
    return {editor, show};
  }

  function composeTutorReview(form) {
    const missing = t('À compléter après la séance.', 'Complete after the session.');
    const topic = fieldValue(form, 'topic') || missing;
    const goal = fieldValue(form, 'goal') || missing;
    const tried = fieldValue(form, 'practice') || fieldValue(form, 'together') || missing;
    const check = fieldValue(form, 'check') || missing;
    const next = fieldValue(form, 'support') || fieldValue(form, 'restart') || missing;
    return [
      t('POINT TRAVAILLÉ', 'FOCUS') + '\n' + topic + ' — ' + goal,
      t('EXERCICE PRÉVU', 'PLANNED EXERCISE') + '\n' + tried,
      t('CE QUI A ÉTÉ RÉUSSI', 'WHAT WENT WELL') + '\n' + missing,
      t('CE QUI RESTE DIFFICILE', 'WHAT IS STILL DIFFICULT') + '\n' + missing,
      t('VÉRIFICATION PRÉVUE', 'PLANNED CHECK') + '\n' + check,
      t('AIDE ENVISAGÉE — À ADAPTER APRÈS LA SÉANCE', 'POSSIBLE SUPPORT — ADAPT AFTER THE SESSION') + '\n' + next
    ].join('\n\n');
  }

  function addTeacher253() {
    if (role !== 'teacher' || page !== 'build-course') return;
    const form = document.querySelector('#course-builder');
    if (!form || document.querySelector('.teacher-253')) return;
    const panel = document.createElement('section');
    panel.className = 'card daily-entry teacher-253';
    panel.innerHTML = '<div class="eyebrow">' + t('OUTIL ENSEIGNANT', 'TEACHER TOOL') + '</div>'
      + '<div class="teacher-253-head"><div><h2>' + t('La carte 2-5-3', 'The 2-5-3 card') + '</h2><p>' + t('Préparer une carte courte à relire avant de la partager.', 'Prepare a short card to review before sharing it.') + '</p></div><span class="teacher-253-mark">2·5·3</span></div>'
      + '<p class="note">' + t('À relire avant tout partage. Une observation réelle passe avant toute conclusion.', 'Review before sharing. A real observation comes before any conclusion.') + '</p>'
      + '<div class="teacher-253-actions"><button type="button" class="secondary" id="preview-253">' + t('Prévisualiser la carte', 'Preview the card') + '</button><button type="button" class="secondary" id="copy-253">' + t('Copier la carte', 'Copy the card') + '</button><button type="button" class="secondary" id="open-253-message">' + t('Écrire aux familles', 'Write to families') + '</button></div>'
      + '<pre id="teacher-253-preview" class="teacher-253-preview" hidden></pre><p id="teacher-253-status" class="muted" role="status"></p>';
    form.after(panel);
    const {editor: preview, show} = editableReview(panel, '#teacher-253-preview', form, compose253, 'familyCard');
    const status = panel.querySelector('#teacher-253-status');
    panel.querySelector('#preview-253').onclick = show;
    panel.querySelector('#copy-253').onclick = async () => {
      show();
      try { await navigator.clipboard.writeText(preview.value); status.textContent = t('Carte copiée. Relisez-la avant de la partager.', 'Card copied. Review it before sharing.'); }
      catch { preview.hidden = false; status.textContent = t('Sélectionnez le texte puis copiez-le.', 'Select the text and copy it.'); }
    };
    panel.querySelector('#open-253-message').onclick = () => openMessageWithSeed(show());
  }

  function addTutorReviewCard() {
    if (role !== 'tutor' || page !== 'build-course') return;
    const form = document.querySelector('#course-builder');
    if (!form || document.querySelector('.tutor-review')) return;
    const panel = document.createElement('section');
    panel.className = 'card daily-entry tutor-review';
    panel.innerHTML = '<div class="eyebrow">' + t('FICHE DE SÉANCE', 'SESSION REVIEW') + '</div>'
      + '<div class="teacher-253-head"><div><h2>' + t('Le bilan de la séance', 'Session review') + '</h2><p>' + t('Notez ce que l’enfant a réellement réussi, puis la prochaine étape.', 'Record what the child actually achieved, then the next step.') + '</p></div></div>'
      + '<p class="note">' + t('À compléter après la séance : aucune conclusion automatique.', 'Complete after the session: no automatic conclusion.') + '</p>'
      + '<div class="teacher-253-actions"><button type="button" class="secondary" id="prepare-tutor-review">' + t('Préparer le bilan', 'Prepare the review') + '</button><button type="button" class="secondary" id="copy-tutor-review">' + t('Copier le bilan', 'Copy the review') + '</button><button type="button" class="secondary" id="open-tutor-message">' + t('Écrire au parent', 'Write to the parent') + '</button></div>'
      + '<pre id="tutor-review-preview" class="teacher-253-preview" hidden></pre><p id="tutor-review-status" class="muted" role="status"></p>';
    form.after(panel);
    const {editor: preview, show} = editableReview(panel, '#tutor-review-preview', form, composeTutorReview, 'familyReview');
    const status = panel.querySelector('#tutor-review-status');
    panel.querySelector('#prepare-tutor-review').onclick = show;
    panel.querySelector('#copy-tutor-review').onclick = async () => {
      show();
      try { await navigator.clipboard.writeText(preview.value); status.textContent = t('Bilan copié. Relisez-le avec la famille.', 'Review copied. Read it with the family.'); }
      catch { status.textContent = t('Sélectionnez le texte puis copiez-le.', 'Select the text and copy it.'); }
    };
    panel.querySelector('#open-tutor-message').onclick = () => openMessageWithSeed(show());
  }

  function addTutorFlow() {
    if (role !== 'tutor') return;
    if (page === 'staff' && document.querySelector('.staff-banner') && !document.querySelector('.tutor-flow')) {
      const panel = document.createElement('section');
      panel.className = 'card tutor-flow';
      panel.innerHTML = '<div class="eyebrow">' + t('MÉTHODE D’ACCOMPAGNEMENT', 'LEARNING COACH FLOW') + '</div><h2>' + t('Le parcours de l’accompagnateur', 'The learning coach flow') + '</h2><div class="tutor-flow-grid"><div><b>' + t('1. Repérer le besoin', '1. Identify the need') + '</b><span>' + t('Partir d’un cahier et d’un essai réel.', 'Start from an exercise book and a real attempt.') + '</span></div><div><b>' + t('2. Préparer une séance', '2. Plan a session') + '</b><span>' + t('Un objectif, un exemple, une vérification.', 'One goal, one example, one check.') + '</span></div><div><b>' + t('3. Faire le bilan', '3. Write the review') + '</b><span>' + t('Partager une prochaine petite action.', 'Share one small next step.') + '</span></div></div><div class="tutor-flow-actions"><button type="button" class="secondary" data-tutor-go="build-course">' + t('Préparer une séance', 'Plan a session') + '</button><button type="button" class="secondary" data-tutor-go="sessions">' + t('Mes rendez-vous', 'My appointments') + '</button><button type="button" class="secondary" data-tutor-go="monthly">' + t('Forfaits mensuels', 'Monthly agreements') + '</button></div>';
      document.querySelector('.staff-banner').after(panel);
      panel.querySelectorAll('[data-tutor-go]').forEach((button) => { button.onclick = () => { page = button.dataset.tutorGo; render(); }; });
    }
    if (page === 'sessions' && document.querySelector('#sessionform') && !document.querySelector('.tutor-billing-note')) {
      const note = document.createElement('p');
      note.className = 'note tutor-billing-note';
      note.innerHTML = '<b>' + t('Le forfait mensuel reste l’option recommandée pour plusieurs séances.', 'A monthly agreement is recommended for several sessions.') + '</b><br>' + t('La séance à l’unité reste possible si la famille le préfère.', 'A single-session arrangement remains possible if the family prefers it.');
      document.querySelector('#sessionform').before(note);
    }
  }

  function addSharedCollegeNote() {
    if (currentCourse() !== 'college' || (role !== 'parent' && role !== 'student')) return;
    const context = document.querySelector('#audience-context');
    if (!context || context.querySelector('.shared-college-note')) return;
    const note = document.createElement('small');
    note.className = 'shared-college-note';
    note.textContent = t('Parent et élève suivent la même petite action, chacun depuis son espace.', 'Parent and learner follow the same small action, each from their own space.');
    context.append(note);
  }

  function lot3AfterRender() {
    localizeDom(document.body);
    visibleTutorName();
    addTeacher253();
    addTutorReviewCard();
    addTutorFlow();
    addSharedCollegeNote();
  }

  const baseRender = render;
  render = function lot3Render() { baseRender(); lot3AfterRender(); };
  const baseModal = modal;
  modal = function lot3Modal(html) { baseModal(html); lot3AfterRender(); };
  lot3AfterRender();
}());
