import {BaseLink as Link, withRoute} from 'moonglow/lib/src/libs/react-router'
import * as React from 'react'

function Home(props: any) {
    const {route} = props

    return (
        <div>
            {route.name === 'home' ? (
                <div>
                    <p>Home Page</p>
                    <p>
                        <Link routeName='about'>About</Link>
                    </p>
                    <p>
                        <Link routeName='user' routeParams={{userId: 1}} key='1'>User 1</Link>
                    </p>
                    <p>
                        <Link routeName='user' routeParams={{userId: 2}} key='2'>User 2</Link>
                    </p>
                </div>
            ) : null}
        </div>
    )
}

export default withRoute(Home)
