# Tasks - Configuration Sanity CMS

## 0. Préparation

- [ ] 0.1 Créer compte Sanity.io (si nécessaire)
- [ ] 0.2 Créer nouveau projet Sanity via CLI ou interface web
- [ ] 0.3 Noter le project ID et créer un token API
- [ ] 0.4 Configurer les variables d'environnement locales

## 1. Installation des Dépendances

- [ ] 1.1 Installer les packages Sanity requis
  ```bash
  npm install @sanity/client @sanity/image-url next-sanity
  npm install -D @sanity/types
  ```
- [ ] 1.2 Vérifier que les dépendances sont dans package.json
- [ ] 1.3 Tester `npm install` pour confirmer compatibilité

## 2. Configuration Variables d'Environnement

- [ ] 2.1 Ajouter les variables dans `.env.local`
  - NEXT_PUBLIC_SANITY_PROJECT_ID
  - NEXT_PUBLIC_SANITY_DATASET (production)
  - SANITY_API_TOKEN
- [ ] 2.2 Mettre à jour `.env.example` avec les nouvelles variables
- [ ] 2.3 Ajouter les variables d'environnement sur Vercel (dans le dashboard)
- [ ] 2.4 Redéployer sur Vercel si nécessaire

## 3. Structure Sanity

- [ ] 3.1 Créer le dossier `sanity/` à la racine du projet
- [ ] 3.2 Créer `sanity/sanity.config.ts` avec configuration de base
- [ ] 3.3 Créer `sanity/schema.ts` (point d'entrée des schémas)
- [ ] 3.4 Créer `sanity/schemas/` pour les schémas individuels

## 4. Schémas Sanity

- [ ] 4.1 Créer `sanity/schemas/artwork.ts` avec le schéma complet
  - title (string, required)
  - slug (slug, auto-généré, required)
  - description (text, required)
  - image (image avec hotspot/crop, required)
  - price (number, required, min: 0)
  - dimensions (object: height, width)
  - technique (string, required)
  - isAvailable (boolean, default: true)
  - isFeatured (boolean, default: false)
  - createdAt, updatedAt (datetime)
- [ ] 4.2 Créer `sanity/schemas/siteSettings.ts` (singleton)
  - title (string)
  - description (text)
  - contactEmail (string, email validation)
  - instagramUrl (url)
  - metaImage (image)
- [ ] 4.3 Exporter les schémas dans `sanity/schema.ts`
- [ ] 4.4 Configurer les icônes et descriptions pour chaque schéma

## 5. Client Sanity

- [ ] 5.1 Créer `lib/sanity/client.ts` avec configuration du client
  - projectId depuis env
  - dataset depuis env
  - apiVersion: '2024-01-01'
  - useCdn: true
- [ ] 5.2 Créer `lib/sanity/image.ts` avec helper urlFor
- [ ] 5.3 Créer `lib/sanity/queries.ts` pour les queries GROQ courantes
  - getAllArtworks
  - getArtworkBySlug
  - getFeaturedArtworks
  - getSiteSettings

## 6. Types TypeScript

- [ ] 6.1 Créer `types/sanity.ts` pour les types générés
- [ ] 6.2 Mettre à jour `types/artwork.ts` pour correspondre au schéma Sanity
- [ ] 6.3 Ajouter type SiteSettings
- [ ] 6.4 Vérifier avec `npm run type-check` (aucune erreur)

## 7. Sanity Studio Route

- [ ] 7.1 Créer `app/studio/[[...index]]/page.tsx` pour le Studio
- [ ] 7.2 Configurer l'authentification Sanity
- [ ] 7.3 Tester l'accès à `/studio` en local
- [ ] 7.4 Vérifier que le Studio affiche les schémas artwork et siteSettings

## 8. Tests et Validation

- [ ] 8.1 Créer une œuvre test dans Sanity Studio
  - Uploader une image
  - Remplir tous les champs requis
  - Sauvegarder
- [ ] 8.2 Tester une query GROQ depuis Vision (plugin Studio)
  - Query: `*[_type == "artwork"]`
  - Vérifier que l'œuvre test apparaît
- [ ] 8.3 Tester `urlFor` avec une image Sanity
- [ ] 8.4 Vérifier que les types TypeScript sont corrects

## 9. Documentation

- [ ] 9.1 Documenter les queries GROQ dans `lib/sanity/queries.ts`
- [ ] 9.2 Ajouter un README dans `sanity/README.md`
  - Comment accéder au Studio
  - Comment créer une nouvelle œuvre
  - Structure des schémas
- [ ] 9.3 Mettre à jour CLAUDE.md si nécessaire avec info Sanity
- [ ] 9.4 Documenter les variables d'environnement requises

## 10. Déploiement

- [ ] 10.1 Vérifier que les variables d'env sont configurées sur Vercel
- [ ] 10.2 Commiter tous les fichiers Sanity
- [ ] 10.3 Push vers GitHub (déploiement automatique Vercel)
- [ ] 10.4 Tester l'accès à `/studio` en production
- [ ] 10.5 Vérifier que le Studio fonctionne en production

## 11. Validation Finale

- [ ] 11.1 Créer 2-3 œuvres de test dans le Studio
- [ ] 11.2 Vérifier que les images sont uploadées correctement
- [ ] 11.3 Tester toutes les queries GROQ définies
- [ ] 11.4 Confirmer que `npm run build` réussit
- [ ] 11.5 Confirmer que `npm run type-check` passe sans erreur

## Notes d'Implémentation

**Dépendances entre tâches:**
- 0.x bloque tout (prérequis)
- 1.x → 2.x → 3.x (séquentiel)
- 4.x peut être en parallèle de 5.x
- 6.x dépend de 4.x et 5.x
- 7.x dépend de 3.x, 4.x, 5.x
- 8.x dépend de tout ce qui précède
- 9.x et 10.x peuvent être en parallèle après 8.x

**Temps estimé par section:**
- Section 0: 15 min (si compte existe) à 30 min (nouveau compte)
- Section 1-3: 30 min
- Section 4-5: 45 min
- Section 6-7: 30 min
- Section 8-11: 45 min

**Total: ~2h30 à 3h00**
