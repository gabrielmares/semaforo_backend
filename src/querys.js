const { json } = require('express');
let pool = require('./firebird');

// function vencimientos(sucursal) {
//     const query = 'SELECT su.NOMBRE as Sucursal, C.CODIGO,  c.NOMBRE as Cliente, a.CENTRO, a.GRUPO, a.NOCONTRATO as Contrato, a.MONTOSOL as Credito, s.FECVTO as Vencimiento, sal.saldo, sal.sdocapital \n'
//         + "FROM FSOCR_SOLICITUDES a  join CCSDO_SALDOS s on a.NOCONTRATO=s.FACTURA and a.NOPAGOS=s.PLAZO \n"
//         + "join SUCUR_SUCURSALES su \n"
//         + "on a.NOSUCURSAL=su.CODIGO \n"
//         + "join CLIEN_CLIENTES c on \n"
//         + "c.CODIGO=a.CLIENTE \n"
//         + "inner join (select c.finnosucursal, c.fincentro, c.codigo, c.fingrupo, sol.montosol, sol.feccontrato, c.nombre as nomcli, f.factura, f.sdocapital, (f.sdocapital+f.sdointeres+ f.sdoivainteres+ f.sdomancta) as saldo \n"
//         + "from \n"
//         + "(select  m.cliente, m.factura, \n"
//         + "sum(case when co.CARGOABONO = 'A' then m.MNCAPITAL * (-1) else m.MNCAPITAL end) as sdocapital, \n"
//         + "sum(case when co.CARGOABONO = 'A' then m.mnmontointeres * (-1) else m.mnmontointeres end) as sdointeres, \n"
//         + "sum(case when co.CARGOABONO = 'A' then m.mnmontoivaint * (-1) else m.mnmontoivaint end) as sdoivainteres, \n"
//         + "sum(case when co.CARGOABONO = 'A' then (m.mnmontomanejocta + m.mnmontoivamancta) * (-1) else (m.mnmontomanejocta + m.mnmontoivamancta) end) as sdomancta, \n"
//         + "sum(case when co.CARGOABONO = 'A' then m.mnmontofongar * (-1) else m.mnmontofongar end) as fongar, \n"
//         + "sum(case when co.CARGOABONO = 'A' then m.mnimporte * (-1) else m.mnimporte end) as IMPORTE \n"
//         + "from CCMOV_MOVIMIENTOS m \n"
//         + "left outer join CCCON_CONCEPTOS co \n"
//         + "on(co.CODIGO = m.TIPO) \n"
//         + "where m.FECHA <= 20200930 and m.FACTURA <> 'FONGAR' \n"
//         + "group by m.CLIENTE, m.FACTURA \n"
//         + ")    f \n"
//         + "left outer join FSOCR_SOLICITUDES sol \n"
//         + "on(f.cliente = sol.CLIENTE and f.FACTURA = sol.NOCONTRATO) \n"
//         + "left outer join CLIEN_CLIENTES c \n"
//         + "on(f.cliente = c.CODIGO) \n"
//         + `left outer join SUCUR_SUCURSALES s  on(c.FINNOSUCURSAL = s.CODIGO)  left outer join FCENT_CENTROS ce on(c.FINCENTRO = ce.CENTRO and c.FINNOSUCURSAL = ce.NOSUCURSAL) where(f.importe < -0.01 or f.importe > 0.01)  And(c.finnosucursal = ${sucursal}) order by c.FINNOSUCURSAL, c.FINCENTRO, c.FINGRUPO, f.cliente ) sal on sal.codigo = c.CODIGO where a.STATUS = 2 and s.FECVTO >= 20200928 and s.FECVTO <= 20201009 \n`
//         + "order by su.NOMBRE, a.CENTRO, s.FECVTO"
//     return query;
// }



