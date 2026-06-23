import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// .env unique a la racine du monorepo (apps/api/src/config -> ../../../..).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Valeurs par defaut = celles de la DB Docker (docker-compose.yml).
// Permettent un `git clone` + `npm start` sans aucun .env. Surcharge possible
// via le .env racine ou les options de scripts/start.mjs.
const {
  DB_NAME = 'elegante_amaro_db',
  DB_USER = 'app',
  DB_PASSWORD = 'app',
  DB_HOST = '127.0.0.1',
  DB_PORT = '3307'
} = process.env;

export const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true
    }
  }
);

export async function initDB() {
  await sequelize.authenticate();
  console.log('Database connection has been established successfully.');
}

export default sequelize;
