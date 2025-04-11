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
            // const history = (currentState.history || []).map(msg => ({
            //     role: msg.role,
            //     content: msg.content
            // }));



            // Activar efecto de escritura
            const jid = ctx.key.remoteJid;
            const refProvider = await provider.getInstance();

            await refProvider.presenceSubscribe(jid);
            // await delay(500);
            await refProvider.sendPresenceUpdate('composing', jid);

            // Registrar el mensaje del usuario en el historial antes de determinar el flujo
            if (ctx.body && ctx.body.trim() !== '') {
                history.push({
                    role: "user",
                    content: ctx.body
                });
            }

            const promtp = await runDetermineFlow(ctx.body, history)

            console.log(`[PROMPT DETERMINAR]: `, promtp);

            console.log('[HISTORIAL]: ', history);

            if (promtp.toLowerCase().includes('unknown')) {

                console.log('[FLUJO BIENVENIDA]: Iniciando flujo de bienvenida personalizada');

                await refProvider.presenceSubscribe(jid);
                await delay(1000);
                await refProvider.sendPresenceUpdate('composing', jid);

                await flowDynamic('Procesando tu consulta...');



                const name = ctx?.pushName ?? ""

                // Registrar mensaje del usuario
                // history.push({
                //     role: "user",
                //     content: ctx.body
                // })


                // Crear una promesa para la respuesta de OpenAI
                const responsePromise = await run(name, history);

                await refProvider.presenceSubscribe(jid);
                await delay(1000);
                await refProvider.sendPresenceUpdate('composing', jid);

                console.log('[RESPUESTA DE OPENAI]: ', responsePromise);

                const chunks = responsePromise.split(/(?<!\d)\.\s+/g);


                for (const chunk of chunks) {
                    await flowDynamic(chunk)
                }

                history.push({
                    role: "assistant",
                    content: responsePromise
                })


                // Actualizar el historial en el estado
                await state.update({ history });
            }

            if (promtp.toLowerCase().includes('programas')) {
                await state.update({
                    history
                });
                await flowDynamic('Consultando información de programas...');
                return gotoFlow(flowProgramas);
            }

        } catch (error) {
            console.log(`[ERROR]: `, error);
            await flowDynamic("Lo siento, ha ocurrido un error. Por favor, intenta nuevamente más tarde.");
            return endFlow();
        }
    })    
