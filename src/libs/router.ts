import createRouter, {Route, Router} from 'router5/create-router'
import browserPlugin from 'router5/plugins/browser'
import listenersPlugin from 'router5/plugins/listeners'

export {Link, routeNode, RouterProvider, withRoute} from 'react-router5'
export {browserPlugin, createRouter, listenersPlugin}

export function getRouter(routes: Route[]): Router {
  return createRouter(routes)
    .usePlugin(browserPlugin({useHash: false}))
    .usePlugin(listenersPlugin())
}
