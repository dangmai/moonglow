import {NextFunction, Request, Response} from 'express'
import * as path from 'path'
import * as React from 'react'
import {InjectedRoute, Omit, withRoute} from 'react-router5'
import createRouter, {Route, Router, State} from 'router5/create-router'
import browserPlugin from 'router5/plugins/browser'
import listenersPlugin from 'router5/plugins/listeners'

import renderReact from './react-server'
import {HttpMethod, UniversalRouterProvider} from './router'

export {BaseLink, InjectedRoute, Link, routeNode, RouterProvider, withRoute} from 'react-router5'
export {browserPlugin, createRouter, listenersPlugin}

export type RoutableComponent<TProps extends Partial<InjectedRoute>> = React.ComponentClass<Omit<TProps, keyof InjectedRoute>>

export interface DataHandlers {
  [name: string]: (route: State) => Promise<any>
}
export interface ComponentHandlers {
  [name: string]: RoutableComponent<any>
}

export class ReactRouterProvider implements UniversalRouterProvider {
  routes: Route[]
  dataHandlers: DataHandlers
  componentHandlers: ComponentHandlers

  constructor() {
    this.routes = []
    this.dataHandlers = {}
    this.componentHandlers = {}
  }

  route(name: string, path: string, component: RoutableComponent<any>, getInitialData?: (route: State) => Promise<any>): Route {
    const route = {name, path}
    this.routes.push(route)
    this.componentHandlers[name] = component
    if (getInitialData) {
      this.dataHandlers[name] = getInitialData
    }
    return route
  }

  getRouter(): Router {
    return createRouter(this.routes)
      .usePlugin(browserPlugin({useHash: false}))
      .usePlugin(listenersPlugin())
      .useMiddleware((_router: Router) => (toState: State, _fromState: State, done: any) => {
        if (this.dataHandlers[toState.name]) {
          return this.dataHandlers[toState.name](toState).then(data => {
            return {...data, ...toState}
          })
        } else {
          done()
        }
      })
  }

  getExpressMiddlewares() {
    let handler = (req: Request, res: Response, next: NextFunction) => {
      const reactRouter = this.getRouter()
      reactRouter.start(req.originalUrl, (error, _state) => {
        if (error) {
          next()
        } else {
          renderReact(reactRouter, this.componentHandlers, req, res)
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

export function visibleRoute<TProps extends Partial<InjectedRoute>>(
  routeName: string,
  BaseComponent: React.ComponentType<TProps>
) {
  return class extends React.Component<TProps> {
    render() {
      if (this.props.route && routeName === this.props.route.name) {
        return React.createElement(BaseComponent, this.props)
      } else {
        return null
      }
    }
  }
}

export function view<TProps extends Partial<InjectedRoute>>(
  routeName: string,
  BaseComponent: React.ComponentType<TProps>
): React.ComponentClass<Omit<TProps, keyof InjectedRoute>> {
  return withRoute(visibleRoute(routeName, BaseComponent))
}
