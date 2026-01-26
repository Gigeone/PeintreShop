# Proposition : Composant Footer

## Contexte

Le site dispose actuellement d'une Navbar en haut de page mais n'a pas de Footer. Un pied de page est essentiel pour compléter l'expérience utilisateur en offrant des informations de copyright, des liens de navigation redondants et les informations de l'artiste. Cela améliore également l'accessibilité et le SEO.

## Objectif

Créer un composant Footer réutilisable et responsive qui :
- Affiche le copyright et le nom de l'artiste
- Fournit des liens de navigation rapides
- S'intègre harmonieusement au design pastel existant
- Est présent sur toutes les pages via le layout principal

## Portée (Scope)

### Dans le scope
- Composant `components/Footer.tsx`
- Intégration dans `app/layout.tsx`
- Liens de navigation : Accueil, Galerie, À propos, Contact
- Copyright avec année dynamique (© 2026 MNGH)
- Nom de l'artiste
- Design responsive (1 colonne mobile, multi-colonnes desktop)
- Palette pastel cohérente avec le reste du site

### Hors scope (reporté à V1 ou V2)
- Réseaux sociaux (nécessite URLs réseaux sociaux)
- Page mentions légales (sera créée ultérieurement)
- Newsletter inscription
- Liens CGV/CGU
- Multilingue

## Approche Technique

### Structure du Footer

**Desktop (≥768px)** : Layout 3 colonnes
- Colonne 1 : Logo/Nom artiste + Copyright
- Colonne 2 : Navigation
- Colonne 3 : (Vide pour le MVP, prévu réseaux sociaux en V1)

**Mobile (<768px)** : Layout vertical centré
- Nom artiste
- Navigation (liste verticale)
- Copyright

### Composant
- Créer `components/Footer.tsx` (Server Component)
- Réutiliser les mêmes liens que la Navbar
- Année dynamique via `new Date().getFullYear()`

### Intégration
- Modifier `app/layout.tsx` pour inclure `<Footer />` après `<main>`
- Structure HTML sémantique avec balise `<footer>`

### Design
- Background : `bg-pastel-rose-bg` (cohérent avec Navbar)
- Bordure supérieure subtile
- Padding vertical confortable
- Liens avec hover effects (couleur lavande)

## Bénéfices Utilisateur

### Pour les visiteurs
- Navigation rapide depuis le bas de page (UX)
- Informations de contact et copyright visibles
- Cohérence visuelle sur tout le site

### Pour l'artiste
- Professionnalisme du site
- Branding cohérent (nom visible en footer)
- Meilleur SEO (liens internes supplémentaires)

### Pour le SEO
- Structure sémantique (balise `<footer>`)
- Liens internes supplémentaires
- Copyright clairement affiché

## Mesures de Succès

### Critères d'acceptation
- ✅ Footer présent sur toutes les pages
- ✅ Liens de navigation fonctionnels
- ✅ Copyright avec année actuelle
- ✅ Responsive mobile/desktop
- ✅ Design cohérent avec palette pastel
- ✅ Aucune erreur TypeScript
- ✅ Pas de régression visuelle

### Métriques de qualité
- Layout responsive fluide
- Contraste texte/fond WCAG AA
- Navigation au clavier fonctionnelle
- Validation ESLint/TypeScript

## Risques et Mitigation

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Décalage visuel sur certaines pages | Faible | Faible | Utiliser layout principal garantit cohérence |
| Liens en doublon avec Navbar | Faible | Certain | C'est une pratique standard et bénéfique pour l'UX |
| Hauteur footer variable | Faible | Faible | CSS flexbox gère automatiquement |

## Dépendances

### Bloque
- Aucune autre fonctionnalité ne dépend de celle-ci

### Bloqué par
- ✅ Navbar (déjà fait)
- ✅ Layout principal (déjà fait)
- ✅ Palette pastel (déjà fait)

### Séquence recommandée
1. Créer le composant `Footer.tsx`
2. Intégrer dans `app/layout.tsx`
3. Tester responsive
4. Valider accessibilité

## Alternatives Considérées

### Alternative 1 : Footer minimaliste (juste copyright)
**Rejeté** - Manque d'opportunité pour navigation et branding

### Alternative 2 : Footer complexe avec multi-sections
**Reporté à V2** - Sur-ingénierie pour MVP, on garde simple

### Alternative 3 : Footer par page (non global)
**Rejeté** - Incohérent et difficile à maintenir

## Questions Ouvertes

✅ Toutes résolues :
- Contenu : Copyright + Nom + Navigation
- Emplacement : Layout principal
- Design : Palette pastel cohérente
