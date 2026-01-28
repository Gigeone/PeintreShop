# Tâches d'Implémentation : Webhook Stripe

## Vue d'Ensemble

Cette liste ordonne les tâches pour créer la route `/api/webhook` qui reçoit les événements Stripe et met à jour automatiquement le stock dans Sanity. Chaque tâche est atomique, vérifiable et apporte une progression visible.

**Durée estimée totale :** 60-90 minutes

---

## Tâches

### 1. Créer les types TypeScript pour les webhooks

- [ ] Créer le fichier `types/webhook.ts`
- [ ] Définir l'interface `WebhookEventBody` pour les événements Stripe
- [ ] Définir l'interface `CheckoutSessionCompleted` pour le payload spécifique
- [ ] Exporter tous les types

**Validation :**
```bash
npx tsc --noEmit  # Pas d'erreur TypeScript
```

**Livrable :** `types/webhook.ts` avec types pour événements webhook

**Structure attendue :**
```typescript
// types/webhook.ts
import Stripe from "stripe";

export interface WebhookEventBody {
  id: string;
  type: string;
  data: {
    object: Stripe.Checkout.Session;
  };
}

export interface ArtworkMetadata {
  artworkId: string;
  artworkSlug: string;
}
```

---

### 2. Configurer la variable STRIPE_WEBHOOK_SECRET

- [ ] Vérifier que `STRIPE_WEBHOOK_SECRET` est dans `.env.example`
- [ ] Obtenir le webhook secret depuis Stripe Dashboard ou Stripe CLI
  ```bash
  # Option A: Stripe CLI (développement local)
  stripe listen --print-secret

  # Option B: Stripe Dashboard (production)
  # https://dashboard.stripe.com/webhooks → Add endpoint → Copier le secret
  ```
- [ ] Ajouter `STRIPE_WEBHOOK_SECRET` dans `.env.local`
- [ ] Documenter que ce secret est différent entre dev (CLI) et prod (Dashboard)

**Validation :**
```bash
grep "STRIPE_WEBHOOK_SECRET" .env.local
# Doit afficher : STRIPE_WEBHOOK_SECRET=whsec_...
```

**Livrable :** Variable d'environnement configurée

**Note importante :**
- **Développement local** : Utiliser Stripe CLI `stripe listen --forward-to localhost:3000/api/webhook`
- **Production (Vercel)** : Configurer le webhook dans Stripe Dashboard pointant vers `https://votre-domaine.com/api/webhook`

---

### 3. Créer la route API /api/webhook de base

- [ ] Créer le dossier `app/api/webhook/`
- [ ] Créer `app/api/webhook/route.ts`
- [ ] Implémenter la fonction `POST` avec :
  - Lecture du body brut (via `request.text()`)
  - Récupération du header `stripe-signature`
  - Validation basique (signature et body présents)
  - Import des types depuis `types/webhook.ts`
- [ ] Retourner une réponse JSON temporaire

**Validation :**
```bash
npx tsc --noEmit  # Pas d'erreur TypeScript
```

**Livrable :** Route API de base qui reçoit les requêtes

**Structure attendue :**
```typescript
// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Suite de l'implémentation...
}
```

**Note importante** : Ne pas utiliser `request.json()` car Stripe requiert le body brut pour la vérification de signature.

---

### 4. Implémenter la validation de signature Stripe

- [ ] Utiliser `stripe.webhooks.constructEvent()` pour valider la signature
- [ ] Gérer le cas où `STRIPE_WEBHOOK_SECRET` n'est pas configuré
- [ ] Gérer les erreurs de signature invalide (retourner 400)
- [ ] Logger les erreurs de signature pour debugging
- [ ] Extraire l'événement typé après validation

**Validation :**
```bash
# Test avec Stripe CLI
stripe listen --forward-to http://localhost:3000/api/webhook

# Dans un autre terminal
stripe trigger checkout.session.completed
# Doit afficher "Event received" dans les logs Next.js
```

**Livrable :** Validation de signature fonctionnelle

**Code attendu :**
```typescript
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.error("STRIPE_WEBHOOK_SECRET is not configured");
  return NextResponse.json(
    { error: "Webhook secret not configured" },
    { status: 500 }
  );
}

let event: Stripe.Event;

try {
  event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
} catch (err) {
  console.error("Webhook signature verification failed:", err);
  return NextResponse.json(
    { error: "Invalid signature" },
    { status: 400 }
  );
}
```

---

### 5. Filtrer l'événement checkout.session.completed

- [ ] Vérifier que `event.type === "checkout.session.completed"`
- [ ] Extraire l'objet session de `event.data.object`
- [ ] Vérifier que `session.payment_status === "paid"`
- [ ] Extraire les metadata (artworkId, artworkSlug)
- [ ] Valider que `artworkId` est présent dans les metadata
- [ ] Retourner 200 pour les autres types d'événements (ignorer)

