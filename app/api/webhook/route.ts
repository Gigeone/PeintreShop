import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { client } from "@/lib/sanity/client";
import {
  WebhookSuccessResponse,
  WebhookErrorResponse,
  ArtworkMetadata,
} from "@/types/webhook";
import { sendTransactionEmails } from "@/lib/email/send";
import Stripe from "stripe";

/**
 * Route API pour recevoir et traiter les webhooks Stripe
 * POST /api/webhook
 *
 * Cette route :
 * 1. Valide la signature Stripe pour garantir l'authenticité
 * 2. Filtre l'événement checkout.session.completed
 * 3. Extrait les metadata (artworkId)
 * 4. Vérifie que l'œuvre est disponible (protection race condition)
 * 5. Met à jour isAvailable: false dans Sanity
 * 6. Envoie les emails de confirmation (client + artiste)
 * 7. Retourne 200 (succès) ou 500 (échec pour retry Stripe)
 *
 * Note : L'envoi d'emails ne bloque jamais le processus de paiement
 */
export async function POST(request: NextRequest) {
  // 1. Lire le body brut (requis pour validation signature Stripe)
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  // Vérifier que la signature est présente
  if (!signature) {
    console.error("✗ Webhook: No signature header");
    return NextResponse.json(
      { error: "No signature" } as WebhookErrorResponse,
      { status: 400 }
    );
  }

  // 2. Vérifier que STRIPE_WEBHOOK_SECRET est configuré
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("✗ STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" } as WebhookErrorResponse,
      { status: 500 }
    );
  }

  // 3. Valider la signature et construire l'événement Stripe
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("✗ Webhook signature verification failed:", errorMessage);
    return NextResponse.json(
      {
        error: "Invalid signature",
        details: errorMessage,
      } as WebhookErrorResponse,
      { status: 400 }
    );
  }

  console.log(`✓ Webhook received: ${event.type} (${event.id})`);

  // 4. Filtrer les événements non pertinents
  if (event.type !== "checkout.session.completed") {
    console.log(`ℹ Ignoring event type: ${event.type}`);
    return NextResponse.json({ received: true });
  }

  // 5. Extraire l'objet session
  const session = event.data.object as Stripe.Checkout.Session;

  // Vérifier que le paiement est bien confirmé
  if (session.payment_status !== "paid") {
    console.log(
      `ℹ Session ${session.id} not paid yet: ${session.payment_status}`
    );
    return NextResponse.json({ received: true });
  }

  // 6. Extraire les metadata
  const metadata = session.metadata as ArtworkMetadata | null;
  const artworkId = metadata?.artworkId;

  if (!artworkId) {
    console.error(`✗ No artworkId in session metadata: ${session.id}`);
    return NextResponse.json(
      { error: "Missing artworkId in metadata" } as WebhookErrorResponse,
      { status: 400 }
    );
  }

  console.log(`✓ Processing payment for artwork: ${artworkId}`);

  try {
    // 7. Récupérer l'œuvre depuis Sanity (avec infos pour emails)
    const artwork = await client.fetch<{
      _id: string;
      title: string;
      isAvailable: boolean;
      price: number;
      slug: { current: string };
      imageUrl?: string;
      dimensions?: string;
      technique?: string;
    } | null>(
      `*[_type == "artwork" && _id == $artworkId][0]{
        _id,
        title,
        isAvailable,
        price,
        slug,
        dimensions,
        technique,
        "imageUrl": image.asset->url
      }`,
      { artworkId }
    );

    // Vérifier que l'œuvre existe
    if (!artwork) {
      console.error(`✗ Artwork not found: ${artworkId}`);
      return NextResponse.json(
        { error: "Artwork not found" } as WebhookErrorResponse,
        { status: 500 }
      );
    }

    // 8. Protection race condition : vérifier si l'œuvre est déjà vendue
    if (!artwork.isAvailable) {
      console.log(
        `ℹ Artwork ${artworkId} (${artwork.title}) already sold, ignoring webhook`
      );
      return NextResponse.json({
        received: true,
        artworkId,
        already_sold: true,
      } as WebhookSuccessResponse);
    }

    // 9. Mettre à jour l'œuvre : marquer comme indisponible
    await client.patch(artworkId).set({ isAvailable: false }).commit();

    console.log(`✓ Artwork ${artworkId} (${artwork.title}) marked as sold`);

    // 10. Envoyer les emails de confirmation (ne doit pas bloquer le processus)
    try {
      // Extraire les informations client depuis Stripe
      const customerEmail = session.customer_details?.email;
      const customerName =
        session.customer_details?.name || "Client";

      // Envoyer les emails uniquement si on a l'email client
      if (customerEmail) {
        await sendTransactionEmails(
          // Email de confirmation client
          {
            customerEmail,
            customerName,
            artworkTitle: artwork.title,
            artworkPrice: artwork.price,
            artworkImageUrl: artwork.imageUrl,
            artworkDimensions: artwork.dimensions,
            artworkTechnique: artwork.technique,
            sessionId: session.id,
          },
          // Email de notification artiste
          {
            artworkTitle: artwork.title,
            artworkSlug: artwork.slug.current,
            artworkPrice: artwork.price,
            customerName,
            customerEmail,
            sessionId: session.id,
          }
        );
      } else {
        console.warn(
          `⚠ Missing customer email (session: ${session.id}), skipping emails`
        );
      }
    } catch (emailError) {
      // Logger l'erreur mais ne pas bloquer le webhook
      console.error(
        `✗ Email sending failed (session: ${session.id}):`,
        emailError
      );
      // Continue quand même - le paiement est validé
    }

    // 11. Retourner succès
    return NextResponse.json({
      received: true,
      artworkId,
      updated: true,
    } as WebhookSuccessResponse);
  } catch (error) {
    // Gestion d'erreurs complète
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`✗ Failed to update artwork ${artworkId}:`, errorMessage);
    console.error(error);

    // Retourner 500 pour que Stripe réessaye automatiquement
    return NextResponse.json(
      {
        error: "Failed to update artwork availability",
        details: errorMessage,
      } as WebhookErrorResponse,
      { status: 500 }
    );
  }
}
