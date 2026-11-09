import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { generatePageMetadata, getSiteUrl } from "@/lib/seo/metadata";
import { generateOrganizationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = generatePageMetadata({
  title: "À Propos",
  description: "Découvrez l'artiste peintre MNGH, son parcours, sa passion pour l'art et sa démarche créative unique.",
  path: "/a-propos",
});

export default function AProposPage() {
  const siteUrl = getSiteUrl();
  const organizationSchema = generateOrganizationSchema(siteUrl);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Présentation */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-20 lg:grid-cols-12 lg:gap-8">
        <div className="relative aspect-[4/5] w-full max-w-[260px] sm:max-w-[340px] lg:col-span-4 lg:col-start-2 lg:max-w-none">
          <Image
            src="/images/artist-photo.jpg"
            alt="Portrait de l'artiste MNGH"
            fill
            priority
            sizes="(max-width: 1024px) 340px, 30vw"
            className="object-cover object-[50%_20%]"
          />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7 lg:gap-8">
          <p className="eyebrow">L&apos;artiste</p>
          <h1 className="font-serif text-5xl font-normal tracking-[-0.02em] md:text-[64px]">MNGH</h1>
          <p className="text-lg leading-relaxed text-body md:text-xl">
            Artiste peintre autodidacte, je me consacre à la création d&apos;œuvres originales
            depuis plus de 15 ans. Ma palette joue sur les contrastes et la lumière,
            créant des compositions qui invitent à la contemplation et à l&apos;évasion.
          </p>
          <blockquote className="border-t border-line pt-6 font-serif text-2xl font-light italic leading-snug md:text-[32px]">
            « Chaque toile est le reflet d&apos;une émotion, d&apos;un instant capturé ou d&apos;un rêve éveillé. »
          </blockquote>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8">
        <dl className="grid grid-cols-3 border-y border-line">
          {[
            ["15+", "Années de création"],
            ["50+", "Œuvres vendues"],
            ["100 %", "Pièces uniques"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`flex flex-col-reverse gap-1 py-8 text-center md:py-12 ${index > 0 ? "border-l border-line" : ""}`}
            >
              <dt className="text-xs text-muted md:text-sm">{label}</dt>
              <dd className="font-serif text-3xl md:text-5xl">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 sm:px-8 md:gap-24 md:py-28">
        {/* Démarche artistique */}
        <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <h2 className="font-serif text-3xl font-normal md:text-[40px] lg:col-span-4">
            Ma démarche artistique
          </h2>
          <p className="text-lg leading-relaxed text-body lg:col-span-7 lg:col-start-6">
            Mon travail se nourrit d&apos;observations quotidiennes, de voyages et de moments d&apos;introspection.
            Je cherche à créer un dialogue entre l&apos;abstrait et le figuratif, où les formes se dévoilent
            progressivement au regard. Ma démarche privilégie l&apos;intuition et l&apos;émotion plutôt que la
            représentation fidèle, laissant place à l&apos;interprétation personnelle de chaque spectateur.
          </p>
        </section>

        {/* Techniques utilisées */}
        <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <h2 className="font-serif text-3xl font-normal md:text-[40px] lg:col-span-4">
            Techniques utilisées
          </h2>
          <dl className="grid border-t border-line sm:grid-cols-2 sm:gap-x-12 lg:col-span-7 lg:col-start-6">
            {[
              ["Acrylique sur toile", "Transparences et superpositions"],
              ["Aquarelle", "Créations spontanées et légères"],
              ["Toiles de lin & coton", "Préparation soignée"],
              ["Vernis de qualité", "Conservation optimale"],
            ].map(([technique, detail]) => (
              <div key={technique} className="flex flex-col gap-1 border-b border-line py-5">
                <dt className="font-semibold">{technique}</dt>
                <dd className="text-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Parcours */}
        <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <h2 className="font-serif text-3xl font-normal md:text-[40px] lg:col-span-4">
            Parcours &amp; expositions
          </h2>
          <ol className="border-t border-line lg:col-span-7 lg:col-start-6">
            {[
              ["Aujourd'hui", "Galerie en ligne exclusive - Création d'œuvres originales disponibles dans le monde entier"],
              ["2015-2023", "Expositions collectives en France - Œuvres intégrées à des collections privées en Europe"],
              ["Depuis 2010", "Pratique en atelier - Développement d'un style personnel basé sur l'intuition et l'émotion"],
            ].map(([period, text]) => (
              <li key={period} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
                <span className="font-serif text-lg text-accent">{period}</span>
                <span className="leading-relaxed text-body">{text}</span>
              </li>
            ))}
          </ol>
        </section>

        <Link href="/galerie" className="link-underline self-start">
          Découvrir ses œuvres
        </Link>
      </div>
    </>
  );
}
