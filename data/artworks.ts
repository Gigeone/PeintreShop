import { Artwork } from "@/types/artwork";

/**
 * Données mockées pour la galerie MVP
 *
 * IMPORTANT: Ces données sont temporaires et seront remplacées par des queries
 * Sanity CMS en V1. La structure est conçue pour mapper directement vers le
 * schéma Sanity prévu.
 *
 * Nombre d'œuvres: 9 (grille 3×3 responsive)
 * Prix: 150€ - 800€ (variation selon taille et technique)
 * Disponibilité: 7 disponibles, 2 vendues (pour tester le statut)
 * Featured: 5 œuvres mises en vedette pour le carrousel d'accueil
 * Images: URLs Unsplash (art abstrait et paysages)
 */
export const artworks: Artwork[] = [
  {
    id: "1",
    slug: "lever-de-soleil-mediterraneen",
    title: "Lever de Soleil Méditerranéen",
    description:
      "Une explosion de couleurs chaudes capturant les premières lueurs du jour sur la mer. Les teintes dorées et orangées se mêlent au bleu profond de l'océan, créant une atmosphère apaisante et contemplative.",
    price: 650,
    dimensions: {
      height: 80,
      width: 100,
    },
    technique: "Huile sur toile",
    isAvailable: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=1200&fit=crop",
  },
  {
    id: "2",
    slug: "jardin-secret",
    title: "Jardin Secret",
    description:
      "Un coin de nature luxuriante et mystérieux, où les fleurs sauvages dansent sous une lumière douce. Cette œuvre invite à la rêverie et à l'évasion dans un monde végétal enchanteur.",
    price: 480,
    dimensions: {
      height: 60,
      width: 80,
    },
    technique: "Acrylique sur toile",
    isAvailable: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=1200&h=1200&fit=crop",
  },
  {
    id: "3",
    slug: "reflets-d-automne",
    title: "Reflets d'Automne",
    description:
      "Les couleurs flamboyantes de l'automne se reflètent dans l'eau calme d'un étang. Une composition équilibrée qui capture la beauté éphémère de cette saison de transition.",
    price: 420,
    dimensions: {
      height: 50,
      width: 70,
    },
    technique: "Acrylique sur toile",
    isAvailable: false, // Vendue
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=1200&h=1200&fit=crop",
  },
  {
    id: "4",
    slug: "nuit-etoilee-provencale",
    title: "Nuit Étoilée Provençale",
    description:
      "Le ciel nocturne de Provence s'illumine de mille étoiles au-dessus des champs de lavande endormis. Une ode à la beauté du Sud de la France et à la magie des nuits d'été.",
    price: 780,
    dimensions: {
      height: 90,
      width: 120,
    },
    technique: "Huile sur toile",
    isAvailable: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1200&h=1200&fit=crop",
  },
  {
    id: "5",
    slug: "danse-des-vagues",
    title: "Danse des Vagues",
    description:
      "Le mouvement perpétuel de l'océan capturé dans une composition dynamique et fluide. Les teintes de bleu et de blanc s'entremêlent pour créer une sensation de mouvement et de liberté.",
    price: 550,
    dimensions: {
      height: 70,
      width: 90,
    },
    technique: "Huile sur toile",
    isAvailable: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=1200&fit=crop",
  },
  {
    id: "6",
    slug: "sentier-forestier",
    title: "Sentier Forestier",
    description:
      "Un chemin sinueux s'enfonce dans une forêt lumineuse où les rayons du soleil filtrent à travers le feuillage. Une invitation à la promenade et à la découverte de la nature.",
    price: 380,
    dimensions: {
      height: 60,
      width: 50,
    },
    technique: "Acrylique sur toile",
    isAvailable: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=1200&fit=crop",
  },
  {
    id: "7",
    slug: "brume-matinale",
    title: "Brume Matinale",
    description:
      "La douceur d'un matin brumeux où les contours se fondent dans une atmosphère laiteuse et mystérieuse. Une œuvre contemplative qui évoque le calme et la sérénité.",
    price: 320,
    dimensions: {
      height: 40,
      width: 60,
    },
    technique: "Aquarelle sur papier",
    isAvailable: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1200&h=1200&fit=crop",
  },
  {
    id: "8",
    slug: "coucher-de-soleil-urbain",
    title: "Coucher de Soleil Urbain",
    description:
      "Les silhouettes architecturales se découpent sur un ciel embrasé par le soleil couchant. Une vision poétique de la ville moderne où nature et urbanisme cohabitent.",
    price: 590,
    dimensions: {
      height: 70,
      width: 100,
    },
    technique: "Huile sur toile",
    isAvailable: false, // Vendue
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1200&fit=crop",
  },
  {
    id: "9",
    slug: "prairie-en-fleurs",
    title: "Prairie en Fleurs",
    description:
      "Un champ de fleurs sauvages s'étend à perte de vue sous un ciel d'azur. Les couleurs vives et la composition aérienne transmettent une sensation de joie et de légèreté.",
    price: 450,
    dimensions: {
      height: 60,
      width: 80,
    },
    technique: "Acrylique sur toile",
    isAvailable: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=1200&fit=crop",
  },
];
