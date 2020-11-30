let job = require('node-schedule');
let update = require('./UpdateRenovations');
let importRequest = require('./Requests');

let UpdateRecords = [
    update,
    importRequest
]

let schedule = job.scheduleJob({ hour: 10, minute: 21 }, () => {
    console.log('iniciando la migracion')
    UpdateRecords.map(funcion => {
        try {
            Promise.resolve(funcion()).then(() => console.log('interacion realizada'));
        } catch (err) {
            return console.log('sucedio un error', err);
        }
    })

})




module.exports = schedule;