# Assistant IA Klas 237 · « Le relais »

L'assistant aide quand quelqu'un bloque, sans faire le travail à la place de l'enfant ni remplacer l'enseignant.

## Ce qu'il fait, par rôle

| Rôle | Demandes proposées | Ce qu'il renvoie |
|---|---|---|
| Parent | Comprendre la notion · Une autre façon · Plus d'exemples | L'idée en mots simples, 2 à 3 autres façons de l'expliquer (marché, FCFA, objets de la maison, pas à pas), exemples résolus, exercices à faire ensemble avec la réponse, conseils pour accompagner, question de vérification |
| Élève (collège, lycée) | Un indice, pas la réponse | La règle utile, la première étape, un exemple différent résolu, son exercice reformulé à faire seul, comment vérifier |
| Enseignant · Préparer | Préparer un cours · Situation-problème · Exercices différenciés | Déroulé APC avec durées et trace écrite ; situation de vie contextualisée avec grille de critères ; exercices en 3 niveaux avec corrigé |
| Enseignant · Évaluer | Créer une épreuve · Corriger une copie (photo) · Analyser les résultats | Épreuve avec barème, corrigé et **version B** contre la copie ; **points proposés par question** et appréciation, que l'enseignant valide ; diagnostic et **groupes de besoin** à partir des notes |
| Enseignant · Suivre | Appréciations du bulletin · Suivre un élève · Reprendre une notion | **Appréciations de toute la classe** à partir des moyennes, évolutions, absences et observations, enregistrées dans le bulletin en un clic ; plan d'accompagnement sur 3 semaines et message à la famille ; séance de remédiation |
| Enseignant · Gérer | Cahier de textes · rapport · Gérer ma classe · Rédiger un message | Cahier de textes de la semaine, compte rendu pour la direction ou le conseil de classe ; plan d'action pour une classe nombreuse ; message prêt pour WhatsApp |
| Accompagnateur | Préparer une séance · Comprendre la notion · Une autre façon · Rédiger un bilan | Séance de 45 à 60 min, explications alternatives, exercices, bilan pour les parents |

On peut demander de quatre façons :
- **écrire** la question ;
- **dicter** (bouton micro, reconnaissance vocale du navigateur, en français ou en anglais) ;
- **photographier le cahier** : l'assistant lit l'exercice ou l'écriture ;
- **écrire à la main** sur une ardoise à l'écran, au doigt ou au stylet.

Chaque carte de réponse peut être **écoutée à voix haute**. Les boutons « Plus simple », « Autres exemples » et « Un autre indice » relancent la question. Chez l'enseignant, « En faire ma préparation » remplit l'écran « Préparer un cours ».

Points d'entrée :
- le bouton **Assistant**, toujours visible en bas à droite ;
- le bouton en tête de chaque écran (« Préparer avec l'IA », « Demander à l'assistant ») ;
- « Ça bloque ? Demandez à l'assistant » dans le rituel du soir ;
- les anciennes cartes « Préparer une aide avec l'IA ».

## Architecture

```
Navigateur (klas-ai.js)                Supabase                        Claude API
 texte / voix / photo / dessin  ──►  fonction klas-ai  ──────────────►  claude-opus-5-5
 réponse en cartes             ◄──   session vérifiée, quota,  ◄──────  réponse JSON structurée
                                     clé API secrète (jamais côté navigateur)
```

- `klas-ai.js` + styles dans `klas-ds.css` : l'interface. Sans service actif, elle répond avec des **exemples de démonstration** signalés comme tels.
- Les outils enseignant reçoivent les données de la classe **anonymisées** : chaque élève devient E1, E2… avant l'envoi, et les vrais prénoms ne sont remis qu'à l'écran, dans le navigateur.
- `supabase/functions/klas-ai/index.ts` : vérifie la session et l'e-mail confirmé, applique un quota quotidien par rôle (parent 30, élève 20, enseignant 80, accompagnateur 60), construit la demande et appelle Claude.
  - Format de réponse imposé par un schéma JSON ; le cadre pédagogique est mis en cache.
  - Modèle par défaut : **Claude Haiku 5.5**, le moins cher. On peut passer à un modèle plus fin (`supabase secrets set KLAS_AI_MODEL=claude-opus-5-5`) sans toucher au code ; le repli automatique en cas de refus est alors activé.
  - Effort de réflexion « medium », « high » pour une séance complète ou une remédiation.
