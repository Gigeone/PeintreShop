import { createClient } from '@sanity/client'

/**
 * Client Sanity configuré pour les queries depuis Next.js
 *
 * Ce client est utilisé pour récupérer les données depuis Sanity CMS
 * dans les Server Components et API Routes Next.js.
 *
 * Configuration:
 * - useCdn: true pour de meilleures performances (données servies depuis le CDN)
 * - apiVersion: '2024-01-01' pour la version de l'API Sanity
 */
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // `false` pour données en temps réel, `true` pour performance

  // Token API pour les mutations (create, update, delete)
  // Non nécessaire pour les queries en lecture seule
  token: process.env.SANITY_API_TOKEN,
})

/**
 * Client Sanity avec CDN désactivé (temps réel)
 *
 * Utilisé quand on a besoin de données très récentes,
 * par exemple après une création/modification dans le Studio
 */
export const clientNoCache = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Désactiver le CDN pour avoir les données les plus récentes
  token: process.env.SANITY_API_TOKEN,
})
