/**
 * Types pour le système d'emails transactionnels
 */

/**
 * Type d'email envoyé
 */
export type EmailType = "customer_confirmation" | "artist_notification" | "contact_form";

/**
 * Adresse de livraison Stripe
 */
export interface ShippingAddress {
  city?: string | null;
  country?: string | null;
  line1?: string | null;
  line2?: string | null;
  postal_code?: string | null;
  state?: string | null;
}

/**
 * Données nécessaires pour l'email de confirmation client
 */
export interface CustomerConfirmationData {
  customerEmail: string;
  customerName?: string;
  customerPhone?: string | null;
  shippingName?: string | null;
  shippingAddress?: ShippingAddress | null;
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
  customerPhone?: string | null;
  shippingName?: string | null;
  shippingAddress?: ShippingAddress | null;
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
 * Données du formulaire de contact
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Configuration générale des emails
 */
export interface EmailConfig {
  from: string;
  artistEmail?: string;
}
