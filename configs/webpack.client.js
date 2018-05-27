const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets'
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, '..', 'node_modules'),
      'node_modules'
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    modules: [
      'node_modules',
      process.cwd()
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['babel-preset-env', 'babel-preset-stage-2', 'babel-preset-react'].map(require.resolve)
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      MOONGLOW_SERVER_MODE: JSON.stringify(false)
    })
  ]
};
