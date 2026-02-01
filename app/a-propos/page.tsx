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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="font-serif text-5xl font-bold text-pastel-violet-logo mb-12 text-center">
            À propos de l'Artiste
          </h1>

          {/* Section principale avec photo */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0 shadow-xl ring-4 ring-pastel-lavender/20">
                <Image
                  src="/images/artist-photo.jpg"
                  alt="Portrait de l'artiste MNGH"
                  fill
                  className="object-cover scale-150 translate-y-8"
                  priority
                />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-3xl font-semibold text-pastel-gray-text mb-4">
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
          </div>

          {/* Chiffres clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-pastel-lavender/10 to-pastel-rose-mauve/10 backdrop-blur-sm rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-pastel-lavender mb-2">15+</div>
              <div className="text-sm text-pastel-gray-text font-medium">Années de création</div>
            </div>
            <div className="bg-gradient-to-br from-pastel-blue-logo/10 to-pastel-lavender/10 backdrop-blur-sm rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-pastel-blue-logo mb-2">50+</div>
              <div className="text-sm text-pastel-gray-text font-medium">Œuvres vendues</div>
            </div>
            <div className="bg-gradient-to-br from-pastel-rose-mauve/10 to-pastel-violet-logo/10 backdrop-blur-sm rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-pastel-rose-mauve mb-2">100%</div>
              <div className="text-sm text-pastel-gray-text font-medium">Pièces uniques</div>
            </div>
          </div>

          {/* Démarche artistique */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-pastel-lavender/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pastel-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-semibold text-pastel-lavender mb-3">
                  Ma démarche artistique
                </h3>
                <p className="text-pastel-gray-text leading-relaxed">
                  Mon travail se nourrit d'observations quotidiennes, de voyages et de moments d'introspection.
                  Je cherche à créer un dialogue entre l'abstrait et le figuratif, où les formes se dévoilent
                  progressivement au regard. Ma démarche privilégie l'intuition et l'émotion plutôt que la
                  représentation fidèle, laissant place à l'interprétation personnelle de chaque spectateur.
                </p>
              </div>
            </div>
          </div>

          {/* Techniques utilisées */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-pastel-blue-logo/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pastel-blue-logo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-semibold text-pastel-lavender mb-4">
                  Techniques utilisées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-pastel-rose-bg/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-pastel-lavender mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-semibold text-pastel-gray-text mb-1">Acrylique sur toile</div>
                      <div className="text-sm text-pastel-gray-text/70">Transparences et superpositions</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-pastel-blue-bg/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-pastel-blue-logo mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-semibold text-pastel-gray-text mb-1">Aquarelle</div>
                      <div className="text-sm text-pastel-gray-text/70">Créations spontanées et légères</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-pastel-rose-bg/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-pastel-rose-mauve mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-semibold text-pastel-gray-text mb-1">Toiles de lin & coton</div>
                      <div className="text-sm text-pastel-gray-text/70">Préparation soignée</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-pastel-blue-bg/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-pastel-violet-logo mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-semibold text-pastel-gray-text mb-1">Vernis de qualité</div>
                      <div className="text-sm text-pastel-gray-text/70">Conservation optimale</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline parcours */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-pastel-rose-mauve/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pastel-rose-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-semibold text-pastel-lavender mb-6">
                  Parcours & Expositions
                </h3>

                <div className="space-y-6">
                  {/* Timeline item */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-pastel-lavender"></div>
                      <div className="w-0.5 h-full bg-pastel-lavender/30 mt-2"></div>
                    </div>
                    <div className="pb-6 flex-1">
                      <div className="text-sm font-semibold text-pastel-lavender mb-1">Aujourd'hui</div>
                      <p className="text-pastel-gray-text leading-relaxed">
                        Galerie en ligne exclusive - Création d'œuvres originales disponibles dans le monde entier
                      </p>
                    </div>
                  </div>

                  {/* Timeline item */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-pastel-blue-logo"></div>
                      <div className="w-0.5 h-full bg-pastel-lavender/30 mt-2"></div>
                    </div>
                    <div className="pb-6 flex-1">
                      <div className="text-sm font-semibold text-pastel-lavender mb-1">2015-2023</div>
                      <p className="text-pastel-gray-text leading-relaxed">
                        Expositions collectives en France - Œuvres intégrées à des collections privées en Europe
                      </p>
                    </div>
                  </div>

                  {/* Timeline item */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-pastel-rose-mauve"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-pastel-lavender mb-1">Depuis 2010</div>
                      <p className="text-pastel-gray-text leading-relaxed">
                        Pratique en atelier - Développement d'un style personnel basé sur l'intuition et l'émotion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
