const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './client.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets'
  },
  resolve: {
    alias: {
      moonglow: path.resolve(__dirname, '..', 'lib', 'src', 'libs')
    }
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, '..', 'node_modules'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['babel-preset-env', 'babel-preset-react'].map(require.resolve)
        }
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    // new CleanWebpackPlugin(['dist']),
  ]
};
