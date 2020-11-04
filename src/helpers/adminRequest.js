let jwt = require('jsonwebtoken');
let { UserModel } = require('../models')

const isAdmin = (req, res, next) => {
    if (req.signedCookies.TokenID) {
        let token = req.signedCookies.TokenID
        jwt.verify(token, process.env.JWTSECRET, (err, data) => {
            if (err || data.exp < Date.now()) {
                return res.json({
                    codigo: 403,
                    msg: 'Vuelva a iniciar sesion'
                })
            }
            UserModel.findOne({
                where: {
                    identificador: info.claims.usuario
                }
            }).then(typeUser => {
                if (!typeUser) {
                    return res.json({
                        codigo: 403,
                        msg: 'Vuelva a iniciar sesion'
                    })
                } else if (typeUser.dataValues.rol === 1 && typeUser.dataValues.email !== req.query.email) {
                    return next();
                }
                else {
                    return res.json({
                        codigo: 606,
                        msg: 'No cuenta con permisos para hacer esta operacion'
                    })
                }
            })
        })
    }
}

module.exports = isAdmin;