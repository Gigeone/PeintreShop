import { client } from './client'

/**
 * Queries GROQ prédéfinies pour récupérer les données depuis Sanity
 *
 * GROQ (Graph-Relational Object Queries) est le langage de query de Sanity.
 * Documentation: https://www.sanity.io/docs/groq
 */

/**
 * Projection des champs communs pour une œuvre
 * Utilisée dans toutes les queries artwork pour éviter la duplication
 */
const artworkProjection = `
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  description,
  "imageUrl": image.asset->url,
  "imageLqip": image.asset->metadata.lqip,
  "imageAlt": image.alt,
  price,
  dimensions,
  technique,
  isAvailable,
  isFeatured
`

/**
 * Récupère toutes les œuvres
 *
 * Trie par date de création (plus récentes en premier)
 * Inclut tous les champs nécessaires pour l'affichage
 */
export async function getAllArtworks() {
  const query = `*[_type == "artwork"] | order(_createdAt desc) {
    ${artworkProjection}
  }`

  return client.fetch(query)
}

/**
 * Récupère toutes les œuvres disponibles à la vente
 *
 * Filtre uniquement les œuvres avec isAvailable: true
 */
export async function getAvailableArtworks() {
  const query = `*[_type == "artwork" && isAvailable == true] | order(_createdAt desc) {
    ${artworkProjection}
  }`

  return client.fetch(query)
}

/**
 * Récupère une œuvre spécifique par son slug
 *
 * @param slug - Slug de l'œuvre (ex: "lever-de-soleil")
 * @returns Œuvre correspondante ou null si non trouvée
 */
export async function getArtworkBySlug(slug: string) {
  const query = `*[_type == "artwork" && slug.current == $slug][0] {
    ${artworkProjection}
  }`

  return client.fetch(query, { slug })
}

/**
 * Récupère les œuvres mises en vedette (featured)
 *
 * Limite à 5 œuvres maximum pour le carrousel de la page d'accueil
 * Trie par date de création (plus récentes en premier)
 */
export async function getFeaturedArtworks() {
  const query = `*[_type == "artwork" && isFeatured == true && isAvailable == true] | order(_createdAt desc)[0...5] {
    ${artworkProjection}
  }`

  return client.fetch(query)
}

/**
 * Récupère les paramètres globaux du site
 *
 * @returns Objet siteSettings (singleton)
 */
export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    contactEmail,
    instagramUrl,
    facebookUrl,
    "metaImageUrl": metaImage.asset->url,
    "faviconUrl": favicon.asset->url
  }`

  return client.fetch(query)
}

/**
 * Récupère le nombre total d'œuvres
 *
 * Utile pour afficher des statistiques sur la page d'accueil
 */
export async function getArtworkCount() {
  const query = `count(*[_type == "artwork"])`

  return client.fetch(query)
}

/**
 * Récupère le nombre d'œuvres disponibles
 */
export async function getAvailableArtworkCount() {
  const query = `count(*[_type == "artwork" && isAvailable == true])`

  return client.fetch(query)
}

/**
 * Recherche des œuvres par technique
 *
 * @param technique - Technique artistique (ex: "Huile sur toile")
 */
export async function getArtworksByTechnique(technique: string) {
  const query = `*[_type == "artwork" && technique == $technique] | order(_createdAt desc) {
    ${artworkProjection}
  }`

  return client.fetch(query, { technique })
}

/**
 * Recherche des œuvres dans une fourchette de prix
 *
 * @param minPrice - Prix minimum en euros
 * @param maxPrice - Prix maximum en euros
 */
export async function getArtworksByPriceRange(
  minPrice: number,
  maxPrice: number
) {
  const query = `*[_type == "artwork" && price >= $minPrice && price <= $maxPrice && isAvailable == true] | order(price asc) {
    ${artworkProjection}
  }`

  return client.fetch(query, { minPrice, maxPrice })
}

/**
 * Récupère les slugs de toutes les œuvres
 *
 * Utilisé pour la génération statique des pages artwork
 * (generateStaticParams dans Next.js App Router)
 */
export async function getAllArtworkSlugs() {
  const query = `*[_type == "artwork"].slug.current`

  return client.fetch(query)
}
