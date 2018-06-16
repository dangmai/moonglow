import {ReactRouterProvider} from 'moonglow/lib/src/libs/react-router';
import {ExpressRouterProvider, HttpMethod, MoonglowRouter} from 'moonglow/lib/src/libs/router';
import App from './pages/app';

const router = new MoonglowRouter();
const reactProvider = new ReactRouterProvider(App);
const expressProvider = new ExpressRouterProvider();
router.use(reactProvider);
router.use(expressProvider);

const routes = {
  home: reactProvider.route('home', '/'),
  about: reactProvider.route('about', '/about'),
  server: expressProvider.route(HttpMethod.ALL, '/server', (req, res, next) => { res.send('Hi') })
}

export {router, routes};
