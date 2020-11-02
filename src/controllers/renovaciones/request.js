let requestToRenovate = require('../../models').requestsToRenovate;

const Totales = async (req, res) => {
    if ((parseInt(req.query.sucursal)) > 0) {
        await requestToRenovate.findAll({
            where: {
                FINNOSUCURSAL: parseInt(req.query.sucursal)
            }
        }).then(query => {
            return res.send(query)
        })

    }
    await requestToRenovate.findAll().then(query => (res.send(query)))
}

module.exports = Totales;