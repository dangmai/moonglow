import * as express from 'express'
import {MoonglowRouter, ServerRouterProvider} from './router'

export default (router: MoonglowRouter): express.Express => {
  const app = express()
  router.providers.forEach(provider => {
    if ((<ServerRouterProvider> provider).getExpressMiddleware) {  // tslint:disable-line:no-angle-bracket-type-assertion
      app.use((<ServerRouterProvider> provider).getExpressMiddleware())  // tslint:disable-line:no-angle-bracket-type-assertion
    }
  })
  return app
}
