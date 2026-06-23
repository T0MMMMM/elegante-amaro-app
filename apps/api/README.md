# Elegante Amaro — API

API REST de la plateforme Elegante Amaro. **Seule source de vérité des données.**
Consommée par l'app mobile (client) et le back-office web (staff).

> Fait partie du monorepo. **Ne pas faire `npm install` ici** — lancez-le à la racine.
> Voir le [README racine](../../README.md) pour la vue d'ensemble.

## Stack

- **Express 5** — serveur HTTP / routing
- **Sequelize 6** — ORM
- **MySQL** (`mysql2`) — base de données
- **dotenv** — configuration
- **sequelize-cli** — migrations & seeders
- **nodemon** — rechargement en dev
- ESM (`"type": "module"`) ; la config CLI est en `.cjs` (CommonJS).

## Architecture

```
apps/api/
├── server.js                 # point d'entrée : init DB puis app.listen(3000)
├── migrations/               # schéma de la base (sequelize-cli)
├── seeders/                  # données de démo
└── src/
    ├── config/
    │   ├── database.js        # instance Sequelize + initDB() — defaults DB Docker, .env optionnel
    │   └── config.cjs         # config sequelize-cli — mêmes defaults
    ├── models/                # modèles Sequelize + index.js (associations)
    ├── services/              # logique d'accès aux données (1 par entité)
    ├── controllers/           # handlers Express (req/res)
    └── routes/routes.js       # déclaration de toutes les routes
```

**Flux d'une requête** : `route` → `controller` → `service` → `model` (Sequelize) → MySQL.
Les associations entre modèles sont déclarées **une seule fois** dans `src/models/index.js`.

## Configuration

**Aucune config requise.** `database.js` et `config.cjs` ont des **valeurs par défaut alignées
sur la DB Docker** (`docker-compose.yml`), donc l'API fonctionne sans aucun `.env` :

```
DB_USER=app   DB_PASSWORD=app   DB_NAME=elegante_amaro_db
DB_HOST=127.0.0.1   DB_PORT=3307   PORT=3000
```

Pour surcharger (MySQL perso, port occupé, base distante), créez un `.env` **à la racine** du
monorepo depuis [`.env.example`](../../.env.example), ou passez des options à l'orchestrateur :
`npm start -- --db-user … --db-pass …`. Voir le [README racine](../../README.md#démarrage).

## Scripts (`npm run <script> --workspace api`)

| Script | Description |
|--------|-------------|
| `dev` | Démarre l'API avec nodemon (rechargement auto) |
| `start` | Démarre l'API (`node server.js`) |
| `db:create` | Crée la base de données |
| `db:migrate` | Applique les migrations |
| `db:migrate:undo` | Annule toutes les migrations |
| `db:seed` | Insère les données de démo |
| `db:reset` | `undo` + `migrate` + `seed` (remise à zéro complète) |

> Le plus simple : `npm start` à la **racine** fait tout (install + DB + lance les 3 apps).
> Les commandes ci-dessous servent à piloter l'API seule.

Démarrage typique :

```bash
npm run db:create  --workspace api
npm run db:migrate --workspace api
npm run db:seed    --workspace api
npm run dev        --workspace api   # → http://localhost:3000
```

`GET /` renvoie `{ "message": "API Cafeteria OK" }` (healthcheck).

> `app.listen(3000)` écoute sur **toutes les interfaces** (`0.0.0.0`),
> donc l'API est joignable depuis un téléphone via l'IP LAN de la machine.

## Modèle de données

Entités et relations principales (déclarées dans `src/models/index.js`) :

```
Category ──< Item ──< ItemItemOption >── ItemOption
                 │
User ──< Command >── CommandType / StateCommand / Table
              │
              └─< CommandItem ──< CommandItemOption >── ItemOption
```

| Entité | Description |
|--------|-------------|
| `User` | Client (email, `password_hash`, `fidelity_points`, `roles`) |
| `Category` | Catégorie de produits |
| `Item` | Produit (nom, slug, prix, image, catégorie) |
| `ItemOption` | Option (supplément, `extra_price`) |
| `ItemItemOption` | Table de liaison Item ↔ Option |
| `Table` | Table physique (`numero`) |
| `CommandType` | Type de commande (sur place / à emporter / …) |
| `StateCommand` | État de commande (en attente, prête, …) |
| `Command` | Commande (user, type, état, table, `total_price`, `tva_rate`) |
| `CommandItem` | Ligne de commande (quantité, taille, prix unitaire, total ligne) |
| `CommandItemOption` | Option appliquée à une ligne de commande |

Les formes exactes sont typées dans [`shared/types`](../../shared/types/index.ts).

> Convention Sequelize : `define.underscored = true` → colonnes en **snake_case**.

## Endpoints REST

CRUD complet pour chaque entité (`GET` liste, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id`) :

| Ressource | Base path |
|-----------|-----------|
| Users | `/users` |
| Categories | `/categories` |
| Items | `/items` |
| Item options | `/item-options` |
| Items ↔ Item options | `/items-item-options` *(pas de `PUT`)* |
| State commands | `/state-commands` |
| Commands types | `/commands-types` |
| Tables | `/tables` |
| Commands | `/commands` |
| Commands items | `/commands-items` |
| Commands items options | `/commands-items-options` |

Routes supplémentaires :

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/commands/:commandId/items` | Lignes d'une commande donnée |

Voir [`src/routes/routes.js`](src/routes/routes.js) pour la liste exhaustive.

## Notes

- Pas d'authentification middleware ni de JWT pour l'instant : la connexion mobile compare
  les identifiants côté service via `/users` (à durcir avant production).
- `cors` est une dépendance disponible mais n'est pas (encore) montée dans `server.js` ;
  le web passe par le proxy Vite, ce qui évite les problèmes CORS en dev.
