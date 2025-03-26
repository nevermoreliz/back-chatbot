const { DataTypes } = require('sequelize');
const { adapterSequelizeDB } = require('../../provider/database');

const Rol = adapterSequelizeDB.define('roles',
    {

        id_rol: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_rol: {
            type: DataTypes.TEXT
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

module.exports = Rol