# Design - Configuration Sanity CMS

## Contexte

Sanity CMS est un headless CMS qui permet de structurer, gérer et livrer du contenu via une API. Pour ce projet, nous l'utilisons comme source de vérité unique pour les œuvres d'art, remplaçant les données mockées statiques du MVP.

### Contraintes

**Techniques:**
- Next.js 15 avec App Router (Server Components par défaut)
- TypeScript strict mode
- Vercel hosting (serverless functions)
- Plan gratuit Sanity (80k requêtes/mois, 10GB bandwidth)

**Business:**
- Interface utilisable par l'artiste (non-développeur)
- Upload d'images haute qualité
- Gestion de disponibilité en temps réel
- Performance (temps de chargement < 2s)

**Sécurité:**
- Token API non exposé au client
- Studio accessible uniquement aux utilisateurs autorisés
- Validation des données côté Sanity

## Goals / Non-Goals

### Goals
- ✅ Configuration Sanity complète et fonctionnelle
- ✅ Schémas Artwork et SiteSettings prêts pour production
- ✅ Studio Sanity accessible en local et production
- ✅ Client Sanity configuré pour queries depuis Next.js
- ✅ Types TypeScript générés et validés
- ✅ Helper images pour optimisation automatique
- ✅ Documentation pour créer/éditer du contenu

### Non-Goals
- ❌ Migration automatique des données mockées (sera fait après)
- ❌ Remplacement des pages frontend par queries Sanity (sera fait après)
- ❌ Preview mode (V2)
- ❌ Webhooks pour revalidation (V2)
- ❌ Internationalisation (V2)
- ❌ Permissions avancées utilisateurs (V2)

## Décisions Architecturales

### Décision 1 : Embedded Studio vs Hosted Studio

**Options:**
1. **Embedded Studio** - Route `/studio` dans Next.js
2. **Hosted Studio** - Studio séparé sur `studio.monsite.com`

**Choisi:** Embedded Studio (Option 1)

**Raisons:**
- Simplicité : Un seul déploiement (Next.js + Studio)
- Pas besoin de domaine/sous-domaine séparé
- Authentification unifiée via Sanity
- Déploiement automatique avec Vercel
- Recommandé par Sanity pour Next.js

**Trade-offs:**
- Build time légèrement plus long (Studio inclus)
- Taille du bundle légèrement plus grande (Studio code)
- Acceptable car Studio n'est pas chargé sur les pages publiques

### Décision 2 : Dataset `production` vs `development`

**Options:**
1. Dataset unique `production`
2. Deux datasets : `development` et `production`

**Choisi:** Dataset unique `production` (Option 1)

**Raisons:**
- Simplicité pour artiste : une seule source de contenu
- Pas de synchronisation nécessaire entre environnements
- Plan gratuit Sanity : quotas par projet, pas par dataset
- L'artiste n'aura pas besoin d'environnement de staging

**Trade-offs:**
- Modifications directement en production
- Mitigation : prévisualisation dans Studio avant publication
- Possibilité d'ajouter dataset `development` plus tard si besoin

### Décision 3 : CDN activé (`useCdn: true`) vs temps réel

**Options:**
1. `useCdn: true` - Données servies depuis CDN Sanity
2. `useCdn: false` - Données depuis API en temps réel

**Choisi:** `useCdn: true` (Option 1)

**Raisons:**
- Performance optimale (CDN global)
- Réduit le nombre de requêtes API (respect du quota gratuit)
- Latence < 50ms dans le monde entier
- Stale time acceptable (max 60 secondes)

**Trade-offs:**
- Délai de propagation jusqu'à 60s après modification
- Acceptable : les œuvres ne changent pas en temps réel
- Pour Studio (mutations), CDN est automatiquement bypassé

### Décision 4 : Structure des schémas

**Option choisie:** Schémas simples et plats

**Artwork Schema:**
```typescript
{
  title: string
  slug: string (auto-généré)
  description: text
  image: image (avec hotspot)
  price: number
  dimensions: { height: number, width: number }
  technique: string
  isAvailable: boolean
  isFeatured: boolean
}
```

