export default {
  name: 'language',
  aliases: ['lang'],
  args: true,
  async execute ({ message, args, client }) {
    const validLanguages = ['es', 'en']
    const selectedLanguage = args[0]

    if (!validLanguages.includes(selectedLanguage)) {
      return message.reply(client.languages.__mf('langCommand.invalidLanguage'))
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

    return message.reply(client.languages.__mf('langCommand.success', { language: languageNames[selectedLanguage] }))
  }
}
