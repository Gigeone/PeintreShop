# Spécification : Infrastructure de Paiement (Delta)

## Métadonnées

- **Capacité** : `payment-infrastructure`
- **Type de changement** : ADDED (nouvelle capacité)
- **Phase** : V1 - Sprint 1 - Étape 1
- **Propriétaire** : Backend/Infrastructure
- **Date de création** : 2026-01-27

---

## Vue d'Ensemble

Cette spécification définit l'infrastructure de base pour le système de paiement Stripe en mode test. Elle couvre la configuration, l'initialisation et la validation de la connexion Stripe, sans implémenter la logique de paiement elle-même.

**Périmètre :**
- Configuration des dépendances Stripe
- Variables d'environnement pour mode test
- Bibliothèque utilitaire Stripe (serveur + client)
- Route de test pour validation de connexion

**Hors périmètre :**
- Création de sessions de paiement (étape 2)
- Webhooks Stripe (étape 3)
- Intégration frontend (étape 4)

---

## ADDED Requirements

### Requirement: STRIPE-DEPS-MUST-be-installed

**SHALL** : Le système doit installer les packages NPM `stripe` (≥14.0.0) et `@stripe/stripe-js` (≥2.0.0) comme dépendances de production.

#### Scenario: Installation des dépendances Stripe

**Étant donné** qu'un développeur initialise le projet
**Quand** il exécute `npm install`
**Alors** les packages `stripe` et `@stripe/stripe-js` sont installés
**Et** ils apparaissent dans la section `dependencies` de `package.json`
**Et** les versions respectent les contraintes minimales

**Critères de validation :**
```bash
npm list stripe @stripe/stripe-js
# Doit afficher les deux packages avec versions correctes
```

---

### Requirement: STRIPE-ENV-MUST-be-configured

**SHALL** : Le système doit configurer les variables d'environnement Stripe en mode test avec validation stricte des clés.

#### Scenario: Configuration des variables d'environnement Stripe test

**Étant donné** qu'un développeur a créé un compte Stripe test
**Quand** il configure les variables dans `.env.local` :
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- `STRIPE_SECRET_KEY=sk_test_...`

**Alors** les variables sont chargées au démarrage de Next.js
**Et** la clé publique est accessible côté client via `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
**Et** la clé secrète est accessible uniquement côté serveur via `process.env.STRIPE_SECRET_KEY`
**Et** la clé secrète n'apparaît jamais dans le bundle JavaScript client

**Critères de validation :**
```bash
# La clé publique doit commencer par pk_test_
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | grep "^pk_test_"

# La clé secrète ne doit PAS être dans le bundle client
npm run build
! grep -r "sk_test" .next/static
```

#### Scenario: Documentation des variables d'environnement

**Étant donné** qu'un nouveau développeur rejoint le projet
**Quand** il consulte `.env.example`
**Alors** il voit des placeholders clairs pour les clés Stripe :
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```
**Et** des commentaires expliquent où obtenir ces clés
**Et** il est averti d'utiliser uniquement les clés test pour le développement

---

### Requirement: STRIPE-LIB-MUST-provide-clients

**SHALL** : Le système doit fournir une bibliothèque utilitaire `lib/stripe.ts` exposant un client Stripe serveur et une fonction de chargement client navigateur.

#### Scenario: Initialisation du client Stripe côté serveur

**Étant donné** qu'une API route Next.js a besoin d'interagir avec Stripe
**Quand** elle importe `import { stripe } from "@/lib/stripe"`
**Alors** l'objet `stripe` est une instance de `Stripe` initialisée avec :
- La clé secrète depuis `process.env.STRIPE_SECRET_KEY`
- La version API `2024-12-18.acacia` (ou plus récente)
- Le mode TypeScript activé (`typescript: true`)

**Et** si `STRIPE_SECRET_KEY` est manquante, une erreur explicite est levée au démarrage

**Critères de validation :**
```typescript
import { stripe } from "@/lib/stripe";
expect(stripe).toBeInstanceOf(Stripe);
expect(stripe.getApiField("apiVersion")).toBe("2024-12-18.acacia");
```

#### Scenario: Chargement du client Stripe côté navigateur

