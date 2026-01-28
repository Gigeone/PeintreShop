# Spécification : Webhook de Paiement (Delta)

## Métadonnées

- **Capacité** : `payment-webhook`
- **Type de changement** : ADDED (nouvelle capacité)
- **Phase** : V1 - Sprint 1 - Étape 3
- **Propriétaire** : Backend/API
- **Date de création** : 2026-01-27

---

## Vue d'Ensemble

Cette spécification définit le traitement des webhooks Stripe pour mettre à jour automatiquement le stock dans Sanity après un paiement réussi. Elle couvre la validation de signature, l'extraction des metadata, et la mise à jour sécurisée de la base de données.

**Périmètre :**
- Route API `POST /api/webhook`
- Validation de signature Stripe
- Traitement de l'événement `checkout.session.completed`
- Mise à jour automatique de `isAvailable: false` dans Sanity
- Protection contre les doubles ventes (race condition)
- Gestion d'erreurs et retry automatique

**Hors périmètre :**
- Envoi d'emails de confirmation (Sprint 2)
- Gestion des remboursements (V2)
- Dashboard admin des webhooks (V2)
- Autres événements Stripe (`payment_intent.*`, `charge.*`, etc.)

---

## ADDED Requirements

### Requirement: WEBHOOK-SIGNATURE-MUST-be-validated

**SHALL** : Le webhook doit valider la signature Stripe avant tout traitement pour garantir l'authenticité des événements.

#### Scenario: Webhook avec signature valide

**Étant donné** que Stripe envoie un événement webhook avec une signature HMAC valide
**Et** que `STRIPE_WEBHOOK_SECRET` est configuré correctement
**Quand** le webhook reçoit la requête POST
**Alors** la signature est validée avec succès
**Et** l'événement est extrait et traité

#### Scenario: Webhook avec signature invalide

**Étant donné** qu'une requête POST est envoyée à `/api/webhook`
**Et** que le header `stripe-signature` est manquant ou invalide
**Quand** le webhook tente de valider la signature
**Alors** l'API retourne un statut HTTP 400
**Et** le corps de la réponse contient :
```json
{
  "error": "Invalid signature"
}
```
**Et** l'événement est rejeté sans traitement
**Et** l'erreur est loggée côté serveur

#### Scenario: STRIPE_WEBHOOK_SECRET non configuré

**Étant donné** que la variable d'environnement `STRIPE_WEBHOOK_SECRET` n'est pas définie
**Quand** le webhook reçoit une requête
**Alors** l'API retourne un statut HTTP 500
**Et** le message indique que la configuration est manquante
**Et** l'erreur est loggée avec détails

**Critères de validation :**
```bash
# Test avec Stripe CLI
stripe listen --forward-to http://localhost:3000/api/webhook
stripe trigger checkout.session.completed
# Doit passer la validation et traiter l'événement
```

---

### Requirement: WEBHOOK-EVENT-MUST-filter-relevant-events

**SHALL** : Le webhook doit filtrer et traiter uniquement l'événement `checkout.session.completed` avec statut de paiement confirmé.

#### Scenario: Événement checkout.session.completed avec paiement réussi

**Étant donné** qu'un événement `checkout.session.completed` est reçu
**Et** que `session.payment_status === "paid"`
**Et** que les metadata contiennent `artworkId`
**Quand** le webhook traite l'événement
**Alors** l'événement est accepté pour traitement
**Et** l'artworkId est extrait des metadata

#### Scenario: Événement checkout.session.completed avec paiement en attente

**Étant donné** qu'un événement `checkout.session.completed` est reçu
**Et** que `session.payment_status === "unpaid"` ou `"no_payment_required"`
**Quand** le webhook traite l'événement
**Alors** l'API retourne un statut HTTP 200
**Et** aucune mise à jour Sanity n'est effectuée
**Et** un log indique que l'événement est ignoré

#### Scenario: Événement non pertinent reçu

**Étant donné** qu'un événement Stripe d'un autre type est reçu
**Exemples** : `payment_intent.succeeded`, `charge.succeeded`, `customer.created`
**Quand** le webhook reçoit l'événement
**Alors** l'API retourne un statut HTTP 200
**Et** aucun traitement n'est effectué
**Et** un log indique que l'événement est ignoré

