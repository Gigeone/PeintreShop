import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getAllArtworks } from "@/lib/sanity";
import { generatePageMetadata, getSiteUrl } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

// Rafraîchit les œuvres (ventes, ajouts dans Sanity) au plus toutes les 60 s
export const revalidate = 60;

export const metadata: Metadata = generatePageMetadata({
  title: "Galerie d'Œuvres",
  description: "Explorez notre collection d'œuvres d'art originales et uniques. Chaque pièce est créée avec passion et disponible à l'achat.",
  path: "/galerie",
  images: [{
    url: `${getSiteUrl()}/og-galerie.jpg`,
    width: 1200,
    height: 630,
    alt: "Galerie d'œuvres MNGH",
  }],
});

export default async function GaleriePage() {
  const artworks = await getAllArtworks();
  const siteUrl = getSiteUrl();

  // Schema.org Breadcrumb
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", item: siteUrl },
    { name: "Galerie", item: `${siteUrl}/galerie` },
  ]);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-12 sm:px-8 md:pb-28 md:pt-20">
        <header className="mb-8 flex flex-col gap-4 md:mb-10">
          <h1 className="font-serif text-5xl font-normal tracking-[-0.02em] md:text-[64px]">
            Galerie
          </h1>
          <p className="max-w-[560px] text-base leading-relaxed text-body md:text-lg">
            Toutes les toiles sont des originaux, peints à l&apos;acrylique et
            signés. Une œuvre vendue disparaît de la vente.
          </p>
        </header>

        <GalleryGrid artworks={artworks} />
      </div>
    </>
  );
}
