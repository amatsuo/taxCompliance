module.exports = function(settings, headers) {

    var value=settings.CANTIDAD,unidad="ECUs";
    return {
        title: "Modulo1",
        Module: "Modulo 1",
        text1:"Usted dispone ",
        text2:" "+unidad+" para compartir con otra persona del ",
        text3:"¿Cuanto "+unidad+ +" deseas compartir?",
        value: value,
        text4:" "+ unidad+".",
        proceed: "Compartir"
    };
};

/**
 * Created by joseorellana on 24-11-15.
 */
