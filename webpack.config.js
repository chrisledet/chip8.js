'use strict';

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'main.js'),
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'assets/[hash].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('assets/[hash].bundle.css'),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
