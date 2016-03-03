module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Modulo",
        Module: "Modulo ",
        correctAns: "Number of Correct Answers: ",        
        num1: Math.floor(Math.random()*(99-10)+10),
        num2: Math.floor(Math.random()*(99-10)+10),
        linea:"__________",
        proceed: "Resolver",
        good: "Correcto",
        bad:"Incorrecto"
    };
};
/**
 * Created by joseorellana on 01-12-15.
 */
