const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const currentDir = process.cwd();

function localResolve(preset) {
  return Array.isArray(preset) ?
    [require.resolve(preset[0]), preset[1]] :
    require.resolve(preset);
}

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals({
    whitelist: ['moonglow/lib/src/libs/utils']
  })],
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
          presets: [
            ['babel-preset-env', {
              targets: {
                node: 'current'
              }
            }],
            'babel-preset-stage-2',
            'babel-preset-react'
          ].map(localResolve)
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      MOONGLOW_SERVER_MODE: JSON.stringify(true)
    })
  ]
};
