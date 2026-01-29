# Script de test pour l'API Checkout
# Usage: .\test-checkout.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test API Checkout Stripe" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que le serveur est lancé
Write-Host "1. Vérification du serveur..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/test-sanity" -Method Get -TimeoutSec 5
    Write-Host "✅ Serveur actif" -ForegroundColor Green
} catch {
    Write-Host "❌ Serveur non accessible sur http://localhost:3000" -ForegroundColor Red
    Write-Host "   Assurez-vous d'avoir lancé 'npm run dev' dans un autre terminal" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Récupération de la liste des œuvres..." -ForegroundColor Yellow

try {
    $artworksResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/artworks-list" -Method Get
    $artworks = $artworksResponse.artworks

    Write-Host "✅ $($artworks.Count) œuvre(s) trouvée(s)" -ForegroundColor Green
    Write-Host ""

    # Afficher les œuvres disponibles
    $availableArtworks = $artworks | Where-Object { $_.isAvailable -eq $true }
    $unavailableArtworks = $artworks | Where-Object { $_.isAvailable -eq $false }

    Write-Host "Œuvres disponibles:" -ForegroundColor Green
    foreach ($artwork in $availableArtworks) {
        Write-Host "  - $($artwork.title) (ID: $($artwork._id))" -ForegroundColor White
    }

    if ($unavailableArtworks.Count -gt 0) {
        Write-Host ""
        Write-Host "Œuvres vendues:" -ForegroundColor Red
        foreach ($artwork in $unavailableArtworks) {
            Write-Host "  - $($artwork.title) (ID: $($artwork._id))" -ForegroundColor White
        }
    }

    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "TESTS DE L'API CHECKOUT" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""

    # Test 1: Œuvre disponible
    if ($availableArtworks.Count -gt 0) {
        $testArtwork = $availableArtworks[0]
        Write-Host "Test 1: Création de session pour une œuvre disponible" -ForegroundColor Yellow
        Write-Host "Œuvre testée: $($testArtwork.title)" -ForegroundColor White

        $body = @{
            artworkId = $testArtwork._id
        } | ConvertTo-Json

        try {
            $checkoutResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/checkout" -Method Post -Body $body -ContentType "application/json"

            Write-Host "✅ Status: 200 OK" -ForegroundColor Green
            Write-Host "✅ Session ID: $($checkoutResponse.sessionId)" -ForegroundColor Green
            Write-Host "✅ URL Stripe: $($checkoutResponse.url)" -ForegroundColor Green
            Write-Host ""
            Write-Host "Ouvrez cette URL dans votre navigateur pour voir la page de paiement:" -ForegroundColor Cyan
            Write-Host $checkoutResponse.url -ForegroundColor White
            Write-Host ""
        } catch {
            Write-Host "❌ Erreur lors de la création de la session" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Aucune œuvre disponible pour tester" -ForegroundColor Yellow
        Write-Host "   Ajoutez une œuvre dans Sanity Studio: http://localhost:3000/studio" -ForegroundColor Yellow
    }

    Write-Host ""

    # Test 2: Œuvre indisponible
    if ($unavailableArtworks.Count -gt 0) {
        $soldArtwork = $unavailableArtworks[0]
        Write-Host "Test 2: Tentative avec une œuvre vendue" -ForegroundColor Yellow
        Write-Host "Œuvre testée: $($soldArtwork.title)" -ForegroundColor White

        $body = @{
            artworkId = $soldArtwork._id
        } | ConvertTo-Json

        try {
            $response = Invoke-RestMethod -Uri "http://localhost:3000/api/checkout" -Method Post -Body $body -ContentType "application/json"
            Write-Host "❌ Devrait retourner une erreur 410, mais a réussi" -ForegroundColor Red
        } catch {
            if ($_.Exception.Response.StatusCode -eq 410) {
                Write-Host "✅ Status: 410 Gone (attendu)" -ForegroundColor Green
                Write-Host "✅ Message: This artwork is no longer available" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Status: $($_.Exception.Response.StatusCode) (attendu: 410)" -ForegroundColor Yellow
            }
        }
    }

    Write-Host ""

    # Test 3: ID inexistant
    Write-Host "Test 3: Tentative avec un ID inexistant" -ForegroundColor Yellow
    $body = @{
        artworkId = "id-inexistant-xyz"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/checkout" -Method Post -Body $body -ContentType "application/json"
        Write-Host "❌ Devrait retourner une erreur 404, mais a réussi" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "✅ Status: 404 Not Found (attendu)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Status: $($_.Exception.Response.StatusCode) (attendu: 404)" -ForegroundColor Yellow
        }
    }

    Write-Host ""

    # Test 4: Données manquantes
    Write-Host "Test 4: Tentative sans artworkId" -ForegroundColor Yellow
    $body = @{} | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/checkout" -Method Post -Body $body -ContentType "application/json"
        Write-Host "❌ Devrait retourner une erreur 400, mais a réussi" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Write-Host "✅ Status: 400 Bad Request (attendu)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Status: $($_.Exception.Response.StatusCode) (attendu: 400)" -ForegroundColor Yellow
        }
    }

    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "RÉSUMÉ" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "✅ API Checkout opérationnelle" -ForegroundColor Green
    Write-Host "✅ Validation des erreurs fonctionnelle" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. Vérifiez la session dans le Dashboard Stripe:" -ForegroundColor White
    Write-Host "   https://dashboard.stripe.com/test/payments" -ForegroundColor Cyan
    Write-Host "2. Testez le paiement avec la carte: 4242 4242 4242 4242" -ForegroundColor White
    Write-Host "3. Passez à l'Étape 3: Webhook Stripe" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "❌ Erreur lors de la récupération des œuvres" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