#### Scenario: Metadata artworkId manquante

**Étant donné** qu'un événement `checkout.session.completed` est reçu
**Et** que les metadata ne contiennent pas de champ `artworkId`
**Quand** le webhook tente d'extraire l'artworkId
**Alors** l'API retourne un statut HTTP 400
**Et** le message indique que l'artworkId est manquante
**Et** l'erreur est loggée avec l'ID de session

---

### Requirement: WEBHOOK-STOCK-MUST-update-sanity

**SHALL** : Le webhook doit mettre à jour automatiquement le champ `isAvailable: false` de l'œuvre dans Sanity après un paiement réussi.

#### Scenario: Mise à jour réussie d'une œuvre disponible

**Étant donné** qu'un événement webhook valide est reçu avec `artworkId: "abc-123"`
**Et** que l'œuvre avec ID "abc-123" existe dans Sanity
**Et** que `isAvailable === true`
**Quand** le webhook met à jour l'œuvre
**Alors** le champ `isAvailable` est défini à `false`
**Et** l'API retourne un statut HTTP 200
**Et** le corps de la réponse contient :
```json
{
  "received": true,
  "artworkId": "abc-123",
  "updated": true
}
```
**Et** un log de succès est créé

#### Scenario: Œuvre introuvable dans Sanity

**Étant donné** qu'un événement webhook valide est reçu avec `artworkId: "nonexistent"`
**Et** qu'aucune œuvre avec cet ID n'existe dans Sanity
**Quand** le webhook tente de récupérer l'œuvre
**Alors** l'API retourne un statut HTTP 500
**Et** le message indique que l'œuvre n'a pas été trouvée
**Et** l'erreur est loggée pour investigation
**Et** Stripe réessayera automatiquement le webhook

#### Scenario: Échec de connexion à Sanity

**Étant donné** qu'un événement webhook valide est reçu
**Et** que Sanity est temporairement injoignable (réseau, timeout, etc.)
**Quand** le webhook tente de mettre à jour l'œuvre
**Alors** l'API retourne un statut HTTP 500
**Et** le message indique un échec de mise à jour
**Et** l'erreur complète est loggée côté serveur
**Et** Stripe réessayera automatiquement

---

### Requirement: WEBHOOK-IDEMPOTENCE-MUST-prevent-errors

**SHALL** : Le webhook doit être idempotent et gérer gracieusement les cas où l'œuvre est déjà marquée comme vendue.

#### Scenario: Webhook reçu pour une œuvre déjà vendue

**Étant donné** qu'un événement webhook valide est reçu avec `artworkId: "abc-123"`
**Et** que l'œuvre existe dans Sanity
**Et** que `isAvailable === false` (déjà vendue)
**Quand** le webhook vérifie la disponibilité
**Alors** aucune mise à jour n'est effectuée
**Et** l'API retourne un statut HTTP 200
**Et** le corps de la réponse contient :
```json
{
  "received": true,
  "artworkId": "abc-123",
  "already_sold": true
}
```
**Et** un log informatif indique que l'œuvre était déjà vendue

**Critères de validation :**
- Recevoir le même webhook 3 fois ne cause aucune erreur
- Le log indique clairement qu'il s'agit d'une opération idempotente

#### Scenario: Protection contre la race condition

**Étant donné** que deux clients paient simultanément la même œuvre (cas théorique)
**Et** que deux sessions Stripe sont créées avec le même `artworkId`
**Quand** les deux webhooks arrivent quasi-simultanément
**Alors** le premier webhook marque l'œuvre `isAvailable: false`
**Et** le second webhook détecte que `isAvailable === false`
**Et** le second webhook retourne 200 avec `already_sold: true`
**Et** aucune erreur n'est levée
**Et** les deux webhooks sont marqués comme traités avec succès

**Note** : Ce scénario est protégé en amont par la vérification dans `/api/checkout`, mais le webhook ajoute une couche de protection supplémentaire.

---

### Requirement: WEBHOOK-ERRORS-MUST-trigger-retry

