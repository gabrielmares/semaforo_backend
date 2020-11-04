const { UserModel } = require('../../models');


const blockUser = (req, res) => {
    const { email } = req.query
    UserModel.update({ status }, {
        where: {
            email
        }
    })
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(301));
}


module.exports = blockUser;