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

        .next('selectLanguage')
        .next('instructions')
//MODULE 1
        .next('instructionsModule1')
        .next('module1')
//MODULE 2
        .next('instructionsModule2');
        //stager.stepBlock(0)

    // First practice stage.

    stager.doLoop('game2', checkLoop);
    stager.next('taxReturn2');
    stager.next('result2')
    stager.next('instructionsModule3');

    // Add as many repetitions as needed.

    var i, j, len;
    len = settings.REPEAT; // Change as needed.

    j=0;
    var bandera =true;
    for(;++j<2;){
        i = -1;
        for ( ; ++i < len ; ) {
            console.log("VOY EN: "+i+" , "+j);
            stager.loop('game2 AS game2' + i+' '+ j, checkLoop);
            stager.next('taxReturn2 AS taxReturn2' + i +' '+ j);
            stager.next('result2 AS result2'+i+' '+ j);

    //      Need to skip all of them manually if not commented.

            if((i==len-1)&&(j==0))
            //MODULE 3
                stager.next('instructionsModule3 AS instructionsModule3_' + i);
    //      stager.next('instructionsModule4 AS instructionsModule4_' + i);
        }

    }


    // Continue experiment.
    //MODULE 4

    stager.next('instructionsModule4');
    stager.next('module4');




    // Modify the stager to skip one stage.
    stager.skip('instructions');
    //stager.skip('results');
    stager.skip('instructionsModule1');
    stager.skip('instructionsModule2');
    //stager.skip('module4');
    //stager.skip('instructionsModule3');
   // stager.skip('instructionsModule4');
    stager.skip('module1')
    stager.skip('selectLanguage');

    return stager.getState();
};