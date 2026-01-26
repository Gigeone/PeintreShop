# Specification: CMS Configuration

## Purpose

Définir les exigences pour la configuration de Sanity CMS comme système de gestion de contenu headless pour le site e-commerce de l'artiste peintre. Cette configuration permet à l'artiste de gérer de manière autonome les œuvres, images et paramètres du site sans intervention technique.

## ADDED Requirements

### Requirement: Sanity Project Configuration

Le système SHALL configurer un projet Sanity avec les paramètres de connexion nécessaires pour permettre l'accès depuis l'application Next.js.

#### Scenario: Configuration initiale réussie
- **GIVEN** un compte Sanity.io valide avec un project ID
- **WHEN** les variables d'environnement sont configurées (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN)
- **THEN** le client Sanity doit se connecter avec succès au projet
- **AND** les queries GROQ doivent retourner des données sans erreur d'authentification

#### Scenario: Variables d'environnement manquantes
- **GIVEN** l'application Next.js sans variables d'environnement Sanity
- **WHEN** le client Sanity tente de se connecter
- **THEN** le système doit afficher une erreur explicite indiquant les variables manquantes
- **AND** le build de l'application ne doit pas échouer silencieusement

### Requirement: Artwork Schema Definition

Le système SHALL définir un schéma Sanity `artwork` contenant tous les champs nécessaires pour représenter une œuvre d'art avec validation appropriée.

#### Scenario: Création d'une œuvre complète
- **GIVEN** un utilisateur authentifié dans Sanity Studio
- **WHEN** l'utilisateur crée une nouvelle œuvre avec tous les champs requis (title, description, image, price, dimensions, technique)
- **THEN** l'œuvre doit être sauvegardée avec succès dans Sanity
- **AND** un slug doit être généré automatiquement depuis le title
- **AND** les champs isAvailable et isFeatured doivent avoir des valeurs par défaut (true et false)

#### Scenario: Validation du prix
- **GIVEN** un utilisateur créant une œuvre
- **WHEN** l'utilisateur saisit un prix négatif
- **THEN** Sanity doit rejeter la saisie avec un message d'erreur
- **AND** l'utilisateur doit être invité à saisir un prix supérieur ou égal à 0

#### Scenario: Upload d'image avec hotspot
- **GIVEN** un utilisateur créant une œuvre
- **WHEN** l'utilisateur uploade une image
- **THEN** l'image doit être uploadée sur Sanity Assets
- **AND** l'utilisateur doit pouvoir définir un hotspot et un crop pour l'image
- **AND** l'URL de l'image doit être accessible via le CDN Sanity

#### Scenario: Slug unique
- **GIVEN** une œuvre existante avec le slug "paysage-automnal"
- **WHEN** l'utilisateur tente de créer une nouvelle œuvre avec le même titre "Paysage Automnal"
- **THEN** Sanity doit générer automatiquement un slug unique (ex: "paysage-automnal-1")
- **AND** la sauvegarde doit réussir sans conflit

### Requirement: Site Settings Schema

Le système SHALL définir un schéma singleton `siteSettings` pour gérer les paramètres globaux du site.

#### Scenario: Configuration des paramètres du site
- **GIVEN** un utilisateur administrateur dans Sanity Studio
- **WHEN** l'utilisateur accède aux paramètres du site (siteSettings)
- **THEN** un seul document siteSettings doit exister (singleton)
- **AND** l'utilisateur doit pouvoir modifier le titre, description, email de contact, URL Instagram et meta image
- **AND** les modifications doivent être sauvegardées immédiatement

#### Scenario: Validation de l'email de contact
- **GIVEN** un utilisateur modifiant les paramètres du site
- **WHEN** l'utilisateur saisit un email invalide dans contactEmail
- **THEN** Sanity doit rejeter la saisie avec un message d'erreur
- **AND** le format email valide doit être requis

### Requirement: Sanity Client Configuration

Le système SHALL fournir un client Sanity configuré pour effectuer des requêtes depuis les Server Components Next.js.

#### Scenario: Query réussie depuis Server Component
- **GIVEN** un Server Component Next.js
- **WHEN** le composant importe et utilise le client Sanity pour une query GROQ
- **THEN** les données doivent être retournées avec succès
- **AND** les données doivent être servies depuis le CDN Sanity (useCdn: true)
- **AND** la latence doit être inférieure à 200ms

#### Scenario: Gestion d'erreur réseau
- **GIVEN** une interruption de connexion au CDN Sanity
- **WHEN** un Server Component tente une query
- **THEN** le système doit retourner une erreur explicite
- **AND** l'erreur doit être loggée pour debugging
- **AND** une page d'erreur utilisateur appropriée doit être affichée

### Requirement: Image URL Builder

Le système SHALL fournir un helper `urlFor` pour générer des URLs d'images optimisées depuis Sanity Assets.

#### Scenario: Génération d'URL d'image optimisée
- **GIVEN** une référence à une image Sanity
- **WHEN** le helper `urlFor(image).width(800).quality(90).url()` est appelé
- **THEN** une URL CDN Sanity doit être retournée
- **AND** l'URL doit inclure les paramètres de transformation (width, quality)
- **AND** l'image servie doit respecter les paramètres demandés

#### Scenario: Format d'image automatique (WebP)
- **GIVEN** une image uploadée en JPEG dans Sanity
- **WHEN** le helper `urlFor(image).auto('format').url()` est appelé
- **THEN** Sanity CDN doit servir l'image en WebP si le navigateur le supporte
- **AND** l'image doit être servie en JPEG pour les navigateurs ne supportant pas WebP

### Requirement: GROQ Queries Library

Le système SHALL fournir des queries GROQ prédéfinies pour les opérations courantes sur les œuvres et paramètres du site.

