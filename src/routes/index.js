var router = require('express').Router();
let pool = require('../firebird');
let { promesa } = require('../querys');


let query = {};
query.GENERALES = `select c.CODIGO, c.NOMBRE, c.ADNOMBRE as NOMBRES, c.ADAPEPAT as PATERNO, c.ADAPEMAT AS MATERNO, c.RFC, c.CURP, c.TELEFONO, c.DOMICILIO, c.CODPOS, c.CODIGO, c.ESTADO, c.MUNICIPIO, c.POBLACION,
c.COLONIA, c.NACESTADO, c.FINCENTRO, c.FINGRUPO, c.FINNOSUCURSAL, c.FECNAC, c.ACTIVIDAD, c.NOIFE, c.CODPRVCLI AS ACTIV from CLIEN_CLIENTES c where c.codigo=?`
query.EDORESIDENCIA = 'select NOMBRE as edoResidencia from cntry_estrucpolitica where ESTADO=? AND MUNICIPIO=0 and POBLACION=0 AND COLONIA=0';
query.MUNRESIDENCIA = 'select NOMBRE as MunResidencia from cntry_estrucpolitica where ESTADO=? AND MUNICIPIO=? AND POBLACION=0 and COLONIA=0';
query.COLRESIDENCIA = 'select NOMBRE as PobResidencia from cntry_estrucpolitica where ESTADO=? AND MUNICIPIO=? AND POBLACION=? and COLONIA=?';
query.POBRESIDENCIA = 'select NOMBRE as ColResidencia from cntry_estrucpolitica where ESTADO=? AND MUNICIPIO =? AND POBLACION =? and COLONIA=0';
query.NACESTADO = 'select NOMBRE as EdoNacimiento from cntry_estrucpolitica where ESTADO=? and municipio=0 and poblacion=0 and colonia=0';
query.FAMILIAR = 'select NOMBRE as CONTACTO from direc_directorio where EMPRESA =?';
query.ACTIVIDAD = 'select NOMBRE as ACTIVIDAD from CLIAC_ACTIVIDADES where CODIGO=?';
query.ULTIMOCREDITO = "select mov.FACTURA as Contrato from CCMOV_MOVIMIENTOS mov where mov.CLIENTE=432 and mov.TIPO=101 and mov.IMPORTE>20 order by mov.FECVTO desc rows 1"


router.get('/listas', (req, res) => {
    const { sucursal } = req.query;
    console.log(sucursal);
    if (!sucursal) return res.send(false)
    pool.get(function (err, db) {
        if (err) {
            throw err;
        }
        console.log('Iniciando query')
        // llamada a la bd, obtiene la lista de creditos a vencer en los futuros 15 dias
        try {
            db.query('SELECT su.NOMBRE as Sucursal, C.CODIGO,  c.NOMBRE as Cliente, a.CENTRO, a.GRUPO, a.NOCONTRATO as Contrato, a.MONTOSOL as Credito, s.FECVTO as Vencimiento, sal.saldo, sal.sdocapital, sal.ultimo, ((a.MONTOSOL - sal.sdocapital)/(a.MONTOSOL))*100 as PorcPagado \n'
                + "FROM FSOCR_SOLICITUDES a  join CCSDO_SALDOS s on a.NOCONTRATO=s.FACTURA and a.NOPAGOS=s.PLAZO and a.STATUS=2 \n"
                + "join SUCUR_SUCURSALES su \n"
                + "on a.NOSUCURSAL=su.CODIGO \n"
                + "join CLIEN_CLIENTES c on \n"
                + "c.CODIGO=a.CLIENTE \n"
                + "inner join (select c.finnosucursal, c.fincentro, c.codigo, c.fingrupo, sol.montosol, sol.feccontrato, c.nombre as nomcli, f.factura, f.sdocapital, (f.sdocapital+f.sdointeres+ f.sdoivainteres+ f.sdomancta) as saldo, ult.ultimo \n"
                + "from \n"
                + "(select  m.cliente, m.factura, \n"
                + "sum(case when co.CARGOABONO = 'A' then m.MNCAPITAL * (-1) else m.MNCAPITAL end) as sdocapital, \n"
                + "sum(case when co.CARGOABONO = 'A' then m.mnmontointeres * (-1) else m.mnmontointeres end) as sdointeres, \n"
                + "sum(case when co.CARGOABONO = 'A' then m.mnmontoivaint * (-1) else m.mnmontoivaint end) as sdoivainteres, \n"
                + "sum(case when co.CARGOABONO = 'A' then (m.mnmontomanejocta + m.mnmontoivamancta) * (-1) else (m.mnmontomanejocta + m.mnmontoivamancta) end) as sdomancta, \n"
                + "sum(case when co.CARGOABONO = 'A' then m.mnmontofongar * (-1) else m.mnmontofongar end) as fongar, \n"
                + "sum(case when co.CARGOABONO = 'A' then m.mnimporte * (-1) else m.mnimporte end) as IMPORTE \n"
                + "from CCMOV_MOVIMIENTOS m \n"
                + "left outer join CCCON_CONCEPTOS co \n"
                + "on(co.CODIGO = m.TIPO) \n"
                + "join FSOCR_SOLICITUDES ant on (ant.NOCONTRATO=m.FACTURA and ant.SOLFECHA<20200730)" //FECHAS A FIJAR CUANDO ENVIE EL QUERY
                + "where m.fecha<=20201010 and m.FACTURA <> 'FONGAR' \n" //FECHA A DEFINIR DURANTE LA CONSULTA
                + "group by m.CLIENTE, m.FACTURA \n"
                + ")    f \n"
                + "left outer join FSOCR_SOLICITUDES sol \n"
                + "on(f.cliente = sol.CLIENTE and f.FACTURA = sol.NOCONTRATO) \n"
                + "left outer join CLIEN_CLIENTES c \n"
                + "on(f.cliente = c.CODIGO) \n"
                + `left outer join SUCUR_SUCURSALES s  on(c.FINNOSUCURSAL = s.CODIGO) 
            left outer join FCENT_CENTROS ce on(c.FINCENTRO = ce.CENTRO and c.FINNOSUCURSAL = ce.NOSUCURSAL)
            join (select m.CLIENTE, m.FACTURA, max(m.FECHA) as ultimo from CCMOV_MOVIMIENTOS m where m.TIPO=101 group by m.CLIENTE, m.FACTURA) ult
            on (c.CODIGO=ult.cliente and f.factura=ult.factura) where(f.importe < -0.01 or f.importe > 0.01)  And ((c.finnosucursal = ${sucursal}) and sol.SOLFECHA<20200730)` //FECHA A ENVIAR EN EL QUERY
                + `order by c.FINNOSUCURSAL, c.FINCENTRO, c.FINGRUPO, f.cliente ) sal on (sal.codigo = c.CODIGO and sal.factura=a.nocontrato)
            where a.STATUS = 2 and s.FECVTO >= 20201009 and s.FECVTO <= 20201010 and (((a.MONTOSOL - sal.sdocapital)/(a.MONTOSOL))*100 >80) \n` //RANGO DE FECHAS DE BUSQUEDA
                + "order by su.NOMBRE, a.CENTRO, s.FECVTO", function (err, rows) {
                    if (err) {
                        return err;
                    }
                    db.detach();
                    console.log('retornando query al cliente')
                    console.table(rows)
                    return res.send(rows)
                })
        } catch (error) {
            console.log(error)
            return res.send(error)
        }
    })
    // return res.send(sucursal)
})


