const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  entry: path.resolve(process.cwd(), 'server.js'),
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/dist/',
    filename: 'server.js',
    library: 'app',
    libraryTarget: 'commonjs2'
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
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['babel-preset-env', 'babel-preset-react'].map(require.resolve)
        }
      }
    ]
  }
};
