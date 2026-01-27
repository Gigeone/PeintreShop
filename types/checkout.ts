/**
 * Types pour l'API Checkout Stripe
 * Ces interfaces définissent les structures de requête et réponse pour la création de sessions de paiement
 */

/**
 * Corps de la requête pour créer une session de checkout
 */
export interface CheckoutRequestBody {
  /** ID unique de l'œuvre dans Sanity */
  artworkId: string;
}

/**
 * Réponse de succès contenant les détails de la session Stripe
 */
export interface CheckoutSuccessResponse {
  /** ID de la session Stripe Checkout */
  sessionId: string;
  /** URL de redirection vers la page de paiement Stripe */
  url: string;
}

/**
 * Réponse d'erreur standardisée
 */
export interface CheckoutErrorResponse {
  /** Type d'erreur (ex: "Bad Request", "Not Found", "Gone") */
  error: string;
  /** Message d'erreur descriptif pour l'utilisateur */
  message: string;
  /** Code d'erreur optionnel pour le débogage */
  code?: string;
}
