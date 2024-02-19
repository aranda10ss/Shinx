import { findJSFiles } from '../utils/findJsFiles.js'

export async function loadEvents(client, path) {
  const eventFiles = await findJSFiles(path)

  eventFiles.forEach(async file => {
    const { default: event } = await import(file)
    const eventName = file.split('/').pop().split('.')[0]

    client.on(eventName, event.bind(null, client))
  })
}
