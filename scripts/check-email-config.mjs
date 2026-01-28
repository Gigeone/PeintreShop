/**
 * Script de vérification de la configuration email
 * Lit directement le fichier .env.local
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lire .env.local
function loadEnvFile() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const content = readFileSync(envPath, 'utf-8');
    const env = {};

    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        env[key.trim()] = valueParts.join('=').trim();
      }
    });

    return env;
  } catch (error) {
    console.error('❌ Impossible de lire .env.local:', error.message);
    return {};
  }
}

const env = loadEnvFile();

console.log('\n🔍 Vérification de la configuration email\n');
console.log('='.repeat(60));

// Vérifier les variables d'environnement
const checks = {
  'RESEND_API_KEY': {
    value: env.RESEND_API_KEY,
    required: true,
    description: 'Clé API Resend pour envoyer des emails'
  },
  'EMAIL_FROM': {
    value: env.EMAIL_FROM,
    required: true,
    description: 'Adresse email expéditrice (vérifiée sur Resend)'
  },
  'ARTIST_EMAIL': {
    value: env.ARTIST_EMAIL,
    required: false,
    description: 'Email de l\'artiste pour les notifications'
  }
};

let allGood = true;
let warnings = 0;

console.log('\n📋 Variables d\'environnement:\n');

for (const [key, info] of Object.entries(checks)) {
  const exists = !!(info.value && info.value !== 'xxxxxxxxxxxxxxxxxxxxx' && !info.value.includes('votre-domaine'));
  const status = exists ? '✅' : (info.required ? '❌' : '⚠️');

  let displayValue = 'Non configuré';
  if (info.value) {
    if (info.value === 'xxxxxxxxxxxxxxxxxxxxx' || info.value.includes('votre-domaine')) {
      displayValue = 'Valeur d\'exemple (non configuré)';
    } else if (key.includes('KEY') || key.includes('SECRET')) {
      displayValue = info.value.substring(0, 10) + '...' + info.value.substring(info.value.length - 4);
    } else {
      displayValue = info.value;
    }
  }

  console.log(`${status} ${key}`);
  console.log(`   Valeur: ${displayValue}`);
  console.log(`   Description: ${info.description}`);
  console.log();

  if (!exists && info.required) {
    allGood = false;
  } else if (!exists && !info.required) {
    warnings++;
  }
}

console.log('='.repeat(60));

// Résumé
if (allGood && warnings === 0) {
  console.log('\n✅ Configuration complète - Emails opérationnels\n');
  console.log('Les emails seront envoyés lors des ventes via le webhook Stripe.\n');
} else if (!allGood) {
  console.log('\n❌ Configuration incomplète - Emails désactivés\n');
  console.log('Pour activer les emails:');
  console.log('1. Créer un compte sur https://resend.com');
  console.log('2. Obtenir une clé API (commence par re_...)');
  console.log('3. Vérifier un domaine ou email expéditeur');
  console.log('4. Ajouter dans .env.local:');
  console.log('');
  console.log('   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx');
  console.log('   EMAIL_FROM=noreply@votre-domaine.com');
  console.log('   ARTIST_EMAIL=artiste@votre-domaine.com');
  console.log('');
  console.log('5. Redémarrer Next.js: npm run dev');
  console.log('\n📖 Guide complet: EMAIL_SETUP.md\n');
} else if (warnings > 0) {
  console.log('\n⚠️  Configuration partielle\n');
  console.log('Les emails clients seront envoyés, mais pas les notifications artiste.');
  console.log('Ajoutez ARTIST_EMAIL dans .env.local pour activer les notifications.\n');
}

// Test de connexion au serveur
console.log('🌐 Test de connexion au serveur Next.js...');

try {
  const response = await fetch('http://localhost:3000', { signal: AbortSignal.timeout(5000) });
  if (response.ok) {
    console.log('✅ Serveur Next.js actif sur http://localhost:3000\n');
  } else {
    console.log(`⚠️  Serveur répond avec status ${response.status}\n`);
  }
} catch (error) {
  console.log('❌ Serveur Next.js non accessible');
  console.log('   Lancez le serveur avec: npm run dev\n');
}

console.log('='.repeat(60));
console.log('\n💡 Pour tester le système d\'emails:');
console.log('   1. Assurez-vous que la configuration est complète ci-dessus');
console.log('   2. Installez Stripe CLI: https://stripe.com/docs/stripe-cli');
console.log('   3. Lancez: stripe listen --forward-to http://localhost:3000/api/webhook');
console.log('   4. Déclenchez un test: stripe trigger checkout.session.completed');
console.log('   5. Vérifiez votre boîte mail\n');
