export default {
    fechaFormato(miliseconds) {
        if (miliseconds) {
            /*
            const fecha = new Date(miliseconds);
            // fecha.setMilliseconds(miliseconds);
            // se agrega el 0 al mes  para que la fecha tenga un formato parejo de 2 digitos
            let mes = "";
            if ((fecha.getMonth() + 1) < 10) {
                mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
            } else {
                mes = fecha.getMonth() + 1;
            }
            // se agrega el 0 al dia para que la fecha tenga un formato parejo de 2 digitos
            let dia = '';
            if ( fecha.getDate() < 10){
                dia = (fecha.getDate()).toString().padStart(2, "0");
            } else {
                dia = fecha.getDate();
            }

            return dia + "/" + mes + "/" + fecha.getFullYear();*/
            const date = new Date(miliseconds);
            var fecha = date.toLocaleDateString('en-GB');
            //console.log(fecha);
            return fecha
        }
    }
}
/***
 * const fecha = new Date();
    fecha.setMilliseconds = 1617074071422 * 1000;
 */
//