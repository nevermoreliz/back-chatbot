const { addKeyword, EVENTS } = require("@bot-whatsapp/bot")
const { delay } = require("@whiskeysockets/baileys")
const ChatGPTClass = require("../provider/agents/chatgpt.class")
const { PROMP } = require("../prompts/prompt")

const ChatGPTInstance = new ChatGPTClass()


const flowConfirmar = addKeyword('si confirmo').addAnswer('Continuamos con tu Reserva')


/** 
 * flujo de bienvenida
 * 
 * const A = obligatorio: un texto "hola", Array['hola','como estas']
 * const B = opcional: es un objeto {media, delay, capture, buttons}
 * const C = opcional: es una funcion callback function!
 * const D = opcional: es un array de flujos hijos!
 */
module.exports = addKeyword('programas')
    .addAnswer(
        [
            'Agradezco su interés en nuestra oferta académica. En Posgrado UPEA ofrecemos los siguientes programas:'
        ],
        null,
        async () => {
            await ChatGPTInstance.handleMsgChatGPT(PROMP)
        }
    )
    .addAnswer(
        [
            `
            1. Diplomados: Formación intensiva de 3 a 6 meses.
            2. Especialidades: Especialización profesional.
            3. Maestrías: Posgrados con enfoque profesional o investigativo.
            4. Doctorados: Programas de investigación.
            5. Postdoctorados: Proyectos avanzados para investigadores titulados.`,
        ],
        { capture: true },
        async (ctx, { flowDynamic, fallBack }) => {

            /**
             * lo que la persona escribe esta en ctx.body
             */

            const response = await ChatGPTInstance.handleMsgChatGPT(ctx.body)

            // ya tengo la respuesta
            const message = response.text
            /**
             * fallBack : es como un ciclo
             */
            if (ctx.body.toUpperCase() !== 'si confirmo') {

                return fallBack(message)
            }
        },
        [flowConfirmar]
    )
