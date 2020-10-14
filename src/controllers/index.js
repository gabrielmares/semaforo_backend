let User = require('../models').UserModel;
let bcrypt = require('bcryptjs');


let signUp = async (req, res, next) => {
    const { password, email, name, role } = req.body;
    try {
        await User.findOne({
            where: {
                email: email
            }
        }
        ).then(async user => {
            if (user) {
                return ('El usuario ya existe')
            }
            let newUser = await User.create({
                email,
                password: await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS)),
                role: parseInt(role),
                name
            })
            return newUser;
        }).then(data => {
            res.send(data)
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = signUp;