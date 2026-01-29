# Tasks: Add Advanced SEO

**Change ID**: `add-advanced-seo`

## Task Breakdown

### Phase 1: Types et Utilitaires (30 min)

#### Task 1.1: Créer les types SEO
- [ ] Créer `types/seo.ts`
- [ ] Définir types pour Schema.org (Product, Organization, WebSite, BreadcrumbList)
- [ ] Définir types pour métadonnées enrichies (OpenGraph, TwitterCard)
- [ ] Exporter tous les types

**Validation**: TypeScript compile sans erreur

**Files**: `types/seo.ts` (new)

---

#### Task 1.2: Créer générateurs Schema.org
- [ ] Créer `lib/seo/schema.ts`
- [ ] Implémenter `generateProductSchema(artwork)`
- [ ] Implémenter `generateOrganizationSchema()`
- [ ] Implémenter `generateWebSiteSchema()`
- [ ] Implémenter `generateBreadcrumbSchema(items)`

**Validation**: Chaque fonction retourne un objet JSON-LD valide

**Files**: `lib/seo/schema.ts` (new)

---

#### Task 1.3: Créer helpers métadonnées
- [ ] Créer `lib/seo/metadata.ts`
- [ ] Implémenter `generateOpenGraph(params)`
- [ ] Implémenter `generateTwitterCard(params)`
- [ ] Implémenter `getCanonicalUrl(path)`
- [ ] Implémenter `getSiteUrl()`

**Validation**: Helpers retournent des objets Metadata Next.js valides

**Files**: `lib/seo/metadata.ts` (new)

---

### Phase 2: Sitemap et Robots (20 min)

#### Task 2.1: Implémenter sitemap dynamique
- [ ] Créer `app/sitemap.ts`
- [ ] Récupérer toutes les œuvres depuis Sanity
- [ ] Ajouter pages statiques (home, galerie, à propos, contact)
- [ ] Ajouter pages dynamiques (chaque œuvre)
- [ ] Définir priorités et changeFrequency appropriées
- [ ] Tester l'accès à `/sitemap.xml`

**Validation**:
- Sitemap accessible à `http://localhost:3000/sitemap.xml`
- XML valide avec toutes les URLs
- Inclut `lastmod`, `priority`, `changefreq`

**Files**: `app/sitemap.ts` (new)

---

#### Task 2.2: Créer robots.txt
- [ ] Créer `app/robots.ts`
- [ ] Autoriser tous les crawlers (`User-agent: *`)
- [ ] Bloquer `/studio` et `/api`
- [ ] Pointer vers sitemap.xml
- [ ] Tester l'accès à `/robots.txt`

**Validation**:
- Robots.txt accessible à `http://localhost:3000/robots.txt`
- Contenu correct avec sitemap URL

**Files**: `app/robots.ts` (new)

---

### Phase 3: Métadonnées Pages (30 min)

#### Task 3.1: Enrichir layout root
- [ ] Ouvrir `app/layout.tsx`
- [ ] Améliorer metadata avec Open Graph complet
- [ ] Ajouter Twitter Card
- [ ] Ajouter icônes et themeColor
- [ ] Ajouter verification meta tags (Google, etc.) si nécessaire

**Validation**: Metadata complet visible dans `<head>`

**Files**: `app/layout.tsx` (modified)

---

#### Task 3.2: Ajouter Schema.org sur homepage
- [ ] Ouvrir `app/page.tsx`
- [ ] Importer `generateWebSiteSchema` et `generateOrganizationSchema`
- [ ] Ajouter script JSON-LD dans le composant
- [ ] Tester avec Google Rich Results Test

**Validation**:
- JSON-LD présent dans source HTML
- Valide selon Google Rich Results Test

**Files**: `app/page.tsx` (modified)

---

#### Task 3.3: Enrichir métadonnées galerie
- [ ] Ouvrir `app/galerie/page.tsx`
- [ ] Utiliser `generateOpenGraph()` pour métadonnées complètes
- [ ] Ajouter description optimisée SEO
- [ ] Ajouter BreadcrumbList JSON-LD

**Validation**: Open Graph complet avec image, description

**Files**: `app/galerie/page.tsx` (modified)

---

