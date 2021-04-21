const { DataTypes } = require('sequelize');
const sequelizePool = require('./pool');
const Sucursales = require('./Sucursales');

const Promotor = sequelizePool.define('promotores', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    sucursal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sucursales,
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

try {
    Promotor.sync()
} catch (error) {
    console.log(error)
}


module.exports = Promotor;