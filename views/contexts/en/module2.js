module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Module2",
        Module: "Module 2",
        text1:"Usted dispone ",
        text2:" "+unidad+" para compartir con otra persona del ",
        text3:"¿Cuantos "+unidad+ " deseas compartir?",
        value: value,
        text4:" "+ unidad+".",
        proceed: "Compartir",
        error:"Ingrese un valor entre 0 y "+ value
    };
};/**
 * Created by joseorellana on 01-12-15.
 */
