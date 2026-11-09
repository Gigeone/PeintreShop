"use client";

import { useMemo, useState } from "react";
import type { SanityArtwork } from "@/types/artwork";
import { ArtworkCard } from "@/components/ArtworkCard";
import { cn } from "@/lib/utils";

type FormatFilter = "tous" | "paysage" | "portrait" | "carre";
type PriceFilter = "tous" | "bas" | "moyen" | "haut";
type SortOrder = "recent" | "asc" | "desc";

const FORMAT_OPTIONS: { id: FormatFilter; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "paysage", label: "Paysage" },
  { id: "portrait", label: "Portrait" },
  { id: "carre", label: "Carré" },
];

const PRICE_OPTIONS: { id: PriceFilter; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "bas", label: "Moins de 100 €" },
  { id: "moyen", label: "100 – 150 €" },
  { id: "haut", label: "Plus de 150 €" },
];

function formatOf({ dimensions }: SanityArtwork): FormatFilter {
  if (dimensions.height === dimensions.width) return "carre";
  return dimensions.width > dimensions.height ? "paysage" : "portrait";
}

function priceRangeOf({ price }: SanityArtwork): PriceFilter {
  if (price < 100) return "bas";
  return price <= 150 ? "moyen" : "haut";
}

interface FilterGroupProps<T extends string> {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function FilterGroup<T extends string>({ label, options, value, onChange }: FilterGroupProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-2 w-full sm:w-auto">{label}</span>
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "h-11 rounded-full border px-4 text-sm transition-colors",
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-line-strong text-ink hover:border-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Grille de la galerie avec filtres (format, prix) et tri
 * Tout est calculé côté client à partir des œuvres déjà chargées.
 */
export function GalleryGrid({ artworks }: { artworks: SanityArtwork[] }) {
  const [format, setFormat] = useState<FormatFilter>("tous");
  const [priceRange, setPriceRange] = useState<PriceFilter>("tous");
  const [sort, setSort] = useState<SortOrder>("recent");

  const visibleArtworks = useMemo(() => {
    const filtered = artworks.filter(
      (artwork) =>
        (format === "tous" || formatOf(artwork) === format) &&
        (priceRange === "tous" || priceRangeOf(artwork) === priceRange)
    );
    if (sort === "asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [artworks, format, priceRange, sort]);

  const resetFilters = () => {
    setFormat("tous");
    setPriceRange("tous");
  };

  return (
    <>
      <div className="flex flex-col gap-5 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-5 xl:flex-row xl:gap-10">
          <FilterGroup label="Format" options={FORMAT_OPTIONS} value={format} onChange={setFormat} />
          <FilterGroup label="Prix" options={PRICE_OPTIONS} value={priceRange} onChange={setPriceRange} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted" aria-live="polite">
            {visibleArtworks.length} {visibleArtworks.length > 1 ? "œuvres" : "œuvre"}
          </p>
          <label className="flex items-center gap-3 text-sm text-muted">
            Trier
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
              className="h-11 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink"
            >
              <option value="recent">Plus récentes</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>

      {visibleArtworks.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-24 text-center">
          <p className="font-serif text-2xl">Aucune œuvre ne correspond à ces filtres.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="h-12 rounded-full border border-ink px-6 text-[15px] transition-colors hover:border-accent hover:text-accent"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 pt-10 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
          {visibleArtworks.map((artwork) => (
            <ArtworkCard key={artwork._id} artwork={artwork} />
          ))}
        </div>
      )}
    </>
  );
}
