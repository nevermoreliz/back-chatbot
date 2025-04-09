const { addKeyword, EVENTS } = require("@bot-whatsapp/bot")
const { run, runDetermineFlow } = require("../provider/agents/openai.class");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const flowProgramas = require("./programas.flow");

module.exports = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic, state, endFlow, gotoFlow, provider }) => {
        try {

            // Obtener el historial actual o inicializar un array vacío
            const currentState = await state.getMyState() || {}
            const history = currentState.history || []

            // Activar efecto de escritura
            const jid= ctx.key.remoteJid;
            const refProvider = await provider.getInstance();

            // await refProvider.presenceSubscribe(jid);
            // await delay(100);
            await refProvider.sendPresenceUpdate('composing', jid);

            

            const promtp = await runDetermineFlow(ctx.body, history)

            console.log(`[PROMPT DETERMINAR]: `, promtp);

            if (promtp.toLowerCase().includes('unknown')) {


                await flowDynamic('Iniciando asistente general...');
                // Usamos gotoFlow y luego finalizamos este flujo

                console.log('[FLUJO BIENVENIDA]: Iniciando flujo de bienvenida personalizada');
                await flowDynamic('Procesando tu consulta...');

                // Obtener el historial actual o inicializar un array vacío
                const currentState = await state.getMyState() || {}
                const history = currentState.history || []
                const name = ctx?.pushName ?? ""

                // Registrar mensaje del usuario
                history.push({
                    role: "user",
                    content: ctx.body || "bienvenida"
                })

                // Crear una promesa para la respuesta de OpenAI
                const responsePromise = await run(name, history);

                console.log('[RESPUESTA DE OPENAI]: ', responsePromise);

                const chunks = responsePromise.split(/(?<!\d)\.\s+/g);

                for (const chunk of chunks) {
                    await flowDynamic(chunk)
                }

                history.push({
                    role: "assistant",
                    content: responsePromise
                })

            }

            if (promtp.toLowerCase().includes('programas')) {

                await flowDynamic('Consultando información de programas...');
                return gotoFlow(flowProgramas);
            }

        } catch (error) {
            console.log(`[ERROR]: `, error);
            await flowDynamic("Lo siento, ha ocurrido un error. Por favor, intenta nuevamente más tarde.");
            return endFlow();
        }
    })    
