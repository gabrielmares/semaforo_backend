let cron = require('cron').CronJob;
let job = require('node-schedule');
let { Inputdate } = require('../helpers/fechas');
const { requestsToRenovate } = require('../models');
// const firebirdPool = require('../firebird');
const { promesa } = require('../querys');
const { Op } = require('sequelize')

let find = `SELECT su.NOMBRE as Sucursal, c.FINNOSUCURSAL, C.CODIGO,  c.NOMBRE, a.CENTRO, a.GRUPO, a.NOCONTRATO as Contrato, a.MONTOSOL as Credito, s.FECVTO as Vencimiento, sal.saldo, sal.sdocapital, sal.ultimo, ((a.MONTOSOL - sal.sdocapital)/(a.MONTOSOL))*100 as PorcPagado
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
join FSOCR_SOLICITUDES ant on (ant.NOCONTRATO=m.FACTURA ) 
where m.FECHA<=20201001 and m.FACTURA <> 'FONGAR' -- and m.cliente=201910368
group by m.CLIENTE, m.FACTURA)    f
left outer join FSOCR_SOLICITUDES sol
on(f.cliente = sol.CLIENTE and f.FACTURA = sol.NOCONTRATO)
left outer join CLIEN_CLIENTES c
on(f.cliente = c.CODIGO)
left outer join SUCUR_SUCURSALES s on(c.FINNOSUCURSAL = s.CODIGO)
left outer join FCENT_CENTROS ce on(c.FINCENTRO = ce.CENTRO and c.FINNOSUCURSAL = ce.NOSUCURSAL)
join (select m.CLIENTE, m.FACTURA, max(m.FECHA) as ultimo from CCMOV_MOVIMIENTOS m where m.TIPO=101 group by m.CLIENTE, m.FACTURA) ult
on (c.CODIGO=ult.cliente and f.factura=ult.factura) where(f.importe < -0.01 or f.importe > 0.01)
order by c.FINNOSUCURSAL, c.FINCENTRO, c.FINGRUPO, f.cliente ) sal on (sal.codigo = c.CODIGO and sal.factura=a.nocontrato)
where a.STATUS = 2 and s.FECVTO <=20201001 order by su.NOMBRE, a.CENTRO, s.FECVTO`;

const q = 'select CODIGO from clien_clientes rows 1 '

async function merge(requestsToRenovate, row) {

    await requestsToRenovate
        .findAll({
            where: {
                CONTRATO: {
                    [Op.eq]: row.CONTRATO
                }
            }
        })
        .then(async (exist) => {
            if (exist[0]) {
                if (parseInt(row.SALDO) === parseInt(exist[0].dataValues.SALDO)) {
                    console.log('nada que modificar en el contrato ', row.CONTRATO);
                    return false;
                }
                console.log('actualizando contrato', row.CONTRATO)
                return await requestsToRenovate.update({
                    PorPagado: parseInt(row.PORCPAGADO),
                    SALDO: parseFloat(row.SALDO).toFixed(3),
                    SDOCAPITAL: parseFloat(row.SDOCAPITAL).toFixed(3),
                    VENCIMIENTO: Inputdate(row.VENCIMIENTO),
                    ULTIMO: Inputdate(row.ULTIMO)
                }, {
                    where: {
                        contrato: row.CONTRATO
                    }
                })
            }
            console.log('creando registro en mysql', row.CONTRATO)
            return await requestsToRenovate.create({
                ...row,
                PORPAGADO: parseFloat(row.PORCPAGADO),
                SALDO: parseFloat(row.SALDO),
                SDOCAPITAL: parseFloat(row.SDOCAPITAL).toFixed(3),
                VENCIMIENTO: Inputdate(row.VENCIMIENTO),
                ULTIMO: Inputdate(row.ULTIMO)
            });
        })
}


// CRON JOB PARA ACTUALIZAR INFORMACION EN LA BD DE MYSQL CON LA INFORMACION DE FIREBIRD
let update = job.scheduleJob({ hour: 09, minute: 11 },
    async () => {
        let queryFB = await promesa(find);
        let rowToMysql = queryFB.map(row => {
            return merge(requestsToRenovate, row)
        })
    }
);

module.exports = update;
