const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../lib/src/libs/client.js'),
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
    modules: [
      'node_modules',
      process.cwd()
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
  plugins: []
};
