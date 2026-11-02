/* Parent primary: keep the existing actions and drafts, shorten the visible path. */
(function(){
 const previous=render;
 function subjectPicker(input,c){
  if(!input)return;
  const choices=primarySubjects(c),select=document.createElement('select');select.required=true;
  select.setAttribute('aria-label',tr('Choisir une matière','Choose a subject'));
  select.innerHTML='<option value="">'+tr('Choisir une matière','Choose a subject')+'</option>'+choices.map(s=>'<option value="'+esc(s)+'">'+esc(s)+'</option>').join('')+'<option value="__other">'+tr('Autre matière : je précise','Other subject: enter a name')+'</option>';
  select.value=choices.includes(input.value)?input.value:input.value?'__other':'';
  input.before(select);
  const sync=()=>{const other=select.value==='__other';input.hidden=!other;input.required=other;if(!other)input.value=select.value;input.placeholder=tr('Écrivez la matière du cahier','Enter the subject from the exercise book');};
  sync();select.onchange=()=>{if(select.value==='__other')input.value='';sync();input.dispatchEvent(new Event('input',{bubbles:true}));if(!input.hidden)input.focus();};
 }
 render=function(){
  document.querySelectorAll('.parent-settings').forEach(box=>{const tools=box.querySelector('.topbar-actions');if(tools)box.before(tools);box.remove();});
  previous();const c=data.children[selected],active=role==='parent'&&c?.track==='primary';
  document.body.classList.toggle('primary-parent-simple',active);if(!active)return;
  const header=document.querySelector('main > header');
  if(header){const tools=header.querySelector('.topbar-actions');if(tools){const more=document.createElement('details');more.className='parent-settings';more.innerHTML='<summary>'+tr('Langue et compte','Language and account')+'</summary>';tools.before(more);more.append(tools);}}
  if(page==='homework'){
   subjectPicker(document.querySelector('#hw-form [name=subject]'),c);
   subjectPicker(document.querySelector('#hw-test-form [name=subject]'),c);
   const guide=document.querySelector('.hw-coach');if(guide){const list=guide.querySelector('ol');if(list){const details=document.createElement('details');details.innerHTML='<summary>'+tr('Voir les exemples et les conseils','See examples and tips')+'</summary>';list.before(details);details.append(list);const short=document.createElement('p');short.textContent=tr('2 min : il explique la consigne. 5 min : vous essayez un exemple. 3 min : il refait seul et vous faites le point.','2 min: explain the instruction. 5 min: try an example together. 3 min: try alone and review.');details.before(short);}}
  }
  if(page==='search'){
   const form=document.querySelector('#help-search');if(!form)return;
   const query=document.querySelector('#help-query').closest('label');form.prepend(query);
   subjectPicker(document.querySelector('#help-subject'),c);
   const reminder=document.querySelector('.primary-help-reminder');if(reminder)reminder.remove();
   const settings=document.createElement('details');settings.className='full help-settings';settings.innerHTML='<summary>'+tr('Enfant et langue de l’aide','Child and help language')+'</summary>';
   const child=document.querySelector('#help-child').closest('label'),lang=document.querySelector('#help-lang').closest('label');
   const note=document.querySelector('#help-subject').closest('label').nextElementSibling;
   form.querySelector('button').before(settings);settings.append(child,lang);if(note?.matches('p.muted'))settings.append(note);
  }
 };
 render();
})();
