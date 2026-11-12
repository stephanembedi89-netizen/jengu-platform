# Modèles d’e-mails Klas 237 (Supabase Auth)

À coller dans Supabase : Authentication > Emails > Templates (disponible une fois le SMTP Brevo activé).

| Modèle Supabase | Objet | Fichier |
|---|---|---|
| Confirm signup | Confirmez votre compte Klas 237 · Confirm your account | confirmer-inscription.html |
| Reset password | Klas 237 : nouveau mot de passe · New password | mot-de-passe-oublie.html |
| Change email address | Klas 237 : confirmez votre nouvelle adresse · Confirm your new email | changement-adresse.html |
| Magic link | Votre lien de connexion Klas 237 · Your sign-in link | lien-de-connexion.html |

Variables Supabase utilisées : {{ .ConfirmationURL }}, {{ .NewEmail }}.
