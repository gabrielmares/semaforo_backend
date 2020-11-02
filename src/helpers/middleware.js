require('dotenv').config();
let jwt = require('jsonwebtoken');

let middleware = (req, res, next) => {
    console.log(req.signedCookies.TokenID)
    try {
        if (req.signedCookies.TokenID) {
            let token = req.signedCookies.TokenID
            jwt.verify(token, process.env.JWTSECRET, (err, data) => {
                if (err || data.exp < Date.now()) {
                    throw 403
                }
                return next();
            })
        }
        
    } catch (error) {
        console.log('token expirado', error)
        return res
            .clearCookie('TokenID')
            .json({
                codigo: 403,
                msg: 'token expirado'
            })
    }
}

module.exports = middleware;