**SHALL** : Le webhook doit retourner les codes HTTP appropriés pour permettre à Stripe de réessayer automatiquement en cas d'échec.

#### Scenario: Échec de mise à jour retourne 500

**Étant donné** qu'un événement webhook valide est reçu
**Et** que la mise à jour Sanity échoue (erreur réseau, timeout, permissions, etc.)
**Quand** le webhook tente de traiter l'événement
**Alors** l'API retourne un statut HTTP 500
**Et** Stripe marque le webhook comme échoué
**Et** Stripe réessayera automatiquement avec backoff exponentiel
**Et** Les retries se poursuivent pendant jusqu'à 3 jours

#### Scenario: Erreur de validation retourne 400

**Étant donné** qu'un événement webhook est reçu avec une signature invalide
**Ou** que les metadata sont malformées
**Quand** le webhook valide la requête
**Alors** l'API retourne un statut HTTP 400
**Et** Stripe ne réessaye PAS (erreur cliente)
**Et** L'événement est marqué comme définitivement échoué dans Stripe Dashboard

#### Scenario: Succès retourne 200

**Étant donné** qu'un événement webhook est traité avec succès
**Ou** qu'il s'agit d'un cas idempotent (œuvre déjà vendue)
**Quand** le webhook termine le traitement
**Alors** l'API retourne un statut HTTP 200
**Et** Stripe marque le webhook comme délivré avec succès
**Et** Aucun retry ne sera effectué

---

### Requirement: WEBHOOK-LOGGING-MUST-trace-events

**SHALL** : Le webhook doit logger tous les événements importants pour faciliter le debugging et l'audit.

#### Scenario: Événement traité avec succès

**Étant donné** qu'un webhook est traité avec succès
**Quand** l'œuvre est marquée comme vendue
**Alors** un log de succès est créé contenant :
- ID de l'événement Stripe
- Type d'événement
- artworkId
- Titre de l'œuvre
- Timestamp

**Format attendu :**
```
✓ Webhook evt_123: checkout.session.completed
✓ Processing payment for artwork: abc-123
✓ Artwork abc-123 (Paysage Automnal) marked as sold
```

#### Scenario: Erreur de traitement

**Étant donné** qu'un webhook échoue (signature invalide, erreur Sanity, etc.)
**Quand** l'erreur se produit
**Alors** un log d'erreur est créé contenant :
- ID de l'événement (si disponible)
- Type d'erreur
- Message d'erreur
- Stack trace (si applicable)
- Timestamp

**Format attendu :**
```
✗ Webhook evt_123: Invalid signature
✗ Webhook evt_456: Failed to update artwork abc-123
Error: Network timeout connecting to Sanity
```

#### Scenario: Événement ignoré

**Étant donné** qu'un événement non pertinent est reçu
**Quand** le webhook décide de l'ignorer
**Alors** un log informatif est créé contenant :
- Type d'événement
- Raison de l'ignorance

**Format attendu :**
```
ℹ Ignoring event type: payment_intent.succeeded
ℹ Session cs_123 not paid yet: unpaid
```

---

### Requirement: WEBHOOK-BODY-MUST-be-raw

**SHALL** : Le webhook doit lire le body de la requête en format brut (string) pour permettre la validation de signature Stripe.

#### Scenario: Body brut pour validation signature

**Étant donné** qu'un webhook Stripe arrive
**Quand** le handler lit le body de la requête
**Alors** le body est lu via `request.text()` (pas `request.json()`)
**Et** le body brut est passé à `stripe.webhooks.constructEvent()`
**Et** la validation de signature réussit

#### Scenario: Utilisation de request.json() échoue

**Étant donné** qu'un webhook utilise incorrectement `request.json()`
**Quand** la validation de signature est tentée
**Alors** la validation échoue systématiquement
**Et** Tous les webhooks sont rejetés

**Note** : Ce n'est pas un scénario de test mais une contrainte d'implémentation critique.

---

## Relations avec d'Autres Capacités

**Dépendances (utilise) :**
- `payment-infrastructure` : Client Stripe pour validation de signature
- `checkout-flow` : Metadata (`artworkId`, `artworkSlug`) créées par la session checkout
- Sanity CMS : Client pour requêtes GROQ et mutations

