# Tasks: Ajouter Cloudinary et carrousel d'accueil MVP

## Section 1: Configuration Cloudinary (4 tâches)

- [ ] Créer un compte Cloudinary gratuit (cloudinary.com)
- [ ] Récupérer le Cloud Name et les credentials API
- [ ] Ajouter les variables d'environnement dans `.env.local` : `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- [ ] Configurer `next.config.ts` pour autoriser les domaines Cloudinary dans `images.remotePatterns`

## Section 2: Upload des images (3 tâches)

- [ ] Trouver ou générer 9 images d'œuvres d'art (libres de droits ou mockées via IA)
- [ ] Uploader les 9 images sur Cloudinary (via interface web ou API)
- [ ] Noter les URLs publiques de chaque image (format: `https://res.cloudinary.com/{cloud_name}/image/upload/...`)

## Section 3: Mise à jour des données (2 tâches)

- [ ] Remplacer les valeurs `imageUrl` dans `data/artworks.ts` par les URLs Cloudinary
- [ ] Vérifier que toutes les URLs fonctionnent et correspondent aux bonnes œuvres

## Section 4: Mise à jour de la galerie (2 tâches)

- [ ] Remplacer le `<div>` avec gradient CSS par le composant `next/image` dans `app/galerie/page.tsx`
- [ ] Tester l'affichage des images avec optimisation automatique (lazy loading, responsive)

## Section 5: Création du carrousel (6 tâches)

- [ ] Créer le composant `components/FeaturedCarousel.tsx` avec state pour l'index actif
- [ ] Implémenter la navigation manuelle (boutons précédent/suivant avec SVG icons)
- [ ] Ajouter l'auto-play avec `setInterval` (optionnel, 5 secondes)
- [ ] Implémenter la pause au hover (optionnel)
- [ ] Rendre le carrousel responsive : 1 œuvre mobile, 2-3 desktop
- [ ] Ajouter un indicateur de pagination (dots)

## Section 6: Intégration page d'accueil (3 tâches)

- [ ] Sélectionner 3-5 œuvres "featured" dans `data/artworks.ts` (ajouter un champ `isFeatured: boolean`)
- [ ] Importer et intégrer `<FeaturedCarousel />` dans `app/page.tsx` après le hero
- [ ] Ajouter un titre "Œuvres en Vedette" et un lien "Voir toute la galerie"

## Section 7: Styling & Polish (3 tâches)

- [ ] Appliquer la palette pastel au carrousel (boutons, indicateurs)
- [ ] Ajouter des transitions fluides entre les slides (CSS transform ou framer-motion)
- [ ] S'assurer que le carrousel est accessible (aria-labels, navigation clavier)

## Section 8: Validation & Testing (4 tâches)

- [ ] Tester le carrousel sur mobile, tablette, desktop
- [ ] Vérifier que les images se chargent rapidement (CDN Cloudinary)
- [ ] Tester l'auto-play et la pause au hover (si implémenté)
- [ ] Confirmer que la navigation clavier fonctionne (flèches gauche/droite)

## Section 9: Documentation (2 tâches)

- [ ] Ajouter des commentaires dans `FeaturedCarousel.tsx` expliquant la logique
- [ ] Documenter les variables d'environnement Cloudinary dans `.env.example`
