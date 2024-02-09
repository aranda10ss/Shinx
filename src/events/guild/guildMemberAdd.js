export default async (client, member) => {
  const { guild } = member
  const guildId = guild.id

  const server = await client.prisma.server.findUnique({
    where: { guildId },
    select: { welcomeMessage: true, channelId: true }
  })

  if (server && server.welcomeMessage && server.channelId) {
    const { welcomeMessage, channelId } = server
    const channel = guild.channels.cache.get(channelId)
    await channel.send(welcomeMessage)
  }
}
