import { Client, GatewayIntentBits, Partials, AllowedMentionsTypes, Collection } from 'discord.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import i18n from 'i18n'
import { loadCommands } from './handler/commands.js'
import { loadEvents } from './handler/events.js'
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
    this.prisma = new PrismaClient()
    this.commands = new Collection()
    this.aliases = new Collection()
    this.languages = i18n
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
        disable: false
      }
    })
  }

  async start (token) {
    loadCommands(this, join(__dirname, 'commands'))
    loadEvents(this, join(__dirname, 'events'))
    await this.login(token)
  }
}
