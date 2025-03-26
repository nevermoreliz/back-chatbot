const { check } = require('express-validator');
const validateResult = require('../utils/handleValidator')

const validatorCreatePersona = [
    check('nombre').exists().notEmpty(),
    check('paterno').exists().notEmpty(),
    check('materno').exists().notEmpty(),
    check('ci').exists().notEmpty(),
    check('fecha_nacimiento').exists().notEmpty(),
    check('correo_electronico').exists().notEmpty(),
    check('sexo').exists().notEmpty(),
    (req, res, next) => {
        return validateResult(req, res, next)
    }
]

const validatorUpdatePersona = [
    check('nombre').optional(),
    check('paterno').optional(),
    check('materno').optional(),
    check('ci').optional(),
    check('fecha_nacimiento').optional(),
    check('correo_electronico').optional(),
    check('sexo').optional(),
    (req, res, next) => {
        return validateResult(req, res, next)
    }
]

module.exports = { validatorCreatePersona, validatorUpdatePersona }