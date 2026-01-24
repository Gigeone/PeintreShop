# Design: Ajouter les données mockées pour la galerie MVP

## Décisions Architecturales

### 1. Structure de dossiers
**Décision** : Créer deux nouveaux dossiers à la racine
- `types/` pour les interfaces TypeScript
- `data/` pour les données mockées

**Raison** :
- Séparation claire entre types (réutilisables) et données (temporaires)
- Facilite la migration vers Sanity en V1 (remplacer `data/` par queries Sanity)
- Convention Next.js standard

**Alternatives considérées** :
- Tout dans `lib/` (trop générique pour le MVP)
- Colocation avec composants (moins maintenable)

---

### 2. Type Artwork
**Décision** : Interface TypeScript stricte avec tous les champs requis

```typescript
interface Artwork {
  id: string;           // Identifiant unique
  slug: string;         // URL-friendly (ex: "paysage-automnal")
  title: string;        // Titre de l'œuvre
  description: string;  // Description détaillée (2-3 phrases)
  price: number;        // Prix en euros (nombre)
  dimensions: {         // Objet structuré
    height: number;     // Hauteur en cm
    width: number;      // Largeur en cm
  };
  technique: string;    // Ex: "Huile sur toile", "Acrylique"
  isAvailable: boolean; // Disponibilité à la vente
  imageUrl: string;     // URL placeholder ou gradient CSS
}
```

**Raison** :
- Correspond exactement au schéma Sanity prévu en V1
- Types stricts pour éviter les erreurs
- Facilite l'auto-complétion dans l'IDE

---

### 3. Approche images temporaire
**Décision** : Utiliser des gradients CSS générés dynamiquement pour le MVP

**Raison** :
- Pas de dépendance externe (pas besoin de Cloudinary/Unsplash pour MVP)
- Chargement instantané (pas de requêtes HTTP)
- Visuel cohérent avec la palette pastel existante
- Sera remplacé par Sanity Assets en V1

**Alternatives considérées** :
- Services placeholder (via.placeholder.com, picsum.photos) → ajoute latence
- Images statiques dans `/public` → demande plus de travail design
- Laisser vide → moins professionnel

**Implémentation** :
```tsx
<div
  className="aspect-square bg-gradient-to-br"
  style={{
    background: `linear-gradient(135deg, ${artwork.imageUrl})`
  }}
/>
```

---

### 4. Nombre d'œuvres mockées
**Décision** : Créer 9 œuvres (grille 3×3)

**Raison** :
- Nombre impair = design visuellement équilibré
- Assez pour tester pagination future (V2)
- Pas trop pour rester gérable manuellement
- Grid responsive : 1 col mobile, 2 cols tablette, 3 cols desktop

---

### 5. Génération des slugs
**Décision** : Slugs manuels en kebab-case (ex: "lever-de-soleil-mediterraneen")

**Raison** :
- MVP = pas besoin de fonction de slugification automatique
- Contrôle total sur les URLs (SEO friendly)
- Sera géré par Sanity en V1 (auto-generation)

**Format** : `title.toLowerCase().replace(/\s+/g, '-').replace(/[éè]/g, 'e')`

---

### 6. Prix et variation
**Décision** : Prix entre 150€ et 800€ avec variation réaliste

**Raison** :
- Reflète des prix d'œuvres originales réalistes
- Variation basée sur taille et technique (huile > acrylique > aquarelle généralement)
- Permet de tester l'affichage de différents montants

**Exemples** :
- Petite aquarelle : 150€-250€
- Acrylique moyenne : 300€-500€
- Grande huile : 600€-800€

---

### 7. Disponibilité des œuvres
**Décision** : 7 œuvres disponibles, 2 vendues (isAvailable: false)

**Raison** :
- Teste l'affichage du statut "Vendu"
- Crédibilise le site (montre activité commerciale)
- Prépare la logique de gestion de stock

---

### 8. Structure du fichier data/artworks.ts
**Décision** : Export nommé `artworks` (tableau typé)

```typescript
import { Artwork } from '@/types/artwork';

export const artworks: Artwork[] = [
  { id: '1', slug: 'lever-de-soleil', ... },
  // ...
];
```

**Raison** :
- Import explicite (meilleure lisibilité)
- Permet d'ajouter d'autres exports si nécessaire (ex: `featuredArtworks`)
- Type safety garanti

---

## Impacts sur le code existant

### app/galerie/page.tsx
**Changement** : Remplacer la génération de placeholders par un map sur les données réelles

**Avant** :
```tsx
{[...Array(6)].map((_, i) => (
  <div key={i}>
    <h3>Œuvre {i + 1}</h3>
  </div>
))}
```

**Après** :
```tsx
{artworks.map((artwork) => (
  <div key={artwork.id}>
    <h3>{artwork.title}</h3>
    <p>{artwork.price}€</p>
    {!artwork.isAvailable && <span>Vendu</span>}
  </div>
))}
```

---

## Migration V1 (préparation)

**Ce changement facilite la migration vers Sanity** :
1. Les types TypeScript restent identiques (générés par Sanity CLI)
2. Remplacer `import { artworks } from '@/data/artworks'` par une query Sanity
3. Supprimer le fichier `data/artworks.ts`
4. Les composants UI ne changent pas (mêmes props)

**Exemple query Sanity (V1)** :
```typescript
const artworks = await sanityClient.fetch(`
  *[_type == "artwork"] {
    id, slug, title, description, price,
    dimensions, technique, isAvailable,
    "imageUrl": image.asset->url
  }
`);
```

---

## Questions ouvertes

Aucune - le scope est clair et ne nécessite pas de décisions techniques complexes.
