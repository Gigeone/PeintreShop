/**
 * Helpers pour générer les métadonnées Next.js (Open Graph, Twitter Cards)
 */

import type { Metadata } from "next";
import type { OpenGraphParams, TwitterCardParams, MetadataParams } from "@/types/seo";

/**
 * Récupère l'URL de base du site depuis les variables d'environnement
 *
 * @returns URL du site (avec protocole, sans trailing slash)
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  // Supprimer trailing slash si présent
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Génère une URL canonique absolue
 *
 * @param path - Chemin relatif (ex: "/galerie" ou "/oeuvres/mon-oeuvre")
 * @returns URL absolue canonique sans trailing slash
 */
export function getCanonicalUrl(path: string): string {
  const siteUrl = getSiteUrl();
  // S'assurer que le path commence par /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // Supprimer trailing slash du path si présent
  const cleanPath = normalizedPath.endsWith("/") && normalizedPath !== "/"
    ? normalizedPath.slice(0, -1)
    : normalizedPath;

  return `${siteUrl}${cleanPath}`;
}

/**
 * Génère les métadonnées Open Graph
 *
 * @param params - Paramètres Open Graph
 * @returns Objet openGraph pour Next.js Metadata
 */
export function generateOpenGraph(
  params: OpenGraphParams
): NonNullable<Metadata["openGraph"]> {
  return {
    title: params.title,
    description: params.description,
    url: params.url,
    siteName: params.siteName || "MNGH - Artiste Peintre",
    locale: params.locale || "fr_FR",
    type: params.type || "website",
    images: params.images || [],
  };
}

/**
 * Génère les métadonnées Twitter Card
 *
 * @param params - Paramètres Twitter Card
 * @returns Objet twitter pour Next.js Metadata
 */
export function generateTwitterCard(
  params: TwitterCardParams
): NonNullable<Metadata["twitter"]> {
  return {
    card: params.card,
    title: params.title,
    description: params.description,
    images: params.images,
    creator: params.creator,
    site: params.site,
  };
}

/**
 * Génère des métadonnées complètes pour une page (Open Graph + Twitter)
 *
 * Helper combiné pour simplifier la génération de métadonnées
 *
 * @param params - Paramètres de métadonnées
 * @returns Objet Metadata Next.js partiel (à merger avec d'autres métadonnées)
 *
 * @example
 * ```ts
 * export const metadata: Metadata = {
 *   ...generatePageMetadata({
 *     title: 'Ma Page',
 *     description: 'Description de ma page',
 *     path: '/ma-page',
 *     images: [{ url: '/image.jpg', width: 1200, height: 630 }],
 *   }),
 * };
 * ```
 */
export function generatePageMetadata(params: MetadataParams): Metadata {
  const canonicalUrl = getCanonicalUrl(params.path);

  return {
    title: params.title,
    description: params.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: generateOpenGraph({
      title: params.title,
      description: params.description,
      url: canonicalUrl,
      images: params.images,
      type: params.type,
    }),
    twitter: generateTwitterCard({
      card: params.images && params.images.length > 0 ? "summary_large_image" : "summary",
      title: params.title,
      description: params.description,
      images: params.images?.map((img) => img.url),
    }),
  };
}
