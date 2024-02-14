import { sendEmbedMessage } from '../utils/embeds.js'
import replaceMessage from '../utils/replaceMessages.js'

export default {
  name: 'message',
  aliases: ['msg'],
  args: false,
  permissions: {
    client: [],
    user: []
  },
  async execute ({ message, args, client }) {
    const gpt = await client.chatgpt.sendMessage(
      client.languages.__mf('prompt')
    )
    const welcomeMessage = gpt.text

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { welcomeMessage },
      create: { guildId: message.guild.id, welcomeMessage }
    })

    await sendEmbedMessage(
      message,
      replaceMessage(welcomeMessage, message),
      '#008F39'
    )
  }
}
