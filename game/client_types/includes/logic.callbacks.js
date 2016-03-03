/**
 * # Functions used by the client of Ultimatum Game
 * Copyright(c) 2014 Stefano Balietti
 * MIT Licensed
 *
 * http://www.nodegame.org
 */

var ngc = require('nodegame-client');
var GameStage = ngc.GameStage;
var J = ngc.JSUS;
var path = require('path');
var fs = require('fs');

var DUMP_DIR, DUMP_DIR_JSON, DUMP_DIR_CSV;

module.exports = {
    init: init,
    gameover: gameover,
    doMatch: doMatch,
    endgame: endgame,
    initRetGame: initRetGame,
    retGame: retGame,
    taxReturn: taxReturn,
    result: result,
    notEnoughPlayers: notEnoughPlayers
};

var node = module.parent.exports.node;
var channel = module.parent.exports.channel;
var gameRoom = module.parent.exports.gameRoom;
var settings = module.parent.exports.settings;
var counter = module.parent.exports.counter;
var currentdate = new Date();
var current_epoch = currentdate.getTime();

var client = gameRoom.getClientType('player');
var autoplay = gameRoom.getClientType('autoplay');


function init() {
    DUMP_DIR = path.resolve(channel.getGameDir(), 'data') + '/room_' + current_epoch + '/';
    node.game.module=1;
    node.game.correct = {};
    node.game.declaredEarnings = {};
    node.game.deduction = {};
    node.game.audited = {};
    
    node.game.practiceStage = 0;
//     DUMP_DIR_JSON = DUMP_DIR + 'json/';
//     DUMP_DIR_CSV = DUMP_DIR + 'csv/';
// 
//     // Recursively create directories, sub-trees and all.
//     J.mkdirSyncRecursive(DUMP_DIR_JSON, 0777);
//     J.mkdirSyncRecursive(DUMP_DIR_CSV, 0777);

    J.mkdirSyncRecursive(DUMP_DIR, 0777);

    console.log('********************** taxCompliace ' + gameRoom.name +
                ' **********************');

    node.game.lastStage = node.game.getCurrentGameStage();

    node.game.gameTerminated = false;

    // If players disconnects and then re-connects within the same round
    // we need to take into account only the final bids within that round.
    node.game.lastBids = {};

    // "STEPPING" is the last event emitted before the stage is updated.
    node.on('STEPPING', function() {
        var currentStage, db, p, gain, prefix;

        currentStage = node.game.getCurrentGameStage();
        
        //console.log("currentStepData: %o", node.game.getCurrentStep());
        // We do not save stage 0.0.0.
        // Morever, If the last stage is equal to the current one, we are
        // re-playing the same stage cause of a reconnection. In this
        // case we do not update the database, or save files.
        if (!GameStage.compare(currentStage, new GameStage())) {// ||
            //!GameStage.compare(currentStage, node.game.lastStage)) {
            return;
        }
        // Update last stage reference.
        node.game.lastStage = currentStage;


        db = node.game.memory.stage[currentStage];

        if (!db) {
            console.log('warn: no db found on stepping. Was it a reconnect?');
            return;
        }

        var datadb=db.select('done').and('module').fetch();
        if(datadb.length) {
            console.log('--------------------');
            console.log('WRITE');
            console.log(datadb);
            prefix = DUMP_DIR + 'memory_' + datadb[0].module + '_' + currentStage;
            db.save(prefix + '.csv', {flags: 'w'});
            db.save(prefix + '.nddb', {flags: 'w'});
            console.log(prefix);
            console.log('--------------------');


        }


        /*if (db && db.length) {
            // Saving results to FS.
            // node.fs.saveMemory('csv', DUMP_DIR + 'memory_' + currentStage +
            //                   '.csv', { flags: 'w' }, db);
            // node.fs.saveMemory('json', DUMP_DIR + 'memory_' + currentStage +
            //                   '.nddb', null, db);

            prefix = DUMP_DIR + 'memory_' + currentStage;
            db.save(prefix + '.csv', { flags: 'w' }); 
            db.save(prefix + '.nddb', { flags: 'w' }); 

            console.log('Round data saved ', currentStage);
        }

        // Resets last bids;
        node.game.lastBids = {};*/
        this.send
    });

    // Add session name to data in DB.
    node.game.memory.on('insert', function(o) {
        o.session = node.nodename;
    });

    // Register player disconnection, and wait for him...
    node.on.pdisconnect(function(p) {
        console.log('Disconnection in Stage: ' + node.player.stage, p.id);
    });

    // Player reconnecting.
    // Reconnections must be handled by the game developer.
    node.on.preconnect(function(p) {
        //var code, reconStep;
        var code;

        console.log('Oh...somebody reconnected!', p);
        code = channel.registry.getClient(p.id);

        if (!code) {
            console.log('game.logic: reconnecting player not found in ' +
                        'code db: ' + p.id);
            return;
        }

        if (node.game.pl.exist(p.id)) {
            console.log('game.logic: reconnecting player that was not ' +
                        'marked disconnected: ' + p.id);
            return;
        }

        // Delete countdown to terminate the game.
        clearTimeout(this.countdown);

        gameRoom.setupClient(p.id);
        
        // Start the game on the reconnecting client.
        // Need to give step: false, because otherwise pre-caching will
        // call done() on reconnecting stage.
        node.remoteCommand('start', p.id, { step: false } );

        // Pause the game on the reconnecting client, will be resumed later.
        // node.remoteCommand('pause', p.id);

        // It is not added automatically.
        // TODO: add it automatically if we return TRUE? It must be done
        // both in the alias and the real event handler.
        node.game.pl.add(p);

/*        // We must determine the reconnection step because the logic is
        // not aligned to clients in the multiplication/feedback stage.
        reconStep = getReconStep(p.id);

        console.log('Recon step is: ', reconStep);
        
        // Will send all the players to current stage
        // (also those who were there already).
        node.game.gotoStep(reconStep);*/
        node.game.gotoStep(node.player.stage);

        setTimeout(function() {
            // Pause the game on the reconnecting client, will be resumed later.
            // node.remoteCommand('pause', p.id);
            // Unpause ALL players
            // TODO: add it automatically if we return TRUE? It must be done
            // both in the alias and the real event handler
            node.game.pl.each(function(player) {
                if (player.id !== p.id) {
                    node.remoteCommand('resume', player.id);
                }
            });
            // The logic is also reset to the same game stage.
        }, 100);
    });

    // Update the Payoffs
  /*  node.on.data('response', function(msg) {
        var resWin, bidWin, code, response;
        response = msg.data;

        if (response.response === 'ACCEPT') {
            resWin = parseInt(response.value, 10);
            bidWin = COINS - resWin;

            // Save the results in a temporary variables. If the round
            // finishes without a disconnection we will add them to the
            // database.
            node.game.lastBids[msg.from] = resWin;
            node.game.lastBids[response.from] = bidWin;
        }
    });*/
    this.sendStageInfo = function(){
        node.game.nConectP=0;
        var orden=true;
        var currentStage, round_info;
        var group;
        var messageData;
        var round = 0;
    //    g=node.game.pl.shuffle();

        currentStage = node.game.getCurrentGameStage();
        node.game.practiceStage = node.game.practiceStage ? node.game.practiceStage : currentStage.stage;
        if(currentStage.stage == node.game.practiceStage){
            round_info = "Practice Round";
            round = 0;
        } else {
            round_info = "Round " + currentStage.round + " of " + 
                settings.REPEAT;
            round = currentStage.round;
        }
        node.game.pl.each(function(p) {


      // Check this.
    //                p.loopFinished = false;
            if(orden){
                //node.say('Group K!', p.id);
                group = "K";
                orden=false;
            }else{
                group = "G";
    //            node.say('Group G!', p.id);
                orden=true;
            }
            messageData = {module: node.game.module, 
                           round_info: round_info,
                           round: round,
                           group: group};
            
            
            messageData.correct = node.game.correct[p.id] ? node.game.correct[p.id] : 0 ;
            messageData.declaredEarnings = node.game.declaredEarnings[p.id] ? node.game.declaredEarnings[p.id] : 0;
            messageData.deduction = node.game.deduction[p.id] ? node.game.deduction[p.id] : 0;
            messageData.audited = node.game.audited[p.id] ? node.game.audited[p.id]: false;
            messageData.prelimGain = node.game.prelimGain[p.id] ? node.game.prelimGain[p.id] : 0 ;            
            messageData.pooledDeduction = node.game.pooledDeduction;
            messageData.incomeFromPooled = node.game.pooledDeduction / node.game.pl.size();

            //console.log("round_info: %o", messageData);
            node.say('stage_info', p.id, messageData);
        });
    };
    
    console.log('init');
}


