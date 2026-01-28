# Design : Webhook Stripe pour Mise à Jour du Stock

## Context

Après qu'un client complète un paiement via Stripe Checkout, le système doit automatiquement mettre à jour la base de données Sanity pour marquer l'œuvre comme indisponible. Cette mise à jour est critique pour éviter les doubles ventes.

### Current State
- ✅ Route `/api/checkout` crée des sessions Stripe avec metadata `artworkId`
- ✅ Stripe process les paiements et génère des événements webhook
- ❌ Pas de route pour recevoir et traiter ces événements
- ❌ Mise à jour manuelle du stock requise après chaque vente

### Stakeholders
- **Artiste** : Veut que les œuvres vendues soient automatiquement retirées de la vente
- **Clients** : Ne doivent pas pouvoir acheter une œuvre déjà vendue
- **Développeurs** : Besoin de logs et traçabilité pour debugging

## Goals / Non-Goals

### Goals
1. ✅ Recevoir et valider les webhooks Stripe de manière sécurisée
2. ✅ Mettre à jour automatiquement `isAvailable: false` dans Sanity après paiement
3. ✅ Protéger contre les doubles ventes via race condition
4. ✅ Assurer l'idempotence (recevoir le même webhook plusieurs fois ne cause pas d'erreur)
5. ✅ Permettre à Stripe de réessayer automatiquement en cas d'échec

### Non-Goals
- ❌ Envoyer des emails de confirmation (Sprint 2)
- ❌ Gérer les remboursements (V2)
- ❌ Créer un dashboard admin des webhooks (V2)
- ❌ Gérer d'autres événements Stripe que `checkout.session.completed`

## Decisions

### Decision 1: Événement Stripe à écouter

**Choix** : `checkout.session.completed`

**Alternatives considérées** :
- `payment_intent.succeeded` : Trop bas niveau, ne contient pas les metadata de session
- `charge.succeeded` : Idem, pas de metadata contextuelles
- `checkout.session.async_payment_succeeded` : Pour les paiements asynchrones (virements), hors scope pour MVP

**Rationale** :
- `checkout.session.completed` contient les metadata (`artworkId`, `artworkSlug`)
- Déclenché une seule fois par session après paiement réussi
- Niveau d'abstraction approprié pour le use case

### Decision 2: Stratégie de validation de signature

**Choix** : Utiliser `stripe.webhooks.constructEvent()` avec le secret webhook

**Alternatives considérées** :
- Valider manuellement le header `stripe-signature` : Complexe et error-prone
- Faire confiance sans validation : **Dangereux**, n'importe qui pourrait envoyer des faux webhooks

**Rationale** :
- Méthode officielle recommandée par Stripe
- Protection contre les attaques malveillantes
- Empêche les webhooks forgés de désactiver des œuvres

### Decision 3: Gestion des erreurs de mise à jour Sanity

**Choix** : Retourner HTTP 500 pour déclencher retry automatique Stripe

**Alternatives considérées** :
- Retourner 200 et logger : Perd l'événement, risque de stock non mis à jour
- Queue système avec retry manuel : Over-engineering pour MVP

