# Design : Page Détail d'Œuvre

## Vue d'ensemble

Cette page détail complète le parcours utilisateur MVP en offrant une page dédiée pour chaque œuvre. Elle utilise le routing dynamique de Next.js App Router et réutilise les composants et le design system existants.

## Décisions Architecturales

### 1. Routing : Slug vs ID

**Décision** : Utiliser le `slug` dans l'URL plutôt que l'`id`

**Options considérées** :
- **Option A** : `/oeuvres/[id]` (ex: `/oeuvres/2`)
- **Option B** : `/oeuvres/[slug]` (ex: `/oeuvres/jardin-secret`) ✅ **CHOISI**

**Justification** :
- ✅ Meilleur SEO : URLs descriptives sont favorisées par les moteurs de recherche
- ✅ Meilleur UX : URLs lisibles et mémorisables
- ✅ Partage social : Plus engageant de partager `/jardin-secret` que `/2`
- ✅ Préparation V1 : Sanity CMS génère automatiquement des slugs
- ⚠️ Contrainte : Nécessite des slugs uniques (déjà garanti dans artworks.ts)

**Trade-offs** :
- Légèrement plus complexe (recherche par slug vs par index)
- Risque minimal de collision de slugs (mitigé par validation manuelle en MVP, automatique en V1)

---

### 2. Action du Bouton "Acheter"

**Décision** : Redirection vers `/contact` (sans pré-remplissage pour MVP)

**Options considérées** :
- **Option A** : Redirection simple vers `/contact` ✅ **CHOISI**
- **Option B** : Redirection avec query params (ex: `/contact?artwork=jardin-secret`)
- **Option C** : Modal de contact directement sur la page
- **Option D** : Lien `mailto:` avec template

**Justification** :
- ✅ **Simplicité MVP** : Pas de logique de pré-remplissage nécessaire
- ✅ **Scope minimal** : Redirection = 1 ligne de code
- ✅ **Cohérence** : Le formulaire contact existe déjà
- ⚠️ **UX sous-optimale** : Utilisateur doit recopier les infos de l'œuvre

**Évolution V1** :
- Passer les infos de l'œuvre via query params ou state
- Pré-remplir le sujet du message : "Demande d'achat : Jardin Secret"
- Ou : Remplacer par checkout Stripe direct

---

### 3. Affichage de l'Image

**Décision** : Une seule grande image, sans lightbox/zoom interactif

**Options considérées** :
- **Option A** : Image statique grande taille ✅ **CHOISI**
- **Option B** : Image avec lightbox/zoom au clic
- **Option C** : Galerie multi-images avec carousel

**Justification** :
- ✅ **MVP minimum** : Pas de dépendance externe (lightbox libs)
- ✅ **Données actuelles** : 1 image par œuvre dans `artworks.ts`
- ✅ **Performance** : `next/image` optimise déjà l'affichage
- ✅ **Mobile-friendly** : Pinch-to-zoom natif du navigateur suffit

**Évolution V2** :
- Ajouter lightbox si retours utilisateurs le demandent
- Support multi-images quand Sanity CMS est intégré (V1)

---

### 4. Layout Responsive

**Décision** : 2 colonnes desktop (60/40), vertical mobile

**Options considérées** :
- **Option A** : 50/50 desktop, vertical mobile
- **Option B** : 60/40 desktop, vertical mobile ✅ **CHOISI**
- **Option C** : Fullscreen image avec scroll pour infos (type e-commerce moderne)

**Justification** :
- ✅ **Mise en valeur image** : 60% donne plus d'espace pour apprécier l'œuvre
- ✅ **Infos visibles** : 40% suffisant pour texte et CTA sans scroll
- ✅ **Balance visuelle** : Proportions golden ratio approximatives
- ✅ **Cohérence** : Suit le pattern classique de product page

**Breakpoints** :
- Mobile (<768px) : 1 colonne, image en haut
- Tablette (768-1023px) : 1 colonne, image plus grande
- Desktop (≥1024px) : 2 colonnes (60/40)

---

### 5. Navigation Entre Œuvres

**Décision** : Boutons précédent/suivant avec navigation circulaire

