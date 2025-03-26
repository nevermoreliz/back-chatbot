const { check } = require('express-validator');
const validateResult = require('../utils/handleValidator')

const validatorUsuario = [
    check('nombre_usuario', 'el nombre de usuario es obligatorio').exists().notEmpty(),
    check('contrasenia', 'la contraseña es obligatorio').exists().notEmpty().isLength({ min: 3, max: 15 }),
    check('id_persona','id persona es obligatorio').exists().notEmpty().isNumeric(),
    (req, res, next) => {
        return validateResult(req, res, next)
    }
]

const validatorUpdateUsuario = [
    check('nombre_usuario', 'el nombre de usuario es obligatorio').exists().notEmpty(),
    check('contrasenia', 'la contraseña es obligatorio').exists().notEmpty().isLength({ min: 3, max: 15 }),
    (req, res, next) => {
        return validateResult(req, res, next)
    }
]


module.exports = { validatorUsuario, validatorUpdateUsuario }