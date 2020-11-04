let { UserModel } = require('../../models')

const deleteUser = (req, res) => {
    const { email } = req.query;
    UserModel.destroy({
        where: {
            email: email
        }
    }).then((event) => {
        if (event) return res.sendStatus(200)
    }).catch((err) => res.send(err))
}

module.exports = deleteUser;