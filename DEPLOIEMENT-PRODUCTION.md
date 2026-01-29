# 🚀 Guide de Déploiement Production - V1

**Date:** 2026-01-29
**Version:** V1 - Production Ready
**Statut:** ✅ Code testé et validé

---

## 📋 Checklist Avant Déploiement

- ✅ Code poussé sur GitHub (commit `facab6e`)
- ✅ Tests Playwright passés avec succès
- ✅ Flux checkout Stripe validé en mode TEST
- ✅ 17 œuvres dans Sanity CMS
- ✅ Variables d'environnement configurées localement

---

## 🌐 Étape 1 : Déploiement Vercel

### 1.1 Connexion à Vercel

1. **Aller sur** [vercel.com](https://vercel.com)
2. **Se connecter** avec votre compte GitHub
3. **Cliquer sur** "Add New Project"

### 1.2 Import du Projet

1. **Sélectionner** le repository `Gigeone/PeintreShop`
2. **Cliquer sur** "Import"
3. Vercel détectera automatiquement Next.js

### 1.3 Configuration du Build

**Vercel détecte automatiquement :**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

✅ **Ne rien modifier**, la configuration `vercel.json` est déjà optimale.

### 1.4 Configuration des Variables d'Environnement

**CRITIQUE :** Ajouter toutes les variables suivantes dans Vercel :

**Aller dans :** Settings → Environment Variables

#### Variables Sanity CMS

⚠️ **Copier les valeurs depuis votre fichier `.env.local`**

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=votre_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=votre_token_sanity
```

#### Variables Stripe (MODE TEST d'abord)

⚠️ **IMPORTANT :** Déployez d'abord en mode TEST, puis passez en LIVE après validation

⚠️ **Copier les valeurs depuis votre fichier `.env.local`**

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_publishable_key
STRIPE_SECRET_KEY=sk_test_votre_secret_key
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
```

**⚠️ À MODIFIER APRÈS CRÉATION DU WEBHOOK (voir Étape 2)**

#### Variables Email (Resend)

⚠️ **Copier les valeurs depuis votre fichier `.env.local`**

```bash
RESEND_API_KEY=re_votre_api_key
EMAIL_FROM=onboarding@resend.dev
ARTIST_EMAIL=votre_email@example.com
```

#### Variable Site URL

```bash
NEXT_PUBLIC_SITE_URL=https://votre-domaine.vercel.app
```

**⚠️ REMPLACER** `votre-domaine.vercel.app` par votre URL Vercel réelle (après déploiement)

### 1.5 Déployer

1. **Cliquer sur** "Deploy"
2. **Attendre** le build (environ 2-3 minutes)
3. **Vérifier** les logs de build
4. **Copier** l'URL de production (ex: `https://peintre-shop.vercel.app`)

---

## 🔐 Étape 2 : Configuration Webhook Stripe

### 2.1 Créer le Webhook

1. **Aller sur** [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Cliquer sur** "Add endpoint"
3. **Endpoint URL :**
   ```
   https://votre-domaine.vercel.app/api/webhook
   ```
   ⚠️ Remplacer par votre vraie URL Vercel

4. **Événements à écouter :**
   - ✅ `checkout.session.completed`

5. **Cliquer sur** "Add endpoint"

### 2.2 Récupérer le Webhook Secret

1. **Cliquer** sur le webhook créé
2. **Section "Signing secret"**
3. **Cliquer sur** "Reveal"
4. **Copier** le secret (commence par `whsec_...`)

### 2.3 Mettre à Jour Vercel

1. **Aller dans** Vercel → Settings → Environment Variables
2. **Modifier** `STRIPE_WEBHOOK_SECRET`
3. **Coller** le nouveau secret
4. **Sauvegarder**
5. **Redéployer** le site (Deployments → ⋮ → Redeploy)

---

## ✅ Étape 3 : Tests en Mode TEST

### 3.1 Tester le Site en Production

1. **Ouvrir** `https://votre-domaine.vercel.app`
2. **Naviguer** vers la galerie
3. **Cliquer** sur une œuvre disponible
4. **Cliquer** sur "Acheter cette œuvre"
5. **Vérifier** la redirection vers Stripe Checkout

### 3.2 Tester un Paiement Test

**Cartes de test Stripe :**
- **Carte qui réussit :** `4242 4242 4242 4242`
- **Date d'expiration :** N'importe quelle date future (ex: `12/34`)
- **CVC :** N'importe quel 3 chiffres (ex: `123`)
- **Email :** `test@example.com`

**Processus :**
1. **Remplir** le formulaire Stripe avec la carte test
2. **Cliquer** sur "Payer"
3. **Attendre** la redirection vers `/checkout/success`
4. **Vérifier** que l'œuvre est marquée "Vendu" dans la galerie

### 3.3 Vérifier le Webhook

1. **Aller sur** [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Cliquer** sur votre webhook
3. **Vérifier** qu'un événement `checkout.session.completed` apparaît
4. **Statut** doit être ✅ (200 OK)

### 3.4 Vérifier Sanity

1. **Aller sur** [sanity.io/manage](https://sanity.io/manage)
2. **Ouvrir** Sanity Studio
3. **Vérifier** que l'œuvre achetée a `isAvailable: false`

### 3.5 Vérifier les Emails

**Si les emails transactionnels sont configurés :**
- ✅ Email de confirmation au client (`test@example.com`)
- ✅ Email de notification à l'artiste (`matthieugh@gmail.com`)

**Vérifier dans :** [resend.com/logs](https://resend.com/logs)

---

## 🔴 Étape 4 : Passage en Mode LIVE (Production Réelle)

⚠️ **ATTENTION :** Ne passez en mode LIVE qu'après validation complète en mode TEST

### 4.1 Activer les Paiements Réels dans Stripe

1. **Aller sur** [dashboard.stripe.com/settings/account](https://dashboard.stripe.com/settings/account)
2. **Compléter** toutes les informations requises :
   - Informations légales de l'entreprise/artiste
   - Coordonnées bancaires pour recevoir les paiements
   - Vérification d'identité
3. **Activer** le compte

### 4.2 Récupérer les Clés LIVE

1. **Aller sur** [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. **Basculer** en mode "Live" (toggle en haut à droite)
3. **Copier :**
   - Publishable key (commence par `pk_live_...`)
   - Secret key (commence par `sk_live_...`)

### 4.3 Créer le Webhook LIVE

1. **Aller sur** [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Basculer** en mode "Live"
3. **Créer** un nouveau endpoint :
   - URL : `https://votre-domaine.vercel.app/api/webhook`
   - Événement : `checkout.session.completed`
4. **Copier** le signing secret (`whsec_...`)

### 4.4 Mettre à Jour Vercel (Variables LIVE)

1. **Aller dans** Vercel → Settings → Environment Variables
2. **Modifier** les variables Stripe :

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_LIVE
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_LIVE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_LIVE
```

3. **Sauvegarder**
4. **Redéployer** le site

### 4.5 Test Final en LIVE

⚠️ **TEST AVEC UNE VRAIE CARTE**

1. **Utiliser** une vraie carte bancaire
2. **Acheter** une œuvre test (créer une œuvre "TEST" à petit prix)
3. **Vérifier** :
   - ✅ Paiement réussi dans Stripe Dashboard
   - ✅ Œuvre marquée "Vendu" dans Sanity
   - ✅ Webhook reçu et traité (200 OK)
   - ✅ Emails envoyés

4. **Rembourser** le paiement test dans Stripe Dashboard (optionnel)

---

## 🎯 Étape 5 : Configuration Domaine Personnalisé (Optionnel)

### 5.1 Ajouter un Domaine

1. **Aller dans** Vercel → Settings → Domains
2. **Cliquer** sur "Add Domain"
3. **Entrer** votre domaine (ex: `peinture-artiste.com`)
4. **Suivre** les instructions DNS

### 5.2 Mettre à Jour les URLs

**Dans Vercel :**
```bash
NEXT_PUBLIC_SITE_URL=https://peinture-artiste.com
```

**Dans Stripe :**
- Webhook URL : `https://peinture-artiste.com/api/webhook`

**Redéployer** après modification.

---

## 📊 Monitoring et Maintenance

### Vérifications Régulières

**Hebdomadaire :**
- ✅ Vérifier les logs Vercel (erreurs)
- ✅ Vérifier les webhooks Stripe (200 OK)
- ✅ Vérifier les emails Resend (deliverability)

**Mensuel :**
- ✅ Vérifier les paiements reçus dans Stripe
- ✅ Sauvegarder les données Sanity
- ✅ Mettre à jour les dépendances (`npm outdated`)

### Logs et Debugging

**Vercel Logs :**
- Dashboard → Project → Logs
- Filtrer par erreurs (5xx)

**Stripe Logs :**
- Dashboard → Developers → Logs
- Filtrer par webhook errors

**Resend Logs :**
- Dashboard → Logs
- Vérifier bounce/spam rate

---

## ❓ Troubleshooting

### Problème : Webhook ne reçoit pas les événements

**Solutions :**
1. Vérifier l'URL du webhook (doit être `/api/webhook`)
2. Vérifier que `STRIPE_WEBHOOK_SECRET` est correct
3. Tester manuellement : Stripe Dashboard → Send test webhook
4. Vérifier les logs Vercel pour erreurs 500

### Problème : Œuvre pas marquée "Vendu" après paiement

**Solutions :**
1. Vérifier webhook status (200 OK)
2. Vérifier logs Vercel `/api/webhook`
3. Vérifier `SANITY_API_TOKEN` (doit avoir write access)
4. Tester manuellement la query Sanity

### Problème : Emails non reçus

**Solutions :**
1. Vérifier `RESEND_API_KEY` valide
2. Vérifier domaine vérifié dans Resend
3. Checker spam folder
4. Vérifier Resend logs (bounce/spam)

### Problème : Build Vercel échoue

**Solutions :**
1. Vérifier les logs de build
2. Tester `npm run build` en local
3. Vérifier que toutes les variables env sont définies
4. Vérifier compatibilité Node version

---

## 🎉 Félicitations !

Votre site e-commerce V1 est maintenant **EN PRODUCTION** ! 🚀

### Prochaines Étapes (Optionnel - V2)

- [ ] Dashboard administrateur avec statistiques
- [ ] Codes promo et réductions
- [ ] Génération de factures PDF
- [ ] Support multilingue (FR/EN)
- [ ] Analytics Google/Plausible
- [ ] Monitoring Sentry
- [ ] Newsletter

---

## 📞 Support

**Documentation :**
- Next.js : [nextjs.org/docs](https://nextjs.org/docs)
- Stripe : [stripe.com/docs](https://stripe.com/docs)
- Sanity : [sanity.io/docs](https://sanity.io/docs)
- Vercel : [vercel.com/docs](https://vercel.com/docs)

**Repository GitHub :** [Gigeone/PeintreShop](https://github.com/Gigeone/PeintreShop)

---

**Bonne chance avec votre site ! 🎨✨**
