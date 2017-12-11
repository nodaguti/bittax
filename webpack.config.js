const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const path = require('path');

const babelLoaderQuery = {
  cacheDirectory: true,
  babelrc: false,

  // babel configurations
  presets: [
    [
      'env',
      {
        targets: {
          browsers: [
            '> 5%',
            'last 1 version',
            'not ie <= 11',
            'not ie_mob <= 11',
            'not edge <= 20',
            'not Android <= 999',
          ],
        },
        useBuiltIns: 'usage',
        modules: false,
        debug: true,
      },
    ],
    'react',
  ],
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties',
    'react-intl-auto',
  ],
};

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
        query: babelLoaderQuery,
      },
      {
        test: /\.svg$/,
        loaders: [
          {
            loader: 'babel-loader',
            query: babelLoaderQuery,
          },
        ],
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