**Raisons:**
- Correspond exactement au type TypeScript actuel
- Pas de relations complexes
- Facile à comprendre pour l'artiste
- Performant (pas de nested references)

**Alternative rejetée:** Schémas avec références
- Artwork → Artist (relation)
- Artwork → Category (relation)
- Trop complexe pour V1, peut être ajouté en V2 si besoin

### Décision 5 : Image handling - Sanity Assets vs Cloudinary

**Options:**
1. **Sanity Assets** - CDN images natif Sanity
2. **Cloudinary** - Service externe images

**Choisi:** Sanity Assets (Option 1)

**Raisons:**
- Inclus dans Sanity (pas de service externe)
- Optimisation automatique (WebP, AVIF)
- Transformation à la volée (resize, crop, quality)
- Hotspot/crop intégré dans Studio
- Plan gratuit généreux (10GB bandwidth)

**Trade-offs:**
- Moins de contrôle fin que Cloudinary
- Suffisant pour V1 (moins de 50 œuvres)

### Décision 6 : Queries GROQ vs GraphQL

**Options:**
1. **GROQ** - Language de query natif Sanity
2. **GraphQL** - API GraphQL générée par Sanity

**Choisi:** GROQ (Option 1)

**Raisons:**
- Plus simple et concis que GraphQL
- Performance supérieure (pas de layer GraphQL)
- Recommandé par Sanity pour Next.js
- Documentation et exemples abondants
- Playground intégré (Vision plugin)

**Exemples:**
```groq
// Toutes les œuvres disponibles
*[_type == "artwork" && isAvailable == true] | order(createdAt desc)

// Œuvre par slug
*[_type == "artwork" && slug.current == $slug][0]

// Œuvres featured
*[_type == "artwork" && isFeatured == true] | order(createdAt desc)[0...5]
```

### Décision 7 : Types TypeScript - Générés vs Manuels

**Options:**
1. **Types générés** - Via `sanity typegen generate`
2. **Types manuels** - Écrits à la main

**Choisi:** Combinaison (Option 1 + manuels)

**Approche:**
- Types Sanity générés automatiquement depuis schémas
- Types frontend manuels (Artwork) pour compatibilité avec code existant
- Mapping layer si nécessaire entre types Sanity et types frontend

**Raisons:**
- Type-safety maximale
- Évite la duplication de définitions
- Facilite les refactoring
- Détecte les breaking changes automatiquement

### Décision 8 : Studio Plugins

**Plugins inclus:**
1. **Vision** - Playground GROQ pour tester queries
2. **Media** - Gestionnaire d'assets amélioré (si besoin)

**Raisons:**
- Vision essentiel pour debugging
- Media plugin optionnel, peut être ajouté plus tard

**Plugins exclus pour V1:**
- Dashboard widgets (trop complexe)
- Custom workflows (pas nécessaire)
- Desk tool customization (default suffit)

## Architecture des Fichiers

```
sanity/
├── sanity.config.ts           # Configuration Studio
├── schema.ts                  # Export des schémas
├── schemas/
│   ├── artwork.ts             # Schéma Artwork
│   └── siteSettings.ts        # Schéma SiteSettings
└── README.md                  # Documentation

lib/sanity/
├── client.ts                  # Client Sanity configuré
├── image.ts                   # Helper urlFor images
└── queries.ts                 # Queries GROQ prédéfinies

types/
├── sanity.ts                  # Types générés Sanity
└── artwork.ts                 # Type Artwork (existant, updated)

app/studio/[[...index]]/
└── page.tsx                   # Route Studio embedded
```

## Queries GROQ Prédéfinies

### Query 1 : Toutes les œuvres
```groq
*[_type == "artwork"] | order(createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "imageUrl": image.asset->url,
  price,
  dimensions,
  technique,
  isAvailable,
  isFeatured
}
```

### Query 2 : Œuvre par slug
```groq
*[_type == "artwork" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  "imageUrl": image.asset->url,
  "imageLqip": image.asset->metadata.lqip,
  price,
  dimensions,
  technique,
  isAvailable,
  isFeatured
}
```