**Rationale** :
- Stripe a un système de retry robuste (jusqu'à 3 jours)
- Pas besoin de gérer une queue custom
- Visible dans le Dashboard Stripe pour monitoring

### Decision 4: Protection race condition

**Choix** : Vérifier `isAvailable === true` avant mise à jour, retourner 200 si déjà vendu

**Alternatives considérées** :
- Transaction atomique Sanity : Non supportée par Sanity
- Lock distribué : Over-engineering pour le use case
- Faire confiance à Stripe : Risque théorique de double vente

**Rationale** :
- Simple et efficace
- Idempotent : recevoir le webhook plusieurs fois ne cause pas d'erreur
- Protection suffisante contre le cas edge de deux paiements simultanés

### Decision 5: Body parsing

**Choix** : Utiliser `request.text()` pour obtenir le body brut

**Alternatives considérées** :
- `request.json()` : **Ne fonctionne pas**, Stripe requiert le body brut pour validation signature

**Rationale** :
- Requirement strict de Stripe pour la vérification de signature
- Le parsing JSON se fait après validation via `event.data.object`

## Architecture

### Flow Diagram

```
┌─────────────┐
│   Client    │
│  complète   │
│  paiement   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│     Stripe      │
│   processes     │
│    payment      │
└──────┬──────────┘
       │
       │ POST /api/webhook
       │ event: checkout.session.completed
       │
       ▼
┌───────────────────────────────┐
│  Next.js API Route            │
│  /api/webhook/route.ts        │
│                               │
│  1. Validate signature        │
│  2. Extract artworkId         │
│  3. Check isAvailable         │
│  4. Update Sanity             │
│  5. Return 200 or 500         │
└───────┬───────────────────────┘
        │
        │ Success (200)
        ├─────────────► Stripe marks webhook as delivered
        │
        │ Failure (500)
        └─────────────► Stripe retries with exponential backoff
```

### Data Flow

```
Stripe Event
├── id: "evt_..."
├── type: "checkout.session.completed"
└── data
    └── object (Checkout.Session)
        ├── id: "cs_..."
        ├── payment_status: "paid"
        └── metadata
            ├── artworkId: "abc-123"
            └── artworkSlug: "paysage-automnal"

                    ↓

Sanity Mutation
├── documentId: "abc-123"
└── patch
    └── set
        └── isAvailable: false
```

### Security Layers

```
1. Signature Validation
   └─► stripe.webhooks.constructEvent()
       ├─► Vérifie timestamp
       ├─► Vérifie signature HMAC
       └─► Rejette si invalide (400)

2. Business Logic Validation
   └─► Vérifie payment_status === "paid"
   └─► Vérifie metadata.artworkId présent
   └─► Rejette si manquant (400)

3. Race Condition Protection
   └─► Vérifie isAvailable === true
   └─► Retourne 200 si déjà vendu (idempotence)

4. Error Handling
   └─► Try/catch autour Sanity
   └─► Retourne 500 si échec → Retry Stripe
```

## Risks / Trade-offs

### Risk 1: Webhook delivery delay
**Description** : Le webhook peut arriver quelques secondes après le paiement

**Impact** : Le client voit la page de succès avant que l'œuvre soit marquée indisponible

**Mitigation** :
- Acceptable : La page de succès ne montre pas le statut de l'œuvre
- L'œuvre sera indisponible dans quelques secondes (< 5s généralement)
- En V2 : Utiliser WebSockets pour update en temps réel

**Trade-off** : Simplicité vs temps réel parfait → Simplicité choisie pour MVP

### Risk 2: Sanity API rate limiting
**Description** : Sanity a des limites de rate (depends du plan)

**Impact** : En cas de rush d'achats simultanés, certaines updates pourraient échouer temporairement

**Mitigation** :
- Stripe retry automatique pendant 3 jours
- Logs pour monitoring
- En V2 : Queue système si nécessaire

**Trade-off** : Over-engineering vs risque acceptable → Risque acceptable pour MVP (peu de ventes simultanées)

### Risk 3: Webhook endpoint discovery
**Description** : L'URL du webhook est publique (doit être pour Stripe)

**Impact** : Quelqu'un pourrait théoriquement envoyer des requêtes malveillantes

**Mitigation** :
- Validation de signature Stripe (protection forte)
- Logs des tentatives invalides
- Rate limiting Vercel par défaut

**Trade-off** : Endpoint public vs privé → Public requis par Stripe, sécurisé par signature

### Risk 4: Stripe retry storm
**Description** : Si Sanity est down longtemps, accumulation de retries Stripe

**Impact** : Potentiellement des centaines de requêtes quand Sanity revient

**Mitigation** :
- Acceptable : Les requêtes sont idempotentes
- Rate limiting naturel de Stripe (backoff exponentiel)
- En V2 : Circuit breaker si nécessaire

**Trade-off** : Complexité vs fiabilité → Fiabilité via simplicité

## Migration Plan

### Phase 1: Initial Deployment (Cette proposition)

**Steps** :
1. Déployer la route `/api/webhook` sur Vercel
2. Configurer le webhook endpoint dans Stripe Dashboard
   - URL : `https://votre-domaine.vercel.app/api/webhook`
   - Événement : `checkout.session.completed`
3. Copier le webhook secret dans Vercel Environment Variables
4. Tester avec un vrai paiement en mode test
5. Monitorer les logs Vercel pendant 24h

**Rollback** :
- Supprimer l'endpoint du Dashboard Stripe
- Les paiements continuent de fonctionner (désactivation manuelle)

**Validation** :
- Au moins 1 paiement test traité avec succès
- Logs montrent validation signature OK
- Artwork marqué indisponible dans Sanity

### Phase 2: Production Monitoring (Post-déploiement)

**Steps** :
1. Dashboard Stripe → Webhooks : Vérifier taux de succès > 95%
2. Logs Vercel : Pas d'erreurs 500 répétées
3. Test manuel hebdomadaire : Acheter une œuvre test

**Alerts** :
- Vercel logs : Grep "webhook.*error" quotidiennement
- En V2 : Email alert si webhook échec après 3 retries

### Phase 3: Enhancement (V2 - Optionnel)

- Dashboard admin pour voir historique webhooks
- Retry manuel UI si webhook définitivement échoué
- Support pour autres événements (refunds, etc.)

## Open Questions

### Q1: Faut-il stocker l'historique des webhooks reçus ?

**Options** :
- A) Logger dans console.log uniquement (MVP)
- B) Créer un document Sanity `webhook_event` pour chaque événement
- C) Service externe (Sentry, Logtail)

