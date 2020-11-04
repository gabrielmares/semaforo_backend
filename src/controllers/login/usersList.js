let Users = require('../../models').UserModel


const usersList = async (req, res) => {
    await Users.findAll({
        attributes: ['nombre', 'email', 'rol', 'sucursal', 'status']
    }).then(users => (
        res.send(users)
    ))
}


module.exports = usersList;