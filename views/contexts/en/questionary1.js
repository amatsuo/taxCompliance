module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Modulo4",
        Module: "Module 4",
        valorA1:"% $" + settings.standard.RISK_SAFE_HIGH + ",",
        valorA2:"% $" + settings.standard.RISK_SAFE_LOW + ".",
        valorB1:"% $" + settings.standard.RISK_GABL_HIGH + ",",
        valorB2:"% $" + settings.standard.RISK_GABL_LOW + ".",
        proceed:"Next",
        error:"Please answer all questions before proceeding.",
        errorClose: "Close",

    };
};
/**
 * Created by joseorellana on 27-01-16.
 * Back translated by amatz on 15-02-16.
 */
