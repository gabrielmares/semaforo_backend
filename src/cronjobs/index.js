let job = require('node-schedule');
let update = require('./UpdateRenovations');
let importRequest = require('./Requests');
/**
 * Array de funciones a lanzar en CronJobs
 * para migrar los registros a MySql
 * @param {* actualiza y/o crea  los registros en MySql } update
 * @param {* importa las solicitudes de credito en tramite para control de documentacion, INE, Comprobante de domicilio, etc. * estas funcionaliades no han sido aprobadas } importRequest
 */

let UpdateRecords = [
    update,
    importRequest,
]
/**
 * diariamente se actualizan los registros, durante un horario establecido
 */
let schedule = job.scheduleJob({ hour: 10, minute: 43 }, () => {
    UpdateRecords.map(funcion => {
        try {
            return Promise.resolve(funcion());
        } catch (err) {
            throw err
        }
    })

}
)




module.exports = schedule;