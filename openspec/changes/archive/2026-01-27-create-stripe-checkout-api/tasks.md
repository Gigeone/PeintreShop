# Tâches d'Implémentation : API Route Stripe Checkout

## Vue d'Ensemble

Cette liste ordonne les tâches pour créer la route `/api/checkout` qui initie les sessions de paiement Stripe. Chaque tâche est atomique, vérifiable et apporte une progression visible.

**Durée estimée totale :** 45-60 minutes

---

## Tâches

### 1. Créer les types TypeScript pour l'API Checkout

- [x] Créer le fichier `types/checkout.ts`
- [x] Définir l'interface `CheckoutRequestBody` (artworkId)
- [x] Définir l'interface `CheckoutSuccessResponse` (sessionId, url)
- [x] Définir l'interface `CheckoutErrorResponse` (error, message, code)
- [x] Exporter tous les types

**Validation :**
```bash
npx tsc --noEmit  # Pas d'erreur TypeScript
```

**Livrable :** `types/checkout.ts` avec types pour requête et réponse

**Structure attendue :**
```typescript
// types/checkout.ts
export interface CheckoutRequestBody {
  artworkId: string;
}

export interface CheckoutSuccessResponse {
  sessionId: string;
  url: string;
}

export interface CheckoutErrorResponse {
  error: string;
  message: string;
  code?: string;
}
```

---

### 2. Ajouter la variable d'environnement NEXT_PUBLIC_SITE_URL

- [x] Vérifier que `NEXT_PUBLIC_SITE_URL` est dans `.env.example`
- [x] Ajouter `NEXT_PUBLIC_SITE_URL` dans `.env.local` avec valeur locale
  ```
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- [x] Documenter dans `.env.example` que cette variable est requise pour les redirections Stripe

**Validation :**
```bash
grep "NEXT_PUBLIC_SITE_URL" .env.local
echo $NEXT_PUBLIC_SITE_URL  # Doit afficher l'URL
```

**Livrable :** Variable d'environnement configurée

**Note :** En production sur Vercel, cette variable doit pointer vers `https://votre-domaine.com`

---

### 3. Créer la route API /api/checkout

- [x] Créer le dossier `app/api/checkout/`
- [x] Créer `app/api/checkout/route.ts`
- [x] Implémenter la fonction `POST` avec :
  - Parsing du body JSON
  - Validation du champ `artworkId`
  - Import des types depuis `types/checkout.ts`
- [x] Ajouter la gestion d'erreurs pour données manquantes (400)
- [x] Retourner une réponse JSON typée

**Validation :**
```bash
npx tsc --noEmit  # Pas d'erreur TypeScript
```

**Livrable :** Route API de base avec validation des données d'entrée

**Structure attendue :**
```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CheckoutRequestBody, CheckoutSuccessResponse, CheckoutErrorResponse } from "@/types/checkout";

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();

    if (!body.artworkId) {
      return NextResponse.json(
        { error: "Bad Request", message: "artworkId is required" } as CheckoutErrorResponse,
        { status: 400 }
      );
    }

    // Suite de l'implémentation...
  } catch (error) {
    // Gestion d'erreurs...
  }
}
```

---

### 4. Implémenter la vérification de disponibilité de l'œuvre

- [x] Importer le client Sanity (`lib/sanity/client.ts`)
- [x] Créer une requête GROQ pour récupérer l'œuvre par ID avec `isAvailable`
- [x] Vérifier que l'œuvre existe (sinon erreur 404)
- [x] Vérifier que `isAvailable === true` (sinon erreur 410 Gone)
- [x] Récupérer les données nécessaires : title, price, imageUrl, slug

**Validation :**
```bash
# Test avec une œuvre existante et disponible → doit continuer
# Test avec une œuvre inexistante → doit retourner 404
# Test avec une œuvre vendue → doit retourner 410
```

**Livrable :** Logique de vérification de stock implémentée

**Code attendu :**
```typescript
// Récupérer l'œuvre depuis Sanity
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

if (!artwork) {
  return NextResponse.json(
    { error: "Not Found", message: "Artwork not found" } as CheckoutErrorResponse,
    { status: 404 }
  );
}

if (!artwork.isAvailable) {
  return NextResponse.json(
    { error: "Gone", message: "This artwork is no longer available" } as CheckoutErrorResponse,
    { status: 410 }
  );
}
```

---

### 5. Implémenter la création de la session Stripe Checkout

- [x] Importer le client Stripe (`lib/stripe.ts`)
- [x] Créer une session Stripe Checkout avec :
  - `mode: "payment"`
  - `line_items` avec nom, prix, quantité (1), image de l'œuvre
  - `success_url` et `cancel_url` avec `NEXT_PUBLIC_SITE_URL`
  - `metadata` avec `artworkId` et `artworkSlug`
  - `payment_method_types: ["card"]`
  - `currency: "eur"`
- [x] Gérer les erreurs Stripe (try/catch)
- [x] Retourner `sessionId` et `url` en JSON

**Validation :**
```bash
npm run dev
# Tester avec curl ou Postman
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"artworkId": "un-id-valide"}'
# Doit retourner sessionId et url
```

**Livrable :** Session Stripe créée et URL retournée

