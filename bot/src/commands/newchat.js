import commandTypes from 'command-handler/src/cmd-handler/command-types.js'
import { ChannelType, ApplicationCommandOptionType } from 'discord.js'

export default {
    description: 'Make a new chat',
    type: commandTypes.Legacy,

  //delete: true,

    run: async ({ message, text, args }) => {
        const thread = await message.channel.threads.create({
            name: text, 
            type: ChannelType.PrivateThread,
            reason: `ChatGPT thread created by ${message.author.id}`
        })

        await thread.members.add(message.author.id)
        
        message.delete()
    }
}