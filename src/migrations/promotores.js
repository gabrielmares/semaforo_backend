const { Promotores } = require('../models');
const firebirdPool = require('../firebird');


const PromosMigration = firebirdPool.get(function (err, db) {
    if (err) {
        throw err; //no se pudo conectar a la BD
    }
    try {
        db.query('select p.CODIGO as id, p.TELEFONO as sucursal, p.NOMBRE from direc_directorio p where p.codigo>0 and p.codigo<16', (err, rows) => {
            if (err) {
                throw err; //error de consulta
            }
            rows.map(promo => {
                if (promo.sucursal === "") return false
                Promotores.create({
                    id: promo.ID,
                    sucursal: parseInt(promo.SUCURSAL),
                    nombre: promo.NOMBRE
                })
            })
        })
        db.detach();
    } catch (error) {
        db.detach();
        throw error;
    }

})



module.exports = PromosMigration;