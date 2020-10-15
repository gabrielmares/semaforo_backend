var router = require('express').Router();
let pool = require('../firebird');
let { promesa } = require('../querys');


let query = {};
query.GENERALES = `select c.CODIGO, c.NOMBRE, c.ADNOMBRE as NOMBRES, c.ADAPEPAT as PATERNO, c.ADAPEMAT AS MATERNO, c.RFC, c.AGENTEVTAS, c.CURP, c.TELEFONO, c.DOMICILIO, c.CODPOS, c.CODIGO, c.ESTADO, c.MUNICIPIO, c.POBLACION,
c.COLONIA, c.NACESTADO, c.FINCENTRO, c.FINGRUPO, c.FINNOSUCURSAL, c.FECNAC, c.ACTIVIDAD, c.NOIFE, c.CODPRVCLI AS ACTIV from CLIEN_CLIENTES c where c.codigo=?`
query.EDORESIDENCIA = 'select NOMBRE as edoResidencia from cntry_estrucpolitica where ESTADO=? AND MUNICIPIO=0 and POBLACION=0 AND COLONIA=0';
query.MUNRESIDENCIA = 'select NOMBRE as MunResidencia from cntry_estrucpolitica where ESTADO=? AND MUNICIPIO=? AND POBLACION=0 and COLONIA=0';
query.COLRESIDENCIA = 'select NOMBRE as ColResidencia from cntry_estrucpolitica where ESTADO=? AND MUNICIPIO=? AND POBLACION=? and COLONIA=?';
query.POBRESIDENCIA = 'select NOMBRE as PobResidencia from cntry_estrucpolitica where ESTADO=? AND MUNICIPIO =? AND POBLACION =? and COLONIA=0';
query.NACESTADO = 'select NOMBRE as EdoNacimiento from cntry_estrucpolitica where ESTADO=? and municipio=0 and poblacion=0 and colonia=0';
query.FAMILIAR = 'select NOMBRE as CONTACTO from direc_directorio where EMPRESA =?';
query.ACTIVIDAD = 'select NOMBRE as ACTIVIDAD from CLIAC_ACTIVIDADES where CODIGO=?';
query.ULTIMOCREDITO = "select sol.MONTOSOL as Monto from CCMOV_MOVIMIENTOS mov join FSOCR_SOLICITUDES sol on sol.NOCONTRATO=mov.FACTURA where mov.CLIENTE=? and mov.TIPO=101 and mov.IMPORTE>20 order by mov.FECVTO desc rows 1"
query.ASESOR = 'select NOMBRE from direc_directorio where CODIGO=?'

