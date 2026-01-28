# Webhook Stripe pour Mise à Jour Automatique du Stock

## 📋 Vue d'Ensemble

Cette proposition implémente l'**étape 3 du Sprint 1** : la route API `/api/webhook` qui reçoit les événements Stripe et met à jour automatiquement le stock dans Sanity après un paiement réussi.

**Statut** : ✅ Proposition validée, prête pour implémentation

---

## 🎯 Objectif

Créer une route `POST /api/webhook` qui :
1. ✅ **Valide la signature Stripe** pour garantir l'authenticité
2. ✅ **Filtre l'événement** `checkout.session.completed` avec paiement confirmé
3. ✅ **Met à jour Sanity** en marquant `isAvailable: false`
4. ✅ **Protège contre race condition** (double vente)
5. ✅ **Gère les erreurs** avec retry automatique Stripe
6. ✅ **Assure l'idempotence** (même webhook reçu plusieurs fois)

---

## 🔄 Workflow de Webhook

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
       │ Webhook: checkout.session.completed
       │
       ▼
┌────────────────────────┐
│ POST /api/webhook      │
│ 1. Validate signature  │
│ 2. Extract artworkId   │
│ 3. Check isAvailable   │
│ 4. Update Sanity       │
│ 5. Return 200 or 500   │
└──────┬─────────────────┘
       │
       ├─── 200 ──► Stripe: Delivered ✓
       │
       └─── 500 ──► Stripe: Retry (3 jours max)
```

---

## 📦 Fichiers à Créer

### 1. `types/webhook.ts`
Types TypeScript pour les événements Stripe webhook.

### 2. `app/api/webhook/route.ts`
Handler principal du webhook avec toute la logique.

### 3. Configuration `.env.local`
Ajout de `STRIPE_WEBHOOK_SECRET` (différent entre dev et prod).

---

## ✅ Critères d'Acceptation

### Fonctionnel
- [ ] Route `POST /api/webhook` répond correctement
- [ ] Validation de signature Stripe fonctionne
- [ ] Événement `checkout.session.completed` traité
- [ ] Œuvre marquée `isAvailable: false` dans Sanity
- [ ] Protection race condition implémentée
- [ ] Idempotence : même webhook reçu 3x sans erreur

### Codes de Retour
- [ ] 200 : Succès ou cas idempotent (œuvre déjà vendue)
- [ ] 400 : Signature invalide ou metadata manquante
- [ ] 500 : Erreur Sanity → Stripe retry automatique

### Qualité Code
- [ ] Types TypeScript stricts
- [ ] Gestion d'erreurs complète
- [ ] Logging de tous les événements
- [ ] Build et lint sans erreur

---

## 🔐 Sécurité

### ✅ Protections Implémentées

1. **Validation de signature Stripe** : `stripe.webhooks.constructEvent()`
2. **Vérification payment_status** : Seuls les paiements "paid" traités
3. **Protection race condition** : Vérifier `isAvailable` avant update
4. **Idempotence** : Gérer gracieusement les œuvres déjà vendues
5. **Logging sécurisé** : Pas de données sensibles dans les logs

---

## 🧪 Tests Prévus

### Test 1 : Webhook Valide avec Stripe CLI ✅
```bash
# Terminal 1
npm run dev

# Terminal 2
stripe listen --forward-to http://localhost:3000/api/webhook

# Terminal 3
stripe trigger checkout.session.completed

# Attendu : 200 + artwork marqué indisponible dans Sanity
```

### Test 2 : Signature Invalide ❌
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "test"}'

# Attendu : 400 (pas de signature Stripe)
```

### Test 3 : Œuvre Déjà Vendue (Idempotence) ✅
```bash
# 1. Marquer une œuvre comme vendue manuellement dans Sanity
# 2. Envoyer un webhook pour cette œuvre
stripe trigger checkout.session.completed --override ...

# Attendu : 200 + log "already_sold: true"
```

### Test 4 : Checkout Complet de Bout en Bout ✅
```bash
# 1. Créer session via /api/checkout
# 2. Payer avec carte test : 4242 4242 4242 4242
# 3. Vérifier webhook reçu et traité (logs)
# 4. Vérifier œuvre indisponible dans Sanity

# Attendu : Tout le flux fonctionne
```

---

## 📊 Structure de l'Événement Stripe

```json
{
  "id": "evt_123...",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "payment_status": "paid",
      "metadata": {
        "artworkId": "abc-123",
        "artworkSlug": "paysage-automnal"
      }
    }
  }
}
```

---

## 🔗 Dépendances

