/* eslint-disable import/no-dynamic-require,global-require */
const _ = require('lodash');

const buildType = process.env.NODE_ENV || 'default';
const config = require(`./config/${buildType.length ? `${buildType}` : ``}`);
const fs = require('fs');

if (!fs.existsSync(config.private)) {
  fs.mkdirSync(config.private);
}


const webpack = {
  mode: config.debug ? 'development' : 'production',
  plugins: [],
  module: {
    rules: [],
  },
  devtool: config.debug ? 'eval-cheap-source-map' : false,
  entry: config.entries,
  output: {
    path: config.private,
    filename: config.components.js.fileMask,
    publicPath: config.public,
  },
  optimization: {
    minimize: !config.debug,
    minimizer: [],
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true,
        },
      },
    },
  },
  target: ['web', 'es5'],
  performance: {
    hints: buildType === 'production' ? 'warning' : false,
  },
};

_.forEach(config.enabledPlugins, (plugin) => {
  require(`./plugins/${plugin}-plugin`)(webpack, config);
});

module.exports = webpack;
