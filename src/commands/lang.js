import { EmbedBuilder } from 'discord.js'

export default {
  name: 'language',
  aliases: ['lang'],
  args: true,
  async execute ({ message, args, client }) {
    const validLanguages = ['es', 'en']
    const selectedLanguage = args[0]

    if (!validLanguages.includes(selectedLanguage)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }) })
            .setDescription(client.languages.__mf('langCommand.invalidLanguage'))
            .setColor('#FF0000')
        ]
      })
    }

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { lang: selectedLanguage },
      create: { guildId: message.guild.id, lang: selectedLanguage }
    })

    const languageNames = {
      es: 'español',
      en: 'English'
    }

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }) })
          .setDescription(client.languages.__mf('langCommand.success', { language: languageNames[selectedLanguage] }))
          .setColor('#FF0000')
      ]
    })
  }
}
