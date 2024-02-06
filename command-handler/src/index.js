import EventHandler from './event-handler.js'

export default class CommandHandler {
  constructor({ client, events }) {
    if (!client) {
      throw new Error('A client is required')
    }

    if (events) {
      new EventHandler(client, this, events)
    }
  }
}
