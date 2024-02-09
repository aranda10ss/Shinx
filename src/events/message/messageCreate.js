export default async (client, message) => {
  const args = message.content.slice(client.prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()
  if (!message.content.toLowerCase().startsWith(client.prefix.toLowerCase())) return

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.default.aliases && cmd.default.aliases.includes(commandName))

  const { default: cmd } = command

  if (cmd.args && !args.length) {
    return message.reply('You must provide the arguments.')
  }

  cmd.execute({ message, args, client })
}
