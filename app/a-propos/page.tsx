import Image from "next/image";
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

      <div className="min-h-screen bg-gradient-to-br from-pastel-rose-bg via-white to-pastel-blue-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-pastel-violet-logo mb-6">
          À propos de l'Artiste
        </h1>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0 shadow-xl">
              <Image
                src="/images/artist-photo.jpg"
                alt="Portrait de l'artiste MNGH"
                fill
                className="object-cover scale-150 translate-y-8"
                priority
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-pastel-gray-text mb-4">
                MNGH
              </h2>
              <p className="text-lg text-pastel-gray-text leading-relaxed">
                Artiste peintre autodidacte, je me consacre à la création d'œuvres originales
                depuis plus de 15 ans. Ma palette privilégie les tons pastels et harmonieux,
                créant des compositions qui invitent à la contemplation et à l'évasion.
                Chaque toile est le reflet d'une émotion, d'un instant capturé ou d'un rêve éveillé.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-pastel-lavender mb-3">
                Ma démarche artistique
              </h3>
              <p className="text-pastel-gray-text leading-relaxed">
                Mon travail se nourrit d'observations quotidiennes, de voyages et de moments d'introspection.
                Je cherche à créer un dialogue entre l'abstrait et le figuratif, où les formes se dévoilent
                progressivement au regard. Ma démarche privilégie l'intuition et l'émotion plutôt que la
                représentation fidèle, laissant place à l'interprétation personnelle de chaque spectateur.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-pastel-lavender mb-3">
                Techniques utilisées
              </h3>
              <p className="text-pastel-gray-text leading-relaxed">
                Je travaille principalement à l'acrylique sur toile, une technique qui me permet de jouer
                avec les transparences et les superpositions. J'utilise également l'aquarelle pour des créations
                plus spontanées et légères. Mes œuvres sont réalisées sur toiles de lin ou de coton,
                préparées avec soin, et protégées par un vernis de qualité muséale pour une conservation optimale.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-pastel-lavender mb-3">
                Expositions et parcours
              </h3>
              <p className="text-pastel-gray-text leading-relaxed">
                Après des années de pratique en atelier, j'ai présenté mes œuvres dans plusieurs
                expositions collectives en France. Mes toiles ont trouvé leur place dans des collections
                privées en Europe et au-delà. Aujourd'hui, je me concentre sur la création d'œuvres originales
                disponibles exclusivement en ligne, permettant à chacun de découvrir et d'acquérir mes créations
                depuis n'importe où dans le monde.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
