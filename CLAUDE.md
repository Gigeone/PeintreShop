## Objectif du Projet

Site e-commerce moderne pour une artiste peintre permettant d'exposer et vendre des œuvres originales en ligne. Développement en 3 phases :

- **MVP** : Prototype crédible avec données mockées
- **V1** : Produit vendable avec CMS, paiements et gestion de stock
- **V2** : Plateforme professionnelle avec dashboard, statistiques et fonctionnalités avancées

## Architecture Globale

**Stack Technique :**

- Frontend : Next.js 14+ (App Router), TypeScript, Tailwind CSS
- CMS : Sanity (gestion des œuvres et contenus)
- Paiement : Stripe Checkout avec webhooks
- Hébergement : Vercel (CI/CD automatique)
- Images : Sanity Assets / Cloudinary
- Emails : SendGrid ou similaire

**Structure :**

- Pages dynamiques via App Router
- API Routes pour checkout et webhooks Stripe
- Sanity Studio pour l'administration
- Gestion de stock par œuvre (une œuvre = une vente)

## Style Visuel

- Interface claire et minimaliste
- Design mobile-first et responsive
- **Pas de mode sombre pour le MVP**
- Focus sur la mise en valeur des œuvres

## Contraintes et Politiques

### Sécurité

- **NE JAMAIS exposer les clés API au client** (utiliser les variables d'environnement et API Routes)
- Validation côté serveur pour toutes les opérations critiques
- Webhooks Stripe sécurisés avec signature validation

### Développement

- TypeScript strict mode activé
- Éviter la sur-ingénierie : implémenter uniquement ce qui est nécessaire pour la phase en cours
- Pas de fonctionnalités "au cas où" - YAGNI (You Aren't Gonna Need It)

## Dépendances

- **Préférer les composants existants** plutôt que d'ajouter de nouvelles bibliothèques UI
- Utiliser les primitives natives de Next.js et React autant que possible
- Évaluer la nécessité réelle avant d'ajouter une nouvelle dépendance
- Privilégier les solutions légères et bien maintenues

## Testing & Qualité

### Tests Playwright

**À la fin de chaque développement qui implique l'interface graphique :**

- Utiliser `playwright-skill` pour tester l'interface
- Vérifier que l'interface est **responsive** (mobile, tablette, desktop)
- Valider que les fonctionnalités sont **fonctionnelles**
- Confirmer que l'implémentation **répond au besoin développé**

### Tests Unitaires

- Jest + React Testing Library pour les composants critiques
- Coverage sur la logique métier et les utilitaires

## Documentation

### Documents de Référence

- **Product Requirements Document** : [@PRD.md](./PRD.md)
- **Architecture Technique** : [@ARCHITECTURE.md](./ARCHITECTURE.md)
- **Contexte Projet OpenSpec** : [openspec/project.md](./openspec/project.md)
- **Workflow OpenSpec** : [openspec/AGENTS.md](./openspec/AGENTS.md)

Toujours consulter ces documents pour comprendre le contexte et les décisions architecturales.

## Context7 - Documentation en Temps Réel

**Utilisation Automatique Requise :**

Utilise **toujours** les outils MCP Context7 lorsque tu as besoin de :

- Génération de code avec des bibliothèques spécifiques
- Étapes de configuration ou d'installation
- Documentation d'API ou de bibliothèque
- Exemples de code à jour

**Process :**

1. Utiliser `resolve-library-id` pour obtenir l'identifiant Context7
2. Utiliser `query-docs` avec l'identifiant pour récupérer la documentation
3. Appliquer les meilleures pratiques issues de la documentation officielle

Tu dois automatiquement utiliser ces outils **sans que je doive le demander explicitement**.

## Spécifications OpenSpec

**Langue des Spécifications :**

- Toutes les sections OpenSpec (Purpose, Scenarios, etc.) doivent être **rédigées en français**
- **Exception** : Les titres des Requirements doivent rester en anglais avec les mots-clés `SHALL`/`MUST` pour permettre la validation automatique par OpenSpec
- Exemple :
  ```yaml
  requirements:
    R1-MUST-display-gallery:
      SHALL: Le système doit afficher la galerie d'œuvres disponibles
  ```
