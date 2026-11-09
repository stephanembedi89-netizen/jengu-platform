# Grille de revue experte

À parcourir écran par écran, avec les captures produites par `scripts/audit.js`.
Chaque constat garde : l'écran, ce qu'on voit, pourquoi c'est un problème pour qui, la correction.

## 1. Les 10 heuristiques d'utilisabilité (Nielsen, adaptées)
1. **État du système visible** : l'utilisateur sait-il où il est, ce qui est enregistré, ce qui charge ? (statut de sauvegarde, onglet actif, progression)
2. **Langage de l'utilisateur** : des mots du quotidien (« cahier », « contrôle », « séquence »), pas du jargon technique ou interne.
3. **Contrôle et liberté** : retour arrière, annuler, confirmer une suppression, sortir d'un parcours sans perdre ses saisies.
4. **Cohérence** : un même geste = une même couleur, une même place, un même mot, d'un écran et d'un rôle à l'autre.
5. **Prévention des erreurs** : valeurs par défaut sensées, formats guidés (dates, notes sur 20), champs requis signalés avant l'envoi.
6. **Reconnaître plutôt que se souvenir** : listes déroulantes, suggestions, dernières valeurs reprises.
7. **Efficacité** : raccourcis pour les gestes répétés (saisie au clavier, actions en lot, appel en touchant les absents).
8. **Sobriété** : une action principale par écran ; supprimer les bandeaux, doublons et textes qui ne servent pas la tâche.
9. **Erreurs compréhensibles** : dire ce qui s'est passé et comment corriger, sans code technique ni excuse vague.
10. **Aide en contexte** : l'aide arrive au moment où on bloque, pas dans une page à part.

## 2. Produit d'apprentissage (EdTech)
- Le produit **accompagne** sans faire à la place : indice avant la réponse, essai de l'élève, vérification par l'adulte.
- Chaque rôle (parent, élève, enseignant, accompagnateur) voit **sa** prochaine action en moins de 5 secondes.
- Les progrès sont **visibles et honnêtes** : aucune note, aucun pourcentage inventé ; les démonstrations sont signalées.
- La motivation repose sur la **régularité** (séries, petites victoires), jamais sur le classement public entre élèves.
- L'intensité visuelle suit l'âge : ludique au primaire, sobre au lycée et chez les adultes.
- Données de mineurs : minimum collecté, pas de photo ni nom complet exigés, partage seulement par invitation.

## 3. Contexte local (Afrique centrale, Cameroun)
- **Réseau** : premier écran utile en moins de 5 s en 3G lente ; poids total sous 1,5 Mo ; peu de requêtes ; fonctionne après une coupure.
- **Appareils** : Android d'entrée de gamme, écran de 360 à 390 px, souvent partagé par la famille.
- **Langues** : français et anglais complets ; aucune chaîne oubliée dans une seule langue.
- **Canaux** : WhatsApp pour les messages, Mobile Money (Orange, MTN) pour payer, montants en FCFA.
- **Système scolaire** : bons intitulés (SIL → CM2, 6e → Terminale, séries, séquences, compositions, CEP, BEPC, Probatoire, Bac).

## 4. Prêt à vendre
- La promesse dit **quel problème est résolu, pour qui**, dès le premier écran.
- Essai ou démonstration accessibles **sans compte**, depuis l'en-tête comme depuis le corps de page, sur mobile aussi.
- Prix clairs, en FCFA, avec ce qui est inclus et ce qui est seulement prévu.
- Mentions légales, confidentialité, contact visibles ; aucun faux témoignage, aucune statistique non sourcée.
- Le parcours d'inscription se termine par un message clair sur l'étape suivante (confirmation d'e-mail).

## 5. Accessibilité (compléments manuels à axe-core)
- Navigation complète au clavier, ordre de tabulation logique, focus toujours visible.
- Un seul titre principal par écran, hiérarchie sans saut de niveau.
- Contraste 4,5:1 pour le texte, 3:1 pour les grands textes et les icônes utiles.
- Cibles tactiles de 44 px minimum (sauf liens au fil du texte).
- Animations coupées si « réduire les animations » est activé ; rien ne clignote plus de 3 fois par seconde.
- Texte agrandi à 200 % sans perte de contenu ni défilement horizontal.
