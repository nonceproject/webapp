const fs = require('fs');
const { logger } = require('jege/server');
const path = require('path');

const paths = require('./paths');

const log = logger('[webapp-root]');

const webappPackagePath = (function getwebappPackagePath() {
  const _path = path.resolve(paths.root, 'packages/webapp');

  if (fs.existsSync(_path) === undefined) {
    throw new Error('website package is not present');
  }

  return _path;
})();

const backendPort = 4001;

exports.get = function get() {
  const processEnv = {
    BACKEND_ENDPOINT: `http://localhost:${backendPort}`,
    BACKEND_PORT: backendPort,
    BUILD_PATH: paths.build,
    DIST_PATH: paths.dist,
    ROOT_PATH: paths.root,
    WEBAPP_BUILD_PATH: path.resolve(webappPackagePath, '.build'),
    WEBAPP_SRC_PATH: path.resolve(webappPackagePath, 'src'),
    WEBPACK_CONFIG_CLIENT_LOCAL_WEB: path.resolve(webappPackagePath, 'scripts/webpack/webpack.config.client.local.web'),
    WEBPACK_CONFIG_CLIENT_PROD_WEB: path.resolve(webappPackagePath, 'scripts/webpack/webpack.config.client.prod.web'),
    WEBPACK_CONFIG_CLIENT_WEB: path.resolve(webappPackagePath, 'scripts/webpack/webpack.config.client.web'),
    WEBPACK_CONFIG_SERVER_LOCAL: path.resolve(webappPackagePath, 'scripts/webpack/webpack.config.server.local'),
    WEBPACK_CONFIG_SERVER_PROD: path.resolve(webappPackagePath, 'scripts/webpack/webpack.config.server.prod'),
  };

  let envString = '';
  Object.keys(processEnv)
    .forEach((envKey) => {
      envString += `${envKey}: ${processEnv[envKey]}, `;
    });
  log('env.get(): %s', envString);

  return processEnv;
};
