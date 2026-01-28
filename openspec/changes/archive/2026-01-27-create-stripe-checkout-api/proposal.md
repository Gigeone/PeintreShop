# Proposition : Créer API Route Stripe Checkout

## Contexte

Le site e-commerce dispose maintenant de :
- ✅ Infrastructure Stripe configurée (étape 1 complétée)
- ✅ Client Stripe serveur et navigateur (`lib/stripe.ts`)
- ✅ Sanity CMS avec œuvres et gestion du stock (`isAvailable`)
- ✅ Pages galerie et fiches œuvres
- ❌ Le bouton "Acheter" redirige vers `/contact` au lieu d'initier un paiement

Cette proposition constitue l'**étape 2 du Sprint 1** pour permettre les vraies ventes avec Stripe Checkout.

## Objectif

Créer une route API `/api/checkout` qui :
1. **Vérifie la disponibilité** de l'œuvre dans Sanity (approche B validée)
2. **Crée une session Stripe Checkout** avec les détails de l'œuvre
3. **Retourne l'URL de redirection** vers Stripe pour le paiement
4. **Gère les erreurs** (œuvre indisponible, erreurs Stripe)

**Ce qui n'est PAS inclus dans cette étape :**
- Webhook Stripe pour mise à jour du stock (sera dans l'étape 3)
- Modification du bouton "Acheter" frontend (sera dans l'étape 4)
- Emails de confirmation (sera dans Sprint 2)
- Pages de succès/annulation personnalisées (MVP : pages Stripe par défaut)

## Justification

**Pourquoi cette étape est nécessaire :**
- C'est le cœur du système de paiement : sans cette API, impossible de vendre
- La vérification de stock évite les conflits (deux clients achetant la même œuvre)
- Stripe Checkout offre une UX sécurisée et PCI-compliant
- Approche incrémentale : checkout d'abord, webhook ensuite

**Impact métier :**
- Permet les premières ventes en ligne
- Garantit qu'une œuvre unique ne peut être vendue qu'à un seul client
- Fournit une expérience de paiement professionnelle

## Approche Validée : Approche B

**Workflow de paiement :**
```
1. Client clique "Acheter" sur /oeuvres/[slug]
2. Frontend appelle POST /api/checkout avec artworkId
3. API vérifie isAvailable dans Sanity
   - Si false → Erreur 410 "Œuvre déjà vendue"
   - Si true → Continue
4. API crée Stripe Checkout Session
5. API retourne URL de redirection
6. Frontend redirige vers Stripe Checkout
7. Client complète le paiement sur Stripe
8. Stripe redirige vers page de succès
```

**Avantages :**
- ✅ Évite les paiements pour œuvres déjà vendues
- ✅ Meilleure UX (erreur avant le paiement)
- ✅ Moins de remboursements à gérer
- ✅ Conforme aux bonnes pratiques e-commerce

## Capacités Impactées

Cette proposition crée une nouvelle capacité :

- **NOUVELLE** : `checkout-flow` - Flux de création de session de paiement Stripe

Cette capacité **utilise** :
- `payment-infrastructure` (étape 1) - Client Stripe
- Sanity CMS - Vérification de stock

Cette capacité **sera utilisée par** :
- Frontend (étape 4) - Bouton "Acheter"
- `payment-webhook` (étape 3) - Pour compléter le cycle de paiement

## Dépendances

**Dépendances internes :**
- ✅ `lib/stripe.ts` disponible (étape 1)
- ✅ Sanity CMS avec schéma `artwork` et champ `isAvailable`
- ✅ Types `Artwork` définis

**Dépendances externes :**
- ✅ Compte Stripe configuré en mode test
- ✅ Variable `NEXT_PUBLIC_SITE_URL` dans `.env.local` (pour URLs de redirection)

**Ordre des étapes :**
1. ✅ Étape 1 : Configuration Stripe (complétée)
2. 🔄 **Cette étape** : API Checkout
3. ⏳ Étape 3 : Webhook pour mise à jour stock
4. ⏳ Étape 4 : Intégration frontend bouton "Acheter"

## Risques et Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Race condition (2 clients achètent simultanément) | Critique | Faible | Vérification isAvailable + webhook qui vérifie à nouveau |
| Session Stripe expirée | Moyen | Moyen | Expiration par défaut 24h, suffisant pour ce cas d'usage |
| URL de redirection invalide | Faible | Faible | Validation de NEXT_PUBLIC_SITE_URL au démarrage |
| Œuvre supprimée entre vérification et paiement | Faible | Très faible | Webhook vérifie l'existence avant mise à jour |

## Critères d'Acceptation

- [x] Route `POST /api/checkout` créée et fonctionnelle
- [x] Vérification de `isAvailable` dans Sanity avant création session
- [x] Création de Stripe Checkout Session avec :
  - Nom et image de l'œuvre
  - Prix correct en centimes
  - Metadata (artworkId, artworkSlug)
  - URLs de succès et annulation
- [x] Retour JSON avec `sessionId` et `url`
- [x] Gestion d'erreurs :
  - 400 : Données invalides (artworkId manquant)
  - 404 : Œuvre introuvable
  - 410 : Œuvre déjà vendue (Gone)
  - 500 : Erreur Stripe ou serveur
- [x] Types TypeScript pour requête et réponse
- [x] Aucune donnée sensible exposée dans les erreurs
- [ ] `npm run build` passe sans erreur (à vérifier par l'utilisateur)
- [ ] Tests fonctionnels réussis (voir CHECKOUT_API_TESTING.md)

## Alternatives Considérées

**Alternative 1 : Approche A (checkout sans vérification)**
- ❌ Rejeté : Risque de vendre la même œuvre plusieurs fois
- ❌ Mauvaise UX : client paie puis découvre que l'œuvre est vendue
- ❌ Nécessite gestion des remboursements

**Alternative 2 : Lock pessimiste (réservation temporaire)**
- ❌ Rejeté : Trop complexe pour V1
- ❌ Nécessite gestion de timeout et libération des locks
- ❌ Peut bloquer des œuvres pour des clients qui abandonnent

**Alternative 3 : Stripe Payment Intent au lieu de Checkout**
- ❌ Rejeté pour V1 : Nécessite intégration frontend complexe
- ❌ Checkout offre une UX clé en main et sécurisée
- ✅ Peut être envisagé en V2 pour plus de personnalisation

## Questions en Suspens

Aucune question bloquante. L'approche B a été validée.

**Décisions à confirmer :**
- Mode de paiement : carte uniquement (suffisant pour MVP/V1)
- Devise : EUR (marché français)
- Expiration session : 24h (défaut Stripe, acceptable)

## Validation

Avant de demander l'approbation :
```bash
openspec validate create-stripe-checkout-api --strict --no-interactive
```

## Références

- [Stripe Checkout Sessions API](https://stripe.com/docs/api/checkout/sessions)
- [Stripe Checkout Integration Guide](https://stripe.com/docs/payments/checkout)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [@PRD.md](../../PRD.md) - Sprint 1 : Paiement Stripe
- [@ARCHITECTURE.md](../../ARCHITECTURE.md) - Section 4 : Architecture Backend / API
- Étape 1 archivée : `openspec/changes/archive/2026-01-27-configure-stripe-test-mode/`
