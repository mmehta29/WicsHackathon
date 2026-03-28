import { NAVIGATE_PROMPT } from '../utils/prompts'

export function useVisionAI() {

    async function analyzeFrame(base64) {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY
        const model = import.meta.env.VITE_OPENAI_NAVIGATE_MODEL

        const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: 100,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: NAVIGATE_PROMPT
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: base64,
                                        detail: 'low'
                                    }
                                }
                            ]
                        }
                    ]
                })
            }
        )

        const data = await response.json()
        const text = data.choices[0].message.content.trim()
        return text
    }

    return { analyzeFrame }
}