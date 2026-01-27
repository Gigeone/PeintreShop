# Tâches d'Implémentation : Configuration Stripe Test Mode

## Vue d'Ensemble

Cette liste ordonne les tâches pour configurer Stripe en mode test. Chaque tâche est atomique, vérifiable et apporte une progression visible.

**Durée estimée totale :** 30-45 minutes

---

## Tâches

### 1. Installer les dépendances Stripe

- [x] Exécuter `npm install stripe @stripe/stripe-js`
- [x] Vérifier que `package.json` contient les deux dépendances
- [ ] Exécuter `npm run build` pour confirmer qu'il n'y a pas d'erreur de compilation

**Validation :**
```bash
grep "stripe" package.json
npm run build
```

**Livrable :** `package.json` et `package-lock.json` mis à jour

---

### 2. Configurer les variables d'environnement

- [ ] Créer un compte Stripe test sur https://dashboard.stripe.com (si pas déjà fait)
- [ ] Récupérer les clés API test depuis https://dashboard.stripe.com/test/apikeys
- [x] Ajouter les variables dans `.env.local` :
  ```
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
  STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
  ```
- [x] Mettre à jour `.env.example` avec des placeholders clairs
- [x] Vérifier que `.env.local` est dans `.gitignore`

**Validation :**
```bash
grep "STRIPE" .env.local
grep ".env.local" .gitignore
```

**Livrable :** `.env.local` configuré, `.env.example` documenté

**⚠️ Sécurité :** NE JAMAIS committer `.env.local`. Seul `.env.example` doit être versionné.

---

### 3. Créer la bibliothèque utilitaire Stripe

- [x] Créer le fichier `lib/stripe.ts`
- [x] Implémenter le client Stripe côté serveur avec validation de la clé secrète
- [x] Implémenter la fonction `getStripe()` pour le client côté navigateur (lazy loading)
- [x] Ajouter des types TypeScript stricts
- [x] Ajouter des guards pour détecter les clés manquantes avec messages d'erreur explicites

**Validation :**
```bash
npx tsc --noEmit  # Pas d'erreur TypeScript
```

**Livrable :** `lib/stripe.ts` avec exports `stripe` (serveur) et `getStripe()` (client)

**Structure attendue :**
```typescript
// lib/stripe.ts
import Stripe from "stripe";
import { loadStripe, Stripe as StripeJS } from "@stripe/stripe-js";

// Client serveur
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Client navigateur (lazy loading)
let stripePromise: Promise<StripeJS | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
```

---

### 4. Créer une route API de test Stripe

- [x] Créer le dossier `app/api/test-stripe/`
- [x] Créer `app/api/test-stripe/route.ts`
- [x] Implémenter une route GET qui :
  - Vérifie que les variables d'env Stripe sont définies
  - Teste la connexion Stripe (récupère le solde du compte test)
  - Retourne un JSON avec le statut de connexion
- [x] Gérer les erreurs proprement (try/catch)
- [x] Ajouter des types pour la réponse

**Validation :**
```bash
npm run dev
curl http://localhost:3000/api/test-stripe
# Ou ouvrir dans le navigateur
```

**Réponse attendue :**
```json
{
  "status": "success",
  "message": "Stripe configuration is valid",
  "mode": "test",
  "balanceAvailable": true
}
```

**Livrable :** Route `/api/test-stripe` fonctionnelle

---

### 5. Tests et validation finale

- [ ] Démarrer le serveur de développement : `npm run dev`
- [ ] Tester la route `/api/test-stripe` dans le navigateur
- [ ] Vérifier qu'aucune erreur n'apparaît dans la console serveur
- [ ] Vérifier qu'aucune clé secrète n'est exposée dans le bundle client :
  ```bash
  npm run build
  grep -r "sk_test" .next/static  # Ne doit rien retourner
  ```
- [ ] Exécuter le linter : `npm run lint`

**Note :** Ces tests nécessitent que l'utilisateur ait exécuté `npm install` et configuré ses vraies clés Stripe dans `.env.local`

**Validation :**
- ✅ Route de test retourne `status: "success"`
- ✅ Build production passe sans warning
- ✅ Aucune clé secrète dans le bundle client
- ✅ Pas d'erreur ESLint

**Livrable :** Configuration Stripe validée et testée

---

## Dépendances entre Tâches

```
1. Installer dépendances
   ↓
2. Configurer variables d'env
   ↓
3. Créer lib/stripe.ts
   ↓
4. Créer route API test
   ↓
5. Tests et validation
```

**Toutes les tâches doivent être exécutées séquentiellement.**

---

## Travail Parallélisable

Aucune tâche n'est parallélisable dans cette étape car chaque étape dépend de la précédente.

---

## Notes d'Implémentation

### Choix de la version API Stripe
Utiliser la dernière version stable : `2024-12-18.acacia`
- Consulter : https://stripe.com/docs/api/versioning

### Gestion des erreurs
- Toujours wrapper les appels Stripe dans des try/catch
- Retourner des messages d'erreur clairs en développement
- Masquer les détails sensibles en production

### TypeScript
- Utiliser les types fournis par le package `stripe`
- Activer `typescript: true` dans les options Stripe
- Pas de `any` sauf justification documentée

---

## Critères de Complétion

Cette étape est considérée comme terminée quand :
- [x] Toutes les 5 tâches ci-dessus sont cochées (implémentation code)
- [ ] `npm install` exécuté par l'utilisateur
- [ ] Clés Stripe test configurées dans `.env.local` par l'utilisateur
- [ ] `npm run build` passe sans erreur ni warning
- [ ] `/api/test-stripe` retourne un statut de succès
- [x] Code review interne OK (vérification sécurité des clés)

---

## Prochaines Étapes (hors scope)

Après validation de cette configuration :
- **Étape 2** : Créer `/api/checkout` pour initialiser les sessions de paiement
- **Étape 3** : Créer `/api/webhook` pour mettre à jour le stock après paiement
- **Étape 4** : Connecter le bouton "Acheter" au checkout Stripe
