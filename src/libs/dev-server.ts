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

  let devServer: express.Express

  const clientConfig = require('../../configs/webpack.client.js')
  clientConfig.mode = 'development'
  const clientCompiler = webpack(clientConfig)
  const clientDevInstance = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'warn'
  })

  const serverConfig = require('../../configs/webpack.server.js')
  serverConfig.mode = 'development'
  const serverCompiler = webpack(serverConfig)
  serverCompiler.outputFileSystem = fs

  const serverDevInstance = webpackDevMiddleware(serverCompiler, {
    publicPath: serverConfig.output.publicPath,
    logLevel: 'warn'
  })
  serverDevInstance.waitUntilValid(() => {
    devServer = createExpressApp(fs, serverConfig)
    devServer.use(clientDevInstance)
    const server = http.createServer(devServer)
    server.listen(3000)

    serverCompiler.hooks.afterEmit.tap('ServerRecompilationPlugin', _ => {
      delete require.cache[path.resolve(__dirname, 'express-server.ts')]
      delete require.cache[path.resolve(__dirname, 'react-server.tsx')]
      server.removeListener('request', devServer)
      devServer = createExpressApp(fs, serverConfig)
      devServer.use(clientDevInstance)
      server.on('request', devServer)
    })

    console.log('Server listening on port 3000!')  // tslint:disable-line:no-console
  })

}
