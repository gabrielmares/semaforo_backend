const { RequestsInProcess } = require('../models');
const firebirdPool = require('../firebird');
const { Op } = require('sequelize')
const { ParseDate, CambiarFecha, sumaFechas } = require('../helpers/fechas')





const importRequest = () => firebirdPool.get((err, db) => {
    if (err) throw err;
    db.query(`SELECT a.SOLNO, a.SOLFECHA, a.NOSUCURSAL as SUCURSAL, a.CLIENTE, c.NOMBRE, a.CENTRO, a.GRUPO, a.NOPAGOS as PLAZO, a.MONTOSOL, a.PROMOTOR, a.STATUS, a.FECDESEMBOLSO
    FROM FSOCR_SOLICITUDES a
    join CLIEN_CLIENTES c 
    on c.CODIGO=a.CLIENTE
    where a.SOLFECHA>${CambiarFecha(sumaFechas(new Date(), -360))} and a.STATUS is null`, (err, rows) => {
        if (err) throw err
        if (rows.length === 0) return
        rows.map(row => {
            RequestsInProcess.findAll({
                // se revisa si ya existe el registro en MYSQL
                where: {
                    solno: {
                        [Op.eq]: row.SOLNO
                    }
                }
            }).then(exist => {
                // si el registro existe, lo omite, si no, lo crea
                if (exist.length > 0) return // ya existe el registro
                RequestsInProcess.create({
                    solno: row.SOLNO,
                    solfecha: ParseDate(row.SOLFECHA),
                    sucursal: parseInt(row.SUCURSAL),
                    cliente: parseInt(row.CLIENTE),
                    nombre: row.NOMBRE,
                    centro: parseInt(row.CENTRO),
                    grupo: parseInt(row.GRUPO),
                    plazo: parseInt(row.PLAZO),
                    montosol: parseInt(row.MONTOSOL),
                    promotor: parseInt(row.PROMOTOR),
                    status: (row.STATUS === null) && (0),
                })
            })
        })
    })
    db.detach();
})



module.exports = importRequest;