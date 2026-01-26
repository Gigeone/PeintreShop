import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './schema'

/**
 * Configuration Sanity Studio
 *
 * Cette configuration définit le comportement du Sanity Studio embedded
 * dans Next.js via la route /studio
 */
export default defineConfig({
  name: 'default',
  title: 'MNGH - Peinture',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  // Dossier de base pour le Studio (utilisé pour les assets)
  basePath: '/studio',

  // Plugins Sanity
  plugins: [
    // Structure Tool - Interface principale du Studio
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            // Œuvres d'art
            S.listItem()
              .title('Œuvres')
              .icon(() => '🎨')
              .child(
                S.documentTypeList('artwork')
                  .title('Toutes les œuvres')
                  .filter('_type == "artwork"')
              ),

            // Paramètres du site (singleton)
            S.listItem()
              .title('Paramètres du Site')
              .icon(() => '⚙️')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Paramètres du Site')
              ),
          ]),
    }),

    // Vision Tool - Playground pour tester les queries GROQ
    visionTool(),
  ],

  // Schémas de contenu
  schema,

  // Configuration des documents
  document: {
    // Actions disponibles pour chaque type de document
    actions: (prev, context) => {
      // Pour siteSettings (singleton), désactiver la duplication et la suppression
      if (context.schemaType === 'siteSettings') {
        return prev.filter(
          (action) => action.action !== 'duplicate' && action.action !== 'delete'
        )
      }
      return prev
    },
  },
})
