import {MoonglowRouter, ReactRouterProvider} from 'moonglow/lib/src/libs/router';
import App from './pages/app';

const router = MoonglowRouter.getInstance();
const reactProvider = new ReactRouterProvider(App);
router.use(reactProvider);

class Routes {
  static home = reactProvider.route('home', '/')
  static about = reactProvider.route('about', '/about')
}

export default Routes;
export {router};
