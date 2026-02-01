/**
 * Type définissant la structure d'une œuvre d'art renvoyée par Sanity
 *
 * Correspond à la projection GROQ définie dans lib/sanity/queries.ts
 */
export interface SanityArtwork {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageLqip?: string;
  imageAlt?: string;
  price: number;
  dimensions: {
    height: number;
    width: number;
  };
  technique: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

/**
 * Type pour les données mockées (MVP)
 * @deprecated Utiliser SanityArtwork pour les données Sanity
 */
export interface Artwork {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  dimensions: {
    height: number;
    width: number;
  };
  technique: string;
  isAvailable: boolean;
  isFeatured: boolean;
  imageUrl: string;
}
