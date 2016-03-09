/**
 * # Game stages definition file
 * Copyright(c) 2015 J.Orellana <jose.orellanan@usach.cl>
 * Akitaka Matsuo <matsuoakitaka@gmail.com>
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
    
    stager.next('instructions');
    //stager.skip('instructions');
    stager.next('instructionsModule1');
    //stager.skip('instructionsModule1');
    stager.next('module1');
    //stager.skip('module1');
//MODULE 2
    stager.next('instructionsModule2');
    

    // First practice stage.
    
    stager.stage("Module2Practice");
    stager.step('game2');
    stager.step('taxReturn2');
    stager.step('result2');
    
    stager.repeatStage("Module2", settings.REPEAT);
    stager.step('game2');
    stager.step('taxReturn2');
    stager.step('result2');
    
/*    //Module 3
    stager.next('instructionsModule3');

    stager.repeatStage("Module3", settings.REPEAT);
    stager.step('game2');
    stager.step('taxReturn2');
    stager.step('result2');*/
    // Continue experiment.
    {
    //MODULE 4
    stager.stage('modulo4Stage');
    stager.step('instructionsModule4');
    stager.step('questionary1');

    //MODULE 5
    stager.stage('module5Stage');
    //stager.step('calcResult');
    stager.step('dataPlayer');
    stager.step('questionary2');
    stager.step('questionary3');


    //RESULT

    stager.stage('resultStage');
    stager.step('resultModule1');
    stager.step('resultModule2');
    //stager.step('resultModule3');
    stager.step('resultModule4');
    }
    //stager.step('end');
    stager.next("endgame");
    stager.gameover();
    return stager.getState();
    
};