**Validation :**
```bash
# Envoyer différents types d'événements
stripe trigger payment_intent.succeeded  # Doit ignorer
stripe trigger checkout.session.completed  # Doit traiter
```

**Livrable :** Filtrage des événements correct

**Code attendu :**
```typescript
// Ignorer les événements non pertinents
if (event.type !== "checkout.session.completed") {
  console.log(`Ignoring event type: ${event.type}`);
  return NextResponse.json({ received: true });
}

const session = event.data.object as Stripe.Checkout.Session;

// Vérifier que le paiement est bien confirmé
if (session.payment_status !== "paid") {
  console.log(`Session ${session.id} not paid yet: ${session.payment_status}`);
  return NextResponse.json({ received: true });
}

// Extraire les metadata
const artworkId = session.metadata?.artworkId;
if (!artworkId) {
  console.error("No artworkId in session metadata:", session.id);
  return NextResponse.json({ error: "Missing artworkId" }, { status: 400 });
}
```

---

### 6. Implémenter la mise à jour Sanity avec protection race condition

- [ ] Importer le client Sanity (`lib/sanity/client.ts`)
- [ ] Récupérer l'œuvre depuis Sanity par ID
- [ ] Vérifier que l'œuvre existe (sinon erreur 500)
- [ ] Vérifier que `isAvailable === true` (protection race condition)
- [ ] Si déjà vendue : logger et retourner 200 (idempotence)
- [ ] Mettre à jour `isAvailable: false` via `client.patch()`
- [ ] Logger le succès de la mise à jour

**Validation :**
```bash
# Test complet : créer session → payer → vérifier Sanity
# L'œuvre doit avoir isAvailable: false après paiement
```

**Livrable :** Mise à jour Sanity fonctionnelle avec protection

**Code attendu :**
```typescript
// Récupérer l'œuvre
const artwork = await client.fetch(
  `*[_type == "artwork" && _id == $artworkId][0]{
    _id,
    title,
    isAvailable
  }`,
  { artworkId }
);

if (!artwork) {
  console.error(`Artwork not found: ${artworkId}`);
  return NextResponse.json(
    { error: "Artwork not found" },
    { status: 500 }
  );
}

// Protection race condition
if (!artwork.isAvailable) {
  console.log(`Artwork ${artworkId} already sold, ignoring webhook`);
  return NextResponse.json({ received: true, already_sold: true });
}

// Mettre à jour
await client.patch(artworkId).set({ isAvailable: false }).commit();

console.log(`✓ Artwork ${artworkId} (${artwork.title}) marked as sold`);
```

---

### 7. Ajouter la gestion d'erreurs complète

- [ ] Wrapper tous les appels Sanity dans try/catch
- [ ] Gérer les erreurs spécifiques :
  - Erreur signature → 400 Bad Request
  - Metadata manquante → 400 Bad Request
  - Erreur Sanity (réseau, permissions) → 500 Internal Server Error
  - Œuvre introuvable → 500 Internal Server Error
- [ ] Logger toutes les erreurs avec détails
- [ ] Retourner 500 en cas d'échec pour déclencher retry Stripe
- [ ] Retourner 200 en cas de succès ou cas idempotent

**Validation :**
```bash
# Simuler différentes erreurs :
# - Désactiver Sanity temporairement → doit retourner 500
# - Envoyer metadata invalide → doit retourner 400
# - Artwork déjà vendu → doit retourner 200
```

**Livrable :** Gestion d'erreurs robuste

**Code attendu :**
```typescript
try {
  // ... code de mise à jour Sanity
} catch (error) {
  console.error("Failed to update artwork:", error);

  // Retourner 500 pour que Stripe réessaye
  return NextResponse.json(
    { error: "Failed to update artwork availability" },
    { status: 500 }
  );
}

// Succès
return NextResponse.json({
  received: true,
  artworkId,
  updated: true
});
```

---

### 8. Tests et validation finale

- [ ] Tester avec Stripe CLI en local :
  ```bash
  # Terminal 1
  npm run dev

  # Terminal 2
  stripe listen --forward-to http://localhost:3000/api/webhook

  # Terminal 3
  stripe trigger checkout.session.completed --override checkout_session:metadata[artworkId]=REAL_ARTWORK_ID
  ```
- [ ] Vérifier que l'œuvre est marquée `isAvailable: false` dans Sanity
- [ ] Tester la protection race condition :
  - Marquer une œuvre comme vendue manuellement
  - Envoyer un webhook pour cette œuvre
  - Vérifier que le webhook retourne 200 sans erreur
- [ ] Vérifier les logs serveur pour tous les cas (succès, erreur, idempotence)
- [ ] Tester un checkout complet de bout en bout :
  - Créer session via `/api/checkout`
  - Payer via Stripe (carte test)
  - Vérifier webhook reçu et traité
  - Vérifier œuvre indisponible dans Sanity
