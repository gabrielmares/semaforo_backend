let pool = require('./firebird');
/*
funcion que recibe los parametros para crear consultas a Firebird
la libreria funciona con promesas desde que abre la conexion hasta que recibe el resultado
*/

function promesa(query, values) {
    let info;
    try {
        info = new Promise((resolve, reject) => {
            pool.get(function (err, db) {
                if (err) {
                    throw err;
                }
                db.query(query, values, function (err, row) {                   
                    if (err) throw reject(err)
                    db.detach();
                    if (row.length > 1) {
                        resolve(row);
                    }
                    resolve(row[0]);
                })
            })
        })
        return info
    } catch (error) {
        return error
    }
}



module.exports = {
    promesa
}


