const { DataTypes } = require('sequelize');
const sequelizePool = require('./pool');

const requestsToRenovate = sequelizePool.define('request', {
    FINNOSUCURSAL: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CODIGO: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NOMBRE: {
        type: DataTypes.STRING,
        allowNull:false
    },
    CENTRO: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    GRUPO: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CONTRATO: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    VENCIMIENTO: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    SALDO: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SDOCAPITAL: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ULTIMO: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    PORPAGADO: DataTypes.FLOAT
});

// try {
//     requestsToRenovate.sync({ alter: true, force:true })
//     console.log('Tabla solicitudes modificada')
// } catch (error) {
//     console.log(error);
// }

module.exports = requestsToRenovate;