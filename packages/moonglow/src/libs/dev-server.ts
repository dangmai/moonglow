import {NextHandleFunction} from 'connect'
import * as express from 'express'
import * as http from 'http'
import * as path from 'path'
import * as request from 'request'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'

import {ClientRouterProvider, MoonglowRouter, MoonglowRouterProvider} from './router'

function attachServerRoutes(app: express.Express, router: MoonglowRouter) {
  const expressServer = require('./express-server').default
  return expressServer(app, router)
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
    // We need to keep track of when to reload the server for "hot reloading" of Express routes.
    // The biggest issue with eager reloads is that Webpack Hot Middleware connection with the browser also breaks.
    // We will work around this by making WHM middleware and client bundle middleware the first ones to run,
    // and only reload the server if the request is not handled by them.
    let serverReloadNeeded = false
    const router = getRouter()
    devServer = express()

    let clientDevInstance: webpackDevMiddleware.WebpackDevMiddleware & NextHandleFunction
    const clientConfig = require('../../configs/webpack.client.js')
    clientConfig.mode = 'development'

    router.providers.forEach((provider: MoonglowRouterProvider) => {
      if ((<ClientRouterProvider> provider).getClientEntry) {  // tslint:disable-line:no-angle-bracket-type-assertion
        if (!clientConfig.entry) {
          clientConfig.entry = {}
        }
        const entry = (<ClientRouterProvider> provider).getClientEntry()  // tslint:disable-line:no-angle-bracket-type-assertion
        clientConfig.entry[entry.name] = [entry.path, 'webpack-hot-middleware/client']
      }
    })
    if (clientConfig.entry) {
      const clientCompiler = webpack(clientConfig)
      clientDevInstance = webpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'warn'
      })
      const webpackHotMiddleware = require('webpack-hot-middleware')(clientCompiler)
      devServer.use(webpackHotMiddleware)
      devServer.use(clientDevInstance)
      const reloadCheck = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (serverReloadNeeded) {
          const newServer = express()
          newServer.use(webpackHotMiddleware)
          newServer.use(clientDevInstance)
          newServer.use(reloadCheck)
          attachServerRoutes(newServer, getRouter())

          server.removeListener('request', devServer)
          devServer = newServer
          server.on('request', devServer)
          serverReloadNeeded = false
          console.log('Server reloaded')  // tslint:disable-line:no-console

          const url = req.protocol + '://' + req.get('Host') + req.originalUrl
          console.log(`Proxying old request to new server at ${url}`)  // tslint:disable-line:no-console
          req.pipe(request(url)).pipe(res)
        } else {
          next()
        }
      }
      devServer.use(reloadCheck)
    }
    attachServerRoutes(devServer, router)
    const server = http.createServer(devServer)
    server.listen(3000)

    serverCompiler.hooks.afterEmit.tap('ServerRecompilationPlugin', compilation => {
      const {assets} = compilation

      Object.keys(assets).forEach(f => delete require.cache[assets[f].existsAt])
      console.log('Server needs to be reloaded')  // tslint:disable-line:no-console
      serverReloadNeeded = true
    })

    console.log('Server listening on port 3000!')  // tslint:disable-line:no-console
  })

}
