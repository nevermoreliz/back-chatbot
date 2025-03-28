const { addKeyword, EVENTS } = require("@bot-whatsapp/bot")
const { run } = require("../provider/agents/openai.class")

// Tiempo de espera en milisegundos (1 minuto)
const TIMEOUT_DURATION = 30000

// Variable global para almacenar el ID del temporizador actual
let currentTimeoutId = null;

module.exports = addKeyword(EVENTS.WELCOME)
.addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    try {
        // Cancelar cualquier temporizador existente
        if (currentTimeoutId) {
            clearTimeout(currentTimeoutId);
            console.log("[TIMEOUT]: Temporizador anterior cancelado debido a nueva consulta");
        }

        // Obtener el historial actual o inicializar un array vacío
        const currentState = await state.getMyState() || {}
        const history = currentState.history || []
        const name = ctx?.pushName ?? ""

        // Registrar mensaje del usuario
        history.push({
            role: "user",
            content: ctx.body
        })

        // Crear una promesa que se resuelve después del tiempo de espera
        const timeoutPromise = new Promise((resolve) => {
            currentTimeoutId = setTimeout(async () => {
                console.log(`[TIMEOUT]: No se recibió respuesta en ${TIMEOUT_DURATION/1000} segundos`);
                await flowDynamic("Parece que no hay actividad. Si necesitas ayuda más tarde, puedes iniciar una nueva conversación. ¡Hasta pronto!");
                
                // Limpiar el historial antes de finalizar el flujo
                await state.update({
                    history: [] // Reiniciar el historial a un array vacío
                });
                
                resolve('timeout');
                currentTimeoutId = null;
                return endFlow();
            }, TIMEOUT_DURATION);
        });

        // Crear una promesa para la respuesta de OpenAI
        const responsePromise = run(name, history);

        // Usar Promise.race para ver cuál termina primero
        const result = await Promise.race([
            responsePromise,
            timeoutPromise
        ]);

        // Si el resultado es 'timeout', terminar el flujo
        if (result === 'timeout') {
            console.log("[TIMEOUT]: Finalizando flujo por inactividad");
            return endFlow();
        }

        // Si llegamos aquí, significa que obtuvimos una respuesta antes del timeout
        const largeResponse = result;
        
        const chunks = largeResponse.split(/(?<!\d)\.\s+/g);

        for (const chunk of chunks) {
            await flowDynamic(chunk)
        }

        history.push({
            role: "assistant",
            content: largeResponse
        })

        await state.update({
            history,
            lastActivity: Date.now()
        })

    } catch (error) {
        console.log(`[ERROR]: `, error);
        await flowDynamic("Lo siento, ha ocurrido un error. Por favor, intenta nuevamente más tarde.");
        return endFlow();
    }
})

