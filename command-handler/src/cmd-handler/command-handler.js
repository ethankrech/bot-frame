import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import getFiles from '../util/get-files.js'
import SlashCommands from './slash-commands.js'
import commandTypes from './command-types.js'

export default class CommandHandler {
  // <commandName, commandObject>
  _commands = new Map()
  _prefix = '!'

  constructor(commandsDir, client, handler) {
    if (!commandsDir) {
      throw new Error('Commands dir is required')
    }

    this._slashCommands = new SlashCommands(client)

    this.setUp(commandsDir, handler)
  }

  get commands() {
    return this._commands
  }

  get prefix() {
    return this._prefix
  }

  get slashCommands() {
    return this._slashCommands
  }

  async setUp(commandsDir, handler) {
    const botCommands = getFiles(commandsDir)

    const currentFilePath = fileURLToPath(import.meta.url)
    const currentFileDir = path.dirname(currentFilePath)

    const builtInCommands = getFiles(path.join(currentFileDir, '..', 'commands'))

    const commands = [...botCommands, ...builtInCommands]

    for (const command of commands) {
      const fileName = path.basename(command)
      const commandName = path.parse(fileName).name.toLowerCase()

      const filePath = pathToFileURL(command)
      const commandObject = (await import(filePath)).default

      if (!commandObject) {
        continue
      }

      const { aliases = [], type, test, description, options = [] } = commandObject

      if (type === commandTypes.Legacy || type === commandTypes.Both) {
        this._commands.set(commandName, commandObject)

        for (const alias of aliases) {
          this._commands.set(alias, commandObject)
        }
      }

      if (type === commandTypes.Slash || type === commandTypes.Both) {
        if (test) {
          for (const guildId of handler.testServers) {
            this.slashCommands.create(commandName, description, options, guildId)
          }
        } else {
          this.slashCommands.create(commandName, description, options)
        }
      }
    }
  }
}
