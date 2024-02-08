import 'dotenv/config'
import { Bot } from './src/bot.js'
const client = new Bot()

client.start(process.env.TOKEN)
