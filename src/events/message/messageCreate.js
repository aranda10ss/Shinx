import { sendEmbedMessage } from '../../utils/embeds.js'

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

    const botPermissions = cmd.permissions.client || []
    const userPermissions = cmd.permissions.user || []

    if (userPermissions.length > 0 && !message.channel.permissionsFor(message.member).has(userPermissions)) {
      const missingPermissions = userPermissions.filter(permission => !message.channel.permissionsFor(message.member).has(permission))
      return sendEmbedMessage(message, client.languages.__mf('missingPermissions.user', { missingPermissions: missingPermissions.join(', ') }), '#FF0000')
    }

    if (botPermissions.length > 0 && !message.channel.permissionsFor(client.user).has(botPermissions)) {
      const missingPermissions = botPermissions.filter(permission => !message.channel.permissionsFor(client.user).has(permission))
      return sendEmbedMessage(message, client.languages.__mf('missingPermissions.client', { missingPermissions: missingPermissions.join(', ') }), '#FF0000')
    }

    if (cmd.args && !args.length) {
      return sendEmbedMessage(message, client.languages.__mf('args'), '#FF0000')
    }

    cmd.execute({ message, args, client })
  } catch (error) {
    console.log(error)
    return sendEmbedMessage(message, client.languages.__mf('invalidCommand'), '#FF0000')
  }
}
