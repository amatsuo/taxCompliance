module.exports = function(settings, headers) {

    var timeTotal=settings.standard.TIMER_TOTAL;
    return {
        title: "Instructions",
        instructions: "Instructions",
        thisGame: "This game is played in rounds by human players randomly paired.",
        InstroModules: 'This experiment consists of 5 modules. We hope you participate until the end of this session, which will take about '+ timeTotal +' minutes.',
        finalLine: "You will receive instructions for each module at the beginning of the module.",
        important: "Important. Even if one of the players disconnects the game will proceed without delay.",
        inSuchACase: "In such a case, disconnected players will not be paid for the round which they did not participate.", 
        toGetPaid: "In order to get approval for this assginment, you need to participate at least a half of the experiment. If technical difficulties prevent you from participating some part of the experiment, please contact us.",
        ifYouUnderstood: "If you understand the instruction please click \"Proceed\".",
        proceed: "Proceed"
    };
};