**Recommendation** : **A pour MVP**, B pour V2

**Rationale** :
- Console.log suffit pour debugging initial
- Vercel garde les logs 7 jours (plan gratuit) à 30 jours (plan pro)
- Stripe Dashboard garde l'historique complet des webhooks

### Q2: Timeout Next.js pour les webhooks ?

**Context** : Vercel a un timeout de 10s par défaut pour les API routes (plan Hobby)

**Analysis** :
- Opération Sanity : < 1s généralement
- Risque de timeout : Très faible
- Si timeout : Stripe retry automatique

**Recommendation** : Aucune action pour MVP, acceptable

### Q3: Gestion multi-artwork (panier) ?

**Context** : Pour MVP, une œuvre = une vente. En V2, possible panier ?

**Impact sur webhook** :
- Session metadata contiendrait `artworkIds: ["id1", "id2"]` au lieu de `artworkId`
- Boucle pour marquer toutes les œuvres indisponibles

**Recommendation** : Hors scope pour MVP, facile à ajouter en V2

## Performance Considerations

### Expected Load
- **MVP** : < 10 ventes par jour
- **V1** : < 50 ventes par jour
- **V2** : < 200 ventes par jour

### Response Time Target
- **Validation signature** : < 50ms
- **Sanity fetch + update** : < 500ms
- **Total webhook response** : < 1s (bien sous le timeout Vercel de 10s)

### Scalability
- **Current design** : Supporte facilement 1000+ ventes par jour
- **Bottleneck potentiel** : Sanity API rate limit (dépend du plan)
- **Monitoring** : Vercel Functions analytics

## Testing Strategy

### Unit Tests (Optionnel pour MVP)
```typescript
describe("Webhook Handler", () => {
  it("should validate Stripe signature", () => {});
  it("should reject invalid signature", () => {});
  it("should update Sanity when artwork available", () => {});
  it("should be idempotent when artwork already sold", () => {});
  it("should return 500 on Sanity error", () => {});
});
```

### Manual Testing (MVP)
1. **Stripe CLI** : `stripe trigger checkout.session.completed`
2. **Test checkout complet** : Créer session → payer → vérifier Sanity
3. **Test race condition** : Marquer artwork vendu → envoyer webhook → vérifier 200
4. **Test erreur** : Webhook avec artworkId invalide → vérifier 500

### Production Monitoring
- Stripe Dashboard → Webhooks → Success rate
- Vercel Logs → Filter "webhook"
- Manual test hebdomadaire

## Implementation Notes

### File Structure
```
app/
└── api/
    └── webhook/
        └── route.ts          # Main webhook handler

types/
└── webhook.ts                # Webhook-specific types

lib/
├── stripe.ts                 # Stripe client (existing)
└── sanity/
    └── client.ts             # Sanity client (existing)
```

### Environment Variables
```bash
# Développement local
STRIPE_WEBHOOK_SECRET=whsec_...(from `stripe listen`)

# Production Vercel
STRIPE_WEBHOOK_SECRET=whsec_...(from Stripe Dashboard)
```

### Logging Convention
```typescript
// Success
console.log(`✓ Webhook ${event.id}: Artwork ${artworkId} marked as sold`);

// Info
console.log(`ℹ Webhook ${event.id}: Artwork ${artworkId} already sold`);

// Error
console.error(`✗ Webhook ${event.id}: Failed to update artwork`, error);
```

## Success Metrics

Cette implémentation est considérée réussie si :

1. **Fiabilité** : > 99% des webhooks sont traités avec succès
2. **Performance** : < 1s de temps de réponse moyen
3. **Sécurité** : 0 faux positifs (webhooks légitimes rejetés)
4. **Idempotence** : Recevoir le même webhook 3x ne cause aucune erreur
5. **Business** : 0 double vente observée en production

## References

- [Stripe Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Stripe Signature Verification](https://stripe.com/docs/webhooks/signatures)
- [Sanity GROQ Mutations](https://www.sanity.io/docs/http-mutations)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Functions Limits](https://vercel.com/docs/functions/limits)

## Appendix: Stripe Webhook Event Structure

```json
{
  "id": "evt_1234567890",
  "object": "event",
  "type": "checkout.session.completed",
  "created": 1234567890,
  "data": {
    "object": {
      "id": "cs_test_abc123",
      "object": "checkout.session",
      "payment_status": "paid",
      "metadata": {
        "artworkId": "0d5abf7a-a356-4e92-915a-13dd4e9a13ca",
        "artworkSlug": "paysage-automnal"
      },
      "amount_total": 35000,
      "currency": "eur"
    }
  }
}
```
