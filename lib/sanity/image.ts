import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

/**
 * Helper pour générer des URLs d'images optimisées depuis Sanity Assets
 *
 * Utilisation:
 * ```ts
 * import { urlFor } from '@/lib/sanity/image'
 *
 * // Simple URL
 * const imageUrl = urlFor(artwork.image).url()
 *
 * // URL avec transformations
 * const optimizedUrl = urlFor(artwork.image)
 *   .width(800)
 *   .height(600)
 *   .quality(90)
 *   .auto('format') // WebP automatique si supporté
 *   .url()
 * ```
 */
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Génère une URL d'image optimisée avec paramètres par défaut
 *
 * @param source - Source de l'image Sanity
 * @param width - Largeur souhaitée (optionnel)
 * @param height - Hauteur souhaitée (optionnel)
 * @returns URL de l'image optimisée
 */
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number
): string {
  let imageBuilder = urlFor(source).auto('format').fit('max').quality(90)

  if (width) {
    imageBuilder = imageBuilder.width(width)
  }

  if (height) {
    imageBuilder = imageBuilder.height(height)
  }

  return imageBuilder.url()
}

/**
 * Génère un Low Quality Image Placeholder (LQIP) pour le chargement progressif
 *
 * @param source - Source de l'image Sanity
 * @returns URL d'un placeholder très petit
 */
export function getLqipUrl(source: SanityImageSource): string {
  return urlFor(source).width(20).quality(20).blur(10).url()
}
