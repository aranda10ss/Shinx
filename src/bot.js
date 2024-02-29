import { PrismaClient } from '@prisma/client'
import { ChatGPTAPI } from 'chatgpt'
import { Client, Collection } from 'discord.js'
import i18n from 'i18n'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { clientOps } from './utils/config.js'
import { loadCommands } from './utils/handler/commands.js'
import { loadEvents } from './utils/handler/events.js'
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
      directory: join(__dirname, 'utils/languages'),
      defaultLocale: 'en',
      retryInDefaultLocale: true,
      objectNotation: true,
      register: global,

      missingKeyFn: (locale, value) => value,

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
