import {BaseLink as Link, withRoute} from 'moonglow/lib/src/libs/react-router'
import * as React from 'react'

function About(props: any) {
    const {route} = props

    return (
        <div>
            {route.name === 'about' ? (
                <div>
                    <p>About Us</p>
                    <p>
                        <Link routeName='home'>Home</Link>
                    </p>
                </div>
            ) : null}
        </div>
    )
}

export default withRoute(About)
