# Elegante Amaro

Plateforme de commande pour un café/restaurant haut de gamme **Elegante Amaro**.
Le projet réunit trois applications autour d'une seule API et d'un socle de code partagé,
le tout dans un **monorepo npm workspaces** (un seul `npm install` à la racine).

| App | Rôle | Stack |
|-----|------|-------|
| **`apps/mobile`** | Application client (commander, fidélité, carte immersive en 3D) | Expo / React Native + expo-router |
| **`apps/web`** | Back-office d'administration (dashboard, gestion produits & commandes) | React 19 + Vite + React Router |
| **`apps/api`** | API REST (source de vérité des données) | Express 5 + Sequelize + MySQL |
| **`shared`** | Types & constantes de thème partagés | TypeScript |

---

## But du projet

Offrir un parcours de commande complet pour un établissement :

- **Côté client (mobile)** : parcourir la carte, visualiser les produits (rendu 3D `three`/`@react-three/fiber`),
  composer une commande (taille, options), choisir un mode (sur place / à emporter / table),
  payer, suivre l'état de la commande, et cumuler des **points de fidélité**.
- **Côté staff (web)** : back-office pour administrer utilisateurs, catégories, items, options,
  tables, types & états de commande, et créer/suivre les commandes.
- **Côté serveur (api)** : exposer toutes ces données via une API REST adossée à une base MySQL.

L'orientation produit de l'app mobile est **luxe / gastronomique immersive** (typographie soignée,
animations, fidélité présentée comme un statut).

---

## Architecture du monorepo

```
elegante-amaro-app/
├── package.json            # racine — déclare les workspaces (un seul install)
├── tsconfig.json           # tsconfig de base (étend expo/tsconfig.base)
│
├── apps/
│   ├── api/                # API REST Express + Sequelize (MySQL)
│   ├── web/                # Back-office React + Vite
│   └── mobile/             # App client Expo / React Native
│
└── shared/                 # Code partagé (types + thème) — @elegante-amaro-app/shared
    ├── types/              # Interfaces TypeScript des entités métier
    └── constants/          # colors, fonts, theme
```

### Le système `shared`

`shared` est un package interne (`@elegante-amaro-app/shared`, `private`) qui centralise
**les types métier et les constantes de thème** pour éviter la duplication entre apps.

Il n'a pas d'étape de build : il expose directement ses fichiers `.ts` via la clé `exports`
de son `package.json` :

```jsonc
"exports": {
  "./types":            "./types/index.ts",     // User, Item, Command, …
  "./constants":        "./constants/index.ts", // { colors, fonts, theme }
  "./constants/colors": "./constants/colors.ts",
  "./constants/fonts":  "./constants/fonts.ts"
}
```

**Consommation :**

```ts
import type { Item, Command } from '@elegante-amaro-app/shared/types'
import { theme } from '@elegante-amaro-app/shared/constants'
```

- **`apps/web`** consomme `shared/types` (types métier) **et** `shared/constants` (couleurs/thème),
  résolus via un alias Vite (voir `apps/web/vite.config.ts`).
- **`apps/api`** est en JavaScript pur (pas de typage importé).
- **`apps/mobile`** consomme aussi `shared` : ses **DTO d'API dérivent** des types de
  `shared/types`, et sa **palette `src/theme/colors.ts` dérive** de `shared/constants/colors`
  (résolution via la config monorepo de `metro.config.js` + alias `tsconfig`). Aucune couleur
  ni type de données n'est dupliqué entre les apps.

> `shared` est la **source de vérité** des formes de données : faire évoluer un type ici
> doit guider les apps qui le consomment.

### Pourquoi un seul `npm install` ?

Le `package.json` racine déclare des **npm workspaces** :

```jsonc
{
  "private": true,
  "workspaces": ["apps/*", "shared"],
  "overrides": { "react": "19.1.0", "react-dom": "19.1.0" }
}
```

Conséquences :

- **Un seul `npm install` à la racine** installe les dépendances de **toutes** les apps + `shared`.
- Les dépendances communes sont **hoistées** dans le `node_modules/` racine (pas de duplication).
- `shared` est lié comme un package local : importable par son nom sans publication.
- Le bloc `overrides` **épingle React 19.1.0** partout (mobile et web alignés).

**Ne lancez pas `npm install` dans `apps/*`** : faites-le toujours à la racine.

---

## Démarrage

### En une seule commande

```bash
git clone <repo> && cd elegante-amaro-app
npm start
```

C'est tout — **aucun `.env` à éditer, aucun MySQL à installer**. L'orchestrateur Node
[`scripts/start.mjs`](scripts/start.mjs), identique sur **Linux / macOS / Windows**, enchaîne :

1. `npm install` (sauté si `node_modules/` existe déjà — `FORCE_INSTALL=1` pour forcer) ;
2. démarre la **base dans Docker** (`docker compose up -d --wait db`) — rien à installer ;
3. applique les migrations, puis **ne *seed* que si la base est vide** (relançable sans erreur) ;
4. détecte l'**IP LAN** de la machine (`os.networkInterfaces()`) et l'injecte dans le mobile ;
5. lance **les 3 apps en parallèle** (API + web + mobile). **`Ctrl+C` arrête les apps
   ET la base Docker** — les **données sont conservées** (le volume survit). Ajoutez
   `--keep-db` pour laisser la base active après l'arrêt.

### Prérequis

- **Node.js ≥ 20** (testé sous Node 26) et **npm ≥ 10**
- **Docker** + **Docker Compose** (Docker Desktop sur Windows/macOS) — pour la base
- Pour le mobile : l'app **Expo Go** sur un téléphone (même Wi-Fi que la machine),
  ou un émulateur Android / simulateur iOS

