export async function replaceMessage(text, message) {
  const user = message.author ? message.author : message

  return text
    .replace(/\[members\]/g, message.guild.memberCount)
    .replace(/\[serverName\]/g, message.guild.name)
    .replace(/\[user\]/g, user)
}
