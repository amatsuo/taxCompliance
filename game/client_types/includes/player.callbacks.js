/**
 * # Functions used by the client of Ultimatum Game
 * Copyright(c) 2015 Stefano Balietti
 * MIT Licensed
 *
 * http://www.nodegame.org
 */

module.exports = {
    init: init,
    precache: precache,
    selectLanguage: selectLanguage,
    instructions: instructions,
    instructionsModule1:instructionsModule1,
    module1:module1,
    instructionsModule2:instructionsModule2,
    game:game,
    taxReturn:taxReturn,
    result:result,
    instructionsModule3:instructionsModule3,
    instructionsModule4:instructionsModule4,
    questionary1:questionary1,
    calcResult: calcResult,
    dataPlayer:dataPlayer,
    questionary2:questionary2,
    questionary3:questionary3,
    resultModule1:resultModule1,
    resultModule2:resultModule2,
    resultModule3:resultModule3,
    resultModule4:resultModule4,
    //module2:module2,

    //quiz: quiz,
    //ultimatum: ultimatum,
    //postgame: postgame,
    endgame: endgame,
    //clearFrame: clearFrame,
    notEnoughPlayers: notEnoughPlayers
};

function init() {
    var that, waitingForPlayers, treatment, header;

    that = this;
    this.node.log('Init.');

    node.game.verbosity = -100;

    W.setUriPrefix(node.player.lang.path);
    node.game.lastResult=null;
    node.game.correct=0;
    node.game.group=null;
    node.game.module=0;
    node.game.answersModule4=[];
    node.game.round=0;
    node.game.totalECUs = 0;

    // Setup the header (by default on the left side).
    if (!W.getHeader()) {
        header = W.generateHeader();

        // Uncomment to visualize the name of the stages.
        //node.game.visualStage = node.widgets.append('VisualStage', header);

       /* node.game.rounds = node.widgets.append('VisualRound', header, {
            displayModeNames: ['COUNT_UP_STAGES_TO_TOTAL'],
            stageOffset: 1
        });*/

        node.game.timer = node.widgets.append('VisualTimer', header);
    }

    // Add the main frame where the pages will be loaded.
    if (!W.getFrame()) {
        W.generateFrame();
    }

    // Add default CSS.
    if (node.conf.host) {
        W.addCSS(W.getFrameRoot(), node.conf.host +
                 'stylesheets/nodegame.css');
    }

    // Add event listeners valid for the whole game.

    node.on('BID_DONE', function(offer, to, timeup) {
        var root, time;

        // Time to make a bid.
        time = node.timer.getTimeSince('bidder_loaded');
        
        // Hack. To avoid double offers. Todo: fix.
        if (node.game.offerDone) return;
        node.game.offerDone = true;

        node.game.timer.clear();
        node.game.timer.startWaiting({milliseconds: 30000});

        W.getElementById('submitOffer').disabled = 'disabled';

        // Notify the server.
        node.set({
            offer: offer,
            time: time,
            timeup: timeup
        });
        // Notify the other player.
        node.say('OFFER', to, offer);

        root = W.getElementById('container');
        // Leave a space.
        W.writeln(' Your offer: ' +  offer +
                  '. Waiting for the respondent... ', root);
    });

    node.on('RESPONSE_DONE', function(response, offer, from) {
        var time;
        time = node.timer.getTimeSince('offer_received');

        console.log(response, offer, from);

        node.say(response, from, response);

        node.set({
            response: response,
            value: offer,
            from: from
        });

        //////////////////////////////////////////////
        // nodeGame hint:
        //
        // node.done() communicates to the server that
        // the player has completed the current state.
        //
        // The parameters are send to the server with
        // a SET message. This SET message has two
        // properties by default:
        //
        // - time: time passed since the begin of the step
        // - timeup: if a timeup happened
        //
        // which can be overwritten by the parameter.
        //
        /////////////////////////////////////////////
        node.done({
            // Overwrite default `time` property
            // (since the beginning of the step).
            time: time
        });
    });


    // Clean up stage upon stepping into the next one.
    node.on('STEPPING', function() {
        W.clearFrame();
    });

    // Add other functions are variables used during the game.

    this.other = null;

    this.randomAccept = function(offer, other) {
        var root, accepted;
        accepted = Math.round(Math.random());
        console.log('randomaccept');
        console.log(offer + ' ' + other);
        root = W.getElementById('container');
        if (accepted) {
            node.emit('RESPONSE_DONE', 'ACCEPT', offer, other);
            W.write(' You accepted the offer.', root);
        }
        else {
            node.emit('RESPONSE_DONE', 'REJECT', offer, other);
            W.write(' You rejected the offer.', root);
        }
    };

    this.isValidBid = function(n) {
        if (typeof n !== 'string') return false;

        if (!/^\d+$/.test(n)) return false;

        n = parseInt(n, 10);
        return n >= 0 && n <= 100;
    };

    this.displayRoundInfo = function(round_info) {
        var roundInfo = W.getElementById('round');
        roundInfo.innerHTML = round_info;
//        var c_round = node.player.stage.round;
        //console.log(node.player.stage.round);
        //console.log("%o", node.player.stage);
        
/*        if (c_round > 0) { 
            roundInfo.innerHTML= "Round " + c_round + " of " 
                + node.game.settings.REPEAT;
        }
        else {
            roundInfo.innerHTML = "Practice round";
        }*/
    };

    this.requestResult = function(){
        if(!node.game.hasOwnProperty('moduleOutcomes')){
            console.log("--------Date Requested--------");
            node.say("RequestResults","SERVER");
        }
        node.on.data("AllResults", function(msg){
            console.log("--------Requested Data Received--------");
            console.log("%o", msg.data);
            node.game.moduleOutcomes = msg.data;        
        });
        node.on.data("WIN", function(msg){
            node.game.endgame = msg.data;
        });
    };


    treatment = node.env('treatment');

    // Adapting the game to the treatment.
    if (treatment === 'pp') {
        node.game.instructionsPage = 'instructions_pp.html';
    }
    else {
        node.game.instructionsPage = 'instructions.html';
    }
}

