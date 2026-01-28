/**
 * Types pour le système d'emails transactionnels
 */

/**
 * Type d'email envoyé
 */
export type EmailType = "customer_confirmation" | "artist_notification";

/**
 * Données nécessaires pour l'email de confirmation client
 */
export interface CustomerConfirmationData {
  customerEmail: string;
  customerName?: string;
  artworkTitle: string;
  artworkPrice: number;
  artworkImageUrl?: string;
  artworkDimensions?: string;
  artworkTechnique?: string;
  sessionId: string;
}

/**
 * Données nécessaires pour l'email de notification artiste
 */
export interface ArtistNotificationData {
  artworkTitle: string;
  artworkSlug: string;
  artworkPrice: number;
  customerName: string;
  customerEmail: string;
  sessionId: string;
  stripeUrl?: string;
}

/**
 * Résultat de l'envoi d'un email
 */
export interface EmailSendResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

/**
 * Configuration générale des emails
 */
export interface EmailConfig {
  from: string;
  artistEmail?: string;
}
