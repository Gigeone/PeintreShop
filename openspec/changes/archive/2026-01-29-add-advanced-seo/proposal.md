# Proposal: Add Advanced SEO

**Change ID**: `add-advanced-seo`
**Status**: Proposed
**Created**: 2026-01-29
**Phase**: V1 - Sprint 3

## Purpose

Optimiser le référencement naturel du site PeintreShop pour améliorer sa visibilité sur les moteurs de recherche et augmenter le trafic organique. Cette optimisation est critique pour un site e-commerce d'art où la découverte organique est un canal d'acquisition majeur.

## Problem Statement

Actuellement, le site possède des métadonnées basiques mais manque d'optimisations SEO avancées :

- **Pas de Schema.org** : Les moteurs de recherche ne peuvent pas afficher de rich snippets pour les œuvres
- **Pas de sitemap dynamique** : Les nouveaux contenus ne sont pas découverts rapidement
- **Métadonnées limitées** : Open Graph et Twitter Cards incomplets sur certaines pages
- **Pas de robots.txt** : Aucun contrôle sur l'indexation des crawlers
- **Performances non optimisées** : Core Web Vitals non mesurés/optimisés

Ces limitations réduisent la visibilité du site dans les résultats de recherche et diminuent le taux de clic depuis les réseaux sociaux.

## Proposed Solution

Implémenter un système SEO complet en 4 axes :

### 1. Schema.org JSON-LD

Ajouter des données structurées pour :
- **Product Schema** pour chaque œuvre (titre, prix, disponibilité, image)
- **Organization Schema** pour l'artiste
- **BreadcrumbList** pour la navigation
- **WebSite** avec search action

### 2. Sitemap Dynamique

- Générer `sitemap.xml` automatiquement depuis Sanity
- Inclure toutes les pages statiques et dynamiques
- Mettre à jour automatiquement lors de l'ajout d'œuvres
- Respecter les priorités et fréquences de mise à jour

### 3. Métadonnées Enrichies

- Compléter Open Graph sur toutes les pages
- Ajouter Twitter Cards
- Optimiser les meta descriptions
- Ajouter canonical URLs

### 4. Configuration SEO

- Créer `robots.txt` optimisé
- Configurer les en-têtes HTTP appropriés
- Documentation des bonnes pratiques

## Scope

### In Scope

- ✅ Schema.org JSON-LD pour Product, Organization, WebSite
- ✅ Génération dynamique de sitemap.xml
- ✅ Robots.txt avec règles optimisées
- ✅ Open Graph complet sur toutes les pages
- ✅ Twitter Cards
- ✅ Types TypeScript pour SEO
- ✅ Utilitaires de génération de métadonnées
- ✅ Documentation des bonnes pratiques

### Out of Scope

- ❌ Google Analytics / Tag Manager (V2)
- ❌ Structured data testing automatisé (V2)
- ❌ Optimisation des images (déjà fait avec next/image)
- ❌ Multi-langue (V2)
- ❌ AMP pages
- ❌ Monitoring des positions SEO

## Key Components

### New Files

```
types/seo.ts                    # Types pour Schema.org et métadonnées
lib/seo/schema.ts              # Générateurs Schema.org JSON-LD
lib/seo/metadata.ts            # Helpers pour métadonnées Next.js
app/sitemap.ts                 # Génération sitemap.xml dynamique
app/robots.ts                  # Configuration robots.txt
```

### Modified Files

```
app/layout.tsx                 # Métadonnées root améliorées
app/page.tsx                   # Schema.org homepage
app/galerie/page.tsx          # Métadonnées galerie
app/oeuvres/[slug]/page.tsx   # Schema.org Product + métadonnées enrichies
app/a-propos/page.tsx         # Schema.org Organization
app/contact/page.tsx          # Métadonnées contact
```

## Success Criteria

### Technique

