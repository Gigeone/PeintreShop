import FeaturedCarousel from "@/components/FeaturedCarousel";
import { getAvailableArtworkCount, getFeaturedArtworks } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/seo/metadata";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo/schema";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const featuredArtworks = await getFeaturedArtworks();
  const artworkCount = await getAvailableArtworkCount();
  const siteUrl = getSiteUrl();

  // Générer les schemas JSON-LD
  const websiteSchema = generateWebSiteSchema(siteUrl);
  const organizationSchema = generateOrganizationSchema(siteUrl);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-atelier.png"
              alt="Palette de peinture colorée"
              fill
              className="object-cover brightness-110"
              priority
            />
            {/* Overlay gradient subtil pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
          </div>

          {/* Contenu */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-pastel-lavender mb-6 drop-shadow-2xl">
                Bienvenue dans la galerie de MNGH
              </h1>
              <p className="text-xl text-pastel-gray-text bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg mb-8 max-w-2xl mx-auto shadow-xl">
                Découvrez des œuvres d'art originales et uniques créées avec
                passion. Chaque pièce raconte une histoire.
              </p>
              <div className="flex gap-5 justify-center flex-wrap">
                <Link
                  href="/galerie"
                  className="px-9 py-4 text-lg md:text-xl bg-pastel-rose-mauve text-white rounded-lg font-bold hover:bg-pastel-lavender hover:scale-[1.02] transition-all duration-300 shadow-xl"
                >
                  Voir la Galerie
                </Link>
                <Link
                  href="/a-propos"
                  className="px-9 py-4 text-lg md:text-xl border-2 border-white bg-white/25 backdrop-blur-sm text-white rounded-lg font-bold hover:bg-white hover:text-pastel-lavender hover:scale-[1.02] transition-all duration-300 shadow-xl"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carrousel des œuvres en vedette */}
        <FeaturedCarousel artworks={featuredArtworks} />

        {/* Section À propos */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-4xl font-bold text-pastel-lavender mb-6">
                  L'Art au Cœur de la Création
                </h2>
                <p className="text-lg text-pastel-gray-text mb-4">
                  Chaque œuvre est unique, créée à la main avec passion et
                  attention aux détails. De l'inspiration initiale à la touche
                  finale, chaque pièce raconte une histoire personnelle.
                </p>
                <p className="text-lg text-pastel-gray-text mb-6">
                  Explorez la collection et trouvez l'œuvre qui résonnera avec
                  vous.
                </p>
                <Link
                  href="/a-propos"
                  className="inline-flex items-center gap-2 text-pastel-lavender hover:text-pastel-rose-mauve transition-colors font-medium"
                >
                  Découvrir l'artiste
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-pastel-blue-bg to-pastel-rose-bg rounded-2xl p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pastel-lavender rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {artworkCount}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-pastel-gray-text">
                        Œuvres disponibles
                      </p>
                      <p className="text-sm text-pastel-gray-text/70">
                        Toutes uniques et originales
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pastel-rose-mauve rounded-full flex items-center justify-center text-white font-bold text-xl">
                      ✓
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-pastel-gray-text">
                        Livraison sécurisée
                      </p>
                      <p className="text-sm text-pastel-gray-text/70">
                        Emballage soigné garanti
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pastel-blue-logo rounded-full flex items-center justify-center text-white font-bold text-xl">
                      ★
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-pastel-gray-text">
                        Certificat d'authenticité
                      </p>
                      <p className="text-sm text-pastel-gray-text/70">
                        Avec chaque œuvre
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
