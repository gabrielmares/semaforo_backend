let sequelizePool = require('./pool');
let { DataTypes } = require('sequelize');

let Configuration = sequelizePool.define('configuration', {
    pagado: DataTypes.INTEGER,
    documentacion: DataTypes.INTEGER,
    diasatraso: DataTypes.INTEGER,
}, {
    timestamps: false
})

// try {
//     Configuration.sync({ alter: true, force: true }).then(() => console.log('tabla de configuracion actualizada'));
// } catch (error) {
//     throw error

// }

module.exports = Configuration;