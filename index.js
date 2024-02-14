import 'dotenv/config'
import { Bot } from './src/bot.js'

try {
  const client = new Bot()
  client.start(process.env.TOKEN)
} catch (err) {
  console.error(err)
}
