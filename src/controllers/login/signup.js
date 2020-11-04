let User = require('../../models').UserModel;
let bcrypt = require('bcryptjs');
let uuid = require('uuid')


let signup = async (req, res) => {
    const { password, email, nombre, rol, sucursal } = req.body;
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
            return await User.create({
                email,
                password: await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS)),
                rol: parseInt(rol),
                nombre,
                sucursal,
                identificador: uuid.v4()
            })
        })
        return res.send(userInfo.email);
    } catch (error) {
        console.error('error: ', error)
        return res.send({
            error,
            msg: 'Ya existe un usuario con este Email'
        })
    }
}

module.exports = signup;
