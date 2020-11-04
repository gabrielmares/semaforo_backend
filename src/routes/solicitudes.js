var router = require('express').Router();
const middleware = require('../helpers/middleware')
const { Totales, invoices, list } = require('../controllers/renovaciones')



// listado de solicitudes con filtro por sucursal, centro y fechas
router.get('/listas', middleware, list)

// ruta que obtiene los datos del cliente, para generar una solicitud de credito nueva, prellenada
router.get('/renovacion', middleware, invoices)

// retorna el total de creditos por renovar, sin filtrar sucursales, centros ni fechas
router.get('/totales', middleware, Totales)

module.exports = router;
