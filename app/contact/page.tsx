export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue-bg to-pastel-rose-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-pastel-blue-logo mb-6">
          Contactez-moi
        </h1>
        <p className="text-xl text-pastel-gray-text mb-12">
          Une question sur une œuvre ? Une demande particulière ? N'hésitez pas à me contacter.
        </p>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-pastel-gray-text mb-2"
              >
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 rounded-lg border-2 border-pastel-lavender/30 focus:border-pastel-lavender focus:outline-none transition-colors duration-300"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-pastel-gray-text mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg border-2 border-pastel-lavender/30 focus:border-pastel-lavender focus:outline-none transition-colors duration-300"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-pastel-gray-text mb-2"
              >
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 rounded-lg border-2 border-pastel-lavender/30 focus:border-pastel-lavender focus:outline-none transition-colors duration-300"
                placeholder="Sujet de votre message"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-pastel-gray-text mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-pastel-lavender/30 focus:border-pastel-lavender focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Votre message..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pastel-rose-mauve text-white rounded-lg font-semibold hover:bg-pastel-lavender transition-colors duration-300 shadow-lg"
            >
              Envoyer le message
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-pastel-lavender/20">
            <p className="text-sm text-pastel-gray-text text-center">
              Note: Ce formulaire est un placeholder pour le MVP. La fonctionnalité d'envoi
              sera implémentée dans une version ultérieure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
