import {
  getResendClient,
  getFromEmail,
  getArtistEmail,
  isEmailConfigured,
} from "./client";
import {
  generateCustomerConfirmationHTML,
  generateArtistNotificationHTML,
  generateEmailSubject,
} from "./templates";
import {
  CustomerConfirmationData,
  ArtistNotificationData,
  EmailSendResult,
} from "@/types/email";

/**
 * Envoie un email de confirmation au client après un achat réussi
 *
 * @param data - Données de l'achat et du client
 * @returns Résultat de l'envoi (succès ou erreur)
 *
 * @example
 * ```typescript
 * const result = await sendCustomerConfirmation({
 *   customerEmail: "client@example.com",
 *   artworkTitle: "Paysage Automnal",
 *   artworkPrice: 350,
 *   sessionId: "cs_test_123"
 * });
 *
 * if (result.success) {
 *   console.log("Email envoyé:", result.emailId);
 * } else {
 *   console.error("Erreur:", result.error);
 * }
 * ```
 */
export async function sendCustomerConfirmation(
  data: CustomerConfirmationData
): Promise<EmailSendResult> {
  // Vérifier que l'email est configuré
  if (!isEmailConfigured()) {
    console.warn("⚠ Email not configured, skipping customer confirmation");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  // Vérifier que l'email client est présent
  if (!data.customerEmail) {
    console.warn("⚠ Customer email missing, skipping confirmation");
    return {
      success: false,
      error: "Customer email is required",
    };
  }

  const resend = getResendClient();

  if (!resend) {
    return {
      success: false,
      error: "Resend client not initialized",
    };
  }

  try {
    const subject = generateEmailSubject(
      "customer_confirmation",
      data.artworkTitle
    );
    const html = generateCustomerConfirmationHTML(data);

    const { data: emailData, error } = await resend.emails.send({
      from: getFromEmail(),
      to: data.customerEmail,
      subject,
      html,
    });

    if (error) {
      console.error(
        `✗ Failed to send customer confirmation (session: ${data.sessionId}):`,
        error
      );
      return {
        success: false,
        error: error.message || "Unknown error",
      };
    }

    console.log(
      `✓ Email sent to ${data.customerEmail} (confirmation, session: ${data.sessionId})`
    );

    return {
      success: true,
      emailId: emailData?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `✗ Exception sending customer confirmation (session: ${data.sessionId}):`,
      errorMessage
    );

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Envoie un email de notification à l'artiste après une vente
 *
 * @param data - Données de la vente et du client
 * @returns Résultat de l'envoi (succès ou erreur)
 *
 * @example
 * ```typescript
 * const result = await sendArtistNotification({
 *   artworkTitle: "Paysage Automnal",
 *   artworkSlug: "paysage-automnal",
 *   artworkPrice: 350,
 *   customerName: "Jean Dupont",
 *   customerEmail: "jean@example.com",
 *   sessionId: "cs_test_123"
 * });
 * ```
 */
export async function sendArtistNotification(
  data: ArtistNotificationData
): Promise<EmailSendResult> {
  // Vérifier que l'email est configuré
  if (!isEmailConfigured()) {
    console.warn("⚠ Email not configured, skipping artist notification");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  const artistEmail = getArtistEmail();

  // Vérifier que l'email artiste est configuré
  if (!artistEmail) {
    console.warn(
      "⚠ Artist email not configured (ARTIST_EMAIL), skipping notification"
    );
    return {
      success: false,
      error: "Artist email not configured",
    };
  }

  const resend = getResendClient();

  if (!resend) {
    return {
      success: false,
      error: "Resend client not initialized",
    };
  }

  try {
    const subject = generateEmailSubject(
      "artist_notification",
      data.artworkTitle
    );
    const html = generateArtistNotificationHTML(data);

    const { data: emailData, error } = await resend.emails.send({
      from: getFromEmail(),
      to: artistEmail,
      subject,
      html,
      // Ajouter le client en reply-to pour faciliter la réponse
      replyTo: data.customerEmail,
    });

    if (error) {
      console.error(
        `✗ Failed to send artist notification (session: ${data.sessionId}):`,
        error
      );
      return {
        success: false,
        error: error.message || "Unknown error",
      };
    }

    console.log(
      `✓ Email sent to ${artistEmail} (notification, session: ${data.sessionId})`
    );

    return {
      success: true,
      emailId: emailData?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `✗ Exception sending artist notification (session: ${data.sessionId}):`,
      errorMessage
    );

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Envoie les deux emails (confirmation client + notification artiste)
 * avec gestion d'erreur robuste
 *
 * Cette fonction ne throw jamais - elle log les erreurs et continue
 *
 * @param customerData - Données pour l'email client
 * @param artistData - Données pour l'email artiste
 *
 * @example
 * ```typescript
 * await sendTransactionEmails(
 *   {
 *     customerEmail: "client@example.com",
 *     artworkTitle: "Paysage Automnal",
 *     artworkPrice: 350,
 *     sessionId: "cs_test_123"
 *   },
 *   {
 *     artworkTitle: "Paysage Automnal",
 *     artworkSlug: "paysage-automnal",
 *     artworkPrice: 350,
 *     customerName: "Jean Dupont",
 *     customerEmail: "jean@example.com",
 *     sessionId: "cs_test_123"
 *   }
 * );
 * ```
 */
export async function sendTransactionEmails(
  customerData: CustomerConfirmationData,
  artistData: ArtistNotificationData
): Promise<void> {
  // Envoyer l'email de confirmation client
  try {
    await sendCustomerConfirmation(customerData);
  } catch (error) {
    console.error("✗ Customer email failed:", error);
    // Continue quand même pour envoyer l'email artiste
  }

  // Envoyer l'email de notification artiste
  try {
    await sendArtistNotification(artistData);
  } catch (error) {
    console.error("✗ Artist email failed:", error);
    // Continue quand même - ne pas throw
  }
}
