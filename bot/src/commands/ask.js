import { OpenAI } from 'openai'
import commandTypes from 'command-handler/src/cmd-handler/command-types.js'
import countTokens from 'command-handler/src/util/count-tokens.js'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_TOKEN
})

export default {
    description: 'Ask ChatGPT a question',
    type: commandTypes.Both,

    run: async ({ message, text, args }) => {

        await message.channel.sendTyping() 

        const sendTypingInterval = setInterval(() => {
            message.channel.sendTyping() 
        }, 5000);

        const messages = (await message.channel.messages.fetch({ limit: 25 })).reverse()

        const gptMessages = []
        const maxTokens = 2500 
        let totalTokens = 0

        messages.forEach((msg) => {
            const tokens = countTokens(msg.content)

            if (totalTokens + tokens < maxTokens) {
                totalTokens += tokens

                gptMessages.push({
                    role: msg.author.bot ? 'assistant' : 'user',
                    content: msg.content
                })
            }
        })

        let response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0613',
            messages: gptMessages
        }).catch((error) => console.error('OpenAI Error:\n', error))

        clearInterval(sendTypingInterval)

        if (!response) { 
            clearInterval(sendTypingInterval)
            message.reply('Error: Your message either failed to send, or an error was experienced on OpenAI\ss side preventing a reply from being sent.')
        }

        response = response.choices[0].message.content

        const discordMax = 2000
        if (response.length > discordMax) {
            response = response.slice(0, discordMax)
        }

        message.channel.send(response)
        console.log(`The question was ${countTokens(message)} tokens and the response is ${countTokens(response)} tokens`)
    }
}