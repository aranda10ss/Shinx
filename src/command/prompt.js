import { sendEmbedMessage } from '../util/message/embeds.js'
import { replaceMessage } from '../util/message/replaceMessages.js'

export default {
  name: 'prompt',
  aliases: [],
  args: false,
  permissions: {
    client: [],
    user: [],
  },
  async execute({ message, args, client }) {
    const welcomeMessage =
      args.length > 0
        ? (await client.chatgpt.sendMessage(args.join(' '))).text
        : (await client.chatgpt.sendMessage(client.languages.__mf('prompt')))
            .text
    const { guild } = message
    await client.prisma.server.upsert({
      where: { guildId: guild.id },
      update: { welcomeMessage },
      create: { guildId: guild.id, welcomeMessage },
    })
    await sendEmbedMessage(
      message,
      replaceMessage(welcomeMessage, message),
      '#008F39',
    )
  },
}
