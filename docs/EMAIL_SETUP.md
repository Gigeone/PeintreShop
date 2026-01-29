# 📧 Configuration du Système d'Emails

Ce guide vous accompagne dans la configuration du service d'emailing pour envoyer automatiquement des emails de confirmation aux clients et des notifications à l'artiste lors de chaque vente.

---

## 🎯 Résumé

**Service recommandé** : [Resend](https://resend.com)
**Temps de configuration** : ~10 minutes
**Plan gratuit** : 100 emails/jour (suffisant pour démarrer)

---

## 🚀 Étape 1 : Créer un compte Resend

1. Aller sur [resend.com](https://resend.com)
2. Cliquer sur **"Sign Up"** (inscription gratuite)
3. Vérifier votre email

---

## 🔑 Étape 2 : Obtenir la clé API

1. Une fois connecté, aller sur [API Keys](https://resend.com/api-keys)
2. Cliquer sur **"Create API Key"**
3. Donner un nom : `PeintreShop Production` (ou `Development` pour les tests)
4. Permissions : **"Sending access"** (suffisant pour envoyer des emails)
5. Cliquer sur **"Add"**
6. **⚠️ Copier la clé immédiatement** (commence par `re_...`) - elle ne sera plus affichée

---

## 📧 Étape 3 : Vérifier votre domaine d'envoi

### Option A : Utiliser un email personnel (le plus simple pour démarrer)

**Gratuit et rapide** : Vous pouvez envoyer depuis votre email personnel avec Resend

1. Aller sur [Domains](https://resend.com/domains)
2. Cliquer sur **"Add Domain"**
3. Entrer votre email personnel (ex: `votreemail@gmail.com`)
4. Resend enverra un email de vérification
5. Cliquer sur le lien de vérification

**Avantage** : Configuration en 2 minutes
**Inconvénient** : Les emails seront envoyés depuis votre adresse personnelle

### Option B : Utiliser votre propre domaine (recommandé pour production)

**Plus professionnel** mais nécessite un domaine

1. Aller sur [Domains](https://resend.com/domains)
2. Cliquer sur **"Add Domain"**
3. Entrer votre domaine : `votre-domaine.com`
4. Resend vous donnera des enregistrements DNS à ajouter :
   - **SPF** : Enregistrement TXT pour autoriser Resend
   - **DKIM** : Enregistrement TXT pour signer les emails
   - **MX** (optionnel) : Pour recevoir des emails

5. Ajouter ces enregistrements DNS chez votre hébergeur :
   - **OVH** : Manager → Domaines → Zone DNS
   - **Namecheap** : Domain List → Manage → Advanced DNS
   - **Cloudflare** : DNS → Add record
   - **Vercel** : Domains → DNS Records

6. Attendre la propagation DNS (5 min à 24h, généralement ~10 min)
7. Resend vérifiera automatiquement et affichera ✅ quand c'est bon

---

## 🔧 Étape 4 : Configurer les variables d'environnement

### En local (.env.local)

Ouvrir le fichier `.env.local` et ajouter :

```bash
# Clé API Resend (copiée à l'étape 2)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email expéditeur (vérifié à l'étape 3)
# Option A : Email personnel
EMAIL_FROM=votreemail@gmail.com
# Option B : Email sur votre domaine
# EMAIL_FROM=noreply@votre-domaine.com

# Email de l'artiste (pour les notifications de vente)
ARTIST_EMAIL=artiste@example.com
```

**Important** : Redémarrer le serveur Next.js après modification :
```bash
# Ctrl+C pour arrêter, puis
npm run dev
```

### En production (Vercel)

1. Aller sur [Vercel Dashboard](https://vercel.com)
2. Sélectionner votre projet
3. Aller dans **Settings** → **Environment Variables**
4. Ajouter les 3 variables :

| Key | Value | Environments |
|-----|-------|--------------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxx` | Production, Preview |
| `EMAIL_FROM` | `noreply@votre-domaine.com` | Production, Preview |
| `ARTIST_EMAIL` | `artiste@example.com` | Production, Preview |

5. Cliquer sur **Save**
6. Redéployer l'application (ou pousser un commit)

---

## ✅ Étape 5 : Tester l'envoi d'emails

### Test avec Stripe CLI (Local)

**Terminal 1** : Serveur Next.js
```bash
npm run dev
```

**Terminal 2** : Stripe CLI
```bash
stripe listen --forward-to http://localhost:3000/api/webhook
```

**Terminal 3** : Déclencher un paiement test
```bash
stripe trigger checkout.session.completed
```

**Résultat attendu** :
- Terminal 1 (Next.js) : Logs `✓ Email sent to ...`
- Votre boîte mail : Email de confirmation reçu
- Email artiste : Email de notification reçu

### Test end-to-end complet

1. Faire un vrai achat test :
   - Aller sur une page œuvre en local
   - Cliquer sur "Acheter cette œuvre"
   - Utiliser la carte test Stripe : `4242 4242 4242 4242`
   - Compléter le paiement

2. Vérifier :
   - ✅ Email de confirmation reçu par le client
   - ✅ Email de notification reçu par l'artiste
   - ✅ Œuvre marquée comme vendue dans Sanity
   - ✅ Logs dans le terminal Next.js

---

## 📊 Étape 6 : Monitorer les emails

### Dashboard Resend

1. Aller sur [Resend Dashboard](https://resend.com/emails)
2. Vous verrez tous les emails envoyés avec :
   - ✅ **Delivered** : Email envoyé avec succès
   - 📬 **Opened** : Client a ouvert l'email
   - 🖱️ **Clicked** : Client a cliqué sur un lien
   - ❌ **Bounced** : Email rejeté (adresse invalide)

### Logs Next.js

En développement, vérifier les logs dans le terminal :
```
✓ Email sent to client@example.com (confirmation, session: cs_123)
✓ Email sent to artiste@example.com (notification, session: cs_123)
```

En production (Vercel) :
1. Vercel Dashboard → Votre projet → **Logs**
2. Filtrer par `/api/webhook`
3. Chercher les messages `✓ Email sent` ou `✗ Failed to send`

---

## 🎨 Personnalisation des Emails

### Modifier les templates

Les templates d'emails sont dans :
- `lib/email/templates.ts` : Templates HTML
  - `generateCustomerConfirmationHTML()` : Email client
  - `generateArtistNotificationHTML()` : Email artiste

### Ajouter le logo de l'artiste

Dans `templates.ts`, ajouter une image dans le header :
```typescript
<div class="header">
  <img src="https://votre-domaine.com/logo.png" alt="Logo" style="width: 120px;" />
  <h1>Merci pour votre achat !</h1>
</div>
```

### Modifier le design

Les styles CSS sont inline dans les templates pour compatibilité email. Modifier les couleurs :
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Remplacer par vos couleurs de marque */
```

---

## 🐛 Dépannage

### Erreur : "Email not configured"

**Cause** : Variable `RESEND_API_KEY` manquante

**Solution** :
1. Vérifier que `.env.local` contient `RESEND_API_KEY`
2. Redémarrer Next.js
3. Vérifier les logs : la clé doit être détectée au démarrage

### Erreur : "Missing sender email"

**Cause** : Variable `EMAIL_FROM` manquante ou email non vérifié

**Solution** :
1. Ajouter `EMAIL_FROM` dans `.env.local`
2. Vérifier que l'email ou domaine est validé sur Resend
3. Redémarrer Next.js

### Erreur : "Artist email not configured"

**Cause** : Variable `ARTIST_EMAIL` manquante

**Impact** : Seul l'email client est envoyé (pas grave, mais l'artiste n'est pas notifié)

**Solution** :
1. Ajouter `ARTIST_EMAIL` dans `.env.local`
2. Redémarrer Next.js

### Email non reçu

**Vérifier** :
1. **Spam/Courrier indésirable** : Les emails de test finissent souvent là
2. **Logs Resend** : [Dashboard](https://resend.com/emails) → Vérifier le statut
3. **Logs Next.js** : Chercher `✓ Email sent` ou `✗ Failed`
4. **Quota Resend** : Plan gratuit limité à 100 emails/jour

---

## 💰 Limites et Tarifs

### Plan Gratuit Resend

- ✅ **100 emails/jour**
- ✅ Domaines personnalisés illimités
- ✅ Support des templates
- ✅ Analytics basiques
- ❌ Pas de support prioritaire

**Suffisant pour** : MVP et sites à faible volume (~3000 emails/mois)

### Plan Pro Resend

- **$20/mois** pour 50 000 emails/mois
- Support prioritaire
- Analytics avancées
- Taux de délivrabilité amélioré

**Nécessaire pour** : Sites avec >100 ventes/mois

---

## 🔄 Alternative : SendGrid

Si vous préférez SendGrid à Resend :

1. Créer un compte sur [sendgrid.com](https://sendgrid.com)
2. Obtenir une clé API
3. Dans `.env.local`, remplacer :
   ```bash
   # Remplacer RESEND_API_KEY par
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   ```
4. Modifier `lib/email/client.ts` pour utiliser SendGrid au lieu de Resend

**Note** : Le code actuel est optimisé pour Resend. SendGrid nécessite des modifications du client.

---

## 📚 Ressources

- [Documentation Resend](https://resend.com/docs)
- [API Resend](https://resend.com/docs/api-reference/emails/send-email)
- [Resend Status](https://status.resend.com) (disponibilité du service)
- [WEBHOOK_TESTING.md](./WEBHOOK_TESTING.md) (test complet du flux)

---

**✅ Configuration terminée !** Votre système d'emails est maintenant opérationnel.

Pour toute question, consultez les logs ou le [support Resend](https://resend.com/support).