router.get('/renovacion', (req, res) => {
    const { CODIGO } = req.query;
    var clienteInfo = {};
    if (!CODIGO) return res.send(false);
    try {
        pool.get(async function (err, db) {
            if (err) {
                throw err;
            }
            console.log('Leyendo datos para la solicitud del cliente, ', CODIGO)
            // obtener usuario y datos generales para llenar el formato de la solicitud
            new Promise((resolve, reject) => {
                db.query(`select c.CODIGO, c.NOMBRE, c.ADNOMBRE as NOMBRES, c.ADAPEPAT as PATERNO, c.ADAPEMAT AS MATERNO, c.RFC, c.CURP, c.TELEFONO, c.DOMICILIO, c.CODPOS, c.CODIGO, c.ESTADO, c.MUNICIPIO, c.POBLACION,
                c.COLONIA, c.NACESTADO, c.FINCENTRO, c.FINGRUPO, c.FINNOSUCURSAL, c.FECNAC, c.ACTIVIDAD, c.NOIFE, c.CODPRVCLI AS ACTIV
                from CLIEN_CLIENTES c where c.codigo=${CODIGO}`, function (err, cliente) {
                    if (err) reject(err);
                    resolve(cliente)
                })
                // en cada promesa llamaremos a una nueva consulta a la BD para obtener los datos que no vienen en el JOIN
            }).then(async (result) => {
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
            }).then(async (cliente) => {
                // RECUPERANDO EL MUNICIPIO DE RESIDENCIA
                // console.log("cliente", cliente.general[0])
                const { ESTADO, MUNICIPIO } = cliente.general[0]
                return new Promise((resolve, reject) => {
                    db.query(`select NOMBRE as MunResidencia from cntry_estrucpolitica where ESTADO=${ESTADO} AND MUNICIPIO=${MUNICIPIO} AND POBLACION=0 and COLONIA=0`, function (err, mun) {
                        if (err) {
                            reject(err)
                        }
                        clienteInfo.munResidencia = mun[0].MUNRESIDENCIA;
                        db.detach()
                        resolve(clienteInfo)
                    })
                }).then(async (cliente) => {
                    // RECUPERANDO EL POBLADO DE RESIDENCIA
                    // console.log("poblado", cliente.general[0].CODIGO)
                    const { ESTADO, MUNICIPIO, POBLACION } = cliente.general[0];
                    return new Promise((resolve, reject) => {
                        db.query(`select NOMBRE as PobResidencia from cntry_estrucpolitica where ESTADO=${ESTADO} AND MUNICIPIO=${MUNICIPIO} AND POBLACION=${POBLACION} and COLONIA=0`, function (err, pob) {
                            if (err) {
                                reject(err)
                            }
                            clienteInfo.pobResidencia = pob[0].POBRESIDENCIA;
                            db.detach();
                            resolve(clienteInfo)
                        })
                    })
                }).then(async (cliente) => {
                    // console.log("cliente", cliente.general[0]) RECUPERANDO LA COLONIA DE RESIDENCIA
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
                }).then((cliente) => {
                    // ESTADO DE NACIMIENTO DEL CLIENTE
                    const { NACESTADO } = cliente.general[0]
                    return new Promise((resolve, reject) => {
                        db.query(`select NOMBRE as EdoNacimiento from cntry_estrucpolitica where ESTADO=${NACESTADO} and municipio=0 and poblacion=0 and colonia=0`, function (err, col) {
                            if (err) {
                                reject(err)
                            }
                            clienteInfo.EdoNacimiento = col[0].EDONACIMIENTO
                            resolve(clienteInfo)
                        })
                    })

                }).then((cliente) => {
                    // CONTACTO DEL CLIENTE, FAMILIAR BENEFICIARIO DE AYUDA POR DEFUNCION
                    const { CODIGO } = cliente.general[0];
                    return new Promise((resolve, reject) => {
                        db.query(`select NOMBRE as CONTACTO from direc_directorio where EMPRESA =${CODIGO}`, function (err, contacto) {
                            if (err) {
                                reject(err)
                            }
                            clienteInfo.ContactoCliente = contacto[0].CONTACTO
                            resolve(clienteInfo);
                        })
                    })

                }).then((cliente) => {
                    // CONTACTO DEL CLIENTE, FAMILIAR BENEFICIARIO DE AYUDA POR DEFUNCION
                    const { ACTIVIDAD } = cliente.general[0];
                    return new Promise((resolve, reject) => {
                        db.query(`select NOMBRE as ACTIVIDAD from CLIAC_ACTIVIDADES where CODIGO =${ACTIVIDAD}`, function (err, contacto) {
                            if (err) {
                                reject(err)
                            }
                            clienteInfo.DESTINOCREDITO = contacto[0].ACTIVIDAD
                            resolve(clienteInfo);
                        })
                    })

                }).then((cliente) => {
                    const { CODIGO } = cliente.general[0];
                    return new Promise((resolve, reject) => {
                        db.query(`select mov.FACTURA, mov.FECHA from CCMOV_MOVIMIENTOS mov where mov.CLIENTE=${CODIGO} and mov.FACTURA<>'FONGAR' order by mov.FECHA desc rows 1`, function (err, contacto) {
                            if (err) {
                                reject(err)
                            }
                            console.log(contacto[0].FACTURA)
                            clienteInfo.ULTIMOCREDITO = contacto[0].FACTURA
                            resolve(clienteInfo);
                        })
                    })

                })
                    .then((reporte) => {
                        return res.send(reporte)
                    }).catch((e) => {
                        console.log(e)
                        res.send(e)
                    })
            })
        })
    } catch (error) {
        console.log(error)
        return res.send(error)
    }
})

