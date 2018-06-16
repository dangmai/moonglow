import {Request, Response} from 'express'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import {Router, State} from 'router5/create-router'

import MainApp from './react-app-component'
import {ComponentHandlers} from './react-router'

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
</body>
</html>
`

export default (router: Router, componentHandlers: ComponentHandlers, _: Request, res: Response) => {
  const components: React.ComponentClass[] = Object.values(componentHandlers)
  const html = ReactDOMServer.renderToString(
    <MainApp router={router}>
      {components.map((handler: React.ComponentClass, index) => React.createElement(handler, {key: index}))}
    </MainApp>
  )

  const response = templateFn(html, router.getState())

  res.send(response)
}
