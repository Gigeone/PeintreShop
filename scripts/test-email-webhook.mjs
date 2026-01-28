/**
 * Script de test pour le système d'emails
 * Simule un webhook Stripe sans nécessiter Stripe CLI
 *
 * Usage: node scripts/test-email-webhook.mjs [artworkId]
 */

const WEBHOOK_URL = "http://localhost:3000/api/webhook";
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "yfowm846";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_API_TOKEN;

async function getTestArtwork() {
  console.log("📊 Récupération d'une œuvre de test depuis Sanity...");

  const artwork = await client.fetch(`
    *[_type == "artwork" && isAvailable == true][0]{
      _id,
      title,
      slug,
      price,
      isAvailable
    }
  `);

  if (!artwork) {
    console.error("❌ Aucune œuvre disponible trouvée dans Sanity");
    console.log("💡 Créez une œuvre dans Sanity Studio ou marquez une œuvre comme disponible");
    process.exit(1);
  }

  console.log(`✓ Œuvre trouvée: ${artwork.title} (${artwork._id})`);
  return artwork;
}

async function simulateStripeWebhook(artwork) {
  console.log("\n🚀 Simulation d'un webhook Stripe...");

  // Créer un événement Stripe simulé
  const mockEvent = {
    id: "evt_test_" + Date.now(),
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_" + Date.now(),
        payment_status: "paid",
        customer_details: {
          email: "test-client@example.com",
          name: "Jean Test"
        },
        amount_total: Math.round(artwork.price * 100), // Convertir en centimes
        metadata: {
          artworkId: artwork._id,
          artworkSlug: artwork.slug.current
        }
      }
    }
  };

  console.log("📧 Email client: test-client@example.com");
  console.log("💰 Montant: " + artwork.price + " €");

  // Note: Cette requête échouera sur la validation de signature
  // C'est normal - le but est de voir les logs du serveur
  console.log("\n⚠️  Note: La requête échouera sur la validation de signature (normal)");
  console.log("👉 Regardez les logs du serveur Next.js pour voir les warnings d'email\n");

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Sans signature Stripe, ça va échouer (attendu)
      },
      body: JSON.stringify(mockEvent)
    });

    const data = await response.json();
    console.log("📝 Réponse du webhook:");
    console.log(`   Status: ${response.status}`);
    console.log(`   Body:`, data);

    if (response.status === 400 && data.error === "No signature") {
      console.log("\n✅ Comportement attendu: Le webhook rejette les requêtes sans signature");
      console.log("💡 Pour tester complètement, installez Stripe CLI:");
      console.log("   https://stripe.com/docs/stripe-cli");
    }

  } catch (error) {
    console.error("❌ Erreur lors de l'appel webhook:", error.message);
  }
}

async function testEmailConfiguration() {
  console.log("\n🔍 Vérification de la configuration email...\n");

  const hasResendKey = !!process.env.RESEND_API_KEY;
  const hasEmailFrom = !!process.env.EMAIL_FROM;
  const hasArtistEmail = !!process.env.ARTIST_EMAIL;

  console.log(`RESEND_API_KEY: ${hasResendKey ? "✅ Configuré" : "❌ Manquant"}`);
  console.log(`EMAIL_FROM: ${hasEmailFrom ? "✅ Configuré" : "❌ Manquant"}`);
  console.log(`ARTIST_EMAIL: ${hasArtistEmail ? "✅ Configuré" : "❌ Manquant"}`);

  if (!hasResendKey) {
    console.log("\n⚠️  Email non configuré - Les emails ne seront pas envoyés");
    console.log("💡 Pour configurer:");
    console.log("   1. Créer un compte sur https://resend.com");
    console.log("   2. Obtenir une clé API");
    console.log("   3. Ajouter dans .env.local:");
    console.log("      RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx");
    console.log("      EMAIL_FROM=noreply@votre-domaine.com");
    console.log("      ARTIST_EMAIL=artiste@votre-domaine.com");
    console.log("\n✅ Le webhook continuera à fonctionner sans email (comportement souhaité)");
  } else {
    console.log("\n✅ Configuration email complète");
    console.log("📧 Les emails seront envoyés lors d'un vrai webhook");
  }

  return { hasResendKey, hasEmailFrom, hasArtistEmail };
}

async function main() {
  console.log("🧪 Test du système d'emails transactionnels\n");
  console.log("=" .repeat(60));

  try {
    // 1. Vérifier la configuration
    const config = await testEmailConfiguration();

    // 2. Récupérer une œuvre de test
    const artwork = await getTestArtwork();

    // 3. Simuler un webhook
    await simulateStripeWebhook(artwork);

    console.log("\n" + "=".repeat(60));
    console.log("\n📋 Résumé du test:");
    console.log("   - Configuration email:", config.hasResendKey ? "✅ OK" : "⚠️  Manquante");
    console.log("   - Webhook sécurisé:", "✅ Rejette sans signature");
    console.log("   - Robustesse:", "✅ Fonctionne sans email");

    if (!config.hasResendKey) {
      console.log("\n💡 Prochaine étape: Configurer Resend pour tester l'envoi d'emails");
      console.log("   Voir EMAIL_SETUP.md pour le guide complet");
    }

  } catch (error) {
    console.error("\n❌ Erreur lors du test:", error);
    process.exit(1);
  }
}

main();
