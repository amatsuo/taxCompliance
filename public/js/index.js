/**
 * # Index script for nodeGame
 * Copyright(c) 2015 J.Orellana,M.Lopez <jose.orellanan@usach.cl>
 * MIT Licensed
 *
 * http://nodegame.org
 * ---
 */
window.onload = function() {
    var node = parent.node;
    node.setup('nodegame', {
        verbosity: 100,
        debug : true,
        window : {
            promptOnleave : true
        },
        env : {
            auto : false,
            debug : false
        },
        events : {
            dumpEvents : true
        },
        socket : {
            type : 'SocketIo',
            reconnect : false
        }
    });

    // Connecting.
    if (location.search) {
        // Pass query arguments on.
        node.connect('/taxCompliance', { query: location.search.substr(1) });
    }
    else {
        node.connect('/taxCompliance');
    }
};
