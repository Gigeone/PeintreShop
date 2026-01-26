/**
 * Route Sanity Studio - /studio
 *
 * TEMPORAIRE: En raison d'un problème de compatibilité entre React 19 et next-sanity,
 * le Studio embedded est désactivé pour le build de production.
 *
 * Alternatives pour gérer le contenu:
 * 1. Studio hébergé: https://mngh.sanity.studio (disponible après déploiement)
 * 2. Mode développement: http://localhost:3000/studio (fonctionne en dev)
 * 3. Dashboard Sanity: https://www.sanity.io/manage
 *
 * Cette page sera réactivée quand next-sanity sera compatible avec React 19.
 */

export default function StudioPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-blue-bg to-pastel-rose-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-pastel-violet-logo mb-6">
          Sanity Studio
        </h1>
        <p className="text-lg text-pastel-gray-text mb-8">
          Le Studio embedded est temporairement désactivé.
          Utilisez une des alternatives ci-dessous pour gérer votre contenu.
        </p>

        <div className="space-y-4">
          <a
            href="https://mngh.sanity.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-3 bg-pastel-rose-mauve text-white rounded-lg font-semibold hover:bg-pastel-lavender transition-colors duration-300"
          >
            Accéder au Studio Hébergé →
          </a>

          <a
            href="https://www.sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-3 border-2 border-pastel-lavender text-pastel-lavender rounded-lg font-semibold hover:bg-pastel-lavender hover:text-white transition-all duration-300"
          >
            Dashboard Sanity →
          </a>
        </div>

        <p className="mt-8 text-sm text-pastel-gray-text/70">
          Note: En mode développement (npm run dev), vous pouvez accéder au Studio sur /studio
        </p>
      </div>
    </div>
  )
}
