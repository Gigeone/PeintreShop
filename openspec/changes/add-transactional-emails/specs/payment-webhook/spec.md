## ADDED Requirements

### Requirement: WEBHOOK-EMAIL-MUST-notify-after-payment

**SHALL** : Le webhook doit envoyer des emails de confirmation après avoir marqué l'œuvre comme vendue.

#### Scenario: Emails envoyés après mise à jour réussie

**Étant donné** qu'un paiement Stripe a été validé
**Et** que l'œuvre a été marquée `isAvailable: false` dans Sanity
**Quand** le webhook finalise le traitement
**Alors** un email de confirmation est envoyé au client via `sendCustomerConfirmation()`
**Et** un email de notification est envoyé à l'artiste via `sendArtistNotification()`
**Et** le webhook retourne 200 même si l'envoi d'email échoue

#### Scenario: Échec d'envoi d'email n'affecte pas le paiement

**Étant donné** qu'un paiement a été validé et l'œuvre marquée comme vendue
**Et** que le service d'email est indisponible ou retourne une erreur
**Quand** le webhook tente d'envoyer les emails
**Alors** l'erreur est loggée avec détails
**Et** le webhook retourne quand même un statut 200 (succès)
**Et** le paiement reste validé
**Et** l'œuvre reste marquée comme vendue

#### Scenario: Informations client extraites depuis Stripe

**Étant donné** qu'un webhook `checkout.session.completed` est reçu
**Quand** le système prépare les emails
**Alors** les informations suivantes sont extraites de `session.customer_details` :
- `name` : Nom complet du client
- `email` : Adresse email du client
**Et** si ces informations sont manquantes, l'erreur est loggée mais ne bloque pas le processus

---

### Requirement: WEBHOOK-EMAIL-MUST-extract-customer-info

**SHALL** : Le webhook doit extraire les informations client nécessaires depuis la session Stripe pour les emails.

#### Scenario: Extraction des données client

**Étant donné** qu'un événement `checkout.session.completed` est reçu
**Et** que `session.customer_details` est présent
**Quand** le webhook prépare les données pour les emails
**Alors** les données suivantes sont extraites :
```typescript
{
  customerName: session.customer_details.name,
  customerEmail: session.customer_details.email,
  amount: session.amount_total / 100, // Conversion centimes → euros
  sessionId: session.id
}
```

#### Scenario: Données client manquantes

**Étant donné** qu'un événement `checkout.session.completed` est reçu
**Et** que `session.customer_details.email` est `null` ou `undefined`
**Quand** le webhook tente d'envoyer les emails
**Alors** un warning est loggé :
```
⚠ Missing customer email, skipping confirmation email (session: cs_123)
```
**Et** aucun email client n'est envoyé
**Et** l'email artiste est quand même envoyé (si configuré)
**Et** le webhook retourne 200

---

### Requirement: WEBHOOK-LOGS-MUST-trace-email-events

**SHALL** : Le webhook doit logger les événements liés aux emails pour faciliter le debugging.

#### Scenario: Envoi d'emails réussi

**Étant donné** que les emails client et artiste ont été envoyés avec succès
**Quand** le webhook termine le traitement
**Alors** les logs suivants sont créés :
```
✓ Artwork abc-123 (Paysage Automnal) marked as sold
✓ Email sent to customer@example.com (confirmation)
✓ Email sent to artist@example.com (notification)
```

#### Scenario: Échec d'envoi d'email

**Étant donné** que l'envoi d'un email échoue
**Quand** le webhook traite l'erreur
**Alors** un log d'erreur est créé :
```
✗ Failed to send customer confirmation email (session: cs_123)
  Error: Rate limit exceeded (Resend)
```
**Et** le webhook continue normalement

---

### Requirement: WEBHOOK-EMAIL-SHOULD-not-block-payment

**SHALL** : L'envoi d'emails ne doit JAMAIS bloquer ou invalider un paiement réussi.

#### Scenario: Email échoue mais paiement validé

**Étant donné** qu'un paiement Stripe a été confirmé
**Et** que l'œuvre a été marquée comme vendue dans Sanity
**Et** que l'envoi d'email échoue (API indisponible, quota dépassé, etc.)
**Quand** le webhook traite l'événement
**Alors** le webhook retourne HTTP 200 (succès)
**Et** l'œuvre reste `isAvailable: false`
**Et** le paiement est considéré comme validé
**Et** l'échec d'email est loggé pour investigation manuelle

**Justification** : Le paiement client est prioritaire sur la notification. Un email peut être renvoyé manuellement, mais un paiement échoué est une perte de vente.

---

## Notes d'Implémentation

### Ordre d'Exécution dans le Webhook

```typescript
try {
  // 1. Valider signature Stripe
  const event = stripe.webhooks.constructEvent(body, signature, secret);

  // 2. Filtrer événement et vérifier paiement
  if (event.type !== 'checkout.session.completed') return;
  if (session.payment_status !== 'paid') return;

  // 3. Récupérer et vérifier l'œuvre
  const artwork = await client.fetch(...);
  if (!artwork) return 500;
  if (!artwork.isAvailable) return 200; // Idempotence

  // 4. Mettre à jour le stock (CRITIQUE)
  await client.patch(artworkId).set({ isAvailable: false }).commit();

  // 5. Envoyer les emails (BONUS - ne doit pas bloquer)
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
  } catch (emailError) {
    console.error('✗ Email sending failed:', emailError);
    // Continue quand même - ne pas throw
  }

  // 6. Retourner succès
  return Response.json({ received: true, updated: true });

} catch (error) {
  // Gérer les erreurs critiques (signature, Sanity, etc.)
  console.error(error);
  return Response.json({ error }, { status: 500 });
}
```

### Extraction des Données Client

```typescript
// Extraire les infos depuis Stripe
const customerEmail = session.customer_details?.email;
const customerName = session.customer_details?.name || 'Client';

// Vérifier que l'email existe avant d'envoyer
if (!customerEmail) {
  console.warn(`⚠ Missing customer email (session: ${session.id})`);
} else {
  await sendCustomerConfirmation({...});
}
```

### Gestion d'Erreur Email

**Pattern recommandé** :
```typescript
try {
  await sendEmails();
} catch (emailError) {
  console.error('✗ Email error:', emailError);
  // NE PAS throw - continuer le processus
}
```

**Anti-pattern (à éviter)** :
```typescript
await sendEmails(); // ❌ Si ça throw, tout le webhook échoue
```

---

## Références

- Capacité liée : `email-notifications` (nouvelle capacité créée par ce change)
- Capacité modifiée : `payment-webhook` (ajout d'envoi d'emails)
- [Stripe Customer Details](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-customer_details)
