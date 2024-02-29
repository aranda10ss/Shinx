import { PrismaClient } from '@prisma/client'
import { ChatGPTAPI } from 'chatgpt'
import { Client, Collection } from 'discord.js'
import { readFileSync } from 'fs'
import i18n from 'i18n'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { clientOps } from './utils/config.js'
import { loadCommands } from './utils/handler/commands.js'
import { loadEvents } from './utils/handler/events.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const json = readFileSync('./src/assets/json/colors.json', 'utf8')
const colors = JSON.parse(json)

export class Bot extends Client {
  constructor() {
    super(clientOps)

    this.prefix = process.env.PREFIX || '!'
    this.color = colors
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
