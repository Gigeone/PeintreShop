import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArtworkBySlug, getAllArtworks } from "@/lib/sanity";
import { BuyButton } from "@/components/BuyButton";
import type { Metadata } from "next";

interface ArtworkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArtworkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return {
      title: "Œuvre non trouvée - MNGH",
    };
  }

  return {
    title: `${artwork.title} - MNGH`,
    description: artwork.description.slice(0, 160),
    openGraph: {
      title: artwork.title,
      description: artwork.description,
      images: [{ url: artwork.imageUrl }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: artwork.title,
      description: artwork.description,
      images: [artwork.imageUrl],
    },
  };
}

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  // Navigation circulaire
  const allArtworks = await getAllArtworks();
  const currentIndex = allArtworks.findIndex((a: any) => a.slug === slug);
  const prevIndex = (currentIndex - 1 + allArtworks.length) % allArtworks.length;
  const nextIndex = (currentIndex + 1) % allArtworks.length;
  const prevArtwork = allArtworks[prevIndex];
  const nextArtwork = allArtworks[nextIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue-bg to-pastel-rose-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Bouton retour galerie */}
        <Link
          href="/galerie"
          className="inline-flex items-center text-pastel-lavender hover:text-pastel-rose-mauve transition-colors duration-300 mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour à la galerie
        </Link>

        {/* Layout responsive : 2 colonnes desktop, vertical mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Image de l'œuvre (60% desktop) */}
          <div className="lg:col-span-3">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm">
              <Image
                src={artwork.imageUrl}
                alt={artwork.imageAlt || artwork.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>

          {/* Informations de l'œuvre (40% desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badge disponibilité */}
            <div>
              {artwork.isAvailable ? (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                  Disponible
                </span>
              ) : (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-pastel-gray-text/20 text-pastel-gray-text rounded-full">
                  Vendu
                </span>
              )}
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-pastel-violet-logo">
              {artwork.title}
            </h1>

            {/* Technique */}
            <p className="text-lg text-pastel-lavender font-medium">
              {artwork.technique}
            </p>

            {/* Description */}
            <p className="text-lg text-pastel-gray-text leading-relaxed">
              {artwork.description}
            </p>

            {/* Dimensions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-sm font-semibold text-pastel-gray-text/60 mb-2">
                Dimensions
              </h3>
              <p className="text-lg text-pastel-gray-text">
                {artwork.dimensions.height} × {artwork.dimensions.width} cm
              </p>
            </div>

            {/* Prix */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-sm font-semibold text-pastel-gray-text/60 mb-2">
                Prix
              </h3>
              <p className="text-3xl font-bold text-pastel-lavender">
                {artwork.price.toLocaleString("fr-FR")} €
              </p>
            </div>

            {/* Bouton acheter */}
            <BuyButton
              artworkId={artwork._id}
              artworkTitle={artwork.title}
              isAvailable={artwork.isAvailable}
            />
          </div>
        </div>

        {/* Navigation précédent/suivant */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-pastel-lavender/20">
          <Link
            href={`/oeuvres/${prevArtwork.slug}`}
            className="flex items-center text-pastel-lavender hover:text-pastel-rose-mauve transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Œuvre précédente</span>
            <span className="sm:hidden">Précédent</span>
          </Link>

          <span className="text-pastel-gray-text/60 text-sm">
            {currentIndex + 1} / {allArtworks.length}
          </span>

          <Link
            href={`/oeuvres/${nextArtwork.slug}`}
            className="flex items-center text-pastel-lavender hover:text-pastel-rose-mauve transition-colors duration-300"
          >
            <span className="hidden sm:inline">Œuvre suivante</span>
            <span className="sm:hidden">Suivant</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
