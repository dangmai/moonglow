import {MoonglowRouter, ReactRouterProvider} from 'moonglow/lib/src/libs/router';
import App from './pages/app';

const router = new MoonglowRouter();
const reactProvider = new ReactRouterProvider(App);
const expressProvider = new ExpressRouterProvider();
router.use(reactProvider);
router.use(expressProvider);

class Routes {
  static home = reactProvider.route('home', '/')
  static about = reactProvider.route('about', '/about')
  static server = expressProvider.route(HttpMethod.ALL, '/server', (req, res, next) => { res.send('Hi') })
}

export default Routes;
export {router};
