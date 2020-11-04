let requestToRenovate = require('../../models').requestsToRenovate;

const Totales = (req, res) => {
    console.log(req.query)
    if ((parseInt(req.query.sucursal)) > 0) {
        console.log('filtrando por sucursal')
        return requestToRenovate.findAll({
            where: {
                FINNOSUCURSAL: parseInt(req.query.sucursal)
            }
        }).then(query => {
            return res.send(query)
        })

    } else {
        console.log('filtrando sin sucursal')
        return requestToRenovate
            .findAll()
            .then(query => { return res.json(query) })
            .catch(err => {
                console.log(err)
                return res.sendStatus(607)
            })
    }
}

module.exports = Totales;