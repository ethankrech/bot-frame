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
    const registeredCommands = []

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

      const {
        aliases = [],
        type = commandTypes.Legacy,
        test,
        description,
        options = [],
        delete: del,
      } = commandObject

      const isLegacy = type === commandTypes.Legacy || type === commandTypes.Both
      const isSlash = type === commandTypes.Slash || type === commandTypes.Both

      if (del) {
        if (isSlash) {
          for (const guildId of handler.testServers) {
            this.slashCommands.delete(commandName, guildId)
          }

          this.slashCommands.delete(commandName)
        }
        continue
      }

      registeredCommands.push(commandName)

      if (isLegacy) {
        this._commands.set(commandName, commandObject)

        for (const alias of aliases) {
          this._commands.set(alias, commandObject)
        }
      }

      if (isSlash) {
        if (test) {
          for (const guildId of handler.testServers) {
            this.slashCommands.create(commandName, description, options, guildId)
          }
        } else {
          this.slashCommands.create(commandName, description, options)
        }
      }
    }

    this.deleteRemovedCommands(registeredCommands, handler)
  }

  async deleteRemovedCommands(registeredCommands, handler) {
    const { cache: globalCommands } = await this.slashCommands.getCommands()
    const missingGlobalCommands = globalCommands
      .map(({ name }) => name)
      .filter((name) => !registeredCommands.includes(name))
    for (const name of missingGlobalCommands) {
      await this.slashCommands.delete(name)
    }

    for (const guildId of handler.testServers) {
      const { cache: guildCommands } = await this.slashCommands.getCommands(
        guildId
      )
      const missingGuildCommands = guildCommands
        .map(({ name }) => name)
        .filter((name) => !registeredCommands.includes(name))

      for (const name of missingGuildCommands) {
        await this.slashCommands.delete(name, guildId)
      }
    }
  }
}
