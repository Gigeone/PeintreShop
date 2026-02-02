/**
 * Constantes globales de l'application
 */

/**
 * Liens de navigation principaux du site
 * Utilisés dans la Navbar et le Footer
 */
export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/galerie", label: "Galerie" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Configuration du carrousel de la page d'accueil
 */
export const CAROUSEL_CONFIG = {
  autoPlayInterval: 5000, // ms
} as const;
