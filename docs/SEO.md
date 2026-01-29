# Guide SEO - PeintreShop

Ce document explique comment fonctionne le système SEO du site et comment maintenir/étendre les optimisations.

## Architecture SEO

Le système SEO est organisé en 4 composants :

```
types/seo.ts          → Types TypeScript
lib/seo/schema.ts     → Générateurs Schema.org
lib/seo/metadata.ts   → Helpers métadonnées
app/sitemap.ts        → Sitemap dynamique
app/robots.txt        → Configuration robots
```

## Schema.org JSON-LD

### Qu'est-ce que Schema.org ?

Schema.org est un vocabulaire de données structurées qui aide les moteurs de recherche à comprendre le contenu de vos pages et à afficher des **rich snippets** dans les résultats de recherche.

### Schemas implémentés

#### 1. Product Schema (Pages œuvres)

Affiche les œuvres comme des produits dans les résultats Google avec prix, disponibilité et image.

**Emplacement** : `app/oeuvres/[slug]/page.tsx`

**Code** :
```tsx
import { generateProductSchema } from "@/lib/seo/schema";

const productSchema = generateProductSchema(artwork, siteUrl);

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
/>
```

#### 2. Organization Schema (À propos & Homepage)

Identifie l'artiste comme organisation.

**Emplacement** : `app/a-propos/page.tsx`, `app/page.tsx`

**Code** :
```tsx
import { generateOrganizationSchema } from "@/lib/seo/schema";

const organizationSchema = generateOrganizationSchema(siteUrl);

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
/>
```

#### 3. WebSite Schema (Homepage)

Active la sitelinks searchbox dans Google.

**Emplacement** : `app/page.tsx`

**Code** :
```tsx
import { generateWebSiteSchema } from "@/lib/seo/schema";

const websiteSchema = generateWebSiteSchema(siteUrl);

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
/>
```

#### 4. BreadcrumbList Schema (Pages œuvres & Galerie)

Affiche le fil d'Ariane dans les résultats de recherche.

**Emplacement** : `app/galerie/page.tsx`, `app/oeuvres/[slug]/page.tsx`

**Code** :
```tsx
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Accueil", item: siteUrl },
  { name: "Galerie", item: `${siteUrl}/galerie` },
  { name: artwork.title, item: `${siteUrl}/oeuvres/${artwork.slug}` },
]);

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
/>
```

### Tester Schema.org

**Google Rich Results Test** : https://search.google.com/test/rich-results

1. Démarrer le serveur local : `npm run dev`
2. Copier l'URL de la page à tester (ex: `http://localhost:3000/oeuvres/assemblée-mystique`)
3. Coller dans le test Google
4. Vérifier qu'il n'y a pas d'erreur

---

## Métadonnées (Open Graph & Twitter Cards)

### Open Graph

Permet de contrôler l'apparence des liens partagés sur Facebook, LinkedIn, etc.

**Helper** : `generatePageMetadata()`

**Exemple** :
```tsx
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Titre de la Page",
  description: "Description de 120-160 caractères",
  path: "/ma-page",
  images: [{
    url: `${getSiteUrl()}/og-image.jpg`,
    width: 1200,
    height: 630,
    alt: "Description de l'image",
  }],
});
```

### Tester Open Graph

**Facebook Debugger** : https://developers.facebook.com/tools/debug/

**Twitter Card Validator** : https://cards-dev.twitter.com/validator

**LinkedIn Post Inspector** : https://www.linkedin.com/post-inspector/

---

## Sitemap.xml

### Fonctionnement

Le sitemap est généré **dynamiquement** depuis Sanity à chaque requête (avec cache ISR de 1h).

**Emplacement** : `app/sitemap.ts`

**URL** : `/sitemap.xml`

### Pages incluses

- Homepage (`/`)
- Galerie (`/galerie`)
- À propos (`/a-propos`)
- Contact (`/contact`)
- Toutes les œuvres (`/oeuvres/[slug]`)

### Priorités

| Page | Priority | Change Frequency |
|------|----------|------------------|
| Homepage | 1.0 | weekly |
| Galerie | 0.9 | daily |
| Œuvres disponibles | 0.8 | monthly |
| Œuvres vendues | 0.5 | monthly |
| À propos / Contact | 0.6 | monthly |

### Mise à jour

Le sitemap se met à jour automatiquement toutes les heures (ISR revalidate).

Pour forcer une mise à jour :
```bash
# En production sur Vercel
curl -X POST https://votre-site.com/api/revalidate?path=/sitemap.xml
```

---

## Robots.txt

### Configuration

**Emplacement** : `app/robots.ts`

**URL** : `/robots.txt`

**Contenu** :
```
User-Agent: *
Allow: /
Disallow: /studio
Disallow: /api/

Sitemap: https://votre-site.com/sitemap.xml
```

### Règles

- ✅ Autorise tous les crawlers
- ❌ Bloque `/studio` (Sanity admin)
- ❌ Bloque `/api/` (API routes privées)
- 🗺️ Pointe vers le sitemap

