import {NextFunction, Request, Response} from 'express'
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
  public static getInstance(): MoonglowRouter {
    return this._instance || (this._instance = new this())
  }

  private static _instance: MoonglowRouter
  providers: MoonglowRouterProvider[]

  private constructor() {
    this.providers = []
  }

  use(provider: MoonglowRouterProvider): void {
    this.providers.push(provider)
  }
}

export interface MoonglowRouterProvider {
  getExpressMiddleware(): (req: Request, res: Response, next: NextFunction) => void
}

export class ReactRouterProvider implements MoonglowRouterProvider {
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

  getExpressMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const reactRouter = this.getRouter()
      reactRouter.start(req.originalUrl, (error, _state) => {
        if (error) {
          next()
        } else {
          renderReact(reactRouter, this.entryComponent, req, res)
        }
      })
    }
  }
}
