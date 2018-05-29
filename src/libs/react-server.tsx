import {Request, Response} from 'express'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import {RouterProvider} from 'react-router5'
import {Router, State} from 'router5/create-router'

const templateFn = (html: string, routerState: State) => `<!DOCTYPE html>
<html>
<head>
    <title>test app</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
</head>
<body>
    <div id="app">${html}</div>
    <script type="text/javascript">
      var initialState = ${JSON.stringify(routerState)};
    </script>
    <script src="/assets/react-router5-client.bundle.js"></script>
    <script src="/assets/webpack-hot-middleware.bundle.js"></script>
</body>
</html>
`

export default (router: Router, appComponent: React.ComponentClass, _: Request, res: Response) => {
  const app = React.createElement(RouterProvider, {router}, React.createElement(appComponent))
  const html = ReactDOMServer.renderToString(app)

  const response = templateFn(html, router.getState())

  res.send(response)
}
