# Capability: Homepage Carousel

## Purpose

Cette capability gère l'affichage d'un carrousel d'œuvres "en vedette" sur la page d'accueil. Le carrousel permet aux visiteurs de découvrir immédiatement quelques œuvres sélectionnées sans naviguer vers la galerie, augmentant ainsi l'engagement initial.

## ADDED Requirements

### R1-MUST-display-featured-artworks

SHALL: Le système doit afficher un carrousel de 3 à 5 œuvres marquées comme "featured" sur la page d'accueil

#### Scenario: Sélection des œuvres featured

**GIVEN** les 9 œuvres mockées dans `data/artworks.ts`
**WHEN** on filtre par `isFeatured: true`
**THEN** exactement 3 à 5 œuvres doivent être retournées

#### Scenario: Affichage du carrousel

**GIVEN** un visiteur charge la page d'accueil
**WHEN** il scroll après le hero section
**THEN** il doit voir le carrousel avec le titre "Œuvres en Vedette" et au moins 1 œuvre visible

---

### R2-MUST-navigate-manually

SHALL: Le système doit permettre la navigation manuelle entre les slides via des boutons précédent/suivant

#### Scenario: Bouton suivant

**GIVEN** le carrousel affiche la première œuvre
**WHEN** le visiteur clique sur le bouton "Suivant"
**THEN** le carrousel doit glisser vers la deuxième œuvre avec une transition fluide (0.5s)

#### Scenario: Bouton précédent

**GIVEN** le carrousel affiche la troisième œuvre
**WHEN** le visiteur clique sur le bouton "Précédent"
**THEN** le carrousel doit revenir à la deuxième œuvre

#### Scenario: Navigation circulaire (loop)

**GIVEN** le carrousel affiche la dernière œuvre
**WHEN** le visiteur clique sur "Suivant"
**THEN** le carrousel doit revenir à la première œuvre (loop infini)

---

### R3-MUST-show-pagination-dots

SHALL: Le système doit afficher des indicateurs de pagination (dots) pour montrer la position actuelle

#### Scenario: Indicateur actif

**GIVEN** le carrousel affiche la deuxième œuvre
**WHEN** le visiteur regarde les dots
**THEN** le deuxième dot doit être mis en évidence (couleur `pastel-lavender`), les autres en gris clair

#### Scenario: Navigation par dots

**GIVEN** le carrousel affiche la première œuvre
**WHEN** le visiteur clique sur le quatrième dot
**THEN** le carrousel doit sauter directement à la quatrième œuvre

---

### R4-MUST-be-responsive

SHALL: Le système doit adapter le nombre de slides visibles selon la taille d'écran : 1 slide mobile, 2-3 slides desktop

#### Scenario: Affichage mobile

**GIVEN** un visiteur sur mobile (< 768px)
**WHEN** il charge le carrousel
**THEN** une seule œuvre doit être visible à la fois, centrée

#### Scenario: Affichage desktop

**GIVEN** un visiteur sur desktop (≥ 1024px)
**WHEN** il charge le carrousel
**THEN** 3 œuvres doivent être visibles simultanément avec gap entre elles

#### Scenario: Affichage tablette

**GIVEN** un visiteur sur tablette (768px - 1023px)
**WHEN** il charge le carrousel
**THEN** 2 œuvres doivent être visibles simultanément

---

### R5-SHOULD-autoplay (optionnel)

SHOULD: Le système peut implémenter un auto-play avec rotation automatique toutes les 5 secondes

#### Scenario: Auto-play activé

**GIVEN** le carrousel est chargé avec auto-play activé
**WHEN** 5 secondes s'écoulent sans interaction
**THEN** le carrousel doit automatiquement passer au slide suivant

#### Scenario: Pause au hover

**GIVEN** le carrousel est en mode auto-play
**WHEN** le visiteur survole le carrousel avec sa souris
**THEN** l'auto-play doit se mettre en pause jusqu'à ce que la souris sorte

---

### R6-MUST-show-artwork-info

SHALL: Le système doit afficher les informations essentielles de chaque œuvre dans le carrousel : image, titre, prix, technique

#### Scenario: Carte œuvre complète

**GIVEN** une œuvre featured dans le carrousel
**WHEN** elle est affichée
**THEN** la carte doit montrer :
- L'image optimisée (Cloudinary + next/image)
- Le titre en évidence
- Le prix formaté en euros
- La technique artistique
- Un bouton "Voir les détails"

---

### R7-MUST-link-to-gallery

SHALL: Le système doit afficher un lien "Voir toute la galerie" sous le carrousel pointant vers /galerie

#### Scenario: CTA vers galerie

**GIVEN** un visiteur consulte le carrousel
**WHEN** il clique sur "Voir toute la galerie"
**THEN** il doit être redirigé vers la page `/galerie` avec toutes les œuvres

---

### R8-MUST-be-accessible

SHALL: Le système doit être accessible avec navigation clavier et attributs ARIA appropriés

#### Scenario: Navigation clavier

**GIVEN** un visiteur utilise le clavier
**WHEN** il appuie sur la flèche droite
**THEN** le carrousel doit passer au slide suivant

#### Scenario: Navigation clavier précédent

**GIVEN** un visiteur utilise le clavier
**WHEN** il appuie sur la flèche gauche
**THEN** le carrousel doit revenir au slide précédent

#### Scenario: Attributs ARIA

**GIVEN** un lecteur d'écran parcourt le carrousel
**WHEN** il atteint les boutons de navigation
**THEN** les boutons doivent avoir des `aria-label` descriptifs (ex: "Slide suivant", "Aller à l'œuvre 3")

---

### R9-MUST-use-pastel-design

SHALL: Le système doit appliquer la palette de couleurs pastel existante au carrousel (boutons, dots, cards)

#### Scenario: Boutons de navigation pastels

**GIVEN** le carrousel est affiché
**WHEN** on inspecte les boutons précédent/suivant
**THEN** ils doivent utiliser les couleurs `pastel-lavender` (background) et `white` (icône)

#### Scenario: Cartes cohérentes

**GIVEN** une carte d'œuvre dans le carrousel
**WHEN** on compare avec la galerie
**THEN** le style doit être identique : `bg-white/70 backdrop-blur-sm rounded-xl`

---

## Related Capabilities

- **navigation** (existant) : Le carrousel utilise la navbar pour être accessible depuis la page d'accueil
- **gallery-data** (existant) : Le carrousel affiche des œuvres filtrées par `isFeatured: true`
- **cloudinary-integration** (nouveau) : Le carrousel utilise les images Cloudinary optimisées

---

## Technical Notes

- Composant React avec `useState` pour gérer l'index actif
- Auto-play implémenté avec `useEffect` + `setInterval` (nettoyé au unmount)
- Transitions CSS : `transition: transform 0.5s ease-in-out`
- Pas de bibliothèque externe (swiper, slick) pour garder le bundle léger
- Champ `isFeatured` ajouté à l'interface `Artwork` (boolean)
- Sélection manuelle des 5 œuvres featured dans `data/artworks.ts`
