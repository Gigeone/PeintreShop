# Change: Ajouter les emails transactionnels pour les ventes

## Why

Actuellement, lorsqu'un client achète une œuvre, le paiement est traité et le stock est mis à jour automatiquement via le webhook Stripe, mais **aucune notification email n'est envoyée**.

Cela pose plusieurs problèmes :
- Le client n'a **aucune confirmation** de son achat
- L'artiste n'est **pas notifiée** d'une vente et doit vérifier manuellement
- Impossible de communiquer les **coordonnées de livraison** au client
- **Mauvaise expérience utilisateur** (pas de suivi post-achat)

Cette fonctionnalité est **critique pour la V1** car elle permet de transformer le site d'un prototype en un produit réellement vendable et professionnel.

## What Changes

- Ajouter une nouvelle capacité `email-notifications` pour gérer l'envoi d'emails transactionnels
- Intégrer **Resend** (ou SendGrid en alternative) comme service d'emailing
- Créer un template d'email de **confirmation client** avec :
  - Récapitulatif de l'achat (œuvre, prix)
  - Numéro de commande (session Stripe)
  - Message de remerciement
  - Informations de contact de l'artiste
- Créer un template d'email de **notification artiste** avec :
  - Alerte de nouvelle vente
  - Détails de l'œuvre vendue
  - Informations client (nom, email extraits de Stripe)
  - Lien vers le dashboard Stripe
- Modifier le webhook Stripe (`payment-webhook`) pour déclencher l'envoi des emails après validation du paiement
- Ajouter la gestion d'erreur pour ne pas bloquer le processus de paiement si l'envoi d'email échoue

**Configuration requise :**
- Variable d'environnement `RESEND_API_KEY` (ou `SENDGRID_API_KEY`)
- Email expéditeur vérifié sur Resend/SendGrid
- Configuration des templates d'email

## Impact

**Specs affectées :**
- **NOUVELLE** : `email-notifications` (création complète de la capacité)
- **MODIFIÉE** : `payment-webhook` (ajout de l'envoi d'emails après mise à jour du stock)

**Code affecté :**
- `app/api/webhook/route.ts` : Ajout de l'appel au service d'email après la mise à jour Sanity
- `lib/email/` : Nouveau module pour gérer les emails (client, templates, types)
- `lib/email/templates/` : Templates d'emails en HTML/React (optionnel : utiliser React Email)
- `.env.local` : Nouvelles variables d'environnement
- `types/email.ts` : Types TypeScript pour les emails

**Dépendances :**
- Nouvelle dépendance : `resend` (ou `@sendgrid/mail`)
- Optionnel : `@react-email/components` pour des templates modernes

**Risques :**
- Si l'envoi d'email échoue, le paiement reste validé (comportement souhaité)
- Logs nécessaires pour tracer les échecs d'envoi
- Rate limiting Resend : 100 emails/jour en gratuit, vérifier les quotas

**Non-breaking changes** : Cette fonctionnalité est purement additive, aucun code existant n'est cassé.
