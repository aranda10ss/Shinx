import { EmbedBuilder } from 'discord.js'

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
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }) })
            .setDescription(client.languages.__mf('channelCommand.alreadySet', { channel: server.channelId }))
            .setColor('#FF0000')
        ]
      })
    }

    const channel = message.guild.channels.cache.get(channelId)
    if (!channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }) })
            .setDescription(client.languages.__mf('channelCommand.invalidChannel'))
            .setColor('#FF0000')
        ]
      })
    }

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { channelId },
      create: { guildId: message.guild.id, channelId }
    })

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }) })
          .setDescription(client.languages.__mf('channelCommand.success', { channel: channel.id }))
          .setColor('#FF0000')
      ]
    })
  }
}
