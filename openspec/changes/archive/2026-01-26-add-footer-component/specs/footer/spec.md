# Spécification : Composant Footer

## Purpose

Fournir un pied de page cohérent sur toutes les pages du site, affichant les informations essentielles (copyright, navigation, nom de l'artiste) pour améliorer l'expérience utilisateur, l'accessibilité et le SEO.

## Scenarios

### Scénario 1 : Consultation du footer sur page d'accueil
**Acteur** : Visiteur naviguant sur le site

**Flux nominal** :
1. Le visiteur accède à la page d'accueil `/`
2. Il scrolle jusqu'en bas de la page
3. Le footer s'affiche avec le nom "MNGH", les liens de navigation et le copyright
4. Le visiteur peut cliquer sur un lien du footer pour naviguer

**Résultat attendu** : Le footer est visible et fonctionnel avec tous les éléments affichés correctement

---

### Scénario 2 : Navigation via les liens du footer
**Acteur** : Visiteur utilisant le footer pour naviguer

**Flux nominal** :
1. Le visiteur est sur n'importe quelle page du site
2. Il scrolle jusqu'au footer
3. Il clique sur "Galerie" dans la navigation du footer
4. Il est redirigé vers `/galerie`

**Résultat attendu** : La navigation via les liens du footer fonctionne correctement

---

### Scénario 3 : Affichage responsive sur mobile
**Acteur** : Visiteur sur smartphone

**Flux nominal** :
1. Le visiteur accède au site depuis un mobile (375px de largeur)
2. Il scrolle jusqu'au footer
3. Le footer affiche les éléments en layout vertical centré
4. Tous les textes sont lisibles sans zoom

**Résultat attendu** : Le footer s'adapte correctement au viewport mobile

---

### Scénario 4 : Vérification du copyright avec année actuelle
**Acteur** : Visiteur consultant les informations légales

**Flux nominal** :
1. Le visiteur scrolle jusqu'au footer
2. Il consulte le copyright affiché
3. L'année affichée correspond à l'année en cours (2026)

**Résultat attendu** : Le copyright affiche l'année correcte dynamiquement

---

### Scénario 5 : Navigation au clavier (accessibilité)
**Acteur** : Utilisateur malvoyant utilisant un lecteur d'écran

**Flux nominal** :
1. L'utilisateur navigue au clavier avec la touche Tab
2. Il atteint le footer après le contenu principal
3. Il peut tabber entre les liens de navigation
4. Chaque lien a un focus visible

**Résultat attendu** : Le footer est entièrement accessible au clavier

---

## ADDED Requirements

### R1-MUST-display-footer-globally
**SHALL** : Le système doit afficher le footer sur toutes les pages du site de manière cohérente

**Capabilities** :
- Footer présent sur toutes les routes (/, /galerie, /a-propos, /contact, /oeuvres/[slug])
- Intégration dans le layout principal `app/layout.tsx`
- Positionnement en bas de page après le contenu principal
- Structure HTML sémantique avec balise `<footer>`

**Relates to** : `R2-MUST-display-navigation-links`, `R3-MUST-display-copyright`

#### Scenario: Footer présent sur toutes les pages

**Given** : Un visiteur navigue sur le site

**When** : Il accède aux pages /, /galerie, /a-propos, /contact, ou /oeuvres/jardin-secret

**Then** :
- Le footer est visible en bas de chaque page
- Le footer a la même apparence et le même contenu sur toutes les pages
- La balise `<footer>` est présente dans le HTML

---

### R2-MUST-display-navigation-links
**SHALL** : Le système doit afficher des liens de navigation fonctionnels dans le footer

**Capabilities** :
- Liens vers : Accueil (/), Galerie (/galerie), À propos (/a-propos), Contact (/contact)
- Utilisation de `next/link` pour navigation optimisée
- Hover effects sur les liens (changement de couleur)
- Navigation sémantique avec balise `<nav>`

**Relates to** : `R1-MUST-display-footer-globally`

#### Scenario: Navigation via lien footer

**Given** : Un visiteur est sur la page d'accueil

**When** : Il clique sur le lien "Galerie" dans le footer

**Then** :
- Il est redirigé vers `/galerie`
- La navigation utilise `next/link` (client-side routing)
- Le lien a un effet hover visible avant le clic

---

### R3-MUST-display-copyright
**SHALL** : Le système doit afficher le copyright avec l'année actuelle et le nom de l'artiste

**Capabilities** :
- Affichage du texte "© {année} MNGH - Tous droits réservés"
- Année générée dynamiquement via `new Date().getFullYear()`
- Texte formaté de manière discrète (opacité réduite)

**Relates to** : `R1-MUST-display-footer-globally`

#### Scenario: Copyright avec année actuelle

**Given** : Un visiteur consulte le footer

**When** : La page se charge

**Then** :
- Le copyright affiche "© 2026 MNGH - Tous droits réservés"
- L'année est générée dynamiquement (pas hardcodée)
- Le texte est visible mais discret (opacité 60%)

---

### R4-MUST-display-artist-name
**SHALL** : Le système doit afficher le nom de l'artiste "MNGH" de manière visible dans le footer

**Capabilities** :
- Nom "MNGH" affiché en tant que logo/titre
- Typographie cohérente avec la Navbar
- Couleur de la palette pastel (bleu logo)

**Relates to** : `R1-MUST-display-footer-globally`

#### Scenario: Nom artiste visible

**Given** : Un visiteur consulte le footer

**When** : Il scroll jusqu'en bas de la page

**Then** :
- Le nom "MNGH" est affiché en grand (heading)
- La couleur est `text-pastel-blue-logo` (cohérent avec Navbar)
- Le texte est bold pour le rendre visible

---

### R5-MUST-be-responsive
**SHALL** : Le système doit afficher le footer de manière optimale sur tous les appareils

**Capabilities** :
- Layout 3 colonnes sur desktop (≥768px)
- Layout vertical centré sur mobile (<768px)
- Texte lisible sans zoom sur mobile
- Espacement adaptatif

**Relates to** : `R1-MUST-display-footer-globally`

#### Scenario: Affichage desktop

**Given** : Un visiteur accède au site sur un écran ≥768px

**When** : Il scroll jusqu'au footer

**Then** :
- Le footer affiche 3 colonnes : Logo | Navigation | Vide
- Les colonnes sont espacées de manière équilibrée
- Tout le contenu est visible sans scroll horizontal

#### Scenario: Affichage mobile

**Given** : Un visiteur accède au site sur un écran <768px

**When** : Il scroll jusqu'au footer

**Then** :
- Le footer affiche une seule colonne verticale
- Les éléments sont centrés
- Le texte est lisible sans zoom
- La navigation est en liste verticale

---

### R6-MUST-match-design-system
**SHALL** : Le système doit appliquer la palette pastel et le style cohérent avec le reste du site

**Capabilities** :
- Background : `bg-pastel-rose-bg` (même couleur que Navbar)
- Bordure supérieure : `border-t border-pastel-lavender/20`
- Liens : `text-pastel-lavender` avec `hover:text-pastel-rose-mauve`
- Transitions fluides sur hover (300ms)

**Relates to** : `R1-MUST-display-footer-globally`

#### Scenario: Cohérence visuelle

**Given** : Un visiteur consulte le footer et la navbar

**When** : Il compare les deux éléments

**Then** :
- Le footer et la navbar partagent le même background (`bg-pastel-rose-bg`)
- Les liens ont le même style hover
- Les couleurs suivent la palette pastel
- L'ensemble est visuellement cohérent

---

### R7-MUST-be-accessible
**SHALL** : Le système doit rendre le footer accessible aux utilisateurs de technologies d'assistance

**Capabilities** :
- Navigation au clavier (Tab entre liens)
- Focus visible sur les liens
- Balise `<nav>` avec `aria-label="Footer navigation"`
- Contraste texte/fond conforme WCAG AA
- Sémantique HTML5 (`<footer>`)

#### Scenario: Navigation clavier

**Given** : Un utilisateur navigue au clavier

**When** : Il appuie sur Tab depuis le contenu principal

**Then** :
- Le focus atteint le footer
- Il peut tabber entre les 4 liens de navigation
- Chaque lien a un focus visible (outline)
- L'ordre de tabulation est logique

#### Scenario: Lecteur d'écran

**Given** : Un utilisateur avec lecteur d'écran visite le site

**When** : Il atteint le footer

**Then** :
- Le lecteur annonce "Footer" (landmark)
- Le lecteur annonce "Footer navigation" pour le nav
- Tous les textes sont lisibles par le lecteur
- Les liens sont identifiables

---

## Implementation Notes

### Composant
- **Fichier** : `components/Footer.tsx`
- **Type** : Server Component (pas de 'use client')
- **Export** : `export default function Footer()`

### Intégration
- **Fichier** : `app/layout.tsx`
- **Position** : Après `<main>{children}</main>`
- **Structure** :
  ```tsx
  <body>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </body>
  ```

### Année Dynamique
```tsx
const currentYear = new Date().getFullYear();
// Affiche: © 2026 MNGH
```

### Liens Navigation
Même structure que Navbar :
```tsx
const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];
```

### Layout Responsive
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Colonne 1: Logo + Copyright */}
  <div>{/* ... */}</div>

  {/* Colonne 2: Navigation */}
  <nav aria-label="Footer navigation">{/* ... */}</nav>

  {/* Colonne 3: Vide (réservé réseaux sociaux V1) */}
  <div></div>
</div>
```

### Palette de Couleurs
- Background : `bg-pastel-rose-bg`
- Bordure : `border-t border-pastel-lavender/20`
- Nom artiste : `text-pastel-blue-logo`
- Liens : `text-pastel-lavender hover:text-pastel-rose-mauve`
- Copyright : `text-pastel-gray-text/60`

### Accessibilité
- Balise `<footer>` pour landmark
- `<nav aria-label="Footer navigation">` pour navigation
- Focus visible sur liens : `focus:outline-none focus:ring-2 focus:ring-pastel-lavender`
- Contraste minimum WCAG AA validé

### Performance
- Server Component = 0 KB JavaScript côté client
- Rendu côté serveur (SSR)
- Aucune hydration nécessaire
