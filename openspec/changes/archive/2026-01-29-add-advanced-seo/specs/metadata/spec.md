# Spec: Enhanced Metadata

**Capability**: metadata
**Status**: Proposed
**Related Change**: add-advanced-seo

## Purpose

Enrichir les métadonnées HTML de toutes les pages avec Open Graph, Twitter Cards, et autres balises meta pour améliorer le partage sur réseaux sociaux et l'affichage dans les résultats de recherche.

## ADDED Requirements

### R-META-001: Open Graph on All Pages
**Priority**: MUST

Toutes les pages publiques doivent avoir des métadonnées Open Graph complètes.

#### Scenario: Complete Open Graph tags

**GIVEN** une page publique du site
**WHEN** la page est chargée
**THEN** les balises meta og:title, og:description, og:image, og:url doivent être présentes
**AND** og:type doit être défini (website, article, ou product selon la page)
**AND** og:site_name doit être "MNGH - Artiste Peintre"
**AND** og:locale doit être "fr_FR"

---

### R-META-002: Twitter Cards
**Priority**: MUST

Toutes les pages publiques doivent avoir des métadonnées Twitter Card.

#### Scenario: Twitter card metadata

**GIVEN** une page publique du site
**WHEN** la page est partagée sur Twitter
**THEN** les balises twitter:card, twitter:title, twitter:description, twitter:image doivent être présentes
**AND** twitter:card doit être "summary_large_image" pour les pages avec images
**AND** twitter:card doit être "summary" pour les pages textuelles

---

### R-META-003: Product-Specific Metadata
**Priority**: MUST

Les pages d'œuvres doivent avoir des métadonnées spécifiques aux produits.

#### Scenario: Artwork page metadata

**GIVEN** une page d'œuvre `/oeuvres/[slug]`
**WHEN** la page est chargée
**THEN** og:type doit être "product"
**AND** product:price:amount et product:price:currency doivent être présents
**AND** product:availability doit refléter isAvailable (instock ou out_of_stock)
**AND** og:image doit pointer vers l'image de l'œuvre
**AND** la description doit être optimisée SEO (120-160 caractères)

---

### R-META-004: Canonical URLs
**Priority**: MUST

Toutes les pages doivent avoir une URL canonique définie.

#### Scenario: Canonical URL present

**GIVEN** n'importe quelle page du site
**WHEN** la page est chargée
**THEN** une balise `<link rel="canonical">` doit être présente
**AND** l'URL canonique doit être l'URL absolue de la page
**AND** l'URL ne doit pas avoir de trailing slash
**AND** l'URL doit utiliser HTTPS en production

---

### R-META-005: Meta Description Optimization
**Priority**: MUST

Toutes les pages doivent avoir une meta description unique et optimisée.

#### Scenario: Unique meta descriptions

**GIVEN** une page du site
**WHEN** la meta description est générée
**THEN** elle doit être unique par page
**AND** elle doit faire entre 120 et 160 caractères
**AND** elle doit contenir des mots-clés pertinents
**AND** elle doit inciter au clic

---

### R-META-006: Image Metadata
**Priority**: MUST

Les images utilisées dans les métadonnées doivent être optimisées et accessibles.

#### Scenario: Valid Open Graph images

**GIVEN** une page avec og:image défini
**WHEN** la page est partagée sur un réseau social
**THEN** l'image doit avoir une taille minimale de 1200x630px (recommandé)
**AND** l'image doit être accessible via HTTPS
**AND** l'URL de l'image doit être absolue
**AND** og:image:width et og:image:height doivent être fournis si possible

---

### R-META-007: Fallback Metadata
**Priority**: SHOULD

Le système doit fournir des métadonnées de fallback pour les cas exceptionnels.

#### Scenario: Missing artwork image

**GIVEN** une œuvre sans image définie
**WHEN** les métadonnées Open Graph sont générées
**THEN** une image par défaut doit être utilisée (logo ou placeholder)
**AND** og:image doit toujours pointer vers une image valide
**AND** l'utilisateur doit être averti via logs du problème

---

### R-META-008: Root Layout Metadata
**Priority**: MUST

Le layout racine doit définir des métadonnées globales appropriées.

#### Scenario: Global metadata in root layout

**GIVEN** le layout racine `app/layout.tsx`
**WHEN** il est chargé
**THEN** il doit définir metadata avec title template
**AND** il doit définir des icônes (favicon, apple-touch-icon)
**AND** il doit définir themeColor
**AND** il doit définir viewport
**AND** il doit définir creator et publisher

---

### R-META-009: Metadata Helpers
**Priority**: MUST

Le système doit fournir des fonctions helper pour générer les métadonnées.

#### Scenario: Use metadata helpers

**GIVEN** un développeur créant une nouvelle page
**WHEN** il génère les métadonnées
**THEN** il doit pouvoir utiliser `generateOpenGraph()`
**AND** il doit pouvoir utiliser `generateTwitterCard()`
**AND** il doit pouvoir utiliser `getCanonicalUrl()`
**AND** les helpers doivent retourner des objets Metadata Next.js valides

---

## Related Capabilities

- `structured-data` - Les schemas JSON-LD complètent les métadonnées
- `sitemap` - Toutes les pages avec métadonnées doivent être dans le sitemap

## Implementation Notes

- Utiliser Next.js 14+ Metadata API (`generateMetadata` ou export `metadata`)
- Créer des helpers réutilisables dans `lib/seo/metadata.ts`
- Utiliser `NEXT_PUBLIC_SITE_URL` pour les URLs absolues
- Optimiser les images Open Graph avec Sanity image transformations
- Tester les prévisualisations avec :
  - Facebook Debugger: https://developers.facebook.com/tools/debug/
  - Twitter Card Validator: https://cards-dev.twitter.com/validator
  - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Validation Criteria

- [ ] Toutes les pages ont Open Graph complet
- [ ] Toutes les pages ont Twitter Cards
- [ ] Meta descriptions uniques et optimisées (120-160 chars)
- [ ] URLs canoniques présentes et correctes
- [ ] Images Open Graph valides et accessibles
- [ ] Test Facebook Debugger réussi
- [ ] Test Twitter Card Validator réussi
- [ ] Test LinkedIn Post Inspector réussi
- [ ] Lighthouse SEO score ≥ 95
