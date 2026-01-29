# Instructions de Développement - Claude Code

> Ce document contient les **conventions, workflows et bonnes pratiques** pour travailler sur ce projet.

## 📚 Documents de Référence

Avant de commencer, consulte ces documents :

- **[@PRD.md](./PRD.md)** → QUOI construire (roadmap produit, fonctionnalités MVP/V1/V2)
- **[@ARCHITECTURE.md](./ARCHITECTURE.md)** → COMMENT c'est construit (stack, schémas, infrastructure)
- **[openspec/project.md](./openspec/project.md)** → Contexte projet OpenSpec
- **[openspec/AGENTS.md](./openspec/AGENTS.md)** → Workflow OpenSpec

**Ce document (CLAUDE.md)** explique COMMENT TRAVAILLER sur le projet au quotidien.

---

## 🎨 Principes de Design

- Interface claire et minimaliste
- Design mobile-first et responsive
- **Pas de mode sombre pour le MVP**
- Focus sur la mise en valeur des œuvres (galerie épurée)

## ⚠️ Contraintes et Politiques Strictes

### 🔒 Sécurité (JAMAIS de compromis)

- ❌ **JAMAIS exposer les clés API côté client** → Toujours utiliser API Routes et variables d'environnement serveur
- ✅ Validation côté serveur pour toutes les opérations critiques (paiement, stock)
- ✅ Webhooks Stripe sécurisés avec validation de signature
- ✅ Sanitization des inputs utilisateurs

### 🎯 Développement (Principe YAGNI)

- ✅ TypeScript strict mode activé
- ✅ **Implémenter UNIQUEMENT ce qui est nécessaire** pour la phase actuelle (MVP, V1 ou V2)
- ❌ **PAS de fonctionnalités "au cas où"** → YAGNI (You Aren't Gonna Need It)
- ❌ **PAS de sur-engineering** → Éviter les abstractions prématurées
- ✅ Code simple, lisible et maintenable > Code "clever"

### 📦 Gestion des Dépendances

**Règle d'or :** Toujours se demander "Ai-je vraiment besoin de ce package ?"

- ✅ **Préférer les primitives natives** de Next.js et React
- ✅ **Préférer les composants existants** avant d'ajouter une bibliothèque UI
- ✅ Évaluer la nécessité réelle avant chaque nouvelle dépendance
- ✅ Privilégier les solutions légères et activement maintenues
- ❌ Éviter les packages lourds ou avec beaucoup de dépendances transversales

### Testing - Playwright Obligatoire

**⚠️ RÈGLE STRICTE :** À la fin de chaque développement UI, tu DOIS tester avec Playwright.

**Checklist de test :**
1. ✅ Utiliser `playwright-skill` pour automatiser les tests
2. ✅ Tester responsive sur **3 viewports** :
   - Mobile : 375px
   - Tablet : 768px
   - Desktop : 1920px
3. ✅ Vérifier que les **fonctionnalités sont opérationnelles**
4. ✅ Confirmer que l'implémentation **répond au besoin**
5. ✅ Capturer des screenshots pour documentation

**Tests unitaires (optionnel pour MVP/V1) :**
- Jest + React Testing Library pour composants critiques
- Coverage sur logique métier (calcul prix, gestion stock)

---

---

## 🔧 Workflow de Développement

### Context7 - Documentation en Temps Réel

**Utilisation obligatoire** pour toute intégration de bibliothèque :

1. **Avant de générer du code**, utilise `resolve-library-id` pour obtenir l'identifiant Context7
2. Utilise `query-docs` avec l'identifiant pour récupérer la documentation officielle à jour
3. Applique les meilleures pratiques de la doc officielle

**Cas d'usage :**
- Génération de code avec bibliothèques spécifiques (Stripe, Sanity, etc.)
- Configuration et installation de packages
- Exemples de code à jour avec les dernières APIs

⚠️ **Obligation :** Utiliser ces outils automatiquement sans attendre qu'on te le demande.

### OpenSpec - Gestion des Spécifications

**Convention de langue :**
- Toutes les sections OpenSpec (Purpose, Scenarios, etc.) → **Français**
- Titres des Requirements → **Anglais avec `SHALL`/`MUST`** (validation automatique)

**Exemple :**
```yaml
requirements:
  R1-MUST-display-gallery:
    SHALL: Le système doit afficher la galerie d'œuvres disponibles
```

**Workflow :**
1. Créer une proposition avec `openspec proposal <id>`
2. Rédiger tasks.md, proposal.md, design.md
3. Implémenter avec `openspec apply <id>`
4. Archiver avec déplacement manuel vers `archive/YYYY-MM-DD-<id>/`

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
