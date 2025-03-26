const { check } = require('express-validator');
const validateResult = require('../utils/handleValidator')

const validatorRegistro = [
    // check('nombre_usuario').exists().notEmpty().isLength({ min: 3, max99 }),
    // check('contrasenia').exists().notEmpty(),
    // check('materno').exists().notEmpty(),
    // check('ci').exists().notEmpty(),
    // check('fecha_nacimiento').exists().notEmpty(),
    // check('correo_electronico').exists().notEmpty(),
    // check('sexo').exists().notEmpty(),
    // check('nombre_usuario').exists().notEmpty(),
    // check('contrasenia').exists().notEmpty().isLength({ min: 3, max: 15 }),
    // check('id_persona').exists().notEmpty(),
    check('nombre_usuario').exists().notEmpty(),
    check('contrasenia').exists().notEmpty().isLength({ min: 3, max: 15 }),
    check('id_persona').exists().notEmpty().isNumeric(),
    (req, res, next) => {
        return validateResult(req, res, next)
    }

]

const validatorLogin = [
    check('nombre_usuario').exists().notEmpty(),
    check('contrasenia').exists().notEmpty().isLength({ min: 3, max: 15 }),
    (req, res, next) => {
        return validateResult(req, res, next)
    }

]

module.exports = { validatorRegistro, validatorLogin }