//////////////////////////////////////////////
// nodeGame hint:
//
// Pages can be preloaded with this method:
//
// W.preCache()
//
// It loads the content from the URIs given in an array parameter, and the
// next time W.loadFrame() is used with those pages, they can be loaded
// from memory.
//
// W.preCache calls the function given as the second parameter when it's
// done.
//
/////////////////////////////////////////////
function precache() {
    var langPath = node.player.lang.path;
    W.lockScreen('Loading...');
    console.log('pre-caching...');
    W.preCache([
        'languageSelection.html', // no text here.
        langPath + node.game.instructionsPage,
        langPath +'instructionsModule1.html'
    ], function() {
        console.log('Precache done.');
        // Pre-Caching done; proceed to the next stage.
        node.done();
    });
}

function selectLanguage() {
    W.loadFrame('languageSelection.html', function() {
        var b = W.getElement('input', 'done', {
            type: "button", value: "Choice Made",
            className: "btn btn-lg btn-primary"
        });

        node.game.lang = node.widgets.append('LanguageSelector',
                                             W.getFrameDocument().body);

        W.getFrameDocument().body.appendChild(b);
        b.onclick = function() {
            // The chosen language prefix will be
            // added automatically to every call to W.loadFrame().
            W.setUriPrefix(node.player.lang.path);
            node.done();
        };

        node.env('auto', function() {
            node.timer.randomExec(function() {
                b.click();
            });
        });
    });
}

function instructions() {
    var that = this;
    var count = 0;

    //////////////////////////////////////////////
    // nodeGame hint:
    //
    // The W object takes care of all
    // visual operation of the game. E.g.,
    //
    // W.loadFrame()
    //
    // loads an HTML file into the game screen,
    // and the execute the callback function
    // passed as second parameter.
    //
    /////////////////////////////////////////////
    W.loadFrame(node.game.instructionsPage, function() {

        var b = W.getElementById('read');
        b.onclick = function() {
            node.done();
        };

        ////////////////////////////////////////////////
        // nodeGame hint:
        //
        // node.env executes a function conditionally to
        // the environments defined in the configuration
        // options.
        //
        // If the 'auto' environment was set to TRUE,
        // then the function will be executed
        //
        ////////////////////////////////////////////////
        node.env('auto', function() {

            //////////////////////////////////////////////
            // nodeGame hint:
            //
            // Execute a function randomly in a time interval
            // from 0 to 2000 milliseconds
            //
            //////////////////////////////////////////////
            node.timer.randomExec(function() {
                node.done();
            }, 2000);
        });
    });
    console.log('Instructions');
}

