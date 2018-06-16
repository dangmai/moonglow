import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import {promisify} from 'util'

import {Command, flags} from '@oclif/command'

import configTemplate, {MoonglowConfig} from '../../templates/moonglow.config'
import packageJsonTemplate, {PackageConfig} from '../../templates/package.json'

const mkdirAsync = promisify(fs.mkdir)
const writeFileAsync = promisify(fs.writeFile)
const copyFileAsync = promisify(fs.copyFile)

export default class StartProject extends Command {
  static description = 'Start a new Moonglow project'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{
    name: 'name',
    required: true,
    description: 'project name'
  }]

  async run() {
    const {args} = this.parse(StartProject)

    this.log(`Creating project ${args.name}...`)

    const projectLocation = path.resolve(process.cwd(), args.name)
    const pagesLocation = path.resolve(projectLocation, 'pages')
    await mkdirAsync(projectLocation)
    await mkdirAsync(pagesLocation)

    const packageJsonFileLocation = path.resolve(projectLocation, 'package.json')
    const packageConfig: PackageConfig = {
      name: 'test-project',
      description: 'Test Project',
      version: '0.1.0',
      license: 'MIT',
      author: 'Test Author'
    }
    await writeFileAsync(packageJsonFileLocation, packageJsonTemplate(packageConfig))

    const configFileLocation = path.resolve(projectLocation, 'moonglow.config.js')
    const config: MoonglowConfig = {
      secretKey: crypto.randomBytes(64).toString('hex')
    }
    await writeFileAsync(configFileLocation, configTemplate(config))

    const templatePageDir = path.resolve(__dirname, '../../templates/pages')
    await copyFileAsync(path.resolve(templatePageDir, 'about.js'), path.resolve(pagesLocation, 'about.js'))
    await copyFileAsync(path.resolve(templatePageDir, 'home.tsx'), path.resolve(pagesLocation, 'home.tsx'))
    await copyFileAsync(path.resolve(templatePageDir, 'app.js'), path.resolve(pagesLocation, 'app.js'))
    await copyFileAsync(path.resolve(templatePageDir, '../routes.ts'), path.resolve(pagesLocation, '../routes.ts'))
  }
}
