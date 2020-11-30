const rolUsers = require('./roles');
const UserModel = require('./Users');
const Renovations = require('./Renovations');
const Sucursales = require('./Sucursales');
const Promotores = require('./Promotores');
const RequestsInProcess = require('./Requests');
const FilesRequests = require('./FilesRequests');
const Configuration = require('./ParamsConfig');



module.exports = {
    rolUsers,
    FilesRequests,
    Promotores,
    UserModel,
    Renovations,
    Sucursales,
    RequestsInProcess,
    Configuration
}