export interface MoonglowConfig {
  secretKey: string
}

export default (config: MoonglowConfig) => `import App from './pages/app'

export default {
  entry: App,
  secretKey: "${config.secretKey}"
}
`
