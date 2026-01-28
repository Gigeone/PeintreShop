import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement réussi - MNGH",
  description: "Votre achat a été confirmé avec succès",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue-bg to-pastel-rose-bg flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 text-center space-y-8">
        {/* Icône de succès */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Message principal */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-pastel-violet-logo">
            Paiement réussi !
          </h1>
          <p className="text-xl text-pastel-gray-text">
            Merci pour votre achat. Votre commande a été confirmée.
          </p>
        </div>

        {/* Informations */}
        <div className="bg-pastel-blue-bg/30 rounded-lg p-6 space-y-3 text-left">
          <h2 className="text-lg font-semibold text-pastel-violet-logo mb-4">
            Prochaines étapes
          </h2>
          <div className="space-y-3 text-pastel-gray-text">
            <div className="flex items-start">
              <span className="text-pastel-lavender mr-3">✓</span>
              <p>
                Vous allez recevoir un email de confirmation avec les détails de
                votre commande.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-pastel-lavender mr-3">✓</span>
              <p>
                L'artiste vous contactera prochainement pour organiser la
                livraison.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-pastel-lavender mr-3">✓</span>
              <p>
                Un reçu de paiement a été envoyé à votre adresse email.
              </p>
            </div>
          </div>
        </div>

        {/* ID de session (pour debug) */}
        {session_id && (
          <div className="text-sm text-pastel-gray-text/60">
            Référence de transaction : {session_id.slice(0, 20)}...
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/galerie">
            <Button className="w-full sm:w-auto bg-pastel-rose-mauve hover:bg-pastel-lavender text-white px-8 py-6 text-lg">
              Retour à la galerie
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-pastel-lavender text-pastel-lavender hover:bg-pastel-lavender/10 px-8 py-6 text-lg"
            >
              Accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
