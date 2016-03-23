module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Modulo4",
        Module: "Modulo 4",
        instText: "Please choose Option A or Option B in each of 10 pairs",
        valorA1:"$" + settings.standard.RISK_SAFE_HIGH,
        valorA2:"$" + settings.standard.RISK_SAFE_LOW,
        valorB1:"$" + settings.standard.RISK_GABL_HIGH,
        valorB2:"$" + settings.standard.RISK_GABL_LOW,
        proceed:"Continuar",
        error:"Debe responder todas las preguntas antes de continuar.",
        errorClose: "Cerrar",
    };
};
/**
 * Created by joseorellana on 27-01-16.
 */
