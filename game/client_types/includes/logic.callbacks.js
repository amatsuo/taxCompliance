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
    resultModule1: resultModule1,
    resultModule2: resultModule2,
    resultModule3: resultModule3,
    resultModule4: resultModule4,
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

var bot2 = require('./bot2');


function init() {

    // Saving players IDS.
    node.game.ids = {};
    node.game.pl.each(function(p) {
        node.game.ids[p.id] = true;
    });

    DUMP_DIR = path.resolve(channel.getGameDir(), 'data') + '/room_' + current_epoch + '/';
    node.game.module=1;
    node.game.correct = {};
    node.game.declaredEarnings = {};
    node.game.deduction = {};
    node.game.audited = {};
    node.game.payRound = {};
    node.game.roundIncome = {};
    node.game.pooledDeduction = 0;


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
           /* if(orden){
                //node.say('Group K!', p.id);
                group = "K";
                orden=false;
            }else{
                group = "G";
    //            node.say('Group G!', p.id);
                orden=true;
            }*/
            group = node.game.taxGroup[p.id];
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
    node.game.roundIncome = {};
    
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
    var key;
    
    this.calcStageEarnings = function(prelimG, declaredE, id){
        var diceValue= Math.random();
        var tax, probability, estado, prelimGain, taxPaid,
            declaredEarnings, finalEarnings;
        estado = false;

        prelimGain = prelimG;
        declaredEarnings = declaredE;
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

        node.game.declaredEarnings[id] = declaredEarnings;
        node.game.audited[id] = estado;
        node.game.deduction[id] = taxPaid;
        node.game.prelimGain[id] = prelimGain;
    };
    //calculate the default results, in case the client does not send results.
    for(key in this.ids){
        node.game.correct[key] = node.game.correct[key] ? node.game.correct[key] : 0;
        if(node.game.taxGroup[key]=="K") {
            node.game.prelimGain[key] = node.game.settings.SALARY_K * node.game.correct[key];
        } else {
            node.game.prelimGain[key] = node.game.settings.SALARY_G * node.game.correct[key];
        }
        node.game.declaredEarnings[key] = 0;
        node.game.calcStageEarnings(node.game.prelimGain[key], node.game.declaredEarnings[key], key);
    }
    //update declaired gain with message.
    node.on.data('declare', function(msg){
        node.game.calcStageEarnings(msg.data.prelimGain, msg.data.declaredEarnings, msg.from);        
    });
}

function result() {
    var total=0;
    var nmsg=0;
    var key, paidRound, round, incomeFromPooled, roundResult = {};
    for (key in this.ids) {
        if (this.ids.hasOwnProperty(key)) {
            // Connected in the previous step.
            if (node.game.deduction.hasOwnProperty(key)) {
                node.game.pooledDeduction = node.game.pooledDeduction +
                    node.game.deduction[key];
            }
            else {
                node.game.pooledDeduction = node.game.pooledDeduction +
                    // Pass other params as needed.
                    bot2(node, node.game.deduction);
            }
        }
    }
    currentStage = node.game.getCurrentGameStage();
    incomeFromPooled = node.game.pooledDeduction / node.game.pl.size();
    for (key in this.ids) { 
        node.game.roundIncome[key] = node.game.prelimGain[key] -
            node.game.deduction[key] + incomeFromPooled;
    }
    if(currentStage.stage == node.game.practiceStage){
        round = 0;
    } else {
        round = currentStage.round;
    }
    node.game.sendStageInfo();
    paidRound = (node.game.payRound['Module' + node.game.module] == round)? 1 :0;
    
    
    for (key in this.ids) { 
        roundResult[key] = {
            declaredEarnings: node.game.declaredEarnings[key],
            audited: node.game.audited[key],
            deduction: node.game.deduction[key],
            prelimGain: node.game.prelimGain[key],
            roundIncome: node.game.roundIncome[key],
            correct: node.game.correct[key],
            group: node.game.taxGroup[key]
        }
    }
    node.game.memory.insert({
        module: "Module" + node.game.module,
        round: round,
        paidRound: paidRound,
        pooledDeduction: node.game.pooledDeduction, 
        roundResult: roundResult, 
/*        declaredEarnings: node.game.declaredEarnings,
        audited: node.game.audited,
        deduction: node.game.deduction,
        prelimGain: node.game.prelimGain,
        roundIncome: node.game.roundIncome,*/
        player: node.player.id,
        stage: node.player.stage});

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

function resultModule1() {
    node.game.moduleIncomes = {};
    node.game.pl.each(function(p){
        node.game.moduleIncomes[p.id] = [];
    });

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
        node.game.moduleIncomes[results[i].player][0] = results[i].value;
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


function resultModule2() {
    //var players=node.game.pl;
    var id;
    resultsArray=node.game.memory.select('module','==','Module2')
            .and('paidRound', '==', 1)
            .fetch();
    console.log("%o", resultsArray[0].roundResult);
    for (id in resultsArray[0].roundResult) {
        if (resultsArray[0].roundResult.hasOwnProperty(id)) {
            var results = resultsArray[0].roundResult[id];
            console.log("%o", results);
            node.say('Result',id,results);
            if(!node.game.moduleIncomes.hasOwnProperty(id)){
                node.game.moduleIncomes[id] = [];
            }
            node.game.moduleIncomes[id][1] = results.roundIncome;
        }
    }    
}

function resultModule3() {
    //var players=node.game.pl;
    var id;
    resultsArray=node.game.memory.select('module','==','Module3')
            .and('paidRound', '==', 1)
            .fetch();
    console.log("%o", resultsArray[0].roundResult);
    for (id in resultsArray[0].roundResult) {
        if (resultsArray[0].roundResult.hasOwnProperty(id)) {
            var results = resultsArray[0].roundResult[id];
            console.log("%o", results);
            node.say('Result',id,results);
            if(!node.game.moduleIncomes.hasOwnProperty(id)){
                node.game.moduleIncomes[id] = [];
            }
            node.game.moduleIncomes[id][2] = results.roundIncome;
        }
    }    
}

function resultModule4() {
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
        if(!node.game.moduleIncomes.hasOwnProperty(dataResult.id)){
            node.game.moduleIncomes[dataResult.id] = [];
        }
        node.game.moduleIncomes[dataResult.id][3] = Number(value) * settings.CANTIDAD_ESU_x_PCH;

    }
    console.log('--------------------------');
    console.log('resultModule4');

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

/*        var resultsArray=node.game.memory.select('done')
                    .and('module','==','resultModule4')
                    .and('player','==',p.id+'')
                    .fetch();
        var winamount = resultsArray[0].totalECUs || 0;*/
        console.log(node.game.moduleIncomes[p.id]);
        var winamount = node.game.moduleIncomes[p.id].reduce(function(a, b) {
            return a + b;
        });
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