function instructionsModule1(){
    W.loadFrame('instructionsModule1.html', function() {

        var b = W.getElementById('read');
        b.onclick = function() {
            node.game.module++;
            node.done();
        };
        //console.log("my object: %o", node.player);

        ////////////////////////////////////////////////
        // nodeGame hint:
        //
        // node.env executes a function conditionally to
        // the environments defined in the configuration
        // options.
        //
        // If the 'auto' environment was set to TRUE,
        // then the function will be executed
        //
        ////////////////////////////////////////////////
        node.env('auto', function() {

            //////////////////////////////////////////////
            // nodeGame hint:
            //
            // Execute a function randomly in a time interval
            // from 0 to 2000 milliseconds
            //
            //////////////////////////////////////////////
            node.timer.randomExec(function() {
                node.done();
            }, 2000);
        });
    });
    console.log('instructionsModule1');
}
function module1(){
    W.loadFrame('module1.html', function () {

        var role,other;
        var b = W.getElementById('read');
        node.on.data('Role A', function(msg) {
            role=msg.data.role;
            other=msg.data.other;
            console.log('Role '+ role);
        });
        node.on.data('Role B', function(msg) {
            role=msg.data.role;
            other=msg.data.other;
            console.log('Role '+role );
        });

        b.onclick = function() {
            var valueR=0;
            var send = W.getElementById('Send');
            var value= send.value;
            value = JSUS.isInt(value, 0, node.game.settings.CANTIDAD);

            if ( value===false ) {

                var modal = W.getElementById("ERROR");
                $(modal).modal();
                $('.modal-backdrop').remove();

            }
            else {
                send.disabled = true;
                b.disabled = true;
                W.writeln(' Waiting for the decision of other players',
                          W.getElementById('Module1'));
                console.log('Role '+role );
                node.say('send',other,value);
                node.on.data('send', function(msg){
                    valueR=msg.data;
                    node.done({
                        value: role === 'A' ? 1000 - value : valueR,
                        input_value: value,
                        role: role,
                        other: other,
                        module: 'Module1'
                    });
                    node.say('send',other,value);                 
                });
            }
        };
    });
}
function instructionsModule2(){
    W.loadFrame('instructionsModule2.html', function() {

        var b = W.getElementById('read');
        node.game.round=-1; // in order to include the practice round;
        b.onclick = function() {
            node.done();
        };

        ////////////////////////////////////////////////
        // nodeGame hint:
        //
        // node.env executes a function conditionally to
        // the environments defined in the configuration
        // options.
        //
        // If the 'auto' environment was set to TRUE,
        // then the function will be executed
        //
        ////////////////////////////////////////////////
        node.env('auto', function() {

            //////////////////////////////////////////////
            // nodeGame hint:
            //
            // Execute a function randomly in a time interval
            // from 0 to 2000 milliseconds
            //
            //////////////////////////////////////////////
            node.timer.randomExec(function() {
                node.done();
            }, 2000);
        });
    });
    console.log('instructionsModule2');
}
function instructionsModule3(){
    W.loadFrame('instructionsModule3.html', function() {

        var b = W.getElementById('read');
        node.game.round = 0;
        b.onclick = function() {
            node.game.rounds=-1;
            node.done();
        };

        ////////////////////////////////////////////////
        // nodeGame hint:
        //
        // node.env executes a function conditionally to
        // the environments defined in the configuration
        // options.
        //
        // If the 'auto' environment was set to TRUE,
        // then the function will be executed
        //
        ////////////////////////////////////////////////
        node.env('auto', function() {

            //////////////////////////////////////////////
            // nodeGame hint:
            //
            // Execute a function randomly in a time interval
            // from 0 to 2000 milliseconds
            //
            //////////////////////////////////////////////
            node.timer.randomExec(function() {
                node.done();
            }, 2000);
        });
    });
    console.log('instructionsModule3');
}

