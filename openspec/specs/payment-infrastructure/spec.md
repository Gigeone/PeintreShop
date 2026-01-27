# Spécification : Infrastructure de Paiement

## Métadonnées

- **Capacité** : `payment-infrastructure`
- **Statut** : ✅ Implémentée (V1 - Sprint 1 - Étape 1)
- **Propriétaire** : Backend/Infrastructure
- **Dernière mise à jour** : 2026-01-27

---

## Vue d'Ensemble

Infrastructure de base pour le système de paiement Stripe permettant l'intégration du traitement des paiements en ligne pour la vente d'œuvres d'art.

**Composants :**
- Client Stripe côté serveur (API Routes)
- Client Stripe côté navigateur (lazy loading)
- Validation de connexion et configuration
- Gestion sécurisée des clés API

---

## Requirements

### Requirement: STRIPE-DEPS-MUST-be-installed

**SHALL** : Le système doit avoir les packages Stripe installés comme dépendances de production.

#### Scenario: Packages Stripe disponibles

**Étant donné** qu'un développeur clone le projet
**Quand** il exécute `npm install`
**Alors** les packages `stripe` (≥14.0.0) et `@stripe/stripe-js` (≥2.0.0) sont installés

---

### Requirement: STRIPE-ENV-MUST-be-configured

**SHALL** : Le système doit avoir les variables d'environnement Stripe configurées avec validation stricte.

#### Scenario: Variables d'environnement Stripe en mode test

**Étant donné** qu'un développeur configure son environnement local
**Quand** il définit les variables `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` et `STRIPE_SECRET_KEY`
**Alors** les clés sont validées au démarrage de l'application
**Et** la clé secrète est accessible uniquement côté serveur

---

### Requirement: STRIPE-LIB-MUST-provide-clients

**SHALL** : Le système doit fournir une bibliothèque utilitaire Stripe avec client serveur et client navigateur.

#### Scenario: Utilisation du client Stripe serveur

**Étant donné** qu'une API route a besoin d'appeler Stripe
**Quand** elle importe `import { stripe } from "@/lib/stripe"`
**Alors** elle obtient un client Stripe initialisé et prêt à l'emploi

#### Scenario: Utilisation du client Stripe navigateur

**Étant donné** qu'un composant React client a besoin de Stripe.js
**Quand** il appelle `const stripe = await getStripe()`
**Alors** Stripe.js est chargé de manière lazy (singleton)

---

### Requirement: STRIPE-TEST-API-MUST-validate-connection

**SHALL** : Le système doit exposer une route API de test pour valider la configuration Stripe.

#### Scenario: Test de connexion Stripe réussie

**Étant donné** que les clés Stripe sont correctement configurées
**Quand** un développeur accède à `GET /api/test-stripe`
**Alors** la route retourne `{"status": "success", "mode": "test"}`

---

### Requirement: STRIPE-SECURITY-MUST-prevent-key-exposure

**SHALL** : Le système doit garantir qu'aucune clé secrète Stripe n'est exposée au client.

#### Scenario: Protection des clés secrètes

**Étant donné** qu'un build de production est généré
**Quand** on inspecte le bundle JavaScript client
**Alors** aucune clé secrète (`sk_test_` ou `sk_live_`) n'est présente

---

## Implémentation

### Fichiers

- `lib/stripe.ts` - Client Stripe serveur et navigateur
- `app/api/test-stripe/route.ts` - Route de diagnostic

### Configuration

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Clé publique (client)
- `STRIPE_SECRET_KEY` - Clé secrète (serveur uniquement)

---

## Relations

**Utilisé par :**
- `checkout-flow` (étape 2) - Création de sessions de paiement
- `payment-webhook` (étape 3) - Traitement des webhooks Stripe

---

## Références

- [Stripe Node.js Library](https://github.com/stripe/stripe-node)
- [Stripe.js Reference](https://stripe.com/docs/js)
- Change archivé : `openspec/changes/archive/2026-01-27-configure-stripe-test-mode/`
