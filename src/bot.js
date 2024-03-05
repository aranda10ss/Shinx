import { PrismaClient } from '@prisma/client'
import { ChatGPTAPI } from 'chatgpt'
import { Client, Collection } from 'discord.js'
import i18n from 'i18n'
import { join } from 'path'
import colors from './data/colors.js'
import { clientOps, i18nConfig } from './data/config.js'
import { loadCommands } from './util/handler/commands.js'
import { loadEvents } from './util/handler/events.js'

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
    this.languages.configure(i18nConfig)
  }

  async start(token) {
    await this.prisma.$connect()
    loadCommands(this, join(import.meta.dirname, 'command'))
    loadEvents(this, join(import.meta.dirname, 'event'))
    await this.login(token)
  }
}
