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

    //module2:module2,

    //quiz: quiz,
    //ultimatum: ultimatum,
    //postgame: postgame,
    //endgame: endgame,
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
    node.game.module=2;

    // Setup the header (by default on the left side).
    if (!W.getHeader()) {
        header = W.generateHeader();

        // Uncomment to visualize the name of the stages.
        //node.game.visualStage = node.widgets.append('VisualStage', header);

        node.game.rounds = node.widgets.append('VisualRound', header, {
            displayModeNames: ['COUNT_UP_STAGES_TO_TOTAL'],
            stageOffset: 1
        });

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

        var b = W.getElementById('read');
        b.onclick = function() {
            var value= W.getElementById('Send').value;
            value = JSUS.isInt(value, 0, node.game.settings.CANTIDAD);

            if ( value===false ) {

                var modal = W.getElementById("ERROR");
                $(modal).modal();
                $('.modal-backdrop').remove();
            } 
            else {

                node.done();
            }
        };
    });
}
function instructionsModule2(){
    W.loadFrame('instructionsModule2.html', function() {

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
    console.log('instructionsModule2');
}
function instructionsModule3(){
    W.loadFrame('instructionsModule3.html', function() {

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
    console.log('instructionsModule3');
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

function game() {
    
    W.loadFrame('game.html', function () {
        //node.game.lastResult="succes";
        var round;
        var title=W.getElementById('titleGame');
        title.innerHTML=title.innerHTML+node.game.module;
        round = node.player.stage.round;
        if (round === 1) {
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
        }
        node.on.data('Group K!', function(msg) {
            node.game.group="K";
            node.set({role:"K"})
            console.log('I\'m Group K!');
        });
        node.on.data('Group G!', function(msg) {
            node.game.group="G";
            node.set({role:"G"})
            console.log('I\'m Group G! ');
        });

        var b = W.getElementById('read');

        b.onclick = function() {
            var num1 = parseInt($(W.getElementById('num1')).text());
            var num2 = parseInt($(W.getElementById('num2')).text());
            var resultint = W.getElementById('result').value;
            var result = JSUS.isInt(resultint,0,200);
            if(result === false){
                console.log("validación Modal error");
            }
            else{
                 if(resultint == num1+num2){
                     node.game.lastResult="succes";
                     node.game.correct++;

                 }
                 else{
                     node.game.lastResult="danger";
                }
                node.done();

            }
            console.log("los numeros son " + num1 + " y " + num2);

            console.log("module2");
        };

    });
}

function taxReturn(){
    W.loadFrame('taxReturn.html',function() {
        
        W.getElementById("numberCorrect").innerHTML=node.game.correct;
        node.game.lastResult=null;
        node.game.earnings=0;
        node.game.declareTax=0;

        if(node.game.group=="K"){

            node.game.earnings= node.game.settings.SALARY_K*node.game.correct;


        }else{
            node.game.earnings= node.game.settings.SALARY_G*node.game.correct;
        }
        W.getElementById("totalEarnings").innerHTML=node.game.earnings+" ECUs.";
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

                node.done();
            }
        };
    });
}
function result(){
    W.loadFrame('result.html',function(){

        var finalEarnings=0;
        var taxPaid=0;
        var diceValue= Math.random();
        var value=0;
        var estado=false;
        var probability=0;
        var tax=0;
        if(node.game.module==2){
            tax=node.game.settings.TAX_MODULE_2;
            probability=node.game.settings.PROBABILITY_MODULE_2;
        }else{
            tax=node.game.settings.TAX_MODULE_3;
            probability=node.game.settings.PROBABILITY_MODULE_3;
        }
        if(diceValue<probability){


            if(node.game.earnings!=node.game.declareTax){
                taxPaid=tax*node.game.earnings;
                finalEarnings=node.game.earnings-(tax+0.5)*node.game.earnings;
            }else{
                taxPaid=tax*node.game.earnings;
                finalEarnings=node.game.earnings-taxPaid;
            }

        }else{

            taxPaid=node.game.declareTax*tax;
            finalEarnings=node.game.earnings-taxPaid;
        }
        node.say('DECLARE','SERVER',taxPaid);
        node.on.data('PART',function(msg){
                value=msg.data;
                W.getElementById("totalEarnings").innerHTML=finalEarnings+value;
            });
        W.getElementById("numberCorrect").innerHTML=node.game.correct;
        W.getElementById("preEarnings").innerHTML=node.game.earnings+" ECUs.";
        W.getElementById("declareEarnings").innerHTML=node.game.declareTax+" ECUs.";
        if(estado) W.getElementById("revision").innerHTML="Tú declaración fue revisada";
        else  W.getElementById("revision").innerHTML="Tú declaración no fue revisada";
        W.getElementById("taxPaid").innerHTML=taxPaid+" ECUs.";
        W.getElementById("finalEarnings").innerHTML=finalEarnings+" ECUs.";




        var b = W.getElementById('read');
        b.onclick = function() {


                node.done();

        };

    });
    node.game.correct=0;
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

function ultimatum() {

    //////////////////////////////////////////////
    // nodeGame hint:
    //
    // var that = this;
    //
    // /this/ is usually a reference to node.game
    //
    // However, unlike in many progamming languages,
    // in javascript the object /this/ assumes
    // different values depending on the scope
    // of the function where it is called.
    //
    /////////////////////////////////////////////
    var that = this;

    var root, b, options, other;

    node.game.rounds.setDisplayMode(['COUNT_UP_STAGES_TO_TOTAL',
                                     'COUNT_UP_ROUNDS_TO_TOTAL']);


    // Hack to avoid double offers. Todo: fix.
    node.game.offerDone = false;

    // Load the BIDDER interface.
    node.on.data('BIDDER', function(msg) {
        console.log('RECEIVED BIDDER!');
        other = msg.data.other;
        node.set({role: 'BIDDER'});

        //////////////////////////////////////////////
        // nodeGame hint:
        //
        // W.loadFrame takes an optional third 'options' argument which
        // can be used to request caching of the displayed frames (see
        // the end of the following function call). The caching mode
        // can be set with two fields: 'loadMode' and 'storeMode'.
        //
        // 'loadMode' specifies whether the frame should be reloaded
        // regardless of caching (loadMode = 'reload') or whether the
        // frame should be looked up in the cache (loadMode = 'cache',
        // default).  If the frame is not in the cache, it is always
        // loaded from the server.
        //
        // 'storeMode' says when, if at all, to store the loaded frame.
        // By default the cache isn't updated (storeMode = 'off'). The
        // other options are to cache the frame right after it has been
        // loaded (storeMode = 'onLoad') and to cache it when it is
        // closed, that is, when the frame is replaced by other
        // contents (storeMode = 'onClose'). This last mode preserves
        // all the changes done while the frame was open.
        //
        /////////////////////////////////////////////
        W.loadFrame('bidder.html', function() {
            // Start the timer after an offer was received.
            options = {
                milliseconds: 30000,
                timeup: function() {
                    node.emit('BID_DONE',
                              Math.floor(Math.random() * 101), other, true);
                }
            };

            node.game.timer.startTiming(options);

            b = W.getElementById('submitOffer');

            node.env('auto', function() {

                //////////////////////////////////////////////
                // nodeGame hint:
                //
                // Execute a function randomly
                // in a time interval between 0 and 1 second
                //
                //////////////////////////////////////////////
                node.timer.randomExec(function() {
                    node.emit('BID_DONE',
                              Math.floor(Math.random() * 101), other);
                }, 4000);
            });

            b.onclick = function() {
                var offer = W.getElementById('offer');
                if (!that.isValidBid(offer.value)) {
                    W.writeln('Please enter a number between 0 and 100');
                    return;
                }
                node.emit('BID_DONE', parseInt(offer.value, 10), other);
            };

            root = W.getElementById('container');

            node.on.data('ACCEPT', function(msg) {
                W.write(' Your offer was accepted.', root);
                node.timer.randomExec(function() {
                    node.done();
                }, 3000);
            });

            node.on.data('REJECT', function(msg) {
                W.write(' Your offer was rejected.', root);
                node.timer.randomExec(function() {
                    node.done();
                }, 3000);
            });

            node.timer.setTimestamp('bidder_loaded');

        }, { cache: { loadMode: 'cache', storeMode: 'onLoad' } });
    });

    // Load the respondent interface.
    node.on.data('RESPONDENT', function(msg) {
        console.log('RECEIVED RESPONDENT!');
        other = msg.data.other;
        node.set({role: 'RESPONDENT'});

        W.loadFrame('resp.html', function() {
            options = {
                milliseconds: 30000
            };

            node.game.timer.startWaiting(options);
            node.game.timer.mainBox.hideBox();

            //////////////////////////////////////////////
            // nodeGame hint:
            //
            // nodeGame offers several types of event
            // listeners. They are all resemble the syntax
            //
            // node.on.<target>
            //
            // For example: node.on.data(), node.on.plist().
            //
            // The low level event listener is simply
            //
            // node.on
            //
            // For example, node.on('in.say.DATA', cb) can
            // listen to all incoming DATA messages.
            //
            /////////////////////////////////////////////
            node.on.data('OFFER', function(msg) {
                var theofferSpan, offered, accept, reject;

                options = {
                    timeup: function() {
                        that.randomAccept(msg.data, other);
                    }
                };
                node.game.timer.startTiming(options);


                offered = W.getElementById('offered');
                theofferSpan = W.getElementById('theoffer');
                theofferSpan.innerHTML = msg.data;
                offered.style.display = '';

                accept = W.getElementById('accept');
                reject = W.getElementById('reject');

                node.env('auto', function() {
                    node.timer.randomExec(function() {
                        that.randomAccept(msg.data, other);
                    }, 3000);
                });

                accept.onclick = function() {
                    node.emit('RESPONSE_DONE', 'ACCEPT', msg.data, other);
                };

                reject.onclick = function() {
                    node.emit('RESPONSE_DONE', 'REJECT', msg.data, other);
                };

                node.timer.setTimestamp('offer_received');
            });

        }, { cache: { loadMode: 'cache', storeMode: 'onLoad' } });

    });

    console.log('Ultimatum');
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

function endgame() {
    W.loadFrame('ended.html', function() {

        node.game.timer.switchActiveBoxTo(node.game.timer.mainBox);
        node.game.timer.waitBox.hideBox();
        node.game.timer.setToZero();
        node.on.data('WIN', function(msg) {
            var win, exitcode, codeErr;
            var root;
            root = W.getElementById('container');
            codeErr = 'ERROR (code not found)';
            win = msg.data && msg.data.win || 0;
            exitcode = msg.data && msg.data.exitcode || codeErr;
            W.writeln('Your bonus in this game is: ' + win, root);
            W.writeln('Your exitcode is: ' + exitcode, root);
        });
    });

    console.log('Game ended');
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
