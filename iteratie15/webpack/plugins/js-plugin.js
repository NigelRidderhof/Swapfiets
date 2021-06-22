/* eslint-disable import/no-extraneous-dependencies */
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function (webpack, config) {
  const babelPresets = [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            "last 1 version",
            "> 1%",
            "not dead",
          ],
        },
        debug: true,
      },
    ],
  ];

  webpack.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: babelPresets,
          plugins: [
            '@babel/plugin-syntax-dynamic-import'
          ]
        },
      },
    ],
  });

  webpack.optimization.minimizer.push(new TerserPlugin({
    test: /\.js($|\?)/i,
  }));
};
