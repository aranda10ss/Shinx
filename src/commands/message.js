import { sendEmbedMessage } from '../utils/embeds.js'

export default {
  name: 'message',
  aliases: ['msg'],
  args: true,
  permissions: {
    client: [],
    user: []
  },
  async execute ({ message, args, client }) {
    const welcomeMessage = args.join(' ')

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { welcomeMessage },
      create: { guildId: message.guild.id, welcomeMessage }
    })

    await sendEmbedMessage(message, client.languages.__mf('messageCommand'), '#008F39')
  }
}
