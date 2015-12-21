/**
 * # Player type implementation of the game stages
 * Copyright(c) 2015 J.Orellana,M.Lopez <jose.orellanan@usach.cl>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var stepRules = ngc.stepRules;
var constants = ngc.constants;
var publishLevels = constants.publishLevels;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var game,MIN_PLAYERS;
    var cbs;

    cbs = require(__dirname + '/includes/player.callbacks.js');
    stager.setOnInit(cbs.init);
    /*  stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;

        // Bid is valid if it is a number between 0 and 100.
       this.isValidBid = function(n) {
            if (typeof n !== 'string') return false;
            if (!/^\d+$/.test(n)) return false;
            n = parseInt(n, 10);
            if (n < 0 || n > 100) return false;
            return n;
        };

        this.randomOffer = function(offer, submitOffer) {
            var n;
            n = JSUS.randomInt(-1,100);
            offer.value = n;
            submitOffer.click();
        };

        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);
        this.timer = node.widgets.append('VisualTimer', header);
    });*/
    stager.setDefaultStepRule(stepRules.WAIT);

    stager.setDefaultProperty('done', cbs.clearFrame);

    MIN_PLAYERS = [ settings.MIN_PLAYERS, cbs.notEnoughPlayers ];
   /* stager.extendStep('precache', {
        cb: cbs.precache,
        // `minPlayers` triggers the execution of a callback in the case
        // the number of players (including this client) falls the below
        // the chosen threshold. Related: `maxPlayers`, and `exactPlayers`.
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
    });*/

debugger

    stager.extendStage('looped', {
        init: function() {
            console.log('Uhm.........................');
            //this.loopFinished = false;
        },
        exit: function() {
            this.timer.init({
                startOnPlaying: true,
                stepOnDone: true
            });
        },
        // steps: [ 'loo1', 'loo2' ]
    });               

    stager.extendStep('loo1', {
        cb: function() {
            W.loadFrame('looped.htm', function() {
                var round, button;
                round = node.player.stage.round;
                if (round === 1) {
                    node.game.timer.init({
                        milliseconds: 10000,
                        timeup: function() {
                            var stage;
                            stage = node.player.stage;
                            console.log('TIMEUPPPPPPPP');
                            node.game.loopFinished = true;
                            // To exit the loop we need to be in step 2.
                            // Trick the engine.
                            // Notice: the step increment must be adjusted 
                            // to reach the last step of the stage.
                            if (stage.step === 1) {
                                node.game.setCurrentGameStage({
                                    stage: stage.stage,
                                    step: stage.step + 1,
                                    round: stage.round
                                }, 'S');
                            }
                            node.done({ loopFinished: true });
                        },
                        // Need to set these to TRUE in the next step.
                        startOnPlaying: false,
                        stopOnDone: false
                    });
                    node.game.timer.startTiming();
                }

                console.log('Loop ', round);
                button = document.createElement('button');
                button.innerHTML = 'DONE';
                button.onclick = function() { node.done(); };
                W.getFrameDocument().body.appendChild(button);
                W.writeln('Loop n. ' + round);
            });
        },
        stepRule: stepRules.SOLO
    });

    stager.extendStep('loo2', {
        cb: function() {
            var round, button;

            if (node.game.loopFinished) {
                node.done();
                return;
            }

            round = node.player.stage.round;
            button = document.createElement('button');
            button.innerHTML = 'DONE - 2';
            button.onclick = function() { node.done(); };
            W.getFrameDocument().body.appendChild(button);
            W.writeln('Loop n. ' + round);
            console.log('loo2');
        },
        stepRule: stepRules.SOLO
    });

    stager.extendStep('selectLanguage', {
        cb: cbs.selectLanguage,
        timer: settings.TIMER_SELEC_LANG,
        minPlayers: MIN_PLAYERS
    });

    stager.extendStep('instructions', {
        cb: cbs.instructions,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('instructionsModule1', {
        cb: cbs.instructionsModule1,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('module1', {
        cb: cbs.module1,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_GAME
    });
    stager.extendStep('instructionsModule2', {
        cb: cbs.instructionsModule2,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_GAME
    });
    stager.extendStep('instructionsModule3', {
        cb: cbs.instructionsModule3,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_GAME
    });
    stager.extendStep('instructionsModule4', {
        cb: cbs.instructionsModule4,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_GAME
    });
    stager.extendStage('game', {
        init: function() {
            this.loopFinished = false;
        },
        exit: function() {
            this.timer.init({
                startOnPlaying: true,
                stepOnDone: true
            });
        }
    });
    stager.extendStep('game', {
        cb: cbs.game,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_GAME,
        stepRule: stepRules.SOLO
    })
   /* stager.extendStep('instructions', {
        cb: function() {

            W.loadFrame('instructions.htm', function() {

                var button = W.getElementById('read');
                button.onclick = function() {
                    node.done();
                };

            });
        },
        timer: 60000
    });
*/
  /*  stager.extendStep('game', {
        cb: function() {
            W.loadFrame('game.htm', function() {

                node.on.data('ROLE_DICTATOR', function(msg) {
                    var button, offer, div;

                    // Make the dictator display visible.
                    div = W.getElementById('dictator').style.display = '';
                    button = W.getElementById('submitOffer');
                    offer =  W.getElementById('offer');


                    // Setup the timer.
                    node.game.timer.init({
                        milliseconds: node.game.settings.timer,
                        timeup: function() {
                            node.game.randomOffer(offer, button);
                        }
                    });
                    node.game.timer.updateDisplay();
                    node.game.timer.startTiming();

                    // Listen on click event.
                    button.onclick = function() {
                        var to, decision;
                        // Validate offer.
                        decision = node.game.isValidBid(offer.value);
                        if ('number' !== typeof decision) {
                            W.writeln('Please enter a number between ' +
                                      '0 and 100.');
                            return;
                        }
                        button.disabled = true;

                        // The recipient of the offer.
                        to = msg.data;

                        // Send the decision to the other player.
                        node.say('decision', to, decision);

                        // Mark the end of the round, and
                        // store the decision in the server.
                        node.done({ offer: decision });
                    };
                });

                node.on.data('ROLE_OBSERVER', function(msg) {
                    var button, span, offer, div;

                    node.game.timer.clear();
                    node.game.timer.startWaiting({
                        milliseconds: node.game.settings.timer,
                        timeup: false
                    });

                    // Make the observer display visible.
                    div = W.getElementById('observer').style.display = '';
                    span = W.getElementById('dots');
                    W.addLoadingDots(span);
                    node.on.data('decision', function(msg) {
                        var span;
                        span = W.getElementById('decision');
                        span.innerHTML = 'The dictator offered: ' + msg.data +
                            ' ECU.';
                        // Setting the step done with delay.
                        setTimeout(function() {
                            node.done();
                        }, 5000);
                    });
                });

            });
        }
    });

    stager.extendStep('end', {
        // frame: 'end.htm',
        cb: function() {
            W.loadFrame('end.htm');
            node.game.timer.startTiming();
            node.game.timer.setToZero();
        }
    });
    */
    game = setup;

debugger

    game.plot = stager.getState();
    return game;
};
