/**
 * Point d'entrée pour tous les exports Sanity
 *
 * Facilite les imports dans le reste de l'application:
 * import { client, urlFor, getAllArtworks } from '@/lib/sanity'
 */

export { client, clientNoCache } from './client'
export { urlFor, getImageUrl, getLqipUrl } from './image'
export {
  getAllArtworks,
  getAvailableArtworks,
  getArtworkBySlug,
  getFeaturedArtworks,
  getSiteSettings,
  getArtworkCount,
  getAvailableArtworkCount,
  getArtworksByTechnique,
  getArtworksByPriceRange,
  getAllArtworkSlugs,
} from './queries'
