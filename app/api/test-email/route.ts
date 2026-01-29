import { NextResponse } from "next/server";
import { getResendClient, getFromEmail, getArtistEmail } from "@/lib/email/client";

/**
 * API Route de test pour Resend
 *
 * Usage: GET http://localhost:3000/api/test-email
 *
 * Envoie un email de test à l'adresse configurée dans ARTIST_EMAIL
 */
export async function GET() {
  try {
    // Vérifier la configuration
    const resend = getResendClient();
    const fromEmail = getFromEmail();
    const artistEmail = getArtistEmail();

    if (!resend) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY not configured in .env.local",
          help: "Add RESEND_API_KEY=re_... to your .env.local file",
        },
        { status: 500 }
      );
    }

    if (!artistEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "ARTIST_EMAIL not configured in .env.local",
          help: "Add ARTIST_EMAIL=your-email@example.com to your .env.local file",
        },
        { status: 500 }
      );
    }

    // Envoyer l'email de test
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: artistEmail,
      subject: "🎨 Test Resend - PeintureShop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 20px;">
            ✅ Configuration Resend réussie !
          </h1>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Félicitations ! Votre configuration Resend fonctionne correctement.
          </p>

          <div style="background-color: #f3f4f6; border-left: 4px solid #2563eb; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #1f2937;">
              <strong>Configuration détectée :</strong><br>
              📧 Email expéditeur : <code>${fromEmail}</code><br>
              🎨 Email artiste : <code>${artistEmail}</code>
            </p>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
            Vous pouvez maintenant tester le flow complet d'achat avec Stripe CLI.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Email de test envoyé depuis /api/test-email
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to send email",
          details: error,
        },
        { status: 500 }
      );
    }

    console.log(`✓ Test email sent to ${artistEmail} (ID: ${data?.id})`);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      emailId: data?.id,
      sentTo: artistEmail,
      sentFrom: fromEmail,
    });

  } catch (error) {
    console.error("❌ Exception in test-email API:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
