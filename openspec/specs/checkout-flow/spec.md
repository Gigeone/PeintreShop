# Spécification : Flux de Checkout

## Métadonnées

- **Capacité** : `checkout-flow`
- **Propriétaire** : Backend/API
- **Phase** : V1 - Sprint 1
- **Statut** : ✅ Implémentée (2026-01-27)

---

## Vue d'Ensemble

Cette spécification définit le flux de création de sessions de paiement Stripe Checkout pour la vente d'œuvres d'art uniques. Elle couvre la validation de disponibilité, la création de session, et la gestion des cas d'erreur.

**Périmètre :**
- Route API `POST /api/checkout`
- Vérification de disponibilité de l'œuvre dans Sanity
- Création de session Stripe Checkout
- Gestion d'erreurs (œuvre indisponible, introuvable, erreurs Stripe)

**Hors périmètre :**
- Webhook Stripe pour mise à jour du stock (voir `payment-webhook`)
- Intégration frontend du bouton "Acheter"
- Pages de succès/annulation personnalisées
- Emails de confirmation

---

## Requirements

### Requirement: CHECKOUT-API-MUST-validate-request

**SHALL** : L'API checkout doit valider la requête entrante avant tout traitement.

#### Scenario: Requête valide avec artworkId

**Étant donné** qu'un client souhaite acheter une œuvre
**Quand** le frontend envoie `POST /api/checkout` avec `{"artworkId": "abc123"}`
**Alors** la requête est acceptée pour traitement
**Et** l'API continue vers la vérification de disponibilité

#### Scenario: Requête invalide sans artworkId

**Étant donné** qu'un client souhaite acheter une œuvre
**Quand** le frontend envoie `POST /api/checkout` avec `{}`
**Alors** l'API retourne un statut HTTP 400
**Et** le corps de la réponse contient :
```json
{
  "error": "Bad Request",
  "message": "artworkId is required"
}
```

---

### Requirement: CHECKOUT-STOCK-MUST-verify-availability

**SHALL** : L'API doit vérifier la disponibilité de l'œuvre dans Sanity avant de créer une session de paiement.

#### Scenario: Œuvre disponible

**Étant donné** qu'une œuvre avec ID "artwork-123" existe dans Sanity
**Et** son champ `isAvailable` est `true`
**Quand** l'API reçoit `POST /api/checkout` avec `{"artworkId": "artwork-123"}`
**Alors** la vérification réussit
**Et** l'API continue vers la création de session Stripe

#### Scenario: Œuvre indisponible (déjà vendue)

**Étant donné** qu'une œuvre avec ID "artwork-456" existe dans Sanity
**Et** son champ `isAvailable` est `false`
**Quand** l'API reçoit `POST /api/checkout` avec `{"artworkId": "artwork-456"}`
**Alors** l'API retourne un statut HTTP 410 (Gone)
**Et** le corps de la réponse contient :
```json
{
  "error": "Gone",
  "message": "This artwork is no longer available"
}
```

**Critères de validation :**
- Aucune session Stripe n'est créée
- Le client est informé avant d'être redirigé vers Stripe

#### Scenario: Œuvre introuvable

**Étant donné** qu'aucune œuvre avec ID "nonexistent" n'existe dans Sanity
**Quand** l'API reçoit `POST /api/checkout` avec `{"artworkId": "nonexistent"}`
**Alors** l'API retourne un statut HTTP 404 (Not Found)
**Et** le corps de la réponse contient :
```json
{
  "error": "Not Found",
  "message": "Artwork not found"
}
```

---

### Requirement: CHECKOUT-SESSION-MUST-create-stripe-session

**SHALL** : L'API doit créer une session Stripe Checkout avec les informations correctes de l'œuvre.

#### Scenario: Création de session réussie

**Étant donné** qu'une œuvre "Paysage Automnal" est disponible
**Et** son prix est 350 €
**Et** son image est `https://cdn.sanity.io/images/...`
**Quand** l'API crée la session Stripe
**Alors** la session contient :
- `mode: "payment"`
- `payment_method_types: ["card"]`
- `line_items[0].price_data.currency: "eur"`
- `line_items[0].price_data.unit_amount: 35000` (350€ en centimes)
- `line_items[0].price_data.product_data.name: "Paysage Automnal"`
- `line_items[0].price_data.product_data.images: ["https://cdn.sanity.io/images/..."]`
- `line_items[0].quantity: 1`
- `metadata.artworkId: "artwork-123"`
- `metadata.artworkSlug: "paysage-automnal"`
- `success_url` contenant `{CHECKOUT_SESSION_ID}`
- `cancel_url` pointant vers `/oeuvres/paysage-automnal`

#### Scenario: Conversion correcte du prix en centimes

**Étant donné** qu'une œuvre a un prix de 250 €
**Quand** l'API crée la session Stripe
**Alors** `unit_amount` est `25000` (250 * 100)

**Étant donné** qu'une œuvre a un prix de 1500.50 €
**Quand** l'API crée la session Stripe
**Alors** `unit_amount` est `150050` (1500.50 * 100)

---

### Requirement: CHECKOUT-RESPONSE-MUST-return-session-url

**SHALL** : L'API doit retourner l'ID de session et l'URL de redirection vers Stripe.

#### Scenario: Réponse de succès

