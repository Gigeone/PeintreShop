"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SanityArtwork } from "@/types/artwork";

const AUTOPLAY_INTERVAL = 5000;

interface FeaturedCarouselProps {
  artworks: SanityArtwork[];
}

export default function FeaturedCarousel({
  artworks: featuredArtworks,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredArtworks.length);
    setFadeKey((prev) => prev + 1);
  }, [featuredArtworks.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredArtworks.length) % featuredArtworks.length,
    );
    setFadeKey((prev) => prev + 1);
  }, [featuredArtworks.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setFadeKey((prev) => prev + 1);
  };

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying, goToNext]);

  if (featuredArtworks.length === 0) return null;

  const currentArtwork = featuredArtworks[currentIndex];
  const nextArtwork = featuredArtworks[(currentIndex + 1) % featuredArtworks.length];

  return (
    <section
      className="py-20 bg-gradient-to-br from-pastel-rose-bg to-pastel-blue-bg"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-pastel-lavender mb-4">
            Oeuvres en Vedette
          </h2>
          <p className="text-lg text-pastel-gray-text">
            Découvrez une sélection de nos créations les plus remarquables
          </p>
        </div>

        {/* Carrousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              key={fadeKey}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-carouselFade"
            >
              {/* Première oeuvre */}
              {currentArtwork && (
                <Link
                  href={`/oeuvres/${currentArtwork.slug}`}
                  className="group bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={currentArtwork.imageUrl}
                      alt={currentArtwork.imageAlt || currentArtwork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority={currentIndex === 0}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold text-pastel-gray-text truncate">
                      {currentArtwork.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-bold text-pastel-lavender">
                        {currentArtwork.price.toLocaleString("fr-FR")} €
                      </span>
                      <span className="text-sm text-pastel-gray-text/60">
                        {currentArtwork.technique}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Deuxième oeuvre - visible uniquement sur md et plus */}
              {featuredArtworks.length > 1 && nextArtwork && (
                <Link
                  href={`/oeuvres/${nextArtwork.slug}`}
                  className="hidden md:block group bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={nextArtwork.imageUrl}
                      alt={nextArtwork.imageAlt || nextArtwork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="40vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold text-pastel-gray-text truncate">
                      {nextArtwork.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-bold text-pastel-lavender">
                        {nextArtwork.price.toLocaleString("fr-FR")} €
                      </span>
                      <span className="text-sm text-pastel-gray-text/60">
                        {nextArtwork.technique}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Boutons de navigation */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white shadow-lg z-10"
            onClick={goToPrev}
            aria-label="Slide précédent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white shadow-lg z-10"
            onClick={goToNext}
            aria-label="Slide suivant"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Button>
        </div>

        {/* Indicateurs de pagination (dots) */}
        <div className="flex gap-2 justify-center mt-8">
          {featuredArtworks.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-pastel-lavender"
                  : "bg-pastel-gray-text/30 hover:bg-pastel-gray-text/50"
              }`}
              aria-label={`Aller à l'oeuvre ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA vers galerie */}
        <div className="text-center mt-12">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 text-pastel-lavender hover:text-pastel-rose-mauve transition-colors font-medium"
          >
            Voir toute la galerie
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
      </div>
    </section>
  );
}
