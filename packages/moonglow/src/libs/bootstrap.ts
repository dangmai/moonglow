import {MoonglowRouter} from './router'

function getProjectRoutes(): MoonglowRouter {
  return require('routes').router  // tslint:disable-line:no-implicit-dependencies
}

function getProjectConfigs() {
  return require('moonglow.config').default  // tslint:disable-line:no-implicit-dependencies
}

export {getProjectConfigs, getProjectRoutes}
