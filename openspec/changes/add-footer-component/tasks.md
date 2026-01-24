# Tasks : Composant Footer

## Ordre de Réalisation

Les tâches sont organisées pour un développement incrémental avec validation à chaque étape.

---

## 1. Créer le composant Footer
**Estimation** : 20 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Composant créé et compilable

### Actions
- [x] Créer `components/Footer.tsx`
- [x] Définir les liens de navigation (mêmes que Navbar)
- [x] Implémenter le layout responsive (3 colonnes desktop, vertical mobile)
- [x] Ajouter copyright avec année dynamique `new Date().getFullYear()`
- [x] Ajouter nom de l'artiste "MNGH"
- [x] Appliquer la palette pastel

### Critères de validation
- ✅ Fichier `components/Footer.tsx` créé
- ✅ Aucune erreur TypeScript
- ✅ Composant exporté par défaut
- ✅ Liens de navigation définis

---

## 2. Intégrer le Footer dans le layout principal
**Estimation** : 5 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Footer visible sur toutes les pages

### Actions
- [x] Modifier `app/layout.tsx`
- [x] Importer le composant Footer
- [x] Ajouter `<Footer />` après la balise `<main>`
- [x] Vérifier la structure HTML sémantique

### Critères de validation
- ✅ Footer présent sur `/` (accueil)
- ✅ Footer présent sur `/galerie`
- ✅ Footer présent sur `/a-propos`
- ✅ Footer présent sur `/contact`
- ✅ Footer présent sur `/oeuvres/[slug]`
- ✅ Structure HTML valide (`<footer>` dans `<body>`)

---

## 3. Implémenter le design responsive
**Estimation** : 15 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Footer adapté mobile, tablette, desktop

### Actions
- Tester sur mobile (375px) : Layout vertical centré
- Tester sur tablette (768px) : Layout multi-colonnes si pertinent
- Tester sur desktop (1440px) : Layout 3 colonnes
- Vérifier les espaces et paddings
- S'assurer que le texte est lisible

### Critères de validation
- ✅ Mobile : Une colonne, éléments centrés
- ✅ Desktop : 3 colonnes (Logo | Navigation | Vide)
- ✅ Texte lisible sur tous les breakpoints
- ✅ Pas de débordement horizontal

---

## 4. Styliser et harmoniser avec le design existant
**Estimation** : 10 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Footer cohérent visuellement

### Actions
- Appliquer `bg-pastel-rose-bg` (même couleur que Navbar)
- Ajouter bordure supérieure subtile (`border-t border-pastel-lavender/20`)
- Configurer les hover effects sur les liens (couleur lavande)
- Vérifier le contraste texte/fond (WCAG AA)
- Ajuster les espacements (padding, margin)

### Critères de validation
- ✅ Background cohérent avec Navbar
- ✅ Liens changent de couleur au hover
- ✅ Contraste suffisant (lisibilité)
- ✅ Design harmonieux avec le reste du site

---

## 5. Validation accessibilité et SEO
**Estimation** : 10 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Footer accessible et SEO-friendly

### Actions
- Vérifier balise sémantique `<footer>`
- Tester navigation au clavier (tab entre liens)
- Vérifier que tous les liens sont focusables
- S'assurer que le copyright est lisible par lecteurs d'écran
- Valider structure HTML avec DevTools

### Critères de validation
- ✅ Balise `<footer>` utilisée
- ✅ Navigation au clavier fonctionne
- ✅ Liens ont focus visible
- ✅ Texte accessible aux lecteurs d'écran
- ✅ Pas d'erreurs HTML dans la console

---

## 6. Tests et validation finale
**Estimation** : 5 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Aucune régression, tout fonctionne

### Actions
- [x] Exécuter `npm run lint`
- [x] Exécuter `tsc --noEmit`
- [x] Tester tous les liens du footer
- [x] Vérifier qu'il n'y a pas de `console.log` oubliés
- [x] Tester sur plusieurs navigateurs si possible

### Critères de validation
- ✅ Aucune erreur ESLint
- ✅ Aucune erreur TypeScript
- ✅ Tous les liens fonctionnent
- ✅ Pas de console.log en production
- ✅ Footer visible et fonctionnel

---

## Résumé de la Séquence

```
1. Créer composant (20 min)
   ↓
2. Intégrer layout (5 min)
   ↓
3. Design responsive (15 min)
   ↓
4. Styliser (10 min)
   ↓
5. Accessibilité (10 min)
   ↓
6. Tests finaux (5 min)
```

**Total estimé** : ~1h05 de développement

---

## Dépendances entre Tâches

- **Tâche 2** dépend de **Tâche 1** (besoin du composant avant de l'intégrer)
- **Tâche 3** dépend de **Tâche 2** (besoin de l'intégration pour tester responsive)
- **Tâche 4** dépend de **Tâche 3** (styliser après responsive)
- **Tâche 5** peut être fait en parallèle de **Tâche 4**
- **Tâche 6** dépend de **Tâches 1-5** (validation finale)

---

## Travail Parallélisable

- **Tâches 4 et 5** peuvent être faites en parallèle si nécessaire (styling et accessibilité)
- Toutes les autres tâches sont séquentielles
