module.exports = function(settings, headers) {


    var timeTotal=settings.standard.TIMER_TOTAL;
    return {
        title: "Instruciones",
        instructions: "Versión en español",
        thisGame: "El propósito de este experimento es estudiar cómo toman los individuos decisiones en determinados contextos. Podrán preguntarnos en cualquier momento las dudas que tengan, levantando primero la mano. Fuera de esas preguntas, cualquier tipo de comunicación entre ustedes está prohibida y sujeta a la exclusión inmediata del experimento. ",
        InstroModules: 'Este experimento consta de 5 módulos. Esperamos que participes hasta el final de esta sesión, que durará aproximadamente '+timeTotal+' minutos.',
        finalLine: "Recibirás las instrucciones de cada módulo al principio de cada uno de ellos.",
        important: "Important. If one of the players disconnects for more than 60 seconds the game will be terminated.",
        inSuchACase: "In such a case the player who disconnected will not be paid at all, and the remaining ones will be paid only the show up fee.",
        ifYouUnderstood: "Si haz entendido las instruciones haz click en Siguiente ",
        proceed: "Siguiente"
    };
};
