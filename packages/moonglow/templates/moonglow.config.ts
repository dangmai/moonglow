export interface MoonglowConfig {
  secretKey: string
}

export default (config: MoonglowConfig) => `export default {
  secretKey: "${config.secretKey}"
}
`
