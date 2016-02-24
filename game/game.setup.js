/**
 * # Game setup
 * Copyright(c) 2015 J.Orellana,M.Lopez <jose.orellanan@usach.cl>
 * MIT Licensed
 *
 * The file includes settings for the nodeGame client instance
 *
 * This settings are then used to call `node.setup('nodegame')` and its
 * remote version.
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(settings, stages) {

    var setup = {};

    //auto: true = automatic run, auto: false = user input
    setup.env = {
        auto: false
    };

    setup.debug = true;

    setup.verbosity = 1;

    setup.window = {
        promptOnleave: !setup.debug
    }
    
    setup.window.promptOnLeave = false;
    setup.window.disableRightClick = false;

    // Metadata. Taken from package.json. Can be overwritten.
    // setup.metadata = {
    //    name: 'another name',
    //    version: 'another version',
    //    description: 'another descr'
    // };

    return setup;
};
