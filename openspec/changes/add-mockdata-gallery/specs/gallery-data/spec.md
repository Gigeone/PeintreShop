# Capability: Gallery Data

## Purpose

Cette capability gère le stockage, la structure et l'affichage des données d'œuvres d'art pour la galerie du MVP. Elle fournit des données mockées réalistes en attendant l'intégration du CMS Sanity en V1.

## ADDED Requirements

### R1-MUST-define-artwork-type

SHALL: Le système doit définir un type TypeScript `Artwork` avec tous les champs nécessaires pour représenter une œuvre d'art

#### Scenario: Définition complète d'une œuvre

**GIVEN** un développeur crée une nouvelle œuvre
**WHEN** il utilise le type `Artwork`
**THEN** TypeScript doit valider la présence de tous les champs requis : id, slug, title, description, price, dimensions (height, width), technique, isAvailable, imageUrl

#### Scenario: Type safety sur les dimensions

**GIVEN** un développeur assigne des dimensions à une œuvre
**WHEN** il utilise l'objet `dimensions`
**THEN** TypeScript doit exiger `height` et `width` comme nombres (en cm)

---

### R2-MUST-provide-mockdata

SHALL: Le système doit fournir au minimum 6 œuvres mockées et au maximum 12 œuvres pour le MVP

#### Scenario: Collection minimale d'œuvres

**GIVEN** la page galerie charge les données
**WHEN** elle importe le tableau `artworks`
**THEN** le tableau doit contenir entre 6 et 12 œuvres valides

#### Scenario: Données réalistes et variées

**GIVEN** un visiteur consulte la galerie
**WHEN** il parcourt les œuvres disponibles
**THEN** chaque œuvre doit avoir :
- Un titre unique et créatif (français)
- Une description de 2-3 phrases minimum
- Un prix entre 150€ et 800€
- Des dimensions réalistes (20cm-120cm)
- Une technique artistique valide (Huile, Acrylique, Aquarelle, Pastel, etc.)

---

### R3-MUST-generate-unique-slugs

SHALL: Le système doit générer des slugs uniques en kebab-case pour chaque œuvre, utilisables comme identifiants d'URL

#### Scenario: Slug valide pour URL

**GIVEN** une œuvre avec le titre "Lever de Soleil Méditerranéen"
**WHEN** le slug est généré
**THEN** le slug doit être "lever-de-soleil-mediterraneen" (minuscules, tirets, caractères ASCII)

#### Scenario: Unicité des slugs

**GIVEN** toutes les œuvres du catalogue
**WHEN** on vérifie les slugs
**THEN** aucun slug ne doit être dupliqué

---

### R4-MUST-track-availability

SHALL: Le système doit gérer la disponibilité de chaque œuvre via un champ booléen `isAvailable`

#### Scenario: Œuvre disponible

**GIVEN** une œuvre avec `isAvailable: true`
**WHEN** elle est affichée dans la galerie
**THEN** le bouton "Voir les détails" doit être visible et actif

#### Scenario: Œuvre vendue

**GIVEN** une œuvre avec `isAvailable: false`
**WHEN** elle est affichée dans la galerie
**THEN** un badge "Vendu" doit être affiché et le statut clairement visible

#### Scenario: Mix disponible et vendu

**GIVEN** la collection complète d'œuvres
**WHEN** on compte les œuvres disponibles
**THEN** au moins une œuvre doit avoir `isAvailable: false` pour tester le comportement

---

### R5-MUST-structure-dimensions

SHALL: Le système doit structurer les dimensions comme un objet avec hauteur et largeur en centimètres

#### Scenario: Format d'affichage des dimensions

**GIVEN** une œuvre avec dimensions `{ height: 60, width: 80 }`
**WHEN** les dimensions sont affichées
**THEN** le format doit être "60 × 80 cm" ou équivalent lisible

---

### R6-MUST-support-future-images

SHALL: Le système doit prévoir un champ `imageUrl` qui supporte des gradients CSS temporaires (MVP) et des URLs d'images réelles (V1)

#### Scenario: Gradient CSS temporaire

**GIVEN** une œuvre avec `imageUrl: "#FFF5F5, #A8C5E2"`
**WHEN** l'image est rendue
**THEN** un gradient CSS doit être appliqué avec ces couleurs

#### Scenario: URL d'image réelle (préparation V1)

**GIVEN** une œuvre avec `imageUrl: "https://cdn.sanity.io/..."`
**WHEN** l'image est rendue
**THEN** le composant `next/image` doit charger l'image externe

---

### R7-MUST-display-gallery-grid

SHALL: Le système doit afficher les œuvres dans une grille responsive : 1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop

#### Scenario: Affichage mobile

**GIVEN** un visiteur sur mobile (< 768px)
**WHEN** il charge la page galerie
**THEN** les œuvres doivent s'afficher en 1 colonne verticale

#### Scenario: Affichage tablette

**GIVEN** un visiteur sur tablette (768px - 1024px)
**WHEN** il charge la page galerie
**THEN** les œuvres doivent s'afficher en 2 colonnes

#### Scenario: Affichage desktop

**GIVEN** un visiteur sur desktop (> 1024px)
**WHEN** il charge la page galerie
**THEN** les œuvres doivent s'afficher en 3 colonnes

---

### R8-MUST-show-artwork-info

SHALL: Le système doit afficher les informations essentielles de chaque œuvre dans la carte galerie : titre, prix, technique

#### Scenario: Carte œuvre complète

**GIVEN** une œuvre dans la galerie
**WHEN** elle est affichée
**THEN** la carte doit montrer :
- Le titre en gras
- Le prix formaté en euros (ex: "450 €")
- La technique artistique
- L'image ou gradient

#### Scenario: Hover state

**GIVEN** un visiteur survole une carte œuvre
**WHEN** le curseur est sur la carte
**THEN** un effet visuel (ombre, élévation) doit indiquer l'interactivité

---

### R9-MUST-prepare-detail-navigation

SHALL: Le système doit préparer la navigation vers les fiches détaillées via le slug (même si la page n'existe pas encore dans le MVP)

#### Scenario: Bouton "Voir les détails"

**GIVEN** une œuvre avec slug "paysage-automnal"
**WHEN** le visiteur clique sur "Voir les détails"
**THEN** le système doit préparer la navigation vers `/oeuvres/paysage-automnal` (implémentation page suivante)

---

## Related Capabilities

- **navigation** (existant) : La galerie utilise la navbar pour être accessible
- **artwork-detail** (futur) : Les slugs et types définis ici seront réutilisés pour les pages de détail
- **sanity-integration** (V1) : La structure de données est conçue pour mapper directement vers les schémas Sanity

---

## Technical Notes

- Les données mockées sont temporaires et seront remplacées par des queries Sanity en V1
- Le type `Artwork` sera régénéré automatiquement par Sanity CLI en V1
- Les gradients CSS permettent un MVP sans dépendances image externes
- Format prix : nombre stocké, formaté à l'affichage (ex: `price.toLocaleString('fr-FR')} €`)
