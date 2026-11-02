// Templates prepare text only. Sending is always an explicit user action.
function messageDraft(reason,name,detail,author){
 const adult=author==='teacher'||author==='tutor';
 const intros={
  success:tr(adult?'Bonjour, je souhaite partager une réussite observée chez ':'Bonjour, je souhaite partager une réussite de ',adult?'Hello, I would like to share a success I observed with ':'Hello, I would like to share a success for '),
  meeting:tr('Bonjour, pourrions-nous échanger au sujet de ','Hello, could we arrange a conversation about '),
  absence:tr('Bonjour, voici une information concernant une absence de ','Hello, I would like to share information about an absence for '),
  difficulty:tr(adult?'Bonjour, voici un point à reprendre avec ':'Bonjour, je souhaite faire le point sur une difficulté de ',adult?'Hello, here is a point to revisit with ':'Hello, I would like to discuss a difficulty for ')
 };
 const endings={
  success:tr('Merci pour votre accompagnement.','Thank you for your support.'),
  meeting:tr('Quel moment vous conviendrait ? Merci.','What time would suit you? Thank you.'),
  absence:tr('Convenons du travail à reprendre si nécessaire.','Let’s agree on any work to catch up on.'),
  difficulty:tr('Pourrions-nous choisir ensemble une prochaine petite étape ?','Could we agree on one small next step together?')
 };
 const kind=Object.hasOwn(intros,reason)?reason:'difficulty';
 return intros[kind]+name+' : '+detail+'\n\n'+endings[kind];
}
function secondaryMessageDraft(child,block,research){
 if(uiLanguage==='en')return research?
  `Help a student in ${child.level} in Cameroon with ${block.subject}. Question: ${block.question}. Attempt: ${block.attempt}. Difficulty: ${uiText(block.kind)}. Find reliable educational sources. Ask for clarification if needed. Give a hint, an explained method, then a different exercise with a separate answer. Follow the exercise book. Do not claim to certify mastery.`:
  `Hello, we would like help with ${block.subject} (${child.level}). Question: ${block.question}. Difficulty: ${uiText(block.kind)}. Attempt so far: ${block.attempt}. Could you help with this step using the method taught in class?`;
 return research?
  `Aide un élève de ${child.level} au Cameroun en ${block.subject}. Question : ${block.question}. Essai : ${block.attempt}. Difficulté : ${block.kind}. Recherche des sources pédagogiques fiables. Demande une précision si nécessaire. Donne un indice, puis une démarche expliquée, puis un exercice différent avec un corrigé séparé. Suis le cahier. Ne prétends pas certifier les acquis.`:
  `Bonjour, nous souhaitons reprendre un point en ${block.subject} (${child.level}). Question : ${block.question}. Difficulté : ${block.kind}. Essai déjà réalisé : ${block.attempt}. Pourriez-vous nous aider sur cette étape avec la méthode du cours ?`;
}
