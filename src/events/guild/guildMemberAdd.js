export default async (client, member) => {
  const { guild } = member
  const guildId = guild.id

  const server = await client.prisma.server.findUnique({
    where: { guildId },
    select: { welcomeMessage: true, channelId: true }
  })

  if (server?.welcomeMessage && server?.channelId) {
    const { welcomeMessage, channelId } = server
    const channel = guild.channels.cache.get(channelId)

    const replacedMessage = welcomeMessage
      .replace(/{members}/g, member.guild.memberCount)
      .replace(/{serverName}/g, member.guild.name)
      .replace(/{user}/g, member.user)
      .replace(/{globalName}/g, member.user.globalName)

    await channel.send(replacedMessage)
  }
}
