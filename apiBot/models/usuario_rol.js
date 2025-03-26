const { DataTypes } = require('sequelize');
const { adapterSequelizeDB } = require('../../provider/database');
const Usuario = require('./usuarios');
const Rol = require('./roles');

const UsuarioRol = adapterSequelizeDB.define('usuario_rol',
    {

        id_usuario: {
            type: DataTypes.INTEGER
        },
        id_rol: {
            type: DataTypes.INTEGER
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'usuario_rol'
    });


Usuario.belongsToMany(Rol, { through: UsuarioRol, foreignKey: 'id_usuario' });
Rol.belongsToMany(Usuario, { through: UsuarioRol, foreignKey: 'id_rol' });

module.exports = UsuarioRol