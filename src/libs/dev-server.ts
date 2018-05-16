import * as express from 'express'
import MemoryFS = require('memory-fs')
import * as path from 'path'
import * as requireFromString from 'require-from-string'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'

export default () => {
  const fs = new MemoryFS()

  const app = express()
  const serverConfig = require('../../configs/webpack.server.js')
  serverConfig.mode = 'development'
  const serverCompiler = webpack(serverConfig)
  serverCompiler.outputFileSystem = fs
  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  const serverDevInstance = webpackDevMiddleware(serverCompiler, {
    publicPath: serverConfig.output.publicPath
  })
  serverDevInstance.waitUntilValid(() => {
    const contents = fs.readFileSync(path.resolve(serverConfig.output.path, serverConfig.output.filename), 'utf8')
    const server = requireFromString(contents, serverConfig.output.filename)
    app.get('/', server.default)
    app.listen(3000)
    console.log('Server listening on port 3000!')  // tslint:disable-line:no-console
  })
  app.use(serverDevInstance)

  const clientConfig = require('../../configs/webpack.client.js')
  clientConfig.mode = 'development'
  const clientCompiler = webpack(clientConfig)
  const clientDevInstance = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath
  })
  app.use(clientDevInstance)
}
