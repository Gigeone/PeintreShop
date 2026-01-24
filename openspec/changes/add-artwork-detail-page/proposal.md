# Proposition : Page Détail d'Œuvre

## Contexte

Actuellement, la galerie affiche une grille de 9 œuvres avec un bouton "Voir les détails" non fonctionnel. Cette proposition ajoute une page de détail dynamique pour chaque œuvre, permettant aux visiteurs de voir toutes les informations et d'initier un achat via la page contact.

## Objectif

Créer une page dynamique `/oeuvres/[slug]` qui :
- Affiche toutes les informations d'une œuvre (image grande taille, description complète, technique, dimensions, prix)
- Indique clairement le statut de disponibilité
- Permet de contacter l'artiste pour acheter l'œuvre
- Fournit une navigation facile (retour galerie, navigation entre œuvres)
- Respecte le design system pastel et le responsive mobile-first

## Portée (Scope)

### Dans le scope
- Route dynamique Next.js `/oeuvres/[slug]`
- Page détail responsive avec design cohérent
- Affichage grande image optimisée avec next/image
- Bouton "Acheter" redirigeant vers `/contact`
- Badge de statut "Disponible" / "Vendu"
- Métadonnées SEO dynamiques (titre, description, Open Graph)
- Navigation retour galerie
- Liens de navigation entre œuvres (précédent/suivant)
- Mise à jour du bouton "Voir les détails" dans la galerie pour utiliser la nouvelle route

### Hors scope (reporté à V1 ou V2)
- Lightbox/zoom d'image interactif
- Galerie multi-images par œuvre
- Système de panier
- Paiement direct sur la page
- Partage sur réseaux sociaux
- Œuvres recommandées/similaires
- Historique de navigation
- Variantes d'œuvre

## Approche Technique

### Routing
- Utiliser Next.js App Router avec route dynamique `app/oeuvres/[slug]/page.tsx`
- Récupérer l'œuvre depuis `data/artworks.ts` via le slug
- Générer les métadonnées dynamiques via `generateMetadata()`
- Retourner 404 si slug invalide

### Layout de la page
**Desktop (≥1024px)** : Layout 2 colonnes
- Colonne gauche (60%) : Image de l'œuvre en grand format
- Colonne droite (40%) : Informations et CTA

**Mobile (<1024px)** : Layout vertical
- Image en haut (pleine largeur)
- Informations en dessous

### Composants nécessaires
- Page principale : `app/oeuvres/[slug]/page.tsx`
- Aucun nouveau composant UI nécessaire (réutilisation du Button existant)

### Navigation
- Bouton "← Retour à la galerie" (lien vers `/galerie`)
- Boutons "Œuvre précédente" / "Œuvre suivante" en bas de page
- Logique de navigation circulaire (dernière → première)

### Données
- Utiliser le tableau `artworks` existant de `data/artworks.ts`
- Trouver l'œuvre par `slug` avec `artworks.find()`
- Pas de modifications du modèle `Artwork` nécessaires

## Bénéfices Utilisateur

### Pour les visiteurs
- Voir l'œuvre en grand format pour apprécier les détails
- Lire la description complète et toutes les spécifications
- Comprendre immédiatement si l'œuvre est disponible
- Parcourir facilement entre les différentes œuvres
- Contacter l'artiste directement pour un achat

### Pour l'artiste
- Présentation professionnelle de chaque œuvre
- Réduction des questions répétitives (specs visibles)
- Augmentation de la conversion (CTA clair)
- SEO amélioré par page (une URL par œuvre)

## Mesures de Succès

### Critères d'acceptation
- ✅ Toutes les œuvres accessibles via `/oeuvres/{slug}`
- ✅ Responsive sur mobile, tablette, desktop
- ✅ Images optimisées et chargement rapide
- ✅ Navigation fonctionnelle (galerie, précédent/suivant)
- ✅ Bouton "Acheter" redirige vers `/contact`
- ✅ Métadonnées SEO dynamiques par œuvre
- ✅ Design cohérent avec palette pastel
- ✅ Aucune erreur TypeScript
- ✅ Tests Playwright validés (responsive + navigation)

### Métriques de qualité
- Temps de chargement < 2s (LCP)
- Score Lighthouse > 90 (Performance)
- 100% responsive (mobile, tablette, desktop)
- Accessibilité : alt text, contraste, navigation clavier

## Risques et Mitigation

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Slug en doublon | Moyen | Faible | Validation unicité des slugs dans artworks.ts |
| Image trop lourde | Moyen | Moyen | next/image optimise automatiquement + placeholders Unsplash optimisés |
| Navigation cassée | Faible | Faible | Tests de navigation circulaire |
| SEO metadata manquante | Moyen | Faible | Utiliser generateMetadata() obligatoire |

## Dépendances

### Bloque
- Aucune autre fonctionnalité ne dépend de celle-ci

### Bloqué par
- ✅ Données mockées (artworks.ts) - Déjà fait
- ✅ Navbar et layout - Déjà fait
- ✅ Page galerie - Déjà fait

### Séquence recommandée
1. Créer la page dynamique `app/oeuvres/[slug]/page.tsx`
2. Implémenter le layout et l'affichage des données
3. Ajouter la navigation (retour, précédent/suivant)
4. Générer les métadonnées SEO
5. Mettre à jour les liens dans la galerie
6. Tests Playwright (responsive + navigation)

## Alternatives Considérées

### Alternative 1 : Modal au lieu de page séparée
**Rejeté** - Moins bon pour le SEO, pas d'URL partageable, complexité inutile pour MVP

### Alternative 2 : Paiement direct sur la page
**Reporté à V1** - Nécessite Stripe, hors scope MVP (contact form suffit)

### Alternative 3 : Utiliser l'ID au lieu du slug dans l'URL
**Rejeté** - Slug est meilleur pour SEO et UX (`/oeuvres/jardin-secret` vs `/oeuvres/2`)

## Questions Ouvertes

Aucune - Toutes les questions de clarification ont été résolues :
- ✅ Action du bouton "Acheter" : Redirection vers `/contact`
- ✅ Affichage image : Une seule grande image (pas de lightbox/galerie)
