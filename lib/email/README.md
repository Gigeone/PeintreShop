# 📧 Module Email

Module pour la gestion des emails transactionnels via Resend.

## Architecture

```
lib/email/
├── client.ts      # Client Resend singleton
├── templates.ts   # Génération HTML des emails
├── send.ts        # Fonctions d'envoi
└── README.md      # Ce fichier
```

## Usage

### Envoyer un email de confirmation client

```typescript
import { sendCustomerConfirmation } from "@/lib/email/send";

const result = await sendCustomerConfirmation({
  customerEmail: "client@example.com",
  customerName: "Jean Dupont",
  artworkTitle: "Paysage Automnal",
  artworkPrice: 350,
  sessionId: "cs_test_123",
});

if (result.success) {
  console.log("Email envoyé:", result.emailId);
} else {
  console.error("Erreur:", result.error);
}
```

### Envoyer un email de notification artiste

```typescript
import { sendArtistNotification } from "@/lib/email/send";

const result = await sendArtistNotification({
  artworkTitle: "Paysage Automnal",
  artworkSlug: "paysage-automnal",
  artworkPrice: 350,
  customerName: "Jean Dupont",
  customerEmail: "client@example.com",
  sessionId: "cs_test_123",
});
```

### Envoyer les deux emails simultanément

```typescript
import { sendTransactionEmails } from "@/lib/email/send";

await sendTransactionEmails(
  // Données email client
  {
    customerEmail: "client@example.com",
    artworkTitle: "Paysage Automnal",
    artworkPrice: 350,
    sessionId: "cs_test_123",
  },
  // Données email artiste
  {
    artworkTitle: "Paysage Automnal",
    artworkSlug: "paysage-automnal",
    artworkPrice: 350,
    customerName: "Jean Dupont",
    customerEmail: "client@example.com",
    sessionId: "cs_test_123",
  }
);

// Ne throw jamais - log les erreurs et continue
```

## Configuration

### Variables d'environnement requises

```bash
# Clé API Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email expéditeur (vérifié sur Resend)
EMAIL_FROM=noreply@votre-domaine.com

# Email artiste (pour notifications)
ARTIST_EMAIL=artiste@votre-domaine.com
```

### Vérifier la configuration

```typescript
import { isEmailConfigured } from "@/lib/email/client";

if (isEmailConfigured()) {
  console.log("Email service configuré ✅");
} else {
  console.log("Email service non configuré ⚠️");
}
```

## Gestion d'erreur

### Pattern robuste (recommandé)

Les fonctions `send*()` ne throw jamais - elles retournent un objet `EmailSendResult` :

```typescript
const result = await sendCustomerConfirmation(data);

if (!result.success) {
  console.error("Email failed:", result.error);
  // Continuer le processus malgré l'erreur
}
```

### Pattern avec try/catch

Pour capturer les exceptions imprévues :

```typescript
try {
  await sendTransactionEmails(customerData, artistData);
} catch (error) {
  console.error("Unexpected email error:", error);
  // Continue le processus
}
```

### Cas où l'email n'est pas envoyé

L'email n'est **pas envoyé** dans les cas suivants (sans erreur) :

- `RESEND_API_KEY` non configurée → Log warning
- `EMAIL_FROM` non configurée → Erreur
- `ARTIST_EMAIL` non configurée (email artiste uniquement) → Log warning
- Email client manquant → Log warning

## Templates

### Structure des templates

Les templates sont générés avec du HTML inline CSS pour compatibilité email.

```typescript
import {
  generateCustomerConfirmationHTML,
  generateArtistNotificationHTML,
  generateEmailSubject,
} from "@/lib/email/templates";

// Générer le HTML
const html = generateCustomerConfirmationHTML({
  customerName: "Jean",
  artworkTitle: "Paysage",
  artworkPrice: 350,
  sessionId: "cs_123",
});

// Générer le sujet
const subject = generateEmailSubject("customer_confirmation", "Paysage");
// => "Merci pour votre achat - Paysage"
```

### Personnalisation

Modifier `lib/email/templates.ts` pour :
- Changer les couleurs de marque
- Ajouter un logo
- Modifier le contenu des messages
- Ajouter des sections

**Important** : Utiliser du CSS inline pour compatibilité maximum.

## Tests

### Test unitaire (génération HTML)

```typescript
import { generateCustomerConfirmationHTML } from "@/lib/email/templates";

const html = generateCustomerConfirmationHTML({
  customerEmail: "test@example.com",
  artworkTitle: "Test Artwork",
  artworkPrice: 100,
  sessionId: "cs_test_123",
});

// Vérifier que le HTML contient les bonnes infos
expect(html).toContain("Test Artwork");
expect(html).toContain("100");
```

### Test d'intégration (avec Resend)

```bash
# Configurer .env.local avec vraie clé API
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=test@votre-domaine.com

# Lancer le serveur
npm run dev

# Déclencher un webhook test
stripe trigger checkout.session.completed
```

## Limites

### Quota Resend (plan gratuit)

- **100 emails/jour**
- Suffisant pour ~3000 emails/mois
- Si dépassé : Erreur `rate_limit_exceeded`

### Délai d'envoi

- Envoi asynchrone via Resend
- Délai moyen : 1-2 secondes
- Peut augmenter en cas de charge

### Taille des emails

- HTML recommandé : < 100KB
- Templates actuels : ~15KB (OK)

## Monitoring

### Logs Next.js

Les logs indiquent :
- ✅ `✓ Email sent to ...` : Succès
- ⚠️ `⚠ Email not configured` : Warning
- ❌ `✗ Failed to send email` : Erreur

### Dashboard Resend

[resend.com/emails](https://resend.com/emails) pour :
- Voir tous les emails envoyés
- Statut de délivrance
- Taux d'ouverture
- Bounces et erreurs

## Dépendances

- `resend` : SDK officiel Resend

## Références

- [Documentation Resend](https://resend.com/docs)
- [EMAIL_SETUP.md](../../EMAIL_SETUP.md) : Guide de configuration
- [WEBHOOK_TESTING.md](../../WEBHOOK_TESTING.md) : Tests webhooks + emails
