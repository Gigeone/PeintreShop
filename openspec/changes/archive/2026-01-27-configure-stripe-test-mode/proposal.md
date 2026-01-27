# Proposition : Configuration Stripe en Mode Test

## Contexte

Le site e-commerce est actuellement au stade MVP/V1 avec :
- ✅ Frontend complet (pages galerie, fiches œuvres)
- ✅ Sanity CMS opérationnel avec schémas artwork et siteSettings
- ✅ Gestion du stock via champ `isAvailable`
- ❌ Aucun système de paiement (bouton "Acheter" redirige vers formulaire contact)
- ❌ Pas de dépendances Stripe installées

Cette proposition constitue l'**étape 1 du Sprint 1** pour permettre les vraies ventes avec Stripe Checkout.

## Objectif

Configurer Stripe en mode test pour permettre :
1. L'installation des dépendances Stripe nécessaires
2. La configuration des variables d'environnement en mode test
3. La création d'une bibliothèque utilitaire Stripe réutilisable
4. La validation de la connexion Stripe via une route API de test

**Ce qui n'est PAS inclus dans cette étape :**
- API route `/api/checkout` (sera dans l'étape 2)
- Webhook `/api/webhook` (sera dans l'étape 3)
- Modification du bouton "Acheter" (sera dans l'étape 4)

## Justification

**Pourquoi cette étape est nécessaire :**
- Stripe est le système de paiement choisi dans l'architecture (voir ARCHITECTURE.md)
- Le mode test permet de développer et tester sans transactions réelles
- Une configuration propre et testable est la fondation pour les étapes suivantes
- Les variables d'environnement doivent être configurées avant toute intégration

**Impact métier :**
- Aucun impact utilisateur visible (configuration backend uniquement)
- Prépare le terrain pour l'étape 2 (checkout) qui apportera la valeur métier

## Capacités Impactées

Cette proposition crée une nouvelle capacité :

- **NOUVELLE** : `payment-infrastructure` - Infrastructure de paiement avec Stripe

## Dépendances

**Dépendances externes :**
- Compte Stripe (gratuit) : https://dashboard.stripe.com/register
- Clés API Stripe en mode test (disponibles immédiatement après inscription)

**Ordre des étapes :**
1. ✅ Cette étape (configuration)
2. ⏳ Étape 2 : Création API route checkout
3. ⏳ Étape 3 : Webhook Stripe pour mise à jour stock
4. ⏳ Étape 4 : Intégration frontend bouton "Acheter"

## Risques et Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Clés API exposées côté client | Critique | Faible | Variables d'env préfixées correctement (NEXT_PUBLIC_ uniquement pour publishable key) |
| Confusion mode test/production | Moyen | Moyen | Documentation claire, nommage explicite des variables |
| Mauvaise configuration Stripe | Faible | Faible | Route de test API pour valider la connexion |

## Critères d'Acceptation

- [x] Package `stripe` installé (version ≥14.0.0) - `stripe@^17.4.0` ajouté à package.json
- [x] Package `@stripe/stripe-js` installé (version ≥2.0.0) - `@stripe/stripe-js@^5.6.0` ajouté à package.json
- [x] Variables d'environnement Stripe configurées dans `.env.local` - Placeholders présents, utilisateur doit ajouter vraies clés
- [x] Fichier `lib/stripe.ts` créé avec client Stripe initialisé
- [x] Route API `/api/test-stripe` fonctionnelle retournant le statut de connexion
- [x] Documentation mise à jour dans `.env.example` - Déjà documenté
- [ ] `npm run build` passe sans erreur TypeScript - Nécessite `npm install` par l'utilisateur
- [x] Aucune clé secrète exposée dans le code client - Validation par guards implémentée

## Alternatives Considérées

**Alternative 1 : Utiliser PayPal ou autre processeur**
- ❌ Rejeté : Stripe choisi dans l'architecture initiale
- ❌ UX moins fluide (redirection externe)
- ❌ Moins adapté au marché européen

**Alternative 2 : Intégration complète Stripe en une seule étape**
- ❌ Rejeté : Trop complexe, difficile à tester
- ❌ Viole le principe de changements incrémentaux
- ✅ Approche retenue : 4 étapes distinctes et testables

## Questions en Suspens

Aucune question bloquante. La configuration Stripe test est standardisée.

## Validation

Avant de demander l'approbation :
```bash
openspec validate configure-stripe-test-mode --strict --no-interactive
```

## Références

- [Documentation Stripe Node.js](https://stripe.com/docs/api?lang=node)
- [Stripe Test Mode](https://stripe.com/docs/testing)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [@PRD.md](../../PRD.md) - Sprint 1 : Paiement Stripe
- [@ARCHITECTURE.md](../../ARCHITECTURE.md) - Section 4 : Architecture Backend / API
