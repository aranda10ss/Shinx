import { EmbedBuilder } from 'discord.js'

export default {
  name: 'message',
  aliases: ['msg'],
  args: true,
  async execute ({ message, args, client }) {
    const welcomeMessage = args.join(' ')

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { welcomeMessage },
      create: { guildId: message.guild.id, welcomeMessage }
    })

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }) })
          .setDescription(client.languages.__mf('messageCommand'))
          .setColor('#FF0000')
      ]
    })
  }
}
