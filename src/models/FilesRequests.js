const { DataTypes } = require('sequelize');
const sequelizePool = require('./pool');
const RequestModel = require('./Requests')

const FilesRequests = sequelizePool.define('filesRequests', {
    solID: {
        type: DataTypes.INTEGER,
        references: {
            model: RequestModel,
            key: 'solno'
        },
        allowNull: false
    },
    ine: DataTypes.STRING,
    solicitud: DataTypes.STRING,
    comprobante: DataTypes.STRING,
    aviso: DataTypes.STRING
}, {
    timestamps: false
})

try {
    FilesRequests.sync();
} catch (error) {
    throw error
}

module.exports = FilesRequests