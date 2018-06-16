import * as fs from 'fs'
import * as path from 'path'

import {expect, test} from '@oclif/test'
import * as tmp from 'tmp'

describe('start-project command', () => {
  let cleanUp: () => void
  beforeEach(done => {
    tmp.dir({unsafeCleanup: true}, (_, path, cleanUpFn) => {
      cleanUp = cleanUpFn
      process.chdir(path)
      done()
    })
  })
  afterEach(async () => {
    cleanUp()
  })
  test
  .stdout()
  .command(['start-project', 'basie'])
  .it('outputs correct stdout', ctx => {
    expect(ctx.stdout).to.contain('Creating project basie')
  })

  test.stdout()
  .command(['start-project', 'duke'])
  .it('creates correct dir and files', () => {
    const projectLocation = path.resolve(process.cwd(), 'duke')
    const packageJsonLocation = path.resolve(projectLocation, 'package.json')
    expect(fs.existsSync(projectLocation)).to.be.true
    expect(fs.existsSync(packageJsonLocation)).to.be.true
  })
})
