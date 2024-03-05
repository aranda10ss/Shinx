import { sendEmbedMessage } from '../util/message/embeds.js'

export default {
  name: 'language',
  aliases: ['lang'],
  args: true,
  permissions: {
    client: [],
    user: [],
  },
  async execute({ message, args, client }) {
    const validLanguages = ['es', 'en']
    const selectedLanguage = args[0]

    if (!validLanguages.includes(selectedLanguage)) {
      return sendEmbedMessage(
        message,
        client.languages.__mf('langCommand.invalidLanguage'),
        '#FF0000',
      )
    }

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { lang: selectedLanguage },
      create: { guildId: message.guild.id, lang: selectedLanguage },
    })

    const languageNames = {
      es: 'español',
      en: 'English',
    }

    return sendEmbedMessage(
      message,
      client.languages.__mf('langCommand.success', {
        language: languageNames[selectedLanguage],
      }),
      '#008F39',
    )
  },
}
