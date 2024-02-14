import { ActivityType } from 'discord.js'

export default async (client) => {
  const presenceOptions = {
    status: 'dnd',
    activities: [
      {
        name: `${client.guilds.cache.size} servers and ${client.guilds.cache.reduce((totalMembers, guild) => totalMembers + guild.memberCount, 0)} users`,
        type: ActivityType.Watching
      }
    ]
  }
  client.user.setPresence(presenceOptions)
  console.log(`logged in as ${client.user.tag}`)
}
