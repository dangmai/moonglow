import * as React from 'react'
import {Router} from 'router5/create-router'

import {RouterProvider} from './react-router'

export interface RoutedAppProps {
  router: Router
  children: React.ReactNode[]
}

const MainApp = (props: RoutedAppProps) => (
  <RouterProvider router={props.router}><div>{props.children}</div></RouterProvider>
)

export default MainApp
