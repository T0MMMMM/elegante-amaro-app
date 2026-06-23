const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Monorepo : surveiller la racine du workspace (paquet @elegante-amaro-app/shared)
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Le paquet shared expose ses points d'entrée via le champ "exports" (.ts)
config.resolver.unstable_enablePackageExports = true;

config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;
