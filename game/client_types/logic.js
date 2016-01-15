/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2015 J.Orellana,M.Lopez <jose.orellanan@usach.cl>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var stepRules = ngc.stepRules;
var constants = ngc.constants;
var counter = 0;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    // Increment counter.
    counter = counter ? ++counter : settings.SESSION_ID || 1;

    stager.setOnInit(function() {

        // Initialize the client.

    });
    /*stager.extendStep('precache', {
        cb: function() {
            console.log('precache.');
        }
    });*/

    
   /* stager.extendStage('looped', {
        init: function() {
            // node.game.loopFinished = false;

            node.on('in.set.DATA', function(msg) {
                var done;
                console.log(msg.data);
                if (msg.data.loopFinished) {
                    done = true;
                    node.game.pl.each(function(p) {
                        if (p.id === msg.from) {
                            p.loopFinished = true;
                        }
                        if (!p.loopFinished) done = false;
                    });
                    if (done) {
                        node.game.loopFinished = true;
                        node.done();
                    }
                }
            });
        }
    });

//     stager.extendStep('looped', {
//         cb: function() {
//             console.log('Looped ', node.player.stage.round);
//             node.events.printAll('stage');
//         }
//     });
    stager.extendStep('loo1', {
         cb: function() {
             var stage;
             stage = node.player.stage;
             console.log('Loo1 ', node.player.stage.round);
             node.events.printAll('stage');
             
             // Trick engine.
             node.game.setCurrentGameStage({
                  stage: stage.stage,
                  step: stage.step + 1,
                  round: stage.round
              }, 'S');
             debugger
         },
         stepRule: stepRules.SOLO,
         // syncStepping: false
     });
 
     stager.extendStep('loo2', {
         cb: function() {
             console.log('Loo2 ', node.player.stage.round);
             node.events.printAll('stage');
         },
         stepRule: stepRules.SOLO
     });*/

    stager.extendStep('selectLanguage', {
        cb: function() {
            console.log('selectLanguage.');
        },
        //syncStepping: false
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });
    stager.extendStep('instructionsModule1', {
        cb: function() {
            console.log('Instructions Module 1.');
        }
    });
    stager.extendStep('module1', {
        cb: function() {
            console.log('Start Module 1');
        }
    });
    stager.extendStep('instructionsModule2', {
        cb: function() {
            console.log('instructionsModule2');
        }
    });
    stager.extendStep('instructionsModule3', {
        cb: function() {
            console.log('instructionsModule3');
        }
    });
    stager.extendStep('instructionsModule4', {
        cb: function() {
            console.log('instructionsModule4');
        }
    });
    /*stager.extendStep('module2', {
        cb: function() {
            console.log('Start Module 2');
        }
    });*/
    stager.extendStage('game', {
        init: function() {
            node.game.loopFinished = false;
            node.game.nConectP=0;
            var orden=true;
            node.game.pl.each(function(p) {

                if(orden){
                    node.say('Group K!', p.id);
                    orden=false;
                }else{
                    node.say('Group G!', p.id);
                    orden=true;
                }



            });

            node.on('in.set.DATA', function(msg) {
                var done;
                console.log(msg.data);
                if (msg.data.loopFinished) {
                    done = true;
                    node.game.pl.each(function(p) {
                        if (p.id === msg.from) {
                            p.loopFinished = true;
                        }
                        if (!p.loopFinished) done = false;
                    });
                    if (done) {
                        node.game.loopFinished = true;
                        node.done();
                    }
                }
            });
        }
    });
    stager.extendStep('game', {
        cb: function() {
            console.log('game ', node.player.stage.round);
            node.events.printAll('stage');
        }
    });
    stager.extendStep('result', {
        cb: function() {
            console.log('result');
        }
    });
    stager.extendStep('taxReturn', {
        cb: function() {
            console.log('taxReturn');
        }
    });
   /* stager.extendStep('game', {
        cb: function() {
            console.log('Game round: ' + node.player.stage.round);
            doMatch();
        }
    });

    stager.extendStep('end', {
        cb: function() {
            node.game.memory.save(channel.getGameDir() + 'data/data_' +
                                  node.nodename + '.json');
        }
    });
    stager.setOnGameOver(function() {

        // Something to do.

    });
    */

    // Here we group together the definition of the game logic.
    return {
        nodename: 'lgc' + counter,
        // Extracts, and compacts the game plot that we defined above.
        plot: stager.getState(),

    };

    // Helper functions.

    function doMatch() {
        var players, len;
        len = node.game.pl.size();
        players = node.game.pl.shuffle().id.getAllKeys();
        node.say('ROLE_DICTATOR', players[0], players[1]);
        node.say('ROLE_OBSERVER', players[1]);
    }
};
