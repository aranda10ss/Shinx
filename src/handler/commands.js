import { findJSFiles } from '../utils/findJsFiles.js'

export async function loadCommands (client, path) {
  const commandFiles = await findJSFiles(path)

  commandFiles.forEach(async (file) => {
    const command = await import(file)
    const commandName = command.default.name

    client.commands.set(commandName, command)

    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => {
        client.aliases.set(alias, commandName)
      })
    }
  })
}
