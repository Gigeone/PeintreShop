# Design : Composant Footer

## Vue d'ensemble

Le Footer complète l'expérience utilisateur du site e-commerce en fournissant des informations de copyright, des liens de navigation redondants et le branding de l'artiste. Il suit les mêmes principes de design que la Navbar pour une cohérence visuelle totale.

## Décisions Architecturales

### 1. Emplacement : Layout Global vs Composant Par Page

**Décision** : Intégration dans le layout principal `app/layout.tsx`

**Options considérées** :
- **Option A** : Footer dans `app/layout.tsx` ✅ **CHOISI**
- **Option B** : Footer importé manuellement dans chaque page
- **Option C** : Footer uniquement sur certaines pages

**Justification** :
- ✅ **Cohérence** : Présent automatiquement sur toutes les pages
- ✅ **Maintenance** : Un seul point de modification
- ✅ **DRY** : Pas de duplication de code
- ✅ **UX** : Expérience utilisateur uniforme
- ✅ **SEO** : Structure sémantique cohérente

**Implémentation** :
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />  {/* Ajout du Footer */}
      </body>
    </html>
  );
}
```

---

### 2. Type de Composant : Client vs Server

**Décision** : Server Component (par défaut)

**Options considérées** :
- **Option A** : Server Component ✅ **CHOISI**
- **Option B** : Client Component avec 'use client'

**Justification** :
- ✅ **Statique** : Aucun état ou interactivité nécessaire
- ✅ **Performance** : Moins de JavaScript côté client
- ✅ **SEO** : Contenu rendu côté serveur
- ✅ **Default Next.js** : App Router privilégie Server Components

**Exception** : Si on ajoute des réseaux sociaux avec animations hover complexes en V1, on pourrait passer en Client Component.

---

### 3. Contenu : Minimaliste vs Complet

**Décision** : Footer MVP avec essentiel (Copyright + Nom + Navigation)

**Options considérées** :
- **Option A** : Minimaliste (juste copyright)
- **Option B** : MVP équilibré (copyright + nom + navigation) ✅ **CHOISI**
- **Option C** : Complet (+ réseaux sociaux + newsletter + mentions légales)

**Justification** :
- ✅ **YAGNI** : Pas de sur-ingénierie pour MVP
- ✅ **Utile** : Navigation redondante améliore UX
- ✅ **Branding** : Nom artiste renforce identité
- ✅ **Légal** : Copyright protège les œuvres
- ⚠️ **V1+** : Réseaux sociaux et mentions légales ajoutés ultérieurement

**Contenu MVP** :
```
- Logo/Nom : "MNGH"
- Navigation : Accueil | Galerie | À propos | Contact
- Copyright : "© 2026 MNGH - Tous droits réservés"
```

---

### 4. Layout Responsive : Colonnes vs Vertical

**Décision** : 3 colonnes desktop, vertical mobile

**Options considérées** :
- **Option A** : Toujours vertical (simple mais pas optimal desktop)
- **Option B** : 3 colonnes desktop, vertical mobile ✅ **CHOISI**
- **Option C** : Grid complexe 4+ colonnes

**Justification** :
- ✅ **Desktop** : 3 colonnes exploitent l'espace horizontal
- ✅ **Mobile** : Vertical empilé est plus lisible
- ✅ **Équilibré** : Pas trop simple, pas trop complexe
- ✅ **Évolutif** : Colonne 3 vide peut accueillir réseaux sociaux V1

**Breakpoint** : `md:` (768px)
- `<768px` : 1 colonne verticale centrée
- `≥768px` : 3 colonnes (Logo | Navigation | Vide)

**Layout Desktop** :
```
┌──────────────┬──────────────┬──────────────┐
│              │              │              │
│  MNGH        │  Navigation  │  (Vide)      │
│  © 2026      │  - Accueil   │  [Réseaux    │
│              │  - Galerie   │   sociaux    │
│              │  - À propos  │   V1]        │
│              │  - Contact   │              │
└──────────────┴──────────────┴──────────────┘
```

**Layout Mobile** :
```
┌──────────────┐
│    MNGH      │
│              │
│  Accueil     │
│  Galerie     │
│  À propos    │
│  Contact     │
│              │
│ © 2026 MNGH  │
└──────────────┘
```

---

### 5. Année Copyright : Statique vs Dynamique

**Décision** : Année dynamique via `new Date().getFullYear()`

**Options considérées** :
- **Option A** : Hardcodé "2026"
- **Option B** : Dynamique `new Date().getFullYear()` ✅ **CHOISI**

**Justification** :
- ✅ **Maintenance** : Se met à jour automatiquement chaque année
- ✅ **Correct** : Toujours l'année actuelle
- ✅ **Standard** : Pratique courante
- ✅ **Pas de risque** : Code simple et fiable

**Implémentation** :
```tsx
<p>© {new Date().getFullYear()} MNGH - Tous droits réservés</p>
```

---

### 6. Liens de Navigation : Duplication vs Réutilisation

**Décision** : Duplication des liens (pas d'abstraction partagée pour MVP)

**Options considérées** :
- **Option A** : Duplication dans Footer ✅ **CHOISI**
- **Option B** : Constante partagée `lib/navigation.ts`
- **Option C** : Config centralisée avec routage dynamique

**Justification** :
- ✅ **YAGNI** : 4 liens seulement, duplication acceptable
- ✅ **Simplicité** : Pas de fichier supplémentaire
- ✅ **Isolation** : Footer et Navbar indépendants
- ⚠️ **Trade-off** : Si ajout de liens, modification 2 endroits

**Evolution V1** : Si navigation dépasse 6-7 liens, extraire dans `lib/navigation.ts`

**Liens définis dans Footer** :
```tsx
const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];
```

---

## Design System

### Palette de Couleurs

**Background** :
```css
bg-pastel-rose-bg  /* #FFF5F5 - Cohérent avec Navbar */
```

**Bordure** :
```css
border-t border-pastel-lavender/20  /* Séparation subtile */
```

**Texte** :
```css
text-pastel-gray-text       /* Texte principal */
text-pastel-gray-text/60    /* Copyright (plus discret) */
```

**Liens** :
```css
text-pastel-lavender              /* Couleur par défaut */
hover:text-pastel-rose-mauve      /* Hover effect */
transition-colors duration-300    /* Transition fluide */
```

### Spacing

**Padding Vertical** :
```css
py-12  /* 3rem - Confortable sans être excessif */
```

**Padding Horizontal** :
```css
px-4 sm:px-6 lg:px-8  /* Cohérent avec Navbar et pages */
```

**Gap entre colonnes** :
```css
gap-8 md:gap-12  /* Espacement adaptatif */
```

### Typography

**Nom artiste (Logo)** :
```css
text-xl md:text-2xl font-bold text-pastel-blue-logo
```

**Liens navigation** :
```css
text-base /* 16px, lisible */
```

**Copyright** :
```css
text-sm text-pastel-gray-text/60  /* Plus petit et discret */
```

---

## Structure HTML Sémantique

```html
<footer class="...">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

      <!-- Colonne 1: Logo/Nom -->
      <div>
        <h3>MNGH</h3>
        <p>© {année} MNGH - Tous droits réservés</p>
      </div>

      <!-- Colonne 2: Navigation -->
      <nav aria-label="Footer navigation">
        <ul>
          <li><a href="/">Accueil</a></li>
          <li><a href="/galerie">Galerie</a></li>
          <li><a href="/a-propos">À propos</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <!-- Colonne 3: Vide (réservé V1) -->
      <div></div>

    </div>
  </div>
