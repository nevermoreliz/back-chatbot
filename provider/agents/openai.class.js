const OpenAI = require("openai");
const { generatePrompt } = require("../../prompts/promt.incial");
const { generatePromptBienvenida } = require("../../prompts/prompt.bienvenida");


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE,
});

/**
 * 
 * @param {string} name
 * @param {Array} history 
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
        model: "deepseek/deepseek-chat-v3-0324:free",
        temperature: 1,
        max_tokens: 800,
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
const runDetermine = async (history) => {

    const promtp = generatePromptDetermine()
    const response = await openai.chat.completions.create({
        // model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": promtp
            },
            ...history
        ],
        model: "qwen/qwq-32b:free",
        temperature: 1,
        max_tokens: 800,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    // return response.choices.length > 0 && response.choices[0].message.role === 'user' ? response.choices[0].message.content : 'unknown'
    return response.choices.length > 0 && response.choices[0].message.content ? response.choices[0].message.content : 'unknown'
}

module.exports = { run, runDetermine }


