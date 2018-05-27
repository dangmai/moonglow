import {NextFunction, Request, Response} from 'express'
import * as path from 'path'
import * as React from 'react'
import {InjectedRoute, Omit, withRoute} from 'react-router5'
import createRouter, {Route, Router, State} from 'router5/create-router'
import browserPlugin from 'router5/plugins/browser'
import listenersPlugin from 'router5/plugins/listeners'

import renderReact from './react-server'
import {HttpMethod, UniversalRouterProvider} from './router'

export {Link, routeNode, RouterProvider, withRoute} from 'react-router5'
export {browserPlugin, createRouter, listenersPlugin}

export interface DataHandlers {
  [name: string]: (route: State) => Promise<any>
}

export class ReactRouterProvider implements UniversalRouterProvider {
  routes: Route[]
  entryComponent: React.ComponentClass
  dataHandlers: DataHandlers

  constructor(entryComponent: React.ComponentClass) {
    this.routes = []
    this.dataHandlers = {}
    this.entryComponent = entryComponent
  }

  route(name: string, path: string, getInitialData?: (route: State) => Promise<any>): Route {
    const route = {name, path}
    this.routes.push(route)
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

export interface RoutableComponent<TProps extends Partial<InjectedRoute>> extends React.ComponentClass<Omit<TProps, keyof InjectedRoute>> {
  getInitialProps?(route: Route): Promise<any>
}

export interface MiddleRouteState {}

export function middleRoute(route: Route, BaseComponent: RoutableComponent<MiddleRouteState>) {
  return class extends React.Component<InjectedRoute> {
    constructor(props: InjectedRoute, context: any) {
      super(props, context)

      this.state = {}
    }

    render() {
      if (this.props.route && route.name === this.props.route.name) {
        const childProps = {...this.props, ...this.state}
        return React.createElement(BaseComponent, childProps)
      } else {
        return null
      }
    }
  }
}

export function simpleRoute(route: Route, BaseComponent: RoutableComponent<any>) {
  return withRoute(middleRoute(route, BaseComponent))
}
