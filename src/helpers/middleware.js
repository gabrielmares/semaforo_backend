require('dotenv').config();
let jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../enviroment')

let middleware = (req, res, next) => {
    try {
        if (req.signedCookies.TokenID) {
            let token = req.signedCookies.TokenID
            jwt.verify(token, process.env.JWTSECRET || JWTSECRET, (err, data) => {
                if (err || data.exp < Date.now()) {
                    throw 403
                }
                return next();
            })
        } else {
            throw 403 // error, sin token
        }

    } catch (error) {
        // token expirado
        return res
            .clearCookie('TokenID')
            .json({
                codigo: 403,
                msg: 'token expirado'
            })
    }
}

module.exports = middleware;