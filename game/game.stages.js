/**
 * # Game stages definition file
 * Copyright(c) 2015 J.Orellana,M.Lopez <jose.orellanan@usach.cl>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

    function checkLoop() {
        return !this.loopFinished;
    }


    stager.next('selectLanguage');
    stager.skip('selectLanguage');
    
    stager
        .next('instructions')

//MODULE 1
        .next('instructionsModule1')
        .next('module1')
//MODULE 2
        .next('instructionsModule2');

    // First practice stage.
    
    stager.stage("Module2Practice");
    stager.step('game2');
    stager.step('taxReturn2');
    stager.step('result2');
    
    stager.repeatStage("Module2", settings.REPEAT);
    stager.step('game2');
    stager.step('taxReturn2');
    stager.step('result2');
    
    //Module 3
    stager.next('instructionsModule3');

    stager.repeatStage("Module3", settings.REPEAT);
    stager.step('game2');
    stager.step('taxReturn2');
    stager.step('result2');
//    stager.next('instructionsModule3');
//    stager.skip('instructionsModule3');

    // Add as many repetitions as needed.

/*    var i, j, len;
    len = settings.REPEAT; // Change as needed.
    //len=-1;

    //console.log(len);

/*	for( j = 0; ++j <= 2 ; ) {
        for ( i = 0; ++i <= len ; ) {
        	if(i === 1 & j === 2) {
        		stager.next('instructionsModule3');
        	}
            //console.log("VOY EN: "+i+" , "+j);
            //console.log("%s - %s", j, i);
            stager.doLoop('game2 AS game2' + i + ' ' + j, checkLoop);
            //stager.skip('game2 AS game2' + i + ' ' + j);
            stager.next('taxReturn2 AS taxReturn2' + i + ' ' + j);
            //stager.skip('taxReturn2 AS taxReturn2' + i + ' ' + j);
            stager.next('result2 AS result2' + i + ' ' + j);
        }
    }*/

    // Continue experiment.
    {
    //MODULE 4
    stager.stage('modulo4Stage');
    stager.step('instructionsModule4');
    stager.step('questionary1');

    //MODULE 5
    stager.stage('module5Stage');
    stager.step('dataPlayer');
    stager.step('questionary2');
    stager.step('questionary3');


    //RESULT

    stager.stage('resultStage');
    stager.step('resultModule1');
    stager.step('resultModule2');
    stager.step('resultModule3');
    stager.step('resultModule4');
    }
    //stager.step('end');
    stager.next("endgame");
    stager.gameover();
    return stager.getState();
    
};