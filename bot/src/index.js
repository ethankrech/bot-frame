import { Client, IntentsBitField } from 'discord.js'
import CH from 'command-handler'
import path from 'path'
import 'dotenv/config'

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessageTyping,
  ],
})

client.once('ready', () => {
  console.log('The bot is ready')

  new CH({
    client,
    events: {
      dir: path.join(process.cwd(), 'src', 'events'),
    },
    featuresDir: path.join(process.cwd(), 'src', 'features'),
    commandsDir: path.join(process.cwd(), 'src', 'commands'),
    testServers: []
  })
})

client.login(process.env.DISCORD_TOKEN)
