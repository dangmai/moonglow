import * as express from 'express'

import {HttpMethod, MoonglowRouter, ServerRouterProvider} from './router'

export default (app: express.Express, router: MoonglowRouter): express.Express => {
  router.providers.forEach(provider => {
    if ((<ServerRouterProvider> provider).getExpressMiddlewares) {  // tslint:disable-line:no-angle-bracket-type-assertion
      const middlewares = (<ServerRouterProvider> provider).getExpressMiddlewares()  // tslint:disable-line:no-angle-bracket-type-assertion
      middlewares.forEach(middleware => {
        switch (middleware.httpMethod) {
          case HttpMethod.ALL: {
            app.use(middleware.path, middleware.handler)
            break
          }
          case HttpMethod.GET: {
            app.get(middleware.path, middleware.handler)
            break
          }
          case HttpMethod.POST: {
            app.post(middleware.path, middleware.handler)
            break
          }
          case HttpMethod.PUT: {
            app.put(middleware.path, middleware.handler)
            break
          }
          case HttpMethod.DELETE: {
            app.delete(middleware.path, middleware.handler)
          }
        }
      })
    }
  })
  return app
}
