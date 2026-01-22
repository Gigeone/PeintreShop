export default function AProposPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-rose-bg via-white to-pastel-blue-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-pastel-violet-logo mb-6">
          À propos de l'Artiste
        </h1>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-pastel-rose-mauve to-pastel-lavender flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-semibold text-pastel-gray-text mb-4">
                MNGH
              </h2>
              <p className="text-lg text-pastel-gray-text leading-relaxed">
                Artiste peintre passionnée, je crée des œuvres uniques qui capturent l'émotion
                et la beauté du monde qui m'entoure. Mon travail explore les couleurs douces
                et les formes organiques.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-pastel-lavender mb-3">
                Ma démarche artistique
              </h3>
              <p className="text-pastel-gray-text leading-relaxed">
                Contenu à définir avec l'artiste. Cette section présentera la philosophie
                artistique, les inspirations et la démarche créative.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-pastel-lavender mb-3">
                Techniques utilisées
              </h3>
              <p className="text-pastel-gray-text leading-relaxed">
                Information sur les techniques de peinture, les médiums utilisés
                (acrylique, huile, aquarelle, etc.) et les supports privilégiés.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-pastel-lavender mb-3">
                Expositions et parcours
              </h3>
              <p className="text-pastel-gray-text leading-relaxed">
                Liste des expositions passées, collaborations et moments clés du parcours artistique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
