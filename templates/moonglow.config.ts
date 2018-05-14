export interface MoonglowConfig {
  secretKey: string
}

export default (config: MoonglowConfig) => `
{
  "secretKey": "${config.secretKey}"
}
`
