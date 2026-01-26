# Proposition : Configuration Sanity CMS

## Contexte

Le MVP utilise actuellement des données mockées statiques (`data/artworks.ts`) pour afficher les œuvres dans la galerie. Cette approche fonctionne pour un prototype mais ne permet pas à l'artiste de gérer son contenu de manière autonome. Pour passer à la V1, nous devons intégrer Sanity CMS comme source de vérité unique pour toutes les données du site (œuvres, pages, paramètres).

## Objectif

Mettre en place Sanity CMS comme système de gestion de contenu headless pour permettre à l'artiste de :
- Créer, modifier et supprimer des œuvres via Sanity Studio
- Uploader et gérer les images des œuvres
- Contrôler la disponibilité et la mise en vedette des œuvres
- Gérer les paramètres du site (informations de contact, réseaux sociaux)

Cette configuration est la **première étape critique de la V1** et bloque toutes les autres fonctionnalités V1 (Stripe, emails).

## Portée (Scope)

### Dans le scope

**Configuration Sanity:**
- Installation des dépendances Sanity (`@sanity/client`, `@sanity/image-url`, `next-sanity`)
- Configuration du projet Sanity (project ID, dataset)
- Variables d'environnement pour connexion sécurisée

**Schémas Sanity Studio:**
- Schéma `artwork` (œuvre) avec tous les champs nécessaires
- Schéma `siteSettings` (paramètres globaux du site)
- Configuration du Studio avec prévisualisation

**Client Sanity Frontend:**
- Client Sanity configuré pour les requêtes depuis Next.js
- Helper `sanityClient` pour les queries GROQ
- Helper `urlFor` pour les URLs d'images optimisées

**Types TypeScript:**
- Types générés depuis les schémas Sanity
- Mise à jour du type `Artwork` existant pour correspondre au schéma Sanity

**Sanity Studio:**
- Configuration du Studio dans `sanity/` à la racine
- Route `/studio` pour accéder à l'interface d'administration
- Déploiement du Studio sur Vercel

### Hors scope (V1 ultérieur ou V2)

- Migration des données mockées vers Sanity (sera fait après configuration)
- Remplacement des queries statiques par des queries Sanity (sera fait après configuration)
- Page dynamique (sera fait dans un changement séparé)
- Schéma `page` pour les pages statiques (reporté après artwork)
- Preview mode pour Sanity (V2)
- Webhooks Sanity pour revalidation (V2)
- Internationalisation des contenus (V2)

## Approche Technique

### Installation et Configuration

**1. Dépendances NPM:**
```bash
npm install @sanity/client @sanity/image-url next-sanity
npm install -D @sanity/types
```

**2. Structure des fichiers:**
```
sanity/
├── schema.ts              # Point d'entrée des schémas
├── schemas/
│   ├── artwork.ts         # Schéma œuvre
│   └── siteSettings.ts    # Paramètres du site
├── lib/
│   ├── client.ts          # Client Sanity configuré
│   └── image.ts           # Helper pour images
└── sanity.config.ts       # Configuration Studio
```

**3. Variables d'environnement (.env.local):**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx (pour mutations)
```

### Schémas Sanity

**Artwork Schema:**
- `title` (string, required)
- `slug` (slug, auto-généré depuis title, required)
- `description` (text, required)
- `image` (image, required, avec metadata)
- `price` (number, required, validation min: 0)
- `dimensions` (object: height, width en cm)
- `technique` (string, required)
- `isAvailable` (boolean, default: true)
- `isFeatured` (boolean, default: false)
- `createdAt` (datetime, auto)
- `updatedAt` (datetime, auto)

**SiteSettings Schema (singleton):**
- `title` (string) - Nom du site
- `description` (text) - Description pour SEO
- `contactEmail` (string)
- `instagramUrl` (url)
- `metaImage` (image) - Image par défaut pour Open Graph

### Client Sanity

**Configuration du client:**
```typescript
// lib/sanity/client.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true, // false pour données temps réel, true pour performance
})
```

**Helper pour images:**
```typescript
// lib/sanity/image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

### Sanity Studio

**Route Next.js `/studio`:**
- Embedded Sanity Studio dans Next.js App Router
- Authentification Sanity requise
- Interface d'administration accessible uniquement aux éditeurs

**Configuration Studio:**
- Plugins: vision (pour tester les queries GROQ)
- Schémas: artwork, siteSettings
- Preview: aperçu des œuvres dans le Studio

## Bénéfices Utilisateur

### Pour l'artiste
- **Autonomie complète**: Gestion du contenu sans développeur
- **Interface intuitive**: Studio Sanity user-friendly
- **Upload direct d'images**: Drag & drop avec optimisation automatique
- **Prévisualisation**: Voir les changements avant publication
- **Workflow simplifié**: Création d'œuvre en quelques clics

