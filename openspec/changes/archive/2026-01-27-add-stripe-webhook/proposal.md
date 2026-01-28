# Change: Webhook Stripe pour Mise à Jour Automatique du Stock

## Why

Après qu'un client complète un paiement via Stripe Checkout, l'œuvre doit être automatiquement marquée comme indisponible dans Sanity pour éviter les doubles ventes. Actuellement, le système crée des sessions de paiement mais ne met pas à jour le stock automatiquement.

Sans webhook, il faudrait une intervention manuelle après chaque vente pour désactiver l'œuvre, ce qui est inacceptable pour un site e-commerce fonctionnel.

## What Changes

- **Route API `/api/webhook`** : Nouvelle route POST pour recevoir les événements Stripe
- **Validation de signature** : Vérification que les requêtes proviennent réellement de Stripe
- **Mise à jour Sanity** : Marquer automatiquement `isAvailable: false` après paiement réussi
- **Protection race condition** : Vérifier que l'œuvre est disponible avant la mise à jour
- **Logging des événements** : Tracer tous les événements webhook pour audit et debugging
- **Gestion d'erreurs** : Retourner 500 en cas d'échec pour déclencher les retries Stripe

## Impact

### Affected Specs
- **ADDED**: `payment-webhook` (nouvelle capacité)
- **Relates to**: `checkout-flow` (utilise les metadata de session)
- **Relates to**: `payment-infrastructure` (utilise le client Stripe)

### Affected Code
- **New file**: `app/api/webhook/route.ts` - Handler webhook principal
- **New file**: `types/webhook.ts` - Types TypeScript pour les événements
- **Environment**: Ajout de `STRIPE_WEBHOOK_SECRET` à `.env.local`

### User Impact
- ✅ **Désactivation automatique** des œuvres vendues
- ✅ **Évite les doubles ventes** grâce à la mise à jour immédiate
- ✅ **Traçabilité** via logs serveur
- ⚠️ **Dépendance critique** : Si le webhook échoue, intervention manuelle requise

### Technical Impact
- **Sécurité** : Validation de signature Stripe obligatoire
- **Fiabilité** : Retry automatique par Stripe en cas d'échec (jusqu'à 3 jours)
- **Performance** : Opération asynchrone, pas d'impact sur le checkout client

## Dependencies

### Prerequisites
- ✅ Stripe client configuré (`lib/stripe.ts`)
- ✅ Sanity client configuré (`lib/sanity/client.ts`)
- ✅ Route `/api/checkout` fonctionnelle avec metadata
- ⏳ Variable `STRIPE_WEBHOOK_SECRET` configurée

### Blocks
- Aucune autre fonctionnalité ne dépend de celle-ci (peut être implémenté de manière isolée)

### Related Work
- **Suit**: `create-stripe-checkout-api` (archivé 2026-01-27)
- **Précède**: Intégration frontend bouton "Acheter" (Étape 4)
- **Précède**: Emails de confirmation (Sprint 2)

## Risks & Mitigation

### Risk 1: Webhook manqué ou échoué
**Impact**: L'œuvre reste disponible alors qu'elle a été payée → risque de double vente

**Mitigation**:
- Retourner HTTP 500 en cas d'échec → Stripe retry automatique
- Logger tous les échecs pour monitoring manuel
- Dashboard Stripe pour vérifier les webhooks échoués
- En V2: Alerte email si webhook échoue après 3 retries

### Risk 2: Race condition (deux paiements simultanés)
**Impact**: Deux clients paient la même œuvre avant que le webhook ne désactive

**Mitigation**:
- Vérifier `isAvailable` dans le webhook avant mise à jour
- Retourner 200 même si œuvre déjà vendue (idempotence)
- Logger les tentatives de double vente pour analyse

### Risk 3: Signature invalide (attaque ou erreur config)
**Impact**: Webhook refuse toutes les requêtes → aucune œuvre désactivée

**Mitigation**:
- Logger les erreurs de signature avec détails
- Alertes monitoring (Vercel logs)
- Documentation claire pour configuration du secret

### Risk 4: Webhook reçu avant que le client voit la page de succès
**Impact**: Comportement correct mais peut être déroutant en debug

**Mitigation**:
- Documenter que c'est le comportement normal
- Logs avec timestamps pour audit

## Non-Goals (Out of Scope)

- ❌ Envoi d'emails de confirmation (Sprint 2)
- ❌ Dashboard admin pour voir les webhooks (V2)
- ❌ Gestion des remboursements (V2)
- ❌ Mise à jour d'autres champs que `isAvailable`
- ❌ Webhooks pour d'autres événements Stripe (payment_intent.*, etc.)

## Testing Strategy

### Manual Testing
1. **Stripe CLI** : Utiliser `stripe listen --forward-to localhost:3000/api/webhook`
2. **Test checkout complet** : Créer session → payer → vérifier Sanity
3. **Stripe Dashboard** : Vérifier que les webhooks sont reçus et traités

### Automated Testing (Optionnel pour MVP)
- Tests unitaires avec événements Stripe mockés
- Tests de validation de signature

### Validation Checklist
- [ ] Variable `STRIPE_WEBHOOK_SECRET` configurée
- [ ] Webhook reçoit `checkout.session.completed`
- [ ] Signature Stripe validée correctement
- [ ] Œuvre marquée `isAvailable: false` dans Sanity
- [ ] Logs serveur montrent l'événement traité
- [ ] Retour 200 pour succès, 500 pour échec
- [ ] Protection race condition fonctionne

## Timeline & Phases

### Phase 1: Core Implementation (Cette proposition)
- Route `/api/webhook` avec validation signature
- Mise à jour `isAvailable` dans Sanity
- Logging et gestion d'erreurs
- Tests manuels avec Stripe CLI

### Phase 2: Email Notifications (Sprint 2 - Hors scope)
- Email client confirmant l'achat
- Email artiste notifiant la vente

### Phase 3: Advanced Features (V2 - Hors scope)
- Dashboard admin des webhooks
- Gestion des refunds
- Alertes automatiques si webhook échoue

## Open Questions

- ✅ **Gestion échec Sanity**: Retourner 500 et compter sur Stripe retry
- ✅ **Race condition**: Vérifier `isAvailable` avant mise à jour
- ⏳ **Logging level**: Console.log suffit ou besoin de solution externe ? → Console.log pour MVP
- ⏳ **Webhook URL en production**: Vercel génère automatiquement l'URL → Documenter dans tasks.md

## Success Criteria

Cette proposition est un succès si :
- ✅ Les œuvres sont automatiquement marquées indisponibles après paiement
- ✅ Aucun webhook légitime n'est rejeté (signature valide)
- ✅ Les échecs de mise à jour Sanity déclenchent des retries Stripe
- ✅ Aucune double vente n'est possible via race condition
- ✅ Les logs permettent d'auditer tous les événements webhook

## References

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe Signature Verification](https://stripe.com/docs/webhooks/signatures)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- Spec liée: `openspec/specs/checkout-flow/spec.md`
