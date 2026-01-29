# Spec: Dynamic Sitemap

**Capability**: sitemap
**Status**: Proposed
**Related Change**: add-advanced-seo

## Purpose

Générer automatiquement un sitemap.xml dynamique incluant toutes les pages du site pour faciliter la découverte et l'indexation par les moteurs de recherche.

## ADDED Requirements

### R-SITEMAP-001: Dynamic Sitemap Generation
**Priority**: MUST

Le système doit générer un sitemap.xml dynamique accessible à `/sitemap.xml`.

#### Scenario: Access sitemap

**GIVEN** le site est déployé
**WHEN** un crawler ou utilisateur visite `/sitemap.xml`
**THEN** un fichier XML valide doit être retourné
**AND** le Content-Type doit être `application/xml`
**AND** le sitemap doit respecter le protocole sitemaps.org

---

### R-SITEMAP-002: Include All Public Pages
**Priority**: MUST

Le sitemap doit inclure toutes les pages publiques du site.

#### Scenario: List all indexable pages

**GIVEN** le site contient des pages statiques et dynamiques
**WHEN** le sitemap est généré
**THEN** il doit inclure la homepage (`/`)
**AND** il doit inclure `/galerie`
**AND** il doit inclure `/a-propos`
**AND** il doit inclure `/contact`
**AND** il doit inclure toutes les pages `/oeuvres/[slug]` depuis Sanity
**AND** il ne doit PAS inclure `/studio` ni `/api/*`

---

### R-SITEMAP-003: URL Metadata
**Priority**: MUST

Chaque URL dans le sitemap doit avoir des métadonnées appropriées.

#### Scenario: Provide URL metadata

**GIVEN** une URL dans le sitemap
**WHEN** le sitemap est généré
**THEN** l'URL doit avoir un `lastmod` (date de dernière modification)
**AND** l'URL doit avoir un `changefreq` approprié
**AND** l'URL doit avoir une `priority` entre 0.0 et 1.0
**AND** les valeurs doivent être cohérentes avec le type de page

---

### R-SITEMAP-004: Priority Assignment
**Priority**: SHOULD

Les URLs doivent avoir des priorités reflétant leur importance relative.

#### Scenario: Assign appropriate priorities

**GIVEN** le sitemap contient différents types de pages
**WHEN** les priorités sont assignées
**THEN** la homepage doit avoir priority=1.0
**AND** les pages œuvres disponibles doivent avoir priority=0.8
**AND** les pages œuvres vendues doivent avoir priority=0.5
**AND** la galerie doit avoir priority=0.9
**AND** les pages à propos et contact doivent avoir priority=0.6

---

### R-SITEMAP-005: Change Frequency
**Priority**: SHOULD

Les URLs doivent avoir des fréquences de changement appropriées.

#### Scenario: Set realistic change frequencies

**GIVEN** une URL dans le sitemap
**WHEN** le changefreq est assigné
**THEN** la homepage doit avoir changefreq='weekly'
**AND** la galerie doit avoir changefreq='daily'
**AND** les pages œuvres doivent avoir changefreq='monthly'
**AND** les pages statiques doivent avoir changefreq='monthly'

---

### R-SITEMAP-006: Dynamic Updates
**Priority**: MUST

Le sitemap doit se mettre à jour automatiquement quand de nouvelles œuvres sont ajoutées.

#### Scenario: Reflect new content

**GIVEN** une nouvelle œuvre est publiée dans Sanity
**WHEN** le sitemap est régénéré (via ISR ou rebuild)
**THEN** la nouvelle œuvre doit apparaître dans le sitemap
**AND** le lastmod du sitemap doit être mis à jour
**AND** le délai de mise à jour ne doit pas excéder 1 heure (ISR revalidate)

---

### R-SITEMAP-007: Performance
**Priority**: SHOULD

La génération du sitemap ne doit pas impacter les performances du site.

#### Scenario: Fast sitemap generation

**GIVEN** le site contient jusqu'à 500 œuvres
**WHEN** le sitemap est généré
**THEN** le temps de génération ne doit pas excéder 2 secondes
**AND** le sitemap doit être mis en cache (ISR)
**AND** les requêtes simultanées doivent servir le cache

---

## Related Capabilities

- `structured-data` - Les pages avec Schema.org doivent être dans le sitemap
- `robots` - Le sitemap doit être référencé dans robots.txt

## Implementation Notes

- Utiliser Next.js 14+ `sitemap.ts` API Route Handler
- Fetcher toutes les œuvres depuis Sanity avec `client.fetch()`
- Utiliser ISR avec `revalidate: 3600` (1 heure)
- Format XML selon le protocole sitemaps.org
- Inclure attribut `xmlns` pour la validation

**Exemple de structure** :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## Validation Criteria

- [ ] Sitemap accessible à `/sitemap.xml`
- [ ] XML valide (test avec validator XML)
- [ ] Toutes les pages publiques présentes
- [ ] Pas de pages privées ou API routes
- [ ] Métadonnées (lastmod, priority, changefreq) présentes
- [ ] Se met à jour automatiquement (test en ajoutant une œuvre)
- [ ] Validation Google Search Console réussie
