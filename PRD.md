# 🧱 Product Requirements Document (PRD)

> **Site e-commerce pour une artiste peintre**

## Vue d'ensemble

**Objectif produit :**
Construire un site moderne permettant d'exposer et vendre des œuvres originales en ligne, en avançant par paliers clairs pour éviter la sur-complexité.

**Approche :**
Développement itératif en 3 phases pour livrer de la valeur rapidement tout en évitant le sur-engineering.

- **MVP** → Prototype crédible (validation UX, pas de backend lourd)
- **V1** → Produit vendable (paiements réels, CMS, autonomie artiste)
- **V2** → Plateforme professionnelle (dashboard, statistiques, features avancées)

> 📐 Pour l'architecture technique, voir [@ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🚀 MVP — Prototype vendable "minimum vital"

**Durée estimée :** 3–5 jours

**Objectif business :**
- Montrer un site crédible à l'artiste
- Valider l'UX et le design
- Préparer la vente sans infrastructure lourde

### Fonctionnalités

#### Pages
- ✅ Accueil avec présentation de l'artiste
- ✅ Galerie d'œuvres avec filtres visuels
- ✅ Fiche détaillée par œuvre (titre, technique, dimensions, prix)
- ✅ Page "À propos" (biographie artiste)
- ✅ Page "Contact" (formulaire simple)

#### Contenu
- Données mockées (JSON statique)
- Images optimisées (Cloudinary ou assets statiques)
- Textes provisoires mais crédibles

#### Expérience Utilisateur
- Design responsive (mobile, tablette, desktop)
- Navigation fluide entre les pages
- Galerie élégante et épurée
- Fiches œuvres lisibles et attrayantes
- Bouton "Acheter" → redirection vers formulaire de contact

### ❌ Ce que le MVP ne fait PAS
- Pas de paiement en ligne
- Pas de CMS (contenu en dur dans le code)
- Pas de gestion de stock dynamique
- Pas de compte administrateur
- Pas d'emails automatiques
- Pas de transactions réelles

---

## 🧩 V1 — Produit réellement vendable

**Durée estimée :** 6–10 jours

**Objectif business :**
- Permettre de vraies ventes en ligne avec paiement sécurisé
- Donner l'autonomie minimale à l'artiste pour gérer son catalogue
- Automatiser la gestion du stock après chaque vente

### Fonctionnalités

#### CMS Headless
- Interface d'administration pour gérer les œuvres
- Gestion du catalogue (création, modification, suppression)
- Upload d'images avec optimisation automatique
- Gestion du statut de disponibilité (disponible / vendu)
- Schémas de contenu :
  - Œuvres (titre, description, technique, dimensions, prix, image, disponibilité)
  - Pages éditoriales (À propos, Contact, etc.)
  - Paramètres du site (métadonnées, réseaux sociaux)

#### Frontend Dynamique
- Galerie connectée au CMS en temps réel
- Fiches œuvres générées dynamiquement
- Images optimisées et responsive
- Gestion intelligente du stock :
  - Une œuvre = une vente unique
  - Désactivation automatique après achat
  - Indication visuelle "Disponible" / "Vendu"

#### Paiement Sécurisé
- Checkout en ligne avec Stripe
- Paiement par carte bancaire sécurisé
- Webhooks pour synchroniser le stock après paiement
- Désactivation automatique de l'œuvre vendue dans le CMS

#### Notifications Email
- Email de confirmation de commande au client
- Notification de vente à l'artiste avec détails
- Templates professionnels

#### SEO Avancé
- Métadonnées dynamiques par page
- URLs propres et SEO-friendly (slugs)
- Balises Open Graph pour réseaux sociaux
- Twitter Cards pour partages
- Sitemap dynamique
- Schema.org (Product, Organization)

### ❌ Ce que la V1 ne fait PAS
- Pas de dashboard de ventes avec statistiques
- Pas d'historique complet des commandes
- Pas de support multilingue
- Pas de génération de factures PDF
- Pas d'analytics intégré
- Pas de gestion des retours/remboursements
- Pas de codes promo ou réductions

---

## ✨ V2 — Plateforme professionnelle & scalable

**Durée estimée :** 8–15 jours

**Objectif business :**
- Passer d'un "site qui vend" à une vraie plateforme e-commerce professionnelle
- Donner des outils d'analyse et de gestion à l'artiste
- Améliorer l'expérience client avec des fonctionnalités avancées
- Assurer la fiabilité et la performance du site

### Fonctionnalités

#### Dashboard Administrateur
- Vue d'ensemble des ventes (graphiques, métriques)
- Historique complet des commandes
- Filtres avancés (par date, statut, montant)
- Export des données (CSV, Excel)
- Statistiques de fréquentation (pages vues, conversions)
- Gestion des stocks et inventaire

#### E-commerce Avancé
- Système de codes promo et réductions
- Calcul automatique des frais de livraison
- Gestion des taxes (TVA, taxes internationales)
- Génération automatique de factures PDF
- Workflow de gestion des retours et remboursements
- Système de wishlist / favoris pour les clients
- Historique des commandes côté client

#### Contenu Éditorial
- Blog / actualités de l'artiste
- Page presse et expositions
- Galerie d'expositions passées
- Support multilingue (français, anglais minimum)
- SEO ultra-optimisé :
  - Rich snippets Google
  - Optimisation Core Web Vitals
  - Analytics SEO intégré

#### Fiabilité & Performance
- Monitoring d'erreurs en temps réel (Sentry)
- Logs Stripe pour traçabilité des paiements
- Backups automatiques du CMS
- Cache ISR optimisé pour performance
- CDN pour livraison rapide mondiale
- Tests automatisés (E2E, intégration)

### ❌ Ce que la V2 ne fait PAS (potentiel V3+)
- Pas de marketplace multi-artistes
- Pas de système d'enchères
- Pas d'application mobile native
- Pas de réalité augmentée pour visualiser les œuvres
- Pas de programme de fidélité complexe
- Pas d'intégration avec galeries physiques
