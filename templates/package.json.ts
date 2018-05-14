export interface PackageConfig {
  name: string
  description: string
  version: string
  author: string
  license: string
}

export default (config: PackageConfig) => `
{
  "name": "${config.name}",
  "description": "${config.description}",
  "version": "${config.version}",
  "author": "${config.author}",
  "dependencies": {
    "moonglow": "^0.1.0",
    "moonglow-cli": "^0.1.0"
  },
  "engines": {
    "node": ">=8.0.0"
  },
  "license": "${config.license}",
  "main": "index.js",
  "scripts": {
    "test": "mocha",
  },
}
`
