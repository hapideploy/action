import * as core from '@actions/core'
import fs from 'fs'
import cp from 'child_process'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const host = core.getInput('host')
    const port = core.getInput('port')
    const user = core.getInput('user')
    const identityKey = core.getInput('identity_key')

    // Create the identity_file file
    fs.writeFileSync('./identity_file', identityKey)
    fs.chmodSync('./identity_file', '600')

    // create the inventory.yml file
    fs.writeFileSync('./inventory.yml', 'remotes:\n')
    fs.appendFileSync('./inventory.yml', '  app-server:\n')
    fs.appendFileSync('./inventory.yml', `    host: ${host}\n`)
    fs.appendFileSync('./inventory.yml', `    port: ${port}\n`)
    fs.appendFileSync('./inventory.yml', `    user: ${user}\n`)
    fs.appendFileSync('./inventory.yml', `    identity_file: ./identity_file\n`)

    // Check if python & pip are available.
    if (cp.execSync('which pip', { encoding: 'utf-8' }).trim() !== '') {
      // Install the hapideploy library
      const output = cp.execSync('pip install hapideploy', {
        encoding: 'utf-8'
      })

      console.log(output)
    } else {
      console.info('pip is not available, you need to install it first.')
      console.info(
        'For example, you can use the setup-python action to install Python and pip.'
      )
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
