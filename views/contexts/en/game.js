module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Module",
        Module: "Module ",
        correctAns: "Number of Correct Answers: ",
        num1: Math.floor(Math.random()*(99-10)+10),
        num2: Math.floor(Math.random()*(99-10)+10),
        linea:"__________",
        proceed: "Submit Answer",
        good: "Correct",
        bad:"Incorrect"
    };
};
/**
 * Created by joseorellana on 01-12-15.
 * Back translated by amatz on 15-02-16.
 */
