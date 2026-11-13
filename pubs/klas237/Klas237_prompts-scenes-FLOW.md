# Klas 237 · Version B · Prompts des scènes pour Flow

Pour remplacer les personnages dessinés de la version B par de **vrais plans vidéo** (style 3D ou photoréaliste), à générer dans **Flow** (labs.google/flow).
Les textes, l'interface de l'app, les sous-titres et le logo **ne sont pas générés par Flow** : je les ajoute au montage, pour qu'ils soient nets et sans faute.

---

## 0. La méthode (à lire avant de commencer)

**Étape 1 · Créer les 5 personnages une fois pour toutes (images).**
Dans Flow, génère d'abord une image de référence pour chaque personnage (prompts de la section 1). Garde la meilleure de chacun : ce sont tes **« ingrédients »**.

**Étape 2 · Générer chaque scène avec ses ingrédients.**
Pour chaque scène, choisis le mode **« Ingrédients → vidéo »** (*Ingredients to video*), ajoute les images des personnages présents, puis colle le prompt de la scène. C'est ce qui garde **le même visage** d'une scène à l'autre.
Si ce mode n'est pas disponible, utilise **« Texte → vidéo »** et colle le bloc PERSONNAGE en tête du prompt (déjà inclus ci-dessous).

**Réglages communs :**
- Format **9:16 (vertical)**.
- Modèle : **Veo 3.1 Fast** (ou **Lite** pour économiser des crédits).
- **Choisir le style une fois pour toutes** : remplace `{STYLE}` partout par **A** ou **B** et n'en change plus.
  - **A · 3D chaleureuse** (ressemble à notre version dessinée, plus « famille ») : `stylized 3D animation, Pixar-like soft characters, warm cinematic lighting, rich colors`
  - **B · Photoréaliste** (plus « pub télé ») : `photorealistic cinematic commercial, 35mm lens, shallow depth of field, natural skin tones, subtle film grain`

**Crédits :** environ 50 crédits gratuits par jour. Une vidéo coûte ~10 crédits en Lite et ~20 en Fast, soit 2 à 5 scènes par jour. Les 10 scènes se font donc en 2 à 4 jours. Commence par les scènes ★ (les plus importantes).

**Nomme les fichiers** `S1a.mp4`, `S1b.mp4`… comme ci-dessous et envoie-les-moi.

---

## 1. Les personnages (images de référence)

Colle le texte puis génère 2 ou 3 essais, garde le meilleur.

**PAPA (Serge)**
```
{STYLE}. Portrait, waist up, vertical 9:16. Cameroonian father, 40 years old, dark brown skin, short black hair, short neat beard, kind but slightly tired face, wearing a green polo shirt. Neutral warm background. Friendly, natural expression. No text.
```

**MAMAN (Clarisse)**
```
{STYLE}. Portrait, waist up, vertical 9:16. Cameroonian mother, 36 years old, dark brown skin, warm confident smile, colourful wax-print headwrap in yellow, blue, red and green, small gold hoop earrings, burgundy blouse. Neutral warm background. No text.
```

**LE PETIT (Alex, CE2)**
```
{STYLE}. Portrait, waist up, vertical 9:16. Cameroonian boy, 8 years old, dark brown skin, very short hair, big curious eyes, wearing a blue short-sleeved school uniform shirt with a white collar. Neutral warm background. No text.
```

**LE GRAND FRÈRE (Junior, lycée)**
```
{STYLE}. Portrait, waist up, vertical 9:16. Cameroonian teenage boy, 17 years old, dark brown skin, short afro hair, focused and calm expression, wearing a red t-shirt. Neutral background. No text.
```

**L'ENSEIGNANTE (Maîtresse Ngono)**
```
{STYLE}. Portrait, waist up, vertical 9:16. Cameroonian female primary school teacher, 42 years old, dark brown skin, hair in a neat bun, round glasses, mustard-yellow blouse, kind and respected look. Neutral background. No text.
```

---

## 2. Le décor commun (à garder identique)

Le salon familial revient dans 4 scènes. Il est décrit dans les prompts, mais tu peux aussi générer une image de décor et l'ajouter comme ingrédient :
```
{STYLE}. Vertical 9:16. A modest but tidy family living room in Douala, Cameroon, in the evening: wooden dining table with school notebooks and a pencil case, warm ceiling lamp, slowly turning ceiling fan, wax-print curtains in red and yellow, a window showing the night sky, a framed picture on the wall. No people, no text.
```

---

## 3. Les scènes (une vidéo de 8 s chacune)

Chaque prompt suit la même structure : PERSONNAGES · DÉCOR · ACTION · CAMÉRA · LUMIÈRE · SON · À ÉVITER.
**Son :** on demande uniquement l'ambiance, sans paroles ni musique, car la voix off et la musique sont ajoutées au montage.

---

