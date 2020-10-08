/*FUNCION QUE TOMA LA FECHA PROVENIENTE DE NACIMIENTO DE LA BASE DE DATOS Y LA FORMATEA "DD/MM/AAAA" PARA LA VISTA DE LA TABLA INGRESOS */
function ParseDate(fecnac) {
    let arr = new String(fecnac);
    arr = Array.from(arr);
    let yearI = arr.slice(0, 4);
    let MonthI = arr.slice(4, 6);
    let dayI = arr.slice(6, 8);
    // return FecNacioParse;
    return (dayI.join("") + "/" + MonthI.join("") + "/" + yearI.join(""))

}

module.exports.ParseDate = ParseDate;