const { RequestsInProcess } = require('../../models');
const { Op } = require('sequelize');

const Requests = async (req, res) => {
    let { FINNOSUCURSAL, DESDE, HASTA, CENTRO } = req.query;
    let rows = [];
    try {
        rows = await RequestsInProcess
            .findAll({
                where: {
                    sucursal: (parseInt(FINNOSUCURSAL) === 0) ? ({ [Op.gt]: 0 }) : parseInt(FINNOSUCURSAL),
                    centro: (parseInt(CENTRO) > 0 && parseInt(FINNOSUCURSAL) > 0) ? ({ [Op.eq]: parseInt(CENTRO) }) : ({ [Op.gt]: 0 }),
                    solfecha: {
                        [Op.between]: [DESDE, HASTA]
                    }
                },
                order: [
                    ['GRUPO', 'ASC']
                ]
            })
        return res.send(rows)
    } catch (error) {
        return res.send(304)
    }
}



module.exports = Requests