function game() {
    W.loadFrame('game.html', function () {
        //node.game.lastResult="succes";
        var round;
        var title=W.getElementById('titleGame');
        
        node.say('correct', 'SERVER', node.game.correct);

        round = node.player.stage.round;
        node.game.correct = 0;
        var num1, num2;
        num1 = Math.floor(Math.random()*(99-10)+10);
        num2 = Math.floor(Math.random()*(99-10)+10);
        W.getElementById('num1').innerHTML = num1;
        W.getElementById('num2').innerHTML = num2;
        /*if (round === 1) {
            node.game.timer.init({
                milliseconds: node.game.settings.TIMER_GAME,
                timeup: function() {
                    console.log('TIMEUPPPPPPPP');
                    node.game.loopFinished = true;
                    node.done();
                },
                // Need to set these to TRUE in the next step.
                startOnPlaying: false,
                stopOnDone: false
            });
            node.game.timer.startTiming();
        }

        if( node.game.lastResult!=null){
            if(node.game.lastResult === "succes"){
                W.getElementById('alertSucces').style.display = 'block';
            }else
            {
                W.getElementById('alertDanger').style.display = 'block';
            }
        }*/
        
        node.on.data("stage_info", function(msg) {
            node.game.displayRoundInfo(msg.data.round_info);
            node.game.module = msg.data.module;
            title.innerHTML = title.innerHTML+msg.data.module;
            node.game.group = msg.data.group;
            node.set({role: msg.data.group });
            if(!node.game.settings.BASELINE){
                title.innerHTML=title.innerHTML+": You are Group " + node.game.group;
            }
        });
/*        node.on.data('Group K!', function(msg) {
            node.game.group="K";

            console.log('I\'m Group K!');
            if(!title.innerHTML.match(/Group/)){
            }
        });
        node.on.data('Group G!', function(msg) {
            node.game.group="G";
            node.set({role:"G"});
            if(!title.innerHTML.match(/Group/)){
                title.innerHTML=title.innerHTML+": You are Group G";
            }
            console.log('I\'m Group G! ');
        });*/
/*        if(node.game.group){
            title.innerHTML=title.innerHTML+": You are Group " + node.game.group;
        }*/
        var b = W.getElementById('read');

        b.onclick = function() {
            /*var num1 = parseInt($(W.getElementById('num1')).text());
            var num2 = parseInt($(W.getElementById('num2')).text());*/
            W.getElementById('container').style.display = 'none';
            var resultint = W.getElementById('result').value;
            var result = JSUS.isInt(resultint,0,200);
            var success = (resultint == num1+num2);
            
            W.getElementById('result').value = "";
            num1 = Math.floor(Math.random()*(99-10)+10);
            num2 = Math.floor(Math.random()*(99-10)+10);

            W.getElementById('num1').innerHTML = num1;
            W.getElementById('num2').innerHTML = num2;
            
            if(result === false){
                console.log("validación Modal error");
            }
            else{
                if(success){
                    W.getElementById('alertSucces').style.display = 'block';
                    W.getElementById('alertDanger').style.display = 'none';
                    node.game.correct++;
                    node.say('correct', 'SERVER', node.game.correct);

                }
                else{
                    W.getElementById('alertDanger').style.display = 'block';
                    W.getElementById('alertSucces').style.display = 'none';
                }
                W.getElementById('numCorrect').innerHTML = node.game.correct;
                //node.done();

            }
            setTimeout(function() {
                W.getElementById('container').style.display = 'block';
            }, 100);
            
        };

    });
}

function taxReturn(){
    W.loadFrame('taxReturn.html',function() {

        node.game.lastResult=null;
        node.game.earnings=0;
        node.game.declareTax=0;

        node.on.data("stage_info", function(msg) {
            node.game.displayRoundInfo(msg.data.round_info);      
            node.game.module = msg.data.module;
            node.game.group = msg.data.group;
            if(msg.data.correct) node.game.correct = msg.data.correct;
            W.getElementById("numberCorrect").innerHTML=node.game.correct;
            if(node.game.group=="K"){
                node.game.earnings = node.game.settings.SALARY_K * node.game.correct;
            } else {
                node.game.earnings = node.game.settings.SALARY_G * node.game.correct;
            }
            W.getElementById("totalEarnings").innerHTML=node.game.earnings+" ECUs.";
            //this is the declaration for non-renspondents;
            node.say("declare", "SERVER", {
                   prelimGain: node.game.earnings,
                    declaredEarnings: 0
            });
        });

        
        //W.getElementById("taxreturn").setAttribute('max',earnings)
        var b = W.getElementById('read');
        b.onclick = function() {
            var value= W.getElementById('declareTaxReturn').value;

            value = JSUS.isInt(value, 0, node.game.earnings);


            node.game.declareTax=value;
            if ( value===false ) {
                W.getElementById("maxEarnings").innerHTML=node.game.earnings+" ECUs.";
                var modal = W.getElementById("ERROR");
                $(modal).modal();
                $('.modal-backdrop').remove();


            }
            else {
                node.say("declare", "SERVER", {
                   prelimGain: node.game.earnings,
                    declaredEarnings: node.game.declareTax
                });
                node.done();
            }
        };
    });
}

