import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

/**
 * Route API de test pour vérifier la configuration Stripe
 * GET /api/test-stripe
 *
 * Retourne le statut de la connexion Stripe et confirme que les clés sont valides
 */
export async function GET() {
  try {
    // Vérifier que les variables d'environnement sont définies
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Stripe secret key is not configured. Please set STRIPE_SECRET_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Stripe publishable key is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    // Tester la connexion Stripe en récupérant le solde du compte
    const balance = await stripe.balance.retrieve();

    // Déterminer si on est en mode test ou production
    const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith("sk_test_");

    // Avertir si des clés de production sont utilisées en développement
    if (!isTestMode && process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️  WARNING: Using production Stripe keys in development mode!"
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Stripe configuration is valid",
      mode: isTestMode ? "test" : "live",
      balanceAvailable: balance.available.length > 0,
      currency: balance.available[0]?.currency || "usd",
    });
  } catch (error) {
    // Gestion des erreurs Stripe spécifiques
    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Stripe authentication failed. Please check your STRIPE_SECRET_KEY in .env.local",
        },
        { status: 401 }
      );
    }

    if (error instanceof Stripe.errors.StripePermissionError) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Stripe permission error. Your API key may have insufficient permissions.",
        },
        { status: 403 }
      );
    }

    // Erreur générique
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Stripe test error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: `Stripe configuration error: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
