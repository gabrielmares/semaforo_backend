const { Sequelize } = require('sequelize');
const { mysqlOptions } = require('../enviroment')


let sequelizePool = new Sequelize(
    DBMYSQL = process.env.DBMYSQL || mysqlOptions.DBMYSQL,
    USERMYSQL = process.env.USERMYSQL || mysqlOptions.USERMYSQL,
    PASSWORDMYSQL = process.env.PASSWORDMYSQL || mysqlOptions.PASSWORDMYSQL, {
    dialect: "mysql",
    port: process.env.PORTMYSQL || mysqlOptions.PORTMYSQL,
    host: process.env.HOSTMYSQL || mysqlOptions.HOSTMYSQL,
});




module.exports = sequelizePool;