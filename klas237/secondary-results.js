/* Secondary follow-up: turn a returned test into one useful next action. */
(function(){
  const previous=render;
  function items(){
    data.college ||= {};
    data.college.results ||= [];
    return data.college.results.filter(item=>item.owner===collegeKey());
  }
  function resultCard(item){
    const score=item.score&&item.scale?' · '+esc(item.score)+'/'+esc(item.scale):'';
    return '<article class="secondary-result-item"><div><span class="tag">'+esc(item.subject)+'</span><small>'+esc(item.date||'')+score+'</small></div><h3>'+esc(item.title)+'</h3><p><b>'+tr('Ce que j’ai compris :','What I understood:')+'</b> '+esc(item.success)+'</p><p><b>'+tr('L’erreur à reprendre :','The error to revisit:')+'</b> '+esc(item.error)+'</p><p class="college-handoff"><b>'+tr('Ma prochaine action :','My next action:')+'</b> '+esc(item.next)+'</p><button class="remove" data-result-remove="'+esc(item.id)+'">'+tr('Retirer','Remove')+'</button></article>';
  }
  function panel(){
    const list=items();
    return '<section class="secondary-results"><div class="secondary-results-heading"><div><p class="eyebrow">'+tr('APRÈS UN DEVOIR OU UN CONTRÔLE','AFTER A TEST OR ASSIGNMENT')+'</p><h2>'+tr('La note informe. L’erreur fait progresser.','The mark informs. The error helps you improve.')+'</h2><p>'+tr('L’élève regarde sa copie, repère une erreur utile et décide d’une seule suite.','The student reviews the marked work, identifies one useful error and chooses one next step.')+'</p></div><span aria-hidden="true">↗</span></div><form id="secondary-result-form" class="formgrid"><label>'+tr('Matière','Subject')+'<input name="subject" required maxlength="100" placeholder="Ex. Mathématiques"></label><label>'+tr('Devoir ou contrôle','Assignment or test')+'<input name="title" required maxlength="180" placeholder="Ex. Contrôle sur les équations"></label><label>'+tr('Date','Date')+'<input name="date" type="date"></label><div class="result-score"><label>'+tr('Note obtenue (facultatif)','Mark (optional)')+'<input name="score" inputmode="decimal" maxlength="6"></label><label>'+tr('Sur','Out of')+'<input name="scale" inputmode="decimal" maxlength="6" value="20"></label></div><label class="full">'+tr('Ce que j’ai compris','What I understood')+'<textarea name="success" required maxlength="500"></textarea></label><label class="full">'+tr('Une erreur que je veux comprendre','One error I want to understand')+'<textarea name="error" required maxlength="500"></textarea></label><label class="full">'+tr('Ma prochaine action','My next action')+'<input name="next" required maxlength="220" placeholder="Ex. Refaire l’exercice 3 et demander une vérification"></label><button class="full">'+tr('Garder ce bilan','Save this review')+'</button></form><div class="secondary-results-list">'+(list.length?list.map(resultCard).join(''):'<p class="empty">'+tr('Aucun bilan enregistré. Commencez avec la prochaine copie remise.','No review saved yet. Start with the next returned paper.')+'</p>')+'</div><p class="muted">'+tr('La note est facultative : Klas 237 suit surtout la compréhension et la prochaine action.','The mark is optional: Klas 237 mainly follows understanding and the next action.')+'</p></section>';
  }
  render=function(){
    previous();
    const c=data.children[selected],screen=document.getElementById('screen');
    if(c?.track!=='college'||page!=='revise'||!screen||screen.querySelector('.secondary-results'))return;
    screen.insertAdjacentHTML('beforeend',panel());
    const form=document.getElementById('secondary-result-form');
    form.onsubmit=event=>{
      event.preventDefault();
      const value=Object.fromEntries(new FormData(form));
      data.college.results.unshift({id:klasId(),owner:collegeKey(),...value});
      save();render();toast(tr('Bilan gardé. La prochaine action est claire.','Review saved. The next action is clear.'));
    };
    screen.querySelectorAll('[data-result-remove]').forEach(button=>button.onclick=()=>{
      data.college.results=data.college.results.filter(item=>item.id!==button.dataset.resultRemove||item.owner!==collegeKey());
      save();render();
    });
  };
  render();
}());
