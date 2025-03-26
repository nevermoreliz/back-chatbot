const { DataTypes } = require('sequelize');
const { adapterSequelizeDB } = require('../../provider/database');

const Persona = adapterSequelizeDB.define('personas',
    {
        id_persona: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING
        },
        paterno: {
            type: DataTypes.STRING
        },
        materno: {
            type: DataTypes.STRING
        },
        ci: {
            type: DataTypes.STRING,
            unique: true
        },
        fecha_nacimiento: {
            type: DataTypes.STRING
        },
        img: {
            type: DataTypes.STRING
        },
        correo_electronico: {
            type: DataTypes.STRING,
            unique: true
        },
        sexo: {
            type: DataTypes.STRING,
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

module.exports = Persona