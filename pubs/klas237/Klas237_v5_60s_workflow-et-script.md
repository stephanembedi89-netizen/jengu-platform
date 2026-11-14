# Klas 237 · Pub 60 s · v5 : workflow « motion design + plans réels » et script

## 1. Ce que j'ai pu apprendre de Maxence Tison (et ce que je n'ai pas pu lire)
**Non lu :** ses vidéos elles-mêmes. YouTube bloque la lecture des pages vidéo depuis ce serveur (page anti-robot). Je n'ai donc pas son workflow exact, étape par étape.
**Lu (chaîne, site et recoupements) :**
- Ses guides vidéo : « Motion Design PRO avec Claude Opus 5.5 », « Motion Design avec l'IA : le guide complet », « J'ai automatisé 100 % de mon montage vidéo avec Claude », « 3 formats de pubs avec l'IA ».
- Il cite comme outils : Claude, **HyperFrames** (HeyGen, open source, HTML → MP4), **Remotion** (équivalent React), Seedance, Kling, Higgsfield, Nano Banana, HeyGen.
- Il décrit : un **fichier de charte** (couleurs, typos, style de mouvement) que chaque animation doit respecter ; l'IA code l'animation, donc les textes restent nets.
- Les guides du même courant disent : brief structuré (rôle, format, scénario, style, langage de mouvement) ; découpage plan par plan ; **images fixes des moments clés pour valider le style avant le rendu** ; boucle rendu → relecture → correction.

**Ce que nous faisons déjà :** HTML piloté par le temps + Playwright + ffmpeg, charte JenguAI, brief. C'est le même moteur que HyperFrames.
**Ce qui nous manque, et qu'il utilise aussi :** des **plans réels générés par IA** pour les personnages. Le motion design code est excellent pour les titres, les écrans de l'app et les chiffres. Il ne sait pas faire jouer des acteurs (c'est pour cela que les personnages vectoriels sonnent faux).

## 2. Le workflow retenu (le même que le sien, adapté à Klas 237)
1. **Brief + charte** (déjà fait : charte JenguAI, verbatim Douala).
2. **Plans réels** : 4 clips de 8 s générés dans Flow (Veo) avec les prompts du §4. C'est la seule partie que tu génères.
3. **Motion design par moi** : titres, vrais écrans de l'app, logo, sous-titres, transitions, chiffres. Rendu code (HTML → Playwright → ffmpeg).
4. **Montage + voix + musique** : je cale tout sur tes fichiers audio (voix AI Studio, musique Pixabay douce).
5. **Images fixes de contrôle avant chaque rendu**, puis 1 boucle de corrections.
Si tu ne veux pas générer de clips : je peux livrer la version 100 % code, mais avec la limite d'animation que tu as déjà vue.

## 3. Script voix off 60 s (simplifié : parent, élève, enseignant, papa qui explique)
| Temps | Image | Voix |
|---|---|---|
| 0:00–0:14 | **Clips A, B, C** · salon, Bonamoussadi, 20 h, la télé. L'enfant apporte le cahier. Papa ne comprend pas. Maman arrive avec Klas 237 | « Vingt heures, Bonamoussadi. Le petit tend son cahier : Papa, aide-moi. Papa regarde… regarde encore… Euh, va demander à ta mère. Maman sourit, et ouvre Klas 237. » |
| 0:14–0:22 | Logo, classes de la SIL à la Tle | « Klas 237 : de la SIL à la Terminale, l'école et la maison avancent ensemble. » |
| 0:22–0:32 | Écrans réels parent : ce soir 10 minutes, série des soirs, tomates | « Parents : dix minutes chaque soir, on part du cahier. Et si la méthode a changé, l'assistant explique autrement, comme au marché, avec les tomates. » |
| 0:32–0:40 | Écrans réels élève : indice, chrono, objectif | « Élèves : pas la réponse, un indice. Des révisions chronométrées jusqu'à l'examen. » |
| 0:40–0:48 | Écrans réels enseignant : classe, appel, notes, programme | « Enseignants : l'appel en trente secondes, les notes de la classe, le programme toujours à jour. » |
| 0:48–0:56 | **Clip D** · papa explique les tomates au petit, tous deux rient | « Et ce soir, c'est papa qui explique. » |
| 0:56–1:00 | CTA : 7 jours gratuits · klas237.jengu-ai.com | « Sept jours gratuits. Klas 237 : de petits pas, de grandes réussites. » |

(Prononciation : « de la sile à la Terminale ». Prix « dès 2 000 FCFA » à l'écran seulement, pas dit.)

## 4. Prompts Flow (4 clips de 8 s, 9:16, mêmes personnages)
**Bloc personnages (à coller au début de chaque prompt) :**
```
CHARACTERS: Papa Eric, Cameroonian man, 40, dark brown skin, short beard, green polo shirt. Maman Clarisse, Cameroonian woman, 35, dark brown skin, braids under a yellow-and-blue wax headwrap, burgundy blouse. Alex, their son, 8, school uniform, blue shirt. Setting: modest tidy living room in Douala (Bonamoussadi), 8 pm, warm lamp light, ceiling fan, wooden table, TV glowing, window open on a courtyard at night.
STYLE: realistic, warm cinematic light, natural skin tones, light humor, subtle film grain. AVOID: on-screen text, logos, subtitles, distorted hands, plastic skin.
```
**A (0–8 s)** Papa on the sofa watching a football match on TV, relaxed, a drink in hand. Alex walks in with an open exercise book, holds it up to him: "Papa, aide-moi." Papa, without taking his eyes off the TV, says "Oui oui…". Camera: slow push-in, handheld feel.
**B (8 s)** Close on Papa now looking at the notebook (fractions, 3/4). He frowns, squints, tilts his head, scratches his head, a bead of sweat on his temple, glances at the TV then at the book. He says "Euh… va demander à ta mère." Alex sighs. Comic timing.
**C (8 s)** Maman enters from the kitchen with a dish towel on her shoulder, sees the two of them, smiles knowingly, takes out her Android phone and shows the screen to the camera (screen blank green, we replace it). Her face relaxes into a confident smile. Camera: medium shot, slight push-in.
**D (8 s)** Same room, brighter lamp, TV off. Papa and Alex at the table, Papa explaining with real tomatoes on a plate (cutting one in half), Alex laughing and answering; Papa raises a proud fist. Maman in the background smiling. Camera: gentle handheld, warm.

Astuce Flow : génère A, puis utilise la dernière image de A comme image de départ de B (« frames to video »), puis de C, pour garder les mêmes visages.

## 5. Ce que j'envoie / ce que tu m'envoies
- Toi : les 4 clips (A, B, C, D) + la voix (blocs en 3 morceaux) + la musique Pixabay.
- Moi : le montage complet 60 s avec motion design, écrans réels, sous-titres, mixage, et un second export 30 s si tu veux.
