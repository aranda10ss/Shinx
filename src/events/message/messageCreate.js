export default async (client, message) => {
  const args = message.content.slice(client.prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()
  if (!message.content.toLowerCase().startsWith(client.prefix.toLowerCase())) return

  let serverLanguage = 'en'
  const server = await client.prisma.server.findUnique({
    where: { guildId: message.guild.id },
    select: { lang: true }
  })
  if (server && server.lang) {
    serverLanguage = server.lang
  }

  client.languages.setLocale(serverLanguage)

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.default.aliases && cmd.default.aliases.includes(commandName))
  try {
    const { default: cmd } = command

    if (cmd.args && !args.length) {
      return message.reply(client.languages.__mf('args'))
    }

    cmd.execute({ message, args, client })
  } catch (error) {
    message.reply(client.languages.__mf('invalidCommand'))
  }
}
