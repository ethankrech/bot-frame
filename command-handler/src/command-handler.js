import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import getFiles from './util/get-files.js'

export default class CommandHandler {
  // <commandName, commandObject>
  _commands = new Map()
  _prefix = '!'

  constructor(commandsDir) {
    if (!commandsDir) {
      throw new Error('Commands dir is required')
    }

    this.setUp(commandsDir)
  }

  get commands() {
    return this._commands
  }

  get prefix() {
    return this._prefix
  }

  async setUp(commandsDir) {
    const botCommands = getFiles(commandsDir)

    const currentFilePath = fileURLToPath(import.meta.url)
    const currentFileDir = path.dirname(currentFilePath)

    const builtInCommands = getFiles(path.join(currentFileDir, 'commands'))

    const commands = [...botCommands, ...builtInCommands]

    for (const command of commands) {
      const fileName = path.basename(command)
      const commandName = path.parse(fileName).name.toLowerCase()

      const filePath = pathToFileURL(command)
      const commandObject = (await import(filePath)).default

      this._commands.set(commandName, commandObject)

      const { aliases = [] } = commandObject

      for (const alias of aliases) {
        this._commands.set(alias, commandObject)
      }
    }
  }
}
