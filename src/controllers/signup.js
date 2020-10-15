let User = require('../models').UserModel;
let bcrypt = require('bcryptjs');


let signup = async (req, res) => {
    const { password, email, nombre, role } = req.body;
    try {
        let userInfo = await User.findOne({
            where: {
                email: email
            }
        }
        ).then(async user => {
            if (user) {
                console.log(user)
                throw 604
            }
            let newUser = await User.create({
                email,
                password: await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS)),
                role: parseInt(role),
                nombre
            })
            return newUser;
        })
        return res.send(userInfo.email);
    } catch (error) {
        console.error('error: ', error)
        return res.send(error)
    }
}

module.exports = signup;

