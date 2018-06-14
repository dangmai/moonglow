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
  externals: [
    nodeExternals({
      whitelist: [
        'moonglow/lib/src/libs/utils',
        'react-hot-loader'
      ]
    }),
  ],
  entry: {
    configs: path.resolve(currentDir, 'moonglow.config.js'),
    routes: path.resolve(currentDir, 'routes.js'),
    bootstrap: path.resolve(__dirname, '../lib/src/libs/bootstrap.js')
  },
  output: {
    path: path.resolve(process.cwd(), '.moonglow/server'),
    publicPath: '/dist/',
    filename: '[name].js',
    library: 'app',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    modules: [
      'node_modules',
      currentDir,
      path.resolve(currentDir, '.moonglow/server')
    ],
    alias: {
      react: path.resolve(path.join(process.cwd(), './node_modules/react'))
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
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
          babelCore: path.join(__dirname, '../node_modules/babel-core'),
          babelOptions: {
            babelrc: false
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      MOONGLOW_SERVER_MODE: JSON.stringify(true)
    })
  ]
};
