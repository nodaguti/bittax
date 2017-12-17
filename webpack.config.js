const path = require('path');
const webpack = require('webpack');
const removeConsoleBabelPlugin = require('babel-plugin-transform-remove-console');
const MinifyWebpackPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'front', 'index.jsx'),

  output: {
    path: path.join(__dirname, 'dist', 'assets'),
    filename: 'app.bundle.js',
  },

  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : '',

  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
    ],

    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },

  externals: {
    bluebird: 'bluebird',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: [
              removeConsoleBabelPlugin,
            ],
          },
        },
      },
    ],
  },

  plugins: (() => {
    const basePlugins = [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: `'${process.env.NODE_ENV}'` },
      }),
    ];

    if (process.env.NODE_ENV !== 'development') {
      return basePlugins.concat([
        new MinifyWebpackPlugin({
          mangle: { topLevel: true },
        }),
      ]);
    }

    return basePlugins;
  })(),
};
