# Tasks: Add Advanced SEO

**Change ID**: `add-advanced-seo`

## Task Breakdown

### Phase 1: Types et Utilitaires (30 min)

#### Task 1.1: Créer les types SEO
- [x] Créer `types/seo.ts`
- [x] Définir types pour Schema.org (Product, Organization, WebSite, BreadcrumbList)
- [x] Définir types pour métadonnées enrichies (OpenGraph, TwitterCard)
- [x] Exporter tous les types

**Validation**: TypeScript compile sans erreur ✅

**Files**: `types/seo.ts` (new)

---

#### Task 1.2: Créer générateurs Schema.org
- [x] Créer `lib/seo/schema.ts`
- [x] Implémenter `generateProductSchema(artwork)`
- [x] Implémenter `generateOrganizationSchema()`
- [x] Implémenter `generateWebSiteSchema()`
- [x] Implémenter `generateBreadcrumbSchema(items)`

**Validation**: Chaque fonction retourne un objet JSON-LD valide ✅

**Files**: `lib/seo/schema.ts` (new)

---

#### Task 1.3: Créer helpers métadonnées
- [x] Créer `lib/seo/metadata.ts`
- [x] Implémenter `generateOpenGraph(params)`
- [x] Implémenter `generateTwitterCard(params)`
- [x] Implémenter `getCanonicalUrl(path)`
- [x] Implémenter `getSiteUrl()`

**Validation**: Helpers retournent des objets Metadata Next.js valides ✅

**Files**: `lib/seo/metadata.ts` (new)

---

### Phase 2: Sitemap et Robots (20 min)

#### Task 2.1: Implémenter sitemap dynamique
- [x] Créer `app/sitemap.ts`
- [x] Récupérer toutes les œuvres depuis Sanity
- [x] Ajouter pages statiques (home, galerie, à propos, contact)
- [x] Ajouter pages dynamiques (chaque œuvre)
- [x] Définir priorités et changeFrequency appropriées
- [x] Tester l'accès à `/sitemap.xml`

**Validation**:
- Sitemap accessible à `http://localhost:3000/sitemap.xml` ✅
- XML valide avec toutes les URLs ✅
- Inclut `lastmod`, `priority`, `changefreq` ✅

**Files**: `app/sitemap.ts` (new)

---

#### Task 2.2: Créer robots.txt
- [x] Créer `app/robots.ts`
- [x] Autoriser tous les crawlers (`User-agent: *`)
- [x] Bloquer `/studio` et `/api`
- [x] Pointer vers sitemap.xml
- [x] Tester l'accès à `/robots.txt`

**Validation**:
- Robots.txt accessible à `http://localhost:3000/robots.txt` ✅
- Contenu correct avec sitemap URL ✅

**Files**: `app/robots.ts` (new)

---

### Phase 3: Métadonnées Pages (30 min)

#### Task 3.1: Enrichir layout root
- [x] Ouvrir `app/layout.tsx`
- [x] Améliorer metadata avec Open Graph complet
- [x] Ajouter Twitter Card
- [x] Ajouter icônes et themeColor
- [x] Ajouter verification meta tags (Google, etc.) si nécessaire

**Validation**: Metadata complet visible dans `<head>`

**Files**: `app/layout.tsx` (modified)

---

#### Task 3.2: Ajouter Schema.org sur homepage
- [x] Ouvrir `app/page.tsx`
- [x] Importer `generateWebSiteSchema` et `generateOrganizationSchema`
- [x] Ajouter script JSON-LD dans le composant
- [x] Tester avec Google Rich Results Test

**Validation**:
- JSON-LD présent dans source HTML
- Valide selon Google Rich Results Test

**Files**: `app/page.tsx` (modified)

---

#### Task 3.3: Enrichir métadonnées galerie
- [x] Ouvrir `app/galerie/page.tsx`
- [x] Utiliser `generateOpenGraph()` pour métadonnées complètes
- [x] Ajouter description optimisée SEO
- [x] Ajouter BreadcrumbList JSON-LD

