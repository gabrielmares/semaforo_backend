const { DataTypes } = require('sequelize');
const sequelizePool = require('./pool');
const Sucursales = require('./Sucursales');
const Promotores = require('./Promotores');

const RequestModel = sequelizePool.define('request', {
    solno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    solfecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    sucursal: {
        type: DataTypes.INTEGER,
        references: {
            model: Sucursales,
            key: 'ID'
        }
    },
    cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    centro: DataTypes.INTEGER,
    grupo: DataTypes.INTEGER,
    plazo: DataTypes.INTEGER,
    montosol: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    promotor: {
        type: DataTypes.INTEGER,
        references: {
            model: Promotores,
            key: 'id'
        }
    },
    solicitud: DataTypes.INTEGER,
    comprobante: DataTypes.INTEGER,
    ine: DataTypes.INTEGER,
    aviso: DataTypes.INTEGER,
    fecdesembolso: DataTypes.DATEONLY
}, {
    timestamps: false
})

try {
    RequestModel.sync()
} catch (error) {
   throw error
}



module.exports = RequestModel