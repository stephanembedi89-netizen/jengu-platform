/* Klas 237 · Matières de l'enseignant.
   Primaire : enseignant polyvalent (toutes les matières de la classe).
   Collège et lycée : une matière principale, et au plus une deuxième dans le même domaine
   (ex. Comptabilité + Économie, Histoire + Géographie, Physique + Chimie). */
(function(){
  'use strict';
  const DOMAINS=[
    ['maths','Mathématiques','Mathematics',/^math(é|e)matiques( g(é|e)n(é|e)rales)?$/i],
    ['pc','Sciences physiques','Physical sciences',/physique|chimie|^sciences$/i],
    ['svt','Sciences de la vie et de la Terre','Life and earth sciences',/svt|sciences de la vie/i],
    ['info','Informatique','Computing',/^informatique( \(|$)|r(é|e)seaux|syst(è|e)mes/i],
    ['tertiaire','Gestion, économie, droit et commerce','Business, economics, law and trade',/compta|gestion|fiscal|financi|(é|e)conom|droit|sociolog|commerc|mercatique|communication|administrat|bureautique|organisation des entreprises|informatique de gestion|informatique appliqu/i],
    ['lettres','Français, littérature et philosophie','French, literature and philosophy',/fran(ç|c)ais|litt(é|e)rature|philosoph/i],
    ['langues','Langues','Languages',/anglais|langue|allemand|espagnol|english/i],
    ['hg','Histoire, géographie et citoyenneté','History, geography and citizenship',/histoire|g(é|e)ographie|citoyennet/i],
    ['eps','Éducation physique et sportive','Physical education',/physique et sportive|eps/i],
    ['arts','Arts et culture','Arts and culture',/art|musique|culture/i]
  ];
  // L'ordre compte : « Éducation physique et sportive » avant « Physique », « Informatique de gestion » avant « Informatique ».
  const ORDER=['eps','tertiaire','maths','pc','svt','info','lettres','langues','hg','arts'];
  function domainOf(subject){
    const s=String(subject||'').trim();if(!s||/option de mon (é|e)tablissement/i.test(s))return 'autre';
    for(const id of ORDER){const d=DOMAINS.find(x=>x[0]===id);if(d[3].test(s))return id;}
    return 'autre';
  }
  function domainLabel(id){const d=DOMAINS.find(x=>x[0]===id);return d?tr(d[1],d[2]):tr('Autres matières','Other subjects');}
  function teachable(level){try{return collegeSubjects(level).filter(s=>!/option de mon (é|e)tablissement/i.test(s));}catch(e){return [];}}
  function compatible(first,level){const dom=domainOf(first);return teachable(level).filter(s=>s!==first&&domainOf(s)===dom);}
  function taught(c){
    if(!c)return [];
    if(Array.isArray(c.teachSubjects)&&c.teachSubjects.length)return c.teachSubjects.slice(0,2);
    if(c.track==='college'&&c.subjects)return String(c.subjects).split(/\s*[,;\/]\s*/).filter(Boolean).slice(0,2);
    return [];
  }
  function options(list,selected,placeholder){
    const groups={};list.forEach(s=>{(groups[domainOf(s)]||(groups[domainOf(s)]=[])).push(s);});
    return (placeholder?'<option value="">'+esc(placeholder)+'</option>':'')+Object.entries(groups).map(([d,ss])=>'<optgroup label="'+esc(domainLabel(d))+'">'+ss.map(s=>'<option'+(s===selected?' selected':'')+'>'+esc(s)+'</option>').join('')+'</optgroup>').join('');
  }
  /* Le sélecteur : matière principale + deuxième matière filtrée par domaine */
  function pickerHTML(level,current){
    const list=teachable(level),first=current[0]&&list.includes(current[0])?current[0]:'',second=current[1]&&compatible(first,level).includes(current[1])?current[1]:'';
    const comp=first?compatible(first,level):[];
    return '<label>'+tr('Matière que j’enseigne','Subject I teach')+'<select name="subject1" required data-teach="1">'+options(list,first,tr('Choisir ma matière','Choose my subject'))+'</select></label>'+
      '<label>'+tr('Deuxième matière (facultatif)','Second subject (optional)')+'<select name="subject2" data-teach="2" '+(first&&comp.length?'':'disabled')+'><option value="">'+tr('Aucune','None')+'</option>'+comp.map(s=>'<option'+(s===second?' selected':'')+'>'+esc(s)+'</option>').join('')+'</select><small class="ts-help">'+(first?(comp.length?tr('Uniquement dans le même domaine : ','Same field only: ')+esc(domainLabel(domainOf(first))):tr('Pas d’autre matière de ce domaine dans cette classe.','No other subject in this field for this class.')):tr('Choisissez d’abord votre matière principale.','Choose your main subject first.'))+'</small></label>';
  }
  function bindPicker(root,level,onChange){
    const s1=root.querySelector('[data-teach="1"]');if(!s1)return;
    s1.onchange=()=>{const box=s1.closest('[data-teach-box]');box.innerHTML=pickerHTML(level,[s1.value,'']);bindPicker(box,level,onChange);onChange&&onChange();};
  }
  window.klasTeach={domainOf,domainLabel,teachable,compatible,taught,pickerHTML,bindPicker};
})();
