import {
  CustomerConfirmationData,
  ArtistNotificationData,
} from "@/types/email";

/**
 * Génère le HTML pour l'email de confirmation client
 */
export function generateCustomerConfirmationHTML(
  data: CustomerConfirmationData
): string {
  const {
    customerName,
    artworkTitle,
    artworkPrice,
    artworkImageUrl,
    artworkDimensions,
    artworkTechnique,
    sessionId,
  } = data;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Merci pour votre achat</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .artwork-image {
      width: 100%;
      max-width: 400px;
      height: auto;
      border-radius: 8px;
      margin: 20px auto;
      display: block;
    }
    .artwork-details {
      background-color: #f9f9f9;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .artwork-details h2 {
      margin: 0 0 15px 0;
      font-size: 22px;
      color: #333;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #666;
    }
    .detail-value {
      color: #333;
      text-align: right;
    }
    .price {
      font-size: 24px;
      font-weight: 700;
      color: #667eea;
    }
    .message {
      line-height: 1.6;
      color: #555;
      margin: 20px 0;
    }
    .order-id {
      background-color: #f0f0f0;
      padding: 12px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #333;
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 30px;
      text-align: center;
      color: #888;
      font-size: 14px;
    }
    .footer p {
      margin: 5px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
      .header h1 {
        font-size: 24px;
      }
      .detail-row {
        flex-direction: column;
      }
      .detail-value {
        text-align: left;
        margin-top: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🎨 Merci pour votre achat !</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="message">
        ${customerName ? `Bonjour ${customerName},` : "Bonjour,"}
      </p>

      <p class="message">
        Merci d'avoir acquis cette œuvre unique. Votre commande a été confirmée et l'artiste prépare l'expédition de votre œuvre.
      </p>

      ${
        artworkImageUrl
          ? `<img src="${artworkImageUrl}" alt="${artworkTitle}" class="artwork-image" />`
          : ""
      }

      <!-- Artwork Details -->
      <div class="artwork-details">
        <h2>${artworkTitle}</h2>

        <div class="detail-row">
          <span class="detail-label">Prix</span>
          <span class="detail-value price">${artworkPrice.toFixed(2)} €</span>
        </div>

        ${
          artworkDimensions
            ? `
        <div class="detail-row">
          <span class="detail-label">Dimensions</span>
          <span class="detail-value">${artworkDimensions}</span>
        </div>
        `
            : ""
        }

        ${
          artworkTechnique
            ? `
        <div class="detail-row">
          <span class="detail-label">Technique</span>
          <span class="detail-value">${artworkTechnique}</span>
        </div>
        `
            : ""
        }
      </div>

      <p class="message">
        <strong>Numéro de commande :</strong>
      </p>
      <div class="order-id">${sessionId}</div>

      <p class="message">
        Vous recevrez prochainement un email avec les informations de suivi de votre expédition. Si vous avez des questions, n'hésitez pas à nous contacter.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Merci de votre confiance</strong></p>
      <p>Cet email de confirmation a été généré automatiquement suite à votre achat.</p>
      <p style="margin-top: 15px; font-size: 12px; color: #aaa;">
        © ${new Date().getFullYear()} - Tous droits réservés
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Génère le HTML pour l'email de notification artiste
 */
export function generateArtistNotificationHTML(
  data: ArtistNotificationData
): string {
  const {
    artworkTitle,
    artworkSlug,
    artworkPrice,
    customerName,
    customerEmail,
    sessionId,
    stripeUrl,
  } = data;

  const dashboardUrl =
    stripeUrl ||
    `https://dashboard.stripe.com/payments/${sessionId.replace("cs_", "pi_")}`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle vente</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header .emoji {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
    }
    .alert-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .alert-box p {
      margin: 0;
      color: #856404;
      font-weight: 600;
    }
    .sale-details {
      background-color: #f9f9f9;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #666;
    }
    .detail-value {
      color: #333;
      text-align: right;
    }
    .price {
      font-size: 24px;
      font-weight: 700;
      color: #f5576c;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      opacity: 0.9;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 30px;
      text-align: center;
      color: #888;
      font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
      .detail-row {
        flex-direction: column;
      }
      .detail-value {
        text-align: left;
        margin-top: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="emoji">🎉</div>
      <h1>Nouvelle vente !</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="alert-box">
        <p>✨ Félicitations ! Une de vos œuvres vient d'être vendue.</p>
      </div>

      <h2 style="color: #333; margin: 30px 0 20px 0;">Détails de la vente</h2>

      <div class="sale-details">
        <div class="detail-row">
          <span class="detail-label">Œuvre</span>
          <span class="detail-value"><strong>${artworkTitle}</strong></span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Prix de vente</span>
          <span class="detail-value price">${artworkPrice.toFixed(2)} €</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Client</span>
          <span class="detail-value">${customerName}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Email client</span>
          <span class="detail-value">${customerEmail}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Commande #</span>
          <span class="detail-value" style="font-family: monospace; font-size: 12px;">${sessionId}</span>
        </div>
      </div>

      <p style="color: #555; line-height: 1.6; margin: 20px 0;">
        <strong>Prochaines étapes :</strong><br>
        1. Préparez l'œuvre pour l'expédition<br>
        2. Contactez le client pour confirmer l'adresse de livraison<br>
        3. Envoyez un email de suivi avec le numéro de tracking
      </p>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="cta-button">
          Voir dans Stripe Dashboard →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Notification automatique de vente</strong></p>
      <p style="margin-top: 15px; font-size: 12px; color: #aaa;">
        © ${new Date().getFullYear()} - Système de notification
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Génère le sujet de l'email en fonction du type et des données
 */
export function generateEmailSubject(
  type: "customer_confirmation" | "artist_notification",
  artworkTitle: string
): string {
  if (type === "customer_confirmation") {
    return `Merci pour votre achat - ${artworkTitle}`;
  } else {
    return `🎨 Nouvelle vente : ${artworkTitle}`;
  }
}
