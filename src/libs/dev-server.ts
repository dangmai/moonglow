import * as express from 'express'
import * as http from 'http'
import MemoryFS = require('memory-fs')
import * as path from 'path'
import * as requireFromString from 'require-from-string'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'

function createExpressApp(fs: MemoryFS, serverConfig: any) {
  const expressServer = require('./express-server').default
  const contents = fs.readFileSync(path.resolve(serverConfig.output.path, 'server.js'), 'utf8')
  const appComponent = requireFromString(contents, 'server.js')

  const routesContent = fs.readFileSync(path.resolve(serverConfig.output.path, 'routes.js'), 'utf8')
  const routes = requireFromString(routesContent, 'routes.js')

  return expressServer(routes.default, appComponent.default)
}

export default () => {
  const fs = new MemoryFS()

  const devServer = express()
  const serverConfig = require('../../configs/webpack.server.js')
  serverConfig.mode = 'development'
  const serverCompiler = webpack(serverConfig)
  serverCompiler.outputFileSystem = fs

  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  const serverDevInstance = webpackDevMiddleware(serverCompiler, {
    publicPath: serverConfig.output.publicPath,
    logLevel: 'warn'
  })
  serverDevInstance.waitUntilValid(() => {
    let expressApp = createExpressApp(fs, serverConfig)
    const server = http.createServer(expressApp)
    server.listen(3000)

    serverCompiler.hooks.afterEmit.tap('ServerRecompilationPlugin', _ => {
      delete require.cache[path.resolve(__dirname, 'express-server.ts')]
      server.removeListener('request', expressApp)
      expressApp = createExpressApp(fs, serverConfig)
      server.on('request', expressApp)
    })

    console.log('Server listening on port 3000!')  // tslint:disable-line:no-console
  })
  devServer.use(serverDevInstance)

  const clientConfig = require('../../configs/webpack.client.js')
  clientConfig.mode = 'development'
  const clientCompiler = webpack(clientConfig)
  const clientDevInstance = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'warn'
  })
  devServer.use(clientDevInstance)
}
