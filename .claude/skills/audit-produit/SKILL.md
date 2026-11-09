---
name: audit-produit
description: Audit complet d'un site ou d'une application web pour trouver ses défauts et ce qu'il faut corriger, avec preuves et priorités. Teste de vrais parcours utilisateur dans un navigateur (mobile et ordinateur), mesure accessibilité (axe-core, WCAG 2.2), erreurs, cibles tactiles, débordements, poids et vitesse en 3G, puis ajoute une revue experte (utilisabilité, produit d'apprentissage, contexte camerounais, prêt à vendre). À utiliser quand on demande « audite le site », « qu'est-ce qui ne va pas », « trouve les défauts », « que peut-on corriger », « revue UX », « est-ce prêt à commercialiser », ou avant une mise en ligne.
license: MIT
metadata:
  author: JenguAI · Klas 237
  version: "1.0"
  builds-on: web-quality-audit, accessibility, performance, core-web-vitals, seo, best-practices (addyosmani/web-quality-skills, MIT) et Web Interface Guidelines (vercel-labs)
---

# Audit produit

Un audit utile répond à trois questions : **qu'est-ce qui empêche les gens d'arriver au bout ?**, **qu'est-ce qui les fait douter ?**, **qu'est-ce qui coûte du temps, des données ou de l'argent ?** Chaque constat s'appuie sur une preuve (mesure, capture, ligne de code) et finit par une correction concrète.

## Déroulé

### 1. Cadrer (2 minutes)
- Cible : URL ou dossier du code ; comment lancer le site en local (ex. `python3 -m http.server 8238` dans le dossier du site).
- Publics et **parcours clés** : pour chaque rôle, les 3 à 6 écrans qu'il utilise le plus.
- Appareils : téléphone 390 px et ordinateur 1440 px au minimum.
- Ce qui est hors champ (paiement réel, comptes réels, back-office…).

### 2. Mesurer automatiquement
1. Écrire un fichier de parcours JSON (modèle : `references/config-exemple.json` ; exemple complet : `references/klas237.json`). Étapes possibles : `click`, `fill` + `value`, `select` + `value`, `press`, `eval`, et `check` (nom d'écran) pour capturer et contrôler l'écran courant.
2. Installer la dépendance une fois : `npm i --prefix .claude/skills/audit-produit/scripts axe-core`. Playwright et Chromium doivent être disponibles.
3. Lancer : `node .claude/skills/audit-produit/scripts/audit.js <parcours.json> <dossier-de-sortie>`.
4. Lire `mesures.md`. Le script relève :
   - étapes de parcours impossibles (bouton absent, masqué, introuvable) : **critique** ;
   - erreurs JavaScript, erreurs console, requêtes en échec ;
   - accessibilité axe-core (WCAG 2.0 à 2.2 AA + bonnes pratiques) ;
   - cibles tactiles < 44 px, textes < 12 px, images cassées, défilement horizontal, éléments fixes envahissants, nombre de titres H1 ;
   - chargement de l'accueil en réseau normal et en **3G lente** (poids, requêtes, temps).
5. Une étape impossible peut venir du parcours JSON (mauvais sélecteur) **ou** d'un vrai défaut (bouton caché sur mobile). Vérifier sur la capture avant de conclure.

### 3. Revue experte
Ouvrir les captures (`captures/`) et parcourir `references/grille-experte.md` : heuristiques d'utilisabilité, produit d'apprentissage, contexte local, prêt à vendre, compléments d'accessibilité manuels. Pour approfondir un domaine, appliquer le skill dédié :
- performance et Core Web Vitals : `performance`, `core-web-vitals` ;
- accessibilité détaillée : `accessibility` ;
- référencement : `seo` ;
- sécurité et standards : `best-practices` ;
- revue globale « Lighthouse » : `web-quality-audit` ;
- règles d'interface Vercel : récupérer https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md si le réseau le permet, et l'appliquer aux fichiers d'interface.

Rester factuel : ce qui est mesuré est marqué « mesuré », ce qui est déduit du code est marqué « à confirmer ».

### 4. Prioriser
| Niveau | Définition | Exemple |
|---|---|---|
| Critique | Bloque un parcours, perd des données, faille de sécurité | Bouton d'inscription invisible sur mobile |
| Haute | Gêne forte ou exclut une partie du public | Contraste illisible, cibles tactiles trop petites |
| Moyenne | Ralentit, fait douter, incohérence visible | Bandeaux en double, 68 requêtes au chargement |
| Basse | Finition | Titre de colonne vide |

Classer ensuite par **impact ÷ effort** : d'abord ce qui est grave et rapide.

### 5. Corriger et vérifier (si demandé)
Corriger par lots cohérents, relancer **le même** fichier de parcours, comparer le nombre de constats avant/après et le dire franchement (ce qui reste, ce qui n'a pas pu être vérifié).

## Format du rapport
```markdown
## Audit · <produit> · <date>
**Verdict** : 3 phrases (ce qui marche, ce qui bloque, la priorité n° 1).

### Mesures
Tableau chargement (normal / 3G), nombre d'écrans testés, constats par niveau.

### Constats (du plus grave au moins grave)
#### [Critique] Titre court
- Où : écran(s), appareil(s) · capture
- Preuve : mesure / observation / `fichier:ligne`
- Pourquoi c'est grave : qui est gêné, comment
- Correction : changement précis

### Plan de correction
1. … (impact, effort)

### Vérification
Avant / après, ce qui reste à tester sur de vrais appareils ou avec de vrais utilisateurs.
```

## Garde-fous
- Ne jamais inventer un chiffre, un score ou un retour d'utilisateur.
- Ne pas confondre score automatique et qualité : axe-core trouve environ un tiers des problèmes d'accessibilité ; le reste est manuel.
- Tester en données de démonstration ; ne jamais saisir de vraies données personnelles.
- Ne pas déployer ni envoyer de message réel pendant un audit.
