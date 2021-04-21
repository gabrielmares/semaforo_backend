let { Renovations, RequestsInProcess } = require('../../models');


// funcion utilizada en el dashbord de la vista
// obtiene los registros que el tipo de usuario necesita
// en la vista son filtrados
const Totales = async (req, res) => {
    let rows = {};
    try {
        if ((parseInt(req.query.sucursal)) > 0) {
            rows.renovations = await Renovations.findAll({
                where: {
                    FINNOSUCURSAL: parseInt(req.query.sucursal)
                }
            })
            rows.requests = await RequestsInProcess.findAll({
                where: {
                    sucursal: parseInt(req.query.sucursal)
                }
            })
        } else {
            // obtiene registros sin filtros
            rows.renovations = await Renovations.findAll();
            rows.requests = await RequestsInProcess.findAll();
        }
        return res.send(rows)
    } catch (error) {
        return res.sendStatus(607)
    }

}

module.exports = Totales;