const { DataTypes } = require('sequelize');
require('dotenv').config();

const sequelizePool = require('./pool');


const User = sequelizePool.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// try {
//     User.sync({ alter: true });
//     console.log('Tabla Usuarios modificada')
// } catch (error) {
//     console.log(error)
// }



module.exports = User;