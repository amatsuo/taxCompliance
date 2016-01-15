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
        .next('instructionsModule2');
        //stager.stepBlock(0)

    // First practice stage.

    stager.doLoop('game', checkLoop);
    stager.next('taxReturn');
    stager.next('result')
        .next('instructionsModule3')
        .next('instructionsModule4');

    // Add as many repetitions as needed.

    var i, len;
    i = -1, len = settings.REPEAT; // Change as needed.
    for ( ; ++i < len ; ) {
        stager.loop('game AS game' + i, checkLoop);

        stager.next('taxReturn AS taxReturn' + i );
        stager.next('result AS result'+i)

//      Need to skip all of them manually if not commented.
//      stager.next('instructionsModule3 AS instructionsModule3_' + i);
//      stager.next('instructionsModule4 AS instructionsModule4_' + i);
    }


    // Continue experiment.



    /*stager.skip('looped');
    stager.skip('loo1');
    stager.skip('loo2');*/
        //.repeat('module2', settings.REPEAT)
    //.next('end')
    //.gameover();

    // Modify the stager to skip one stage.
    stager.skip('instructions');
    //stager.skip('results');
    stager.skip('instructionsModule1');
    stager.skip('instructionsModule2');
    stager.skip('instructionsModule3');
    stager.skip('instructionsModule4');
    stager.skip('module1')
    stager.skip('selectLanguage');

    return stager.getState();
};