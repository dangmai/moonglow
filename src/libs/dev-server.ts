import {NextHandleFunction} from 'connect'
import * as express from 'express'
import * as http from 'http'
import * as path from 'path'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'

import {ClientRouterProvider, MoonglowRouter, MoonglowRouterProvider} from './router'

function createExpressApp(router: MoonglowRouter) {
  const expressServer = require('./express-server').default
  return expressServer(router)
}

function getRouter(): MoonglowRouter {
  const bootstrap = require(path.resolve(process.cwd(), './.moonglow/server/bootstrap'))
  return bootstrap.getProjectRoutes()
}

declare module 'webpack-dev-middleware' {
  interface Options {
    writeToDisk?: boolean
  }
}

export default () => {
  const serverConfig = require('../../configs/webpack.server.js')
  serverConfig.mode = 'development'
  const serverCompiler = webpack(serverConfig)

  let devServer: express.Express

  const serverDevInstance = webpackDevMiddleware(serverCompiler, {
    publicPath: serverConfig.output.publicPath,
    logLevel: 'warn',
    writeToDisk: true
  })
  serverDevInstance.waitUntilValid(() => {
    const router = getRouter()
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

    serverCompiler.hooks.afterEmit.tap('ServerRecompilationPlugin', compilation => {
      const {assets} = compilation

      Object.keys(assets).forEach(f => delete require.cache[assets[f].existsAt])
      server.removeListener('request', devServer)
      try {
        devServer = createExpressApp(getRouter())
        if (clientDevInstance) {
          devServer.use(clientDevInstance)
        }
        console.log('Server reloaded')  // tslint:disable-line:no-console
      } catch (e) {
        console.error(e)  // tslint:disable-line:no-console
      } finally {
        server.on('request', devServer)
      }
    })

    console.log('Server listening on port 3000!')  // tslint:disable-line:no-console
  })

}