- [ ] Exécuter le build de production : `npm run build`
- [ ] Exécuter le linter : `npm run lint`
- [ ] Documenter la configuration du webhook en production (Vercel)

**Validation finale :**
- ✅ Webhook reçoit et traite `checkout.session.completed`
- ✅ Signature Stripe validée correctement
- ✅ Œuvre marquée indisponible après paiement
- ✅ Protection race condition fonctionne
- ✅ Logs clairs pour debugging
- ✅ Build production sans erreur
- ✅ Pas d'erreur ESLint

**Livrable :** Route `/api/webhook` complète et testée

---

## Dépendances entre Tâches

```
1. Créer types TypeScript
   ↓
2. Configurer STRIPE_WEBHOOK_SECRET
   ↓
3. Créer route API de base
   ↓
4. Validation signature Stripe
   ↓
5. Filtrer événement checkout.session.completed
   ↓
6. Mise à jour Sanity avec protection
   ↓
7. Gestion d'erreurs complète
   ↓
8. Tests et validation
```

**Toutes les tâches doivent être exécutées séquentiellement.**

---

## Travail Parallélisable

Aucune tâche n'est parallélisable dans cette étape car chaque étape dépend de la précédente.

---

## Notes d'Implémentation

### Body Brut vs JSON

Stripe requiert le body **brut** (string) pour la validation de signature :
```typescript
const body = await request.text();  // ✅ Correct
const body = await request.json();  // ❌ Échoue la validation
```

### Événements Stripe

Seul l'événement `checkout.session.completed` est traité. Les autres événements sont ignorés avec un 200 :
```typescript
if (event.type !== "checkout.session.completed") {
  return NextResponse.json({ received: true });
}
```

### Idempotence

Le webhook doit être **idempotent** : recevoir le même événement plusieurs fois ne doit pas causer d'erreur :
```typescript
if (!artwork.isAvailable) {
  // Déjà vendue, retourner succès
  return NextResponse.json({ received: true, already_sold: true });
}
```

### Retry Stripe

Stripe réessaye automatiquement les webhooks qui retournent 5xx ou timeout :
- **Immédiatement** puis avec backoff exponentiel
- **Jusqu'à 3 jours** maximum
- Visible dans le Dashboard Stripe

### Configuration Production

**Développement** :
```bash
stripe listen --forward-to http://localhost:3000/api/webhook
```

**Production (Vercel)** :
1. Dashboard Stripe → Webhooks → Add endpoint
2. URL : `https://votre-domaine.vercel.app/api/webhook`
3. Événements : `checkout.session.completed`
4. Copier le webhook secret
5. Ajouter à Vercel Environment Variables : `STRIPE_WEBHOOK_SECRET=whsec_...`

### Logging

Logger tous les événements importants :
```typescript
console.log(`✓ Webhook received: ${event.type} (${event.id})`);
console.log(`✓ Processing payment for artwork: ${artworkId}`);
console.log(`✓ Artwork ${artworkId} marked as sold`);
console.error(`✗ Failed to update artwork:`, error);
```

---

## Critères de Complétion

Cette étape est considérée comme terminée quand :
- [ ] Toutes les 8 tâches ci-dessus sont cochées
- [ ] Route `/api/webhook` fonctionnelle avec validation signature
- [ ] Œuvres automatiquement marquées indisponibles après paiement
- [ ] Protection race condition implémentée et testée
- [ ] `npm run build` passe sans erreur ni warning
- [ ] `npm run lint` ne retourne aucune erreur

---

## Prochaines Étapes (hors scope)

Après validation de ce webhook :
- **Étape 4** : Intégration frontend - Remplacer bouton contact par appel à `/api/checkout`
- **Sprint 2** : Emails de confirmation (client et artiste)
- **V2** : Dashboard admin pour monitoring des webhooks

---

## Troubleshooting

### Erreur "No signature"
- Vérifier que Stripe CLI est démarré : `stripe listen --forward-to ...`
- Vérifier que le header `stripe-signature` est bien présent

### Erreur "Invalid signature"
- Vérifier que `STRIPE_WEBHOOK_SECRET` correspond au secret actuel
- Régénérer le secret si nécessaire : `stripe listen --print-secret`
- En production, vérifier que le secret du Dashboard est utilisé

### Artwork not found
- Vérifier que les metadata de session contiennent bien `artworkId`
- Vérifier que l'ID correspond à une œuvre existante dans Sanity

### Webhook non reçu
- Vérifier que le serveur Next.js tourne (`npm run dev`)
- Vérifier que Stripe CLI forward vers la bonne URL
- Vérifier les logs Stripe CLI pour les erreurs de connexion

### Sanity update fails
- Vérifier que `SANITY_API_TOKEN` a les permissions d'écriture
- Vérifier la connexion réseau à Sanity
- Check logs serveur pour détails d'erreur
