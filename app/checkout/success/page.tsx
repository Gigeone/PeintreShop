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
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16 sm:px-8 md:py-28">
      <div className="flex flex-col gap-5">
        <p className="flex items-center gap-2.5 text-sm">
          <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
          Paiement confirmé
        </p>
        <h1 className="font-serif text-5xl font-normal tracking-[-0.02em] md:text-[64px]">
          Merci pour votre achat
        </h1>
        <p className="text-lg leading-relaxed text-body">
          Votre commande a été confirmée. Votre œuvre sera emballée avec soin.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="eyebrow">Prochaines étapes</h2>
        <ol className="border-t border-line">
          {[
            "Vous allez recevoir un email de confirmation avec les détails de votre commande.",
            "L'artiste vous contactera prochainement pour organiser la livraison.",
            "Un reçu de paiement a été envoyé à votre adresse email.",
          ].map((step, index) => (
            <li key={step} className="flex gap-5 border-b border-line py-4 leading-relaxed text-body">
              <span className="font-serif text-lg text-accent">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {session_id && (
        <p className="text-sm text-muted">
          Référence de transaction : {session_id.slice(0, 20)}...
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/galerie">Retour à la galerie</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Accueil</Link>
        </Button>
      </div>
    </div>
  );
}
