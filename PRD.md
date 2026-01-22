# 🧱 Roadmap Produit — Site e-commerce pour une peintre

## Vue d’ensemble

Objectif :  
Construire un site moderne permettant d’exposer des œuvres et de les vendre en ligne, en avançant par paliers clairs pour éviter la sur-complexité.

- MVP → Prototype crédible (sans backend lourd)
- V1 → Produit réellement vendable
- V2 → Produit pro & scalable

---

## 🚀 MVP — Prototype vendable “minimum vital”

Durée estimée : 3–5 jours  
Objectif business :  
Montrer un site crédible à la peintre, valider l’UX, préparer la vente  
Sans backend lourd, sans paiement réel

### Fonctionnalités

#### Pages

- Accueil
- Galerie
- Fiche œuvre
- À propos
- Contact

#### Contenu

- Données mockées (JSON / TypeScript)
- Cloudinary
- Textes provisoires

#### UX

- Responsive
- Navigation fluide
- Galerie propre
- Fiches œuvres lisibles
- Bouton “Acheter” → formulaire de contact

#### Tech

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- SEO basique (metadata)
- Déploiement Vercel

### Ce que le MVP ne fait PAS

- Pas de paiement
- Pas de CMS
- Pas de stock réel
- Pas de compte admin
- Pas d’emails automatiques

---

## 🧩 V1 — Produit réel vendable

Durée estimée : 6–10 jours  
Objectif business :  
Permettre de vraies ventes

- autonomie minimale pour l’artiste

### Fonctionnalités

#### CMS

- Sanity Studio
- Schémas :
  - oeuvre
  - page
  - siteSettings

#### Front

- Galerie connectée à Sanity
- Fiches œuvres dynamiques
- Images optimisées (Sanity)
- Gestion du stock :
  - 1 œuvre = 1 vente
  - champ isAvailable

#### Paiement

- Stripe Checkout
- API route /api/checkout
- Webhook Stripe → Sanity
- Désactivation automatique après vente

#### Emails

- Confirmation client
- Notification peintre

#### SEO

- Métadonnées dynamiques
- Slugs propres
- Open Graph

### Ce que la V1 ne fait PAS

- Pas de dashboard ventes
- Pas d’historique commandes côté admin
- Pas de multilingue
- Pas de facturation PDF
- Pas de statistiques

---

## ✨ V2 — Produit pro & scalable

Durée estimée : 8–15 jours  
Objectif business :  
Passer d’un “site qui vend”  
à un vrai produit e-commerce stable

### Fonctionnalités

#### Admin

- Dashboard ventes
- Historique commandes
- Filtres (date, statut)
- Export CSV

#### E-commerce

- Codes promo
- Frais de livraison
- Taxes
- Factures PDF
- Gestion des retours

#### Contenu

- Blog / actualités
- Page presse / expositions
- Multilingue
- SEO avancé :
  - sitemap
  - schema.org
  - rich snippets

#### Tech

- Monitoring (Sentry)
- Logs Stripe
- Backups Sanity
- Cache ISR
- Optimisation des performances
