## ADDED Requirements

### Requirement: EMAIL-CLIENT-MUST-send-confirmation

**SHALL** : Le système doit envoyer un email de confirmation au client après un paiement réussi.

#### Scenario: Email envoyé après paiement validé

**Étant donné** qu'un client a complété un paiement Stripe
**Et** que le webhook `checkout.session.completed` a été reçu
**Et** que le paiement est confirmé (`payment_status: "paid"`)
**Quand** l'œuvre est marquée comme vendue dans Sanity
**Alors** un email de confirmation est envoyé au client
**Et** l'email contient :
- Titre de l'œuvre achetée
- Prix payé
- Numéro de commande (Stripe session ID)
- Message de remerciement
- Coordonnées de l'artiste

#### Scenario: Adresse email récupérée depuis Stripe

**Étant donné** qu'un paiement Stripe est validé
**Quand** le système prépare l'email de confirmation
**Alors** l'adresse email du client est extraite de `session.customer_details.email`
**Et** si l'email est manquant, l'erreur est loggée mais ne bloque pas le webhook

#### Scenario: Échec d'envoi d'email n'affecte pas le paiement

**Étant donné** qu'un paiement est validé
**Et** que l'envoi d'email échoue (erreur API, quota dépassé, email invalide)
**Quand** le webhook traite la transaction
**Alors** le webhook retourne quand même un statut 200 (succès)
**Et** l'œuvre est marquée comme vendue
**Et** l'erreur d'email est loggée avec détails

---

### Requirement: EMAIL-ARTIST-MUST-send-notification

**SHALL** : Le système doit notifier l'artiste par email lors d'une nouvelle vente.

#### Scenario: Email envoyé à l'artiste après vente

**Étant donné** qu'une œuvre vient d'être vendue
**Et** que l'email de confirmation client a été envoyé (ou a échoué)
**Quand** le webhook finalise le traitement
**Alors** un email de notification est envoyé à l'artiste
**Et** l'email contient :
- Alerte "Nouvelle vente"
- Titre et slug de l'œuvre vendue
- Prix de vente
- Nom et email du client
- Numéro de commande Stripe
- Lien vers le dashboard Stripe

#### Scenario: Adresse artiste configurée par variable d'environnement

**Étant donné** que la variable `ARTIST_EMAIL` est définie
**Quand** une vente est effectuée
**Alors** l'email de notification est envoyé à cette adresse

**Étant donné** que la variable `ARTIST_EMAIL` n'est PAS définie
**Quand** une vente est effectuée
**Alors** aucun email artiste n'est envoyé
**Et** un warning est loggé

---

### Requirement: EMAIL-TEMPLATES-MUST-be-formatted

**SHALL** : Les emails doivent être formatés en HTML responsive avec un design professionnel.

#### Scenario: Template HTML bien structuré

**Étant donné** qu'un email est généré
**Quand** le template est rendu
**Alors** le HTML contient :
- Structure de base HTML5
- CSS inline pour compatibilité email
- Design responsive (mobile-friendly)
- Footer avec mentions légales
- Logo ou branding de l'artiste (optionnel)

#### Scenario: Contenu personnalisé par type d'email

**Étant donné** un email de type "confirmation client"
**Quand** le template est généré
**Alors** le sujet est "Merci pour votre achat - [Titre Œuvre]"

**Étant donné** un email de type "notification artiste"
**Quand** le template est généré
**Alors** le sujet est "🎨 Nouvelle vente : [Titre Œuvre]"

---

### Requirement: EMAIL-SERVICE-MUST-be-configured

**SHALL** : Le service d'email doit être configuré avec les credentials appropriés.

#### Scenario: Configuration Resend (recommandé)

**Étant donné** que la variable `RESEND_API_KEY` est définie
**Quand** le système initialise le client email
**Alors** le client Resend est configuré avec cette clé
**Et** les emails sont envoyés via Resend

#### Scenario: Configuration SendGrid (alternative)

**Étant donné** que la variable `SENDGRID_API_KEY` est définie
**Et** que `RESEND_API_KEY` n'est PAS définie
**Quand** le système initialise le client email
**Alors** le client SendGrid est configuré
**Et** les emails sont envoyés via SendGrid

#### Scenario: Aucune configuration email

**Étant donné** qu'aucune clé API email n'est configurée
**Quand** le système tente d'envoyer un email
**Alors** une erreur est loggée
**Et** l'email n'est pas envoyé
**Et** le processus de paiement continue normalement (pas de crash)

---

### Requirement: EMAIL-LOGS-MUST-trace-events

**SHALL** : Tous les événements liés aux emails doivent être loggés pour faciliter le debug.

#### Scenario: Envoi réussi loggé

**Étant donné** qu'un email est envoyé avec succès
**Quand** le système reçoit la confirmation de l'API email
**Alors** un log de succès est écrit :
```
✓ Email sent to customer@example.com (type: confirmation, session: cs_123)
```

