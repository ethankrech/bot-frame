import { Anthropic } from '@anthropic-ai/sdk'
import countTokens from 'command-handler/src/util/count-tokens.js'

const anthropic = new Anthropic()

export default {
    description: 'Talk to Claude',

    run: async ({ message, text, args }) => {
        await message.channel.sendTyping()

        const sendTypingInterval = setInterval(() => {
            message.channel.sendTyping() 
        }, 5000);



        const messages = (await message.channel.messages.fetch({ limit: 50 })).reverse()
        
        const claudeMessages = []
        const maxTokens = 2000
        let totalTokens = 0

        

        messages.forEach((msg) => {
            if (msg.content.startsWith('!claude')) {
                const tokens = countTokens(msg.content)

                if (totalTokens + tokens < maxTokens) {
                    totalTokens += tokens
    
                    claudeMessages.push({
                        role: msg.author.bot ? 'assistant' : 'user',
                        content: toString(msg.content)
                    })
                }
            }
        })

        let claudeMessage = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: claudeMessages,
            temperature: 0.7,
            

        })

        if (!claudeMessage) {
            clearInterval()
            message.reply("Error: Claude failed to respond")
        }

        console.log('Tokens: ' + claudeMessage.usage)

        claudeMessage = claudeMessage.content[0].text.content

        message.channel.send(claudeMessage)

        
    }
}