export default {
    run: ({ message, text, args }) => {
        let sum = 0

        args.forEach((arg) => {
            sum += parseInt(arg)
        })

        message.reply(`The sum is ${sum}`)
    }
}