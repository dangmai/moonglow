import 'babel-polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {ReactRouterProvider, RouterProvider} from './react-router'
import {MoonglowRouterProvider} from './router'

const moonglowRouter = require('routes').router

declare global {
  interface Window {
    initialState: any
  }
}

const reactProvider = moonglowRouter.providers
  .filter((provider: MoonglowRouterProvider) => provider instanceof ReactRouterProvider)[0]

const router = reactProvider.getRouter()

router.start(window.initialState, (err: any, _: any) => {
  if (err) {
    console.error(err)  // tslint:disable-line:no-console
  } else {
    const App = () => (
      <RouterProvider router={router}><reactProvider.entryComponent /></RouterProvider>
    )
    ReactDOM.hydrate(<App />, document.getElementById('app'))
  }
})
