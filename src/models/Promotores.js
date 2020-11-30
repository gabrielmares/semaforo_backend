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

// try {
//     Promotor.sync({ alter: true, force: true }).then(() => console.log('tabla de promotores creada'))
// } catch (error) {
//     console.log(error)
// }


module.exports = Promotor;