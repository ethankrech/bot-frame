import { ChannelType } from 'discord.js'
import commandTypes from 'command-handler/src/cmd-handler/command-types.js'

export default {
    description: 'Lists all chats that you have access to',
    type: commandTypes.Legacy,

    delete: true,

    run: ({ message, text, args }) => {
        console.log('Hello world')
        // List all chats that the user has access to
    }
}