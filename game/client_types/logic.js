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
    var couples=[];

    // Must implement the stages here.

    // Increment counter.
    var cbs = channel.require(__dirname + '/includes/logic.callbacks.js', {
        node: node,
        gameRoom: gameRoom,
        settings: settings,
        counter: counter
        // Reference to channel added by default.
    }, nocache);

    
    stager.setOnGameOver(cbs.gameover);
    
    stager.setOnInit(cbs.init);


    // This sets that in every step there must be at least MIN_PLAYERS.
    // However, you might want to set it manually for the steps/stages
    // where it is needed.
//     stager.setDefaultProperty('minPlayers', [
//         settings.MIN_PLAYERS,
//         cbs.notEnoughPlayers
//     ]);

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
            var g;
            var par,i;
            var playerA,playerB;
            console.log('Start Module 1');
            g=node.game.pl.shuffle();
            for(i=0;i<node.game.pl.size();i=i+2){
                playerA=g.db[i];
                playerB=g.db[i+1];

                var dataPA={
                    role:'A',
                    other:playerB.id

                };
                var dataPB={
                    role:'B',
                    other:playerA.id

                };
                console.log('Player id A: ' + playerA.id);
                console.log('Role A: ' + dataPA.role);
                console.log('Other A: ' + dataPA.other);
                console.log('Player id B: ' + playerB.id);
                console.log('Role B: ' + dataPB.role);
                console.log('Other B: ' + dataPB.other);
                node.say('Role A' , playerA.id, dataPA);
                node.say('Role B', playerB.id, dataPB);

            };


        }
    });
    stager.extendStep('instructionsModule2', {
        cb: function() {
            console.log('instructionsModule2');
            node.game.module = 2;
            var i, g;
            g=node.game.pl.shuffle();
            node.game.taxGroup = {};
            for(i=0;i<node.game.pl.size();i=i+1){
                node.game.taxGroup[g.db[i].id] = i % 2? "K": "G";
            };
            node.game.payRound["Module" + node.game.module ] = Math.abs(Math.floor(Math.random()*(settings.REPEAT))) + 1;
            console.log("%o", node.game.taxGroup);
        }
    });
    stager.extendStep('instructionsModule3', {
        cb: function() {
            console.log('instructionsModule3');
            node.game.module = 3;
            node.game.payRound["Module" + node.game.module ] = Math.abs(Math.floor(Math.random()*(settings.REPEAT))) + 1;
        }
    });
    stager.extendStep('instructionsModule4', {
        cb: function() {
            console.log('instructionsModule4');
            node.game.module = 4;
        }
    });
    stager.extendStep('game2', {
        init: cbs.initRetGame,
        cb: cbs.retGame
    });