router.get('/listas', (req, res) => {
    // const { filter } =
    const { sucursal, from, to, lastCredit } = req.query;
    console.log(req.query)
    // console.table(sucursal, from, to, lastCredit);
    if (!sucursal) return res.send(false)
    pool.get(function (err, db) {
        if (err) {
            throw err;
        }
        console.log('Iniciando query')
        // llamada a la bd, obtiene la lista de creditos a vencer en los futuros 15 dias
        try {
            db.query(`SELECT su.NOMBRE as Sucursal, C.CODIGO,  c.NOMBRE as Cliente, a.CENTRO, a.GRUPO, a.NOCONTRATO as Contrato, a.MONTOSOL as Credito, s.FECVTO as Vencimiento, sal.saldo, sal.sdocapital, sal.ultimo, ((a.MONTOSOL - sal.sdocapital)/(a.MONTOSOL))*100 as PorcPagado 
            FROM FSOCR_SOLICITUDES a  join CCSDO_SALDOS s on a.NOCONTRATO=s.FACTURA and a.NOPAGOS=s.PLAZO and a.STATUS=2 
            join SUCUR_SUCURSALES su
            on a.NOSUCURSAL=su.CODIGO 
            join CLIEN_CLIENTES c on 
            c.CODIGO=a.CLIENTE 
            inner join (select c.finnosucursal, c.fincentro, c.codigo, c.fingrupo, sol.solfecha, sol.montosol, sol.feccontrato, c.nombre as nomcli, f.factura, f.sdocapital, (f.sdocapital+f.sdointeres+ f.sdoivainteres+ f.sdomancta) as saldo, ult.ultimo 
            from 
            (select  m.cliente, m.factura, 
            sum(case when co.CARGOABONO = 'A' then m.MNCAPITAL * (-1) else m.MNCAPITAL end) as sdocapital, 
            sum(case when co.CARGOABONO = 'A' then m.mnmontointeres * (-1) else m.mnmontointeres end) as sdointeres,
            sum(case when co.CARGOABONO = 'A' then m.mnmontoivaint * (-1) else m.mnmontoivaint end) as sdoivainteres, 
            sum(case when co.CARGOABONO = 'A' then (m.mnmontomanejocta + m.mnmontoivamancta) * (-1) else (m.mnmontomanejocta + m.mnmontoivamancta) end) as sdomancta,
            sum(case when co.CARGOABONO = 'A' then m.mnmontofongar * (-1) else m.mnmontofongar end) as fongar, 
            sum(case when co.CARGOABONO = 'A' then m.mnimporte * (-1) else m.mnimporte end) as IMPORTE 
            from CCMOV_MOVIMIENTOS m 
            left outer join CCCON_CONCEPTOS co 
            on(co.CODIGO = m.TIPO) 
            join FSOCR_SOLICITUDES ant on (ant.NOCONTRATO=m.FACTURA and ant.SOLFECHA<${lastCredit})
            where m.fecha<=${to} and m.FACTURA <> 'FONGAR'  
            group by m.CLIENTE, m.FACTURA)    f 
            left outer join FSOCR_SOLICITUDES sol 
            on(f.cliente = sol.CLIENTE and f.FACTURA = sol.NOCONTRATO) 
            left outer join CLIEN_CLIENTES c 
            on(f.cliente = c.CODIGO) 
            left outer join SUCUR_SUCURSALES s  on(c.FINNOSUCURSAL = s.CODIGO) 
        left outer join FCENT_CENTROS ce on(c.FINCENTRO = ce.CENTRO and c.FINNOSUCURSAL = ce.NOSUCURSAL)
        join (select m.CLIENTE, m.FACTURA, max(m.FECHA) as ultimo from CCMOV_MOVIMIENTOS m where m.TIPO=101 group by m.CLIENTE, m.FACTURA) ult
        on (c.CODIGO=ult.cliente and f.factura=ult.factura) where(f.importe < -0.01 or f.importe > 0.01)  And ((c.finnosucursal =${sucursal}) and sol.SOLFECHA<${lastCredit})  
        order by c.FINNOSUCURSAL, c.FINCENTRO, c.FINGRUPO, f.cliente ) sal on (sal.codigo = c.CODIGO and sal.factura=a.nocontrato)
        where a.STATUS = 2 and s.FECVTO>=${from} and s.FECVTO <=${to} order by su.NOMBRE, a.CENTRO, s.FECVTO `, function (err, rows) {
                if (err) {
                    throw err;
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
})


router.get('/renovacion', async (req, res) => {
    const { CODIGO } = req.query;
    if (!CODIGO) return false;
    let cliente = {};
    try {
        cliente.generales = await promesa(query.GENERALES, [CODIGO]);// obtenemos los generales del cliente, pasando solo el codigo como parametro
        cliente.familiar = await promesa(query.FAMILIAR, [CODIGO]); // obtenemos el familiar del cliente de la BD
        const { MUNICIPIO, ESTADO, POBLACION, COLONIA, NACESTADO, ACTIVIDAD, AGENTEVTAS } = cliente.generales
        // el resto de valores no se pueden traer en un solo query con joins, se queda colgada la consulta entre joins
        cliente.edoResidencia = await promesa(query.EDORESIDENCIA, [ESTADO]);
        cliente.munResidencia = await promesa(query.MUNRESIDENCIA, [ESTADO, MUNICIPIO]);
        cliente.pobResidencia = await promesa(query.POBRESIDENCIA, [ESTADO, MUNICIPIO, POBLACION]);
        cliente.ColResidencia = await promesa(query.COLRESIDENCIA, [ESTADO, MUNICIPIO, POBLACION, COLONIA]);
        cliente.nacestado = await promesa(query.NACESTADO, [NACESTADO]);
        // ACTIVIDAD A LA QUE SE DEDICA EL CLIENTE
        cliente.actividad = await promesa(query.ACTIVIDAD, [ACTIVIDAD]);
        // ULTIMO CREDITO QUE SE LE ENTREGO AL CLIENTE
        cliente.credito = await promesa(query.ULTIMOCREDITO, [CODIGO]);
        cliente.vendedor = await promesa(query.ASESOR, [AGENTEVTAS]);

    } catch (error) {
        console.log(error)
        res.send(error)
    }
    // console.log('pidiendo info', cliente);
    res.send(cliente)
})

module.exports = router;

