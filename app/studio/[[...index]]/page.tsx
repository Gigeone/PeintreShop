/**
 * Route Sanity Studio - /studio
 *
 * Cette page monte le Sanity Studio embedded dans Next.js
 * permettant de gérer le contenu directement depuis le site.
 */

'use client'

import { NextStudio } from 'next-sanity/studio'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from '../../../sanity/schema'

// Configuration inline pour éviter les problèmes d'import
const config = defineConfig({
  name: 'default',
  title: 'MNGH - Peinture',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Œuvres')
              .icon(() => '🎨')
              .child(
                S.documentTypeList('artwork')
                  .title('Toutes les œuvres')
                  .filter('_type == "artwork"')
              ),
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
    visionTool(),
  ],

  schema,

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'siteSettings') {
        return prev.filter(
          (action) => action.action !== 'duplicate' && action.action !== 'delete'
        )
      }
      return prev
    },
  },
})

export default function StudioPage() {
  return <NextStudio config={config} />
}