function result(){
    W.loadFrame('result.html',function(){

        var finalEarnings=0;
        var roundData = {};

        node.on.data("stage_info", function(msg) {
            //console.log("I got this: %o",msg.data);
            node.game.displayRoundInfo(msg.data.round_info);
            node.game.module = msg.data.module;  
            roundData = msg.data;
            finalEarnings = roundData.prelimGain - roundData.deduction;
            W.getElementById("totalEarnings").innerHTML= (finalEarnings + roundData.incomeFromPooled).toFixed(1) + "ECUs.";
            W.getElementById("redistribution").innerHTML= roundData.incomeFromPooled.toFixed(1) +"ECUs.";
        
            W.getElementById("numberCorrect").innerHTML= roundData.correct;
            W.getElementById("preEarnings").innerHTML= roundData.prelimGain + " ECUs.";
            W.getElementById("declareEarnings").innerHTML= roundData.declaredEarnings + " ECUs.";
            if(node.player.lang.shortName == 'es'){
                if(roundData.audited) W.getElementById("revision").innerHTML="Tú declaración fue revisada";
                else  W.getElementById("revision").innerHTML="Tú declaración no fue revisada";
            } else {
                if(roundData.audited) W.getElementById("revision").innerHTML="You are audited";
                else  W.getElementById("revision").innerHTML="You are not audited";        
            }
            W.getElementById("taxPaid").innerHTML=roundData.deduction.toFixed(1) + " ECUs.";
            W.getElementById("finalEarnings").innerHTML=finalEarnings.toFixed(1) + " ECUs.";
        });
        var b = W.getElementById('read');
        b.onclick = function() {
            if(node.game<0) node.done();
            else node.done({
                    module:'Module'+node.game.module,
                    round: roundData.round,
                    preEarnings: roundData.prelimGain,
                    totalEarnings:(finalEarnings + roundData.incomeFromPooled),
                    correct:roundData.correct,
                    declareEarnings:roundData.declaredEarnings,
                    statusDeclare:roundData.audited,
                    taxPaid:roundData.deduction,
                    finalEarnings:finalEarnings

                });
            node.game.round++;
            node.game.correct=0;


        };

    });

}
function instructionsModule4(){
    W.loadFrame('instructionsModule4.html', function() {

        var b = W.getElementById('read');
        b.onclick = function() {
            node.game.module++;
            node.done();
        };

        ////////////////////////////////////////////////
        // nodeGame hint:
        //
        // node.env executes a function conditionally to
        // the environments defined in the configuration
        // options.
        //
        // If the 'auto' environment was set to TRUE,
        // then the function will be executed
        //
        ////////////////////////////////////////////////
        node.env('auto', function() {

            //////////////////////////////////////////////
            // nodeGame hint:
            //
            // Execute a function randomly in a time interval
            // from 0 to 2000 milliseconds
            //
            //////////////////////////////////////////////
            node.timer.randomExec(function() {
                node.done();
            }, 2000);
        });
    });
    console.log('instructionsModule4');
}

function questionary1(){
    W.loadFrame('questionary1.html',function(){
        var i=1;
        var percent=10;

        for (;i<20;i=i+2){
            W.getElementById("percentA"+i).innerHTML=" "+percent;
            W.getElementById("percentA"+(i+1)).innerHTML=" "+(100-percent);
            W.getElementById("percentB"+i).innerHTML=" "+percent;
            W.getElementById("percentB"+(i+1)).innerHTML=" "+(100-percent);
            percent=percent+10;

        }
        var b=W.getElementById('read');
        b.onclick=function(){
            var arrayAnswers=[];
            for(var i=1;i<=10;i++){
                var a,b;

                a=W.getElementById('answerA'+i).checked;
                b=W.getElementById('answerB'+i).checked;
                if(a) arrayAnswers.push('A');
                else if(b) arrayAnswers.push('B');

            }
            if(arrayAnswers.length<10){
                console.log("validar");
                var modal = W.getElementById("ERROR");
                $(modal).modal();
                $('.modal-backdrop').remove();
                //console.log(arrayAnswers);
            }else{
                node.done({
                    module:'Module4',
                    arrayAnswers:arrayAnswers
                });
                node.game.answersModule4=arrayAnswers;
                //console.log(arrayAnswers);
            }

        }
    });
}

