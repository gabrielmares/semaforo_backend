const jwt = require('jsonwebtoken');
let passport = require('passport');

let signin = async (req, res) => {
    console.log(req.headers)
    await passport.authenticate('signin', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.send(info)
        }
        let payload = {
            usuario: user.nombre,
            exp: Math.floor(Date.now() / 1000) + (100 * 6),
            email: user.email,
            rol: user.role
        }
        console.log('firmando el token de sesion del usuario: ', user.email)
        let token = jwt.sign(payload, process.env.JWTSECRET, { algorithm: 'HS512' })
        return res.json({ token })
    })(req, res)
}

module.exports = signin;