function initRetGame() {
    node.game.correct = {};
    node.game.declaredEarnings = {};
    node.game.deduction = {};
    node.game.audited = {};
    node.game.prelimGain = {};
    node.game.pooledDeduction = 0; 
    
    node.game.sendStageInfo();

}

function retGame() {
    node.on.data('correct',function(msg){
        node.game.correct[msg.from] = msg.data;
        //console.log(node.game.correct[msg.from]);
    });
}

function taxReturn() {
    node.game.pooledDeduction = 0; 
    node.game.sendStageInfo();
    console.log('taxReturn');
        
    node.on.data('declare', function(msg){
        var diceValue= Math.random();
        var tax, probability, estado, prelimGain, taxPaid,
            declaredEarnings, finalEarnings;
        estado = false;
        
        prelimGain = msg.data.prelimGain;
        declaredEarnings = msg.data.declaredEarnings;
        if(node.game.module==2){
            tax = settings.TAX_MODULE_2;
            probability= settings.PROBABILITY_MODULE_2;
        }else{
            tax = settings.TAX_MODULE_3;
            probability = settings.PROBABILITY_MODULE_3;
        }
        if(diceValue < probability){
            estado = true;
            if(prelimGain != declaredEarnings){
                taxPaid = tax * prelimGain + (prelimGain - declaredEarnings) * 0.5 ;
            }else{
                taxPaid = tax * declaredEarnings;
            }
            finalEarnings = declaredEarnings - taxPaid;
        }else{
            taxPaid = tax * declaredEarnings;
            finalEarnings = declaredEarnings - taxPaid;
        }
        node.game.declaredEarnings[msg.from] = declaredEarnings;
        node.game.audited[msg.from] = estado;
        node.game.deduction[msg.from] = taxPaid;
        node.game.prelimGain[msg.from] = prelimGain;
    });
}

