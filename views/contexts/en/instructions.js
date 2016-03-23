module.exports = function(settings, headers) {
    var util = require('util');
    
    var timeTotal=settings.standard.TIMER_TOTAL;
    var nmodule = settings.standard.NMODULE,
        //nmodule = util.inspect(myObject, {showHidden: false, depth: null}),
        unit = settings.standard.UNIDAD_ESTANDAR, 
        cantidadESUxPCH = settings.standard.CANTIDAD_ESU_x_PCH,
        cantidadPCH = settings.standard.CANTIDAD_DE_PCH;
    return {
        title: "Instructions",
        instructions: "Instructions",
        thisGame: "This game is played in rounds by human players randomly paired.",
        InstroModules: 'This experiment consists of ' +nmodule + ' modules. We hope you participate until the end of this session, which will take about '+ timeTotal +' minutes.',
        thisGame2: 'In Module 1 and 2, you will earn your reward in Experimental Currency Units (ECUs). The exchange rate is: '+cantidadESUxPCH +' ' + unit + ' = $ '+cantidadPCH+'.00',
        finalLine: "You will receive instructions for each module at the beginning of the module.",
        important: "Important: In case that one of the players is disconnected, the game will proceed without the disconnect player. ",
        inSuchACase: "The disconnected players are allowed to reconnect in the later stage, but will not be paid for any rounds in which they did not participate. ", 
        toGetPaid: "In order to get approval for this HIT, you need to participate at least a half of the experiment. If technical difficulties prevent you from participating some part of the experiment, please contact us.",
        ifYouUnderstood: "If you understand the instructions please click \"Proceed\".",
        proceed: "Proceed"
    };
};
