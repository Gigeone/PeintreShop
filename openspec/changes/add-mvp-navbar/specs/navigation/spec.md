# Capability: Navigation

## Purpose
Permettre aux visiteurs de naviguer facilement entre les différentes pages du site grâce à une navbar responsive et accessible.

## ADDED Requirements

### Requirement: Display logo and navigation menu
Le système DOIT afficher un logo texte "MNGH" à gauche et un menu de navigation permettant d'accéder aux pages principales du site (Accueil, Galerie, À propos, Contact).

#### Scenario: Desktop navigation display
- **WHEN** un utilisateur visite le site sur desktop (largeur >= 768px)
- **THEN** la navbar affiche le logo "MNGH" à gauche et les 4 liens de navigation horizontalement à droite
- **AND** tous les liens sont visibles simultanément sans menu déroulant

#### Scenario: Mobile navigation display
- **WHEN** un utilisateur visite le site sur mobile (largeur < 768px)
- **THEN** la navbar affiche le logo "MNGH" à gauche et un icône hamburger à droite
- **AND** les liens de navigation sont cachés par défaut

#### Scenario: Logo links to homepage
- **WHEN** un utilisateur clique sur le logo "MNGH"
- **THEN** il est redirigé vers la page d'accueil (/)
- **AND** la navigation s'effectue en mode SPA (sans rechargement)

### Requirement: Mobile menu interaction
Le système DOIT permettre aux utilisateurs mobiles d'ouvrir et fermer le menu de navigation via un bouton hamburger.

#### Scenario: Open mobile menu
- **WHEN** un utilisateur sur mobile clique sur l'icône hamburger
- **THEN** le menu de navigation s'affiche en overlay ou slide depuis le haut/côté
- **AND** l'icône hamburger se transforme en icône de fermeture (croix)

#### Scenario: Close mobile menu
- **WHEN** le menu mobile est ouvert
- **AND** l'utilisateur clique sur l'icône de fermeture (croix)
- **THEN** le menu de navigation se ferme
- **AND** l'icône de fermeture redevient un hamburger

#### Scenario: Close mobile menu on navigation
- **WHEN** le menu mobile est ouvert
- **AND** l'utilisateur clique sur un lien de navigation
- **THEN** le menu se ferme automatiquement
- **AND** la navigation vers la page sélectionnée s'effectue

### Requirement: Active page indication
Le système DOIT indiquer visuellement quelle est la page actuellement active dans la navbar.

#### Scenario: Active link styling on current page
- **WHEN** un utilisateur est sur la page "Galerie"
- **THEN** le lien "Galerie" dans la navbar est stylé différemment (ex: police en gras, couleur différente, ou bordure)
- **AND** les autres liens (Accueil, À propos, Contact) utilisent le style par défaut

#### Scenario: Active state updates on navigation
- **WHEN** un utilisateur navigue de "Accueil" vers "À propos"
- **THEN** le lien "À propos" devient actif (style différencié)
- **AND** le lien "Accueil" repasse au style par défaut

### Requirement: Client-side navigation
Le système DOIT utiliser la navigation client-side (SPA) sans rechargement complet de la page.

#### Scenario: Navigate without full page reload
- **WHEN** un utilisateur clique sur un lien de la navbar
- **THEN** la navigation s'effectue sans rechargement complet de la page
- **AND** le contenu de la page change instantanément (navigation SPA)
- **AND** l'URL du navigateur est mise à jour

### Requirement: Responsive layout integration
Le système DOIT intégrer la navbar dans un layout global qui s'applique à toutes les pages du site.

#### Scenario: Navbar present on all pages
- **WHEN** un utilisateur visite n'importe quelle page du site (Accueil, Galerie, À propos, Contact)
- **THEN** la navbar est présente et identique en haut de la page
- **AND** le contenu de la page s'affiche sous la navbar

#### Scenario: Responsive breakpoint behavior
- **WHEN** un utilisateur redimensionne la fenêtre du navigateur
- **AND** la largeur passe de desktop (>= 768px) à mobile (< 768px) ou inversement
- **THEN** la navbar s'adapte automatiquement au format approprié (menu horizontal ou hamburger)

### Requirement: Sticky navbar positioning
Le système DOIT maintenir la navbar visible en haut de la page lors du scroll.

#### Scenario: Navbar stays visible on scroll
- **WHEN** un utilisateur scroll vers le bas sur n'importe quelle page
- **THEN** la navbar reste fixe en haut de la fenêtre du navigateur
- **AND** le contenu de la page défile sous la navbar

#### Scenario: Navbar z-index above content
- **WHEN** la page contient d'autres éléments (images, texte, etc.)
- **THEN** la navbar reste toujours au-dessus du contenu lors du scroll
- **AND** aucun élément ne recouvre la navbar

### Requirement: Pastel color styling
Le système DOIT utiliser une palette de couleurs pastels pour la navbar.

#### Scenario: Pastel background color
- **WHEN** un utilisateur visite n'importe quelle page
- **THEN** la navbar affiche un fond de couleur pastel (rose pâle ou bleu pâle)
- **AND** le fond est cohérent sur toutes les pages

#### Scenario: Pastel text and interactive colors
- **WHEN** un utilisateur interagit avec les liens de la navbar
- **THEN** les couleurs de texte, hover et active utilisent des teintes pastels (lavande, rose-mauve)
- **AND** le logo "MNGH" utilise une couleur pastel (bleu ou violet pâle)

### Requirement: Accessibility basics
Le système DOIT fournir des bases d'accessibilité pour la navigation clavier et les lecteurs d'écran.

#### Scenario: Keyboard navigation support
- **WHEN** un utilisateur navigue avec le clavier (touche Tab)
- **THEN** tous les liens de la navbar (logo + navigation) sont accessibles et focusables
- **AND** un indicateur visuel de focus est présent (outline ou autre)

#### Scenario: Screen reader labels
- **WHEN** un utilisateur utilise un lecteur d'écran
- **THEN** le bouton hamburger mobile a un aria-label descriptif (ex: "Ouvrir le menu")
- **AND** les liens de navigation ont des labels clairs pour les lecteurs d'écran
