/**
 * Unit tests for the action's main functionality, src/main.js
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { expect, jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import fs from 'fs'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.js', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((key) => {
      switch (key) {
        case 'host':
          return '192.168.33.11'
        case 'port':
          return '22'
        case 'user':
          return 'vagrant'
        case 'identity_key':
          return 'your private key'
      }
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Create a remotes.yml file', async () => {
    await run()

    expect(fs.existsSync('./identity_file')).toBe(true)
  })
})
