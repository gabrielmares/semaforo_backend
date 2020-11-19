const jwt = require('jsonwebtoken');
let passport = require('passport');

let signin = async (req, res) => {
    // console.log(req)
    await passport.authenticate('signin', (err, user, info) => {
        if (err) return err;
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
        console.log('firmando el token de sesion del usuario: ', user.email)

        let token = jwt.sign(payload, process.env.JWTSECRET, { algorithm: 'HS256' })
        // res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.10:3000');
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