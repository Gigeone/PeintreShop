/**
 * Type définissant la structure d'une œuvre d'art
 *
 * Cette interface sera utilisée pour les données mockées (MVP)
 * et sera régénérée automatiquement par Sanity CLI en V1
 */
export interface Artwork {
  /** Identifiant unique de l'œuvre */
  id: string;

  /** Slug URL-friendly pour la route dynamique (ex: "paysage-automnal") */
  slug: string;

  /** Titre de l'œuvre */
  title: string;

  /** Description détaillée de l'œuvre (2-3 phrases minimum) */
  description: string;

  /** Prix en euros (nombre entier) */
  price: number;

  /** Dimensions de l'œuvre en centimètres */
  dimensions: {
    /** Hauteur en cm */
    height: number;
    /** Largeur en cm */
    width: number;
  };

  /** Technique artistique (ex: "Huile sur toile", "Acrylique", "Aquarelle") */
  technique: string;

  /** Indique si l'œuvre est disponible à la vente */
  isAvailable: boolean;

  /** Indique si l'œuvre est mise en vedette sur la page d'accueil */
  isFeatured: boolean;

  /**
   * URL de l'image ou gradient CSS
   * MVP: URLs Unsplash ou Cloudinary
   * V1: URL Sanity Asset (ex: "https://cdn.sanity.io/...")
   */
  imageUrl: string;
}