**Options considérées** :
- **Option A** : Pas de navigation directe (retour galerie obligatoire)
- **Option B** : Précédent/suivant avec fin de liste ✅ **REJETÉ**
- **Option C** : Précédent/suivant circulaire (boucle infinie) ✅ **CHOISI**
- **Option D** : Thumbnails de toutes les œuvres en sidebar

**Justification** :
- ✅ **Découvrabilité** : Encourage l'exploration du catalogue complet
- ✅ **UX fluide** : Pas de dead-end (dernière œuvre → première)
- ✅ **Simplicité** : Logique simple avec opérateur modulo
- ⚠️ **Ordre fixe** : Navigation suit l'ordre du tableau (pas de tri dynamique en MVP)

**Implémentation** :
```typescript
const currentIndex = artworks.findIndex(a => a.slug === params.slug);
const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
const nextIndex = (currentIndex + 1) % artworks.length;
```

---

### 6. Gestion des Œuvres Vendues

**Décision** : Afficher avec badge "Vendu" + bouton désactivé ou texte alternatif

**Options considérées** :
- **Option A** : Masquer complètement les œuvres vendues
- **Option B** : Afficher avec badge + bouton désactivé ✅ **CHOISI**
- **Option C** : Rediriger les œuvres vendues vers une page archive

**Justification** :
- ✅ **Portfolio** : Les œuvres vendues montrent le talent de l'artiste
- ✅ **Transparence** : Informe sur les prix pratiqués
- ✅ **SEO** : Conserve les URLs et le contenu indexé
- ✅ **Navigation** : Pas de trous dans la navigation précédent/suivant

**UI pour œuvres vendues** :
- Badge "Vendu" en couleur distincte (gris ou pastel désaturé)
- Bouton "Œuvre vendue" désactivé (grisé, cursor: not-allowed)
- Description et prix toujours visibles (référence)

---

### 7. Métadonnées SEO

**Décision** : Métadonnées dynamiques via `generateMetadata()`

