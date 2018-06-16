import 'babel-polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Router} from 'router5/create-router'

import {ReactRouterProvider} from './react-router'
import {MoonglowRouterProvider} from './router'

declare global {
  interface Window {
    initialState: any
  }
}

let moonglowRouter = require('routes').router  // tslint:disable-line:no-implicit-dependencies
let reactProvider = moonglowRouter.providers
  .filter((provider: MoonglowRouterProvider) => provider instanceof ReactRouterProvider)[0]
let router = reactProvider.getRouter()

function getMainAppComponent(router: Router) {
  const MainApp = require('./react-app-component').default
  const components: React.ComponentClass[] = Object.values(reactProvider.componentHandlers)
  return (
    <MainApp router={router}>
      {components.map((handler: React.ComponentClass, index) => React.createElement(handler, {key: index}))}
    </MainApp>
  )
}

router.start(window.initialState, (err: any, _: any) => {
  if (err) {
    console.error(err)  // tslint:disable-line:no-console
  } else {
    ReactDOM.hydrate(
      getMainAppComponent(router),
      document.getElementById('app'))
  }
})

if ((module as any).hot) {
  (module as any).hot.accept(['routes.ts'], () => {
    const currentRouterState = router.getState()
    router.stop()

    moonglowRouter = require('routes').router  // tslint:disable-line:no-implicit-dependencies
    reactProvider = moonglowRouter.providers
      .filter((provider: MoonglowRouterProvider) => provider instanceof ReactRouterProvider)[0]
    router = reactProvider.getRouter()
    router.start(currentRouterState, (err: any, _: any) => {
      if (err) {
        console.error(err)  // tslint:disable-line:no-console
      } else {
        const appEl = document.getElementById('app')
        if (appEl) {
          ReactDOM.unmountComponentAtNode(appEl)
        }
        ReactDOM.render(
          getMainAppComponent(router),
          document.getElementById('app')
        )
      }
    })
  })
}
