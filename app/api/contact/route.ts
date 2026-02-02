import { NextRequest, NextResponse } from "next/server";
import { getResendClient, getArtistEmail, isEmailConfigured } from "@/lib/email/client";
import { generateContactFormHTML, generateEmailSubject } from "@/lib/email/templates";
import type { ContactFormData } from "@/types/email";

/**
 * POST /api/contact
 *
 * Traite les soumissions du formulaire de contact et envoie un email à l'artiste
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier que le service email est configuré
    if (!isEmailConfigured()) {
      console.warn("⚠ Email service not configured");
      return NextResponse.json(
        { error: "Service d'envoi d'email non configuré" },
        { status: 503 }
      );
    }

    const artistEmail = getArtistEmail();
    if (!artistEmail) {
      console.warn("⚠ Artist email not configured");
      return NextResponse.json(
        { error: "Email destinataire non configuré" },
        { status: 503 }
      );
    }

    // Parser le body de la requête
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validation serveur des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validation email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validation longueur minimale du message
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Le message doit contenir au moins 10 caractères" },
        { status: 400 }
      );
    }

    // Sanitization basique (protection XSS)
    const sanitizedData: ContactFormData = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 254),
      subject: subject.trim().slice(0, 200),
      message: message.trim().slice(0, 5000),
    };

    // Générer le HTML de l'email
    const html = generateContactFormHTML(sanitizedData);
    const emailSubject = generateEmailSubject("contact_form", sanitizedData.subject);

    // Envoyer l'email via Resend
    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        { error: "Client email non initialisé" },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: artistEmail,
      replyTo: sanitizedData.email, // Permet de répondre directement au client
      subject: emailSubject,
      html,
    });

    if (error) {
      console.error("✗ Failed to send contact form email:", error);
      return NextResponse.json(
        { error: "Échec de l'envoi de l'email" },
        { status: 500 }
      );
    }

    console.log(`✓ Contact form email sent from ${sanitizedData.email} to ${artistEmail}`);

    return NextResponse.json(
      {
        success: true,
        message: "Message envoyé avec succès",
        emailId: data?.id,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("✗ Contact form API error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
