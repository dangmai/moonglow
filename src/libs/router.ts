import {NextFunction, Request, Response} from 'express'
import * as path from 'path'
import * as React from 'react'
import createRouter, {Route, Router} from 'router5/create-router'
import browserPlugin from 'router5/plugins/browser'
import listenersPlugin from 'router5/plugins/listeners'

import renderReact from './react-server'

export {Link, routeNode, RouterProvider, withRoute} from 'react-router5'
export {browserPlugin, createRouter, listenersPlugin}

export function getRouter(routes: Route[]): Router {
  return createRouter(routes)
    .usePlugin(browserPlugin({useHash: false}))
    .usePlugin(listenersPlugin())
}

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

export class ReactRouterProvider implements UniversalRouterProvider {
  routes: Route[]
  entryComponent: React.ComponentClass

  constructor(entryComponent: React.ComponentClass) {
    this.routes = []
    this.entryComponent = entryComponent
  }

  route(name: string, path: string): Route {
    const route = {name, path}
    this.routes.push(route)
    return route
  }

  getRouter(): Router {
    return createRouter(this.routes)
      .usePlugin(browserPlugin({useHash: false}))
      .usePlugin(listenersPlugin())
  }

  getExpressMiddlewares() {
    let handler = (req: Request, res: Response, next: NextFunction) => {
      const reactRouter = this.getRouter()
      reactRouter.start(req.originalUrl, (error, _state) => {
        if (error) {
          next()
        } else {
          renderReact(reactRouter, this.entryComponent, req, res)
        }
      })
    }
    return [{
      httpMethod: HttpMethod.ALL,
      path: '*',
      handler
    }]
  }

  getClientEntry() {
    return {
      name: 'react-router5-client',
      path: path.resolve(__dirname, '../../../lib/src/libs/react-client.js')
    }
  }
}
