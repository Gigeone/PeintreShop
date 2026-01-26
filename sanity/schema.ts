import { type SchemaTypeDefinition } from 'sanity'
import artwork from './schemas/artwork'
import siteSettings from './schemas/siteSettings'

/**
 * Point d'entrée pour tous les schémas Sanity
 *
 * Ce fichier exporte un tableau contenant tous les schémas utilisés dans le projet.
 * Chaque schéma définit la structure d'un type de contenu dans Sanity Studio.
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Schéma des œuvres d'art
    artwork,

    // Paramètres globaux du site (singleton)
    siteSettings,
  ],
}
