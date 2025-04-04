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
            '🙌 Hola bienvenido.',
            ''
        ],
        null,
        async () => {
            await ChatGPTInstance.handleMsgChatGPT(PROMP)
        }
    )
    .addAnswer(
        [
            'Soy Nova tu *asistente virtual de Posgrado UPEA*.',
            'Gracias por comunicarte conmigo.',
            '',
            // 'Pregunta lo que Quieras?'
            'para cuando quieres reservar la cita?'
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