/*    stager.extendStep('game2', {
        cb: function() {
            console.log('game ', node.player.stage.round);
            //node.events.printAll('stage');
        }
    });*/
    stager.extendStep('result2', {
        cb: cbs.result
    });
    stager.extendStep('taxReturn2', {
        cb: cbs.taxReturn,
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
    stager.extendStep('questionary3', {
        cb: function() {
            console.log('questionary3');
        }
    });
    stager.extendStep('resultModule1', {
        cb: function() {
            var results= node.game.memory.select('done')
                .and('module','==','Module1')
                .fetch();

            for(var i=0;i<results.length;i++){

                var dataResult= {
                    id: results[i].player,
                    role: results[i].role,
                    value: results[i].value,
                    other: results[i].other
                };
                console.log('--------------------------');
                console.log('Player '+dataResult.id);
                console.log('Role: '+dataResult.role);
                console.log('Value: '+dataResult.value);
                console.log('Other: '+dataResult.other);

                node.say('Result',dataResult.id,dataResult);



            }
            console.log('--------------------------');
            console.log('resultModule1');

        }
    });
    stager.extendStep('resultModule2', {
        cb: function() {

            var players=node.game.pl;

            for(var j=0;j<players.size();j++){
                var player=players.db[j].id;
                var resultsArray=node.game.memory.select('done')
                    .and('module','==','Module2')
                    .and('round', '>', 0)
                    .and('player','==',player+'')
                    .fetch();
                console.log('IdPlayer: '+player +'\nArrayResults: ');
                console.log(resultsArray);
                var choise=Math.abs(Math.floor(Math.random()*(resultsArray.length-1)));
                var resultChoise=resultsArray[choise];
                console.log("Choise: "+choise+"\n Result: ");
                //console.log(resultChoise);
                var dataResult={
                    id:resultChoise.player,
                    round:resultChoise.round,
                    preEarnings:resultChoise.preEarnings,
                    totalEarnings:resultChoise.totalEarnings,
                    declareEarnings:resultChoise.declareEarnings,
                    correct:resultChoise.correct,
                    statusDeclare:resultChoise.statusDeclare,
                    taxPaid:resultChoise.taxPaid,
                    finalEarnings:resultChoise.finalEarnings

                };
                console.log(dataResult);
                node.say('Result',dataResult.id,dataResult);
            }


            console.log('resultModule2');

        }
    });
    stager.extendStep('resultModule3', {
        cb: function() {

            var players=node.game.pl;

            for(var j=0;j<node.game.pl.size();j++){
                var player=players.db[j].id;
                var resultsArray=node.game.memory.select('done')
                    .and('module','==','Module3')
                    .and('round', '>', 0)
                    .and('player','==',player+'')
                    .fetch();
                console.log(resultsArray);
                var choise=Math.abs(Math.floor(Math.random()*(resultsArray.length-1)));
                var resultChoise=resultsArray[choise];
                console.log("Choise: "+choise+"\n Result: ");
                console.log(resultChoise);
                var dataResult={
                    id:resultChoise.player,
                    round:resultChoise.round,
                    preEarnings:resultChoise.preEarnings,
                    totalEarnings:resultChoise.totalEarnings,
                    declareEarnings:resultChoise.declareEarnings,
                    correct:resultChoise.correct,
                    statusDeclare:resultChoise.statusDeclare,
                    taxPaid:resultChoise.taxPaid,
                    finalEarnings:resultChoise.finalEarnings

                };
                console.log(dataResult);
                node.say('Result',dataResult.id,dataResult);
            }


            console.log('resultModule3');

        }
    });

    stager.extendStep('resultModule4', {
        cb: function() {
            var  results= node.game.memory.select('done')
                .and('module','==','Module4')
                .fetch();
            var dataResult, dataUser;
            for(var i=0;i<results.length ;i++){

                var dataUser=results[i];
                var choise=Math.abs(Math.floor(Math.random()*(dataUser.arrayAnswers.length-1)));
                var probability1,probability2;
                probability1=(10*(choise+1))/100;
                probability2= 1 - probability1;
                console.log(dataUser);
                var valueDice=Math.random();
                var high_opcion,value;

                if(valueDice < probability2){
                        high_opcion = false;
                }else{
                        high_opcion=true;
                }
                if(dataUser.arrayAnswers[choise]=='A'){
                    if(high_opcion) value = settings.RISK_SAFE_HIGH;
                    else value = settings.RISK_SAFE_LOW;


                }else{
                    if(high_opcion) value = settings.RISK_GABL_HIGH;
                    else value = settings.RISK_GABL_LOW;
                }

                dataResult={
                    id:dataUser.player,
                    choise:choise+1,
                    select:dataUser.arrayAnswers[choise],
                    value:value
                };
                console.log('--------------------------');
                console.log('Player '+dataResult.id);
                console.log('choise: '+dataResult.choise);
                console.log('select: '+dataResult.select);
                console.log('Value: '+dataResult.value);


                node.say('Result',dataResult.id,dataResult);



            }
            console.log('--------------------------');




            console.log('resultModule4');

        }
    });
    
    stager.extendStep('endgame', {
        cb: cbs.endgame,
        minPlayers: undefined,
        steprule: stepRules.SOLO
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
