import {BaseLink as Link, InjectedRoute, view} from 'moonglow/lib/src/libs/react-router'
import * as React from 'react'

function About(_props: InjectedRoute) {
  return (
    <div>
      <p>About Us</p>
      <p>
        <Link routeName='home'>Home</Link>
      </p>
    </div>
  )
}

export default view('about', About)
