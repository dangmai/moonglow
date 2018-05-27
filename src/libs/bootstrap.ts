import {MoonglowRouter} from './router'

function getProjectRoutes(): MoonglowRouter {
  return require('routes').router
}

function getProjectConfigs() {
  return require('moonglow.config').default
}

export {getProjectConfigs, getProjectRoutes}
