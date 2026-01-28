# 🧪 Guide de Test - Webhook Stripe

Ce guide vous accompagne pour tester le webhook Stripe qui met à jour automatiquement le stock après un paiement.

---

## 📋 Prérequis

- [x] Stripe CLI installé : https://stripe.com/docs/stripe-cli
- [x] Serveur Next.js démarré : `npm run dev`
- [x] Variable `STRIPE_WEBHOOK_SECRET` configurée

---

## 🚀 Installation Stripe CLI

### Windows
```powershell
# Avec Scoop
scoop install stripe

# Ou télécharger depuis
# https://github.com/stripe/stripe-cli/releases
```

### macOS
```bash
brew install stripe/stripe-cli/stripe
```

### Linux
```bash
# Voir https://stripe.com/docs/stripe-cli#install
```

---

## 🔐 Configuration du Webhook Secret

### Étape 1 : Authentifier Stripe CLI
```bash
stripe login
# Suivre les instructions dans le navigateur
```

### Étape 2 : Démarrer l'écoute des webhooks
```bash
stripe listen --forward-to http://localhost:3000/api/webhook
```

**Sortie attendue :**
```
> Ready! You are using Stripe API Version [2024-XX-XX]
> Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxx (^C to quit)
```

### Étape 3 : Copier le secret dans .env.local
```bash
# Ouvrir .env.local et remplacer
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### Étape 4 : Redémarrer Next.js
```bash
# Ctrl+C puis
npm run dev
```

---

## 🧪 Tests Manuels

### Test 1 : Webhook avec Stripe CLI (Recommandé)

**Terminal 1** : Serveur Next.js
```bash
npm run dev
```

**Terminal 2** : Stripe CLI
```bash
stripe listen --forward-to http://localhost:3000/api/webhook
```

**Terminal 3** : Déclencher un événement
```bash
# Option A: Événement générique (metadata par défaut)
stripe trigger checkout.session.completed

# Option B: Avec un vrai artworkId de votre Sanity
stripe trigger checkout.session.completed \
  --override checkout_session:metadata[artworkId]=VOTRE_ARTWORK_ID \
  --override checkout_session:metadata[artworkSlug]=votre-slug
