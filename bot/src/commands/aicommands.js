export default {
    description: 'List all of the AI commands',

    run: async ({ message, args, text }) => {
        message.reply(`
            Commands for text generation:

            !claude (prompt) - Ask Claude/Anthropic AI a question

            !gpt (prompt) - Ask ChatGPT a question

            !gemini (prompt) - Ask Google Gemini a question

            Commands for image generation:

            !geminigen (prompt) - Make an image using Gemini AI by Google

            !stablegen (prompt) - Make an image using Stable Diffusion by Stability.ai

            DALL-E image gen is unavailable due to the high price of using DALL-E models.
        `)
    }
}