import { Client, GatewayIntentBits, Partials, AllowedMentionsTypes, Collection } from 'discord.js'
import { promises as fsPromises } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import 'dotenv/config'

const { readdir, stat } = fsPromises
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class Bot extends Client {
  constructor () {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ],
      partials: [Partials.Message, Partials.Channel],
      allowedMentions: {
        parse: [AllowedMentionsTypes.User, AllowedMentionsTypes.Role],
        repliedUser: false
      }
    })

    this.prefix = process.env.PREFIX
    this.commands = new Collection()
    this.aliases = new Collection()
  }

  async findJSFiles (dir) {
    const JSFiles = []

    async function searchRecursively (currentDir) {
      try {
        const files = await readdir(currentDir)

        for (const file of files) {
          const filePath = join(currentDir, file)
          const stats = await stat(filePath)

          if (stats.isDirectory()) {
            await searchRecursively(filePath)
          } else if (stats.isFile() && filePath.endsWith('.js')) {
            JSFiles.push(filePath)
          }
        }
      } catch { }
    }
    await searchRecursively(dir)
    return JSFiles
  }

  async loadEvents (client, path) {
    const eventFiles = await this.findJSFiles(path)

    eventFiles.forEach(async (file) => {
      const { default: event } = await import(file)
      const eventName = file.split('/').pop().split('.')[0]

      client.on(eventName, event.bind(null, client))
    })
  }

  async start (token) {
    this.loadEvents(this, join(__dirname, 'events'))
    await this.login(token)
  }
}