function calcResult(){ //not used now.
    W.loadFrame('dataPlayer.html',function(){
        node.on.data("AllResults", function(msg){
            node.game.moduleOutcomes = msg.data;
            node.done();
        });
    });
}

function dataPlayer(){
    W.loadFrame('dataPlayer.html',function(){
        var b = W.getElementById('read');
        var gender, politics, trust, age;
        gender = politics = trust = age = null;
        var valid = false;
        
        node.on.data("AllResults", function(msg){
            //console.log("%o", msg.data);
            node.game.moduleOutcomes = msg.data;
        });
        node.on.data("WIN", function(msg){
            //console.log("%o", msg.data);
            node.game.endgame = msg.data;
        });

        b.onclick = function() {

            if(W.getElementById("genderF").checked) gender="F";
            else if(W.getElementById("genderM").checked) gender="M";
            for(var i=0; i<=10;i++){
                if(W.getElementById("politics"+i).checked){
                    politics=i;
                    break;
                }
            }

            if(W.getElementById("confA").checked) trust="A";
            else if(W.getElementById("confB").checked) trust="B";

            var value= W.getElementById('age').value;

            value = JSUS.isInt(value, 17, 150);

            age=value;
            //console.log("edad:"+age+ ", genero: "+gender+", politica: "+politics+", respuesta : "+trust);
            //console.log("age: %s, gender: %s, politics: %s, trust: %s", !age, !gender,
              //          politics !== null, !trust);
            //console.log((!age | !gender | !(politics !== null) | !trust));
            if(!(!age | !gender | (politics === null) | !trust)) valid = true;
            if(!valid){
                console.log("validar");
                var modal = W.getElementById("ERROR");
                $(modal).modal();
                $('.modal-backdrop').remove();
                //console.log(arrayAnswers);
            } else {
                var dataResult = {};

                dataResult={
                    module:"dataResult",
                    age:age,
                    gender:gender,
                    politics:politics,
                    trust:trust

                };
                //node.game.dataPlayerValues.push(dataResult);
                node.done(dataResult);
            }
        };

    });

}

function questionary2(){
    W.loadFrame('questionary2.html',function() {
        var b = W.getElementById('read');
        b.onclick = function () {
            var arrayAnswers = [];
            for (var i = 1; i <= 10; i++) {
                for (var j = 1; j <= 4; j++) {
                    if (W.getElementById('answer' + j + "-" + i).checked) {
                        arrayAnswers.push(j);
                        break;
                    }
                }
            }

            if (arrayAnswers.length < 10) {
                console.log("validar");
                var modal = W.getElementById("ERROR");
                $(modal).modal();
                $('.modal-backdrop').remove();
                //console.log(arrayAnswers);
//                console.log(arrayAnswers);
//                node.done();
            } else {
                var dataResult = {};
                dataResult={
                    module:"questionary2",
                    arrayAnsers:arrayAnswers

                };
                //node.game.dataPlayerValues.push(dataResult);
                node.done(dataResult);
                //node.game.answersModule4 = arrayAnswers;
                //console.log(arrayAnswers);

            }
        }
    });
}
function questionary3(){
    var socio, flag=true;
    W.loadFrame('questionary3.html',function(){
        var b= W.getElementById('read')
        b.onclick= function(){
            for(var i=1;i<=18;i++){
                if(W.getElementById('answer'+i).checked){
                    socio=i;
                    flag=false;
                    break;
                }
            }

            if(flag){
                console.log('validar');
                var modal = W.getElementById("ERROR");
                $(modal).modal();
                $('.modal-backdrop').remove();
                //console.log(arrayAnswers);
            }else{
                var dataResult = {};
                dataResult={
                    module:"questionary3",
                    arrayAnsers:socio

                };
                //node.game.dataPlayerValues.push(dataResult);
                node.done(dataResult);
                node.done({
                    module:'INFO_USER',
                    dataPlayerValues:node.game.dataPlayerValues
                })
            }
        }

    });

}