### Pour les visiteurs
- **Contenu à jour**: Nouvelles œuvres disponibles immédiatement
- **Performance**: CDN Sanity pour chargement rapide des images
- **Fiabilité**: Source de données professionnelle et stable

### Pour le développement
- **Type-safety**: Types TypeScript générés automatiquement
- **Flexibilité**: Queries GROQ puissantes pour récupérer les données
- **Scalabilité**: Sanity supporte des milliers d'entrées sans problème
- **SEO**: Métadonnées structurées pour meilleur référencement

## Mesures de Succès

### Critères d'acceptation
- ✅ Projet Sanity créé avec project ID et dataset
- ✅ Dépendances Sanity installées et configurées
- ✅ Schéma `artwork` créé avec tous les champs requis
- ✅ Schéma `siteSettings` créé (singleton)
- ✅ Client Sanity configuré avec variables d'environnement
- ✅ Helper `urlFor` pour images fonctionnel
- ✅ Route `/studio` accessible et fonctionnelle
- ✅ Possibilité de créer une œuvre dans le Studio
- ✅ Types TypeScript générés et sans erreur
- ✅ Documentation des queries GROQ de base

### Validation technique
- `npm run type-check` passe sans erreur
- Variables d'environnement correctement configurées
- Studio accessible en local et en production
- Possibilité d'uploader une image test
- Query GROQ test retourne les données

## Risques et Mitigation

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Compte Sanity non créé | Bloquant | Faible | Créer compte avant de commencer |
| Variables d'environnement incorrectes | Bloquant | Moyen | Valider avec query test |
| Types incompatibles avec code existant | Moyen | Moyen | Garder rétrocompatibilité avec type Artwork |
| Studio inaccessible en production | Moyen | Faible | Tester déploiement Vercel |
| Quota Sanity dépassé (gratuit) | Faible | Faible | Plan gratuit suffisant pour MVP/V1 |

## Dépendances

### Bloque
- Migration des données mockées vers Sanity (changement suivant)
- Connexion Frontend avec Sanity (changement suivant)
- Configuration Stripe (nécessite artwork IDs Sanity)
- Emails automatiques (nécessite données Sanity)

### Bloqué par
- ✅ MVP complété et déployé (fait)
- ✅ Structure TypeScript et types Artwork existants (fait)

### Séquence recommandée
1. **[CE CHANGEMENT]** Configuration Sanity CMS
2. Migration des données mockées → Sanity
3. Remplacement des queries statiques par Sanity queries
4. Configuration Stripe avec Sanity IDs
5. Emails automatiques

## Alternatives Considérées

### Alternative 1 : Contentful CMS
**Rejeté** - Plus cher, moins flexible pour les images, moins populaire dans l'écosystème React/Next.js

### Alternative 2 : Strapi (self-hosted)
**Rejeté** - Nécessite serveur dédié, plus de maintenance, complexité infrastructure

### Alternative 3 : Prisma + PostgreSQL
**Rejeté** - Pas d'interface d'administration prête, nécessite développement admin panel, plus complexe

### Alternative 4 : Utiliser Vercel KV / Postgres
**Rejeté** - Pas d'interface d'administration visuelle, pas adapté pour gestion de contenu par non-développeur

**Pourquoi Sanity ?**
- Interface d'administration clé en main
- Excellent support Next.js et TypeScript
- CDN images optimisé inclus
- Plan gratuit généreux
- Communauté active et documentation excellente

## Questions Ouvertes

### Questions pour l'utilisateur

1. **Compte Sanity**: Avez-vous déjà un compte Sanity.io ou faut-il en créer un nouveau ?
   - Si oui, fournir project ID
   - Si non, je guide pour la création

2. **Dataset**: Utiliser `production` ou `development` pour commencer ?
   - Recommandation : `production` pour simplifier

3. **Accès Studio**: Qui aura accès à Sanity Studio ?
   - L'artiste uniquement
   - Plusieurs utilisateurs (nécessite invitations)

4. **Images existantes**: Les images des œuvres actuelles (mockdata) sont-elles disponibles pour migration ?
   - Chemin vers les images réelles
   - Ou utiliser placeholders temporaires

### Questions techniques (à résoudre pendant implémentation)

- Utiliser `useCdn: true` ou `false` pour le client ? (recommandation: true pour performance)
- Activer GROQ playground en production ? (recommandation: non pour sécurité)
- Configurer image hotspot/crop dans le schéma ? (recommandation: oui pour flexibilité)

## Notes Additionnelles

**Temps estimé:** 2-3 heures
- Installation et configuration : 30 min
- Création schémas : 45 min
- Configuration Studio : 30 min
- Tests et validation : 45 min

**Prérequis:**
- Compte Sanity.io (gratuit)
- Vercel déployé et fonctionnel
- Accès aux variables d'environnement Vercel

**Documentation utile:**
- https://www.sanity.io/docs
- https://www.sanity.io/docs/nextjs
- https://www.sanity.io/docs/studio
