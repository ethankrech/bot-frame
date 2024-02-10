import commandTypes from 'command-handler/src/cmd-handler/command-types.js'

export default {
    description: 'Responds with pong!',
    type: commandTypes.Legacy,

    delete: true,

    run: ({ message }) => {
        message.reply('pong!')
    }
}