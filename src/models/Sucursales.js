const { DataTypes } = require('sequelize');
const sequelizePool = require('./pool');

const Sucursales = sequelizePool.define('sucursales', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sucursal: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false
})

try {
    Sucursales.sync();
} catch (error) {
    throw error
}


module.exports = Sucursales;