import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitaire pour merger les classes Tailwind et résoudre les conflits
 * Utilisé par les composants shadcn/ui
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix en euros au format français (ex: "1 250 €")
 */
export function formatPrice(price: number) {
  return `${price.toLocaleString("fr-FR")} €`;
}

/**
 * Formate les dimensions d'une œuvre (hauteur × largeur)
 */
export function formatDimensions(dimensions: { height: number; width: number }) {
  return `${dimensions.height} × ${dimensions.width} cm`;
}
