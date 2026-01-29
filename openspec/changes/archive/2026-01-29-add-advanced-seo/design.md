# Design: Advanced SEO System

**Change ID**: `add-advanced-seo`

## Architecture Overview

Ce changement introduit un système SEO complet organisé en 4 composants principaux :

```
┌─────────────────────────────────────────────────────────────┐
│                        SEO System                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Structured   │  │   Metadata   │  │   Sitemap    │      │
│  │    Data      │  │   Helpers    │  │  Generator   │      │
│  │ (Schema.org) │  │  (OG, TC)    │  │  (Dynamic)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Types (SEO)   │                        │
│                    │   TypeScript   │                        │
│                    └────────────────┘                        │
│                                                               │
│         ┌──────────────────────────────────┐                 │
│         │        Robots.txt Config         │                 │
│         └──────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. Types Layer (`types/seo.ts`)

**Responsabilité** : Définir les types TypeScript pour garantir la cohérence et la sécurité des types.

**Types principaux** :
- `ProductSchema` : Schema.org Product
- `OrganizationSchema` : Schema.org Organization
- `WebSiteSchema` : Schema.org WebSite avec SearchAction
- `BreadcrumbSchema` : Schema.org BreadcrumbList
- `OpenGraphMetadata` : Open Graph tags
- `TwitterCardMetadata` : Twitter Card tags

**Décision** : Types stricts plutôt que `any` pour éviter les erreurs au runtime.

---

### 2. Schema.org Generators (`lib/seo/schema.ts`)

**Responsabilité** : Générer des objets JSON-LD valides pour Schema.org.

**Fonctions** :
```typescript
generateProductSchema(artwork: Artwork, siteUrl: string): ProductSchema
generateOrganizationSchema(siteUrl: string): OrganizationSchema
generateWebSiteSchema(siteUrl: string): WebSiteSchema
generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema
```

**Pattern** : Factory functions qui prennent des données métier et retournent du JSON-LD.

**Décision** : Fonctions pures (pas d'effets de bord) pour faciliter les tests.

---

### 3. Metadata Helpers (`lib/seo/metadata.ts`)

**Responsabilité** : Générer des objets Metadata Next.js pour Open Graph et Twitter Cards.

**Fonctions** :
```typescript
generateOpenGraph(params: OGParams): Metadata['openGraph']
generateTwitterCard(params: TCParams): Metadata['twitter']
getCanonicalUrl(path: string): string
getSiteUrl(): string
```

**Pattern** : Wrapper autour de l'API Metadata de Next.js pour réutilisabilité.

**Décision** : Centraliser la logique de génération des métadonnées pour éviter la duplication.

---

### 4. Sitemap Generator (`app/sitemap.ts`)

**Responsabilité** : Générer dynamiquement le sitemap.xml depuis Sanity.

**Architecture** :
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all artworks from Sanity
  const artworks = await getAllArtworks();

  // 2. Generate static routes
  const staticRoutes = [...];

  // 3. Generate dynamic routes (artworks)
  const dynamicRoutes = artworks.map(artwork => ({...}));

  // 4. Combine and return
  return [...staticRoutes, ...dynamicRoutes];
}
```

**Décision** : Utiliser ISR avec `revalidate` pour équilibrer fraîcheur et performance.

---

### 5. Robots Configuration (`app/robots.ts`)

**Responsabilité** : Configurer les directives robots.txt.

**Architecture** :
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api/'],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
```

**Décision** : Configuration simple et statique (pas besoin de dynamisme).

---

## Data Flow

### Flow 1: Schema.org Injection

```
[Sanity] → [getArtworkBySlug] → [Artwork Data]
                                       ↓
                              [generateProductSchema]
                                       ↓
                            [JSON-LD Object] → [<script type="application/ld+json">]
                                       ↓
                                  [Page HTML]
```

### Flow 2: Metadata Generation

```
[Page Component] → [generateMetadata function]
                            ↓
              [generateOpenGraph / generateTwitterCard]
                            ↓
                   [Metadata Object]
                            ↓
                    [Next.js <head>]
```

### Flow 3: Sitemap Generation

```
[Crawler Request /sitemap.xml]
         ↓
  [app/sitemap.ts]
         ↓
  [Fetch Sanity Data]
         ↓
  [Generate URL List]
         ↓
  [Return XML]
  (cached via ISR)
