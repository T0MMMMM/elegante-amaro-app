# Elegante Amaro — Back-office Web

Interface d'administration (staff) de la plateforme Elegante Amaro :
dashboard, gestion des produits, des commandes, des tables et des utilisateurs.

> Fait partie du monorepo. **Ne pas faire `npm install` ici** — lancez-le à la racine.
> Voir le [README racine](../../README.md) pour la vue d'ensemble.

## Stack

- **React 19** + **TypeScript**
- **Vite 6** — dev server & build
- **React Router 7** — routing
- Styles : CSS-in-JS / inline + styles globaux dans `index.html`
  (polices *Bebas Neue* + *Montserrat*, palette Elegante Amaro)

## Architecture

```
apps/web/
├── index.html                # styles globaux, polices, point de montage
├── vite.config.ts            # plugin React, alias shared, proxy /api
└── src/
    ├── main.tsx               # bootstrap React
    ├── App.tsx                # routes (React Router)
    ├── pages/                 # une page par section du back-office
    ├── components/
    │   ├── layout/            # Layout, Sidebar, NavMenu
    │   └── ui/                # Button, Modal, DataTable, MultiSelect, PageShell
    ├── services/              # client HTTP unique + 1 service par ressource
    ├── api/                   # types/contrats d'API (s'appuient sur shared/types)
    ├── hooks/useResource.ts   # hook générique de chargement CRUD
    └── utils/                 # helpers (ex. formatDate)
```

**Couches :** `page` → `service` → `client HTTP` (`services/client.ts`) → API.
Le client unique est le **seul** endroit qui appelle `fetch`.

## Pages / routes

| Route | Page | Rôle |
|-------|------|------|
| `/dashboard` | `Dashboard` | Vue d'ensemble (route par défaut) |
| `/users` | `Users` | Gestion des clients |
| `/items` | `Items` | Gestion des produits |
| `/categories` | `Categories` | Gestion des catégories |
| `/item-options` | `ItemOptions` | Gestion des options/suppléments |
| `/commands` | `Commands` | Suivi des commandes |
| `/new-command` | `NewCommand` | Création d'une commande |
| `/tables` | `Tables` | Gestion des tables |
| `/state-commands` | `StateCommands` | Gestion des états de commande |

`/` redirige vers `/dashboard`.

## Connexion à l'API (proxy Vite)

Le client web appelle des chemins préfixés par **`/api`** (voir `src/services/client.ts`).
En développement, Vite **proxifie** ces requêtes vers l'API et retire le préfixe :

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

Donc `GET /api/items` (web) → `GET /items` (API). Avantage : pas de souci CORS en dev,
et l'URL de l'API n'est pas codée en dur dans le code applicatif.

> En production (build statique), prévoir un reverse-proxy équivalent (ex. Nginx)
> mappant `/api` vers l'API.

## Types & thème partagés

Les contrats de données **et** la palette de couleurs proviennent du package partagé,
via un alias Vite :

```ts
import type { Item, Command, User } from '@elegante-amaro-app/shared/types'
import { theme } from '@elegante-amaro-app/shared/constants'   // couleurs/polices
```

```ts
// vite.config.ts
resolve: {
  alias: {
    '@elegante-amaro-app/shared': path.resolve(__dirname, '../../shared'),
  },
}
```

## Scripts

Le package web s'appelle `@elegante-amaro/web`.

```bash
npm run dev     --workspace @elegante-amaro/web   # serveur de dev → http://localhost:5173
npm run build   --workspace @elegante-amaro/web   # tsc -b && vite build → dist/
npm run preview --workspace @elegante-amaro/web   # prévisualise le build
```

> Le plus simple : `npm start` à la **racine** lance l'API + le web + le mobile d'un coup
> (voir [README racine](../../README.md#-démarrage)).
>
> Pré-requis si vous lancez le web seul : l'API doit tourner sur `http://localhost:3000`
> (cf. proxy ci-dessus).
