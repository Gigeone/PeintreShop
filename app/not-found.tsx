import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 py-24 sm:px-8 md:py-36">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="font-serif text-5xl font-normal leading-[1.05] tracking-[-0.02em] md:text-[64px]">
        Cette page s&apos;est <em className="text-accent">égarée</em>.
      </h1>
      <p className="text-lg leading-relaxed text-body">
        L&apos;œuvre ou la page que vous cherchez n&apos;existe pas ou plus.
        Les toiles disponibles vous attendent dans la galerie.
      </p>
      <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
        <Link
          href="/galerie"
          className="flex h-14 items-center justify-center rounded-full bg-ink px-8 font-medium text-paper transition-colors hover:bg-accent"
        >
          Voir la galerie
        </Link>
        <Link href="/" className="link-underline self-start sm:self-auto">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