```

---

## Key Design Decisions

### Decision 1: Native Next.js APIs vs External Library

**Options** :
- A) Utiliser `next-seo` library
- B) Utiliser les APIs natives Next.js 14+

**Choix** : B (APIs natives)

**Raison** :
- Next.js 14+ a des APIs Metadata natives très complètes
- Évite une dépendance externe
- Meilleur contrôle et flexibilité
- Plus léger (moins de code bundlé)

---

### Decision 2: Schema.org Placement

**Options** :
- A) Injecter via `<head>` avec next/head
- B) Injecter directement dans le JSX de page
- C) Utiliser un hook custom

**Choix** : B (JSX direct)

**Raison** :
- Compatible avec Server Components
- Plus simple et explicite
- Pas besoin de hook ou composant supplémentaire
- SSR garanti

---

### Decision 3: Sitemap Update Strategy

**Options** :
- A) Régénérer à chaque build
- B) ISR avec revalidation périodique
- C) On-demand revalidation via API

**Choix** : B (ISR avec revalidate=3600)

**Raison** :
- Équilibre entre fraîcheur (1h max) et performance
- Pas besoin d'action manuelle
- Scalable pour grands catalogues
- Option C réservée pour V2 si besoin

---

### Decision 4: Image Optimization for Open Graph

**Options** :
- A) Utiliser images Sanity brutes
- B) Transformer les images avec Sanity API
- C) Générer des images OG dédiées

**Choix** : B (Transformation Sanity)

**Raison** :
- Images déjà sur Sanity CDN
- API de transformation performante
- Respect des dimensions OG (1200x630)
- Option C trop complexe pour MVP

---

### Decision 5: Canonical URL Strategy

**Options** :
- A) Toujours avec trailing slash
- B) Toujours sans trailing slash
- C) Gérer les deux cas

**Choix** : B (sans trailing slash)

**Raison** :
- Cohérent avec convention Next.js
- Plus propre et standard
- Évite la duplication de contenu

---

## Performance Considerations

### Sitemap Generation

**Problème potentiel** : Query Sanity peut être lent si beaucoup d'œuvres.

**Solution** :
- ISR cache le résultat (revalidate=3600)
- Query optimisé : seulement les champs nécessaires (slug, _updatedAt)
- Pagination si > 1000 œuvres (peu probable)

**Metriques attendues** :
- Génération initiale : < 2s (pour 100-500 œuvres)
- Requêtes suivantes : < 50ms (cache)

---

### Schema.org Generation

**Problème potentiel** : Génération côté serveur à chaque requête.

**Solution** :
- Fonctions pures et légères (pas de query externe)
- Server Components cachés par Next.js automatiquement
- JSON.stringify() natif très rapide

**Impact** : Négligeable (< 10ms par page)

---

## Security Considerations

### 1. XSS via Schema.org

**Risque** : Injection de code dans les données JSON-LD.

**Mitigation** :
- Sanity valide les inputs côté CMS
- `JSON.stringify()` échappe automatiquement les caractères dangereux
- Pas d'utilisation de `dangerouslySetInnerHTML`

---

### 2. Exposition de Données Sensibles

**Risque** : Exposer des données privées dans sitemap ou métadonnées.

**Mitigation** :
- Sitemap : seulement pages publiques (pas d'API routes, pas de studio)
- Métadonnées : seulement données publiques (prix, disponibilité)
- Pas d'emails ni informations client

---

### 3. Crawlers Malveillants

**Risque** : Crawlers agressifs saturant le serveur.

**Mitigation** :
- Robots.txt avec Crawl-delay si nécessaire
- Rate limiting Vercel (déjà en place)
- ISR cache protège contre requêtes répétées

---

## Testing Strategy

### Unit Tests
- [ ] Tester `generateProductSchema()` avec données mockées
- [ ] Tester `generateOpenGraph()` avec différents paramètres
- [ ] Tester `getCanonicalUrl()` avec différents paths

### Integration Tests
- [ ] Tester génération du sitemap avec Sanity mock
- [ ] Tester présence Schema.org dans HTML (Playwright)
- [ ] Tester métadonnées dans `<head>` (Playwright)

### Validation Tests
- [ ] Google Rich Results Test pour Schema.org
- [ ] Facebook Debugger pour Open Graph
- [ ] Twitter Card Validator
- [ ] Google Search Console sitemap validator

### Performance Tests
- [ ] Lighthouse SEO audit ≥ 95
- [ ] Temps de génération sitemap < 2s
- [ ] Temps de réponse /sitemap.xml < 100ms (cached)

---

## Migration Path

### Phase 1: Implementation
1. Créer types et helpers
2. Implémenter sitemap et robots
3. Enrichir métadonnées existantes
4. Ajouter Schema.org

### Phase 2: Validation
1. Tests Lighthouse
2. Validation Schema.org
3. Tests de partage réseaux sociaux

### Phase 3: Monitoring (Post-Deploy)
1. Soumettre sitemap à Google Search Console
2. Monitorer indexation
3. Vérifier apparition rich snippets (2-4 semaines)

---

## Future Enhancements (V2)

- **Structured data testing automatisé** : Tests E2E validant Schema.org
- **Hreflang tags** : Support multi-langue
- **AMP pages** : Version AMP pour mobile ultra-rapide
- **Advanced rich snippets** : FAQ Schema, Review Schema
- **SEO dashboard** : Monitoring positions et trafic organique
- **On-demand ISR** : Revalidation instantanée du sitemap via webhook Sanity

---

## References

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Product](https://schema.org/Product)
- [Sitemaps.org Protocol](https://www.sitemaps.org/protocol.html)
- [Google Search Central](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me/)