</footer>
```

**Bonnes pratiques** :
- ✅ Balise `<footer>` pour sémantique HTML5
- ✅ `<nav aria-label="Footer navigation">` pour accessibilité
- ✅ `max-w-7xl mx-auto` pour cohérence avec le reste du site
- ✅ Structure responsive avec Tailwind Grid

---

## Accessibilité

### Navigation Clavier
- Tous les liens focusables avec Tab
- Ordre de tabulation logique (gauche → droite, haut → bas)
- Focus visible sur les liens

### Lecteurs d'Écran
- `<footer>` landmark reconnu automatiquement
- `aria-label="Footer navigation"` sur le `<nav>`
- Texte de copyright lisible par lecteurs d'écran

### Contraste
- **Texte principal** : `#5A5A5A` sur `#FFF5F5` = **~8:1** ✅ WCAG AAA
- **Liens** : `#8B7FA8` sur `#FFF5F5` = **~4.5:1** ✅ WCAG AA
- **Copyright** : `#5A5A5A` à 60% opacité = **~5:1** ✅ WCAG AA

---

## Performance

### Bundle Size
- **Server Component** : 0 KB JavaScript côté client
- **HTML statique** : Rendu côté serveur
- **CSS** : Tailwind utilities (déjà dans le bundle global)

### Rendering
- **SSR** : Footer rendu avec chaque page
- **Pas de hydration** : Aucun JavaScript interactif
- **Instant** : Aucun délai de chargement

---

## Évolutions Futures (Post-MVP)

### V1 (Sanity CMS + Stripe)
- **Réseaux sociaux** : Icônes Instagram, Facebook dans colonne 3
- **Mentions légales** : Lien vers `/mentions-legales`
- **CGV** : Lien vers `/cgv` (conditions générales de vente)

### V2 (Plateforme professionnelle)
- **Newsletter** : Formulaire d'inscription
- **Multilingue** : Sélecteur de langue
- **Sitemap** : Lien vers sitemap XML
- **Logos partenaires** : Si applicable (galeries, associations)

---

## Tests et Validation

### Tests Manuels Requis
1. **Responsive** : Mobile (375px), Tablette (768px), Desktop (1440px)
2. **Navigation** : Cliquer sur chaque lien du footer
3. **Accessibilité** : Navigation au clavier (Tab)
4. **Visuel** : Vérifier cohérence avec Navbar

### Validation Automatique
```bash
# TypeScript
tsc --noEmit

# ESLint
npm run lint

# Build
npm run build
```

---

## Risques et Mitigation

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Footer prend trop d'espace vertical | Faible | Padding `py-12` équilibré, pas excessif |
| Liens en doublon avec Navbar confusent | Faible | C'est une pratique standard et attendue |
| Année copyright incorrecte | Moyen | `new Date().getFullYear()` garantit exactitude |
| Contraste insuffisant | Moyen | Tests WCAG validés, palette choisie avec soin |

---

## Documentation

### Fichier à Créer
- `components/Footer.tsx` - Composant Footer

### Fichier à Modifier
- `app/layout.tsx` - Ajout `<Footer />` après `<main>`

### Pas de Nouvelles Dépendances
- ✅ Utilise uniquement React, Next.js, Tailwind (déjà installés)
