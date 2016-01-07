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


    stager
    //.next('precache')
        /*.loop('looped', function() {
            return !this.loopFinished;
        })
        .step('loo1')
        .step('loo2')*/
        .next('selectLanguage')
        .next('instructions')
        .next('instructionsModule1')
        .next('module1')
        .next('instructionsModule2')
        //stager.stepBlock(0)
        .loop('game', function() {
                return !this.loopFinished;
        })
        .next('taxReturn')
        .next('instructionsModule3')
        .next('instructionsModule4')

    /*stager.skip('looped');
    stager.skip('loo1');
    stager.skip('loo2');*/
        //.repeat('module2', settings.REPEAT)
    //.next('end')
    //.gameover();

    // Modify the stager to skip one stage.
    stager.skip('instructions');
    stager.skip('instructionsModule1');
    stager.skip('instructionsModule3');
    stager.skip('instructionsModule4');
    stager.skip('module1')
    stager.skip('instructions');
    stager.skip('selectLanguage');

    return stager.getState();
};