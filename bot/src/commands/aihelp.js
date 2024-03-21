export default {
    description: 'Get help for AI commands',

    run: async ({ message, text, args }) => {
        message.reply(`
            With image generation, using the command is quite simple. Use
            the command and enter your prompt, and your image will be generated.

            With text generation, using commands are also simple. Using ChatGPT or Gemini
            commands are simple to use, just use the command and enter your prompt.

            With Claude, you can not enter more than 1 prompt at once, otherwise the bot
            will error and you will have to create a new chat.
        `)
    }
}