### Dépendances Internes ✅
- `lib/stripe.ts` (étape 1 - payment-infrastructure)
- `lib/sanity/client.ts` (Sanity CMS)
- `/api/checkout` (étape 2 - checkout-flow) pour les metadata

### Dépendances Externes ✅
- Compte Stripe actif
- Sanity CMS configuré
- Webhook endpoint configuré dans Stripe Dashboard (production)

### Variables d'Environnement
```env
# Déjà configurées
NEXT_PUBLIC_SANITY_PROJECT_ID=...
SANITY_API_TOKEN=...
STRIPE_SECRET_KEY=sk_test_...

# À ajouter (étape 3)
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🚀 Configuration du Webhook

### Développement Local
```bash
# Obtenir le secret
stripe listen --print-secret

# Ajouter à .env.local
STRIPE_WEBHOOK_SECRET=whsec_dev_...

# Démarrer l'écoute
stripe listen --forward-to http://localhost:3000/api/webhook
```

### Production (Vercel)
1. **Stripe Dashboard** → Webhooks → Add endpoint
2. **URL** : `https://votre-domaine.vercel.app/api/webhook`
3. **Événements** : Sélectionner `checkout.session.completed`
4. **Copier** le "Signing secret" (commence par `whsec_`)
5. **Vercel Dashboard** → Settings → Environment Variables
6. **Ajouter** : `STRIPE_WEBHOOK_SECRET=whsec_prod_...`
7. **Redéployer** l'application

---

## 🎓 Avantages de l'Approche

✅ **Automatisation complète** : Pas d'intervention manuelle après vente
✅ **Fiabilité** : Retry automatique Stripe pendant 3 jours
✅ **Sécurité** : Validation de signature empêche les webhooks forgés
✅ **Idempotence** : Recevoir le même webhook plusieurs fois ne cause pas d'erreur
✅ **Protection** : Vérification `isAvailable` évite les doubles ventes
✅ **Traçabilité** : Logs complets pour audit et debugging

---

## 🔍 Points Clés d'Implémentation

### 1. Body Brut (Critical)
```typescript
const body = await request.text();  // ✅ Correct
const body = await request.json();  // ❌ Échoue la validation
```

### 2. Validation Signature
```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

### 3. Protection Race Condition
```typescript
const artwork = await client.fetch(...);

if (!artwork.isAvailable) {
  // Déjà vendue, retourner succès (idempotence)
  return Response.json({ received: true, already_sold: true });
}

// Mettre à jour
await client.patch(artworkId).set({ isAvailable: false }).commit();
```

### 4. Retry Strategy
- **Succès (200)** : Webhook délivré, pas de retry
- **Erreur cliente (400)** : Erreur définitive, pas de retry
- **Erreur serveur (500)** : Retry automatique par Stripe

---

## 📚 Documentation Technique

### Fichiers de Proposition
- **proposal.md** : Contexte, objectifs, impact et risques
- **design.md** : Décisions architecturales et trade-offs
- **tasks.md** : 8 tâches détaillées d'implémentation
- **specs/payment-webhook/spec.md** : Spécification technique avec 7 requirements

### Validation OpenSpec
```bash
openspec validate add-stripe-webhook --strict --no-interactive
✅ PASS (0 erreurs)
```

---

## 💡 Décisions Clés

| Décision | Choix | Rationale |
|----------|-------|-----------|
| **Événement écouté** | `checkout.session.completed` | Contient les metadata nécessaires |
| **Gestion échec Sanity** | Retourner 500 → Stripe retry | Fiabilité via retry automatique |
| **Race condition** | Vérifier `isAvailable` avant update | Protection simple et efficace |
| **Idempotence** | Retourner 200 si déjà vendue | Évite erreurs sur webhooks dupliqués |
| **Body parsing** | `request.text()` pas `request.json()` | Requis pour validation signature |

---

## ⏱️ Estimation

- **Temps d'implémentation** : 60-90 minutes
- **Complexité** : Moyenne (validation signature + gestion erreurs)
- **Risques** : Faibles (pattern bien documenté par Stripe)

---

## 🔗 Prochaines Étapes

Après validation de cette API :

### Étape 4 : Intégration Frontend
- Remplacer lien "Contact" par bouton "Acheter"
- Appel à `/api/checkout` avec redirection Stripe
- Page de succès après paiement

### Sprint 2 : Emails
- Confirmation client après paiement
- Notification artiste avec détails commande

### V2 : Dashboard Admin
- Historique des webhooks
- Monitoring des échecs
- Retry manuel si nécessaire

---

**Statut** : ✅ Proposition validée, prête pour implémentation

**Phase** : V1 - Sprint 1 - Étape 3

**Durée estimée** : 60-90 minutes
