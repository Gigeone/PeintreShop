# Capability: Cloudinary Integration

## Purpose

Cette capability gère l'intégration de Cloudinary comme CDN pour l'hébergement et l'optimisation des images d'œuvres d'art. Elle remplace les gradients CSS temporaires par de vraies images optimisées automatiquement.

## ADDED Requirements

### R1-MUST-configure-cloudinary

SHALL: Le système doit être configuré pour charger des images depuis Cloudinary via le composant next/image

#### Scenario: Configuration Next.js valide

**GIVEN** un développeur configure Cloudinary
**WHEN** il ajoute les variables d'environnement et la configuration Next.js
**THEN** le domaine `res.cloudinary.com` doit être autorisé dans `next.config.ts` via `remotePatterns`

#### Scenario: Variables d'environnement présentes

**GIVEN** l'application démarre
**WHEN** elle charge la configuration
**THEN** la variable `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` doit être définie et accessible côté client

---

### R2-MUST-use-real-images

SHALL: Le système doit remplacer les gradients CSS par des URLs Cloudinary réelles dans les données des œuvres

#### Scenario: URLs Cloudinary valides

**GIVEN** une œuvre dans `data/artworks.ts`
**WHEN** on accède au champ `imageUrl`
**THEN** l'URL doit commencer par `https://res.cloudinary.com/` et pointer vers une image valide

#### Scenario: Toutes les œuvres ont des images

**GIVEN** les 9 œuvres mockées
**WHEN** on vérifie les URLs
**THEN** aucune œuvre ne doit avoir un gradient CSS (format `#COLOR1, #COLOR2`), toutes doivent avoir des URLs HTTP

---

### R3-MUST-optimize-images

SHALL: Le système doit utiliser le composant next/image pour charger les images Cloudinary avec optimisation automatique

#### Scenario: Lazy loading activé

**GIVEN** un visiteur charge la page galerie
**WHEN** les images des œuvres sont en dehors du viewport
**THEN** elles ne doivent pas être chargées immédiatement (lazy loading)

#### Scenario: Format WebP automatique

**GIVEN** un navigateur supportant WebP
**WHEN** une image Cloudinary est demandée
**THEN** Next.js doit automatiquement servir la version WebP optimisée

#### Scenario: Responsive images

**GIVEN** un visiteur sur mobile (375px)
**WHEN** une image d'œuvre est affichée
**THEN** Next.js doit demander une version redimensionnée adaptée (srcset automatique)

---

### R4-MUST-handle-image-errors

SHALL: Le système doit gérer gracieusement les erreurs de chargement d'images (URL invalide, Cloudinary down)

#### Scenario: Image placeholder sur erreur

**GIVEN** une URL Cloudinary invalide ou inaccessible
**WHEN** le chargement échoue
**THEN** un gradient CSS de fallback doit être affiché avec un message d'erreur en console

---

### R5-MUST-support-aspect-ratio

SHALL: Le système doit préserver le ratio d'aspect des images (carré pour galerie, original pour détails)

#### Scenario: Format carré galerie

**GIVEN** une image d'œuvre dans la galerie
**WHEN** elle est affichée
**THEN** elle doit être cropée en format carré (aspect-ratio 1:1) sans déformation

---

## MODIFIED Requirements (from gallery-data)

### R6-MODIFIED-imageUrl-format

SHALL: Le champ `imageUrl` dans `Artwork` doit accepter uniquement des URLs HTTP valides (plus de gradients CSS)

#### Scenario: Validation TypeScript stricte

**GIVEN** un développeur crée une nouvelle œuvre
**WHEN** il assigne une valeur à `imageUrl`
**THEN** TypeScript devrait idéalement valider le format URL (type `string` pour MVP, peut être raffiné en V1)

---

## Related Capabilities

- **gallery-data** (modifié) : Le champ `imageUrl` passe de gradient CSS à URLs Cloudinary
- **homepage-carousel** (nouveau) : Utilise les mêmes images Cloudinary pour le carrousel
- **sanity-integration** (V1) : Cloudinary peut être remplacé par Sanity Assets en V1

---

## Technical Notes

- Plan Cloudinary gratuit : 25 crédits/mois = ~2500 transformations (largement suffisant pour MVP)
- Format URL Cloudinary : `https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{ext}`
- Next.js optimise automatiquement : WebP, lazy loading, srcset, blur placeholder
- Pour upload : interface web Cloudinary ou API REST (pas besoin de SDK pour MVP)
- Dimensions recommandées : 1200×1200px (carré) pour uniformité galerie
