# Design: Ajouter Cloudinary et carrousel d'accueil MVP

## Décisions Architecturales

### 1. Choix de Cloudinary vs alternatives
**Décision** : Utiliser Cloudinary pour l'hébergement et l'optimisation des images

**Raison** :
- Plan gratuit généreux (25 crédits/mois, suffisant pour MVP)
- Optimisation automatique (WebP, lazy loading, responsive)
- CDN mondial intégré (performances)
- Support natif Next.js (`next/image` fonctionne sans configuration complexe)
- Interface web simple pour upload
- Migration Sanity V1 facile (Sanity peut aussi utiliser Cloudinary)

**Alternatives considérées** :
- Sanity Assets → V1 uniquement, trop tôt pour MVP
- Images statiques `/public` → pas d'optimisation, taille repo
- Unsplash API → limitation de requêtes, pas de contrôle total
- Vercel Blob Storage → payant, overkill pour MVP

---

### 2. Structure du carrousel
**Décision** : Carrousel custom React sans bibliothèque externe

**Raison** :
- MVP = garder les dépendances au minimum (YAGNI)
- Fonctionnalités simples : navigation manuelle + auto-play optionnel
- 50 lignes de code suffisent (useState + CSS transitions)
- Contrôle total sur le design pastel
- Évite les bugs de bibliothèques tierces

**Alternatives considérées** :
- `swiper` → 200KB, overkill pour 3-5 slides
- `react-slick` → dépendance jQuery, obsolète
- `embla-carousel` → moderne mais ajoute 30KB

**Implémentation** :
```tsx
const [currentIndex, setCurrentIndex] = useState(0);
const [isPlaying, setIsPlaying] = useState(true);

// Auto-play (optionnel)
useEffect(() => {
  if (!isPlaying) return;
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredArtworks.length);
  }, 5000);
  return () => clearInterval(interval);
}, [isPlaying, featuredArtworks.length]);

// Navigation
const goToNext = () => setCurrentIndex((prev) => (prev + 1) % total);
const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);
```

---

### 3. Nombre d'œuvres "featured"
**Décision** : 5 œuvres featured (carousel de 5 slides)

**Raison** :
- Assez pour montrer la diversité (techniques, styles, prix)
- Pas trop pour éviter un carrousel interminable
- Rotation complète en ~25 secondes (5s par slide)
- Nombre impair = design équilibré

**Sélection des œuvres** :
- Ajouter un champ `isFeatured: boolean` dans `Artwork`
- Sélectionner manuellement 5 œuvres représentatives :
  - Mix de techniques (huile, acrylique, aquarelle)
  - Mix de prix (entrée, milieu, haut)
  - Mix de couleurs (pour montrer palette)
  - Toutes disponibles (pas vendues)

---

### 4. Responsive du carrousel
**Décision** : 1 slide mobile, 3 slides desktop, avec navigation fluide

**Raison** :
- Mobile (< 768px) : 1 slide = focus, pas de distraction
- Tablette/Desktop (≥ 768px) : 3 slides = aperçu de la collection
- Navigation par slide (pas par pixel) = comportement prévisible

**Implémentation CSS** :
```css
/* Mobile: 1 slide */
.carousel-container {
  display: flex;
  gap: 1rem;
  transform: translateX(calc(-${currentIndex} * 100%));
}

/* Desktop: 3 slides visibles */
@media (min-width: 768px) {
  .carousel-slide {
    min-width: calc(33.333% - 1rem);
  }
}
```

---

### 5. Auto-play vs navigation manuelle
**Décision** : Auto-play activé par défaut avec pause au hover (optionnel pour MVP)

**Raison** :
- Auto-play = engagement passif, bon pour homepage
- Pause hover = contrôle utilisateur, meilleure UX
- Peut être désactivé facilement si feedback négatif

**Configuration** :
```tsx
const AUTOPLAY_INTERVAL = 5000; // 5 secondes
const enableAutoplay = true; // Toggle facile
```

**Accessibilité** :
- Bouton "Pause/Play" visible pour contrôle explicite
- `aria-live="polite"` pour lecteurs d'écran
- Navigation clavier (flèches gauche/droite)