function result() {
    var total=0;
    var nmsg=0;
    for(var key in node.game.deduction){
        node.game.pooledDeduction = node.game.pooledDeduction + node.game.deduction[key];        
    }
    node.game.sendStageInfo();

   /* node.on.data('DECLARE',function(msg){
            //console.log('declare: '+ msg.data);
            total=total+msg.data;
            nmsg++;
            if(nmsg==node.game.pl.size()){
                var value= total/node.game.pl.size();
                value = Math.round(value*10)/10;
                //console.log('parte: '+value);
                node.game.pl.each(function(p) {
                   node.say('PART', p.id,value);
                });

            }

        }
    );*/
}

function gameover() {
    console.log('************** GAMEOVER ' + gameRoom.name + ' ****************');

    // Saving all indexes.
    // node.fs.saveMemoryIndexes('csv', DUMP_DIR_CSV);
    // node.fs.saveMemoryIndexes('json', DUMP_DIR_JSON);

    // Dump all memory.
    // node.fs.saveMemory('json', DUMP_DIR + 'memory_all.json');
    node.game.memory.save(DUMP_DIR + 'memory_all.json');

    // TODO: fix this.
    // channel.destroyGameRoom(gameRoom.name);
}

function doMatch() {
    var g, i, bidder, respondent, data_b, data_r;

    if (node.game.pl.size() < 2) {
        if (!this.countdown) notEnoughPlayers();
        return;
    }

    // Method shuffle accepts one parameter to update the db, as well as
    // returning a shuffled copy.
    g = node.game.pl.shuffle();

    for (i = 0 ; i < node.game.pl.size() ; i = i + 2) {
        bidder = g.db[i];
        respondent = g.db[i+1];

        data_b = {
            role: 'bidder',
            other: respondent.id
        };
        data_r = {
            role: 'respondent',
            other: bidder.id
        };

        console.log('Group ' + i + ': ', bidder.id, respondent.id);

        // Send a message to each player with their role
        // and the id of the other player.
        console.log('==================== LOGIC: BIDDER is', bidder.id, 
                    '; RESPONDENT IS', respondent.id);

        node.say('BIDDER', bidder.id, data_b);
        node.say('RESPONDENT', respondent.id, data_r);
    }
    console.log('Matching completed.');
}

