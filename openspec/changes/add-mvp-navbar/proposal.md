# Change: Ajouter la navbar pour le MVP

## Why

Le site a besoin d'une navigation claire et responsive pour permettre aux visiteurs d'accéder facilement aux différentes sections du site (Accueil, Galerie, À propos, Contact). La navbar est un composant essentiel du MVP car elle structure l'expérience utilisateur et permet la navigation entre les pages principales.

## What Changes

- Création d'une navbar responsive avec logo "MNGH" et navigation principale
- Navbar sticky (fixe en haut lors du scroll)
- Support mobile avec menu hamburger (SVG inline)
- Palette de couleurs pastels (rose/bleu/lavande pâles)
- Navigation vers les 4 pages principales du MVP : Accueil, Galerie, À propos, Contact
- Logo "MNGH" cliquable vers la page d'accueil
- Indication visuelle de la page active (couleur + border-bottom pastel)
- Layout global Next.js intégrant la navbar

## Impact

- **Affected specs**: Nouvelle capability `navigation` (aucune spec existante)
- **Affected code**:
  - Création de `app/layout.tsx` (layout global Next.js)
  - Création du composant `components/Navbar.tsx`
  - Potentiellement `tailwind.config.ts` pour les styles personnalisés
- **User impact**: Les utilisateurs pourront naviguer entre les pages du site
- **Dependencies**: Aucune - premier composant UI du projet
