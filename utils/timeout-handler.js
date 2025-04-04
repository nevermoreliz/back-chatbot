// Variable global para almacenar los IDs de temporizadores por sesión
const timeoutIds = new Map();

// Tiempo de espera predeterminado en milisegundos (30 segundos)
const DEFAULT_TIMEOUT = 30000;

/**
 * Configura un temporizador para una sesión específica
 * @param {string} sessionId - ID único de la sesión
 * @param {Function} timeoutCallback - Función a ejecutar cuando se cumpla el tiempo
 * @param {number} duration - Duración del timeout en ms (opcional)
 * @returns {void}
 */
const setTimeout = (sessionId, timeoutCallback, duration = DEFAULT_TIMEOUT) => {
    // Cancelar cualquier temporizador existente para esta sesión
    clearTimeout(sessionId);
    
    // Crear nuevo temporizador
    const timeoutId = global.setTimeout(async () => {
        console.log(`[TIMEOUT]: Sesión ${sessionId} inactiva por ${duration/1000} segundos`);
        await timeoutCallback();
        timeoutIds.delete(sessionId);
    }, duration);
    
    // Guardar referencia
    timeoutIds.set(sessionId, timeoutId);
};

/**
 * Cancela el temporizador para una sesión específica
 * @param {string} sessionId - ID único de la sesión
 * @returns {boolean} - true si se canceló un temporizador, false si no existía
 */
const clearTimeout = (sessionId) => {
    if (timeoutIds.has(sessionId)) {
        global.clearTimeout(timeoutIds.get(sessionId));
        timeoutIds.delete(sessionId);
        console.log(`[TIMEOUT]: Temporizador cancelado para sesión ${sessionId}`);
        return true;
    }
    return false;
};

module.exports = {
    setTimeout,
    clearTimeout,
    DEFAULT_TIMEOUT
};