### ★ S1a · « Papa, aide-moi » (voix : phrase 1, début)
Ingrédients : PAPA, LE PETIT
```
{STYLE}. Vertical 9:16.
CHARACTERS: a Cameroonian father, 40, dark brown skin, short hair, short beard, green polo shirt; his 8-year-old son in a blue school uniform shirt with white collar.
SETTING: 8 pm, modest tidy living room in Douala, wooden table with school notebooks, warm ceiling lamp, ceiling fan turning, wax-print curtains, night outside the window.
ACTION: the boy walks up to his father sitting at the table and holds out his open maths exercise book with both hands, looking up at him with hope. The father turns towards him with a smile and takes the notebook.
CAMERA: medium shot at table height, slow push-in.
LIGHT: warm tungsten evening light, soft shadows.
SOUND: quiet evening ambience, distant street sounds of Douala, ceiling fan, no dialogue, no music.
AVOID: any text or letters, logos, distorted hands, extra fingers, plastic skin.
```

### ★ S1b · Papa regarde… regarde encore (phrase 1, fin)
Ingrédients : PAPA, LE PETIT
```
{STYLE}. Vertical 9:16.
CHARACTERS: same father (green polo shirt, short beard) and same 8-year-old son (blue school uniform).
SETTING: same evening living room in Douala, warm lamp light.
ACTION: close-up on the father reading the exercise book. He frowns, tilts his head, turns the notebook sideways, looks again, scratches the back of his head; a small drop of sweat on his temple. Comedic, gentle embarrassment. The boy waits patiently beside him.
CAMERA: close-up on the father's face and the notebook, slight handheld feel, slow zoom in on his puzzled eyes.
LIGHT: warm lamp light from above.
SOUND: ceiling fan, a pen tapping, a small nervous throat clear, no words, no music.
AVOID: readable text on the notebook, logos, distorted hands.
```

