module.exports = function(settings, headers) {

    var timeTotal=settings.standard.TIMER_TOTAL;
    return {
        title: "Instructions",
        instructions: "Instructions",
        thisGame: "This game is played in rounds by human players randomly paired.",
        InstroModules: 'This experiment consists of 5 modules. We hope you participate until the end of this session, which will take about '+ timeTotal +' minutes.',
        finalLine: "You will receive instructions for each module at the beginning of the module.",
        important: "Important. If one of the players disconnects for more than 60 seconds the game will be terminated.",
        inSuchACase: "In such a case the player who disconnected will not be paid at all, and the remaining ones will be paid only the show up fee.", 
        ifYouUnderstood: "If you understand the instruction please click \"Proceed\".",
        proceed: "Proceed"
    };
};