> **Windows** : installez simplement **Docker Desktop** + **Node.js**, puis `npm start` dans
> PowerShell ou cmd. Plus besoin de WSL, de Git Bash ni d'installer MySQL.

### Variantes & options

```bash
npm run setup       # tout sauf lancer les apps (install + DB)
npm run reset-db    # repart de zéro (recrée le volume Docker + reseed)
npm run db:stop     # arrête la base Docker (docker compose down)

# Identifiants DB personnalisés (sinon : app / app)
npm start -- --db-user moi --db-pass secret
npm start -- --keep-db           # ne PAS arrêter la base Docker au Ctrl+C
npm start -- --no-docker         # utiliser un MySQL/MariaDB que vous gérez vous-même
npm start -- --help              # toutes les options
```

### Configuration : zéro `.env` requis

Les valeurs par défaut sont **livrées avec le projet** (dans `docker-compose.yml` et la config
de l'API), donc rien à configurer :

| Variable | Défaut | Rôle |
|----------|--------|------|
| `DB_USER` / `DB_PASSWORD` | `app` / `app` | identifiants de la base Docker |
| `DB_NAME` | `elegante_amaro_db` | nom de la base |
| `DB_HOST` / `DB_PORT` | `127.0.0.1` / `3307` | la DB Docker est publiée sur **3307** (évite tout conflit avec un MySQL système sur 3306) |
| `PORT` | `3000` | port de l'API |
| `EXPO_PUBLIC_API_URL` | *(auto)* | URL de l'API pour le mobile, détectée à chaque `npm start` |

Le fichier **`.env` est facultatif** : il ne sert qu'à **surcharger** un défaut (MySQL perso,
port occupé, base distante). Copiez [`.env.example`](.env.example) en `.env` et décommentez ce
que vous voulez changer. Les options CLI (`--db-user`…) priment sur le `.env`.

> Identifiants personnalisés : ils sont pris en compte **à la création du volume** Docker.
> Pour les changer ensuite, recréez le volume : `npm run reset-db -- --db-user … --db-pass …`.

### Lancer chaque app séparément (optionnel)

```bash
npm run dev   --workspace api                      # API  → http://localhost:3000
npm run dev   --workspace @elegante-amaro/web      # Web  → http://localhost:5173
npm run start --workspace @elegante-amaro/mobile   # Mobile (Expo, fallback localhost)
```

> La base doit tourner (`npm run setup` l'a démarrée, ou `docker compose up -d db`).

### Erreurs fréquentes

| Symptôme | Cause | Solution |
|----------|-------|----------|
| `Docker introuvable ou daemon arrêté` | Docker non installé / non démarré | installer & lancer Docker Desktop (Win/macOS) ou le service `docker` (Linux), ou `npm start -- --no-docker` |
| `Serveur MySQL/MariaDB injoignable…` (mode `--no-docker`) | pas de MySQL côté hôte | démarrer votre MySQL, ou retirer `--no-docker` pour laisser Docker gérer |
| Connexion refusée après changement de `--db-user/--db-pass` | volume Docker créé avec les anciens identifiants | `npm run reset-db -- --db-user … --db-pass …` (recrée le volume) |
| `Bind for 0.0.0.0:3307 failed: port is already allocated` | port 3307 déjà pris | changer le port : `npm start -- --db-port 3308` |
| Mobile : logo qui « respire » / chargement infini | API injoignable depuis le téléphone | téléphone et machine sur le **même Wi-Fi** ; relancer via `npm start` (IP auto) |
| `EXPO_PUBLIC_API_URL` modifiée mais sans effet | variable figée au *bundling* | redémarrer Expo avec cache vidé : `npx expo start -c` |
| `EADDRINUSE :3000` (ou `:5173`) | port app déjà utilisé | arrêter le process qui occupe le port |

---

## Comment les apps parlent à l'API

| App | Mécanisme | Base URL |
|-----|-----------|----------|
| **web** | proxy Vite : `/api/*` est réécrit vers `http://localhost:3000` | `/api` |
| **mobile** | `fetch` direct vers l'IP LAN | `EXPO_PUBLIC_API_URL` (auto via `npm start`) |

L'API n'a pas de préfixe `/api` côté serveur : c'est le proxy Vite (web) qui retire le préfixe.
Le port de l'API est **3000** (codé en dur dans `apps/api/server.js` et ciblé par le proxy Vite).

---

## Stack technique

**Commun** — TypeScript, React 19, npm workspaces.

**API** — Node.js, Express 5, Sequelize 6 (ORM), MySQL (`mysql2`), `dotenv`, `nodemon`, `sequelize-cli`.

**Web** — React 19, Vite 6, React Router 7, TypeScript.

**Mobile** — Expo 54, React Native 0.81, expo-router 6 (routing par fichiers),
React Navigation, Reanimated 4, `three` + `@react-three/fiber` + `@react-three/drei` (3D),
expo-haptics, AsyncStorage, polices Google via `@expo-google-fonts/*`.

---

## Documentation par app

- [`apps/api/README.md`](apps/api/README.md) — modèle de données, endpoints, migrations/seeds
- [`apps/web/README.md`](apps/web/README.md) — back-office, pages, proxy
- [`apps/mobile/README.md`](apps/mobile/README.md) — app client, config réseau, structure

---

## Conventions

- Code et commentaires en **français**.
- Données API en **snake_case** (ex. `extra_price`), mappées en `camelCase` côté mobile
  (voir `apps/mobile/src/services/api/mappers.ts`).
- Les écrans n'appellent **jamais** `fetch` directement : ils passent par des *services*,
  qui passent par un **client HTTP unique** par app.
- **Aucune config requise** : les défauts sont livrés (Docker + config API). Le `.env` racine
  est **facultatif**, uniquement pour surcharger (gabarit : [`.env.example`](.env.example)).
