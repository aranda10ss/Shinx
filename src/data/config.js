import { AllowedMentionsTypes, GatewayIntentBits, Partials } from 'discord.js'
import { join } from 'path'

export const clientOps = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel],
  allowedMentions: {
    parse: [AllowedMentionsTypes.User, AllowedMentionsTypes.Role],
    repliedUser: false,
  },
}

export const i18nConfig = {
  locales: ['en', 'es'],
  directory: join(import.meta.dirname, 'languages'),
  defaultLocale: 'en',
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  missingKeyFn: (locale, value) => value,

  mustacheConfig: {
    tags: ['{{', '}}'],
    disable: false,
  },
}
