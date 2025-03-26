const { handleHttpError } = require('../utils/handleError')

/**
 * Array con los Roles permitidos
 * @param {*} roles 
 * @returns 
 */

const checkRol = (roles) => (req, res, next) => {
    try {
        const { usuario } = req;
        // console.log({usuario});
        
        const rolesByUser = usuario.roles;
        //TODO: ["admin","manager"]
        const checkValueRol = roles.some((rolSingle) => rolesByUser.includes(rolSingle)
        ); //TODO: true, false
        if (!checkValueRol) {
            handleHttpError(res, "USER_NOT_PERMISSIONS", 403);
            return;
        }
        next();
    } catch (e) {
        handleHttpError(res, "ERROR_PERMISSIONS", 403);
    }
};

module.exports = checkRol;