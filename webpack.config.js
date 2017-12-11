const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const path = require('path');

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
        loader: 'babel-loader',
        query: { cacheDirectory: true },
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
        new MinifyPlugin({
          mangle: { topLevel: true },
        }),
      ]);
    }

    return basePlugins;
  })(),
};
