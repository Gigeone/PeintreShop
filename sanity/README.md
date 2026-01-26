# Sanity CMS - Documentation

## Accès au Studio

Le Sanity Studio est accessible via la route `/studio` :

- **Local** : http://localhost:3000/studio
- **Production** : https://votre-domaine.vercel.app/studio

### Authentification

1. Naviguez vers `/studio`
2. Cliquez sur "Sign in"
3. Utilisez votre compte Sanity (celui créé sur sanity.io)
4. Une fois connecté, vous avez accès à tous les contenus

## Structure des Schémas

### Artwork (Œuvre)

Schéma principal pour les œuvres d'art.

**Champs requis :**
- `title` : Titre de l'œuvre
- `slug` : Généré automatiquement depuis le titre (URL-friendly)
- `description` : Description détaillée (min 50 caractères)
- `image` : Photo haute qualité avec texte alternatif
- `price` : Prix en euros (≥ 0)
- `dimensions` : Hauteur et largeur en cm
- `technique` : Technique artistique (liste prédéfinie)

**Champs optionnels :**
- `isAvailable` : Disponible à la vente (défaut: true)
- `isFeatured` : Afficher sur la page d'accueil (défaut: false)
- `createdAt` : Date de création (auto-remplie)

### Site Settings (Paramètres du Site)

Singleton contenant les paramètres globaux du site.

**Champs :**
- `title` : Titre du site (SEO)
- `description` : Description du site (SEO, max 160 caractères)
- `contactEmail` : Email de contact
- `instagramUrl` : Lien Instagram
- `facebookUrl` : Lien Facebook (optionnel)
- `metaImage` : Image par défaut pour les partages sociaux
- `favicon` : Icône du site

## Créer une Nouvelle Œuvre

1. Accédez au Studio (`/studio`)
2. Cliquez sur "Œuvres" dans le menu latéral
3. Cliquez sur le bouton "+" ou "Create" en haut à droite
4. Remplissez tous les champs requis :
   - **Titre** : Nom de l'œuvre
   - **Slug** : Cliquez sur "Generate" pour créer automatiquement
   - **Description** : Décrivez l'œuvre en détail
   - **Image** : Drag & drop ou cliquez pour uploader
     - Ajoutez un texte alternatif pour l'accessibilité
     - Définissez un hotspot si nécessaire (point focal)
   - **Prix** : Montant en euros
   - **Dimensions** : Hauteur et largeur en cm
   - **Technique** : Sélectionnez dans la liste
5. Cochez "Disponible à la vente" si l'œuvre est à vendre
6. Cochez "Mise en vedette" pour l'afficher sur l'accueil
7. Cliquez sur "Publish" (en haut à droite)

## Modifier une Œuvre

1. Dans le Studio, cliquez sur "Œuvres"
2. Sélectionnez l'œuvre à modifier
3. Effectuez vos modifications
4. Cliquez sur "Publish" pour sauvegarder

## Marquer une Œuvre comme Vendue

1. Ouvrez l'œuvre dans le Studio
2. Décochez "Disponible à la vente"
3. Cliquez sur "Publish"
4. L'œuvre n'apparaîtra plus dans les filtres "disponibles"

## Queries GROQ

Les queries GROQ permettent de récupérer les données depuis Sanity.

### Tester une Query

1. Dans le Studio, cliquez sur "Vision" dans le menu (icône œil)
2. Entrez votre query GROQ
3. Cliquez sur "Execute" pour voir les résultats

### Exemples de Queries

**Toutes les œuvres :**
```groq
*[_type == "artwork"] | order(_createdAt desc)
```

**Œuvres disponibles :**
```groq
*[_type == "artwork" && isAvailable == true]
```

**Œuvre par slug :**
```groq
*[_type == "artwork" && slug.current == "mon-oeuvre"][0]
```

**Œuvres featured :**
```groq
*[_type == "artwork" && isFeatured == true][0...5]
```

## Types TypeScript

Les types TypeScript sont disponibles dans `/types/sanity.ts`.

Pour utiliser les types dans le code :

```typescript
import type { Artwork } from '@/types/artwork'

const artwork: Artwork = await getArtworkBySlug('mon-oeuvre')
```

## Optimisation des Images

Les images uploadées sur Sanity sont automatiquement optimisées :

- **CDN Global** : Fastly CDN pour des temps de chargement rapides
- **Format automatique** : WebP/AVIF si supporté, JPEG sinon
- **Transformation à la volée** : Resize, crop, quality ajustables
- **LQIP** : Low Quality Image Placeholder pour chargement progressif

Utilisation dans le code :

```typescript
import { urlFor } from '@/lib/sanity'

// URL simple
const imageUrl = urlFor(artwork.image).url()

// URL optimisée
const optimizedUrl = urlFor(artwork.image)
  .width(800)
  .height(600)
  .quality(90)
  .auto('format')
  .url()
```

## Déploiement du Studio

Le Studio est automatiquement déployé avec l'application Next.js sur Vercel.

**Important :** Configurez les variables d'environnement sur Vercel :
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`

## Support et Documentation

- **Documentation Sanity** : https://www.sanity.io/docs
- **GROQ Documentation** : https://www.sanity.io/docs/groq
- **Next.js + Sanity** : https://www.sanity.io/docs/nextjs

## Troubleshooting

### Le Studio ne s'affiche pas

1. Vérifiez que vous êtes sur `/studio`
2. Vérifiez les variables d'environnement dans `.env.local`
3. Vérifiez que les dépendances Sanity sont installées (`npm install`)

### Erreur "Project not found"

1. Vérifiez le `NEXT_PUBLIC_SANITY_PROJECT_ID` dans `.env.local`
2. Assurez-vous qu'il correspond à votre projet sur sanity.io

### Impossible de créer une œuvre

1. Vérifiez que vous êtes authentifié
2. Vérifiez que vous avez les permissions "Editor" ou "Admin"
3. Vérifiez le `SANITY_API_TOKEN` dans `.env.local`

### Les images ne s'affichent pas

1. Vérifiez que l'image a bien un asset URL
2. Vérifiez la configuration du helper `urlFor`
3. Testez l'URL directement dans le navigateur
