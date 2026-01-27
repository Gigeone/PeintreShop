# Configuration Stripe Test Mode - Instructions Utilisateur

## ✅ Ce qui a été fait

Les fichiers suivants ont été créés/modifiés :

1. **`package.json`** - Ajout des dépendances Stripe
   - `stripe@^17.4.0` (SDK serveur)
   - `@stripe/stripe-js@^5.6.0` (SDK client)

2. **`lib/stripe.ts`** - Bibliothèque utilitaire Stripe
   - Client serveur initialisé avec validation
   - Fonction `getStripe()` pour lazy loading côté client
   - Gestion d'erreurs pour clés manquantes

3. **`app/api/test-stripe/route.ts`** - Route de test API
   - Vérifie la configuration Stripe
   - Teste la connexion au compte Stripe
   - Retourne le statut et le mode (test/live)

4. **`.env.example`** - Déjà configuré avec les variables Stripe

5. **`.env.local`** - Contient des placeholders pour les clés

## 🚀 Actions Requises

### Étape 1 : Installer les dépendances

```bash
npm install
```

Cela installera les packages `stripe` et `@stripe/stripe-js`.

### Étape 2 : Obtenir vos clés Stripe test

1. Créez un compte Stripe (gratuit) : https://dashboard.stripe.com/register
2. Allez dans **Developers → API Keys** : https://dashboard.stripe.com/test/apikeys
3. Copiez vos clés de test :
   - **Publishable key** (commence par `pk_test_...`)
   - **Secret key** (commence par `sk_test_...`)

⚠️ **Important** : Utilisez UNIQUEMENT les clés **test** (préfixe `_test_`) pour le développement.

### Étape 3 : Configurer .env.local

Ouvrez `.env.local` et remplacez les placeholders par vos vraies clés :

```env
# Remplacez xxxxx par vos vraies clés Stripe test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
```

### Étape 4 : Tester la configuration

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez dans votre navigateur :
   ```
   http://localhost:3000/api/test-stripe
   ```

3. Vous devriez voir une réponse JSON comme :
   ```json
   {
     "status": "success",
     "message": "Stripe configuration is valid",
     "mode": "test",
     "balanceAvailable": true,
     "currency": "usd"
   }
   ```

### Étape 5 : Validation finale

```bash
# Vérifier qu'il n'y a pas d'erreur TypeScript
npx tsc --noEmit

# Builder le projet
npm run build

# Vérifier qu'aucune clé secrète n'est exposée (ne doit rien retourner)
grep -r "sk_test" .next/static || echo "✓ Aucune clé secrète exposée"

# Linter le code
npm run lint
```

## ✅ Critères de Succès

- [ ] `npm install` s'exécute sans erreur
- [ ] `/api/test-stripe` retourne `status: "success"`
- [ ] Le mode indiqué est `"test"`
- [ ] `npm run build` passe sans erreur
- [ ] Aucune clé secrète dans `.next/static/`

## 🔒 Sécurité

**IMPORTANT** :
- ✅ `.env.local` est dans `.gitignore` (ne sera pas commité)
- ✅ Seules les clés publiques (`pk_test_...`) peuvent être exposées côté client
- ✅ Les clés secrètes (`sk_test_...`) restent côté serveur uniquement
- ❌ NE JAMAIS committer de vraies clés API dans le code source

## 🐛 Dépannage

### Erreur : "Missing Stripe secret key"

**Solution** : Vérifiez que `.env.local` contient bien `STRIPE_SECRET_KEY` avec une vraie clé.

### Erreur : "Stripe authentication failed"

**Solution** : Vérifiez que votre clé secrète est correcte. Allez sur https://dashboard.stripe.com/test/apikeys et copiez-la à nouveau.

### La route `/api/test-stripe` ne fonctionne pas

**Solution** :
1. Assurez-vous que `npm install` a bien été exécuté
2. Redémarrez le serveur : `npm run dev`
3. Vérifiez les erreurs dans la console serveur

### "balanceAvailable": false

**Solution** : Normal pour un compte Stripe test vide. Cela confirme que la connexion fonctionne.

## 📚 Documentation Stripe

- [Stripe Test Mode](https://stripe.com/docs/testing)
- [Stripe Node.js Library](https://github.com/stripe/stripe-node)
- [Stripe.js Reference](https://stripe.com/docs/js)

## ⏭️ Prochaines Étapes

Une fois cette configuration validée, les prochaines étapes du Sprint 1 sont :

1. **Étape 2** : Créer `/api/checkout` pour initialiser les sessions de paiement
2. **Étape 3** : Créer `/api/webhook` pour mettre à jour le stock après paiement
3. **Étape 4** : Connecter le bouton "Acheter" au checkout Stripe

Ces étapes seront implémentées dans des propositions OpenSpec distinctes.