### Query 3 : Œuvres featured
```groq
*[_type == "artwork" && isFeatured == true] | order(createdAt desc)[0...5] {
  _id,
  title,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  price
}
```

### Query 4 : Site settings
```groq
*[_type == "siteSettings"][0] {
  title,
  description,
  contactEmail,
  instagramUrl,
  "metaImageUrl": metaImage.asset->url
}
```

## Migration Path (MVP → V1)

### Phase actuelle : MVP avec données mockées
```
data/artworks.ts (static data)
  ↓
Components (import statique)
```

### Phase intermédiaire : Sanity configuré, mais pas connecté
```
data/artworks.ts (static data)
  ↓
Components (import statique)

Sanity CMS (parallèle, non connecté)
  ↓
Studio accessible
```

### Phase finale : V1 avec Sanity connecté
```
Sanity CMS
  ↓
lib/sanity/queries.ts (GROQ)
  ↓
Server Components (fetch)
  ↓
Components (props)
```

## Risques et Trade-offs

### Risque 1 : Quota Sanity dépassé

**Probabilité:** Faible
**Impact:** Moyen
**Mitigation:**
- Plan gratuit : 80k requêtes/mois
- Avec CDN activé, ~100 requêtes/jour en moyenne
- Monitoring via dashboard Sanity
- Upgrade vers plan payant ($99/mois) si nécessaire

### Risque 2 : Performance images

**Probabilité:** Faible
**Impact:** Faible
**Mitigation:**
- Sanity CDN très performant (Fastly)
- Optimisation automatique WebP/AVIF
- LQIP (Low Quality Image Placeholder) inclus
- Next.js Image pour lazy loading

### Risque 3 : Types TypeScript incompatibles

**Probabilité:** Moyen
**Impact:** Moyen
**Mitigation:**
- Mapper les types Sanity vers types frontend existants
- Adaptateur `mapSanityToArtwork()` si nécessaire
- Tests unitaires pour valider mapping

### Risque 4 : Studio inaccessible en production

**Probabilité:** Faible
**Impact:** Bloquant
**Mitigation:**
- Tester Studio en preview deploy Vercel
- Vérifier variables d'env configurées
- Fallback : utiliser studio.sanity.io (hosted)

## Migration Plan

### Étape 1 : Configuration Sanity (CE CHANGEMENT)
- Installation et configuration
- Schémas créés
- Studio accessible
- Queries GROQ testées

### Étape 2 : Migration des données (PROCHAIN CHANGEMENT)
- Créer les 9 œuvres mockées dans Sanity
- Uploader les vraies images
- Vérifier que toutes les données sont correctes

### Étape 3 : Connexion Frontend (CHANGEMENT SUIVANT)
- Remplacer `import { artworks }` par queries Sanity
- Mettre à jour les pages pour utiliser Server Components
- Supprimer `data/artworks.ts` (legacy)

### Étape 4 : Tests et Validation
- Tests Playwright mis à jour
- Vérifier que tout fonctionne comme avant
- Performance check

## Open Questions

**Q1 : L'artiste a-t-il un compte Sanity ?**
- Si non, créer un compte gratuit
- Si oui, réutiliser le project ID

**Q2 : Qui aura accès au Studio ?**
- Uniquement l'artiste
- Invitation d'autres utilisateurs plus tard si besoin

**Q3 : Images réelles disponibles ?**
- Utiliser les vraies images lors de la migration
- Sinon, placeholders temporaires

**Q4 : Besoin de brouillons (drafts) ?**
- Sanity supporte les drafts nativement
- À activer si l'artiste veut prévisualiser avant publication
- Pour V1, publication directe suffit

## Références

**Documentation:**
- Sanity Next.js guide: https://www.sanity.io/docs/nextjs
- GROQ documentation: https://www.sanity.io/docs/groq
- Schema types: https://www.sanity.io/docs/schema-types

**Exemples:**
- Next.js + Sanity starter: https://github.com/sanity-io/nextjs-blog-cms-sanity-v3
- E-commerce with Sanity: https://www.sanity.io/guides/e-commerce
