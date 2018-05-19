const nodeExternals = require('webpack-node-externals');
const path = require('path');

const currentDir = process.cwd();

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    configs: path.resolve(currentDir, 'moonglow.config.js'),
    routes: path.resolve(currentDir, 'routes.js')
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    library: 'app',
    libraryTarget: 'commonjs2'
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
