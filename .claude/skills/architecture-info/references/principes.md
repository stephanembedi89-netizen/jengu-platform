# Principes d'architecture de l'information

Sources de référence : Rosenfeld, Morville et Arango, *Information Architecture* (les quatre systèmes : organisation, étiquetage, navigation, recherche) ; Abby Covert, *How to Make Sense of Any Mess* ; recommandations de navigation Material Design et Apple Human Interface Guidelines ; heuristiques de Nielsen (cohérence, reconnaissance plutôt que mémoire, contrôle).

## 1. Organisation : la structure
- **Organiser par tâche de l'utilisateur**, pas par module technique ou par historique du code.
- **Un concept = un endroit.** Deux écrans qui font la même chose doivent être fusionnés ; l'ancien disparaît du menu.
- **Deux niveaux au plus** : un menu principal, et un menu « plus » classé par usage. Au-delà, l'utilisateur se perd.
- **Le premier écran est un tableau de bord d'action** : ce qu'il faut faire maintenant, dans l'ordre.
- **Même squelette pour tous les rôles** : aujourd'hui → le travail → le suivi → la communication. Seul le contenu change.

## 2. Étiquetage : les mots
- **Le titre de l'écran reprend le nom du menu** (« vous êtes ici »). Une phrase d'accroche peut suivre, en sous-titre.
- **Un même concept garde le même nom d'un rôle à l'autre** ; seul le pronom change (Ses progrès / Mes progrès).
- **Des mots du quotidien de l'utilisateur** (cahier, contrôle, séquence, bulletin), jamais des noms de modules.
- **Pas deux entrées avec le même nom**, pas de nom générique (« Outils », « Divers ») pour une destination précise.
- **Des étiquettes courtes** : 1 à 3 mots dans le menu, 1 mot sous une icône d'onglet.

## 3. Navigation : se déplacer
- **Mobile : 3 à 5 onglets en bas**, à portée de pouce, pour les tâches quotidiennes. Le reste va dans un menu secondaire.
- **Ordinateur : menu latéral** de 5 entrées principales au plus, avec le même ordre que les onglets mobiles.
- **Une entrée de menu mène là où elle le dit.** Jamais de redirection silencieuse vers un autre écran.
- **L'état actif est visible** (couleur, indicateur) sur le menu comme sur l'onglet.
- **Toujours une sortie** : retour aux espaces, fermeture d'un panneau avec Échap ou une croix.
- **Le chemin d'entrée est court** : 3 à 4 gestes au plus entre l'accueil et le premier écran utile.
- **Les actions d'un écran sont hiérarchisées** : une action principale bien visible, les autres en second plan.

## 4. Recherche et aide
- Une aide contextuelle là où l'on bloque, plutôt qu'une page d'aide séparée.
- Un assistant ou une recherche accessible partout, au même endroit.

## 5. Cohérence visuelle de la structure
- Même en-tête sur tous les écrans d'un espace : identité (rôle, profil), statut (démo, sauvegarde), puis titre.
- Même place pour les mêmes choses : actions de l'écran en haut à droite, retour en haut à gauche, aide en bas à droite.
- Les bandeaux hérités, les doublons d'information et les messages répétés sont supprimés.

## Grille de notation (par rôle)
| Critère | Bien | À améliorer |
|---|---|---|
| Entrées principales | 3 à 5, ordonnées par fréquence d'usage | plus de 5, ou ordre arbitraire |
| Menu « plus » | 8 éléments au plus, classés par usage | liste plate, doublons, anciennes pages |
| Libellé ↔ titre | identiques ou évidents | titre poétique ou différent |
| Doublons | aucun | deux entrées pour le même écran |
| Vocabulaire entre rôles | même nom pour un même concept | synonymes |
| Entrée | 4 gestes au plus | plus de 4 |