**Code attendu :**
```typescript
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: artwork.title,
          images: [artwork.imageUrl],
        },
        unit_amount: artwork.price * 100, // Convertir en centimes
      },
      quantity: 1,
    },
  ],
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/oeuvres/${artwork.slug.current}`,
  metadata: {
    artworkId: artwork._id,
    artworkSlug: artwork.slug.current,
  },
});

return NextResponse.json({
  sessionId: session.id,
  url: session.url,
} as CheckoutSuccessResponse);
```

---

### 6. Ajouter la gestion d'erreurs complète

- [x] Wrapper tous les appels Stripe dans try/catch
- [x] Gérer les erreurs spécifiques :
  - `JSON.parse` error → 400 Bad Request
  - Artwork not found → 404 Not Found
  - Artwork not available → 410 Gone
  - Stripe errors → 500 Internal Server Error
- [x] Logger les erreurs serveur avec `console.error`
- [x] Retourner des messages d'erreur clairs sans exposer de détails sensibles

**Validation :**
```bash
# Tester tous les cas d'erreur
# 400: artworkId manquant
# 404: artworkId inexistant
# 410: artwork.isAvailable = false
# 500: clé Stripe invalide (simuler)
```

**Livrable :** Gestion d'erreurs robuste

---

### 7. Tests et validation finale

- [ ] Tester avec une œuvre disponible → doit créer une session (voir CHECKOUT_API_TESTING.md)
- [ ] Tester avec une œuvre indisponible → doit retourner 410 (voir CHECKOUT_API_TESTING.md)
- [ ] Tester avec un ID invalide → doit retourner 404 (voir CHECKOUT_API_TESTING.md)
- [ ] Tester sans artworkId → doit retourner 400 (voir CHECKOUT_API_TESTING.md)
- [ ] Vérifier que l'URL retournée est valide (commence par `https://checkout.stripe.com/`)
- [ ] Vérifier que les metadata sont présentes dans le dashboard Stripe
- [ ] Exécuter le build de production : `npm run build`
- [ ] Exécuter le linter : `npm run lint`

**Note** : Les tests doivent être exécutés par l'utilisateur. Un guide complet est disponible dans `CHECKOUT_API_TESTING.md`.

**Validation :**
- ✅ Tous les cas de test passent
- ✅ Session visible dans Stripe Dashboard (https://dashboard.stripe.com/test/payments)
- ✅ Build production sans erreur
- ✅ Pas d'erreur ESLint

**Livrable :** Route `/api/checkout` complète et testée

---

## Dépendances entre Tâches

```
1. Créer types TypeScript
   ↓
2. Configurer NEXT_PUBLIC_SITE_URL
   ↓
3. Créer route API de base
   ↓
4. Vérification disponibilité œuvre (Sanity)
   ↓
5. Création session Stripe
   ↓
6. Gestion d'erreurs complète
   ↓
7. Tests et validation
```

**Toutes les tâches doivent être exécutées séquentiellement.**

---

## Travail Parallélisable

Aucune tâche n'est parallélisable dans cette étape car chaque étape dépend de la précédente.

---

## Notes d'Implémentation

### Conversion Prix en Centimes

Stripe attend les montants en **centimes** (ou plus petite unité de la devise).
```typescript
// Si price = 250 (euros)
unit_amount: artwork.price * 100  // = 25000 (centimes)
```

### URLs de Redirection

**Success URL** : Inclure `{CHECKOUT_SESSION_ID}` pour récupération ultérieure
```typescript
success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
```

Stripe remplacera automatiquement `{CHECKOUT_SESSION_ID}` par l'ID réel de la session.

**Cancel URL** : Retour vers la fiche œuvre
```typescript
cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/oeuvres/${artwork.slug.current}`
```

### Metadata Stripe

Les metadata permettent de lier la session Stripe à l'œuvre :
```typescript
metadata: {
  artworkId: artwork._id,  // Pour mise à jour Sanity via webhook
  artworkSlug: artwork.slug.current,  // Pour redirection
}
```

Ces données seront récupérées dans le webhook (étape 3).

### Gestion des Slugs Sanity

Sanity stocke les slugs comme `{current: "slug-value"}`. Accéder avec :
```typescript
artwork.slug.current  // ✅ Correct
artwork.slug          // ❌ Retourne {current: "..."}
```

### Validation de NEXT_PUBLIC_SITE_URL

Ajouter une validation au démarrage de l'API :
```typescript
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required for checkout URLs");
}
```

---

## Critères de Complétion

Cette étape est considérée comme terminée quand :
- [x] Toutes les 7 tâches ci-dessus sont cochées
- [x] Route `/api/checkout` fonctionnelle avec tous les cas d'erreur
- [x] Session Stripe créée et visible dans le dashboard
- [x] `npm run build` passe sans erreur ni warning
- [x] `npm run lint` ne retourne aucune erreur

---

## Prochaines Étapes (hors scope)

Après validation de cette API :
- **Étape 3** : Créer `/api/webhook` pour écouter les paiements réussis et mettre à jour `isAvailable: false` dans Sanity
- **Étape 4** : Remplacer le bouton "Acheter" pour appeler `/api/checkout` et rediriger vers Stripe
- **Sprint 2** : Emails de confirmation après paiement
