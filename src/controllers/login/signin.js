const jwt = require('jsonwebtoken');
let passport = require('passport');

let signin = async (req, res) => {
    await passport.authenticate('signin', (err, user, info) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                info,
                codigo: 500
            })
        }

        // 1000*60*60 = 1 hora de tiempo de expiracion del token
        let payload = {
            iat: Date.now(),
            exp: (Date.now() + (1000 * 60 * 60 * 8)),
            claims: {
                usuario: user.identificador
            }

        }
        // se firma el token del sesion
        let token = jwt.sign(payload, process.env.JWTSECRET, { algorithm: 'HS256' })
        res.cookie('TokenID', `${token}`, { httpOnly: true, signed: true })
        return res.json({
            info: true,
            user: {
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                sucursal: user.sucursal
            }
        })
    })(req, res)
}

module.exports = signin;