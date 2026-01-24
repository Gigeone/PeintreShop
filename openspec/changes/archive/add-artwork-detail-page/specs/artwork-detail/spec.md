# Spécification : Page Détail d'Œuvre

## Purpose

Permettre aux visiteurs de consulter les informations détaillées d'une œuvre d'art et d'initier un contact pour l'achat. Cette fonctionnalité complète le parcours utilisateur en offrant une page dédiée pour chaque œuvre accessible depuis la galerie.

## Scenarios

### Scénario 1 : Consultation d'une œuvre disponible
**Acteur** : Visiteur intéressé par une œuvre

**Flux nominal** :
1. Le visiteur clique sur "Voir les détails" depuis la galerie
2. La page `/oeuvres/[slug]` se charge avec toutes les informations de l'œuvre
3. Le visiteur consulte l'image en grand format, la description, les dimensions et le prix
4. Le visiteur clique sur "Acheter cette œuvre"
5. Le visiteur est redirigé vers la page `/contact`

**Résultat attendu** : Le visiteur peut accéder à toutes les informations et contacter l'artiste pour acheter

---

### Scénario 2 : Consultation d'une œuvre vendue
**Acteur** : Visiteur consultant le portfolio

**Flux nominal** :
1. Le visiteur accède à la page détail d'une œuvre marquée comme vendue
2. La page affiche un badge "Vendu" bien visible
3. Le bouton "Acheter cette œuvre" est désactivé ou remplacé par "Œuvre vendue"
4. Le visiteur peut toujours consulter les informations (prix d'origine, dimensions, description)

**Résultat attendu** : Le visiteur comprend clairement que l'œuvre n'est plus disponible

---

### Scénario 3 : Navigation entre œuvres
**Acteur** : Visiteur explorant le catalogue

**Flux nominal** :
1. Le visiteur consulte la page détail d'une œuvre
2. Le visiteur clique sur "Œuvre suivante" en bas de page
3. La page de l'œuvre suivante se charge
4. Le visiteur continue la navigation ou clique sur "Œuvre précédente"
5. Le visiteur peut revenir à la galerie via "← Retour à la galerie"

**Résultat attendu** : Navigation fluide entre les œuvres sans repasser par la galerie

---

### Scénario 4 : Accès direct via URL
**Acteur** : Visiteur ayant un lien partagé

**Flux nominal** :
1. Le visiteur accède directement à `/oeuvres/jardin-secret` via un lien partagé
2. La page se charge avec les bonnes informations de l'œuvre
3. Les métadonnées Open Graph affichent un aperçu correct (titre, description, image)

**Résultat attendu** : Le lien partagé affiche un bel aperçu et la page se charge correctement

---

### Scénario 5 : Accès à un slug invalide
**Acteur** : Visiteur avec URL incorrecte

**Flux nominal** :
1. Le visiteur accède à `/oeuvres/oeuvre-inexistante`
2. Le système ne trouve pas d'œuvre correspondante
3. Une page 404 appropriée s'affiche
4. Le visiteur peut retourner à la galerie ou à l'accueil

**Résultat attendu** : Erreur 404 gracieuse avec navigation de secours

---

## ADDED Requirements

### R1-MUST-display-artwork-details
**SHALL** : Le système doit afficher toutes les informations de l'œuvre sélectionnée sur une page dédiée accessible via `/oeuvres/[slug]`

**Capabilities** :
- Affichage de l'image en grand format (optimisée avec next/image)
- Affichage du titre de l'œuvre
- Affichage de la description complète
- Affichage de la technique utilisée
- Affichage des dimensions (hauteur × largeur en cm)
- Affichage du prix en euros avec formatage français
- Affichage du statut de disponibilité (badge "Disponible" ou "Vendu")

**Relates to** : `R2-MUST-enable-purchase-contact`

#### Scenario: Affichage complet des informations

**Given** : Un visiteur accède à `/oeuvres/jardin-secret`

**When** : La page se charge

**Then** :
- L'image de l'œuvre "Jardin Secret" s'affiche en grand format
- Le titre "Jardin Secret" est visible en heading principal
- La description complète est affichée
- La technique "Acrylique sur toile" est visible
- Les dimensions "60 × 80 cm" sont affichées
- Le prix "480 €" est formaté correctement
- Le badge "Disponible" est affiché (ou "Vendu" si `isAvailable: false`)

---

### R2-MUST-enable-purchase-contact
**SHALL** : Le système doit permettre à un visiteur d'initier un contact pour acheter une œuvre disponible

**Capabilities** :
- Bouton "Acheter cette œuvre" visible et fonctionnel pour les œuvres disponibles
- Redirection vers la page `/contact` au clic
- État désactivé ou texte alternatif pour les œuvres vendues

**Relates to** : `R1-MUST-display-artwork-details`

#### Scenario: Contact pour achat d'œuvre disponible

**Given** : Un visiteur consulte la page `/oeuvres/jardin-secret` (œuvre disponible)

**When** : Le visiteur clique sur le bouton "Acheter cette œuvre"

**Then** :
- Le visiteur est redirigé vers `/contact`
- La navigation utilise `next/link` pour une transition optimisée

#### Scenario: Œuvre non disponible

**Given** : Un visiteur consulte la page `/oeuvres/reflets-d-automne` (œuvre vendue)

**When** : La page se charge

**Then** :
- Le bouton "Acheter cette œuvre" est désactivé OU remplacé par "Œuvre vendue"
- Un badge "Vendu" est clairement visible
- Le visiteur comprend que l'œuvre n'est pas achetable

---

### R3-MUST-provide-navigation
**SHALL** : Le système doit fournir une navigation intuitive permettant de revenir à la galerie et de parcourir les œuvres

**Capabilities** :
- Bouton "← Retour à la galerie" redirigeant vers `/galerie`
- Boutons "Œuvre précédente" et "Œuvre suivante"
- Navigation circulaire (dernière œuvre → première œuvre et vice-versa)
- Utilisation de `next/link` pour optimisation des performances

**Relates to** : `R1-MUST-display-artwork-details`

#### Scenario: Retour à la galerie

**Given** : Un visiteur consulte la page `/oeuvres/jardin-secret`

**When** : Le visiteur clique sur "← Retour à la galerie"

**Then** :
- Le visiteur est redirigé vers `/galerie`
- La transition est fluide (utilise `next/link`)

#### Scenario: Navigation vers l'œuvre suivante

**Given** : Un visiteur consulte la page `/oeuvres/jardin-secret` (œuvre #2 dans le tableau)

**When** : Le visiteur clique sur "Œuvre suivante"

**Then** :
- Le visiteur accède à la page de l'œuvre #3 (`/oeuvres/reflets-d-automne`)
- L'URL change et la page se charge

#### Scenario: Navigation circulaire (dernière vers première)

**Given** : Un visiteur consulte la page de la dernière œuvre `/oeuvres/prairie-en-fleurs` (œuvre #9)

**When** : Le visiteur clique sur "Œuvre suivante"

**Then** :
- Le visiteur accède à la première œuvre `/oeuvres/lever-de-soleil-mediterraneen`
- La navigation boucle correctement

---

### R4-MUST-be-responsive
**SHALL** : Le système doit afficher la page détail de manière optimale sur tous les appareils (mobile, tablette, desktop)

**Capabilities** :
- Layout 2 colonnes sur desktop (≥1024px) : image à gauche (60%), infos à droite (40%)
- Layout vertical sur mobile (<1024px) : image en haut, infos en dessous
- Images optimisées pour chaque breakpoint avec `next/image`
- Boutons et textes lisibles sur toutes les tailles d'écran

#### Scenario: Affichage desktop

**Given** : Un visiteur accède à la page sur un écran ≥1024px de largeur

**When** : La page se charge

**Then** :
- Le layout affiche 2 colonnes côte à côte
- L'image occupe 60% de la largeur
- Les informations occupent 40% de la largeur
- Tous les éléments sont bien alignés

#### Scenario: Affichage mobile

**Given** : Un visiteur accède à la page sur un écran <1024px de largeur

**When** : La page se charge

**Then** :
- Le layout est vertical (une colonne)
- L'image s'affiche en pleine largeur en haut
- Les informations s'affichent en dessous
- Le texte est lisible sans zoom
- Les boutons sont accessibles au doigt

---

### R5-MUST-generate-seo-metadata
**SHALL** : Le système doit générer des métadonnées SEO dynamiques pour chaque page d'œuvre

**Capabilities** :
- Titre de page unique : `{artwork.title} - MNGH`
- Meta description dynamique basée sur `artwork.description`
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card metadata
- URL canonique

**Relates to** : `R1-MUST-display-artwork-details`

#### Scenario: Métadonnées pour partage social

**Given** : La page `/oeuvres/jardin-secret` est chargée

**When** : Un robot de réseau social (Facebook, Twitter) scrappe la page

**Then** :
- `og:title` contient "Jardin Secret - MNGH"
- `og:description` contient la description de l'œuvre
- `og:image` contient l'URL de l'image de l'œuvre
- L'aperçu du lien affiche correctement titre, description et image

---

### R6-MUST-handle-invalid-slug
**SHALL** : Le système doit gérer gracieusement les accès à des slugs invalides ou inexistants

**Capabilities** :
- Retourner une page 404 si le slug ne correspond à aucune œuvre
- Afficher un message d'erreur clair
- Fournir des liens de navigation (retour galerie, accueil)

#### Scenario: Accès à un slug inexistant

**Given** : Un visiteur accède à `/oeuvres/oeuvre-inexistante`

**When** : Le système cherche l'œuvre correspondante

**Then** :
- Aucune œuvre n'est trouvée
- Une page 404 Next.js s'affiche
- Le visiteur peut naviguer vers la galerie ou l'accueil

---

### R7-MUST-update-gallery-links
**SHALL** : Le système doit mettre à jour les liens de la galerie pour rediriger vers les pages détail

**Capabilities** :
- Transformer les boutons "Voir les détails" en liens `<Link href="/oeuvres/{slug}">`
- Conserver le style visuel existant
- Utiliser le composant Button réutilisable

**Relates to** : `R1-MUST-display-artwork-details`, `R3-MUST-provide-navigation`

#### Scenario: Navigation depuis la galerie

**Given** : Un visiteur est sur la page `/galerie`

**When** : Le visiteur clique sur "Voir les détails" de l'œuvre "Jardin Secret"

**Then** :
- Le visiteur est redirigé vers `/oeuvres/jardin-secret`
- La transition utilise `next/link` pour optimisation
- Le lien fonctionne pour toutes les 9 œuvres

---

## Implementation Notes

### Données
- Utiliser `data/artworks.ts` comme source unique (MVP)
- Recherche par slug : `artworks.find(a => a.slug === params.slug)`
- Aucune modification du modèle `Artwork` nécessaire

### Routing Next.js
- Route dynamique : `app/oeuvres/[slug]/page.tsx`
- Utiliser `generateMetadata()` pour métadonnées dynamiques
- Retourner `notFound()` si œuvre introuvable

### Navigation précédent/suivant
```typescript
const currentIndex = artworks.findIndex(a => a.slug === params.slug);
const prevArtwork = artworks[currentIndex - 1] || artworks[artworks.length - 1];
const nextArtwork = artworks[currentIndex + 1] || artworks[0];
```

### Design System
- Réutiliser la palette pastel existante
- Utiliser le composant `Button` de `components/ui/button.tsx`
- Cohérence avec le design de la galerie et navbar

### Performance
- `next/image` avec `priority` pour l'image principale
- `sizes` responsive pour optimisation multi-devices
- Lazy loading pour images hors viewport (navigation précédent/suivant)

### Accessibilité
- Alt text descriptif sur toutes les images
- Navigation au clavier fonctionnelle
- Contraste suffisant (WCAG AA minimum)
- Boutons avec états focus visibles
