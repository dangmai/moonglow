import {BaseLink as Link, view} from 'moonglow/lib/src/libs/react-router'
import * as React from 'react'

function User(props: any) {
    const {route} = props

    return (
        <div>
            <p>User</p>
            <p>
                <Link routeName='home'>Home</Link>
            </p>
            <p>{route && route.user ? route.user.id + ': ' + route.user.name : ''}</p>
        </div>
    )
}

export default view('user', User)
