const { DataTypes } = require('sequelize');
const sequelizePool = require('./pool');

const Renovations = sequelizePool.define('renovation', {
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
        allowNull: false
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
}, {
    timestamps: false
});

try {
    Renovations.sync()
} catch (error) {
    throw error
}

module.exports = Renovations;