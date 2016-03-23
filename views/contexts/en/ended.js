module.exports = function(settings, headers) {
    var gameName = settings.standard.GAMENAME;
    return {
        "title": "ENDED",
        "thankYou": "THANK YOU FOR PLAYING",
        "pleaseGo": "Please go back to the Amazon Mechanical Turk website and submit the hit with the exit code below.",
        "weUsually": "We usually approve the HIT within 24 hours. The bonus payment will be processed later. For any problem, please contact us at matsuoakcrowd@gmail.com with following information:",
        "yourTurker": "your Mechanical Turk Worker ID",
        "theHIT": "the HIT name: " + gameName,
        "yourExitCode": "your exit code, as written below",
        "yourBrowser": "your browser name and version",
        "notice": "" // Notice: you do not need the exit code to submit the HIT, but only in case of trouble with the payment."
    };
};
