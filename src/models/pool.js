const { Sequelize } = require('sequelize');
const pool = require('../mysql');
require('dotenv').config();


let sequelizePool = new Sequelize(
    process.env.DBMYSQL,
    process.env.USERMYSQL,
    process.env.PASSWORDMYSQL, {
    dialect: "mysql",
    port: process.env.PORTMYSQL,
    host: process.env.HOSTMYSQL
});


module.exports = sequelizePool;