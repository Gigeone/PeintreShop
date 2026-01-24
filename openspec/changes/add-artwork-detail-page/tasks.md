# Tasks : Page Détail d'Œuvre

## Ordre de Réalisation

Les tâches sont organisées pour permettre un progrès incrémental avec validation à chaque étape.

---

## 1. Créer la route dynamique et structure de base
**Estimation** : 30 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Page accessible, affiche slug dans console

### Actions
- [x] Créer `app/oeuvres/[slug]/page.tsx`
- [x] Implémenter la fonction pour récupérer l'œuvre par slug depuis `artworks.ts`
- [x] Ajouter la gestion du cas "œuvre non trouvée" (retour 404)
- [x] Créer une structure HTML basique pour vérifier que le routing fonctionne

### Critères de validation
- ✅ URL `/oeuvres/jardin-secret` est accessible
- ✅ Affiche le titre de l'œuvre correspondante
- ✅ URL avec slug invalide retourne une page 404
- ✅ Aucune erreur TypeScript

---

## 2. Implémenter le layout responsive et l'affichage des données
**Estimation** : 1h
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Page complète visuellement, responsive

### Actions
- [x] Créer le layout 2 colonnes desktop / vertical mobile avec Tailwind
- [x] Afficher l'image de l'œuvre avec `next/image` optimisé
- [x] Afficher toutes les informations : titre, description, technique, dimensions, prix
- [x] Ajouter le badge de statut "Disponible" / "Vendu" selon `isAvailable`
- [x] Ajouter le bouton "Acheter cette œuvre" (sans lien fonctionnel pour l'instant)
- [x] Appliquer la palette pastel et le design cohérent avec le reste du site

### Critères de validation
- ✅ Layout responsive fonctionne sur mobile, tablette, desktop
- ✅ Toutes les informations de l'œuvre sont affichées
- ✅ Image optimisée se charge rapidement
- ✅ Design cohérent avec la galerie et la navbar
- ✅ Badge "Vendu" visible sur œuvres non disponibles

---

## 3. Implémenter la navigation
**Estimation** : 45 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Navigation fonctionnelle entre œuvres et retour galerie

### Actions
- [x] Ajouter bouton "← Retour à la galerie" (lien vers `/galerie`)
- [x] Implémenter la logique pour trouver l'œuvre précédente et suivante
- [x] Ajouter les boutons "Œuvre précédente" / "Œuvre suivante" en bas de page
- [x] Gérer la navigation circulaire (dernière œuvre → première œuvre)
- [x] Désactiver les boutons précédent/suivant pour les œuvres aux extrémités (optionnel)

### Critères de validation
- ✅ Bouton retour galerie fonctionne
- ✅ Navigation précédent/suivant fonctionne
- ✅ Navigation circulaire fonctionne (dernier → premier, premier → dernier)
- ✅ Liens utilisent `next/link` pour navigation optimisée

---

## 4. Configurer le bouton "Acheter" et métadonnées SEO
**Estimation** : 30 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Bouton redirige, métadonnées visibles dans le HTML

### Actions
- [x] Lier le bouton "Acheter cette œuvre" vers `/contact`
- [x] Implémenter `generateMetadata()` pour métadonnées dynamiques
- [x] Ajouter title : `{artwork.title} - MNGH`
- [x] Ajouter description : première ligne de `artwork.description`
- [x] Configurer Open Graph tags (og:title, og:description, og:image)
- [x] Ajouter Twitter Card metadata

### Critères de validation
- ✅ Bouton "Acheter" redirige vers `/contact`
- ✅ Titre de page dynamique visible dans l'onglet navigateur
- ✅ Métadonnées Open Graph présentes dans le HTML
- ✅ Aperçu de partage social fonctionnel (tester avec un validateur OG)

---

## 5. Mettre à jour la page galerie
**Estimation** : 15 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Boutons galerie redirigent vers les pages détail

### Actions
- [x] Modifier le bouton "Voir les détails" dans `app/galerie/page.tsx`
- [x] Transformer en lien `<Link href={`/oeuvres/${artwork.slug}`}>` avec le composant Button
- [x] Vérifier que tous les liens fonctionnent pour les 9 œuvres

### Critères de validation
- ✅ Cliquer sur "Voir les détails" depuis la galerie ouvre la page détail
- ✅ Navigation fonctionne pour toutes les œuvres (9/9)
- ✅ Pas de régression visuelle dans la galerie

---

## 6. Tests Playwright et validation finale
**Estimation** : 1h
**Statut** : ⚠️ **VALIDATION MANUELLE REQUISE**
**Validation** : Tests passent, validation UX complète

### Actions
- Écrire et exécuter tests Playwright pour :
  - Accès direct à une page d'œuvre par URL
  - Navigation depuis la galerie vers détail
  - Navigation précédent/suivant entre œuvres
  - Retour à la galerie
  - Bouton "Acheter" redirige vers contact
  - Responsive mobile, tablette, desktop
- Vérifier l'accessibilité :
  - Alt text sur images
  - Navigation au clavier
  - Contraste des couleurs
- Tester sur plusieurs navigateurs (Chrome, Firefox, Safari si possible)

### Critères de validation
- ✅ Tous les tests Playwright passent
- ✅ Responsive validé sur 3 breakpoints (mobile, tablette, desktop)
- ✅ Navigation au clavier fonctionne
- ✅ Aucune erreur console
- ✅ Score Lighthouse Performance > 90

---

## 7. Documentation et nettoyage
**Estimation** : 15 min
**Statut** : ✅ **COMPLÉTÉ**
**Validation** : Code propre, documenté

### Actions
- [x] Ajouter commentaires JSDoc si nécessaire
- [x] Vérifier qu'il n'y a pas de `console.log` oubliés
- [x] Exécuter `npm run lint` et corriger les warnings
- [x] Vérifier avec `tsc --noEmit` qu'il n'y a pas d'erreurs TypeScript
- [x] Mettre à jour les fichiers OpenSpec si besoin (changements imprévus)

### Critères de validation
- ✅ Aucune erreur TypeScript
- ✅ Aucune erreur ESLint
- ✅ Code commenté aux endroits complexes
- ✅ Pas de console.log en production

---

## Résumé de la Séquence

```
1. Route dynamique (30 min)
   ↓
2. Layout et affichage (1h)
   ↓
3. Navigation (45 min)
   ↓
4. Bouton achat + SEO (30 min)
   ↓
5. Update galerie (15 min)
   ↓
6. Tests Playwright (1h)
   ↓
7. Documentation (15 min)
```

**Total estimé** : ~4h15 de développement

---

## Dépendances entre Tâches

- **Tâche 2** dépend de **Tâche 1** (besoin de la route avant d'ajouter le contenu)
- **Tâche 3** dépend de **Tâche 1** (besoin de la route pour naviguer)
- **Tâche 4** peut être fait en parallèle de **Tâche 3**
- **Tâche 5** dépend de **Tâche 1** (besoin que les URLs existent)
- **Tâche 6** dépend de **Tâches 1-5** (tout doit être implémenté pour tester)
- **Tâche 7** dépend de **Tâche 6** (validation finale avant nettoyage)

---

## Travail Parallélisable

Aucune tâche ne peut vraiment être parallélisée car chacune construit sur la précédente. Développement séquentiel recommandé.
