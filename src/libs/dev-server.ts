import * as express from 'express'
import MemoryFS = require('memory-fs')
import * as path from 'path'
import * as requireFromString from 'require-from-string'
import createRouter from 'router5/create-router'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'

import runReactServer from './react-server'

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
    const contents = fs.readFileSync(path.resolve(serverConfig.output.path, 'server.js'), 'utf8')
    const server = requireFromString(contents, 'server.js')

    const routesContent = fs.readFileSync(path.resolve(serverConfig.output.path, 'routes.js'), 'utf8')
    const routes = requireFromString(routesContent, 'routes.js')

    // app.get('/', server.default)
    app.get('*', (req, res, next) => {
      const router = createRouter(routes.default)
      router.start(req.originalUrl, (error, state) => {
        if (error) {
          next()
        } else {
          runReactServer(router, server.default, req, res)
        }
      })
    })
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
