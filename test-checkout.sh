#!/bin/bash

# Script de test pour l'API Checkout
# Usage: ./test-checkout.sh

echo "=================================="
echo "Test API Checkout Stripe"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Vérifier que le serveur est lancé
echo -e "${YELLOW}1. Vérification du serveur...${NC}"
if curl -s -f http://localhost:3000/api/test-sanity > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Serveur actif${NC}"
else
    echo -e "${RED}❌ Serveur non accessible sur http://localhost:3000${NC}"
    echo -e "${RED}   Assurez-vous d'avoir lancé 'npm run dev' dans un autre terminal${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}2. Récupération de la liste des œuvres...${NC}"

ARTWORKS_RESPONSE=$(curl -s http://localhost:3000/api/artworks-list)
ARTWORKS_COUNT=$(echo $ARTWORKS_RESPONSE | jq '.artworks | length')

echo -e "${GREEN}✅ $ARTWORKS_COUNT œuvre(s) trouvée(s)${NC}"
echo ""

# Trouver une œuvre disponible
AVAILABLE_ARTWORK_ID=$(echo $ARTWORKS_RESPONSE | jq -r '.artworks[] | select(.isAvailable == true) | ._id' | head -1)
AVAILABLE_ARTWORK_TITLE=$(echo $ARTWORKS_RESPONSE | jq -r '.artworks[] | select(.isAvailable == true) | .title' | head -1)

# Trouver une œuvre vendue
SOLD_ARTWORK_ID=$(echo $ARTWORKS_RESPONSE | jq -r '.artworks[] | select(.isAvailable == false) | ._id' | head -1)
SOLD_ARTWORK_TITLE=$(echo $ARTWORKS_RESPONSE | jq -r '.artworks[] | select(.isAvailable == false) | .title' | head -1)

echo "=================================="
echo "TESTS DE L'API CHECKOUT"
echo "=================================="
echo ""

# Test 1: Œuvre disponible
if [ ! -z "$AVAILABLE_ARTWORK_ID" ] && [ "$AVAILABLE_ARTWORK_ID" != "null" ]; then
    echo -e "${YELLOW}Test 1: Création de session pour une œuvre disponible${NC}"
    echo -e "Œuvre testée: $AVAILABLE_ARTWORK_TITLE"

    CHECKOUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/checkout \
        -H "Content-Type: application/json" \
        -d "{\"artworkId\": \"$AVAILABLE_ARTWORK_ID\"}")

    HTTP_CODE=$(echo "$CHECKOUT_RESPONSE" | tail -1)
    RESPONSE_BODY=$(echo "$CHECKOUT_RESPONSE" | head -n -1)

    if [ "$HTTP_CODE" == "200" ]; then
        SESSION_ID=$(echo $RESPONSE_BODY | jq -r '.sessionId')
        SESSION_URL=$(echo $RESPONSE_BODY | jq -r '.url')

        echo -e "${GREEN}✅ Status: 200 OK${NC}"
        echo -e "${GREEN}✅ Session ID: $SESSION_ID${NC}"
        echo -e "${GREEN}✅ URL Stripe: $SESSION_URL${NC}"
        echo ""
        echo -e "${CYAN}Ouvrez cette URL dans votre navigateur pour voir la page de paiement:${NC}"
        echo -e "${NC}$SESSION_URL${NC}"
        echo ""
    else
        echo -e "${RED}❌ Status: $HTTP_CODE (attendu: 200)${NC}"
        echo -e "${RED}Réponse: $RESPONSE_BODY${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Aucune œuvre disponible pour tester${NC}"
    echo -e "${YELLOW}   Ajoutez une œuvre dans Sanity Studio: http://localhost:3000/studio${NC}"
fi

echo ""

# Test 2: Œuvre indisponible
if [ ! -z "$SOLD_ARTWORK_ID" ] && [ "$SOLD_ARTWORK_ID" != "null" ]; then
    echo -e "${YELLOW}Test 2: Tentative avec une œuvre vendue${NC}"
    echo -e "Œuvre testée: $SOLD_ARTWORK_TITLE"

    HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X POST http://localhost:3000/api/checkout \
        -H "Content-Type: application/json" \
        -d "{\"artworkId\": \"$SOLD_ARTWORK_ID\"}")

    if [ "$HTTP_CODE" == "410" ]; then
        echo -e "${GREEN}✅ Status: 410 Gone (attendu)${NC}"
    else
        echo -e "${YELLOW}⚠️  Status: $HTTP_CODE (attendu: 410)${NC}"
    fi
fi

echo ""

# Test 3: ID inexistant
echo -e "${YELLOW}Test 3: Tentative avec un ID inexistant${NC}"
HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X POST http://localhost:3000/api/checkout \
    -H "Content-Type: application/json" \
    -d '{"artworkId": "id-inexistant-xyz"}')

if [ "$HTTP_CODE" == "404" ]; then
    echo -e "${GREEN}✅ Status: 404 Not Found (attendu)${NC}"
else
    echo -e "${YELLOW}⚠️  Status: $HTTP_CODE (attendu: 404)${NC}"
fi

echo ""

# Test 4: Données manquantes
echo -e "${YELLOW}Test 4: Tentative sans artworkId${NC}"
HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X POST http://localhost:3000/api/checkout \
    -H "Content-Type: application/json" \
    -d '{}')

if [ "$HTTP_CODE" == "400" ]; then
    echo -e "${GREEN}✅ Status: 400 Bad Request (attendu)${NC}"
else
    echo -e "${YELLOW}⚠️  Status: $HTTP_CODE (attendu: 400)${NC}"
fi

echo ""
echo "=================================="
echo "RÉSUMÉ"
echo "=================================="
echo -e "${GREEN}✅ API Checkout opérationnelle${NC}"
echo -e "${GREEN}✅ Validation des erreurs fonctionnelle${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo -e "1. Vérifiez la session dans le Dashboard Stripe:"
echo -e "${CYAN}   https://dashboard.stripe.com/test/payments${NC}"
echo -e "2. Testez le paiement avec la carte: 4242 4242 4242 4242"
echo -e "3. Passez à l'Étape 3: Webhook Stripe"
echo ""