function resultModule1(){
    W.loadFrame('resultModule1.html',function(){
        var dataResult = {};
        dataResult.value = 0;
        //node.say('RequestResult1', 'SERVER');
        //node.on.data('Result',function(msg){
        this.requestResult();
        
        // console.log("%o", node.game.moduleOutcomes);
        if(node.game.hasOwnProperty('moduleOutcomes') &&  
           node.game.moduleOutcomes.hasOwnProperty('Module1')){
            var msg = {};    
            msg.data = node.game.moduleOutcomes['Module1'];
        
            if(msg.data.role=='A'){
                W.getElementById('groupLetter').innerHTML =
                    W.getElementById('groupLetter').innerHTML+msg.data.role+".";
                var pretext = (node.player.lang.shortName === "es")?
                    " envío a otros participantes ":
                    " sent to the other participant ";
                W.getElementById('groupText').innerHTML =
                    W.getElementById('groupText').innerHTML + 
                    pretext + (1000-msg.data.value)+" ECUs.";
                W.getElementById('earnings').innerHTML=
                    W.getElementById('earnings').innerHTML+msg.data.value+" ECUs.";
            } else {
                W.getElementById('groupLetter').innerHTML =
                    W.getElementById('groupLetter').innerHTML+msg.data.role+".";
                var pretext = (node.player.lang.shortName === "es")?
                    " recibío de otros participantes ":
                    " received from the other participant ";
                W.getElementById('groupText').innerHTML =
                    W.getElementById('groupText').innerHTML + 
                    pretext + msg.data.value+" ECUs.";
                W.getElementById('earnings').innerHTML =
                    W.getElementById('earnings').innerHTML+msg.data.value+" ECUs.";

            }
            dataResult = {
                value: msg.data.value,
                role: msg.data.role,
                other: msg.data.other,
                module:'resultModule1'
            };
        }
        //});
        var b = W.getElementById('read');
            b.onclick = function() {
            node.game.totalECUs = node.game.totalECUs + Number(dataResult.value);
            node.done(dataResult);

        };

    });

}
function resultModule2(){
    W.loadFrame('resultModule2.html',function(){
        var dataResult = {};
        dataResult.finalEarnings = 0;
        this.requestResult();
        if(node.game.hasOwnProperty('moduleOutcomes') &&  
           node.game.moduleOutcomes.hasOwnProperty('Module2')){
            var msg = {};
            msg.data = node.game.moduleOutcomes['Module2'];
            W.getElementById("round").innerHTML=msg.data.round;
            W.getElementById("totalEarnings").innerHTML=msg.data.roundIncome.toFixed(1) + "ECUs.";
            W.getElementById("numberCorrect").innerHTML=msg.data.correct;
            W.getElementById("preEarnings").innerHTML=msg.data.prelimGain+" ECUs.";
            W.getElementById("declareEarnings").innerHTML=msg.data.declaredEarnings+" ECUs.";
            if(node.player.lang.shortName === "es"){
                if(msg.data.audited)
                    W.getElementById("revision").innerHTML="Tú declaración fue revisada";
                else
                    W.getElementById("revision").innerHTML="Tú declaración no fue revisada";
            } else {
                if(msg.data.audited) 
                    W.getElementById("revision").innerHTML="You are audited";
                else  
                    W.getElementById("revision").innerHTML="You are not audited"; 
            }
            W.getElementById("taxPaid").innerHTML=msg.data.deduction.toFixed(1)+" ECUs.";
            W.getElementById("finalEarnings").innerHTML=(msg.data.prelimGain - msg.data.deduction).toFixed(1)+" ECUs.";
            dataResult= msg.data;
            
            dataResult.module = 'resultModule2';
        }
        var b = W.getElementById('read');
        b.onclick = function() {
            node.game.totalECUs = node.game.totalECUs + Number(dataResult.finalEarnings);
            node.done(dataResult);
        };
    });
}

