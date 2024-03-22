import fs from 'fs'
import fetch from 'node-fetch'

export default {
    description: 'Generate images using stable diffusion',

    run: async ({ message, args, text }) => {
        const engineId = 'stable-diffusion-xl-1024-v1-0'
        const apiKey = process.env.STABILITY_API_TOKEN
        const apiEndpoint = 'https://api.stability.ai'

        const response = await fetch(
            `${apiHost}/v1/generation/${engineId}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    text_prompts: [
                        {
                            text: message
                        },
                    ],
                    cfg_scale: 7,
                    height: 1024,
                    width: 1024,
                    steps: 30,
                    samples: 1,
                })
            }
        )

        if (!response.ok) {
            message.reply('Stability AI error: ' + await response.text())
            console.log('Stability AI error: ' + await response.text())
        }

        const responseJSON = await response.json()

        
        
        responseJSON.artifacts.forEach((image, index) => {
            fs.writeFileSync(
                `./out/v1_txt2img_${index}.png`,
                Buffer.from(image.base64, 'base64')
            )
        })


    }
}