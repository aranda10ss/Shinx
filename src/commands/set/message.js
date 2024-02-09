export default {
  name: 'message',
  aliases: ['msg'],
  async execute ({ message, args, client }) {
    if (!args.length) {
      return message.reply('You must provide the welcome message.')
    }

    const welcomeMessage = args.join(' ')

    await client.prisma.server.upsert({
      where: { guildId: message.guild.id },
      update: { welcomeMessage },
      create: { guildId: message.guild.id, welcomeMessage }
    })

    message.reply('The welcome message has been configured correctly.')
  }
}
