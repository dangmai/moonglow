import 'babel-polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import MainApp from './react-app-component'
import {ReactRouterProvider} from './react-router'
import {MoonglowRouterProvider} from './router'

const moonglowRouter = require('routes').router

declare global {
  interface Window {
    initialState: any
  }
}

const reactProvider: ReactRouterProvider = moonglowRouter.providers
  .filter((provider: MoonglowRouterProvider) => provider instanceof ReactRouterProvider)[0]

const router = reactProvider.getRouter()

router.start(window.initialState, (err: any, _: any) => {
  if (err) {
    console.error(err)  // tslint:disable-line:no-console
  } else {
    const components: React.ComponentClass[] = Object.values(reactProvider.componentHandlers)
    ReactDOM.hydrate(
      <MainApp router={router}>
        {components.map((handler: React.ComponentClass, index) => React.createElement(handler, {key: index}))}
      </MainApp>,
      document.getElementById('app'))
  }
})
