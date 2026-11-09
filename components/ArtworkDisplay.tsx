"use client";

import { useRef } from "react";
import Image from "next/image";

interface ArtworkDisplayProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Aperçu flou fourni par Sanity, affiché pendant le chargement du zoom */
  blurDataURL?: string;
}

/**
 * Grande présentation d'une toile sur un fond "mur" (fiche œuvre)
 * - La toile garde ses proportions réelles, sans recadrage
 * - Un clic ouvre la toile en plein écran (<dialog> natif : Échap pour fermer)
 */
export function ArtworkDisplay({ src, alt, width = 1200, height = 1000, blurDataURL }: ArtworkDisplayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <div className="relative aspect-[4/3.6] bg-wall">
        <button
          type="button"
          onClick={open}
          aria-label={`Agrandir la toile ${alt}`}
          className="absolute inset-6 flex cursor-zoom-in items-center justify-center sm:inset-14 lg:inset-20"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="h-auto max-h-full w-auto max-w-full shadow-painting-lg"
          />
        </button>
      </div>

      <button
        type="button"
        onClick={open}
        className="mt-3 flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4M11 8v6M8 11h6" />
        </svg>
        Agrandir pour voir les détails
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        onClick={(e) => {
          // Un clic en dehors de la toile ferme l'agrandissement
          if (!(e.target instanceof HTMLImageElement)) close();
        }}
        className="m-0 h-full max-h-none w-full max-w-none border-0 bg-ink/95 p-0 backdrop:bg-ink/80"
      >
        <div className="flex h-full w-full items-center justify-center p-4 sm:p-10">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="100vw"
            quality={90}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            className="h-auto max-h-full w-auto max-w-full"
          />
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Fermer l'agrandissement"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-surface"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
