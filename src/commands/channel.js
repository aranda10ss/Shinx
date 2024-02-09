export default {
  name: 'channel',
  aliases: [],
  args: true,
  async execute ({ message, args, client }) {
    let channelId = args[0]

    if (message.mentions.channels.size > 0) {
      channelId = message.mentions.channels.first().id
    }

    const server = await client.prisma.server.findUnique({
      where: { guildId: message.guild.id }
    })

    if (server?.channelId === channelId) {
      return message.reply(client.languages.__mf('channelCommand.alreadySet', { channel: server.channelId }))
    }

    const channel = message.guild.channels.cache.get(channelId)
    if (!channel) {
      return message.reply(client.languages.__mf('channelCommand.invalidChannel'))
    }

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { channelId },
      create: { guildId: message.guild.id, channelId }
    })

    message.reply(client.languages.__mf('channelCommand.success', { channel: channel.id }))
  }
}
