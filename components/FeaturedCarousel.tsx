"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AUTOPLAY_INTERVAL = 5000; // 5 secondes

interface FeaturedCarouselProps {
  artworks: any[];
}

export default function FeaturedCarousel({ artworks: featuredArtworks }: FeaturedCarouselProps) {
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
      (prev) => (prev - 1 + featuredArtworks.length) % featuredArtworks.length
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
          {/* Track - Affiche seulement l'œuvre active */}
          <div className="overflow-hidden">
            <div className="relative">
              {featuredArtworks.map((artwork, index) => (
                <div
                  key={artwork._id}
                  className={`transition-opacity duration-500 ${
                    index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                >
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 mx-auto max-w-md">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.imageAlt || artwork.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 448px"
                        priority={index === 0}
                      />
                    </div>

                    {/* Informations */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-pastel-gray-text mb-2">
                        {artwork.title}
                      </h3>

                      <p className="text-sm text-pastel-lavender mb-3">
                        {artwork.technique}
                      </p>

                      <p className="text-pastel-gray-text/70 mb-4 line-clamp-2">
                        {artwork.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-pastel-lavender">
                          {artwork.price.toLocaleString("fr-FR")} €
                        </span>
                        <span className="text-sm text-pastel-gray-text/60">
                          {artwork.dimensions.height} × {artwork.dimensions.width} cm
                        </span>
                      </div>

                      <Button className="w-full" asChild>
                        <Link href="/galerie">Voir les détails</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
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
