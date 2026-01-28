/**
 * Types pour les webhooks Stripe
 * Ces interfaces définissent les structures d'événements reçus de Stripe
 */

import Stripe from "stripe";

/**
 * Structure générique d'un événement webhook Stripe
 */
export interface WebhookEventBody {
  /** ID unique de l'événement */
  id: string;
  /** Type d'événement (ex: checkout.session.completed) */
  type: string;
  /** Données de l'événement */
  data: {
    /** Objet Stripe associé à l'événement */
    object: Stripe.Checkout.Session;
  };
}

/**
 * Metadata extraites de la session Stripe Checkout
 * Ces données sont définies lors de la création de la session dans /api/checkout
 */
export interface ArtworkMetadata {
  /** ID unique de l'œuvre dans Sanity */
  artworkId: string;
  /** Slug de l'œuvre pour les URLs */
  artworkSlug: string;
}

/**
 * Réponse de succès du webhook
 */
export interface WebhookSuccessResponse {
  /** Indique que le webhook a été reçu */
  received: true;
  /** ID de l'œuvre traitée */
  artworkId: string;
  /** Indique si l'œuvre a été mise à jour */
  updated?: boolean;
  /** Indique si l'œuvre était déjà vendue (idempotence) */
  already_sold?: boolean;
}

/**
 * Réponse d'erreur du webhook
 */
export interface WebhookErrorResponse {
  /** Message d'erreur */
  error: string;
  /** Détails supplémentaires optionnels */
  details?: string;
}
