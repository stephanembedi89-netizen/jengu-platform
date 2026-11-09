---
name: architecture-info
description: Expert en architecture de l'information et de la navigation d'un site ou d'une application web. Cartographie automatiquement les menus, onglets et écrans de chaque rôle, puis diagnostique la cohérence de la structure : doublons, entrées qui redirigent ailleurs, menus surchargés, titres d'écran différents du menu, vocabulaire incohérent entre rôles, parcours d'entrée trop long, écrans sans titre ou trop chargés. Note ce qui est bien fait, puis propose et applique les corrections d'architecture (pas de contenu). À utiliser quand on demande « l'architecture du site », « la navigation est-elle cohérente », « on se perd dans l'app », « organiser les menus », « revoir la structure », « arborescence », « sitemap ».
license: MIT
metadata:
  author: JenguAI · Klas 237
  version: "1.0"
---

# Architecture de l'information

Une bonne architecture se reconnaît à trois choses : **on sait où l'on est, on sait où aller, on retrouve le même chemin partout.** Ce skill s'occupe de la structure : menus, noms, niveaux, ordre, liens entre écrans. Il ne touche ni aux données ni au contenu pédagogique.

## Déroulé

### 1. Cartographier
1. Lancer le site en local (ex. `python3 -m http.server 8238` dans le dossier du site).
2. Décrire l'entrée de chaque rôle dans un fichier JSON : URL, étapes pour entrer dans l'espace, sélecteurs du menu si besoin. Exemple : `references/klas237.json`. Par défaut, les sélecteurs sont `#nav > button[data-route]` (menu principal), `#nav details button[data-route]` (menu « plus »), `.kx-tabbar button` (onglets) et `#screen h1` (titre). On ouvre une destination avec `openRoute('{route}')`. Tout est modifiable dans `selectors`.
3. Lancer : `node .claude/skills/architecture-info/scripts/carte.js <config.json> <dossier-de-sortie>`.
4. Lire `carte.md` : l'arborescence de chaque rôle (niveau, nom du menu, titre réel de l'écran, nombre d'actions, route et redirection éventuelle), le vocabulaire comparé entre rôles, puis les constats.

### 2. Diagnostiquer
Confronter la carte à `references/principes.md` : organisation, étiquetage, navigation, aide, cohérence de l'en-tête, puis grille de notation par rôle. Le script relève automatiquement :
- **redirection** : une entrée de menu qui ouvre un autre écran (haute) ;
- **écrans en double** : contenus semblables à plus de 72 % (haute si l'un est au menu principal) ;
- **libellé ≠ titre** : le menu et l'écran ne portent pas le même nom ;
- **libellé en double** : deux entrées avec le même nom ;
- **trop d'entrées** : plus de 5 au menu principal, plus de 8 dans le menu « plus », plus de 5 onglets ;
- **écran sans titre** ou **trop chargé** (plus de 30 actions) ;
- **parcours d'entrée** trop long.

Vérifier chaque constat sur l'écran avant de conclure. Un mode qui s'ouvre (mode enfant, plein écran) peut légitimement ne pas avoir de titre, et une liste d'élèves a légitimement beaucoup de boutons. Dans ces cas, le noter comme justifié.

### 3. Rendre compte
Commencer par **ce qui est bien fait**, puis les constats du plus grave au moins grave, puis le plan :
```markdown
## Architecture · <produit>
**Ce qui est bien fait** : …
**Ce qui casse la cohérence** : … (avec la preuve tirée de la carte)
**Corrections** : 1. … 2. …
**Résultat** : constats avant → après, ce qui reste et pourquoi c'est justifié.
```

### 4. Corriger (si demandé)
Privilégier une **couche d'architecture unique**, plutôt que de modifier chaque écran. Dans Klas 237, c'est `klas-arch.js` :
- liste des écrans masqués par rôle (doublons et anciennes pages) ;
- dictionnaire des noms communs à tous les rôles ;
- titres d'écran alignés sur le menu, l'ancienne accroche passant en sous-titre ;
- même rangement appliqué au menu affiché, même quand d'anciens modules le reconstruisent.

Ne jamais supprimer de données : un écran masqué reste accessible s'il est appelé directement. Relancer la carte avec le même fichier, puis comparer le nombre de constats avant et après.

## Garde-fous
- Ne pas renommer ce que les utilisateurs connaissent déjà bien sans raison (ex. les noms officiels : CEP, BEPC, séquence).
- Garder le même ordre entre le menu de l'ordinateur et les onglets du téléphone.
- Toute suppression d'entrée est vérifiée : l'écran remplaçant fait bien la même chose.
