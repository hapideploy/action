import * as core from '@actions/core'
import fs from 'fs'

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

    fs.writeFileSync('./identity_file', identityKey)
    fs.chmodSync('./identity_file', '600')

    fs.writeFileSync('./remotes.yml', 'remotes:\n')
    fs.appendFileSync('./remotes.yml', '  app-server:\n')
    fs.appendFileSync('./remotes.yml', `    host: ${host}\n`)
    fs.appendFileSync('./remotes.yml', `    port: ${port}\n`)
    fs.appendFileSync('./remotes.yml', `    user: ${user}\n`)
    fs.appendFileSync('./remotes.yml', `    identity_file: ./identity_file\n`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
