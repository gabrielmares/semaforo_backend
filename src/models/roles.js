const sequelizePool = require('./pool');
const { DataTypes } = require('sequelize');

const rolUsers = sequelizePool.define('rolUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    timestamps: false
});

try {
    rolUsers.sync();
   
} catch (error) {
    throw error
}

module.exports = rolUsers;