---

## Checklist pour Nouvelles Pages

Quand vous créez une nouvelle page, suivez cette checklist SEO :

### 1. Métadonnées

- [ ] Titre unique (50-60 caractères)
- [ ] Description unique (120-160 caractères)
- [ ] Open Graph avec image 1200x630px
- [ ] Twitter Card appropriée
- [ ] URL canonique

**Code** :
```tsx
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Mon Titre",
  description: "Ma description SEO optimisée",
  path: "/ma-nouvelle-page",
  images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
});
```

### 2. Schema.org (si pertinent)

- [ ] Choisir le schema approprié (Product, Article, FAQ, etc.)
- [ ] Générer le JSON-LD
- [ ] Ajouter le script dans le composant

### 3. Sitemap

Les pages statiques doivent être ajoutées manuellement dans `app/sitemap.ts` :

```tsx
const staticRoutes: MetadataRoute.Sitemap = [
  // ... routes existantes
  {
    url: `${siteUrl}/ma-nouvelle-page`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.7,
  },
];
```

Les pages dynamiques depuis Sanity sont ajoutées automatiquement.

### 4. Contenu SEO

- [ ] Balise `<h1>` unique par page
- [ ] Hiérarchie de titres logique (H1 > H2 > H3)
- [ ] Texte alternatif sur toutes les images
- [ ] Liens internes pertinents
- [ ] Contenu de qualité (min 300 mots pour pages importantes)

---

## Outils de Validation

### 1. Lighthouse (Chrome DevTools)

```bash
# Ou depuis Chrome DevTools > Lighthouse
npm run build
npm run start
# Ouvrir Chrome DevTools > Lighthouse > Run audit
```

**Objectif** : Score SEO ≥ 95/100

### 2. Google Search Console

**URL** : https://search.google.com/search-console

**Actions** :
1. Ajouter et vérifier votre site
2. Soumettre le sitemap.xml
3. Monitorer l'indexation
4. Vérifier les rich snippets (après 2-4 semaines)

### 3. Validation Schema.org

- **Google Rich Results Test** : https://search.google.com/test/rich-results
- **Schema.org Validator** : https://validator.schema.org/

### 4. Tests Social Media

- **Facebook Debugger** : https://developers.facebook.com/tools/debug/
- **Twitter Card Validator** : https://cards-dev.twitter.com/validator
- **LinkedIn Inspector** : https://www.linkedin.com/post-inspector/

---

## Maintenance SEO

### Mensuel

- [ ] Vérifier Google Search Console pour erreurs
- [ ] Vérifier que le sitemap est à jour
- [ ] Tester rich snippets sur nouvelles pages

### Trimestriel

- [ ] Audit Lighthouse complet
- [ ] Analyser positions Google (si tracking activé)
- [ ] Mettre à jour contenus obsolètes

### Annuel

- [ ] Revue complète des métadonnées
- [ ] Mise à jour des images Open Graph
- [ ] Audit de la structure des liens internes

---

## Variables d'Environnement

### Requises

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

**Important** : Cette variable est utilisée pour :
- Générer les URLs canoniques
- Générer les URLs dans Schema.org
- Générer l'URL du sitemap dans robots.txt

**En développement** : `http://localhost:3000`
**En production** : `https://votre-domaine.com` (sans trailing slash)

---

## Performance SEO

### Core Web Vitals

Les Core Web Vitals sont des métriques de performance qui impactent le SEO.

**Optimisations implémentées** :

1. **Images optimisées** : next/image avec lazy loading
2. **Fonts système** : pas de fonts externes lourdes
3. **CSS critique** : Tailwind avec purge
4. **ISR** : sitemap et pages statiques cachées
5. **Prefetch** : Links Next.js avec prefetch automatique

**Objectifs** :
- LCP (Largest Contentful Paint) : < 2.5s
- FID (First Input Delay) : < 100ms
- CLS (Cumulative Layout Shift) : < 0.1

---

## Troubleshooting

### Rich snippets ne s'affichent pas dans Google

**Cause** : L'indexation prend 2-4 semaines après soumission.

**Solution** : Patience. Vérifier Google Search Console > Enhancements.

---

### Sitemap.xml retourne erreur 500

**Cause** : Erreur de connexion à Sanity.

**Solution** : Vérifier les variables d'environnement Sanity dans `.env.local`.

---

### Robots.txt bloque trop de pages

**Cause** : Configuration trop restrictive.

**Solution** : Vérifier `app/robots.ts`, ajuster les règles Disallow.

---

### Images Open Graph ne s'affichent pas

**Causes possibles** :
1. Image trop petite (< 200x200)
2. URL relative au lieu d'absolue
3. Image non accessible (404)

**Solution** :
- Utiliser `getSiteUrl()` pour URLs absolues
- Vérifier que l'image existe dans `/public/`
- Tester avec Facebook Debugger

---

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
