const passport = require('passport');
const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../mysql');
require('dotenv').config();
console.log(process.env.DBMYSQL)
let sequelizePool = new Sequelize(
    process.env.DBMYSQL,
    process.env.USERMYSQL,
    process.env.PASSWORDMYSQL, {
    dialect: "mysql",
    port: process.env.PORTMYSQL,
    host: process.env.HOSTMYSQL,
    logging: false
});

const User = sequelizePool.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: process.env.ALLOWNULL
    },
    email: {
        type: DataTypes.STRING,
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

try {
    User.sync({ alter: true });

} catch (error) {
    console.log(error)
}
console.log('Tabla Usuarios modificada')


module.exports = User;