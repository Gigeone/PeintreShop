# Project Context

## Purpose
E-commerce website for a painter to showcase and sell original artwork online. The project follows a phased development approach:

- **MVP** (3-5 days): Credible prototype with mockdata, no payment system, contact form for purchases
- **V1** (6-10 days): Real product with CMS (Sanity), Stripe payments, stock management, automated emails
- **V2** (8-15 days): Professional e-commerce with admin dashboard, sales history, promo codes, invoices, multilingual support

**Business Goal**: Enable an artist to independently sell unique artwork online with minimal technical maintenance.

## Tech Stack

### Frontend
- **Next.js 14+** (App Router) - React framework with SSR/SSG/ISR capabilities
- **TypeScript** - Type safety and maintainability
- **Tailwind CSS** - Utility-first CSS for responsive design
- **next/image** - Optimized image delivery

### Backend & Services
- **Sanity CMS** - Headless CMS for artwork, pages, and site settings
- **Stripe Checkout** - Secure payment processing with webhooks
- **Vercel** - Hosting and deployment with automatic CI/CD
- **SendGrid** (or similar) - Transactional email service

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest + React Testing Library** - Unit testing
- **Cypress/Playwright** - Integration testing (optional for MVP)

## Project Conventions

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for code standardization
- French language for UI content and business logic comments
- English for technical code comments and variable names
- Functional components with React hooks
- Server Components by default (Next.js App Router)

### Architecture Patterns
- **App Router structure**: `app/` directory with route-based organization
- **Data fetching**: Server Components for Sanity queries, API routes for mutations
- **Type safety**: Strict TypeScript types generated from Sanity schemas
- **Image optimization**: Sanity Assets or Cloudinary with next/image
- **API Routes**:
  - `/api/checkout` - Create Stripe session
  - `/api/webhook` - Handle Stripe payment confirmations
- **Mobile-first responsive design** with Tailwind breakpoints
- **SEO**: Dynamic metadata per page with Next.js metadata API

### Testing Strategy
- **Unit tests**: Jest + React Testing Library for critical components and utilities
- **Integration tests**: Cypress/Playwright for checkout flow and forms (V1+)
- **TypeScript**: Compile-time type checking as first line of defense
- **Manual QA**: Test on mobile/tablet/desktop before each deployment
- **CI/CD**: Run tests on PR before merge (GitHub Actions or Vercel)

### Git Workflow
- **Main branch**: `main` - production-ready code
- **Feature branches**: `feature/[feature-name]` or `feat/[feature-name]`
- **Commit convention**: Descriptive messages in French or English
- **Deployment**: Automatic deploy to Vercel on push to `main`
- **Preview deploys**: Automatic preview URLs for all branches

## Domain Context

### E-commerce for Unique Artwork
- Each artwork is **unique** (not mass-produced) - one item = one sale
- Once sold, artwork becomes unavailable (managed by `isAvailable` boolean)
- No cart system needed in MVP/V1 - direct checkout per artwork
- Pricing in EUR (€), no variants or options per artwork
- Physical shipping required - shipping costs added in V2

### Artist Workflow
- Artist uses Sanity Studio to add/edit artwork
- Upload high-quality images for each piece
- Set title, description, price, dimensions, technique, availability
- Receive email notifications when artwork is sold
- Manually handle shipping and order fulfillment

### Customer Journey
1. Browse gallery of available artwork
2. View detailed artwork page (image, description, price, dimensions)
3. Click "Buy" button
4. Complete Stripe Checkout
5. Receive confirmation email
6. Artist ships artwork directly to customer

## Important Constraints

### Business Constraints
- **One artwork = one sale**: No inventory quantities, each piece is unique
- **Manual fulfillment**: Artist handles shipping and packaging
- **No returns policy** (optional): Due to unique nature of artwork
- **French primary market**: UI in French, possible multilingual in V2

### Technical Constraints
- **Vercel hosting**: Must work within Vercel's deployment model
- **Stripe compliance**: PCI-DSS compliant payment handling
- **Image optimization**: High-quality artwork photos need efficient delivery
- **Mobile-first**: Many art buyers browse on mobile devices
- **SEO critical**: Organic discovery is key for art sales

### Development Constraints
- **Phased approach**: Avoid over-engineering in early phases
- **No premature optimization**: Build features when needed
- **Sanity as single source of truth**: All content managed through CMS
- **TypeScript strict**: No `any` types without justification

## External Dependencies

### Required Services
- **Sanity.io**: Headless CMS
  - Project ID and dataset configured
  - API token for read/write access
  - Image CDN for artwork photos
- **Stripe**: Payment processing
  - Live and test API keys
  - Webhook endpoint for payment confirmation
  - Checkout Sessions API
- **Vercel**: Hosting and deployment
  - Connected to GitHub repository
  - Environment variables configured
  - Automatic preview deployments
- **Email Service** (V1+): SendGrid, Postmark, or similar
  - API key for transactional emails
  - Templates for customer and artist notifications

### Optional Services (V2)
- **Sentry**: Error monitoring
- **Google Analytics**: Traffic analysis
- **Cloudinary**: Advanced image optimization (alternative to Sanity Assets)

### Environment Variables
```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
EMAIL_API_KEY (V1+)
```
