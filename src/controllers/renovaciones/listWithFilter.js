const { requestsToRenovate } = require('../../models');
const { Op } = require('sequelize');

const list = async (req, res) => {
    let { CENTRO, FINNOSUCURSAL, DESDE, HASTA } = req.query;
    let rows = {};
    if (parseInt(CENTRO) > 0) {
        try {
            console.log('buscando por centro')
            rows = await requestsToRenovate
                .findAll({
                    where: {
                        FINNOSUCURSAL: parseInt(FINNOSUCURSAL),
                        CENTRO: parseInt(CENTRO),
                        VENCIMIENTO: {
                            [Op.between]: [DESDE, HASTA]
                        }
                    },
                    order: [
                        ['GRUPO', 'ASC']
                    ]
                })
            return res.send(rows)
        } catch (error) {
            console.log(error)
            return res.send(304)

        }
    }

    try {
        console.log('buscando sin centro', DESDE, HASTA)
        rows = await requestsToRenovate
            .findAll({
                where: {
                    FINNOSUCURSAL: {
                        [Op.gt]: [parseInt(FINNOSUCURSAL)]
                    },
                    VENCIMIENTO: {
                        [Op.between]: [DESDE, HASTA]

                    }

                }, order: [
                    ['CENTRO', 'ASC'],
                    ['GRUPO', 'ASC']
                ]
            })
        return res.send(rows)
    } catch (error) {
        console.log(error)
        return res.send(304)
    }
}

module.exports = list