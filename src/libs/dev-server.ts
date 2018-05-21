import {NextHandleFunction} from 'connect'
import * as express from 'express'
import * as http from 'http'
import MemoryFS = require('memory-fs')
import * as path from 'path'
import * as requireFromString from 'require-from-string'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'

import {ClientRouterProvider, MoonglowRouter, MoonglowRouterProvider} from './router'

function createExpressApp(router: MoonglowRouter) {
  const expressServer = require('./express-server').default
  return expressServer(router)
}

function getRouter(fs: MemoryFS, serverConfig: any): MoonglowRouter {
  const routesContent = fs.readFileSync(path.resolve(serverConfig.output.path, 'routes.js'), 'utf8')
  const routes = requireFromString(routesContent, 'routes.js')
  return routes.router
}

export default () => {
  const fs = new MemoryFS()

  const serverConfig = require('../../configs/webpack.server.js')
  serverConfig.mode = 'development'
  const serverCompiler = webpack(serverConfig)
  serverCompiler.outputFileSystem = fs

  let devServer: express.Express

  const serverDevInstance = webpackDevMiddleware(serverCompiler, {
    publicPath: serverConfig.output.publicPath,
    logLevel: 'warn'
  })
  serverDevInstance.waitUntilValid(() => {
    const router = getRouter(fs, serverConfig)
    devServer = createExpressApp(router)

    let clientDevInstance: webpackDevMiddleware.WebpackDevMiddleware & NextHandleFunction
    const clientConfig = require('../../configs/webpack.client.js')
    clientConfig.mode = 'development'

    router.providers.forEach((provider: MoonglowRouterProvider) => {
      if ((<ClientRouterProvider> provider).getClientEntry) {  // tslint:disable-line:no-angle-bracket-type-assertion
        if (!clientConfig.entry) {
          clientConfig.entry = {}
        }
        const entry = (<ClientRouterProvider> provider).getClientEntry()  // tslint:disable-line:no-angle-bracket-type-assertion
        clientConfig.entry[entry.name] = entry.path
      }
    })
    if (clientConfig.entry) {
      const clientCompiler = webpack(clientConfig)
      clientDevInstance = webpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'warn'
      })
      devServer.use(clientDevInstance)
    }
    const server = http.createServer(devServer)
    server.listen(3000)

    serverCompiler.hooks.afterEmit.tap('ServerRecompilationPlugin', _ => {
      delete require.cache[path.resolve(__dirname, 'express-server.ts')]
      delete require.cache[path.resolve(__dirname, 'react-server.tsx')]
      server.removeListener('request', devServer)
      try {
        devServer = createExpressApp(getRouter(fs, serverConfig))
        if (clientDevInstance) {
          devServer.use(clientDevInstance)
        }
      } catch (e) {
        console.error(e)  // tslint:disable-line:no-console
      } finally {
        server.on('request', devServer)
      }
    })

    console.log('Server listening on port 3000!')  // tslint:disable-line:no-console
  })

}
