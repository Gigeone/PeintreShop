/**
 * Types pour SEO - Schema.org et métadonnées enrichies
 */

// ============================================
// Schema.org Types
// ============================================

/**
 * Schema.org Product
 * https://schema.org/Product
 */
export interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  image: string | string[];
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability: string; // https://schema.org/ItemAvailability
    url: string;
  };
  brand?: {
    "@type": "Brand" | "Organization";
    name: string;
  };
}

/**
 * Schema.org Organization
 * https://schema.org/Organization
 */
export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  contactPoint?: {
    "@type": "ContactPoint";
    email?: string;
    contactType?: string;
  };
  sameAs?: string[]; // Social media URLs
}

/**
 * Schema.org WebSite with SearchAction
 * https://schema.org/WebSite
 */
export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

/**
 * Schema.org BreadcrumbList
 * https://schema.org/BreadcrumbList
 */
export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

// ============================================
// Open Graph Types
// ============================================

export interface OpenGraphParams {
  title: string;
  description: string;
  url: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  type?: "website" | "article" | "product";
  siteName?: string;
  locale?: string;
}

// ============================================
// Twitter Card Types
// ============================================

export interface TwitterCardParams {
  card: "summary" | "summary_large_image" | "app" | "player";
  title: string;
  description: string;
  images?: string[];
  creator?: string;
  site?: string;
}

// ============================================
// Metadata Helper Types
// ============================================

export interface MetadataParams {
  title: string;
  description: string;
  path: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  type?: "website" | "article" | "product";
}
