const { UserModel } = require('../../models')


const updateUser = (req, res) => {
    const { nombre, sucursal, status, rol } = req.query
    UserModel.update({ nombre, sucursal, status, rol }, {
        where: {
            email
        }
    })
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(301));
}


module.exports = updateUser;