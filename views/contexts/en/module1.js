module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Module1",
        Module: "Module 1",
        text1:"You have the endowment of ",
        text2:" "+unidad+" to share with another person ",
        text2b: "group B",
        text3:" How many unit of "+unidad+ " do you want to share?",
        value: value,
        text4:" "+ unidad+".",
        proceed: "Submit",
        error:"Enter a value between 0 and "+ value,
        errorClose: "Close",
    };
};

/**
 * Created by joseorellana on 24-11-15.
 * Back translated by amatz on 15-02-16.
 */
