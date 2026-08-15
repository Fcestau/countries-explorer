const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

// Monorepo (npm workspaces): mobile/package.json fija "react" en la versión
// exacta que espera esta versión de React Native, pero npm hoistea otras
// dependencias (p.ej. expo-router) a la raíz junto con la versión de React
// que pide web/. La resolución jerárquica normal de Metro encuentra la copia
// MÁS CERCANA al archivo que hace el require, así que el código propio de
// mobile/ y expo-router (hoisteado a la raíz) terminan usando dos copias de
// React distintas en el mismo bundle, rompiendo los hooks internos
// (incluido el que usa React Compiler) con errores como "Cannot read
// property 'useMemoCache' of null". Forzamos "react" a una única ruta sin
// tocar la resolución jerárquica normal del resto de paquetes.
const REACT_PACKAGE_JSON = path.resolve(projectRoot, 'node_modules/react/package.json');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    return context.resolveRequest({ ...context, originModulePath: REACT_PACKAGE_JSON }, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
