import {Request, Response} from 'express'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import {RouterProvider} from 'react-router5'
import {Router} from 'router5/create-router'

const templateFn = (html: string) => `<!DOCTYPE html>
<html>
<head>
    <title>test app</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
</head>
<body>
    <div id="app">${html}</div>
    <!--<script src="assets/main.bundle.js"></script>-->
</body>
</html>
`

export default (router: Router, appComponent: React.ComponentClass, req: Request, res: Response) => {
  const app = React.createElement(RouterProvider, {router}, React.createElement(appComponent))
  const html = ReactDOMServer.renderToString(app)

  const response = templateFn(html)

  res.send(response)
}
