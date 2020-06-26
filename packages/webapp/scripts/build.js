const babelRc = require('./.babelrc');
require('@babel/register')({
  ...babelRc,
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
});

const { buildLogger } = require('jege/server');
const chalk = require('chalk');
const { compile } = require('express-isomorphic-extension/webpack');
const del = require('del');
const gulp = require('gulp');
const path = require('path');

const webpackConfigClient = require(process.env.WEBPACK_CONFIG_CLIENT_PROD_WEB);
const webpackConfigServer = require(process.env.WEBPACK_CONFIG_SERVER_PROD);

const buildLog = buildLogger('[webapp]');

const paths = {
  build: path.resolve(__dirname, '../.build'),
  data: process.env.DATA_PATH,
  dist: process.env.DIST_PATH,
  root: process.env.ROOT_PATH,
  src: path.resolve(__dirname, '../src'),
};

gulp.task('clean', () => {
  const cleanPaths = [
    `${paths.build}/**/*`,
    `${paths.dist}/**/*`,
    `${paths.root}/*.html`,
    `${paths.root}/sitemap.xml`,
  ];

  buildLog('clean', 'cleanPaths: %j', cleanPaths);

  return del(cleanPaths, {
    force: true,
  });
});

gulp.task('copy-public', () => {
  const publicPath = path.resolve(paths.src, 'public');
  const srcPath = `${publicPath}/**/*`;
  buildLog('copy-public', 'src: %s, dist: %s', srcPath, paths.dist);

  return gulp.src(srcPath)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('webpack-client', () => {
  const buildJsonPath = path.resolve(paths.dist, 'build.json');
  buildLog('webpack-client', 'buildJsonPath: %s', buildJsonPath);

  return compile({
    buildJsonPath,
    webpackConfig: webpackConfigClient,
  })
    .then((result) => {
      buildLog('webpack-client', `${chalk.green('success')}: %j`, result);
    })
    .catch((err) => {
      buildLog('webpack-client', `${chalk.red('error')}: %o`, err);
      throw err;
    });
});

gulp.task('webpack-makeHtml', () => {
  buildLog('webpack-makeHtml', 'start comilling');

  return compile({
    webpackConfig: webpackConfigServer,
  })
    .then((result) => {
      buildLog(`webpack-makehtml`, `${chalk.green('success')}: %j`, result);
    })
    .catch((err) => {
      buildLog('webpack-makehtml', `${chalk.red('error')}: %o`, err);
      throw err;
    });
});

gulp.task('build', gulp.series('clean', 'copy-public', 'webpack-client', 'webpack-makeHtml'));

gulp.task('build-dev', gulp.series('clean', 'copy-public'));

module.exports = {
  gulp,
};
