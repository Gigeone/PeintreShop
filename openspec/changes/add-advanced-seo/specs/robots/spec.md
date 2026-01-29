# Spec: Robots.txt Configuration

**Capability**: robots
**Status**: Proposed
**Related Change**: add-advanced-seo

## Purpose

Configurer un fichier robots.txt pour contrôler l'accès des crawlers aux différentes parties du site et optimiser l'exploration par les moteurs de recherche.

## ADDED Requirements

### R-ROBOTS-001: Robots.txt Accessibility
**Priority**: MUST

Le fichier robots.txt doit être accessible à l'URL `/robots.txt`.

#### Scenario: Access robots.txt

**GIVEN** le site est déployé
**WHEN** un crawler ou utilisateur visite `/robots.txt`
**THEN** un fichier texte doit être retourné avec Content-Type `text/plain`
**AND** le fichier doit être valide selon le protocole robots.txt
**AND** le code HTTP doit être 200

---

### R-ROBOTS-002: Allow All Crawlers
**Priority**: MUST

Le robots.txt doit autoriser tous les crawlers légitimes.

#### Scenario: Default allow policy

**GIVEN** le robots.txt est configuré
**WHEN** un crawler lit le fichier
**THEN** il doit contenir `User-agent: *`
**AND** il ne doit pas contenir `Disallow: /` (interdiction globale)
**AND** les pages publiques doivent être explorables

---

### R-ROBOTS-003: Block Private Routes
**Priority**: MUST

Le robots.txt doit bloquer l'accès aux routes privées et techniques.

#### Scenario: Block Sanity Studio and API routes

**GIVEN** le robots.txt est configuré
**WHEN** un crawler lit le fichier
**THEN** il doit contenir `Disallow: /studio`
**AND** il doit contenir `Disallow: /api/`
**AND** ces routes ne doivent pas être indexées

---

### R-ROBOTS-004: Sitemap Reference
**Priority**: MUST

Le robots.txt doit pointer vers le sitemap.xml.

#### Scenario: Reference sitemap

**GIVEN** le robots.txt est accessible
**WHEN** un crawler lit le fichier
**THEN** il doit contenir `Sitemap: https://[domain]/sitemap.xml`
**AND** l'URL du sitemap doit être absolue
**AND** l'URL doit pointer vers un sitemap valide

---

### R-ROBOTS-005: Environment-Specific Configuration
**Priority**: SHOULD

Le robots.txt doit s'adapter à l'environnement (dev/prod).

#### Scenario: Block indexing in development

**GIVEN** le site tourne en environnement de développement
**WHEN** le robots.txt est généré
**THEN** il peut contenir `Disallow: /` pour bloquer l'indexation
**OR** utiliser l'URL localhost dans le sitemap

**Scenario: Allow indexing in production

**GIVEN** le site est déployé en production
**WHEN** le robots.txt est généré
**THEN** il doit autoriser l'indexation des pages publiques
**AND** il doit utiliser l'URL de production dans le sitemap

---

### R-ROBOTS-006: Standard Compliance
**Priority**: MUST

Le robots.txt doit respecter le standard robots.txt.

#### Scenario: Valid robots.txt format

**GIVEN** le fichier robots.txt
**WHEN** il est validé
**THEN** il doit suivre la syntaxe robots.txt standard
**AND** chaque directive doit être sur une ligne séparée
**AND** les commentaires doivent commencer par `#`
**AND** les directives doivent utiliser les mots-clés valides (User-agent, Disallow, Allow, Sitemap)

---

### R-ROBOTS-007: Crawl-delay
**Priority**: MAY

Le robots.txt peut définir un délai entre les requêtes pour les crawlers agressifs.

#### Scenario: Rate limit aggressive crawlers

**GIVEN** certains crawlers sont trop agressifs
**WHEN** le robots.txt est configuré
**THEN** il peut contenir `Crawl-delay: 1` pour ces user-agents spécifiques
**AND** le délai ne doit pas pénaliser les crawlers majeurs (Google, Bing)

---

## Related Capabilities

- `sitemap` - Le robots.txt référence le sitemap.xml
- `metadata` - Les pages non bloquées doivent avoir des métadonnées complètes

## Implementation Notes

- Utiliser Next.js 14+ `robots.ts` API Route Handler
- Retourner un objet avec `rules` et `sitemap`
- Utiliser `NEXT_PUBLIC_SITE_URL` pour l'URL absolue du sitemap
- Format de sortie automatiquement géré par Next.js

**Exemple de structure** :
```typescript
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

## Validation Criteria

- [ ] Robots.txt accessible à `/robots.txt`
- [ ] Format valide selon le standard robots.txt
- [ ] Autorise tous les crawlers (`User-agent: *`)
- [ ] Bloque `/studio` et `/api/`
- [ ] Référence le sitemap avec URL absolue
- [ ] Content-Type correct (`text/plain`)
- [ ] Test avec Google Search Console robots.txt tester
