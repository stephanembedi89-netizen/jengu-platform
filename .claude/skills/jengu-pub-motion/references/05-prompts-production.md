# 05 · Gabarits de prompts de production

Remplacer tout ce qui est entre `{accolades}`. Livrer chaque prompt dans un bloc de code prêt à copier.

---

## A. Prompt maître motion design (Claude Code — HTML/Canvas ou Remotion)

```
RÔLE : Tu es un studio de motion design senior. Tu crées une publicité d'application, rendue image par image, niveau studio international, ancrée à Douala (Cameroun).

LIVRABLE : vidéo {1080x1920} · {30} i/s · {30} s · MP4 H.264 + AAC. Déclinaisons : {15 s, 60 s, 1:1}.
APP : {nom} — {ce qu'elle fait en 1 phrase}. Lien : {lien ou [À CONFIRMER]}.
CIBLE : {cible}. BÉNÉFICE UNIQUE : {bénéfice}. CTA : {CTA} + WhatsApp +237 672 705 729.

RÉCIT (voix off, verbatim local, déjà validé) :
{coller le script minuté}

STORYBOARD (respecter les temps) :
| t | image | mouvement | texte écran (≤7 mots) | son |
{coller le storyboard}

ASSETS fournis : {logo PNG transparent, captures d'écran de l'app, visuels, voix .wav, musique .mp3}.

DIRECTION ARTISTIQUE : palette {bleu nuit #0A1430, bleu roi #1E4FD8, cyan #22D3EE, or #F2B53A (CTA seulement), crème #FFF6E5} ; Sora 700/800 + Manrope ; décors et casting de Douala (voir brief) ; grain + vignettage ; aucun cliché « Afrique carte postale ».

RÈGLES DE MOUVEMENT (obligatoires) :
- Une seule timeline maître pilotée par t (rendu déterministe, aucun Math.random non seedé).
- Jamais d'interpolation linéaire ; entrées en ease-out/ressort, sorties plus rapides en ease-in.
- Chaque entrée anime 2–3 propriétés ; décalage 60–120 ms entre éléments.
- Fond en 5 couches ; tout élément > 2 s respire ; un seul point focal à la fois.
- Écrans de l'app : téléphone réaliste, zoom sur la fonction, doigt qui tape.
- Sous-titres mot à mot synchronisés sur la voix ; zones sûres 9:16 (250 px haut / 400 px bas).
- Musique : ducking sous la voix ; coupes sur les temps forts.

INTERDITS : fondus enchaînés « gabarit », emoji comme icônes, logos d'opérateurs, chiffres/prix non confirmés, texte < 48 px.

VÉRIFICATION : rends, extrais des images à 0/25/50/75/100 % de chaque scène, regarde-les, corrige, re-rends. Livre seulement après une passe propre + check-list qualité.
```

---

## B. Prompts de plans réels (Veo / Flow / Kling — 8 s par plan)

**Fiche personnage (à coller au début de CHAQUE prompt pour garder le même visage) :**
```
CHARACTER: {Maman Clarisse}, Cameroonian woman, 35, dark brown skin, natural hair in neat braids under a {blue and yellow wax} headwrap, warm smile, wearing a {burgundy} blouse, small gold earrings.
```

**Gabarit de plan :**
```
{CHARACTER}
SCENE: {evening, modest but tidy living room in Douala, wooden table with school notebooks, warm lamp light, fan turning, window open on a courtyard with a mango tree}.
ACTION: {she sits next to her 9-year-old daughter in school uniform, looks at the homework, sighs, then picks up her Android phone and smiles}.
CAMERA: {slow push-in, 35mm, shallow depth of field, eye level}.
LIGHT & LOOK: {warm tungsten + soft blue phone glow, natural skin tones, cinematic, subtle film grain}.
AUDIO: {quiet street ambience of Douala in the distance, pen on paper, no music, no dialogue}.
AVOID: text on screen, logos, distorted hands, extra fingers, plastic skin, stereotypes.
```
Astuce : générer des plans **sans texte** ; les textes et l'interface de l'app sont ajoutés au montage motion (lisibles, corrects).

---

## C. Direction voix off (Gemini TTS via AI Studio · ou comédien)

**AI Studio (aistudio.google.com/generate-speech) — 3 blocs maximum par voix (au 4e, l'outil ajoute une 2e voix) :**
- Voix : *Charon* (grave, informative) · *Orus* (ferme) · *Riko* (assurée, grave). Un seul Speaker.
- Ton (champ libre en haut du menu) : `{Warm, friendly Cameroonian narrator, natural and close, light smile, medium pace}`
- Pauses : `<short pause>` `<long pause>` dans le texte. Expressions : bouton **+ Expression** (souffle, rire…).
- Écrire phonétiquement les noms (« Djèngou A.I. », « Klasse deux-trois-sept »).

**Comédien (enregistrement téléphone)** : pièce feutrée, 20 cm, de biais, 2 prises, 3 s de silence avant/après.

---

## D. Brief musique
```
Genre : {afrobeat doux / amapiano / makossa moderne} · BPM : {100–115} · Énergie : {monte au déclic, retombe pour l'émotion, remonte au CTA}
Recherche Pixabay Music : « afrobeat instrumental », « amapiano », « african inspiring », « afro cinematic »
Licence : vérifier la page du morceau (Pixabay : usage commercial et réseaux sociaux autorisés, sans attribution obligatoire — FAQ officielle ; créditer l'artiste reste élégant).
```

---

## E. Textes de publication
- **WhatsApp** : gras `*texte*`, italique `_texte_`, 4–6 lignes, CTA + numéro.
- **Facebook** : texte simple + emojis, 5–8 lignes, 3–6 hashtags.
- **TikTok/Reels** : légende ≤ 150 caractères, 3–5 hashtags, accroche dans la 1re ligne.
- **LinkedIn** : accroche 2 lignes, valeur/apprentissage, pas de lien dans le texte (en 1er commentaire).
