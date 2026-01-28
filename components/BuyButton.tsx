"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BuyButtonProps {
  artworkId: string;
  artworkTitle: string;
  isAvailable: boolean;
}

/**
 * Bouton d'achat qui crée une session Stripe Checkout
 * et redirige l'utilisateur vers la page de paiement Stripe
 */
export function BuyButton({
  artworkId,
  artworkTitle,
  isAvailable,
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuyClick = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Appeler l'API checkout pour créer une session Stripe
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artworkId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Gérer les différents codes d'erreur
        if (response.status === 410) {
          setError("Cette œuvre n'est plus disponible.");
        } else if (response.status === 404) {
          setError("Œuvre introuvable.");
        } else {
          setError(
            data.message || "Une erreur est survenue. Veuillez réessayer."
          );
        }
        return;
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Impossible de créer la session de paiement.");
      }
    } catch (err) {
      console.error("Erreur lors de l'achat:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Bouton désactivé si l'œuvre n'est pas disponible
  if (!isAvailable) {
    return (
      <Button
        disabled
        className="w-full text-lg py-6 opacity-50 cursor-not-allowed"
      >
        Œuvre vendue
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleBuyClick}
        disabled={isLoading}
        className="w-full bg-pastel-rose-mauve hover:bg-pastel-lavender text-white text-lg py-6 transition-colors duration-300"
      >
        {isLoading ? "Chargement..." : "Acheter cette œuvre"}
      </Button>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
