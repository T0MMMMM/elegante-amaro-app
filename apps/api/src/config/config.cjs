// Config pour sequelize-cli (migrations/seeders).
// Lit le MÊME .env unique (racine du monorepo) que l'application → une seule source de vérité.
// En .cjs pour rester CommonJS malgré "type": "module" dans package.json.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

// Defaults alignes sur la DB Docker (docker-compose.yml) — voir database.js.
const base = {
  username: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'app',
  database: process.env.DB_NAME || 'elegante_amaro_db',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3307,
  dialect: 'mysql',
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
