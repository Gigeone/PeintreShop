# Design - Navbar MVP

## Context

Premier composant UI du site e-commerce pour une artiste peintre. La navbar doit être :
- Simple et minimaliste pour ne pas distraire des œuvres
- Responsive et mobile-first
- Accessible et facile à utiliser
- Cohérente avec l'identité visuelle d'un site d'artiste

**Stakeholders**: Artiste (propriétaire du site), visiteurs/acheteurs potentiels

**Constraints**:
- Next.js 14+ App Router (Server Components par défaut)
- Tailwind CSS uniquement (pas de bibliothèque UI externe)
- Mobile-first responsive design
- Pas de mode sombre pour le MVP

## Goals / Non-Goals

**Goals**:
- Navigation claire vers les 4 pages principales (Accueil, Galerie, À propos, Contact)
- Responsive avec menu hamburger sur mobile
- Indication visuelle de la page active
- Design minimaliste et élégant
- Accessibilité de base (navigation clavier, aria-labels)

**Non-Goals**:
- Pas de sous-menus ou navigation multiniveau (YAGNI)
- Pas de recherche intégrée dans la navbar (hors scope MVP)
- Pas de panier/compte utilisateur (V1+)
- Pas de mode sombre (exclu du MVP)
- Pas d'animations complexes (keep it simple)

## Decisions

### Decision 1: Client Component pour interactivité mobile
**What**: Le composant Navbar sera un Client Component (`'use client'`) pour gérer l'état du menu mobile et l'interactivité.

**Why**:
- Le menu hamburger nécessite un état React (`useState` pour ouvert/fermé)
- Next.js App Router privilégie les Server Components par défaut, mais les composants interactifs doivent être des Client Components
- Alternative (Server Component + form action) serait sur-ingénierie pour un simple toggle

**Alternatives considered**:
- Server Component pur : impossible car nécessite de l'état client
- Bibliothèque UI (Headless UI, Radix) : sur-ingénierie pour le MVP, Tailwind suffit

### Decision 2: Navigation basée sur `next/link` et `usePathname`
**What**: Utiliser `next/link` pour la navigation et `usePathname()` hook pour détecter la page active.

**Why**:
- `next/link` offre la navigation SPA avec préchargement automatique
- `usePathname()` est l'API officielle Next.js App Router pour obtenir le pathname actuel
- Pas besoin de bibliothèque de routing externe (Next.js gère tout)

**Alternatives considered**:
- Router externe (React Router) : incompatible avec Next.js App Router
- Vérification manuelle de l'URL : `usePathname()` est l'API standard et officielle

### Decision 3: Structure Layout + Navbar séparée
**What**:
- `app/layout.tsx` : root layout avec `<Navbar />` et `{children}`
- `components/Navbar.tsx` : composant navbar réutilisable

**Why**:
- Séparation des responsabilités : layout gère la structure globale, Navbar gère la navigation
- Réutilisabilité : le composant Navbar peut être testé indépendamment
- Convention Next.js : layout.tsx est le fichier standard pour les layouts

**Alternatives considered**:
- Navbar directement dans layout.tsx : moins maintenable, mix des responsabilités
- Multiple layouts : sur-ingénierie pour le MVP (une seule navbar suffit)

### Decision 4: Design minimaliste avec Tailwind uniquement
**What**: Pas de bibliothèque de composants UI, tout construit avec Tailwind CSS.

