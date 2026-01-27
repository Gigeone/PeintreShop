# API Route Stripe Checkout - Proposition OpenSpec

## 📋 Vue d'Ensemble

Cette proposition implémente l'**étape 2 du Sprint 1** : la route API `/api/checkout` qui initie les paiements Stripe.

**Approche validée** : Approche B avec vérification de stock avant création de session.

---

## 🎯 Objectif

Créer une route `POST /api/checkout` qui :
1. ✅ **Valide la requête** (artworkId présent)
2. ✅ **Vérifie la disponibilité** de l'œuvre dans Sanity
3. ✅ **Crée une session Stripe Checkout** si disponible
4. ✅ **Retourne l'URL** de redirection vers Stripe
5. ✅ **Gère les erreurs** (404, 410, 500)

---

## 🔄 Workflow de Paiement

```
┌─────────────┐
│   Client    │
│ clique sur  │
│  "Acheter"  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ POST /api/checkout  │
│ {artworkId: "..."}  │
└──────┬──────────────┘
       │
       ▼
┌────────────────────────┐
│ Vérifier isAvailable   │
│ dans Sanity            │
└──────┬─────────────────┘
       │
       ├─── false ──► ❌ 410 Gone (déjà vendue)
       │
       └─── true ───┐
                    ▼
            ┌──────────────────┐
            │ Créer Session    │
            │ Stripe Checkout  │
            └──────┬───────────┘
                   │
                   ▼
            ┌──────────────────┐
            │ Retourner        │
            │ sessionId + url  │
            └──────┬───────────┘
                   │
                   ▼
            ┌──────────────────┐
            │ Redirection      │
            │ vers Stripe      │
            └──────────────────┘
```

---

## 📦 Fichiers à Créer

### 1. `types/checkout.ts`
Types TypeScript pour la requête et la réponse.

### 2. `app/api/checkout/route.ts`
Route API principale avec toute la logique.

### 3. Configuration `.env.local`
Ajout de `NEXT_PUBLIC_SITE_URL` pour les URLs de redirection.

---

## ✅ Critères d'Acceptation

### Fonctionnel
- [ ] Route `POST /api/checkout` répond correctement
- [ ] Vérification `isAvailable` avant création session
- [ ] Session Stripe créée avec tous les détails
- [ ] Retour JSON avec `sessionId` et `url`

### Codes d'Erreur
- [ ] 400 : artworkId manquant
- [ ] 404 : Œuvre introuvable
- [ ] 410 : Œuvre déjà vendue (Gone)
- [ ] 500 : Erreur Stripe/serveur

### Qualité Code
- [ ] Types TypeScript stricts
- [ ] Gestion d'erreurs complète
- [ ] Aucune donnée sensible exposée
- [ ] Build et lint sans erreur

---

## 🔐 Sécurité

### ✅ Protections Implémentées

1. **Validation côté serveur** : artworkId vérifié
2. **Vérification de stock** : évite vente d'œuvre indisponible
3. **Pas de détails sensibles** dans les erreurs client
4. **Logging serveur** pour débogage
5. **Variables d'env** pour URLs (pas de hardcoding)

---

## 🧪 Tests Prévus

### Test 1 : Œuvre Disponible ✅
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"artworkId": "artwork-disponible"}'

# Attendu : 200 + sessionId + url
```

### Test 2 : Œuvre Indisponible ❌
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"artworkId": "artwork-vendue"}'

# Attendu : 410 Gone
```

### Test 3 : Œuvre Introuvable ❌
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"artworkId": "inexistant"}'

# Attendu : 404 Not Found
```

### Test 4 : Données Manquantes ❌
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{}'

# Attendu : 400 Bad Request
```

---

## 📊 Session Stripe Créée

Exemple de session créée par l'API :

```json
{
  "id": "cs_test_abc123...",
  "mode": "payment",
  "payment_method_types": ["card"],
  "amount_total": 35000,
  "currency": "eur",
  "line_items": [
    {
      "price_data": {
        "currency": "eur",
        "unit_amount": 35000,
        "product_data": {
          "name": "Paysage Automnal",
          "images": ["https://cdn.sanity.io/images/..."]
        }
      },
      "quantity": 1
    }
  ],
  "metadata": {
    "artworkId": "artwork-123",
    "artworkSlug": "paysage-automnal"
  },
  "success_url": "https://votre-site.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://votre-site.com/oeuvres/paysage-automnal"
}
```

---

## 🔗 Dépendances

### Dépendances Internes ✅
- `lib/stripe.ts` (étape 1)
- `lib/sanity/client.ts` (Sanity CMS)
- Types `Artwork`

### Dépendances Externes ✅
- Compte Stripe en mode test
- Sanity CMS avec œuvres

### Variables d'Environnement
```env
# Déjà configurées (étape 1)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# À ajouter (étape 2)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 Prochaines Étapes

Après validation de cette API :

### Étape 3 : Webhook Stripe
- Route `POST /api/webhook`
- Écoute de `checkout.session.completed`
- Mise à jour `isAvailable: false` dans Sanity
- Validation de signature Stripe

### Étape 4 : Intégration Frontend
- Remplacer `<Link href="/contact">` par appel à `/api/checkout`
- Rediriger vers `session.url`
- Afficher messages d'erreur (410, 404)

### Sprint 2 : Emails
- Confirmation client
- Notification artiste

---

## 📚 Documentation Technique

### Fichiers de Proposition
- **proposal.md** : Contexte et justification
- **tasks.md** : 7 tâches détaillées d'implémentation
- **specs/checkout-flow/spec.md** : Spécification technique avec 8 requirements

### Validation OpenSpec
```bash
openspec validate create-stripe-checkout-api --strict --no-interactive
✅ PASS (0 erreurs)
```

---

## 💡 Points Clés d'Implémentation

### 1. Conversion Prix en Centimes
```typescript
unit_amount: artwork.price * 100  // 350€ → 35000 centimes
```

### 2. Accès au Slug Sanity
```typescript
artwork.slug.current  // ✅ Correct
artwork.slug          // ❌ Retourne {current: "..."}
```

### 3. URLs de Redirection
```typescript
success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/oeuvres/${artwork.slug.current}`
```

Stripe remplacera `{CHECKOUT_SESSION_ID}` automatiquement.

### 4. Metadata pour Webhook
```typescript
metadata: {
  artworkId: artwork._id,
  artworkSlug: artwork.slug.current
}
```

Ces données seront utilisées par le webhook pour mettre à jour Sanity.

---

## 🎓 Avantages de l'Approche B

✅ **Meilleure UX** : Client informé avant le paiement
✅ **Moins de remboursements** : Pas de paiement si œuvre vendue
✅ **Conformité e-commerce** : Vérification de stock standard
✅ **Race condition réduite** : Double vérification (API + webhook)

---

## ⏱️ Estimation

- **Temps d'implémentation** : 45-60 minutes
- **Complexité** : Moyenne
- **Risques** : Faibles (infrastructure Stripe déjà en place)

---

**Statut** : ✅ Proposition validée, prête pour implémentation
