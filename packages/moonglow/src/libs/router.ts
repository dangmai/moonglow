import {NextFunction, Request, Response} from 'express'

export class MoonglowRouter {
  providers: MoonglowRouterProvider[]

  constructor() {
    this.providers = []
  }

  use(provider: MoonglowRouterProvider): void {
    this.providers.push(provider)
  }
}

export type MoonglowRouterProvider = ServerRouterProvider |
  ClientRouterProvider |
  UniversalRouterProvider

export enum HttpMethod {
  ALL,
  GET,
  POST,
  PUT,
  DELETE
}

export type ExpressMiddlewareHandler = (req: Request, res: Response, next: NextFunction) => void
export type ExpressMiddleware = {
  httpMethod: HttpMethod,
  path: string,
  handler: ExpressMiddlewareHandler
}

export interface ServerRouterProvider {
  getExpressMiddlewares(): ExpressMiddleware[]
}
export type UniversalRouterProvider = ServerRouterProvider & ClientRouterProvider

export type WebpackEntry = {
  name: string,
  path: string
}
export interface ClientRouterProvider {
  getClientEntry(): WebpackEntry
}

export class ExpressRoute {
  path: string
  httpMethod: HttpMethod
  handler: ExpressMiddlewareHandler

  constructor(httpMethod: HttpMethod, path: string, handler: ExpressMiddlewareHandler) {
    this.path = path
    this.httpMethod = httpMethod
    this.handler = handler
  }
}

export class ExpressRouterProvider implements ServerRouterProvider {
  routes: ExpressRoute[]

  constructor() {
    this.routes = []
  }

  route(httpMethod: HttpMethod, path: string, handler: ExpressMiddlewareHandler) {
    this.routes.push(new ExpressRoute(httpMethod, path, handler))
  }

  getExpressMiddlewares() {
    return this.routes.map(route => ({
      httpMethod: route.httpMethod,
      path: route.path,
      handler: route.handler
    }))
  }
}

export {Request, Response}
