module.exports = function(settings, headers) {

    var timeTotal=settings.standard.TIMER_TOTAL;
    return {
        title: "Instrucctions",
        instructions: "English version",
        thisGame: "This game is played in rounds by two human players randomly paired.",
        InstroModules: 'Este experimento consta de 5 módulos. Esperamos que participes hasta el final de esta sesión, que durará aproximadamente '+timeTotal+' minutos.',
        finalLine: "Recibirás las instrucciones de cada módulo al principio de cada uno de ellos.",
        ifYouUnderstood: "Si haz entendido las instruciones haz click en siguiente ",
        proceed: "Siguiente"
    };
};