#### Scenario: Récupération de toutes les œuvres
- **GIVEN** plusieurs œuvres créées dans Sanity
- **WHEN** la query `getAllArtworks` est exécutée
- **THEN** toutes les œuvres doivent être retournées
- **AND** les œuvres doivent être triées par date de création décroissante
- **AND** les champs essentiels doivent être inclus (_id, title, slug, imageUrl, price, isAvailable)

#### Scenario: Récupération d'une œuvre par slug
- **GIVEN** une œuvre avec le slug "lever-de-soleil"
- **WHEN** la query `getArtworkBySlug("lever-de-soleil")` est exécutée
- **THEN** l'œuvre correspondante doit être retournée
- **AND** tous les champs de l'œuvre doivent être inclus
- **AND** l'URL de l'image haute résolution et LQIP (low quality placeholder) doivent être retournées

#### Scenario: Récupération des œuvres featured
- **GIVEN** 5 œuvres marquées comme featured (isFeatured: true)
- **WHEN** la query `getFeaturedArtworks` est exécutée
- **THEN** maximum 5 œuvres featured doivent être retournées
- **AND** les œuvres doivent être triées par date de création décroissante
- **AND** seules les œuvres disponibles (isAvailable: true) doivent être retournées

#### Scenario: Query sans résultat
- **GIVEN** aucune œuvre dans Sanity
- **WHEN** la query `getAllArtworks` est exécutée
- **THEN** un tableau vide doit être retourné
- **AND** aucune erreur ne doit être levée

### Requirement: Sanity Studio Access

Le système SHALL fournir une route `/studio` accessible pour permettre la gestion du contenu via l'interface Sanity Studio.

#### Scenario: Accès au Studio en local
- **GIVEN** l'application Next.js en développement local
- **WHEN** l'utilisateur navigue vers `http://localhost:3000/studio`
- **THEN** l'interface Sanity Studio doit s'afficher
- **AND** l'utilisateur doit être invité à se connecter avec Sanity
- **AND** après authentification, les schémas artwork et siteSettings doivent être visibles

#### Scenario: Accès au Studio en production
- **GIVEN** l'application déployée sur Vercel
- **WHEN** l'utilisateur navigue vers `https://monsite.com/studio`
- **THEN** l'interface Sanity Studio doit s'afficher
- **AND** seuls les utilisateurs autorisés doivent pouvoir se connecter
- **AND** les modifications doivent être sauvegardées instantanément

#### Scenario: Studio non accessible sans authentification
- **GIVEN** un utilisateur non authentifié
- **WHEN** l'utilisateur tente d'accéder à `/studio`
- **THEN** l'utilisateur doit être redirigé vers la page de connexion Sanity
- **AND** aucune donnée du CMS ne doit être visible sans authentification

### Requirement: TypeScript Type Safety

Le système SHALL fournir des types TypeScript pour toutes les entités Sanity afin de garantir la type-safety dans l'application.

#### Scenario: Types générés depuis schémas
- **GIVEN** les schémas Sanity artwork et siteSettings
- **WHEN** le processus de génération de types est exécuté
- **THEN** des interfaces TypeScript correspondantes doivent être générées
- **AND** les types doivent inclure tous les champs avec leurs types corrects
- **AND** `npm run type-check` ne doit retourner aucune erreur

#### Scenario: Utilisation des types dans le code
- **GIVEN** une query GROQ retournant des artworks
- **WHEN** le résultat est assigné à une variable typée `Artwork[]`
- **THEN** TypeScript doit valider la compatibilité des types
- **AND** l'autocomplétion IDE doit fonctionner pour tous les champs
- **AND** toute tentative d'accès à un champ inexistant doit lever une erreur de compilation

### Requirement: Environment Variables Documentation

Le système SHALL documenter toutes les variables d'environnement requises pour la connexion Sanity dans `.env.example`.

#### Scenario: Documentation des variables complète
- **GIVEN** le fichier `.env.example`
- **WHEN** un développeur consulte ce fichier
- **THEN** toutes les variables Sanity doivent être documentées (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN)
- **AND** chaque variable doit avoir un commentaire expliquant son utilité
- **AND** des exemples de valeurs doivent être fournis

#### Scenario: Variables configurées sur Vercel
- **GIVEN** le projet déployé sur Vercel
- **WHEN** les variables d'environnement Sanity sont configurées dans le dashboard Vercel
- **THEN** l'application doit pouvoir se connecter à Sanity en production
- **AND** les variables doivent être disponibles pour tous les deployments (production et preview)

## Validation Criteria

### Performance
- Queries GROQ doivent s'exécuter en moins de 200ms (avec CDN)
- Images Sanity doivent charger en moins de 500ms (WebP optimisé)
- Studio doit être responsive et s'afficher en moins de 2s

### Sécurité
- `SANITY_API_TOKEN` ne doit jamais être exposé au client
- Seules les queries en lecture doivent utiliser le client public
- Studio accessible uniquement aux utilisateurs autorisés

### Type Safety
- `npm run type-check` doit passer sans erreur
- Tous les types Sanity doivent être exportés et utilisables
- Aucun type `any` non justifié

### Documentation
- README Sanity créé avec instructions claires
- Queries GROQ documentées avec exemples
- Schémas commentés avec descriptions

## Dependencies

### Bloque
- Migration des données mockées vers Sanity
- Connexion Frontend avec queries Sanity
- Configuration Stripe (nécessite artwork IDs Sanity)

### Bloqué par
- MVP complété et déployé
- Structure TypeScript existante

## References

- Sanity Next.js Documentation: https://www.sanity.io/docs/nextjs
- GROQ Query Language: https://www.sanity.io/docs/groq
- Schema Types Reference: https://www.sanity.io/docs/schema-types
