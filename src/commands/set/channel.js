export default {
  name: 'channel',
  aliases: [],
  args: true,
  async execute ({ message, args, client }) {
    let channelId = args[0]
    if (!args.length) {
      return message.reply('You have to provide the ID or mention the channel.')
    }

    if (message.mentions.channels.size > 0) {
      channelId = message.mentions.channels.first().id
    }

    const server = await client.prisma.server.findUnique({
      where: { guildId: message.guild.id }
    })

    if (server?.channelId === channelId) {
      return message.reply(`Channel <#${channelId}> is already set as default.`)
    }

    const channel = message.guild.channels.cache.get(channelId)
    if (!channel) {
      return message.reply('The channel is invalid.')
    }

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { channelId },
      create: { guildId: message.guild.id, channelId }
    })

    message.reply(`The default channel is set to <#${channelId}>.`)
  }
}
