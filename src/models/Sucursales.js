const { DataTypes } = require('sequelize');
const sequelizePool = require('./pool');

const Sucursales = sequelizePool.define('sucursales', {
    id: {
        type: DataTypes.NUMBER,
        allowNull: false,
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

// try {
//     Sucursales.sync({ alter: true, force: true });
//     console.log('tabla de sucursales actualizada')
// } catch (error) {
//     console.log(error)
// }


module.exports = Sucursales;