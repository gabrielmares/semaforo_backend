let jwt = require('jsonwebtoken');
let User = require('../../models').UserModel;
const { JWTSECRET } = require('../../enviroment')


let currentUser = (req, res) => {
    if (req.signedCookies.TokenID) {
        let token = req.signedCookies.TokenID
        jwt.verify(token, process.env.JWTSECRET || JWTSECRET, (err, info) => {
            if (err || info.exp < Date.now()) {
                // si el token esta vencido, limpiamos Cookie de sesion para
                // que el usuario vuelva a iniciar sesion
                return res
                    .clearCookie('TokenID')
                    .json({
                        codigo: 403,
                        msg: err
                    })
            }
            // si el token es valido busca la informacion del mismo en la BD
            // y la retorna al endpoint para cargar la vista en base a sus 
            // permisos
            User.findOne({
                where: {
                    identificador: info.claims.usuario
                }
            }).then((user) => {
                if (!user) return res.json({
                    codigo: 403,
                    msg: 'Vuelva a iniciar sesion'
                })
                const { nombre, email, rol, sucursal, status } = user.dataValues;

                return res.json({
                    info: true,
                    user: {
                        nombre,
                        email,
                        rol,
                        sucursal,
                        status
                    }
                });

            })
        })

    }
    else {
        return res.json({
            codigo: 403,
            msg: 'sin token'
        })
    }

}

module.exports = currentUser;