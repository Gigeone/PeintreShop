# Spec: Structured Data (Schema.org)

**Capability**: structured-data
**Status**: Proposed
**Related Change**: add-advanced-seo

## Purpose

Fournir des données structurées Schema.org JSON-LD pour améliorer l'affichage des résultats de recherche avec des rich snippets et aider les moteurs de recherche à comprendre le contenu du site.

## ADDED Requirements

### R-SD-001: Product Schema for Artworks
**Priority**: MUST

Le système doit générer un Product Schema.org JSON-LD pour chaque page d'œuvre.

#### Scenario: Display artwork as product in search results

**GIVEN** une page d'œuvre avec des données complètes (titre, prix, image, disponibilité)
**WHEN** un crawler visite la page
**THEN** un script JSON-LD de type "Product" doit être présent dans le HTML
**AND** le schema doit inclure name, image, offers (price, availability), description
**AND** le schema doit être valide selon Schema.org Product spec

---

### R-SD-002: Organization Schema
**Priority**: MUST

Le système doit générer un Organization Schema.org JSON-LD pour identifier l'artiste.

#### Scenario: Identify artist as organization

**GIVEN** la page À propos ou la homepage
**WHEN** un crawler visite la page
**THEN** un script JSON-LD de type "Organization" doit être présent
**AND** le schema doit inclure name, url, logo
**AND** le schema peut inclure contactPoint et sameAs (réseaux sociaux)

---

### R-SD-003: WebSite Schema with Search Action
**Priority**: SHOULD

Le système doit générer un WebSite Schema.org JSON-LD avec SearchAction pour activer la search box dans Google.

#### Scenario: Enable sitelinks searchbox in Google

**GIVEN** la homepage du site
**WHEN** Google indexe la page
**THEN** un script JSON-LD de type "WebSite" doit être présent
**AND** le schema doit inclure un potentialAction de type SearchAction
**AND** l'URL de recherche doit pointer vers `/galerie` ou une page de recherche future

---

### R-SD-004: BreadcrumbList Schema
**Priority**: SHOULD

Le système doit générer un BreadcrumbList Schema.org JSON-LD pour la navigation hiérarchique.

#### Scenario: Show breadcrumb trail in search results

**GIVEN** une page profonde (ex: page œuvre)
**WHEN** un crawler visite la page
**THEN** un script JSON-LD de type "BreadcrumbList" doit être présent
**AND** le schema doit inclure tous les niveaux de navigation (Home > Galerie > Œuvre)
**AND** chaque item doit avoir name, item (URL), et position

---

### R-SD-005: Schema.org Validation
**Priority**: MUST

Tous les schemas générés doivent être valides selon la spécification Schema.org.

#### Scenario: Validate schemas with Google tool

**GIVEN** n'importe quelle page avec Schema.org JSON-LD
**WHEN** l'URL est testée avec Google Rich Results Test
**THEN** aucune erreur critique ne doit être détectée
**AND** tous les champs requis doivent être présents
**AND** les warnings peuvent être acceptés si non critiques

---

### R-SD-006: TypeScript Types for Schemas
**Priority**: MUST

Le système doit fournir des types TypeScript stricts pour tous les schemas générés.

#### Scenario: Type-safe schema generation

**GIVEN** un développeur créant un nouveau schema
**WHEN** il utilise les types définis dans `types/seo.ts`
**THEN** TypeScript doit valider la structure du schema
**AND** l'autocomplétion doit suggérer les propriétés disponibles
**AND** les propriétés requises doivent être marquées comme non-optionnelles

---

## Related Capabilities

- `metadata` - Les schemas complètent les métadonnées standard
- `sitemap` - Les pages avec schemas doivent être dans le sitemap

## Implementation Notes

- Utiliser `<script type="application/ld+json">` pour insérer les schemas
- Placer les schemas dans le composant de page (Server Component)
- Générer les schemas côté serveur pour garantir le SSR
- Utiliser `JSON.stringify()` pour convertir les objets en JSON-LD
- Échapper correctement les caractères spéciaux dans les strings

## Validation Criteria

- [ ] Tous les schemas sont valides selon Schema.org
- [ ] Google Rich Results Test ne montre aucune erreur critique
- [ ] TypeScript compile sans erreur
- [ ] Les schemas sont présents dans le HTML source (view-source:)
- [ ] Les rich snippets apparaissent dans Google Search Console (après indexation)
