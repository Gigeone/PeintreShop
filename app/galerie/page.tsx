import Image from "next/image";
import { artworks } from "@/data/artworks";

export default function GaleriePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue-bg to-pastel-rose-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-pastel-lavender mb-6">
          Galerie d'Œuvres
        </h1>
        <p className="text-xl text-pastel-gray-text mb-12 max-w-3xl">
          Explorez notre collection d'œuvres originales. Chaque pièce est unique et disponible à l'achat.
        </p>

        {/* Grid des œuvres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image optimisée */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Informations de l'œuvre */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-pastel-gray-text">
                    {artwork.title}
                  </h3>
                  {!artwork.isAvailable && (
                    <span className="px-2 py-1 text-xs font-medium bg-pastel-gray-text/20 text-pastel-gray-text rounded">
                      Vendu
                    </span>
                  )}
                </div>

                <p className="text-sm text-pastel-lavender mb-2">
                  {artwork.technique}
                </p>

                <p className="text-pastel-gray-text/70 mb-4 line-clamp-2">
                  {artwork.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pastel-lavender">
                    {artwork.price.toLocaleString("fr-FR")} €
                  </span>
                  <span className="text-sm text-pastel-gray-text/60">
                    {artwork.dimensions.height} × {artwork.dimensions.width} cm
                  </span>
                </div>

                <button className="w-full py-2 bg-pastel-rose-mauve text-white rounded-lg font-medium hover:bg-pastel-lavender transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
