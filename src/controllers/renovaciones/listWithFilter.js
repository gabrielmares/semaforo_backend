const { Renovations } = require('../../models');
const { Op } = require('sequelize');

const list = async (req, res) => {
    let { CENTRO, FINNOSUCURSAL, DESDE, HASTA } = req.query;
    let rows = [];
    try {
        rows = await Renovations
            .findAll({
                where: {
                    FINNOSUCURSAL: (parseInt(FINNOSUCURSAL) === 0) ? ({ [Op.gt]: 0 }) : parseInt(FINNOSUCURSAL),
                    CENTRO: (parseInt(CENTRO) > 0 && parseInt(FINNOSUCURSAL) > 0) ? ({ [Op.eq]: parseInt(CENTRO) }) : ({ [Op.gt]: 0 }),
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
        return res.send(304)

    }
}

module.exports = list