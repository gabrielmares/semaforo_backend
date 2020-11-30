const job = require('node-schedule');
const { RequestsInProcess } = require('../models');
const firebirdPool = require('../firebird');
const { Op } = require('sequelize')
const { ParseDate } = require('../helpers/fechas')

const importRequest = () => firebirdPool.get((err, db) => {
    if (err) {
        console.log('no se logro la conexion');
        throw err;
    }
    console.log('iniciando la migracion de las solicitudes pendientes')
    db.query(`SELECT a.SOLNO, a.SOLFECHA, a.NOSUCURSAL as SUCURSAL, a.CLIENTE, c.NOMBRE, a.CENTRO, a.GRUPO, a.NOPAGOS as PLAZO, a.MONTOSOL, a.PROMOTOR, a.STATUS, a.FECDESEMBOLSO
    FROM FSOCR_SOLICITUDES a
    join CLIEN_CLIENTES c 
    on c.CODIGO=a.CLIENTE
    where a.SOLFECHA>20200101 and a.STATUS is null`, (err, rows) => {
        if (err) {
            console.log('error en la consulta');
        }
        if (rows.length === 0) {
            console.log('no se encontraron solicitudes nuevas en proceso');
        }
        rows.map(row => {
            RequestsInProcess.findAll({
                where: {
                    solno: {
                        [Op.eq]: row.SOLNO
                    }
                }
            }).then(exist => {
                // console.log(exist)
                if (exist.length > 0) {
                    console.log('ya existe el registro', row.SOLNO)
                    return false;
                }
                console.log('creando el registro de la solicitud numero', row.SOLNO)
                Request.create({
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


// job.scheduleJob({ hour: 15, minute: 40 }, importRequest)

module.exports = importRequest;