**Validation**: Open Graph complet avec image, description

**Files**: `app/galerie/page.tsx` (modified)

---

#### Task 3.4: Ajouter Product Schema sur pages œuvres
- [x] Ouvrir `app/oeuvres/[slug]/page.tsx`
- [x] Importer `generateProductSchema`
- [x] Générer Product Schema avec données artwork
- [x] Ajouter script JSON-LD dans le composant
- [x] Enrichir `generateMetadata` avec plus de détails
- [x] Tester avec Google Rich Results Test

**Validation**:
- Product Schema valide pour chaque œuvre
- Rich snippet "Product" visible dans test Google

**Files**: `app/oeuvres/[slug]/page.tsx` (modified)

---

#### Task 3.5: Ajouter Organization Schema sur À propos
- [x] Ouvrir `app/a-propos/page.tsx`
- [x] Importer `generateOrganizationSchema`
- [x] Ajouter Organization JSON-LD
- [x] Enrichir métadonnées

**Validation**: Organization Schema valide

**Files**: `app/a-propos/page.tsx` (modified)

---

#### Task 3.6: Enrichir métadonnées Contact
- [x] Ouvrir `app/contact/page.tsx`
- [x] Utiliser helpers pour Open Graph complet
- [x] Ajouter description optimisée

**Validation**: Métadonnées complètes

**Files**: `app/contact/page.tsx` (modified)

---

### Phase 4: Tests et Validation (20 min)

#### Task 4.1: Tests Lighthouse SEO
- [x] Lancer audit Lighthouse sur homepage
- [x] Lancer audit Lighthouse sur page galerie
- [x] Lancer audit Lighthouse sur page œuvre
- [x] Vérifier score SEO ≥ 95 sur chaque page
- [x] Corriger les problèmes identifiés

**Validation**: Score Lighthouse SEO ≥ 95/100 sur toutes les pages testées

---

#### Task 4.2: Validation Schema.org
- [x] Tester homepage avec Google Rich Results Test
- [x] Tester page œuvre avec Google Rich Results Test
- [x] Tester page à propos avec Google Rich Results Test
- [x] Vérifier absence d'erreurs critiques
- [x] Documenter les warnings non critiques

**Validation**:
- Aucune erreur Schema.org
- Rich snippets détectés correctement

---

#### Task 4.3: Tests de partage réseaux sociaux
- [x] Tester prévisualisation Facebook avec Facebook Debugger
- [x] Tester prévisualisation Twitter avec Twitter Card Validator
- [x] Tester prévisualisation LinkedIn
- [x] Vérifier images, titres, descriptions corrects

**Validation**: Prévisualisations correctes sur tous les réseaux

---

#### Task 4.4: Validation sitemap
- [x] Vérifier sitemap.xml accessible
- [x] Vérifier toutes les URLs présentes
- [x] Vérifier format XML valide
- [x] Tester soumission à Google Search Console (optionnel)

**Validation**: Sitemap XML valide avec toutes les pages

---

#### Task 4.5: Documentation
- [x] Créer `docs/SEO.md` avec guide d'utilisation
- [x] Documenter comment ajouter Schema.org sur nouvelles pages
- [x] Documenter bonnes pratiques métadonnées
- [x] Ajouter checklist SEO pour nouvelles features

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

- [x] All tasks completed
- [x] TypeScript compiles without errors
- [x] `npm run build` succeeds
- [x] `npm run lint` passes
- [x] Sitemap accessible à `/sitemap.xml`
- [x] Robots.txt accessible à `/robots.txt`
- [x] Schema.org valide sur toutes les pages clés
- [x] Lighthouse SEO ≥ 95 sur 3 pages testées
- [x] Open Graph complet sur toutes les pages
- [x] Tests de partage réseaux sociaux passent
- [x] Documentation créée
- [x] Changements committés et pushés
