export default {
  name: 'ping',
  aliases: ['pong'],
  async execute ({ message, args, client }) {
    return message.reply({ content: 'pong!' })
  }
}
