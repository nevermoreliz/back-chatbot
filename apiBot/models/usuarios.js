const { DataTypes } = require('sequelize');
const { adapterSequelizeDB } = require('../../provider/database');

const Usuario = adapterSequelizeDB.define('usuarios',
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_usuario: {
            type: DataTypes.TEXT
        },
        contrasenia: {
            type: DataTypes.TEXT
        },
        id_persona: {
            type: DataTypes.INTEGER
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

module.exports = Usuario