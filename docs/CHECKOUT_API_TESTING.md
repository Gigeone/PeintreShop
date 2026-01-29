# Guide de Test - API Checkout Stripe

## ✅ Implémentation Complétée

L'API `/api/checkout` a été implémentée avec succès. Voici comment la tester.

---

## 🚀 Démarrer le Serveur

```bash
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:3000`

---

## 🧪 Tests à Effectuer

### Prérequis

1. **Obtenir un ID d'œuvre valide depuis Sanity**

Ouvrez Sanity Studio : `http://localhost:3000/studio`

- Allez dans "Artworks"
- Cliquez sur une œuvre **disponible** (`isAvailable: true`)
- Copiez l'ID depuis l'URL (ex: `artwork-abc123...`)

2. **Obtenir un ID d'œuvre vendue** (pour test 410)

- Trouvez une œuvre avec `isAvailable: false`
- Ou changez temporairement une œuvre en "vendue"
- Copiez son ID

---

## Test 1 : Œuvre Disponible ✅ (Doit retourner 200)

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"artworkId": "VOTRE_ID_OEUVRE_DISPONIBLE"}'
```

**Résultat attendu :**
```json
{
  "sessionId": "cs_test_abc123...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_abc123..."
}
```

**Vérifications :**
- ✅ Status code : 200
- ✅ `sessionId` commence par `cs_test_`
- ✅ `url` commence par `https://checkout.stripe.com/`
- ✅ La session est visible dans le [Dashboard Stripe](https://dashboard.stripe.com/test/payments)

**Action recommandée :**
Copiez l'URL et ouvrez-la dans votre navigateur pour voir la page de paiement Stripe.

---

## Test 2 : Œuvre Indisponible ❌ (Doit retourner 410)

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"artworkId": "VOTRE_ID_OEUVRE_VENDUE"}'
```

**Résultat attendu :**
```json
{
  "error": "Gone",
  "message": "This artwork is no longer available"
}
```

**Vérifications :**
- ✅ Status code : 410 (Gone)
- ✅ Message clair pour l'utilisateur

---

## Test 3 : Œuvre Introuvable ❌ (Doit retourner 404)

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"artworkId": "id-inexistant-xyz"}'
```

**Résultat attendu :**
```json
{
  "error": "Not Found",
  "message": "Artwork not found"
}
```

**Vérifications :**
- ✅ Status code : 404
- ✅ Message d'erreur approprié

---

## Test 4 : Données Manquantes ❌ (Doit retourner 400)

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Résultat attendu :**
```json
{
  "error": "Bad Request",
  "message": "artworkId is required"
}
```

**Vérifications :**
- ✅ Status code : 400
- ✅ Validation des données d'entrée

---

## Test 5 : JSON Invalide ❌ (Doit retourner 400)

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d 'invalid-json'
```

**Résultat attendu :**
```json
{
  "error": "Bad Request",
  "message": "Invalid JSON in request body"
}
```

**Vérifications :**
- ✅ Status code : 400
- ✅ Gestion des erreurs de parsing

---

## 🔍 Vérifications dans le Dashboard Stripe

Après un test réussi (Test 1) :

1. **Allez sur** : https://dashboard.stripe.com/test/payments
2. **Trouvez votre session** (la plus récente)
3. **Vérifiez** :
   - ✅ Montant correct (prix de l'œuvre)
   - ✅ Currency : EUR
   - ✅ Metadata contient :
     - `artworkId` : L'ID de l'œuvre
     - `artworkSlug` : Le slug de l'œuvre
   - ✅ Status : `open` (session créée mais pas encore payée)

---

## 🧾 Test de Paiement Complet (Optionnel)

Si vous voulez tester le flux complet jusqu'au paiement :

1. **Créez une session** (Test 1)
2. **Ouvrez l'URL** retournée dans votre navigateur
3. **Utilisez une carte de test Stripe** :
   - Numéro : `4242 4242 4242 4242`
   - Date d'expiration : N'importe quelle date future (ex: 12/25)
   - CVC : N'importe quel 3 chiffres (ex: 123)
   - Code postal : N'importe lequel
4. **Cliquez sur "Pay"**
5. **Vous serez redirigé** vers : `http://localhost:3000/checkout/success?session_id=...`

**Note** : La page de succès n'existe pas encore (étape 4), vous verrez donc une 404. C'est normal !

Le webhook (étape 3) marquera automatiquement l'œuvre comme vendue (`isAvailable: false`).

---

## 🔧 Validation Technique

### Build de Production

```bash
npm run build
```

**Attendu** : Pas d'erreur TypeScript ou de build

### Linter

```bash
npm run lint
```

**Attendu** : Aucune erreur ESLint

---

## 📊 Checklist de Validation Complète

- [ ] Test 1 : Œuvre disponible → 200 + sessionId + url ✅
- [ ] Test 2 : Œuvre indisponible → 410 Gone ❌
- [ ] Test 3 : Œuvre introuvable → 404 Not Found ❌
- [ ] Test 4 : Données manquantes → 400 Bad Request ❌
- [ ] Test 5 : JSON invalide → 400 Bad Request ❌
- [ ] Dashboard Stripe affiche la session avec metadata ✅
- [ ] URL Stripe valide et fonctionnelle ✅
- [ ] `npm run build` passe sans erreur ✅
- [ ] `npm run lint` passe sans erreur ✅

---

## 🐛 Dépannage

### Erreur : "NEXT_PUBLIC_SITE_URL is not configured"

**Solution** : Vérifiez que `.env.local` contient :
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Redémarrez le serveur après modification.

### Erreur : "Failed to create checkout session"

**Causes possibles** :
1. Clés Stripe invalides ou expirées
2. Connexion internet interrompue
3. Stripe dashboard en maintenance (rare)

**Solution** : Vérifiez vos clés Stripe dans `.env.local`

### Session créée mais aucune metadata

**Solution** : Vérifiez que la requête GROQ récupère bien :
- `artwork._id`
- `artwork.slug.current`

### Prix incorrect dans Stripe

**Vérifiez** :
- Le prix dans Sanity est bien un nombre (pas une chaîne)
- La conversion en centimes fonctionne : `price * 100`

---

## ✅ Succès !

Si tous les tests passent, l'API Checkout est **prête pour la production** !

**Prochaines étapes** :
1. **Étape 3** : Créer le webhook pour marquer les œuvres comme vendues
2. **Étape 4** : Connecter le bouton "Acheter" à cette API
3. **Sprint 2** : Ajouter les emails de confirmation

---

**Bon test ! 🚀**
