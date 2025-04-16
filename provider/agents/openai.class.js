const OpenAI = require("openai");
const { ChatCompletionMessageParam } = require("openai/resources");
const { generatePrompt } = require("../../prompts/promt.incial");
const { generatePromptBienvenida, generatePromptDecision } = require("../../prompts/prompt.bienvenida");



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE,
});

/**
 * 
 * @param {string} name - Nombre del usuario
 * @param {Array<{role: string, content: string}>} history - Historial de mensajes en formato ChatCompletionMessageParam
 * @returns {Promise<string>}
 */
const run = async (name, history) => {

    const promtp = generatePromptBienvenida(name)
    //  console.log(`[PROMPT]: ${promtp}`);

    const response = await openai.chat.completions.create({
        // model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": promtp
            },
            ...history
        ],
        model: process.env.MODEL_API_IA,
        temperature: 0,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return response.choices[0].message.content
}

/**
 * @param {Array} history
 * @returns {Promise<string>}
 */
const runDetermineFlow = async (mensajeUsuario, history) => {

    try {
        const promtp = generatePromptDecision(mensajeUsuario)

        const response = await openai.chat.completions.create({
            // model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": promtp
                },
                ...history
            ],
            // model: "qwen/qwq-32b:free",
            model: process.env.MODEL_API_IA,
            temperature: 0,
            max_tokens: 300,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // return response.choices.length > 0 && response.choices[0].message.role === 'user' ? response.choices[0].message.content : 'unknown'

        /* ------------------------ este es el que se utiliza ----------------------- */
        // return response.choices.length > 0 && response.choices[0].message.content ? response.choices[0].message.content : 'unknown'

         // Verificar que la respuesta tenga el formato esperado
        if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
            const content = response.choices[0].message.content.trim();
            return content;
        } else {
            console.log("[ADVERTENCIA]: Respuesta de la API incompleta o inesperada");
            return 'unknown';
        }

    } catch (error) {
        console.error("[ERROR en run]:", error.message);
        return 'Lo siento, ha ocurrido un error al procesar tu solicitud.';
    }


}

module.exports = { run, runDetermineFlow }


