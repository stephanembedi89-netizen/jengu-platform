/* Lot 4 — a school-first shell. Keeps all existing routes and data handlers. */
(function () {
  const paths = {
    parent: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0M18 8a3 3 0 0 1 0 6M20 21a5 5 0 0 0-3-4.6',
    student: 'm3 8 9-5 9 5-9 5-9-5Zm4 3v5c3 2 7 2 10 0v-5M20 9v6',
    teacher: 'M4 4h16v12H4zM8 21h8M12 16v5M8 8h8M8 12h5',
    tutor: 'M12 3 4 7v6c0 4.4 3.4 7 8 8s8-3.6 8-8V7l-8-4Zm-3 9 2 2 4-5',
    home: 'M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z',
    routine: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    daily: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',
    search: 'm20 20-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z',
    week: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
    progress: 'M4 19V5m0 14h16M7 15l4-4 3 2 5-6',
    messages: 'M4 5h16v12H8l-4 3zM8 9h8M8 13h5',
    budget: 'M4 6h16v13H4zM4 10h16M15 15h2',
    support: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 2.5 2.5L16 9',
    sessions: 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h4',
    monthly: 'M4 5h16v15H4zM8 3v4M16 3v4M4 9h16M8 13h2M14 13h2M8 17h2',
    staff: 'M5 4h14v16H5zM8 8h8M8 12h5M8 16h7',
    'build-course': 'M4 19.5V5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2.5ZM8 7h6M8 11h8',
    classroom: 'M4 20V4h16v16M8 16v-3M12 16V8M16 16v-6',
    'lesson-library': 'M3 5c3-1 6-.5 9 1.5C15 4.5 18 4 21 5v14c-3-1-6-.5-9 1.5C9 18.5 6 18 3 19V5Zm9 1.5v14',
    prepare: 'M5 3h10l4 4v14H5zM15 3v5h4M9 12h6M9 16h5',
    college: 'M4 20V8l8-5 8 5v12M3 20h18M8 11h2M14 11h2M10 20v-5h4',
    block: 'M12 3a7 7 0 0 0-4 12.7V19h8v-3.3A7 7 0 0 0 12 3Zm-3 19h6',
    revise: 'M4 5h13a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3V5Zm0 14h13',
    'parent-summary': 'M4 5h16v14H4zM8 9h8M8 13h5M8 17h8'
  };

  function icon(name) {
    const path = paths[name] || paths.home;
    return '<svg class="shell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"></path></svg>';
  }

  function roleKey() {
    return document.body.dataset.audience || (typeof role === 'string' ? role : 'parent');
  }

  function roleCopy(key) {
    const english = typeof uiLanguage !== 'undefined' && uiLanguage === 'en';
    const copy = {
      parent: ['Parent', english ? 'Follow without doing it for them' : 'Suivre sans faire à sa place'],
      student: [english ? 'Student' : 'Élève', english ? 'Organise and ask for help' : 'S’organiser et demander de l’aide'],
      teacher: [english ? 'Teacher' : 'Enseignant', english ? 'Plan, teach and adjust' : 'Préparer, transmettre, ajuster'],
      tutor: [english ? 'Learning coach' : 'Accompagnateur', english ? 'Targeted individual support' : 'Renforcement individuel ciblé']
    };
    return copy[key] || copy.parent;
  }

  function localizeShell() {
    const english = typeof uiLanguage !== 'undefined' && uiLanguage === 'en';
    const set = (selector, fr, en) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = english ? en : fr;
    };
    set('.side-caption', 'Le carnet qui relie la maison et l’école.', 'The school record that connects home and school.');
    set('.role-heading b', 'Choisir mon espace', 'Choose my space');
    set('.role-heading span', 'Chacun voit les outils utiles à son rôle.', 'Everyone sees the tools useful to their role.');
    set('.rail-nav-heading', 'Mes actions', 'My actions');
    set('.side-bottom b', 'Une difficulté. Une action.', 'One difficulty. One action.');
    set('.side-bottom p', 'Le suivi reste court, concret et partagé.', 'Support stays short, concrete and shared.');
    set('.year-mark span', 'Année scolaire', 'School year');
    const brand = document.querySelector('.brand');
    if (brand) brand.setAttribute('aria-label', english ? 'Klas 237, home' : 'Klas 237, accueil');
    const roles = document.querySelector('.switch');
    if (roles) roles.setAttribute('aria-label', english ? 'Your space' : 'Votre espace');
  }

  function enhanceRoleSwitch() {
    const keys = {parent: 'parent', 'student-view': 'student', teacher: 'teacher', tutor: 'tutor'};
    Object.entries(keys).forEach(([id, key]) => {
      const button = document.getElementById(id);
      if (!button) return;
      const copy = roleCopy(key);
      button.innerHTML = icon(key) + '<span><strong>' + copy[0] + '</strong><small>' + copy[1] + '</small></span>';
    });
  }

  function enhanceNavigation() {
    document.querySelectorAll('#nav button[data-route]').forEach((button) => {
      const text = button.textContent.trim();
      button.innerHTML = icon(button.dataset.route) + '<span>' + text + '</span>';
    });
  }

  function moveSectionLabels(root) {
    (root || document).querySelectorAll('.eyebrow').forEach((label) => {
      label.classList.add('section-label');
      const heading = label.nextElementSibling;
      if (heading && /^H[1-3]$/.test(heading.tagName)) heading.insertAdjacentElement('afterend', label);
    });
  }

  function enhanceContext() {
    const context = document.getElementById('audience-context');
    if (!context || context.querySelector('.context-seal')) return;
    const child = typeof data !== 'undefined' && data.children ? data.children[selected] : null;
    const initial = roleKey() === 'teacher' ? 'CL' : child && child.name ? child.name.slice(0, 1).toUpperCase() : 'K';
    const seal = document.createElement('span');
    seal.className = 'context-seal';
    seal.textContent = initial;
    context.prepend(seal);
    const text = document.createElement('span');
    text.className = 'context-relay';
    text.textContent = typeof uiLanguage !== 'undefined' && uiLanguage === 'en'
      ? 'Home · school · learning support'
      : 'Maison · école · accompagnement';
    context.append(text);
  }

  function enhanceHome() {
    const screen = document.getElementById('screen');
    if (!screen) return;
    screen.className = 'screen-' + String(page || 'home').replace(/[^a-z-]/g, '');
    if (page !== 'home' && page !== 'staff') return;
    screen.classList.add('screen-dashboard');
    const firstHeading = screen.querySelector(':scope > h1');
    const description = firstHeading && firstHeading.nextElementSibling && firstHeading.nextElementSibling.matches('p') ? firstHeading.nextElementSibling : null;
    if (firstHeading) {
      const intro = document.createElement('div');
      intro.className = 'dashboard-intro';
      firstHeading.before(intro);
      intro.append(firstHeading);
      if (description) intro.append(description);
      const today = document.createElement('p');
      today.className = 'today-mark';
      const label = new Intl.DateTimeFormat(typeof uiLanguage !== 'undefined' && uiLanguage === 'en' ? 'en-GB' : 'fr-CM', {weekday: 'long', day: 'numeric', month: 'long'}).format(new Date());
      today.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      intro.prepend(today);
    }
  }

  function enhanceShell() {
    document.body.dataset.role = roleKey();
    localizeShell();
    enhanceRoleSwitch();
    enhanceNavigation();
    enhanceContext();
    enhanceHome();
    moveSectionLabels(document);
  }

  const previousRender = render;
  render = function redesignedRender() {
    previousRender();
    enhanceShell();
  };
  const previousModal = modal;
  modal = function redesignedModal(html) {
    previousModal(html);
    moveSectionLabels(document.getElementById('modal'));
  };
  enhanceShell();
}());
