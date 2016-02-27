module.exports = function(settings, headers) {

    var timeTotal=settings.standard.TIMER_TOTAL;
    return {
        title: "Instructions",
        instructions: "Instructions",
        thisGame: "This game is played in rounds by human players randomly paired.",
        InstroModules: 'This experiment consists of 5 modules. We hope you participate until the end of this session, which will take about '+ timeTotal +' minutes.',
        finalLine: "You will receive instructions for each module at the beginning of the module.",
        ifYouUnderstood: "If you understand the instruction please click \"Proceed\".",
        proceed: "Proceed"
    };
};