**Impact futur sur (sera utilisé par) :**
- Email notifications (Sprint 2) : Webhook déclenche les envois d'emails
- Admin dashboard (V2) : Historique des webhooks traités

---

## Notes d'Implémentation

### Fichiers Concernés

- **New**: `app/api/webhook/route.ts` - Handler webhook principal
- **New**: `types/webhook.ts` - Types TypeScript pour événements
- **Uses**: `lib/stripe.ts` - Client Stripe existant
- **Uses**: `lib/sanity/client.ts` - Client Sanity existant

### Validation de Signature

```typescript
const event = stripe.webhooks.constructEvent(
  body,          // Body brut (string)
  signature,     // Header stripe-signature
  process.env.STRIPE_WEBHOOK_SECRET
);
```

**Important** :
- Le body doit être brut (via `request.text()`)
- La signature est dans le header `stripe-signature`
- Le secret diffère entre dev (Stripe CLI) et prod (Dashboard)

### Requête GROQ Sanity

```groq
*[_type == "artwork" && _id == $artworkId][0]{
  _id,
  title,
  isAvailable
}
```

Cette requête :
- Récupère l'œuvre par ID
- Retourne `isAvailable` pour protection race condition
- Retourne le titre pour logging

### Mutation Sanity

```typescript
await client
  .patch(artworkId)
  .set({ isAvailable: false })
  .commit();
```

Opération atomique qui met à jour uniquement le champ `isAvailable`.

### Configuration du Webhook

**Développement local** :
```bash
stripe listen --forward-to http://localhost:3000/api/webhook
# Copier le webhook secret affiché dans .env.local
```

**Production (Vercel)** :
1. Stripe Dashboard → Webhooks → Add endpoint
2. URL : `https://votre-domaine.vercel.app/api/webhook`
3. Événements sélectionnés : `checkout.session.completed`
4. Copier le "Signing secret"
5. Vercel Dashboard → Settings → Environment Variables → Ajouter `STRIPE_WEBHOOK_SECRET`

### Retry Policy Stripe

- **Premier retry** : Immédiatement
- **Retries suivants** : Backoff exponentiel (1h, 3h, 6h, 12h, 24h)
- **Durée maximale** : 3 jours
- **Condition** : HTTP 5xx ou timeout
- **Pas de retry** : HTTP 2xx ou 4xx

### Idempotence Pattern

```typescript
// 1. Récupérer l'état actuel
const artwork = await client.fetch(...);

// 2. Vérifier si déjà traité
if (!artwork.isAvailable) {
  return Response.json({ received: true, already_sold: true });
}

// 3. Effectuer la mutation
await client.patch(artworkId).set({ isAvailable: false }).commit();
```

Ce pattern garantit qu'on peut recevoir le même webhook plusieurs fois sans erreur.

---

## Références

- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Signature Verification](https://stripe.com/docs/webhooks/signatures)
- [Stripe Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Sanity GROQ Mutations](https://www.sanity.io/docs/http-mutations)
- Capacité liée : `checkout-flow` (`openspec/specs/checkout-flow/spec.md`)
- Capacité liée : `payment-infrastructure` (`openspec/specs/payment-infrastructure/spec.md`)

---

## Exemples de Test

### Test avec Stripe CLI

```bash
# Terminal 1: Démarrer Next.js
npm run dev

# Terminal 2: Écouter les webhooks
stripe listen --forward-to http://localhost:3000/api/webhook

# Terminal 3: Déclencher un événement
stripe trigger checkout.session.completed \
  --override checkout_session:metadata[artworkId]=abc-123
```

### Test avec curl (signature invalide)

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "checkout.session.completed"}'
# Doit retourner 400 (pas de signature)
```

### Vérification dans Sanity

```bash
# Après webhook traité
# Vérifier que isAvailable === false pour l'artwork
```

---

## Historique

- **2026-01-27** : Création initiale (change: `add-stripe-webhook`)
  - Définition des 7 requirements
  - Validation signature et idempotence
  - Protection race condition