**Étant donné** qu'une session Stripe a été créée avec succès
**Et** l'ID de session est `cs_test_abc123`
**Et** l'URL de checkout est `https://checkout.stripe.com/c/pay/cs_test_abc123`
**Quand** l'API retourne la réponse
**Alors** le statut HTTP est 200
**Et** le corps de la réponse JSON contient :
```json
{
  "sessionId": "cs_test_abc123",
  "url": "https://checkout.stripe.com/c/pay/cs_test_abc123"
}
```

---

### Requirement: CHECKOUT-URLS-MUST-use-site-url

**SHALL** : Les URLs de succès et d'annulation doivent utiliser la variable d'environnement `NEXT_PUBLIC_SITE_URL`.

#### Scenario: Configuration des URLs de redirection

**Étant donné** que `NEXT_PUBLIC_SITE_URL` est défini à `https://artiste.com`
**Et** l'œuvre a le slug `paysage-automnal`
**Quand** l'API crée la session Stripe
**Alors** `success_url` est `https://artiste.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`
**Et** `cancel_url` est `https://artiste.com/oeuvres/paysage-automnal`

#### Scenario: Variable NEXT_PUBLIC_SITE_URL manquante

**Étant donné** que `NEXT_PUBLIC_SITE_URL` n'est pas définie
**Quand** l'API traite une requête
**Alors** une erreur HTTP 500 est retournée
**Et** le message indique que la configuration est manquante

---

### Requirement: CHECKOUT-ERRORS-MUST-be-handled

**SHALL** : L'API doit gérer toutes les erreurs possibles avec des codes HTTP appropriés et des messages clairs.

#### Scenario: Erreur Stripe (clé invalide)

**Étant donné** que la clé Stripe secrète est invalide
**Quand** l'API tente de créer une session
**Alors** l'API retourne un statut HTTP 500
**Et** le corps de la réponse contient :
```json
{
  "error": "Payment Error",
  "message": "Failed to create checkout session"
}
```
**Et** les détails de l'erreur sont loggés côté serveur
**Et** aucune information sensible (clés, IDs internes) n'est exposée au client

#### Scenario: Body JSON malformé

**Étant donné** qu'un client envoie un body JSON invalide
**Quand** l'API tente de parser le body
**Alors** l'API retourne un statut HTTP 400
**Et** le message indique que le JSON est invalide

#### Scenario: Erreur de connexion Sanity

**Étant donné** que Sanity est injoignable
**Quand** l'API tente de vérifier la disponibilité
**Alors** l'API retourne un statut HTTP 500
**Et** le message indique un problème serveur
**Et** l'erreur est loggée côté serveur

---

### Requirement: CHECKOUT-METADATA-MUST-track-artwork

**SHALL** : La session Stripe doit inclure les metadata nécessaires pour lier le paiement à l'œuvre.

#### Scenario: Metadata de session

**Étant donné** qu'une œuvre a :
- ID : `artwork-123`
- Slug : `paysage-automnal`
**Quand** l'API crée la session Stripe
**Alors** `session.metadata` contient :
```json
{
  "artworkId": "artwork-123",
  "artworkSlug": "paysage-automnal"
}
```

**Utilisation :**
Ces metadata seront utilisées par le webhook pour :
1. Identifier l'œuvre à marquer comme vendue
2. Permettre la traçabilité du paiement

---

## Relations avec d'Autres Capacités

**Dépendances (utilise) :**
- `payment-infrastructure` : Client Stripe serveur
- Sanity CMS : Requêtes GROQ pour vérifier `isAvailable`

**Impact futur sur (sera utilisé par) :**
- Frontend : Bouton "Acheter" appellera cette API
- `payment-webhook` : Webhook récupérera les metadata de session

---

## Notes d'Implémentation

### Fichiers Concernés

- `app/api/checkout/route.ts` : Route API principale
- `types/checkout.ts` : Types TypeScript
- `lib/stripe.ts` : Client Stripe (dépendance)
- `lib/sanity/client.ts` : Client Sanity (dépendance)

### Requête GROQ Sanity

```groq
*[_type == "artwork" && _id == $artworkId][0]{
  _id,
  title,
  slug,
  price,
  isAvailable,
  "imageUrl": image.asset->url
}
```

Cette requête :
- Filtre par type et ID
- Récupère les champs nécessaires
- Résout l'URL de l'image depuis l'asset

### Conversion Prix en Centimes

```typescript
const priceInCents = Math.round(artwork.price * 100);
```

Important : utiliser `Math.round()` pour éviter les problèmes de précision flottante.

### Gestion du Slug Sanity

Sanity stocke les slugs comme objet : `{current: "slug-value"}`.
Toujours accéder avec `.current` :

```typescript
cancel_url: `${baseUrl}/oeuvres/${artwork.slug.current}`
```

---

## Références

- [Stripe Checkout Sessions API](https://stripe.com/docs/api/checkout/sessions/create)
- [Stripe Checkout Quickstart](https://stripe.com/docs/payments/checkout/how-checkout-works)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Sanity GROQ Queries](https://www.sanity.io/docs/groq)
- Capacité liée : `payment-infrastructure` (`openspec/specs/payment-infrastructure/spec.md`)

---

## Historique

- **2026-01-27** : Création initiale (change: `create-stripe-checkout-api`)
  - Implémentation complète de l'API checkout
  - 7 requirements validés par tests
  - Conformité 100% à la spec
