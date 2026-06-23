#!/usr/bin/env node
//
// Orchestrateur multiplateforme (Linux / macOS / Windows) du monorepo Elegante Amaro.
// Remplace l'ancien start.sh : pas de bash, pas de WSL requis, IP LAN detectee via Node.
//
//   npm start                                     # DB Docker + migrate + seed + lance api/web/mobile
//   npm start -- --db-user moi --db-pass secret   # identifiants DB personnalises
//   npm run setup                                 # = npm start -- --no-apps
//   npm run reset-db                              # remet la base a zero (volume Docker recree)
//   npm start -- --no-docker                      # utiliser un MySQL/MariaDB que vous gerez vous-meme
//
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = path.join(ROOT, 'apps', 'api');
const WEB = path.join(ROOT, 'apps', 'web');
const MOBILE = path.join(ROOT, 'apps', 'mobile');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// Identifiants/ports par defaut (committes) : valables pour la DB Docker.
const DEFAULTS = {
  DB_NAME: 'elegante_amaro_db',
  DB_USER: 'app',
  DB_PASSWORD: 'app',
  DB_ROOT_PASSWORD: 'root',
  DB_HOST: '127.0.0.1',
  DB_PORT: '3307',
  PORT: '3000',
  EXPO_PUBLIC_API_URL: '',
};

const log = (m) => console.log(`[start] ${m}`);
const fail = (lines) => {
  for (const l of [].concat(lines)) console.error(`[start] ${l}`);
  process.exit(1);
};

// ─── Arguments ────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const flags = { resetDb: false, noApps: false, noDocker: false, keepDb: false, help: false };
  const env = {};
  const map = {
    '--db-user': 'DB_USER',
    '--db-pass': 'DB_PASSWORD',
    '--db-password': 'DB_PASSWORD',
    '--db-name': 'DB_NAME',
    '--db-port': 'DB_PORT',
    '--db-host': 'DB_HOST',
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--reset-db') { flags.resetDb = true; continue; }
    if (a === '--no-apps') { flags.noApps = true; continue; }
    if (a === '--no-docker') { flags.noDocker = true; continue; }
    if (a === '--keep-db') { flags.keepDb = true; continue; }
    if (a === '--help' || a === '-h') { flags.help = true; continue; }
    const eq = a.indexOf('=');
    const key = eq === -1 ? a : a.slice(0, eq);
    if (map[key]) {
      const val = eq === -1 ? argv[++i] : a.slice(eq + 1);
      if (val === undefined) fail(`Valeur manquante pour ${key}`);
      env[map[key]] = val;
      continue;
    }
    fail(`Argument inconnu : ${a}`);
  }
  return { flags, env };
}

function parseEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (/^\s*#/.test(line) || !line.includes('=')) continue;
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v !== '') out[m[1]] = v; // une valeur vide ne surcharge pas un defaut
  }
  return out;
}

function printHelp() {
  console.log(`Usage : npm start [-- options]

Options :
  --db-user <nom>      Identifiant DB (defaut: app)
  --db-pass <secret>   Mot de passe DB (defaut: app)
  --db-name <nom>      Nom de la base (defaut: elegante_amaro_db)
  --db-port <port>     Port hote de la base (defaut: 3307)
  --db-host <hote>     Hote de la base (defaut: 127.0.0.1)
  --reset-db           Repart de zero (recree le volume / reseed)
  --no-apps            Setup uniquement, ne lance pas les apps
  --no-docker          Utiliser un MySQL/MariaDB existant au lieu de Docker
  --keep-db            Laisser la base Docker active apres Ctrl+C (sinon arretee)
  -h, --help           Affiche cette aide

Les identifiants personnalises sont pris en compte a la creation du volume Docker.
Pour les changer ensuite : npm run reset-db -- --db-user ... --db-pass ...`);
}

const { flags, env: cliEnv } = parseArgs(process.argv.slice(2));
const fileEnv = parseEnvFile(path.join(ROOT, '.env'));
const cfg = { ...DEFAULTS, ...fileEnv, ...cliEnv };
const childEnv = { ...process.env, ...cfg };

// mysql2 resolu depuis les deps de l'API (hoiste a la racine en workspaces).
const apiRequire = createRequire(path.join(API, 'package.json'));
let mysql;
try { mysql = apiRequire('mysql2/promise'); } catch { mysql = null; }

// ─── Helpers process ──────────────────────────────────────────────────────────
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', env: childEnv, cwd: ROOT, ...opts });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} -> code ${code}`))));
  });
}
function runQuiet(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: 'ignore', env: childEnv, cwd: ROOT, ...opts });
    child.on('error', () => resolve(1));
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

