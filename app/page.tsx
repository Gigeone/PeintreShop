import { ArtworkCard } from "@/components/ArtworkCard";
import { getAvailableArtworks, getFeaturedArtworks } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/seo/metadata";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo/schema";
import { formatDimensions, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Rafraîchit les œuvres (ventes, ajouts dans Sanity) au plus toutes les 60 s
export const revalidate = 60;

const REASSURANCES = [
  {
    title: "Pièce unique signée",
    text: "Livrée avec son certificat d'authenticité.",
    icon: <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17.9l.9-5.4L4.2 8.7l5.4-.8z" />,
  },
  {
    title: "Emballage soigné",
    text: "Protégée et expédiée en envoi suivi.",
    icon: (
      <>
        <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z" />
        <path d="M3 7.5l9 4.5 9-4.5M12 12v9" />
      </>
    ),
  },
  {
    title: "Paiement sécurisé",
    text: "Carte bancaire via Stripe.",
    icon: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
];

export default async function HomePage() {
  const [featuredArtworks, availableArtworks] = await Promise.all([
    getFeaturedArtworks(),
    getAvailableArtworks(),
  ]);
  const siteUrl = getSiteUrl();

  // La première œuvre en vedette fait le hero, les suivantes la sélection
  const heroArtwork = featuredArtworks[0] ?? availableArtworks[0];
  const selection = featuredArtworks.slice(1);
  // Le bandeau de contact montre un détail d'une autre toile que celle du hero
  const ctaArtwork = selection.at(-1) ?? heroArtwork;
  const lowestPrice = availableArtworks.length
    ? Math.min(...availableArtworks.map((artwork) => artwork.price))
    : null;

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

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-10 sm:px-8 md:pb-24 md:pt-16 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-7">
          <p className="eyebrow">Peintures originales · pièces uniques</p>
          <h1 className="font-serif text-[42px] font-normal leading-[1.04] tracking-[-0.02em] sm:text-6xl lg:text-[72px]">
            La lumière de la mer, <em className="text-accent">la chaleur</em> des ocres.
          </h1>
          <p className="max-w-[460px] text-base leading-relaxed text-body sm:text-lg">
            Des paysages, des figures en mouvement et des scènes rêvées, peints
            à l&apos;acrylique sur toile. Chaque tableau est signé et n&apos;existe
            qu&apos;en un seul exemplaire.
          </p>
          <div className="mt-1 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
            <Link
              href="/galerie"
              className="flex h-14 items-center justify-center rounded-full bg-ink px-8 font-medium text-paper transition-colors hover:bg-accent"
            >
              Découvrir la galerie
            </Link>
            <Link href="/a-propos" className="link-underline self-start sm:self-auto">
              Rencontrer l&apos;artiste
            </Link>
          </div>
          {availableArtworks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6 text-sm text-muted">
              <span>
                <strong className="font-semibold text-ink">{availableArtworks.length}</strong>{" "}
                {availableArtworks.length > 1 ? "toiles disponibles" : "toile disponible"}
              </span>
              {lowestPrice !== null && (
                <span>
                  À partir de <strong className="font-semibold text-ink">{formatPrice(lowestPrice)}</strong>
                </span>
              )}
              <span>Envoi soigné &amp; suivi</span>
            </div>
          )}
        </div>

        {heroArtwork && (
          <figure className="flex flex-col gap-4 lg:col-span-6 lg:col-start-7 lg:items-end">
            <Link
              href={`/oeuvres/${heroArtwork.slug}`}
              className="max-w-full bg-surface p-3.5 shadow-painting-lg sm:p-7"
            >
              <Image
                src={heroArtwork.imageUrl}
                alt={heroArtwork.imageAlt || heroArtwork.title}
                width={heroArtwork.imageWidth ?? 1200}
                height={heroArtwork.imageHeight ?? 1000}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-auto max-h-[560px] w-auto max-w-full"
              />
            </Link>
            <figcaption className="text-sm text-muted">
              <span className="font-serif text-base italic text-ink">{heroArtwork.title}</span>
              {" "}— {heroArtwork.technique.toLowerCase()}, {formatDimensions(heroArtwork.dimensions)} · {formatPrice(heroArtwork.price)}
            </figcaption>
          </figure>
        )}
      </section>

      {/* Sélection */}
      {selection.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 sm:px-8 md:gap-16 md:py-28">
            <div className="flex items-end justify-between gap-6">
              <div className="flex flex-col gap-3">
                <p className="eyebrow">Sélection</p>
                <h2 className="font-serif text-[28px] font-normal tracking-[-0.015em] md:text-[52px]">
                  Œuvres à la une
                </h2>
              </div>
              <Link
                href="/galerie"
                className="flex items-center gap-2.5 whitespace-nowrap font-medium transition-colors hover:text-accent"
              >
                <span className="hidden sm:inline">Toute la galerie</span>
                <span className="sm:hidden">Tout voir</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-12 md:gap-y-[72px]">
              {selection.map((artwork) => (
                <ArtworkCard
                  key={artwork._id}
                  artwork={artwork}
                  variant="hanging"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* L'artiste */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="relative aspect-[4/5] w-full max-w-[260px] sm:max-w-[340px] lg:col-span-4 lg:col-start-2 lg:max-w-none">
          <Image
            src="/images/artist-photo.jpg"
            alt="Portrait de l'artiste MNGH"
            fill
            sizes="(max-width: 1024px) 340px, 30vw"
            className="object-cover object-[50%_20%]"
          />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7 lg:gap-8">
          <p className="eyebrow">L&apos;artiste</p>
          <blockquote className="font-serif text-[28px] font-light italic leading-[1.18] tracking-[-0.01em] md:text-[44px]">
            « Chaque toile est le reflet d&apos;une émotion, d&apos;un instant capturé ou d&apos;un rêve éveillé. »
          </blockquote>
          <p className="max-w-[540px] text-base leading-relaxed text-body md:text-lg">
            Artiste peintre autodidacte, je me consacre à la création d&apos;œuvres
            originales depuis plus de 15 ans. Bords de mer, pinèdes, musiciens et
            danses imaginaires : je peins ce qui me met en mouvement.
          </p>
          <Link href="/a-propos" className="link-underline self-start">
            Lire son parcours
          </Link>
        </div>
      </section>

      {/* Réassurance */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8">
        <ul className="grid gap-6 border-y border-line py-8 md:grid-cols-3 md:gap-12 md:py-12">
          {REASSURANCES.map((item) => (
            <li key={item.title} className="flex items-start gap-4 md:gap-5">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0 text-accent">
                {item.icon}
              </svg>
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold md:text-[17px]">{item.title}</span>
                <span className="text-sm leading-normal text-muted md:text-[15px]">{item.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Appel au contact */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-16">
        <div className="grid overflow-hidden bg-wall md:grid-cols-12">
          {ctaArtwork && (
            <figure className="relative h-56 sm:h-72 md:col-span-5 md:h-auto md:min-h-[360px]">
              <Image
                src={ctaArtwork.imageUrl}
                alt={`Détail de la toile ${ctaArtwork.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <figcaption className="absolute bottom-3 left-3 bg-surface/90 px-3 py-1.5 text-xs text-muted">
                Détail — <span className="font-serif italic text-ink">{ctaArtwork.title}</span>
              </figcaption>
            </figure>
          )}
          <div className="flex flex-col justify-center gap-5 px-7 py-10 md:col-span-7 md:px-14 md:py-16">
            <p className="eyebrow">Un coup de cœur, une question ?</p>
            <h2 className="font-serif text-3xl font-normal tracking-[-0.01em] md:text-[44px]">
              Une toile <em className="text-accent">vous parle</em> ?
            </h2>
            <p className="max-w-[520px] leading-relaxed text-body md:text-lg">
              Un format, une livraison, une œuvre que vous aimeriez voir de plus
              près : écrivez-moi, je réponds personnellement.
            </p>
            <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
              <Link
                href="/contact"
                className="flex h-14 items-center justify-center rounded-full bg-ink px-8 font-medium text-paper transition-colors hover:bg-accent"
              >
                Me contacter
              </Link>
              <a href="mailto:contact@mngh-art.com" className="link-underline self-start sm:self-auto">
                contact@mngh-art.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