- `supabase/migrations/20261109_klas_ai_usage.sql` : table de comptage (utilisateur, jour, nombre). **Aucune question ni réponse n'est enregistrée.**

## Mise en service (environ 20 minutes)

1. Créer une clé API sur console.anthropic.com (compte JenguAI), avec une limite de dépenses mensuelle.
2. Appliquer la migration sur le projet Supabase `klas-237` :
   ```bash
   supabase db push
   ```
3. Enregistrer la clé comme secret de fonction (jamais dans le code ni dans `config.js`) :
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=...
   ```
4. Déployer la fonction :
   ```bash
   supabase functions deploy klas-ai
   ```
   Optionnel : `supabase secrets set KLAS_AI_ORIGINS=https://klas237.netlify.app,https://www.klas237.cm` si un autre domaine sert le site.
5. Dans `config.js`, passer `aiEnabled: true`.
6. Déployer le site avec le nouveau `_headers`. Il autorise micro et caméra pour le site lui-même, et les aperçus d'images `blob:`.
7. Tester avec un compte pilote : une question écrite, une photo, une dictée, sur un téléphone Android.

## Coût indicatif

Modèle par défaut : Claude Haiku 5.5, à 0,10 $ par million de jetons en entrée et 0,50 $ en sortie.

| Usage | Jetons (environ) | Coût |
|---|---|---|
| Une question de parent avec photo | 4 000 en entrée, 3 000 en sortie | ≈ 0,002 $, soit à peu près **1 à 2 FCFA** |
| Appréciations de 60 élèves | 7 000 en entrée, 6 000 en sortie | ≈ 0,004 $, soit à peu près **2 à 3 FCFA** |
| Un enseignant très actif (10 demandes par jour) | – | à peu près **400 à 600 FCFA par mois** |

Ces chiffres sont à relever sur vos propres factures. Avec Claude Opus 5.5 (4 $ et 20 $ par million de jetons), compter environ 40 fois plus. Avant le lancement, comparez les deux modèles sur une trentaine de vraies demandes, surtout pour la correction de copies et la lecture d'écriture manuscrite.

## Sécurité et confiance

- La clé reste sur le serveur. Le navigateur ne connaît que l'adresse de la fonction.
- Seuls les comptes connectés avec un e-mail confirmé peuvent interroger l'assistant, dans la limite du quota.
- Le cadre pédagogique interdit de donner la réponse finale à l'élève, de juger ou de diagnostiquer un enfant, et d'inventer un programme ou une date. Les incertitudes s'affichent dans un encadré « prudence ».
- Le texte lu dans une photo est traité comme une donnée, jamais comme une instruction.
- L'interface rappelle de ne mettre ni nom complet ni numéro, et que la photo ne doit montrer que l'exercice.
- **Dictée** : sur Chrome, la reconnaissance vocale passe par les serveurs de Google. À mentionner dans la politique de confidentialité (`legal.html`), avec la transmission des questions et des photos à Anthropic pour générer la réponse.
- **Mineurs** : l'élève n'utilise l'assistant que depuis un compte tenu par un adulte, conformément aux conditions d'utilisation actuelles.

## Avant le lancement commercial

- Constituer une série de 30 à 50 vraies questions par rôle et relire les réponses avec 2 enseignants (primaire, secondaire) : exactitude, ton, respect de la méthode du cahier.
- Mettre à jour `legal.html` (traitement par un sous-traitant IA, dictée).
- Suivre chaque mois le coût par utilisateur actif et le taux de « Plus simple » (signal d'explication pas assez claire).
