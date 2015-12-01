module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Modulo2",
        Module: "Modulo 2",
        text1:"Usted dispone ",
        text2:" "+unidad+" para compartir con otra persona del ",
        text3:"¿Cuantos "+unidad+ " deseas compartir?",
        value: value,
        text4:" "+ unidad+".",
        proceed: "Compartir"
    };
};
/**
 * Created by joseorellana on 01-12-15.
 */
