# Tasks - Navbar MVP

## 1. Setup Next.js Structure
- [ ] 1.1 Initialiser le projet Next.js 14+ avec App Router et TypeScript
- [ ] 1.2 Configurer Tailwind CSS
- [ ] 1.3 Créer la structure de base `app/layout.tsx`

## 2. Navbar Component
- [ ] 2.1 Créer le composant `components/Navbar.tsx` avec TypeScript
- [ ] 2.2 Ajouter le logo texte "MNGH" à gauche, cliquable vers l'accueil
- [ ] 2.3 Implémenter la navigation desktop avec les 4 liens (Accueil, Galerie, À propos, Contact) à droite
- [ ] 2.4 Ajouter l'indicateur de page active (basé sur le pathname)
- [ ] 2.5 Implémenter le menu mobile avec hamburger icon (SVG inline)
- [ ] 2.6 Ajouter les transitions et animations pour le menu mobile

## 3. Integration & Styling
- [ ] 3.1 Intégrer la navbar dans `app/layout.tsx` avec `sticky top-0 z-50`
- [ ] 3.2 Créer des pages placeholder pour tester la navigation (`app/page.tsx`, `app/galerie/page.tsx`, `app/a-propos/page.tsx`, `app/contact/page.tsx`)
- [ ] 3.3 Configurer les couleurs pastels dans `tailwind.config.ts` ou utiliser classes arbitraires
- [ ] 3.4 Appliquer la palette pastel à la navbar (fond rose/bleu pâle, texte lavande, logo bleu/violet pastel)
- [ ] 3.5 Assurer la responsiveness sur mobile, tablette, desktop

## 4. Testing & Validation
- [ ] 4.1 Tester la navigation entre les pages (liens + logo)
- [ ] 4.2 Vérifier le comportement sticky lors du scroll
- [ ] 4.3 Valider les couleurs pastels sur différents fonds
- [ ] 4.4 Vérifier la responsiveness sur différentes tailles d'écran
- [ ] 4.5 Valider l'indicateur de page active
- [ ] 4.6 Tester le menu hamburger mobile (ouverture/fermeture)
- [ ] 4.7 Exécuter les tests Playwright pour valider l'interface graphique

## 5. Documentation
- [ ] 5.1 Documenter le composant Navbar (props, comportement)
- [ ] 5.2 Ajouter des commentaires pour les sections complexes
