import { defineField, defineType } from 'sanity'

/**
 * Schéma Sanity pour les paramètres globaux du site (singleton)
 *
 * Ce schéma est un singleton, ce qui signifie qu'un seul document peut exister.
 * Il contient les informations globales du site comme le titre, la description,
 * les coordonnées de contact et les liens réseaux sociaux.
 */
export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du Site',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du site',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Nom du site (utilisé dans le SEO et les metadata)',
      initialValue: 'MNGH - Artiste Peintre',
    }),
    defineField({
      name: 'description',
      title: 'Description du site',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.required().min(50).max(160).warning('Idéalement entre 50 et 160 caractères pour le SEO'),
      description: 'Description du site pour le SEO (meta description)',
      initialValue:
        'Découvrez les œuvres originales de MNGH, artiste peintre autodidacte. Créations uniques en acrylique et aquarelle.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contact',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .email()
          .error('Veuillez entrer une adresse email valide'),
      description: 'Email pour les demandes de contact',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'URL Instagram',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
      description: 'Lien vers le profil Instagram',
      placeholder: 'https://instagram.com/votre_compte',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'URL Facebook',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
      description: 'Lien vers la page Facebook (optionnel)',
      placeholder: 'https://facebook.com/votre_page',
    }),
    defineField({
      name: 'metaImage',
      title: 'Image par défaut (Open Graph)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description:
        'Image utilisée quand le site est partagé sur les réseaux sociaux (1200x630px recommandé)',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Icône affichée dans l\'onglet du navigateur (32x32px ou 64x64px)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Paramètres du Site',
        subtitle: selection.subtitle,
      }
    },
  },
})
