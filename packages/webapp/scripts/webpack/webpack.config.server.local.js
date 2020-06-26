const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const webpackEnv = require('./webpackEnv');
const webpackConfigClientWeb = require(process.env.WEBPACK_CONFIG_CLIENT_WEB);

const config = {
  devtool: 'source-map',
  entry: path.resolve(process.env.WEBAPP_SRC_PATH, 'server/makeHtml.tsx'),
  externals: [
    nodeExternals(),
  ],
  mode: 'development',
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'makeHtml.bundle.js',
    libraryTarget: 'commonjs2',
    path: process.env.WEBAPP_BUILD_PATH,
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BACKEND_ENDPOINT': JSON.stringify(webpackEnv.backendEndpoint),
    }),
  ],
  target: 'node',
};

module.exports = merge(webpackConfigClientWeb, config);
