const { promesa } = require('../../querys');

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


const invoice = async (req, res) => {
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
        return res.send(cliente)
    } catch (error) {
        res.send(error)
    }

}

module.exports = invoice;