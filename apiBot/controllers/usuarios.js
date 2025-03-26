const { adapterDB } = require('../../provider/database');
const { matchedData } = require('express-validator');
const { handleHttpError } = require('../utils/handleError');
const { handleResponseJson, handleResponseJsonMsg } = require('../utils/handleResponseJson')
const Persona = require('../models/personas');
const Usuario = require('../models/usuarios');
const { encrypt } = require('../utils/handlePassword');
const { Op } = require('sequelize');
const { tokenSing } = require('../utils/handleJwt');


const getUsuario = async (req, res) => {
    try {

        res.json({
            ok: true,
            data: 'Usuario'
        });

    } catch (error) {
        handleHttpError(res, 'ERROR_GET_USUARIO_DETALLE')
    }
};

const getUsuarios = async (req, res) => {
    try {



    } catch (error) {
        handleHttpError(res, 'ERROR_GET_USUARIOS')
    }
};

const createUsuario = async (req, res) => {
    try {

        const { nombre_usuario, contrasenia, id_persona } = req = matchedData(req)
        /* ------------- consultar si existe el mismo nombre de usuario ------------- */

        const usuario = await Usuario.findOne({
            where: {
                [Op.or]:
                    [
                        { nombre_usuario },
                        { id_persona }
                    ]
            }
        });

        /* -------------------- verificar si el usuairo ya existe ------------------- */
        if (usuario) {
            return handleResponseJsonMsg(res, 200, "NOMBRE_DE_USUARIO_YA_EXISTE")
        }

        /* ------------------------------ crear usuario ----------------------------- */
        const contraseniaEncrypt = await encrypt(contrasenia);
        const dataUsuarioCreate = { ...req, contrasenia: contraseniaEncrypt }

        /* ------------------- guardar el usuario a base de datos ------------------- */
        const usuarioData = await Usuario.create(dataUsuarioCreate);
        usuarioData.set('contrasenia', undefined, { strict: false })

        const data = {
            token: await tokenSing(usuarioData),
            user: usuarioData
        }

        handleResponseJson(res, 200, data);

    } catch (error) {
        handleHttpError(res, 'ERROR_CREATE_USUARIO')
        // console.log(error);
    }
};

const updateUsuario = async (req, res) => {

    /* ------------------------------ validar token ----------------------------- */

    try {
        const id_usuario = req.params.id
        req = matchedData(req)

        const usuarioDb = await Usuario.findByPk(id_usuario);
        
        if (!usuarioDb) {
            return handleResponseJsonMsg(res, 404, 'NO_EXISTE_ESE_USUARIO_CON_ESE_ID')
        }

        const campos = req;
        delete campos.contrasenia;

        /* ------------- actualiza usuario solo en mombre de usuario ------------- */
        const usuarioActualizado = await Usuario.update(campos, { where: { id_usuario } })

        handleResponseJson(res, 200, usuarioActualizado, 'USUARIO_ACTUALIZADO');

    } catch (error) {
        // console.log(error);
        handleHttpError(res, 'ERROR_UPDATE_USUARIO')
    }
};
 
const deleteUsuario = async (req, res) => {
    try {

    } catch (error) {
        handleHttpError(res, 'ERROR_DELETE_USUARIO')
    }
};

module.exports = { getUsuario, getUsuarios, createUsuario, updateUsuario, deleteUsuario }