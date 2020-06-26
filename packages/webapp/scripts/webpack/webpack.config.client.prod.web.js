const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const webpackConfigClientWeb = require(process.env.WEBPACK_CONFIG_CLIENT_WEB);

const config = {
  entry: {
    client: path.resolve(process.env.WEBAPP_SRC_PATH, 'client/client.tsx'),
    react: ['react', 'react-dom'],
  },
  mode: 'production',
  optimization: {
    minimize: true,
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
    },
  },
  output: {
    chunkFilename: 'chunk.[chunkhash].js',
    filename: '[name].[chunkhash].js',
    path: process.env.DIST_PATH,
    publicPath: '/g/',
  },
  plugins: [
  ],
};

module.exports = merge(webpackConfigClientWeb, config);
