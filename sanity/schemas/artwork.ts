import { defineField, defineType } from 'sanity'

/**
 * Schéma Sanity pour une œuvre d'art
 *
 * Représente une œuvre unique créée par l'artiste, avec tous les détails nécessaires
 * pour l'affichage sur le site e-commerce et la gestion via Sanity Studio.
 */
export default defineType({
  name: 'artwork',
  title: 'Œuvre',
  type: 'document',
  icon: () => '🎨',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required().error('Le titre est requis'),
      description: 'Titre de l\'œuvre (ex: "Lever de Soleil Méditerranéen")',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9]+/g, '-') // Remplacer les espaces par des tirets
            .replace(/^-+|-+$/g, ''), // Supprimer les tirets en début/fin
      },
      validation: (Rule) => Rule.required().error('Le slug est requis'),
      description: 'URL de l\'œuvre (généré automatiquement depuis le titre)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) =>
        Rule.required()
          .min(50)
          .error('La description doit contenir au moins 50 caractères'),
      description: 'Description détaillée de l\'œuvre (visible sur la page produit)',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Permet de définir un point focal pour le crop
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: 'Description de l\'image pour l\'accessibilité et le SEO',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required().error('L\'image est requise'),
      description: 'Photo haute qualité de l\'œuvre',
    }),
    defineField({
      name: 'price',
      title: 'Prix (€)',
      type: 'number',
      validation: (Rule) =>
        Rule.required().min(0).error('Le prix doit être supérieur ou égal à 0'),
      description: 'Prix de vente en euros',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        defineField({
          name: 'height',
          title: 'Hauteur (cm)',
          type: 'number',
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'width',
          title: 'Largeur (cm)',
          type: 'number',
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
      validation: (Rule) => Rule.required(),
      description: 'Dimensions de l\'œuvre en centimètres',
    }),
    defineField({
      name: 'technique',
      title: 'Technique',
      type: 'string',
      options: {
        list: [
          { title: 'Huile sur toile', value: 'Huile sur toile' },
          { title: 'Acrylique sur toile', value: 'Acrylique sur toile' },
          { title: 'Aquarelle', value: 'Aquarelle' },
          { title: 'Gouache', value: 'Gouache' },
          { title: 'Pastel', value: 'Pastel' },
          { title: 'Technique mixte', value: 'Technique mixte' },
        ],
      },
      validation: (Rule) => Rule.required().error('La technique est requise'),
      description: 'Technique artistique utilisée',
    }),
    defineField({
      name: 'isAvailable',
      title: 'Disponible à la vente',
      type: 'boolean',
      initialValue: true,
      description: 'Indique si l\'œuvre est disponible à l\'achat',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Mise en vedette',
      type: 'boolean',
      initialValue: false,
      description: 'Afficher cette œuvre sur la page d\'accueil (carrousel)',
    }),
    defineField({
      name: 'createdAt',
      title: 'Date de création',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
      },
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      price: 'price',
      isAvailable: 'isAvailable',
    },
    prepare(selection) {
      const { title, media, price, isAvailable } = selection
      const subtitle = `${price}€ ${isAvailable ? '✓ Disponible' : '✗ Vendue'}`
      return {
        title,
        media,
        subtitle,
      }
    },
  },
  orderings: [
    {
      title: 'Date de création (récent en premier)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Prix (croissant)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Prix (décroissant)',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
  ],
})
