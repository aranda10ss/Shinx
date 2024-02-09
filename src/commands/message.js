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

    message.reply({ content: client.languages.__mf('messageCommand')})
  }
}
