#!/bin/bash
# Script de vérification de la configuration Stripe
# Usage: bash verify-stripe-setup.sh

echo "🔍 Vérification de la configuration Stripe..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# 1. Vérifier que les dépendances sont installées
echo "📦 Vérification des dépendances npm..."
if [ -d "node_modules/stripe" ] && [ -d "node_modules/@stripe" ]; then
    echo -e "${GREEN}✓${NC} Packages Stripe installés"
else
    echo -e "${RED}✗${NC} Packages Stripe NON installés"
    echo "   → Exécutez: npm install"
    errors=$((errors+1))
fi
echo ""

# 2. Vérifier que .env.local existe
echo "🔐 Vérification des variables d'environnement..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} Fichier .env.local existe"

    # Vérifier que les clés Stripe sont configurées
    if grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_" .env.local; then
        echo -e "${GREEN}✓${NC} Clé publique Stripe configurée (test mode)"
    elif grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_" .env.local; then
        echo -e "${YELLOW}⚠${NC}  Clé publique Stripe en mode LIVE (utiliser test mode)"
        errors=$((errors+1))
    else
        echo -e "${RED}✗${NC} Clé publique Stripe NON configurée"
        echo "   → Remplacez pk_test_xxxxx par votre vraie clé"
        errors=$((errors+1))
    fi

    if grep -q "STRIPE_SECRET_KEY=sk_test_" .env.local; then
        echo -e "${GREEN}✓${NC} Clé secrète Stripe configurée (test mode)"
    elif grep -q "STRIPE_SECRET_KEY=sk_live_" .env.local; then
        echo -e "${YELLOW}⚠${NC}  Clé secrète Stripe en mode LIVE (utiliser test mode)"
        errors=$((errors+1))
    else
        echo -e "${RED}✗${NC} Clé secrète Stripe NON configurée"
        echo "   → Remplacez sk_test_xxxxx par votre vraie clé"
        errors=$((errors+1))
    fi
else
    echo -e "${RED}✗${NC} Fichier .env.local n'existe pas"
    echo "   → Copiez .env.example en .env.local et configurez les clés"
    errors=$((errors+1))
fi
echo ""

# 3. Vérifier que .env.local est dans .gitignore
echo "🔒 Vérification de la sécurité..."
if grep -q "\.env\.local" .gitignore; then
    echo -e "${GREEN}✓${NC} .env.local dans .gitignore"
else
    echo -e "${RED}✗${NC} .env.local NON dans .gitignore"
    echo "   → Ajoutez .env.local à .gitignore"
    errors=$((errors+1))
fi
echo ""

# 4. Vérifier que les fichiers ont été créés
echo "📁 Vérification des fichiers Stripe..."
if [ -f "lib/stripe.ts" ]; then
    echo -e "${GREEN}✓${NC} lib/stripe.ts créé"
else
    echo -e "${RED}✗${NC} lib/stripe.ts manquant"
    errors=$((errors+1))
fi

if [ -f "app/api/test-stripe/route.ts" ]; then
    echo -e "${GREEN}✓${NC} app/api/test-stripe/route.ts créé"
else
    echo -e "${RED}✗${NC} app/api/test-stripe/route.ts manquant"
    errors=$((errors+1))
fi
echo ""

# 5. Vérifier TypeScript (si tsc est disponible)
echo "🔧 Vérification TypeScript..."
if command -v npx &> /dev/null; then
    if npx tsc --noEmit 2>&1 | grep -q "error"; then
        echo -e "${RED}✗${NC} Erreurs TypeScript détectées"
        echo "   → Exécutez: npx tsc --noEmit pour voir les détails"
        errors=$((errors+1))
    else
        echo -e "${GREEN}✓${NC} Pas d'erreur TypeScript"
    fi
else
    echo -e "${YELLOW}⚠${NC}  npx non disponible, vérification TypeScript ignorée"
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ Configuration Stripe OK !${NC}"
    echo ""
    echo "Prochaines étapes :"
    echo "1. Démarrez le serveur: npm run dev"
    echo "2. Testez la connexion: http://localhost:3000/api/test-stripe"
    echo "3. Vous devriez voir: {\"status\": \"success\", \"mode\": \"test\"}"
else
    echo -e "${RED}❌ $errors erreur(s) détectée(s)${NC}"
    echo ""
    echo "Consultez les messages ci-dessus et corrigez les problèmes."
    echo "Documentation: STRIPE_SETUP_GUIDE.md"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit $errors
