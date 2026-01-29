"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AUTOPLAY_INTERVAL = 5000; // 5 secondes

interface FeaturedCarouselProps {
  artworks: any[];
}

export default function FeaturedCarousel({
  artworks: featuredArtworks,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredArtworks.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, featuredArtworks.length]);

  // Navigation
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredArtworks.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredArtworks.length) % featuredArtworks.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (featuredArtworks.length === 0) return null;

  return (
    <section
      className="py-20 bg-gradient-to-br from-pastel-rose-bg to-pastel-blue-bg"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-pastel-lavender mb-4">
            Œuvres en Vedette
          </h2>
          <p className="text-lg text-pastel-gray-text">
            Découvrez une sélection de nos créations les plus remarquables
          </p>
        </div>

        {/* Carrousel */}
        <div className="relative">
          {/* Track - Affiche 2 œuvres côte à côte (1 sur mobile) */}
          <div className="overflow-hidden">
            <div className="relative">
              {/* Grille responsive : 1 colonne sur mobile, 2 sur desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Première œuvre */}
                {featuredArtworks[currentIndex] && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={featuredArtworks[currentIndex].imageUrl}
                        alt={featuredArtworks[currentIndex].imageAlt || featuredArtworks[currentIndex].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        priority={currentIndex === 0}
                      />
                    </div>
                  </div>
                )}

                {/* Deuxième œuvre - visible uniquement sur md et plus */}
                {featuredArtworks.length > 1 && featuredArtworks[(currentIndex + 1) % featuredArtworks.length] && (
                  <div className="hidden md:block bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={featuredArtworks[(currentIndex + 1) % featuredArtworks.length].imageUrl}
                        alt={featuredArtworks[(currentIndex + 1) % featuredArtworks.length].imageAlt || featuredArtworks[(currentIndex + 1) % featuredArtworks.length].title}
                        fill
                        className="object-cover"
                        sizes="40vw"
                      />
                    </div>
                  </div>
                )}
              </div>
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
              aria-label={`Aller à l'œuvre ${index + 1}`}
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