#### Task 3.4: Ajouter Product Schema sur pages œuvres
- [ ] Ouvrir `app/oeuvres/[slug]/page.tsx`
- [ ] Importer `generateProductSchema`
- [ ] Générer Product Schema avec données artwork
- [ ] Ajouter script JSON-LD dans le composant
- [ ] Enrichir `generateMetadata` avec plus de détails
- [ ] Tester avec Google Rich Results Test

**Validation**:
- Product Schema valide pour chaque œuvre
- Rich snippet "Product" visible dans test Google

**Files**: `app/oeuvres/[slug]/page.tsx` (modified)

---

#### Task 3.5: Ajouter Organization Schema sur À propos
- [ ] Ouvrir `app/a-propos/page.tsx`
- [ ] Importer `generateOrganizationSchema`
- [ ] Ajouter Organization JSON-LD
- [ ] Enrichir métadonnées

**Validation**: Organization Schema valide

**Files**: `app/a-propos/page.tsx` (modified)

---

#### Task 3.6: Enrichir métadonnées Contact
- [ ] Ouvrir `app/contact/page.tsx`
- [ ] Utiliser helpers pour Open Graph complet
- [ ] Ajouter description optimisée

**Validation**: Métadonnées complètes

**Files**: `app/contact/page.tsx` (modified)

---

### Phase 4: Tests et Validation (20 min)

#### Task 4.1: Tests Lighthouse SEO
- [ ] Lancer audit Lighthouse sur homepage
- [ ] Lancer audit Lighthouse sur page galerie
- [ ] Lancer audit Lighthouse sur page œuvre
- [ ] Vérifier score SEO ≥ 95 sur chaque page
- [ ] Corriger les problèmes identifiés

**Validation**: Score Lighthouse SEO ≥ 95/100 sur toutes les pages testées

---

#### Task 4.2: Validation Schema.org
- [ ] Tester homepage avec Google Rich Results Test
- [ ] Tester page œuvre avec Google Rich Results Test
- [ ] Tester page à propos avec Google Rich Results Test
- [ ] Vérifier absence d'erreurs critiques
- [ ] Documenter les warnings non critiques

**Validation**:
- Aucune erreur Schema.org
- Rich snippets détectés correctement

---

#### Task 4.3: Tests de partage réseaux sociaux
- [ ] Tester prévisualisation Facebook avec Facebook Debugger
- [ ] Tester prévisualisation Twitter avec Twitter Card Validator
- [ ] Tester prévisualisation LinkedIn
- [ ] Vérifier images, titres, descriptions corrects

**Validation**: Prévisualisations correctes sur tous les réseaux

---

#### Task 4.4: Validation sitemap
- [ ] Vérifier sitemap.xml accessible
- [ ] Vérifier toutes les URLs présentes
- [ ] Vérifier format XML valide
- [ ] Tester soumission à Google Search Console (optionnel)

**Validation**: Sitemap XML valide avec toutes les pages

---

#### Task 4.5: Documentation
- [ ] Créer `docs/SEO.md` avec guide d'utilisation
- [ ] Documenter comment ajouter Schema.org sur nouvelles pages
- [ ] Documenter bonnes pratiques métadonnées
- [ ] Ajouter checklist SEO pour nouvelles features

**Validation**: Documentation claire et complète

**Files**: `docs/SEO.md` (new)

---

## Task Dependencies

```
Phase 1 → Phase 2 (sitemap needs types)
Phase 1 → Phase 3 (pages need helpers)
Phase 3 → Phase 4 (testing needs implementation)

Parallelizable:
- Task 1.1, 1.2, 1.3 can be done in parallel
- Task 2.1, 2.2 can be done in parallel
- Task 3.1-3.6 can be done in parallel after Phase 1
- Task 4.1-4.4 can be done in parallel
```

## Total Estimated Time

- Phase 1: 30 minutes
- Phase 2: 20 minutes
- Phase 3: 30 minutes
- Phase 4: 20 minutes

**Total: ~1h40**

## Definition of Done

- [ ] All tasks completed
- [ ] TypeScript compiles without errors
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] Sitemap accessible à `/sitemap.xml`
- [ ] Robots.txt accessible à `/robots.txt`
- [ ] Schema.org valide sur toutes les pages clés
- [ ] Lighthouse SEO ≥ 95 sur 3 pages testées
- [ ] Open Graph complet sur toutes les pages
- [ ] Tests de partage réseaux sociaux passent
- [ ] Documentation créée
- [ ] Changements committés et pushés