**Étant donné** qu'un composant React côté client a besoin de Stripe.js
**Quand** il appelle `const stripeClient = await getStripe()`
**Alors** la fonction retourne une Promise de l'objet Stripe.js
**Et** le chargement est lazy (ne se déclenche qu'au premier appel)
**Et** les appels suivants retournent la même Promise (singleton)
**Et** la clé publique utilisée provient de `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Critères de validation :**
```typescript
import { getStripe } from "@/lib/stripe";
const stripe1 = await getStripe();
const stripe2 = await getStripe();
expect(stripe1).toBe(stripe2); // Même instance
```

#### Scenario: Gestion des erreurs de configuration manquante

**Étant donné** que les variables d'environnement Stripe ne sont pas configurées
**Quand** le serveur démarre ou qu'une route utilise le client Stripe
**Alors** une erreur explicite est levée :
```
Error: Missing Stripe secret key. Please set STRIPE_SECRET_KEY in .env.local
```
**Et** l'application refuse de démarrer en mode production sans ces clés

---

### Requirement: STRIPE-TEST-API-MUST-validate-connection

**SHALL** : Le système doit fournir une route API `/api/test-stripe` pour valider la configuration Stripe en mode test.

#### Scenario: Test de connexion Stripe réussie

**Étant donné** que les variables d'environnement Stripe sont correctement configurées
**Quand** un développeur envoie une requête `GET /api/test-stripe`
**Alors** la route retourne un statut HTTP 200
**Et** le corps de la réponse JSON contient :
```json
{
  "status": "success",
  "message": "Stripe configuration is valid",
  "mode": "test",
  "balanceAvailable": true
}
```
**Et** la route effectue une vraie requête API Stripe (ex: récupération du solde)
**Et** aucune clé secrète n'est incluse dans la réponse

#### Scenario: Détection d'erreur de configuration Stripe

**Étant donné** que `STRIPE_SECRET_KEY` n'est pas définie ou invalide
**Quand** un développeur envoie une requête `GET /api/test-stripe`
**Alors** la route retourne un statut HTTP 500
**Et** le corps de la réponse JSON contient :
```json
{
  "status": "error",
  "message": "Stripe configuration error: [détails de l'erreur]"
}
```
**Et** les détails de l'erreur sont suffisants pour diagnostiquer le problème
**Et** aucune information sensible (clés, secrets) n'est exposée dans l'erreur

#### Scenario: Vérification du mode test

**Étant donné** que les clés Stripe sont en mode test (préfixe `pk_test_` et `sk_test_`)
**Quand** la route `/api/test-stripe` est appelée
**Alors** la réponse indique `"mode": "test"`
**Et** un avertissement est loggé si des clés de production sont détectées par erreur en développement

---

### Requirement: STRIPE-SECURITY-MUST-prevent-key-exposure

**SHALL** : Le système doit garantir qu'aucune clé secrète Stripe n'est exposée au client ou dans le code source versionné.

#### Scenario: Protection de la clé secrète dans le build

**Étant donné** qu'un build de production est généré
**Quand** un développeur inspecte les fichiers générés dans `.next/static/`
**Alors** aucune occurrence de `sk_test_` ou `sk_live_` n'est trouvée
**Et** seule la clé publique (`pk_test_` ou `pk_live_`) peut apparaître
**Et** aucune variable d'environnement non-préfixée par `NEXT_PUBLIC_` n'est accessible côté client

**Critères de validation :**
```bash
npm run build
! grep -r "sk_test\|sk_live" .next/static
! grep -r "STRIPE_SECRET_KEY" .next/static
```

#### Scenario: Vérification de .gitignore

**Étant donné** qu'un développeur initialise le projet
**Quand** il consulte le fichier `.gitignore`
**Alors** il contient l'entrée `.env.local`
**Et** un commit de `.env.local` est impossible (ignoré par Git)
**Et** seul `.env.example` avec des placeholders est versionné

**Critères de validation :**
```bash
grep "\.env\.local" .gitignore
! git status --porcelain | grep "\.env\.local"
```

---

## Relations avec d'Autres Capacités

**Dépendances :**
- Aucune (c'est une nouvelle capacité fondamentale)

**Impact futur sur :**
- `checkout-flow` (étape 2) : utilisera `lib/stripe.ts` pour créer des sessions
- `payment-webhook` (étape 3) : utilisera le client Stripe serveur pour valider les webhooks
- `stock-management` : sera déclenché par les webhooks après paiement

---

## Notes d'Implémentation

### Version API Stripe

Utiliser la version stable : `2024-12-18.acacia`
Consulter : https://stripe.com/docs/api/versioning

Cette version supporte :
- Checkout Sessions v2
- Payment Intents
- Webhook signature v1

### Stratégie de Lazy Loading

Le client Stripe navigateur doit être chargé uniquement quand nécessaire :
```typescript
let stripePromise: Promise<StripeJS | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
```

Cela évite de charger Stripe.js (23KB gzippé) sur toutes les pages.

### Gestion des Erreurs

Toujours wrapper les appels Stripe dans des try/catch :
```typescript
try {
  const balance = await stripe.balance.retrieve();
  return balance;
} catch (error) {
  if (error instanceof Stripe.errors.StripeAuthenticationError) {
    throw new Error("Invalid Stripe API key");
  }
  throw error;
}
```

### TypeScript

Activer le mode TypeScript dans la configuration Stripe pour obtenir l'autocomplétion et la validation des types :
```typescript
const stripe = new Stripe(apiKey, {
  apiVersion: "2024-12-18.acacia",
  typescript: true, // ✅ Active les types stricts
});
```

---

## Références

- [Stripe Node.js Library](https://github.com/stripe/stripe-node)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Stripe Test Mode](https://stripe.com/docs/testing)
- [Stripe API Versioning](https://stripe.com/docs/api/versioning)
