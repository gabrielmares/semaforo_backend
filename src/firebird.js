const Firebird = require('node-firebird');
const dotenv = require('dotenv');
dotenv.config();

var options = {};

options.host = process.env.HOST;
options.portDB = process.env.PORTDB;
options.database = process.env.ROUTE;
options.user = process.env.USER;
options.password = process.env.PASSWORD;
options.lowercase_keys = false
options.role = null;            
options.pageSize = 4096;        

let pool = Firebird.pool(15, options);

module.exports = pool; 