### ★ S1c · « Euh… va demander à ta mère » (phrase 1b)
Ingrédients : PAPA, LE PETIT
```
{STYLE}. Vertical 9:16.
CHARACTERS: same father and same son.
SETTING: same living room.
ACTION: the father gives back the notebook with an awkward, sheepish grin, shrugs his shoulders and points with his thumb over his shoulder towards the kitchen, as if saying "go ask your mother". The boy sighs, rolls his eyes playfully and walks off with his notebook.
CAMERA: medium shot, static, comedic timing.
LIGHT: warm evening light.
SOUND: room ambience, a short awkward laugh, footsteps, no spoken words, no music.
AVOID: lip-sync speech, text, logos.
```
*(La réplique « Euh… va demander à ta mère » vient de ta voix off ; le papa ne parle pas à l'image, il fait le geste.)*

### ★ S2 · Maman sourit… et ouvre Klas 237 (phrase 2)
Ingrédients : MAMAN, LE PETIT
```
{STYLE}. Vertical 9:16.
CHARACTERS: a Cameroonian mother, 36, colourful wax-print headwrap (yellow, blue, red, green), gold hoop earrings, burgundy blouse; the same 8-year-old son in blue school uniform.
SETTING: the same Douala living room, next to the table, evening.
ACTION: the boy shows his notebook to his mother. She looks at it, smiles knowingly, takes her smartphone out and taps on it; the screen lights up her face with a soft glow. She sits down next to him, confident and calm.
CAMERA: medium shot, then slow push-in on her smiling face lit by the phone. The phone screen faces away from the camera.
LIGHT: warm lamp light plus a soft cool glow from the phone.
SOUND: room ambience, a soft phone tap sound, no dialogue, no music.
AVOID: visible screen content, any text, logos, distorted hands.
```

### ★ S3 · Dix minutes, on fait ça ensemble (phrase 3)
Ingrédients : MAMAN, LE PETIT
```
{STYLE}. Vertical 9:16.
CHARACTERS: same mother and same son.
SETTING: same living room, sitting side by side at the wooden table, the phone standing on the table, open notebook.
ACTION: together they fold a sheet of paper in four and the boy colours three of the four parts with a pencil, while his mother guides him with a gentle hand gesture. He understands, his face lights up, they smile at each other.
CAMERA: over-the-shoulder close-up on the hands and paper, then rack focus to their happy faces.
LIGHT: warm, cosy evening light.
SOUND: pencil on paper, paper folding, a small happy laugh, no dialogue, no music.
AVOID: readable text, logos, distorted hands, extra fingers.
```

### S4a · Au marché, huit tomates (phrase 4, l'exemple)
Pas d'ingrédient de personnage
```
{STYLE}. Vertical 9:16.
SETTING: a colourful open-air food market in Douala, Cameroon, daytime: a wooden stall with neat piles of bright red tomatoes, wax-print umbrella, blurred busy market in the background.
ACTION: a vendor's hands line up exactly eight ripe tomatoes in a row on the wooden stall, then slide four of them to the side, splitting the row into two equal groups of four.
CAMERA: top-down close-up, then slow tilt to a 45-degree angle.
LIGHT: bright natural daylight, vivid colours.
SOUND: lively market ambience, distant chatter, no clear words, no music.
AVOID: text, price tags, logos, distorted hands.
```

### ★ S4b · Même papa a compris ! (phrase 4, fin)
Ingrédients : PAPA, MAMAN, LE PETIT
```
{STYLE}. Vertical 9:16.
CHARACTERS: same father, same mother, same son.
SETTING: same living room, evening, mother and son at the table with the phone.
ACTION: the father leans in from behind them to look at the phone, frowns for a second, then his eyes widen, he raises his finger in an "aha!" moment and laughs; the mother and the boy turn to him and laugh too.
CAMERA: medium shot from the front of the table, slight push-in on the father's reaction.
LIGHT: warm evening light, soft phone glow.
SOUND: family laughter, room ambience, no dialogue, no music.
AVOID: visible screen content, text, logos.
```

### S5 · À l'école, l'enseignant suit tout (phrase 5)
Ingrédients : L'ENSEIGNANTE
```
{STYLE}. Vertical 9:16.
CHARACTERS: a Cameroonian female primary school teacher, 42, hair in a bun, round glasses, mustard-yellow blouse; a class of Cameroonian children aged 8 in blue school uniforms.
SETTING: a bright primary school classroom in Douala, green chalkboard with simple drawn fraction circles, wooden benches, windows with sunlight.
ACTION: the teacher stands in front of the class holding her smartphone, taps it while glancing at the pupils with a satisfied smile, then puts it in her pocket and points at the board; the children raise their hands enthusiastically.
CAMERA: medium-wide shot from the back of the class, slow dolly towards the teacher.
LIGHT: bright morning daylight.
SOUND: classroom ambience, children murmuring, chalk, no clear words, no music.
AVOID: readable text on the board or phone, logos, distorted hands.
```

### S6 · Le grand frère révise seul (phrase 6)
Ingrédients : LE GRAND FRÈRE
```
{STYLE}. Vertical 9:16.
CHARACTERS: a Cameroonian teenage boy, 17, short afro, red t-shirt.
SETTING: his small bedroom desk in Douala in the evening, a desk lamp, textbooks and exam revision sheets, a wall calendar, his phone on a stand.
ACTION: he reads a hint on his phone, thinks for a second with his pen on his lips, then nods, writes the answer in his notebook with determination and smiles to himself.
CAMERA: close-up, side angle, slow push-in.
LIGHT: focused warm desk lamp, cool blue evening light from the window.
SOUND: pen writing, quiet evening ambience, no dialogue, no music.
AVOID: readable text, logos, distorted hands.
```

### ★ S8 · Maintenant, c'est papa qui explique (phrase 8)
Ingrédients : PAPA, MAMAN, LE PETIT
```
{STYLE}. Vertical 9:16.
CHARACTERS: same father, same mother, same son.
SETTING: the same living room, but in the warm daytime/late afternoon light, window bright.
ACTION: the father, proud and confident, explains the exercise to his son, drawing on a sheet of paper and pointing with his pencil; the boy nods, understands and gives his father a high five. The mother watches from behind, arms crossed, smiling with pride.
CAMERA: medium shot, slow arc around the table, ending on the three smiling faces.
LIGHT: warm golden afternoon light, joyful.
SOUND: family laughter, a high-five clap, room ambience, no dialogue, no music.
AVOID: text, logos, distorted hands, extra fingers.
```

---

## 4. Ce que j'en fais au montage

| Phrase de voix | Plan(s) Flow | Ajouté par moi par-dessus |
|---|---|---|
| 1 | S1a, S1b | « 20 h », bulle « Papa, aide-moi » |
| 1b | S1c | bulle « Euh… va demander à ta mère » |
| 2 | S2 | logo, classes SIL → Terminale |
| 3 | S3 | vrai écran « Ce soir avec Alex », minuteur, carte « Ses progrès » |
| 4 | S4a, S4b | vrai écran de l'assistant, carte des tomates, 💡 |
| 5 | S5 | étiquettes : appel 30 s, notes, programme |
| 6 | S6 | bulle « Indice », BEPC · Probatoire · Bac |
| 7 | (motion seul) | 7 jours gratuits, prix, Mobile Money |
| 8 | S8 | « De petits pas… », logo, adresse du site |

**Priorité si tu manques de crédits :** S1a, S1b, S1c, S2, S3, S4b, S8 (les ★). Pour les autres (S4a, S5, S6), je garde les scènes animées actuelles.

**Conseils :**
- Si un visage change d'une scène à l'autre, regénère avec les images de référence en ingrédients.
- Si une scène fait apparaître du texte ou des lettres bizarres, régénère : les textes viennent de moi au montage.
- Si les mains sont déformées, regénère ou choisis une prise où les mains sont moins visibles.