function resultModule3(){
    W.loadFrame('resultModule3.html',function(){
        var dataResult = {};
        dataResult.finalEarnings;
        this.requestResult();
        if(node.game.hasOwnProperty('moduleOutcomes') &&  
           node.game.moduleOutcomes.hasOwnProperty('Module3')){
                    var msg = {};
            msg.data = node.game.moduleOutcomes['Module3'];
            W.getElementById("round").innerHTML=msg.data.round;
            W.getElementById("totalEarnings").innerHTML=msg.data.roundIncome.toFixed(1) + "ECUs.";
            W.getElementById("numberCorrect").innerHTML=msg.data.correct;
            W.getElementById("preEarnings").innerHTML=msg.data.prelimGain+" ECUs.";
            W.getElementById("declareEarnings").innerHTML=msg.data.declaredEarnings+" ECUs.";
            if(node.player.lang.shortName === "es"){
                if(msg.data.audited)
                    W.getElementById("revision").innerHTML="Tú declaración fue revisada";
                else
                    W.getElementById("revision").innerHTML="Tú declaración no fue revisada";
            } else {
                if(msg.data.audited) 
                    W.getElementById("revision").innerHTML="You are audited";
                else  
                    W.getElementById("revision").innerHTML="You are not audited"; 
            }
            W.getElementById("taxPaid").innerHTML=msg.data.deduction.toFixed(1)+" ECUs.";
            W.getElementById("finalEarnings").innerHTML=(msg.data.prelimGain - msg.data.deduction).toFixed(1)+" ECUs.";
            dataResult= msg.data;
            
            dataResult.module = 'resultModule3';
        }
        
        var b = W.getElementById('read');
        b.onclick = function() {
            node.game.totalECUs = node.game.totalECUs + Number(dataResult.finalEarnings);
            node.done(dataResult);
            
        };

    });
}

function resultModule4(){
    W.loadFrame('resultModule4.html',function(){
        var dataResult = {};
        dataResult.value = 0;
        this.requestResult();
        if(node.game.hasOwnProperty('moduleOutcomes') &&  
           node.game.moduleOutcomes.hasOwnProperty('Module4')){
                    var msg = {};
            msg.data = node.game.moduleOutcomes['Module4'];            W.getElementById("choise").innerHTML=  W.getElementById("choise").innerHTML+msg.data.choise+'.';
            W.getElementById("selection").innerHTML=W.getElementById("selection").innerHTML+msg.data.select+'.';
            W.getElementById("earnings").innerHTML=W.getElementById("earnings").innerHTML+msg.data.value+'';
            dataResult={
                module:'resultModule4',
                choise:msg.data.choise,
                select:msg.data.select,
                value:msg.data.value,
            };
        }
        
        var b = W.getElementById('read');
        b.onclick = function() {
            node.game.totalECUs = node.game.totalECUs + parseFloat(dataResult.value)*node.game.settings.CANTIDAD_ESU_x_PCH;
            dataResult.totalECUs = node.game.totalECUs;
            node.done(dataResult);
        };


    });
}


function endgame() {
    W.loadFrame('ended.html', function() {

        node.game.timer.switchActiveBoxTo(node.game.timer.mainBox);
        node.game.timer.waitBox.hideBox();
        node.game.timer.setToZero();        
        
        if(node.game.hasOwnProperty('endgame')) {
        //node.on.data('WIN', function(msg) {
            var win, exitcode, codeErr;
            var root, data;
            root = W.getElementById('container');
            codeErr = 'ERROR (code not found)';
            data = node.game.endgame;
            
            win = data && data.win || 0;
            exitcode = data && data.exitcode || codeErr;
            W.getElementById("win").innerHTML = 'Your bonus in this game is: $' + win.toFixed(2);
            W.getElementById("exitcode").innerHTML = 'Your exitcode is: ' + exitcode;
        //});
        }
        var b = W.getElementById('read');
        b.onclick = function() {
            node.done();
        };
    });
    console.log('Game ended');
}

function quiz() {
    var that = this;
    W.loadFrame('quiz.html', function() {

        var b, QUIZ;
        node.env('auto', function() {
            node.timer.randomExec(function() {
                node.game.timer.doTimeUp();
            });
        });
    });
    console.log('Quiz');
}


function postgame() {
    node.game.rounds.setDisplayMode(['COUNT_UP_STAGES_TO_TOTAL']);

    W.loadFrame('postgame.html', function() {

        node.env('auto', function() {
            node.timer.randomExec(function() {
                node.game.timer.doTimeUp();
            });
        });
    });
    console.log('Postgame');
}


function clearFrame() {
    node.emit('INPUT_DISABLE');
    return true;
}

function notEnoughPlayers() {
    console.log('Not enough players');
    node.game.pause();
    W.lockScreen('One player disconnected. We are now waiting to see if ' +
                 'he or she reconnects. If not the game will be terminated.');
}