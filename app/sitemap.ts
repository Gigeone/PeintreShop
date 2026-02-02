/**
 * Génération dynamique du sitemap.xml
 *
 * Ce fichier génère automatiquement un sitemap XML incluant toutes les pages
 * publiques du site (statiques et dynamiques depuis Sanity).
 *
 * Le sitemap est régénéré toutes les heures grâce à ISR (revalidate).
 */

import type { MetadataRoute } from "next";
import { getAllArtworks } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/seo/metadata";
import type { SanityArtwork } from "@/types/artwork";

export const revalidate = 3600; // Revalider toutes les heures (ISR)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const currentDate = new Date().toISOString();

  // Pages statiques
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/galerie`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/a-propos`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Pages dynamiques (œuvres)
  try {
    const artworks = await getAllArtworks();

    const artworkRoutes: MetadataRoute.Sitemap = artworks.map((artwork: SanityArtwork) => ({
      url: `${siteUrl}/oeuvres/${artwork.slug}`,
      lastModified: artwork._updatedAt || currentDate,
      changeFrequency: "monthly" as const,
      priority: artwork.isAvailable ? 0.8 : 0.5,
    }));

    return [...staticRoutes, ...artworkRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Retourner au moins les routes statiques en cas d'erreur
    return staticRoutes;
  }
}
