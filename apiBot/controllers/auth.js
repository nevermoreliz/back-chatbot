const { adapterDB } = require('../../provider/database');
const { encrypt, compare } = require('../utils/handlePassword');
const { matchedData } = require('express-validator');
const { handleHttpError } = require('../utils/handleError');
const { tokenSing } = require('../utils/handleJwt');
const Usuario = require('../models/usuarios');
const { handleResponseJson } = require('../utils/handleResponseJson');


/**
 * este controlador es encargado de registrar
 * @param {*} req
 * @param {*} res
 */
const registroCtrl = async (req, res) => {
    try {
        req = matchedData(req)

        const contrasenia = await encrypt(req.contrasenia)
        const body = { ...req, contrasenia }

        const usu = await Usuario.create(body)
        usu.set('contrasenia', undefined, { strict: false })


        const data = {
            token: await tokenSing(usu),
            user: usu
        }

        // console.log(data);
        res.send(data)

    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_REGISTER_USUARIO')
    }
};

/**
 * es el encargado de logear a una persona
 * @param {*} req
 * @param {*} res
 */
const loginCtrl = async (req, res) => {

    try {
        const { nombre_usuario, contrasenia } = req = matchedData(req)

        /* ---------- buscar por el nombre de usuario los datos de usuario ---------- */
        // const query = {
        //     text: `SELECT id_usuario, nombre_usuario, contrasenia, id_persona, estado FROM usuarios WHERE nombre_usuario = $1`,
        //     values: [req.nombre_usuario],
        // }

        /* ----- consultar y obtener en la variable usuario los datos del query ----- */
        // const resultado = await adapterDB.db.query(query);
        // const usuarioDb = resultado.rows[0];

        /* --------------------- consultar si existe el usuario --------------------- */
        const usuarioDb = await Usuario.findOne({ where: { nombre_usuario } })

        /* -------- verifiar si el nombre de usuario existe en base de datos -------- */
        if (!usuarioDb) {
            return handleHttpError(res, 'USER_NOT_EXISTS', 400);
        }


        /* --------------- buscar el rol o roles del usuario del query -------------- */
        const query2 = {
            text: `
            select
                ARRAY_AGG(r.nombre_rol) AS roles
            from
                usuario_rol ur
            inner join roles r on
                ur.id_rol = r.id_rol
            where
                ur.id_usuario = $1;`,
            values: [usuarioDb.id_usuario],
        }
        const consultaRoles = await adapterDB.db.query(query2);
        const roles = consultaRoles.rows[0].roles;
        // console.log({ roles });



        /* ------------------------- verificar la contraseña ------------------------ */
        const hashPassword = usuarioDb.contrasenia;

        const check = await compare(req.contrasenia, hashPassword)

        if (!check) {
            handleHttpError(res, 'PASSWORD_INVALID', 401)
            return
        }

        usuarioDb.contrasenia = undefined;
        // usuarioRoles = { ...usuarioDb, roles }
        // usuarioRoles = { usuarioDb, roles }

        // Transforma los datos
        const usuarioRoles = {
            ...usuarioDb.toJSON(), // Convierte el modelo Sequelize a un objeto plano
            roles // Agrega el array de roles
        };


        const data = {
            token: await tokenSing(usuarioDb.id_usuario),
            user: usuarioRoles
        }



        // res.send({ data })
        handleResponseJson(res, 200, data);

    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_LOGIN_USUARIO')
    }
}

const renewToken = async (req, res = response) => {

    try {
      const usuario = req.usuario;

      usuario.contrasenia = undefined;
      
      

      // Generar el TOKEN - JWT
      const data = {
        token: await tokenSing(usuario.id_usuario),
        usuario
      };

      handleResponseJson(res, 200, data);

    } catch (error) {
      console.log(error);
      handleHttpError(res, "ERROR_RENEW_TOKEN");
    }

}

module.exports = { registroCtrl, loginCtrl, renewToken }