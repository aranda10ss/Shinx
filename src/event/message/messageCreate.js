import { sendEmbedMessage } from '../../util/message/embeds.js'

export default async (client, message) => {
  const args = message.content.slice(client.prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()
  if (!message.content.toLowerCase().startsWith(client.prefix.toLowerCase())) {
    return
  }

  let serverLanguage = 'en'
  const server = await client.prisma.server.findUnique({
    where: { guildId: message.guild.id },
    select: { lang: true },
  })
  if (server && server.lang) {
    serverLanguage = server.lang
  }

  client.languages.setLocale(serverLanguage)

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.default.aliases && cmd.default.aliases.includes(commandName),
    )
  if (!command) return

  const { default: cmd } = command

  try {
    const DEFAULT_PERMISSIONS = {
      client: ['SendMessages'],
      user: ['SendMessages'],
    }

    const { permissions = {} } = cmd
    const botPermissions = [
      ...DEFAULT_PERMISSIONS.client,
      ...permissions.client,
    ]
    const userPermissions = [...DEFAULT_PERMISSIONS.user, ...permissions.user]

    const checkPermissions = (permissionType, memberOrUser) => {
      const missingPermissions = permissionType.filter(
        permission =>
          !message.channel.permissionsFor(memberOrUser).has(permission),
      )
      return missingPermissions
    }

    const missingUserPermissions = checkPermissions(
      userPermissions,
      message.member,
    )
    const missingBotPermissions = checkPermissions(botPermissions, client.user)

    if (missingUserPermissions.length > 0) {
      return sendEmbedMessage(
        message,
        client.languages.__mf('missingPermissions.user', {
          missingPermissions: missingUserPermissions.join(', '),
        }),
        '#FF0000',
      )
    }

    if (missingBotPermissions.length > 0) {
      return sendEmbedMessage(
        message,
        client.languages.__mf('missingPermissions.client', {
          missingPermissions: missingBotPermissions.join(', '),
        }),
        '#FF0000',
      )
    }

    if (cmd.args && !args.length) {
      return sendEmbedMessage(message, client.languages.__mf('args'), '#FF0000')
    }
    cmd.execute({ message, args, client })
  } catch (err) {
    sendEmbedMessage(message, client.languages.__mf('error'), '#FF0000')
    console.error(err)
  }
}