#### Scenario: Envoi échoué loggé

**Étant donné** qu'un email échoue à l'envoi
**Quand** l'API email retourne une erreur
**Alors** un log d'erreur est écrit avec détails :
```
✗ Failed to send email to customer@example.com (type: confirmation, session: cs_123)
  Error: Rate limit exceeded
```
**Et** l'erreur complète est loggée en mode debug

#### Scenario: Configuration manquante loggée

**Étant donné** qu'aucune clé API n'est configurée
**Quand** une vente est effectuée
**Alors** un warning est loggé :
```
⚠ Email not configured, skipping customer confirmation
```

---

### Requirement: EMAIL-CUSTOMER-MUST-contain-order-details

**SHALL** : L'email client doit contenir toutes les informations nécessaires pour confirmer la commande.

#### Scenario: Contenu obligatoire de l'email client

**Étant donné** qu'un email de confirmation client est généré
**Quand** le template est rendu
**Alors** l'email contient obligatoirement :
- **Titre** : Nom de l'œuvre achetée
- **Prix** : Montant payé (formaté en EUR avec symbole €)
- **Numéro de commande** : Stripe session ID (ex: `cs_test_abc123`)
- **Message de remerciement** : Texte personnalisé
- **Contact artiste** : Email ou téléphone pour questions

**Et** optionnellement :
- Image de l'œuvre (URL Sanity)
- Dimensions de l'œuvre
- Technique utilisée
- Délai d'expédition estimé

---

### Requirement: EMAIL-ARTIST-MUST-contain-fulfillment-info

**SHALL** : L'email artiste doit contenir les informations nécessaires pour préparer l'expédition.

#### Scenario: Contenu obligatoire de l'email artiste

**Étant donné** qu'un email de notification artiste est généré
**Quand** le template est rendu
**Alors** l'email contient obligatoirement :
- **Œuvre vendue** : Titre et slug
- **Prix** : Montant de la transaction
- **Client** : Nom et email (extraits de Stripe)
- **Numéro de commande** : Stripe session ID
- **Lien Stripe** : URL vers la session dans le dashboard Stripe

**Et** optionnellement :
- Adresse de livraison (si collectée dans Stripe Checkout)
- Timestamp de la vente
- CTA "Voir dans Stripe Dashboard"

---

## Relations avec d'Autres Capacités

**Dépendances (utilise) :**
- `payment-webhook` : Déclenché après validation du paiement
- Service externe : Resend ou SendGrid pour l'envoi SMTP

**Impact futur sur (sera utilisé par) :**
- V2 : Emails de confirmation d'expédition
- V2 : Emails marketing (newsletter, promotions)

---

## Notes d'Implémentation

### Fichiers Concernés

- `lib/email/client.ts` : Initialisation du client email (Resend/SendGrid)
- `lib/email/send.ts` : Fonctions `sendCustomerConfirmation()` et `sendArtistNotification()`
- `lib/email/templates.ts` : Génération du HTML des emails
- `types/email.ts` : Types TypeScript (`EmailType`, `EmailData`, etc.)
- `app/api/webhook/route.ts` : Intégration dans le webhook Stripe

### Exemple d'appel dans le webhook

```typescript
// Après mise à jour Sanity
try {
  await sendCustomerConfirmation({
    customerEmail: session.customer_details.email,
    artworkTitle: artwork.title,
    artworkPrice: artwork.price,
    sessionId: session.id,
  });

  await sendArtistNotification({
    artworkTitle: artwork.title,
    artworkSlug: artwork.slug.current,
    customerName: session.customer_details.name,
    customerEmail: session.customer_details.email,
    amount: session.amount_total / 100,
    sessionId: session.id,
  });
} catch (error) {
  console.error('✗ Email sending failed:', error);
  // Continue le processus malgré l'erreur
}
```

### Choix du service : Resend vs SendGrid

**Resend (Recommandé) :**
- ✅ API moderne et simple
- ✅ 100 emails/jour gratuits (suffisant pour MVP/V1)
- ✅ Support React Email natif
- ✅ Dashboard clair
- ❌ Plus récent (moins mature)

**SendGrid :**
- ✅ Très mature et stable
- ✅ 100 emails/jour gratuits
- ✅ Analytics détaillées
- ❌ API plus complexe
- ❌ Configuration plus lourde

**Décision** : Utiliser **Resend** pour simplicité et modernité.

---

## Références

- [Resend Documentation](https://resend.com/docs)
- [React Email](https://react.email) (optionnel pour templates modernes)
- [SendGrid API Docs](https://docs.sendgrid.com) (alternative)
- [Stripe Customer Details](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-customer_details)
- Capacité liée : `payment-webhook` (`openspec/specs/payment-webhook/spec.md`)
