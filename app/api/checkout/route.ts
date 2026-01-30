import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { client } from "@/lib/sanity/client";
import {
  CheckoutRequestBody,
  CheckoutSuccessResponse,
  CheckoutErrorResponse,
} from "@/types/checkout";
import Stripe from "stripe";

/**
 * Route API pour créer une session Stripe Checkout
 * POST /api/checkout
 *
 * Cette route :
 * 1. Valide la requête (artworkId présent)
 * 2. Vérifie que l'œuvre existe et est disponible dans Sanity
 * 3. Crée une session Stripe Checkout
 * 4. Retourne l'URL de redirection vers Stripe
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parser et valider le body de la requête
    const body: CheckoutRequestBody = await request.json();

    if (!body.artworkId) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "artworkId is required",
        } as CheckoutErrorResponse,
        { status: 400 }
      );
    }

    // 2. Vérifier que NEXT_PUBLIC_SITE_URL est configuré
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      console.error("NEXT_PUBLIC_SITE_URL is not configured");
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Site URL configuration is missing",
        } as CheckoutErrorResponse,
        { status: 500 }
      );
    }

    // 3. Récupérer l'œuvre depuis Sanity et vérifier sa disponibilité
    const artwork = await client.fetch(
      `*[_type == "artwork" && _id == $artworkId][0]{
        _id,
        title,
        slug,
        price,
        isAvailable,
        "imageUrl": image.asset->url
      }`,
      { artworkId: body.artworkId }
    );

    // 4. Vérifier que l'œuvre existe
    if (!artwork) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Artwork not found",
        } as CheckoutErrorResponse,
        { status: 404 }
      );
    }

    // 5. Vérifier que l'œuvre est disponible
    if (!artwork.isAvailable) {
      return NextResponse.json(
        {
          error: "Gone",
          message: "This artwork is no longer available",
        } as CheckoutErrorResponse,
        { status: 410 }
      );
    }

    // 6. Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: artwork.title,
              images: artwork.imageUrl ? [artwork.imageUrl] : [],
            },
            unit_amount: Math.round(artwork.price * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      // Collecte de l'adresse de livraison
      shipping_address_collection: {
        allowed_countries: [
          "FR", // France
          "BE", // Belgique
          "CH", // Suisse
          "LU", // Luxembourg
          "MC", // Monaco
          "DE", // Allemagne
          "ES", // Espagne
          "IT", // Italie
          "GB", // Royaume-Uni
          "NL", // Pays-Bas
          "PT", // Portugal
        ],
      },
      // Collecte du numéro de téléphone
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/oeuvres/${artwork.slug.current}`,
      metadata: {
        artworkId: artwork._id,
        artworkSlug: artwork.slug.current,
      },
    });

    // 7. Retourner la session ID et l'URL de redirection
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    } as CheckoutSuccessResponse);
  } catch (error) {
    // Gestion des erreurs spécifiques Stripe
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Stripe error:", error);
      return NextResponse.json(
        {
          error: "Payment Error",
          message: "Failed to create checkout session",
          code: error.code,
        } as CheckoutErrorResponse,
        { status: 500 }
      );
    }

    // Gestion des erreurs de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Invalid JSON in request body",
        } as CheckoutErrorResponse,
        { status: 400 }
      );
    }

    // Erreur générique
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      } as CheckoutErrorResponse,
      { status: 500 }
    );
  }
}
