module.exports = function(settings, headers) {
    var gameName = settings.standard.GAMENAME;
    return {
        "title": "ENDED",
        "thankYou": "THANK YOU FOR PLAYING",
        "pleaseGo": "Please go back to the Amazon Mechanical Turk web site and submit the hit.",
        "weUsually": "We usually pay within 24 hours. For any problem, please contact us at matsuoakcrowd@gmail.com with following information:",
        "yourTurker": "your Mechanical Turk Worker ID",
        "theHIT": "the HIT name: " + gameName,
        "yourExitCode": "your exit code, as written below",
        "yourBrowser": "your browser name and version",
        "notice": "" // Notice: you do not need the exit code to submit the HIT, but only in case of trouble with the payment."
    };
};
