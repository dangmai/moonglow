import {ReactRouterProvider} from 'moonglow/lib/src/libs/react-router'
import {ExpressRouterProvider, HttpMethod, MoonglowRouter, Request, Response} from 'moonglow/lib/src/libs/router'

import {UserRepo, UserSerializer} from './models'
import About from './pages/about'
import Home from './pages/home'
import User from './pages/user'

const router = new MoonglowRouter()
const reactProvider = new ReactRouterProvider()
const expressProvider = new ExpressRouterProvider()
router.use(reactProvider)
router.use(expressProvider)

declare var MOONGLOW_SERVER_MODE: boolean

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms))  // tslint:disable-line:no-unused

async function handleUserApi(req: Request, res: Response) {
    const serializer = new UserSerializer()
    const repo = new UserRepo()
    const user = await repo.findUser(parseInt(req.params.userId, 10))

    res.setHeader('Content-Type', 'application/json')
    res.send(serializer.toJSON(user))
}

async function getInitialProps(route: any) {
    const userId = parseInt(route.params.userId, 10)
    if (MOONGLOW_SERVER_MODE) {
        console.log('Retrieval in server mode')  // tslint:disable-line:no-console
        const repo = new UserRepo()
        const user = await repo.findUser(userId)
        return {user}
    } else {
        console.log('Retrieval in client mode')  // tslint:disable-line:no-console
        const response = await fetch(`/api/user/${userId}`)
        const user = await response.json()
        return {user}
    }
}

const routes = {
    home: reactProvider.route('home', '/', Home),
    about: reactProvider.route('about', '/about', About),
    user: reactProvider.route('user', '/user/:userId<\\d+>', User, getInitialProps),
    api: expressProvider.route(HttpMethod.ALL, '/api/user/:userId', handleUserApi)
}

export {router, routes}
