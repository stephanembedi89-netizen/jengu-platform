/* Original support activities, not an exhaustive or certified syllabus. */
const PRIMARY_LEVELS={
 fr:['SIL','CP','CE1','CE2','CM1','CM2'],
 en:['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6']
};
const PRIMARY_SOURCES={
 fr:['pages/01-Programme_Niveau_01__2019_01.pdf','pages/Curriculum_CE1-CE2_Niveau_06.pdf','pages/curriculum-cm1-cm2-niveau-031-2.pdf'],
 en:['Cameroon-Primary-School-_Level_One.pdf','pages/Cameroon-Primary-School_English-Subsystem_Level2_class3-4.pdf','Cameroon-Primary-School-_Level_Three_class5-6.pdf']
};
function primaryGrade(c){return c?.track==='primary'?(PRIMARY_LEVELS[c.subsystem]||[]).indexOf(c.level):-1;}
function primaryReference(c){const i=primaryGrade(c);return i<0?'': 'https://s3.eu-west-2.amazonaws.com/ebase-bucket/branding/'+PRIMARY_SOURCES[c.subsystem][Math.floor(i/2)];}
const PRIMARY_METHODS=[
 ['Montrez des objets, lisez la consigne et laissez l’enfant montrer sa réponse.','Use objects, read the instruction and let your child point to the answer.'],
 ['Manipulez, puis associez le dessin au mot ou au nombre écrit.','Use objects, then link the drawing to a written word or number.'],
 ['Faites un exemple ensemble, puis laissez refaire avec de petites quantités.','Work through one example, then try again with small quantities.'],
 ['Demandez de choisir une démarche et d’expliquer chaque étape.','Ask your child to choose a method and explain each step.'],
 ['Reliez la leçon à une situation courante et faites vérifier le résultat.','Connect the lesson to an everyday situation and check the result.'],
 ['Laissez chercher seul, justifier la réponse et repérer une erreur éventuelle.','Let your child work independently, justify the answer and look for possible mistakes.']
];
function primaryLevelGuide(c){const i=primaryGrade(c);if(i<0)return '';return '<aside class="primary-level-guide"><strong>'+esc(c.level)+' · '+tr('Notre façon de travailler','How we work')+'</strong><p>'+PRIMARY_METHODS[i][uiLanguage==='en'?1:0]+'</p><p>'+tr('Activités de soutien : choisissez une notion déjà abordée dans le cahier. Ce n’est pas le programme complet ni un calendrier imposé.','Support activities: choose a topic already covered in the exercise book. This is not the full syllabus or a fixed timetable.')+'</p><a href="'+primaryReference(c)+'" target="_blank" rel="noopener">'+tr('Référence du programme pour ce niveau','Curriculum reference for this level')+'</a></aside>';}
const GRADE_MATH={
 fr:[['add',2,3],['add',12,5],['multiply',3,4],['multiply',6,7],['fractions',1,4],['percent',10,2000]],
 en:[['add',1,3],['subtract',15,4],['fractions',1,4],['fractions',3,4],['divide',84,4],['divide',125,5]]
};
function primaryGradeCards(c){
 const i=primaryGrade(c);if(i<0)return [];
 const [kind,a,b]=GRADE_MATH[c.subsystem][i];
 const result=kind==='add'?a+b:kind==='subtract'?a-b:kind==='multiply'?a*b:kind==='divide'?a/b:kind==='percent'?a*b/100:a+'/'+b;
 const expression={add:`${a} + ${b}`,subtract:`${a} − ${b}`,multiply:`${a} × ${b}`,divide:`${a} ÷ ${b}`,fractions:`${a}/${b}`,percent:`${a}% de ${b} FCFA`}[kind];
 const names={add:['Additionner','Adding'],subtract:['Soustraire','Subtracting'],multiply:['Groupes égaux','Equal groups'],divide:['Partage égal','Equal sharing'],fractions:['Parts égales et fractions','Equal parts and fractions'],percent:['Pourcentage simple','Simple percentages']}[kind];
 const exampleFr={add:`Réunis ${a} crayons et ${b} autres. Combien en tout ?`,subtract:`Dessine ${a} points et barre-en ${b}. Combien restent ?`,multiply:`Dessine ${a} groupes de ${b} points. Combien en tout ?`,divide:`Répartis ${a} objets dessinés entre ${b} groupes égaux. Combien par groupe ?`,fractions:`Partage un rectangle en ${b} parts égales. Colorie ${a} part(s). Quelle fraction représente la partie coloriée ?`,percent:`Sur un prix de ${b} FCFA, quelle somme représente ${a} % ?`}[kind];
 const exampleEn={add:`Put together ${a} pencils and ${b} more. How many altogether?`,subtract:`Draw ${a} dots and cross out ${b}. How many remain?`,multiply:`Draw ${a} groups of ${b} dots. How many altogether?`,divide:`Share ${a} drawn objects equally among ${b} groups. How many per group?`,fractions:`Split a rectangle into ${b} equal parts. Colour ${a} part(s). What fraction is coloured?`,percent:`What is ${a}% of a price of ${b} FCFA?`}[kind];
 const explanationFr=kind==='percent'?`10 % est un dixième : ${b} ÷ 10 = ${result} FCFA.`:kind==='fractions'?`Le tout a ${b} parts égales ; ${a} sont coloriées : ${result}.`:`On obtient ${result}. Vérifiez avec le dessin et la méthode du cahier.`;
 const explanationEn=kind==='percent'?`10% is one tenth: ${b} ÷ 10 = ${result} FCFA.`:kind==='fractions'?`The whole has ${b} equal parts; ${a} are coloured: ${result}.`:`The answer is ${result}. Check using the drawing and the exercise book’s method.`;
 const math={id:'grade-'+c.subsystem+'-'+(i+1)+'-math',subject:'math',bands:[Math.ceil((i+1)/2)],grade:c.level,keywords:'math calcul addition soustraction multiplication division fraction pourcentage '+kind,
 fr:[names[0]+' · '+c.level,'Un petit exercice de soutien à rapprocher de la leçon du cahier.',exampleFr,explanationFr,'Cache le résultat. Refais le dessin ou le calcul '+expression+' et explique ta démarche.',explanationFr,'Reprenez avec de plus petites quantités ou demandez un exemple à l’enseignant.'],
 en:[names[1]+' · '+c.level,'A short support exercise to connect to the lesson in the exercise book.',exampleEn,explanationEn,'Cover the answer. Repeat the drawing or calculation '+expression.replace(' de ',' of ')+' and explain your method.',explanationEn,'Try smaller quantities or ask the teacher for an example.']};
 const tasksFr=['Écoute « Amina ouvre son cahier ». Qui ouvre le cahier ?','Lis « Amina ouvre son cahier ». Que fait Amina ?','Lis « Amina ouvre son cahier pour écrire ». Pourquoi ouvre-t-elle son cahier ?','Lis « Il pleut. Amina prend un parapluie ». Quel lien y a-t-il entre les deux phrases ?','Lis « Amina vérifie son sac avant de partir. Elle y ajoute le cahier oublié ». Résume la situation.','Lis « Amina vérifie son sac avant de partir. Elle y ajoute le cahier oublié ». Pourquoi cette vérification est-elle utile ? Justifie avec le texte.'];
 const tasksEn=['Listen: “Amina opens her book.” Who opens the book?','Read: “Amina opens her book.” What does Amina do?','Read: “Amina opens her book to write.” Why does she open her book?','Read: “It is raining. Amina takes an umbrella.” How are the sentences connected?','Read: “Amina checks her bag before leaving. She adds the forgotten book.” Summarise the situation.','Read: “Amina checks her bag before leaving. She adds the forgotten book.” Why is checking useful? Use the text to explain.'];
 const answersFr=['Amina.','Elle ouvre son cahier.','Pour écrire.','Elle prend le parapluie parce qu’il pleut.','Amina vérifie son sac et ajoute le cahier manquant.','Elle évite de partir sans son cahier : le texte dit qu’elle ajoute le cahier oublié.'];
 const answersEn=['Amina.','She opens her book.','To write.','She takes the umbrella because it is raining.','Amina checks her bag and adds the missing book.','She avoids leaving without her book: the text says she adds the forgotten book.'];
 return [math,{id:'grade-'+c.subsystem+'-'+(i+1)+'-read',subject:'language',bands:[Math.ceil((i+1)/2)],grade:c.level,keywords:'read lecture lire comprehension comprendre phrase text',fr:['Lire et comprendre · '+c.level,'Comprendre un court message, puis expliquer sa réponse.',tasksFr[i],PRIMARY_METHODS[i][0],'Montre dans la phrase ce qui t’aide à répondre.',answersFr[i],'L’adulte peut lire à voix haute. Distinguez déchiffrage et compréhension.'],en:['Read and understand · '+c.level,'Understand a short message and explain your answer.',tasksEn[i],PRIMARY_METHODS[i][1],'Point to the words that help you answer.',answersEn[i],'The adult can read aloud. Separate decoding from comprehension.']}];
}
