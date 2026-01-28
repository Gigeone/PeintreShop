import { Resend } from "resend";

/**
 * Client Resend pour l'envoi d'emails transactionnels
 *
 * Configuration via variables d'environnement :
 * - RESEND_API_KEY : Clé API Resend (requis)
 *
 * @example
 * ```typescript
 * import { resend } from "@/lib/email/client";
 *
 * const { data, error } = await resend.emails.send({
 *   from: "noreply@example.com",
 *   to: "user@example.com",
 *   subject: "Test",
 *   html: "<p>Hello!</p>"
 * });
 * ```
 */

let resend: Resend | null = null;

/**
 * Initialise et retourne le client Resend
 * Utilise un singleton pour éviter de créer plusieurs instances
 */
export function getResendClient(): Resend | null {
  // Si déjà initialisé, retourner l'instance
  if (resend) {
    return resend;
  }

  // Vérifier que la clé API est configurée
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("⚠ RESEND_API_KEY not configured, email sending disabled");
    return null;
  }

  // Initialiser le client Resend
  resend = new Resend(apiKey);

  return resend;
}

/**
 * Vérifie si le service d'email est configuré et disponible
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Récupère l'adresse email expéditrice depuis les variables d'environnement
 * Fallback sur une adresse par défaut si non configurée
 */
export function getFromEmail(): string {
  return process.env.EMAIL_FROM || "noreply@example.com";
}

/**
 * Récupère l'adresse email de l'artiste depuis les variables d'environnement
 */
export function getArtistEmail(): string | undefined {
  return process.env.ARTIST_EMAIL;
}
