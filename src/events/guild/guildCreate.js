export default async (client, guild) => {
  const guildId = guild.id
  await client.prisma.server.create({
    data: {
      guildId,
    },
  })
}
