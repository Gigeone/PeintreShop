# Change: Ajouter Cloudinary et carrousel d'accueil MVP

## Why

Actuellement, la galerie utilise des gradients CSS pour les images des œuvres, ce qui limite le réalisme du MVP. De plus, la page d'accueil ne montre aucun aperçu des œuvres, manquant ainsi une opportunité d'engagement immédiat du visiteur.

Ce changement vise à :
- Remplacer les gradients CSS par de vraies images via Cloudinary (CDN gratuit, optimisation automatique)
- Ajouter un carrousel sur la page d'accueil montrant 3-5 œuvres sélectionnées
- Améliorer l'attractivité visuelle du MVP sans ajouter de complexité technique

## What Changes

### 1. Intégration Cloudinary
- Configuration de Cloudinary (compte gratuit, variables d'environnement)
- Upload de 9 images d'œuvres sur Cloudinary
- Mise à jour de `data/artworks.ts` avec les URLs Cloudinary réelles
- Utilisation du composant `next/image` avec optimisation automatique
- Configuration des domaines Cloudinary dans `next.config.ts`

### 2. Carrousel page d'accueil
- Création d'un composant `FeaturedCarousel.tsx`
- Affichage de 3-5 œuvres sélectionnées sur la page d'accueil
- Navigation manuelle (boutons précédent/suivant)
- Auto-play optionnel avec pause au hover
- Responsive : 1 œuvre mobile, 2-3 œuvres desktop
- Lien "Voir la galerie complète" vers `/galerie`

## Impact

- **Affected specs**:
  - MODIFIED `gallery-data` : imageUrl passe de gradients CSS à URLs Cloudinary
  - ADDED `cloudinary-integration` : nouvelle capability pour gestion des images
  - ADDED `homepage-carousel` : nouvelle capability pour présentation des œuvres en accueil
- **Affected code**:
  - Modification de `data/artworks.ts` (URLs images)
  - Modification de `app/galerie/page.tsx` (utilisation de `next/image`)
  - Modification de `next.config.ts` (domaines Cloudinary)
  - Modification de `.env.local` (variables Cloudinary)
  - Création de `components/FeaturedCarousel.tsx`
  - Modification de `app/page.tsx` (intégration du carrousel)
- **User impact**:
  - Les visiteurs voient de vraies œuvres dès la page d'accueil
  - Galerie plus professionnelle avec vraies images optimisées
  - Temps de chargement rapides grâce au CDN Cloudinary
- **Dependencies**: Compte Cloudinary gratuit (2500 transformations/mois)