```

**✅ Succès attendu** :
- Terminal 1 (Next.js) : Logs indiquant le traitement du webhook
- Terminal 2 (Stripe CLI) : `200 POST /api/webhook`
- Sanity : L'œuvre est marquée `isAvailable: false`

---

### Test 2 : Checkout Complet (End-to-End)

**Objectif** : Tester le flux complet de bout en bout

**Étapes** :

1. **Obtenir un artworkId valide**
   ```bash
   # Ouvrir Sanity Studio ou utiliser l'API
   # Exemple : 0d5abf7a-a356-4e92-915a-13dd4e9a13ca
   ```

2. **Créer une session de checkout**
   ```bash
   curl -X POST http://localhost:3000/api/checkout \
     -H "Content-Type: application/json" \
     -d '{"artworkId": "VOTRE_ARTWORK_ID"}'
   ```

3. **Copier l'URL retournée**
   ```json
   {
     "sessionId": "cs_test_...",
     "url": "https://checkout.stripe.com/c/pay/cs_test_..."
   }
   ```

4. **Ouvrir l'URL dans un navigateur**
   - Entrer les informations de carte test : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres
   - Compléter le paiement

5. **Vérifier le webhook**
   - Terminal Stripe CLI : Doit afficher `checkout.session.completed`
   - Terminal Next.js : Logs `✓ Artwork marked as sold`

6. **Vérifier dans Sanity**
   - L'œuvre doit avoir `isAvailable: false`

**✅ Succès attendu** :
Tout le flux fonctionne et l'œuvre est automatiquement désactivée.

---

### Test 3 : Protection Race Condition (Idempotence)

**Objectif** : Vérifier que le webhook gère correctement les œuvres déjà vendues

**Étapes** :

1. **Marquer une œuvre comme vendue manuellement**
   - Aller dans Sanity Studio
   - Éditer une œuvre
   - Mettre `isAvailable: false`
   - Publier

2. **Envoyer un webhook pour cette œuvre**
   ```bash
   stripe trigger checkout.session.completed \
     --override checkout_session:metadata[artworkId]=ARTWORK_DEJA_VENDU
   ```

3. **Vérifier les logs**
   ```
   ℹ Artwork abc-123 (Titre) already sold, ignoring webhook
   ```

4. **Vérifier la réponse**
   - Status : `200 OK`
   - Body : `{ "received": true, "already_sold": true }`

**✅ Succès attendu** :
Le webhook retourne 200 sans erreur et logge que l'œuvre était déjà vendue.

---

### Test 4 : Signature Invalide

**Objectif** : Vérifier que les webhooks non signés sont rejetés

**Étapes** :

1. **Envoyer une requête sans signature Stripe**
   ```bash
   curl -X POST http://localhost:3000/api/webhook \
     -H "Content-Type: application/json" \
     -d '{"type": "checkout.session.completed"}'
   ```

2. **Vérifier la réponse**
   - Status : `400 Bad Request`
   - Body : `{ "error": "No signature" }`

3. **Vérifier les logs**
   ```
   ✗ Webhook: No signature header
   ```

**✅ Succès attendu** :
La requête est rejetée avec une erreur 400.

---

### Test 5 : Artwork Introuvable

**Objectif** : Vérifier la gestion d'erreur quand l'œuvre n'existe pas

**Étapes** :

1. **Envoyer un webhook avec un artworkId invalide**
   ```bash
   stripe trigger checkout.session.completed \
     --override checkout_session:metadata[artworkId]=nonexistent-id-12345
   ```

2. **Vérifier la réponse**
   - Status : `500 Internal Server Error`
   - Body : `{ "error": "Artwork not found" }`

3. **Vérifier les logs**
   ```
   ✗ Artwork not found: nonexistent-id-12345
   ```

4. **Vérifier le retry Stripe**
   - Stripe CLI doit montrer que Stripe va réessayer
   - Dashboard Stripe → Webhooks : Événement marqué comme échoué

**✅ Succès attendu** :
Erreur 500 retournée et Stripe planifie des retries automatiques.

---

## 📊 Vérifications Finales

### Checklist de Validation

- [ ] **Test 1** : Webhook Stripe CLI traité avec succès
- [ ] **Test 2** : Checkout complet fonctionne de bout en bout
- [ ] **Test 3** : Idempotence (œuvre déjà vendue) OK
- [ ] **Test 4** : Signature invalide rejetée (400)
- [ ] **Test 5** : Artwork introuvable retourne 500
- [ ] **Compilation** : `npm run build` sans erreur
- [ ] **Linting** : `npm run lint` sans erreur
- [ ] **Logs** : Tous les événements sont loggés correctement

---

## 🔍 Monitoring des Webhooks

### Logs Next.js (Développement)

Les logs dans le terminal Next.js montrent :
- `✓` : Succès
- `ℹ` : Information (événement ignoré, déjà vendu)
- `✗` : Erreur

### Stripe Dashboard (Production)

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer sur votre endpoint webhook
3. Voir l'historique des événements :
   - ✅ Succeeded : Webhook traité avec succès (200)
   - ❌ Failed : Webhook échoué (500), sera réessayé
   - ⏭️ Retrying : Retry en cours

### Vercel Logs (Production)

1. Vercel Dashboard → Votre projet → Logs
2. Filtrer par `/api/webhook`
3. Voir les logs en temps réel

---

## 🐛 Troubleshooting

### Erreur : "No signature header"

**Cause** : Le header `stripe-signature` est manquant

**Solution** :
- En local : Vérifier que Stripe CLI est démarré
- En production : Vérifier que l'endpoint Stripe pointe vers la bonne URL

### Erreur : "Invalid signature"

**Cause** : Le secret webhook ne correspond pas

**Solution** :
1. Vérifier que `STRIPE_WEBHOOK_SECRET` dans `.env.local` est correct
2. Régénérer le secret :
   ```bash
   stripe listen --print-secret
   ```
3. Copier le nouveau secret dans `.env.local`
4. Redémarrer Next.js

### Erreur : "Webhook secret not configured"

**Cause** : Variable `STRIPE_WEBHOOK_SECRET` manquante

**Solution** :
1. Ajouter la variable dans `.env.local`
2. Redémarrer Next.js

### Erreur : "Artwork not found"

**Cause** : L'artworkId n'existe pas dans Sanity

**Solution** :
1. Vérifier que l'ID est correct
2. Vérifier que l'œuvre existe bien dans Sanity
3. Vérifier les permissions du token Sanity

### Webhook non reçu

**Cause** : Stripe CLI non démarré ou mauvaise URL

**Solution** :
1. Vérifier que `stripe listen` est en cours
2. Vérifier que l'URL est `http://localhost:3000/api/webhook`
3. Vérifier que Next.js tourne sur le port 3000

---

## 🚀 Configuration Production

### Étape 1 : Créer l'endpoint dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer "Add endpoint"
3. URL : `https://votre-domaine.vercel.app/api/webhook`
4. Événements : Sélectionner `checkout.session.completed`
5. Cliquer "Add endpoint"

### Étape 2 : Copier le signing secret

1. Cliquer sur le webhook créé
2. Section "Signing secret" → Cliquer "Reveal"
3. Copier le secret (commence par `whsec_`)

### Étape 3 : Configurer Vercel

1. Vercel Dashboard → Votre projet → Settings
2. Environment Variables
3. Ajouter :
   - **Key** : `STRIPE_WEBHOOK_SECRET`
   - **Value** : `whsec_...` (copié à l'étape 2)
   - **Environments** : Production (et Preview si souhaité)
4. Cliquer "Save"

### Étape 4 : Redéployer

1. Vercel redéploie automatiquement
2. Ou déclencher manuellement : `vercel --prod`

### Étape 5 : Tester en production

1. Faire un vrai achat test en production
2. Vérifier dans Stripe Dashboard → Webhooks
3. Vérifier que l'événement est marqué "Succeeded"
4. Vérifier dans Sanity que l'œuvre est `isAvailable: false`

---

## 📚 Ressources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
- [Stripe Event Types](https://stripe.com/docs/api/events/types)

---

**Statut** : ✅ Webhook implémenté et prêt pour les tests
