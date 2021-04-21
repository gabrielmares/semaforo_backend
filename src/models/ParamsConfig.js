let sequelizePool = require('./pool');
let { DataTypes } = require('sequelize');

let Configuration = sequelizePool.define('configuration', {
    pagado: DataTypes.INTEGER,
    documentacion: DataTypes.INTEGER,
    diasatraso: DataTypes.INTEGER,
}, {
    timestamps: false
})

try {
    Configuration.sync();
} catch (error) {
    throw error

}

module.exports = Configuration;