function edoResidencia(result, clienteInfo) {
    pool.get(function (err, db) {
        if (err) {
            return err;
        }
        // db.detach()
        const { ESTADO } = result[0]
        clienteInfo.general = result
        // estado de residencia
        return new Promise((resolve, reject) => {
            db.query(`select NOMBRE as edoResidencia from cntry_estrucpolitica where ESTADO=${ESTADO} AND MUNICIPIO=0 and POBLACION=0 AND COLONIA=0`, function (err, edo) {
                if (err) {
                    reject(err)
                }
                // console.log('Estado de residencia', edo[0])
                clienteInfo.edoResidencia = edo[0].EDORESIDENCIA.trim();
                // console.log(clienteInfo)
                db.detach();
                resolve(clienteInfo);
            })
        })
    })
}

function munResidencia(cliente, clienteInfo) {
    // var info;
    pool.get(async function (err, db) {
        if (err) {
            return err;
        }
        // db.detach();

        const { ESTADO, MUNICIPIO } = cliente.general[0]
        return new Promise((resolve, reject) => {
            db.query(`select NOMBRE as MunResidencia from cntry_estrucpolitica where ESTADO=${ESTADO} AND MUNICIPIO=${MUNICIPIO} AND POBLACION=0 and COLONIA=0`, function (err, mun) {
                if (err) {
                    reject(err)
                }
                console.log('municipio de residencia', mun);
                clienteInfo.munResidencia = mun[0].MUNRESIDENCIA;
                db.detach()
                resolve(clienteInfo)
            })


        })
    })
}


function pobResidencia(cliente, clienteInfo) {
    pool.get(function (err, db) {
        if (err) {
            return err;
        }
        // db.detach()
        const { ESTADO, MUNICIPIO, POBLACION } = cliente.general[0];
        return new Promise((resolve, reject) => {
            db.query(`select NOMBRE as PobResidencia from cntry_estrucpolitica where ESTADO=${ESTADO} AND MUNICIPIO=${MUNICIPIO} AND POBLACION=${POBLACION} and COLONIA=0`, function (err, pob) {
                if (err) {
                    reject(err)
                }
                console.log('Poblacion de residencia', pob)
                clienteInfo.pobResidencia = pob[0].POBRESIDENCIA;
                db.detach();
                resolve(clienteInfo)
            })
        })
    })
}

function ColResidencia(cliente, clienteInfo) {
    pool.get(function (err, db) {
        if (err) {
            return err;
        }
        // db.detach()
        const { ESTADO, MUNICIPIO, POBLACION, COLONIA } = cliente.general[0];
        return new Promise((resolve, reject) => {
            db.query(`select NOMBRE as ColResidencia from cntry_estrucpolitica where ESTADO=${ESTADO} AND MUNICIPIO =${MUNICIPIO} AND POBLACION =${POBLACION} and COLONIA=${COLONIA}`, function (err, col) {
                if (err) {
                    reject(err)
                }
                clienteInfo.ColResidencia = col[0].COLRESIDENCIA
                resolve(clienteInfo)
            })
        })
    })
}

function edoNacimiento(cliente, clienteInfo) {
    pool.get(function (err, db) {
        if (err) {
            return err;
        }
        const { NACESTADO } = cliente.general[0]
        return new Promise((resolve, reject) => {
            db.query(`select NOMBRE as EdoNacimiento from cntry_estrucpolitica where ESTADO=${NACESTADO}`, function (err, col) {
                if (err) {
                    reject(err)
                }
                clienteInfo.EdoNacimiento = col[0].EDONACIMIENTO
                resolve(clienteInfo)
            })
        })
    })
}

function familiar(cliente) {
    let info = {};
    try {
        pool.get(function (err, db) {
            if (err) {
                return err;
            }
            // const { CODIGO } = cliente.general[0];
            new Promise((resolve, reject) => {
                db.query(`select NOMBRE as CONTACTO from direc_directorio where EMPRESA =${cliente}`, function (err, contacto) {
                    if (err) {
                        reject(err)
                    }
                    console.log(contacto)
                    info.contacto = contacto[0]
                    resolve(info);
                })
            }).then((contacto) => {

                console.log(contacto)
                return contacto;

            })
        })
    } catch (error) {
        return error
    }
}


module.exports.edoResidencia = edoResidencia;
module.exports.munResidencia = munResidencia;
module.exports.ColResidencia = ColResidencia;
module.exports.pobResidencia = pobResidencia;
module.exports.edoNacimiento = edoNacimiento;
module.exports.familiar = familiar;