**Why**:
- Contrôle total sur le design et l'esthétique
- Poids léger (pas de dépendances UI supplémentaires)
- Tailwind suffit pour une navbar simple
- Respect de la contrainte "Préférer les composants existants" (= pas d'ajout de libs)

**Alternatives considered**:
- shadcn/ui : trop pour une simple navbar, ajouterait des dépendances
- Headless UI : utile mais pas nécessaire pour le MVP
- Material UI / Chakra : trop opinionné, poids lourd

### Decision 5: Menu mobile avec hamburger icon (SVG inline)
**What**: Utiliser des icônes SVG inline pour le menu hamburger (3 barres) et la croix de fermeture.

**Why**:
- Pas de dépendance externe (pas de react-icons ou lucide-react)
- SVG inline = contrôle total, léger, pas de requête HTTP
- Simple à styliser avec Tailwind

**Alternatives considered**:
- react-icons ou lucide-react : ajout de dépendance pour 2 icônes simples
- Unicode characters (☰, ✕) : moins joli, taille de police difficile à contrôler
- CSS pur (divs + transform) : complexe pour un résultat similaire

### Decision 6: Logo provisoire "MNGH" à gauche de la navbar
**What**: Afficher un logo texte "MNGH" à gauche de la navbar, cliquable vers la page d'accueil.

**Why**:
- Identité visuelle claire dès la navbar
- Convention UX : logo/nom à gauche = lien vers accueil
- Logo texte simple pour le MVP (pas d'image, pas de design complexe)
- Sera remplacé par le vrai logo/nom de l'artiste après validation

**Alternatives considered**:
- Pas de logo : moins d'identité visuelle, navbar moins professionnelle
- Logo image : nécessiterait un fichier image, plus complexe pour un placeholder MVP
- Nom complet de l'artiste : "MNGH" est un placeholder temporaire suffisant

### Decision 7: Navbar sticky (fixe en haut lors du scroll)
**What**: La navbar reste fixe en haut de la page lors du scroll (`sticky top-0 z-50`).

**Why**:
- Améliore l'UX : navigation toujours accessible sans remonter en haut
- Standard moderne pour les sites e-commerce
- Facile à implémenter avec Tailwind (`sticky` + `top-0`)
- Critique pour mobile où l'espace vertical est limité

**Alternatives considered**:
- Navbar statique (non-sticky) : moins pratique, nécessite de scroller vers le haut pour naviguer
- Hide on scroll (disparaît au scroll down, réapparaît au scroll up) : trop complexe pour le MVP

### Decision 8: Palette de couleurs pastels
**What**: Utiliser une palette de couleurs pastels douces pour la navbar et le site.

**Why**:
- Cohérent avec l'esthétique d'un site d'artiste (doux, accueillant)
- Met en valeur les œuvres sans distraire avec des couleurs vives
- Crée une ambiance calme et professionnelle
- Couleurs pastels = teintes désaturées, lumineuses, apaisantes

**Alternatives considered**:
- Noir et blanc strict : trop austère pour un site d'artiste
- Couleurs vives : risque de distraire des œuvres
- Gris neutres : moins de personnalité et chaleur

**Palette pastel proposée**:
- Background navbar : `bg-[#FFF5F5]` (rose pastel très pâle) ou `bg-[#F0F4FF]` (bleu pastel très pâle)
- Texte : `text-[#5A5A5A]` (gris doux)
- Hover : `text-[#8B7FA8]` (lavande pastel)
- Active : `text-[#D4A5A5]` (rose-mauve pastel) avec `border-b-2 border-[#D4A5A5]`
- Logo "MNGH" : `text-[#A8C5E2]` (bleu pastel) ou `text-[#C5A8D4]` (violet pastel)

## Technical Architecture

### Component Structure
```
app/
├── layout.tsx          # Root layout (Server Component) avec <Navbar />
└── (pages)/
    ├── page.tsx        # Accueil
    ├── galerie/page.tsx
    ├── a-propos/page.tsx
    └── contact/page.tsx

components/
└── Navbar.tsx          # Client Component ('use client')
```

### Navbar Component API
```typescript
// Pas de props pour le MVP (navbar statique avec liens hardcodés)
export default function Navbar(): JSX.Element
```

**State**:
- `isMenuOpen: boolean` - État du menu mobile (ouvert/fermé)

**Behavior**:
- Sticky : navbar fixe en haut lors du scroll (`sticky top-0 z-50`)
- Desktop : logo "MNGH" à gauche, navigation horizontale à droite, toujours visible
- Mobile (<768px) : logo à gauche, hamburger icon à droite, menu overlay/slide au clic
- Active link : style différencié basé sur `pathname` (couleur + border-bottom)

## Styling Guidelines

### Color Palette (Pastel - MVP)
**Background**:
- Navbar : `bg-[#FFF5F5]` (rose pastel très pâle) ou `bg-[#F0F4FF]` (bleu pastel très pâle)
- Mobile overlay : même couleur que navbar avec `shadow-xl`

**Text & Links**:
- Liens inactifs : `text-[#5A5A5A]` (gris doux)
- Hover : `text-[#8B7FA8]` (lavande pastel)
- Lien actif : `text-[#D4A5A5]` (rose-mauve pastel) + `border-b-2 border-[#D4A5A5]`

**Logo "MNGH"**:
- Couleur : `text-[#A8C5E2]` (bleu pastel) ou `text-[#C5A8D4]` (violet pastel)
- Taille : `text-2xl` (24px), `font-bold`

**Notes**:
- Couleurs pastels personnalisées nécessitent l'ajout dans `tailwind.config.ts` ou utilisation de classes arbitraires `[]`
- La palette peut être ajustée après tests visuels sur les œuvres réelles

### Typography
- Font : System font stack (Tailwind default) pour le MVP
- Liens : `text-base` (16px) ou `text-lg` (18px), `font-medium`
- Logo "MNGH" : `text-2xl` (24px), `font-bold`

### Responsive Breakpoints
- Mobile : `< 768px` (menu hamburger)
- Desktop : `>= 768px` (navigation horizontale)
- Tailwind breakpoint : `md:` prefix

## Risks / Trade-offs

### Risk 1: Absence de mode sombre
**Risk**: Certains utilisateurs préfèrent le mode sombre.
**Mitigation**: Accepté pour le MVP selon les contraintes projet (CLAUDE.md : "Pas de mode sombre pour le MVP"). Sera ajouté en V2 si nécessaire.

### Trade-off 1: Client Component pour la navbar
**Trade-off**: La navbar entière devient un Client Component à cause du menu mobile, ce qui désactive certaines optimisations SSR.
**Reasoning**: Impact minimal car la navbar est petite, et l'interactivité est essentielle. Alternative (Server Component + JS vanilla) serait contre-productive dans un projet React.

### Trade-off 2: Liens hardcodés dans le composant
**Trade-off**: Les liens de navigation sont hardcodés dans Navbar.tsx au lieu d'être configurables via props ou CMS.
**Reasoning**: Pour le MVP, la navigation ne changera pas. Rendre cela configurable serait de la sur-ingénierie (YAGNI). Sera revisité en V1 si Sanity doit gérer le menu.

## Migration Plan

**Déploiement**:
1. Créer la structure Next.js de base (app/, components/)
2. Implémenter Navbar.tsx et layout.tsx
3. Créer des pages placeholder pour tester la navigation
4. Valider avec Playwright (responsiveness, navigation)
5. Déployer sur Vercel (preview URL pour validation finale)

**Rollback**:
- Pas de rollback nécessaire (nouveau projet, pas de version précédente)
- En cas de bug critique : revert du commit, redéploy automatique via Vercel

**Backwards Compatibility**:
- N/A (première version du site)

## Design Decisions Summary

Toutes les questions initiales ont été résolues :

✅ **Logo** : Logo texte provisoire "MNGH" à gauche de la navbar, cliquable vers accueil
✅ **Sticky behavior** : Navbar fixe en haut lors du scroll (`sticky top-0 z-50`)
✅ **Couleurs** : Palette pastel (rose/bleu/lavande pâles) pour une esthétique douce et artistique

Ces décisions permettent de démarrer l'implémentation sans ambiguïté.
