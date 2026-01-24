# Change: Ajouter les données mockées pour la galerie MVP

## Why

La galerie affiche actuellement 6 placeholders génériques. Pour compléter le MVP, nous avons besoin de données mockées réalistes (6-12 œuvres) qui permettront de :
- Tester l'affichage de la galerie avec du contenu réel
- Créer les fiches produits détaillées (page `/oeuvres/[slug]`)
- Valider le design et l'UX avec des données concrètes
- Préparer la structure de données qui sera utilisée avec Sanity en V1

## What Changes

- Création d'un fichier de données mockées `data/artworks.ts` avec 6-12 œuvres
- Définition des types TypeScript pour les œuvres (`types/artwork.ts`)
- Images placeholder ou gradient CSS temporaires
- Structure de données incluant :
  - Titre, slug, description
  - Prix (en euros)
  - Dimensions (hauteur × largeur en cm)
  - Technique (huile, acrylique, aquarelle, etc.)
  - Disponibilité (boolean)
  - Image URL ou placeholder
- Mise à jour de la page galerie pour consommer les données mockées
- Support pour la future page `/oeuvres/[slug]` (préparation des slugs uniques)

## Impact

- **Affected specs**: Nouvelle capability `gallery-data` (stockage et affichage des œuvres)
- **Affected code**:
  - Création de `types/artwork.ts` (types TypeScript)
  - Création de `data/artworks.ts` (données mockées)
  - Modification de `app/galerie/page.tsx` (consommation des données)
  - Préparation pour `app/oeuvres/[slug]/page.tsx` (page fiche œuvre - phase suivante)
- **User impact**: Les visiteurs verront des œuvres réalistes au lieu de placeholders
- **Dependencies**: Aucune dépendance externe - utilise uniquement TypeScript et Next.js