---

### 6. Position du carrousel sur la page d'accueil
**Décision** : Section "Œuvres en Vedette" après le hero, avant "À propos"

**Structure page d'accueil** :
```
1. Hero section (titre + 2 CTAs)
2. Carrousel "Œuvres en Vedette" ← NOUVEAU
3. Section "À propos" / Biographie artiste
4. Footer
```

**Raison** :
- Le hero capte l'attention → carrousel engage → CTA vers galerie
- Positionnement "above the fold" sur desktop
- Flow naturel : découverte → exploration → contact

---

### 7. Configuration Cloudinary Next.js
**Décision** : Utiliser `remotePatterns` dans `next.config.ts` pour sécuriser les domaines

**Configuration** :
```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },
};
```

**Raison** :
- Sécurisé : limite aux URLs Cloudinary uniquement
- Flexible : supporte transformations Cloudinary (`/w_800,h_800,c_fill/`)
- Type-safe : Next.js optimise automatiquement

---

### 8. Format des URLs Cloudinary
**Décision** : Stocker les URLs complètes dans `data/artworks.ts`

**Format** :
```ts
imageUrl: "https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.jpg"
```

**Raison** :
- Simple pour MVP (pas besoin de fonction builder)
- Facilite le debug (URLs directement visibles)
- Compatible avec Sanity V1 (même format)
- Permet transformations manuelles si besoin :
  ```
  /w_800,h_800,c_fill/v123/artwork-1.jpg
  ```

**Alternatives considérées** :
- Stocker seulement `public_id` + builder function → sur-ingénierie pour MVP
- Utiliser le SDK Cloudinary → dépendance inutile pour reads simples

---

### 9. Transitions et animations
**Décision** : CSS transitions simples (pas de framer-motion pour MVP)

**Raison** :
- CSS `transition: transform 0.5s ease-in-out` suffit
- Pas de dépendance supplémentaire
- Performant (GPU-accelerated)
- Peut être remplacé par framer-motion en V2 si nécessaire

**Implémentation** :
```css
.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(calc(-${currentIndex} * 100%));
}
```

---

### 10. Indicateurs de pagination (dots)
**Décision** : Dots cliquables en bas du carrousel avec palette pastel

**Raison** :
- Feedback visuel du slide actif
- Navigation rapide (clic sur dot = jump to slide)
- Standard UX pour carrousels

**Style** :
```tsx
<div className="flex gap-2 justify-center mt-4">
  {featuredArtworks.map((_, index) => (
    <button
      key={index}
      onClick={() => setCurrentIndex(index)}
      className={`w-3 h-3 rounded-full transition-colors ${
        index === currentIndex
          ? 'bg-pastel-lavender'
          : 'bg-pastel-gray-text/30'
      }`}
      aria-label={`Aller à l'œuvre ${index + 1}`}
    />
  ))}
</div>
```

---

## Migration V1 (préparation)

**Ce changement facilite la migration vers Sanity** :
1. Sanity peut stocker directement les URLs Cloudinary dans le champ `image.asset.url`
2. Ou Sanity Assets peuvent remplacer Cloudinary (même interface `next/image`)
3. Le champ `isFeatured` sera ajouté au schéma Sanity `artwork`
4. Le composant `FeaturedCarousel` reste identique (query Sanity pour filtrer `isFeatured: true`)

**Exemple query Sanity (V1)** :
```typescript
const featuredArtworks = await sanityClient.fetch(`
  *[_type == "artwork" && isFeatured == true && isAvailable == true] | order(order asc) {
    id, slug, title, price,
    "imageUrl": image.asset->url,
    technique, dimensions
  }
`);
```

---

## Questions ouvertes

1. **Source des images** : L'utilisateur a-t-il des images réelles d'œuvres, ou doit-on utiliser des images générées/mockées ?
2. **Auto-play** : Faut-il activer l'auto-play dès le MVP, ou laisser la navigation manuelle uniquement ?
3. **Nombre de slides desktop** : 2 ou 3 slides visibles simultanément sur desktop ?
