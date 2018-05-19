import * as express from 'express'
import * as React from 'react'
import createRouter, {Route} from 'router5/create-router'
import runReactServer from './react-server'
import {browserPlugin, listenersPlugin} from './router'

export default (routes: Route[], appComponent: React.ComponentClass): express.Express => {
  const app = express()
  app.get('*', (req, res, next) => {
    const router = createRouter(routes)
      .usePlugin(browserPlugin({useHash: false}))
      .usePlugin(listenersPlugin())
    router.start(req.originalUrl, (error, _state) => {
      if (error) {
        next()
      } else {
        runReactServer(router, appComponent, req, res)
      }
    })
  })
  return app
}
