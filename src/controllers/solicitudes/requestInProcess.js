const { RequestsInProcess } = require('../../models');
const { Op } = require('sequelize');

const Requests = async (req, res) => {
    let { FINNOSUCURSAL, DESDE, HASTA, CENTRO } = req.query;
    if (parseInt(CENTRO) > 0) {
        try {
            RequestsInProcess.findAll({
                where: {
                    sucursal: parseInt(FINNOSUCURSAL),
                    centro: parseInt(CENTRO),
                    solfecha: {
                        [Op.between]: [DESDE, HASTA]
                    }
                },
                order: [
                    ['GRUPO', 'ASC']
                ]
            }).then(rows => res.send(rows))
        } catch (error) {
            return res.send(304)
        }
    }
    try {
        RequestsInProcess.findAll({
            where: {
                sucursal: parseInt(FINNOSUCURSAL),
                centro: {
                    [Op.gt]: 0
                },
                solfecha: {
                    [Op.between]: [DESDE, HASTA]
                }
            },
            order: [
                ['centro', 'ASC'],
                ['grupo', 'ASC']
            ]
        }).then(rows => res.send(rows))
    } catch (error) {
        return res.send(304)
    }
}


module.exports = Requests