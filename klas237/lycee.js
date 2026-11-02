/* Klas 237 · Second cycle (Seconde → Terminale), sous-système francophone.
   Enseignement secondaire général (ESG) et technique tertiaire (STT, séries commerciales et de gestion).
   Séries d'après l'arrêté n° 227/18/MINESEC/IGE du 23 août 2018 et la nomenclature de l'Office du Baccalauréat.
   Les listes de matières sont indicatives : chaque établissement peut proposer des options différentes. */
(function(){
  'use strict';
  const SERIES={
    A:{family:'ESG',name:'Littéraire',full:'Série A · Lettres, langues et sciences humaines',from:'2nde',
      subjects:['Français','Littérature','Philosophie','Anglais','Langue vivante 2 (allemand, espagnol…)','Histoire','Géographie','Éducation à la citoyenneté','Mathématiques','Informatique','Éducation physique et sportive']},
    C:{family:'ESG',name:'Mathématiques et sciences physiques',full:'Série C · Mathématiques et sciences physiques',from:'2nde',
      subjects:['Mathématiques','Physique','Chimie','SVTEEHB','Français','Philosophie','Anglais','Histoire','Géographie','Informatique','Éducation physique et sportive']},
    D:{family:'ESG',name:'Mathématiques et sciences de la vie',full:'Série D · Mathématiques et sciences de la vie et de la terre',from:'1re',
      subjects:['Mathématiques','SVTEEHB','Physique','Chimie','Français','Philosophie','Anglais','Histoire','Géographie','Informatique','Éducation physique et sportive']},
    TI:{family:'ESG',name:'Technologies de l’information',full:'Série TI · Technologies de l’information',from:'2nde',
      subjects:['Informatique (algorithmique, programmation)','Réseaux et systèmes','Mathématiques','Physique','Français','Philosophie','Anglais','Histoire','Géographie','Éducation physique et sportive']},
    CG:{family:'STT',name:'Comptabilité et gestion',full:'Série CG · Comptabilité et gestion',from:'2nde',
      subjects:['Comptabilité générale','Comptabilité analytique','Gestion financière','Mathématiques financières','Économie générale','Droit','Organisation des entreprises','Informatique de gestion','Français','Anglais','Histoire','Géographie']},
    ACC:{family:'STT',name:'Action et communication commerciales',full:'Série ACC · Action et communication commerciales',from:'2nde',
      subjects:['Techniques commerciales','Mercatique (marketing)','Communication commerciale','Comptabilité','Économie générale','Droit','Mathématiques','Informatique de gestion','Français','Anglais','Histoire','Géographie']},
    ACA:{family:'STT',name:'Action et communication administratives',full:'Série ACA · Action et communication administratives',from:'2nde',
      subjects:['Communication administrative','Techniques administratives','Bureautique','Comptabilité','Économie générale','Droit','Mathématiques','Français','Anglais','Histoire','Géographie']},
    FIG:{family:'STT',name:'Fiscalité et informatique de gestion',full:'Série FIG · Fiscalité et informatique de gestion',from:'2nde',
      subjects:['Fiscalité','Informatique de gestion','Gestion des systèmes d’information','Comptabilité','Mathématiques générales','Économie générale','Droit','Français','Anglais','Histoire','Géographie']},
    SES:{family:'STT',name:'Sciences économiques et sociales',full:'Série SES · Sciences économiques et sociales',from:'2nde',
      subjects:['Sciences économiques','Sociologie','Droit','Mathématiques','Informatique appliquée à l’économie','Histoire','Géographie','Français','Anglais','Philosophie']}
  };
  const CLASSES=[['2nde','Seconde'],['1re','Première'],['Tle','Terminale']];
  const ORDER=['A','C','D','TI','CG','ACC','ACA','FIG','SES'];
  const LYCEE=[];
  for(const [code] of CLASSES)for(const s of ORDER){if(SERIES[s].from==='1re'&&code==='2nde')continue;LYCEE.push(code+' '+s);}
  window.KLAS_SERIES=SERIES;window.KLAS_LYCEE_LEVELS=LYCEE;

  const parse=level=>{const m=/^(2nde|1re|Tle) ([A-Z]+)$/.exec(level||'');return m?{year:m[1],serie:m[2],info:SERIES[m[2]]}:null;};
  window.klasLycee=parse;
  window.klasExam=level=>{if(level==='3e')return 'BEPC';const p=parse(level);if(!p)return '';if(p.year==='Tle')return p.info.family==='STT'?'Baccalauréat technique':'Baccalauréat';return 'Probatoire';};

  // 1. Classes disponibles : le collège puis le lycée, dans le même cursus « secondaire »
  const classes=TRACKS.college.systems.fr.classes;
  for(const l of LYCEE)if(!classes.includes(l))classes.push(l);
  TRACKS.college.label='Secondaire · Collège et lycée';TRACKS.college.short='6e → Terminale';
  TRACKS.college.systems.fr.label='Collège 6e–3e · Lycée Seconde–Terminale';

  // 2. Matières par série
  const baseSubjects=collegeSubjects;
  collegeSubjects=function(level){const p=parse(level);return p?[...p.info.subjects,'Langue / option de mon établissement']:baseSubjects(level);};

  // 3. Repères de l'année
  const yearFocus={
    '2nde':['Installer la méthode du lycée','Prendre des notes, relire le soir même, demander tôt quand ça bloque.'],
    '1re':['Préparer le Probatoire','Réviser par petites séances et refaire les exercices types de la série.'],
    'Tle':['Cap sur le Bac','Un planning jusqu’aux épreuves, des sujets en temps limité, les points faibles d’abord.']
  };
  for(const l of LYCEE){const p=parse(l);COLLEGE_FOCUS[l]=[yearFocus[p.year][0]+' · '+p.serie,yearFocus[p.year][1]];}

  // 4. Exercices types du second cycle (tous à refaire avec la méthode du cahier)
  const EX={
    'lycee-moyenne':{series:'*',title:'Moyenne pondérée · calculer sa moyenne',question:'Tu as 12 en Mathématiques (coefficient 2) et 15 en Français (coefficient 1). Quelle est ta moyenne ?',hint:'Multiplie chaque note par son coefficient, additionne, puis divise par la somme des coefficients.',answer:'(12 × 2 + 15 × 1) ÷ (2 + 1) = 39 ÷ 3 = 13.',try:'Tu as 10 (coefficient 3) et 16 (coefficient 1). Quelle est ta moyenne ?',valid:['11.5','11,5'],explain:'(10 × 3 + 16 × 1) ÷ 4 = 46 ÷ 4 = 11,5.'},
    'lycee-tva':{series:['CG','ACC','ACA','FIG'],title:'TVA · du HT au TTC (19,25 %)',question:'Une facture hors taxes (HT) s’élève à 100 000 FCFA. Le taux de TVA au Cameroun est de 19,25 %. Quel est le montant TTC ?',hint:'TTC = HT × (1 + taux). Ici le coefficient multiplicateur est 1,1925.',answer:'100 000 × 1,1925 = 119 250 FCFA TTC (dont 19 250 FCFA de TVA).',try:'Un achat coûte 20 000 FCFA HT. Quel est le montant TTC ? Réponds en FCFA, sans espace.',valid:['23850','23 850'],explain:'20 000 × 1,1925 = 23 850 FCFA.'},
    'lycee-bilan':{series:['CG','FIG','ACA'],title:'Bilan · l’équilibre actif = passif',question:'Une entreprise a 3 000 000 FCFA de capitaux propres et 1 500 000 FCFA de dettes. Quel est le total de son actif ?',hint:'Le bilan est toujours équilibré : total de l’actif = total du passif (capitaux propres + dettes).',answer:'3 000 000 + 1 500 000 = 4 500 000 FCFA d’actif.',try:'L’actif total vaut 2 000 000 FCFA et les dettes 800 000 FCFA. Combien valent les capitaux propres ?',valid:['1200000','1 200 000'],explain:'2 000 000 − 800 000 = 1 200 000 FCFA.'},
    'lycee-marge':{series:['ACC','CG'],title:'Marge commerciale · vendre au bon prix',question:'Un commerçant achète un sac 10 000 FCFA et le revend 15 000 FCFA HT. Quelle est sa marge ?',hint:'Marge = prix de vente HT − coût d’achat.',answer:'15 000 − 10 000 = 5 000 FCFA de marge.',try:'Prix de vente HT 8 000 FCFA, coût d’achat 6 000 FCFA. Quelle est la marge ?',valid:['2000','2 000'],explain:'8 000 − 6 000 = 2 000 FCFA.'},
    'lycee-croissance':{series:['SES','CG','ACC','A'],title:'Taux de croissance · lire une évolution',question:'La production passe de 200 à 210 tonnes. Quel est le taux de croissance ?',hint:'Taux = (valeur d’arrivée − valeur de départ) ÷ valeur de départ × 100.',answer:'(210 − 200) ÷ 200 × 100 = 5 %.',try:'Un prix passe de 500 à 550 FCFA. Quel est le taux d’augmentation, en % ?',valid:['10','10%','10 %'],explain:'(550 − 500) ÷ 500 × 100 = 10 %.'},
    'lycee-derivee':{series:['C','D','TI'],title:'Dérivée · nombre dérivé en un point',question:'Soit f(x) = x² + 3x. Calcule f′(1).',hint:'La dérivée de x² est 2x et celle de 3x est 3. Calcule d’abord f′(x), puis remplace x par 1.',answer:'f′(x) = 2x + 3, donc f′(1) = 2 + 3 = 5.',try:'Soit g(x) = x³. Calcule g′(2).',valid:['12'],explain:'g′(x) = 3x², donc g′(2) = 3 × 4 = 12.'},
    'lycee-suite':{series:['C','D','TI','A'],title:'Suite arithmétique · terme de rang n',question:'Une suite arithmétique a pour premier terme u₀ = 2 et pour raison r = 3. Calcule u₅.',hint:'Pour une suite arithmétique : uₙ = u₀ + n × r.',answer:'u₅ = 2 + 5 × 3 = 17.',try:'u₀ = 1 et r = 4. Calcule u₃.',valid:['13'],explain:'u₃ = 1 + 3 × 4 = 13.'},
    'lycee-binaire':{series:['TI','FIG'],title:'Binaire · convertir en décimal',question:'Convertis le nombre binaire 1011 en base 10.',hint:'Chaque chiffre vaut une puissance de 2, de droite à gauche : 1, 2, 4, 8…',answer:'1 × 8 + 0 × 4 + 1 × 2 + 1 × 1 = 11.',try:'Convertis 110 (binaire) en base 10.',valid:['6'],explain:'1 × 4 + 1 × 2 + 0 × 1 = 6.'}
  };
  Object.assign(COLLEGE_EXAMPLES,EX);
  window.klasExamplesFor=function(level){const p=parse(level);return Object.entries(COLLEGE_EXAMPLES).filter(([k,v])=>p?(v.series==='*'||(Array.isArray(v.series)&&v.series.includes(p.serie))):!v.series);};

  // 5. Profil de démonstration lycée
  if(!cloud&&Array.isArray(data.children)&&!data.children.some(c=>/^(2nde|1re|Tle) /.test(c.level||''))&&data.children.some(c=>c.name==='Sam'))data.children.push({name:'Inès',track:'college',subsystem:'fr',level:'Tle CG'});

  // 6. Liste des classes groupée (collège, lycée général, lycée technique tertiaire)
  window.klasClassOptions=function(track,sys,list){
    if(track!=='college')return list.map(v=>'<option>'+esc(v)+'</option>').join('');
    const fr=(document.documentElement.lang||'fr')!=='en';
    const g=(label,items)=>items.length?'<optgroup label="'+esc(label)+'">'+items.map(v=>{const p=parse(v);return '<option value="'+esc(v)+'">'+esc(p?v+' · '+p.info.name:v)+'</option>';}).join('')+'</optgroup>':'';
    return g(fr?'Collège':'Lower secondary',list.filter(v=>!parse(v)))+g(fr?'Lycée · enseignement général':'Upper secondary · general',list.filter(v=>parse(v)?.info.family==='ESG'))+g(fr?'Lycée · technique tertiaire (commerce, gestion)':'Upper secondary · business & management',list.filter(v=>parse(v)?.info.family==='STT'));
  };
})();
