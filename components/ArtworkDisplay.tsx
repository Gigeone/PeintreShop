import Image from "next/image";

interface ArtworkDisplayProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Grande présentation d'une toile sur un fond "mur" (fiche œuvre)
 * La toile garde ses proportions réelles, sans recadrage.
 */
export function ArtworkDisplay({ src, alt, width = 1200, height = 1000 }: ArtworkDisplayProps) {
  return (
    <div className="relative aspect-[4/3.6] bg-wall">
      <div className="absolute inset-6 flex items-center justify-center sm:inset-14 lg:inset-20">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="h-auto max-h-full w-auto max-w-full shadow-painting-lg"
        />
      </div>
    </div>
  );
}
