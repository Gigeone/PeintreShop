import Image from "next/image";

interface ImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
}

/**
 * Composant d'affichage d'image simple et élégant
 *
 * Fonctionnalités :
 * - Affichage optimisé avec Next.js Image
 * - Responsive et adaptatif
 * - Padding élégant autour de l'image
 */
export function ImageZoom({ src, alt, priority = false }: ImageZoomProps) {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl bg-white p-8">
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
    </div>
  );
}
