/* @unused for bak */
var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');

var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: 'lib/index.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src'
    ]
  },
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: /node_modules/
      }, {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ]
};

module.exports = webpack_opts;
