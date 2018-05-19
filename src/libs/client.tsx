import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {getRouter, RouterProvider} from './router'

const routes = require('routes').default
const configs = require('moonglow.config').default

declare global {
  interface Window {
    initialState: any
  }
}

const router = getRouter(routes)

router.start(window.initialState, (err, _) => {
  if (err) {
    console.error(err)  // tslint:disable-line:no-console
  } else {
    ReactDOM.hydrate(
      <RouterProvider router={router}>
        {configs.entry()}
      </RouterProvider>,
      document.getElementById('app')
    )
  }
})
