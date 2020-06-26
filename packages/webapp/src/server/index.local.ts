import chalk from 'chalk';
import express, {
} from 'express';
import ExpressIsomorphic, {
  Extend,
} from 'express-isomorphic';
import http from 'http';
import { logger } from 'jege/server';
import path from 'path';
import {
  watch,
  withWebpackDev,
} from 'express-isomorphic-extension/webpack';

import IsomorphicState from './IsomorphicState';

const webpackConfig = require(process.env.WEBPACK_CONFIG_CLIENT_LOCAL_WEB as string);
const webpackConfigServer = require(process.env.WEBPACK_CONFIG_SERVER_LOCAL as string);

const log = logger('[webapp]');

const extend: Extend<IsomorphicState> = async (app, serverState) => {
  app.use(webpackConfig.output.publicPath, express.static(process.env.DIST_PATH));

  withWebpackDev({
    serverState,
    webpackConfig,
  })(app);

  serverState.update(() => ({
    builtAt: Date.now(),
    publicPath: webpackConfig.output.publicPath,
  }));

  return watch(webpackConfigServer);
};

export default async function local() {
  log(
    'local(): Starting, NODE_ENV: %s, BUILD_PATH: %s, DIST_PATH: %s',
    process.env.NODE_ENV,
    process.env.BUILD_PATH,
    process.env.DIST_PATH,
  );

  const processEnv = process.env;
  if (!processEnv.WEBSITE_BUILD_PATH) {
    throw new Error('env variable not sufficient');
  }

  const port = process.env.PORT || 3001;
  const { app, serverState } = await ExpressIsomorphic.createDev({
    extend,
    makeHtmlPath: path.resolve(processEnv.WEBSITE_BUILD_PATH, 'makeHtml.bundle.js'),
    watchExt: 'js,jsx,ts,tsx,html,test,md',
    watchPaths: [
    ],
  });

  const server = http.createServer(app);

  server.listen(port, () => {
    log(`local(): server is listening on: ${chalk.yellow('%s')}`, port);
  });
}
