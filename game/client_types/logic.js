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
var nocache = true;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    // Increment counter.
    var cbs = channel.require(__dirname + '/includes/logic.callbacks.js', {
        node: node,
        gameRoom: gameRoom,
        settings: settings,
        counter: counter
        // Reference to channel added by default.
    }, nocache);

    stager.setOnInit(cbs.init);


    stager.setDefaultProperty('minPlayers', [
        settings.MIN_PLAYERS,
        cbs.notEnoughPlayers
    ]);

    stager.setDefaultCallback(function() {});
    /*stager.extendStep('precache', {
        cb: function() {
            console.log('precache.');
        }
    });*/

    


    stager.extendStep('selectLanguage', {
        cb: function() {
            console.log('selectLanguage.');
        }
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
    stager.extendStage('game2', {
        init: function() {
            var g,i;
            node.game.loopFinished = false;
            node.game.nConectP=0;
            var orden=true;
            g=node.game.pl.shuffle();
            console.log(g);
           /* for(i=0;i<node.game.pl.size();i=i+2);
            {

            }*/
            node.game.pl.each(function(p) {

                // Check this.
                p.loopFinished = false;

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
                console.log('received in.set.DATA');
                console.log(msg.data.done, msg.stage.step);
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
                        console.log('DONE LOGIC');
                        node.done();                       
                    }
                }
            });

            var stage;
            stage = node.player.stage;
            
             // Trick engine.
             node.game.setCurrentGameStage({
                  stage: stage.stage + 1,
                  step: stage.step,
                  round: stage.round
             }, 'S');
        }
    });

    stager.extendStep('game2', {
        cb: function() {
            console.log('game ', node.player.stage.round);
            //node.events.printAll('stage');
        }
    });
    stager.extendStep('result2', {
        cb: function() {
            var total=0;
            var nmsg=0;

            node.on.data('DECLARE',function(msg){
                    console.log('declare: '+ msg.data);
                    total=total+msg.data;
                    nmsg++;
                    if(nmsg==node.game.pl.size()){
                        var value= total/node.game.pl.size();
                        console.log('parte: '+value);
                        node.game.pl.each(function(p) {
                           node.say('PART', p.id,value);
                        });

                    }

                }
            );
            console.log('players: '+node.game.pl.size());
            console.log('result');
        }
    });
    stager.extendStep('taxReturn2', {
        cb: function() {

            console.log('taxReturn');
        }
    });
    stager.extendStep('questionary1', {
        cb: function() {
            console.log('questionary1');
        }
    });
    stager.extendStep('dataPlayer', {
        cb: function() {
            console.log('dataPlayer');
        }
    });
    stager.extendStep('questionary2', {
        cb: function() {
            console.log('questionary2');
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
        plot: stager.getState()

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
