module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,
        unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Modulo4",
        Module: "Questions",
        qtext: "please consider the following and indicate if you think they are justified or not.",
        a:" Avoiding paying the fare on public transport:",
        b:" Cheating on taxes if you have a chance:",
        c:" Driving faster than the speed limit:",
        d:" Keeping money you found in the street:",
        e:" Lying in your own interests:",
        f:" Not reporting accidental damage you have done to a parked car:",
        g:" Throwing away litter in a public place:",
        h:" Driving under the influence of alcohol:",
        i:" Making up a job application:",
        j:" Buying something you know is stolen:",
        opcion1:"Never justified",
        opcion2:"Rarely justified",
        opcion3:"Sometimes justified",
        opcion4:"Always justified",
        proceed:"Continue",
        error:"Please answer all questions before proceeding.",
        errorClose: "Close",
    };
};
/**
 * Created by joseorellana on 04-02-16.
 */
