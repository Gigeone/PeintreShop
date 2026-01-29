"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
}

/**
 * Composant d'image avec zoom en plein écran au clic
 *
 * Fonctionnalités :
 * - Clic sur l'image pour ouvrir en lightbox plein écran
 * - Fermeture par clic sur fond noir, bouton X, ou touche Escape
 * - Indicateur visuel de zoom au survol (desktop)
 * - Responsive et optimisé mobile
 */
export function ImageZoom({ src, alt, priority = false }: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fermer avec la touche Escape
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Ajouter/retirer l'event listener
  useState(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown as any);
      // Empêcher le scroll du body quand le modal est ouvert
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown as any);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown as any);
      document.body.style.overflow = "unset";
    };
  });

  return (
    <>
      {/* Image principale avec indicateur de zoom */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative aspect-square rounded-xl overflow-hidden shadow-2xl bg-white p-8 cursor-zoom-in group"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 60vw"
        />

        {/* Indicateur de zoom au survol */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
            <svg
              className="w-6 h-6 text-pastel-lavender"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Modal lightbox plein écran */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-pastel-lavender transition-colors duration-300 z-10"
            aria-label="Fermer"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image agrandie */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
          </div>

          {/* Indication de fermeture */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            Cliquez n'importe où pour fermer • Touche Échap
          </div>
        </div>
      )}
    </>
  );
}
