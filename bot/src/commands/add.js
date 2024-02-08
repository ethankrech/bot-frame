import CommandTypes from 'command-handler/src/cmd-handler/command-types.js'

export default {
    type: CommandTypes.Legacy,

    run: ({ message, text, args }) => {
        let sum = 0

        args.forEach((arg) => {
            sum += parseInt(arg)
        })

        message.reply(`The sum is ${sum}`)
    }
}