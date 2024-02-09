import { EmbedBuilder } from 'discord.js'

export async function sendEmbedMessage (message, description, color) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }) })
    .setDescription(description)
    .setColor(color)

  await message.reply({ embeds: [embed] })
}
