// Config pour sequelize-cli (migrations/seeders).
// Lit le MÊME .env que l'application → une seule source de vérité.
// En .cjs pour rester CommonJS malgré "type": "module" dans package.json.
require('dotenv').config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
