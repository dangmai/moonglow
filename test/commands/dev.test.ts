import {expect, test} from '@oclif/test'

describe('dev', () => {
  test
  .stdout()
  .command(['dev', '--help'])
  .it('runs dev help command', ctx => {
    expect(ctx.stdout).to.contain('show CLI help')
  })
})
