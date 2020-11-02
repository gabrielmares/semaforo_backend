let Users = require('../../models').UserModel


const usersList = async (req, res) => {
    await Users.findAll({
        attributes: ['nombre', 'email', 'rol', 'sucursal']
    }).then(users => (
        res.send(users)
    ))
}


module.exports = usersList;