**Structure** :
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const artwork = artworks.find(a => a.slug === params.slug);

  if (!artwork) return { title: 'Œuvre non trouvée' };

  return {
    title: `${artwork.title} - MNGH`,
    description: artwork.description.slice(0, 160),
    openGraph: {
      title: artwork.title,
      description: artwork.description,
      images: [{ url: artwork.imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: artwork.title,
      description: artwork.description,
      images: [artwork.imageUrl],
    },
  };
}
```

**Justification** :
- ✅ **SEO** : Une page par œuvre = meilleur indexation
- ✅ **Social sharing** : Beaux aperçus sur Facebook, Twitter, WhatsApp
- ✅ **Accessibilité** : Titres de page descriptifs
- ✅ **Next.js native** : Pas de lib externe (react-helmet, etc.)

---

### 8. Gestion 404

**Décision** : Utiliser `notFound()` de Next.js

**Implémentation** :
```typescript
import { notFound } from 'next/navigation';

export default function ArtworkDetailPage({ params }) {
  const artwork = artworks.find(a => a.slug === params.slug);

  if (!artwork) {
    notFound(); // Déclenche la page 404 Next.js
  }

  return (/* ... */);
}
```

**Justification** :
- ✅ **Native Next.js** : Pas de logique custom
- ✅ **SEO** : Retourne HTTP 404 correct
- ✅ **UX** : Page 404 Next.js par défaut (peut être customisée plus tard)

---

## Composants et Réutilisation

### Composants Existants Réutilisés
- `Button` (`components/ui/button.tsx`) - Pour les CTAs
- `Link` (Next.js) - Pour toute navigation
- `Image` (Next.js) - Pour images optimisées
- Navbar (layout.tsx) - Navigation globale
- Footer (à venir) - Pied de page global

### Nouveaux Composants
**Aucun** - Tout est implémenté dans `app/oeuvres/[slug]/page.tsx`

**Justification** :
- ✅ **YAGNI** : Pas de sur-ingénierie
- ✅ **Scope** : Page détail est la seule à afficher ce layout
- ✅ **Évolution** : Si réutilisation future, extraction facile

---

## Style et Design System

### Palette Pastel Réutilisée
- Background : `bg-gradient-to-br from-pastel-blue-bg to-pastel-rose-bg`
- Texte principal : `text-pastel-gray-text`
- Headings : `text-pastel-lavender`
- CTA : `bg-pastel-rose-mauve hover:bg-pastel-lavender`
- Badge "Vendu" : `bg-pastel-gray-text/20 text-pastel-gray-text`

### Spacing et Typography
- Max-width container : `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Padding vertical : `py-20` (cohérent avec galerie)
- Titre œuvre : `text-4xl md:text-5xl font-bold`
- Description : `text-lg leading-relaxed`

### Cohérence Visuelle
- ✅ Même gradient de fond que la galerie
- ✅ Même style de cards avec `backdrop-blur-sm`
- ✅ Même transitions sur les boutons
- ✅ Même formatage du prix (locale fr-FR)

---

## Performance

### Images
- **Strategy** : `next/image` avec `priority` pour l'image principale
- **Sizes** :
  - Mobile : `100vw`
  - Tablette : `100vw`
  - Desktop : `60vw` (occupe 60% de la largeur)
- **Format** : WebP automatique via `next/image`
- **Lazy loading** : Automatique pour images hors viewport

### Navigation
- **Client-side routing** : `next/link` avec prefetch
- **Data fetching** : Statique (artworks.ts importé)
- **No loading state** : Données synchrones (pas de fetch)

### Métriques Cibles
- **LCP** : < 2.5s (image principale optimisée)
- **FID** : < 100ms (page statique, peu de JS)
- **CLS** : < 0.1 (dimensions images définies)

---

## Accessibilité

### Navigation Clavier
- Tous les boutons/liens focusables
- Ordre de tab logique (retour galerie → précédent → suivant → acheter)
- Focus visible (outline par défaut ou custom)

### Screen Readers
- Alt text descriptif : `alt={artwork.title}`
- Headings hiérarchisés (h1 pour titre œuvre)
- Bouton désactivé avec `aria-disabled="true"` si vendu

### Contraste
- Texte principal/fond : ≥4.5:1 (WCAG AA)
- Boutons/fond : ≥3:1 (WCAG AA pour large text)

---

## Évolutions Futures (Post-MVP)

### V1 (Sanity CMS + Stripe)
- Données depuis Sanity au lieu de artworks.ts
- Bouton "Acheter" déclenche Stripe Checkout
- Support multi-images (galerie carousel)
- Pré-remplissage formulaire contact avec query params

### V2 (Fonctionnalités avancées)
- Lightbox/zoom interactif sur images
- Œuvres similaires/recommandées
- Partage social natif (boutons share)
- Wishlist / favoris
- Historique de navigation
- Commentaires / témoignages clients

---

## Risques et Mitigation

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Slugs en doublon | Moyen | Validation manuelle des slugs dans artworks.ts + Sanity schema avec unique constraint (V1) |
| Images trop lourdes | Moyen | next/image optimise automatiquement + placeholders Unsplash déjà optimisés |
| Navigation cassée (œuvre supprimée) | Faible | notFound() handle gracieusement les slugs invalides |
| SEO metadata manquante | Moyen | generateMetadata() obligatoire + tests de validation |
| Layout cassé sur certaines tailles | Faible | Tests Playwright multi-breakpoints |

---

## Tests et Validation

### Tests Playwright Requis
1. **Navigation** : Galerie → Détail → Navigation précédent/suivant → Retour galerie
2. **Responsive** : Mobile (375px), Tablette (768px), Desktop (1440px)
3. **CTA** : Bouton "Acheter" redirige vers `/contact`
4. **404** : Slug invalide affiche page 404
5. **Œuvre vendue** : Badge affiché + bouton désactivé

### Validation Manuelle
- Aperçus sociaux (Facebook Debugger, Twitter Card Validator)
- Navigation clavier complète
- Test lecteur d'écran (NVDA ou VoiceOver)
- Score Lighthouse > 90 (Performance, Accessibility, SEO)

---

## Documentation

### Fichiers à Créer
- `app/oeuvres/[slug]/page.tsx` - Page principale

### Fichiers à Modifier
- `app/galerie/page.tsx` - Liens vers pages détail
- Aucun autre fichier nécessaire

### Pas de Nouvelles Dépendances
- ✅ Tout utilise les primitives Next.js et composants existants
