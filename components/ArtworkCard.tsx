import Image from "next/image";
import Link from "next/link";
import type { SanityArtwork } from "@/types/artwork";
import { cn, formatDimensions, formatPrice } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: SanityArtwork;
  /**
   * - "wall" : toile centrée sur un carré couleur mur (grilles homogènes)
   * - "hanging" : toile "accrochée", alignée en bas, sans fond (sélection d'accueil)
   */
  variant?: "wall" | "hanging";
  sizes?: string;
  showTechnique?: boolean;
}

/**
 * Carte d'œuvre : la toile garde ses proportions réelles (jamais recadrée),
 * avec une ombre légère pour évoquer un tableau accroché.
 */
export function ArtworkCard({
  artwork,
  variant = "wall",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  showTechnique = true,
}: ArtworkCardProps) {
  return (
    <Link href={`/oeuvres/${artwork.slug}`} className="group flex flex-col gap-4">
      <div
        className={cn(
          "relative",
          variant === "wall"
            ? "aspect-square bg-wall"
            : "h-[170px] sm:h-[300px] lg:h-[360px]"
        )}
      >
        <div
          className={cn(
            "absolute flex justify-center",
            variant === "wall"
              ? "inset-5 items-center sm:inset-8"
              : "inset-0 items-end"
          )}
        >
          <Image
            src={artwork.imageUrl}
            alt={artwork.imageAlt || artwork.title}
            width={artwork.imageWidth ?? 1200}
            height={artwork.imageHeight ?? 1000}
            sizes={sizes}
            className="h-auto max-h-full w-auto max-w-full shadow-painting transition-transform duration-500 group-hover:-translate-y-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <h3 className="font-serif text-lg leading-snug transition-colors group-hover:text-accent sm:text-xl">
            {artwork.title}
          </h3>
          {artwork.isAvailable ? (
            <span className="whitespace-nowrap text-[15px] font-medium">
              {formatPrice(artwork.price)}
            </span>
          ) : (
            <span className="whitespace-nowrap text-sm text-muted">Vendue</span>
          )}
        </div>
        <p className="text-sm text-muted">
          {showTechnique && <span className="hidden sm:inline">{artwork.technique} · </span>}
          {formatDimensions(artwork.dimensions)}
        </p>
      </div>
    </Link>
  );
}
