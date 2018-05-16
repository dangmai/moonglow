import {Command, flags} from '@oclif/command'
import runDevServer from '../libs/server'

export default class Dev extends Command {
  static description = 'Running Moonglow Dev Server'

  static flags = {
    help: flags.help({char: 'h'}),
  }
  async run() {
    runDevServer()
  }
}
