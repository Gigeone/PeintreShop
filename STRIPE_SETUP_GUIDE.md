# 🚀 Guide de Configuration Stripe - Prochaines Étapes

## ✅ Ce qui vient d'être fait

La **configuration Stripe en mode test** a été implémentée avec succès !

### Fichiers créés :
- ✅ `lib/stripe.ts` - Bibliothèque utilitaire Stripe (client serveur + navigateur)
- ✅ `app/api/test-stripe/route.ts` - Route de diagnostic de connexion

### Fichiers modifiés :
- ✅ `package.json` - Ajout de `stripe` et `@stripe/stripe-js`

## 🎯 Actions Requises (3 étapes simples)

### Étape 1️⃣ : Installer les dépendances

```bash
npm install
```

Cela installera les packages Stripe ajoutés au `package.json`.

### Étape 2️⃣ : Obtenir vos clés Stripe test

1. **Créez un compte Stripe** (si vous n'en avez pas) : https://dashboard.stripe.com/register
2. **Allez dans l'onglet Developers → API Keys** : https://dashboard.stripe.com/test/apikeys
3. **Copiez vos clés de TEST** :
   - 🔑 **Publishable key** (commence par `pk_test_...`)
   - 🔐 **Secret key** (commence par `sk_test_...` - cliquez sur "Reveal" pour la voir)

⚠️ **IMPORTANT** : Utilisez UNIQUEMENT les clés **test** (préfixe `_test_`), jamais les clés live !

### Étape 3️⃣ : Configurer vos clés dans .env.local

Ouvrez le fichier `.env.local` et remplacez les placeholders :

```env
# Avant (placeholders) :
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# Après (vos vraies clés) :
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...
```

**Note** : Les autres lignes Sanity et Cloudinary sont déjà configurées, ne les modifiez pas.

## ✅ Vérifier que tout fonctionne

### Test 1 : Démarrer le serveur

```bash
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:3000` sans erreur.

### Test 2 : Tester la connexion Stripe

Ouvrez dans votre navigateur :
```
http://localhost:3000/api/test-stripe
```

✅ **Vous devriez voir** :
```json
{
  "status": "success",
  "message": "Stripe configuration is valid",
  "mode": "test",
  "balanceAvailable": true,
  "currency": "usd"
}
```

❌ **Si vous voyez une erreur** :
- Vérifiez que vous avez bien copié les clés complètes (elles sont longues !)
- Assurez-vous d'utiliser les clés **test** (préfixe `pk_test_` et `sk_test_`)
- Consultez la section **Dépannage** ci-dessous

### Test 3 : Build de production

```bash
npm run build
```

Le build doit se terminer sans erreur TypeScript.

### Test 4 : Vérifier la sécurité

```bash
# Sur Linux/Mac/Git Bash :
grep -r "sk_test" .next/static || echo "✓ Aucune clé secrète exposée - Sécurité OK"

# Sur Windows PowerShell :
Get-ChildItem -Path .next/static -Recurse | Select-String "sk_test" | Measure-Object | Select-Object -ExpandProperty Count
# Si retourne 0 = OK
```

## 🐛 Dépannage

### ❌ Erreur : "Missing Stripe secret key"

**Cause** : La clé secrète n'est pas configurée dans `.env.local`

**Solution** :
1. Vérifiez que `.env.local` existe à la racine du projet
2. Vérifiez que la ligne `STRIPE_SECRET_KEY=sk_test_...` est présente
3. Assurez-vous qu'il n'y a pas d'espace avant ou après le `=`
4. Redémarrez le serveur : `npm run dev`

### ❌ Erreur : "Stripe authentication failed"

**Cause** : La clé secrète est invalide ou incorrecte

**Solution** :
1. Retournez sur https://dashboard.stripe.com/test/apikeys
2. Cliquez sur "Reveal test key" pour voir la clé complète
3. Copiez-la EN ENTIER (elle fait environ 100 caractères)
4. Remplacez dans `.env.local`
5. Redémarrez le serveur

### ❌ La route `/api/test-stripe` retourne 404

**Cause** : Le serveur n'a pas redémarré après les changements

**Solution** :
1. Arrêtez le serveur (Ctrl+C)
2. Relancez : `npm run dev`
3. Attendez le message "Ready" dans la console
4. Réessayez d'accéder à la route

### ❌ `npm install` échoue

**Cause** : Problème de dépendances ou cache npm

**Solution** :
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### ❌ "balanceAvailable": false

**Ce n'est PAS une erreur** ! C'est normal pour un compte Stripe test vide.
Cela confirme que la connexion Stripe fonctionne correctement ✅

## 🎉 Prochaines Étapes (après validation)

Une fois que `/api/test-stripe` retourne `"status": "success"`, vous êtes prêt pour :

### Sprint 1 - Étape 2 : API Checkout
Créer la route `/api/checkout` pour initier les sessions de paiement Stripe

### Sprint 1 - Étape 3 : Webhook Stripe
Créer la route `/api/webhook` pour mettre à jour le stock après paiement réussi

### Sprint 1 - Étape 4 : Intégration Frontend
Connecter le bouton "Acheter" des fiches œuvres au checkout Stripe

## 📚 Documentation Utile

- **Guide de test Stripe** : https://stripe.com/docs/testing
  - Numéros de carte de test : `4242 4242 4242 4242`
  - Date d'expiration : n'importe quelle date future
  - CVC : n'importe quel 3 chiffres

- **Dashboard Stripe Test** : https://dashboard.stripe.com/test/dashboard
  - Visualisez les paiements de test
  - Consultez les logs d'API
  - Testez les webhooks

- **API Stripe** : https://stripe.com/docs/api
  - Documentation complète de l'API Stripe

## 🔐 Rappels Sécurité

✅ **À FAIRE** :
- Utiliser les clés **test** en développement
- Garder `.env.local` dans `.gitignore` (déjà fait)
- Ne jamais partager vos clés secrètes

❌ **À NE JAMAIS FAIRE** :
- Committer `.env.local` dans Git
- Mettre des clés secrètes dans le code
- Utiliser des clés live en développement
- Partager vos clés sur Slack/Discord/GitHub

## 💬 Besoin d'Aide ?

Si vous rencontrez des problèmes :
1. Consultez la section **Dépannage** ci-dessus
2. Vérifiez la console serveur pour des messages d'erreur détaillés
3. Consultez les logs Stripe : https://dashboard.stripe.com/test/logs

---

**🎯 Objectif** : Obtenir `"status": "success"` sur `/api/test-stripe`
**⏱️ Temps estimé** : 5-10 minutes

Bonne configuration ! 🚀