function getReconStep(id) {
    var curStepId, playerCheck;
    // Get the name of current step.
    curStepId = node.game.getCurrentStep().id;
    // If it is not a game|taxReturn step we can reload current logic step.
    if (curStepId.indexOf('taxReturn') === -1) return node.player.stage;
    // If it is a game step we need to check where we are actually:
    // multiplication or feedback? So we look at other players.
    playerCheck = node.game.pl.first();
    // Make sure we don't look at the one just reconnecting.
    if (playerCheck.id === id) playerCheck = node.game.pl.next();
    if (playerCheck) {
        return playerCheck.stage;
    }
    else {
        console.log('Err: no next player.');
        return node.player.stage;
    }
}


function notEnoughPlayers() {
    if (this.countdown) return;
    console.log('Warning: not enough players!!');
    // Could decide not to pause players (players won't notice disconnection).
    var discTxt = 'One or more players disconnected. Waiting to see if they ' +
        'reconnect, otherwise the game will be terminated.';
    node.remoteCommand('pause', 'ROOM', discTxt);
/*    this.countdown = setTimeout(function() {
        console.log('Countdown fired. Going to Step: resultStage');
        node.remoteCommand('erase_buffer', 'ROOM');
        node.remoteCommand('resume', 'ROOM');
        node.game.gameTerminated = true;
        node.game.gotoStep('resultStage');
    }, 30000);*/
}

function endgame() {
    var code, exitcode, accesscode;
    var filename, bonusFile, bonus;
    var EXCHANGE_RATE;

    EXCHANGE_RATE = settings.CANTIDAD_ESU_x_PCH;

    console.log('FINAL PAYOFF PER PLAYER');
    console.log('***********************');

    bonus = node.game.pl.map(function(p) {

        code = channel.registry.getClient(p.id);
        if (!code) {
            console.log('ERROR: no code in endgame:', p.id);
            return ['NA', 'NA'];
        }

        accesscode = code.AccessCode;
        exitcode = code.ExitCode;
        
        var resultsArray=node.game.memory.select('done')
                    .and('module','==','resultModule4')
                    .and('player','==',p.id+'')
                    .fetch();
        var winamount = resultsArray[0].totalECUs || 0;
        winamount = winamount / settings.CANTIDAD_ESU_x_PCH;
        code.win = winamount;
/*        if (node.env('treatment') === 'pp' && node.game.gameTerminated) {
            code.win = 0;
        }
        else {
            code.win = Number((code.win || 0) * (EXCHANGE_RATE)).toFixed(2);
            code.win = parseFloat(code.win, 10);
        }*/
        channel.registry.checkOut(p.id);
        node.say('WIN', p.id, {
            win: code.win,
            exitcode: code.ExitCode
        });

        console.log(p.id, ': ',  code.win, code.ExitCode);
        return [p.id, code.ExitCode || 'na', code.win,
                node.game.gameTerminated];
    });

    console.log('***********************');
    console.log('Game ended');

    // Write down bonus file.
    filename = DUMP_DIR + 'bonus.csv';
    bonusFile = fs.createWriteStream(filename);
    bonusFile.on('error', function(err) {
        console.log('Error while saving bonus file: ', err);
    });
    bonusFile.write(["access", "exit", "bonus", "terminated"].join(', ') + '\n');
    bonus.forEach(function(v) {
        bonusFile.write(v.join(', ') + '\n'); 
    });
    bonusFile.end();

    node.game.memory.save(DUMP_DIR + 'memory_all.json');
    // node.fs.writeCsv(bonusFile, bonus, {
    //     headers: ["access", "exit", "bonus", "terminated"]
    // });

    //node.done();
}
