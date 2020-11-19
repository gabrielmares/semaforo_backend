let pool = require('./firebird');

function promesa(query, values) {
    let info;
    try {
        info = new Promise((resolve, reject) => {
            pool.get(function (err, db) {
                if (err) {
                    return err;
                }
                db.query(query, values, function (err, row) {
                    if (err) {
                        reject(err)
                    }
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


