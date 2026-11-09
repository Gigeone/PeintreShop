import { notFound } from "next/navigation";
import Link from "next/link";
import { getArtworkBySlug, getAllArtworks } from "@/lib/sanity";
import { BuyButton } from "@/components/BuyButton";
import { ArtworkDisplay } from "@/components/ArtworkDisplay";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import { formatDimensions, formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/seo/metadata";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo/schema";

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

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/oeuvres/${artwork.slug}`;

  return {
    title: artwork.title,
    description: artwork.description.slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: artwork.title,
      description: artwork.description,
      images: [{
        url: artwork.imageUrl,
        width: 1200,
        height: 1200,
        alt: artwork.imageAlt || artwork.title,
      }],
      type: "website",
      url: canonicalUrl,
      siteName: "MNGH - Artiste Peintre",
      locale: "fr_FR",
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

  // Suggestions : les œuvres disponibles qui suivent celle-ci (ordre circulaire)
  const allArtworks = await getAllArtworks();
  const currentIndex = allArtworks.findIndex((a) => a.slug === slug);
  const relatedArtworks = [
    ...allArtworks.slice(currentIndex + 1),
    ...allArtworks.slice(0, currentIndex),
  ]
    .filter((a) => a.isAvailable)
    .slice(0, 3);

  const siteUrl = getSiteUrl();

  // Schema.org Product
  const productSchema = generateProductSchema(artwork, siteUrl);

  // Schema.org Breadcrumb
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", item: siteUrl },
    { name: "Galerie", item: `${siteUrl}/galerie` },
    { name: artwork.title, item: `${siteUrl}/oeuvres/${artwork.slug}` },
  ]);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="Fil d'Ariane" className="mx-auto max-w-7xl px-6 py-6 text-sm text-muted sm:px-8 md:py-8">
        <ol className="flex gap-2.5">
          <li>
            <Link href="/galerie" className="transition-colors hover:text-accent">
              Galerie
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {artwork.title}
          </li>
        </ol>
      </nav>

      <section className="mx-auto grid max-w-7xl items-start gap-10 px-6 pb-16 sm:px-8 md:pb-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <ArtworkDisplay
            src={artwork.imageUrl}
            alt={artwork.imageAlt || artwork.title}
            width={artwork.imageWidth}
            height={artwork.imageHeight}
            blurDataURL={artwork.imageLqip}
          />
        </div>

        <div className="flex flex-col gap-7 lg:sticky lg:top-[120px] lg:col-span-4 lg:col-start-9">
          <p className="flex items-center gap-2.5 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${artwork.isAvailable ? "bg-success" : "bg-muted"}`}
              aria-hidden="true"
            />
            {artwork.isAvailable ? "Disponible · pièce unique" : "Vendue"}
          </p>

          <h1 className="font-serif text-4xl font-normal leading-[1.05] tracking-[-0.02em] md:text-[56px]">
            {artwork.title}
          </h1>

          {artwork.isAvailable && (
            <p className="text-[32px] font-medium">{formatPrice(artwork.price)}</p>
          )}

          <div className="flex flex-col gap-3">
            <BuyButton
              artworkId={artwork._id}
              artworkTitle={artwork.title}
              isAvailable={artwork.isAvailable}
            />
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/contact">Poser une question</Link>
            </Button>
          </div>

          <p className="leading-relaxed text-body">{artwork.description}</p>

          <dl className="grid grid-cols-2 border-t border-line">
            {[
              ["Dimensions", formatDimensions(artwork.dimensions)],
              ["Technique", artwork.technique],
              ["Signature", "Signée au recto"],
              ["Livraison", "Emballage soigné, envoi suivi"],
            ].map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="border-b border-line py-3.5 text-sm text-muted">{term}</dt>
                <dd className="border-b border-line py-3.5 text-[15px]">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="flex items-start gap-3.5 text-sm leading-normal text-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0 text-accent">
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            Paiement sécurisé par carte via Stripe. Certificat d&apos;authenticité joint au colis.
          </p>
        </div>
      </section>

      {relatedArtworks.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 sm:px-8 md:gap-12 md:py-24">
            <h2 className="font-serif text-3xl font-normal md:text-[40px]">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-12">
              {relatedArtworks.map((related) => (
                <ArtworkCard
                  key={related._id}
                  artwork={related}
                  variant="hanging"
                  showTechnique={false}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
