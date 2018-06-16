import {BaseLink as Link, simpleRoute} from 'moonglow/lib/src/libs/react-router'
import * as React from 'react'

function User(props: any) {
    const {route} = props

    return (
        <div>
            <p>User</p>
            <p>
                <Link routeName='home'>Home</Link>
            </p>
            <p>{route.user ? route.user.id + ': ' + route.user.name : ''}</p>
        </div>
    )
}

// @ts-ignore
export default simpleRoute({name: 'user', path: ''}, User)
