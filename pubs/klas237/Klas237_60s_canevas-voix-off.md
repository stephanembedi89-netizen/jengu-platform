# Klas 237 · Pub 60 s · Canevas de voix off

À générer dans **Google AI Studio** (aistudio.google.com/generate-speech), l'outil utilisé pour la vidéo des 1 an.
**Un seul Speaker, 3 blocs** (au 4e bloc, l'outil impose une 2e voix).

---

## 1. Quelle voix choisir

Tu veux une voix **douce, amicale, apaisante, qui porte**. Pour une app de parents et d'école, une voix **féminine chaleureuse** (la « grande sœur » ou la « maîtresse bienveillante ») rassure le mieux. Dans la liste des voix, cherche dans cet ordre :

| Ordre | Voix | Caractère | Pourquoi |
|---|---|---|---|
| 1 | **Sulafat** | chaleureuse | La plus proche de « douce et amicale » |
| 2 | **Achernar** | douce | Très apaisante, idéale pour parler aux parents |
| 3 | **Vindemiatrix** | bienveillante | Posée, rassurante |
| 4 | **Aoede** | légère, souriante | Disponible à coup sûr sur ton modèle |
| 5 | **Achird** (homme) | amical | Si tu préfères une voix masculine douce |
| 6 | **Charon** (homme) | grave, informatif | Option sérieuse, avec le ton « Friendly » |

Les voix 1 à 3 et 5 font partie du catalogue Gemini, mais je n'ai pas pu vérifier qu'elles apparaissent dans ta liste : si l'une manque, passe à la suivante. Évite Riko (trop solennelle pour ce film), Puck et Fenrir (trop énergiques, style pub criarde).

**Test rapide :** génère seulement le bloc 1 avec 2 ou 3 voix, garde celle qui te fait sourire sur « Compo demain ».

---

## 2. Le chrono, de 0 à 60 secondes

| Temps | Durée | Ce qui est dit | Ton | À l'image |
|---|---|---|---|---|
| 0:00 – 0:03 | 3 s | Vingt heures. Compo demain. | Complice, un peu fatigué, sourire en coin | Horloge, « 20 h. Compo demain. » |
| 0:03 – 0:07 | 4 s | À la maison, tout le monde veut aider… mais personne n'a le temps de tout refaire. | Compréhensif, doux | Bulles : l'enfant, le cahier, la maman |
| 0:07 – 0:10,5 | 3,5 s | Klas 237, c'est le relais entre l'école et la maison. De la SIL à la Terminale. | Lumineux, rassurant | Logo, classes de la SIL à la Tle |
| 0:10,5 – 0:15 | 4,5 s | Parents : dix minutes chaque soir. On ouvre le cahier, on voit où ça bloque, on essaie ensemble. | Amical, posé | Écran « Ce soir avec Alex », minuteur |
| 0:15 – 0:22 | 7 s | Et si la méthode a changé, l'assistant explique autrement. Comme au marché, avec les tomates. | Souriant, malicieux sur « les tomates » | Assistant, carte « 8 tomates à 400 FCFA » |
| 0:22 – 0:31 | 9 s | Élèves : pas la réponse, un indice. Des révisions chronométrées, et le compte à rebours jusqu'à l'examen. | Encourageant, dynamique | Indice, chrono, CEP · BEPC · Probatoire · Bac |
| 0:31 – 0:40 | 9 s | Enseignants : vos cours et vos épreuves préparés plus vite, les copies corrigées en photo, et le mot aux parents prêt pour WhatsApp. | Respectueux, soulagé | Assistant de l'enseignant, copies en photo, message WhatsApp aux parents |
| 0:40 – 0:47 | 7 s | Répétiteurs : le journal des séances, les progrès mesurés, et le bilan aux parents écrit pour vous. | Clair, valorisant | Écran accompagnateur |
| 0:47 – 0:53 | 6 s | Un appui, pas une réponse à copier. Même sans réseau. | Ferme et doux, convaincu | Maman et fille, série des soirs |
| 0:53 – 1:00 | 7 s | Essayez sept jours gratuitement, sans carte bancaire. Klas 237 : de petits pas, de grandes réussites. | Chaleureux, invitant, sourire final | Logo, bouton jaune, adresse du site |

Environ 140 mots. Vise **entre 55 et 60 secondes**. Si la voix est un peu plus longue ou plus courte, je recale l'image dessus.

---

## 3. Les 3 blocs à coller dans AI Studio

Pour chaque bloc : **Speaker 1 = la voix choisie**, le **ton** se colle dans la zone de texte libre en haut du menu de ton, **Expression** : rien.

### BLOC 1 · La soirée et le déclic (0:00 → 0:10)
**Ton :**
```
Soft, warm and friendly female narrator, calm and reassuring, gentle smile, close to the listener, medium-slow pace
```
**Texte :**
```
Vingt heures. <short pause> Compo demain. <long pause> À la maison, tout le monde veut aider… <short pause> mais personne n'a le temps de tout refaire. <long pause> Klasse deux-trois-sept, c'est le relais entre l'école et la maison. <short pause> De la SIL à la Terminale. <long pause>
```

### BLOC 2 · Les quatre espaces (0:10 → 0:47)
**Ton :**
```
Friendly, clear and encouraging, warm and soothing, like a kind teacher explaining simply, steady pace
```
**Texte :**
```
Parents : dix minutes chaque soir. <short pause> On ouvre le cahier, on voit où ça bloque, on essaie ensemble. <short pause> Et si la méthode a changé, l'assistant explique autrement. <short pause> Comme au marché, avec les tomates. <long pause> Élèves : pas la réponse, un indice. <short pause> Des révisions chronométrées, et le compte à rebours jusqu'à l'examen. <long pause> Enseignants : vos cours et vos épreuves préparés plus vite, les copies corrigées en photo, et le mot aux parents prêt pour WhatsApp. <long pause> Répétiteurs : le journal des séances, les progrès mesurés, et le bilan aux parents écrit pour vous. <long pause>
```

### BLOC 3 · La méthode et l'invitation (0:47 → 1:00)
**Ton :**
```
Warm, confident and inviting, soft and heartfelt, ending with a smile
```
**Texte :**
```
Un appui, pas une réponse à copier. <short pause> Même sans réseau. <long pause> Essayez sept jours gratuitement, sans carte bancaire. <long pause> Klasse deux-trois-sept : de petits pas, de grandes réussites.
```

---

## 4. Points de prononciation à vérifier à l'écoute
- **Klas 237** : écrit « Klasse deux-trois-sept » dans les blocs. Si tu préfères « deux cent trente-sept », remplace.
- **SIL** : doit sonner « sile ». S'il épelle « S-I-L », écris « sile ».
- **Compo** : « con-po ».
- Les sous-titres de la vidéo gardent l'orthographe correcte.

## 5. Musique (Pixabay)
Tu as raison, pas d'afrobeat ici : il faut laisser la place à la voix. Cherche plutôt :
- `warm acoustic`, `soft marimba`, `gentle inspiring`, `uplifting piano guitar`, `kalimba happy` ;
- tempo de 90 à 105 BPM, sans paroles, léger et positif, sans gros coup de batterie ;
- au moins 60 s, avec une intro douce de 6 à 7 s (la soirée) avant que le rythme ne s'installe (le déclic est à 7 s).

## 6. Ce que tu m'envoies
1. Le fichier audio de la voix (WAV ou MP3).
2. La musique choisie sur Pixabay (MP3).
Je recale l'image sur la voix, je mixe (la musique baisse sous la voix) et je te livre la version finale.
