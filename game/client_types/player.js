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

    /*stager.extendStage('looped', {
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
        steps: [ 'loo1', 'loo2' ]
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
    });*/

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
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('instructionsModule2', {
        cb: cbs.instructionsModule2,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('instructionsModule3', {
        cb: cbs.instructionsModule3,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('instructionsModule4', {
        cb: cbs.instructionsModule4,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('questionary1', {
        cb: cbs.questionary1,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('questionary2', {
        cb: cbs.questionary2,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('questionary3', {
        cb: cbs.questionary3,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStage('game2', {
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
    stager.extendStep('game2', {
        cb: cbs.game,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_GAME,
        stepRule: stepRules.SOLO
    });

    stager.extendStep('taxReturn2', {
        cb: cbs.taxReturn,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,

        timer: settings.TIMER_INSTRUCTIONS,
        done: function() {            
            node.set({loopFinished: true});
            return true;
        }
    });
    stager.extendStep('result2', {
        cb: cbs.result,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('dataPlayer', {
        cb: cbs.dataPlayer,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    })
    stager.extendStep('resultModule1', {
        cb: cbs.resultModule1,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
    stager.extendStep('resultModule2', {
        cb: cbs.resultModule2,
        minPlayers: MIN_PLAYERS,
        // syncOnLoaded: true,
        timer: settings.TIMER_INSTRUCTIONS
    });
   /*
    stager.extendStep('end', {
        // frame: 'end.htm',
        cb: function() {
            W.loadFrame('end.htm');
            node.game.timer.startTiming();
            node.game.timer.setToZero();
        }
    });*/
    game = setup;

    game.plot = stager.getState();
    return game;
};
