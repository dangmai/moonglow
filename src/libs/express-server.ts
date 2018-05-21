import * as express from 'express'
import {MoonglowRouter} from './router'

export default (router: MoonglowRouter): express.Express => {
  const app = express()
  router.providers.forEach(provider => app.use(provider.getExpressMiddleware()))
  return app
}
