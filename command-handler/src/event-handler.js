import path from 'path'
import url from 'url'

import getFiles from './util/get-files.js'

export default class EventHandler {
  _eventListeners = new Map() // <eventName, functions[]>

  constructor(client, handler, events) {
    if (!events.dir) {
      throw new Error('events.dir is required')
    }

    this.setUp(client, handler, events.dir)
  }

  async setUp(client, handler, dir) {
    await this.loadListeners(dir)
    this.registerEvents(client, handler)
  }

  async loadListeners(dir) {
    const botEvents = getFiles(dir, true)

    const currentFilePath = url.fileURLToPath(import.meta.url)
    const currentFileDir = path.dirname(currentFilePath)

    const builtInEvents = getFiles(path.join(currentFileDir, 'events'), true)

    const events = [...botEvents, ...builtInEvents]

    for (const folder of events) {
      const event = path.basename(folder)
      const files = getFiles(folder)

      const eventListeners = this._eventListeners.get(event) || []

      for (const file of files) {
        const filePath = url.pathToFileURL(file)
        const func = (await import(filePath)).default

        eventListeners.push(func)
      }

      this._eventListeners.set(event, eventListeners)
    }
  }

  registerEvents(client, handler) {
    for (const [event, functions] of this._eventListeners) {
      client.on(event, function () {
        for (const func of functions) {
          try {
            func(...arguments, handler)
          } catch (e) {
            console.error(e)
          }
        }
      })
    }
  }
}
