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
    "react": "^16.3.2",
    "react-dom": "^16.3.2"
  },
  "engines": {
    "node": ">=8.0.0"
  },
  "license": "${config.license}",
  "main": "index.js",
  "scripts": {
    "test": "mocha",
    "dev": "mg dev",
    "build": "mg build",
    "start": "mg start"
  }
}
`
