/**
 * Script simple pour tester Resend SANS dotenv
 * Usage: node scripts/test-resend-manual.js
 *
 * Vous devez passer les variables en ligne de commande:
 * RESEND_API_KEY=re_xxx ARTIST_EMAIL=your@email.com node scripts/test-resend-manual.js
 *
 * OU les définir avant:
 * Windows CMD: set RESEND_API_KEY=re_xxx && set ARTIST_EMAIL=your@email.com && node scripts/test-resend-manual.js
 * Windows PowerShell: $env:RESEND_API_KEY="re_xxx"; $env:ARTIST_EMAIL="your@email.com"; node scripts/test-resend-manual.js
 */

const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Lire manuellement le fichier .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');

  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  Fichier .env.local non trouvé à:', envPath);
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envContent.split('\n').forEach(line => {
    // Ignorer les commentaires et lignes vides
    if (line.trim().startsWith('#') || !line.trim()) return;

    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      env[key.trim()] = value;
    }
  });

  return env;
}

async function testResend() {
  console.log('\n🧪 Test de configuration Resend\n');
  console.log('━'.repeat(50));

  // Charger les variables depuis .env.local
  const envVars = loadEnvFile();

  // 1. Vérifier les variables d'environnement
  console.log('\n1️⃣  Variables d\'environnement:');

  const RESEND_API_KEY = process.env.RESEND_API_KEY || envVars.RESEND_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || envVars.EMAIL_FROM || 'onboarding@resend.dev';
  const ARTIST_EMAIL = process.env.ARTIST_EMAIL || envVars.ARTIST_EMAIL;

  console.log(`   RESEND_API_KEY: ${RESEND_API_KEY ? '✓ Configurée (' + RESEND_API_KEY.substring(0, 10) + '...)' : '✗ Manquante'}`);
  console.log(`   EMAIL_FROM: ${EMAIL_FROM}`);
  console.log(`   ARTIST_EMAIL: ${ARTIST_EMAIL || '✗ Non configurée'}`);

  if (!RESEND_API_KEY || RESEND_API_KEY.includes('xxxxx')) {
    console.error('\n❌ RESEND_API_KEY est manquante ou invalide dans .env.local');
    console.log('\nÉtapes pour configurer:');
    console.log('1. Allez sur https://resend.com/api-keys');
    console.log('2. Créez une nouvelle clé API');
    console.log('3. Modifiez .env.local et remplacez:');
    console.log('   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx');
    console.log('   par votre vraie clé API');
    process.exit(1);
  }

  if (!ARTIST_EMAIL || ARTIST_EMAIL.includes('example.com')) {
    console.error('\n❌ ARTIST_EMAIL est manquante ou invalide dans .env.local');
    console.log('\nPour tester l\'envoi:');
    console.log('1. Modifiez .env.local et ajoutez:');
    console.log('   ARTIST_EMAIL=votre-email@example.com');
    console.log('2. Avec onboarding@resend.dev, utilisez l\'email de votre compte Resend');
    process.exit(1);
  }

  // 2. Initialiser Resend
  console.log('\n2️⃣  Initialisation Resend...');
  const resend = new Resend(RESEND_API_KEY);
  console.log('   ✓ Client Resend initialisé');

  // 3. Envoyer un email de test
  console.log('\n3️⃣  Envoi d\'un email de test...');
  console.log(`   De: ${EMAIL_FROM}`);
  console.log(`   À: ${ARTIST_EMAIL}`);

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ARTIST_EMAIL,
      subject: '🎨 Test Resend - PeintureShop',
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
              📧 Email expéditeur : <code>${EMAIL_FROM}</code><br>
              🎨 Email artiste : <code>${ARTIST_EMAIL}</code>
            </p>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
            Vous pouvez maintenant tester le flow complet d'achat avec Stripe CLI.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Email de test envoyé par PeintureShop
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('\n❌ Erreur lors de l\'envoi:', error);

      if (error.message && error.message.includes('onboarding@resend.dev')) {
        console.log('\n💡 Note : Avec onboarding@resend.dev, vous pouvez uniquement envoyer');
        console.log('   des emails vers l\'adresse email de votre compte Resend.');
        console.log('\n   Assurez-vous que ARTIST_EMAIL correspond à l\'email de votre compte Resend.');
      }

      if (error.message && error.message.includes('API key')) {
        console.log('\n💡 La clé API semble invalide. Vérifiez:');
        console.log('   1. Que vous avez copié la clé complète');
        console.log('   2. Qu\'elle commence bien par "re_"');
        console.log('   3. Qu\'elle est active sur https://resend.com/api-keys');
      }

      if (error.message && error.message.includes('not')) {
        console.log('\n💡 Vérifiez que votre domaine/email est vérifié sur Resend');
      }

      process.exit(1);
    }

    console.log(`\n   ✓ Email envoyé avec succès !`);
    console.log(`   📧 Email ID: ${data?.id}`);
    console.log(`   📬 Destination: ${ARTIST_EMAIL}`);

    console.log('\n━'.repeat(50));
    console.log('\n✅ Configuration Resend validée avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Vérifiez votre boîte mail (peut prendre 1-2 minutes)');
    console.log('   2. Vérifiez aussi les spams si vous ne voyez rien');
    console.log('   3. Une fois reçu, testez le flow complet avec Stripe');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Exception lors du test:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Exécuter le test
testResend().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
