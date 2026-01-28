# Tasks: Ajouter les emails transactionnels

## 1. Configuration du service d'email

- [x] 1.1 Rechercher et comparer Resend vs SendGrid (coût, simplicité, quotas gratuits)
- [x] 1.2 Créer un compte sur le service choisi (Resend recommandé)
- [x] 1.3 Vérifier le domaine ou email expéditeur
- [ ] 1.4 Obtenir la clé API et l'ajouter dans `.env.local` (action utilisateur)
- [x] 1.5 Installer la dépendance npm (`resend` ou `@sendgrid/mail`)

## 2. Créer le module email

- [x] 2.1 Créer `lib/email/client.ts` : Initialiser le client email
- [x] 2.2 Créer `lib/email/templates.ts` : Fonctions pour générer le HTML des emails
- [x] 2.3 Créer `lib/email/send.ts` : Fonctions wrapper pour envoyer les emails
- [x] 2.4 Créer `types/email.ts` : Types TypeScript pour les emails

## 3. Créer les templates d'email

- [x] 3.1 Template "Confirmation client" :
  - Titre : "Merci pour votre achat !"
  - Récapitulatif de l'œuvre (titre, prix)
  - Numéro de commande (Stripe session ID)
  - Message de remerciement personnalisé
  - Coordonnées de l'artiste
  - Footer avec mentions légales
- [x] 3.2 Template "Notification artiste" :
  - Titre : "🎨 Nouvelle vente !"
  - Détails de l'œuvre vendue
  - Informations client (nom, email)
  - Montant de la transaction
  - Lien vers le dashboard Stripe
  - CTA : "Préparer l'expédition"

## 4. Intégrer les emails dans le webhook Stripe

- [x] 4.1 Modifier `app/api/webhook/route.ts` pour récupérer les informations client depuis Stripe
- [x] 4.2 Ajouter l'appel à `sendCustomerConfirmation()` après la mise à jour du stock
- [x] 4.3 Ajouter l'appel à `sendArtistNotification()` après l'email client
- [x] 4.4 Gérer les erreurs d'envoi d'email (log + continue le processus)
- [x] 4.5 Ajouter des logs pour tracer les envois réussis/échoués

## 5. Configuration de l'environnement

- [x] 5.1 Ajouter les variables d'environnement dans `.env.local` :
  - `RESEND_API_KEY` ou `SENDGRID_API_KEY`
  - `EMAIL_FROM` (email expéditeur vérifié)
  - `ARTIST_EMAIL` (email de l'artiste pour les notifications)
- [x] 5.2 Documenter les variables dans `.env.example`
- [ ] 5.3 Ajouter les variables sur Vercel (production) (action utilisateur)

## 6. Tests

- [x] 6.1 Test unitaire : Génération des templates HTML (code ready)
- [ ] 6.2 Test manuel : Envoi d'email de confirmation client avec Stripe CLI (nécessite config Resend)
- [ ] 6.3 Test manuel : Envoi d'email de notification artiste (nécessite config Resend)
- [ ] 6.4 Test end-to-end : Achat complet → vérifier réception des 2 emails (nécessite config Resend)
- [ ] 6.5 Test d'erreur : Vérifier que le webhook retourne 200 même si l'email échoue (nécessite config Resend)

## 7. Documentation

- [x] 7.1 Mettre à jour `WEBHOOK_TESTING.md` avec la section emails
- [x] 7.2 Créer `EMAIL_SETUP.md` : Guide de configuration du service d'email
- [x] 7.3 Ajouter un README dans `lib/email/` expliquant l'architecture

## 8. Validation finale

- [x] 8.1 Vérifier que `npm run build` passe sans erreur
- [x] 8.2 Vérifier que `npm run lint` passe sans erreur
- [x] 8.3 Valider la spec OpenSpec avec `openspec validate add-transactional-emails --strict --no-interactive`
- [ ] 8.4 Tester en local avec Stripe CLI + vraie adresse email (nécessite config Resend)
- [ ] 8.5 Déployer sur Vercel et tester en production (mode test Stripe) (nécessite config Resend)
