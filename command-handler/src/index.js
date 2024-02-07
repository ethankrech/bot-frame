import EventHandler from './event-handler.js'
import FeatureHandler from './feature-handler.js'
import CmdHandler from './command-handler.js'

export default class CommandHandler {
  constructor({ client, events, featuresDir, commandsDir, testServers = [] }) {
    if (!client) {
      throw new Error('A client is required')
    }

    if (events) {
      new EventHandler(client, this, events)
    }

    if (featuresDir) {
      new FeatureHandler(client, this, featuresDir)
    }

    if (commandsDir) {
      this._commandHandler = new CmdHandler(commandsDir)
    }

    this._testServers = testServers
  }

  get commandHandler() {
    return this._commandHandler
  }

  get testServers() {
    return this._testServers
  }
}
