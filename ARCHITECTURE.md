# 🏗️ Architecture Technique

> **Site e-commerce pour une artiste peintre**

Ce document décrit **comment** le site est construit techniquement. Pour les fonctionnalités produit et la roadmap, voir [@PRD.md](./PRD.md).

---

## 1️⃣ Stack principale

| Categorie   | Technologie                               | Rôle / Utilisation                                          |
| ----------- | ----------------------------------------- | ----------------------------------------------------------- |
| Frontend    | **Next.js (App Router)**                  | Framework React pour SPA + SSR, pages dynamiques et SSG/ISR |
| Typage      | **TypeScript**                            | Sécurité et maintenabilité du code                          |
| Styling     | **Tailwind CSS**                          | Rapidité de prototypage et design responsive                |
| CMS         | **Sanity**                                | Gestion des œuvres, pages, images et contenus dynamiques    |
| Images      | **Sanity Assets / Cloudinary**            | Stockage et optimisation des images                         |
| Paiement    | **Stripe Checkout**                       | Paiement sécurisé, webhook pour mise à jour stock           |
| Déploiement | **Vercel**                                | Hosting Next.js, intégration continue, CDN                  |
| Emails      | **API ou service externe (ex: SendGrid)** | Notifications automatiques client et peintre                |

---

## 2️⃣ Architecture des données

### Schémas Sanity

#### `oeuvre`

- `title: string` → Nom de l’œuvre
- `slug: string` → URL unique
- `description: string`
- `price: number`
- `image: image`
- `isAvailable: boolean`
- `dimensions: string`
- `technique: string`

#### `page`

- `title: string`
- `slug: string`
- `content: richText`

#### `siteSettings`

- `siteTitle: string`
- `metaDescription: string`
- `socialLinks: array`
- `contactEmail: string`

---

## 3️⃣ Architecture Frontend

- Pages principales :
  - `/` → Home
  - `/galerie` → Liste des œuvres
  - `/oeuvres/[slug]` → Fiche produit
  - `/a-propos` → Biographie artiste
  - `/contact` → Formulaire de contact
- Layout global :
  - Header / Footer
  - Navigation responsive
  - SEO metadata dynamique
- Gestion des images :
  - `next/image` pour optimisation automatique
  - Sanity Asset URL ou Cloudinary selon le stage
- Gestion des données :
  - `lib/sanity.ts` → Client Sanity centralisé
  - Types TypeScript stricts
  - Hooks ou fetchers pour récupérer les œuvres dynamiquement
- Responsiveness & UX :
  - Tailwind mobile-first
  - Galerie avec lightbox optionnelle
  - Bouton “Acheter” → call-to-action clair

---

## 4️⃣ Architecture Backend / API

- API routes Next.js :
  - `/api/checkout` → création session Stripe
  - `/api/webhook` → réception webhook Stripe → mise à jour `isAvailable` dans Sanity
- Webhooks Stripe :
  - Désactivation automatique d’une œuvre vendue
  - Envoi email automatique
- Sanity Studio :
  - CRUD pour œuvres et pages
  - Upload images
  - Gestion du stock `isAvailable`

---

## 5️⃣ Flux de données / schéma fonctionnel

[Artiste / Admin] -> Sanity Studio -> [Sanity DB / Assets]
[Frontend Next.js] -> Sanity Client -> Récupération œuvres / pages
[Client] -> Next.js Pages -> Consultation / Stripe Checkout
[Stripe] -> Webhook Next.js -> Mise à jour stock Sanity
[Emails] -> API / Service -> Notifications client et artiste

---

## 6️⃣ Découpage par features

| Feature             | Stack utilisée                   | Remarques                                  |
| ------------------- | -------------------------------- | ------------------------------------------ |
| Galerie d’œuvres    | Next.js + Sanity                 | Images optimisées, responsive              |
| Fiche produit       | Next.js + Sanity                 | Affiche détail, dimensions, prix, stock    |
| CMS admin           | Sanity Studio                    | CRUD œuvres et pages, upload images        |
| Paiement            | Stripe Checkout                  | Session checkout + webhook stock           |
| Emails              | SendGrid / API                   | Confirmation client + notification artiste |
| SEO                 | Next.js metadata + Open Graph    | Pages dynamiques + sitemap optionnel       |
| Optimisation images | next/image + Sanity / Cloudinary | Compression et responsive                  |
| Responsive design   | Tailwind CSS                     | Mobile-first, layout flexible              |
| Déploiement         | Vercel                           | CI/CD automatique + CDN                    |
| Statut stock        | Sanity `isAvailable`             | Vérification avant paiement                |

---

## 7️⃣ Déploiement

- **Vercel** :
  - Build automatique sur push GitHub main / master
  - Preview deploys pour chaque branche
  - CDN mondial pour le site
- **Variables d’environnement** (`.env.local`) :
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `SANITY_API_TOKEN`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- **Monitoring / logs** :
  - Sentry pour erreurs JS
  - Stripe logs pour paiements

---

## 8️⃣ Évolutivité

- Ajout de pages ou œuvres = sans refactor front
- Passage à multilingue → Next.js i18n + Sanity
- Dashboard ventes / stats → Phase V2
- Optimisation image avancée → Cloudinary ou Sanity transformations

---
