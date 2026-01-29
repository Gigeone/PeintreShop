/**
 * Générateurs Schema.org JSON-LD
 *
 * Ces fonctions génèrent des objets JSON-LD valides selon la spécification Schema.org
 * pour améliorer l'affichage des rich snippets dans les moteurs de recherche.
 */

import type { Artwork } from "@/types/artwork";
import type {
  ProductSchema,
  OrganizationSchema,
  WebSiteSchema,
  BreadcrumbSchema,
  BreadcrumbItem,
} from "@/types/seo";

/**
 * Génère un Product Schema pour une œuvre d'art
 *
 * @param artwork - Données de l'œuvre depuis Sanity
 * @param siteUrl - URL de base du site (ex: https://peintreshop.com)
 * @returns Product Schema.org JSON-LD
 */
export function generateProductSchema(
  artwork: Artwork,
  siteUrl: string
): ProductSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: artwork.title,
    description: artwork.description,
    image: artwork.imageUrl,
    offers: {
      "@type": "Offer",
      price: artwork.price.toString(),
      priceCurrency: "EUR",
      availability: artwork.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/oeuvres/${artwork.slug}`,
    },
    brand: {
      "@type": "Organization",
      name: "MNGH",
    },
  };
}

/**
 * Génère un Organization Schema pour l'artiste
 *
 * @param siteUrl - URL de base du site
 * @returns Organization Schema.org JSON-LD
 */
export function generateOrganizationSchema(
  siteUrl: string
): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MNGH - Artiste Peintre",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
    },
  };
}

/**
 * Génère un WebSite Schema avec SearchAction
 *
 * Permet d'activer la sitelinks searchbox dans Google
 *
 * @param siteUrl - URL de base du site
 * @returns WebSite Schema.org JSON-LD
 */
export function generateWebSiteSchema(siteUrl: string): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MNGH - Artiste Peintre",
    url: siteUrl,
    description:
      "Découvrez des œuvres d'art originales et uniques créées avec passion",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/galerie?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Génère un BreadcrumbList Schema pour la navigation
 *
 * @param items - Liste des éléments du breadcrumb (ordre du plus général au plus spécifique)
 * @returns BreadcrumbList Schema.org JSON-LD
 *
 * @example
 * ```ts
 * const breadcrumbs = generateBreadcrumbSchema([
 *   { name: 'Accueil', item: 'https://site.com' },
 *   { name: 'Galerie', item: 'https://site.com/galerie' },
 *   { name: 'Œuvre', item: 'https://site.com/oeuvres/mon-oeuvre' }
 * ]);
 * ```
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}
