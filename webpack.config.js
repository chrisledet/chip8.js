"use strict";

var path = require('path');

module.exports = {
  entry: [
    path.join(__dirname, 'main.js'),
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }, {
        test: /\.styl|\.css|\.scss$/,
        exclude: /node_modules/,
        loader: 'css-loader'
      }
    ]
  }
};
