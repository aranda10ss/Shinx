import { Client, Collection } from 'discord.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { ChatGPTAPI } from 'chatgpt'
import { PrismaClient } from '@prisma/client'
import i18n from 'i18n'
import { loadCommands } from './handler/commands.js'
import { loadEvents } from './handler/events.js'
import { clientOps } from './utils/config.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class Bot extends Client {
  constructor() {
    super(clientOps)

    this.prefix = process.env.PREFIX
    this.prisma = new PrismaClient()
    this.commands = new Collection()
    this.aliases = new Collection()
    this.languages = i18n
    this.chatgpt = new ChatGPTAPI({ apiKey: process.env.CGPT_KEY })
    this.languages.configure({
      locales: ['en', 'es'],
      directory: join(__dirname, 'locales'),
      defaultLocale: 'en',
      retryInDefaultLocale: true,
      objectNotation: true,
      register: global,

      missingKeyFn: function (locale, value) {
        return value
      },

      mustacheConfig: {
        tags: ['{{', '}}'],
        disable: false,
      },
    })
  }

  async start(token) {
    loadCommands(this, join(__dirname, 'commands'))
    loadEvents(this, join(__dirname, 'events'))
    await this.login(token)
  }
}