- ✅ Sitemap accessible à `/sitemap.xml` avec toutes les pages
- ✅ Robots.txt accessible à `/robots.txt`
- ✅ Schema.org valide (test avec Google Rich Results Test)
- ✅ Open Graph présent sur toutes les pages
- ✅ Aucune erreur TypeScript
- ✅ Build Next.js réussi

### Business

- ✅ Rich snippets visibles dans Google Search Console (après indexation)
- ✅ Score Lighthouse SEO ≥ 95/100
- ✅ Toutes les pages indexables découvertes par Google
- ✅ Prévisualisations correctes lors du partage sur réseaux sociaux

### Mesure

- Test manuel avec Google Rich Results Test
- Audit Lighthouse sur 3 types de pages (home, galerie, œuvre)
- Validation sitemap.xml avec Google Search Console
- Test de partage sur Facebook/Twitter/LinkedIn

## Implementation Strategy

### Phase 1 : Types et Utilitaires (30 min)
- Créer types TypeScript pour Schema.org
- Créer helpers de génération de métadonnées
- Créer générateurs Schema.org

### Phase 2 : Sitemap et Robots (20 min)
- Implémenter `app/sitemap.ts`
- Implémenter `app/robots.ts`
- Tester l'accessibilité

### Phase 3 : Métadonnées Pages (30 min)
- Enrichir métadonnées sur layout root
- Ajouter Schema.org sur homepage
- Ajouter Product Schema sur pages œuvres
- Ajouter Organization Schema sur page À propos

### Phase 4 : Tests et Validation (20 min)
- Tests Lighthouse sur 3 pages
- Validation Schema.org avec Google
- Tests de partage réseaux sociaux
- Documentation

**Durée totale estimée** : ~1h40

## Dependencies

- ✅ Sanity client configuré (`lib/sanity.ts`)
- ✅ Types Artwork existants (`types/artwork.ts`)
- ✅ Next.js 14+ avec App Router
- ✅ Variable `NEXT_PUBLIC_SITE_URL` dans `.env.local`

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema.org mal formé | Moyen | Validation avec Google Rich Results Test |
| Sitemap trop lourd | Faible | Pagination si > 1000 URLs (peu probable) |
| NEXT_PUBLIC_SITE_URL manquante | Moyen | Fallback sur localhost en dev, erreur en prod |
| Images manquantes dans Open Graph | Moyen | Fallback sur image par défaut |

## Alternatives Considered

### Alternative 1 : Bibliothèque next-seo
**Rejetée** : Ajoute une dépendance pour quelque chose de simple à implémenter nativement avec Next.js 14

### Alternative 2 : Sitemap statique
**Rejetée** : Ne se met pas à jour automatiquement lors de l'ajout d'œuvres

### Alternative 3 : Plugin Sanity SEO
**Rejetée** : Complexité inutile pour nos besoins, préférons le contrôle total côté Next.js

## Open Questions

1. **Fréquence de mise à jour du sitemap** : Utiliser ISR (revalidation) ou générer à chaque build ?
   - **Réponse** : ISR avec revalidate de 3600s (1h) pour équilibrer fraîcheur et performance

2. **Image par défaut pour Open Graph** : Quelle image utiliser si une œuvre n'a pas d'image ?
   - **Réponse** : Logo MNGH ou image placeholder dans `/public/og-default.jpg`

3. **URL canonique** : Faut-il gérer les variations d'URL (trailing slash, query params) ?
   - **Réponse** : Oui, toujours pointer vers l'URL sans trailing slash

## Related Changes

- ✅ `add-transactional-emails` (archived) - Email system already implemented
- 🔄 Future: `add-analytics` (V2) - Google Analytics integration
- 🔄 Future: `add-multilingual` (V2) - Hreflang tags for i18n

## Approval Checklist

- [ ] Purpose clearly stated
- [ ] Scope defined (in/out)
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Risks documented
- [ ] Alternatives considered
- [ ] Tasks broken down
- [ ] Spec deltas created
- [ ] Validation passes (`openspec validate add-advanced-seo --strict`)
