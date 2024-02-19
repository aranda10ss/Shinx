import { GatewayIntentBits, Partials, AllowedMentionsTypes } from 'discord.js'

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
