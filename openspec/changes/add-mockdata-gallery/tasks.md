# Tasks: Ajouter les données mockées pour la galerie MVP

## Section 1: Définir les types TypeScript (2 tâches)

- [x] Créer le fichier `types/artwork.ts` avec l'interface `Artwork`
- [x] Définir tous les champs requis : id, slug, title, description, price, dimensions, technique, isAvailable, imageUrl

## Section 2: Créer les données mockées (3 tâches)

- [x] Créer le fichier `data/artworks.ts` avec export nommé
- [x] Ajouter 6-12 œuvres avec données réalistes (titres créatifs, descriptions, prix variés 150€-800€)
- [x] Générer des slugs uniques pour chaque œuvre (format kebab-case)

## Section 3: Mettre à jour la galerie (3 tâches)

- [x] Importer les données mockées dans `app/galerie/page.tsx`
- [x] Remplacer la boucle `Array(6)` par un map sur les vraies données
- [x] Afficher les informations réelles : titre, prix, technique, disponibilité

## Section 4: Préparation images (2 tâches)

- [x] Décider de l'approche temporaire : gradient CSS ou images placeholder (ex: via.placeholder.com)
- [x] Implémenter l'affichage des images avec `next/image` si URLs externes, sinon garder les gradients

## Section 5: Validation & Testing (4 tâches)

- [x] Vérifier l'affichage responsive de la galerie (mobile, tablette, desktop)
- [x] Confirmer que tous les champs sont affichés correctement
- [x] Vérifier la cohérence des slugs (uniques, valides pour URLs)
- [x] Tester le hot reload avec modification des données

## Section 6: Documentation (1 tâche)

- [x] Ajouter des commentaires dans `data/artworks.ts` expliquant la structure temporaire (sera remplacée par Sanity en V1)