async function dbConnect(withDatabase) {
  if (!mysql) return null;
  return mysql.createConnection({
    host: cfg.DB_HOST,
    port: Number(cfg.DB_PORT),
    user: cfg.DB_USER,
    password: cfg.DB_PASSWORD,
    ...(withDatabase ? { database: cfg.DB_NAME } : {}),
  });
}
async function dbReachable() {
  try { const c = await dbConnect(false); await c.end(); return true; } catch { return false; }
}
async function dbHasData() {
  try {
    const c = await dbConnect(true);
    const [rows] = await c.query('SELECT COUNT(*) AS n FROM categories');
    await c.end();
    return rows[0].n > 0;
  } catch { return false; }
}

function lanIP() {
  const ifaces = os.networkInterfaces();
  for (const list of Object.values(ifaces)) {
    for (const ni of list ?? []) {
      if (ni.family === 'IPv4' && !ni.internal) return ni.address;
    }
  }
  return 'localhost';
}

// ─── Backends DB ──────────────────────────────────────────────────────────────
async function ensureDockerDb() {
  if ((await runQuiet('docker', ['compose', 'version'])) !== 0) {
    fail([
      'Docker introuvable ou daemon arrete.',
      'Installez Docker Desktop (Windows/macOS) ou le paquet docker (Linux) et demarrez-le,',
      'ou relancez avec --no-docker pour utiliser un MySQL/MariaDB que vous gerez vous-meme.',
    ]);
  }
  if (flags.resetDb) {
    log('Reset : suppression du volume DB (docker compose down -v)...');
    await run('docker', ['compose', 'down', '-v']);
  }
  log(`Demarrage de la base Docker (user=${cfg.DB_USER}, port=${cfg.DB_PORT})...`);
  await run('docker', ['compose', 'up', '-d', '--wait', 'db']);
}

async function ensureSystemDb() {
  if (flags.resetDb) {
    log('Reset : suppression de la base (db:drop)...');
    await run(NPM, ['run', 'db:drop', '--workspace', 'api']).catch(() => {});
  }
  if (!(await dbReachable())) {
    fail([
      `Serveur MySQL/MariaDB injoignable sur ${cfg.DB_HOST}:${cfg.DB_PORT} (user ${cfg.DB_USER}).`,
      'Demarrez-le (Linux: sudo systemctl start mariadb ; Windows: service MySQL),',
      'ou laissez Docker s\'en charger en retirant --no-docker.',
    ]);
  }
  await run(NPM, ['run', 'db:create', '--workspace', 'api']).catch(() => {}); // ignore "exists"
}

// ─── Lancement des apps ───────────────────────────────────────────────────────
function launchApps() {
  const children = [];
  let shuttingDown = false;

  const spawnApp = (label, cwd, args) => {
    const child = spawn(NPM, args, { stdio: 'inherit', env: childEnv, cwd });
    child.on('exit', (code) => { if (code && !shuttingDown) log(`[${label}] arrete (code ${code}).`); });
    children.push(child);
  };

  log('Lancement API + web + mobile (Ctrl+C pour tout arreter)...');
  spawnApp('api', API, ['run', 'dev']);
  spawnApp('web', WEB, ['run', 'dev']);
  spawnApp('mobile', MOBILE, ['start']);

  const stopsDb = !flags.noDocker && !flags.keepDb; // Docker + pas d'opt-out
  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    log('Arret des apps...');
    for (const c of children) c.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 400)); // laisse les enfants se fermer
    if (stopsDb) {
      log('Arret de la base Docker (donnees conservees)...');
      await runQuiet('docker', ['compose', 'down']);
    } else {
      log('Base laissee active (npm run db:stop pour l\'arreter).');
    }
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (flags.help) { printHelp(); return; }

  // 1. Dependances
  if (!fs.existsSync(path.join(ROOT, 'node_modules')) || process.env.FORCE_INSTALL === '1') {
    log('Installation des dependances (npm install)...');
    await run(NPM, ['install']);
  } else {
    log('Dependances deja installees (FORCE_INSTALL=1 pour forcer).');
  }

  // mysql2 peut ne pas avoir ete resolu avant l'install : on reessaie.
  if (!mysql) { try { mysql = apiRequire('mysql2/promise'); } catch { /* ignore */ } }

  // 2. Base de donnees
  if (flags.noDocker) await ensureSystemDb();
  else await ensureDockerDb();

  // 3. Migrations + seed (seed seulement si base vide -> idempotent)
  log('Application des migrations...');
  await run(NPM, ['run', 'db:migrate', '--workspace', 'api']);
  if (await dbHasData()) {
    log('Donnees deja presentes : seed ignore.');
  } else {
    log('Base vide : seed initial...');
    await run(NPM, ['run', 'db:seed', '--workspace', 'api']);
  }

  if (flags.noApps) { log('Setup termine (--no-apps).'); return; }

  // 4. URL de l'API pour le mobile (IP LAN auto, sauf override)
  const apiUrl = cfg.EXPO_PUBLIC_API_URL || `http://${lanIP()}:${cfg.PORT}`;
  childEnv.EXPO_PUBLIC_API_URL = apiUrl;
  log(`API mobile : ${apiUrl}`);

  // 5. Lancement
  launchApps();
}

main().catch((err) => fail(String(err.message || err)));
