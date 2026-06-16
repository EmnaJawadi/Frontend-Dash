# Dashboard WhatsApp Support

Interface Next.js 16 pour les administrateurs plateforme, administrateurs d'entreprise, agents et employes limites au profil.

## Installation

```bash
npm install
npm run dev
```

Variables publiques minimales:

```env
NEXT_PUBLIC_APP_NAME=WhatsApp Support
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

## Authentification

Les jetons d'acces et de rafraichissement sont geres par le backend dans des cookies HttpOnly et `SameSite=Lax`. Le frontend appelle l'API avec `credentials: include` et ne stocke aucun JWT dans `localStorage` ou `sessionStorage`. Les informations utilisateur locales servent uniquement a l'affichage; le backend reste la source d'autorite. En production, servir le frontend et l'API sur le meme site.

## Roles

- `SUPER_ADMIN`: administration globale.
- `OWNER`: administration de son entreprise.
- `AGENT`: conversations, contacts, KB et produits selon les permissions backend.
- `EMPLOYEE`: profil uniquement.

## Verification

```bash
npm run lint
npm run build
```
