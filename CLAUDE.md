## Objectif du Projet

Site e-commerce moderne pour une artiste peintre permettant d'exposer et vendre des œuvres originales en ligne. Développement en 3 phases :

- **MVP** : Prototype crédible avec données mockées
- **V1** : Produit vendable avec CMS, paiements et gestion de stock
- **V2** : Plateforme professionnelle avec dashboard, statistiques et fonctionnalités avancées

## Architecture Globale

**Stack Technique :**

- Frontend : Next.js 14+ (App Router), TypeScript, Tailwind CSS,
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

## Commandes NPM

### Développement

```bash
# Démarrer le serveur de développement (avec Turbopack)
npm run dev

# Linter le code
npm run lint

# Build de production
npm run build

# Démarrer le serveur de production
npm run start
```

### Installation de dépendances

```bash
# Installer toutes les dépendances
npm install

# Ajouter une nouvelle dépendance
npm install <package-name>

# Ajouter une dépendance de développement
npm install -D <package-name>
```

## Bonnes Pratiques React

### Composants Réutilisables

**Principes :**

- **Single Responsibility** : Un composant = une responsabilité
- **Composition over Configuration** : Privilégier la composition plutôt que les props complexes
- **Props Interface** : Toujours typer les props avec TypeScript
- **Default Props** : Utiliser les valeurs par défaut ES6 `= valeur`

**Structure d'un composant :**

```tsx
// types/button.ts ou dans le même fichier
interface ButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// components/ui/Button.tsx
export function Button({
  variant = "default",
  size = "default",
  children,
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Hooks Personnalisés

**Nommage :** Toujours préfixer avec `use`

**Extraction de logique :**

```tsx
// hooks/useCarousel.ts
function useCarousel(itemsCount: number, autoPlayInterval = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = () => setCurrentIndex((prev) => (prev + 1) % itemsCount);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + itemsCount) % itemsCount);

  // Auto-play logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, autoPlayInterval);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  return { currentIndex, next, prev, setIsPaused };
}
```

### Optimisation des Performances

**Mémoïzation :**

```tsx
// Mémoriser des calculs coûteux
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);

// Mémoriser des callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Mémoriser des composants
const MemoizedComponent = React.memo(MyComponent);
```

**Images Next.js :**

```tsx
import Image from "next/image";

<Image
  src={artwork.imageUrl}
  alt={artwork.title}
  width={800}
  height={600}
  className="object-cover"
  priority // Pour les images above the fold
  placeholder="blur" // Optionnel avec blurDataURL
/>;
```

### Gestion d'État

**useState pour état local :**

```tsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: "", email: "" });
```

**useReducer pour état complexe :**

```tsx
type Action =
  | { type: "ADD_ITEM"; item: Item }
  | { type: "REMOVE_ITEM"; id: string };

function cartReducer(state: CartState, action: Action) {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.item] };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
  }
}

const [cart, dispatch] = useReducer(cartReducer, initialState);
```

### Composition de Composants

**Pattern Children :**

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>;
```

**Pattern Render Props :**

```tsx
function DataFetcher({ render }: { render: (data: Data) => React.ReactNode }) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return data ? render(data) : <Loading />;
}

<DataFetcher render={(data) => <Display data={data} />} />;
```

### Conventions de Nommage

- **Composants** : PascalCase (`Button`, `ArtworkCard`)
- **Hooks** : camelCase avec préfixe `use` (`useCarousel`, `useArtworks`)
- **Utilitaires** : camelCase (`formatPrice`, `cn`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_ITEMS`, `API_URL`)
- **Types/Interfaces** : PascalCase (`Artwork`, `ButtonProps`)

## Organisation des Fichiers

### Structure Recommandée

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   └── galerie/
│       └── page.tsx
├── components/             # Composants réutilisables
│   ├── ui/                # Composants UI primitifs
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── Navbar.tsx         # Composants métier
│   └── FeaturedCarousel.tsx
├── lib/                   # Utilitaires et helpers
│   ├── utils.ts
│   └── constants.ts
├── types/                 # Définitions TypeScript
│   ├── artwork.ts
│   └── api.ts
├── data/                  # Données mockées (MVP)
│   └── artworks.ts
└── hooks/                 # Hooks personnalisés
    └── useCarousel.ts
```

### Imports

**Ordre des imports :**

```tsx
// 1. Imports externes
import { useState, useEffect } from "react";
import Image from "next/image";

// 2. Imports internes absolus (via alias @/)
import { Button } from "@/components/ui/button";
import { Artwork } from "@/types/artwork";

// 3. Imports relatifs
import { formatPrice } from "./utils";

// 4. Imports de styles
import "./styles.css";
```

## Validation et Qualité du Code

### Linting

**ESLint automatique :**

- Respecter les règles Next.js
- Pas de `console.log` en production
- Gérer tous les cas d'erreur

### Type-Safety

**Avant chaque commit :**

- Aucune erreur TypeScript (`tsc --noEmit`)
- Tous les props typés
- Pas de `any` non justifié

### Accessibilité

**Bonnes pratiques :**

- Attributs `alt` sur toutes les images
- Labels sur les inputs
- Boutons avec texte ou `aria-label`
- Navigation au clavier
- Contraste suffisant (WCAG AA minimum)
