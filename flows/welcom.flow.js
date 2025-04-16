const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { runDetermineFlow } = require("../provider/agents/openai.class");
const flowProgramas = require("./programas.flow");

module.exports = addKeyword(EVENTS.WELCOME)
    .addAnswer(
        ['Buenos días/tardes, bienvenido(a) a EduBot, el asistente avanzado con inteligencia artificial de Posgrado UPEA.',
            'Mi propósito es ofrecerle información precisa y personalizada sobre nuestros programas académicos: Diplomados, Especialidades, Maestrías, Doctorados y Postdoctorados.']
    )
    .addAnswer(
        ['¿Cómo puedo ayudarle hoy?',
            '',
            '*1. Consultar programas:* Conozca nuestra oferta académica.',
            '*2. Requisitos de inscripción:* Infórmese sobre el proceso.',
            '*3. Contactar a un asesor:* Solicite asistencia personalizada.',
            '*4. Hacer una pregunta:* Ejemplo: "¿Qué Maestrías ofrecen?"'],
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, state }) => {
            try {
                console.log(`[aqui 🟡🟡]:`);

                // Obtener el historial actual o inicializar un array vacío
                const currentState = await state.getMyState() || {}
                const history = currentState.history || []

                // Registrar el mensaje del usuario en el historial
                history.push({
                    role: "user",
                    content: ctx.body
                });

                // Guardar el mensaje del usuario en una variable para búsqueda
                const userResponse = ctx.body.toLowerCase();

                // Determinar el flujo usando la IA
                const decisionRaw = await runDetermineFlow(ctx.body, history);
                console.log(`[DECISIÓN IA RAW]: ${decisionRaw}`);

                const decision = String(decisionRaw).trim();
                console.log(`[DECISIÓN IA PROCESADA]: ${decision}`);

                // Actualizar el historial en el estado
                // await state.update({
                //     history,
                // });

                // Mapeo de decisiones a flujos
                const flowMap = {
                    "1": { flow: flowProgramas, message: 'Consultando información de programas...' },
                    // "2": { flow: flowRequisitos, message: 'Consultando requisitos de inscripción...' },
                    // "3": { flow: flowAsesor, message: 'Conectando con un asesor...' },
                    // "4": { flow: flowPreguntas, message: 'Procesando tu pregunta...' }
                };

                // Buscar coincidencia por decisión de IA o por número en el mensaje
                const selectedOption = flowMap[decision] ||
                    (userResponse.includes("1") ? flowMap["1"] : null);

                if (selectedOption) {

                    await flowDynamic(selectedOption.message);
                    return gotoFlow(selectedOption.flow);
                } else {
                    // Si no se reconoce la intención, pedir clarificación
                    await flowDynamic('Por favor, seleccione una de las opciones disponibles (1-4) o formule su consulta de manera más específica.');
                }

            } catch (error) {
                console.error(`[ERROR]: ${error}`);
                await flowDynamic('Lo siento, ha ocurrido un error. Por favor, intente nuevamente.');
            }

        }
    )