router.get('/basic', async (req, res) => {
    const { CODIGO } = req.query;
    let cliente = {};
    try {
        cliente.generales = await promesa(query.GENERALES, [CODIGO]);// obtenemos los generales del cliente, pasando solo el codigo como parametro
        cliente.familiar = await promesa(query.FAMILIAR, [CODIGO]); // obtenemos el familiar del cliente de la BD
        const { municipio, estado, colonia, poblacion, nacestado, actividad } = cliente.generales 
        // el resto de valores no se pueden traer en un solo query con joins, se queda colgada la consulta entre joins
        cliente.edoResidencia = await promesa(query.EDORESIDENCIA, [estado]); 
        cliente.munResidencia = await promesa(query.MUNRESIDENCIA, [estado, municipio]);
        cliente.pobResidencia = await promesa(query.POBRESIDENCIA, [estado, municipio, poblacion]);
        cliente.ColResidencia = await promesa(query.COLRESIDENCIA, [estado, municipio, poblacion, colonia]);
        cliente.nacestado = await promesa(query.NACESTADO, [nacestado]);
        // ACTIVIDAD A LA QUE SE DEDICA EL CLIENTE
        cliente.actividad = await promesa(query.ACTIVIDAD, [actividad]);
        // ULTIMO CREDITO QUE SE LE ENTREGO AL CLIENTE
        cliente.credito = await promesa(query.ULTIMOCREDITO, [CODIGO]);

    } catch (error) {
        console.log(error)
        res.send(error)
    }
    console.log('pidiendo info', cliente);
    res.send(cliente)
})

module.exports = router;

