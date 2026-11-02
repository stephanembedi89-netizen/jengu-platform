(function () {
  const priorRender = render, priorNavigation = renderNavigation;
  const levelsFor = c => { const p = window.klasLycee && klasLycee(c && c.level); return p ? ['2nde', '1re', 'Tle'].filter(y => !(y === '2nde' && p.info.from === '1re')).map(y => y + ' ' + p.serie) : ['6e', '5e', '4e', '3e']; };
  const isLycee = c => !!(window.klasLycee && klasLycee(c && c.level));
  const labels = () => ({
    todo: tr('À commencer', 'Not started'),
    working: tr('En cours', 'In progress'),
    review: tr('À consolider', 'Needs practice'),
    checked: tr('Vérifié ensemble', 'Reviewed together')
  });
  function recordKey(c) { return 'college:' + c.id + ':' + c.level; }
  renderNavigation = function (audience, course) {
    priorNavigation(audience, course);
    if (course !== 'college' || !['parent', 'student'].includes(audience)) return;
    const button = document.createElement('button');
    button.dataset.route = 'secondary-path';
    const cur = data.children[selected];
    button.textContent = isLycee(cur) ? tr('Mon cap Probatoire · Bac', 'My Probatoire · Bac pathway') : tr('Mon cap BEPC', 'My BEPC pathway');
    if (page === 'secondary-path') button.setAttribute('aria-current', 'page');
    button.onclick = () => openRoute('secondary-path');
    $('#nav').append(button);
  };
  render = function () {
    priorRender();
    if (page !== 'secondary-path') return;
    const c = data.children[selected], audience = activeAudience();
    if (c?.track !== 'college' || !['parent', 'student'].includes(audience)) return;
    data.roadmap ||= {};
    const record = data.roadmap[recordKey(c)] || {terms:['todo','todo','todo'], note:''};
    const states = labels();
    $('#screen').innerHTML = '<h1>' + (isLycee(c) ? tr('Mon chemin vers le Probatoire et le Bac', 'My pathway to the Probatoire and Bac') : tr('Mon chemin vers le BEPC', 'My pathway to the BEPC')) + '</h1><p>' +
      tr('Des repères pour organiser le travail, trimestre après trimestre.', 'A way to organise work, term by term.') +
      '</p><section class="card"><div class="roadmap-track" style="grid-template-columns:repeat(4,minmax(130px,1fr))">' +
      levelsFor(c).map((level, i, levels) => '<article class="roadmap-stop ' + (level === c.level ? 'current' : '') + '"><b>' + level + '</b><small>' +
        (level === c.level ? tr('Cette année', 'This year') : i < levels.indexOf(c.level) ? tr('Classe précédente · bilan non renseigné', 'Earlier class · no review recorded') : tr('À venir', 'Ahead')) +
        '</small></article>').join('') + '</div><p class="note">' +
      (isLycee(c) ? tr('Le Probatoire se passe en Première, le Baccalauréat en Terminale. Ce parcours ne prédit pas le résultat de l’examen.', 'The Probatoire is taken in Première, the Baccalauréat in Terminale. This pathway does not predict exam results.') : tr('Le BEPC se prépare en 3e. Ce parcours ne prédit pas le résultat de l’examen.', 'The BEPC is prepared in 3e. This pathway does not predict exam results.')) +
      '</p></section><section class="card"><h2>' + esc(c.level) + ' · ' + tr('Mes trois trimestres', 'My three terms') +
      '</h2><form id="secondary-path-form"><div class="roadmap-quarter">' +
      [0,1,2].map(i => '<label>' + tr('Trimestre ', 'Term ') + (i+1) + '<select name="term' + i + '">' +
        Object.entries(states).map(([value, label]) => '<option value="' + value + '" ' + (record.terms[i] === value ? 'selected' : '') + '>' + label + '</option>').join('') +
        '</select></label>').join('') + '</div><label>' + tr('Le prochain objectif concret', 'The next specific goal') +
      '<input name="note" maxlength="250" value="' + esc(record.note) + '"></label><button>' + tr('Garder mon point', 'Save my update') +
      '</button><p id="path-status" role="status"></p></form></section><section class="card"><h2>' +
      tr('Pour avancer cette semaine', 'Moving forward this week') +
      '</h2><div class="actions"><button data-path-go="revise">' + tr('Prévoir une révision', 'Plan revision') +
      '</button><button class="secondary" data-path-go="coordination">' + tr('Reprendre un point difficile', 'Review a difficulty') +
      '</button></div><p>' + tr('En 3e : ajoute des entraînements en temps limité, relis les erreurs et vérifie les consignes avec ton établissement.', 'In 3e: add timed practice, review mistakes and check instructions with your school.') + '</p></section>';
    $('#secondary-path-form').onsubmit = event => {
      event.preventDefault();
      const values = new FormData(event.target);
      data.roadmap[recordKey(c)] = {terms:[0,1,2].map(i=>values.get('term'+i)), note:values.get('note')};
      save();
      $('#path-status').textContent = tr('Point gardé dans cet espace.', 'Update kept in this workspace.');
    };
    document.querySelectorAll('[data-path-go]').forEach(button => button.onclick = () => openRoute(button.dataset.pathGo));
  };
  render();
}());
